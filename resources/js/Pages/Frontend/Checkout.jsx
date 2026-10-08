import React, { useState } from 'react';
import { useForm, Link } from '@inertiajs/react';
import FrontendLayout from '@/Layouts/FrontendLayout';
import { ShieldCheck, Truck, CreditCard, Banknote, Smartphone, CheckCircle2 } from 'lucide-react';

export default function Checkout({
    cartItems,
    cart = [],
    subtotal = 0,
    discount = 0,
    coupon = null,
    shippingInside = 60,
    shippingOutside = 120,
    user = null,
}) {
    const items = cartItems || (Array.isArray(cart) ? cart : (cart?.items || []));
    const { data, setData, post, processing, errors } = useForm({
        customer_name: user?.name || '',
        customer_email: user?.email || '',
        customer_phone: user?.phone || '',
        customer_address: user?.address || '',
        city: 'Dhaka',
        zone: '',
        notes: '',
        payment_method: 'cod',
    });

    const shippingCost = data.city === 'Dhaka' ? shippingInside : shippingOutside;
    const finalTotal = Math.max(0, subtotal - discount + shippingCost);

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('checkout.store'));
    };

    return (
        <FrontendLayout title="Checkout - Complete Order">
            <h1 className="text-2xl font-black text-gray-900 mb-6">Checkout</h1>

            <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Left 8 Cols: Delivery & Payment Details */}
                <div className="lg:col-span-8 space-y-6">
                    {/* 1. Customer & Shipping Info */}
                    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 space-y-4">
                        <h2 className="text-base font-bold text-gray-900 border-b pb-3 flex items-center gap-2">
                            <Truck className="w-5 h-5 text-[#EF4A23]" />
                            <span>1. Delivery Details</span>
                        </h2>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                            <div>
                                <label className="block font-semibold text-gray-700 mb-1">
                                    Full Name <span className="text-rose-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    required
                                    value={data.customer_name}
                                    onChange={(e) => setData('customer_name', e.target.value)}
                                    className="w-full p-2.5 rounded-lg border border-gray-300 focus:border-[#EF4A23]"
                                    placeholder="Rahim Ahmed"
                                />
                                {errors.customer_name && <p className="text-rose-500 mt-1">{errors.customer_name}</p>}
                            </div>

                            <div>
                                <label className="block font-semibold text-gray-700 mb-1">
                                    Phone Number <span className="text-rose-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    required
                                    value={data.customer_phone}
                                    onChange={(e) => setData('customer_phone', e.target.value)}
                                    className="w-full p-2.5 rounded-lg border border-gray-300 focus:border-[#EF4A23]"
                                    placeholder="017XXXXXXXX"
                                />
                                {errors.customer_phone && <p className="text-rose-500 mt-1">{errors.customer_phone}</p>}
                            </div>

                            <div className="md:col-span-2">
                                <label className="block font-semibold text-gray-700 mb-1">Email Address</label>
                                <input
                                    type="email"
                                    value={data.customer_email}
                                    onChange={(e) => setData('customer_email', e.target.value)}
                                    className="w-full p-2.5 rounded-lg border border-gray-300 focus:border-[#EF4A23]"
                                    placeholder="example@gmail.com"
                                />
                                {errors.customer_email && <p className="text-rose-500 mt-1">{errors.customer_email}</p>}
                            </div>

                            <div>
                                <label className="block font-semibold text-gray-700 mb-1">
                                    City / Region <span className="text-rose-500">*</span>
                                </label>
                                <select
                                    value={data.city}
                                    onChange={(e) => setData('city', e.target.value)}
                                    className="w-full p-2.5 rounded-lg border border-gray-300 focus:border-[#EF4A23]"
                                >
                                    <option value="Dhaka">Inside Dhaka (৳{shippingInside})</option>
                                    <option value="Outside Dhaka">Outside Dhaka (৳{shippingOutside})</option>
                                </select>
                            </div>

                            <div>
                                <label className="block font-semibold text-gray-700 mb-1">Zone / Area</label>
                                <input
                                    type="text"
                                    value={data.zone}
                                    onChange={(e) => setData('zone', e.target.value)}
                                    className="w-full p-2.5 rounded-lg border border-gray-300 focus:border-[#EF4A23]"
                                    placeholder="e.g. Mirpur, Dhanmondi, Uttara"
                                />
                            </div>

                            <div className="md:col-span-2">
                                <label className="block font-semibold text-gray-700 mb-1">
                                    Complete Delivery Address <span className="text-rose-500">*</span>
                                </label>
                                <textarea
                                    required
                                    rows="2"
                                    value={data.customer_address}
                                    onChange={(e) => setData('customer_address', e.target.value)}
                                    className="w-full p-2.5 rounded-lg border border-gray-300 focus:border-[#EF4A23]"
                                    placeholder="House, Road, Area, Landmark"
                                />
                                {errors.customer_address && <p className="text-rose-500 mt-1">{errors.customer_address}</p>}
                            </div>

                            <div className="md:col-span-2">
                                <label className="block font-semibold text-gray-700 mb-1">Order Notes (Optional)</label>
                                <input
                                    type="text"
                                    value={data.notes}
                                    onChange={(e) => setData('notes', e.target.value)}
                                    className="w-full p-2.5 rounded-lg border border-gray-300 focus:border-[#EF4A23]"
                                    placeholder="Special instructions for delivery rider..."
                                />
                            </div>
                        </div>
                    </div>

                    {/* 2. Payment Method */}
                    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 space-y-4">
                        <h2 className="text-base font-bold text-gray-900 border-b pb-3 flex items-center gap-2">
                            <CreditCard className="w-5 h-5 text-[#EF4A23]" />
                            <span>2. Payment Method</span>
                        </h2>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                            <label className={`flex items-center gap-3 p-4 rounded-xl border cursor-pointer transition ${
                                data.payment_method === 'cod' 
                                    ? 'border-[#EF4A23] bg-orange-50/30' 
                                    : 'border-gray-200 hover:bg-gray-50'
                            }`}>
                                <input
                                    type="radio"
                                    name="payment_method"
                                    value="cod"
                                    checked={data.payment_method === 'cod'}
                                    onChange={() => setData('payment_method', 'cod')}
                                    className="text-[#EF4A23] focus:ring-[#EF4A23]"
                                />
                                <div>
                                    <div className="flex items-center gap-2 font-bold text-gray-900">
                                        <Banknote className="w-4 h-4 text-emerald-600" />
                                        <span>Cash on Delivery</span>
                                    </div>
                                    <p className="text-[11px] text-gray-500 mt-0.5">Pay in cash when you receive goods</p>
                                </div>
                            </label>

                            <label className={`flex items-center gap-3 p-4 rounded-xl border cursor-pointer transition ${
                                data.payment_method === 'bkash' 
                                    ? 'border-[#EF4A23] bg-orange-50/30' 
                                    : 'border-gray-200 hover:bg-gray-50'
                            }`}>
                                <input
                                    type="radio"
                                    name="payment_method"
                                    value="bkash"
                                    checked={data.payment_method === 'bkash'}
                                    onChange={() => setData('payment_method', 'bkash')}
                                    className="text-[#EF4A23] focus:ring-[#EF4A23]"
                                />
                                <div>
                                    <div className="flex items-center gap-2 font-bold text-gray-900">
                                        <Smartphone className="w-4 h-4 text-pink-600" />
                                        <span>bKash Payment</span>
                                    </div>
                                    <p className="text-[11px] text-gray-500 mt-0.5">Instant mobile banking payment</p>
                                </div>
                            </label>

                            <label className={`flex items-center gap-3 p-4 rounded-xl border cursor-pointer transition ${
                                data.payment_method === 'nagad' 
                                    ? 'border-[#EF4A23] bg-orange-50/30' 
                                    : 'border-gray-200 hover:bg-gray-50'
                            }`}>
                                <input
                                    type="radio"
                                    name="payment_method"
                                    value="nagad"
                                    checked={data.payment_method === 'nagad'}
                                    onChange={() => setData('payment_method', 'nagad')}
                                    className="text-[#EF4A23] focus:ring-[#EF4A23]"
                                />
                                <div>
                                    <div className="flex items-center gap-2 font-bold text-gray-900">
                                        <Smartphone className="w-4 h-4 text-orange-600" />
                                        <span>Nagad Payment</span>
                                    </div>
                                    <p className="text-[11px] text-gray-500 mt-0.5">Direct mobile payment</p>
                                </div>
                            </label>

                            <label className={`flex items-center gap-3 p-4 rounded-xl border cursor-pointer transition ${
                                data.payment_method === 'card' 
                                    ? 'border-[#EF4A23] bg-orange-50/30' 
                                    : 'border-gray-200 hover:bg-gray-50'
                            }`}>
                                <input
                                    type="radio"
                                    name="payment_method"
                                    value="card"
                                    checked={data.payment_method === 'card'}
                                    onChange={() => setData('payment_method', 'card')}
                                    className="text-[#EF4A23] focus:ring-[#EF4A23]"
                                />
                                <div>
                                    <div className="flex items-center gap-2 font-bold text-gray-900">
                                        <CreditCard className="w-4 h-4 text-blue-600" />
                                        <span>Credit / Debit Card</span>
                                    </div>
                                    <p className="text-[11px] text-gray-500 mt-0.5">Visa, Mastercard, AMEX</p>
                                </div>
                            </label>
                        </div>
                    </div>
                </div>

                {/* Right 4 Cols: Order Overview & Confirmation */}
                <div className="lg:col-span-4">
                    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 sticky top-24 space-y-4">
                        <h3 className="text-base font-bold text-gray-900 border-b pb-3">Order Overview</h3>

                        {/* Items list preview */}
                        <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
                            {items.map((item) => (
                                <div key={item.id} className="flex items-center justify-between gap-3 text-xs">
                                    <div className="flex items-center gap-2 min-w-0">
                                        <img
                                            src={item.thumbnail || 'https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?w=60'}
                                            alt={item.name}
                                            className="w-10 h-10 object-contain rounded border p-0.5 shrink-0"
                                        />
                                        <div className="truncate">
                                            <p className="font-semibold text-gray-900 truncate">{item.name}</p>
                                            <p className="text-gray-400 text-[11px]">Qty: {item.quantity}</p>
                                        </div>
                                    </div>
                                    <span className="font-bold text-gray-800 shrink-0">
                                        ৳{(item.price * item.quantity).toLocaleString()}
                                    </span>
                                </div>
                            ))}
                        </div>

                        {/* Breakdown */}
                        <div className="pt-4 border-t space-y-2 text-xs text-gray-600">
                            <div className="flex justify-between">
                                <span>Subtotal</span>
                                <span className="font-bold text-gray-900">৳{subtotal.toLocaleString()}</span>
                            </div>
                            {discount > 0 && (
                                <div className="flex justify-between text-emerald-600 font-bold">
                                    <span>Voucher Discount</span>
                                    <span>-৳{discount.toLocaleString()}</span>
                                </div>
                            )}
                            <div className="flex justify-between">
                                <span>Delivery Fee</span>
                                <span className="font-bold text-gray-900">৳{shippingCost}</span>
                            </div>
                        </div>

                        <div className="pt-3 border-t flex items-baseline justify-between">
                            <span className="text-sm font-bold text-gray-900">Final Total</span>
                            <span className="text-2xl font-black text-[#EF4A23]">
                                ৳{finalTotal.toLocaleString()}
                            </span>
                        </div>

                        <button
                            type="submit"
                            disabled={processing}
                            className="w-full bg-[#EF4A23] hover:bg-[#d63c17] disabled:opacity-50 text-white font-bold text-sm py-3.5 px-4 rounded-xl shadow-md hover:shadow-orange-500/20 transition flex items-center justify-center gap-2"
                        >
                            <span>{processing ? 'Processing Order...' : 'Confirm Order'}</span>
                        </button>

                        <p className="text-[11px] text-gray-400 text-center flex items-center justify-center gap-1">
                            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                            <span>Safe & Secure 256-Bit SSL Checkout</span>
                        </p>
                    </div>
                </div>
            </form>
        </FrontendLayout>
    );
}
