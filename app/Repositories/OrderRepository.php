<?php

namespace App\Repositories;

use App\Contracts\OrderRepositoryInterface;
use App\Models\Order;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Pagination\LengthAwarePaginator;

class OrderRepository extends BaseRepository implements OrderRepositoryInterface
{
    public function __construct(Order $model)
    {
        parent::__construct($model);
    }

    public function getOrdersByUser(int $userId, int $perPage = 10): LengthAwarePaginator
    {
        return $this->model
            ->where('user_id', $userId)
            ->with(['items.product'])
            ->latest()
            ->paginate($perPage);
    }

    public function getRecentOrders(int $limit = 5): Collection
    {
        return $this->model
            ->with(['items'])
            ->latest()
            ->take($limit)
            ->get();
    }

    public function getSalesStats(): array
    {
        return [
            'total_sales' => $this->model->where('order_status', '!=', 'cancelled')->sum('total'),
            'total_orders' => $this->model->count(),
            'pending_orders' => $this->model->where('order_status', 'pending')->count(),
            'completed_orders' => $this->model->where('order_status', 'delivered')->count(),
        ];
    }
}
