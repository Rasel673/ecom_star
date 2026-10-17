<?php

use App\Http\Controllers\Frontend\HomeController;
use App\Http\Controllers\Frontend\CategoryController;
use App\Http\Controllers\Frontend\ProductController;
use App\Http\Controllers\Frontend\CartController;
use App\Http\Controllers\Frontend\CheckoutController;
use App\Http\Controllers\Frontend\PcBuilderController;
use App\Http\Controllers\Frontend\SearchController;
use App\Http\Controllers\Admin\DashboardController as AdminDashboardController;
use App\Http\Controllers\Admin\CategoryController as AdminCategoryController;
use App\Http\Controllers\Admin\ProductController as AdminProductController;
use App\Http\Controllers\Admin\BrandController as AdminBrandController;
use App\Http\Controllers\Admin\OrderController as AdminOrderController;
use App\Http\Controllers\Admin\BannerController as AdminBannerController;
use App\Http\Controllers\Frontend\CustomerDashboardController;
use App\Http\Controllers\Frontend\PageController;
use App\Http\Controllers\Admin\SupportController;
use App\Http\Controllers\Admin\AdminPageController;
use App\Http\Controllers\Admin\SettingController;
use App\Http\Controllers\Admin\SeoController;
use App\Http\Controllers\Frontend\SitemapController;
use App\Http\Controllers\ProfileController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Frontend Routes
|--------------------------------------------------------------------------
*/
Route::get('/', [HomeController::class, 'index'])->name('home');
Route::get('/category/{slug}', [CategoryController::class, 'show'])->name('category.show');
Route::get('/product/{slug}', [ProductController::class, 'show'])->name('product.show');
Route::post('/product/{slug}/review', [ProductController::class, 'storeReview'])->name('product.review');

// Search & Autocomplete
Route::get('/search', [SearchController::class, 'index'])->name('search');
Route::get('/api/search/autocomplete', [SearchController::class, 'autocomplete'])->name('search.autocomplete');

// Cart Routes
Route::get('/cart', [CartController::class, 'index'])->name('cart.index');
Route::post('/cart/add', [CartController::class, 'add'])->name('cart.add');
Route::post('/cart/add-bulk', [CartController::class, 'addBulk'])->name('cart.addBulk');
Route::post('/cart/update', [CartController::class, 'update'])->name('cart.update');
Route::delete('/cart/{id}', [CartController::class, 'remove'])->name('cart.remove');
Route::post('/cart/coupon', [CartController::class, 'applyCoupon'])->name('cart.coupon');
Route::delete('/cart/coupon', [CartController::class, 'removeCoupon'])->name('cart.coupon.remove');

// Checkout & Orders
Route::get('/checkout', [CheckoutController::class, 'index'])->name('checkout.index');
Route::post('/checkout', [CheckoutController::class, 'store'])->name('checkout.store');
Route::get('/order/success/{orderNumber}', [CheckoutController::class, 'success'])->name('order.success');

// PC Builder
Route::get('/pc-builder', [PcBuilderController::class, 'index'])->name('pcbuilder.index');
Route::get('/pc-builder/choose/{componentSlug}', [PcBuilderController::class, 'selectComponent'])->name('pcbuilder.select');

// Pre-Order endpoint
Route::post('/pre-order', [CustomerDashboardController::class, 'storePreOrder'])->name('preorder.store');

// Dynamic CMS Pages & Interactive Features
Route::get('/page/{slug}', [PageController::class, 'show'])->name('page.show');
Route::post('/page/inquiry', [PageController::class, 'submitInquiry'])->name('page.inquiry');
Route::get('/order-tracking', fn() => redirect()->route('page.show', 'order-tracking'));
Route::get('/emi-calculation', fn() => redirect()->route('page.show', 'emi-calculation'));
Route::get('/contact-us', fn() => redirect()->route('page.show', 'contact-us'));
Route::get('/sitemap.xml', [SitemapController::class, 'index'])->name('sitemap');

// Customer Auth & Features
Route::middleware(['auth'])->group(function () {
    Route::get('/dashboard', [CustomerDashboardController::class, 'index'])->name('dashboard');
    Route::post('/customer/pc-builds', [CustomerDashboardController::class, 'savePcBuild'])->name('customer.pcbuild.save');
    Route::delete('/customer/pc-builds/{pcBuild}', [CustomerDashboardController::class, 'deletePcBuild'])->name('customer.pcbuild.delete');
    Route::post('/customer/wishlist', [CustomerDashboardController::class, 'toggleWishlist'])->name('customer.wishlist.toggle');
    Route::post('/customer/messages', [CustomerDashboardController::class, 'storeMessage'])->name('customer.message.store');

    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

/*
|--------------------------------------------------------------------------
| Admin Routes
|--------------------------------------------------------------------------
*/
Route::middleware(['auth', 'admin'])->prefix('admin')->name('admin.')->group(function () {
    Route::get('/', [AdminDashboardController::class, 'index'])->name('dashboard');
    
    // Categories CRUD
    Route::resource('categories', AdminCategoryController::class);
    
    // Products CRUD
    Route::resource('products', AdminProductController::class);
    
    // Brands CRUD
    Route::resource('brands', AdminBrandController::class)->except(['create', 'show', 'edit']);
    
    // Orders
    Route::get('/orders', [AdminOrderController::class, 'index'])->name('orders.index');
    Route::get('/orders/{order}', [AdminOrderController::class, 'show'])->name('orders.show');
    Route::patch('/orders/{order}/status', [AdminOrderController::class, 'updateStatus'])->name('orders.status');
    Route::patch('/orders/{order}/fraud', [AdminOrderController::class, 'updateFraudStatus'])->name('orders.fraud');
    Route::post('/orders/{order}/courier', [AdminOrderController::class, 'dispatchCourier'])->name('orders.courier');
    
    // Banners
    Route::get('/banners', [AdminBannerController::class, 'index'])->name('banners.index');
    Route::post('/banners', [AdminBannerController::class, 'store'])->name('banners.store');
    Route::put('/banners/{banner}', [AdminBannerController::class, 'update'])->name('banners.update');
    Route::delete('/banners/{banner}', [AdminBannerController::class, 'destroy'])->name('banners.destroy');

    // Customer Messages & Support
    Route::get('/messages', [SupportController::class, 'messagesIndex'])->name('messages.index');
    Route::post('/messages/{message}/reply', [SupportController::class, 'replyMessage'])->name('messages.reply');

    // Pre-Orders Management
    Route::get('/pre-orders', [SupportController::class, 'preOrdersIndex'])->name('preorders.index');
    Route::patch('/pre-orders/{preOrder}', [SupportController::class, 'updatePreOrderStatus'])->name('preorders.status');

    // Dynamic Pages CMS CRUD
    Route::resource('pages', AdminPageController::class);
    Route::patch('/pages/{page}/toggle-status', [AdminPageController::class, 'toggleStatus'])->name('pages.toggle-status');

    // Site Settings
    Route::get('/settings', [SettingController::class, 'index'])->name('settings.index');
    Route::post('/settings', [SettingController::class, 'update'])->name('settings.update');

    // SEO Control Panel
    Route::get('/seo', [SeoController::class, 'index'])->name('seo.index');
    Route::post('/seo/general', [SeoController::class, 'updateGeneral'])->name('seo.general');
    Route::post('/seo/social', [SeoController::class, 'updateSocial'])->name('seo.social');
    Route::post('/seo/webmaster', [SeoController::class, 'updateWebmaster'])->name('seo.webmaster');
    Route::post('/seo/analytics', [SeoController::class, 'updateAnalytics'])->name('seo.analytics');
    Route::post('/seo/sitemap', [SeoController::class, 'updateSitemap'])->name('seo.sitemap');
    Route::post('/seo/robots', [SeoController::class, 'updateRobots'])->name('seo.robots');
    Route::post('/seo/schema', [SeoController::class, 'updateSchema'])->name('seo.schema');

    // SEO 301/302 Redirections
    Route::post('/seo/redirects', [SeoController::class, 'storeRedirect'])->name('seo.redirects.store');
    Route::put('/seo/redirects/{redirect}', [SeoController::class, 'updateRedirect'])->name('seo.redirects.update');
    Route::delete('/seo/redirects/{redirect}', [SeoController::class, 'destroyRedirect'])->name('seo.redirects.destroy');
    Route::patch('/seo/redirects/{redirect}/toggle', [SeoController::class, 'toggleRedirect'])->name('seo.redirects.toggle');
});

require __DIR__.'/auth.php';
