import React, { useState } from 'react';
import { Head, useForm, router, Link } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import {
    Search,
    Globe,
    Share2,
    ShieldCheck,
    BarChart3,
    FileCode,
    Sliders,
    ArrowRightLeft,
    Sparkles,
    CheckCircle2,
    AlertCircle,
    Save,
    ExternalLink,
    Upload,
    Trash2,
    Plus,
    RefreshCw,
    Copy,
    Check,
    HelpCircle,
    Eye,
    Laptop,
    Smartphone,
    Terminal,
    Code,
    Layers,
    CheckSquare,
    AlertTriangle
} from 'lucide-react';

export default function SeoIndex({
    settings = {},
    stats = {},
    robotsContent = '',
    redirects = [],
    sitemapUrl = '',
    robotsUrl = '',
}) {
    const [activeTab, setActiveTab] = useState('audit');
    const [previewDevice, setPreviewDevice] = useState('desktop');
    const [copiedField, setCopiedField] = useState(null);
    const [editingRedirect, setEditingRedirect] = useState(null);
    const [showRedirectModal, setShowRedirectModal] = useState(false);

    const siteName = settings?.site_name || 'Tech Shoppers';
    const siteTagline = settings?.site_tagline || 'Leading Computer & Laptop Shop in Bangladesh';

    // 1. General Meta Form
    const generalForm = useForm({
        seo_meta_title: settings.seo_meta_title || '',
        seo_meta_description: settings.seo_meta_description || '',
        seo_meta_keywords: settings.seo_meta_keywords || '',
        seo_author: settings.seo_author || siteName,
        seo_canonical_base: settings.seo_canonical_base || '',
        seo_robots_index: settings.seo_robots_index || 'index',
        seo_robots_follow: settings.seo_robots_follow || 'follow',
        seo_robots_advanced: settings.seo_robots_advanced || 'max-image-preview:large',
    });

    const submitGeneral = (e) => {
        e.preventDefault();
        generalForm.post(route('admin.seo.general'), { preserveScroll: true });
    };

    // 2. Social & OG Form
    const socialForm = useForm({
        seo_og_title: settings.seo_og_title || '',
        seo_og_description: settings.seo_og_description || '',
        seo_og_type: settings.seo_og_type || 'website',
        seo_twitter_card: settings.seo_twitter_card || 'summary_large_image',
        seo_twitter_site: settings.seo_twitter_site || '',
        seo_twitter_creator: settings.seo_twitter_creator || '',
        seo_fb_app_id: settings.seo_fb_app_id || '',
        seo_og_image_file: null,
        seo_og_image_url: settings.seo_og_image || '',
        remove_seo_og_image: false,
    });

    const [ogPreview, setOgPreview] = useState(settings.seo_og_image || null);

    const handleOgFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            socialForm.setData('seo_og_image_file', file);
            socialForm.setData('remove_seo_og_image', false);
            setOgPreview(URL.createObjectURL(file));
        }
    };

    const removeOgImage = () => {
        socialForm.setData('seo_og_image_file', null);
        socialForm.setData('seo_og_image_url', '');
        socialForm.setData('remove_seo_og_image', true);
        setOgPreview(null);
    };

    const submitSocial = (e) => {
        e.preventDefault();
        socialForm.post(route('admin.seo.social'), { preserveScroll: true });
    };

    // 3. Webmaster Form
    const webmasterForm = useForm({
        seo_google_verification: settings.seo_google_verification || '',
        seo_bing_verification: settings.seo_bing_verification || '',
        seo_pinterest_verification: settings.seo_pinterest_verification || '',
        seo_yandex_verification: settings.seo_yandex_verification || '',
    });

    const submitWebmaster = (e) => {
        e.preventDefault();
        webmasterForm.post(route('admin.seo.webmaster'), { preserveScroll: true });
    };

    // 4. Analytics Form
    const analyticsForm = useForm({
        seo_ga4_id: settings.seo_ga4_id || '',
        seo_gtm_id: settings.seo_gtm_id || '',
        seo_fb_pixel_id: settings.seo_fb_pixel_id || '',
        seo_custom_head_scripts: settings.seo_custom_head_scripts || '',
        seo_custom_body_scripts: settings.seo_custom_body_scripts || '',
    });

    const submitAnalytics = (e) => {
        e.preventDefault();
        analyticsForm.post(route('admin.seo.analytics'), { preserveScroll: true });
    };

    // 5. Sitemap Form
    const sitemapForm = useForm({
        seo_sitemap_include_products: settings.seo_sitemap_include_products ?? '1',
        seo_sitemap_include_categories: settings.seo_sitemap_include_categories ?? '1',
        seo_sitemap_include_brands: settings.seo_sitemap_include_brands ?? '1',
        seo_sitemap_include_pages: settings.seo_sitemap_include_pages ?? '1',
        seo_sitemap_include_custom: settings.seo_sitemap_include_custom ?? '1',
        seo_sitemap_products_priority: settings.seo_sitemap_products_priority || '0.8',
        seo_sitemap_products_freq: settings.seo_sitemap_products_freq || 'daily',
        seo_sitemap_categories_priority: settings.seo_sitemap_categories_priority || '0.9',
        seo_sitemap_categories_freq: settings.seo_sitemap_categories_freq || 'weekly',
        seo_sitemap_pages_priority: settings.seo_sitemap_pages_priority || '0.6',
        seo_sitemap_pages_freq: settings.seo_sitemap_pages_freq || 'monthly',
    });

    const submitSitemap = (e) => {
        e.preventDefault();
        sitemapForm.post(route('admin.seo.sitemap'), { preserveScroll: true });
    };

    // 6. Robots Form
    const robotsForm = useForm({
        robots_content: robotsContent || '',
    });

    const submitRobots = (e) => {
        e.preventDefault();
        robotsForm.post(route('admin.seo.robots'), { preserveScroll: true });
    };

    const applyRobotsPreset = (preset) => {
        const origin = window.location.origin;
        if (preset === 'ecommerce') {
            robotsForm.setData('robots_content', `User-agent: *\nAllow: /\nDisallow: /admin/\nDisallow: /cart\nDisallow: /checkout\nDisallow: /profile\nDisallow: /dashboard\nDisallow: /login\nDisallow: /register\n\nSitemap: ${origin}/sitemap.xml`);
        } else if (preset === 'allow_all') {
            robotsForm.setData('robots_content', `User-agent: *\nAllow: /\n\nSitemap: ${origin}/sitemap.xml`);
        } else if (preset === 'block_all') {
            robotsForm.setData('robots_content', `User-agent: *\nDisallow: /`);
        }
    };

    // 7. Schema Form
    const schemaForm = useForm({
        seo_schema_org_enabled: settings.seo_schema_org_enabled ?? '1',
        seo_schema_org_name: settings.seo_schema_org_name || siteName,
        seo_schema_org_logo: settings.seo_schema_org_logo || settings.site_logo || '',
        seo_schema_org_phone: settings.seo_schema_org_phone || settings.hotline || settings.phone || '',
        seo_schema_org_email: settings.seo_schema_org_email || settings.email || '',
        seo_schema_org_address: settings.seo_schema_org_address || settings.address || '',
        seo_schema_search_enabled: settings.seo_schema_search_enabled ?? '1',
        seo_schema_product_enabled: settings.seo_schema_product_enabled ?? '1',
        seo_schema_breadcrumbs_enabled: settings.seo_schema_breadcrumbs_enabled ?? '1',
    });

    const submitSchema = (e) => {
        e.preventDefault();
        schemaForm.post(route('admin.seo.schema'), { preserveScroll: true });
    };

    // 8. Redirects Form
    const redirectForm = useForm({
        source_path: '',
        target_path: '',
        status_code: '301',
        is_active: true,
    });

    const handleCreateOrUpdateRedirect = (e) => {
        e.preventDefault();
        if (editingRedirect) {
            redirectForm.put(route('admin.seo.redirects.update', editingRedirect.id), {
                preserveScroll: true,
                onSuccess: () => {
                    setEditingRedirect(null);
                    setShowRedirectModal(false);
                    redirectForm.reset();
                }
            });
        } else {
            redirectForm.post(route('admin.seo.redirects.store'), {
                preserveScroll: true,
                onSuccess: () => {
                    setShowRedirectModal(false);
                    redirectForm.reset();
                }
            });
        }
    };

    const startEditRedirect = (red) => {
        setEditingRedirect(red);
        redirectForm.setData({
            source_path: red.source_path,
            target_path: red.target_path,
            status_code: String(red.status_code),
            is_active: red.is_active,
        });
        setShowRedirectModal(true);
    };

    const deleteRedirect = (id) => {
        if (confirm('Are you sure you want to delete this redirection rule?')) {
            router.delete(route('admin.seo.redirects.destroy', id), { preserveScroll: true });
        }
    };

    const toggleRedirect = (id) => {
        router.patch(route('admin.seo.redirects.toggle', id), {}, { preserveScroll: true });
    };

    const copyToClipboard = (text, fieldName) => {
        navigator.clipboard.writeText(text);
        setCopiedField(fieldName);
        setTimeout(() => setCopiedField(null), 2000);
    };

    // Live SERP Preview calculations
    const serpTitle = generalForm.data.seo_meta_title || `${siteName} | ${siteTagline}`;
    const serpDesc = generalForm.data.seo_meta_description || `${siteName} is Bangladesh's top e-commerce platform offering best prices on laptops, gaming components, PC builds and tech gadgets.`;
    const canonicalDomain = generalForm.data.seo_canonical_base || (typeof window !== 'undefined' ? window.location.origin : 'https://techshoppers.com.bd');

    const tabs = [
        { id: 'audit', label: 'SEO Audit & Simulator', icon: Sparkles, badge: `${stats.seo_score || 0}%` },
        { id: 'meta', label: 'Global Meta & Robots', icon: Globe },
        { id: 'social', label: 'Open Graph & Social', icon: Share2 },
        { id: 'webmaster', label: 'Webmaster Verification', icon: ShieldCheck },
        { id: 'analytics', label: 'Analytics & Tracking', icon: BarChart3 },
        { id: 'sitemap', label: 'XML Sitemap', icon: Layers },
        { id: 'robots', label: 'Robots.txt Editor', icon: Terminal },
        { id: 'schema', label: 'Schema (JSON-LD)', icon: Code },
        { id: 'redirects', label: '301 URL Redirects', icon: ArrowRightLeft, count: redirects.length },
    ];

    return (
        <AdminLayout title="SEO & Webmaster Suite">
            <Head>
                <title>SEO & Webmaster Suite | Admin</title>
            </Head>

            <div className="space-y-6">
                {/* Top Header Card */}
                <div className="bg-gradient-to-r from-[#081621] via-[#0F2438] to-[#1E3A5F] rounded-2xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden border border-gray-800">
                    <div className="absolute right-0 top-0 bottom-0 w-96 bg-gradient-to-l from-[#EF4A23]/20 via-transparent to-transparent pointer-events-none" />
                    <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                        <div>
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-orange-400 text-xs font-semibold uppercase tracking-wider mb-3">
                                <Sparkles className="w-3.5 h-3.5" />
                                Comprehensive Search Engine Optimization Engine
                            </div>
                            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                                SEO Control Panel & Webmaster Suite
                            </h1>
                            <p className="text-gray-300 text-xs sm:text-sm mt-1 max-w-2xl leading-relaxed">
                                Complete native SEO suite replacing Rank Math & Yoast. Full control over Meta tags, XML Sitemap, Robots.txt, Open Graph, Webmaster Verification, Google Analytics 4, Tag Manager, Schema.org Structured Data, and 301 Redirections.
                            </p>
                        </div>

                        {/* Health Score Badge */}
                        <div className="flex items-center gap-4 bg-white/5 border border-white/10 backdrop-blur-md rounded-2xl p-4 shrink-0">
                            <div className="relative w-16 h-16 flex items-center justify-center">
                                <svg className="w-16 h-16 transform -rotate-90">
                                    <circle
                                        cx="32"
                                        cy="32"
                                        r="28"
                                        stroke="currentColor"
                                        strokeWidth="6"
                                        className="text-white/10"
                                        fill="transparent"
                                    />
                                    <circle
                                        cx="32"
                                        cy="32"
                                        r="28"
                                        stroke="currentColor"
                                        strokeWidth="6"
                                        strokeDasharray={2 * Math.PI * 28}
                                        strokeDashoffset={(2 * Math.PI * 28) * (1 - (stats.seo_score || 0) / 100)}
                                        strokeLinecap="round"
                                        className={stats.seo_score >= 80 ? 'text-emerald-400' : stats.seo_score >= 50 ? 'text-amber-400' : 'text-rose-400'}
                                        fill="transparent"
                                    />
                                </svg>
                                <span className="absolute text-sm font-black text-white">{stats.seo_score || 0}%</span>
                            </div>
                            <div>
                                <div className="text-xs uppercase font-bold text-gray-400">SEO Health Score</div>
                                <div className="text-sm font-bold text-white mt-0.5">
                                    {stats.seo_score >= 80 ? 'Optimized' : stats.seo_score >= 50 ? 'Good Progress' : 'Needs Setup'}
                                </div>
                                <div className="text-[11px] text-gray-400 mt-0.5">
                                    {stats.products_with_meta} of {stats.total_products} products indexed
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Quick Tools Links Bar */}
                    <div className="mt-6 pt-5 border-t border-white/10 flex flex-wrap items-center gap-3 text-xs">
                        <a
                            href={sitemapUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white/10 hover:bg-white/20 text-white rounded-lg transition font-medium"
                        >
                            <Layers className="w-3.5 h-3.5 text-orange-400" />
                            View sitemap.xml
                            <ExternalLink className="w-3 h-3 text-gray-400" />
                        </a>
                        <a
                            href={robotsUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white/10 hover:bg-white/20 text-white rounded-lg transition font-medium"
                        >
                            <Terminal className="w-3.5 h-3.5 text-blue-400" />
                            View robots.txt
                            <ExternalLink className="w-3 h-3 text-gray-400" />
                        </a>
                        <a
                            href={`https://search.google.com/test/rich-results?url=${encodeURIComponent(canonicalDomain)}`}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white/10 hover:bg-white/20 text-white rounded-lg transition font-medium"
                        >
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                            Google Rich Results Test
                            <ExternalLink className="w-3 h-3 text-gray-400" />
                        </a>
                        <a
                            href={`https://developers.facebook.com/tools/debug/?q=${encodeURIComponent(canonicalDomain)}`}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white/10 hover:bg-white/20 text-white rounded-lg transition font-medium"
                        >
                            <Share2 className="w-3.5 h-3.5 text-sky-400" />
                            Facebook Sharing Debugger
                            <ExternalLink className="w-3 h-3 text-gray-400" />
                        </a>
                        <a
                            href={`https://pagespeed.web.dev/report?url=${encodeURIComponent(canonicalDomain)}`}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white/10 hover:bg-white/20 text-white rounded-lg transition font-medium"
                        >
                            <BarChart3 className="w-3.5 h-3.5 text-amber-400" />
                            PageSpeed Insights
                            <ExternalLink className="w-3 h-3 text-gray-400" />
                        </a>
                    </div>
                </div>

                {/* Tab Navigation Navigation Bar */}
                <div className="bg-white rounded-2xl border border-gray-200/90 shadow-sm p-2 overflow-x-auto">
                    <div className="flex items-center gap-1 min-w-max">
                        {tabs.map((tab) => {
                            const Icon = tab.icon;
                            const isActive = activeTab === tab.id;
                            return (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold transition ${
                                        isActive
                                            ? 'bg-[#081621] text-white shadow'
                                            : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                                    }`}
                                >
                                    <Icon className={`w-4 h-4 ${isActive ? 'text-[#EF4A23]' : 'text-gray-400'}`} />
                                    <span>{tab.label}</span>
                                    {tab.badge && (
                                        <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold ${
                                            isActive ? 'bg-[#EF4A23] text-white' : 'bg-gray-100 text-gray-700'
                                        }`}>
                                            {tab.badge}
                                        </span>
                                    )}
                                    {tab.count !== undefined && (
                                        <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold ${
                                            isActive ? 'bg-white/20 text-white' : 'bg-gray-200 text-gray-700'
                                        }`}>
                                            {tab.count}
                                        </span>
                                    )}
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* TAB 1: SEO AUDIT & LIVE SERP SIMULATOR */}
                {activeTab === 'audit' && (
                    <div className="space-y-6">
                        {/* Stats Grid */}
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                            <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm">
                                <div className="text-xs text-gray-500 font-medium">Catalog Products</div>
                                <div className="text-2xl font-black text-gray-900 mt-1">{stats.total_products || 0}</div>
                                <div className="text-[11px] text-emerald-600 font-semibold mt-1 flex items-center gap-1">
                                    <CheckCircle2 className="w-3.5 h-3.5" />
                                    {stats.products_with_meta} with custom SEO tags
                                </div>
                            </div>
                            <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm">
                                <div className="text-xs text-gray-500 font-medium">Categories Indexed</div>
                                <div className="text-2xl font-black text-gray-900 mt-1">{stats.total_categories || 0}</div>
                                <div className="text-[11px] text-blue-600 font-semibold mt-1 flex items-center gap-1">
                                    <CheckCircle2 className="w-3.5 h-3.5" />
                                    {stats.categories_with_meta} configured
                                </div>
                            </div>
                            <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm">
                                <div className="text-xs text-gray-500 font-medium">CMS Pages & Brands</div>
                                <div className="text-2xl font-black text-gray-900 mt-1">{(stats.total_pages || 0) + (stats.total_brands || 0)}</div>
                                <div className="text-[11px] text-purple-600 font-semibold mt-1 flex items-center gap-1">
                                    <Globe className="w-3.5 h-3.5" />
                                    Dynamic in sitemap.xml
                                </div>
                            </div>
                            <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm">
                                <div className="text-xs text-gray-500 font-medium">Active 301 Redirects</div>
                                <div className="text-2xl font-black text-[#EF4A23] mt-1">{stats.total_redirects || 0}</div>
                                <div className="text-[11px] text-gray-500 font-semibold mt-1">
                                    Protecting SEO backlinks
                                </div>
                            </div>
                        </div>

                        {/* Audit Checklist Card */}
                        <div className="bg-white rounded-2xl border border-gray-200/90 shadow-sm p-6">
                            <h2 className="text-base font-bold text-gray-900 flex items-center gap-2 mb-4">
                                <ShieldCheck className="w-5 h-5 text-emerald-600" />
                                Automated Technical SEO Audit Checklist
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                                {[
                                    { key: 'meta_title', title: 'Global Meta Title Configured', desc: 'Provides the search snippet title for your homepage and fallbacks.' },
                                    { key: 'meta_description', title: 'Global Meta Description Provided', desc: 'Increases click-through rate (CTR) on Google search result pages.' },
                                    { key: 'og_image', title: 'Social Share Image (OG Image) Active', desc: 'Ensures rich image previews when shared on Facebook, WhatsApp & LinkedIn.' },
                                    { key: 'google_verification', title: 'Google Search Console Verification', desc: 'Verifies domain ownership in Google Search Console for ranking reports.' },
                                    { key: 'analytics_tracking', title: 'Google Analytics 4 / GTM Connected', desc: 'Tracks traffic, conversion rates, ecommerce transactions, and bounce rates.' },
                                    { key: 'robots_txt', title: 'Robots.txt Directives Functional', desc: 'Instructs search spiders which directories are allowed or disallowed.' },
                                    { key: 'schema_org', title: 'Schema.org JSON-LD Structured Data', desc: 'Enables Google Rich Results, Organization knowledge graph & product snippets.' },
                                    { key: 'sitemap_active', title: 'Dynamic XML Sitemap Active', desc: 'Automatically feeds new products and categories to search crawlers.' },
                                ].map((chk, i) => {
                                    const passed = stats.audit_checks?.[chk.key];
                                    return (
                                        <div
                                            key={i}
                                            className={`flex items-start gap-3 p-3.5 rounded-xl border transition ${
                                                passed ? 'bg-emerald-50/50 border-emerald-200' : 'bg-rose-50/50 border-rose-200'
                                            }`}
                                        >
                                            {passed ? (
                                                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                                            ) : (
                                                <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
                                            )}
                                            <div>
                                                <div className="text-xs font-bold text-gray-900 flex items-center gap-2">
                                                    <span>{chk.title}</span>
                                                    <span className={`text-[10px] font-bold px-1.5 py-0.2 rounded ${
                                                        passed ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                                                    }`}>
                                                        {passed ? 'Passed' : 'Action Required'}
                                                    </span>
                                                </div>
                                                <div className="text-[11px] text-gray-600 mt-0.5 leading-snug">{chk.desc}</div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Live Google Search Result (SERP) Simulator */}
                        <div className="bg-white rounded-2xl border border-gray-200/90 shadow-sm p-6">
                            <div className="flex items-center justify-between mb-4">
                                <div>
                                    <h2 className="text-base font-bold text-gray-900 flex items-center gap-2">
                                        <Eye className="w-5 h-5 text-blue-600" />
                                        Live Google SERP Simulator (Desktop & Mobile)
                                    </h2>
                                    <p className="text-xs text-gray-500 mt-0.5">
                                        This is how your website snippet currently looks in Google Search results.
                                    </p>
                                </div>
                                <div className="flex items-center gap-1 bg-gray-100 p-1 rounded-xl text-xs font-semibold">
                                    <button
                                        onClick={() => setPreviewDevice('desktop')}
                                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition ${
                                            previewDevice === 'desktop' ? 'bg-white shadow text-gray-900' : 'text-gray-500 hover:text-gray-900'
                                        }`}
                                    >
                                        <Laptop className="w-3.5 h-3.5" />
                                        Desktop
                                    </button>
                                    <button
                                        onClick={() => setPreviewDevice('mobile')}
                                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition ${
                                            previewDevice === 'mobile' ? 'bg-white shadow text-gray-900' : 'text-gray-500 hover:text-gray-900'
                                        }`}
                                    >
                                        <Smartphone className="w-3.5 h-3.5" />
                                        Mobile
                                    </button>
                                </div>
                            </div>

                            {/* Simulated Google Search Box */}
                            <div className="max-w-2xl bg-white p-4 sm:p-6 rounded-2xl border border-gray-200 font-sans shadow-sm">
                                <div className="flex items-center gap-3 mb-2 text-xs text-gray-700">
                                    <div className="w-7 h-7 rounded-full bg-gray-100 border border-gray-200 flex items-center justify-center font-black text-xs text-orange-600">
                                        {settings.site_logo ? (
                                            <img src={settings.site_logo} alt={siteName} className="w-4 h-4 object-contain" />
                                        ) : 'TS'}
                                    </div>
                                    <div className="truncate">
                                        <div className="font-semibold text-gray-900 text-xs">{siteName}</div>
                                        <div className="text-[11px] text-gray-500 truncate">{canonicalDomain}</div>
                                    </div>
                                </div>
                                <a
                                    href={canonicalDomain}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="text-lg sm:text-xl font-medium text-[#1a0dab] hover:underline cursor-pointer block leading-tight truncate"
                                >
                                    {serpTitle}
                                </a>
                                <p className="text-xs sm:text-sm text-[#4d5156] mt-1.5 leading-relaxed line-clamp-2">
                                    {serpDesc}
                                </p>
                            </div>
                        </div>
                    </div>
                )}

                {/* TAB 2: GLOBAL META & ROBOTS */}
                {activeTab === 'meta' && (
                    <form onSubmit={submitGeneral} className="bg-white rounded-2xl border border-gray-200/90 shadow-sm p-6 space-y-6">
                        <div className="border-b border-gray-100 pb-4">
                            <h2 className="text-base font-bold text-gray-900">Global Meta Tags & Canonical Directives</h2>
                            <p className="text-xs text-gray-500 mt-0.5">Control the default title format, descriptions, keywords and search crawler indexing rules.</p>
                        </div>

                        {/* Title & Description */}
                        <div className="grid grid-cols-1 gap-6">
                            <div>
                                <div className="flex items-center justify-between mb-1.5">
                                    <label className="text-xs font-bold text-gray-700">
                                        Global Meta Title / Homepage Title
                                    </label>
                                    <span className={`text-[11px] font-semibold ${
                                        generalForm.data.seo_meta_title.length > 60 ? 'text-amber-600' : 'text-emerald-600'
                                    }`}>
                                        {generalForm.data.seo_meta_title.length} / 60 optimal chars
                                    </span>
                                </div>
                                <input
                                    type="text"
                                    value={generalForm.data.seo_meta_title}
                                    onChange={(e) => generalForm.setData('seo_meta_title', e.target.value)}
                                    placeholder="e.g. Tech Shoppers | Leading Computer, Laptop & Component Shop in Bangladesh"
                                    className="w-full text-xs font-medium border-gray-300 rounded-xl focus:ring-[#EF4A23] focus:border-[#EF4A23]"
                                />
                                <p className="text-[11px] text-gray-500 mt-1">Recommended length: 50-60 characters. Appears as the headline in Google search results.</p>
                            </div>

                            <div>
                                <div className="flex items-center justify-between mb-1.5">
                                    <label className="text-xs font-bold text-gray-700">
                                        Global Meta Description
                                    </label>
                                    <span className={`text-[11px] font-semibold ${
                                        generalForm.data.seo_meta_description.length > 160 ? 'text-amber-600' : 'text-emerald-600'
                                    }`}>
                                        {generalForm.data.seo_meta_description.length} / 160 optimal chars
                                    </span>
                                </div>
                                <textarea
                                    rows="3"
                                    value={generalForm.data.seo_meta_description}
                                    onChange={(e) => generalForm.setData('seo_meta_description', e.target.value)}
                                    placeholder="e.g. Buy Desktop PC, Laptop, Gaming Component, Monitor, Graphics Card, Processor at best price in Bangladesh from Tech Shoppers with official warranty."
                                    className="w-full text-xs font-medium border-gray-300 rounded-xl focus:ring-[#EF4A23] focus:border-[#EF4A23]"
                                />
                                <p className="text-[11px] text-gray-500 mt-1">Optimal length: 140-160 characters. Provide a compelling call-to-action to maximize search click-throughs.</p>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-bold text-gray-700 mb-1.5">
                                        Meta Keywords (Comma separated)
                                    </label>
                                    <input
                                        type="text"
                                        value={generalForm.data.seo_meta_keywords}
                                        onChange={(e) => generalForm.setData('seo_meta_keywords', e.target.value)}
                                        placeholder="computer shop bd, gaming pc, laptop price in bangladesh, star tech, ryzen processor"
                                        className="w-full text-xs font-medium border-gray-300 rounded-xl focus:ring-[#EF4A23] focus:border-[#EF4A23]"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-700 mb-1.5">
                                        Author / Publisher Name
                                    </label>
                                    <input
                                        type="text"
                                        value={generalForm.data.seo_author}
                                        onChange={(e) => generalForm.setData('seo_author', e.target.value)}
                                        placeholder="Tech Shoppers Limited"
                                        className="w-full text-xs font-medium border-gray-300 rounded-xl focus:ring-[#EF4A23] focus:border-[#EF4A23]"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-gray-700 mb-1.5">
                                    Canonical URL Base Domain
                                </label>
                                <input
                                    type="url"
                                    value={generalForm.data.seo_canonical_base}
                                    onChange={(e) => generalForm.setData('seo_canonical_base', e.target.value)}
                                    placeholder="https://techshoppers.com.bd (leave blank for automatic current domain)"
                                    className="w-full text-xs font-medium border-gray-300 rounded-xl focus:ring-[#EF4A23] focus:border-[#EF4A23]"
                                />
                                <p className="text-[11px] text-gray-500 mt-1">Prevents duplicate content penalties by indicating the primary canonical domain.</p>
                            </div>
                        </div>

                        {/* Robots Meta Directives */}
                        <div className="border-t border-gray-100 pt-5 space-y-4">
                            <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2">
                                <Terminal className="w-4 h-4 text-orange-600" />
                                Robots Meta Tag Settings
                            </h3>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="p-4 bg-gray-50 rounded-xl border border-gray-200">
                                    <label className="text-xs font-bold text-gray-800 block mb-2">Search Engine Indexing</label>
                                    <div className="space-y-2">
                                        <label className="flex items-center gap-2 text-xs font-medium text-gray-700 cursor-pointer">
                                            <input
                                                type="radio"
                                                name="seo_robots_index"
                                                value="index"
                                                checked={generalForm.data.seo_robots_index === 'index'}
                                                onChange={(e) => generalForm.setData('seo_robots_index', e.target.value)}
                                                className="text-[#EF4A23] focus:ring-[#EF4A23]"
                                            />
                                            <span><strong>Index:</strong> Allow search engines to index this site (Recommended)</span>
                                        </label>
                                        <label className="flex items-center gap-2 text-xs font-medium text-rose-700 cursor-pointer">
                                            <input
                                                type="radio"
                                                name="seo_robots_index"
                                                value="noindex"
                                                checked={generalForm.data.seo_robots_index === 'noindex'}
                                                onChange={(e) => generalForm.setData('seo_robots_index', e.target.value)}
                                                className="text-rose-600 focus:ring-rose-600"
                                            />
                                            <span><strong>Noindex:</strong> Block search engines (Staging / Development only!)</span>
                                        </label>
                                    </div>
                                </div>

                                <div className="p-4 bg-gray-50 rounded-xl border border-gray-200">
                                    <label className="text-xs font-bold text-gray-800 block mb-2">Link Following</label>
                                    <div className="space-y-2">
                                        <label className="flex items-center gap-2 text-xs font-medium text-gray-700 cursor-pointer">
                                            <input
                                                type="radio"
                                                name="seo_robots_follow"
                                                value="follow"
                                                checked={generalForm.data.seo_robots_follow === 'follow'}
                                                onChange={(e) => generalForm.setData('seo_robots_follow', e.target.value)}
                                                className="text-[#EF4A23] focus:ring-[#EF4A23]"
                                            />
                                            <span><strong>Follow:</strong> Crawl links on this site (Recommended)</span>
                                        </label>
                                        <label className="flex items-center gap-2 text-xs font-medium text-gray-700 cursor-pointer">
                                            <input
                                                type="radio"
                                                name="seo_robots_follow"
                                                value="nofollow"
                                                checked={generalForm.data.seo_robots_follow === 'nofollow'}
                                                onChange={(e) => generalForm.setData('seo_robots_follow', e.target.value)}
                                                className="text-[#EF4A23] focus:ring-[#EF4A23]"
                                            />
                                            <span><strong>Nofollow:</strong> Do not pass link equity / follow links</span>
                                        </label>
                                    </div>
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-gray-700 mb-1.5">
                                    Advanced Robots Directives
                                </label>
                                <input
                                    type="text"
                                    value={generalForm.data.seo_robots_advanced}
                                    onChange={(e) => generalForm.setData('seo_robots_advanced', e.target.value)}
                                    placeholder="max-image-preview:large, max-snippet:-1, max-video-preview:-1"
                                    className="w-full text-xs font-medium border-gray-300 rounded-xl focus:ring-[#EF4A23] focus:border-[#EF4A23]"
                                />
                                <p className="text-[11px] text-gray-500 mt-1">
                                    <code>max-image-preview:large</code> enables Google Discover large card previews, boosting mobile organic reach.
                                </p>
                            </div>
                        </div>

                        <div className="flex justify-end pt-4 border-t border-gray-100">
                            <button
                                type="submit"
                                disabled={generalForm.processing}
                                className="flex items-center gap-2 px-6 py-2.5 bg-[#EF4A23] hover:bg-[#d63d1a] text-white font-bold text-xs rounded-xl shadow transition"
                            >
                                <Save className="w-4 h-4" />
                                {generalForm.processing ? 'Saving Changes...' : 'Save Meta Settings'}
                            </button>
                        </div>
                    </form>
                )}

                {/* TAB 3: SOCIAL & OPEN GRAPH */}
                {activeTab === 'social' && (
                    <form onSubmit={submitSocial} className="bg-white rounded-2xl border border-gray-200/90 shadow-sm p-6 space-y-6">
                        <div className="border-b border-gray-100 pb-4">
                            <h2 className="text-base font-bold text-gray-900">Social Media & Open Graph Previews</h2>
                            <p className="text-xs text-gray-500 mt-0.5">Control how your website appears when shared on Facebook, WhatsApp, Twitter (X), Telegram and LinkedIn.</p>
                        </div>

                        {/* OG Image Upload & Preview Card */}
                        <div>
                            <label className="block text-xs font-bold text-gray-700 mb-2">
                                Default Social Share Image (Open Graph Image)
                            </label>
                            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
                                <div className="md:col-span-7 space-y-3">
                                    <div className="flex items-center gap-3">
                                        <label className="flex items-center gap-2 px-4 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-800 text-xs font-semibold rounded-xl cursor-pointer border border-gray-300 transition">
                                            <Upload className="w-4 h-4 text-orange-600" />
                                            Upload High-Res OG Image
                                            <input
                                                type="file"
                                                accept="image/*"
                                                onChange={handleOgFileChange}
                                                className="hidden"
                                            />
                                        </label>
                                        {ogPreview && (
                                            <button
                                                type="button"
                                                onClick={removeOgImage}
                                                className="flex items-center gap-1.5 px-3 py-2 text-rose-600 hover:bg-rose-50 text-xs font-semibold rounded-xl transition"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                                Remove Image
                                            </button>
                                        )}
                                    </div>

                                    <div>
                                        <label className="block text-[11px] text-gray-500 font-semibold mb-1">
                                            Or Direct Image URL:
                                        </label>
                                        <input
                                            type="text"
                                            value={socialForm.data.seo_og_image_url}
                                            onChange={(e) => {
                                                socialForm.setData('seo_og_image_url', e.target.value);
                                                setOgPreview(e.target.value);
                                            }}
                                            placeholder="https://example.com/assets/banner-og.jpg"
                                            className="w-full text-xs font-medium border-gray-300 rounded-xl focus:ring-[#EF4A23] focus:border-[#EF4A23]"
                                        />
                                    </div>
                                    <p className="text-[11px] text-gray-500">
                                        Optimal dimensions: <strong>1200 x 630 pixels</strong> (Aspect ratio 1.91:1). Recommended format: PNG or WebP under 2MB.
                                    </p>
                                </div>

                                {/* Live Social Share Card Preview */}
                                <div className="md:col-span-5 bg-gray-50 p-3 rounded-2xl border border-gray-200">
                                    <div className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-2">Live Facebook / WhatsApp Preview</div>
                                    <div className="bg-white rounded-xl overflow-hidden border border-gray-200 shadow-sm">
                                        <div className="h-36 bg-gray-200 flex items-center justify-center overflow-hidden">
                                            {ogPreview ? (
                                                <img src={ogPreview} alt="OG Preview" className="w-full h-full object-cover" />
                                            ) : (
                                                <div className="text-gray-400 text-xs font-semibold flex items-center gap-1.5">
                                                    <Share2 className="w-4 h-4" />
                                                    No OG Image Uploaded
                                                </div>
                                            )}
                                        </div>
                                        <div className="p-3">
                                            <div className="text-[10px] text-gray-400 uppercase font-bold truncate">
                                                {canonicalDomain}
                                            </div>
                                            <div className="text-xs font-bold text-gray-900 mt-0.5 truncate">
                                                {socialForm.data.seo_og_title || siteName}
                                            </div>
                                            <div className="text-[11px] text-gray-500 mt-1 line-clamp-2">
                                                {socialForm.data.seo_og_description || siteTagline}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Title & Desc */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-bold text-gray-700 mb-1.5">
                                    Open Graph Title (Leave empty to use Meta Title)
                                </label>
                                <input
                                    type="text"
                                    value={socialForm.data.seo_og_title}
                                    onChange={(e) => socialForm.setData('seo_og_title', e.target.value)}
                                    placeholder={siteName}
                                    className="w-full text-xs font-medium border-gray-300 rounded-xl focus:ring-[#EF4A23] focus:border-[#EF4A23]"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-700 mb-1.5">
                                    Open Graph Description
                                </label>
                                <input
                                    type="text"
                                    value={socialForm.data.seo_og_description}
                                    onChange={(e) => socialForm.setData('seo_og_description', e.target.value)}
                                    placeholder={siteTagline}
                                    className="w-full text-xs font-medium border-gray-300 rounded-xl focus:ring-[#EF4A23] focus:border-[#EF4A23]"
                                />
                            </div>
                        </div>

                        {/* Twitter Card Details */}
                        <div className="border-t border-gray-100 pt-5 space-y-4">
                            <h3 className="text-sm font-bold text-gray-900">Twitter (X) Card Details</h3>
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                <div>
                                    <label className="block text-xs font-bold text-gray-700 mb-1.5">
                                        Twitter Card Type
                                    </label>
                                    <select
                                        value={socialForm.data.seo_twitter_card}
                                        onChange={(e) => socialForm.setData('seo_twitter_card', e.target.value)}
                                        className="w-full text-xs font-medium border-gray-300 rounded-xl focus:ring-[#EF4A23] focus:border-[#EF4A23]"
                                    >
                                        <option value="summary_large_image">Summary with Large Image (Recommended)</option>
                                        <option value="summary">Summary Small Square</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-700 mb-1.5">
                                        Twitter Site Handle
                                    </label>
                                    <input
                                        type="text"
                                        value={socialForm.data.seo_twitter_site}
                                        onChange={(e) => socialForm.setData('seo_twitter_site', e.target.value)}
                                        placeholder="@TechShoppersBD"
                                        className="w-full text-xs font-medium border-gray-300 rounded-xl focus:ring-[#EF4A23] focus:border-[#EF4A23]"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-700 mb-1.5">
                                        Facebook App ID
                                    </label>
                                    <input
                                        type="text"
                                        value={socialForm.data.seo_fb_app_id}
                                        onChange={(e) => socialForm.setData('seo_fb_app_id', e.target.value)}
                                        placeholder="e.g. 102938475619283"
                                        className="w-full text-xs font-medium border-gray-300 rounded-xl focus:ring-[#EF4A23] focus:border-[#EF4A23]"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="flex justify-end pt-4 border-t border-gray-100">
                            <button
                                type="submit"
                                disabled={socialForm.processing}
                                className="flex items-center gap-2 px-6 py-2.5 bg-[#EF4A23] hover:bg-[#d63d1a] text-white font-bold text-xs rounded-xl shadow transition"
                            >
                                <Save className="w-4 h-4" />
                                {socialForm.processing ? 'Saving...' : 'Save Social Settings'}
                            </button>
                        </div>
                    </form>
                )}

                {/* TAB 4: WEBMASTER VERIFICATION */}
                {activeTab === 'webmaster' && (
                    <form onSubmit={submitWebmaster} className="bg-white rounded-2xl border border-gray-200/90 shadow-sm p-6 space-y-6">
                        <div className="border-b border-gray-100 pb-4">
                            <h2 className="text-base font-bold text-gray-900">Search Engine Webmaster Verification</h2>
                            <p className="text-xs text-gray-500 mt-0.5">Add meta verification codes to verify ownership in Google Search Console, Bing Webmaster, Pinterest and Yandex.</p>
                        </div>

                        <div className="space-y-4">
                            {/* Google */}
                            <div className="p-4 rounded-xl border border-gray-200 hover:border-gray-300 transition">
                                <div className="flex items-center justify-between mb-1.5">
                                    <label className="text-xs font-bold text-gray-900 flex items-center gap-2">
                                        <span className="w-5 h-5 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-xs">G</span>
                                        Google Search Console Verification
                                    </label>
                                    <a
                                        href="https://search.google.com/search-console"
                                        target="_blank"
                                        rel="noreferrer"
                                        className="text-[11px] text-blue-600 hover:underline flex items-center gap-1 font-semibold"
                                    >
                                        Open Google Search Console <ExternalLink className="w-3 h-3" />
                                    </a>
                                </div>
                                <input
                                    type="text"
                                    value={webmasterForm.data.seo_google_verification}
                                    onChange={(e) => webmasterForm.setData('seo_google_verification', e.target.value)}
                                    placeholder='Paste verification code or full tag e.g. <meta name="google-site-verification" content="xyz...">'
                                    className="w-full text-xs font-mono font-medium border-gray-300 rounded-xl focus:ring-[#EF4A23] focus:border-[#EF4A23]"
                                />
                                <p className="text-[11px] text-gray-500 mt-1">
                                    Choose "HTML tag" verification method in Google Search Console and paste the code here.
                                </p>
                            </div>

                            {/* Bing */}
                            <div className="p-4 rounded-xl border border-gray-200 hover:border-gray-300 transition">
                                <div className="flex items-center justify-between mb-1.5">
                                    <label className="text-xs font-bold text-gray-900 flex items-center gap-2">
                                        <span className="w-5 h-5 rounded-full bg-cyan-50 text-cyan-600 flex items-center justify-center font-bold text-xs">B</span>
                                        Bing & Yahoo Webmaster Tools (msvalidate.01)
                                    </label>
                                    <a
                                        href="https://www.bing.com/webmasters"
                                        target="_blank"
                                        rel="noreferrer"
                                        className="text-[11px] text-cyan-600 hover:underline flex items-center gap-1 font-semibold"
                                    >
                                        Open Bing Webmasters <ExternalLink className="w-3 h-3" />
                                    </a>
                                </div>
                                <input
                                    type="text"
                                    value={webmasterForm.data.seo_bing_verification}
                                    onChange={(e) => webmasterForm.setData('seo_bing_verification', e.target.value)}
                                    placeholder='e.g. 74E23C623485ABC098901234...'
                                    className="w-full text-xs font-mono font-medium border-gray-300 rounded-xl focus:ring-[#EF4A23] focus:border-[#EF4A23]"
                                />
                            </div>

                            {/* Pinterest */}
                            <div className="p-4 rounded-xl border border-gray-200 hover:border-gray-300 transition">
                                <div className="flex items-center justify-between mb-1.5">
                                    <label className="text-xs font-bold text-gray-900 flex items-center gap-2">
                                        <span className="w-5 h-5 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center font-bold text-xs">P</span>
                                        Pinterest Domain Verification (p:domain_verify)
                                    </label>
                                    <a
                                        href="https://www.pinterest.com/settings/claim"
                                        target="_blank"
                                        rel="noreferrer"
                                        className="text-[11px] text-rose-600 hover:underline flex items-center gap-1 font-semibold"
                                    >
                                        Claim on Pinterest <ExternalLink className="w-3 h-3" />
                                    </a>
                                </div>
                                <input
                                    type="text"
                                    value={webmasterForm.data.seo_pinterest_verification}
                                    onChange={(e) => webmasterForm.setData('seo_pinterest_verification', e.target.value)}
                                    placeholder='e.g. a87dfb6a78c909e782bc4...'
                                    className="w-full text-xs font-mono font-medium border-gray-300 rounded-xl focus:ring-[#EF4A23] focus:border-[#EF4A23]"
                                />
                            </div>

                            {/* Yandex */}
                            <div className="p-4 rounded-xl border border-gray-200 hover:border-gray-300 transition">
                                <div className="flex items-center justify-between mb-1.5">
                                    <label className="text-xs font-bold text-gray-900 flex items-center gap-2">
                                        <span className="w-5 h-5 rounded-full bg-red-50 text-red-600 flex items-center justify-center font-bold text-xs">Y</span>
                                        Yandex Webmaster Verification
                                    </label>
                                </div>
                                <input
                                    type="text"
                                    value={webmasterForm.data.seo_yandex_verification}
                                    onChange={(e) => webmasterForm.setData('seo_yandex_verification', e.target.value)}
                                    placeholder='e.g. 5a1b3c4d5e6f...'
                                    className="w-full text-xs font-mono font-medium border-gray-300 rounded-xl focus:ring-[#EF4A23] focus:border-[#EF4A23]"
                                />
                            </div>
                        </div>

                        <div className="flex justify-end pt-4 border-t border-gray-100">
                            <button
                                type="submit"
                                disabled={webmasterForm.processing}
                                className="flex items-center gap-2 px-6 py-2.5 bg-[#EF4A23] hover:bg-[#d63d1a] text-white font-bold text-xs rounded-xl shadow transition"
                            >
                                <Save className="w-4 h-4" />
                                {webmasterForm.processing ? 'Verifying...' : 'Save Verification Codes'}
                            </button>
                        </div>
                    </form>
                )}

                {/* TAB 5: ANALYTICS & PIXELS */}
                {activeTab === 'analytics' && (
                    <form onSubmit={submitAnalytics} className="bg-white rounded-2xl border border-gray-200/90 shadow-sm p-6 space-y-6">
                        <div className="border-b border-gray-100 pb-4">
                            <h2 className="text-base font-bold text-gray-900">Analytics, Tracking & Custom Scripts</h2>
                            <p className="text-xs text-gray-500 mt-0.5">Seamlessly inject Google Analytics 4, Tag Manager, Facebook Pixel and custom head/body tracking scripts.</p>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            <div>
                                <label className="block text-xs font-bold text-gray-700 mb-1.5">
                                    Google Analytics 4 Measurement ID
                                </label>
                                <input
                                    type="text"
                                    value={analyticsForm.data.seo_ga4_id}
                                    onChange={(e) => analyticsForm.setData('seo_ga4_id', e.target.value)}
                                    placeholder="G-XXXXXXXXXX"
                                    className="w-full text-xs font-mono font-medium border-gray-300 rounded-xl focus:ring-[#EF4A23] focus:border-[#EF4A23]"
                                />
                                <p className="text-[11px] text-gray-500 mt-1">Automatic gtag.js script injection.</p>
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-gray-700 mb-1.5">
                                    Google Tag Manager (GTM) Container ID
                                </label>
                                <input
                                    type="text"
                                    value={analyticsForm.data.seo_gtm_id}
                                    onChange={(e) => analyticsForm.setData('seo_gtm_id', e.target.value)}
                                    placeholder="GTM-XXXXXXX"
                                    className="w-full text-xs font-mono font-medium border-gray-300 rounded-xl focus:ring-[#EF4A23] focus:border-[#EF4A23]"
                                />
                                <p className="text-[11px] text-gray-500 mt-1">Injected in &lt;head&gt; and &lt;noscript&gt; body.</p>
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-gray-700 mb-1.5">
                                    Facebook (Meta) Pixel ID
                                </label>
                                <input
                                    type="text"
                                    value={analyticsForm.data.seo_fb_pixel_id}
                                    onChange={(e) => analyticsForm.setData('seo_fb_pixel_id', e.target.value)}
                                    placeholder="e.g. 123456789012345"
                                    className="w-full text-xs font-mono font-medium border-gray-300 rounded-xl focus:ring-[#EF4A23] focus:border-[#EF4A23]"
                                />
                                <p className="text-[11px] text-gray-500 mt-1">Fires standard PageView events.</p>
                            </div>
                        </div>

                        {/* Custom Head Scripts */}
                        <div className="space-y-4 border-t border-gray-100 pt-5">
                            <div>
                                <div className="flex items-center justify-between mb-1.5">
                                    <label className="text-xs font-bold text-gray-900 flex items-center gap-1.5">
                                        <Code className="w-4 h-4 text-purple-600" />
                                        Custom Header Scripts (&lt;head&gt; injection)
                                    </label>
                                    <span className="text-[11px] text-gray-400 font-mono">Raw HTML / JavaScript</span>
                                </div>
                                <textarea
                                    rows="4"
                                    value={analyticsForm.data.seo_custom_head_scripts}
                                    onChange={(e) => analyticsForm.setData('seo_custom_head_scripts', e.target.value)}
                                    placeholder="<!-- Paste custom verification, Hotjar, Clarity or custom meta tags here -->"
                                    className="w-full text-xs font-mono bg-gray-900 text-emerald-400 border-gray-800 rounded-xl p-3 focus:ring-[#EF4A23]"
                                />
                            </div>

                            <div>
                                <div className="flex items-center justify-between mb-1.5">
                                    <label className="text-xs font-bold text-gray-900 flex items-center gap-1.5">
                                        <Code className="w-4 h-4 text-blue-600" />
                                        Custom Body / Footer Scripts (before &lt;/body&gt;)
                                    </label>
                                    <span className="text-[11px] text-gray-400 font-mono">Raw HTML / JavaScript</span>
                                </div>
                                <textarea
                                    rows="4"
                                    value={analyticsForm.data.seo_custom_body_scripts}
                                    onChange={(e) => analyticsForm.setData('seo_custom_body_scripts', e.target.value)}
                                    placeholder="<!-- Paste live chat widget, Tawk.to, WhatsApp popups or conversion tracking scripts here -->"
                                    className="w-full text-xs font-mono bg-gray-900 text-emerald-400 border-gray-800 rounded-xl p-3 focus:ring-[#EF4A23]"
                                />
                            </div>
                        </div>

                        <div className="flex justify-end pt-4 border-t border-gray-100">
                            <button
                                type="submit"
                                disabled={analyticsForm.processing}
                                className="flex items-center gap-2 px-6 py-2.5 bg-[#EF4A23] hover:bg-[#d63d1a] text-white font-bold text-xs rounded-xl shadow transition"
                            >
                                <Save className="w-4 h-4" />
                                {analyticsForm.processing ? 'Saving...' : 'Save Tracking Scripts'}
                            </button>
                        </div>
                    </form>
                )}

                {/* TAB 6: XML SITEMAP */}
                {activeTab === 'sitemap' && (
                    <form onSubmit={submitSitemap} className="bg-white rounded-2xl border border-gray-200/90 shadow-sm p-6 space-y-6">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-100 pb-4">
                            <div>
                                <h2 className="text-base font-bold text-gray-900 flex items-center gap-2">
                                    <Layers className="w-5 h-5 text-orange-600" />
                                    XML Sitemap Configuration
                                </h2>
                                <p className="text-xs text-gray-500 mt-0.5">Generated real-time at <code>/sitemap.xml</code> following standard sitemaps.org XML protocol.</p>
                            </div>
                            <a
                                href={sitemapUrl}
                                target="_blank"
                                rel="noreferrer"
                                className="inline-flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow transition shrink-0"
                            >
                                Open Live XML Sitemap <ExternalLink className="w-3.5 h-3.5" />
                            </a>
                        </div>

                        {/* Sitemap Inclusion Toggles */}
                        <div className="space-y-4">
                            <div className="text-xs font-bold text-gray-800 uppercase tracking-wider">Include Post Types & Models</div>

                            {/* Products */}
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl border border-gray-200 bg-gray-50/50">
                                <div className="flex items-center gap-3">
                                    <input
                                        type="checkbox"
                                        id="chk_prod"
                                        checked={sitemapForm.data.seo_sitemap_include_products === '1'}
                                        onChange={(e) => sitemapForm.setData('seo_sitemap_include_products', e.target.checked ? '1' : '0')}
                                        className="w-4 h-4 text-[#EF4A23] rounded focus:ring-[#EF4A23]"
                                    />
                                    <label htmlFor="chk_prod" className="cursor-pointer">
                                        <div className="text-xs font-bold text-gray-900">Products ({stats.total_products || 0} items)</div>
                                        <div className="text-[11px] text-gray-500">Includes active product pages with lastmod date.</div>
                                    </label>
                                </div>
                                <div className="flex items-center gap-3">
                                    <div>
                                        <label className="text-[10px] text-gray-500 font-bold block mb-1">Priority</label>
                                        <select
                                            value={sitemapForm.data.seo_sitemap_products_priority}
                                            onChange={(e) => sitemapForm.setData('seo_sitemap_products_priority', e.target.value)}
                                            className="text-xs font-semibold rounded-lg border-gray-300 py-1"
                                        >
                                            <option value="1.0">1.0 (Highest)</option>
                                            <option value="0.9">0.9</option>
                                            <option value="0.8">0.8 (Default)</option>
                                            <option value="0.7">0.7</option>
                                            <option value="0.5">0.5</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="text-[10px] text-gray-500 font-bold block mb-1">Frequency</label>
                                        <select
                                            value={sitemapForm.data.seo_sitemap_products_freq}
                                            onChange={(e) => sitemapForm.setData('seo_sitemap_products_freq', e.target.value)}
                                            className="text-xs font-semibold rounded-lg border-gray-300 py-1"
                                        >
                                            <option value="hourly">Hourly</option>
                                            <option value="daily">Daily</option>
                                            <option value="weekly">Weekly</option>
                                            <option value="monthly">Monthly</option>
                                        </select>
                                    </div>
                                </div>
                            </div>

                            {/* Categories */}
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl border border-gray-200 bg-gray-50/50">
                                <div className="flex items-center gap-3">
                                    <input
                                        type="checkbox"
                                        id="chk_cat"
                                        checked={sitemapForm.data.seo_sitemap_include_categories === '1'}
                                        onChange={(e) => sitemapForm.setData('seo_sitemap_include_categories', e.target.checked ? '1' : '0')}
                                        className="w-4 h-4 text-[#EF4A23] rounded focus:ring-[#EF4A23]"
                                    />
                                    <label htmlFor="chk_cat" className="cursor-pointer">
                                        <div className="text-xs font-bold text-gray-900">Categories & Subcategories ({stats.total_categories || 0} items)</div>
                                        <div className="text-[11px] text-gray-500">Crucial for ranking high-volume category search queries.</div>
                                    </label>
                                </div>
                                <div className="flex items-center gap-3">
                                    <div>
                                        <label className="text-[10px] text-gray-500 font-bold block mb-1">Priority</label>
                                        <select
                                            value={sitemapForm.data.seo_sitemap_categories_priority}
                                            onChange={(e) => sitemapForm.setData('seo_sitemap_categories_priority', e.target.value)}
                                            className="text-xs font-semibold rounded-lg border-gray-300 py-1"
                                        >
                                            <option value="1.0">1.0</option>
                                            <option value="0.9">0.9 (Default)</option>
                                            <option value="0.8">0.8</option>
                                            <option value="0.7">0.7</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="text-[10px] text-gray-500 font-bold block mb-1">Frequency</label>
                                        <select
                                            value={sitemapForm.data.seo_sitemap_categories_freq}
                                            onChange={(e) => sitemapForm.setData('seo_sitemap_categories_freq', e.target.value)}
                                            className="text-xs font-semibold rounded-lg border-gray-300 py-1"
                                        >
                                            <option value="daily">Daily</option>
                                            <option value="weekly">Weekly</option>
                                            <option value="monthly">Monthly</option>
                                        </select>
                                    </div>
                                </div>
                            </div>

                            {/* Pages */}
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl border border-gray-200 bg-gray-50/50">
                                <div className="flex items-center gap-3">
                                    <input
                                        type="checkbox"
                                        id="chk_pages"
                                        checked={sitemapForm.data.seo_sitemap_include_pages === '1'}
                                        onChange={(e) => sitemapForm.setData('seo_sitemap_include_pages', e.target.checked ? '1' : '0')}
                                        className="w-4 h-4 text-[#EF4A23] rounded focus:ring-[#EF4A23]"
                                    />
                                    <label htmlFor="chk_pages" className="cursor-pointer">
                                        <div className="text-xs font-bold text-gray-900">CMS Dynamic Pages ({stats.total_pages || 0} pages)</div>
                                        <div className="text-[11px] text-gray-500">Terms, About Us, Privacy Policy, EMI guide, etc.</div>
                                    </label>
                                </div>
                                <div className="flex items-center gap-3">
                                    <div>
                                        <label className="text-[10px] text-gray-500 font-bold block mb-1">Priority</label>
                                        <select
                                            value={sitemapForm.data.seo_sitemap_pages_priority}
                                            onChange={(e) => sitemapForm.setData('seo_sitemap_pages_priority', e.target.value)}
                                            className="text-xs font-semibold rounded-lg border-gray-300 py-1"
                                        >
                                            <option value="0.7">0.7</option>
                                            <option value="0.6">0.6 (Default)</option>
                                            <option value="0.5">0.5</option>
                                            <option value="0.3">0.3</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="text-[10px] text-gray-500 font-bold block mb-1">Frequency</label>
                                        <select
                                            value={sitemapForm.data.seo_sitemap_pages_freq}
                                            onChange={(e) => sitemapForm.setData('seo_sitemap_pages_freq', e.target.value)}
                                            className="text-xs font-semibold rounded-lg border-gray-300 py-1"
                                        >
                                            <option value="weekly">Weekly</option>
                                            <option value="monthly">Monthly</option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="flex justify-end pt-4 border-t border-gray-100">
                            <button
                                type="submit"
                                disabled={sitemapForm.processing}
                                className="flex items-center gap-2 px-6 py-2.5 bg-[#EF4A23] hover:bg-[#d63d1a] text-white font-bold text-xs rounded-xl shadow transition"
                            >
                                <Save className="w-4 h-4" />
                                {sitemapForm.processing ? 'Saving...' : 'Save Sitemap Settings'}
                            </button>
                        </div>
                    </form>
                )}

                {/* TAB 7: ROBOTS.TXT EDITOR */}
                {activeTab === 'robots' && (
                    <form onSubmit={submitRobots} className="bg-white rounded-2xl border border-gray-200/90 shadow-sm p-6 space-y-6">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-100 pb-4">
                            <div>
                                <h2 className="text-base font-bold text-gray-900 flex items-center gap-2">
                                    <Terminal className="w-5 h-5 text-gray-800" />
                                    Live Robots.txt File Editor
                                </h2>
                                <p className="text-xs text-gray-500 mt-0.5">
                                    Changes are written directly to <code>public/robots.txt</code> and served live to web crawlers.
                                </p>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="text-xs font-bold text-gray-500">Presets:</span>
                                <button
                                    type="button"
                                    onClick={() => applyRobotsPreset('ecommerce')}
                                    className="px-2.5 py-1 bg-gray-100 hover:bg-gray-200 text-gray-800 text-xs font-semibold rounded-lg transition"
                                >
                                    E-Commerce Standard
                                </button>
                                <button
                                    type="button"
                                    onClick={() => applyRobotsPreset('allow_all')}
                                    className="px-2.5 py-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-xs font-semibold rounded-lg transition"
                                >
                                    Allow All
                                </button>
                                <button
                                    type="button"
                                    onClick={() => applyRobotsPreset('block_all')}
                                    className="px-2.5 py-1 bg-rose-50 hover:bg-rose-100 text-rose-800 text-xs font-semibold rounded-lg transition"
                                >
                                    Block All
                                </button>
                            </div>
                        </div>

                        <div>
                            <textarea
                                rows="12"
                                value={robotsForm.data.robots_content}
                                onChange={(e) => robotsForm.setData('robots_content', e.target.value)}
                                className="w-full text-xs font-mono bg-gray-950 text-gray-200 border border-gray-800 rounded-xl p-4 focus:ring-[#EF4A23] leading-relaxed"
                            />
                            <p className="text-[11px] text-gray-500 mt-2">
                                Tip: Keep <code>Disallow: /admin/</code>, <code>Disallow: /cart</code> and <code>Disallow: /checkout</code> to prevent wasting crawl budget on private transactional routes.
                            </p>
                        </div>

                        <div className="flex justify-end pt-4 border-t border-gray-100">
                            <button
                                type="submit"
                                disabled={robotsForm.processing}
                                className="flex items-center gap-2 px-6 py-2.5 bg-[#EF4A23] hover:bg-[#d63d1a] text-white font-bold text-xs rounded-xl shadow transition"
                            >
                                <Save className="w-4 h-4" />
                                {robotsForm.processing ? 'Writing File...' : 'Save & Publish robots.txt'}
                            </button>
                        </div>
                    </form>
                )}

                {/* TAB 8: SCHEMA STRUCTURED DATA (JSON-LD) */}
                {activeTab === 'schema' && (
                    <form onSubmit={submitSchema} className="bg-white rounded-2xl border border-gray-200/90 shadow-sm p-6 space-y-6">
                        <div className="border-b border-gray-100 pb-4">
                            <h2 className="text-base font-bold text-gray-900 flex items-center gap-2">
                                <Code className="w-5 h-5 text-indigo-600" />
                                Schema.org Structured Data (Rich Snippets)
                            </h2>
                            <p className="text-xs text-gray-500 mt-0.5">Google uses Schema markup to show price ranges, review stars, stock status, sitelinks search box, and business knowledge panels.</p>
                        </div>

                        {/* Feature Toggles */}
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            <div className="p-4 rounded-xl border border-gray-200 bg-gray-50/50">
                                <label className="flex items-center gap-2 text-xs font-bold text-gray-900 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={schemaForm.data.seo_schema_org_enabled === '1'}
                                        onChange={(e) => schemaForm.setData('seo_schema_org_enabled', e.target.checked ? '1' : '0')}
                                        className="w-4 h-4 text-[#EF4A23] rounded focus:ring-[#EF4A23]"
                                    />
                                    <span>Organization Schema</span>
                                </label>
                                <p className="text-[11px] text-gray-500 mt-1">Company logo, contact numbers and social profiles.</p>
                            </div>

                            <div className="p-4 rounded-xl border border-gray-200 bg-gray-50/50">
                                <label className="flex items-center gap-2 text-xs font-bold text-gray-900 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={schemaForm.data.seo_schema_search_enabled === '1'}
                                        onChange={(e) => schemaForm.setData('seo_schema_search_enabled', e.target.checked ? '1' : '0')}
                                        className="w-4 h-4 text-[#EF4A23] rounded focus:ring-[#EF4A23]"
                                    />
                                    <span>Sitelinks SearchBox Schema</span>
                                </label>
                                <p className="text-[11px] text-gray-500 mt-1">Enables direct store search box in Google SERPs.</p>
                            </div>

                            <div className="p-4 rounded-xl border border-gray-200 bg-gray-50/50">
                                <label className="flex items-center gap-2 text-xs font-bold text-gray-900 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={schemaForm.data.seo_schema_product_enabled === '1'}
                                        onChange={(e) => schemaForm.setData('seo_schema_product_enabled', e.target.checked ? '1' : '0')}
                                        className="w-4 h-4 text-[#EF4A23] rounded focus:ring-[#EF4A23]"
                                    />
                                    <span>Product Rich Snippets</span>
                                </label>
                                <p className="text-[11px] text-gray-500 mt-1">Outputs BDT price, stock status, ratings and brand.</p>
                            </div>
                        </div>

                        {/* Organization Details */}
                        <div className="space-y-4 border-t border-gray-100 pt-5">
                            <h3 className="text-sm font-bold text-gray-900">Organization Knowledge Graph Details</h3>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-bold text-gray-700 mb-1.5">Legal Business Name</label>
                                    <input
                                        type="text"
                                        value={schemaForm.data.seo_schema_org_name}
                                        onChange={(e) => schemaForm.setData('seo_schema_org_name', e.target.value)}
                                        placeholder="Tech Shoppers Ltd"
                                        className="w-full text-xs font-medium border-gray-300 rounded-xl focus:ring-[#EF4A23]"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-700 mb-1.5">Support Hotline</label>
                                    <input
                                        type="text"
                                        value={schemaForm.data.seo_schema_org_phone}
                                        onChange={(e) => schemaForm.setData('seo_schema_org_phone', e.target.value)}
                                        placeholder="+8801700000000"
                                        className="w-full text-xs font-medium border-gray-300 rounded-xl focus:ring-[#EF4A23]"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-700 mb-1.5">Official Email</label>
                                    <input
                                        type="email"
                                        value={schemaForm.data.seo_schema_org_email}
                                        onChange={(e) => schemaForm.setData('seo_schema_org_email', e.target.value)}
                                        placeholder="support@techshoppers.com.bd"
                                        className="w-full text-xs font-medium border-gray-300 rounded-xl focus:ring-[#EF4A23]"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-700 mb-1.5">Physical Store Address</label>
                                    <input
                                        type="text"
                                        value={schemaForm.data.seo_schema_org_address}
                                        onChange={(e) => schemaForm.setData('seo_schema_org_address', e.target.value)}
                                        placeholder="Level 4, Multiplan Center, Elephant Road, Dhaka"
                                        className="w-full text-xs font-medium border-gray-300 rounded-xl focus:ring-[#EF4A23]"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Live Schema Output Inspector */}
                        <div className="border-t border-gray-100 pt-5">
                            <div className="flex items-center justify-between mb-2">
                                <label className="text-xs font-bold text-gray-800 flex items-center gap-1.5">
                                    <Terminal className="w-4 h-4 text-emerald-600" />
                                    Active JSON-LD Structured Data Output (Live Preview)
                                </label>
                                <button
                                    type="button"
                                    onClick={() => copyToClipboard(JSON.stringify({
                                        "@context": "https://schema.org",
                                        "@type": "Organization",
                                        "name": schemaForm.data.seo_schema_org_name,
                                        "url": canonicalDomain,
                                        "telephone": schemaForm.data.seo_schema_org_phone,
                                    }, null, 2), 'schema_json')}
                                    className="text-xs text-orange-600 font-semibold hover:underline flex items-center gap-1"
                                >
                                    {copiedField === 'schema_json' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                                    {copiedField === 'schema_json' ? 'Copied!' : 'Copy JSON-LD'}
                                </button>
                            </div>
                            <pre className="text-xs font-mono bg-gray-950 text-emerald-400 p-4 rounded-xl overflow-x-auto border border-gray-800">
{JSON.stringify({
    "@context": "https://schema.org",
    "@graph": [
        ...(schemaForm.data.seo_schema_org_enabled === '1' ? [{
            "@type": "Organization",
            "name": schemaForm.data.seo_schema_org_name,
            "url": canonicalDomain,
            "telephone": schemaForm.data.seo_schema_org_phone || undefined,
            "address": schemaForm.data.seo_schema_org_address || undefined
        }] : []),
        ...(schemaForm.data.seo_schema_search_enabled === '1' ? [{
            "@type": "WebSite",
            "name": siteName,
            "url": canonicalDomain,
            "potentialAction": {
                "@type": "SearchAction",
                "target": `${canonicalDomain}/search?q={search_term_string}`,
                "query-input": "required name=search_term_string"
            }
        }] : [])
    ]
}, null, 2)}
                            </pre>
                        </div>

                        <div className="flex justify-end pt-4 border-t border-gray-100">
                            <button
                                type="submit"
                                disabled={schemaForm.processing}
                                className="flex items-center gap-2 px-6 py-2.5 bg-[#EF4A23] hover:bg-[#d63d1a] text-white font-bold text-xs rounded-xl shadow transition"
                            >
                                <Save className="w-4 h-4" />
                                {schemaForm.processing ? 'Saving...' : 'Save Schema Settings'}
                            </button>
                        </div>
                    </form>
                )}

                {/* TAB 9: 301 REDIRECTION MANAGER */}
                {activeTab === 'redirects' && (
                    <div className="bg-white rounded-2xl border border-gray-200/90 shadow-sm p-6 space-y-6">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-100 pb-4">
                            <div>
                                <h2 className="text-base font-bold text-gray-900 flex items-center gap-2">
                                    <ArrowRightLeft className="w-5 h-5 text-orange-600" />
                                    301 / 302 URL Redirection Manager
                                </h2>
                                <p className="text-xs text-gray-500 mt-0.5">
                                    Safely redirect deprecated URLs to new product, category, or campaign pages without losing search rankings or 404s.
                                </p>
                            </div>
                            <button
                                type="button"
                                onClick={() => {
                                    setEditingRedirect(null);
                                    redirectForm.reset();
                                    setShowRedirectModal(true);
                                }}
                                className="flex items-center gap-2 px-4 py-2.5 bg-[#EF4A23] hover:bg-[#d63d1a] text-white text-xs font-bold rounded-xl shadow transition shrink-0"
                            >
                                <Plus className="w-4 h-4" />
                                Add Redirection Rule
                            </button>
                        </div>

                        {/* Redirects Table */}
                        <div className="overflow-x-auto rounded-xl border border-gray-200">
                            <table className="w-full text-left text-xs">
                                <thead className="bg-gray-50 text-gray-600 font-bold uppercase tracking-wider border-b border-gray-200">
                                    <tr>
                                        <th className="py-3 px-4">Source URL</th>
                                        <th className="py-3 px-4">Destination Target</th>
                                        <th className="py-3 px-4">Code</th>
                                        <th className="py-3 px-4">Hits</th>
                                        <th className="py-3 px-4">Status</th>
                                        <th className="py-3 px-4 text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100 font-medium">
                                    {redirects.length === 0 ? (
                                        <tr>
                                            <td colSpan="6" className="py-8 text-center text-gray-400">
                                                No 301/302 redirects configured yet. Click "Add Redirection Rule" above to create one.
                                            </td>
                                        </tr>
                                    ) : (
                                        redirects.map((red) => (
                                            <tr key={red.id} className="hover:bg-gray-50/80 transition">
                                                <td className="py-3 px-4 font-mono text-gray-800">
                                                    {red.source_path}
                                                </td>
                                                <td className="py-3 px-4 font-mono text-blue-600 truncate max-w-xs">
                                                    {red.target_path}
                                                </td>
                                                <td className="py-3 px-4">
                                                    <span className={`px-2 py-0.5 rounded font-bold text-[10px] ${
                                                        red.status_code === 301 ? 'bg-emerald-100 text-emerald-800' : 'bg-blue-100 text-blue-800'
                                                    }`}>
                                                        {red.status_code} {red.status_code === 301 ? 'Permanent' : 'Temporary'}
                                                    </span>
                                                </td>
                                                <td className="py-3 px-4 text-gray-600 font-semibold">
                                                    {red.hits || 0}
                                                </td>
                                                <td className="py-3 px-4">
                                                    <button
                                                        type="button"
                                                        onClick={() => toggleRedirect(red.id)}
                                                        className={`px-2 py-0.5 rounded text-[10px] font-bold transition ${
                                                            red.is_active ? 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200' : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                                                        }`}
                                                    >
                                                        {red.is_active ? 'Active' : 'Disabled'}
                                                    </button>
                                                </td>
                                                <td className="py-3 px-4 text-right space-x-2">
                                                    <button
                                                        type="button"
                                                        onClick={() => startEditRedirect(red)}
                                                        className="text-xs text-blue-600 hover:underline font-semibold"
                                                    >
                                                        Edit
                                                    </button>
                                                    <button
                                                        type="button"
                                                        onClick={() => deleteRedirect(red.id)}
                                                        className="text-xs text-rose-600 hover:underline font-semibold"
                                                    >
                                                        Delete
                                                    </button>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>

                        {/* Modal for Add / Edit Redirect */}
                        {showRedirectModal && (
                            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
                                <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-gray-100 space-y-4">
                                    <div className="flex items-center justify-between border-b pb-3">
                                        <h3 className="text-sm font-bold text-gray-900">
                                            {editingRedirect ? 'Edit Redirection Rule' : 'Create 301 / 302 Redirection'}
                                        </h3>
                                        <button
                                            type="button"
                                            onClick={() => setShowRedirectModal(false)}
                                            className="text-gray-400 hover:text-gray-600 text-xs font-bold"
                                        >
                                            ✕
                                        </button>
                                    </div>

                                    <form onSubmit={handleCreateOrUpdateRedirect} className="space-y-4">
                                        <div>
                                            <label className="block text-xs font-bold text-gray-700 mb-1">
                                                Source Old URL / Path
                                            </label>
                                            <input
                                                type="text"
                                                value={redirectForm.data.source_path}
                                                onChange={(e) => redirectForm.setData('source_path', e.target.value)}
                                                placeholder="/old-dell-laptop"
                                                required
                                                className="w-full text-xs font-mono border-gray-300 rounded-xl focus:ring-[#EF4A23]"
                                            />
                                            <p className="text-[10px] text-gray-400 mt-1">Relative path starting with a slash.</p>
                                        </div>

                                        <div>
                                            <label className="block text-xs font-bold text-gray-700 mb-1">
                                                Destination Target URL
                                            </label>
                                            <input
                                                type="text"
                                                value={redirectForm.data.target_path}
                                                onChange={(e) => redirectForm.setData('target_path', e.target.value)}
                                                placeholder="/product/dell-inspiron-15"
                                                required
                                                className="w-full text-xs font-mono border-gray-300 rounded-xl focus:ring-[#EF4A23]"
                                            />
                                        </div>

                                        <div className="grid grid-cols-2 gap-3">
                                            <div>
                                                <label className="block text-xs font-bold text-gray-700 mb-1">Status Code</label>
                                                <select
                                                    value={redirectForm.data.status_code}
                                                    onChange={(e) => redirectForm.setData('status_code', e.target.value)}
                                                    className="w-full text-xs font-semibold rounded-xl border-gray-300"
                                                >
                                                    <option value="301">301 (Moved Permanently)</option>
                                                    <option value="302">302 (Found / Temporary)</option>
                                                </select>
                                            </div>
                                            <div>
                                                <label className="block text-xs font-bold text-gray-700 mb-1">Rule State</label>
                                                <label className="flex items-center gap-2 text-xs font-semibold text-gray-700 pt-2 cursor-pointer">
                                                    <input
                                                        type="checkbox"
                                                        checked={redirectForm.data.is_active}
                                                        onChange={(e) => redirectForm.setData('is_active', e.target.checked)}
                                                        className="w-4 h-4 text-[#EF4A23] rounded focus:ring-[#EF4A23]"
                                                    />
                                                    <span>Active</span>
                                                </label>
                                            </div>
                                        </div>

                                        <div className="flex justify-end gap-2 pt-4 border-t">
                                            <button
                                                type="button"
                                                onClick={() => setShowRedirectModal(false)}
                                                className="px-4 py-2 text-xs font-bold text-gray-600 hover:bg-gray-100 rounded-xl transition"
                                            >
                                                Cancel
                                            </button>
                                            <button
                                                type="submit"
                                                disabled={redirectForm.processing}
                                                className="px-5 py-2 bg-[#EF4A23] hover:bg-[#d63d1a] text-white text-xs font-bold rounded-xl shadow transition"
                                            >
                                                {redirectForm.processing ? 'Saving...' : (editingRedirect ? 'Update Rule' : 'Save Rule')}
                                            </button>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </AdminLayout>
    );
}
