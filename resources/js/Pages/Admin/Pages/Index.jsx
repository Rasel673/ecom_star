import React, { useState } from 'react';
import { Link, router } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { 
    FileText, 
    Plus, 
    Search, 
    ExternalLink, 
    Edit, 
    Trash2, 
    CheckCircle2, 
    XCircle,
    Layers,
    Calculator,
    Truck,
    PhoneCall,
    Wrench
} from 'lucide-react';

export default function Index({ pages, filters = {} }) {
    const [search, setSearch] = useState(filters.search || '');
    const [pageType, setPageType] = useState(filters.page_type || '');

    const handleFilter = (e) => {
        e.preventDefault();
        router.get(
            route('admin.pages.index'),
            {
                search: search || undefined,
                page_type: pageType || undefined,
            },
            { preserveState: true }
        );
    };

    const handleDelete = (id, title) => {
        if (confirm(`Are you sure you want to delete '${title}'?`)) {
            router.delete(route('admin.pages.destroy', id), { preserveScroll: true });
        }
    };

    const handleToggleStatus = (id) => {
        router.patch(route('admin.pages.toggle-status', id), {}, { preserveScroll: true });
    };

    const getPageTypeBadge = (type) => {
        switch (type) {
            case 'emi_calculator':
                return (
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-50 text-amber-700 border border-amber-200">
                        <Calculator className="w-3 h-3 text-amber-500" />
                        EMI Calculator
                    </span>
                );
            case 'order_tracking':
                return (
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-50 text-blue-700 border border-blue-200">
                        <Truck className="w-3 h-3 text-blue-500" />
                        Order Tracker
                    </span>
                );
            case 'contact_us':
                return (
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                        <PhoneCall className="w-3 h-3 text-emerald-500" />
                        Contact Us
                    </span>
                );
            case 'service_complain':
                return (
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-purple-50 text-purple-700 border border-purple-200">
                        <Wrench className="w-3 h-3 text-purple-500" />
                        Service & RMA
                    </span>
                );
            default:
                return (
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-gray-100 text-gray-700 border border-gray-200">
                        <FileText className="w-3 h-3 text-gray-400" />
                        Standard Article
                    </span>
                );
        }
    };

    return (
        <AdminLayout title="CMS & Dynamic Pages">
            {/* Header & Create Button */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
                <div>
                    <h1 className="text-xl font-black text-gray-900 flex items-center gap-2">
                        <FileText className="w-6 h-6 text-[#EF4A23]" />
                        <span>Dynamic Pages & CMS</span>
                    </h1>
                    <p className="text-xs text-gray-500">
                        Create and manage dynamic store content, interactive calculators, tracking pages, and customer policies.
                    </p>
                </div>

                <Link
                    href={route('admin.pages.create')}
                    className="px-4 py-2 bg-[#EF4A23] hover:bg-[#d63c17] text-white text-xs font-bold rounded-xl transition shadow-md flex items-center gap-2"
                >
                    <Plus className="w-4 h-4" />
                    <span>Create New Page</span>
                </Link>
            </div>

            {/* Filter Bar */}
            <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-sm mb-6">
                <form onSubmit={handleFilter} className="flex flex-wrap items-center gap-3">
                    <div className="relative flex-1 min-w-[200px]">
                        <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                        <input
                            type="text"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Search by title, slug, or subtitle..."
                            className="w-full pl-9 pr-4 py-2 text-xs rounded-xl border border-gray-200 focus:border-[#EF4A23] focus:ring-[#EF4A23]"
                        />
                    </div>

                    <select
                        value={pageType}
                        onChange={(e) => setPageType(e.target.value)}
                        className="text-xs rounded-xl border border-gray-200 focus:border-[#EF4A23] focus:ring-[#EF4A23] py-2 px-3"
                    >
                        <option value="">All Page Types</option>
                        <option value="standard">Standard Article / Policy</option>
                        <option value="emi_calculator">Interactive EMI Calculator</option>
                        <option value="order_tracking">Live Order Tracking</option>
                        <option value="contact_us">Contact Us & Outlets</option>
                        <option value="service_complain">Online Service & Complain</option>
                    </select>

                    <button
                        type="submit"
                        className="px-4 py-2 bg-[#081621] text-white text-xs font-bold rounded-xl hover:bg-gray-800 transition"
                    >
                        Filter
                    </button>
                </form>
            </div>

            {/* Pages Table */}
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs text-gray-600">
                        <thead className="bg-gray-50 text-gray-700 uppercase font-semibold border-b text-[11px] tracking-wider">
                            <tr>
                                <th className="p-4">Title & Subtitle</th>
                                <th className="p-4">Public URL / Slug</th>
                                <th className="p-4">Type / Functionality</th>
                                <th className="p-4 text-center">Status</th>
                                <th className="p-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {pages.data && pages.data.length > 0 ? (
                                pages.data.map((page) => (
                                    <tr key={page.id} className="hover:bg-gray-50/70 transition">
                                        <td className="p-4">
                                            <div className="font-bold text-gray-900 text-sm">
                                                {page.title}
                                            </div>
                                            {page.subtitle && (
                                                <div className="text-[11px] text-gray-400 mt-0.5 line-clamp-1">
                                                    {page.subtitle}
                                                </div>
                                            )}
                                        </td>
                                        <td className="p-4">
                                            <div className="font-mono text-xs text-gray-700 flex items-center gap-1.5">
                                                <span className="text-gray-400">/page/</span>
                                                <span className="font-bold text-[#081621]">{page.slug}</span>
                                            </div>
                                        </td>
                                        <td className="p-4 whitespace-nowrap">
                                            {getPageTypeBadge(page.page_type)}
                                        </td>
                                        <td className="p-4 text-center whitespace-nowrap">
                                            <button
                                                type="button"
                                                onClick={() => handleToggleStatus(page.id)}
                                                className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold border transition ${
                                                    page.is_active
                                                        ? 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100'
                                                        : 'bg-gray-100 text-gray-500 border-gray-200 hover:bg-gray-200'
                                                }`}
                                            >
                                                {page.is_active ? 'Published' : 'Draft'}
                                            </button>
                                        </td>
                                        <td className="p-4 text-right whitespace-nowrap space-x-2">
                                            {page.is_active && (
                                                <a
                                                    href={route('page.show', page.slug)}
                                                    target="_blank"
                                                    rel="noreferrer"
                                                    className="p-1.5 text-gray-400 hover:text-blue-600 rounded-lg transition inline-block"
                                                    title="View Public Page"
                                                >
                                                    <ExternalLink className="w-4 h-4" />
                                                </a>
                                            )}
                                            <Link
                                                href={route('admin.pages.edit', page.id)}
                                                className="p-1.5 text-gray-400 hover:text-amber-600 rounded-lg transition inline-block"
                                                title="Edit Page"
                                            >
                                                <Edit className="w-4 h-4" />
                                            </Link>
                                            <button
                                                type="button"
                                                onClick={() => handleDelete(page.id, page.title)}
                                                className="p-1.5 text-gray-400 hover:text-rose-600 rounded-lg transition inline-block"
                                                title="Delete Page"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="5" className="p-8 text-center text-gray-400">
                                        No dynamic pages found. Click 'Create New Page' above to add one.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                {pages.links && pages.links.length > 3 && (
                    <div className="p-4 border-t border-gray-100 flex items-center justify-between">
                        <div className="text-xs text-gray-500">
                            Showing {pages.from || 0} to {pages.to || 0} of {pages.total} pages
                        </div>
                        <div className="flex items-center gap-1">
                            {pages.links.map((link, idx) => (
                                <Link
                                    key={idx}
                                    href={link.url || '#'}
                                    dangerouslySetInnerHTML={{ __html: link.label }}
                                    className={`px-3 py-1 text-xs rounded-lg border transition ${
                                        link.active
                                            ? 'bg-[#EF4A23] text-white border-[#EF4A23]'
                                            : !link.url
                                            ? 'text-gray-300 border-gray-200 cursor-not-allowed'
                                            : 'text-gray-600 border-gray-200 hover:bg-gray-50'
                                    }`}
                                />
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </AdminLayout>
    );
}
