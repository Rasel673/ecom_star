import React, { useState, useEffect } from 'react';
import { Link, usePage } from '@inertiajs/react';
import { 
    LayoutDashboard, 
    FolderTree, 
    Package, 
    Tag, 
    ShoppingCart, 
    Image, 
    LogOut, 
    ExternalLink, 
    Menu, 
    X,
    CheckCircle2,
    AlertCircle,
    User,
    MessageSquare,
    Clock
} from 'lucide-react';

export default function AdminLayout({ children, title }) {
    const { auth, flash } = usePage().props;
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [alertMessage, setAlertMessage] = useState(null);
    const [alertType, setAlertType] = useState(null);

    useEffect(() => {
        if (flash?.success) {
            setAlertMessage(flash.success);
            setAlertType('success');
            const timer = setTimeout(() => setAlertMessage(null), 5000);
            return () => clearTimeout(timer);
        }
        if (flash?.error) {
            setAlertMessage(flash.error);
            setAlertType('error');
            const timer = setTimeout(() => setAlertMessage(null), 5000);
            return () => clearTimeout(timer);
        }
    }, [flash]);

    const navItems = [
        { label: 'Dashboard', href: route('admin.dashboard'), icon: LayoutDashboard, routeName: 'admin.dashboard' },
        { label: 'Categories', href: route('admin.categories.index'), icon: FolderTree, routeName: 'admin.categories.*' },
        { label: 'Products', href: route('admin.products.index'), icon: Package, routeName: 'admin.products.*' },
        { label: 'Brands', href: route('admin.brands.index'), icon: Tag, routeName: 'admin.brands.*' },
        { label: 'Orders', href: route('admin.orders.index'), icon: ShoppingCart, routeName: 'admin.orders.*' },
        { label: 'Pre-Orders', href: route('admin.preorders.index'), icon: Clock, routeName: 'admin.preorders.*' },
        { label: 'Customer Messages', href: route('admin.messages.index'), icon: MessageSquare, routeName: 'admin.messages.*' },
        { label: 'Banners & Sliders', href: route('admin.banners.index'), icon: Image, routeName: 'admin.banners.*' },
    ];

    return (
        <div className="min-h-screen bg-[#F8FAFC] flex text-[#1E293B]">
            {/* Flash notification */}
            {alertMessage && (
                <div className="fixed bottom-6 right-6 z-50 animate-in slide-in-from-bottom-5">
                    <div className={`flex items-center gap-3 px-4 py-3 rounded-xl shadow-2xl text-xs font-semibold text-white ${
                        alertType === 'success' ? 'bg-emerald-600' : 'bg-rose-600'
                    }`}>
                        {alertType === 'success' ? <CheckCircle2 className="w-4 h-4 shrink-0" /> : <AlertCircle className="w-4 h-4 shrink-0" />}
                        <span>{alertMessage}</span>
                        <button onClick={() => setAlertMessage(null)} className="ml-2 hover:opacity-75">
                            <X className="w-3.5 h-3.5" />
                        </button>
                    </div>
                </div>
            )}

            {/* Sidebar Desktop & Mobile */}
            <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-[#081621] text-white flex flex-col justify-between transition-transform duration-300 lg:translate-x-0 ${
                sidebarOpen ? 'translate-x-0' : '-translate-x-full'
            }`}>
                <div>
                    {/* Brand header */}
                    <div className="h-16 flex items-center justify-between px-6 border-b border-gray-800">
                        <Link href={route('admin.dashboard')} className="flex items-center gap-2">
                            <span className="text-xl font-black tracking-tight text-white">STAR</span>
                            <span className="text-xl font-black tracking-tight text-[#EF4A23]">TECH</span>
                            <span className="text-[10px] bg-orange-950 text-orange-400 font-bold px-1.5 py-0.5 rounded border border-orange-800">
                                ADMIN
                            </span>
                        </Link>
                        <button 
                            onClick={() => setSidebarOpen(false)} 
                            className="lg:hidden text-gray-400 hover:text-white"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    {/* Nav links */}
                    <nav className="p-4 space-y-1.5 text-xs font-semibold">
                        {navItems.map((item, idx) => {
                            const Icon = item.icon;
                            const isActive = route().current(item.routeName);
                            return (
                                <Link
                                    key={idx}
                                    href={item.href}
                                    className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl transition ${
                                        isActive
                                            ? 'bg-[#EF4A23] text-white shadow-md'
                                            : 'text-gray-300 hover:bg-gray-800/60 hover:text-white'
                                    }`}
                                >
                                    <Icon className="w-4 h-4" />
                                    <span>{item.label}</span>
                                </Link>
                            );
                        })}
                    </nav>
                </div>

                {/* Footer with Store link and Logout */}
                <div className="p-4 border-t border-gray-800 space-y-2 text-xs">
                    <Link
                        href="/"
                        target="_blank"
                        className="flex items-center justify-between px-3 py-2 text-gray-400 hover:text-white hover:bg-gray-800/60 rounded-xl transition"
                    >
                        <span className="flex items-center gap-2">
                            <ExternalLink className="w-4 h-4 text-orange-400" />
                            <span>View Storefront</span>
                        </span>
                        <span className="text-[10px] bg-gray-800 px-1.5 py-0.5 rounded text-gray-400">Live</span>
                    </Link>

                    <Link
                        href={route('logout')}
                        method="post"
                        as="button"
                        className="w-full flex items-center gap-2 px-3 py-2 text-rose-400 hover:bg-rose-950/40 hover:text-rose-300 rounded-xl transition font-semibold"
                    >
                        <LogOut className="w-4 h-4" />
                        <span>Sign Out</span>
                    </Link>
                </div>
            </aside>

            {/* Main Content Area */}
            <div className="flex-1 lg:pl-64 flex flex-col min-h-screen">
                {/* Top Bar */}
                <header className="h-16 bg-white border-b border-gray-200 px-6 flex items-center justify-between sticky top-0 z-30">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => setSidebarOpen(true)}
                            className="lg:hidden p-2 text-gray-600 hover:bg-gray-100 rounded-lg"
                        >
                            <Menu className="w-5 h-5" />
                        </button>
                        <h2 className="text-base font-bold text-gray-900">{title || 'Admin Control Panel'}</h2>
                    </div>

                    <div className="flex items-center gap-3">
                        <div className="flex items-center gap-2 text-xs">
                            <div className="w-8 h-8 rounded-full bg-orange-100 text-[#EF4A23] font-black flex items-center justify-center">
                                {auth.user?.name?.charAt(0) || 'A'}
                            </div>
                            <div className="hidden sm:block text-left">
                                <span className="block font-bold text-gray-900 leading-none">{auth.user?.name}</span>
                                <span className="text-[11px] text-gray-500">Administrator</span>
                            </div>
                        </div>
                    </div>
                </header>

                {/* Main Content */}
                <main className="flex-1 p-6 md:p-8">
                    {children}
                </main>
            </div>
        </div>
    );
}
