<?php

namespace App\Http\Controllers\Frontend;

use App\Http\Controllers\Controller;
use App\Contracts\ProductRepositoryInterface;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;

class ProductController extends Controller
{
    protected ProductRepositoryInterface $productRepo;

    public function __construct(ProductRepositoryInterface $productRepo)
    {
        $this->productRepo = $productRepo;
    }

    public function show(string $slug): Response
    {
        $product = Product::where('slug', $slug)
            ->where('status', true)
            ->with(['category', 'brand', 'reviews'])
            ->firstOrFail();

        $product->increment('view_count');

        $relatedProducts = $this->productRepo->getRelatedProducts($product, 4);

        return Inertia::render('Frontend/ProductDetail', [
            'product' => $product,
            'relatedProducts' => $relatedProducts,
            'seo' => [
                'title' => ($product->meta_title ?: $product->name) . ' Price in BD | Star Tech',
                'description' => $product->meta_description ?: (($product->model ? $product->model . ' - ' : '') . Str::limit(strip_tags($product->description ?? ''), 150)),
                'image' => $product->thumbnail,
            ],
        ]);
    }

    public function storeReview(Request $request, string $slug)
    {
        $product = Product::where('slug', $slug)->firstOrFail();

        $validated = $request->validate([
            'name' => 'required|string|max:100',
            'rating' => 'required|integer|min:1|max:5',
            'comment' => 'required|string|max:1000',
        ]);

        $product->reviews()->create([
            'user_id' => $request->user()?->id,
            'name' => $validated['name'],
            'rating' => $validated['rating'],
            'comment' => $validated['comment'],
            'status' => true,
        ]);

        return back()->with('success', 'Your review has been submitted successfully!');
    }
}
