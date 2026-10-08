<?php

namespace App\Repositories;

use App\Contracts\ProductRepositoryInterface;
use App\Models\Product;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Pagination\LengthAwarePaginator;

class ProductRepository extends BaseRepository implements ProductRepositoryInterface
{
    public function __construct(Product $model)
    {
        parent::__construct($model);
    }

    public function getFeaturedProducts(int $limit = 8): Collection
    {
        return $this->model
            ->where('is_featured', true)
            ->where('status', true)
            ->with(['category', 'brand'])
            ->latest()
            ->take($limit)
            ->get();
    }

    public function getPopularProducts(int $limit = 8): Collection
    {
        return $this->model
            ->where('is_popular', true)
            ->where('status', true)
            ->with(['category', 'brand'])
            ->latest()
            ->take($limit)
            ->get();
    }

    public function getLatestProducts(int $limit = 8): Collection
    {
        return $this->model
            ->where('status', true)
            ->with(['category', 'brand'])
            ->latest()
            ->take($limit)
            ->get();
    }

    public function filterProducts(array $filters, int $perPage = 20): LengthAwarePaginator
    {
        $query = $this->model->with(['category', 'brand'])->where('status', true);

        if (!empty($filters['category_id'])) {
            $query->where('category_id', $filters['category_id']);
        }

        if (!empty($filters['brand_id'])) {
            $query->where('brand_id', $filters['brand_id']);
        }

        if (!empty($filters['stock_status'])) {
            $query->where('stock_status', $filters['stock_status']);
        }

        if (!empty($filters['min_price'])) {
            $query->where(function ($q) use ($filters) {
                $q->where('special_price', '>=', $filters['min_price'])
                  ->orWhere(function ($sub) use ($filters) {
                      $sub->whereNull('special_price')
                          ->where('regular_price', '>=', $filters['min_price']);
                  });
            });
        }

        if (!empty($filters['max_price'])) {
            $query->where(function ($q) use ($filters) {
                $q->where(function ($sub) use ($filters) {
                    $sub->whereNotNull('special_price')
                        ->where('special_price', '<=', $filters['max_price']);
                })->orWhere(function ($sub) use ($filters) {
                    $sub->whereNull('special_price')
                        ->where('regular_price', '<=', $filters['max_price']);
                });
            });
        }

        // Sorting
        $sort = $filters['sort'] ?? 'latest';
        switch ($sort) {
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

        return $query->paginate($perPage);
    }

    public function search(string $keyword, int $perPage = 20): LengthAwarePaginator
    {
        return $this->model
            ->where('status', true)
            ->where(function ($q) use ($keyword) {
                $q->where('name', 'like', "%{$keyword}%")
                  ->orWhere('model', 'like', "%{$keyword}%")
                  ->orWhere('sku', 'like', "%{$keyword}%")
                  ->orWhere('description', 'like', "%{$keyword}%");
            })
            ->with(['category', 'brand'])
            ->latest()
            ->paginate($perPage);
    }

    public function getRelatedProducts(Product $product, int $limit = 4): Collection
    {
        return $this->model
            ->where('status', true)
            ->where('category_id', $product->category_id)
            ->where('id', '!=', $product->id)
            ->with(['category', 'brand'])
            ->take($limit)
            ->get();
    }
}
