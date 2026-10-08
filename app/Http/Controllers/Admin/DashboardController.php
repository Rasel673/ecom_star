<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\CustomerMessage;
use App\Models\Order;
use App\Models\PreOrder;
use App\Models\Product;
use App\Models\Category;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    public function index(): Response
    {
        $today = Carbon::today();
        $startOfMonth = Carbon::now()->startOfMonth();

        // 1. Sales & Revenue
        $totalSales = (float) Order::where('order_status', '!=', 'cancelled')->sum('total');
        $todaySales = (float) Order::where('order_status', '!=', 'cancelled')
            ->whereDate('created_at', $today)
            ->sum('total');
        $thisMonthSales = (float) Order::where('order_status', '!=', 'cancelled')
            ->where('created_at', '>=', $startOfMonth)
            ->sum('total');

        // 2. Orders Breakdown
        $totalOrders = Order::count();
        $pendingOrders = Order::where('order_status', 'pending')->count();
        $processingOrders = Order::where('order_status', 'processing')->count();
        $deliveredOrders = Order::where('order_status', 'delivered')->count();
        $courierDispatched = Order::whereNotNull('courier_tracking_id')->count();

        // 3. Risk & Fraud Alerts
        $fraudAlerts = Order::whereIn('fraud_status', ['review', 'high_risk', 'flagged'])->count();

        // 4. Products & Inventory
        $totalProducts = Product::count();
        $lowStockCount = Product::where('quantity', '>', 0)->where('quantity', '<=', 5)->count();
        $outOfStockCount = Product::where('quantity', '<=', 0)->count();

        // 5. Customer & Support Engagement
        $totalUsers = User::where('role', 'customer')->count();
        $openMessages = CustomerMessage::where('status', 'open')->count();
        $pendingPreOrders = PreOrder::where('status', 'pending')->count();

        // 6. Last 7 Days Daily Sales Chart Data
        $salesTrends = [];
        for ($i = 6; $i >= 0; $i--) {
            $date = Carbon::today()->subDays($i);
            $dayLabel = $date->format('D, M j');
            $daySales = (float) Order::where('order_status', '!=', 'cancelled')
                ->whereDate('created_at', $date)
                ->sum('total');
            $dayOrdersCount = Order::whereDate('created_at', $date)->count();

            $salesTrends[] = [
                'date' => $dayLabel,
                'shortDate' => $date->format('M j'),
                'sales' => $daySales,
                'orders' => $dayOrdersCount,
            ];
        }

        // 7. Recent Items
        $recentOrders = Order::with('items.product')->latest()->take(6)->get();
        $lowStockProducts = Product::where('quantity', '<=', 5)->latest()->take(5)->get();
        $recentMessages = CustomerMessage::with('user')->where('status', 'open')->latest()->take(4)->get();
        $recentPreOrders = PreOrder::with('product')->latest()->take(4)->get();

        return Inertia::render('Admin/Dashboard', [
            'stats' => [
                'totalSales' => $totalSales,
                'todaySales' => $todaySales,
                'thisMonthSales' => $thisMonthSales,
                'totalOrders' => $totalOrders,
                'pendingOrders' => $pendingOrders,
                'processingOrders' => $processingOrders,
                'deliveredOrders' => $deliveredOrders,
                'courierDispatched' => $courierDispatched,
                'fraudAlerts' => $fraudAlerts,
                'totalProducts' => $totalProducts,
                'lowStockCount' => $lowStockCount,
                'outOfStockCount' => $outOfStockCount,
                'totalUsers' => $totalUsers,
                'openMessages' => $openMessages,
                'pendingPreOrders' => $pendingPreOrders,
            ],
            'salesTrends' => $salesTrends,
            'recentOrders' => $recentOrders,
            'lowStockProducts' => $lowStockProducts,
            'recentMessages' => $recentMessages,
            'recentPreOrders' => $recentPreOrders,
        ]);
    }
}
