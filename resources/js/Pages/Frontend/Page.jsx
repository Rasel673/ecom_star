import React, { useState } from 'react';
import { Head, Link, router, useForm, usePage } from '@inertiajs/react';
import FrontendLayout from '@/Layouts/FrontendLayout';
import {
    ChevronRight,
    Calculator,
    Truck,
    PhoneCall,
    Wrench,
    Search,
    CheckCircle2,
    Clock,
    MapPin,
    Mail,
    Send,
    Package,
    ExternalLink,
    AlertCircle,
    ShieldCheck,
    CreditCard,
    Building2,
    Calendar,
    Phone,
    BadgePercent,
    HelpCircle,
    ChevronDown,
    Check,
    Sparkles,
    ShoppingBag,
    Share2,
    CheckCircle
} from 'lucide-react';
import { EMI_BANKS, TENURE_MONTHS } from '@/Components/Frontend/EmiModal';

const EMI_FAQS = [
    {
        q: "What is the minimum purchase amount to avail 0% EMI?",
        a: "The minimum purchase value to avail EMI facilities is ৳5,000. You can also bundle multiple products together into a single cart/order to meet the minimum threshold."
    },
    {
        q: "Can I avail EMI with a Debit Card or bKash / Nagad?",
        a: "No. Under Bangladesh Bank regulations, EMI facilities are strictly available for eligible Credit Cards issued by scheduled commercial banks. Regular Debit Cards or mobile banking accounts cannot be converted to bank EMI."
    },
    {
        q: "Is there any hidden interest or extra processing fee?",
        a: "Tech Shoppers offers 0% promotional interest EMI with our partner banks for 3, 6, 9, and 12-month tenures. Depending on your issuing bank, a nominal bank processing charge (usually 1.5% to 2.5%) may be billed directly by the card issuing bank on extended tenures (18 to 36 months)."
    },
    {
        q: "Can I avail EMI online as well as at physical retail shops?",
        a: "Yes! You can choose the Online Credit Card EMI option during web checkout, or visit any of our official branches nationwide to swipe your card on our dedicated multi-bank POS terminals."
    },
    {
        q: "How does the monthly installment deduction work?",
        a: "When you place the order, the total product value is temporarily blocked against your card credit limit. Within 5-7 working days, your bank automatically converts this blocked amount into monthly equal installments on your regular monthly credit card statement."
    }
];

export default function Page({ page, trackingResult = null, searchQuery = {}, seo = {} }) {
    const { settings } = usePage().props;
    const siteName = settings?.site_name || 'Tech Shoppers';

    // -------------------------------------------------------------
    // EMI Calculator State & Calculations
    // -------------------------------------------------------------
    const [emiPrice, setEmiPrice] = useState(65000);
    const [emiDownPayment, setEmiDownPayment] = useState(0);
    const [emiMonths, setEmiMonths] = useState(12);
    const [emiBank, setEmiBank] = useState('City Bank AMEX');
    const [emiRate, setEmiRate] = useState(0); // 0% promotional EMI
    const [openEmiFaq, setOpenEmiFaq] = useState(null);
    const [copiedPlan, setCopiedPlan] = useState(false);

    const currentBankObj = EMI_BANKS.find(b => b.name === emiBank) || EMI_BANKS[0];
    const financedAmount = Math.max(0, emiPrice - emiDownPayment);
    const monthlyInstallment = emiMonths > 0
        ? Math.round((financedAmount * (1 + (emiRate / 100))) / emiMonths)
        : 0;
    const totalPayable = (monthlyInstallment * emiMonths) + Number(emiDownPayment);

    const calcMonthly = (months) => {
        if (!months || months <= 0) return 0;
        return Math.round((financedAmount * (1 + (emiRate / 100))) / months);
    };

    const handleCopyEmiSummary = () => {
        const text = `EMI Calculation for ৳${emiPrice.toLocaleString()} at ${siteName}:\n• Partner Bank: ${emiBank}\n• Tenure: ${emiMonths} Months\n• Down Payment: ৳${Number(emiDownPayment).toLocaleString()}\n• Monthly Installment: ৳${monthlyInstallment.toLocaleString()}/mo\n• Total Cost: ৳${totalPayable.toLocaleString()} (0% Interest)`;
        navigator.clipboard?.writeText(text);
        setCopiedPlan(true);
        setTimeout(() => setCopiedPlan(false), 2500);
    };

    // -------------------------------------------------------------
    // Order Tracking Form State
    // -------------------------------------------------------------
    const [trackingOrderNo, setTrackingOrderNo] = useState(searchQuery.order_number || '');
    const [trackingPhone, setTrackingPhone] = useState(searchQuery.phone || '');

    const handleSearchOrder = (e) => {
        e.preventDefault();
        router.get(
            route('page.show', page.slug),
            {
                order_number: trackingOrderNo || undefined,
                phone: trackingPhone || undefined,
            },
            { preserveState: true }
        );
    };

    // -------------------------------------------------------------
    // Contact / Service Inquiry Form State
    // -------------------------------------------------------------
    const { data: inquiryData, setData: setInquiryData, post: postInquiry, processing: inquiryProcessing, reset: resetInquiry } = useForm({
        name: '',
        phone: '',
        email: '',
        subject: '',
        message: '',
        order_number: '',
    });

    const handleInquirySubmit = (e) => {
        e.preventDefault();
        postInquiry(route('page.inquiry'), {
            preserveScroll: true,
            onSuccess: () => resetInquiry(),
        });
    };

    return (
        <FrontendLayout
            title={seo.title || page.title}
            description={seo.description || page.subtitle}
        >
            <div className="max-w-6xl mx-auto py-4 sm:py-6 space-y-8">
                {/* Breadcrumbs */}
                <nav className="flex items-center gap-1.5 text-xs text-gray-500">
                    <Link href="/" className="hover:text-[#EF4A23]">Home</Link>
                    <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
                    <span className="text-gray-900 font-semibold">{page.title}</span>
                </nav>

                {/* Page Hero Header */}
                <div className="bg-gradient-to-r from-[#081621] via-[#112538] to-[#081621] text-white rounded-3xl p-6 sm:p-10 shadow-xl border border-gray-800 relative overflow-hidden">
                    <div className="relative z-10 max-w-2xl">
                        <span className="text-[11px] font-bold text-orange-400 bg-orange-400/10 border border-orange-400/20 px-3 py-1 rounded-full uppercase tracking-wider inline-block mb-3">
                            {siteName} Official Portal
                        </span>
                        <h1 className="text-2xl sm:text-3xl md:text-4xl font-black tracking-tight text-white">
                            {page.title}
                        </h1>
                        {page.subtitle && (
                            <p className="text-sm sm:text-base text-gray-300 mt-2 font-medium">
                                {page.subtitle}
                            </p>
                        )}
                    </div>
                    {/* Background glow */}
                    <div className="absolute right-0 top-0 bottom-0 w-80 bg-gradient-to-l from-orange-600/15 to-transparent pointer-events-none"></div>
                </div>

                {/* ========================================================= */}
                {/* 1. INTERACTIVE ENGINE: ORDER TRACKING                      */}
                {/* ========================================================= */}
                {page.page_type === 'order_tracking' && (
                    <div className="space-y-6">
                        {/* Search Card */}
                        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-gray-200/90 shadow-sm">
                            <h2 className="text-base font-bold text-gray-900 mb-2 flex items-center gap-2">
                                <Search className="w-5 h-5 text-[#EF4A23]" />
                                <span>Look Up Your Order Status</span>
                            </h2>
                            <p className="text-xs text-gray-500 mb-6">
                                Enter your Tech Shoppers Order Number (e.g. ST-261008-1234) and/or your checkout phone number.
                            </p>

                            <form onSubmit={handleSearchOrder} className="grid grid-cols-1 sm:grid-cols-12 gap-3 sm:gap-4">
                                <div className="sm:col-span-5">
                                    <label className="block text-xs font-semibold text-gray-700 mb-1">
                                        Order Number (Optional)
                                    </label>
                                    <input
                                        type="text"
                                        value={trackingOrderNo}
                                        onChange={(e) => setTrackingOrderNo(e.target.value)}
                                        placeholder="e.g. ST-261008-8472"
                                        className="w-full text-xs rounded-xl border-gray-300 focus:border-[#EF4A23] focus:ring-[#EF4A23] py-2.5 px-3 font-mono"
                                    />
                                </div>

                                <div className="sm:col-span-5">
                                    <label className="block text-xs font-semibold text-gray-700 mb-1">
                                        Phone Number (Optional)
                                    </label>
                                    <input
                                        type="tel"
                                        value={trackingPhone}
                                        onChange={(e) => setTrackingPhone(e.target.value)}
                                        placeholder="01XXXXXXXXX"
                                        className="w-full text-xs rounded-xl border-gray-300 focus:border-[#EF4A23] focus:ring-[#EF4A23] py-2.5 px-3 font-mono"
                                    />
                                </div>

                                <div className="sm:col-span-2 flex items-end">
                                    <button
                                        type="submit"
                                        className="w-full py-2.5 px-4 bg-[#EF4A23] hover:bg-[#d63c17] text-white font-bold text-xs rounded-xl transition shadow-md flex items-center justify-center gap-1.5"
                                    >
                                        <Search className="w-4 h-4" />
                                        <span>Track Order</span>
                                    </button>
                                </div>
                            </form>
                        </div>

                        {/* Search Results Display */}
                        {trackingResult ? (
                            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-gray-200/90 shadow-lg space-y-6 animate-fade-in">
                                {/* Order Status Stepper */}
                                <div className="border-b pb-6">
                                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6">
                                        <div>
                                            <span className="text-xs text-gray-400 uppercase font-semibold">Order Details</span>
                                            <h3 className="text-lg font-black text-gray-900 font-mono">
                                                Order #{trackingResult.order_number}
                                            </h3>
                                        </div>
                                        <div className="text-left sm:text-right">
                                            <span className="text-xs text-gray-400 block">Total Amount</span>
                                            <span className="text-xl font-black text-[#EF4A23]">
                                                ৳{Number(trackingResult.total).toLocaleString()}
                                            </span>
                                        </div>
                                    </div>

                                    {/* 4-Step Visual Progress Bar */}
                                    <div className="grid grid-cols-4 gap-2 text-center text-xs">
                                        {[
                                            { key: 'placed', label: 'Order Placed', active: true, icon: CheckCircle2 },
                                            {
                                                key: 'processing',
                                                label: 'Processing',
                                                active: ['processing', 'dispatched', 'delivered'].includes(trackingResult.order_status),
                                                icon: Clock
                                            },
                                            {
                                                key: 'dispatched',
                                                label: 'Dispatched',
                                                active: ['dispatched', 'delivered'].includes(trackingResult.order_status) || Boolean(trackingResult.courier_tracking_id),
                                                icon: Truck
                                            },
                                            {
                                                key: 'delivered',
                                                label: 'Delivered',
                                                active: trackingResult.order_status === 'delivered',
                                                icon: ShieldCheck
                                            },
                                        ].map((step, idx) => {
                                            const Icon = step.icon;
                                            return (
                                                <div key={idx} className="flex flex-col items-center">
                                                    <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center mb-1.5 transition ${step.active ? 'bg-emerald-600 text-white shadow-md' : 'bg-gray-100 text-gray-400'
                                                        }`}>
                                                        <Icon className="w-4 h-4 sm:w-5 sm:h-5" />
                                                    </div>
                                                    <span className={`text-[11px] sm:text-xs font-bold ${step.active ? 'text-gray-900' : 'text-gray-400'}`}>
                                                        {step.label}
                                                    </span>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>

                                {/* Logistics Details */}
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                                    <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100 space-y-1.5">
                                        <span className="font-bold text-gray-800 block text-xs">Customer Information</span>
                                        <p><strong className="text-gray-600">Name:</strong> {trackingResult.customer_name}</p>
                                        <p><strong className="text-gray-600">Phone:</strong> {trackingResult.customer_phone}</p>
                                        <p><strong className="text-gray-600">Address:</strong> {trackingResult.delivery_address}</p>
                                        <p><strong className="text-gray-600">Payment:</strong> {trackingResult.payment_method?.toUpperCase()} ({trackingResult.payment_status})</p>
                                    </div>

                                    <div className="p-4 bg-purple-50/60 rounded-2xl border border-purple-100 space-y-1.5">
                                        <span className="font-bold text-purple-900 block text-xs flex items-center gap-1.5">
                                            <Truck className="w-4 h-4 text-purple-600" />
                                            <span>Courier Logistics Information</span>
                                        </span>
                                        {trackingResult.courier_tracking_id ? (
                                            <>
                                                <p><strong className="text-gray-600">Courier Service:</strong> {trackingResult.courier_name || 'Express Courier'}</p>
                                                <p><strong className="text-gray-600">Consignment Code:</strong> <span className="font-mono font-bold text-purple-900">{trackingResult.courier_tracking_id}</span></p>
                                                <p><strong className="text-gray-600">Delivery Status:</strong> {trackingResult.courier_status || 'In Transit'}</p>
                                                {trackingResult.courier_tracking_url && (
                                                    <a
                                                        href={trackingResult.courier_tracking_url}
                                                        target="_blank"
                                                        rel="noreferrer"
                                                        className="mt-2 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-purple-600 hover:bg-purple-700 text-white font-bold text-[11px] shadow-sm transition"
                                                    >
                                                        <span>Live Courier Tracking</span>
                                                        <ExternalLink className="w-3.5 h-3.5" />
                                                    </a>
                                                )}
                                            </>
                                        ) : (
                                            <p className="text-gray-500 italic pt-2">
                                                Your parcel is being packaged in our central warehouse and scheduled for courier pickup.
                                            </p>
                                        )}
                                    </div>
                                </div>

                                {/* Order Items list */}
                                {trackingResult.items && trackingResult.items.length > 0 && (
                                    <div className="pt-2">
                                        <h4 className="text-xs font-bold text-gray-800 uppercase tracking-wider mb-2">
                                            Package Items ({trackingResult.items.length})
                                        </h4>
                                        <div className="divide-y divide-gray-100 border rounded-xl overflow-hidden">
                                            {trackingResult.items.map((item, idx) => (
                                                <div key={idx} className="p-3 flex items-center justify-between text-xs">
                                                    <div>
                                                        <span className="font-bold text-gray-900">{item.product_name}</span>
                                                        <span className="text-gray-400 ml-2">Qty: {item.quantity}</span>
                                                    </div>
                                                    <span className="font-bold text-gray-800">৳{Number(item.subtotal).toLocaleString()}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        ) : (searchQuery.order_number || searchQuery.phone) ? (
                            <div className="p-6 bg-rose-50 border border-rose-200 rounded-2xl text-rose-800 text-xs flex items-start gap-3">
                                <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
                                <div>
                                    <strong className="block font-bold">No Order Found Matching Details</strong>
                                    <p className="text-rose-600 mt-0.5">
                                        Please double-check your Order Number or Phone Number. If you recently placed the order, give our system a few minutes or call our hotline at <strong>16793</strong>.
                                    </p>
                                </div>
                            </div>
                        ) : null}
                    </div>
                )}

                {/* ========================================================= */}
                {/* 2. INTERACTIVE ENGINE: EMI CALCULATOR                      */}
                {/* ========================================================= */}
                {page.page_type === 'emi_calculator' && (
                    <div className="space-y-10">
                        {/* Interactive Calculator Section */}
                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-start">
                            {/* Left: Interactive Controls */}
                            <div className="lg:col-span-7 bg-white p-6 sm:p-8 rounded-3xl border border-gray-200/90 shadow-sm space-y-6">
                                <div className="border-b border-gray-100 pb-4">
                                    <h2 className="text-base sm:text-lg font-black text-gray-900 flex items-center gap-2">
                                        <Calculator className="w-5 h-5 text-[#EF4A23]" />
                                        <span>Interactive EMI Installment Planner</span>
                                    </h2>
                                    <p className="text-xs text-gray-500 mt-1">
                                        Customize your purchase price, down payment, bank, and duration to see instant monthly payments.
                                    </p>
                                </div>

                                {/* Product Price input & slider & presets */}
                                <div className="space-y-3">
                                    <div className="flex flex-wrap items-center justify-between gap-2">
                                        <label className="text-xs font-bold text-gray-700">Total Purchase Amount (৳)</label>
                                        <div className="relative">
                                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 font-bold text-xs">৳</span>
                                            <input
                                                type="number"
                                                min="5000"
                                                max="1000000"
                                                step="1000"
                                                value={emiPrice}
                                                onChange={(e) => setEmiPrice(Math.max(5000, Number(e.target.value)))}
                                                className="w-36 text-right pl-7 pr-3 py-1.5 text-xs font-mono font-black text-[#EF4A23] rounded-xl border-gray-300 focus:border-[#EF4A23] focus:ring-[#EF4A23]"
                                            />
                                        </div>
                                    </div>

                                    <input
                                        type="range"
                                        min="5000"
                                        max="500000"
                                        step="5000"
                                        value={Math.min(500000, emiPrice)}
                                        onChange={(e) => setEmiPrice(Number(e.target.value))}
                                        className="w-full accent-[#EF4A23] cursor-pointer"
                                    />

                                    {/* Price Presets */}
                                    <div className="flex flex-wrap items-center gap-1.5 pt-1">
                                        <span className="text-[11px] text-gray-400 mr-1">Popular:</span>
                                        {[25000, 50000, 80000, 120000, 200000, 350000].map((preset) => (
                                            <button
                                                key={preset}
                                                type="button"
                                                onClick={() => setEmiPrice(preset)}
                                                className={`px-2.5 py-1 text-[11px] font-semibold rounded-lg transition border ${emiPrice === preset
                                                        ? 'bg-[#EF4A23] text-white border-[#EF4A23]'
                                                        : 'bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100'
                                                    }`}
                                            >
                                                ৳{(preset / 1000).toFixed(0)}k
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Down Payment input & quick % */}
                                <div className="space-y-3 pt-3 border-t border-gray-100">
                                    <div className="flex flex-wrap items-center justify-between gap-2">
                                        <label className="text-xs font-bold text-gray-700">Down Payment (Optional ৳)</label>
                                        <span className="text-xs font-bold text-gray-900 font-mono">
                                            ৳{Number(emiDownPayment).toLocaleString()}
                                        </span>
                                    </div>

                                    <input
                                        type="number"
                                        min="0"
                                        max={Math.max(0, emiPrice - 5000)}
                                        step="1000"
                                        value={emiDownPayment}
                                        onChange={(e) => setEmiDownPayment(Math.min(Math.max(0, emiPrice - 5000), Math.max(0, Number(e.target.value))))}
                                        className="w-full text-xs rounded-xl border-gray-300 focus:border-[#EF4A23] focus:ring-[#EF4A23] py-2 px-3 font-mono"
                                        placeholder="0"
                                    />

                                    <div className="flex flex-wrap items-center gap-1.5">
                                        <span className="text-[11px] text-gray-400 mr-1">Percentage:</span>
                                        {[0, 10, 20, 30, 50].map((pct) => {
                                            const calculated = Math.round((emiPrice * pct) / 100);
                                            return (
                                                <button
                                                    key={pct}
                                                    type="button"
                                                    onClick={() => setEmiDownPayment(calculated)}
                                                    className={`px-2 py-1 text-[11px] font-semibold rounded-lg transition border ${emiDownPayment === calculated
                                                            ? 'bg-[#EF4A23] text-white border-[#EF4A23]'
                                                            : 'bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100'
                                                        }`}
                                                >
                                                    {pct}%
                                                </button>
                                            );
                                        })}
                                    </div>
                                </div>

                                {/* Bank selection */}
                                <div className="space-y-3 pt-3 border-t border-gray-100">
                                    <label className="text-xs font-bold text-gray-700 block">Select Your Credit Card Bank</label>
                                    <select
                                        value={emiBank}
                                        onChange={(e) => {
                                            setEmiBank(e.target.value);
                                            const b = EMI_BANKS.find(x => x.name === e.target.value);
                                            if (b && emiMonths > b.maxMonths) {
                                                setEmiMonths(b.maxMonths);
                                            }
                                        }}
                                        className="w-full text-xs rounded-xl border-gray-300 focus:border-[#EF4A23] focus:ring-[#EF4A23] py-2.5 px-3 font-semibold text-gray-800"
                                    >
                                        {EMI_BANKS.map((b, idx) => (
                                            <option key={idx} value={b.name}>
                                                {b.name} — Up to {b.maxMonths} Months ({b.cards})
                                            </option>
                                        ))}
                                    </select>

                                    <div className="bg-orange-50/70 border border-orange-200/70 p-3 rounded-xl text-xs space-y-1">
                                        <div className="flex items-center justify-between font-bold text-gray-900">
                                            <span>{currentBankObj.name}</span>
                                            <span className="text-[#EF4A23] font-bold">{currentBankObj.promo}</span>
                                        </div>
                                        <p className="text-[11px] text-gray-600">
                                            Eligible Cards: <strong className="text-gray-800">{currentBankObj.cards}</strong>
                                        </p>
                                        <p className="text-[11px] text-gray-600">
                                            Maximum Duration: <strong className="text-gray-800">{currentBankObj.maxMonths} Months</strong>
                                        </p>
                                    </div>
                                </div>

                                {/* Tenure selection */}
                                <div className="space-y-3 pt-3 border-t border-gray-100">
                                    <div className="flex items-center justify-between">
                                        <label className="text-xs font-bold text-gray-700">Select EMI Tenure (Duration)</label>
                                        <span className="text-[11px] text-gray-400">Selected: {emiMonths} Months</span>
                                    </div>

                                    <div className="grid grid-cols-4 sm:grid-cols-7 gap-2">
                                        {TENURE_MONTHS.map((m) => {
                                            const isSupported = m <= currentBankObj.maxMonths;
                                            const isSelected = emiMonths === m;
                                            return (
                                                <button
                                                    key={m}
                                                    type="button"
                                                    disabled={!isSupported}
                                                    onClick={() => setEmiMonths(m)}
                                                    className={`py-2.5 px-2 text-xs font-bold rounded-xl border text-center transition flex flex-col items-center justify-center ${!isSupported
                                                            ? 'opacity-40 bg-gray-50 border-gray-200 cursor-not-allowed'
                                                            : isSelected
                                                                ? 'bg-[#081621] text-white border-[#081621] shadow-md ring-2 ring-[#EF4A23]/30 scale-[1.02]'
                                                                : 'bg-white text-gray-700 border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                                                        }`}
                                                >
                                                    <span className={isSelected ? 'text-orange-400' : ''}>{m}M</span>
                                                    <span className={`text-[10px] mt-0.5 ${isSelected ? 'text-gray-200' : 'text-gray-400'}`}>
                                                        ৳{(calcMonthly(m) / 1000).toFixed(1)}k
                                                    </span>
                                                </button>
                                            );
                                        })}
                                    </div>
                                </div>
                            </div>

                            {/* Right: Calculated Summary Result Card */}
                            <div className="lg:col-span-5 bg-gradient-to-br from-[#081621] via-[#112538] to-[#081621] text-white p-6 sm:p-8 rounded-3xl shadow-2xl flex flex-col justify-between border border-gray-800 sticky top-24">
                                <div>
                                    <div className="flex items-center justify-between border-b border-gray-800 pb-5 mb-6">
                                        <div>
                                            <span className="text-[11px] text-gray-400 uppercase tracking-wider block font-medium">
                                                Monthly Installment (EMI)
                                            </span>
                                            <span className="text-3xl sm:text-4xl font-black text-[#EF4A23] mt-1 block">
                                                ৳{monthlyInstallment.toLocaleString()}
                                                <span className="text-xs text-gray-400 font-normal ml-1.5">/ month</span>
                                            </span>
                                        </div>
                                        <div className="w-12 h-12 rounded-2xl bg-orange-500/10 border border-orange-500/20 text-[#EF4A23] flex items-center justify-center shrink-0">
                                            <CreditCard className="w-6 h-6" />
                                        </div>
                                    </div>

                                    <div className="space-y-3 text-xs">
                                        <div className="flex justify-between py-2 border-b border-gray-800/80">
                                            <span className="text-gray-400">Total Purchase Value:</span>
                                            <span className="font-bold text-white">৳{emiPrice.toLocaleString()}</span>
                                        </div>
                                        <div className="flex justify-between py-2 border-b border-gray-800/80">
                                            <span className="text-gray-400">Down Payment:</span>
                                            <span className="font-bold text-white">৳{Number(emiDownPayment).toLocaleString()}</span>
                                        </div>
                                        <div className="flex justify-between py-2 border-b border-gray-800/80">
                                            <span className="text-gray-400">Net Financed Amount:</span>
                                            <span className="font-bold text-orange-400">৳{financedAmount.toLocaleString()}</span>
                                        </div>
                                        <div className="flex justify-between py-2 border-b border-gray-800/80">
                                            <span className="text-gray-400">Installment Duration:</span>
                                            <span className="font-bold text-white">{emiMonths} Months</span>
                                        </div>
                                        <div className="flex justify-between py-2 border-b border-gray-800/80">
                                            <span className="text-gray-400">Card Issuing Bank:</span>
                                            <span className="font-bold text-white">{emiBank}</span>
                                        </div>
                                        <div className="flex justify-between py-2 border-b border-gray-800/80">
                                            <span className="text-gray-400">Annual Interest Scheme:</span>
                                            <span className="font-bold text-emerald-400">0% Promotional EMI</span>
                                        </div>
                                        <div className="flex justify-between py-2">
                                            <span className="text-gray-400">Total Payable:</span>
                                            <span className="font-black text-white text-sm">৳{totalPayable.toLocaleString()}</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="mt-8 pt-4 border-t border-gray-800 space-y-4">
                                    <div className="flex items-center gap-2">
                                        <button
                                            type="button"
                                            onClick={handleCopyEmiSummary}
                                            className="flex-1 py-2.5 px-3 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition border border-white/10"
                                        >
                                            {copiedPlan ? <Check className="w-4 h-4 text-emerald-400" /> : <Share2 className="w-4 h-4 text-orange-400" />}
                                            <span>{copiedPlan ? 'Plan Copied!' : 'Copy EMI Plan'}</span>
                                        </button>
                                        <Link
                                            href="/search"
                                            className="flex-1 py-2.5 px-3 bg-[#EF4A23] hover:bg-[#d63c17] text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition shadow-md"
                                        >
                                            <ShoppingBag className="w-4 h-4" />
                                            <span>Shop Products</span>
                                        </Link>
                                    </div>

                                    <div className="text-[11px] text-gray-400 space-y-1">
                                        <p className="flex items-center gap-1.5 text-emerald-400 font-semibold">
                                            <CheckCircle2 className="w-4 h-4 shrink-0" />
                                            <span>Available online & at all {siteName} retail branches nationwide.</span>
                                        </p>
                                        <p>* Credit card with available limit equivalent to full order amount is required.</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Full Matrix Table */}
                        <div className="bg-white rounded-3xl border border-gray-200/90 shadow-sm overflow-hidden">
                            <div className="p-6 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-gray-50/70">
                                <div>
                                    <h3 className="text-sm sm:text-base font-black text-gray-900 flex items-center gap-2">
                                        <BadgePercent className="w-5 h-5 text-[#EF4A23]" />
                                        <span>Complete Tenure Comparison Matrix</span>
                                    </h3>
                                    <p className="text-xs text-gray-500 mt-0.5">
                                        Overview of monthly installments for ৳{emiPrice.toLocaleString()} across all duration terms with {currentBankObj.name}.
                                    </p>
                                </div>
                                <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200 self-start sm:self-auto">
                                    0% Promo Interest
                                </span>
                            </div>

                            <div className="overflow-x-auto">
                                <table className="w-full text-left text-xs">
                                    <thead>
                                        <tr className="bg-gray-100/80 text-gray-500 font-bold uppercase text-[10px] border-b border-gray-200">
                                            <th className="py-3 px-6">Tenure (Duration)</th>
                                            <th className="py-3 px-6">Monthly Installment</th>
                                            <th className="py-3 px-6">Financed Amount</th>
                                            <th className="py-3 px-6">Interest Rate</th>
                                            <th className="py-3 px-6">Total Amount</th>
                                            <th className="py-3 px-6 text-center">Bank Support</th>
                                            <th className="py-3 px-6 text-center">Action</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100 font-medium">
                                        {TENURE_MONTHS.map((m) => {
                                            const isSupported = m <= currentBankObj.maxMonths;
                                            const isSelected = emiMonths === m;
                                            const monthly = calcMonthly(m);
                                            const total = (monthly * m) + Number(emiDownPayment);

                                            return (
                                                <tr
                                                    key={m}
                                                    onClick={() => isSupported && setEmiMonths(m)}
                                                    className={`transition cursor-pointer ${isSelected
                                                            ? 'bg-orange-50/80 font-bold text-gray-900'
                                                            : isSupported
                                                                ? 'hover:bg-gray-50 text-gray-700'
                                                                : 'opacity-40 bg-gray-50/30 text-gray-400 cursor-not-allowed'
                                                        }`}
                                                >
                                                    <td className="py-3.5 px-6">
                                                        <span className={`inline-flex items-center gap-2 ${isSelected ? 'text-[#EF4A23]' : ''}`}>
                                                            {isSelected && <span className="w-2 h-2 rounded-full bg-[#EF4A23]"></span>}
                                                            <strong className="text-gray-900 font-black">{m} Months</strong>
                                                        </span>
                                                    </td>
                                                    <td className="py-3.5 px-6 font-black text-gray-900 text-sm">
                                                        ৳{monthly.toLocaleString()}<span className="text-[11px] font-normal text-gray-400">/mo</span>
                                                    </td>
                                                    <td className="py-3.5 px-6 text-gray-600 font-mono">
                                                        ৳{financedAmount.toLocaleString()}
                                                    </td>
                                                    <td className="py-3.5 px-6 text-emerald-600 font-bold">
                                                        0% Promo
                                                    </td>
                                                    <td className="py-3.5 px-6 text-gray-800 font-mono font-bold">
                                                        ৳{total.toLocaleString()}
                                                    </td>
                                                    <td className="py-3.5 px-6 text-center">
                                                        {isSupported ? (
                                                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                                                                <CheckCircle className="w-3 h-3" />
                                                                Available
                                                            </span>
                                                        ) : (
                                                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-medium bg-gray-100 text-gray-400">
                                                                Max {currentBankObj.maxMonths}M
                                                            </span>
                                                        )}
                                                    </td>
                                                    <td className="py-3.5 px-6 text-center">
                                                        <button
                                                            type="button"
                                                            disabled={!isSupported}
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                if (isSupported) setEmiMonths(m);
                                                            }}
                                                            className={`px-3 py-1 text-[11px] rounded-lg font-bold transition ${isSelected
                                                                    ? 'bg-[#EF4A23] text-white shadow-xs'
                                                                    : isSupported
                                                                        ? 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                                                                        : 'bg-gray-100 text-gray-300 cursor-not-allowed'
                                                                }`}
                                                        >
                                                            {isSelected ? 'Active Plan' : 'Select'}
                                                        </button>
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        {/* 4 Steps: How EMI Works */}
                        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-gray-200/90 shadow-sm space-y-6">
                            <h3 className="text-base font-black text-gray-900 flex items-center gap-2">
                                <Sparkles className="w-5 h-5 text-[#EF4A23]" />
                                <span>How EMI Facility Works at {siteName}</span>
                            </h3>

                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                                {[
                                    {
                                        step: '01',
                                        title: 'Choose Eligible Product',
                                        desc: 'Pick any laptop, PC component, or gadget valued ৳5,000 or higher (or multiple items combined in cart).'
                                    },
                                    {
                                        step: '02',
                                        title: 'Select Partner Bank',
                                        desc: 'Hold an eligible Credit Card issued by any of our 28+ partnered commercial banks in Bangladesh.'
                                    },
                                    {
                                        step: '03',
                                        title: 'Pick 3 to 36 Months Tenure',
                                        desc: 'Select your preferred duration during online checkout or on branch POS swipe machines.'
                                    },
                                    {
                                        step: '04',
                                        title: 'Auto-Converted by Bank',
                                        desc: 'Your card bank blocks the amount and automatically converts it into easy equal monthly credit card bills.'
                                    }
                                ].map((step, idx) => (
                                    <div key={idx} className="p-4 sm:p-5 rounded-2xl bg-gray-50 border border-gray-100 space-y-2 relative overflow-hidden group hover:border-orange-200 transition">
                                        <span className="text-2xl font-black text-orange-200 group-hover:text-orange-300 transition">
                                            {step.step}
                                        </span>
                                        <h4 className="text-xs font-bold text-gray-900">{step.title}</h4>
                                        <p className="text-[11px] text-gray-500 leading-relaxed">{step.desc}</p>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Supported Banks Matrix Breakdown */}
                        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-gray-200/90 shadow-sm space-y-6">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                                <div>
                                    <h3 className="text-base font-black text-gray-900 flex items-center gap-2">
                                        <Building2 className="w-5 h-5 text-[#EF4A23]" />
                                        <span>28+ Partner Banks Categorized by Tenure</span>
                                    </h3>
                                    <p className="text-xs text-gray-500 mt-0.5">
                                        0% Interest EMI facilities available both online and across all branch showrooms.
                                    </p>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                {/* Up to 36 Months */}
                                <div className="p-5 rounded-2xl bg-emerald-50/50 border border-emerald-200/70 space-y-3">
                                    <div className="flex items-center justify-between">
                                        <span className="text-xs font-black text-emerald-900 uppercase tracking-wider">Up to 36 Months (3 Years)</span>
                                        <span className="text-[10px] bg-emerald-200/70 text-emerald-900 font-bold px-2 py-0.5 rounded-full">Top Tenure</span>
                                    </div>
                                    <ul className="text-xs text-gray-700 space-y-2">
                                        <li className="flex items-center gap-2 font-semibold">
                                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                                            <span>City Bank (American Express, Visa, Master)</span>
                                        </li>
                                        <li className="flex items-center gap-2 font-semibold">
                                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                                            <span>Eastern Bank Limited (EBL Credit Cards)</span>
                                        </li>
                                    </ul>
                                </div>

                                {/* Up to 24 Months */}
                                <div className="p-5 rounded-2xl bg-blue-50/50 border border-blue-200/70 space-y-3">
                                    <div className="flex items-center justify-between">
                                        <span className="text-xs font-black text-blue-900 uppercase tracking-wider">Up to 24 Months (2 Years)</span>
                                        <span className="text-[10px] bg-blue-200/70 text-blue-900 font-bold px-2 py-0.5 rounded-full">Most Popular</span>
                                    </div>
                                    <ul className="text-xs text-gray-700 space-y-1.5">
                                        {['BRAC Bank', 'Standard Chartered (SCB)', 'Mutual Trust Bank (MTB)', 'Prime Bank', 'Dhaka Bank', 'Southeast Bank', 'LankaBangla Finance'].map((b, i) => (
                                            <li key={i} className="flex items-center gap-2">
                                                <CheckCircle2 className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                                                <span>{b}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>

                                {/* Up to 12-18 Months */}
                                <div className="p-5 rounded-2xl bg-purple-50/50 border border-purple-200/70 space-y-3">
                                    <div className="flex items-center justify-between">
                                        <span className="text-xs font-black text-purple-900 uppercase tracking-wider">Up to 12 - 18 Months</span>
                                        <span className="text-[10px] bg-purple-200/70 text-purple-900 font-bold px-2 py-0.5 rounded-full">Standard</span>
                                    </div>
                                    <ul className="text-xs text-gray-700 space-y-1.5">
                                        {['Dutch-Bangla Bank (DBBL Nexus/Visa)', 'UCB (Up to 18M)', 'Bank Asia', 'NCC Bank', 'Jamuna Bank', 'Premier Bank', 'Trust Bank', 'Midland Bank'].map((b, i) => (
                                            <li key={i} className="flex items-center gap-2">
                                                <CheckCircle2 className="w-3.5 h-3.5 text-purple-600 shrink-0" />
                                                <span>{b}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        </div>

                        {/* EMI FAQs Accordion */}
                        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-gray-200/90 shadow-sm space-y-4">
                            <h3 className="text-base font-black text-gray-900 flex items-center gap-2 mb-2">
                                <HelpCircle className="w-5 h-5 text-[#EF4A23]" />
                                <span>Frequently Asked Questions About EMI</span>
                            </h3>

                            <div className="divide-y divide-gray-100">
                                {EMI_FAQS.map((faq, idx) => {
                                    const isOpen = openEmiFaq === idx;
                                    return (
                                        <div key={idx} className="py-3.5">
                                            <button
                                                type="button"
                                                onClick={() => setOpenEmiFaq(isOpen ? null : idx)}
                                                className="w-full text-left flex items-center justify-between gap-3 text-xs sm:text-sm font-bold text-gray-800 hover:text-[#EF4A23] transition"
                                            >
                                                <span>{faq.q}</span>
                                                <ChevronDown className={`w-4 h-4 text-gray-400 shrink-0 transition-transform duration-200 ${isOpen ? 'rotate-180 text-[#EF4A23]' : ''}`} />
                                            </button>
                                            {isOpen && (
                                                <p className="text-xs text-gray-600 mt-2 leading-relaxed pl-1 animate-fade-in">
                                                    {faq.a}
                                                </p>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                )}

                {/* ========================================================= */}
                {/* 3. INTERACTIVE ENGINE: CONTACT US & BRANCHES              */}
                {/* ========================================================= */}
                {(page.page_type === 'contact_us' || page.page_type === 'service_complain') && (
                    <div className="space-y-8">
                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                            {/* Contact Form */}
                            <div className="lg:col-span-7 bg-white p-6 sm:p-8 rounded-3xl border border-gray-200/90 shadow-sm space-y-5">
                                <h3 className="text-base font-bold text-gray-900 flex items-center gap-2">
                                    {page.page_type === 'service_complain' ? <Wrench className="w-5 h-5 text-[#EF4A23]" /> : <Send className="w-5 h-5 text-[#EF4A23]" />}
                                    <span>
                                        {page.page_type === 'service_complain' ? 'Submit RMA Service & Repair Complaint' : 'Send an Inquiry / Feedback'}
                                    </span>
                                </h3>

                                <form onSubmit={handleInquirySubmit} className="space-y-4">
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-xs font-semibold text-gray-700 mb-1">Your Name *</label>
                                            <input
                                                type="text"
                                                required
                                                value={inquiryData.name}
                                                onChange={(e) => setInquiryData('name', e.target.value)}
                                                placeholder="e.g. Asif Mahmud"
                                                className="w-full text-xs rounded-xl border-gray-300 focus:border-[#EF4A23] focus:ring-[#EF4A23] py-2 px-3"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-xs font-semibold text-gray-700 mb-1">Phone Number *</label>
                                            <input
                                                type="tel"
                                                required
                                                value={inquiryData.phone}
                                                onChange={(e) => setInquiryData('phone', e.target.value)}
                                                placeholder="01XXXXXXXXX"
                                                className="w-full text-xs rounded-xl border-gray-300 focus:border-[#EF4A23] focus:ring-[#EF4A23] py-2 px-3"
                                            />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-xs font-semibold text-gray-700 mb-1">Email Address</label>
                                            <input
                                                type="email"
                                                value={inquiryData.email}
                                                onChange={(e) => setInquiryData('email', e.target.value)}
                                                placeholder="your@email.com"
                                                className="w-full text-xs rounded-xl border-gray-300 focus:border-[#EF4A23] focus:ring-[#EF4A23] py-2 px-3"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-xs font-semibold text-gray-700 mb-1">Order / Invoice No (Optional)</label>
                                            <input
                                                type="text"
                                                value={inquiryData.order_number}
                                                onChange={(e) => setInquiryData('order_number', e.target.value)}
                                                placeholder="e.g. ST-261008-8472"
                                                className="w-full text-xs rounded-xl border-gray-300 focus:border-[#EF4A23] focus:ring-[#EF4A23] py-2 px-3 font-mono"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-xs font-semibold text-gray-700 mb-1">Subject *</label>
                                        <input
                                            type="text"
                                            required
                                            value={inquiryData.subject}
                                            onChange={(e) => setInquiryData('subject', e.target.value)}
                                            placeholder="e.g. Warranty claim for GPU / Query regarding bulk purchase"
                                            className="w-full text-xs rounded-xl border-gray-300 focus:border-[#EF4A23] focus:ring-[#EF4A23] py-2 px-3"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-xs font-semibold text-gray-700 mb-1">Message / Complaint Details *</label>
                                        <textarea
                                            rows="5"
                                            required
                                            value={inquiryData.message}
                                            onChange={(e) => setInquiryData('message', e.target.value)}
                                            placeholder="Please describe your technical issue, hardware serial number, or feedback..."
                                            className="w-full text-xs rounded-xl border-gray-300 focus:border-[#EF4A23] focus:ring-[#EF4A23] p-3 leading-relaxed"
                                        ></textarea>
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={inquiryProcessing}
                                        className="w-full py-3 px-4 bg-[#EF4A23] hover:bg-[#d63c17] text-white font-bold text-xs rounded-xl transition shadow-md flex items-center justify-center gap-2 disabled:opacity-50"
                                    >
                                        <Send className="w-4 h-4" />
                                        <span>{inquiryProcessing ? 'Submitting...' : 'Send Message to Tech Shoppers'}</span>
                                    </button>
                                </form>
                            </div>

                            {/* Help Desk & Branch Cards */}
                            <div className="lg:col-span-5 space-y-4">
                                <div className="bg-[#081621] text-white p-6 rounded-3xl border border-gray-800 shadow-xl space-y-4">
                                    <h4 className="text-sm font-bold text-white flex items-center gap-2">
                                        <PhoneCall className="w-4 h-4 text-[#EF4A23]" />
                                        <span>Direct Customer Hotline</span>
                                    </h4>
                                    <div className="p-4 bg-white/5 rounded-2xl border border-white/10">
                                        <span className="text-[11px] text-gray-400 block">General Hotline (10am - 7pm)</span>
                                        <span className="text-2xl font-black text-[#EF4A23] block mt-0.5">16793</span>
                                        <span className="text-xs text-gray-300 mt-1 block">Alternate: 09678002003</span>
                                    </div>
                                    <div className="text-xs text-gray-300 space-y-2">
                                        <div className="flex items-start gap-2">
                                            <Mail className="w-4 h-4 text-[#EF4A23] shrink-0 mt-0.5" />
                                            <span>info@techshoppers.com &bull; support@techshoppers.com</span>
                                        </div>
                                        <div className="flex items-start gap-2">
                                            <MapPin className="w-4 h-4 text-[#EF4A23] shrink-0 mt-0.5" />
                                            <span>28 Kazi Nazrul Islam Avenue, Banglamotor, Dhaka 1000</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-white p-6 rounded-3xl border border-gray-200/90 shadow-sm space-y-3 text-xs">
                                    <h4 className="font-bold text-gray-900 flex items-center gap-2 text-xs">
                                        <Building2 className="w-4 h-4 text-[#EF4A23]" />
                                        <span>Major Superstore Outlets</span>
                                    </h4>
                                    <ul className="space-y-2 text-gray-600 divide-y divide-gray-100">
                                        <li className="pt-2"><strong>IDB Bhaban:</strong> BCS Computer City, Agargaon, Dhaka</li>
                                        <li className="pt-2"><strong>Multiplan Center:</strong> New Elephant Road, Dhaka</li>
                                        <li className="pt-2"><strong>Uttara Branch:</strong> Sector 3, RAK Tower, Jashimuddin Road</li>
                                        <li className="pt-2"><strong>Agrabad Chattogram:</strong> Yunusco City Center, CDA Avenue</li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* ========================================================= */}
                {/* 4. DYNAMIC CMS PAGE CONTENT (Rich Text / HTML Body)       */}
                {/* ========================================================= */}
                {page.content && (
                    <div className="bg-white p-6 sm:p-10 rounded-3xl border border-gray-200/90 shadow-sm">
                        <div
                            className="prose prose-sm sm:prose max-w-none text-gray-700 leading-relaxed space-y-4"
                            dangerouslySetInnerHTML={{ __html: page.content }}
                        />
                    </div>
                )}
            </div>
        </FrontendLayout>
    );
}
