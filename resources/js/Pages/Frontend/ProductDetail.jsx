import React, { useState, useEffect } from 'react';
import { Link, router, usePage } from '@inertiajs/react';
import FrontendLayout from '@/Layouts/FrontendLayout';
import ProductCard from '@/Components/Frontend/ProductCard';
import { 
    ChevronRight, 
    ShoppingCart, 
    Zap, 
    ShieldCheck, 
    Truck, 
    RotateCcw, 
    Star, 
    Plus, 
    Minus,
    Check,
    MessageSquare,
    Heart,
    Clock,
    X,
    Calendar,
    Phone,
    MapPin,
    Mail,
    User
} from 'lucide-react';

export default function ProductDetail({ product, relatedProducts = [], seo = {} }) {
    const { auth } = usePage().props;
    const [quantity, setQuantity] = useState(1);
    const [activeTab, setActiveTab] = useState('specs'); // 'specs', 'description', 'reviews'
    const [wishlistLoading, setWishlistLoading] = useState(false);
    const [showPreOrderModal, setShowPreOrderModal] = useState(false);
    const [preOrderForm, setPreOrderForm] = useState({
        customer_name: auth?.user?.name || '',
        customer_phone: auth?.user?.phone || '',
        customer_email: auth?.user?.email || '',
        delivery_address: '',
        quantity: 1,
        notes: '',
    });
    const [preOrderSubmitting, setPreOrderSubmitting] = useState(false);

    useEffect(() => {
        if (typeof window !== 'undefined') {
            const params = new URLSearchParams(window.location.search);
            if (params.get('preorder') === '1') {
                setShowPreOrderModal(true);
            }
        }
    }, []);

    const [reviewForm, setReviewForm] = useState({
        name: auth?.user?.name || '',
        rating: 5,
        comment: '',
    });

    const isUpcoming = product.stock_status !== 'in_stock';
    const price = product.special_price || product.regular_price;
    const hasDiscount = product.special_price && product.regular_price > product.special_price;

    const handleWishlistToggle = () => {
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

    const handlePreOrderSubmit = (e) => {
        e.preventDefault();
        setPreOrderSubmitting(true);
        router.post(route('preorder.store'), {
            product_id: product.id,
            ...preOrderForm,
        }, {
            preserveScroll: true,
            onSuccess: () => {
                setShowPreOrderModal(false);
            },
            onFinish: () => setPreOrderSubmitting(false),
        });
    };

    const handleAddToCart = () => {
        router.post(route('cart.add'), {
            product_id: product.id,
            quantity: quantity,
        }, {
            preserveScroll: true,
        });
    };

    const handleBuyNow = () => {
        router.post(route('cart.add'), {
            product_id: product.id,
            quantity: quantity,
        }, {
            onSuccess: () => router.visit(route('checkout.index')),
        });
    };

    const handleReviewSubmit = (e) => {
        e.preventDefault();
        router.post(route('product.review', product.slug), reviewForm, {
            preserveScroll: true,
            onSuccess: () => setReviewForm({ name: '', rating: 5, comment: '' }),
        });
    };

    return (
        <FrontendLayout 
            title={seo.title} 
            description={seo.description}
            image={product.thumbnail}
        >
            {/* Breadcrumb */}
            <nav className="flex items-center gap-1.5 text-[11px] sm:text-xs text-gray-500 mb-4 sm:mb-6 overflow-x-auto whitespace-nowrap pb-1">
                <Link href="/" className="hover:text-[#EF4A23] shrink-0">Home</Link>
                <ChevronRight className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                {product.category && (
                    <>
                        <Link href={route('category.show', product.category.slug)} className="hover:text-[#EF4A23] shrink-0">
                            {product.category.name}
                        </Link>
                        <ChevronRight className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                    </>
                )}
                <span className="text-gray-900 font-semibold truncate max-w-xs">{product.name}</span>
            </nav>

            {/* Main Product Card */}
            <div className="bg-white rounded-2xl border border-gray-200/90 shadow-sm p-4 sm:p-6 md:p-8 mb-8 sm:mb-10">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8">
                    {/* Left: Product Image */}
                    <div className="lg:col-span-5 flex flex-col items-center justify-center p-4 bg-gray-50/50 rounded-xl border border-gray-100">
                        <img
                            src={product.thumbnail || 'https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?w=600&h=600&fit=crop'}
                            alt={product.name}
                            className="max-h-64 sm:max-h-96 w-auto object-contain hover:scale-105 transition-transform duration-300"
                        />
                    </div>

                    {/* Right: Product Details & Purchase Actions */}
                    <div className="lg:col-span-7 flex flex-col justify-between">
                        <div>
                            <h1 className="text-lg sm:text-xl md:text-2xl font-black text-gray-900 leading-snug mb-2">
                                {product.name}
                            </h1>

                            <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-xs text-gray-500 mb-4 pb-4 border-b border-gray-100">
                                {product.model && (
                                    <span className="bg-gray-100 px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-md text-gray-700 font-medium text-[11px] sm:text-xs">
                                        Model: <strong className="text-gray-900">{product.model}</strong>
                                    </span>
                                )}
                                {product.sku && (
                                    <span className="bg-gray-100 px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-md text-gray-700 font-medium text-[11px] sm:text-xs">
                                        Product ID: <strong className="text-gray-900">{product.sku}</strong>
                                    </span>
                                )}
                                <span className={`px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-md font-semibold text-[11px] sm:text-xs ${
                                    product.stock_status === 'in_stock' 
                                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' 
                                        : 'bg-amber-50 text-amber-700 border border-amber-200'
                                }`}>
                                    Status: {product.stock_status === 'in_stock' ? 'In Stock' : 'Upcoming'}
                                </span>
                            </div>

                            {/* Key Features */}
                            {product.key_features && Array.isArray(product.key_features) && (
                                <div className="mb-5 sm:mb-6">
                                    <h4 className="text-xs font-bold text-gray-900 uppercase tracking-wider mb-2">
                                        Key Features:
                                    </h4>
                                    <ul className="grid grid-cols-1 md:grid-cols-2 gap-1.5 sm:gap-2 text-xs text-gray-600">
                                        {product.key_features.map((feature, idx) => (
                                            <li key={idx} className="flex items-start gap-1.5">
                                                <span className="w-1.5 h-1.5 rounded-full bg-[#EF4A23] mt-1.5 shrink-0"></span>
                                                <span className="leading-snug">{feature}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}

                            {/* Pricing Box */}
                            <div className="bg-[#fcf8f6] border border-orange-100 rounded-xl p-3.5 sm:p-4 mb-5 sm:mb-6">
                                <div className="flex flex-wrap items-baseline gap-2 sm:gap-3">
                                    <span className="text-2xl sm:text-3xl font-black text-[#EF4A23]">
                                        ৳{Number(price).toLocaleString()}
                                    </span>
                                    {hasDiscount && (
                                        <>
                                            <span className="text-xs sm:text-sm text-gray-400 line-through">
                                                ৳{Number(product.regular_price).toLocaleString()}
                                            </span>
                                            <span className="text-[10px] sm:text-xs bg-[#EF4A23] text-white px-2 py-0.5 rounded font-bold">
                                                Cash Discount
                                            </span>
                                        </>
                                    )}
                                </div>
                                <p className="text-[10px] sm:text-[11px] text-gray-500 mt-1">
                                    Special Price for Online Order & Cash on Delivery. Card / EMI prices may vary.
                                </p>
                            </div>
                        </div>

                        {/* Quantity & Buy Buttons */}
                        <div className="pt-4 border-t border-gray-100">
                            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4">
                                {/* Quantity */}
                                <div className="flex items-center justify-between sm:justify-start border border-gray-300 rounded-xl overflow-hidden bg-gray-50 w-full sm:w-auto">
                                    <button
                                        type="button"
                                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                        className="p-3 sm:p-2.5 hover:bg-gray-200 text-gray-600 transition"
                                    >
                                        <Minus className="w-4 h-4" />
                                    </button>
                                    <span className="px-4 py-2 font-bold text-sm text-gray-900 min-w-[40px] text-center">
                                        {quantity}
                                    </span>
                                    <button
                                        type="button"
                                        onClick={() => setQuantity(quantity + 1)}
                                        className="p-3 sm:p-2.5 hover:bg-gray-200 text-gray-600 transition"
                                    >
                                        <Plus className="w-4 h-4" />
                                    </button>
                                </div>

                                {/* Buy Now or Pre-Order */}
                                {isUpcoming ? (
                                    <button
                                        type="button"
                                        onClick={() => setShowPreOrderModal(true)}
                                        className="flex-1 flex items-center justify-center gap-2 bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs sm:text-sm py-3 px-6 rounded-xl shadow-md hover:shadow-amber-500/20 transition"
                                    >
                                        <Clock className="w-4 h-4" />
                                        <span>Pre-Order Now</span>
                                    </button>
                                ) : (
                                    <button
                                        type="button"
                                        onClick={handleBuyNow}
                                        className="flex-1 flex items-center justify-center gap-2 bg-[#EF4A23] hover:bg-[#d63c17] text-white font-bold text-xs sm:text-sm py-3 px-6 rounded-xl shadow-md hover:shadow-orange-500/20 transition"
                                    >
                                        <Zap className="w-4 h-4" />
                                        <span>Buy Now</span>
                                    </button>
                                )}

                                {/* Add to Cart */}
                                <button
                                    type="button"
                                    onClick={handleAddToCart}
                                    className="flex-1 flex items-center justify-center gap-2 bg-[#081621] hover:bg-[#112538] text-white font-bold text-xs sm:text-sm py-3 px-6 rounded-xl transition shadow-sm"
                                >
                                    <ShoppingCart className="w-4 h-4" />
                                    <span>Add to Cart</span>
                                </button>

                                {/* Wishlist / Favorite Button */}
                                <button
                                    type="button"
                                    onClick={handleWishlistToggle}
                                    disabled={wishlistLoading}
                                    title={auth?.user ? "Save to Favorites" : "Login to save to Favorites"}
                                    className="p-3 rounded-xl border border-gray-300 hover:border-red-400 hover:bg-red-50 text-gray-500 hover:text-red-600 transition flex items-center justify-center"
                                >
                                    <Heart className="w-5 h-5" />
                                </button>
                            </div>

                            {!isUpcoming && (
                                <div className="mt-3 text-right">
                                    <button
                                        type="button"
                                        onClick={() => setShowPreOrderModal(true)}
                                        className="text-xs text-gray-500 hover:text-[#EF4A23] underline flex items-center gap-1 ml-auto"
                                    >
                                        <Clock className="w-3.5 h-3.5" />
                                        <span>Need bulk quantity or upcoming batch? Request Pre-Order</span>
                                    </button>
                                </div>
                            )}

                            {/* Trust badges */}
                            <div className="grid grid-cols-3 gap-2 mt-5 sm:mt-6 pt-4 border-t border-gray-100 text-[10px] sm:text-[11px] text-gray-500 text-center">
                                <div className="flex flex-col sm:flex-row items-center justify-center gap-1">
                                    <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                                    <span>Official Warranty</span>
                                </div>
                                <div className="flex flex-col sm:flex-row items-center justify-center gap-1">
                                    <Truck className="w-4 h-4 text-blue-600 shrink-0" />
                                    <span>Express Delivery</span>
                                </div>
                                <div className="flex flex-col sm:flex-row items-center justify-center gap-1">
                                    <RotateCcw className="w-4 h-4 text-orange-600 shrink-0" />
                                    <span>7 Days Return</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Specifications & Reviews Tabs */}
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-4 sm:p-6 md:p-8 mb-10 sm:mb-12">
                {/* Responsive Horizontal Scroll Tab Navigation */}
                <div className="flex items-center gap-4 sm:gap-6 border-b border-gray-200 pb-2 mb-6 text-xs sm:text-sm font-bold overflow-x-auto whitespace-nowrap">
                    <button
                        type="button"
                        onClick={() => setActiveTab('specs')}
                        className={`pb-2 border-b-2 transition shrink-0 ${
                            activeTab === 'specs'
                                ? 'border-[#EF4A23] text-[#EF4A23]'
                                : 'border-transparent text-gray-500 hover:text-gray-900'
                        }`}
                    >
                        Specification
                    </button>
                    <button
                        type="button"
                        onClick={() => setActiveTab('description')}
                        className={`pb-2 border-b-2 transition shrink-0 ${
                            activeTab === 'description'
                                ? 'border-[#EF4A23] text-[#EF4A23]'
                                : 'border-transparent text-gray-500 hover:text-gray-900'
                        }`}
                    >
                        Description
                    </button>
                    <button
                        type="button"
                        onClick={() => setActiveTab('reviews')}
                        className={`pb-2 border-b-2 transition flex items-center gap-1.5 shrink-0 ${
                            activeTab === 'reviews'
                                ? 'border-[#EF4A23] text-[#EF4A23]'
                                : 'border-transparent text-gray-500 hover:text-gray-900'
                        }`}
                    >
                        <span>Questions & Reviews</span>
                        <span className="bg-gray-100 text-gray-600 text-[10px] sm:text-xs px-2 py-0.5 rounded-full">
                            {product.reviews?.length || 0}
                        </span>
                    </button>
                </div>

                {/* Tab 1: Specifications Table */}
                {activeTab === 'specs' && (
                    <div>
                        {product.specifications && Object.keys(product.specifications).length > 0 ? (
                            <div className="divide-y divide-gray-100 text-xs border border-gray-200 rounded-xl overflow-hidden">
                                {Object.entries(product.specifications).map(([key, val], idx) => (
                                    <div 
                                        key={idx} 
                                        className={`grid grid-cols-1 sm:grid-cols-3 p-3 sm:p-3.5 ${
                                            idx % 2 === 0 ? 'bg-gray-50/50' : 'bg-white'
                                        }`}
                                    >
                                        <span className="font-bold text-gray-700">{key}</span>
                                        <span className="sm:col-span-2 text-gray-600 mt-1 sm:mt-0 leading-relaxed">{val}</span>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-xs text-gray-500">Full specification details will be updated shortly.</p>
                        )}
                    </div>
                )}

                {/* Tab 2: Detailed Description */}
                {activeTab === 'description' && (
                    <div className="prose prose-sm max-w-none text-xs text-gray-700 leading-relaxed space-y-4">
                        <p>{product.description || 'No detailed description available for this item.'}</p>
                    </div>
                )}

                {/* Tab 3: Reviews & Question */}
                {activeTab === 'reviews' && (
                    <div className="space-y-6 sm:space-y-8">
                        {/* Review Form */}
                        <form onSubmit={handleReviewSubmit} className="bg-gray-50 p-4 sm:p-5 rounded-xl border border-gray-200 space-y-4">
                            <h4 className="text-sm font-bold text-gray-900">Write a Review for {product.name}</h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-semibold text-gray-700 mb-1">Your Name</label>
                                    <input
                                        type="text"
                                        required
                                        value={reviewForm.name}
                                        onChange={(e) => setReviewForm({ ...reviewForm, name: e.target.value })}
                                        className="w-full text-xs p-2.5 rounded-lg border border-gray-300 focus:border-[#EF4A23]"
                                        placeholder="Rahim Ahmed"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold text-gray-700 mb-1">Rating</label>
                                    <select
                                        value={reviewForm.rating}
                                        onChange={(e) => setReviewForm({ ...reviewForm, rating: Number(e.target.value) })}
                                        className="w-full text-xs p-2.5 rounded-lg border border-gray-300 focus:border-[#EF4A23]"
                                    >
                                        <option value="5">⭐⭐⭐⭐⭐ (5/5 Excellent)</option>
                                        <option value="4">⭐⭐⭐⭐ (4/5 Very Good)</option>
                                        <option value="3">⭐⭐⭐ (3/5 Average)</option>
                                        <option value="2">⭐⭐ (2/5 Below Average)</option>
                                        <option value="1">⭐ (1/5 Poor)</option>
                                    </select>
                                </div>
                            </div>
                            <div>
                                <label className="block text-xs font-semibold text-gray-700 mb-1">Your Feedback / Review</label>
                                <textarea
                                    required
                                    rows="3"
                                    value={reviewForm.comment}
                                    onChange={(e) => setReviewForm({ ...reviewForm, comment: e.target.value })}
                                    className="w-full text-xs p-2.5 rounded-lg border border-gray-300 focus:border-[#EF4A23]"
                                    placeholder="Write your honest experience with this product..."
                                />
                            </div>
                            <button
                                type="submit"
                                className="w-full sm:w-auto bg-[#EF4A23] hover:bg-[#d63c17] text-white text-xs font-bold py-2.5 px-6 rounded-lg transition"
                            >
                                Submit Review
                            </button>
                        </form>

                        {/* Reviews List */}
                        {product.reviews && product.reviews.length > 0 ? (
                            <div className="space-y-3 sm:space-y-4">
                                {product.reviews.map((rev) => (
                                    <div key={rev.id} className="p-3.5 sm:p-4 rounded-xl border border-gray-200">
                                        <div className="flex items-center justify-between mb-1">
                                            <span className="font-bold text-xs text-gray-900">{rev.name}</span>
                                            <div className="flex items-center text-amber-500">
                                                {Array.from({ length: rev.rating }).map((_, i) => (
                                                    <Star key={i} className="w-3.5 h-3.5 fill-current" />
                                                ))}
                                            </div>
                                        </div>
                                        <p className="text-xs text-gray-600 mt-2">{rev.comment}</p>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-xs text-gray-400 text-center py-4">No reviews yet. Be the first to review this product!</p>
                        )}
                    </div>
                )}
            </div>

            {/* Related Products Section */}
            {relatedProducts.length > 0 && (
                <div className="mb-14">
                    <h2 className="text-lg md:text-xl font-black text-gray-900 mb-4 sm:mb-6 pb-2 border-b">
                        Related Products
                    </h2>
                    <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-3 sm:gap-5">
                        {relatedProducts.map((rel) => (
                            <ProductCard key={rel.id} product={rel} />
                        ))}
                    </div>
                </div>
            )}

            {/* Mobile Sticky Quick Buy Action Bar (Visible above bottom dock on phone) */}
            <div className="md:hidden fixed bottom-[50px] left-0 right-0 z-30 bg-white/95 backdrop-blur-md border-t border-gray-200 px-3 py-2 flex items-center justify-between shadow-2xl">
                <div>
                    <span className="text-[10px] text-gray-500 block uppercase font-medium">Price</span>
                    <span className="text-base font-black text-[#EF4A23]">৳{Number(price).toLocaleString()}</span>
                </div>
                <div className="flex items-center gap-2">
                    <button
                        type="button"
                        onClick={handleAddToCart}
                        className="p-2 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-800 transition"
                        title="Add to Cart"
                    >
                        <ShoppingCart className="w-4 h-4" />
                    </button>
                    <button
                        type="button"
                        onClick={handleBuyNow}
                        className="px-4 py-2 rounded-xl bg-[#EF4A23] hover:bg-[#d63c17] text-white font-bold text-xs flex items-center gap-1.5 shadow-md"
                    >
                        <Zap className="w-3.5 h-3.5" />
                        <span>Buy Now</span>
                    </button>
                </div>
            </div>

            {/* Pre-Order Modal */}
            {showPreOrderModal && (
                <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
                    <div className="bg-white rounded-2xl max-w-lg w-full overflow-hidden shadow-2xl border border-gray-100">
                        {/* Header */}
                        <div className="bg-[#081621] px-6 py-4 flex items-center justify-between text-white">
                            <div className="flex items-center gap-2.5">
                                <Clock className="w-5 h-5 text-amber-400" />
                                <div>
                                    <h3 className="text-base font-bold">Pre-Order Product</h3>
                                    <p className="text-[11px] text-gray-300">Reserve upcoming or priority stock</p>
                                </div>
                            </div>
                            <button
                                onClick={() => setShowPreOrderModal(false)}
                                className="text-gray-400 hover:text-white p-1 rounded-lg hover:bg-white/10 transition"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Modal Body */}
                        <form onSubmit={handlePreOrderSubmit} className="p-6 space-y-4">
                            {/* Product Info Summary */}
                            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl border border-gray-200">
                                <img
                                    src={product.thumbnail || 'https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?w=100&h=100&fit=crop'}
                                    alt={product.name}
                                    className="w-12 h-12 object-contain bg-white rounded-lg p-1 border"
                                />
                                <div className="flex-1 min-w-0">
                                    <h4 className="text-xs font-bold text-gray-900 truncate">{product.name}</h4>
                                    <div className="flex items-center gap-2 mt-0.5">
                                        <span className="text-xs font-black text-[#EF4A23]">৳{Number(price).toLocaleString()}</span>
                                        <span className="text-[10px] bg-amber-100 text-amber-800 px-1.5 py-0.2 rounded font-semibold">Pre-Order</span>
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-xs font-semibold text-gray-700 mb-1">Your Full Name *</label>
                                    <input
                                        type="text"
                                        required
                                        value={preOrderForm.customer_name}
                                        onChange={(e) => setPreOrderForm({ ...preOrderForm, customer_name: e.target.value })}
                                        placeholder="e.g. Tanvir Ahmed"
                                        className="w-full text-xs rounded-lg border-gray-300 focus:border-[#EF4A23] focus:ring-[#EF4A23] py-2 px-3"
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs font-semibold text-gray-700 mb-1">Phone Number *</label>
                                    <input
                                        type="tel"
                                        required
                                        value={preOrderForm.customer_phone}
                                        onChange={(e) => setPreOrderForm({ ...preOrderForm, customer_phone: e.target.value })}
                                        placeholder="01XXXXXXXXX"
                                        className="w-full text-xs rounded-lg border-gray-300 focus:border-[#EF4A23] focus:ring-[#EF4A23] py-2 px-3"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-xs font-semibold text-gray-700 mb-1">Email Address (Optional)</label>
                                    <input
                                        type="email"
                                        value={preOrderForm.customer_email}
                                        onChange={(e) => setPreOrderForm({ ...preOrderForm, customer_email: e.target.value })}
                                        placeholder="yourname@domain.com"
                                        className="w-full text-xs rounded-lg border-gray-300 focus:border-[#EF4A23] focus:ring-[#EF4A23] py-2 px-3"
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs font-semibold text-gray-700 mb-1">Pre-Order Quantity *</label>
                                    <input
                                        type="number"
                                        min="1"
                                        required
                                        value={preOrderForm.quantity}
                                        onChange={(e) => setPreOrderForm({ ...preOrderForm, quantity: Math.max(1, parseInt(e.target.value) || 1) })}
                                        className="w-full text-xs rounded-lg border-gray-300 focus:border-[#EF4A23] focus:ring-[#EF4A23] py-2 px-3"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-gray-700 mb-1">Delivery Address *</label>
                                <textarea
                                    required
                                    rows="2"
                                    value={preOrderForm.delivery_address}
                                    onChange={(e) => setPreOrderForm({ ...preOrderForm, delivery_address: e.target.value })}
                                    placeholder="House, Road, Area, City"
                                    className="w-full text-xs rounded-lg border-gray-300 focus:border-[#EF4A23] focus:ring-[#EF4A23] py-2 px-3"
                                ></textarea>
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-gray-700 mb-1">Notes / Specific Requirements (Optional)</label>
                                <textarea
                                    rows="2"
                                    value={preOrderForm.notes}
                                    onChange={(e) => setPreOrderForm({ ...preOrderForm, notes: e.target.value })}
                                    placeholder="e.g. Preferred brand color, delivery timing preference..."
                                    className="w-full text-xs rounded-lg border-gray-300 focus:border-[#EF4A23] focus:ring-[#EF4A23] py-2 px-3"
                                ></textarea>
                            </div>

                            <p className="text-[11px] text-gray-500 bg-amber-50 p-2.5 rounded-lg border border-amber-200">
                                💡 Our customer care representative will call you within 24 hours to confirm estimated delivery time and booking.
                            </p>

                            {/* Buttons */}
                            <div className="flex items-center justify-end gap-3 pt-2">
                                <button
                                    type="button"
                                    onClick={() => setShowPreOrderModal(false)}
                                    className="px-4 py-2 text-xs font-semibold text-gray-600 hover:text-gray-800"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={preOrderSubmitting}
                                    className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs flex items-center gap-1.5 shadow-md disabled:opacity-50 transition"
                                >
                                    <Clock className="w-4 h-4" />
                                    <span>{preOrderSubmitting ? 'Submitting...' : 'Confirm Pre-Order'}</span>
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </FrontendLayout>
    );
}
