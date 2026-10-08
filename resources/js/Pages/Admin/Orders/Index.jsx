import React, { useState } from 'react';
import { Link, router } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Search, Eye, ShieldCheck, ShieldAlert, ShieldX, Truck, Package } from 'lucide-react';

export default function Index({ orders, filters = {} }) {
    const [search, setSearch] = useState(filters.search || '');
    const [status, setStatus] = useState(filters.status || '');
    const [fraudStatus, setFraudStatus] = useState(filters.fraud_status || '');
    const [courierName, setCourierName] = useState(filters.courier_name || '');

    const handleFilter = (e) => {
        e.preventDefault();
        router.get(
            route('admin.orders.index'),
            {
                search: search || undefined,
                status: status || undefined,
                fraud_status: fraudStatus || undefined,
                courier_name: courierName || undefined,
            },
            { preserveState: true }
        );
    };

    const getFraudBadge = (status, score) => {
        switch (status) {
            case 'safe':
                return (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                        <ShieldCheck className="w-3 h-3" />
                        Safe {score !== null && score !== undefined && `(${score})`}
                    </span>
                );
            case 'review':
                return (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
                        <ShieldAlert className="w-3 h-3" />
                        Review {score !== null && score !== undefined && `(${score})`}
                    </span>
                );
            case 'high_risk':
            case 'flagged':
                return (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-50 text-rose-700 border border-rose-200">
                        <ShieldX className="w-3 h-3" />
                        High Risk {score !== null && score !== undefined && `(${score})`}
                    </span>
                );
            default:
                return (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium bg-gray-50 text-gray-500 border border-gray-200">
                        Pending
                    </span>
                );
        }
    };

    return (
        <AdminLayout title="Manage Customer Orders">
            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 mb-6">
                <div>
                    <h1 className="text-xl font-black text-gray-900">Orders Management</h1>
                    <p className="text-xs text-gray-500">Track orders, automated fraud assessment, and courier parcel dispatch</p>
                </div>

                <form onSubmit={handleFilter} className="flex flex-wrap items-center gap-2.5 w-full lg:w-auto">
                    {/* Order Status */}
                    <select
                        value={status}
                        onChange={(e) => setStatus(e.target.value)}
                        className="text-xs p-2 rounded-xl border border-gray-300 focus:border-[#EF4A23]"
                    >
                        <option value="">All Statuses</option>
                        <option value="pending">Pending</option>
                        <option value="processing">Processing</option>
                        <option value="confirmed">Confirmed</option>
                        <option value="shipped">Shipped</option>
                        <option value="delivered">Delivered</option>
                        <option value="cancelled">Cancelled</option>
                    </select>

                    {/* Fraud Status Filter */}
                    <select
                        value={fraudStatus}
                        onChange={(e) => setFraudStatus(e.target.value)}
                        className="text-xs p-2 rounded-xl border border-gray-300 focus:border-[#EF4A23]"
                    >
                        <option value="">All Risk Levels</option>
                        <option value="safe">🛡️ Safe</option>
                        <option value="review">⚠️ Needs Review</option>
                        <option value="high_risk">🚨 High Risk / Fraud</option>
                    </select>

                    {/* Courier Filter */}
                    <select
                        value={courierName}
                        onChange={(e) => setCourierName(e.target.value)}
                        className="text-xs p-2 rounded-xl border border-gray-300 focus:border-[#EF4A23]"
                    >
                        <option value="">All Couriers</option>
                        <option value="steadfast">Steadfast Courier</option>
                        <option value="pathao">Pathao Courier</option>
                        <option value="redx">RedX Logistics</option>
                        <option value="paperfly">Paperfly</option>
                        <option value="sundarban">Sundarban Courier</option>
                        <option value="startech_rider">Star Tech Rider</option>
                    </select>

                    {/* Search Field */}
                    <div className="relative flex-1 sm:flex-initial">
                        <input
                            type="text"
                            placeholder="Order #, Phone, Tracking"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="text-xs pl-3 pr-8 py-2 rounded-xl border border-gray-300 focus:border-[#EF4A23] w-full sm:w-48"
                        />
                        <button type="submit" className="absolute right-2.5 top-2.5 text-gray-400">
                            <Search className="w-3.5 h-3.5" />
                        </button>
                    </div>

                    <button
                        type="submit"
                        className="text-xs bg-[#081621] hover:bg-[#122738] text-white font-bold px-3 py-2 rounded-xl transition"
                    >
                        Filter
                    </button>
                </form>
            </div>

            <div className="bg-white rounded-2xl border border-gray-200/80 shadow-sm overflow-hidden">
                <table className="w-full text-left text-xs">
                    <thead className="bg-gray-50 border-b text-gray-500 uppercase font-semibold">
                        <tr>
                            <th className="p-3.5">Order Number</th>
                            <th className="p-3.5">Customer</th>
                            <th className="p-3.5 text-center">Fraud Risk</th>
                            <th className="p-3.5">Courier & Dispatch</th>
                            <th className="p-3.5 text-right">Total Amount</th>
                            <th className="p-3.5 text-center">Status</th>
                            <th className="p-3.5 text-center">Action</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {orders.data.length === 0 ? (
                            <tr>
                                <td colSpan="7" className="text-center py-10 text-gray-500">
                                    No orders found matching the criteria.
                                </td>
                            </tr>
                        ) : (
                            orders.data.map((order) => (
                                <tr key={order.id} className="hover:bg-gray-50/50">
                                    <td className="p-3.5 font-bold text-[#EF4A23]">
                                        <Link href={route('admin.orders.show', order.id)} className="hover:underline">
                                            {order.order_number}
                                        </Link>
                                        <span className="block text-[10px] text-gray-400 font-normal">
                                            {new Date(order.created_at).toLocaleDateString()}
                                        </span>
                                    </td>
                                    <td className="p-3.5">
                                        <p className="font-semibold text-gray-900">{order.customer_name}</p>
                                        <p className="text-[11px] text-gray-500 font-mono">{order.customer_phone}</p>
                                        <p className="text-[10px] text-gray-400 truncate max-w-[150px]">{order.city}</p>
                                    </td>
                                    {/* Fraud Risk Column */}
                                    <td className="p-3.5 text-center">
                                        {getFraudBadge(order.fraud_status, order.fraud_score)}
                                    </td>
                                    {/* Courier Column */}
                                    <td className="p-3.5">
                                        {order.courier_name ? (
                                            <div>
                                                <span className="inline-flex items-center gap-1 font-bold text-gray-800 uppercase text-[11px]">
                                                    <Truck className="w-3 h-3 text-[#EF4A23]" />
                                                    {order.courier_name}
                                                </span>
                                                <span className="block text-[10px] font-mono text-gray-500">
                                                    {order.courier_tracking_id}
                                                </span>
                                            </div>
                                        ) : (
                                            <span className="text-[11px] text-gray-400 italic flex items-center gap-1">
                                                <Package className="w-3 h-3 text-gray-300" />
                                                Unassigned
                                            </span>
                                        )}
                                    </td>
                                    {/* Total Amount */}
                                    <td className="p-3.5 text-right font-black text-gray-900">
                                        ৳{Number(order.total).toLocaleString()}
                                        <span className="block text-[10px] uppercase font-semibold text-gray-400">
                                            {order.payment_method}
                                        </span>
                                    </td>
                                    {/* Order Status */}
                                    <td className="p-3.5 text-center">
                                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                                            order.order_status === 'delivered' ? 'bg-emerald-50 text-emerald-700' :
                                            order.order_status === 'shipped' ? 'bg-blue-50 text-blue-700' :
                                            order.order_status === 'pending' ? 'bg-amber-50 text-amber-700' :
                                            order.order_status === 'processing' ? 'bg-indigo-50 text-indigo-700' :
                                            order.order_status === 'cancelled' ? 'bg-rose-50 text-rose-700' :
                                            'bg-gray-100 text-gray-700'
                                        }`}>
                                            {order.order_status}
                                        </span>
                                    </td>
                                    {/* Actions */}
                                    <td className="p-3.5 text-center">
                                        <Link
                                            href={route('admin.orders.show', order.id)}
                                            className="p-1.5 rounded-lg bg-gray-100 hover:bg-[#EF4A23] hover:text-white text-gray-600 transition inline-block"
                                            title="View Order, Fraud Analysis & Courier Dispatch"
                                        >
                                            <Eye className="w-3.5 h-3.5" />
                                        </Link>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {orders.links && orders.links.length > 3 && (
                <div className="mt-6 flex justify-center">
                    <div className="flex items-center gap-1 bg-white p-1.5 rounded-xl border border-gray-200 shadow-sm">
                        {orders.links.map((link, idx) => (
                            <Link
                                key={idx}
                                href={link.url || '#'}
                                dangerouslySetInnerHTML={{ __html: link.label }}
                                className={`px-3 py-1.5 text-xs rounded-lg transition font-medium ${
                                    link.active ? 'bg-[#EF4A23] text-white font-bold' : 'text-gray-700 hover:bg-gray-100'
                                }`}
                            />
                        ))}
                    </div>
                </div>
            )}
        </AdminLayout>
    );
}
