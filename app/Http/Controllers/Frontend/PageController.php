<?php

namespace App\Http\Controllers\Frontend;

use App\Http\Controllers\Controller;
use App\Models\CustomerMessage;
use App\Models\Order;
use App\Models\Page;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class PageController extends Controller
{
    /**
     * Display a dynamic CMS page by slug.
     */
    public function show(Request $request, string $slug): Response
    {
        $page = Page::where('slug', $slug)
            ->where('is_active', true)
            ->firstOrFail();

        $trackingResult = null;
        if ($page->page_type === 'order_tracking') {
            $orderNumber = $request->query('order_number');
            $phone = $request->query('phone');

            if ($orderNumber || $phone) {
                $query = Order::with('items.product');

                if ($orderNumber) {
                    $query->where('order_number', trim($orderNumber));
                }
                if ($phone) {
                    $query->where('customer_phone', trim($phone));
                }

                $trackingResult = $query->latest()->first();
            }
        }

        return Inertia::render('Frontend/Page', [
            'page' => $page,
            'trackingResult' => $trackingResult,
            'searchQuery' => [
                'order_number' => $request->query('order_number', ''),
                'phone' => $request->query('phone', ''),
            ],
            'seo' => [
                'title' => $page->meta_title ?: "{$page->title} - Star Tech & Engineering Ltd",
                'description' => $page->meta_description ?: ($page->subtitle ?: substr(strip_tags($page->content), 0, 160)),
            ],
        ]);
    }

    /**
     * Submit an inquiry / contact message from dynamic Contact or Service page.
     */
    public function submitInquiry(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:100',
            'phone' => 'required|string|max:25',
            'email' => 'nullable|email|max:100',
            'subject' => 'required|string|max:150',
            'message' => 'required|string|max:3000',
            'order_number' => 'nullable|string|max:50',
        ]);

        CustomerMessage::create([
            'user_id' => $request->user()?->id,
            'subject' => "[{$validated['name']}] {$validated['subject']}",
            'message' => "Phone: {$validated['phone']}\nEmail: " . ($validated['email'] ?? 'N/A') . "\n\n" . $validated['message'],
            'order_number' => $validated['order_number'] ?? null,
            'status' => 'open',
        ]);

        return back()->with('success', 'Your inquiry has been received! Our support team will respond shortly.');
    }
}
