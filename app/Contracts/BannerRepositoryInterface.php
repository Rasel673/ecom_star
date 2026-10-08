<?php

namespace App\Contracts;

use Illuminate\Database\Eloquent\Collection;

interface BannerRepositoryInterface extends BaseRepositoryInterface
{
    public function getByPosition(string $position): Collection;
}
