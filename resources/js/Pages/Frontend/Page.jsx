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
    Phone
} from 'lucide-react';

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

    const financedAmount = Math.max(0, emiPrice - emiDownPayment);
    const monthlyInstallment = emiMonths > 0 
        ? Math.round((financedAmount * (1 + (emiRate / 100))) / emiMonths) 
        : 0;
    const totalPayable = (monthlyInstallment * emiMonths) + Number(emiDownPayment);

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
                                Enter your StarTech Order Number (e.g. ST-261008-1234) and/or your checkout phone number.
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
                                                    <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center mb-1.5 transition ${
                                                        step.active ? 'bg-emerald-600 text-white shadow-md' : 'bg-gray-100 text-gray-400'
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
                    <div className="space-y-8">
                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8">
                            {/* Left: Interactive Controls */}
                            <div className="lg:col-span-7 bg-white p-6 sm:p-8 rounded-3xl border border-gray-200/90 shadow-sm space-y-6">
                                <h2 className="text-base font-bold text-gray-900 flex items-center gap-2">
                                    <Calculator className="w-5 h-5 text-[#EF4A23]" />
                                    <span>Calculate Your Monthly Installment (EMI)</span>
                                </h2>

                                {/* Product Price input & slider */}
                                <div>
                                    <div className="flex items-center justify-between mb-1.5">
                                        <label className="text-xs font-bold text-gray-700">Product Total Price (৳)</label>
                                        <span className="text-base font-black text-[#EF4A23]">৳{Number(emiPrice).toLocaleString()}</span>
                                    </div>
                                    <input
                                        type="range"
                                        min="10000"
                                        max="500000"
                                        step="5000"
                                        value={emiPrice}
                                        onChange={(e) => setEmiPrice(Number(e.target.value))}
                                        className="w-full accent-[#EF4A23] cursor-pointer"
                                    />
                                    <div className="flex justify-between text-[10px] text-gray-400 mt-1">
                                        <span>৳10,000</span>
                                        <span>৳250,000</span>
                                        <span>৳500,000</span>
                                    </div>
                                </div>

                                {/* Down Payment input */}
                                <div>
                                    <div className="flex items-center justify-between mb-1.5">
                                        <label className="text-xs font-bold text-gray-700">Down Payment (Optional ৳)</label>
                                        <span className="text-xs font-bold text-gray-800">৳{Number(emiDownPayment).toLocaleString()}</span>
                                    </div>
                                    <input
                                        type="number"
                                        min="0"
                                        max={emiPrice - 5000}
                                        step="1000"
                                        value={emiDownPayment}
                                        onChange={(e) => setEmiDownPayment(Math.min(emiPrice - 5000, Math.max(0, Number(e.target.value))))}
                                        className="w-full text-xs rounded-xl border-gray-300 focus:border-[#EF4A23] focus:ring-[#EF4A23] py-2 px-3"
                                    />
                                </div>

                                {/* Tenure Months selection */}
                                <div>
                                    <label className="text-xs font-bold text-gray-700 block mb-2">EMI Tenure (Duration)</label>
                                    <div className="grid grid-cols-4 sm:grid-cols-7 gap-2">
                                        {[3, 6, 9, 12, 18, 24, 36].map((m) => (
                                            <button
                                                key={m}
                                                type="button"
                                                onClick={() => setEmiMonths(m)}
                                                className={`py-2 px-2 text-xs font-bold rounded-xl border text-center transition ${
                                                    emiMonths === m 
                                                        ? 'bg-[#081621] text-white border-[#081621] shadow-sm' 
                                                        : 'bg-white text-gray-700 border-gray-200 hover:border-gray-300'
                                                }`}
                                            >
                                                {m}M
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Bank selection */}
                                <div>
                                    <label className="text-xs font-bold text-gray-700 block mb-2">Select Your Credit Card Bank</label>
                                    <select
                                        value={emiBank}
                                        onChange={(e) => setEmiBank(e.target.value)}
                                        className="w-full text-xs rounded-xl border-gray-300 focus:border-[#EF4A23] focus:ring-[#EF4A23] py-2.5 px-3"
                                    >
                                        <option value="City Bank AMEX">City Bank (American Express / Visa / Master)</option>
                                        <option value="BRAC Bank">BRAC Bank Credit Card</option>
                                        <option value="Eastern Bank (EBL)">Eastern Bank Ltd (EBL)</option>
                                        <option value="Standard Chartered">Standard Chartered Bank (SCB)</option>
                                        <option value="Dutch Bangla Bank (DBBL)">Dutch-Bangla Bank (DBBL Nexus / Visa)</option>
                                        <option value="Prime Bank">Prime Bank Credit Card</option>
                                        <option value="Mutual Trust Bank (MTB)">Mutual Trust Bank (MTB)</option>
                                        <option value="Dhaka Bank">Dhaka Bank Credit Card</option>
                                        <option value="Southeast Bank">Southeast Bank</option>
                                        <option value="United Commercial Bank (UCB)">UCB Credit Card</option>
                                    </select>
                                </div>
                            </div>

                            {/* Right: Calculated Summary Result Card */}
                            <div className="lg:col-span-5 bg-gradient-to-br from-[#081621] via-[#112538] to-[#081621] text-white p-6 sm:p-8 rounded-3xl shadow-xl flex flex-col justify-between border border-gray-800">
                                <div>
                                    <div className="flex items-center justify-between border-b border-gray-800 pb-4 mb-6">
                                        <div>
                                            <span className="text-[11px] text-gray-400 uppercase tracking-wider block">Estimated Installment</span>
                                            <span className="text-3xl font-black text-[#EF4A23] mt-1 block">
                                                ৳{monthlyInstallment.toLocaleString()}
                                                <span className="text-xs text-gray-400 font-normal ml-1">/ month</span>
                                            </span>
                                        </div>
                                        <div className="w-12 h-12 rounded-2xl bg-orange-500/10 border border-orange-500/20 text-[#EF4A23] flex items-center justify-center">
                                            <CreditCard className="w-6 h-6" />
                                        </div>
                                    </div>

                                    <div className="space-y-3 text-xs">
                                        <div className="flex justify-between py-1.5 border-b border-gray-800/80">
                                            <span className="text-gray-400">Total Purchase Value:</span>
                                            <span className="font-bold text-white">৳{emiPrice.toLocaleString()}</span>
                                        </div>
                                        <div className="flex justify-between py-1.5 border-b border-gray-800/80">
                                            <span className="text-gray-400">Down Payment:</span>
                                            <span className="font-bold text-white">৳{Number(emiDownPayment).toLocaleString()}</span>
                                        </div>
                                        <div className="flex justify-between py-1.5 border-b border-gray-800/80">
                                            <span className="text-gray-400">Financed / Loan Amount:</span>
                                            <span className="font-bold text-white">৳{financedAmount.toLocaleString()}</span>
                                        </div>
                                        <div className="flex justify-between py-1.5 border-b border-gray-800/80">
                                            <span className="text-gray-400">Tenure Duration:</span>
                                            <span className="font-bold text-white">{emiMonths} Months</span>
                                        </div>
                                        <div className="flex justify-between py-1.5 border-b border-gray-800/80">
                                            <span className="text-gray-400">Partner Bank:</span>
                                            <span className="font-bold text-orange-400">{emiBank}</span>
                                        </div>
                                        <div className="flex justify-between py-1.5">
                                            <span className="text-gray-400">Annual Interest Rate:</span>
                                            <span className="font-bold text-emerald-400">0% Promotional EMI</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="mt-8 pt-4 border-t border-gray-800 text-[11px] text-gray-400 space-y-1">
                                    <p className="flex items-center gap-1.5 text-emerald-400 font-semibold">
                                        <CheckCircle2 className="w-4 h-4 shrink-0" />
                                        <span>Available both online & at all StarTech retail branches.</span>
                                    </p>
                                    <p>* Valid with all eligible credit cards from participating commercial banks in Bangladesh.</p>
                                </div>
                            </div>
                        </div>

                        {/* Supported Banks Grid */}
                        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-gray-200/90 shadow-sm">
                            <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-4 border-l-2 border-[#EF4A23] pl-2">
                                28+ Partner Banks with 0% EMI Facility
                            </h3>
                            <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-3 text-center text-xs font-semibold text-gray-700">
                                {[
                                    'City Bank AMEX', 'BRAC Bank', 'Eastern Bank', 'Standard Chartered',
                                    'DBBL', 'Prime Bank', 'Mutual Trust Bank', 'Dhaka Bank',
                                    'Southeast Bank', 'UCB', 'LankaBangla', 'Bank Asia',
                                    'NCC Bank', 'Jamuna Bank', 'One Bank', 'Premier Bank',
                                    'Trust Bank', 'Midland Bank'
                                ].map((b, i) => (
                                    <div key={i} className="p-3 bg-gray-50 rounded-xl border border-gray-200 hover:border-gray-300">
                                        {b}
                                    </div>
                                ))}
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
                                        <span>{inquiryProcessing ? 'Submitting...' : 'Send Message to StarTech'}</span>
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
                                            <span>info@startech.com.bd &bull; support@startech.com.bd</span>
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
