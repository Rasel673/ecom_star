<?php

namespace App\Contracts;

use Illuminate\Database\Eloquent\Collection;
use Illuminate\Pagination\LengthAwarePaginator;
use App\Models\Order;

interface OrderRepositoryInterface extends BaseRepositoryInterface
{
    public function getOrdersByUser(int $userId, int $perPage = 10): LengthAwarePaginator;
    public function getRecentOrders(int $limit = 5): Collection;
    public function getSalesStats(): array;
}
