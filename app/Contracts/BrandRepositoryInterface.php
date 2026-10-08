<?php

namespace App\Contracts;

use Illuminate\Database\Eloquent\Collection;

interface BrandRepositoryInterface extends BaseRepositoryInterface
{
    public function getFeaturedBrands(int $limit = 12): Collection;
}
