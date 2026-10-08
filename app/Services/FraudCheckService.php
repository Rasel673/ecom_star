<?php

namespace App\Services;

use App\Models\Order;

class FraudCheckService
{
    /**
     * Perform automated fraud analysis on an order.
     */
    public function analyze(Order $order): array
    {
        $flags = [];
        $score = 10; // Base score (low risk)

        // 1. Phone number validation (Bangladeshi mobile format)
        $cleanPhone = preg_replace('/[^0-9]/', '', $order->customer_phone);
        if (str_starts_with($cleanPhone, '880')) {
            $cleanPhone = substr($cleanPhone, 2);
        }

        $isValidBDPhone = (bool) preg_match('/^01[3-9]\d{8}$/', $cleanPhone);
        if (!$isValidBDPhone) {
            $flags[] = 'Invalid or non-standard Bangladeshi mobile number format';
            $score += 35;
        }

        // Test or repetitive numbers check (e.g. 01700000000, 01711111111)
        if (preg_match('/^01[3-9](0{8}|1{8}|2{8}|3{8}|4{8}|5{8}|6{8}|7{8}|8{8}|9{8})$/', $cleanPhone) ||
            $cleanPhone === '01700000000' || $cleanPhone === '01800000000') {
            $flags[] = 'Suspicious or dummy repeating phone number detected';
            $score += 45;
        }

        // 2. Customer Order History Check (Look for previous orders by this phone or email)
        $pastOrders = Order::where('id', '!=', $order->id)
            ->where(function ($q) use ($order, $cleanPhone) {
                $q->where('customer_phone', 'like', "%{$cleanPhone}%");
                if ($order->customer_email) {
                    $q->orWhere('customer_email', $order->customer_email);
                }
            })
            ->get();

        $totalPastOrders = $pastOrders->count();
        $cancelledPastOrders = $pastOrders->where('order_status', 'cancelled')->count();
        $deliveredPastOrders = $pastOrders->where('order_status', 'delivered')->count();

        $cancellationRate = $totalPastOrders > 0 
            ? round(($cancelledPastOrders / $totalPastOrders) * 100) 
            : 0;

        if ($totalPastOrders === 0) {
            $flags[] = 'First-time customer (No verified past purchase history)';
            $score += 10;
        } elseif ($cancellationRate >= 50 && $totalPastOrders >= 2) {
            $flags[] = "High return/cancellation history ({$cancellationRate}% of {$totalPastOrders} past orders cancelled)";
            $score += 40;
        } elseif ($deliveredPastOrders >= 2 && $cancellationRate == 0) {
            // Good customer trust bonus
            $score = max(0, $score - 15);
        }

        // 3. High Value Cash-on-Delivery (COD) Check
        if ($order->payment_method === 'cod') {
            if ($order->total >= 70000) {
                $flags[] = 'Very high-value Cash on Delivery order (Above ৳70,000) - Advance token payment strongly advised';
                $score += 30;
            } elseif ($order->total >= 25000) {
                $flags[] = 'High-value COD order (Above ৳25,000) - Phone confirmation required before courier dispatch';
                $score += 15;
            }
        }

        // 4. Order Velocity Check (Multiple orders within 24 hours)
        $recentOrdersCount = Order::where('id', '!=', $order->id)
            ->where('customer_phone', 'like', "%{$cleanPhone}%")
            ->where('created_at', '>=', now()->subDay())
            ->count();

        if ($recentOrdersCount >= 2) {
            $flags[] = "Unusual order velocity: Customer placed {$recentOrdersCount} orders within the last 24 hours";
            $score += 25;
        }

        // 5. Address quality check
        $address = strtolower(trim($order->customer_address));
        if (strlen($address) < 12) {
            $flags[] = 'Very short delivery address provided - May lead to courier delivery failure';
            $score += 15;
        }

        $dummyPatterns = ['asdf', 'test', 'fake', 'abcd', 'dummy', 'xxxx'];
        foreach ($dummyPatterns as $pattern) {
            if (str_contains($address, $pattern)) {
                $flags[] = "Suspicious keyword ('{$pattern}') found in delivery address";
                $score += 30;
                break;
            }
        }

        // 6. Temporary / Disposable Email Check
        if ($order->customer_email) {
            $domain = substr(strrchr($order->customer_email, "@"), 1);
            $disposableDomains = ['tempmail.com', 'mailinator.com', '10minutemail.com', 'throwaway.com', 'guerrillamail.com'];
            if (in_array(strtolower($domain), $disposableDomains)) {
                $flags[] = 'Disposable temporary email address detected';
                $score += 35;
            }
        }

        // Final Score bounds
        $score = min(100, max(0, $score));

        // Determine Risk Level & Recommendation
        if ($score >= 60) {
            $riskLevel = 'high';
            $status = 'high_risk';
            $recommendation = 'DO NOT DISPATCH without phone verification and partial advance payment.';
        } elseif ($score >= 35) {
            $riskLevel = 'medium';
            $status = 'review';
            $recommendation = 'Call customer to confirm order details and delivery address before courier booking.';
        } else {
            $riskLevel = 'low';
            $status = 'safe';
            $recommendation = 'Order appears genuine and safe to dispatch to courier.';
        }

        return [
            'score' => $score,
            'risk_level' => $riskLevel,
            'status' => $status,
            'flags' => $flags,
            'recommendation' => $recommendation,
            'customer_history' => [
                'total_orders' => $totalPastOrders,
                'delivered_orders' => $deliveredPastOrders,
                'cancelled_orders' => $cancelledPastOrders,
                'cancellation_rate' => $cancellationRate,
            ],
            'clean_phone' => $cleanPhone,
            'is_valid_phone' => $isValidBDPhone,
        ];
    }
}
