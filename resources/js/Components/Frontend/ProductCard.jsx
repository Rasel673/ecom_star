import React, { useState } from 'react';
import { Link, router, usePage } from '@inertiajs/react';
import { ShoppingCart, Zap, Heart, Clock } from 'lucide-react';

export default function ProductCard({ product }) {
    const { auth } = usePage().props;
    const [wishlistLoading, setWishlistLoading] = useState(false);

    const handleWishlistToggle = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (!auth?.user) {
            router.visit(route('login'));
            return;
        }
        setWishlistLoading(true);
        router.post(route('customer.wishlist.toggle'), {
            product_id: product.id,
        }, {
            preserveScroll: true,
            onFinish: () => setWishlistLoading(false),
        });
    };

    const handleAddToCart = (e) => {
        e.preventDefault();
        e.stopPropagation();
        router.post(route('cart.add'), {
            product_id: product.id,
            quantity: 1,
        }, {
            preserveScroll: true,
        });
    };

    const handleBuyNow = (e) => {
        e.preventDefault();
        e.stopPropagation();
        router.post(route('cart.add'), {
            product_id: product.id,
            quantity: 1,
        }, {
            onSuccess: () => router.visit(route('checkout.index')),
        });
    };

    const price = product.special_price || product.regular_price;
    const hasDiscount = product.special_price && product.regular_price > product.special_price;
    const discountAmount = hasDiscount ? Math.round(((product.regular_price - product.special_price) / product.regular_price) * 100) : 0;
    const isUpcoming = product.stock_status !== 'in_stock';

    return (
        <div className="bg-white rounded-xl border border-gray-200/80 hover:border-gray-300 hover:shadow-xl transition-all duration-300 flex flex-col justify-between group overflow-hidden relative">
            {/* Discount Badge */}
            {hasDiscount && (
                <div className="absolute top-2.5 left-2.5 bg-[#EF4A23] text-white text-[11px] font-bold px-2 py-0.5 rounded shadow-sm z-10">
                    Save {discountAmount}%
                </div>
            )}

            {/* Top Right Badges: Stock Status & Wishlist Heart */}
            <div className="absolute top-2.5 right-2.5 z-10 flex items-center gap-1.5">
                <button
                    onClick={handleWishlistToggle}
                    disabled={wishlistLoading}
                    type="button"
                    title={auth?.user ? "Save to Wishlist" : "Login to save to Wishlist"}
                    className="p-1.5 rounded-full bg-white/90 backdrop-blur-sm border border-gray-200 hover:border-red-300 hover:text-red-500 text-gray-400 transition shadow-sm hover:scale-110 active:scale-95"
                >
                    <Heart className="w-3.5 h-3.5" />
                </button>
                <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                    !isUpcoming 
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' 
                        : 'bg-amber-50 text-amber-700 border border-amber-200'
                }`}>
                    {!isUpcoming ? 'In Stock' : 'Upcoming'}
                </span>
            </div>

            {/* Image */}
            <Link 
                href={route('product.show', product.slug)} 
                className="block p-4 overflow-hidden text-center bg-gray-50/50 relative"
            >
                <img 
                    src={product.thumbnail || 'https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?w=400&h=400&fit=crop'} 
                    alt={product.name}
                    className="w-full h-44 object-contain group-hover:scale-105 transition-transform duration-300 mx-auto"
                    loading="lazy"
                />
            </Link>

            {/* Product Info */}
            <div className="p-4 flex-1 flex flex-col justify-between">
                <div>
                    <Link 
                        href={route('product.show', product.slug)}
                        className="text-sm font-semibold text-gray-900 group-hover:text-[#EF4A23] transition line-clamp-2 leading-snug mb-2"
                        title={product.name}
                    >
                        {product.name}
                    </Link>

                    {/* Key features bullets */}
                    {product.key_features && Array.isArray(product.key_features) && product.key_features.length > 0 && (
                        <ul className="text-xs text-gray-500 space-y-1 mb-4">
                            {product.key_features.slice(0, 3).map((feat, idx) => (
                                <li key={idx} className="flex items-start gap-1.5 line-clamp-1">
                                    <span className="w-1.5 h-1.5 rounded-full bg-gray-400 mt-1.5 shrink-0"></span>
                                    <span>{feat}</span>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>

                <div>
                    {/* Price Tag */}
                    <div className="pt-2 border-t border-gray-100 mb-3 flex items-baseline gap-2">
                        <span className="text-base font-bold text-[#EF4A23]">
                            ৳{Number(price).toLocaleString()}
                        </span>
                        {hasDiscount && (
                            <span className="text-xs text-gray-400 line-through">
                                ৳{Number(product.regular_price).toLocaleString()}
                            </span>
                        )}
                    </div>

                    {/* Action Buttons */}
                    <div className="grid grid-cols-2 gap-2">
                        <button
                            onClick={handleAddToCart}
                            className="w-full flex items-center justify-center gap-1.5 text-xs font-semibold py-2 px-2 rounded-lg bg-gray-100 hover:bg-[#081621] text-gray-800 hover:text-white transition duration-200"
                        >
                            <ShoppingCart className="w-3.5 h-3.5" />
                            <span>Cart</span>
                        </button>
                        {isUpcoming ? (
                            <Link
                                href={`${route('product.show', product.slug)}?preorder=1`}
                                className="w-full flex items-center justify-center gap-1.5 text-xs font-semibold py-2 px-2 rounded-lg bg-amber-500 hover:bg-amber-600 text-white transition duration-200 shadow-sm"
                            >
                                <Clock className="w-3.5 h-3.5" />
                                <span>Pre-Order</span>
                            </Link>
                        ) : (
                            <button
                                onClick={handleBuyNow}
                                className="w-full flex items-center justify-center gap-1.5 text-xs font-semibold py-2 px-2 rounded-lg bg-[#EF4A23] hover:bg-[#d63c17] text-white transition duration-200 shadow-sm"
                            >
                                <Zap className="w-3.5 h-3.5" />
                                <span>Buy Now</span>
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
