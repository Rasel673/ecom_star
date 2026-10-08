<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('products', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('slug')->unique();
            $table->foreignId('category_id')->constrained('categories')->cascadeOnDelete();
            $table->foreignId('brand_id')->nullable()->constrained('brands')->nullOnDelete();
            $table->string('model')->nullable();
            $table->string('sku')->nullable();
            $table->decimal('regular_price', 12, 2);
            $table->decimal('special_price', 12, 2)->nullable();
            $table->string('stock_status')->default('in_stock'); // 'in_stock', 'out_of_stock', 'upcoming'
            $table->integer('quantity')->default(10);
            $table->json('key_features')->nullable(); // list of bullet points
            $table->json('specifications')->nullable(); // structured key-value specs
            $table->longText('description')->nullable();
            $table->string('thumbnail')->nullable();
            $table->json('gallery')->nullable();
            $table->boolean('is_featured')->default(false);
            $table->boolean('is_popular')->default(false);
            $table->boolean('status')->default(true);
            $table->unsignedBigInteger('view_count')->default(0);
            $table->string('meta_title')->nullable();
            $table->text('meta_description')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('products');
    }
};
