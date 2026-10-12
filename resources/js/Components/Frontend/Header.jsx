import React, { useState, useEffect, useRef } from 'react';
import { Link, usePage, router } from '@inertiajs/react';
import {
    Search,
    ShoppingCart,
    User,
    Cpu,
    Zap,
    Gift,
    PhoneCall,
    Menu,
    X,
    ChevronDown,
    ChevronRight,
    MapPin,
    Home,
    Percent,
    SlidersHorizontal,
    Sparkles,
    LogOut
} from 'lucide-react';

export default function Header() {
    const { auth, cart, settings, categoriesNav = [] } = usePage().props;
    const [searchQuery, setSearchQuery] = useState('');
    const [suggestions, setSuggestions] = useState([]);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [userMenuOpen, setUserMenuOpen] = useState(false);
    const [expandedCategories, setExpandedCategories] = useState({});
    const searchRef = useRef(null);
    const mobileSearchRef = useRef(null);
    const userDropdownRef = useRef(null);

    // Calculate cart count & amount safely whether cart is structured object or array of items
    const cartCount = Array.isArray(cart)
        ? cart.reduce((sum, item) => sum + (Number(item?.quantity) || 1), 0)
        : (Number(cart?.count) || (Array.isArray(cart?.items) ? cart.items.reduce((sum, item) => sum + (Number(item?.quantity) || 1), 0) : 0));

    const cartTotal = Array.isArray(cart)
        ? cart.reduce((sum, item) => sum + ((Number(item?.price) || 0) * (Number(item?.quantity) || 1)), 0)
        : (Number(cart?.total) || (Array.isArray(cart?.items) ? cart.items.reduce((sum, item) => sum + ((Number(item?.price) || 0) * (Number(item?.quantity) || 1)), 0) : 0));

    // Live search autocomplete
    useEffect(() => {
        if (searchQuery.trim().length >= 2) {
            const timer = setTimeout(() => {
                fetch(`/api/search/autocomplete?q=${encodeURIComponent(searchQuery)}`)
                    .then(res => res.json())
                    .then(data => {
                        setSuggestions(data);
                        setShowSuggestions(true);
                    })
                    .catch(() => setSuggestions([]));
            }, 250);
            return () => clearTimeout(timer);
        } else {
            setSuggestions([]);
            setShowSuggestions(false);
        }
    }, [searchQuery]);

    // Close suggestions and user menu when clicking outside
    useEffect(() => {
        function handleClickOutside(e) {
            if (
                searchRef.current && !searchRef.current.contains(e.target) &&
                mobileSearchRef.current && !mobileSearchRef.current.contains(e.target)
            ) {
                setShowSuggestions(false);
            }
            if (userDropdownRef.current && !userDropdownRef.current.contains(e.target)) {
                setUserMenuOpen(false);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Prevent body scroll when mobile menu is open
    useEffect(() => {
        if (mobileMenuOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [mobileMenuOpen]);

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            setShowSuggestions(false);
            setMobileMenuOpen(false);
            router.get(route('search'), { q: searchQuery });
        }
    };

    const toggleCategoryExpand = (catId) => {
        setExpandedCategories(prev => ({
            ...prev,
            [catId]: !prev[catId]
        }));
    };

    return (
        <>
            <header
                className="w-full text-white"
                style={{ backgroundColor: settings?.header_bg_color || '#081621' }}
            >
                {/* 1. Top Bar */}
                <div className="border-b border-gray-800 text-[11px] sm:text-xs py-1.5 px-3 sm:px-6 lg:px-8">
                    <div className="max-w-7xl mx-auto flex items-center justify-between">
                        <div className="flex items-center space-x-3 sm:space-x-6 text-gray-300">
                            <a
                                href={`tel:${settings?.hotline || '16793'}`}
                                className="flex items-center gap-1.5 font-semibold hover:opacity-85 transition"
                                style={{ color: settings?.primary_color || '#EF4A23' }}
                            >
                                <PhoneCall className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                                <span>Hotline: {settings?.hotline || '16793'}</span>
                                <span className="hidden sm:inline font-normal text-gray-400">({settings?.working_hours || '10 AM - 7 PM'})</span>
                            </a>
                            {settings?.whatsapp && (
                                <a
                                    href={`https://wa.me/${settings.whatsapp.replace(/[^0-9]/g, '')}?text=Hello%20${encodeURIComponent(settings?.site_name || 'Tech Shoppers')}%2C%20I%20have%20an%20inquiry.`}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="hidden md:flex items-center gap-1.5 text-emerald-400 font-semibold hover:text-emerald-300 transition"
                                >
                                    <svg className="w-3.5 h-3.5 shrink-0" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
                                    </svg>
                                    <span>WhatsApp: {settings.whatsapp}</span>
                                </a>
                            )}
                            <span className="hidden lg:inline-flex items-center gap-1">
                                <MapPin className="w-3 h-3 text-gray-400" /> Over 18+ Outlets Nationwide
                            </span>
                        </div>
                        <div className="flex items-center space-x-2 sm:space-x-4 text-gray-300 text-[11px] sm:text-xs">
                            <Link href="/page/order-tracking" className="hover:text-orange-400 transition hidden sm:inline">Order Tracking</Link>
                            <span className="text-gray-600 hidden sm:inline">|</span>
                            <Link href="/emi-calculation" className="hover:text-orange-400 transition font-medium">0% EMI Calculator</Link>
                            <span className="text-gray-600">|</span>
                            <Link href="/page/service-complain" className="hover:text-orange-400 transition">Warranty & RMA</Link>
                        </div>
                    </div>
                </div>

                {/* 2. Main Header */}
                <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-2.5 sm:py-3.5 flex items-center justify-between gap-3 sm:gap-4">
                    {/* Left: Mobile Hamburger & Logo */}
                    <div className="flex items-center gap-2 sm:gap-3">
                        <button
                            type="button"
                            onClick={() => setMobileMenuOpen(true)}
                            className="lg:hidden text-gray-300 hover:text-white p-1 rounded-lg hover:bg-gray-800 transition"
                            aria-label="Open Navigation Menu"
                        >
                            <Menu className="w-6 h-6" />
                        </button>
                        <Link href={route('home')} className="flex items-center gap-1.5 group shrink-0">
                            {settings?.site_logo ? (
                                <img
                                    src={settings.site_logo}
                                    alt={settings?.site_name || 'Logo'}
                                    className="h-8 sm:h-9 max-w-[170px] object-contain"
                                />
                            ) : (
                                <>
                                    <span className="text-xl sm:text-2xl font-black tracking-tight text-white group-hover:text-gray-100">
                                        {settings?.site_name ? settings.site_name.split(' ')[0] : 'TECH'}
                                    </span>
                                    <span
                                        className="text-xl sm:text-2xl font-black tracking-tight"
                                        style={{ color: settings?.primary_color || '#EF4A23' }}
                                    >
                                        {settings?.site_name ? (settings.site_name.split(' ').slice(1).join(' ') || 'SHOPPERS') : 'SHOPPERS'}
                                    </span>
                                    <span
                                        className="w-2 h-2 rounded-full animate-pulse"
                                        style={{ backgroundColor: settings?.primary_color || '#EF4A23' }}
                                    ></span>
                                </>
                            )}
                        </Link>
                    </div>

                    {/* Center: Search Bar (Desktop) */}
                    <div className="hidden lg:flex flex-1 max-w-2xl relative" ref={searchRef}>
                        <form onSubmit={handleSearchSubmit} className="relative w-full flex items-center">
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                onFocus={() => suggestions.length > 0 && setShowSuggestions(true)}
                                placeholder="Search laptop, desktop, graphics card, processor, monitor..."
                                className="w-full bg-[#112233] text-sm text-gray-100 placeholder-gray-400 pl-4 pr-12 py-2.5 rounded-full border border-gray-700 focus:outline-none focus:border-[#EF4A23] focus:ring-1 focus:ring-[#EF4A23] transition-all"
                            />
                            <button
                                type="submit"
                                className="absolute right-1 top-1 bottom-1 px-4 bg-[#EF4A23] hover:bg-[#d63c17] text-white rounded-full flex items-center justify-center transition"
                                title="Search"
                            >
                                <Search className="w-4 h-4" />
                            </button>
                        </form>

                        {/* Autocomplete Dropdown */}
                        {showSuggestions && suggestions.length > 0 && (
                            <div className="absolute top-full left-0 right-0 mt-2 bg-[#0e1d2c] border border-gray-700 rounded-xl shadow-2xl overflow-hidden z-50">
                                <div className="p-2 border-b border-gray-800 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                                    Matching Products
                                </div>
                                <div className="divide-y divide-gray-800/60 max-h-80 overflow-y-auto">
                                    {suggestions.map((item) => (
                                        <Link
                                            key={item.id}
                                            href={route('product.show', item.slug)}
                                            onClick={() => setShowSuggestions(false)}
                                            className="flex items-center gap-3 p-3 hover:bg-[#162a3d] transition group"
                                        >
                                            <img
                                                src={item.thumbnail || 'https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?w=100'}
                                                alt={item.name}
                                                className="w-10 h-10 object-cover rounded bg-white p-0.5 shrink-0"
                                            />
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm font-medium text-gray-200 group-hover:text-[#EF4A23] truncate transition">
                                                    {item.name}
                                                </p>
                                                <p className="text-xs text-gray-400">{item.model || ''}</p>
                                            </div>
                                            <div className="text-right shrink-0">
                                                <span className="text-sm font-bold text-[#EF4A23]">
                                                    ৳{(item.special_price || item.regular_price).toLocaleString()}
                                                </span>
                                            </div>
                                        </Link>
                                    ))}
                                </div>
                                <div className="p-2 bg-[#091520] text-center border-t border-gray-800">
                                    <button
                                        type="button"
                                        onClick={handleSearchSubmit}
                                        className="text-xs text-orange-400 hover:text-orange-300 font-medium"
                                    >
                                        View all results for "{searchQuery}" →
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Right: Actions */}
                    <div className="flex items-center gap-2 sm:gap-3">
                        {/* PC Builder Button */}
                        <Link
                            href="/pc-builder"
                            className="flex items-center gap-1.5 sm:gap-2 text-xs font-semibold bg-[#1a2f42] hover:bg-[#223d56] text-[#EF4A23] px-2.5 sm:px-3.5 py-1.5 sm:py-2 rounded-lg border border-orange-500/30 transition shadow-sm"
                        >
                            <Cpu className="w-4 h-4 text-[#EF4A23]" />
                            <div className="text-left hidden xs:block">
                                <span className="block text-gray-400 text-[9px] uppercase font-normal leading-none">Custom</span>
                                <span className="text-white font-bold text-[11px] sm:text-xs">PC Builder</span>
                            </div>
                        </Link>

                        {/* Cart */}
                        <Link
                            href={route('cart.index')}
                            className="relative flex items-center gap-1.5 sm:gap-2 text-xs font-semibold bg-gray-800/80 hover:bg-gray-800 text-white px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-lg transition"
                        >
                            <div className="relative">
                                <ShoppingCart className="w-4 h-4 sm:w-5 sm:h-5 text-[#EF4A23]" />
                                {cartCount > 0 && (
                                    <span className="absolute -top-2 -right-2 bg-[#EF4A23] text-white text-[10px] font-bold rounded-full h-4 w-4 flex items-center justify-center animate-pulse">
                                        {cartCount}
                                    </span>
                                )}
                            </div>
                            <div className="hidden md:block text-left">
                                <span className="block text-gray-400 text-[9px] uppercase font-normal leading-none">Cart</span>
                                <span>৳{cartTotal.toLocaleString()}</span>
                            </div>
                        </Link>

                        {/* Account */}
                        {auth?.user ? (
                            <div className="relative" ref={userDropdownRef}>
                                <button
                                    type="button"
                                    onClick={() => setUserMenuOpen(!userMenuOpen)}
                                    className="flex items-center gap-1.5 sm:gap-2 text-xs font-semibold bg-gray-800/80 hover:bg-gray-800 text-white px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-lg transition"
                                    aria-expanded={userMenuOpen}
                                    title="Account Menu"
                                >
                                    <div className="w-5 h-5 rounded-full bg-[#EF4A23] text-white flex items-center justify-center font-bold text-[10px]">
                                        {auth.user.name?.charAt(0).toUpperCase() || 'U'}
                                    </div>
                                    <span className="hidden sm:inline font-medium text-xs truncate max-w-[85px]">
                                        {auth.user.name.split(' ')[0]}
                                    </span>
                                    <ChevronDown className={`w-3 h-3 text-gray-400 transition-transform duration-200 ${userMenuOpen ? 'rotate-180 text-orange-400' : ''}`} />
                                </button>

                                {/* Dropdown Menu */}
                                {userMenuOpen && (
                                    <div className="absolute right-0 mt-2 w-56 bg-[#0c1a26] border border-gray-700/80 rounded-2xl shadow-2xl py-1.5 z-50 divide-y divide-gray-800/80 text-xs animate-in fade-in zoom-in-95 duration-150">
                                        <div className="px-3.5 py-2.5 bg-[#081621]/60">
                                            <p className="font-bold text-white text-xs truncate">{auth.user.name}</p>
                                            <p className="text-[11px] text-gray-400 truncate mt-0.5">{auth.user.email}</p>
                                            {auth.user.role === 'admin' ? (
                                                <span className="inline-block mt-1 text-[9px] bg-red-500/20 text-red-300 border border-red-500/30 px-1.5 py-0.2 rounded font-mono font-bold uppercase">Admin</span>
                                            ) : (
                                                <span className="inline-block mt-1 text-[9px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-1.5 py-0.2 rounded font-mono font-bold uppercase">Customer</span>
                                            )}
                                        </div>

                                        <div className="py-1">
                                            {auth.user.role === 'admin' ? (
                                                <Link
                                                    href={route('admin.dashboard')}
                                                    onClick={() => setUserMenuOpen(false)}
                                                    className="flex items-center gap-2.5 px-3.5 py-2 text-gray-200 hover:text-white hover:bg-gray-800 transition"
                                                >
                                                    <User className="w-4 h-4 text-orange-400" />
                                                    <span>Admin Dashboard</span>
                                                </Link>
                                            ) : (
                                                <>
                                                    <Link
                                                        href={route('dashboard')}
                                                        onClick={() => setUserMenuOpen(false)}
                                                        className="flex items-center gap-2.5 px-3.5 py-2 text-gray-200 hover:text-white hover:bg-gray-800 transition"
                                                    >
                                                        <User className="w-4 h-4 text-orange-400" />
                                                        <span>Customer Account</span>
                                                    </Link>
                                                    <Link
                                                        href="/dashboard?tab=orders"
                                                        onClick={() => setUserMenuOpen(false)}
                                                        className="flex items-center gap-2.5 px-3.5 py-2 text-gray-200 hover:text-white hover:bg-gray-800 transition"
                                                    >
                                                        <ShoppingCart className="w-4 h-4 text-blue-400" />
                                                        <span>Order History</span>
                                                    </Link>
                                                    <Link
                                                        href="/dashboard?tab=pc_builds"
                                                        onClick={() => setUserMenuOpen(false)}
                                                        className="flex items-center gap-2.5 px-3.5 py-2 text-gray-200 hover:text-white hover:bg-gray-800 transition"
                                                    >
                                                        <Cpu className="w-4 h-4 text-purple-400" />
                                                        <span>Saved PC Builds</span>
                                                    </Link>
                                                </>
                                            )}
                                        </div>

                                        <div className="py-1">
                                            <Link
                                                href={route('logout')}
                                                method="post"
                                                as="button"
                                                onClick={() => setUserMenuOpen(false)}
                                                className="w-full flex items-center gap-2.5 px-3.5 py-2 text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 transition font-bold"
                                            >
                                                <LogOut className="w-4 h-4 text-rose-400" />
                                                <span>Log Out</span>
                                            </Link>
                                        </div>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <Link
                                href={route('login')}
                                className="flex items-center gap-1 sm:gap-1.5 text-xs font-semibold bg-[#EF4A23] hover:bg-[#d63c17] text-white px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg transition shadow-sm"
                            >
                                <User className="w-3.5 h-3.5" />
                                <span>Login</span>
                            </Link>
                        )}
                    </div>
                </div>

                {/* 3. Mobile Search Bar (Only visible on screens < lg) */}
                <div className="lg:hidden px-3 sm:px-6 pb-2.5 pt-0.5" ref={mobileSearchRef}>
                    <form onSubmit={handleSearchSubmit} className="relative flex items-center">
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            onFocus={() => suggestions.length > 0 && setShowSuggestions(true)}
                            placeholder="Search laptop, desktop, component..."
                            className="w-full bg-[#112233] text-xs text-gray-100 placeholder-gray-400 pl-3.5 pr-10 py-2 rounded-xl border border-gray-700 focus:outline-none focus:border-[#EF4A23]"
                        />
                        <button
                            type="submit"
                            className="absolute right-1 top-1 bottom-1 px-3 bg-[#EF4A23] text-white rounded-lg flex items-center justify-center"
                        >
                            <Search className="w-3.5 h-3.5" />
                        </button>
                    </form>

                    {/* Mobile Autocomplete */}
                    {showSuggestions && suggestions.length > 0 && (
                        <div className="absolute left-3 right-3 mt-1.5 bg-[#0e1d2c] border border-gray-700 rounded-xl shadow-2xl overflow-hidden z-50">
                            <div className="divide-y divide-gray-800 max-h-64 overflow-y-auto">
                                {suggestions.map((item) => (
                                    <Link
                                        key={item.id}
                                        href={route('product.show', item.slug)}
                                        onClick={() => setShowSuggestions(false)}
                                        className="flex items-center gap-2.5 p-2.5 hover:bg-[#162a3d]"
                                    >
                                        <img
                                            src={item.thumbnail || 'https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?w=80'}
                                            alt={item.name}
                                            className="w-8 h-8 object-cover rounded bg-white p-0.5 shrink-0"
                                        />
                                        <div className="flex-1 min-w-0 text-left">
                                            <p className="text-xs font-medium text-gray-200 truncate">{item.name}</p>
                                            <p className="text-[10px] text-[#EF4A23] font-bold">
                                                ৳{(item.special_price || item.regular_price).toLocaleString()}
                                            </p>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </header>

            {/* 4. MOBILE SLIDE-OUT OFF-CANVAS DRAWER */}
            {mobileMenuOpen && (
                <div className="fixed inset-0 z-50 lg:hidden flex print:hidden">
                    {/* Backdrop */}
                    <div
                        className="fixed inset-0 bg-black/70 backdrop-blur-sm transition-opacity"
                        onClick={() => setMobileMenuOpen(false)}
                    />

                    {/* Drawer Content */}
                    <div className="relative w-4/5 max-w-sm bg-[#081621] text-white h-full flex flex-col shadow-2xl z-10 animate-in slide-in-from-left duration-250">
                        {/* Drawer Header */}
                        <div className="p-4 border-b border-gray-800 flex items-center justify-between">
                            <Link
                                href="/"
                                onClick={() => setMobileMenuOpen(false)}
                                className="flex items-center gap-1.5"
                            >
                                {settings?.site_logo ? (
                                    <img src={settings.site_logo} alt={settings?.site_name || 'Logo'} className="h-7 max-w-[140px] object-contain" />
                                ) : (
                                    <>
                                        <span className="text-xl font-black text-white">
                                            {settings?.site_name ? settings.site_name.split(' ')[0] : 'TECH'}
                                        </span>
                                        <span className="text-xl font-black" style={{ color: settings?.primary_color || '#EF4A23' }}>
                                            {settings?.site_name ? (settings.site_name.split(' ').slice(1).join(' ') || 'SHOPPERS') : 'SHOPPERS'}
                                        </span>
                                    </>
                                )}
                            </Link>
                            <button
                                type="button"
                                onClick={() => setMobileMenuOpen(false)}
                                className="p-1.5 text-gray-400 hover:text-white rounded-lg hover:bg-gray-800 transition"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {/* User Status Bar */}
                        <div className="p-3 bg-[#112233] border-b border-gray-800 flex items-center justify-between text-xs">
                            {auth?.user ? (
                                <div className="flex items-center justify-between w-full gap-2">
                                    <div className="flex items-center gap-2.5 min-w-0">
                                        <div className="w-8 h-8 rounded-full bg-[#EF4A23] flex items-center justify-center font-bold text-white text-xs shrink-0">
                                            {auth.user.name?.charAt(0) || 'U'}
                                        </div>
                                        <div className="min-w-0">
                                            <p className="font-bold text-white truncate max-w-[120px]">{auth.user.name}</p>
                                            <Link
                                                href={auth.user.role === 'admin' ? route('admin.dashboard') : route('dashboard')}
                                                onClick={() => setMobileMenuOpen(false)}
                                                className="text-[10px] text-orange-400 hover:underline block truncate"
                                            >
                                                {auth.user.role === 'admin' ? 'Admin Panel' : 'My Account'}
                                            </Link>
                                        </div>
                                    </div>
                                    <Link
                                        href={route('logout')}
                                        method="post"
                                        as="button"
                                        onClick={() => setMobileMenuOpen(false)}
                                        className="shrink-0 flex items-center gap-1 text-[11px] font-bold text-rose-300 hover:text-white bg-rose-500/20 hover:bg-rose-500/30 px-2.5 py-1.5 rounded-lg border border-rose-500/30 transition"
                                    >
                                        <LogOut className="w-3.5 h-3.5 text-rose-400" />
                                        <span>Logout</span>
                                    </Link>
                                </div>
                            ) : (
                                <div className="flex items-center justify-between w-full">
                                    <span className="text-gray-300">Welcome, Guest</span>
                                    <Link
                                        href={route('login')}
                                        onClick={() => setMobileMenuOpen(false)}
                                        className="bg-[#EF4A23] text-white font-bold px-3 py-1 rounded-lg text-xs"
                                    >
                                        Login / Register
                                    </Link>
                                </div>
                            )}
                        </div>

                        {/* Navigation Categories List */}
                        <div className="flex-1 overflow-y-auto divide-y divide-gray-800/80 text-xs">
                            <div className="p-2 font-bold uppercase text-[10px] text-gray-400 tracking-wider">
                                All Categories
                            </div>

                            {categoriesNav.map((cat) => {
                                const hasChildren = cat.children && cat.children.length > 0;
                                const isExpanded = !!expandedCategories[cat.id];

                                return (
                                    <div key={cat.id} className="py-0.5">
                                        <div className="flex items-center justify-between px-4 py-2.5 hover:bg-[#112233] transition">
                                            <Link
                                                href={route('category.show', cat.slug)}
                                                onClick={() => setMobileMenuOpen(false)}
                                                className="flex-1 font-semibold text-gray-200 hover:text-[#EF4A23]"
                                            >
                                                {cat.name}
                                            </Link>
                                            {hasChildren && (
                                                <button
                                                    type="button"
                                                    onClick={() => toggleCategoryExpand(cat.id)}
                                                    className="p-1 text-gray-400 hover:text-white"
                                                >
                                                    <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${isExpanded ? 'rotate-180 text-[#EF4A23]' : ''}`} />
                                                </button>
                                            )}
                                        </div>

                                        {/* Subcategories Accordion */}
                                        {hasChildren && isExpanded && (
                                            <div className="bg-[#0b1b28] py-1 pl-6 pr-4 space-y-1">
                                                {cat.children.map((child) => (
                                                    <Link
                                                        key={child.id}
                                                        href={route('category.show', child.slug)}
                                                        onClick={() => setMobileMenuOpen(false)}
                                                        className="block py-1.5 text-[11px] text-gray-400 hover:text-white hover:text-orange-400 transition"
                                                    >
                                                        {child.name}
                                                    </Link>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                );
                            })}

                            {/* Additional Links */}
                            <div className="p-2 font-bold uppercase text-[10px] text-gray-400 tracking-wider">
                                Quick Features
                            </div>
                            <Link
                                href="/pc-builder"
                                onClick={() => setMobileMenuOpen(false)}
                                className="flex items-center gap-2.5 px-4 py-2.5 font-semibold text-orange-400 hover:bg-[#112233]"
                            >
                                <Cpu className="w-4 h-4" />
                                <span>Custom PC Builder</span>
                            </Link>
                            <Link
                                href="/emi-calculation"
                                onClick={() => setMobileMenuOpen(false)}
                                className="flex items-center gap-2.5 px-4 py-2.5 font-semibold text-gray-300 hover:bg-[#112233]"
                            >
                                <Percent className="w-4 h-4 text-[#EF4A23]" />
                                <span>0% EMI Calculator</span>
                            </Link>
                            <Link
                                href="/page/order-tracking"
                                onClick={() => setMobileMenuOpen(false)}
                                className="flex items-center gap-2.5 px-4 py-2.5 font-semibold text-gray-300 hover:bg-[#112233]"
                            >
                                <Gift className="w-4 h-4 text-[#EF4A23]" />
                                <span>Order Tracking</span>
                            </Link>
                            <a
                                href={`tel:${settings?.hotline || '16793'}`}
                                className="flex items-center gap-2.5 px-4 py-2.5 font-semibold text-emerald-400 hover:bg-[#112233]"
                            >
                                <PhoneCall className="w-4 h-4" />
                                <span>Hotline: {settings?.hotline || '16793'}</span>
                            </a>

                            {auth?.user && (
                                <div className="p-3 border-t border-gray-800/80 mt-2">
                                    <Link
                                        href={route('logout')}
                                        method="post"
                                        as="button"
                                        onClick={() => setMobileMenuOpen(false)}
                                        className="w-full flex items-center justify-center gap-2 py-2 px-4 rounded-xl bg-rose-500/15 hover:bg-rose-500/25 text-rose-300 font-bold text-xs border border-rose-500/30 transition"
                                    >
                                        <LogOut className="w-4 h-4" />
                                        <span>Sign Out</span>
                                    </Link>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* 5. TECH SHOPPERS MOBILE BOTTOM DOCK (Sticky on phones & tablets) */}
            <nav className="fixed bottom-0 left-0 right-0 z-40 bg-[#081621] border-t border-gray-800 lg:hidden shadow-2xl px-2 py-1.5 flex items-center justify-around text-[10px] text-gray-300 select-none print:hidden">
                <Link
                    href="/"
                    className="flex flex-col items-center gap-0.5 hover:text-[#EF4A23] transition py-1 px-2"
                >
                    <Home className="w-4 h-4" />
                    <span>Home</span>
                </Link>

                <Link
                    href="/"
                    className="flex flex-col items-center gap-0.5 hover:text-[#EF4A23] transition py-1 px-2"
                >
                    <Gift className="w-4 h-4 text-amber-400" />
                    <span>Offers</span>
                </Link>

                <Link
                    href="/pc-builder"
                    className="flex flex-col items-center gap-0.5 text-[#EF4A23] font-bold transition py-1 px-2"
                >
                    <div className="w-7 h-7 -mt-3.5 rounded-full bg-[#EF4A23] text-white flex items-center justify-center shadow-lg border-2 border-[#081621]">
                        <Cpu className="w-4 h-4" />
                    </div>
                    <span>PC Build</span>
                </Link>

                <Link
                    href={route('cart.index')}
                    className="flex flex-col items-center gap-0.5 hover:text-[#EF4A23] transition py-1 px-2 relative"
                >
                    <div className="relative">
                        <ShoppingCart className="w-4 h-4" />
                        {cartCount > 0 && (
                            <span className="absolute -top-1.5 -right-2 bg-[#EF4A23] text-white text-[9px] font-bold rounded-full h-3.5 w-3.5 flex items-center justify-center">
                                {cartCount}
                            </span>
                        )}
                    </div>
                    <span>Cart</span>
                </Link>

                <Link
                    href={auth?.user ? (auth.user.role === 'admin' ? route('admin.dashboard') : route('dashboard')) : route('login')}
                    className="flex flex-col items-center gap-0.5 hover:text-[#EF4A23] transition py-1 px-2"
                >
                    <User className="w-4 h-4" />
                    <span>Account</span>
                </Link>
            </nav>
        </>
    );
}
