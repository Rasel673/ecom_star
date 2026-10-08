import React from 'react';
import { useForm, router } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Plus, Trash2, Image } from 'lucide-react';

export default function Index({ banners = [] }) {
    const { data, setData, post, reset, processing, errors } = useForm({
        title: '',
        subtitle: '',
        image: '',
        link: '',
        position: 'home_slider',
        sort_order: 0,
        status: true,
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('admin.banners.store'), {
            onSuccess: () => reset(),
        });
    };

    const handleDelete = (id, title) => {
        if (confirm(`Delete banner "${title || 'Untitled'}"?`)) {
            router.delete(route('admin.banners.destroy', id));
        }
    };

    return (
        <AdminLayout title="Manage Banners & Sliders">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Create Banner Form */}
                <div className="lg:col-span-4 bg-white rounded-2xl border border-gray-200/80 shadow-sm p-6">
                    <h3 className="text-sm font-bold text-gray-900 border-b pb-3 mb-4 flex items-center gap-2">
                        <Plus className="w-4 h-4 text-[#EF4A23]" />
                        <span>Add New Banner</span>
                    </h3>

                    <form onSubmit={handleSubmit} className="space-y-4 text-xs">
                        <div>
                            <label className="block font-semibold text-gray-700 mb-1">Banner Title</label>
                            <input
                                type="text"
                                value={data.title}
                                onChange={(e) => setData('title', e.target.value)}
                                className="w-full p-2.5 rounded-lg border border-gray-300 focus:border-[#EF4A23]"
                                placeholder="e.g. Build Your Dream PC"
                            />
                        </div>

                        <div>
                            <label className="block font-semibold text-gray-700 mb-1">Subtitle / Caption</label>
                            <input
                                type="text"
                                value={data.subtitle}
                                onChange={(e) => setData('subtitle', e.target.value)}
                                className="w-full p-2.5 rounded-lg border border-gray-300 focus:border-[#EF4A23]"
                                placeholder="Exclusive offer on latest processors"
                            />
                        </div>

                        <div>
                            <label className="block font-semibold text-gray-700 mb-1">Image URL *</label>
                            <input
                                type="text"
                                required
                                value={data.image}
                                onChange={(e) => setData('image', e.target.value)}
                                className="w-full p-2.5 rounded-lg border border-gray-300 focus:border-[#EF4A23]"
                                placeholder="https://images.unsplash.com/..."
                            />
                            {errors.image && <p className="text-rose-500 mt-1">{errors.image}</p>}
                        </div>

                        <div>
                            <label className="block font-semibold text-gray-700 mb-1">Click Link / URL</label>
                            <input
                                type="text"
                                value={data.link}
                                onChange={(e) => setData('link', e.target.value)}
                                className="w-full p-2.5 rounded-lg border border-gray-300 focus:border-[#EF4A23]"
                                placeholder="/pc-builder or /category/laptop"
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                            <div>
                                <label className="block font-semibold text-gray-700 mb-1">Position</label>
                                <select
                                    value={data.position}
                                    onChange={(e) => setData('position', e.target.value)}
                                    className="w-full p-2.5 rounded-lg border border-gray-300 focus:border-[#EF4A23]"
                                >
                                    <option value="home_slider">Hero Slider</option>
                                    <option value="home_banner_2">Right Promo Card</option>
                                    <option value="promo_banner">Popup Banner</option>
                                </select>
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

                        <button
                            type="submit"
                            disabled={processing}
                            className="w-full bg-[#EF4A23] hover:bg-[#d63c17] text-white font-bold py-2.5 rounded-lg transition"
                        >
                            {processing ? 'Saving...' : 'Add Banner'}
                        </button>
                    </form>
                </div>

                {/* Banners List */}
                <div className="lg:col-span-8 bg-white rounded-2xl border border-gray-200/80 shadow-sm overflow-hidden">
                    <div className="p-4 border-b">
                        <h3 className="text-sm font-bold text-gray-900">Current Promotional Banners</h3>
                    </div>

                    <div className="p-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {banners.map((banner) => (
                            <div key={banner.id} className="border border-gray-200 rounded-xl overflow-hidden relative group">
                                <img
                                    src={banner.image}
                                    alt={banner.title || 'Banner'}
                                    className="w-full h-32 object-cover"
                                />
                                <div className="p-3 bg-white text-xs">
                                    <div className="flex items-center justify-between">
                                        <span className="font-bold text-gray-900 truncate">{banner.title || 'Untitled Banner'}</span>
                                        <span className="text-[10px] bg-gray-100 text-gray-600 px-2 py-0.5 rounded font-semibold uppercase">
                                            {banner.position}
                                        </span>
                                    </div>
                                    <p className="text-[11px] text-gray-400 mt-0.5 truncate">{banner.subtitle || 'No subtitle'}</p>
                                </div>
                                <button
                                    onClick={() => handleDelete(banner.id, banner.title)}
                                    className="absolute top-2 right-2 bg-rose-600 hover:bg-rose-700 text-white p-1.5 rounded-lg shadow-md transition opacity-0 group-hover:opacity-100"
                                    title="Delete banner"
                                >
                                    <Trash2 className="w-3.5 h-3.5" />
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
