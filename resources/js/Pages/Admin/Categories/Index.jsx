import React from 'react';
import { Link, router } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Plus, Edit, Trash2, FolderTree } from 'lucide-react';

export default function Index({ categories }) {
    const handleDelete = (id, name) => {
        if (confirm(`Are you sure you want to delete category "${name}"?`)) {
            router.delete(route('admin.categories.destroy', id));
        }
    };

    return (
        <AdminLayout title="Manage Categories">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-xl font-black text-gray-900">Categories</h1>
                    <p className="text-xs text-gray-500">Organize and manage store categories & subcategories</p>
                </div>
                <Link
                    href={route('admin.categories.create')}
                    className="inline-flex items-center gap-1.5 bg-[#EF4A23] hover:bg-[#d63c17] text-white text-xs font-bold py-2.5 px-4 rounded-xl transition shadow-sm"
                >
                    <Plus className="w-4 h-4" />
                    <span>Add New Category</span>
                </Link>
            </div>

            <div className="bg-white rounded-2xl border border-gray-200/80 shadow-sm overflow-hidden">
                <table className="w-full text-left text-xs">
                    <thead className="bg-gray-50 border-b border-gray-200 text-gray-500 font-semibold uppercase">
                        <tr>
                            <th className="p-3.5">Category Name</th>
                            <th className="p-3.5">Slug</th>
                            <th className="p-3.5">Parent Category</th>
                            <th className="p-3.5 text-center">Status</th>
                            <th className="p-3.5 text-center">Featured</th>
                            <th className="p-3.5 text-center">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {categories.data.map((cat) => (
                            <tr key={cat.id} className="hover:bg-gray-50/50">
                                <td className="p-3.5 font-bold text-gray-900 flex items-center gap-2">
                                    <FolderTree className="w-4 h-4 text-gray-400" />
                                    <span>{cat.name}</span>
                                </td>
                                <td className="p-3.5 text-gray-500">{cat.slug}</td>
                                <td className="p-3.5 text-gray-600">
                                    {cat.parent ? cat.parent.name : <span className="text-gray-400">— (Root)</span>}
                                </td>
                                <td className="p-3.5 text-center">
                                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                                        cat.status ? 'bg-emerald-50 text-emerald-700' : 'bg-gray-100 text-gray-500'
                                    }`}>
                                        {cat.status ? 'Active' : 'Inactive'}
                                    </span>
                                </td>
                                <td className="p-3.5 text-center">
                                    {cat.is_featured ? (
                                        <span className="text-orange-600 font-bold">Yes</span>
                                    ) : (
                                        <span className="text-gray-400">No</span>
                                    )}
                                </td>
                                <td className="p-3.5 text-center">
                                    <div className="flex items-center justify-center gap-2">
                                        <Link
                                            href={route('admin.categories.edit', cat.id)}
                                            className="p-1 text-gray-500 hover:text-blue-600"
                                            title="Edit"
                                        >
                                            <Edit className="w-4 h-4" />
                                        </Link>
                                        <button
                                            onClick={() => handleDelete(cat.id, cat.name)}
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

            {categories.links && categories.links.length > 3 && (
                <div className="mt-6 flex justify-center">
                    <div className="flex items-center gap-1 bg-white p-1.5 rounded-xl border border-gray-200 shadow-sm">
                        {categories.links.map((link, idx) => (
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
