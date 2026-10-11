import React, { useState } from 'react';
import { useForm, Link, usePage } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { 
    ArrowLeft, CheckCircle2, AlertTriangle, ShieldCheck, ShieldAlert, ShieldX, 
    Truck, CreditCard, User, Printer, Copy, Check, ExternalLink, PackageCheck, Send
} from 'lucide-react';

export default function Show({ order, fraudAnalysis }) {
    const { settings } = usePage().props;
    const siteName = settings?.site_name || 'Tech Shoppers';
    const hotline = settings?.hotline || '16793';
    const address = settings?.address || 'Dhaka, Bangladesh';
    const tagline = settings?.site_tagline || 'Leading Computer & Tech Retailer in Bangladesh';
    const primaryColor = settings?.primary_color || '#EF4A23';

    const [copiedTracking, setCopiedTracking] = useState(false);
    const [printMode, setPrintMode] = useState('invoice'); // 'invoice' | 'courier_label'

    // Status update form
    const { data: statusData, setData: setStatusData, patch: patchStatus, processing: statusProcessing } = useForm({
        order_status: order.order_status,
        payment_status: order.payment_status,
    });

    // Fraud status form
    const { data: fraudData, setData: setFraudData, patch: patchFraud, processing: fraudProcessing } = useForm({
        fraud_status: order.fraud_status || fraudAnalysis?.status || 'safe',
    });

    // Courier dispatch form
    const { data: courierData, setData: setCourierData, post: postCourier, processing: courierProcessing } = useForm({
        courier_name: order.courier_name || 'steadfast',
        courier_tracking_id: order.courier_tracking_id || '',
        courier_collected_amount: order.courier_collected_amount !== null && order.courier_collected_amount !== undefined 
            ? order.courier_collected_amount 
            : (order.payment_method === 'cod' ? order.total : 0),
    });

    const handleUpdateStatus = (e) => {
        e.preventDefault();
        patchStatus(route('admin.orders.status', order.id));
    };

    const handleUpdateFraud = (newStatus) => {
        patchFraud(route('admin.orders.fraud', order.id), {
            data: { fraud_status: newStatus },
            preserveScroll: true,
        });
    };

    const handleDispatchCourier = (e) => {
        e.preventDefault();
        postCourier(route('admin.orders.courier', order.id), {
            preserveScroll: true,
        });
    };

    const copyToClipboard = (text) => {
        navigator.clipboard.writeText(text);
        setCopiedTracking(true);
        setTimeout(() => setCopiedTracking(false), 2000);
    };

    const handlePrintInvoice = () => {
        setPrintMode('invoice');
        setTimeout(() => window.print(), 100);
    };

    const handlePrintLabel = () => {
        setPrintMode('courier_label');
        setTimeout(() => window.print(), 100);
    };

    const getFraudBadge = (status) => {
        switch (status) {
            case 'safe':
                return {
                    label: 'Safe Order',
                    bg: 'bg-emerald-50 text-emerald-700 border-emerald-200',
                    icon: ShieldCheck,
                    color: '#10B981',
                };
            case 'review':
                return {
                    label: 'Review Required',
                    bg: 'bg-amber-50 text-amber-700 border-amber-200',
                    icon: ShieldAlert,
                    color: '#F59E0B',
                };
            case 'high_risk':
            case 'flagged':
                return {
                    label: 'High Risk / Suspicious',
                    bg: 'bg-rose-50 text-rose-700 border-rose-200',
                    icon: ShieldX,
                    color: '#EF4444',
                };
            default:
                return {
                    label: 'Unchecked',
                    bg: 'bg-gray-50 text-gray-700 border-gray-200',
                    icon: ShieldCheck,
                    color: '#6B7280',
                };
        }
    };

    const currentFraudInfo = getFraudBadge(order.fraud_status || fraudAnalysis?.status);
    const FraudBadgeIcon = currentFraudInfo.icon;
    const score = fraudAnalysis?.score ?? order.fraud_score ?? 10;

    const courierProviders = [
        { id: 'steadfast', name: 'Steadfast Courier', desc: 'Fastest door-to-door COD network in BD' },
        { id: 'pathao', name: 'Pathao Courier', desc: 'Same-day Dhaka & nationwide COD delivery' },
        { id: 'redx', name: 'RedX Logistics', desc: 'Nationwide coverage with reverse logistics' },
        { id: 'paperfly', name: 'Paperfly Courier', desc: 'Union-level doorstep delivery across BD' },
        { id: 'sundarban', name: 'Sundarban Courier', desc: 'Traditional transport & branch collection' },
        { id: 'startech_rider', name: `${siteName} Express Rider`, desc: 'In-house dedicated express Dhaka delivery' },
    ];

    return (
        <AdminLayout title={`Order: ${order.order_number}`}>
            {/* Screen View */}
            <div className="print:hidden max-w-5xl mx-auto space-y-6">
                {/* Header Actions */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <Link
                        href={route('admin.orders.index')}
                        className="inline-flex items-center gap-1.5 text-xs text-gray-500 hover:text-[#EF4A23] font-semibold"
                    >
                        <ArrowLeft className="w-3.5 h-3.5" />
                        <span>Back to All Orders</span>
                    </Link>

                    <div className="flex items-center gap-2">
                        <button
                            type="button"
                            onClick={handlePrintInvoice}
                            className="text-xs bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 font-bold px-3 py-2 rounded-xl flex items-center gap-1.5 transition shadow-sm"
                        >
                            <Printer className="w-3.5 h-3.5" />
                            <span>Print Invoice</span>
                        </button>

                        <button
                            type="button"
                            onClick={handlePrintLabel}
                            className="text-xs bg-[#081621] hover:bg-[#122738] text-white font-bold px-3 py-2 rounded-xl flex items-center gap-1.5 transition shadow-sm"
                        >
                            <PackageCheck className="w-3.5 h-3.5 text-[#EF4A23]" />
                            <span>Print Courier Waybill</span>
                        </button>
                    </div>
                </div>

                {/* 1. FRAUD CHECK & RISK ANALYSIS CARD */}
                <div className="bg-white rounded-2xl border border-gray-200/90 shadow-sm overflow-hidden">
                    <div className="p-4 sm:p-5 border-b border-gray-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-gradient-to-r from-gray-50 to-white">
                        <div className="flex items-center gap-3">
                            <div className={`p-2.5 rounded-xl border ${currentFraudInfo.bg}`}>
                                <FraudBadgeIcon className="w-5 h-5" />
                            </div>
                            <div>
                                <div className="flex items-center gap-2">
                                    <h2 className="text-sm font-black text-gray-900 uppercase tracking-wide">
                                        Automated Fraud Detection & Customer Risk Assessment
                                    </h2>
                                    <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-black border uppercase tracking-wider ${currentFraudInfo.bg}`}>
                                        {currentFraudInfo.label}
                                    </span>
                                </div>
                                <p className="text-xs text-gray-500 mt-0.5">
                                    Analyzed by BD Mobile format validator, past order velocity, cancellation rate & COD risk thresholds
                                </p>
                            </div>
                        </div>

                        {/* Fraud Score Indicator */}
                        <div className="flex items-center gap-3 bg-gray-50 px-4 py-2 rounded-xl border border-gray-200">
                            <div className="text-right">
                                <span className="block text-[10px] uppercase font-bold text-gray-400">Risk Score</span>
                                <span className={`text-base font-black ${
                                    score >= 60 ? 'text-red-600' : score >= 35 ? 'text-amber-600' : 'text-emerald-600'
                                }`}>
                                    {score} / 100
                                </span>
                            </div>
                            <div className="w-16 bg-gray-200 rounded-full h-2.5 overflow-hidden">
                                <div 
                                    className={`h-2.5 rounded-full ${
                                        score >= 60 ? 'bg-red-500' : score >= 35 ? 'bg-amber-500' : 'bg-emerald-500'
                                    }`}
                                    style={{ width: `${Math.min(100, Math.max(5, score))}%` }}
                                />
                            </div>
                        </div>
                    </div>

                    <div className="p-5 space-y-4">
                        {/* Recommendation Alert */}
                        <div className={`p-3.5 rounded-xl border text-xs flex items-start gap-2.5 ${
                            score >= 60 ? 'bg-red-50 border-red-200 text-red-800' :
                            score >= 35 ? 'bg-amber-50 border-amber-200 text-amber-800' :
                            'bg-emerald-50 border-emerald-200 text-emerald-800'
                        }`}>
                            <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
                            <div>
                                <p className="font-bold">Recommendation:</p>
                                <p>{fraudAnalysis?.recommendation || 'Review customer information carefully.'}</p>
                            </div>
                        </div>

                        {/* Customer History & Flags Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                            {/* Verification Metrics */}
                            <div className="bg-gray-50 p-4 rounded-xl border border-gray-200/80 space-y-2">
                                <h3 className="font-bold text-gray-800 uppercase tracking-wide text-[11px] mb-2">
                                    Customer Trust Profile
                                </h3>
                                <div className="flex justify-between py-1 border-b border-gray-200">
                                    <span className="text-gray-500">BD Phone Verification:</span>
                                    <span className={`font-bold ${fraudAnalysis?.is_valid_phone ? 'text-emerald-600' : 'text-red-600'}`}>
                                        {fraudAnalysis?.is_valid_phone ? '✓ Valid Bangladeshi Mobile' : '✗ Invalid Mobile Format'}
                                    </span>
                                </div>
                                <div className="flex justify-between py-1 border-b border-gray-200">
                                    <span className="text-gray-500">Total Past Orders (Same Phone/Email):</span>
                                    <span className="font-bold text-gray-800">
                                        {fraudAnalysis?.customer_history?.total_orders ?? 0} orders
                                    </span>
                                </div>
                                <div className="flex justify-between py-1 border-b border-gray-200">
                                    <span className="text-gray-500">Delivered Orders:</span>
                                    <span className="font-bold text-emerald-600">
                                        {fraudAnalysis?.customer_history?.delivered_orders ?? 0}
                                    </span>
                                </div>
                                <div className="flex justify-between py-1 border-b border-gray-200">
                                    <span className="text-gray-500">Past Cancellation Rate:</span>
                                    <span className={`font-bold ${
                                        (fraudAnalysis?.customer_history?.cancellation_rate || 0) > 40 ? 'text-red-600' : 'text-gray-800'
                                    }`}>
                                        {fraudAnalysis?.customer_history?.cancellation_rate ?? 0}% ({fraudAnalysis?.customer_history?.cancelled_orders ?? 0} cancelled)
                                    </span>
                                </div>
                                <div className="flex justify-between py-1">
                                    <span className="text-gray-500">Payment Risk Level:</span>
                                    <span className="font-bold uppercase text-gray-800">
                                        {order.payment_method === 'cod' ? `COD (৳${Number(order.total).toLocaleString()})` : 'Online Prepaid'}
                                    </span>
                                </div>
                            </div>

                            {/* Detected Flags Checklist */}
                            <div className="bg-gray-50 p-4 rounded-xl border border-gray-200/80 space-y-2">
                                <h3 className="font-bold text-gray-800 uppercase tracking-wide text-[11px] mb-2">
                                    Risk Factors & Flags ({fraudAnalysis?.flags?.length || 0})
                                </h3>
                                {fraudAnalysis?.flags && fraudAnalysis.flags.length > 0 ? (
                                    <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
                                        {fraudAnalysis.flags.map((flag, idx) => (
                                            <div key={idx} className="flex items-start gap-2 text-rose-700 bg-rose-50/80 border border-rose-200/60 p-2 rounded-lg">
                                                <AlertTriangle className="w-3.5 h-3.5 shrink-0 mt-0.5 text-rose-500" />
                                                <span className="text-[11px] leading-snug">{flag}</span>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="flex items-center gap-2 text-emerald-700 bg-emerald-50 border border-emerald-200 p-3 rounded-lg">
                                        <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
                                        <span className="text-[11px] font-medium">No suspicious fraud signals detected. Clean customer profile.</span>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Manual Status Override Buttons */}
                        <div className="pt-2 border-t border-gray-100 flex flex-wrap items-center justify-between gap-3">
                            <span className="text-xs font-semibold text-gray-600">
                                Manual Fraud Status Override:
                            </span>
                            <div className="flex items-center gap-2">
                                <button
                                    type="button"
                                    disabled={fraudProcessing || order.fraud_status === 'safe'}
                                    onClick={() => handleUpdateFraud('safe')}
                                    className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition flex items-center gap-1.5 ${
                                        order.fraud_status === 'safe'
                                            ? 'bg-emerald-600 text-white border-emerald-600'
                                            : 'bg-white hover:bg-emerald-50 text-emerald-700 border-emerald-300'
                                    }`}
                                >
                                    <ShieldCheck className="w-3.5 h-3.5" />
                                    <span>Verify as Safe</span>
                                </button>

                                <button
                                    type="button"
                                    disabled={fraudProcessing || order.fraud_status === 'review'}
                                    onClick={() => handleUpdateFraud('review')}
                                    className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition flex items-center gap-1.5 ${
                                        order.fraud_status === 'review'
                                            ? 'bg-amber-500 text-white border-amber-500'
                                            : 'bg-white hover:bg-amber-50 text-amber-700 border-amber-300'
                                    }`}
                                >
                                    <ShieldAlert className="w-3.5 h-3.5" />
                                    <span>Mark for Review</span>
                                </button>

                                <button
                                    type="button"
                                    disabled={fraudProcessing || order.fraud_status === 'high_risk'}
                                    onClick={() => handleUpdateFraud('high_risk')}
                                    className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition flex items-center gap-1.5 ${
                                        order.fraud_status === 'high_risk'
                                            ? 'bg-red-600 text-white border-red-600'
                                            : 'bg-white hover:bg-red-50 text-red-700 border-red-300'
                                    }`}
                                >
                                    <ShieldX className="w-3.5 h-3.5" />
                                    <span>Flag High Risk</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* 2. COURIER DISPATCH & FULFILLMENT CARD */}
                <div className="bg-white rounded-2xl border border-gray-200/90 shadow-sm overflow-hidden">
                    <div className="p-4 sm:p-5 border-b border-gray-100 flex items-center justify-between bg-gradient-to-r from-gray-50 to-white">
                        <div className="flex items-center gap-3">
                            <div className="p-2.5 rounded-xl bg-orange-50 border border-orange-200 text-[#EF4A23]">
                                <Truck className="w-5 h-5" />
                            </div>
                            <div>
                                <h2 className="text-sm font-black text-gray-900 uppercase tracking-wide">
                                    Courier Booking & Parcel Dispatch
                                </h2>
                                <p className="text-xs text-gray-500">
                                    Dispatch parcels to Bangladeshi couriers (Steadfast, Pathao, RedX, Paperfly, Sundarban)
                                </p>
                            </div>
                        </div>

                        {order.courier_name && (
                            <span className="px-3 py-1 rounded-full text-xs font-black bg-blue-50 text-blue-700 border border-blue-200 uppercase tracking-wider flex items-center gap-1.5">
                                <PackageCheck className="w-3.5 h-3.5 text-blue-600" />
                                {order.courier_status || 'Dispatched'}
                            </span>
                        )}
                    </div>

                    <div className="p-5">
                        {order.courier_name ? (
                            /* Already Dispatched Details */
                            <div className="bg-gray-50 rounded-xl p-4 border border-gray-200 space-y-4">
                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                                    <div>
                                        <span className="text-gray-400 font-semibold block text-[10px] uppercase">Courier Provider</span>
                                        <span className="text-sm font-black text-gray-900 capitalize">
                                            {order.courier_name}
                                        </span>
                                    </div>
                                    <div>
                                        <span className="text-gray-400 font-semibold block text-[10px] uppercase">Consignment / Tracking ID</span>
                                        <div className="flex items-center gap-2 mt-0.5">
                                            <span className="text-xs font-mono font-bold bg-white px-2 py-1 rounded border border-gray-300 text-[#EF4A23]">
                                                {order.courier_tracking_id}
                                            </span>
                                            <button
                                                type="button"
                                                onClick={() => copyToClipboard(order.courier_tracking_id)}
                                                className="p-1 text-gray-500 hover:text-gray-700 transition"
                                                title="Copy Tracking ID"
                                            >
                                                {copiedTracking ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                                            </button>
                                        </div>
                                    </div>
                                    <div>
                                        <span className="text-gray-400 font-semibold block text-[10px] uppercase">COD Collection Amount</span>
                                        <span className="text-sm font-black text-emerald-700">
                                            ৳{Number(order.courier_collected_amount || 0).toLocaleString()}
                                        </span>
                                    </div>
                                </div>

                                <div className="pt-3 border-t border-gray-200 flex flex-wrap items-center justify-between gap-3 text-xs">
                                    <span className="text-gray-500">
                                        Dispatched on:{' '}
                                        <strong className="text-gray-700">
                                            {order.dispatched_at ? new Date(order.dispatched_at).toLocaleString() : 'Recently'}
                                        </strong>
                                    </span>

                                    <div className="flex items-center gap-2">
                                        <button
                                            type="button"
                                            onClick={handlePrintLabel}
                                            className="px-3 py-1.5 rounded-lg bg-[#EF4A23] hover:bg-[#d63c17] text-white font-bold text-xs flex items-center gap-1.5 transition shadow-sm"
                                        >
                                            <Printer className="w-3.5 h-3.5" />
                                            <span>Print Shipping Waybill Label</span>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ) : null}

                        {/* Dispatch or Re-dispatch Form */}
                        <form onSubmit={handleDispatchCourier} className="mt-4 space-y-4">
                            <h3 className="text-xs font-bold text-gray-800 uppercase tracking-wide">
                                {order.courier_name ? 'Re-assign or Update Courier Consignment' : 'Send Parcel to Courier Partner'}
                            </h3>

                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                                <div>
                                    <label className="block font-semibold text-gray-700 mb-1">
                                        Courier Partner <span className="text-red-500">*</span>
                                    </label>
                                    <select
                                        value={courierData.courier_name}
                                        onChange={(e) => setCourierData('courier_name', e.target.value)}
                                        className="w-full p-2.5 rounded-xl border border-gray-300 focus:border-[#EF4A23] font-medium"
                                    >
                                        {courierProviders.map((c) => (
                                            <option key={c.id} value={c.id}>
                                                {c.name}
                                            </option>
                                        ))}
                                    </select>
                                    <p className="text-[10px] text-gray-400 mt-1">
                                        {courierProviders.find(c => c.id === courierData.courier_name)?.desc}
                                    </p>
                                </div>

                                <div>
                                    <label className="block font-semibold text-gray-700 mb-1">
                                        Tracking / Consignment ID
                                    </label>
                                    <input
                                        type="text"
                                        placeholder="Leave blank for auto-generation"
                                        value={courierData.courier_tracking_id}
                                        onChange={(e) => setCourierData('courier_tracking_id', e.target.value)}
                                        className="w-full p-2.5 rounded-xl border border-gray-300 focus:border-[#EF4A23] font-mono text-xs"
                                    />
                                    <p className="text-[10px] text-gray-400 mt-1">
                                        Auto-generates format: ST-[COURIER]-[CODE] if empty
                                    </p>
                                </div>

                                <div>
                                    <label className="block font-semibold text-gray-700 mb-1">
                                        COD Amount to Collect (৳) <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="number"
                                        min="0"
                                        step="1"
                                        value={courierData.courier_collected_amount}
                                        onChange={(e) => setCourierData('courier_collected_amount', e.target.value)}
                                        className="w-full p-2.5 rounded-xl border border-gray-300 focus:border-[#EF4A23] font-bold"
                                    />
                                    <p className="text-[10px] text-gray-400 mt-1">
                                        {order.payment_method === 'cod' ? 'Matches Cash on Delivery total' : 'Prepaid order (Typically ৳0)'}
                                    </p>
                                </div>
                            </div>

                            <div className="flex justify-end pt-2">
                                <button
                                    type="submit"
                                    disabled={courierProcessing}
                                    className="bg-[#081621] hover:bg-[#122738] text-white text-xs font-bold px-5 py-2.5 rounded-xl flex items-center gap-2 transition shadow-sm"
                                >
                                    <Send className="w-3.5 h-3.5 text-[#EF4A23]" />
                                    <span>
                                        {courierProcessing ? 'Dispatching...' : order.courier_name ? 'Update Courier Consignment' : 'Confirm & Dispatch to Courier'}
                                    </span>
                                </button>
                            </div>
                        </form>
                    </div>
                </div>

                {/* 3. ORDER & CUSTOMER INFORMATION */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Customer */}
                    <div className="bg-white p-5 rounded-2xl border border-gray-200/80 shadow-sm text-xs space-y-2">
                        <div className="flex items-center gap-2 font-bold text-gray-900 border-b pb-2">
                            <User className="w-4 h-4 text-blue-600" />
                            <span>Customer Info</span>
                        </div>
                        <p className="font-bold text-gray-900 text-sm">{order.customer_name}</p>
                        <p className="font-semibold text-gray-800">{order.customer_phone}</p>
                        <p className="text-gray-500">{order.customer_email || 'No email provided'}</p>
                    </div>

                    {/* Shipping Address */}
                    <div className="bg-white p-5 rounded-2xl border border-gray-200/80 shadow-sm text-xs space-y-2">
                        <div className="flex items-center gap-2 font-bold text-gray-900 border-b pb-2">
                            <Truck className="w-4 h-4 text-emerald-600" />
                            <span>Shipping Address</span>
                        </div>
                        <p className="text-gray-700 leading-relaxed">{order.customer_address}</p>
                        <p className="font-bold text-gray-900">{order.city} {order.zone && `(${order.zone})`}</p>
                        {order.notes && <p className="text-gray-500 italic mt-1 bg-yellow-50 p-1.5 rounded">Note: {order.notes}</p>}
                    </div>

                    {/* Payment Info */}
                    <div className="bg-white p-5 rounded-2xl border border-gray-200/80 shadow-sm text-xs space-y-2">
                        <div className="flex items-center gap-2 font-bold text-gray-900 border-b pb-2">
                            <CreditCard className="w-4 h-4 text-orange-600" />
                            <span>Payment & Total</span>
                        </div>
                        <p className="uppercase font-bold text-gray-800">
                            Method: <span className="text-[#EF4A23]">{order.payment_method}</span>
                        </p>
                        <p className="text-gray-600">
                            Payment Status: <span className="font-bold uppercase text-gray-800">{order.payment_status}</span>
                        </p>
                        <p className="text-base font-black text-gray-900 mt-2">
                            Total: ৳{Number(order.total).toLocaleString()}
                        </p>
                    </div>
                </div>

                {/* 4. ORDERED ITEMS TABLE */}
                <div className="bg-white rounded-2xl border border-gray-200/80 shadow-sm overflow-hidden">
                    <div className="p-4 border-b flex items-center justify-between">
                        <h3 className="text-xs font-bold text-gray-900 uppercase">Ordered Products ({order.items?.length || 0})</h3>
                        <span className="text-xs font-semibold text-gray-500">Order #{order.order_number}</span>
                    </div>
                    <table className="w-full text-left text-xs">
                        <thead className="bg-gray-50 border-b text-gray-500 uppercase font-semibold">
                            <tr>
                                <th className="p-3.5">Product Name</th>
                                <th className="p-3.5 text-center">Unit Price</th>
                                <th className="p-3.5 text-center">Quantity</th>
                                <th className="p-3.5 text-right">Total</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {order.items?.map((item) => (
                                <tr key={item.id}>
                                    <td className="p-3.5 font-bold text-gray-900">{item.product_name}</td>
                                    <td className="p-3.5 text-center">৳{Number(item.unit_price).toLocaleString()}</td>
                                    <td className="p-3.5 text-center font-bold">{item.quantity}</td>
                                    <td className="p-3.5 text-right font-black text-gray-900">
                                        ৳{Number(item.total_price).toLocaleString()}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                        <tfoot className="bg-gray-50/50 border-t font-bold">
                            <tr>
                                <td colSpan="3" className="p-3 text-right text-gray-600">Subtotal:</td>
                                <td className="p-3 text-right">৳{Number(order.subtotal || order.total).toLocaleString()}</td>
                            </tr>
                            {Number(order.shipping_cost) > 0 && (
                                <tr>
                                    <td colSpan="3" className="p-3 text-right text-gray-600">Shipping:</td>
                                    <td className="p-3 text-right">৳{Number(order.shipping_cost).toLocaleString()}</td>
                                </tr>
                            )}
                            <tr className="border-t">
                                <td colSpan="3" className="p-3.5 text-right text-gray-900 text-sm">Grand Total:</td>
                                <td className="p-3.5 text-right text-[#EF4A23] text-sm font-black">
                                    ৳{Number(order.total).toLocaleString()}
                                </td>
                            </tr>
                        </tfoot>
                    </table>
                </div>

                {/* 5. ORDER STATUS FORM */}
                <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
                    <h3 className="text-sm font-bold text-gray-900 border-b pb-3 mb-4">Overall Order Status</h3>
                    <form onSubmit={handleUpdateStatus} className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-end text-xs">
                        <div>
                            <label className="block font-semibold text-gray-700 mb-1">Order Status</label>
                            <select
                                value={statusData.order_status}
                                onChange={(e) => setStatusData('order_status', e.target.value)}
                                className="w-full p-2.5 rounded-lg border border-gray-300 focus:border-[#EF4A23]"
                            >
                                <option value="pending">Pending</option>
                                <option value="processing">Processing</option>
                                <option value="confirmed">Confirmed</option>
                                <option value="shipped">Shipped</option>
                                <option value="delivered">Delivered</option>
                                <option value="cancelled">Cancelled</option>
                            </select>
                        </div>

                        <div>
                            <label className="block font-semibold text-gray-700 mb-1">Payment Status</label>
                            <select
                                value={statusData.payment_status}
                                onChange={(e) => setStatusData('payment_status', e.target.value)}
                                className="w-full p-2.5 rounded-lg border border-gray-300 focus:border-[#EF4A23]"
                            >
                                <option value="pending">Pending</option>
                                <option value="paid">Paid</option>
                                <option value="failed">Failed</option>
                            </select>
                        </div>

                        <div>
                            <button
                                type="submit"
                                disabled={statusProcessing}
                                className="w-full bg-[#EF4A23] hover:bg-[#d63c17] text-white font-bold py-2.5 rounded-lg transition"
                            >
                                {statusProcessing ? 'Saving...' : 'Update Status'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>

            {/* PRINTABLE SECTION: INVOICE OR COURIER WAYBILL */}
            <div className="hidden print:block text-black bg-white">
                {printMode === 'courier_label' ? (
                    /* COURIER SHIPPING LABEL / WAYBILL */
                    <div className="max-w-[100mm] mx-auto border-2 border-dashed border-black p-4 font-sans text-xs">
                        {/* Courier & Sender Header */}
                        <div className="border-b-2 border-black pb-2 flex items-center justify-between">
                            <div>
                                <h1 className="text-base font-black tracking-tighter uppercase">{siteName}</h1>
                                <p className="text-[9px] text-gray-600">Hub: {address} | Hotline: {hotline}</p>
                            </div>
                            <div className="text-right">
                                <span className="text-[10px] uppercase font-black px-1.5 py-0.5 border border-black rounded">
                                    {order.courier_name || 'COURIER'}
                                </span>
                            </div>
                        </div>

                        {/* Tracking Barcode Mock */}
                        <div className="py-2.5 text-center border-b-2 border-black">
                            <div className="inline-block tracking-widest font-mono text-xs font-black">
                                ||||||| | ||||| |||| | |||||| |||| | |||||||
                            </div>
                            <p className="font-mono text-sm font-black mt-1">
                                {order.courier_tracking_id || `ST-${order.order_number}`}
                            </p>
                        </div>

                        {/* Recipient Details */}
                        <div className="py-2 border-b-2 border-black space-y-1">
                            <span className="text-[9px] uppercase font-bold text-gray-600 block">DELIVER TO (RECIPIENT):</span>
                            <p className="text-sm font-black">{order.customer_name}</p>
                            <p className="font-black text-sm">{order.customer_phone}</p>
                            <p className="text-xs leading-snug">{order.customer_address}</p>
                            <p className="font-bold text-xs">{order.city} {order.zone && `(${order.zone})`}</p>
                        </div>

                        {/* COD & Order Information */}
                        <div className="py-2 border-b-2 border-black grid grid-cols-2 gap-2">
                            <div>
                                <span className="text-[9px] uppercase font-bold text-gray-600 block">ORDER NUMBER:</span>
                                <span className="font-bold text-xs">{order.order_number}</span>
                            </div>
                            <div className="text-right">
                                <span className="text-[9px] uppercase font-bold text-gray-600 block">CASH TO COLLECT (COD):</span>
                                <span className="text-sm font-black text-black">
                                    ৳{Number(order.courier_collected_amount !== null ? order.courier_collected_amount : order.total).toLocaleString()}
                                </span>
                            </div>
                        </div>

                        {/* Items summary */}
                        <div className="pt-2 text-[10px]">
                            <span className="font-bold block mb-1">Package Contents ({order.items?.length || 0} items):</span>
                            <ul className="list-disc list-inside space-y-0.5">
                                {order.items?.map((item) => (
                                    <li key={item.id} className="truncate">
                                        {item.quantity}x {item.product_name}
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div className="mt-3 pt-2 border-t border-gray-400 text-center text-[8px] text-gray-500">
                            Printed from {siteName} Admin Portal. Handle with care.
                        </div>
                    </div>
                ) : (
                    /* STANDARD INVOICE */
                    <div className="max-w-2xl mx-auto p-6 font-sans text-xs">
                        <div className="flex justify-between items-center border-b pb-4 mb-4">
                            <div>
                                <h1 className="text-lg font-black uppercase" style={{ color: primaryColor }}>{siteName}</h1>
                                <p className="text-[10px] text-gray-500">{tagline}</p>
                            </div>
                            <div className="text-right">
                                <h2 className="text-sm font-black">INVOICE</h2>
                                <p className="font-mono text-xs">#{order.order_number}</p>
                                <p className="text-[10px] text-gray-500">{new Date(order.created_at).toLocaleDateString()}</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4 mb-4">
                            <div>
                                <h3 className="font-bold text-gray-700 text-[10px] uppercase">Billed / Shipped To:</h3>
                                <p className="font-bold text-gray-900">{order.customer_name}</p>
                                <p>{order.customer_phone}</p>
                                <p>{order.customer_address}</p>
                                <p>{order.city} {order.zone && `(${order.zone})`}</p>
                            </div>
                            <div className="text-right">
                                <h3 className="font-bold text-gray-700 text-[10px] uppercase">Payment & Delivery:</h3>
                                <p>Method: <strong className="uppercase">{order.payment_method}</strong></p>
                                <p>Payment Status: <strong className="uppercase">{order.payment_status}</strong></p>
                                {order.courier_name && (
                                    <p>Courier: <strong>{order.courier_name} ({order.courier_tracking_id})</strong></p>
                                )}
                            </div>
                        </div>

                        <table className="w-full text-left text-xs mb-4 border">
                            <thead className="bg-gray-100 border-b">
                                <tr>
                                    <th className="p-2">Item Description</th>
                                    <th className="p-2 text-center">Qty</th>
                                    <th className="p-2 text-right">Unit Price</th>
                                    <th className="p-2 text-right">Total</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y">
                                {order.items?.map((item) => (
                                    <tr key={item.id}>
                                        <td className="p-2 font-medium">{item.product_name}</td>
                                        <td className="p-2 text-center">{item.quantity}</td>
                                        <td className="p-2 text-right">৳{Number(item.unit_price).toLocaleString()}</td>
                                        <td className="p-2 text-right font-bold">৳{Number(item.total_price).toLocaleString()}</td>
                                    </tr>
                                ))}
                            </tbody>
                            <tfoot className="border-t font-bold">
                                <tr>
                                    <td colSpan="3" className="p-2 text-right">Total:</td>
                                    <td className="p-2 text-right font-black">৳{Number(order.total).toLocaleString()}</td>
                                </tr>
                            </tfoot>
                        </table>

                        <p className="text-center text-[9px] text-gray-500 mt-6">
                            Thank you for shopping with {siteName}! Hotline: {hotline}
                        </p>
                    </div>
                )}
            </div>
        </AdminLayout>
    );
}
