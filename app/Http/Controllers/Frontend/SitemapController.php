<?php

namespace App\Http\Controllers\Frontend;

use App\Http\Controllers\Controller;
use App\Models\Brand;
use App\Models\Category;
use App\Models\Page;
use App\Models\Product;
use App\Models\Setting;
use Illuminate\Http\Response;

class SitemapController extends Controller
{
    /**
     * Generate dynamic XML sitemap.
     */
    public function index(): Response
    {
        $appUrl = rtrim(config('app.url', url('/')), '/');
        $siteUrl = rtrim(Setting::get('seo_canonical_base', $appUrl), '/');

        $includeProducts = Setting::get('seo_sitemap_include_products', '1') === '1';
        $includeCategories = Setting::get('seo_sitemap_include_categories', '1') === '1';
        $includeBrands = Setting::get('seo_sitemap_include_brands', '1') === '1';
        $includePages = Setting::get('seo_sitemap_include_pages', '1') === '1';
        $includeCustom = Setting::get('seo_sitemap_include_custom', '1') === '1';

        $productPriority = Setting::get('seo_sitemap_products_priority', '0.8');
        $productFreq = Setting::get('seo_sitemap_products_freq', 'daily');

        $categoryPriority = Setting::get('seo_sitemap_categories_priority', '0.9');
        $categoryFreq = Setting::get('seo_sitemap_categories_freq', 'weekly');

        $pagePriority = Setting::get('seo_sitemap_pages_priority', '0.6');
        $pageFreq = Setting::get('seo_sitemap_pages_freq', 'monthly');

        $urls = [];

        // 1. Static Home & Core Routes
        if ($includeCustom) {
            $urls[] = [
                'loc' => $siteUrl . '/',
                'lastmod' => now()->toAtomString(),
                'changefreq' => 'daily',
                'priority' => '1.0',
            ];
            $urls[] = [
                'loc' => $siteUrl . '/pc-builder',
                'lastmod' => now()->toAtomString(),
                'changefreq' => 'weekly',
                'priority' => '0.8',
            ];
            $urls[] = [
                'loc' => $siteUrl . '/cart',
                'lastmod' => now()->toAtomString(),
                'changefreq' => 'monthly',
                'priority' => '0.3',
            ];
        }

        // 2. Categories
        if ($includeCategories) {
            $categories = Category::where('status', true)->select('slug', 'updated_at')->get();
            foreach ($categories as $cat) {
                $urls[] = [
                    'loc' => $siteUrl . '/category/' . $cat->slug,
                    'lastmod' => ($cat->updated_at ?? now())->toAtomString(),
                    'changefreq' => $categoryFreq,
                    'priority' => $categoryPriority,
                ];
            }
        }

        // 3. Products
        if ($includeProducts) {
            $products = Product::where('status', true)->select('slug', 'updated_at')->get();
            foreach ($products as $prod) {
                $urls[] = [
                    'loc' => $siteUrl . '/product/' . $prod->slug,
                    'lastmod' => ($prod->updated_at ?? now())->toAtomString(),
                    'changefreq' => $productFreq,
                    'priority' => $productPriority,
                ];
            }
        }

        // 4. Brands (filtered in category or brand page)
        if ($includeBrands) {
            $brands = Brand::where('status', true)->select('slug', 'updated_at')->get();
            foreach ($brands as $brand) {
                $urls[] = [
                    'loc' => $siteUrl . '/search?q=' . urlencode($brand->name ?? $brand->slug),
                    'lastmod' => ($brand->updated_at ?? now())->toAtomString(),
                    'changefreq' => 'weekly',
                    'priority' => '0.5',
                ];
            }
        }

        // 5. CMS Pages
        if ($includePages) {
            $pages = Page::where('is_active', true)->select('slug', 'updated_at')->get();
            foreach ($pages as $page) {
                $urls[] = [
                    'loc' => $siteUrl . '/page/' . $page->slug,
                    'lastmod' => ($page->updated_at ?? now())->toAtomString(),
                    'changefreq' => $pageFreq,
                    'priority' => $pagePriority,
                ];
            }
        }

        $xml = '<?xml version="1.0" encoding="UTF-8"?>' . "\n";
        $xml .= '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"' . "\n";
        $xml .= '        xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"' . "\n";
        $xml .= '        xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9 http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd">' . "\n";

        foreach ($urls as $u) {
            $xml .= "    <url>\n";
            $xml .= "        <loc>" . htmlspecialchars($u['loc'], ENT_XML1, 'UTF-8') . "</loc>\n";
            $xml .= "        <lastmod>" . $u['lastmod'] . "</lastmod>\n";
            $xml .= "        <changefreq>" . $u['changefreq'] . "</changefreq>\n";
            $xml .= "        <priority>" . $u['priority'] . "</priority>\n";
            $xml .= "    </url>\n";
        }

        $xml .= '</urlset>';

        return response($xml, 200, [
            'Content-Type' => 'application/xml; charset=utf-8',
            'X-Robots-Tag' => 'noindex',
        ]);
    }
}
