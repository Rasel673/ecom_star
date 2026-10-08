<?php

namespace App\Http\Controllers\Frontend;

use App\Http\Controllers\Controller;
use App\Models\Product;
use App\Models\Coupon;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class CartController extends Controller
{
    public function index(Request $request): Response
    {
        $cart = $request->session()->get('cart', []);
        $coupon = $request->session()->get('applied_coupon');

        $subtotal = 0;
        foreach ($cart as $item) {
            $subtotal += $item['price'] * $item['quantity'];
        }

        $discount = 0;
        if ($coupon) {
            if ($coupon['type'] === 'fixed') {
                $discount = $coupon['value'];
            } else {
                $discount = ($subtotal * $coupon['value']) / 100;
            }
        }

        $total = max(0, $subtotal - $discount);
        $cartCount = array_sum(array_column($cart, 'quantity'));

        return Inertia::render('Frontend/Cart', [
            'cartItems' => array_values($cart),
            'cart' => [
                'items' => array_values($cart),
                'count' => $cartCount,
                'total' => $total,
            ],
            'subtotal' => $subtotal,
            'discount' => $discount,
            'total' => $total,
            'coupon' => $coupon,
        ]);
    }

    public function add(Request $request)
    {
        $request->validate([
            'product_id' => 'required|exists:products,id',
            'quantity' => 'nullable|integer|min:1',
        ]);

        $product = Product::findOrFail($request->product_id);
        $qty = $request->input('quantity', 1);

        $cart = $request->session()->get('cart', []);

        $price = $product->special_price ?: $product->regular_price;

        if (isset($cart[$product->id])) {
            $cart[$product->id]['quantity'] += $qty;
        } else {
            $cart[$product->id] = [
                'id' => $product->id,
                'name' => $product->name,
                'slug' => $product->slug,
                'price' => (float)$price,
                'regular_price' => (float)$product->regular_price,
                'thumbnail' => $product->thumbnail,
                'quantity' => $qty,
                'model' => $product->model,
            ];
        }

        $request->session()->put('cart', $cart);

        return back()->with('success', "{$product->name} added to cart!");
    }

    public function addBulk(Request $request)
    {
        $request->validate([
            'product_ids' => 'required|array',
            'product_ids.*' => 'exists:products,id',
        ]);

        $products = Product::whereIn('id', $request->product_ids)->get();
        $cart = $request->session()->get('cart', []);

        foreach ($products as $product) {
            $price = $product->special_price ?: $product->regular_price;
            if (isset($cart[$product->id])) {
                $cart[$product->id]['quantity'] += 1;
            } else {
                $cart[$product->id] = [
                    'id' => $product->id,
                    'name' => $product->name,
                    'slug' => $product->slug,
                    'price' => (float)$price,
                    'regular_price' => (float)$product->regular_price,
                    'thumbnail' => $product->thumbnail,
                    'quantity' => 1,
                    'model' => $product->model,
                ];
            }
        }

        $request->session()->put('cart', $cart);

        return redirect()->route('cart.index')->with('success', count($products) . ' PC components added to your cart!');
    }

    public function update(Request $request)
    {
        $request->validate([
            'product_id' => 'required|integer',
            'quantity' => 'required|integer|min:1',
        ]);

        $cart = $request->session()->get('cart', []);

        if (isset($cart[$request->product_id])) {
            $cart[$request->product_id]['quantity'] = $request->quantity;
            $request->session()->put('cart', $cart);
        }

        return back()->with('success', 'Cart updated successfully.');
    }

    public function remove(Request $request, int $id)
    {
        $cart = $request->session()->get('cart', []);

        if (isset($cart[$id])) {
            unset($cart[$id]);
            $request->session()->put('cart', $cart);
        }

        return back()->with('success', 'Item removed from cart.');
    }

    public function applyCoupon(Request $request)
    {
        $request->validate([
            'code' => 'required|string',
        ]);

        $coupon = Coupon::where('code', strtoupper($request->code))
            ->where('status', true)
            ->where(function ($q) {
                $q->whereNull('expires_at')->orWhere('expires_at', '>=', now());
            })
            ->first();

        if (!$coupon) {
            return back()->with('error', 'Invalid or expired coupon code.');
        }

        $cart = $request->session()->get('cart', []);
        $subtotal = array_sum(array_map(fn($item) => $item['price'] * $item['quantity'], $cart));

        if ($subtotal < $coupon->min_spend) {
            return back()->with('error', "Minimum order amount of ৳{$coupon->min_spend} required for this coupon.");
        }

        $request->session()->put('applied_coupon', [
            'code' => $coupon->code,
            'type' => $coupon->type,
            'value' => (float)$coupon->value,
        ]);

        return back()->with('success', "Coupon '{$coupon->code}' applied successfully!");
    }

    public function removeCoupon(Request $request)
    {
        $request->session()->forget('applied_coupon');
        return back()->with('success', 'Coupon removed.');
    }
}
