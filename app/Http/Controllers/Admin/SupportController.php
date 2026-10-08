<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\CustomerMessage;
use App\Models\PreOrder;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class SupportController extends Controller
{
    /**
     * View all customer messages and tickets.
     */
    public function messagesIndex(Request $request): Response
    {
        $messages = CustomerMessage::with('user')->latest()->paginate(15);
        return Inertia::render('Admin/Support/Messages', [
            'messages' => $messages,
        ]);
    }

    /**
     * Admin replies to customer message.
     */
    public function replyMessage(Request $request, CustomerMessage $message)
    {
        $validated = $request->validate([
            'admin_reply' => 'required|string|max:2000',
            'status' => 'required|in:replied,closed',
        ]);

        $message->update([
            'admin_reply' => $validated['admin_reply'],
            'replied_at' => now(),
            'status' => $validated['status'],
        ]);

        return back()->with('success', 'Reply sent to customer successfully.');
    }

    /**
     * View all pre-orders.
     */
    public function preOrdersIndex(Request $request): Response
    {
        $preOrders = PreOrder::with(['product', 'user'])->latest()->paginate(15);
        return Inertia::render('Admin/Support/PreOrders', [
            'preOrders' => $preOrders,
        ]);
    }

    /**
     * Update pre-order status.
     */
    public function updatePreOrderStatus(Request $request, PreOrder $preOrder)
    {
        $validated = $request->validate([
            'status' => 'required|in:pending,confirmed,ready_to_ship,cancelled',
            'expected_date' => 'nullable|string|max:50',
            'notes' => 'nullable|string|max:500',
        ]);

        $preOrder->update($validated);
        return back()->with('success', 'Pre-order status updated successfully.');
    }
}
