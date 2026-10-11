<?php

namespace App\Http\Controllers\Frontend;

use App\Http\Controllers\Controller;
use App\Contracts\ProductRepositoryInterface;
use App\Models\Product;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class SearchController extends Controller
{
    protected ProductRepositoryInterface $productRepo;

    public function __construct(ProductRepositoryInterface $productRepo)
    {
        $this->productRepo = $productRepo;
    }

    public function index(Request $request): Response
    {
        $query = $request->input('q', '');
        $products = $this->productRepo->search($query, 16)->withQueryString();

        $siteName = \App\Models\Setting::get('site_name', 'Tech Shoppers');

        return Inertia::render('Frontend/Search', [
            'query' => $query,
            'products' => $products,
            'seo' => [
                'title' => ($query ? "Search results for '{$query}'" : 'Search Products') . " | {$siteName}",
                'description' => "Search laptop, desktop, graphics card, processor at {$siteName}.",
            ],
        ]);
    }

    public function autocomplete(Request $request)
    {
        $q = $request->input('q', '');
        if (strlen($q) < 2) {
            return response()->json([]);
        }

        $results = Product::where('status', true)
            ->where(function ($sub) use ($q) {
                $sub->where('name', 'like', "%{$q}%")
                    ->orWhere('model', 'like', "%{$q}%");
            })
            ->select('id', 'name', 'slug', 'regular_price', 'special_price', 'thumbnail', 'model')
            ->take(6)
            ->get();

        return response()->json($results);
    }
}
