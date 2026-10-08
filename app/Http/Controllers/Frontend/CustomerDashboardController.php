<?php

namespace App\Http\Controllers\Frontend;

use App\Http\Controllers\Controller;
use App\Models\CustomerMessage;
use App\Models\Order;
use App\Models\PcBuild;
use App\Models\PreOrder;
use App\Models\Product;
use App\Models\Wishlist;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class CustomerDashboardController extends Controller
{
    /**
     * Customer Account Dashboard with all tabs.
     */
    public function index(Request $request): Response
    {
        $user = $request->user();

        // 1. Order History
        $orders = Order::where('user_id', $user->id)
            ->orWhere(function ($q) use ($user) {
                if ($user->phone) {
                    $q->where('customer_phone', $user->phone);
                }
                if ($user->email) {
                    $q->orWhere('customer_email', $user->email);
                }
            })
            ->with(['items.product'])
            ->latest()
            ->get();

        // 2. Saved PC Builds
        $pcBuilds = PcBuild::where('user_id', $user->id)
            ->latest()
            ->get();

        // 3. Wishlist / Favorite Products
        $wishlists = Wishlist::where('user_id', $user->id)
            ->with('product.category')
            ->latest()
            ->get();

        // 4. Messages to Admin
        $messages = CustomerMessage::where('user_id', $user->id)
            ->latest()
            ->get();

        // 5. Pre-Orders
        $preOrders = PreOrder::where('user_id', $user->id)
            ->with('product')
            ->latest()
            ->get();

        // 6. Calculate Customer Stats & Loyalty
        $totalOrdersCount = $orders->count();
        $totalSpent = (float) $orders->where('order_status', '!=', 'cancelled')->sum('total');
        $pendingOrdersCount = $orders->whereIn('order_status', ['pending', 'processing'])->count();
        $deliveredOrdersCount = $orders->where('order_status', 'delivered')->count();
        $unreadRepliesCount = $messages->where('status', 'replied')->count();

        // Membership Tier
        if ($totalSpent >= 150000) {
            $membershipTier = 'Platinum Elite';
            $tierBadgeColor = 'from-purple-600 to-indigo-600';
        } elseif ($totalSpent >= 50000) {
            $membershipTier = 'Gold VIP';
            $tierBadgeColor = 'from-amber-500 to-yellow-600';
        } elseif ($totalSpent >= 15000) {
            $membershipTier = 'Silver Member';
            $tierBadgeColor = 'from-slate-400 to-slate-600';
        } else {
            $membershipTier = 'StarTech Member';
            $tierBadgeColor = 'from-orange-500 to-red-600';
        }

        $rewardPoints = (int) floor($totalSpent / 100);

        // Find active in-flight order with tracking if any
        $activeDeliveryOrder = $orders->first(function ($order) {
            return in_array($order->order_status, ['pending', 'processing']) || !empty($order->courier_tracking_id);
        });

        return Inertia::render('Dashboard', [
            'orders' => $orders,
            'pcBuilds' => $pcBuilds,
            'wishlists' => $wishlists,
            'messages' => $messages,
            'preOrders' => $preOrders,
            'userStats' => [
                'totalOrders' => $totalOrdersCount,
                'totalSpent' => $totalSpent,
                'pendingOrders' => $pendingOrdersCount,
                'deliveredOrders' => $deliveredOrdersCount,
                'pcBuildsCount' => $pcBuilds->count(),
                'wishlistCount' => $wishlists->count(),
                'preOrdersCount' => $preOrders->count(),
                'unreadRepliesCount' => $unreadRepliesCount,
                'membershipTier' => $membershipTier,
                'tierBadgeColor' => $tierBadgeColor,
                'rewardPoints' => $rewardPoints,
            ],
            'activeDeliveryOrder' => $activeDeliveryOrder,
            'activeTab' => $request->query('tab', 'orders'),
        ]);
    }

    /**
     * Save a PC Build into customer account history.
     */
    public function savePcBuild(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:100',
            'components' => 'required|array',
            'total_price' => 'required|numeric|min:0',
            'total_wattage' => 'nullable|integer',
        ]);

        $build = PcBuild::create([
            'user_id' => $request->user()->id,
            'name' => $validated['name'],
            'components' => $validated['components'],
            'total_price' => $validated['total_price'],
            'total_wattage' => $validated['total_wattage'] ?? 0,
        ]);

        return back()->with('success', "PC Build '{$build->name}' saved to your account!");
    }

    /**
     * Delete a saved PC build.
     */
    public function deletePcBuild(Request $request, PcBuild $pcBuild)
    {
        if ($pcBuild->user_id !== $request->user()->id) {
            abort(403);
        }

        $pcBuild->delete();
        return back()->with('success', 'Saved PC build removed.');
    }

    /**
     * Toggle product in customer wishlist / favorites.
     */
    public function toggleWishlist(Request $request)
    {
        $validated = $request->validate([
            'product_id' => 'required|exists:products,id',
        ]);

        $user = $request->user();
        $existing = Wishlist::where('user_id', $user->id)
            ->where('product_id', $validated['product_id'])
            ->first();

        if ($existing) {
            $existing->delete();
            return back()->with('success', 'Product removed from your favorites.');
        }

        Wishlist::create([
            'user_id' => $user->id,
            'product_id' => $validated['product_id'],
        ]);

        return back()->with('success', 'Product added to your favorites!');
    }

    /**
     * Send message / inquiry to admin.
     */
    public function storeMessage(Request $request)
    {
        $validated = $request->validate([
            'subject' => 'required|string|max:150',
            'message' => 'required|string|max:2000',
            'order_number' => 'nullable|string|max:50',
        ]);

        CustomerMessage::create([
            'user_id' => $request->user()->id,
            'subject' => $validated['subject'],
            'message' => $validated['message'],
            'order_number' => $validated['order_number'] ?? null,
            'status' => 'open',
        ]);

        return back()->with('success', 'Your message has been sent to StarTech Admin. We will reply shortly!');
    }

    /**
     * Submit a Pre-Order for an upcoming / out of stock product.
     */
    public function storePreOrder(Request $request)
    {
        $validated = $request->validate([
            'product_id' => 'required|exists:products,id',
            'quantity' => 'required|integer|min:1',
            'customer_name' => 'required|string|max:100',
            'customer_phone' => 'required|string|max:20',
            'customer_email' => 'nullable|email|max:100',
            'delivery_address' => 'required|string|max:500',
            'notes' => 'nullable|string|max:500',
        ]);

        $product = Product::findOrFail($validated['product_id']);
        $unitPrice = $product->special_price ?: $product->regular_price ?: 0;
        $preOrderNumber = 'PO-' . date('ymd') . '-' . rand(1000, 9999);

        PreOrder::create([
            'user_id' => $request->user()?->id,
            'product_id' => $product->id,
            'pre_order_number' => $preOrderNumber,
            'customer_name' => $validated['customer_name'],
            'customer_phone' => $validated['customer_phone'],
            'customer_email' => $validated['customer_email'] ?? $request->user()?->email,
            'delivery_address' => $validated['delivery_address'],
            'quantity' => $validated['quantity'],
            'unit_price' => $unitPrice,
            'advance_paid' => 0,
            'status' => 'pending',
            'notes' => $validated['notes'] ?? null,
        ]);

        return back()->with('success', "Pre-order #{$preOrderNumber} submitted for {$product->name}! Our sales team will confirm your order.");
    }
}
