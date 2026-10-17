<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Brand;
use App\Models\Category;
use App\Models\Page;
use App\Models\Product;
use App\Models\SeoRedirect;
use App\Models\Setting;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Support\Facades\File;

class SeoController extends Controller
{
    /**
     * Display the SEO Control Panel.
     */
    public function index(): Response
    {
        $settings = Setting::pluck('value', 'key')->toArray();

        // SEO Health / Audit Calculation
        $totalProducts = Product::count();
        $productsWithMeta = Product::whereNotNull('meta_title')->where('meta_title', '!=', '')->count();
        $totalCategories = Category::count();
        $categoriesWithMeta = Category::whereNotNull('meta_title')->where('meta_title', '!=', '')->count();
        $totalPages = Page::count();
        $totalBrands = Brand::count();

        // Check robots.txt content
        $robotsPath = public_path('robots.txt');
        $robotsContent = File::exists($robotsPath) ? File::get($robotsPath) : ($settings['seo_robots_txt'] ?? "User-agent: *\nDisallow: /admin/\nDisallow: /cart\nDisallow: /checkout\n\nSitemap: " . url('/sitemap.xml'));

        // Calculate SEO Audit score
        $checks = [
            'meta_title' => !empty($settings['seo_meta_title'] ?? $settings['site_name'] ?? null),
            'meta_description' => !empty($settings['seo_meta_description'] ?? $settings['site_tagline'] ?? null),
            'og_image' => !empty($settings['seo_og_image'] ?? $settings['site_logo'] ?? null),
            'google_verification' => !empty($settings['seo_google_verification'] ?? null),
            'analytics_tracking' => !empty($settings['seo_ga4_id'] ?? $settings['seo_gtm_id'] ?? null),
            'robots_txt' => File::exists($robotsPath) && strlen(trim($robotsContent)) > 10,
            'schema_org' => ($settings['seo_schema_org_enabled'] ?? '1') === '1',
            'product_meta' => $totalProducts > 0 ? ($productsWithMeta / $totalProducts >= 0.5) : true,
            'canonical_base' => !empty($settings['seo_canonical_base'] ?? config('app.url')),
            'sitemap_active' => ($settings['seo_sitemap_include_products'] ?? '1') === '1',
        ];

        $passedChecks = count(array_filter($checks));
        $seoScore = round(($passedChecks / count($checks)) * 100);

        // Redirects
        $redirects = SeoRedirect::orderBy('id', 'desc')->get();

        return Inertia::render('Admin/Seo/Index', [
            'settings' => $settings,
            'stats' => [
                'total_products' => $totalProducts,
                'products_with_meta' => $productsWithMeta,
                'total_categories' => $totalCategories,
                'categories_with_meta' => $categoriesWithMeta,
                'total_pages' => $totalPages,
                'total_brands' => $totalBrands,
                'total_redirects' => $redirects->count(),
                'seo_score' => $seoScore,
                'audit_checks' => $checks,
            ],
            'robotsContent' => $robotsContent,
            'redirects' => $redirects,
            'sitemapUrl' => url('/sitemap.xml'),
            'robotsUrl' => url('/robots.txt'),
        ]);
    }

    /**
     * Update General Meta Settings.
     */
    public function updateGeneral(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'seo_meta_title' => 'nullable|string|max:255',
            'seo_meta_description' => 'nullable|string|max:1000',
            'seo_meta_keywords' => 'nullable|string|max:1000',
            'seo_author' => 'nullable|string|max:255',
            'seo_canonical_base' => 'nullable|url|max:500',
            'seo_robots_index' => 'nullable|in:index,noindex',
            'seo_robots_follow' => 'nullable|in:follow,nofollow',
            'seo_robots_advanced' => 'nullable|string|max:255',
        ]);

        foreach ($validated as $key => $value) {
            Setting::set($key, $value);
        }

        return back()->with('success', 'General SEO and Meta settings updated successfully!');
    }

    /**
     * Update Social & OpenGraph Settings.
     */
    public function updateSocial(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'seo_og_title' => 'nullable|string|max:255',
            'seo_og_description' => 'nullable|string|max:1000',
            'seo_og_type' => 'nullable|string|max:50',
            'seo_twitter_card' => 'nullable|in:summary,summary_large_image',
            'seo_twitter_site' => 'nullable|string|max:100',
            'seo_twitter_creator' => 'nullable|string|max:100',
            'seo_fb_app_id' => 'nullable|string|max:100',
            'seo_og_image_file' => 'nullable|image|mimes:jpeg,png,jpg,gif,webp|max:4096',
            'seo_og_image_url' => 'nullable|string|max:1000',
        ]);

        $fields = [
            'seo_og_title',
            'seo_og_description',
            'seo_og_type',
            'seo_twitter_card',
            'seo_twitter_site',
            'seo_twitter_creator',
            'seo_fb_app_id',
        ];

        foreach ($fields as $field) {
            if ($request->has($field)) {
                Setting::set($field, $request->input($field));
            }
        }

        // Handle OG Image
        if ($request->boolean('remove_seo_og_image')) {
            Setting::set('seo_og_image', null);
        } elseif ($request->hasFile('seo_og_image_file')) {
            $path = $request->file('seo_og_image_file')->store('seo', 'public');
            Setting::set('seo_og_image', '/storage/' . $path);
        } elseif ($request->filled('seo_og_image_url')) {
            Setting::set('seo_og_image', $request->input('seo_og_image_url'));
        }

        return back()->with('success', 'Social Media and Open Graph settings saved!');
    }

    /**
     * Update Webmaster Verification codes.
     */
    public function updateWebmaster(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'seo_google_verification' => 'nullable|string|max:500',
            'seo_bing_verification' => 'nullable|string|max:500',
            'seo_pinterest_verification' => 'nullable|string|max:500',
            'seo_yandex_verification' => 'nullable|string|max:500',
        ]);

        foreach ($validated as $key => $value) {
            // Strip tags in case the user pasted full <meta ...> tag
            if ($value && str_contains($value, 'content="')) {
                preg_match('/content="([^"]+)"/', $value, $matches);
                if (!empty($matches[1])) {
                    $value = $matches[1];
                }
            }
            Setting::set($key, $value);
        }

        return back()->with('success', 'Search Engine Webmaster verification codes updated!');
    }

    /**
     * Update Analytics & Tracking scripts.
     */
    public function updateAnalytics(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'seo_ga4_id' => 'nullable|string|max:100',
            'seo_gtm_id' => 'nullable|string|max:100',
            'seo_fb_pixel_id' => 'nullable|string|max:100',
            'seo_custom_head_scripts' => 'nullable|string|max:50000',
            'seo_custom_body_scripts' => 'nullable|string|max:50000',
        ]);

        foreach ($validated as $key => $value) {
            Setting::set($key, $value);
        }

        return back()->with('success', 'Analytics, Pixels and Tracking codes updated!');
    }

    /**
     * Update XML Sitemap Configuration.
     */
    public function updateSitemap(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'seo_sitemap_include_products' => 'required|in:0,1',
            'seo_sitemap_include_categories' => 'required|in:0,1',
            'seo_sitemap_include_brands' => 'required|in:0,1',
            'seo_sitemap_include_pages' => 'required|in:0,1',
            'seo_sitemap_include_custom' => 'required|in:0,1',
            'seo_sitemap_products_priority' => 'required|numeric|between:0.1,1.0',
            'seo_sitemap_products_freq' => 'required|in:always,hourly,daily,weekly,monthly,yearly,never',
            'seo_sitemap_categories_priority' => 'required|numeric|between:0.1,1.0',
            'seo_sitemap_categories_freq' => 'required|in:always,hourly,daily,weekly,monthly,yearly,never',
            'seo_sitemap_pages_priority' => 'required|numeric|between:0.1,1.0',
            'seo_sitemap_pages_freq' => 'required|in:always,hourly,daily,weekly,monthly,yearly,never',
        ]);

        foreach ($validated as $key => $value) {
            Setting::set($key, (string)$value);
        }

        return back()->with('success', 'XML Sitemap settings updated successfully!');
    }

    /**
     * Update Robots.txt file.
     */
    public function updateRobots(Request $request): RedirectResponse
    {
        $request->validate([
            'robots_content' => 'required|string|max:10000',
        ]);

        $content = $request->input('robots_content');
        $robotsPath = public_path('robots.txt');

        try {
            File::put($robotsPath, $content);
            Setting::set('seo_robots_txt', $content);
            return back()->with('success', 'robots.txt file successfully saved and updated live!');
        } catch (\Exception $e) {
            return back()->with('error', 'Failed to write robots.txt: ' . $e->getMessage());
        }
    }

    /**
     * Update Schema.org Structured Data settings.
     */
    public function updateSchema(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'seo_schema_org_enabled' => 'required|in:0,1',
            'seo_schema_org_name' => 'nullable|string|max:255',
            'seo_schema_org_logo' => 'nullable|string|max:1000',
            'seo_schema_org_phone' => 'nullable|string|max:100',
            'seo_schema_org_email' => 'nullable|email|max:255',
            'seo_schema_org_address' => 'nullable|string|max:1000',
            'seo_schema_search_enabled' => 'required|in:0,1',
            'seo_schema_product_enabled' => 'required|in:0,1',
            'seo_schema_breadcrumbs_enabled' => 'required|in:0,1',
        ]);

        foreach ($validated as $key => $value) {
            Setting::set($key, (string)$value);
        }

        return back()->with('success', 'Schema.org Structured Data settings updated!');
    }

    /**
     * Store new 301/302 Redirect.
     */
    public function storeRedirect(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'source_path' => 'required|string|max:500|unique:seo_redirects,source_path',
            'target_path' => 'required|string|max:500',
            'status_code' => 'required|in:301,302',
            'is_active' => 'boolean',
        ]);

        // Normalize source path
        $source = '/' . ltrim(trim($validated['source_path']), '/');
        $target = trim($validated['target_path']);

        SeoRedirect::create([
            'source_path' => $source,
            'target_path' => $target,
            'status_code' => $validated['status_code'],
            'is_active' => $request->boolean('is_active', true),
            'hits' => 0,
        ]);

        return back()->with('success', 'Redirection rule created successfully!');
    }

    /**
     * Update existing Redirect.
     */
    public function updateRedirect(Request $request, SeoRedirect $redirect): RedirectResponse
    {
        $validated = $request->validate([
            'source_path' => 'required|string|max:500|unique:seo_redirects,source_path,' . $redirect->id,
            'target_path' => 'required|string|max:500',
            'status_code' => 'required|in:301,302',
            'is_active' => 'boolean',
        ]);

        $source = '/' . ltrim(trim($validated['source_path']), '/');

        $redirect->update([
            'source_path' => $source,
            'target_path' => trim($validated['target_path']),
            'status_code' => $validated['status_code'],
            'is_active' => $request->boolean('is_active', true),
        ]);

        return back()->with('success', 'Redirection rule updated!');
    }

    /**
     * Delete Redirect.
     */
    public function destroyRedirect(SeoRedirect $redirect): RedirectResponse
    {
        $redirect->delete();
        return back()->with('success', 'Redirection rule removed.');
    }

    /**
     * Toggle Redirect Status.
     */
    public function toggleRedirect(SeoRedirect $redirect): RedirectResponse
    {
        $redirect->update(['is_active' => !$redirect->is_active]);
        return back()->with('success', 'Redirect status toggled.');
    }
}
