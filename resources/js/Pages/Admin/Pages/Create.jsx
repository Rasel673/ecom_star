import React from 'react';
import { Link, useForm } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { 
    FileText, 
    ArrowLeft, 
    Save, 
    Globe, 
    Layers, 
    Search,
    Calculator,
    Truck,
    PhoneCall,
    Wrench,
    Check
} from 'lucide-react';

export default function Create() {
    const { data, setData, post, processing, errors } = useForm({
        title: '',
        slug: '',
        subtitle: '',
        page_type: 'standard',
        content: '',
        meta_title: '',
        meta_description: '',
        is_active: true,
        sort_order: 0,
    });

    const handleTitleChange = (e) => {
        const title = e.target.value;
        const slug = title
            .toLowerCase()
            .replace(/[^\w ]+/g, '')
            .replace(/ +/g, '-');

        setData((prev) => ({
            ...prev,
            title: title,
            slug: prev.slug === '' || prev.slug === prev.title.toLowerCase().replace(/[^\w ]+/g, '').replace(/ +/g, '-') ? slug : prev.slug,
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('admin.pages.store'));
    };

    return (
        <AdminLayout title="Create Dynamic Page">
            <div className="max-w-4xl mx-auto pb-12">
                {/* Header */}
                <div className="flex items-center justify-between gap-4 mb-6">
                    <div className="flex items-center gap-3">
                        <Link
                            href={route('admin.pages.index')}
                            className="p-2 bg-white hover:bg-gray-100 rounded-xl border border-gray-200 transition text-gray-600"
                        >
                            <ArrowLeft className="w-4 h-4" />
                        </Link>
                        <div>
                            <h1 className="text-xl font-black text-gray-900">Create Dynamic Page</h1>
                            <p className="text-xs text-gray-500">Add a custom page, interactive calculator, or customer portal</p>
                        </div>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Basic Info Card */}
                    <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm space-y-4">
                        <h3 className="text-sm font-bold text-gray-900 border-b pb-2 flex items-center gap-2">
                            <FileText className="w-4 h-4 text-[#EF4A23]" />
                            <span>Page Identification</span>
                        </h3>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-bold text-gray-700 mb-1">
                                    Page Title *
                                </label>
                                <input
                                    type="text"
                                    required
                                    value={data.title}
                                    onChange={handleTitleChange}
                                    placeholder="e.g. EMI Facilities & Calculator"
                                    className="w-full text-xs rounded-xl border-gray-300 focus:border-[#EF4A23] focus:ring-[#EF4A23] py-2.5 px-3"
                                />
                                {errors.title && <p className="text-xs text-rose-600 mt-1">{errors.title}</p>}
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-gray-700 mb-1">
                                    URL Slug *
                                </label>
                                <div className="flex items-center">
                                    <span className="text-xs bg-gray-100 text-gray-500 py-2.5 px-3 rounded-l-xl border border-r-0 border-gray-300">
                                        /page/
                                    </span>
                                    <input
                                        type="text"
                                        required
                                        value={data.slug}
                                        onChange={(e) => setData('slug', e.target.value)}
                                        placeholder="emi-calculation"
                                        className="w-full text-xs rounded-r-xl border-gray-300 focus:border-[#EF4A23] focus:ring-[#EF4A23] py-2.5 px-3"
                                    />
                                </div>
                                {errors.slug && <p className="text-xs text-rose-600 mt-1">{errors.slug}</p>}
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-gray-700 mb-1">
                                Subtitle / Headline Tag (Optional)
                            </label>
                            <input
                                type="text"
                                value={data.subtitle}
                                onChange={(e) => setData('subtitle', e.target.value)}
                                placeholder="e.g. 0% Interest EMI up to 36 Months with Leading Credit Cards"
                                className="w-full text-xs rounded-xl border-gray-300 focus:border-[#EF4A23] focus:ring-[#EF4A23] py-2.5 px-3"
                            />
                        </div>

                        {/* Page Type Selector */}
                        <div>
                            <label className="block text-xs font-bold text-gray-700 mb-2">
                                Functional Page Engine *
                            </label>
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                                {[
                                    { id: 'standard', name: 'Standard Article', desc: 'Terms, policies, buying guides & info', icon: FileText },
                                    { id: 'emi_calculator', name: 'EMI Calculator', desc: 'Interactive bank tenure & EMI calculator', icon: Calculator },
                                    { id: 'order_tracking', name: 'Order Tracking', desc: 'Live order & courier lookup widget', icon: Truck },
                                    { id: 'contact_us', name: 'Contact & Outlets', desc: 'Headquarters, branches & inquiry form', icon: PhoneCall },
                                    { id: 'service_complain', name: 'Service & RMA', desc: 'Warranty terms & repair complaints', icon: Wrench },
                                ].map((type) => {
                                    const Icon = type.icon;
                                    const isSelected = data.page_type === type.id;
                                    return (
                                        <div
                                            key={type.id}
                                            onClick={() => setData('page_type', type.id)}
                                            className={`p-3 rounded-xl border cursor-pointer transition flex items-start gap-3 ${
                                                isSelected 
                                                    ? 'border-[#EF4A23] bg-orange-50/50 shadow-sm ring-1 ring-[#EF4A23]' 
                                                    : 'border-gray-200 hover:border-gray-300 bg-white'
                                            }`}
                                        >
                                            <div className={`p-2 rounded-lg shrink-0 ${isSelected ? 'bg-[#EF4A23] text-white' : 'bg-gray-100 text-gray-600'}`}>
                                                <Icon className="w-4 h-4" />
                                            </div>
                                            <div>
                                                <div className="font-bold text-xs text-gray-900">{type.name}</div>
                                                <div className="text-[10px] text-gray-500 mt-0.5 leading-snug">{type.desc}</div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>

                    {/* Page Content Editor */}
                    <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm space-y-4">
                        <h3 className="text-sm font-bold text-gray-900 border-b pb-2 flex items-center justify-between">
                            <span className="flex items-center gap-2">
                                <FileText className="w-4 h-4 text-[#EF4A23]" />
                                <span>Main Page Content & Details</span>
                            </span>
                            <span className="text-[11px] text-gray-400 font-normal">Supports HTML markup & text</span>
                        </h3>

                        <div>
                            <textarea
                                rows="12"
                                value={data.content}
                                onChange={(e) => setData('content', e.target.value)}
                                placeholder="Enter page descriptive content, guidelines, FAQs, or instructions..."
                                className="w-full text-xs font-mono rounded-xl border-gray-300 focus:border-[#EF4A23] focus:ring-[#EF4A23] p-3 leading-relaxed"
                            ></textarea>
                            <p className="text-[11px] text-gray-400 mt-1">
                                For specialized types like EMI Calculator or Order Tracking, the interactive tool is automatically rendered alongside this content.
                            </p>
                        </div>
                    </div>

                    {/* SEO & Configuration */}
                    <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm space-y-4">
                        <h3 className="text-sm font-bold text-gray-900 border-b pb-2 flex items-center gap-2">
                            <Search className="w-4 h-4 text-[#EF4A23]" />
                            <span>SEO Metadata & Visibility</span>
                        </h3>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-bold text-gray-700 mb-1">
                                    SEO Meta Title (Optional)
                                </label>
                                <input
                                    type="text"
                                    value={data.meta_title}
                                    onChange={(e) => setData('meta_title', e.target.value)}
                                    placeholder="Leave blank to use Page Title"
                                    className="w-full text-xs rounded-xl border-gray-300 focus:border-[#EF4A23] focus:ring-[#EF4A23] py-2.5 px-3"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-gray-700 mb-1">
                                    Sort Order
                                </label>
                                <input
                                    type="number"
                                    value={data.sort_order}
                                    onChange={(e) => setData('sort_order', parseInt(e.target.value) || 0)}
                                    className="w-full text-xs rounded-xl border-gray-300 focus:border-[#EF4A23] focus:ring-[#EF4A23] py-2.5 px-3"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-gray-700 mb-1">
                                SEO Meta Description (Optional)
                            </label>
                            <textarea
                                rows="2"
                                value={data.meta_description}
                                onChange={(e) => setData('meta_description', e.target.value)}
                                placeholder="Summary for Google and search engines..."
                                className="w-full text-xs rounded-xl border-gray-300 focus:border-[#EF4A23] focus:ring-[#EF4A23] py-2 px-3"
                            ></textarea>
                        </div>

                        <div className="pt-2">
                            <label className="flex items-center gap-2 cursor-pointer select-none">
                                <input
                                    type="checkbox"
                                    checked={data.is_active}
                                    onChange={(e) => setData('is_active', e.target.checked)}
                                    className="w-4 h-4 text-[#EF4A23] border-gray-300 rounded focus:ring-[#EF4A23]"
                                />
                                <span className="text-xs font-bold text-gray-800">Publish Page immediately (Visible to customers)</span>
                            </label>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center justify-end gap-3 pt-2">
                        <Link
                            href={route('admin.pages.index')}
                            className="px-4 py-2.5 text-xs font-semibold text-gray-600 hover:text-gray-800"
                        >
                            Cancel
                        </Link>
                        <button
                            type="submit"
                            disabled={processing}
                            className="px-6 py-2.5 bg-[#EF4A23] hover:bg-[#d63c17] text-white font-bold text-xs rounded-xl transition shadow-md flex items-center gap-2 disabled:opacity-50"
                        >
                            <Save className="w-4 h-4" />
                            <span>{processing ? 'Creating...' : 'Save & Publish Page'}</span>
                        </button>
                    </div>
                </form>
            </div>
        </AdminLayout>
    );
}
