import React from 'react';
import { Link } from '@inertiajs/react';
import FrontendLayout from '@/Layouts/FrontendLayout';
import { CheckCircle2, PackageCheck, Printer, ArrowRight } from 'lucide-react';

export default function OrderSuccess({ order }) {
    return (
        <FrontendLayout title={`Order Confirmed #${order.order_number}`}>
            <div className="max-w-3xl mx-auto py-8">
                {/* Confirmation Box */}
                <div className="bg-white rounded-3xl border border-gray-200 shadow-sm p-8 text-center mb-8">
                    <div className="w-20 h-20 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
                        <CheckCircle2 className="w-12 h-12" />
                    </div>
                    <h1 className="text-2xl md:text-3xl font-black text-gray-900 mb-2">
                        Thank You! Your Order Has Been Placed.
                    </h1>
                    <p className="text-xs text-gray-500 max-w-md mx-auto mb-4">
                        We have received your order and our team is preparing it. A verification SMS & call will be sent to your phone shortly.
                    </p>
                    <div className="inline-block bg-gray-50 border border-gray-200 rounded-xl px-5 py-2.5">
                        <span className="text-xs text-gray-500 block">Order Tracking Number:</span>
                        <span className="text-lg font-black text-[#EF4A23]">{order.order_number}</span>
                    </div>
                </div>

                {/* Order Details Invoice */}
                <div className="bg-white rounded-3xl border border-gray-200 shadow-sm p-6 md:p-8 space-y-6">
                    <div className="flex items-center justify-between border-b pb-4">
                        <h3 className="font-bold text-sm text-gray-900">Order Invoice Summary</h3>
                        <span className="text-xs bg-orange-50 text-orange-700 px-3 py-1 rounded-full font-bold border border-orange-200 uppercase">
                            {order.order_status}
                        </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-gray-600">
                        <div>
                            <span className="font-bold text-gray-900 block mb-1">Customer Information:</span>
                            <p>{order.customer_name}</p>
                            <p>{order.customer_phone}</p>
                            {order.customer_email && <p>{order.customer_email}</p>}
                        </div>
                        <div>
                            <span className="font-bold text-gray-900 block mb-1">Delivery Address:</span>
                            <p>{order.customer_address}</p>
                            <p>{order.city}</p>
                        </div>
                    </div>

                    {/* Items table */}
                    <div className="border border-gray-100 rounded-xl overflow-hidden">
                        <table className="w-full text-left text-xs">
                            <thead className="bg-gray-50 text-gray-500 font-semibold border-b">
                                <tr>
                                    <th className="p-3">Product</th>
                                    <th className="p-3 text-center">Qty</th>
                                    <th className="p-3 text-right">Price</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {order.items?.map((item) => (
                                    <tr key={item.id}>
                                        <td className="p-3 font-medium text-gray-800">{item.product_name}</td>
                                        <td className="p-3 text-center text-gray-600">{item.quantity}</td>
                                        <td className="p-3 text-right font-bold text-gray-900">৳{Number(item.total_price).toLocaleString()}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Totals */}
                    <div className="border-t pt-4 space-y-1.5 text-xs text-gray-600">
                        <div className="flex justify-between">
                            <span>Subtotal:</span>
                            <span>৳{Number(order.subtotal).toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between">
                            <span>Shipping Cost:</span>
                            <span>৳{Number(order.shipping_cost).toLocaleString()}</span>
                        </div>
                        {order.discount > 0 && (
                            <div className="flex justify-between text-emerald-600">
                                <span>Discount:</span>
                                <span>-৳{Number(order.discount).toLocaleString()}</span>
                            </div>
                        )}
                        <div className="flex justify-between text-base font-black text-[#EF4A23] pt-2 border-t">
                            <span>Total Paid / Payable:</span>
                            <span>৳{Number(order.total).toLocaleString()}</span>
                        </div>
                    </div>

                    <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-4">
                        <Link
                            href="/"
                            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#081621] hover:bg-[#EF4A23] text-white text-xs font-bold py-3 px-6 rounded-xl transition"
                        >
                            <span>Back to Shopping</span>
                            <ArrowRight className="w-4 h-4" />
                        </Link>
                        <button
                            onClick={() => window.print()}
                            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 border border-gray-300 hover:bg-gray-50 text-gray-700 text-xs font-bold py-3 px-6 rounded-xl transition"
                        >
                            <Printer className="w-4 h-4" />
                            <span>Print Receipt</span>
                        </button>
                    </div>
                </div>
            </div>
        </FrontendLayout>
    );
}
