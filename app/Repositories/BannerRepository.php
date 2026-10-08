<?php

namespace App\Repositories;

use App\Contracts\BannerRepositoryInterface;
use App\Models\Banner;
use Illuminate\Database\Eloquent\Collection;

class BannerRepository extends BaseRepository implements BannerRepositoryInterface
{
    public function __construct(Banner $model)
    {
        parent::__construct($model);
    }

    public function getByPosition(string $position): Collection
    {
        return $this->model
            ->where('position', $position)
            ->where('status', true)
            ->orderBy('sort_order', 'asc')
            ->get();
    }
}
