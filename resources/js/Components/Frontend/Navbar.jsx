import React, { useState } from 'react';
import { Link, usePage } from '@inertiajs/react';
import { ChevronDown, ChevronRight } from 'lucide-react';

export default function Navbar() {
    const { categoriesNav } = usePage().props;
    const [activeHover, setActiveHover] = useState(null);

    if (!categoriesNav || categoriesNav.length === 0) return null;

    return (
        <nav className="w-full bg-[#081621] border-t border-gray-800 text-white relative z-40 hidden lg:block">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <ul className="flex items-center justify-between text-xs font-semibold">
                    {categoriesNav.map((cat) => {
                        const hasChildren = cat.children && cat.children.length > 0;
                        return (
                            <li
                                key={cat.id}
                                className="relative group py-2.5"
                                onMouseEnter={() => setActiveHover(cat.id)}
                                onMouseLeave={() => setActiveHover(null)}
                            >
                                <Link
                                    href={route('category.show', cat.slug)}
                                    className="flex items-center gap-1 text-gray-200 hover:text-[#EF4A23] transition whitespace-nowrap px-2 py-1"
                                >
                                    <span>{cat.name}</span>
                                    {hasChildren && <ChevronDown className="w-3 h-3 text-gray-400 group-hover:text-[#EF4A23]" />}
                                </Link>

                                {/* Dropdown Menu */}
                                {hasChildren && activeHover === cat.id && (
                                    <div className="absolute top-full left-0 w-64 bg-[#0e1e2d] border border-gray-700 rounded-b-lg shadow-2xl py-2 z-50 animate-in fade-in slide-in-from-top-1 duration-150">
                                        <div className="text-[11px] font-bold text-gray-400 px-4 py-1.5 uppercase tracking-wider border-b border-gray-800">
                                            {cat.name} Categories
                                        </div>
                                        <div className="py-1">
                                            {cat.children.map((child) => (
                                                <Link
                                                    key={child.id}
                                                    href={route('category.show', child.slug)}
                                                    className="flex items-center justify-between px-4 py-2 text-xs text-gray-300 hover:text-white hover:bg-[#182f45] transition"
                                                >
                                                    <span>{child.name}</span>
                                                    <ChevronRight className="w-3 h-3 text-gray-500" />
                                                </Link>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </li>
                        );
                    })}
                </ul>
            </div>
        </nav>
    );
}
