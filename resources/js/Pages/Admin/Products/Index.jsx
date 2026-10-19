import React, { useState, useEffect, useRef } from 'react';
import { Link, router, usePage } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import BulkImportModal from './BulkImportModal';
import ImportResultsModal from './ImportResultsModal';
import {
    Plus,
    Edit,
    Trash2,
    Search,
    ExternalLink,
    Download,
    Upload,
    FileSpreadsheet,
    ChevronDown,
    FileText
} from 'lucide-react';

export default function Index({ products, filters = {} }) {
    const { flash } = usePage().props;
    const [searchTerm, setSearchTerm] = useState(filters.search || '');
    const [showImportModal, setShowImportModal] = useState(false);
    const [importResults, setImportResults] = useState(null);
    const [exportDropdownOpen, setExportDropdownOpen] = useState(false);
    const exportRef = useRef(null);

    // Watch for flash import_results
    useEffect(() => {
        if (flash?.import_results) {
            setImportResults(flash.import_results);
        }
    }, [flash]);

    // Close export dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (exportRef.current && !exportRef.current.contains(event.target)) {
                setExportDropdownOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleSearch = (e) => {
        e.preventDefault();
        router.get(route('admin.products.index'), { search: searchTerm }, { preserveState: true });
    };

    const handleDelete = (id, name) => {
        if (confirm(`Delete product "${name}"?`)) {
            router.delete(route('admin.products.destroy', id));
        }
    };

    const handleExport = (format) => {
        setExportDropdownOpen(false);
        const params = new URLSearchParams();
        params.append('format', format);
        if (searchTerm) {
            params.append('search', searchTerm);
        }
        window.location.href = route('admin.products.export') + '?' + params.toString();
    };

    return (
        <AdminLayout title="Manage Products">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
                <div>
                    <h1 className="text-xl font-black text-gray-900">Products Inventory</h1>
                    <p className="text-xs text-gray-500">
                        Catalog of tech products, pricing, and stock ({products.total ?? products.data.length} total)
                    </p>
                </div>

                <div className="flex flex-wrap items-center gap-2.5 w-full sm:w-auto">
                    {/* Search Form */}
                    <form onSubmit={handleSearch} className="relative flex-1 sm:w-56">
                        <input
                            type="text"
                            placeholder="Search name, model, SKU..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full text-xs pl-3 pr-8 py-2.5 rounded-xl border border-gray-300 focus:border-[#EF4A23] focus:ring-0"
                        />
                        <button type="submit" className="absolute right-2.5 top-3 text-gray-400 hover:text-gray-600">
                            <Search className="w-3.5 h-3.5" />
                        </button>
                    </form>

                    {/* Export Dropdown */}
                    <div className="relative shrink-0" ref={exportRef}>
                        <button
                            type="button"
                            onClick={() => setExportDropdownOpen(!exportDropdownOpen)}
                            className="inline-flex items-center gap-1.5 bg-white hover:bg-gray-50 border border-gray-300 text-gray-700 text-xs font-bold py-2.5 px-3.5 rounded-xl transition shadow-xs"
                            title="Export Products"
                        >
                            <Download className="w-3.5 h-3.5 text-gray-500" />
                            <span>Export</span>
                            <ChevronDown className={`w-3.5 h-3.5 text-gray-400 transition-transform ${exportDropdownOpen ? 'rotate-180' : ''}`} />
                        </button>

                        {exportDropdownOpen && (
                            <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-xl border border-gray-100 py-1.5 z-30 animate-in fade-in zoom-in-95 duration-100">
                                <div className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-gray-400 border-b border-gray-100">
                                    Choose Format
                                </div>
                                <button
                                    onClick={() => handleExport('xlsx')}
                                    className="w-full text-left px-3.5 py-2 text-xs font-semibold text-gray-700 hover:bg-emerald-50 hover:text-emerald-700 flex items-center gap-2.5 transition"
                                >
                                    <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
                                    <div>
                                        <p className="font-bold">Excel Sheet</p>
                                        <p className="text-[10px] text-gray-400">Microsoft Excel (.xlsx)</p>
                                    </div>
                                </button>
                                <button
                                    onClick={() => handleExport('csv')}
                                    className="w-full text-left px-3.5 py-2 text-xs font-semibold text-gray-700 hover:bg-blue-50 hover:text-blue-700 flex items-center gap-2.5 transition"
                                >
                                    <FileText className="w-4 h-4 text-blue-600" />
                                    <div>
                                        <p className="font-bold">CSV File</p>
                                        <p className="text-[10px] text-gray-400">Universal text (.csv)</p>
                                    </div>
                                </button>
                            </div>
                        )}
                    </div>

                    {/* Bulk Import Button */}
                    <button
                        type="button"
                        onClick={() => setShowImportModal(true)}
                        className="inline-flex items-center gap-1.5 bg-white hover:bg-gray-50 border border-gray-300 text-gray-700 text-xs font-bold py-2.5 px-3.5 rounded-xl transition shadow-xs shrink-0"
                        title="Bulk Import Products from Excel/CSV"
                    >
                        <Upload className="w-3.5 h-3.5 text-gray-500" />
                        <span>Bulk Import</span>
                    </button>

                    {/* Add Product Button */}
                    <Link
                        href={route('admin.products.create')}
                        className="inline-flex items-center gap-1.5 bg-[#EF4A23] hover:bg-[#d63c17] text-white text-xs font-bold py-2.5 px-4 rounded-xl transition shadow-xs shrink-0"
                    >
                        <Plus className="w-4 h-4" />
                        <span>Add Product</span>
                    </Link>
                </div>
            </div>

            {/* Products Table Card */}
            <div className="bg-white rounded-2xl border border-gray-200/80 shadow-xs overflow-hidden">
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
                        {products.data.length === 0 ? (
                            <tr>
                                <td colSpan={7} className="p-8 text-center text-gray-400">
                                    <FileSpreadsheet className="w-8 h-8 mx-auto mb-2 text-gray-300" />
                                    <p className="font-semibold text-gray-600">No products found</p>
                                    <p className="text-xs text-gray-400 mt-0.5">
                                        Use "Bulk Import" to upload a spreadsheet or click "Add Product" to create one.
                                    </p>
                                </td>
                            </tr>
                        ) : (
                            products.data.map((product) => (
                                <tr key={product.id} className="hover:bg-gray-50/50 transition">
                                    <td className="p-3.5">
                                        <div className="flex items-center gap-3">
                                            <img
                                                src={product.thumbnail || 'https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?w=100'}
                                                alt={product.name}
                                                className="w-10 h-10 object-contain rounded-lg border p-0.5 bg-white shrink-0"
                                            />
                                            <div>
                                                <p className="font-bold text-gray-900 line-clamp-1">{product.name}</p>
                                                <div className="flex items-center gap-2 mt-0.5">
                                                    {product.sku && (
                                                        <span className="text-[10px] bg-gray-100 text-gray-600 px-1.5 py-0.2 rounded font-mono">
                                                            {product.sku}
                                                        </span>
                                                    )}
                                                    {product.model && (
                                                        <span className="text-[11px] text-gray-400">{product.model}</span>
                                                    )}
                                                </div>
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
                                                className="p-1 text-gray-400 hover:text-gray-700 transition"
                                                title="View in store"
                                            >
                                                <ExternalLink className="w-3.5 h-3.5" />
                                            </Link>
                                            <Link
                                                href={route('admin.products.edit', product.id)}
                                                className="p-1 text-gray-500 hover:text-blue-600 transition"
                                                title="Edit"
                                            >
                                                <Edit className="w-4 h-4" />
                                            </Link>
                                            <button
                                                onClick={() => handleDelete(product.id, product.name)}
                                                className="p-1 text-gray-500 hover:text-rose-600 transition"
                                                title="Delete"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* Pagination */}
            {products.links && products.links.length > 3 && (
                <div className="mt-6 flex justify-center">
                    <div className="flex items-center gap-1 bg-white p-1.5 rounded-xl border border-gray-200 shadow-xs">
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

            {/* Bulk Import Modal */}
            <BulkImportModal
                isOpen={showImportModal}
                onClose={() => setShowImportModal(false)}
            />

            {/* Import Results Modal */}
            <ImportResultsModal
                results={importResults}
                onClose={() => setImportResults(null)}
            />
        </AdminLayout>
    );
}
