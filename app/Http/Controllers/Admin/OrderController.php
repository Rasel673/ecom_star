<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Services\FraudCheckService;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class OrderController extends Controller
{
    public function index(Request $request): Response
    {
        $query = Order::with('items')->latest();

        if ($request->status) {
            $query->where('order_status', $request->status);
        }

        if ($request->fraud_status) {
            $query->where('fraud_status', $request->fraud_status);
        }

        if ($request->courier_name) {
            $query->where('courier_name', $request->courier_name);
        }

        if ($request->search) {
            $query->where(function ($q) use ($request) {
                $q->where('order_number', 'like', "%{$request->search}%")
                  ->orWhere('customer_name', 'like', "%{$request->search}%")
                  ->orWhere('customer_phone', 'like', "%{$request->search}%")
                  ->orWhere('courier_tracking_id', 'like', "%{$request->search}%");
            });
        }

        $orders = $query->paginate(15)->withQueryString();

        return Inertia::render('Admin/Orders/Index', [
            'orders' => $orders,
            'filters' => $request->only(['status', 'fraud_status', 'courier_name', 'search']),
        ]);
    }

    public function show(Order $order, FraudCheckService $fraudCheckService): Response
    {
        $order->load(['items.product', 'user']);

        // Analyze fraud risk
        $fraudAnalysis = $fraudCheckService->analyze($order);

        // If order fraud fields are unset, save initial automated score
        if (!$order->fraud_status) {
            $order->update([
                'fraud_status' => $fraudAnalysis['status'],
                'fraud_score' => $fraudAnalysis['score'],
                'fraud_flags' => $fraudAnalysis['flags'],
            ]);
            $order->refresh();
        }

        return Inertia::render('Admin/Orders/Show', [
            'order' => $order,
            'fraudAnalysis' => $fraudAnalysis,
        ]);
    }

    public function updateStatus(Request $request, Order $order)
    {
        $validated = $request->validate([
            'order_status' => 'required|in:pending,processing,confirmed,shipped,delivered,cancelled',
            'payment_status' => 'required|in:pending,paid,failed',
        ]);

        $order->update($validated);

        return back()->with('success', 'Order status updated successfully!');
    }

    public function updateFraudStatus(Request $request, Order $order)
    {
        $validated = $request->validate([
            'fraud_status' => 'required|in:safe,review,high_risk,flagged',
        ]);

        $order->update([
            'fraud_status' => $validated['fraud_status'],
        ]);

        return back()->with('success', "Fraud status updated to {$validated['fraud_status']}.");
    }

    public function dispatchCourier(Request $request, Order $order)
    {
        $validated = $request->validate([
            'courier_name' => 'required|string|max:50',
            'courier_tracking_id' => 'nullable|string|max:100',
            'courier_collected_amount' => 'required|numeric|min:0',
        ]);

        $trackingId = $validated['courier_tracking_id'] ?: 
            ('ST-' . strtoupper(substr(preg_replace('/[^a-zA-Z]/', '', $validated['courier_name']), 0, 4)) . '-' . rand(100000, 999999));

        $order->update([
            'courier_name' => $validated['courier_name'],
            'courier_tracking_id' => $trackingId,
            'courier_status' => 'dispatched',
            'courier_collected_amount' => $validated['courier_collected_amount'],
            'dispatched_at' => now(),
            'order_status' => $order->order_status === 'pending' || $order->order_status === 'processing' 
                ? 'shipped' 
                : $order->order_status,
        ]);

        return back()->with('success', "Order dispatched via {$validated['courier_name']} (Tracking: {$trackingId})!");
    }
}
