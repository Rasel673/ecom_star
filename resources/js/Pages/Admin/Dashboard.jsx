import React, { useState } from 'react';
import { Link, usePage } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { 
    DollarSign, 
    ShoppingBag, 
    Clock, 
    Package, 
    Users, 
    AlertTriangle, 
    ArrowRight, 
    Eye, 
    Truck, 
    ShieldAlert, 
    MessageSquare, 
    TrendingUp, 
    Plus, 
    CheckCircle2, 
    Calendar,
    Send
} from 'lucide-react';

export default function Dashboard({ 
    stats, 
    salesTrends = [], 
    recentOrders = [], 
    lowStockProducts = [],
    recentMessages = [],
    recentPreOrders = []
}) {
    const { settings } = usePage().props;
    const siteName = settings?.site_name || 'Tech Shoppers';

    // Find maximum sales in trends for proportional SVG heights
    const maxSales = Math.max(...salesTrends.map(t => t.sales || 0), 10000);
    const [hoveredTrend, setHoveredTrend] = useState(null);

    return (
        <AdminLayout title={`${siteName} Control Dashboard`}>
            {/* Top Welcome & Quick Actions Bar */}
            <div className="bg-[#081621] text-white rounded-2xl p-6 mb-8 shadow-xl relative overflow-hidden flex flex-col md:flex-row items-start md:items-center justify-between gap-6 border border-gray-800">
                <div className="relative z-10">
                    <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[11px] font-bold mb-2">
                        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                        <span>{siteName} System Live & Operational</span>
                    </div>
                    <h1 className="text-xl sm:text-2xl font-black tracking-tight">
                        Store Overview & Live Analytics
                    </h1>
                    <p className="text-xs text-gray-400 mt-1">
                        Monitor revenue, automated courier fulfillment, fraud alerts, and customer reservations in real-time.
                    </p>
                </div>

                <div className="flex flex-wrap items-center gap-2.5 relative z-10">
                    <Link
                        href={route('admin.products.create')}
                        className="px-3.5 py-2 rounded-xl bg-[#EF4A23] hover:bg-[#d63c17] text-white text-xs font-bold flex items-center gap-1.5 transition shadow-lg shadow-orange-950/40"
                    >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Add Product</span>
                    </Link>
                    <Link
                        href={route('admin.orders.index')}
                        className="px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition border border-white/10 flex items-center gap-1.5"
                    >
                        <ShoppingBag className="w-3.5 h-3.5 text-gray-300" />
                        <span>All Orders</span>
                    </Link>
                    <Link
                        href={route('admin.messages.index')}
                        className="px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition border border-white/10 flex items-center gap-1.5"
                    >
                        <MessageSquare className="w-3.5 h-3.5 text-blue-400" />
                        <span>Inquiries</span>
                        {stats.openMessages > 0 && (
                            <span className="ml-1 px-1.5 py-0.2 text-[10px] bg-red-500 text-white rounded-full font-bold">
                                {stats.openMessages}
                            </span>
                        )}
                    </Link>
                </div>

                {/* Subtle background glow */}
                <div className="absolute right-0 top-0 bottom-0 w-96 bg-gradient-to-l from-orange-600/10 to-transparent pointer-events-none"></div>
            </div>

            {/* Core KPI Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 mb-8">
                {/* Total Sales Card */}
                <div className="bg-white p-5 rounded-2xl border border-gray-200/90 shadow-sm relative overflow-hidden">
                    <div className="flex items-center justify-between mb-3">
                        <span className="text-xs font-bold uppercase tracking-wider text-gray-400">Total Revenue</span>
                        <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                            <DollarSign className="w-5 h-5" />
                        </div>
                    </div>
                    <div className="text-2xl font-black text-gray-900 tracking-tight">
                        ৳{Number(stats.totalSales || 0).toLocaleString()}
                    </div>
                    <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100 text-[11px] text-gray-500">
                        <span>Today: <strong className="text-gray-800">৳{Number(stats.todaySales || 0).toLocaleString()}</strong></span>
                        <span>This Month: <strong className="text-gray-800">৳{Number(stats.thisMonthSales || 0).toLocaleString()}</strong></span>
                    </div>
                </div>

                {/* Orders Card */}
                <div className="bg-white p-5 rounded-2xl border border-gray-200/90 shadow-sm relative overflow-hidden">
                    <div className="flex items-center justify-between mb-3">
                        <span className="text-xs font-bold uppercase tracking-wider text-gray-400">Orders Status</span>
                        <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                            <ShoppingBag className="w-5 h-5" />
                        </div>
                    </div>
                    <div className="text-2xl font-black text-gray-900 tracking-tight flex items-baseline gap-2">
                        <span>{stats.totalOrders || 0}</span>
                        <span className="text-xs font-normal text-gray-400">total</span>
                    </div>
                    <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100 text-[11px] text-gray-500">
                        <span className="text-amber-600 font-semibold">{stats.pendingOrders || 0} Pending</span>
                        <span className="text-blue-600 font-semibold">{stats.processingOrders || 0} Processing</span>
                        <span className="text-emerald-600 font-semibold">{stats.deliveredOrders || 0} Delivered</span>
                    </div>
                </div>

                {/* Courier & Logistics Card */}
                <div className="bg-white p-5 rounded-2xl border border-gray-200/90 shadow-sm relative overflow-hidden">
                    <div className="flex items-center justify-between mb-3">
                        <span className="text-xs font-bold uppercase tracking-wider text-gray-400">Courier Dispatch</span>
                        <div className="w-9 h-9 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
                            <Truck className="w-5 h-5" />
                        </div>
                    </div>
                    <div className="text-2xl font-black text-gray-900 tracking-tight">
                        {stats.courierDispatched || 0}
                    </div>
                    <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100 text-[11px] text-gray-500">
                        <span>Steadfast & RedX API</span>
                        <Link href={route('admin.orders.index')} className="text-purple-600 font-bold hover:underline">
                            View Dispatches &rarr;
                        </Link>
                    </div>
                </div>

                {/* Risk & Fraud Alert Card */}
                <div className="bg-white p-5 rounded-2xl border border-gray-200/90 shadow-sm relative overflow-hidden">
                    <div className="flex items-center justify-between mb-3">
                        <span className="text-xs font-bold uppercase tracking-wider text-gray-400">Risk Assessment</span>
                        <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${
                            stats.fraudAlerts > 0 ? 'bg-rose-50 text-rose-600' : 'bg-emerald-50 text-emerald-600'
                        }`}>
                            {stats.fraudAlerts > 0 ? <ShieldAlert className="w-5 h-5" /> : <CheckCircle2 className="w-5 h-5" />}
                        </div>
                    </div>
                    <div className="text-2xl font-black text-gray-900 tracking-tight flex items-baseline gap-2">
                        <span className={stats.fraudAlerts > 0 ? 'text-rose-600' : 'text-gray-900'}>
                            {stats.fraudAlerts || 0}
                        </span>
                        <span className="text-xs font-normal text-gray-400">flagged orders</span>
                    </div>
                    <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100 text-[11px] text-gray-500">
                        <span>Automated fraud engine</span>
                        {stats.fraudAlerts > 0 ? (
                            <Link href={`${route('admin.orders.index')}?fraud_status=review`} className="text-rose-600 font-bold hover:underline">
                                Review Flags &rarr;
                            </Link>
                        ) : (
                            <span className="text-emerald-600 font-semibold">Zero Threats</span>
                        )}
                    </div>
                </div>
            </div>

            {/* Middle Section: 7-Day Revenue Trend Chart + Quick Attention Summary */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 mb-8">
                {/* 7-Day Sales Trend Visual Chart */}
                <div className="lg:col-span-8 bg-white p-5 sm:p-6 rounded-2xl border border-gray-200/90 shadow-sm flex flex-col justify-between">
                    <div className="flex items-center justify-between mb-4">
                        <div>
                            <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2">
                                <TrendingUp className="w-4 h-4 text-[#EF4A23]" />
                                <span>Recent 7-Day Revenue & Volume</span>
                            </h3>
                            <p className="text-xs text-gray-400">Daily store performance snapshot</p>
                        </div>
                        {hoveredTrend && (
                            <div className="text-right animate-fade-in text-xs bg-gray-50 px-3 py-1.5 rounded-xl border border-gray-200">
                                <span className="font-bold text-gray-900">৳{Number(hoveredTrend.sales).toLocaleString()}</span>
                                <span className="text-gray-400 ml-1.5">({hoveredTrend.orders} orders) on {hoveredTrend.date}</span>
                            </div>
                        )}
                    </div>

                    {/* Chart Canvas */}
                    <div className="h-48 sm:h-56 flex items-end justify-between gap-2 sm:gap-4 pt-6 pb-2 border-b border-gray-100">
                        {salesTrends.map((t, i) => {
                            const barHeightPercent = Math.max(8, Math.round((t.sales / maxSales) * 100));
                            return (
                                <div 
                                    key={i} 
                                    className="flex-1 flex flex-col items-center h-full justify-end group cursor-pointer"
                                    onMouseEnter={() => setHoveredTrend(t)}
                                    onMouseLeave={() => setHoveredTrend(null)}
                                >
                                    {/* Tooltip on hover */}
                                    <div className="opacity-0 group-hover:opacity-100 transition-opacity text-[10px] font-bold text-gray-700 bg-gray-100 px-1.5 py-0.5 rounded mb-1 whitespace-nowrap">
                                        ৳{Number(t.sales).toLocaleString()}
                                    </div>
                                    
                                    {/* Bar element */}
                                    <div 
                                        className="w-full max-w-[42px] bg-gradient-to-t from-[#EF4A23] to-orange-400 group-hover:from-orange-600 group-hover:to-orange-500 rounded-t-lg transition-all duration-300 shadow-sm group-hover:shadow-md"
                                        style={{ height: `${barHeightPercent}%` }}
                                    ></div>
                                    
                                    {/* Label */}
                                    <span className="text-[10px] text-gray-400 font-medium mt-2 block truncate">
                                        {t.shortDate}
                                    </span>
                                </div>
                            );
                        })}
                    </div>

                    <div className="flex items-center justify-between text-[11px] text-gray-400 pt-3">
                        <span>Past 7 days performance</span>
                        <span className="font-semibold text-gray-700">{siteName} E-Commerce Engine</span>
                    </div>
                </div>

                {/* Action Center & High Priority Tasks */}
                <div className="lg:col-span-4 bg-white p-5 sm:p-6 rounded-2xl border border-gray-200/90 shadow-sm flex flex-col justify-between">
                    <div>
                        <h3 className="text-sm font-bold text-gray-900 mb-1">Operational Action Hub</h3>
                        <p className="text-xs text-gray-400 mb-4">Urgent tasks requiring administrator attention</p>

                        <div className="space-y-3">
                            {/* Pending Pre-Orders */}
                            <Link 
                                href={route('admin.preorders.index')} 
                                className="p-3 rounded-xl border border-gray-200 hover:border-amber-300 hover:bg-amber-50/50 transition flex items-center justify-between group"
                            >
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center font-bold text-xs">
                                        <Clock className="w-4 h-4" />
                                    </div>
                                    <div>
                                        <div className="text-xs font-bold text-gray-900 group-hover:text-amber-800">
                                            Pre-Order Reservations
                                        </div>
                                        <div className="text-[11px] text-gray-400">
                                            {stats.pendingPreOrders || 0} waiting for delivery date
                                        </div>
                                    </div>
                                </div>
                                <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-amber-600 group-hover:translate-x-1 transition-transform" />
                            </Link>

                            {/* Customer Support Messages */}
                            <Link 
                                href={route('admin.messages.index')} 
                                className="p-3 rounded-xl border border-gray-200 hover:border-blue-300 hover:bg-blue-50/50 transition flex items-center justify-between group"
                            >
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-xs">
                                        <MessageSquare className="w-4 h-4" />
                                    </div>
                                    <div>
                                        <div className="text-xs font-bold text-gray-900 group-hover:text-blue-800">
                                            Support Messages
                                        </div>
                                        <div className="text-[11px] text-gray-400">
                                            {stats.openMessages || 0} customers waiting for reply
                                        </div>
                                    </div>
                                </div>
                                <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-blue-600 group-hover:translate-x-1 transition-transform" />
                            </Link>

                            {/* Low Stock Watch */}
                            <div className="p-3 rounded-xl border border-gray-200 bg-gray-50/50 flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-lg bg-rose-100 text-rose-700 flex items-center justify-center font-bold text-xs">
                                        <AlertTriangle className="w-4 h-4" />
                                    </div>
                                    <div>
                                        <div className="text-xs font-bold text-gray-900">
                                            Inventory Depletion
                                        </div>
                                        <div className="text-[11px] text-gray-400">
                                            {stats.lowStockCount || 0} low stock / {stats.outOfStockCount || 0} out of stock
                                        </div>
                                    </div>
                                </div>
                                <Link 
                                    href={route('admin.products.index')}
                                    className="text-xs font-bold text-[#EF4A23] hover:underline"
                                >
                                    Restock
                                </Link>
                            </div>
                        </div>
                    </div>

                    <div className="pt-4 border-t border-gray-100 text-[11px] text-gray-400 flex items-center justify-between">
                        <span>Total Registered Users</span>
                        <strong className="text-gray-800">{stats.totalUsers || 0} Customers</strong>
                    </div>
                </div>
            </div>

            {/* Bottom Section: Recent Orders Table + Low Stock Alerts */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8">
                {/* Recent Orders */}
                <div className="lg:col-span-8 bg-white rounded-2xl border border-gray-200/90 shadow-sm overflow-hidden">
                    <div className="p-5 border-b border-gray-100 flex items-center justify-between">
                        <div>
                            <h3 className="text-sm font-bold text-gray-900">Recent Customer Transactions</h3>
                            <p className="text-xs text-gray-400">Real-time orders, payment mode, and fulfillment status</p>
                        </div>
                        <Link
                            href={route('admin.orders.index')}
                            className="text-xs text-[#EF4A23] hover:underline font-bold flex items-center gap-1"
                        >
                            <span>View All Orders</span>
                            <ArrowRight className="w-3.5 h-3.5" />
                        </Link>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-xs">
                            <thead className="bg-gray-50/75 text-gray-500 font-semibold border-b text-[11px]">
                                <tr>
                                    <th className="p-3.5">Order</th>
                                    <th className="p-3.5">Customer & Items</th>
                                    <th className="p-3.5 text-right">Amount</th>
                                    <th className="p-3.5 text-center">Status</th>
                                    <th className="p-3.5 text-center">Courier / Fraud</th>
                                    <th className="p-3.5 text-center">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {recentOrders.length > 0 ? (
                                    recentOrders.map((order) => (
                                        <tr key={order.id} className="hover:bg-gray-50/50 transition">
                                            <td className="p-3.5">
                                                <span className="font-bold text-[#EF4A23] block">{order.order_number}</span>
                                                <span className="text-[10px] text-gray-400">
                                                    {new Date(order.created_at).toLocaleDateString()}
                                                </span>
                                            </td>
                                            <td className="p-3.5 max-w-xs">
                                                <p className="font-bold text-gray-900 truncate">{order.customer_name}</p>
                                                <p className="text-[11px] text-gray-400 truncate">{order.customer_phone}</p>
                                                {order.items && order.items.length > 0 && (
                                                    <p className="text-[10px] text-gray-500 truncate mt-0.5">
                                                        {order.items[0]?.product_name} {order.items.length > 1 ? `+${order.items.length - 1} more` : ''}
                                                    </p>
                                                )}
                                            </td>
                                            <td className="p-3.5 text-right font-black text-gray-900">
                                                ৳{Number(order.total).toLocaleString()}
                                            </td>
                                            <td className="p-3.5 text-center">
                                                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                                                    order.order_status === 'delivered' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' :
                                                    order.order_status === 'pending' ? 'bg-amber-50 text-amber-700 border border-amber-200' :
                                                    order.order_status === 'processing' ? 'bg-blue-50 text-blue-700 border border-blue-200' :
                                                    'bg-gray-100 text-gray-700'
                                                }`}>
                                                    {order.order_status}
                                                </span>
                                            </td>
                                            <td className="p-3.5 text-center">
                                                <div className="flex flex-col items-center gap-1">
                                                    {(order.courier_tracking_id || order.courier_consignment_id) ? (
                                                        <span className="text-[10px] font-bold text-purple-700 bg-purple-50 px-2 py-0.5 rounded-full border border-purple-200">
                                                            {order.courier_name || 'Courier'} Dispatched
                                                        </span>
                                                    ) : (
                                                        <span className="text-[10px] text-gray-400 italic">No Dispatch</span>
                                                    )}
                                                    {order.fraud_status === 'safe' ? (
                                                        <span className="text-[9px] font-semibold text-emerald-600">Fraud Safe</span>
                                                    ) : order.fraud_status === 'review' || order.fraud_status === 'high_risk' ? (
                                                        <span className="text-[9px] font-bold text-rose-600 bg-rose-50 px-1 rounded border border-rose-200">
                                                            Risk Flagged
                                                        </span>
                                                    ) : null}
                                                </div>
                                            </td>
                                            <td className="p-3.5 text-center">
                                                <Link
                                                    href={route('admin.orders.show', order.id)}
                                                    className="p-1.5 text-gray-500 hover:text-white hover:bg-[#081621] rounded-lg transition inline-block"
                                                    title="View Full Order Details"
                                                >
                                                    <Eye className="w-4 h-4" />
                                                </Link>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="6" className="p-8 text-center text-gray-400">
                                            No orders placed yet.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Low Stock Warning Sidebar */}
                <div className="lg:col-span-4 bg-white rounded-2xl border border-gray-200/90 shadow-sm overflow-hidden flex flex-col justify-between">
                    <div>
                        <div className="p-5 border-b border-gray-100 flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <AlertTriangle className="w-4 h-4 text-amber-500" />
                                <h3 className="text-sm font-bold text-gray-900">Critical Stock Alert</h3>
                            </div>
                            <span className="text-[11px] font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full">
                                &le; 5 In Stock
                            </span>
                        </div>

                        <div className="p-4 divide-y divide-gray-100">
                            {lowStockProducts.length > 0 ? (
                                lowStockProducts.map((p) => (
                                    <div key={p.id} className="py-3 flex items-center justify-between gap-3 text-xs">
                                        <div className="flex items-center gap-2.5 min-w-0">
                                            <img
                                                src={p.thumbnail || 'https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?w=50'}
                                                alt={p.name}
                                                className="w-9 h-9 rounded-lg object-contain border p-0.5 bg-gray-50 shrink-0"
                                            />
                                            <div className="min-w-0">
                                                <p className="font-bold text-gray-800 truncate">{p.name}</p>
                                                <p className="text-[10px] text-gray-400">{p.model || 'Model N/A'}</p>
                                            </div>
                                        </div>
                                        <div className="text-right shrink-0">
                                            <span className={`font-bold px-2 py-0.5 rounded text-[11px] border block ${
                                                p.quantity <= 0 
                                                    ? 'bg-rose-50 text-rose-600 border-rose-200' 
                                                    : 'bg-amber-50 text-amber-700 border-amber-200'
                                            }`}>
                                                {p.quantity <= 0 ? 'Out of Stock' : `${p.quantity} Left`}
                                            </span>
                                            <Link
                                                href={route('admin.products.edit', p.id)}
                                                className="text-[10px] text-[#EF4A23] font-bold hover:underline mt-0.5 block"
                                            >
                                                Update Stock
                                            </Link>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <p className="text-xs text-gray-400 p-6 text-center">
                                    All inventory thresholds are healthy.
                                </p>
                            )}
                        </div>
                    </div>

                    <div className="p-4 bg-gray-50/80 border-t border-gray-100 text-center">
                        <Link
                            href={route('admin.products.index')}
                            className="text-xs font-bold text-[#081621] hover:text-[#EF4A23] transition flex items-center justify-center gap-1"
                        >
                            <span>Manage Full Catalog & Inventory</span>
                            <ArrowRight className="w-3.5 h-3.5" />
                        </Link>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
