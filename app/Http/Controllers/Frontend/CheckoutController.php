<?php

namespace App\Http\Controllers\Frontend;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Setting;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;

class CheckoutController extends Controller
{
    public function index(Request $request): Response
    {
        $cart = $request->session()->get('cart', []);
        if (empty($cart)) {
            return redirect()->route('cart.index')->with('error', 'Your cart is empty.');
        }

        $subtotal = array_sum(array_map(fn($item) => $item['price'] * $item['quantity'], $cart));
        $coupon = $request->session()->get('applied_coupon');
        $discount = 0;
        if ($coupon) {
            $discount = $coupon['type'] === 'fixed' ? $coupon['value'] : ($subtotal * $coupon['value']) / 100;
        }

        $shippingInside = (float) Setting::get('delivery_charge_inside', 60);
        $shippingOutside = (float) Setting::get('delivery_charge_outside', 120);

        $cartCount = array_sum(array_column($cart, 'quantity'));

        return Inertia::render('Frontend/Checkout', [
            'cartItems' => array_values($cart),
            'cart' => [
                'items' => array_values($cart),
                'count' => $cartCount,
                'total' => $subtotal,
            ],
            'subtotal' => $subtotal,
            'discount' => $discount,
            'coupon' => $coupon,
            'shippingInside' => $shippingInside,
            'shippingOutside' => $shippingOutside,
            'user' => $request->user(),
        ]);
    }

    public function store(Request $request)
    {
        $cart = $request->session()->get('cart', []);
        if (empty($cart)) {
            return redirect()->route('cart.index')->with('error', 'Your shopping cart is empty.');
        }

        $validated = $request->validate([
            'customer_name' => 'required|string|max:100',
            'customer_email' => 'nullable|email|max:100',
            'customer_phone' => 'required|string|max:20',
            'customer_address' => 'required|string|max:500',
            'city' => 'required|string|in:Dhaka,Outside Dhaka',
            'zone' => 'nullable|string|max:100',
            'notes' => 'nullable|string|max:500',
            'payment_method' => 'required|in:cod,bkash,nagad,card',
        ]);

        $subtotal = array_sum(array_map(fn($item) => $item['price'] * $item['quantity'], $cart));
        $coupon = $request->session()->get('applied_coupon');
        $discount = 0;
        if ($coupon) {
            $discount = $coupon['type'] === 'fixed' ? $coupon['value'] : ($subtotal * $coupon['value']) / 100;
        }

        $shippingCost = $validated['city'] === 'Dhaka'
            ? (float) Setting::get('delivery_charge_inside', 60)
            : (float) Setting::get('delivery_charge_outside', 120);

        $total = max(0, $subtotal - $discount + $shippingCost);

        $orderNumber = 'ST-' . strtoupper(Str::random(6)) . '-' . time();

        $order = Order::create([
            'order_number' => $orderNumber,
            'user_id' => $request->user()?->id,
            'customer_name' => $validated['customer_name'],
            'customer_email' => $validated['customer_email'],
            'customer_phone' => $validated['customer_phone'],
            'customer_address' => $validated['customer_address'],
            'city' => $validated['city'],
            'zone' => $validated['zone'] ?? null,
            'notes' => $validated['notes'] ?? null,
            'payment_method' => $validated['payment_method'],
            'payment_status' => 'pending',
            'order_status' => 'pending',
            'subtotal' => $subtotal,
            'shipping_cost' => $shippingCost,
            'discount' => $discount,
            'total' => $total,
        ]);

        foreach ($cart as $item) {
            OrderItem::create([
                'order_id' => $order->id,
                'product_id' => $item['id'],
                'product_name' => $item['name'],
                'unit_price' => $item['price'],
                'quantity' => $item['quantity'],
                'total_price' => $item['price'] * $item['quantity'],
            ]);
        }

        // Clear cart & coupon
        $request->session()->forget(['cart', 'applied_coupon']);

        return redirect()->route('order.success', ['orderNumber' => $order->order_number]);
    }

    public function success(string $orderNumber): Response
    {
        $order = Order::where('order_number', $orderNumber)->with('items')->firstOrFail();

        return Inertia::render('Frontend/OrderSuccess', [
            'order' => $order,
        ]);
    }
}
