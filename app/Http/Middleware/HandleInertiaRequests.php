<?php

namespace App\Http\Middleware;

use App\Models\Category;
use App\Models\Setting;
use Illuminate\Http\Request;
use Inertia\Middleware;
use Tighten\Ziggy\Ziggy;

class HandleInertiaRequests extends Middleware
{
    protected $rootView = 'app';

    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    public function share(Request $request): array
    {
        $cart = $request->session()->get('cart', []);
        $cartCount = array_sum(array_column($cart, 'quantity'));
        $cartTotal = array_sum(array_map(function ($item) {
            return $item['price'] * $item['quantity'];
        }, $cart));

        return [
            ...parent::share($request),
            'auth' => [
                'user' => $request->user(),
            ],
            'categoriesNav' => fn () => Category::whereNull('parent_id')
                ->where('status', true)
                ->with(['children' => fn ($q) => $q->where('status', true)->orderBy('sort_order', 'asc')])
                ->orderBy('sort_order', 'asc')
                ->get(),
            'cart' => [
                'items' => array_values($cart),
                'count' => $cartCount,
                'total' => $cartTotal,
            ],
            'flash' => [
                'success' => fn () => $request->session()->get('success'),
                'error' => fn () => $request->session()->get('error'),
            ],
            'settings' => fn () => Setting::pluck('value', 'key')->toArray(),
            'ziggy' => fn () => [
                ...(new Ziggy)->toArray(),
                'location' => $request->url(),
            ],
        ];
    }
}
