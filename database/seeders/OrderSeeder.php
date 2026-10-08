<?php

namespace Database\Seeders;

use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Product;
use App\Models\User;
use App\Services\FraudCheckService;
use Illuminate\Database\Seeder;

class OrderSeeder extends Seeder
{
    public function run(): void
    {
        $products = Product::take(5)->get();
        if ($products->isEmpty()) {
            return;
        }

        $fraudService = new FraudCheckService();

        // 1. Safe / Low-risk order
        $p1 = $products[0];
        $price1 = $p1->special_price ?: $p1->regular_price ?: 12500;
        $order1 = Order::create([
            'order_number' => 'ST-' . date('ymd') . '-001',
            'customer_name' => 'Tanvir Hossain',
            'customer_email' => 'tanvir.dev@gmail.com',
            'customer_phone' => '01712345678',
            'customer_address' => 'House 42, Road 11, Block D, Banani',
            'city' => 'Dhaka',
            'zone' => 'Banani',
            'notes' => 'Please call before delivery',
            'payment_method' => 'cod',
            'payment_status' => 'pending',
            'order_status' => 'processing',
            'subtotal' => $price1,
            'shipping_cost' => 60,
            'discount' => 0,
            'total' => $price1 + 60,
        ]);

        OrderItem::create([
            'order_id' => $order1->id,
            'product_id' => $p1->id,
            'product_name' => $p1->name,
            'quantity' => 1,
            'unit_price' => $price1,
            'total_price' => $price1,
        ]);

        $analysis1 = $fraudService->analyze($order1);
        $order1->update([
            'fraud_status' => $analysis1['status'],
            'fraud_score' => $analysis1['score'],
            'fraud_flags' => $analysis1['flags'],
        ]);

        // 2. Medium Risk order (High COD > ৳25,000)
        $p2 = $products->count() > 1 ? $products[1] : $p1;
        $order2 = Order::create([
            'order_number' => 'ST-' . date('ymd') . '-002',
            'customer_name' => 'Arif Mahmud',
            'customer_email' => 'arif.ctg@yahoo.com',
            'customer_phone' => '01819876543',
            'customer_address' => 'GEC Circle, Nasirabad, Chattogram',
            'city' => 'Chattogram',
            'zone' => 'Nasirabad',
            'notes' => '',
            'payment_method' => 'cod',
            'payment_status' => 'pending',
            'order_status' => 'pending',
            'subtotal' => 28000,
            'shipping_cost' => 120,
            'discount' => 0,
            'total' => 28120,
        ]);

        OrderItem::create([
            'order_id' => $order2->id,
            'product_id' => $p2->id,
            'product_name' => $p2->name,
            'quantity' => 2,
            'unit_price' => 14000,
            'total_price' => 28000,
        ]);

        $analysis2 = $fraudService->analyze($order2);
        $order2->update([
            'fraud_status' => $analysis2['status'],
            'fraud_score' => $analysis2['score'],
            'fraud_flags' => $analysis2['flags'],
        ]);

        // 3. High Risk / Suspicious Order (Dummy number, short dummy address, COD > ৳70,000)
        $order3 = Order::create([
            'order_number' => 'ST-' . date('ymd') . '-003',
            'customer_name' => 'Test Tester',
            'customer_email' => 'tester@mailinator.com',
            'customer_phone' => '01700000000',
            'customer_address' => 'asdf fake street',
            'city' => 'Dhaka',
            'zone' => 'Unknown',
            'notes' => 'urgent send fast',
            'payment_method' => 'cod',
            'payment_status' => 'pending',
            'order_status' => 'pending',
            'subtotal' => 75000,
            'shipping_cost' => 100,
            'discount' => 0,
            'total' => 75100,
        ]);

        OrderItem::create([
            'order_id' => $order3->id,
            'product_id' => $p1->id,
            'product_name' => $p1->name,
            'quantity' => 5,
            'unit_price' => 15000,
            'total_price' => 75000,
        ]);

        $analysis3 = $fraudService->analyze($order3);
        $order3->update([
            'fraud_status' => $analysis3['status'],
            'fraud_score' => $analysis3['score'],
            'fraud_flags' => $analysis3['flags'],
        ]);
    }
}
