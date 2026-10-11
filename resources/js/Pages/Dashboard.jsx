import React, { useState } from 'react';
import { Head, Link, usePage, useForm, router } from '@inertiajs/react';
import FrontendLayout from '@/Layouts/FrontendLayout';
import { 
    Package, User, ShoppingBag, Clock, CheckCircle2, ArrowRight, Printer, 
    Cpu, Heart, MessageSquare, Send, Trash2, ExternalLink, Calendar, 
    CreditCard, Truck, ShieldCheck, HelpCircle, AlertCircle, ShoppingCart, 
    ChevronDown, ChevronUp, Copy, Check, LogOut
} from 'lucide-react';

export default function Dashboard({ 
    orders = [], 
    pcBuilds = [], 
    wishlists = [], 
    messages = [], 
    preOrders = [], 
    userStats = {},
    activeDeliveryOrder = null,
    activeTab: initialTab = 'orders' 
}) {
    const { auth, settings } = usePage().props;
    const [currentTab, setCurrentTab] = useState(initialTab);
    const [selectedOrderForPrint, setSelectedOrderForPrint] = useState(null);
    const [expandedOrder, setExpandedOrder] = useState(null);
    const [copiedTracking, setCopiedTracking] = useState(false);

    // Message to admin form
    const { 
        data: messageData, 
        setData: setMessageData, 
        post: postMessage, 
        processing: messageProcessing, 
        reset: resetMessage 
    } = useForm({
        subject: '',
        order_number: '',
        message: '',
    });

    const handleSendMessage = (e) => {
        e.preventDefault();
        postMessage(route('customer.message.store'), {
            preserveScroll: true,
            onSuccess: () => resetMessage(),
        });
    };

    const handleLoadPcBuild = (build) => {
        if (build.components) {
            localStorage.setItem('startech_pc_build', JSON.stringify(build.components));
            router.visit(route('pcbuilder.index'));
        }
    };

    const handleDeletePcBuild = (buildId) => {
        if (confirm('Are you sure you want to delete this saved PC build?')) {
            router.delete(route('customer.pcbuild.delete', buildId), { preserveScroll: true });
        }
    };

    const handleRemoveWishlist = (productId) => {
        router.post(route('customer.wishlist.toggle'), { product_id: productId }, { preserveScroll: true });
    };

    const handleAddToCartFromWishlist = (productId) => {
        router.post(route('cart.add'), { product_id: productId, quantity: 1 }, { preserveScroll: true });
    };

    const copyToClipboard = (text) => {
        navigator.clipboard.writeText(text);
        setCopiedTracking(true);
        setTimeout(() => setCopiedTracking(false), 2000);
    };

    const handlePrintOrder = (order) => {
        setSelectedOrderForPrint(order);
        setTimeout(() => window.print(), 100);
    };

    const tabs = [
        { id: 'orders', name: 'Order History', icon: ShoppingBag, count: orders?.length || 0 },
        { id: 'pc_builds', name: 'Saved PC Builds', icon: Cpu, count: pcBuilds?.length || 0 },
        { id: 'wishlist', name: 'Favorites / Wishlist', icon: Heart, count: wishlists?.length || 0 },
        { id: 'pre_orders', name: 'Pre-Orders', icon: Clock, count: preOrders?.length || 0 },
        { 
            id: 'messages', 
            name: 'Message to Admin', 
            icon: MessageSquare, 
            count: messages?.length || 0,
            hasUnread: (userStats?.unreadRepliesCount || 0) > 0 
        },
        { id: 'profile', name: 'Account Profile', icon: User },
    ];

    return (
        <FrontendLayout title={`My Account - ${settings?.site_name || 'Tech Shoppers'}`}>
            {/* Screen Content (Hidden when printing invoice) */}
            <div className="print:hidden max-w-6xl mx-auto py-2 sm:py-4 space-y-6">
                {/* 1. Header Profile Banner */}
                <div className="bg-gradient-to-r from-[#081621] via-[#112538] to-[#081621] text-white rounded-3xl p-5 sm:p-7 shadow-xl border border-gray-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5 relative overflow-hidden">
                    <div className="flex items-center gap-4 relative z-10">
                        <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-[#EF4A23] text-white font-black text-2xl flex items-center justify-center shadow-lg border-2 border-orange-400/30">
                            {auth.user?.name?.charAt(0) || 'U'}
                        </div>
                        <div>
                            <div className="flex flex-wrap items-center gap-2">
                                <h1 className="text-xl sm:text-2xl font-black">{auth.user?.name}</h1>
                                {userStats?.membershipTier && (
                                    <span className={`text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full text-white bg-gradient-to-r ${userStats.tierBadgeColor || 'from-orange-500 to-red-600'} shadow-sm`}>
                                        {userStats.membershipTier}
                                    </span>
                                )}
                            </div>
                            <div className="flex flex-wrap items-center gap-3 text-xs text-gray-300 mt-1">
                                <span>{auth.user?.email}</span>
                                {auth.user?.phone && <span className="text-gray-400 font-mono">| {auth.user.phone}</span>}
                                {userStats?.rewardPoints !== undefined && (
                                    <span className="text-amber-400 font-bold bg-amber-400/10 px-2 py-0.5 rounded-md border border-amber-400/20">
                                        ⭐ {Number(userStats.rewardPoints).toLocaleString()} Star Points
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-2.5 w-full sm:w-auto relative z-10">
                        <Link
                            href="/pc-builder"
                            className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 text-xs bg-white/10 hover:bg-white/20 text-white font-bold py-2.5 px-3.5 rounded-xl border border-white/10 transition"
                        >
                            <Cpu className="w-3.5 h-3.5 text-[#EF4A23]" />
                            <span>PC Builder</span>
                        </Link>
                        {auth.user?.role === 'admin' && (
                            <Link
                                href={route('admin.dashboard')}
                                className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 bg-[#EF4A23] hover:bg-[#d63c17] text-white text-xs font-bold py-2.5 px-3.5 rounded-xl transition shadow-md"
                            >
                                <span>Admin Panel →</span>
                            </Link>
                        )}
                        <Link
                            href={route('logout')}
                            method="post"
                            as="button"
                            className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 text-xs bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 hover:text-white font-bold py-2.5 px-3.5 rounded-xl border border-rose-500/30 transition shadow-sm"
                            title={`Sign out of your ${settings?.site_name || 'Tech Shoppers'} account`}
                        >
                            <LogOut className="w-3.5 h-3.5" />
                            <span>Log Out</span>
                        </Link>
                    </div>

                    {/* Background decorative glow */}
                    <div className="absolute right-0 top-0 bottom-0 w-80 bg-gradient-to-l from-orange-600/10 to-transparent pointer-events-none"></div>
                </div>

                {/* 2. Customer Performance & Loyalty Stats Strip */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
                    <div className="bg-white p-4 rounded-2xl border border-gray-200/90 shadow-sm flex items-center gap-3.5">
                        <div className="w-10 h-10 rounded-xl bg-orange-50 text-[#EF4A23] flex items-center justify-center shrink-0">
                            <CreditCard className="w-5 h-5" />
                        </div>
                        <div>
                            <span className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider block">Total Spent</span>
                            <span className="text-base sm:text-lg font-black text-gray-900 block">
                                ৳{Number(userStats?.totalSpent || 0).toLocaleString()}
                            </span>
                        </div>
                    </div>

                    <div className="bg-white p-4 rounded-2xl border border-gray-200/90 shadow-sm flex items-center gap-3.5">
                        <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                            <ShoppingBag className="w-5 h-5" />
                        </div>
                        <div>
                            <span className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider block">Orders Placed</span>
                            <span className="text-base sm:text-lg font-black text-gray-900 block">
                                {userStats?.totalOrders || 0} Orders
                            </span>
                        </div>
                    </div>

                    <div className="bg-white p-4 rounded-2xl border border-gray-200/90 shadow-sm flex items-center gap-3.5">
                        <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
                            <Cpu className="w-5 h-5" />
                        </div>
                        <div>
                            <span className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider block">Saved PC Rigs</span>
                            <span className="text-base sm:text-lg font-black text-gray-900 block">
                                {pcBuilds?.length || 0} Builds
                            </span>
                        </div>
                    </div>

                    <div className="bg-white p-4 rounded-2xl border border-gray-200/90 shadow-sm flex items-center gap-3.5">
                        <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                            <Clock className="w-5 h-5" />
                        </div>
                        <div>
                            <span className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider block">Pre-Orders</span>
                            <span className="text-base sm:text-lg font-black text-gray-900 block">
                                {preOrders?.length || 0} Bookings
                            </span>
                        </div>
                    </div>
                </div>

                {/* 3. Live Shipment Tracking In-Flight Banner (if order active) */}
                {activeDeliveryOrder && (activeDeliveryOrder.courier_tracking_id || activeDeliveryOrder.courier_consignment_id) && (
                    <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-[#081621] text-white p-4 sm:p-5 rounded-2xl shadow-lg border border-blue-700/50 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                        <div className="flex items-center gap-3.5">
                            <div className="w-10 h-10 rounded-xl bg-blue-500/20 text-blue-300 border border-blue-400/30 flex items-center justify-center shrink-0 animate-pulse">
                                <Truck className="w-5 h-5" />
                            </div>
                            <div>
                                <div className="flex items-center gap-2">
                                    <span className="text-xs uppercase font-bold tracking-wider text-blue-300">Live Parcel Tracking</span>
                                    <span className="text-[10px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-bold px-2 py-0.5 rounded-full">
                                        Dispatched via {activeDeliveryOrder.courier_name || 'Courier'}
                                    </span>
                                </div>
                                <h4 className="text-sm font-bold text-white mt-0.5">
                                    Order #{activeDeliveryOrder.order_number} &bull; Tracking ID: <span className="font-mono text-amber-300">{activeDeliveryOrder.courier_tracking_id || activeDeliveryOrder.courier_consignment_id}</span>
                                </h4>
                            </div>
                        </div>

                        <div className="flex items-center gap-2 w-full sm:w-auto">
                            <button
                                onClick={() => copyToClipboard(activeDeliveryOrder.courier_tracking_id || activeDeliveryOrder.courier_consignment_id)}
                                className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-xs font-semibold flex items-center gap-1.5 transition text-white border border-white/10"
                            >
                                {copiedTracking ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                                <span>{copiedTracking ? 'Copied' : 'Copy Tracking'}</span>
                            </button>
                            {activeDeliveryOrder.courier_tracking_url && (
                                <a
                                    href={activeDeliveryOrder.courier_tracking_url}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="px-3.5 py-1.5 rounded-lg bg-[#EF4A23] hover:bg-[#d63c17] text-xs font-bold flex items-center gap-1.5 transition text-white shadow-md"
                                >
                                    <span>Track Live</span>
                                    <ExternalLink className="w-3.5 h-3.5" />
                                </a>
                            )}
                        </div>
                    </div>
                )}

                {/* 4. Horizontal Navigation Tabs */}
                <div className="bg-white rounded-2xl border border-gray-200 p-1.5 shadow-sm overflow-x-auto whitespace-nowrap flex items-center gap-1">
                    {tabs.map((tab) => {
                        const Icon = tab.icon;
                        const isActive = currentTab === tab.id;
                        return (
                            <button
                                key={tab.id}
                                type="button"
                                onClick={() => setCurrentTab(tab.id)}
                                className={`flex items-center gap-2 px-3.5 py-2.5 rounded-xl text-xs font-bold transition shrink-0 relative ${
                                    isActive
                                        ? 'bg-[#081621] text-white shadow-sm'
                                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                                }`}
                            >
                                <Icon className={`w-4 h-4 ${isActive ? 'text-[#EF4A23]' : 'text-gray-400'}`} />
                                <span>{tab.name}</span>
                                {tab.count !== undefined && (
                                    <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-black ${
                                        isActive ? 'bg-[#EF4A23] text-white' : 'bg-gray-200 text-gray-700'
                                    }`}>
                                        {tab.count}
                                    </span>
                                )}
                                {tab.hasUnread && (
                                    <span className="w-2 h-2 rounded-full bg-red-500 absolute top-2 right-2 animate-ping"></span>
                                )}
                            </button>
                        );
                    })}
                </div>

                {/* 3. TAB CONTENT */}

                {/* TAB A: ORDER HISTORY & INVOICE */}
                {currentTab === 'orders' && (
                    <div className="bg-white rounded-3xl border border-gray-200 shadow-sm p-5 sm:p-6 space-y-4">
                        <div className="flex items-center justify-between border-b pb-3">
                            <h2 className="text-sm sm:text-base font-bold text-gray-900 flex items-center gap-2">
                                <ShoppingBag className="w-5 h-5 text-[#EF4A23]" />
                                <span>Purchase & Order History ({orders?.length || 0})</span>
                            </h2>
                            <span className="text-xs text-gray-500">Track shipments & print invoices</span>
                        </div>

                        {orders?.length > 0 ? (
                            <div className="divide-y divide-gray-100 space-y-3 pt-1">
                                {orders.map((order) => {
                                    const isExpanded = expandedOrder === order.id;
                                    return (
                                        <div key={order.id} className="pt-3 pb-2 rounded-xl bg-gray-50/50 p-4 border border-gray-100 space-y-3">
                                            {/* Order Header Summary */}
                                            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
                                                <div>
                                                    <div className="flex flex-wrap items-center gap-2 mb-1">
                                                        <span className="font-mono font-bold text-gray-900 text-sm">
                                                            #{order.order_number}
                                                        </span>
                                                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                                                            order.order_status === 'delivered' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' :
                                                            order.order_status === 'shipped' ? 'bg-blue-50 text-blue-700 border border-blue-200' :
                                                            order.order_status === 'pending' ? 'bg-amber-50 text-amber-700 border border-amber-200' :
                                                            'bg-gray-100 text-gray-700'
                                                        }`}>
                                                            {order.order_status}
                                                        </span>
                                                        <span className="px-2 py-0.5 rounded-full text-[10px] uppercase font-semibold bg-gray-100 text-gray-600">
                                                            {order.payment_method} ({order.payment_status})
                                                        </span>
                                                    </div>
                                                    <p className="text-gray-500 text-[11px]">
                                                        Placed on {new Date(order.created_at).toLocaleDateString()} at {new Date(order.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} • {order.items?.length || 0} item(s)
                                                    </p>
                                                </div>

                                                <div className="flex items-center gap-3 self-end sm:self-center">
                                                    <div className="text-right">
                                                        <span className="text-[10px] text-gray-400 block uppercase font-medium">Total</span>
                                                        <span className="text-base font-black text-[#EF4A23]">
                                                            ৳{Number(order.total).toLocaleString()}
                                                        </span>
                                                    </div>

                                                    <button
                                                        type="button"
                                                        onClick={() => handlePrintOrder(order)}
                                                        className="px-3 py-1.5 bg-white border border-gray-300 hover:bg-gray-100 text-gray-800 rounded-lg text-xs font-bold flex items-center gap-1.5 transition shadow-sm"
                                                    >
                                                        <Printer className="w-3.5 h-3.5 text-[#EF4A23]" />
                                                        <span>Print Invoice</span>
                                                    </button>

                                                    <button
                                                        type="button"
                                                        onClick={() => setExpandedOrder(isExpanded ? null : order.id)}
                                                        className="p-1.5 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg transition"
                                                        title="Toggle Details"
                                                    >
                                                        {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                                                    </button>
                                                </div>
                                            </div>

                                            {/* Courier & Tracking banner if dispatched */}
                                            {order.courier_name && (
                                                <div className="bg-blue-50/80 border border-blue-200/80 rounded-xl p-3 flex flex-wrap items-center justify-between gap-2 text-xs">
                                                    <div className="flex items-center gap-2">
                                                        <Truck className="w-4 h-4 text-blue-600 shrink-0" />
                                                        <span className="text-blue-900 font-medium">
                                                            Courier: <strong className="capitalize">{order.courier_name}</strong>
                                                        </span>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <span className="text-gray-500 font-mono text-[11px]">Tracking ID:</span>
                                                        <span className="font-mono font-bold bg-white px-2 py-0.5 rounded border border-blue-300 text-blue-700">
                                                            {order.courier_tracking_id}
                                                        </span>
                                                        <button
                                                            type="button"
                                                            onClick={() => copyToClipboard(order.courier_tracking_id)}
                                                            className="text-gray-400 hover:text-gray-700"
                                                            title="Copy"
                                                        >
                                                            {copiedTracking ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                                                        </button>
                                                    </div>
                                                </div>
                                            )}

                                            {/* Expanded Ordered Items List */}
                                            {isExpanded && (
                                                <div className="pt-2 border-t border-gray-200">
                                                    <table className="w-full text-left text-xs">
                                                        <thead className="text-[10px] text-gray-400 uppercase font-semibold border-b">
                                                            <tr>
                                                                <th className="py-2">Item Description</th>
                                                                <th className="py-2 text-center">Qty</th>
                                                                <th className="py-2 text-right">Price</th>
                                                                <th className="py-2 text-right">Subtotal</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody className="divide-y divide-gray-100">
                                                            {order.items?.map((item) => (
                                                                <tr key={item.id}>
                                                                    <td className="py-2.5 font-medium text-gray-900">
                                                                        {item.product_name}
                                                                    </td>
                                                                    <td className="py-2.5 text-center font-bold">{item.quantity}</td>
                                                                    <td className="py-2.5 text-right">৳{Number(item.unit_price).toLocaleString()}</td>
                                                                    <td className="py-2.5 text-right font-bold text-gray-900">
                                                                        ৳{Number(item.total_price).toLocaleString()}
                                                                    </td>
                                                                </tr>
                                                            ))}
                                                        </tbody>
                                                    </table>
                                                    <div className="pt-2 text-right text-xs text-gray-600">
                                                        <span>Shipping to: <strong>{order.customer_address}, {order.city}</strong></span>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        ) : (
                            <div className="text-center py-12">
                                <Package className="w-12 h-12 text-gray-300 mx-auto mb-2" />
                                <p className="text-sm font-bold text-gray-700">No Orders Placed Yet</p>
                                <p className="text-xs text-gray-400 mt-1 mb-4">Discover genuine computer parts and laptops with official warranty.</p>
                                <Link
                                    href="/"
                                    className="inline-flex items-center gap-1.5 bg-[#EF4A23] hover:bg-[#d63c17] text-white text-xs font-bold py-2 px-4 rounded-xl transition"
                                >
                                    <span>Browse Shop</span>
                                    <ArrowRight className="w-3.5 h-3.5" />
                                </Link>
                            </div>
                        )}
                    </div>
                )}

                {/* TAB B: SAVED PC BUILDS (BUILD PC HISTORY) */}
                {currentTab === 'pc_builds' && (
                    <div className="bg-white rounded-3xl border border-gray-200 shadow-sm p-5 sm:p-6 space-y-4">
                        <div className="flex items-center justify-between border-b pb-3">
                            <h2 className="text-sm sm:text-base font-bold text-gray-900 flex items-center gap-2">
                                <Cpu className="w-5 h-5 text-[#EF4A23]" />
                                <span>Saved PC Builds History ({pcBuilds?.length || 0})</span>
                            </h2>
                            <Link
                                href="/pc-builder"
                                className="text-xs bg-[#081621] hover:bg-[#EF4A23] text-white font-bold px-3 py-1.5 rounded-lg transition"
                            >
                                + Build New PC
                            </Link>
                        </div>

                        {pcBuilds?.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
                                {pcBuilds.map((build) => {
                                    const componentsCount = build.components ? Object.keys(build.components).length : 0;
                                    return (
                                        <div key={build.id} className="bg-gray-50 border border-gray-200 rounded-2xl p-4.5 space-y-3">
                                            <div className="flex items-start justify-between gap-2">
                                                <div>
                                                    <h3 className="font-bold text-gray-900 text-sm leading-snug">{build.name}</h3>
                                                    <span className="text-[11px] text-gray-400">
                                                        Saved on {new Date(build.created_at).toLocaleDateString()}
                                                    </span>
                                                </div>
                                                <button
                                                    type="button"
                                                    onClick={() => handleDeletePcBuild(build.id)}
                                                    className="p-1 text-gray-400 hover:text-rose-600 transition"
                                                    title="Delete Build"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>

                                            <div className="flex items-center justify-between py-2 border-y border-gray-200/80 text-xs">
                                                <div>
                                                    <span className="text-[10px] text-gray-400 block uppercase">Components</span>
                                                    <span className="font-bold text-gray-800">{componentsCount} Items</span>
                                                </div>
                                                <div>
                                                    <span className="text-[10px] text-gray-400 block uppercase">Est. Wattage</span>
                                                    <span className="font-bold text-emerald-600">~{build.total_wattage || 350}W</span>
                                                </div>
                                                <div className="text-right">
                                                    <span className="text-[10px] text-gray-400 block uppercase">Total Cost</span>
                                                    <span className="font-black text-[#EF4A23] text-sm">
                                                        ৳{Number(build.total_price).toLocaleString()}
                                                    </span>
                                                </div>
                                            </div>

                                            <div className="flex items-center gap-2 pt-1">
                                                <button
                                                    type="button"
                                                    onClick={() => handleLoadPcBuild(build)}
                                                    className="flex-1 bg-[#081621] hover:bg-[#122738] text-white text-xs font-bold py-2 px-3 rounded-xl transition flex items-center justify-center gap-1.5"
                                                >
                                                    <Cpu className="w-3.5 h-3.5 text-[#EF4A23]" />
                                                    <span>Load in PC Builder</span>
                                                </button>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        ) : (
                            <div className="text-center py-12">
                                <Cpu className="w-12 h-12 text-gray-300 mx-auto mb-2" />
                                <p className="text-sm font-bold text-gray-700">No Custom PC Builds Saved</p>
                                <p className="text-xs text-gray-400 mt-1 mb-4">Use our Live PC Builder tool and click "Save to Account" to store your configurations!</p>
                                <Link
                                    href="/pc-builder"
                                    className="inline-flex items-center gap-1.5 bg-[#EF4A23] hover:bg-[#d63c17] text-white text-xs font-bold py-2 px-4 rounded-xl transition"
                                >
                                    <span>Open PC Builder</span>
                                    <ArrowRight className="w-3.5 h-3.5" />
                                </Link>
                            </div>
                        )}
                    </div>
                )}

                {/* TAB C: FAVORITES / WISHLIST */}
                {currentTab === 'wishlist' && (
                    <div className="bg-white rounded-3xl border border-gray-200 shadow-sm p-5 sm:p-6 space-y-4">
                        <div className="flex items-center justify-between border-b pb-3">
                            <h2 className="text-sm sm:text-base font-bold text-gray-900 flex items-center gap-2">
                                <Heart className="w-5 h-5 text-rose-500 fill-current" />
                                <span>Favorite Products ({wishlists?.length || 0})</span>
                            </h2>
                            <span className="text-xs text-gray-500">Bookmarked items for quick purchase</span>
                        </div>

                        {wishlists?.length > 0 ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 pt-1">
                                {wishlists.map((w) => {
                                    const p = w.product;
                                    if (!p) return null;
                                    const price = p.special_price || p.regular_price;

                                    return (
                                        <div key={w.id} className="bg-gray-50 border border-gray-200 rounded-2xl p-4 flex flex-col justify-between space-y-3 group">
                                            <div className="relative text-center">
                                                <button
                                                    type="button"
                                                    onClick={() => handleRemoveWishlist(p.id)}
                                                    className="absolute top-0 right-0 p-1.5 text-gray-400 hover:text-rose-600 transition"
                                                    title="Remove from Wishlist"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                                <Link href={route('product.show', p.slug)}>
                                                    <img
                                                        src={p.thumbnail || 'https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?w=300'}
                                                        alt={p.name}
                                                        className="w-28 h-28 object-contain mx-auto group-hover:scale-105 transition"
                                                    />
                                                </Link>
                                            </div>

                                            <div>
                                                <Link 
                                                    href={route('product.show', p.slug)} 
                                                    className="text-xs font-bold text-gray-900 hover:text-[#EF4A23] line-clamp-2 leading-snug"
                                                >
                                                    {p.name}
                                                </Link>
                                                <span className="text-sm font-black text-[#EF4A23] mt-1.5 block">
                                                    ৳{Number(price).toLocaleString()}
                                                </span>
                                            </div>

                                            <button
                                                type="button"
                                                onClick={() => handleAddToCartFromWishlist(p.id)}
                                                className="w-full bg-[#EF4A23] hover:bg-[#d63c17] text-white text-xs font-bold py-2 rounded-xl flex items-center justify-center gap-1.5 transition shadow-sm"
                                            >
                                                <ShoppingCart className="w-3.5 h-3.5" />
                                                <span>Add to Cart</span>
                                            </button>
                                        </div>
                                    );
                                })}
                            </div>
                        ) : (
                            <div className="text-center py-12">
                                <Heart className="w-12 h-12 text-gray-300 mx-auto mb-2" />
                                <p className="text-sm font-bold text-gray-700">Your Wishlist is Empty</p>
                                <p className="text-xs text-gray-400 mt-1 mb-4">Click the heart icon on any product to save it here for later.</p>
                                <Link
                                    href="/"
                                    className="inline-flex items-center gap-1.5 bg-[#EF4A23] text-white text-xs font-bold py-2 px-4 rounded-xl transition"
                                >
                                    <span>Explore Catalog</span>
                                </Link>
                            </div>
                        )}
                    </div>
                )}

                {/* TAB D: PRE-ORDERS */}
                {currentTab === 'pre_orders' && (
                    <div className="bg-white rounded-3xl border border-gray-200 shadow-sm p-5 sm:p-6 space-y-4">
                        <div className="flex items-center justify-between border-b pb-3">
                            <h2 className="text-sm sm:text-base font-bold text-gray-900 flex items-center gap-2">
                                <Clock className="w-5 h-5 text-amber-500" />
                                <span>Upcoming & Pre-Orders ({preOrders?.length || 0})</span>
                            </h2>
                            <span className="text-xs text-gray-500">Advance bookings for high-demand items</span>
                        </div>

                        {preOrders?.length > 0 ? (
                            <div className="divide-y divide-gray-100 space-y-3 pt-1">
                                {preOrders.map((po) => (
                                    <div key={po.id} className="bg-gray-50 rounded-2xl p-4 border border-gray-200 space-y-2 text-xs">
                                        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                                            <div>
                                                <span className="font-mono font-bold text-gray-900 text-sm">
                                                    #{po.pre_order_number}
                                                </span>
                                                <span className={`ml-2 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                                                    po.status === 'confirmed' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' :
                                                    po.status === 'ready_to_ship' ? 'bg-blue-50 text-blue-700 border border-blue-200' :
                                                    'bg-amber-50 text-amber-700 border border-amber-200'
                                                }`}>
                                                    {po.status}
                                                </span>
                                            </div>
                                            <span className="text-gray-400 text-[11px]">
                                                Booked on {new Date(po.created_at).toLocaleDateString()}
                                            </span>
                                        </div>

                                        <div className="flex items-center justify-between pt-1">
                                            <div className="flex items-center gap-3">
                                                {po.product && (
                                                    <img
                                                        src={po.product.thumbnail || 'https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?w=100'}
                                                        alt={po.product.name}
                                                        className="w-12 h-12 object-contain rounded-lg border bg-white p-1"
                                                    />
                                                )}
                                                <div>
                                                    <p className="font-bold text-gray-900">{po.product?.name || 'Pre-order product'}</p>
                                                    <p className="text-gray-500 text-[11px]">Qty: {po.quantity} item(s)</p>
                                                </div>
                                            </div>

                                            <div className="text-right">
                                                <span className="text-[10px] text-gray-400 block uppercase">Price</span>
                                                <span className="text-sm font-black text-[#EF4A23]">
                                                    ৳{Number(po.unit_price * po.quantity).toLocaleString()}
                                                </span>
                                            </div>
                                        </div>

                                        {po.expected_date && (
                                            <p className="text-[11px] text-blue-700 bg-blue-50 p-2 rounded-lg mt-1">
                                                Expected Stock Arrival: <strong>{po.expected_date}</strong>
                                            </p>
                                        )}
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-12">
                                <Clock className="w-12 h-12 text-gray-300 mx-auto mb-2" />
                                <p className="text-sm font-bold text-gray-700">No Pre-Orders Placed</p>
                                <p className="text-xs text-gray-400 mt-1">When high-demand items are upcoming or awaiting shipment, you can book them via Pre-Order.</p>
                            </div>
                        )}
                    </div>
                )}

                {/* TAB E: MESSAGE TO ADMIN */}
                {currentTab === 'messages' && (
                    <div className="bg-white rounded-3xl border border-gray-200 shadow-sm p-5 sm:p-6 space-y-6">
                        <div className="border-b pb-3">
                            <h2 className="text-sm sm:text-base font-bold text-gray-900 flex items-center gap-2">
                                <MessageSquare className="w-5 h-5 text-[#EF4A23]" />
                                <span>Support Tickets & Messages to Admin</span>
                            </h2>
                            <p className="text-xs text-gray-500 mt-0.5">
                                Send direct queries, warranty questions, or order inquiries directly to {settings?.site_name || 'Tech Shoppers'} Support
                            </p>
                        </div>

                        {/* Message Submission Form */}
                        <form onSubmit={handleSendMessage} className="bg-gray-50 p-4 sm:p-5 rounded-2xl border border-gray-200 space-y-3.5">
                            <h3 className="text-xs font-bold text-gray-900 uppercase tracking-wider">
                                Send New Message to Admin
                            </h3>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                                <div>
                                    <label className="block font-semibold text-gray-700 mb-1">Subject <span className="text-red-500">*</span></label>
                                    <input
                                        type="text"
                                        required
                                        value={messageData.subject}
                                        onChange={(e) => setMessageData('subject', e.target.value)}
                                        placeholder="e.g. Warranty Claim / Order Inquiry / Product Compatibility"
                                        className="w-full p-2.5 rounded-xl border border-gray-300 focus:border-[#EF4A23]"
                                    />
                                </div>
                                <div>
                                    <label className="block font-semibold text-gray-700 mb-1">Order # (Optional)</label>
                                    <input
                                        type="text"
                                        value={messageData.order_number}
                                        onChange={(e) => setMessageData('order_number', e.target.value)}
                                        placeholder="e.g. ST-261008-001"
                                        className="w-full p-2.5 rounded-xl border border-gray-300 focus:border-[#EF4A23] font-mono"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block font-semibold text-gray-700 text-xs mb-1">Your Message <span className="text-red-500">*</span></label>
                                <textarea
                                    required
                                    rows="3"
                                    value={messageData.message}
                                    onChange={(e) => setMessageData('message', e.target.value)}
                                    placeholder="Please describe your question or issue in detail..."
                                    className="w-full p-2.5 rounded-xl border border-gray-300 focus:border-[#EF4A23] text-xs"
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={messageProcessing}
                                className="bg-[#EF4A23] hover:bg-[#d63c17] text-white text-xs font-bold px-5 py-2.5 rounded-xl transition flex items-center gap-1.5 shadow-sm"
                            >
                                <Send className="w-3.5 h-3.5" />
                                <span>{messageProcessing ? 'Sending...' : 'Send Message'}</span>
                            </button>
                        </form>

                        {/* Previous Messages History */}
                        <div className="space-y-4">
                            <h3 className="text-xs font-bold text-gray-900 uppercase tracking-wider">
                                Previous Inquiries ({messages?.length || 0})
                            </h3>

                            {messages?.length > 0 ? (
                                <div className="space-y-3">
                                    {messages.map((m) => (
                                        <div key={m.id} className="bg-white border border-gray-200 rounded-2xl p-4 space-y-3 text-xs shadow-sm">
                                            <div className="flex items-center justify-between gap-2 border-b pb-2">
                                                <div>
                                                    <span className="font-bold text-gray-900 text-sm">{m.subject}</span>
                                                    {m.order_number && (
                                                        <span className="ml-2 font-mono text-[11px] bg-gray-100 text-gray-700 px-2 py-0.5 rounded">
                                                            Ref #{m.order_number}
                                                        </span>
                                                    )}
                                                </div>
                                                <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                                                    m.status === 'replied' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' :
                                                    'bg-amber-50 text-amber-700 border border-amber-200'
                                                }`}>
                                                    {m.status === 'replied' ? 'Replied by Admin' : 'Pending Reply'}
                                                </span>
                                            </div>

                                            <div className="text-gray-700 bg-gray-50/50 p-3 rounded-xl leading-relaxed">
                                                <p>{m.message}</p>
                                                <span className="text-[10px] text-gray-400 block mt-1.5">
                                                    Sent on {new Date(m.created_at).toLocaleString()}
                                                </span>
                                            </div>

                                            {/* Admin Reply if any */}
                                            {m.admin_reply && (
                                                <div className="bg-orange-50/80 border border-orange-200/80 rounded-xl p-3 text-orange-950 space-y-1">
                                                    <div className="flex items-center gap-1.5 font-bold text-xs text-[#EF4A23]">
                                                        <ShieldCheck className="w-4 h-4" />
                                                        <span>Official Admin Reply:</span>
                                                    </div>
                                                    <p className="text-xs leading-relaxed">{m.admin_reply}</p>
                                                    {m.replied_at && (
                                                        <span className="text-[10px] text-orange-800/60 block">
                                                            Replied at {new Date(m.replied_at).toLocaleString()}
                                                        </span>
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-xs text-gray-400 text-center py-6">No previous messages.</p>
                            )}
                        </div>
                    </div>
                )}

                {/* TAB F: PROFILE DETAILS */}
                {currentTab === 'profile' && (
                    <div className="bg-white rounded-3xl border border-gray-200 shadow-sm p-5 sm:p-6 space-y-4">
                        <div className="flex items-center justify-between border-b pb-3">
                            <h2 className="text-sm sm:text-base font-bold text-gray-900 flex items-center gap-2">
                                <User className="w-5 h-5 text-[#EF4A23]" />
                                <span>Customer Profile Details</span>
                            </h2>
                            <Link
                                href={route('profile.edit')}
                                className="text-xs bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold px-3 py-1.5 rounded-lg transition"
                            >
                                Edit Profile
                            </Link>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                            <div className="p-4 bg-gray-50 rounded-xl border border-gray-100 space-y-1">
                                <span className="text-gray-400 text-[10px] uppercase font-bold">Full Name</span>
                                <p className="font-bold text-gray-900 text-sm">{auth.user?.name}</p>
                            </div>
                            <div className="p-4 bg-gray-50 rounded-xl border border-gray-100 space-y-1">
                                <span className="text-gray-400 text-[10px] uppercase font-bold">Email Address</span>
                                <p className="font-bold text-gray-900 text-sm">{auth.user?.email}</p>
                            </div>
                            <div className="p-4 bg-gray-50 rounded-xl border border-gray-100 space-y-1">
                                <span className="text-gray-400 text-[10px] uppercase font-bold">Contact Phone</span>
                                <p className="font-bold text-gray-900 text-sm font-mono">{auth.user?.phone || 'Not provided'}</p>
                            </div>
                            <div className="p-4 bg-gray-50 rounded-xl border border-gray-100 space-y-1">
                                <span className="text-gray-400 text-[10px] uppercase font-bold">Default Delivery Address</span>
                                <p className="font-bold text-gray-900 text-sm">{auth.user?.address || 'Not provided'}</p>
                            </div>
                        </div>

                        {/* Account Session & Logout */}
                        <div className="pt-3 border-t border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-rose-50/60 p-4 rounded-2xl border border-rose-100 mt-4">
                            <div>
                                <h3 className="text-xs font-bold text-rose-900 flex items-center gap-1.5">
                                    <LogOut className="w-4 h-4 text-rose-600" />
                                    <span>Account Session & Logout</span>
                                </h3>
                                <p className="text-[11px] text-rose-700/80 mt-0.5">
                                    Safely end your session on this device. You will need to log back in next time.
                                </p>
                            </div>
                            <Link
                                href={route('logout')}
                                method="post"
                                as="button"
                                className="shrink-0 inline-flex items-center justify-center gap-1.5 text-xs bg-rose-600 hover:bg-rose-700 text-white font-bold py-2 px-4 rounded-xl transition shadow-sm"
                            >
                                <LogOut className="w-3.5 h-3.5" />
                                <span>Log Out of Account</span>
                            </Link>
                        </div>
                    </div>
                )}
            </div>

            {/* PRINTABLE INVOICE VIEW (Active during window.print()) */}
            {selectedOrderForPrint && (
                <div className="hidden print:block text-black bg-white p-6 sm:p-8 font-sans text-xs w-full max-w-full m-0">
                    <style dangerouslySetInnerHTML={{
                        __html: `
                            @media print {
                                header, nav, footer, aside, .print\\:hidden, #app > div > div.print\\:hidden {
                                    display: none !important;
                                    visibility: hidden !important;
                                    height: 0 !important;
                                    opacity: 0 !important;
                                    pointer-events: none !important;
                                }
                                body, html {
                                    background: white !important;
                                    color: black !important;
                                    margin: 0 !important;
                                    padding: 0 !important;
                                }
                                main {
                                    padding: 0 !important;
                                    margin: 0 !important;
                                    max-width: 100% !important;
                                    width: 100% !important;
                                }
                            }
                        `
                    }} />
                    <div className="flex justify-between items-start border-b-2 border-black pb-4 mb-4">
                        <div>
                            <h1 className="text-xl font-black uppercase" style={{ color: settings?.primary_color || '#EF4A23' }}>
                                {settings?.site_name || 'Tech Shoppers'}
                            </h1>
                            <p className="text-[10px] text-gray-600">{settings?.site_tagline || 'Leading Computer, Laptop & Component Retailer in Bangladesh'}</p>
                            <p className="text-[9px] text-gray-500">Hub: {settings?.address || 'Pragati Sharani, Dhaka 1212'} | Hotline: {settings?.hotline || '16793'}</p>
                        </div>
                        <div className="text-right">
                            <h2 className="text-base font-black">CUSTOMER INVOICE</h2>
                            <p className="font-mono text-sm font-bold">#{selectedOrderForPrint.order_number}</p>
                            <p className="text-[10px] text-gray-500">
                                Date: {new Date(selectedOrderForPrint.created_at).toLocaleDateString()}
                            </p>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 mb-6">
                        <div>
                            <h3 className="font-bold text-gray-700 text-[10px] uppercase border-b pb-1 mb-1">Customer & Delivery:</h3>
                            <p className="font-bold text-sm">{selectedOrderForPrint.customer_name}</p>
                            <p className="font-mono font-bold">{selectedOrderForPrint.customer_phone}</p>
                            <p className="leading-snug">{selectedOrderForPrint.customer_address}</p>
                            <p className="font-bold">{selectedOrderForPrint.city} {selectedOrderForPrint.zone && `(${selectedOrderForPrint.zone})`}</p>
                        </div>
                        <div className="text-right">
                            <h3 className="font-bold text-gray-700 text-[10px] uppercase border-b pb-1 mb-1">Payment & Shipping:</h3>
                            <p>Payment Method: <strong className="uppercase">{selectedOrderForPrint.payment_method}</strong></p>
                            <p>Payment Status: <strong className="uppercase">{selectedOrderForPrint.payment_status}</strong></p>
                            {selectedOrderForPrint.courier_name && (
                                <p>Courier: <strong>{selectedOrderForPrint.courier_name} ({selectedOrderForPrint.courier_tracking_id})</strong></p>
                            )}
                        </div>
                    </div>

                    <table className="w-full text-left text-xs mb-6 border border-black">
                        <thead className="bg-gray-100 border-b border-black">
                            <tr>
                                <th className="p-2 border-r border-black">SL</th>
                                <th className="p-2 border-r border-black">Product Item</th>
                                <th className="p-2 text-center border-r border-black">Quantity</th>
                                <th className="p-2 text-right border-r border-black">Unit Price</th>
                                <th className="p-2 text-right">Total Price</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-300">
                            {selectedOrderForPrint.items?.map((item, idx) => (
                                <tr key={item.id}>
                                    <td className="p-2 text-center border-r border-gray-300">{idx + 1}</td>
                                    <td className="p-2 font-bold border-r border-gray-300">{item.product_name}</td>
                                    <td className="p-2 text-center border-r border-gray-300">{item.quantity}</td>
                                    <td className="p-2 text-right border-r border-gray-300">৳{Number(item.unit_price).toLocaleString()}</td>
                                    <td className="p-2 text-right font-black">৳{Number(item.total_price).toLocaleString()}</td>
                                </tr>
                            ))}
                        </tbody>
                        <tfoot className="border-t-2 border-black font-bold">
                            <tr>
                                <td colSpan="4" className="p-2 text-right">Subtotal:</td>
                                <td className="p-2 text-right">৳{Number(selectedOrderForPrint.subtotal || selectedOrderForPrint.total).toLocaleString()}</td>
                            </tr>
                            {Number(selectedOrderForPrint.shipping_cost) > 0 && (
                                <tr>
                                    <td colSpan="4" className="p-2 text-right">Delivery Charge:</td>
                                    <td className="p-2 text-right">৳{Number(selectedOrderForPrint.shipping_cost).toLocaleString()}</td>
                                </tr>
                            )}
                            <tr className="border-t">
                                <td colSpan="4" className="p-2.5 text-right text-sm">Total Payable Amount:</td>
                                <td className="p-2.5 text-right text-base font-black">৳{Number(selectedOrderForPrint.total).toLocaleString()}</td>
                            </tr>
                        </tfoot>
                    </table>

                    <div className="mt-8 pt-4 border-t border-gray-400 text-center text-[9px] text-gray-500">
                        Thank you for shopping with {settings?.site_name || 'Tech Shoppers'}! | Hotline: {settings?.hotline || '16793'} {settings?.email ? `| Email: ${settings.email}` : ''}
                    </div>
                </div>
            )}
        </FrontendLayout>
    );
}
