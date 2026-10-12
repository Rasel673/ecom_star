import React from 'react';
import { Link, usePage } from '@inertiajs/react';
import FrontendLayout from '@/Layouts/FrontendLayout';
import HeroSlider from '@/Components/Frontend/HeroSlider';
import ProductCard from '@/Components/Frontend/ProductCard';
import QuickServicesBar from '@/Components/Frontend/QuickServicesBar';
import { 
    Monitor, 
    Laptop, 
    Cpu, 
    Tv, 
    Keyboard, 
    Wifi, 
    Watch, 
    Gamepad2, 
    Sparkles, 
    Flame, 
    ArrowRight,
    TrendingUp
} from 'lucide-react';

const iconMap = {
    'Monitor': Monitor,
    'Laptop': Laptop,
    'Cpu': Cpu,
    'Tv': Tv,
    'Keyboard': Keyboard,
    'Wifi': Wifi,
    'Watch': Watch,
    'Gamepad2': Gamepad2,
};

export default function Home({
    heroBanners = [],
    promoBanners = [],
    featuredCategories = [],
    featuredProducts = [],
    popularProducts = [],
    latestProducts = [],
    brands = [],
    seo = {}
}) {
    const { settings } = usePage().props;

    return (
        <FrontendLayout title={seo.title} description={seo.description}>
            {/* 1. Hero & Side Promo Banners */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-10">
                <div className="lg:col-span-2">
                    <HeroSlider banners={heroBanners} />
                </div>
                <div className="hidden lg:flex flex-col gap-4 justify-between">
                    {promoBanners.slice(0, 2).map((promo, idx) => (
                        <Link
                            key={idx}
                            href={promo.link || '#'}
                            className="relative flex-1 rounded-2xl overflow-hidden group shadow-md bg-gray-900 border border-gray-800"
                        >
                            <img
                                src={promo.image}
                                alt={promo.title || 'Promo'}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-5">
                                <h3 className="text-base font-bold text-white leading-snug drop-shadow">
                                    {promo.title}
                                </h3>
                                <p className="text-xs text-orange-400 mt-1 font-semibold flex items-center gap-1">
                                    View Details <ArrowRight className="w-3.5 h-3.5" />
                                </p>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>

            {/* Quick Services & Daily Announcement Bar */}
            <QuickServicesBar settings={settings} />

            {/* 2. Featured Categories */}
            <div className="mb-12">
                <div className="text-center mb-6">
                    <h2 className="text-xl md:text-2xl font-black text-gray-900 tracking-tight">
                        Featured Categories
                    </h2>
                    <p className="text-xs text-gray-500 mt-1">Get your desired product from featured category!</p>
                </div>
                <div className="grid grid-cols-4 sm:grid-cols-4 md:grid-cols-8 gap-2 sm:gap-3">
                    {featuredCategories.map((cat) => {
                        const IconComponent = iconMap[cat.icon] || Cpu;
                        return (
                            <Link
                                key={cat.id}
                                href={route('category.show', cat.slug)}
                                className="bg-white hover:bg-[#081621] border border-gray-200 hover:border-[#081621] rounded-xl p-2.5 sm:p-4 flex flex-col items-center justify-center gap-1.5 sm:gap-2 text-center group transition-all duration-200 shadow-sm hover:shadow-md"
                            >
                                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-orange-50 group-hover:bg-[#EF4A23] flex items-center justify-center text-[#EF4A23] group-hover:text-white transition">
                                    <IconComponent className="w-5 h-5 sm:w-6 sm:h-6" />
                                </div>
                                <span className="text-[10px] sm:text-xs font-bold text-gray-800 group-hover:text-white transition line-clamp-1">
                                    {cat.name}
                                </span>
                            </Link>
                        );
                    })}
                </div>
            </div>

            {/* 3. Featured Products */}
            <div className="mb-10 sm:mb-14">
                <div className="flex items-center justify-between mb-4 sm:mb-6 border-b border-gray-200 pb-2 sm:pb-3">
                    <div>
                        <div className="flex items-center gap-1.5 sm:gap-2">
                            <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-[#EF4A23]" />
                            <h2 className="text-lg sm:text-xl md:text-2xl font-black text-gray-900 tracking-tight">
                                Featured Products
                            </h2>
                        </div>
                        <p className="text-[11px] sm:text-xs text-gray-500 mt-0.5">Check & get your desired product!</p>
                    </div>
                    <Link
                        href={route('category.show', 'desktop')}
                        className="text-xs font-bold text-[#EF4A23] hover:text-[#d63c17] flex items-center gap-1 transition"
                    >
                        View All <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-5">
                    {featuredProducts.map((product) => (
                        <ProductCard key={product.id} product={product} />
                    ))}
                </div>
            </div>

            {/* 4. Popular Products & Deals */}
            <div className="mb-10 sm:mb-14">
                <div className="flex items-center justify-between mb-4 sm:mb-6 border-b border-gray-200 pb-2 sm:pb-3">
                    <div>
                        <div className="flex items-center gap-1.5 sm:gap-2">
                            <Flame className="w-4 h-4 sm:w-5 sm:h-5 text-amber-500" />
                            <h2 className="text-lg sm:text-xl md:text-2xl font-black text-gray-900 tracking-tight">
                                Top Trending & Popular
                            </h2>
                        </div>
                        <p className="text-[11px] sm:text-xs text-gray-500 mt-0.5">Most in-demand computer hardware and tech accessories</p>
                    </div>
                    <Link
                        href={route('category.show', 'component')}
                        className="text-xs font-bold text-[#EF4A23] hover:text-[#d63c17] flex items-center gap-1 transition"
                    >
                        Explore More <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-5">
                    {popularProducts.map((product) => (
                        <ProductCard key={product.id} product={product} />
                    ))}
                </div>
            </div>

            {/* 5. PC Builder Banner Promo */}
            <div className="mb-14 bg-gradient-to-r from-[#081621] via-[#112538] to-[#081621] rounded-2xl p-6 md:p-10 border border-gray-800 text-white flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl">
                <div className="max-w-xl">
                    <span className="text-xs font-bold tracking-widest text-[#EF4A23] uppercase bg-orange-500/10 border border-orange-500/20 px-3 py-1 rounded-full">
                        Custom Tool
                    </span>
                    <h3 className="text-2xl md:text-3xl font-black mt-3 leading-tight">
                        Build Your Dream PC With Live Compatibility Check
                    </h3>
                    <p className="text-sm text-gray-300 mt-2">
                        Select CPU, Motherboard, GPU, RAM, Storage, Power Supply & Casing. Calculate wattage, get instant price breakdown, and order directly.
                    </p>
                </div>
                <div>
                    <Link
                        href="/pc-builder"
                        className="inline-flex items-center gap-2 bg-[#EF4A23] hover:bg-[#d63c17] text-white font-bold text-sm px-6 py-3.5 rounded-xl shadow-lg hover:shadow-orange-500/20 transition"
                    >
                        <Cpu className="w-5 h-5" />
                        <span>Start PC Builder</span>
                        <ArrowRight className="w-4 h-4 ml-1" />
                    </Link>
                </div>
            </div>

            {/* 6. Top Brands */}
            <div className="mb-14">
                <div className="text-center mb-6">
                    <h2 className="text-xl md:text-2xl font-black text-gray-900 tracking-tight">
                        Top Brands
                    </h2>
                    <p className="text-xs text-gray-500 mt-1">Authorized distributors of world's best tech giants</p>
                </div>

                <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-4">
                    {brands.map((brand) => (
                        <div
                            key={brand.id}
                            className="bg-white border border-gray-200/90 rounded-xl p-4 flex flex-col items-center justify-center text-center shadow-sm hover:border-[#EF4A23] transition group"
                        >
                            <span className="text-sm font-extrabold text-gray-800 group-hover:text-[#EF4A23] transition">
                                {brand.name}
                            </span>
                        </div>
                    ))}
                </div>
            </div>

            {/* 7. Store SEO Bottom Info Block */}
            <div className="bg-white rounded-2xl border border-gray-200 p-6 md:p-8 text-xs text-gray-600 space-y-4">
                <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wide">
                    {settings?.site_tagline || 'Leading Computer, Laptop & Component Shop in Bangladesh'} - {settings?.site_name || 'Tech Shoppers'}
                </h3>
                <p>
                    {settings?.footer_about || `${settings?.site_name || 'Tech Shoppers'} is Bangladesh's largest retail and online shop for computers, laptops, PC gaming components, gadgets, and office electronics, delivering genuine products with official warranty, exceptional customer service, and unmatched competitive prices.`}
                </p>
            </div>
        </FrontendLayout>
    );
}
