<?php

namespace App\Contracts;

use Illuminate\Database\Eloquent\Collection;
use App\Models\Category;

interface CategoryRepositoryInterface extends BaseRepositoryInterface
{
    public function getTree(): Collection;
    public function getFeaturedCategories(int $limit = 16): Collection;
    public function getRootCategories(): Collection;
}
