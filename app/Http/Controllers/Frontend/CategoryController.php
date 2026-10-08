<?php

namespace App\Http\Controllers\Frontend;

use App\Http\Controllers\Controller;
use App\Contracts\CategoryRepositoryInterface;
use App\Contracts\ProductRepositoryInterface;
use App\Contracts\BrandRepositoryInterface;
use App\Models\Category;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class CategoryController extends Controller
{
    protected CategoryRepositoryInterface $categoryRepo;
    protected ProductRepositoryInterface $productRepo;
    protected BrandRepositoryInterface $brandRepo;

    public function __construct(
        CategoryRepositoryInterface $categoryRepo,
        ProductRepositoryInterface $productRepo,
        BrandRepositoryInterface $brandRepo
    ) {
        $this->categoryRepo = $categoryRepo;
        $this->productRepo = $productRepo;
        $this->brandRepo = $brandRepo;
    }

    public function show(Request $request, string $slug): Response
    {
        $category = Category::where('slug', $slug)
            ->where('status', true)
            ->with(['children' => fn ($q) => $q->where('status', true)])
            ->firstOrFail();

        // Get all category IDs including children for filtering
        $categoryIds = [$category->id];
        if ($category->children->isNotEmpty()) {
            $categoryIds = array_merge($categoryIds, $category->children->pluck('id')->toArray());
        }

        $filters = [
            'category_id' => $category->children->isNotEmpty() && !$request->has('subcat') ? null : $category->id,
            'brand_id' => $request->query('brand'),
            'stock_status' => $request->query('stock'),
            'min_price' => $request->query('min_price'),
            'max_price' => $request->query('max_price'),
            'sort' => $request->query('sort', 'latest'),
        ];

        // If no specific child selected, filter across category tree
        $query = \App\Models\Product::where('status', true)
            ->whereIn('category_id', $categoryIds)
            ->with(['category', 'brand']);

        if (!empty($filters['brand_id'])) {
            $query->where('brand_id', $filters['brand_id']);
        }
        if (!empty($filters['stock_status'])) {
            $query->where('stock_status', $filters['stock_status']);
        }
        if (!empty($filters['min_price'])) {
            $query->where(fn($q) => $q->where('special_price', '>=', $filters['min_price'])
                ->orWhere(fn($sub) => $sub->whereNull('special_price')->where('regular_price', '>=', $filters['min_price'])));
        }
        if (!empty($filters['max_price'])) {
            $query->where(fn($q) => $q->where(fn($sub) => $sub->whereNotNull('special_price')->where('special_price', '<=', $filters['max_price']))
                ->orWhere(fn($sub) => $sub->whereNull('special_price')->where('regular_price', '<=', $filters['max_price'])));
        }

        switch ($filters['sort']) {
            case 'price_low':
                $query->orderByRaw('COALESCE(special_price, regular_price) ASC');
                break;
            case 'price_high':
                $query->orderByRaw('COALESCE(special_price, regular_price) DESC');
                break;
            case 'popular':
                $query->orderBy('view_count', 'desc');
                break;
            default:
                $query->latest();
                break;
        }

        $products = $query->paginate(12)->withQueryString();
        $brands = $this->brandRepo->all();

        return Inertia::render('Frontend/Category', [
            'category' => $category,
            'products' => $products,
            'brands' => $brands,
            'filters' => $filters,
            'seo' => [
                'title' => ($category->meta_title ?: $category->name) . ' Price in Bangladesh | Star Tech',
                'description' => $category->meta_description ?: "Buy {$category->name} in Bangladesh at the lowest price from Star Tech.",
            ],
        ]);
    }
}
