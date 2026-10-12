import React, { useState } from 'react';
import { Head, useForm } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { 
    Settings, 
    Globe, 
    Palette, 
    PhoneCall, 
    Share2, 
    FileText, 
    Save, 
    Upload, 
    Trash2, 
    Check, 
    Image as ImageIcon,
    Building2,
    Mail,
    Clock,
    MapPin,
    Truck,
    HelpCircle
} from 'lucide-react';

const FacebookIcon = ({ className = "w-4 h-4" }) => (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24">
        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
    </svg>
);

const YoutubeIcon = ({ className = "w-4 h-4" }) => (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24">
        <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
    </svg>
);

const InstagramIcon = ({ className = "w-4 h-4" }) => (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
    </svg>
);

const TwitterIcon = ({ className = "w-4 h-4" }) => (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
);

const LinkedinIcon = ({ className = "w-4 h-4" }) => (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24">
        <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
    </svg>
);

const COLOR_PRESETS = [
    { name: 'Tech Shoppers Orange', color: '#EF4A23' },
    { name: 'Crimson Red', color: '#DC2626' },
    { name: 'Royal Blue', color: '#2563EB' },
    { name: 'Emerald Green', color: '#059669' },
    { name: 'Purple Glow', color: '#7C3AED' },
    { name: 'Amber Gold', color: '#D97706' },
    { name: 'Teal Cyan', color: '#0D9488' },
    { name: 'Midnight Dark', color: '#1E293B' },
];

export default function Index({ settings = {} }) {
    const [activeTab, setActiveTab] = useState('general');

    // Logo & favicon preview states
    const [logoPreview, setLogoPreview] = useState(settings?.site_logo || null);
    const [faviconPreview, setFaviconPreview] = useState(settings?.site_favicon || null);

    const { data, setData, post, processing, errors, recentlySuccessful } = useForm({
        site_name: settings?.site_name || '',
        site_tagline: settings?.site_tagline || '',
        site_logo: null,
        site_logo_url: settings?.site_logo || '',
        remove_site_logo: false,
        site_favicon: null,
        site_favicon_url: settings?.site_favicon || '',
        remove_site_favicon: false,
        primary_color: settings?.primary_color || '#EF4A23',
        header_bg_color: settings?.header_bg_color || '#081621',
        footer_bg_color: settings?.footer_bg_color || '#081621',
        hotline: settings?.hotline || '',
        phone: settings?.phone || '',
        whatsapp: settings?.whatsapp || '',
        email: settings?.email || '',
        address: settings?.address || '',
        working_hours: settings?.working_hours || '10:00 AM - 7:00 PM',
        facebook_url: settings?.facebook_url || '',
        youtube_url: settings?.youtube_url || '',
        instagram_url: settings?.instagram_url || '',
        twitter_url: settings?.twitter_url || '',
        linkedin_url: settings?.linkedin_url || '',
        footer_about: settings?.footer_about || '',
        footer_copyright: settings?.footer_copyright || '',
        delivery_charge_inside: settings?.delivery_charge_inside || '60',
        delivery_charge_outside: settings?.delivery_charge_outside || '120',
    });

    const handleLogoFileChange = (e) => {
        const file = e.target.files?.[0];
        if (file) {
            setData((prev) => ({ ...prev, site_logo: file, remove_site_logo: false }));
            setLogoPreview(URL.createObjectURL(file));
        }
    };

    const handleRemoveLogo = () => {
        setData((prev) => ({ ...prev, site_logo: null, site_logo_url: '', remove_site_logo: true }));
        setLogoPreview(null);
    };

    const handleFaviconFileChange = (e) => {
        const file = e.target.files?.[0];
        if (file) {
            setData((prev) => ({ ...prev, site_favicon: file, remove_site_favicon: false }));
            setFaviconPreview(URL.createObjectURL(file));
        }
    };

    const handleRemoveFavicon = () => {
        setData((prev) => ({ ...prev, site_favicon: null, site_favicon_url: '', remove_site_favicon: true }));
        setFaviconPreview(null);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('admin.settings.update'), {
            preserveScroll: true,
            forceFormData: true,
        });
    };

    const tabs = [
        { id: 'general', label: 'General & Logo', icon: Globe },
        { id: 'colors', label: 'Theme & Colors', icon: Palette },
        { id: 'contact', label: 'Contact & Store', icon: PhoneCall },
        { id: 'social', label: 'Social Media', icon: Share2 },
        { id: 'footer', label: 'Footer & Charges', icon: FileText },
    ];

    return (
        <AdminLayout title="Site Settings">
            <Head title="Site Settings - Admin" />

            <div className="max-w-5xl mx-auto space-y-6">
                {/* Header title */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2 border-b border-gray-200">
                    <div>
                        <h1 className="text-2xl font-black tracking-tight text-gray-900 flex items-center gap-2.5">
                            <Settings className="w-7 h-7 text-[#EF4A23]" />
                            <span>Site Settings</span>
                        </h1>
                        <p className="text-xs text-gray-500 mt-1">
                            Customize your store branding, logo, colors, contact numbers, social media links, and footer information.
                        </p>
                    </div>

                    <button
                        type="button"
                        onClick={handleSubmit}
                        disabled={processing}
                        className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-[#EF4A23] hover:bg-[#d43e1c] text-white text-xs font-bold shadow-lg shadow-orange-500/20 disabled:opacity-50 transition shrink-0"
                    >
                        <Save className="w-4 h-4" />
                        <span>{processing ? 'Saving Changes...' : 'Save All Settings'}</span>
                    </button>
                </div>

                {recentlySuccessful && (
                    <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center gap-2 animate-in fade-in">
                        <Check className="w-4 h-4 text-emerald-600" />
                        <span>Settings have been successfully saved and applied to your storefront!</span>
                    </div>
                )}

                {/* Tabs bar */}
                <div className="flex items-center gap-1.5 p-1.5 bg-white border border-gray-200 rounded-2xl shadow-sm overflow-x-auto">
                    {tabs.map((tab) => {
                        const Icon = tab.icon;
                        const isActive = activeTab === tab.id;
                        return (
                            <button
                                key={tab.id}
                                type="button"
                                onClick={() => setActiveTab(tab.id)}
                                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition whitespace-nowrap ${
                                    isActive
                                        ? 'bg-[#081621] text-white shadow-md'
                                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                                }`}
                            >
                                <Icon className={`w-4 h-4 ${isActive ? 'text-[#EF4A23]' : 'text-gray-400'}`} />
                                <span>{tab.label}</span>
                            </button>
                        );
                    })}
                </div>

                {/* Main Form Form */}
                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* TAB 1: General & Logo */}
                    {activeTab === 'general' && (
                        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 space-y-6">
                            <div className="border-b border-gray-100 pb-4">
                                <h3 className="text-base font-bold text-gray-900">General Branding & Identity</h3>
                                <p className="text-xs text-gray-500">Site title, tagline, logo image and browser favicon.</p>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                <div>
                                    <label className="block text-xs font-bold text-gray-700 mb-1.5">
                                        Site Name / Store Title <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        value={data.site_name}
                                        onChange={(e) => setData('site_name', e.target.value)}
                                        placeholder="e.g. Tech Shoppers"
                                        className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#EF4A23]/30 focus:border-[#EF4A23]"
                                    />
                                    {errors.site_name && <p className="text-[11px] text-red-500 mt-1">{errors.site_name}</p>}
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-gray-700 mb-1.5">
                                        Site Tagline
                                    </label>
                                    <input
                                        type="text"
                                        value={data.site_tagline}
                                        onChange={(e) => setData('site_tagline', e.target.value)}
                                        placeholder="e.g. Leading Computer & Laptop Shop in Bangladesh"
                                        className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#EF4A23]/30 focus:border-[#EF4A23]"
                                    />
                                    {errors.site_tagline && <p className="text-[11px] text-red-500 mt-1">{errors.site_tagline}</p>}
                                </div>
                            </div>

                            {/* Logo Upload & Preview */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                                <div className="p-4 rounded-xl border border-gray-200 bg-gray-50/60 space-y-3">
                                    <label className="block text-xs font-bold text-gray-800">
                                        Site Logo Image
                                    </label>
                                    <p className="text-[11px] text-gray-500">
                                        Recommended: PNG or SVG with transparent background, height around 40px - 60px.
                                    </p>

                                    {logoPreview ? (
                                        <div className="space-y-3">
                                            <div className="p-4 rounded-xl bg-[#081621] flex items-center justify-center border border-gray-800">
                                                <img 
                                                    src={logoPreview} 
                                                    alt="Site Logo Preview" 
                                                    className="max-h-12 max-w-full object-contain"
                                                />
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <label className="flex-1 cursor-pointer inline-flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg bg-white border border-gray-300 text-gray-700 text-xs font-semibold hover:bg-gray-50 transition shadow-sm">
                                                    <Upload className="w-3.5 h-3.5 text-gray-500" />
                                                    <span>Change Logo</span>
                                                    <input 
                                                        type="file" 
                                                        accept="image/*" 
                                                        onChange={handleLogoFileChange} 
                                                        className="hidden" 
                                                    />
                                                </label>
                                                <button
                                                    type="button"
                                                    onClick={handleRemoveLogo}
                                                    className="inline-flex items-center gap-1.5 py-2 px-3 rounded-lg bg-rose-50 text-rose-600 border border-rose-200 text-xs font-semibold hover:bg-rose-100 transition"
                                                >
                                                    <Trash2 className="w-3.5 h-3.5" />
                                                    <span>Remove</span>
                                                </button>
                                            </div>
                                        </div>
                                    ) : (
                                        <label className="border-2 border-dashed border-gray-300 hover:border-[#EF4A23] rounded-xl p-6 flex flex-col items-center justify-center cursor-pointer bg-white transition group">
                                            <div className="w-10 h-10 rounded-full bg-orange-50 text-[#EF4A23] flex items-center justify-center mb-2 group-hover:scale-110 transition">
                                                <Upload className="w-5 h-5" />
                                            </div>
                                            <span className="text-xs font-bold text-gray-700">Click to upload logo</span>
                                            <span className="text-[11px] text-gray-400 mt-0.5">PNG, JPG, SVG, WebP up to 3MB</span>
                                            <input 
                                                type="file" 
                                                accept="image/*" 
                                                onChange={handleLogoFileChange} 
                                                className="hidden" 
                                            />
                                        </label>
                                    )}

                                    <div className="pt-2">
                                        <label className="block text-[11px] font-semibold text-gray-600 mb-1">
                                            Or enter Logo Image URL:
                                        </label>
                                        <input
                                            type="text"
                                            value={data.site_logo_url}
                                            onChange={(e) => {
                                                setData('site_logo_url', e.target.value);
                                                if (e.target.value) setLogoPreview(e.target.value);
                                            }}
                                            placeholder="https://example.com/logo.png"
                                            className="w-full text-xs px-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-1 focus:ring-[#EF4A23]"
                                        />
                                    </div>
                                    {errors.site_logo && <p className="text-[11px] text-red-500">{errors.site_logo}</p>}
                                </div>

                                {/* Favicon */}
                                <div className="p-4 rounded-xl border border-gray-200 bg-gray-50/60 space-y-3">
                                    <label className="block text-xs font-bold text-gray-800">
                                        Browser Favicon Icon
                                    </label>
                                    <p className="text-[11px] text-gray-500">
                                        Small icon shown on browser tabs (32x32px or 64x64px ICO/PNG).
                                    </p>

                                    {faviconPreview ? (
                                        <div className="space-y-3">
                                            <div className="p-4 rounded-xl bg-white flex items-center justify-center border border-gray-200">
                                                <img 
                                                    src={faviconPreview} 
                                                    alt="Favicon Preview" 
                                                    className="w-8 h-8 object-contain"
                                                />
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <label className="flex-1 cursor-pointer inline-flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg bg-white border border-gray-300 text-gray-700 text-xs font-semibold hover:bg-gray-50 transition shadow-sm">
                                                    <Upload className="w-3.5 h-3.5 text-gray-500" />
                                                    <span>Change Favicon</span>
                                                    <input 
                                                        type="file" 
                                                        accept="image/*" 
                                                        onChange={handleFaviconFileChange} 
                                                        className="hidden" 
                                                    />
                                                </label>
                                                <button
                                                    type="button"
                                                    onClick={handleRemoveFavicon}
                                                    className="inline-flex items-center gap-1.5 py-2 px-3 rounded-lg bg-rose-50 text-rose-600 border border-rose-200 text-xs font-semibold hover:bg-rose-100 transition"
                                                >
                                                    <Trash2 className="w-3.5 h-3.5" />
                                                    <span>Remove</span>
                                                </button>
                                            </div>
                                        </div>
                                    ) : (
                                        <label className="border-2 border-dashed border-gray-300 hover:border-[#EF4A23] rounded-xl p-6 flex flex-col items-center justify-center cursor-pointer bg-white transition group">
                                            <div className="w-10 h-10 rounded-full bg-orange-50 text-[#EF4A23] flex items-center justify-center mb-2 group-hover:scale-110 transition">
                                                <Upload className="w-5 h-5" />
                                            </div>
                                            <span className="text-xs font-bold text-gray-700">Click to upload favicon</span>
                                            <span className="text-[11px] text-gray-400 mt-0.5">ICO, PNG up to 1MB</span>
                                            <input 
                                                type="file" 
                                                accept="image/*" 
                                                onChange={handleFaviconFileChange} 
                                                className="hidden" 
                                            />
                                        </label>
                                    )}

                                    <div className="pt-2">
                                        <label className="block text-[11px] font-semibold text-gray-600 mb-1">
                                            Or enter Favicon URL:
                                        </label>
                                        <input
                                            type="text"
                                            value={data.site_favicon_url}
                                            onChange={(e) => {
                                                setData('site_favicon_url', e.target.value);
                                                if (e.target.value) setFaviconPreview(e.target.value);
                                            }}
                                            placeholder="https://example.com/favicon.ico"
                                            className="w-full text-xs px-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-1 focus:ring-[#EF4A23]"
                                        />
                                    </div>
                                    {errors.site_favicon && <p className="text-[11px] text-red-500">{errors.site_favicon}</p>}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* TAB 2: Theme & Colors */}
                    {activeTab === 'colors' && (
                        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 space-y-6">
                            <div className="border-b border-gray-100 pb-4">
                                <h3 className="text-base font-bold text-gray-900">Color Palette & Appearance</h3>
                                <p className="text-xs text-gray-500">Configure your brand accent color, header background, and footer background.</p>
                            </div>

                            {/* Color Palettes */}
                            <div className="space-y-3">
                                <label className="block text-xs font-bold text-gray-700">
                                    Quick Brand Color Presets:
                                </label>
                                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                                    {COLOR_PRESETS.map((preset) => (
                                        <button
                                            key={preset.name}
                                            type="button"
                                            onClick={() => setData('primary_color', preset.color)}
                                            className={`flex items-center gap-2 p-2.5 rounded-xl border text-left transition ${
                                                data.primary_color === preset.color
                                                    ? 'border-gray-900 bg-gray-50 ring-2 ring-gray-900/10'
                                                    : 'border-gray-200 hover:border-gray-300'
                                            }`}
                                        >
                                            <span 
                                                className="w-5 h-5 rounded-full shrink-0 shadow-sm border border-black/10" 
                                                style={{ backgroundColor: preset.color }}
                                            />
                                            <span className="text-xs font-semibold text-gray-800 truncate">{preset.name}</span>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 pt-3">
                                {/* Primary Brand Color */}
                                <div className="p-4 rounded-xl border border-gray-200 bg-gray-50/50 space-y-2">
                                    <label className="block text-xs font-bold text-gray-700">
                                        Primary Brand Color
                                    </label>
                                    <p className="text-[11px] text-gray-500">Buttons, badges, highlights, links.</p>
                                    <div className="flex items-center gap-3 pt-2">
                                        <input
                                            type="color"
                                            value={data.primary_color}
                                            onChange={(e) => setData('primary_color', e.target.value)}
                                            className="w-10 h-10 rounded-lg cursor-pointer border-0 bg-transparent p-0"
                                        />
                                        <input
                                            type="text"
                                            value={data.primary_color}
                                            onChange={(e) => setData('primary_color', e.target.value)}
                                            placeholder="#EF4A23"
                                            className="flex-1 text-xs px-3 py-2 rounded-lg border border-gray-300 uppercase font-mono"
                                        />
                                    </div>
                                    {errors.primary_color && <p className="text-[11px] text-red-500">{errors.primary_color}</p>}
                                </div>

                                {/* Header Background */}
                                <div className="p-4 rounded-xl border border-gray-200 bg-gray-50/50 space-y-2">
                                    <label className="block text-xs font-bold text-gray-700">
                                        Header & Navbar Background
                                    </label>
                                    <p className="text-[11px] text-gray-500">Main navigation background.</p>
                                    <div className="flex items-center gap-3 pt-2">
                                        <input
                                            type="color"
                                            value={data.header_bg_color}
                                            onChange={(e) => setData('header_bg_color', e.target.value)}
                                            className="w-10 h-10 rounded-lg cursor-pointer border-0 bg-transparent p-0"
                                        />
                                        <input
                                            type="text"
                                            value={data.header_bg_color}
                                            onChange={(e) => setData('header_bg_color', e.target.value)}
                                            placeholder="#081621"
                                            className="flex-1 text-xs px-3 py-2 rounded-lg border border-gray-300 uppercase font-mono"
                                        />
                                    </div>
                                    {errors.header_bg_color && <p className="text-[11px] text-red-500">{errors.header_bg_color}</p>}
                                </div>

                                {/* Footer Background */}
                                <div className="p-4 rounded-xl border border-gray-200 bg-gray-50/50 space-y-2">
                                    <label className="block text-xs font-bold text-gray-700">
                                        Footer Background
                                    </label>
                                    <p className="text-[11px] text-gray-500">Bottom footer area background.</p>
                                    <div className="flex items-center gap-3 pt-2">
                                        <input
                                            type="color"
                                            value={data.footer_bg_color}
                                            onChange={(e) => setData('footer_bg_color', e.target.value)}
                                            className="w-10 h-10 rounded-lg cursor-pointer border-0 bg-transparent p-0"
                                        />
                                        <input
                                            type="text"
                                            value={data.footer_bg_color}
                                            onChange={(e) => setData('footer_bg_color', e.target.value)}
                                            placeholder="#081621"
                                            className="flex-1 text-xs px-3 py-2 rounded-lg border border-gray-300 uppercase font-mono"
                                        />
                                    </div>
                                    {errors.footer_bg_color && <p className="text-[11px] text-red-500">{errors.footer_bg_color}</p>}
                                </div>
                            </div>

                            {/* Live Theme Preview Banner */}
                            <div className="mt-4 p-5 rounded-xl border border-gray-200 space-y-3 bg-white">
                                <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block">
                                    Live Preview Sample
                                </span>
                                <div 
                                    className="p-4 rounded-xl text-white flex items-center justify-between shadow-inner"
                                    style={{ backgroundColor: data.header_bg_color }}
                                >
                                    <div className="flex items-center gap-2">
                                        {logoPreview ? (
                                            <img src={logoPreview} alt="Logo" className="max-h-7 max-w-[120px] object-contain" />
                                        ) : data.site_name ? (
                                            data.site_name.includes(' ') ? (
                                                <>
                                                    <span className="font-black text-lg">{data.site_name.substring(0, data.site_name.lastIndexOf(' '))}</span>
                                                    <span className="font-black text-lg" style={{ color: data.primary_color }}>{data.site_name.substring(data.site_name.lastIndexOf(' ') + 1)}</span>
                                                </>
                                            ) : (
                                                <span className="font-black text-lg" style={{ color: data.primary_color }}>{data.site_name}</span>
                                            )
                                        ) : (
                                            <>
                                                <span className="font-black text-lg">TECH</span>
                                                <span className="font-black text-lg" style={{ color: data.primary_color }}>SHOPPERS</span>
                                            </>
                                        )}
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className="text-xs text-gray-300">Hotline: {data.hotline || '16793'}</span>
                                        <button 
                                            type="button" 
                                            className="px-3 py-1.5 rounded-lg text-xs font-bold text-white shadow-md"
                                            style={{ backgroundColor: data.primary_color }}
                                        >
                                            Buy Now
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* TAB 3: Contact & Store */}
                    {activeTab === 'contact' && (
                        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 space-y-6">
                            <div className="border-b border-gray-100 pb-4">
                                <h3 className="text-base font-bold text-gray-900">Contact & Customer Support</h3>
                                <p className="text-xs text-gray-500">Helpline numbers, physical outlet address, and operational hours.</p>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                                <div>
                                    <label className="block text-xs font-bold text-gray-700 mb-1.5 flex items-center gap-1.5">
                                        <PhoneCall className="w-3.5 h-3.5 text-[#EF4A23]" />
                                        <span>Hotline Number</span>
                                    </label>
                                    <input
                                        type="text"
                                        value={data.hotline}
                                        onChange={(e) => setData('hotline', e.target.value)}
                                        placeholder="16793"
                                        className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#EF4A23]/30 focus:border-[#EF4A23]"
                                    />
                                    {errors.hotline && <p className="text-[11px] text-red-500 mt-1">{errors.hotline}</p>}
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-gray-700 mb-1.5 flex items-center gap-1.5">
                                        <PhoneCall className="w-3.5 h-3.5 text-blue-500" />
                                        <span>Store Phone Number</span>
                                    </label>
                                    <input
                                        type="text"
                                        value={data.phone}
                                        onChange={(e) => setData('phone', e.target.value)}
                                        placeholder="09678002003"
                                        className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#EF4A23]/30 focus:border-[#EF4A23]"
                                    />
                                    {errors.phone && <p className="text-[11px] text-red-500 mt-1">{errors.phone}</p>}
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-gray-700 mb-1.5 flex items-center gap-1.5">
                                        <PhoneCall className="w-3.5 h-3.5 text-emerald-500" />
                                        <span>WhatsApp Support Number</span>
                                    </label>
                                    <input
                                        type="text"
                                        value={data.whatsapp}
                                        onChange={(e) => setData('whatsapp', e.target.value)}
                                        placeholder="01700000000"
                                        className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#EF4A23]/30 focus:border-[#EF4A23]"
                                    />
                                    {errors.whatsapp && <p className="text-[11px] text-red-500 mt-1">{errors.whatsapp}</p>}
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                <div>
                                    <label className="block text-xs font-bold text-gray-700 mb-1.5 flex items-center gap-1.5">
                                        <Mail className="w-3.5 h-3.5 text-[#EF4A23]" />
                                        <span>Support Email</span>
                                    </label>
                                    <input
                                        type="email"
                                        value={data.email}
                                        onChange={(e) => setData('email', e.target.value)}
                                        placeholder="info@techshoppers.com"
                                        className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#EF4A23]/30 focus:border-[#EF4A23]"
                                    />
                                    {errors.email && <p className="text-[11px] text-red-500 mt-1">{errors.email}</p>}
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-gray-700 mb-1.5 flex items-center gap-1.5">
                                        <Clock className="w-3.5 h-3.5 text-[#EF4A23]" />
                                        <span>Working / Outlet Hours</span>
                                    </label>
                                    <input
                                        type="text"
                                        value={data.working_hours}
                                        onChange={(e) => setData('working_hours', e.target.value)}
                                        placeholder="10:00 AM - 7:00 PM (7 Days a Week)"
                                        className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#EF4A23]/30 focus:border-[#EF4A23]"
                                    />
                                    {errors.working_hours && <p className="text-[11px] text-red-500 mt-1">{errors.working_hours}</p>}
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-gray-700 mb-1.5 flex items-center gap-1.5">
                                    <MapPin className="w-3.5 h-3.5 text-[#EF4A23]" />
                                    <span>Head Office / Physical Address</span>
                                </label>
                                <textarea
                                    rows={2}
                                    value={data.address}
                                    onChange={(e) => setData('address', e.target.value)}
                                    placeholder="28 Kazi Nazrul Islam Avenue, Banglamotor, Dhaka 1000"
                                    className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#EF4A23]/30 focus:border-[#EF4A23]"
                                />
                                {errors.address && <p className="text-[11px] text-red-500 mt-1">{errors.address}</p>}
                            </div>
                        </div>
                    )}

                    {/* TAB 4: Social Media */}
                    {activeTab === 'social' && (
                        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 space-y-6">
                            <div className="border-b border-gray-100 pb-4">
                                <h3 className="text-base font-bold text-gray-900">Social Media Links</h3>
                                <p className="text-xs text-gray-500">Provide official channel links displayed across the footer.</p>
                            </div>

                            <div className="space-y-4">
                                <div className="flex items-center gap-3">
                                    <div className="w-9 h-9 rounded-xl bg-blue-600/10 text-blue-600 flex items-center justify-center shrink-0">
                                        <FacebookIcon className="w-4 h-4" />
                                    </div>
                                    <div className="flex-1">
                                        <label className="block text-xs font-bold text-gray-700 mb-1">Facebook Page URL</label>
                                        <input
                                            type="url"
                                            value={data.facebook_url}
                                            onChange={(e) => setData('facebook_url', e.target.value)}
                                            placeholder="https://facebook.com/star.tech.ltd"
                                            className="w-full text-xs px-3.5 py-2 rounded-xl border border-gray-300 focus:outline-none focus:ring-1 focus:ring-[#EF4A23]"
                                        />
                                    </div>
                                </div>

                                <div className="flex items-center gap-3">
                                    <div className="w-9 h-9 rounded-xl bg-red-600/10 text-red-600 flex items-center justify-center shrink-0">
                                        <YoutubeIcon className="w-4 h-4" />
                                    </div>
                                    <div className="flex-1">
                                        <label className="block text-xs font-bold text-gray-700 mb-1">YouTube Channel URL</label>
                                        <input
                                            type="url"
                                            value={data.youtube_url}
                                            onChange={(e) => setData('youtube_url', e.target.value)}
                                            placeholder="https://youtube.com/@techshoppers"
                                            className="w-full text-xs px-3.5 py-2 rounded-xl border border-gray-300 focus:outline-none focus:ring-1 focus:ring-[#EF4A23]"
                                        />
                                    </div>
                                </div>

                                <div className="flex items-center gap-3">
                                    <div className="w-9 h-9 rounded-xl bg-pink-600/10 text-pink-600 flex items-center justify-center shrink-0">
                                        <InstagramIcon className="w-4 h-4" />
                                    </div>
                                    <div className="flex-1">
                                        <label className="block text-xs font-bold text-gray-700 mb-1">Instagram Profile URL</label>
                                        <input
                                            type="url"
                                            value={data.instagram_url}
                                            onChange={(e) => setData('instagram_url', e.target.value)}
                                            placeholder="https://instagram.com/techshoppers"
                                            className="w-full text-xs px-3.5 py-2 rounded-xl border border-gray-300 focus:outline-none focus:ring-1 focus:ring-[#EF4A23]"
                                        />
                                    </div>
                                </div>

                                <div className="flex items-center gap-3">
                                    <div className="w-9 h-9 rounded-xl bg-sky-500/10 text-sky-500 flex items-center justify-center shrink-0">
                                        <TwitterIcon className="w-4 h-4" />
                                    </div>
                                    <div className="flex-1">
                                        <label className="block text-xs font-bold text-gray-700 mb-1">Twitter / X Profile URL</label>
                                        <input
                                            type="url"
                                            value={data.twitter_url}
                                            onChange={(e) => setData('twitter_url', e.target.value)}
                                            placeholder="https://x.com/techshoppers"
                                            className="w-full text-xs px-3.5 py-2 rounded-xl border border-gray-300 focus:outline-none focus:ring-1 focus:ring-[#EF4A23]"
                                        />
                                    </div>
                                </div>

                                <div className="flex items-center gap-3">
                                    <div className="w-9 h-9 rounded-xl bg-blue-700/10 text-blue-700 flex items-center justify-center shrink-0">
                                        <LinkedinIcon className="w-4 h-4" />
                                    </div>
                                    <div className="flex-1">
                                        <label className="block text-xs font-bold text-gray-700 mb-1">LinkedIn Page URL</label>
                                        <input
                                            type="url"
                                            value={data.linkedin_url}
                                            onChange={(e) => setData('linkedin_url', e.target.value)}
                                            placeholder="https://linkedin.com/company/star-tech-engineering-ltd"
                                            className="w-full text-xs px-3.5 py-2 rounded-xl border border-gray-300 focus:outline-none focus:ring-1 focus:ring-[#EF4A23]"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* TAB 5: Footer & Delivery Charges */}
                    {activeTab === 'footer' && (
                        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 space-y-6">
                            <div className="border-b border-gray-100 pb-4">
                                <h3 className="text-base font-bold text-gray-900">Footer Content & Delivery Charges</h3>
                                <p className="text-xs text-gray-500">Configure footer summary text, copyright statement, and default delivery rates.</p>
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-gray-700 mb-1.5">
                                    Footer About Text / Bio
                                </label>
                                <textarea
                                    rows={3}
                                    value={data.footer_about}
                                    onChange={(e) => setData('footer_about', e.target.value)}
                                    placeholder="Tech Shoppers is Bangladesh's largest Computer, Laptop & Gaming accessory retailer."
                                    className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#EF4A23]/30 focus:border-[#EF4A23]"
                                />
                                {errors.footer_about && <p className="text-[11px] text-red-500 mt-1">{errors.footer_about}</p>}
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-gray-700 mb-1.5">
                                    Copyright Notice
                                </label>
                                <input
                                    type="text"
                                    value={data.footer_copyright}
                                    onChange={(e) => setData('footer_copyright', e.target.value)}
                                    placeholder="© 2026 Tech Shoppers | All Rights Reserved"
                                    className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#EF4A23]/30 focus:border-[#EF4A23]"
                                />
                                {errors.footer_copyright && <p className="text-[11px] text-red-500 mt-1">{errors.footer_copyright}</p>}
                            </div>

                            {/* Delivery Charges */}
                            <div className="pt-2 border-t border-gray-100">
                                <h4 className="text-xs font-bold text-gray-900 mb-3 flex items-center gap-1.5">
                                    <Truck className="w-4 h-4 text-[#EF4A23]" />
                                    <span>Default Delivery Fees</span>
                                </h4>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                    <div>
                                        <label className="block text-xs font-semibold text-gray-700 mb-1">
                                            Inside Dhaka Delivery (৳)
                                        </label>
                                        <input
                                            type="number"
                                            value={data.delivery_charge_inside}
                                            onChange={(e) => setData('delivery_charge_inside', e.target.value)}
                                            placeholder="60"
                                            className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-gray-300 focus:outline-none focus:ring-1 focus:ring-[#EF4A23]"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-semibold text-gray-700 mb-1">
                                            Outside Dhaka Delivery (৳)
                                        </label>
                                        <input
                                            type="number"
                                            value={data.delivery_charge_outside}
                                            onChange={(e) => setData('delivery_charge_outside', e.target.value)}
                                            placeholder="120"
                                            className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-gray-300 focus:outline-none focus:ring-1 focus:ring-[#EF4A23]"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Bottom Save Action */}
                    <div className="flex items-center justify-between p-4 bg-white border border-gray-200 rounded-2xl shadow-sm">
                        <span className="text-xs text-gray-500">
                            Make sure to save changes after updating any fields.
                        </span>
                        <button
                            type="submit"
                            disabled={processing}
                            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#EF4A23] hover:bg-[#d43e1c] text-white text-xs font-bold shadow-lg shadow-orange-500/20 disabled:opacity-50 transition"
                        >
                            <Save className="w-4 h-4" />
                            <span>{processing ? 'Saving...' : 'Save Settings'}</span>
                        </button>
                    </div>
                </form>
            </div>
        </AdminLayout>
    );
}
