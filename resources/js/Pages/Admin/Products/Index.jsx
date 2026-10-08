import React, { useState } from 'react';
import { Link, router } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Plus, Edit, Trash2, Search, ExternalLink } from 'lucide-react';

export default function Index({ products, filters = {} }) {
    const [searchTerm, setSearchTerm] = useState(filters.search || '');

    const handleSearch = (e) => {
        e.preventDefault();
        router.get(route('admin.products.index'), { search: searchTerm }, { preserveState: true });
    };

    const handleDelete = (id, name) => {
        if (confirm(`Delete product "${name}"?`)) {
            router.delete(route('admin.products.destroy', id));
        }
    };

    return (
        <AdminLayout title="Manage Products">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
                <div>
                    <h1 className="text-xl font-black text-gray-900">Products Inventory</h1>
                    <p className="text-xs text-gray-500">Catalog of tech products, pricing, and stock</p>
                </div>
                <div className="flex items-center gap-3 w-full sm:w-auto">
                    <form onSubmit={handleSearch} className="relative flex-1 sm:w-64">
                        <input
                            type="text"
                            placeholder="Search products..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full text-xs pl-3 pr-8 py-2 rounded-xl border border-gray-300 focus:border-[#EF4A23]"
                        />
                        <button type="submit" className="absolute right-2.5 top-2.5 text-gray-400">
                            <Search className="w-3.5 h-3.5" />
                        </button>
                    </form>
                    <Link
                        href={route('admin.products.create')}
                        className="inline-flex items-center gap-1.5 bg-[#EF4A23] hover:bg-[#d63c17] text-white text-xs font-bold py-2.5 px-4 rounded-xl transition shadow-sm shrink-0"
                    >
                        <Plus className="w-4 h-4" />
                        <span>Add Product</span>
                    </Link>
                </div>
            </div>

            <div className="bg-white rounded-2xl border border-gray-200/80 shadow-sm overflow-hidden">
                <table className="w-full text-left text-xs">
                    <thead className="bg-gray-50 border-b border-gray-200 text-gray-500 font-semibold uppercase">
                        <tr>
                            <th className="p-3.5">Product</th>
                            <th className="p-3.5">Category</th>
                            <th className="p-3.5">Brand</th>
                            <th className="p-3.5 text-right">Price (৳)</th>
                            <th className="p-3.5 text-center">Stock</th>
                            <th className="p-3.5 text-center">Featured</th>
                            <th className="p-3.5 text-center">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {products.data.map((product) => (
                            <tr key={product.id} className="hover:bg-gray-50/50">
                                <td className="p-3.5">
                                    <div className="flex items-center gap-3">
                                        <img
                                            src={product.thumbnail || 'https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?w=100'}
                                            alt={product.name}
                                            className="w-10 h-10 object-contain rounded-lg border p-0.5 bg-white shrink-0"
                                        />
                                        <div>
                                            <p className="font-bold text-gray-900 line-clamp-1">{product.name}</p>
                                            <p className="text-[11px] text-gray-400">{product.model || product.sku}</p>
                                        </div>
                                    </div>
                                </td>
                                <td className="p-3.5 text-gray-600 font-medium">
                                    {product.category?.name || '—'}
                                </td>
                                <td className="p-3.5 text-gray-600 font-medium">
                                    {product.brand?.name || '—'}
                                </td>
                                <td className="p-3.5 text-right">
                                    <span className="font-black text-[#EF4A23] block">
                                        ৳{Number(product.special_price || product.regular_price).toLocaleString()}
                                    </span>
                                    {product.special_price && (
                                        <span className="text-[11px] text-gray-400 line-through">
                                            ৳{Number(product.regular_price).toLocaleString()}
                                        </span>
                                    )}
                                </td>
                                <td className="p-3.5 text-center">
                                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                                        product.stock_status === 'in_stock'
                                            ? 'bg-emerald-50 text-emerald-700'
                                            : 'bg-amber-50 text-amber-700'
                                    }`}>
                                        {product.quantity} In Stock
                                    </span>
                                </td>
                                <td className="p-3.5 text-center">
                                    {product.is_featured ? (
                                        <span className="text-orange-600 font-bold">Yes</span>
                                    ) : (
                                        <span className="text-gray-400">No</span>
                                    )}
                                </td>
                                <td className="p-3.5 text-center">
                                    <div className="flex items-center justify-center gap-2">
                                        <Link
                                            href={route('product.show', product.slug)}
                                            target="_blank"
                                            className="p-1 text-gray-400 hover:text-gray-700"
                                            title="View in store"
                                        >
                                            <ExternalLink className="w-3.5 h-3.5" />
                                        </Link>
                                        <Link
                                            href={route('admin.products.edit', product.id)}
                                            className="p-1 text-gray-500 hover:text-blue-600"
                                            title="Edit"
                                        >
                                            <Edit className="w-4 h-4" />
                                        </Link>
                                        <button
                                            onClick={() => handleDelete(product.id, product.name)}
                                            className="p-1 text-gray-500 hover:text-rose-600"
                                            title="Delete"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {products.links && products.links.length > 3 && (
                <div className="mt-6 flex justify-center">
                    <div className="flex items-center gap-1 bg-white p-1.5 rounded-xl border border-gray-200 shadow-sm">
                        {products.links.map((link, idx) => (
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
