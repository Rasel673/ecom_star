import React, { useState } from 'react';
import { Link, router } from '@inertiajs/react';
import FrontendLayout from '@/Layouts/FrontendLayout';
import { Trash2, Plus, Minus, ArrowRight, ShoppingBag, Tag } from 'lucide-react';

export default function Cart({ cartItems, cart = [], subtotal = 0, discount = 0, total = 0, coupon = null }) {
    const [couponCode, setCouponCode] = useState('');
    const items = cartItems || (Array.isArray(cart) ? cart : (cart?.items || []));

    const handleUpdateQuantity = (productId, newQty) => {
        if (newQty < 1) return;
        router.post(route('cart.update'), {
            product_id: productId,
            quantity: newQty,
        }, { preserveScroll: true });
    };

    const handleRemoveItem = (productId) => {
        router.delete(route('cart.remove', productId), { preserveScroll: true });
    };

    const handleApplyCoupon = (e) => {
        e.preventDefault();
        if (couponCode.trim()) {
            router.post(route('cart.coupon'), { code: couponCode }, {
                preserveScroll: true,
                onSuccess: () => setCouponCode(''),
            });
        }
    };

    const handleRemoveCoupon = () => {
        router.delete(route('cart.coupon.remove'), { preserveScroll: true });
    };

    return (
        <FrontendLayout title="Shopping Cart">
            <h1 className="text-xl sm:text-2xl font-black text-gray-900 mb-4 sm:mb-6 flex items-center gap-2">
                <ShoppingBag className="w-5 h-5 sm:w-6 sm:h-6 text-[#EF4A23]" />
                <span>Shopping Cart ({items.length})</span>
            </h1>

            {items.length > 0 ? (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
                    {/* Items List */}
                    <div className="lg:col-span-2 space-y-4">
                        {/* 1. Desktop Table View (Hidden on mobile < md) */}
                        <div className="hidden md:block bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
                            <table className="w-full text-left text-xs">
                                <thead className="bg-gray-50 border-b border-gray-200 text-gray-500 uppercase font-semibold">
                                    <tr>
                                        <th className="p-4">Product</th>
                                        <th className="p-4 text-center">Unit Price</th>
                                        <th className="p-4 text-center">Quantity</th>
                                        <th className="p-4 text-right">Total</th>
                                        <th className="p-4 text-center">Action</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {items.map((item) => (
                                        <tr key={item.id} className="hover:bg-gray-50/50">
                                            <td className="p-4">
                                                <div className="flex items-center gap-3">
                                                    <img
                                                        src={item.thumbnail || 'https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?w=100'}
                                                        alt={item.name}
                                                        className="w-14 h-14 object-contain rounded-lg border border-gray-100 p-1 bg-white shrink-0"
                                                    />
                                                    <div>
                                                        <Link
                                                            href={route('product.show', item.slug)}
                                                            className="font-bold text-gray-900 hover:text-[#EF4A23] transition line-clamp-1"
                                                        >
                                                            {item.name}
                                                        </Link>
                                                        {item.model && (
                                                            <span className="text-[11px] text-gray-400 block">{item.model}</span>
                                                        )}
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="p-4 text-center font-bold text-gray-800">
                                                ৳{Number(item.price).toLocaleString()}
                                            </td>
                                            <td className="p-4 text-center">
                                                <div className="inline-flex items-center border border-gray-300 rounded-lg overflow-hidden bg-gray-50">
                                                    <button
                                                        type="button"
                                                        onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}
                                                        className="p-1.5 hover:bg-gray-200 text-gray-600"
                                                    >
                                                        <Minus className="w-3 h-3" />
                                                    </button>
                                                    <span className="px-3 font-bold">{item.quantity}</span>
                                                    <button
                                                        type="button"
                                                        onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}
                                                        className="p-1.5 hover:bg-gray-200 text-gray-600"
                                                    >
                                                        <Plus className="w-3 h-3" />
                                                    </button>
                                                </div>
                                            </td>
                                            <td className="p-4 text-right font-bold text-[#EF4A23]">
                                                ৳{Number(item.price * item.quantity).toLocaleString()}
                                            </td>
                                            <td className="p-4 text-center">
                                                <button
                                                    type="button"
                                                    onClick={() => handleRemoveItem(item.id)}
                                                    className="text-gray-400 hover:text-rose-600 p-1 rounded-md transition"
                                                    title="Remove from Cart"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* 2. Mobile Card List (Visible only on < md) */}
                        <div className="md:hidden space-y-3">
                            {items.map((item) => (
                                <div key={item.id} className="bg-white rounded-xl border border-gray-200 p-3.5 shadow-sm space-y-3">
                                    <div className="flex items-start gap-3">
                                        <img
                                            src={item.thumbnail || 'https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?w=100'}
                                            alt={item.name}
                                            className="w-16 h-16 object-contain rounded-lg border border-gray-100 p-1 bg-white shrink-0"
                                        />
                                        <div className="flex-1 min-w-0">
                                            <Link
                                                href={route('product.show', item.slug)}
                                                className="text-xs font-bold text-gray-900 hover:text-[#EF4A23] line-clamp-2 leading-snug"
                                            >
                                                {item.name}
                                            </Link>
                                            <span className="text-[11px] text-gray-400 block mt-0.5">{item.model || ''}</span>
                                            <span className="text-xs font-bold text-[#EF4A23] mt-1 block">
                                                ৳{Number(item.price).toLocaleString()}
                                            </span>
                                        </div>
                                        <button
                                            type="button"
                                            onClick={() => handleRemoveItem(item.id)}
                                            className="p-1.5 text-gray-400 hover:text-rose-600 transition shrink-0"
                                            title="Remove"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>

                                    <div className="flex items-center justify-between pt-2 border-t border-gray-100 text-xs">
                                        {/* Stepper */}
                                        <div className="inline-flex items-center border border-gray-300 rounded-lg overflow-hidden bg-gray-50">
                                            <button
                                                type="button"
                                                onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}
                                                className="p-2 hover:bg-gray-200 text-gray-600"
                                            >
                                                <Minus className="w-3.5 h-3.5" />
                                            </button>
                                            <span className="px-3 font-bold text-xs">{item.quantity}</span>
                                            <button
                                                type="button"
                                                onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}
                                                className="p-2 hover:bg-gray-200 text-gray-600"
                                            >
                                                <Plus className="w-3.5 h-3.5" />
                                            </button>
                                        </div>

                                        {/* Total for item */}
                                        <div className="text-right">
                                            <span className="text-[10px] text-gray-400 block">Subtotal</span>
                                            <span className="font-black text-[#EF4A23] text-sm">
                                                ৳{Number(item.price * item.quantity).toLocaleString()}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Coupon Form */}
                        <div className="bg-white rounded-2xl border border-gray-200 p-4 sm:p-5 shadow-sm flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 sm:gap-4">
                            <div className="flex items-center gap-2 text-xs font-bold text-gray-800">
                                <Tag className="w-4 h-4 text-[#EF4A23]" />
                                <span>Have a Voucher or Promo Code?</span>
                            </div>
                            {coupon ? (
                                <div className="flex items-center justify-between sm:justify-start gap-3">
                                    <span className="text-xs bg-emerald-50 text-emerald-700 px-3 py-1 rounded-lg border border-emerald-200 font-bold">
                                        Applied: {coupon.code} (-৳{discount.toLocaleString()})
                                    </span>
                                    <button
                                        type="button"
                                        onClick={handleRemoveCoupon}
                                        className="text-xs text-rose-600 hover:underline font-semibold"
                                    >
                                        Remove
                                    </button>
                                </div>
                            ) : (
                                <form onSubmit={handleApplyCoupon} className="flex items-center gap-2 w-full sm:w-auto">
                                    <input
                                        type="text"
                                        placeholder="TECH1000"
                                        value={couponCode}
                                        onChange={(e) => setCouponCode(e.target.value)}
                                        className="text-xs uppercase p-2 border border-gray-300 rounded-lg focus:border-[#EF4A23] flex-1 sm:w-36"
                                    />
                                    <button
                                        type="submit"
                                        className="bg-[#081621] hover:bg-[#EF4A23] text-white text-xs font-bold px-4 py-2 rounded-lg transition"
                                    >
                                        Apply
                                    </button>
                                </form>
                            )}
                        </div>
                    </div>

                    {/* Order Summary Card */}
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5 sm:p-6 space-y-4 sticky top-20">
                            <h3 className="text-base font-bold text-gray-900 border-b pb-3">Order Summary</h3>
                            
                            <div className="space-y-2 text-xs text-gray-600">
                                <div className="flex items-center justify-between">
                                    <span>Subtotal</span>
                                    <span className="font-bold text-gray-900">৳{subtotal.toLocaleString()}</span>
                                </div>
                                {discount > 0 && (
                                    <div className="flex items-center justify-between text-emerald-600 font-bold">
                                        <span>Discount</span>
                                        <span>-৳{discount.toLocaleString()}</span>
                                    </div>
                                )}
                                <div className="flex items-center justify-between">
                                    <span>Estimated Shipping</span>
                                    <span className="text-gray-500">Calculated at checkout</span>
                                </div>
                            </div>

                            <div className="pt-3 border-t flex items-baseline justify-between">
                                <span className="text-sm font-bold text-gray-900">Total</span>
                                <span className="text-xl font-black text-[#EF4A23]">
                                    ৳{total.toLocaleString()}
                                </span>
                            </div>

                            <Link
                                href={route('checkout.index')}
                                className="w-full flex items-center justify-center gap-2 bg-[#EF4A23] hover:bg-[#d63c17] text-white font-bold text-sm py-3 px-4 rounded-xl shadow-md hover:shadow-orange-500/20 transition"
                            >
                                <span>Proceed to Checkout</span>
                                <ArrowRight className="w-4 h-4" />
                            </Link>

                            <Link
                                href="/"
                                className="w-full block text-center text-xs text-gray-500 hover:text-gray-900 font-semibold transition mt-2"
                            >
                                Continue Shopping
                            </Link>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="bg-white rounded-2xl border border-gray-200 p-8 sm:p-16 text-center shadow-sm">
                    <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-orange-50 text-[#EF4A23] flex items-center justify-center mx-auto mb-4">
                        <ShoppingBag className="w-8 h-8 sm:w-10 sm:h-10" />
                    </div>
                    <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2">Your Shopping Cart is Empty!</h3>
                    <p className="text-xs text-gray-500 max-w-md mx-auto mb-6">
                        Looks like you haven't added anything to your cart yet. Explore our laptops, desktop components, and gadgets!
                    </p>
                    <Link
                        href="/"
                        className="inline-flex items-center gap-2 bg-[#EF4A23] hover:bg-[#d63c17] text-white font-bold text-xs py-3 px-6 rounded-xl shadow-md transition"
                    >
                        <span>Start Shopping</span>
                        <ArrowRight className="w-4 h-4" />
                    </Link>
                </div>
            )}
        </FrontendLayout>
    );
}
