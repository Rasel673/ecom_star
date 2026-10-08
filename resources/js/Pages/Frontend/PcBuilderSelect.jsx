import React from 'react';
import { Link, router } from '@inertiajs/react';
import FrontendLayout from '@/Layouts/FrontendLayout';
import { ArrowLeft, Plus } from 'lucide-react';

export default function PcBuilderSelect({ componentSlug, slotId, category, products }) {
    const handleSelectProduct = (product) => {
        let saved = {};
        try {
            saved = JSON.parse(localStorage.getItem('startech_pc_build') || '{}');
        } catch (e) {}

        const regularPrice = parseFloat(product.regular_price) || 0;
        const specialPrice = product.special_price ? parseFloat(product.special_price) : null;
        const effectivePrice = specialPrice !== null && specialPrice > 0 ? specialPrice : regularPrice;

        const cleanProduct = {
            id: product.id,
            name: product.name,
            slug: product.slug,
            thumbnail: product.thumbnail,
            regular_price: regularPrice,
            special_price: specialPrice,
            price: effectivePrice,
            model: product.model,
        };

        const targetKey = slotId || componentSlug;
        saved[targetKey] = cleanProduct;
        localStorage.setItem('startech_pc_build', JSON.stringify(saved));
        router.visit(route('pcbuilder.index'));
    };

    return (
        <FrontendLayout title={`Choose ${category?.name || 'Component'} - PC Builder`}>
            {/* Top Bar */}
            <div className="flex items-center justify-between mb-6">
                <div>
                    <Link
                        href={route('pcbuilder.index')}
                        className="inline-flex items-center gap-1.5 text-xs text-gray-500 hover:text-[#EF4A23] font-semibold mb-2"
                    >
                        <ArrowLeft className="w-3.5 h-3.5" />
                        <span>Back to PC Builder</span>
                    </Link>
                    <h1 className="text-xl md:text-2xl font-black text-gray-900">
                        Select {category?.name || 'Component'}
                    </h1>
                </div>
            </div>

            {/* Product List */}
            {products.data.length > 0 ? (
                <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden divide-y divide-gray-100">
                    {products.data.map((product) => {
                        const reg = parseFloat(product.regular_price) || 0;
                        const spec = product.special_price ? parseFloat(product.special_price) : null;
                        const displayPrice = spec !== null && spec > 0 ? spec : reg;

                        return (
                            <div key={product.id} className="p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hover:bg-gray-50/50 transition">
                                <div className="flex items-center gap-4 flex-1">
                                    <img
                                        src={product.thumbnail || 'https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?w=100'}
                                        alt={product.name}
                                        className="w-16 h-16 object-contain rounded-lg border border-gray-100 p-1 bg-white shrink-0"
                                    />
                                    <div>
                                        <h3 className="text-sm font-bold text-gray-900 hover:text-[#EF4A23] transition">
                                            {product.name}
                                        </h3>
                                        {product.key_features && Array.isArray(product.key_features) && (
                                            <ul className="text-xs text-gray-500 mt-1 flex flex-wrap gap-x-4 gap-y-0.5">
                                                {product.key_features.slice(0, 3).map((f, i) => (
                                                    <li key={i} className="flex items-center gap-1">
                                                        <span className="w-1 h-1 rounded-full bg-gray-400"></span>
                                                        <span>{f}</span>
                                                    </li>
                                                ))}
                                            </ul>
                                        )}
                                    </div>
                                </div>

                                <div className="flex items-center gap-4 self-end sm:self-center">
                                    <div className="text-right">
                                        <span className="text-base font-black text-[#EF4A23] block">
                                            ৳{displayPrice.toLocaleString()}
                                        </span>
                                        {spec !== null && reg > spec && (
                                            <span className="text-xs text-gray-400 line-through">
                                                ৳{reg.toLocaleString()}
                                            </span>
                                        )}
                                    </div>
                                    <button
                                        onClick={() => handleSelectProduct(product)}
                                        className="bg-[#EF4A23] hover:bg-[#d63c17] text-white text-xs font-bold py-2.5 px-4 rounded-xl flex items-center gap-1.5 transition shadow-sm"
                                    >
                                        <Plus className="w-3.5 h-3.5" />
                                        <span>Add</span>
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                </div>
            ) : (
                <div className="bg-white rounded-2xl border border-gray-200 p-12 text-center">
                    <p className="text-sm font-bold text-gray-700">No components available in this category.</p>
                </div>
            )}
        </FrontendLayout>
    );
}
