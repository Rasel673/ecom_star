import React, { useState } from 'react';
import { useForm, Link } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { ArrowLeft, Plus, Trash2 } from 'lucide-react';

export default function Create({ categories = [], brands = [] }) {
    const { data, setData, post, processing, errors } = useForm({
        name: '',
        slug: '',
        category_id: '',
        brand_id: '',
        model: '',
        sku: '',
        regular_price: '',
        special_price: '',
        stock_status: 'in_stock',
        quantity: 10,
        thumbnail: '',
        key_features: [''],
        specifications: { 'Warranty': '3 Years' },
        description: '',
        is_featured: false,
        is_popular: false,
        status: true,
        meta_title: '',
        meta_description: '',
    });

    // Feature bullets handlers
    const addFeature = () => {
        setData('key_features', [...data.key_features, '']);
    };
    const updateFeature = (index, value) => {
        const copy = [...data.key_features];
        copy[index] = value;
        setData('key_features', copy);
    };
    const removeFeature = (index) => {
        setData('key_features', data.key_features.filter((_, i) => i !== index));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('admin.products.store'));
    };

    return (
        <AdminLayout title="Add Product">
            <div className="max-w-4xl mx-auto">
                <Link
                    href={route('admin.products.index')}
                    className="inline-flex items-center gap-1.5 text-xs text-gray-500 hover:text-[#EF4A23] font-semibold mb-4"
                >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    <span>Back to Products</span>
                </Link>

                <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 md:p-8">
                    <h2 className="text-base font-bold text-gray-900 border-b pb-3 mb-6">Create New Tech Product</h2>

                    <form onSubmit={handleSubmit} className="space-y-6 text-xs">
                        {/* Name & Model */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="md:col-span-2">
                                <label className="block font-semibold text-gray-700 mb-1">
                                    Product Name <span className="text-rose-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    required
                                    value={data.name}
                                    onChange={(e) => setData('name', e.target.value)}
                                    className="w-full p-2.5 rounded-lg border border-gray-300 focus:border-[#EF4A23]"
                                    placeholder="e.g. Intel Core i5-14400 10-Core Processor"
                                />
                                {errors.name && <p className="text-rose-500 mt-1">{errors.name}</p>}
                            </div>
                            <div>
                                <label className="block font-semibold text-gray-700 mb-1">Model</label>
                                <input
                                    type="text"
                                    value={data.model}
                                    onChange={(e) => setData('model', e.target.value)}
                                    className="w-full p-2.5 rounded-lg border border-gray-300 focus:border-[#EF4A23]"
                                    placeholder="Core i5-14400"
                                />
                            </div>
                        </div>

                        {/* Category & Brand & SKU */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                                <label className="block font-semibold text-gray-700 mb-1">
                                    Category <span className="text-rose-500">*</span>
                                </label>
                                <select
                                    required
                                    value={data.category_id}
                                    onChange={(e) => setData('category_id', e.target.value)}
                                    className="w-full p-2.5 rounded-lg border border-gray-300 focus:border-[#EF4A23]"
                                >
                                    <option value="">— Select Category —</option>
                                    {categories.map((c) => (
                                        <option key={c.id} value={c.id}>{c.name}</option>
                                    ))}
                                </select>
                                {errors.category_id && <p className="text-rose-500 mt-1">{errors.category_id}</p>}
                            </div>

                            <div>
                                <label className="block font-semibold text-gray-700 mb-1">Brand</label>
                                <select
                                    value={data.brand_id}
                                    onChange={(e) => setData('brand_id', e.target.value)}
                                    className="w-full p-2.5 rounded-lg border border-gray-300 focus:border-[#EF4A23]"
                                >
                                    <option value="">— Select Brand —</option>
                                    {brands.map((b) => (
                                        <option key={b.id} value={b.id}>{b.name}</option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block font-semibold text-gray-700 mb-1">SKU / Code</label>
                                <input
                                    type="text"
                                    value={data.sku}
                                    onChange={(e) => setData('sku', e.target.value)}
                                    className="w-full p-2.5 rounded-lg border border-gray-300 focus:border-[#EF4A23]"
                                    placeholder="CPU-INTEL-14400"
                                />
                            </div>
                        </div>

                        {/* Pricing & Stock */}
                        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                            <div>
                                <label className="block font-semibold text-gray-700 mb-1">
                                    Regular Price (৳) <span className="text-rose-500">*</span>
                                </label>
                                <input
                                    type="number"
                                    required
                                    value={data.regular_price}
                                    onChange={(e) => setData('regular_price', e.target.value)}
                                    className="w-full p-2.5 rounded-lg border border-gray-300 focus:border-[#EF4A23]"
                                    placeholder="27500"
                                />
                            </div>

                            <div>
                                <label className="block font-semibold text-gray-700 mb-1">Special / Cash Price (৳)</label>
                                <input
                                    type="number"
                                    value={data.special_price}
                                    onChange={(e) => setData('special_price', e.target.value)}
                                    className="w-full p-2.5 rounded-lg border border-gray-300 focus:border-[#EF4A23]"
                                    placeholder="25800"
                                />
                            </div>

                            <div>
                                <label className="block font-semibold text-gray-700 mb-1">Stock Status</label>
                                <select
                                    value={data.stock_status}
                                    onChange={(e) => setData('stock_status', e.target.value)}
                                    className="w-full p-2.5 rounded-lg border border-gray-300 focus:border-[#EF4A23]"
                                >
                                    <option value="in_stock">In Stock</option>
                                    <option value="out_of_stock">Out of Stock</option>
                                    <option value="upcoming">Upcoming</option>
                                </select>
                            </div>

                            <div>
                                <label className="block font-semibold text-gray-700 mb-1">Quantity</label>
                                <input
                                    type="number"
                                    value={data.quantity}
                                    onChange={(e) => setData('quantity', Number(e.target.value))}
                                    className="w-full p-2.5 rounded-lg border border-gray-300 focus:border-[#EF4A23]"
                                />
                            </div>
                        </div>

                        {/* Thumbnail Image URL */}
                        <div>
                            <label className="block font-semibold text-gray-700 mb-1">Thumbnail Image URL</label>
                            <input
                                type="text"
                                value={data.thumbnail}
                                onChange={(e) => setData('thumbnail', e.target.value)}
                                className="w-full p-2.5 rounded-lg border border-gray-300 focus:border-[#EF4A23]"
                                placeholder="https://images.unsplash.com/photo-..."
                            />
                        </div>

                        {/* Key Features Bullets */}
                        <div>
                            <div className="flex items-center justify-between mb-2">
                                <label className="font-semibold text-gray-700">Key Features</label>
                                <button
                                    type="button"
                                    onClick={addFeature}
                                    className="text-xs text-[#EF4A23] font-bold flex items-center gap-1 hover:underline"
                                >
                                    <Plus className="w-3.5 h-3.5" /> Add Bullet Point
                                </button>
                            </div>
                            <div className="space-y-2">
                                {data.key_features.map((feat, idx) => (
                                    <div key={idx} className="flex items-center gap-2">
                                        <input
                                            type="text"
                                            value={feat}
                                            onChange={(e) => updateFeature(idx, e.target.value)}
                                            className="w-full p-2 rounded-lg border border-gray-300 focus:border-[#EF4A23]"
                                            placeholder={`Feature #${idx + 1}`}
                                        />
                                        <button
                                            type="button"
                                            onClick={() => removeFeature(idx)}
                                            className="p-2 text-gray-400 hover:text-rose-600"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Description */}
                        <div>
                            <label className="block font-semibold text-gray-700 mb-1">Description</label>
                            <textarea
                                rows="3"
                                value={data.description}
                                onChange={(e) => setData('description', e.target.value)}
                                className="w-full p-2.5 rounded-lg border border-gray-300 focus:border-[#EF4A23]"
                                placeholder="Product overview and features..."
                            />
                        </div>

                        {/* Toggles */}
                        <div className="flex flex-wrap items-center gap-6 pt-2">
                            <label className="flex items-center gap-2 cursor-pointer font-semibold text-gray-700">
                                <input
                                    type="checkbox"
                                    checked={data.is_featured}
                                    onChange={(e) => setData('is_featured', e.target.checked)}
                                    className="rounded border-gray-300 text-[#EF4A23] focus:ring-[#EF4A23]"
                                />
                                <span>Featured Product</span>
                            </label>
                            <label className="flex items-center gap-2 cursor-pointer font-semibold text-gray-700">
                                <input
                                    type="checkbox"
                                    checked={data.is_popular}
                                    onChange={(e) => setData('is_popular', e.target.checked)}
                                    className="rounded border-gray-300 text-[#EF4A23] focus:ring-[#EF4A23]"
                                />
                                <span>Popular / Trending</span>
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

                        {/* Actions */}
                        <div className="pt-4 border-t flex justify-end gap-3">
                            <Link
                                href={route('admin.products.index')}
                                className="px-4 py-2 border rounded-lg hover:bg-gray-50 text-gray-700 font-semibold"
                            >
                                Cancel
                            </Link>
                            <button
                                type="submit"
                                disabled={processing}
                                className="bg-[#EF4A23] hover:bg-[#d63c17] text-white font-bold px-6 py-2.5 rounded-lg transition"
                            >
                                {processing ? 'Saving...' : 'Save Product'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </AdminLayout>
    );
}
