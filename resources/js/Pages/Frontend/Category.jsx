import React, { useState } from 'react';
import { Link, router } from '@inertiajs/react';
import FrontendLayout from '@/Layouts/FrontendLayout';
import ProductCard from '@/Components/Frontend/ProductCard';
import { ChevronRight, Filter, SlidersHorizontal, Check, X, RotateCcw } from 'lucide-react';

export default function Category({
    category,
    products,
    brands = [],
    filters = {},
    seo = {}
}) {
    const [minPrice, setMinPrice] = useState(filters.min_price || '');
    const [maxPrice, setMaxPrice] = useState(filters.max_price || '');
    const [selectedBrand, setSelectedBrand] = useState(filters.brand_id || '');
    const [selectedStock, setSelectedStock] = useState(filters.stock_status || '');
    const [sortBy, setSortBy] = useState(filters.sort || 'latest');
    const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

    const activeFilterCount = [
        filters.min_price || filters.max_price,
        filters.brand_id,
        filters.stock_status
    ].filter(Boolean).length;

    const applyFilter = (newParams = {}) => {
        const query = {
            ...filters,
            min_price: minPrice || undefined,
            max_price: maxPrice || undefined,
            brand: selectedBrand || undefined,
            stock: selectedStock || undefined,
            sort: sortBy || undefined,
            ...newParams,
        };
        // Clean undefined
        Object.keys(query).forEach((key) => query[key] === undefined && delete query[key]);
        router.get(route('category.show', category.slug), query, { preserveScroll: true });
    };

    const handleSortChange = (e) => {
        const val = e.target.value;
        setSortBy(val);
        applyFilter({ sort: val });
    };

    const handleBrandChange = (brandId) => {
        const newBrand = selectedBrand === brandId ? '' : brandId;
        setSelectedBrand(newBrand);
        applyFilter({ brand: newBrand });
    };

    const handleStockChange = (stockStatus) => {
        const newStock = selectedStock === stockStatus ? '' : stockStatus;
        setSelectedStock(newStock);
        applyFilter({ stock: newStock });
    };

    const handlePriceFilter = (e) => {
        e.preventDefault();
        applyFilter();
        setMobileFilterOpen(false);
    };

    const handleResetFilters = () => {
        setMinPrice('');
        setMaxPrice('');
        setSelectedBrand('');
        setSelectedStock('');
        router.get(route('category.show', category.slug), { sort: sortBy }, { preserveScroll: true });
        setMobileFilterOpen(false);
    };

    // Shared filter content rendered both on Desktop Sidebar and Mobile Drawer
    const FilterContent = () => (
        <div className="space-y-5">
            {/* Subcategories (if any) */}
            {category.children && category.children.length > 0 && (
                <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
                    <h3 className="text-xs font-bold text-gray-900 uppercase tracking-wider mb-2.5 pb-2 border-b">
                        Sub Categories
                    </h3>
                    <ul className="space-y-1 text-xs">
                        {category.children.map((sub) => (
                            <li key={sub.id}>
                                <Link
                                    href={route('category.show', sub.slug)}
                                    onClick={() => setMobileFilterOpen(false)}
                                    className="flex items-center justify-between text-gray-600 hover:text-[#EF4A23] hover:font-medium py-1 transition"
                                >
                                    <span>{sub.name}</span>
                                    <ChevronRight className="w-3 h-3 text-gray-400" />
                                </Link>
                            </li>
                        ))}
                    </ul>
                </div>
            )}

            {/* Price Filter */}
            <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
                <h3 className="text-xs font-bold text-gray-900 uppercase tracking-wider mb-2.5 pb-2 border-b">
                    Price Range (৳)
                </h3>
                <form onSubmit={handlePriceFilter} className="space-y-2.5">
                    <div className="flex items-center gap-2">
                        <input
                            type="number"
                            placeholder="Min"
                            value={minPrice}
                            onChange={(e) => setMinPrice(e.target.value)}
                            className="w-full text-xs p-2 rounded-lg border border-gray-300 focus:border-[#EF4A23] focus:ring-1 focus:ring-[#EF4A23]"
                        />
                        <span className="text-gray-400">-</span>
                        <input
                            type="number"
                            placeholder="Max"
                            value={maxPrice}
                            onChange={(e) => setMaxPrice(e.target.value)}
                            className="w-full text-xs p-2 rounded-lg border border-gray-300 focus:border-[#EF4A23] focus:ring-1 focus:ring-[#EF4A23]"
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full bg-[#081621] hover:bg-[#EF4A23] text-white text-xs font-bold py-2 rounded-lg transition"
                    >
                        Apply Price
                    </button>
                </form>
            </div>

            {/* Availability */}
            <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
                <h3 className="text-xs font-bold text-gray-900 uppercase tracking-wider mb-2.5 pb-2 border-b">
                    Availability
                </h3>
                <div className="space-y-2 text-xs">
                    <label className="flex items-center gap-2 cursor-pointer text-gray-700">
                        <input
                            type="checkbox"
                            checked={selectedStock === 'in_stock'}
                            onChange={() => handleStockChange('in_stock')}
                            className="rounded border-gray-300 text-[#EF4A23] focus:ring-[#EF4A23]"
                        />
                        <span>In Stock</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer text-gray-700">
                        <input
                            type="checkbox"
                            checked={selectedStock === 'upcoming'}
                            onChange={() => handleStockChange('upcoming')}
                            className="rounded border-gray-300 text-[#EF4A23] focus:ring-[#EF4A23]"
                        />
                        <span>Upcoming</span>
                    </label>
                </div>
            </div>

            {/* Brands Filter */}
            {brands.length > 0 && (
                <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
                    <h3 className="text-xs font-bold text-gray-900 uppercase tracking-wider mb-2.5 pb-2 border-b">
                        Brand
                    </h3>
                    <div className="space-y-2 max-h-56 overflow-y-auto text-xs pr-1">
                        {brands.map((b) => (
                            <label key={b.id} className="flex items-center gap-2 cursor-pointer text-gray-700">
                                <input
                                    type="checkbox"
                                    checked={Number(selectedBrand) === b.id}
                                    onChange={() => handleBrandChange(b.id)}
                                    className="rounded border-gray-300 text-[#EF4A23] focus:ring-[#EF4A23]"
                                />
                                <span>{b.name}</span>
                            </label>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );

    return (
        <FrontendLayout title={seo.title} description={seo.description}>
            {/* Breadcrumb */}
            <nav className="flex items-center gap-1.5 text-[11px] sm:text-xs text-gray-500 mb-4 sm:mb-6 overflow-x-auto whitespace-nowrap pb-1">
                <Link href={route('home')} className="hover:text-[#EF4A23] shrink-0">Home</Link>
                <ChevronRight className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                {category.parent && (
                    <>
                        <Link href={route('category.show', category.parent.slug)} className="hover:text-[#EF4A23] shrink-0">
                            {category.parent.name}
                        </Link>
                        <ChevronRight className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                    </>
                )}
                <span className="text-gray-900 font-semibold shrink-0">{category.name}</span>
            </nav>

            {/* Mobile Filter / Sort Bar (Visible only on < lg) */}
            <div className="lg:hidden bg-white rounded-xl border border-gray-200 p-3 mb-4 flex items-center justify-between gap-3 shadow-sm sticky top-14 z-30">
                <button
                    type="button"
                    onClick={() => setMobileFilterOpen(true)}
                    className="flex items-center gap-2 text-xs font-bold bg-gray-100 hover:bg-gray-200 text-gray-800 px-3.5 py-2 rounded-lg transition"
                >
                    <Filter className="w-3.5 h-3.5 text-[#EF4A23]" />
                    <span>Filter</span>
                    {activeFilterCount > 0 && (
                        <span className="bg-[#EF4A23] text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-black">
                            {activeFilterCount}
                        </span>
                    )}
                </button>

                <div className="flex items-center gap-1.5 text-xs">
                    <span className="text-gray-500 hidden xs:inline">Sort:</span>
                    <select
                        value={sortBy}
                        onChange={handleSortChange}
                        className="text-xs font-semibold bg-gray-50 border border-gray-300 rounded-lg py-1.5 px-2.5 text-gray-800 focus:outline-none focus:border-[#EF4A23]"
                    >
                        <option value="latest">Latest</option>
                        <option value="price_low">Price: Low to High</option>
                        <option value="price_high">Price: High to Low</option>
                        <option value="popular">Popularity</option>
                    </select>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 sm:gap-8">
                {/* Desktop Filters Sidebar (Hidden on mobile) */}
                <aside className="hidden lg:block lg:col-span-1">
                    <div className="flex items-center justify-between mb-3">
                        <span className="text-xs font-bold uppercase tracking-wider text-gray-500">Filter By</span>
                        {activeFilterCount > 0 && (
                            <button
                                type="button"
                                onClick={handleResetFilters}
                                className="text-[11px] text-[#EF4A23] hover:underline font-semibold flex items-center gap-1"
                            >
                                <RotateCcw className="w-3 h-3" /> Reset
                            </button>
                        )}
                    </div>
                    <FilterContent />
                </aside>

                {/* Main Product Listing */}
                <div className="lg:col-span-3">
                    {/* Desktop Top Action Bar */}
                    <div className="hidden lg:flex bg-white p-4 rounded-xl border border-gray-200 shadow-sm mb-6 items-center justify-between gap-4">
                        <div>
                            <h1 className="text-lg md:text-xl font-black text-gray-900">{category.name}</h1>
                            <p className="text-xs text-gray-500 mt-0.5">
                                Showing {products.data.length} of {products.total} products
                            </p>
                        </div>

                        {/* Sort Dropdown */}
                        <div className="flex items-center gap-2">
                            <span className="text-xs text-gray-500 font-medium">Sort By:</span>
                            <select
                                value={sortBy}
                                onChange={handleSortChange}
                                className="text-xs font-semibold bg-gray-50 border border-gray-300 rounded-lg p-2 text-gray-700 focus:outline-none focus:border-[#EF4A23]"
                            >
                                <option value="latest">Latest Products</option>
                                <option value="price_low">Price: Low to High</option>
                                <option value="price_high">Price: High to Low</option>
                                <option value="popular">Most Popular</option>
                            </select>
                        </div>
                    </div>

                    {/* Products Grid: 2 columns on phone, 3 on tablet, 4 on xl */}
                    {products.data.length > 0 ? (
                        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-3 gap-3 sm:gap-5">
                            {products.data.map((product) => (
                                <ProductCard key={product.id} product={product} />
                            ))}
                        </div>
                    ) : (
                        <div className="bg-white rounded-2xl border border-gray-200 p-8 sm:p-12 text-center">
                            <SlidersHorizontal className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                            <h3 className="text-base font-bold text-gray-800">No Products Found</h3>
                            <p className="text-xs text-gray-500 mt-1 max-w-sm mx-auto">
                                No products matched your current filters. Try resetting the filters or adjusting price range.
                            </p>
                            <button
                                onClick={handleResetFilters}
                                className="mt-4 px-4 py-2 bg-[#EF4A23] text-white text-xs font-bold rounded-lg hover:bg-[#d63c17] transition"
                            >
                                Reset All Filters
                            </button>
                        </div>
                    )}

                    {/* Pagination */}
                    {products.links && products.links.length > 3 && (
                        <div className="mt-8 flex justify-center overflow-x-auto py-2">
                            <div className="flex items-center gap-1 bg-white p-1.5 rounded-xl border border-gray-200 shadow-sm">
                                {products.links.map((link, idx) => (
                                    <Link
                                        key={idx}
                                        href={link.url || '#'}
                                        dangerouslySetInnerHTML={{ __html: link.label }}
                                        className={`px-3 py-1.5 text-xs rounded-lg transition font-medium ${link.active ? 'bg-[#EF4A23] text-white font-bold' : 'text-gray-700 hover:bg-gray-100'
                                            }`}
                                    />
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Mobile Filter Slide-Over Drawer */}
            {mobileFilterOpen && (
                <div className="fixed inset-0 z-50 lg:hidden flex">
                    <div
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm"
                        onClick={() => setMobileFilterOpen(false)}
                    />
                    <div className="relative ml-auto w-4/5 max-w-xs bg-[#F2F4F8] h-full flex flex-col shadow-2xl z-10 animate-in slide-in-from-right duration-250">
                        <div className="p-4 bg-white border-b border-gray-200 flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <Filter className="w-4 h-4 text-[#EF4A23]" />
                                <h3 className="font-bold text-sm text-gray-900">Filter Products</h3>
                            </div>
                            <button
                                type="button"
                                onClick={() => setMobileFilterOpen(false)}
                                className="p-1 text-gray-400 hover:text-gray-600 rounded-lg"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <div className="flex-1 overflow-y-auto p-4">
                            <FilterContent />
                        </div>

                        <div className="p-3 bg-white border-t border-gray-200 flex items-center gap-2">
                            <button
                                type="button"
                                onClick={handleResetFilters}
                                className="flex-1 py-2 text-xs font-bold text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition"
                            >
                                Reset
                            </button>
                            <button
                                type="button"
                                onClick={() => setMobileFilterOpen(false)}
                                className="flex-1 py-2 text-xs font-bold text-white bg-[#EF4A23] rounded-lg hover:bg-[#d63c17] transition"
                            >
                                Apply ({products.total})
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </FrontendLayout>
    );
}
