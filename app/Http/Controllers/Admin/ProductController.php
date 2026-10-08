<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Product;
use App\Models\Category;
use App\Models\Brand;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;

class ProductController extends Controller
{
    public function index(Request $request): Response
    {
        $query = Product::with(['category', 'brand'])->latest();

        if ($request->search) {
            $query->where('name', 'like', "%{$request->search}%")
                  ->orWhere('model', 'like', "%{$request->search}%");
        }

        $products = $query->paginate(15)->withQueryString();

        return Inertia::render('Admin/Products/Index', [
            'products' => $products,
            'filters' => $request->only(['search']),
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('Admin/Products/Create', [
            'categories' => Category::where('status', true)->get(),
            'brands' => Brand::where('status', true)->get(),
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'slug' => 'nullable|string|max:255|unique:products,slug',
            'category_id' => 'required|exists:categories,id',
            'brand_id' => 'nullable|exists:brands,id',
            'model' => 'nullable|string|max:100',
            'sku' => 'nullable|string|max:100',
            'regular_price' => 'required|numeric|min:0',
            'special_price' => 'nullable|numeric|min:0',
            'stock_status' => 'required|in:in_stock,out_of_stock,upcoming',
            'quantity' => 'required|integer|min:0',
            'thumbnail' => 'nullable|string|max:500',
            'key_features' => 'nullable|array',
            'specifications' => 'nullable|array',
            'description' => 'nullable|string',
            'is_featured' => 'boolean',
            'is_popular' => 'boolean',
            'status' => 'boolean',
            'meta_title' => 'nullable|string|max:255',
            'meta_description' => 'nullable|string|max:500',
        ]);

        $validated['slug'] = $validated['slug'] ?: Str::slug($validated['name']);

        Product::create($validated);

        return redirect()->route('admin.products.index')->with('success', 'Product created successfully!');
    }

    public function edit(Product $product): Response
    {
        return Inertia::render('Admin/Products/Edit', [
            'product' => $product,
            'categories' => Category::where('status', true)->get(),
            'brands' => Brand::where('status', true)->get(),
        ]);
    }

    public function update(Request $request, Product $product)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'slug' => 'required|string|max:255|unique:products,slug,' . $product->id,
            'category_id' => 'required|exists:categories,id',
            'brand_id' => 'nullable|exists:brands,id',
            'model' => 'nullable|string|max:100',
            'sku' => 'nullable|string|max:100',
            'regular_price' => 'required|numeric|min:0',
            'special_price' => 'nullable|numeric|min:0',
            'stock_status' => 'required|in:in_stock,out_of_stock,upcoming',
            'quantity' => 'required|integer|min:0',
            'thumbnail' => 'nullable|string|max:500',
            'key_features' => 'nullable|array',
            'specifications' => 'nullable|array',
            'description' => 'nullable|string',
            'is_featured' => 'boolean',
            'is_popular' => 'boolean',
            'status' => 'boolean',
            'meta_title' => 'nullable|string|max:255',
            'meta_description' => 'nullable|string|max:500',
        ]);

        $product->update($validated);

        return redirect()->route('admin.products.index')->with('success', 'Product updated successfully!');
    }

    public function destroy(Product $product)
    {
        $product->delete();
        return redirect()->route('admin.products.index')->with('success', 'Product deleted successfully!');
    }
}
