import React, { useState } from 'react';
import { Link, router } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Clock, CheckCircle2, Truck, XCircle, Edit3, Calendar, Phone, MapPin, User, Package } from 'lucide-react';

export default function PreOrders({ preOrders }) {
    const [selectedPreOrder, setSelectedPreOrder] = useState(null);
    const [statusForm, setStatusForm] = useState({
        status: 'pending',
        expected_date: '',
        notes: '',
    });
    const [submitting, setSubmitting] = useState(false);

    const handleOpenEdit = (po) => {
        setSelectedPreOrder(po);
        setStatusForm({
            status: po.status || 'pending',
            expected_date: po.expected_date || '',
            notes: po.notes || '',
        });
    };

    const handleUpdateStatus = (e) => {
        e.preventDefault();
        if (!selectedPreOrder) return;

        setSubmitting(true);
        router.patch(route('admin.preorders.status', selectedPreOrder.id), statusForm, {
            preserveScroll: true,
            onSuccess: () => {
                setSelectedPreOrder(null);
            },
            onFinish: () => setSubmitting(false),
        });
    };

    const getStatusBadge = (status) => {
        switch (status) {
            case 'confirmed':
                return (
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-50 text-blue-700 border border-blue-200">
                        <CheckCircle2 className="w-3 h-3" /> Confirmed
                    </span>
                );
            case 'ready_to_ship':
                return (
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                        <Truck className="w-3 h-3" /> Ready to Ship
                    </span>
                );
            case 'cancelled':
                return (
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-red-50 text-red-700 border border-red-200">
                        <XCircle className="w-3 h-3" /> Cancelled
                    </span>
                );
            default:
                return (
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-50 text-amber-700 border border-amber-200">
                        <Clock className="w-3 h-3" /> Pending Review
                    </span>
                );
        }
    };

    return (
        <AdminLayout title="Manage Customer Pre-Orders">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
                <div>
                    <h1 className="text-xl font-black text-gray-900 flex items-center gap-2">
                        <Clock className="w-6 h-6 text-amber-500" />
                        <span>Customer Pre-Orders</span>
                    </h1>
                    <p className="text-xs text-gray-500">Track and manage reservations for upcoming hardware, set expected delivery dates, and notify customers.</p>
                </div>
            </div>

            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs text-gray-600">
                        <thead className="bg-gray-50 text-gray-700 uppercase font-semibold border-b text-[11px] tracking-wider">
                            <tr>
                                <th className="p-4">Pre-Order #</th>
                                <th className="p-4">Product</th>
                                <th className="p-4">Customer Info</th>
                                <th className="p-4">Qty & Price</th>
                                <th className="p-4">Expected Date</th>
                                <th className="p-4">Status</th>
                                <th className="p-4 text-right">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {preOrders.data && preOrders.data.length > 0 ? (
                                preOrders.data.map((po) => (
                                    <tr key={po.id} className="hover:bg-gray-50/70 transition">
                                        <td className="p-4 whitespace-nowrap">
                                            <div className="font-mono font-bold text-gray-900 text-xs">
                                                {po.pre_order_number}
                                            </div>
                                            <div className="text-[10px] text-gray-400 mt-0.5">
                                                {new Date(po.created_at).toLocaleDateString()}
                                            </div>
                                        </td>
                                        <td className="p-4 max-w-xs">
                                            <div className="flex items-center gap-3">
                                                {po.product && (
                                                    <img
                                                        src={po.product.thumbnail || 'https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?w=100&h=100&fit=crop'}
                                                        alt={po.product.name}
                                                        className="w-10 h-10 object-contain rounded-lg border bg-gray-50 p-1 shrink-0"
                                                    />
                                                )}
                                                <div>
                                                    <div className="font-bold text-gray-900 line-clamp-1">
                                                        {po.product?.name || 'Custom Product'}
                                                    </div>
                                                    <div className="text-[11px] text-gray-400">
                                                        Model: {po.product?.model || 'N/A'}
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="p-4">
                                            <div className="font-bold text-gray-900 flex items-center gap-1">
                                                <User className="w-3.5 h-3.5 text-gray-400" />
                                                <span>{po.customer_name}</span>
                                            </div>
                                            <div className="text-[11px] text-gray-500 flex items-center gap-1 mt-0.5">
                                                <Phone className="w-3 h-3 text-gray-400" />
                                                <span>{po.customer_phone}</span>
                                            </div>
                                            <div className="text-[11px] text-gray-400 flex items-center gap-1 mt-0.5 line-clamp-1">
                                                <MapPin className="w-3 h-3 text-gray-400 shrink-0" />
                                                <span>{po.delivery_address}</span>
                                            </div>
                                        </td>
                                        <td className="p-4 whitespace-nowrap">
                                            <div className="font-bold text-[#EF4A23]">
                                                ৳{Number(po.unit_price * po.quantity).toLocaleString()}
                                            </div>
                                            <div className="text-[11px] text-gray-400">
                                                {po.quantity} pcs @ ৳{Number(po.unit_price).toLocaleString()}
                                            </div>
                                        </td>
                                        <td className="p-4 whitespace-nowrap">
                                            {po.expected_date ? (
                                                <span className="font-semibold text-xs text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-100 flex items-center gap-1 w-fit">
                                                    <Calendar className="w-3 h-3" />
                                                    {po.expected_date}
                                                </span>
                                            ) : (
                                                <span className="text-gray-400 italic text-[11px]">Pending estimation</span>
                                            )}
                                        </td>
                                        <td className="p-4 whitespace-nowrap">
                                            {getStatusBadge(po.status)}
                                        </td>
                                        <td className="p-4 text-right whitespace-nowrap">
                                            <button
                                                onClick={() => handleOpenEdit(po)}
                                                className="px-3 py-1.5 bg-[#081621] hover:bg-amber-600 text-white text-xs font-semibold rounded-lg transition shadow-sm inline-flex items-center gap-1.5"
                                            >
                                                <Edit3 className="w-3.5 h-3.5" />
                                                <span>Update</span>
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="7" className="p-8 text-center text-gray-400">
                                        No customer pre-orders placed yet.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                {preOrders.links && preOrders.links.length > 3 && (
                    <div className="p-4 border-t border-gray-100 flex items-center justify-between">
                        <div className="text-xs text-gray-500">
                            Showing {preOrders.from || 0} to {preOrders.to || 0} of {preOrders.total} pre-orders
                        </div>
                        <div className="flex items-center gap-1">
                            {preOrders.links.map((link, idx) => (
                                <Link
                                    key={idx}
                                    href={link.url || '#'}
                                    dangerouslySetInnerHTML={{ __html: link.label }}
                                    className={`px-3 py-1 text-xs rounded-lg border transition ${
                                        link.active
                                            ? 'bg-amber-500 text-white border-amber-500'
                                            : !link.url
                                            ? 'text-gray-300 border-gray-200 cursor-not-allowed'
                                            : 'text-gray-600 border-gray-200 hover:bg-gray-50'
                                    }`}
                                />
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {/* Status Edit Modal */}
            {selectedPreOrder && (
                <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl max-w-lg w-full overflow-hidden shadow-2xl border border-gray-100">
                        <div className="bg-[#081621] px-6 py-4 flex items-center justify-between text-white">
                            <h3 className="text-sm font-bold flex items-center gap-2">
                                <Clock className="w-4 h-4 text-amber-400" />
                                <span>Update Pre-Order #{selectedPreOrder.pre_order_number}</span>
                            </h3>
                            <button
                                onClick={() => setSelectedPreOrder(null)}
                                className="text-gray-400 hover:text-white text-lg leading-none"
                            >
                                &times;
                            </button>
                        </div>

                        <form onSubmit={handleUpdateStatus} className="p-6 space-y-4">
                            <div className="bg-gray-50 p-3.5 rounded-xl border border-gray-200 text-xs text-gray-700">
                                <div className="font-bold text-gray-900 mb-1">
                                    {selectedPreOrder.product?.name}
                                </div>
                                <div>Customer: <strong>{selectedPreOrder.customer_name}</strong> ({selectedPreOrder.customer_phone})</div>
                                <div>Address: {selectedPreOrder.delivery_address}</div>
                                {selectedPreOrder.notes && (
                                    <div className="mt-2 text-gray-500 italic bg-white p-2 rounded border border-gray-200">
                                        Customer note: "{selectedPreOrder.notes}"
                                    </div>
                                )}
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-gray-700 mb-1">
                                    Pre-Order Status *
                                </label>
                                <select
                                    value={statusForm.status}
                                    onChange={(e) => setStatusForm({ ...statusForm, status: e.target.value })}
                                    className="w-full text-xs rounded-lg border-gray-300 focus:border-[#EF4A23] focus:ring-[#EF4A23] py-2 px-3"
                                >
                                    <option value="pending">Pending Review (Waiting for shipment schedule)</option>
                                    <option value="confirmed">Confirmed (Stock allocation secured)</option>
                                    <option value="ready_to_ship">Ready to Ship (Arrived at warehouse)</option>
                                    <option value="cancelled">Cancelled</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-gray-700 mb-1">
                                    Expected Arrival Date / Period
                                </label>
                                <input
                                    type="text"
                                    value={statusForm.expected_date}
                                    onChange={(e) => setStatusForm({ ...statusForm, expected_date: e.target.value })}
                                    placeholder="e.g. 15 Nov, 2026 or 2-3 Weeks"
                                    className="w-full text-xs rounded-lg border-gray-300 focus:border-[#EF4A23] focus:ring-[#EF4A23] py-2 px-3"
                                />
                                <p className="text-[10px] text-gray-400 mt-1">This date will be displayed to the customer in their account pre-orders tab.</p>
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-gray-700 mb-1">
                                    Admin Notes (Optional)
                                </label>
                                <textarea
                                    rows="3"
                                    value={statusForm.notes}
                                    onChange={(e) => setStatusForm({ ...statusForm, notes: e.target.value })}
                                    placeholder="Internal notes or updates..."
                                    className="w-full text-xs rounded-lg border-gray-300 focus:border-[#EF4A23] focus:ring-[#EF4A23] p-2.5"
                                ></textarea>
                            </div>

                            <div className="flex items-center justify-end gap-3 pt-2">
                                <button
                                    type="button"
                                    onClick={() => setSelectedPreOrder(null)}
                                    className="px-4 py-2 text-xs font-semibold text-gray-600 hover:text-gray-800"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={submitting}
                                    className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs flex items-center gap-1.5 shadow-md disabled:opacity-50 transition"
                                >
                                    <CheckCircle2 className="w-4 h-4" />
                                    <span>{submitting ? 'Saving...' : 'Save Changes'}</span>
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </AdminLayout>
    );
}
