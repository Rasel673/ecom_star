<?php

namespace App\Http\Controllers\Frontend;

use App\Http\Controllers\Controller;
use App\Contracts\BannerRepositoryInterface;
use App\Contracts\CategoryRepositoryInterface;
use App\Contracts\ProductRepositoryInterface;
use App\Contracts\BrandRepositoryInterface;
use Inertia\Inertia;
use Inertia\Response;

class HomeController extends Controller
{
    protected BannerRepositoryInterface $bannerRepo;
    protected CategoryRepositoryInterface $categoryRepo;
    protected ProductRepositoryInterface $productRepo;
    protected BrandRepositoryInterface $brandRepo;

    public function __construct(
        BannerRepositoryInterface $bannerRepo,
        CategoryRepositoryInterface $categoryRepo,
        ProductRepositoryInterface $productRepo,
        BrandRepositoryInterface $brandRepo
    ) {
        $this->bannerRepo = $bannerRepo;
        $this->categoryRepo = $categoryRepo;
        $this->productRepo = $productRepo;
        $this->brandRepo = $brandRepo;
    }

    public function index(): Response
    {
        $heroBanners = $this->bannerRepo->getByPosition('home_slider');
        $promoBanners = $this->bannerRepo->getByPosition('home_banner_2');
        $featuredCategories = $this->categoryRepo->getFeaturedCategories(16);
        $featuredProducts = $this->productRepo->getFeaturedProducts(8);
        $popularProducts = $this->productRepo->getPopularProducts(8);
        $latestProducts = $this->productRepo->getLatestProducts(8);
        $brands = $this->brandRepo->getFeaturedBrands(12);

        return Inertia::render('Frontend/Home', [
            'heroBanners' => $heroBanners,
            'promoBanners' => $promoBanners,
            'featuredCategories' => $featuredCategories,
            'featuredProducts' => $featuredProducts,
            'popularProducts' => $popularProducts,
            'latestProducts' => $latestProducts,
            'brands' => $brands,
            'seo' => [
                'title' => \App\Models\Setting::get('site_name', 'Tech Shoppers') . ' | ' . \App\Models\Setting::get('site_tagline', 'Leading Computer, Laptop & Component Shop in Bangladesh'),
                'description' => 'Buy Desktop PC, Laptop, Gaming Component, Monitor, Graphics Card, Processor at best price in Bangladesh from ' . \App\Models\Setting::get('site_name', 'Tech Shoppers') . '.',
            ],
        ]);
    }
}
