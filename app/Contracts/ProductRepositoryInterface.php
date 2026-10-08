<?php

namespace App\Contracts;

use Illuminate\Database\Eloquent\Collection;
use Illuminate\Pagination\LengthAwarePaginator;
use App\Models\Product;

interface ProductRepositoryInterface extends BaseRepositoryInterface
{
    public function getFeaturedProducts(int $limit = 8): Collection;
    public function getPopularProducts(int $limit = 8): Collection;
    public function getLatestProducts(int $limit = 8): Collection;
    public function filterProducts(array $filters, int $perPage = 20): LengthAwarePaginator;
    public function search(string $keyword, int $perPage = 20): LengthAwarePaginator;
    public function getRelatedProducts(Product $product, int $limit = 4): Collection;
}
