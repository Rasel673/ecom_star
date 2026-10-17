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
        Schema::create('seo_redirects', function (Blueprint $table) {
            $table->id();
            $table->string('source_path')->index();
            $table->string('target_path');
            $table->smallInteger('status_code')->default(301);
            $table->boolean('is_active')->default(true);
            $table->unsignedBigInteger('hits')->default(0);
            $table->timestamp('last_accessed_at')->nullable();
            $table->timestamps();
        });

        if (Schema::hasTable('settings')) {
            Schema::table('settings', function (Blueprint $table) {
                $table->mediumText('value')->nullable()->change();
            });
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('seo_redirects');
    }
};
