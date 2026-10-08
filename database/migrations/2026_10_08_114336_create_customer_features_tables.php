<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // 1. Wishlists / Favorite Products
        Schema::create('wishlists', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->foreignId('product_id')->constrained()->cascadeOnDelete();
            $table->timestamps();

            $table->unique(['user_id', 'product_id']);
        });

        // 2. PC Builds History
        Schema::create('pc_builds', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->string('name')->default('Custom PC Build');
            $table->json('components');
            $table->decimal('total_price', 12, 2)->default(0);
            $table->integer('total_wattage')->default(0);
            $table->timestamps();
        });

        // 3. Customer Messages to Admin
        Schema::create('customer_messages', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->string('order_number')->nullable();
            $table->string('subject');
            $table->text('message');
            $table->text('admin_reply')->nullable();
            $table->timestamp('replied_at')->nullable();
            $table->string('status')->default('open'); // open, replied, closed
            $table->timestamps();
        });

        // 4. Pre-Orders
        Schema::create('pre_orders', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->nullable()->constrained()->nullOnDelete();
            $table->foreignId('product_id')->constrained()->cascadeOnDelete();
            $table->string('pre_order_number')->unique();
            $table->string('customer_name');
            $table->string('customer_phone');
            $table->string('customer_email')->nullable();
            $table->text('delivery_address');
            $table->integer('quantity')->default(1);
            $table->decimal('unit_price', 12, 2)->default(0);
            $table->decimal('advance_paid', 12, 2)->default(0);
            $table->string('status')->default('pending'); // pending, confirmed, ready_to_ship, cancelled
            $table->text('notes')->nullable();
            $table->string('expected_date')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('pre_orders');
        Schema::dropIfExists('customer_messages');
        Schema::dropIfExists('pc_builds');
        Schema::dropIfExists('wishlists');
    }
};
