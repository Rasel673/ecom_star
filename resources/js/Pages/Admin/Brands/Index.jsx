import React, { useState } from 'react';
import { useForm, router } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Plus, Trash2, Tag } from 'lucide-react';

export default function Index({ brands }) {
    const { data, setData, post, reset, processing, errors } = useForm({
        name: '',
        slug: '',
        logo: '',
        is_featured: false,
        status: true,
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('admin.brands.store'), {
            onSuccess: () => reset(),
        });
    };

    const handleDelete = (id, name) => {
        if (confirm(`Delete brand "${name}"?`)) {
            router.delete(route('admin.brands.destroy', id));
        }
    };

    return (
        <AdminLayout title="Manage Brands">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Form to Add Brand */}
                <div className="lg:col-span-4 bg-white rounded-2xl border border-gray-200/80 shadow-sm p-6">
                    <h3 className="text-sm font-bold text-gray-900 border-b pb-3 mb-4 flex items-center gap-2">
                        <Plus className="w-4 h-4 text-[#EF4A23]" />
                        <span>Add New Brand</span>
                    </h3>

                    <form onSubmit={handleSubmit} className="space-y-4 text-xs">
                        <div>
                            <label className="block font-semibold text-gray-700 mb-1">Brand Name *</label>
                            <input
                                type="text"
                                required
                                value={data.name}
                                onChange={(e) => setData('name', e.target.value)}
                                className="w-full p-2.5 rounded-lg border border-gray-300 focus:border-[#EF4A23]"
                                placeholder="e.g. Corsair"
                            />
                            {errors.name && <p className="text-rose-500 mt-1">{errors.name}</p>}
                        </div>

                        <div>
                            <label className="block font-semibold text-gray-700 mb-1">Logo URL</label>
                            <input
                                type="text"
                                value={data.logo}
                                onChange={(e) => setData('logo', e.target.value)}
                                className="w-full p-2.5 rounded-lg border border-gray-300 focus:border-[#EF4A23]"
                                placeholder="https://..."
                            />
                        </div>

                        <div className="flex items-center gap-4 pt-2">
                            <label className="flex items-center gap-2 cursor-pointer font-semibold text-gray-700">
                                <input
                                    type="checkbox"
                                    checked={data.is_featured}
                                    onChange={(e) => setData('is_featured', e.target.checked)}
                                    className="rounded border-gray-300 text-[#EF4A23] focus:ring-[#EF4A23]"
                                />
                                <span>Featured</span>
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

                        <button
                            type="submit"
                            disabled={processing}
                            className="w-full bg-[#EF4A23] hover:bg-[#d63c17] text-white font-bold py-2.5 rounded-lg transition"
                        >
                            {processing ? 'Saving...' : 'Add Brand'}
                        </button>
                    </form>
                </div>

                {/* Brands List */}
                <div className="lg:col-span-8 bg-white rounded-2xl border border-gray-200/80 shadow-sm overflow-hidden">
                    <div className="p-4 border-b">
                        <h3 className="text-sm font-bold text-gray-900">Registered Brands</h3>
                    </div>
                    <table className="w-full text-left text-xs">
                        <thead className="bg-gray-50 border-b text-gray-500 uppercase font-semibold">
                            <tr>
                                <th className="p-3.5">Brand</th>
                                <th className="p-3.5">Slug</th>
                                <th className="p-3.5 text-center">Products</th>
                                <th className="p-3.5 text-center">Featured</th>
                                <th className="p-3.5 text-center">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {brands.data.map((brand) => (
                                <tr key={brand.id} className="hover:bg-gray-50/50">
                                    <td className="p-3.5 font-bold text-gray-900 flex items-center gap-2">
                                        <Tag className="w-3.5 h-3.5 text-gray-400" />
                                        <span>{brand.name}</span>
                                    </td>
                                    <td className="p-3.5 text-gray-500">{brand.slug}</td>
                                    <td className="p-3.5 text-center font-bold text-gray-700">
                                        {brand.products_count}
                                    </td>
                                    <td className="p-3.5 text-center">
                                        {brand.is_featured ? (
                                            <span className="text-orange-600 font-bold">Yes</span>
                                        ) : (
                                            <span className="text-gray-400">No</span>
                                        )}
                                    </td>
                                    <td className="p-3.5 text-center">
                                        <button
                                            onClick={() => handleDelete(brand.id, brand.name)}
                                            className="p-1 text-gray-400 hover:text-rose-600"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </AdminLayout>
    );
}
