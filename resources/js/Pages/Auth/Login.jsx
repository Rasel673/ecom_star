import React, { useState } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import { 
    Mail, 
    Lock, 
    Eye, 
    EyeOff, 
    ArrowRight, 
    ShieldCheck, 
    ShoppingBag, 
    Cpu, 
    Clock, 
    MessageSquare, 
    Sparkles, 
    CheckCircle2,
    Shield
} from 'lucide-react';

export default function Login({ status, canResetPassword }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        email: '',
        password: '',
        remember: true,
    });

    const [showPassword, setShowPassword] = useState(false);

    const submit = (e) => {
        e.preventDefault();
        post(route('login'), {
            onFinish: () => reset('password'),
        });
    };

    const fillDemoCustomer = () => {
        setData({
            email: 'customer@gmail.com',
            password: 'password123',
            remember: true,
        });
    };

    return (
        <div className="min-h-screen bg-[#F4F7F9] flex flex-col justify-between text-gray-800">
            <Head title="Customer Login - Star Tech" />

            {/* Top Minimal Bar */}
            <header className="bg-white border-b border-gray-200 py-3.5 px-4 sm:px-8">
                <div className="max-w-7xl mx-auto flex items-center justify-between">
                    <Link href="/" className="flex items-center gap-2 group">
                        <span className="text-2xl font-black tracking-tight text-[#081621] group-hover:opacity-90">
                            STAR
                        </span>
                        <span className="text-2xl font-black tracking-tight text-[#EF4A23]">
                            TECH
                        </span>
                    </Link>
                    <div className="flex items-center gap-3 text-xs">
                        <span className="text-gray-500 hidden sm:inline">New to Star Tech?</span>
                        <Link 
                            href={route('register')} 
                            className="font-bold text-[#EF4A23] hover:underline"
                        >
                            Create an Account
                        </Link>
                    </div>
                </div>
            </header>

            {/* Main Content Area */}
            <main className="flex-1 flex items-center justify-center p-4 sm:p-6 lg:p-10">
                <div className="w-full max-w-4xl bg-white rounded-3xl shadow-xl border border-gray-200/90 overflow-hidden grid grid-cols-1 md:grid-cols-12">
                    
                    {/* Left: StarTech Brand Perks Showcase */}
                    <div className="hidden md:flex md:col-span-5 bg-gradient-to-br from-[#081621] via-[#112538] to-[#081621] p-8 text-white flex-col justify-between relative overflow-hidden">
                        {/* Decorative background circle */}
                        <div className="absolute -right-16 -top-16 w-56 h-56 rounded-full bg-orange-600/15 blur-2xl pointer-events-none"></div>
                        <div className="absolute -left-16 -bottom-16 w-56 h-56 rounded-full bg-blue-600/15 blur-2xl pointer-events-none"></div>

                        <div className="relative z-10">
                            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-500/10 text-orange-400 border border-orange-500/20 text-[11px] font-bold mb-6">
                                <Sparkles className="w-3.5 h-3.5" />
                                <span>StarTech Customer Portal</span>
                            </div>

                            <h2 className="text-2xl font-black leading-tight mb-2">
                                Welcome Back, Tech Enthusiast.
                            </h2>
                            <p className="text-xs text-gray-300 leading-relaxed mb-8">
                                Sign in to unlock member perks, custom build tools, and fast checkout on Bangladesh's #1 tech store.
                            </p>

                            {/* Features list */}
                            <div className="space-y-4 text-xs">
                                <div className="flex items-start gap-3">
                                    <div className="w-7 h-7 rounded-lg bg-white/10 flex items-center justify-center shrink-0 text-[#EF4A23]">
                                        <ShoppingBag className="w-4 h-4" />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-white">Live Order Tracking & Invoices</h4>
                                        <p className="text-gray-400 text-[11px]">Print official invoices & track Steadfast / RedX shipments.</p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-3">
                                    <div className="w-7 h-7 rounded-lg bg-white/10 flex items-center justify-center shrink-0 text-amber-400">
                                        <Cpu className="w-4 h-4" />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-white">Saved PC Builder History</h4>
                                        <p className="text-gray-400 text-[11px]">Save custom gaming rigs and reload anytime.</p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-3">
                                    <div className="w-7 h-7 rounded-lg bg-white/10 flex items-center justify-center shrink-0 text-emerald-400">
                                        <Clock className="w-4 h-4" />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-white">Priority Pre-Orders</h4>
                                        <p className="text-gray-400 text-[11px]">Reserve upcoming stock with guaranteed availability.</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Bottom security assurance */}
                        <div className="relative z-10 pt-8 border-t border-gray-800/80 flex items-center gap-2 text-[11px] text-gray-400">
                            <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                            <span>100% Genuine Products & Official Warranty</span>
                        </div>
                    </div>

                    {/* Right: Modern Login Form */}
                    <div className="md:col-span-7 p-6 sm:p-10 flex flex-col justify-between">
                        <div>
                            {/* Form Header */}
                            <div className="mb-6">
                                <h1 className="text-xl sm:text-2xl font-black text-gray-900 tracking-tight">
                                    Customer Sign In
                                </h1>
                                <p className="text-xs text-gray-500 mt-1">
                                    Enter your credentials to manage orders, wishlist, and builds.
                                </p>
                            </div>

                            {/* Demo Autofill Shortcut */}
                            <div className="mb-6 p-3 bg-orange-50/70 border border-orange-200/80 rounded-2xl flex items-center justify-between gap-3 text-xs">
                                <div className="flex items-center gap-2">
                                    <span className="w-2 h-2 rounded-full bg-[#EF4A23] animate-pulse"></span>
                                    <span className="text-gray-700 font-medium">Quick Demo Customer:</span>
                                    <code className="bg-orange-100 text-[#EF4A23] px-1.5 py-0.5 rounded text-[11px] font-bold">
                                        customer@gmail.com
                                    </code>
                                </div>
                                <button
                                    type="button"
                                    onClick={fillDemoCustomer}
                                    className="px-2.5 py-1 bg-[#EF4A23] hover:bg-[#d63c17] text-white text-[11px] font-bold rounded-lg transition shadow-sm"
                                >
                                    Autofill
                                </button>
                            </div>

                            {/* Flash Status message */}
                            {status && (
                                <div className="mb-5 p-3 rounded-xl bg-emerald-50 text-emerald-700 text-xs font-semibold border border-emerald-200 flex items-center gap-2">
                                    <CheckCircle2 className="w-4 h-4 shrink-0" />
                                    <span>{status}</span>
                                </div>
                            )}

                            {/* The Form */}
                            <form onSubmit={submit} className="space-y-4">
                                {/* Email Field */}
                                <div>
                                    <label className="block text-xs font-bold text-gray-700 mb-1.5" htmlFor="email">
                                        Email Address
                                    </label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                                            <Mail className="w-4 h-4" />
                                        </div>
                                        <input
                                            id="email"
                                            type="email"
                                            name="email"
                                            value={data.email}
                                            autoComplete="username"
                                            required
                                            onChange={(e) => setData('email', e.target.value)}
                                            placeholder="e.g. yourname@example.com"
                                            className={`w-full pl-10 pr-4 py-2.5 text-xs rounded-xl border transition ${
                                                errors.email 
                                                    ? 'border-rose-300 focus:border-rose-500 focus:ring-rose-200 bg-rose-50/20' 
                                                    : 'border-gray-300 focus:border-[#EF4A23] focus:ring-orange-100 bg-white'
                                            } focus:outline-none focus:ring-4`}
                                        />
                                    </div>
                                    {errors.email && (
                                        <p className="mt-1.5 text-xs text-rose-600 font-medium">{errors.email}</p>
                                    )}
                                </div>

                                {/* Password Field */}
                                <div>
                                    <div className="flex items-center justify-between mb-1.5">
                                        <label className="block text-xs font-bold text-gray-700" htmlFor="password">
                                            Password
                                        </label>
                                        {canResetPassword && (
                                            <Link
                                                href={route('password.request')}
                                                className="text-[11px] font-semibold text-[#EF4A23] hover:underline"
                                            >
                                                Forgot Password?
                                            </Link>
                                        )}
                                    </div>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                                            <Lock className="w-4 h-4" />
                                        </div>
                                        <input
                                            id="password"
                                            type={showPassword ? 'text' : 'password'}
                                            name="password"
                                            value={data.password}
                                            autoComplete="current-password"
                                            required
                                            onChange={(e) => setData('password', e.target.value)}
                                            placeholder="••••••••"
                                            className={`w-full pl-10 pr-10 py-2.5 text-xs rounded-xl border transition ${
                                                errors.password 
                                                    ? 'border-rose-300 focus:border-rose-500 focus:ring-rose-200 bg-rose-50/20' 
                                                    : 'border-gray-300 focus:border-[#EF4A23] focus:ring-orange-100 bg-white'
                                            } focus:outline-none focus:ring-4`}
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-gray-400 hover:text-gray-600 transition"
                                        >
                                            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                        </button>
                                    </div>
                                    {errors.password && (
                                        <p className="mt-1.5 text-xs text-rose-600 font-medium">{errors.password}</p>
                                    )}
                                </div>

                                {/* Remember Me Checkbox */}
                                <div className="flex items-center justify-between pt-1">
                                    <label className="flex items-center gap-2 cursor-pointer select-none">
                                        <input
                                            type="checkbox"
                                            name="remember"
                                            checked={data.remember}
                                            onChange={(e) => setData('remember', e.target.checked)}
                                            className="w-4 h-4 text-[#EF4A23] border-gray-300 rounded focus:ring-[#EF4A23]"
                                        />
                                        <span className="text-xs text-gray-600">Keep me logged in</span>
                                    </label>
                                </div>

                                {/* Submit Button */}
                                <div className="pt-2">
                                    <button
                                        type="submit"
                                        disabled={processing}
                                        className="w-full py-3 px-4 rounded-xl bg-[#EF4A23] hover:bg-[#d63c17] text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-orange-500/25 hover:shadow-orange-500/35 transition disabled:opacity-50"
                                    >
                                        <span>{processing ? 'Signing In...' : 'Sign In to Account'}</span>
                                        <ArrowRight className="w-4 h-4" />
                                    </button>
                                </div>
                            </form>

                            {/* Don't have an account */}
                            <div className="mt-6 text-center text-xs text-gray-500">
                                Don't have a StarTech account?{' '}
                                <Link 
                                    href={route('register')} 
                                    className="font-bold text-[#EF4A23] hover:underline"
                                >
                                    Register Now
                                </Link>
                            </div>
                        </div>

                        {/* Admin Portal Gateway footer */}
                        <div className="mt-8 pt-4 border-t border-gray-100 flex items-center justify-between text-[11px] text-gray-400">
                            <span>StarTech Internal Employee?</span>
                            <Link 
                                href={route('admin.login')}
                                className="font-bold text-gray-700 hover:text-[#EF4A23] transition flex items-center gap-1"
                            >
                                <Shield className="w-3.5 h-3.5 text-gray-500" />
                                <span>Admin Portal &rarr;</span>
                            </Link>
                        </div>
                    </div>
                </div>
            </main>

            {/* Bottom Footer Info */}
            <footer className="py-4 text-center text-xs text-gray-400 border-t border-gray-200 bg-white">
                &copy; {new Date().getFullYear()} Star Tech & Engineering Ltd. All Rights Reserved.
            </footer>
        </div>
    );
}
