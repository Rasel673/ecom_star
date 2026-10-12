import React, { useState, useEffect } from 'react';
import { Link, router, usePage } from '@inertiajs/react';
import FrontendLayout from '@/Layouts/FrontendLayout';
import { 
    Cpu, 
    ShoppingCart, 
    Trash2, 
    Printer, 
    Plus, 
    Zap, 
    Check, 
    Share2, 
    RotateCcw,
    Monitor,
    Keyboard,
    Mouse,
    Headphones,
    FileText,
    ExternalLink,
    Bookmark
} from 'lucide-react';

export default function PcBuilder({ components = [], seo = {} }) {
    const { auth, settings } = usePage().props;
    const [selectedBuild, setSelectedBuild] = useState({});
    const [copied, setCopied] = useState(false);
    const [showQuoteModal, setShowQuoteModal] = useState(false);

    useEffect(() => {
        const saved = localStorage.getItem('startech_pc_build');
        if (saved) {
            try {
                setSelectedBuild(JSON.parse(saved));
            } catch (e) {}
        }
    }, []);

    const getItemPrice = (item) => {
        if (!item) return 0;
        const raw = item.special_price ?? item.regular_price ?? item.price ?? 0;
        const num = parseFloat(raw);
        return isNaN(num) ? 0 : num;
    };

    const removeComponent = (slotId) => {
        const updated = { ...selectedBuild };
        delete updated[slotId];
        setSelectedBuild(updated);
        localStorage.setItem('startech_pc_build', JSON.stringify(updated));
    };

    const clearBuild = () => {
        if (confirm('Are you sure you want to clear your current PC build?')) {
            setSelectedBuild({});
            localStorage.removeItem('startech_pc_build');
        }
    };

    // Build items calculation
    const buildKeys = Object.keys(selectedBuild);
    const buildItems = buildKeys.map(k => ({ slotKey: k, ...selectedBuild[k] })).filter(item => item.id);

    const totalPrice = buildItems.reduce((sum, item) => sum + getItemPrice(item), 0);

    const hasGPU = selectedBuild['graphics-card'];
    const hasCPU = selectedBuild['processor'];
    const totalWattage = 65 + (hasGPU ? 180 : 0) + (hasCPU ? 65 : 0) + (buildItems.length > 3 ? 60 : 30);

    // Add ALL components to cart atomically
    const handleAddAllToCart = () => {
        if (buildItems.length === 0) return;
        const productIds = buildItems.map(item => item.id);
        router.post(route('cart.addBulk'), {
            product_ids: productIds,
        });
    };

    // Share link
    const handleShare = () => {
        navigator.clipboard.writeText(window.location.href);
        setCopied(true);
        setTimeout(() => setCopied(false), 3000);
    };

    const handlePrint = () => {
        window.print();
    };

    const handleSaveToAccount = () => {
        if (!auth?.user) {
            router.visit(route('login'));
            return;
        }
        if (buildItems.length === 0) {
            alert('Please select at least one component before saving your build.');
            return;
        }
        const name = prompt('Give a name to your custom PC build:', 'My Custom Rig ' + new Date().toLocaleDateString());
        if (!name) return;

        router.post(route('customer.pcbuild.save'), {
            name: name,
            components: selectedBuild,
            total_price: totalPrice,
            total_wattage: totalWattage,
        }, {
            preserveScroll: true,
        });
    };

    // Group components into Core and Peripherals
    const coreComponents = components.filter(c => c.group === 'Core Components' || !c.group);
    const peripheralComponents = components.filter(c => c.group === 'Peripherals & Accessories');

    return (
        <FrontendLayout title={seo.title} description={seo.description}>
            {/* Screen View */}
            <div className="print:hidden">
                {/* Header Action Bar */}
                <div className="bg-white rounded-3xl border border-gray-200 shadow-sm p-6 md:p-8 mb-8">
                    <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 border-b border-gray-200 pb-6 mb-6">
                        <div>
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-2xl bg-orange-50 text-[#EF4A23] flex items-center justify-center">
                                    <Cpu className="w-6 h-6" />
                                </div>
                                <div>
                                    <h1 className="text-xl md:text-2xl font-black text-gray-900 tracking-tight">
                                        PC Builder - Build Your Own Computer - {settings?.site_name || 'Tech Shoppers'}
                                    </h1>
                                    <p className="text-xs text-gray-500 mt-0.5">
                                        Select and customize desktop hardware with real-time price & wattage calculation.
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Top Counters & Total */}
                        <div className="grid grid-cols-3 gap-2 sm:flex sm:flex-wrap sm:items-center sm:gap-4 bg-gray-50/80 p-2.5 sm:p-3 rounded-2xl border border-gray-200 w-full lg:w-auto text-center sm:text-right">
                            <div className="border-r border-gray-200 pr-1 sm:pr-4">
                                <span className="text-[10px] sm:text-[11px] text-gray-400 font-medium block">Selected</span>
                                <span className="text-xs sm:text-sm font-black text-gray-800">
                                    {buildItems.length}/{components.length}
                                </span>
                            </div>
                            <div className="border-r border-gray-200 pr-1 sm:pr-4">
                                <span className="text-[10px] sm:text-[11px] text-gray-400 font-medium block">Wattage</span>
                                <span className="text-xs sm:text-sm font-black text-emerald-600 flex items-center justify-center sm:justify-end gap-0.5">
                                    <Zap className="w-3 h-3" /> ~{totalWattage}W
                                </span>
                            </div>
                            <div>
                                <span className="text-[10px] sm:text-[11px] text-gray-400 font-medium block">Total</span>
                                <span className="text-sm sm:text-2xl font-black text-[#EF4A23]">
                                    ৳{Math.round(totalPrice).toLocaleString()}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Toolbar Action Buttons */}
                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-gray-50/80 p-3 sm:p-3.5 rounded-2xl border border-gray-200">
                        <div className="flex items-center gap-2">
                            {buildItems.length > 0 && (
                                <button
                                    onClick={clearBuild}
                                    className="text-xs text-rose-600 hover:text-rose-700 font-bold px-3 py-2 rounded-xl border border-rose-200 bg-white hover:bg-rose-50 transition flex items-center gap-1.5"
                                >
                                    <RotateCcw className="w-3.5 h-3.5" />
                                    <span>Clear All</span>
                                </button>
                            )}
                            <button
                                onClick={handleShare}
                                className="text-xs bg-white border border-gray-300 hover:bg-gray-100 text-gray-700 font-bold px-3.5 py-2 rounded-xl flex items-center gap-1.5 transition shadow-sm"
                            >
                                <Share2 className="w-3.5 h-3.5" />
                                <span>{copied ? 'Link Copied!' : 'Share PC'}</span>
                            </button>
                            <button
                                onClick={handlePrint}
                                className="text-xs bg-white border border-gray-300 hover:bg-gray-100 text-gray-700 font-bold px-3.5 py-2 rounded-xl flex items-center gap-1.5 transition shadow-sm"
                            >
                                <Printer className="w-3.5 h-3.5 text-[#EF4A23]" />
                                <span>Print / Quotation</span>
                            </button>
                            <button
                                onClick={handleSaveToAccount}
                                disabled={buildItems.length === 0}
                                className="text-xs bg-white border border-gray-300 hover:bg-gray-100 text-gray-700 font-bold px-3.5 py-2 rounded-xl flex items-center gap-1.5 transition shadow-sm disabled:opacity-40"
                                title="Save this configuration to your account history"
                            >
                                <Bookmark className="w-3.5 h-3.5 text-blue-600" />
                                <span>Save Build</span>
                            </button>
                        </div>

                        <div>
                            <button
                                onClick={handleAddAllToCart}
                                disabled={buildItems.length === 0}
                                className="w-full sm:w-auto bg-[#EF4A23] hover:bg-[#d63c17] disabled:opacity-40 text-white font-bold text-xs py-2.5 px-6 rounded-xl flex items-center justify-center gap-2 transition shadow-md hover:shadow-orange-500/20"
                            >
                                <ShoppingCart className="w-4 h-4" />
                                <span>Add All to Cart ({buildItems.length})</span>
                            </button>
                        </div>
                    </div>
                </div>

                {/* 1. Core Components Section */}
                <div className="bg-white rounded-3xl border border-gray-200 shadow-sm p-6 md:p-8 mb-8">
                    <div className="border-b border-gray-200 pb-3 mb-4 flex items-center justify-between">
                        <h2 className="text-sm font-bold text-gray-900 uppercase tracking-wider flex items-center gap-2">
                            <span className="w-2.5 h-2.5 rounded-full bg-[#EF4A23]"></span>
                            <span>Core Components</span>
                        </h2>
                        <span className="text-[11px] text-gray-400">Essential hardware for system boot</span>
                    </div>

                    <div className="divide-y divide-gray-100">
                        {coreComponents.map((comp) => {
                            const selected = selectedBuild[comp.id] || selectedBuild[comp.category_slug];
                            const price = getItemPrice(selected);

                            return (
                                <div key={comp.id} className="py-3 sm:py-4 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 sm:gap-4 group">
                                    {/* Left Slot Details */}
                                    <div className="flex items-center gap-3 sm:gap-4 flex-1">
                                        <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-gray-50 border border-gray-200 flex items-center justify-center shrink-0 p-1">
                                            {selected ? (
                                                <img
                                                    src={selected.thumbnail || 'https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?w=100'}
                                                    alt={selected.name}
                                                    className="w-full h-full object-contain"
                                                />
                                            ) : (
                                                <Cpu className="w-5 h-5 sm:w-6 sm:h-6 text-gray-300" />
                                            )}
                                        </div>
                                        <div className="min-w-0 flex-1">
                                            <div className="flex items-center gap-2 mb-0.5">
                                                <span className="text-xs font-bold text-gray-900">{comp.name}</span>
                                                {comp.required && (
                                                    <span className="text-[10px] bg-red-50 text-red-600 px-1.5 py-0.2 rounded font-semibold border border-red-100">
                                                        Required
                                                    </span>
                                                )}
                                            </div>

                                            {selected ? (
                                                <div>
                                                    <Link
                                                        href={route('product.show', selected.slug)}
                                                        className="text-xs font-semibold text-gray-800 hover:text-[#EF4A23] transition line-clamp-1"
                                                    >
                                                        {selected.name}
                                                    </Link>
                                                    <span className="text-xs font-bold text-[#EF4A23] block mt-0.5">
                                                        ৳{Math.round(price).toLocaleString()}
                                                    </span>
                                                </div>
                                            ) : (
                                                <span className="text-xs text-gray-400 block">Please select an item</span>
                                            )}
                                        </div>
                                    </div>

                                    {/* Right Action */}
                                    <div className="flex items-center justify-end gap-2">
                                        {selected ? (
                                            <>
                                                <Link
                                                    href={`${route('pcbuilder.select', comp.category_slug)}?slot=${comp.id}`}
                                                    className="text-xs bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold px-3 py-1.5 rounded-lg transition"
                                                >
                                                    Change
                                                </Link>
                                                <button
                                                    onClick={() => removeComponent(comp.id)}
                                                    className="p-1.5 text-gray-400 hover:text-rose-600 rounded-lg transition"
                                                    title="Remove Component"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </>
                                        ) : (
                                            <Link
                                                href={`${route('pcbuilder.select', comp.category_slug)}?slot=${comp.id}`}
                                                className="text-xs bg-[#081621] hover:bg-[#EF4A23] text-white font-bold px-4 py-2 rounded-xl flex items-center gap-1.5 transition shadow-sm"
                                            >
                                                <Plus className="w-3.5 h-3.5" />
                                                <span>Choose</span>
                                            </Link>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* 2. Peripherals & Accessories Section */}
                {peripheralComponents.length > 0 && (
                    <div className="bg-white rounded-3xl border border-gray-200 shadow-sm p-6 md:p-8 mb-8">
                        <div className="border-b border-gray-200 pb-3 mb-4 flex items-center justify-between">
                            <h2 className="text-sm font-bold text-gray-900 uppercase tracking-wider flex items-center gap-2">
                                <span className="w-2.5 h-2.5 rounded-full bg-blue-600"></span>
                                <span>Peripherals & Accessories</span>
                            </h2>
                            <span className="text-[11px] text-gray-400">Display, keyboard, mouse & gear</span>
                        </div>

                        <div className="divide-y divide-gray-100">
                            {peripheralComponents.map((comp) => {
                                const selected = selectedBuild[comp.id] || selectedBuild[comp.category_slug];
                                const price = getItemPrice(selected);

                                return (
                                    <div key={comp.id} className="py-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 group">
                                        <div className="flex items-center gap-4 flex-1">
                                            <div className="w-14 h-14 rounded-2xl bg-gray-50 border border-gray-200 flex items-center justify-center shrink-0 p-1">
                                                {selected ? (
                                                    <img
                                                        src={selected.thumbnail || 'https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?w=100'}
                                                        alt={selected.name}
                                                        className="w-full h-full object-contain"
                                                    />
                                                ) : (
                                                    <Monitor className="w-6 h-6 text-gray-300" />
                                                )}
                                            </div>
                                            <div className="min-w-0 flex-1">
                                                <span className="text-xs font-bold text-gray-900 block mb-0.5">{comp.name}</span>
                                                {selected ? (
                                                    <div>
                                                        <Link
                                                            href={route('product.show', selected.slug)}
                                                            className="text-xs font-semibold text-gray-800 hover:text-[#EF4A23] transition line-clamp-1"
                                                        >
                                                            {selected.name}
                                                        </Link>
                                                        <span className="text-xs font-bold text-[#EF4A23] block mt-0.5">
                                                            ৳{Math.round(price).toLocaleString()}
                                                        </span>
                                                    </div>
                                                ) : (
                                                    <span className="text-xs text-gray-400 block">Please select an item</span>
                                                )}
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-2 self-end sm:self-center">
                                            {selected ? (
                                                <>
                                                    <Link
                                                        href={`${route('pcbuilder.select', comp.category_slug)}?slot=${comp.id}`}
                                                        className="text-xs bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold px-3 py-1.5 rounded-lg transition"
                                                    >
                                                        Change
                                                    </Link>
                                                    <button
                                                        onClick={() => removeComponent(comp.id)}
                                                        className="p-1.5 text-gray-400 hover:text-rose-600 rounded-lg transition"
                                                        title="Remove Component"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                </>
                                            ) : (
                                                <Link
                                                    href={`${route('pcbuilder.select', comp.category_slug)}?slot=${comp.id}`}
                                                    className="text-xs bg-[#081621] hover:bg-[#EF4A23] text-white font-bold px-4 py-2 rounded-xl flex items-center gap-1.5 transition shadow-sm"
                                                >
                                                    <Plus className="w-3.5 h-3.5" />
                                                    <span>Choose</span>
                                                </Link>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}

                {/* Bottom Action Bar */}
                <div className="bg-[#081621] text-white rounded-2xl sm:rounded-3xl p-5 sm:p-6 shadow-xl flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 sm:gap-6 border border-gray-800">
                    <div>
                        <span className="text-xs text-gray-400 block">Estimated Custom Build Total:</span>
                        <div className="text-2xl sm:text-3xl font-black text-[#EF4A23] mt-0.5">
                            ৳{Math.round(totalPrice).toLocaleString()}
                        </div>
                        <span className="text-[11px] text-gray-400 block mt-1">
                            Includes official warranty & live components compatibility verification.
                        </span>
                    </div>

                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 sm:gap-3 w-full md:w-auto">
                        <button
                            onClick={handlePrint}
                            className="flex-1 md:flex-initial inline-flex items-center justify-center gap-2 bg-gray-800 hover:bg-gray-700 text-white font-bold text-xs py-3 px-4 sm:px-6 rounded-xl transition"
                        >
                            <Printer className="w-4 h-4 text-orange-400" />
                            <span>Print Quotation</span>
                        </button>
                        <button
                            onClick={handleAddAllToCart}
                            disabled={buildItems.length === 0}
                            className="flex-1 md:flex-initial inline-flex items-center justify-center gap-2 bg-[#EF4A23] hover:bg-[#d63c17] disabled:opacity-40 text-white font-bold text-xs py-3 px-6 sm:px-8 rounded-xl shadow-lg transition"
                        >
                            <ShoppingCart className="w-4 h-4" />
                            <span>Add All to Cart ({buildItems.length})</span>
                        </button>
                    </div>
                </div>
            </div>

            {/* Print Quotation Layout (Appears ONLY during print / invoice mode) */}
            <div className="hidden print:block p-8 bg-white text-black font-sans">
                {/* Printable Tech Shoppers Header */}
                <div className="border-b-2 border-black pb-4 mb-6 flex justify-between items-start">
                    <div>
                        {settings?.site_logo ? (
                            <img src={settings.site_logo} alt={settings?.site_name || 'Logo'} className="max-h-10 object-contain mb-2" />
                        ) : (
                            <div className="flex items-center gap-1 mb-1">
                                <span className="text-2xl font-black tracking-tight uppercase" style={{ color: settings?.primary_color || '#EF4A23' }}>
                                    {settings?.site_name || 'TECH SHOPPERS'}
                                </span>
                            </div>
                        )}
                        <p className="text-xs text-gray-600 font-semibold">{settings?.site_name || 'Tech Shoppers'}</p>
                        <p className="text-[10px] text-gray-500">
                            {settings?.address || '28 Kazi Nazrul Islam Avenue, Banglamotor, Dhaka 1000'}
                        </p>
                        <p className="text-[10px] text-gray-500">
                            Hotline: {settings?.hotline || '16793'} {settings?.email ? `| Email: ${settings.email}` : ''}
                        </p>
                    </div>

                    <div className="text-right">
                        <span className="text-lg font-black uppercase tracking-wider block">PC Build Quotation</span>
                        <span className="text-xs text-gray-600 block mt-1">
                            Date: {new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                        </span>
                        <span className="text-xs text-gray-500 block">
                            Ref: ST-PC-{Math.floor(100000 + Math.random() * 900000)}
                        </span>
                    </div>
                </div>

                {/* Items Table */}
                <table className="w-full text-left text-xs mb-6 border border-gray-300">
                    <thead className="bg-gray-100 border-b border-gray-300 font-bold">
                        <tr>
                            <th className="p-2.5 border-r border-gray-300 w-12 text-center">SL</th>
                            <th className="p-2.5 border-r border-gray-300 w-44">Component</th>
                            <th className="p-2.5 border-r border-gray-300">Product Description</th>
                            <th className="p-2.5 text-right w-32">Price (৳)</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {components.map((comp, idx) => {
                            const item = selectedBuild[comp.id] || selectedBuild[comp.category_slug];
                            const itemPrice = getItemPrice(item);

                            return (
                                <tr key={comp.id}>
                                    <td className="p-2.5 text-center border-r border-gray-200">{idx + 1}</td>
                                    <td className="p-2.5 font-bold border-r border-gray-200">{comp.name}</td>
                                    <td className="p-2.5 border-r border-gray-200">
                                        {item ? (
                                            <div>
                                                <p className="font-semibold">{item.name}</p>
                                                {item.model && <p className="text-[10px] text-gray-500">Model: {item.model}</p>}
                                            </div>
                                        ) : (
                                            <span className="text-gray-400 italic">Not Selected</span>
                                        )}
                                    </td>
                                    <td className="p-2.5 text-right font-bold">
                                        {item ? `৳${Math.round(itemPrice).toLocaleString()}` : '—'}
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>

                {/* Quotation Total & Terms */}
                <div className="flex justify-between items-start gap-8 border-t border-black pt-4">
                    <div className="max-w-md text-[10px] text-gray-600 space-y-1">
                        <p className="font-bold text-gray-800">Terms & Conditions:</p>
                        <p>1. Prices are subject to market availability and currency exchange fluctuations.</p>
                        <p>2. Official manufacturer warranty is provided for all genuine components.</p>
                        <p>3. This quotation is valid for 3 working days from the date of issuance.</p>
                    </div>

                    <div className="w-64 space-y-2 text-right">
                        <div className="flex justify-between text-xs font-medium text-gray-600">
                            <span>Total Items:</span>
                            <span>{buildItems.length} Products</span>
                        </div>
                        <div className="flex justify-between text-xs font-medium text-gray-600">
                            <span>Estimated Wattage:</span>
                            <span>~{totalWattage}W</span>
                        </div>
                        <div className="flex justify-between text-base font-black border-t-2 border-black pt-2">
                            <span>Total Price:</span>
                            <span className="text-[#EF4A23]">৳{Math.round(totalPrice).toLocaleString()}</span>
                        </div>
                    </div>
                </div>

                {/* Signature Block */}
                <div className="mt-16 pt-8 border-t border-dashed border-gray-400 flex justify-between text-xs text-gray-600">
                    <div>
                        <div className="w-40 border-b border-gray-400 mb-1"></div>
                        <p>Customer Signature</p>
                    </div>
                    <div className="text-right">
                        <div className="w-40 border-b border-gray-400 mb-1 ml-auto"></div>
                        <p>{settings?.site_name || 'Tech Shoppers'} Authorized Signature</p>
                    </div>
                </div>
            </div>
        </FrontendLayout>
    );
}
