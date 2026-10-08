import React from 'react';
import { useForm, Link } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { ArrowLeft } from 'lucide-react';

export default function Create({ parentCategories = [] }) {
    const { data, setData, post, processing, errors } = useForm({
        name: '',
        slug: '',
        parent_id: '',
        icon: '',
        image: '',
        description: '',
        is_featured: false,
        sort_order: 0,
        status: true,
        meta_title: '',
        meta_description: '',
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('admin.categories.store'));
    };

    return (
        <AdminLayout title="Add Category">
            <div className="max-w-2xl mx-auto">
                <Link
                    href={route('admin.categories.index')}
                    className="inline-flex items-center gap-1.5 text-xs text-gray-500 hover:text-[#EF4A23] font-semibold mb-4"
                >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    <span>Back to Categories</span>
                </Link>

                <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
                    <h2 className="text-base font-bold text-gray-900 border-b pb-3 mb-4">Create New Category</h2>

                    <form onSubmit={handleSubmit} className="space-y-4 text-xs">
                        <div>
                            <label className="block font-semibold text-gray-700 mb-1">
                                Category Name <span className="text-rose-500">*</span>
                            </label>
                            <input
                                type="text"
                                required
                                value={data.name}
                                onChange={(e) => setData('name', e.target.value)}
                                className="w-full p-2.5 rounded-lg border border-gray-300 focus:border-[#EF4A23]"
                                placeholder="e.g. Graphics Card"
                            />
                            {errors.name && <p className="text-rose-500 mt-1">{errors.name}</p>}
                        </div>

                        <div>
                            <label className="block font-semibold text-gray-700 mb-1">Parent Category</label>
                            <select
                                value={data.parent_id}
                                onChange={(e) => setData('parent_id', e.target.value)}
                                className="w-full p-2.5 rounded-lg border border-gray-300 focus:border-[#EF4A23]"
                            >
                                <option value="">— None (Root Category) —</option>
                                {parentCategories.map((p) => (
                                    <option key={p.id} value={p.id}>{p.name}</option>
                                ))}
                            </select>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block font-semibold text-gray-700 mb-1">Icon Name</label>
                                <input
                                    type="text"
                                    value={data.icon}
                                    onChange={(e) => setData('icon', e.target.value)}
                                    className="w-full p-2.5 rounded-lg border border-gray-300 focus:border-[#EF4A23]"
                                    placeholder="Cpu, Monitor, Laptop, etc."
                                />
                            </div>
                            <div>
                                <label className="block font-semibold text-gray-700 mb-1">Sort Order</label>
                                <input
                                    type="number"
                                    value={data.sort_order}
                                    onChange={(e) => setData('sort_order', Number(e.target.value))}
                                    className="w-full p-2.5 rounded-lg border border-gray-300 focus:border-[#EF4A23]"
                                />
                            </div>
                        </div>

                        <div className="flex items-center gap-6 pt-2">
                            <label className="flex items-center gap-2 cursor-pointer font-semibold text-gray-700">
                                <input
                                    type="checkbox"
                                    checked={data.is_featured}
                                    onChange={(e) => setData('is_featured', e.target.checked)}
                                    className="rounded border-gray-300 text-[#EF4A23] focus:ring-[#EF4A23]"
                                />
                                <span>Featured on Homepage</span>
                            </label>
                            <label className="flex items-center gap-2 cursor-pointer font-semibold text-gray-700">
                                <input
                                    type="checkbox"
                                    checked={data.status}
                                    onChange={(e) => setData('status', e.target.checked)}
                                    className="rounded border-gray-300 text-[#EF4A23] focus:ring-[#EF4A23]"
                                />
                                <span>Active</span>
                            </label>
                        </div>

                        <div className="pt-4 border-t flex justify-end gap-3">
                            <Link
                                href={route('admin.categories.index')}
                                className="px-4 py-2 border rounded-lg hover:bg-gray-50 text-gray-700 font-semibold"
                            >
                                Cancel
                            </Link>
                            <button
                                type="submit"
                                disabled={processing}
                                className="bg-[#EF4A23] hover:bg-[#d63c17] text-white font-bold px-6 py-2 rounded-lg transition"
                            >
                                {processing ? 'Saving...' : 'Save Category'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </AdminLayout>
    );
}
