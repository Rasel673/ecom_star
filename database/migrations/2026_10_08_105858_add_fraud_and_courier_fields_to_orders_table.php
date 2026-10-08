<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('orders', function (Blueprint $table) {
            // Fraud check columns
            $table->string('fraud_status')->default('safe')->after('order_status'); // safe, review, suspicious, high_risk
            $table->integer('fraud_score')->default(10)->after('fraud_status'); // 0 (safest) to 100 (highest risk)
            $table->json('fraud_flags')->nullable()->after('fraud_score');

            // Courier dispatch columns
            $table->string('courier_name')->nullable()->after('fraud_flags'); // steadfast, pathao, redx, paperfly, sundarban, in_house
            $table->string('courier_tracking_id')->nullable()->after('courier_name');
            $table->string('courier_status')->nullable()->after('courier_tracking_id'); // pending, dispatched, in_transit, delivered, returned
            $table->decimal('courier_collected_amount', 12, 2)->nullable()->after('courier_status');
            $table->timestamp('dispatched_at')->nullable()->after('courier_collected_amount');
        });
    }

    public function down(): void
    {
        Schema::table('orders', function (Blueprint $table) {
            $table->dropColumn([
                'fraud_status',
                'fraud_score',
                'fraud_flags',
                'courier_name',
                'courier_tracking_id',
                'courier_status',
                'courier_collected_amount',
                'dispatched_at',
            ]);
        });
    }
};
