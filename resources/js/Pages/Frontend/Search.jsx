import React from 'react';
import { Link } from '@inertiajs/react';
import FrontendLayout from '@/Layouts/FrontendLayout';
import ProductCard from '@/Components/Frontend/ProductCard';
import { Search as SearchIcon } from 'lucide-react';

export default function Search({ query, products, seo = {} }) {
    return (
        <FrontendLayout title={seo.title} description={seo.description}>
            <div className="mb-6">
                <div className="flex items-center gap-2 text-gray-500 text-xs mb-1">
                    <SearchIcon className="w-4 h-4 text-[#EF4A23]" />
                    <span>Search Results</span>
                </div>
                <h1 className="text-xl md:text-2xl font-black text-gray-900">
                    {query ? `Search results for "${query}"` : 'All Products'}
                </h1>
                <p className="text-xs text-gray-500 mt-1">
                    Found {products.total} matching items
                </p>
            </div>

            {products.data.length > 0 ? (
                <>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
                        {products.data.map((product) => (
                            <ProductCard key={product.id} product={product} />
                        ))}
                    </div>

                    {products.links && products.links.length > 3 && (
                        <div className="mt-8 flex justify-center">
                            <div className="flex items-center gap-1 bg-white p-2 rounded-xl border border-gray-200 shadow-sm">
                                {products.links.map((link, idx) => (
                                    <Link
                                        key={idx}
                                        href={link.url || '#'}
                                        dangerouslySetInnerHTML={{ __html: link.label }}
                                        className={`px-3 py-1.5 text-xs rounded-lg transition font-medium ${
                                            link.active
                                                ? 'bg-[#EF4A23] text-white font-bold'
                                                : link.url
                                                ? 'text-gray-700 hover:bg-gray-100'
                                                : 'text-gray-300 cursor-not-allowed'
                                        }`}
                                    />
                                ))}
                            </div>
                        </div>
                    )}
                </>
            ) : (
                <div className="bg-white rounded-2xl border border-gray-200 p-16 text-center shadow-sm">
                    <SearchIcon className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                    <h3 className="text-lg font-bold text-gray-800">No products found matching "{query}"</h3>
                    <p className="text-xs text-gray-500 mt-1">Please try searching with different keywords or check spelling.</p>
                </div>
            )}
        </FrontendLayout>
    );
}
