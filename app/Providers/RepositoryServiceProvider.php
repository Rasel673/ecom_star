<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use App\Contracts\CategoryRepositoryInterface;
use App\Repositories\CategoryRepository;
use App\Contracts\ProductRepositoryInterface;
use App\Repositories\ProductRepository;
use App\Contracts\BrandRepositoryInterface;
use App\Repositories\BrandRepository;
use App\Contracts\BannerRepositoryInterface;
use App\Repositories\BannerRepository;
use App\Contracts\OrderRepositoryInterface;
use App\Repositories\OrderRepository;

class RepositoryServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        $this->app->bind(CategoryRepositoryInterface::class, CategoryRepository::class);
        $this->app->bind(ProductRepositoryInterface::class, ProductRepository::class);
        $this->app->bind(BrandRepositoryInterface::class, BrandRepository::class);
        $this->app->bind(BannerRepositoryInterface::class, BannerRepository::class);
        $this->app->bind(OrderRepositoryInterface::class, OrderRepository::class);
    }

    public function boot(): void
    {
        //
    }
}
