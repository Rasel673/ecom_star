<?php

namespace App\Repositories;

use App\Contracts\CategoryRepositoryInterface;
use App\Models\Category;
use Illuminate\Database\Eloquent\Collection;

class CategoryRepository extends BaseRepository implements CategoryRepositoryInterface
{
    public function __construct(Category $model)
    {
        parent::__construct($model);
    }

    public function getTree(): Collection
    {
        return $this->model
            ->whereNull('parent_id')
            ->where('status', true)
            ->with(['children' => function ($query) {
                $query->where('status', true)->orderBy('sort_order', 'asc');
            }])
            ->orderBy('sort_order', 'asc')
            ->get();
    }

    public function getFeaturedCategories(int $limit = 16): Collection
    {
        return $this->model
            ->where('is_featured', true)
            ->where('status', true)
            ->orderBy('sort_order', 'asc')
            ->take($limit)
            ->get();
    }

    public function getRootCategories(): Collection
    {
        return $this->model
            ->whereNull('parent_id')
            ->orderBy('sort_order', 'asc')
            ->get();
    }
}
