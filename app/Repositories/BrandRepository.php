<?php

namespace App\Repositories;

use App\Contracts\BrandRepositoryInterface;
use App\Models\Brand;
use Illuminate\Database\Eloquent\Collection;

class BrandRepository extends BaseRepository implements BrandRepositoryInterface
{
    public function __construct(Brand $model)
    {
        parent::__construct($model);
    }

    public function getFeaturedBrands(int $limit = 12): Collection
    {
        return $this->model
            ->where('is_featured', true)
            ->where('status', true)
            ->take($limit)
            ->get();
    }
}
