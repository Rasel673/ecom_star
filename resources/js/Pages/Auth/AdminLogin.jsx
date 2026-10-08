import React, { useState } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import { 
    Shield, 
    Lock, 
    Mail, 
    Eye, 
    EyeOff, 
    ArrowRight, 
    Terminal, 
    Server, 
    CheckCircle2, 
    AlertCircle,
    Store,
    KeyRound
} from 'lucide-react';

export default function AdminLogin({ status }) {
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

    const fillDemoAdmin = () => {
        setData({
            email: 'admin@startech.com.bd',
            password: 'password123',
            remember: true,
        });
    };

    return (
        <div className="min-h-screen bg-[#050B14] text-gray-200 flex flex-col justify-between relative overflow-hidden font-sans selection:bg-[#EF4A23] selection:text-white">
            <Head title="Admin Security Gateway - Star Tech" />

            {/* Cyber Grid Background overlay */}
            <div 
                className="absolute inset-0 opacity-[0.03] pointer-events-none"
                style={{
                    backgroundImage: `linear-gradient(#ffffff 1px, transparent 1px), linear-gradient(90deg, #ffffff 1px, transparent 1px)`,
                    backgroundSize: '40px 40px'
                }}
            ></div>

            {/* Ambient glowing radial lights */}
            <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-gradient-to-tr from-[#EF4A23]/10 via-orange-600/5 to-blue-600/10 rounded-full blur-3xl pointer-events-none"></div>

            {/* Top Navigation */}
            <header className="relative z-10 border-b border-gray-800/80 bg-[#08121E]/60 backdrop-blur-md px-6 py-4">
                <div className="max-w-6xl mx-auto flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <Link href="/" className="flex items-center gap-2">
                            <span className="text-xl font-black tracking-tight text-white">STAR</span>
                            <span className="text-xl font-black tracking-tight text-[#EF4A23]">TECH</span>
                        </Link>
                        <span className="h-4 w-[1px] bg-gray-700"></span>
                        <div className="flex items-center gap-1.5 px-2 py-0.5 rounded bg-orange-950/40 text-orange-400 border border-orange-800/60 text-[10px] font-mono font-bold uppercase tracking-wider">
                            <Shield className="w-3 h-3 text-[#EF4A23]" />
                            <span>Command Portal</span>
                        </div>
                    </div>

                    <Link
                        href="/"
                        className="text-xs text-gray-400 hover:text-white transition flex items-center gap-1.5 font-medium"
                    >
                        <Store className="w-3.5 h-3.5" />
                        <span>Return to Store</span>
                    </Link>
                </div>
            </header>

            {/* Main Auth Container */}
            <main className="flex-1 flex items-center justify-center p-4 sm:p-6 relative z-10 my-8">
                <div className="w-full max-w-md bg-[#0B1726]/90 backdrop-blur-xl border border-gray-800/90 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
                    {/* Glowing top line accent */}
                    <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#EF4A23] to-transparent"></div>

                    {/* Shield Icon Header */}
                    <div className="text-center mb-6">
                        <div className="w-14 h-14 mx-auto rounded-2xl bg-[#08121E] border border-gray-700/80 text-[#EF4A23] flex items-center justify-center shadow-lg shadow-black/50 mb-3.5">
                            <KeyRound className="w-6 h-6 text-[#EF4A23]" />
                        </div>
                        <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                            Admin Authentication
                        </h1>
                        <p className="text-xs text-gray-400 mt-1">
                            Authorized StarTech personnel and store operators only
                        </p>
                    </div>

                    {/* Demo Autofill Banner */}
                    <div className="mb-6 p-3 bg-gray-900/80 border border-gray-700/60 rounded-xl flex items-center justify-between gap-2 text-xs">
                        <div className="flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                            <span className="text-gray-300 font-medium">Demo Admin:</span>
                            <code className="bg-gray-800 text-orange-300 px-1.5 py-0.5 rounded text-[11px] font-mono">
                                admin@startech.com.bd
                            </code>
                        </div>
                        <button
                            type="button"
                            onClick={fillDemoAdmin}
                            className="px-2.5 py-1 bg-[#EF4A23] hover:bg-[#d63c17] text-white text-[10px] font-bold rounded-lg transition shadow-sm uppercase tracking-wider"
                        >
                            Autofill
                        </button>
                    </div>

                    {/* Status notification */}
                    {status && (
                        <div className="mb-5 p-3 rounded-xl bg-emerald-950/40 text-emerald-300 text-xs font-semibold border border-emerald-800/60 flex items-center gap-2">
                            <CheckCircle2 className="w-4 h-4 shrink-0" />
                            <span>{status}</span>
                        </div>
                    )}

                    {/* Form */}
                    <form onSubmit={submit} className="space-y-4">
                        {/* Admin Email */}
                        <div>
                            <label className="block text-xs font-bold text-gray-300 mb-1.5" htmlFor="admin-email">
                                Admin Email
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                                    <Mail className="w-4 h-4" />
                                </div>
                                <input
                                    id="admin-email"
                                    type="email"
                                    name="email"
                                    value={data.email}
                                    autoComplete="username"
                                    required
                                    onChange={(e) => setData('email', e.target.value)}
                                    placeholder="admin@startech.com.bd"
                                    className={`w-full pl-10 pr-4 py-2.5 text-xs rounded-xl border bg-[#060D17] text-white transition ${
                                        errors.email 
                                            ? 'border-rose-500/80 focus:border-rose-500 focus:ring-rose-900/40' 
                                            : 'border-gray-700/80 focus:border-[#EF4A23] focus:ring-orange-950/50'
                                    } focus:outline-none focus:ring-4`}
                                />
                            </div>
                            {errors.email && (
                                <p className="mt-1.5 text-xs text-rose-400 font-medium flex items-center gap-1">
                                    <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                                    <span>{errors.email}</span>
                                </p>
                            )}
                        </div>

                        {/* Master Password */}
                        <div>
                            <label className="block text-xs font-bold text-gray-300 mb-1.5" htmlFor="admin-password">
                                Security Password
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                                    <Lock className="w-4 h-4" />
                                </div>
                                <input
                                    id="admin-password"
                                    type={showPassword ? 'text' : 'password'}
                                    name="password"
                                    value={data.password}
                                    autoComplete="current-password"
                                    required
                                    onChange={(e) => setData('password', e.target.value)}
                                    placeholder="••••••••••••"
                                    className={`w-full pl-10 pr-10 py-2.5 text-xs rounded-xl border bg-[#060D17] text-white transition ${
                                        errors.password 
                                            ? 'border-rose-500/80 focus:border-rose-500 focus:ring-rose-900/40' 
                                            : 'border-gray-700/80 focus:border-[#EF4A23] focus:ring-orange-950/50'
                                    } focus:outline-none focus:ring-4`}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-gray-400 hover:text-gray-200 transition"
                                >
                                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                </button>
                            </div>
                            {errors.password && (
                                <p className="mt-1.5 text-xs text-rose-400 font-medium flex items-center gap-1">
                                    <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                                    <span>{errors.password}</span>
                                </p>
                            )}
                        </div>

                        {/* Remember Session */}
                        <div className="flex items-center justify-between pt-1">
                            <label className="flex items-center gap-2 cursor-pointer select-none">
                                <input
                                    type="checkbox"
                                    name="remember"
                                    checked={data.remember}
                                    onChange={(e) => setData('remember', e.target.checked)}
                                    className="w-4 h-4 text-[#EF4A23] bg-[#060D17] border-gray-700 rounded focus:ring-[#EF4A23] focus:ring-offset-0"
                                />
                                <span className="text-xs text-gray-400">Remember administrative workstation</span>
                            </label>
                        </div>

                        {/* Submit Button */}
                        <div className="pt-2">
                            <button
                                type="submit"
                                disabled={processing}
                                className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-[#EF4A23] to-[#d63c17] hover:from-[#d63c17] hover:to-[#be3412] text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-orange-950/60 transition disabled:opacity-50"
                            >
                                <span>{processing ? 'Authenticating System...' : 'Enter Admin Control Center'}</span>
                                <ArrowRight className="w-4 h-4" />
                            </button>
                        </div>
                    </form>

                    {/* Bottom Security Footer */}
                    <div className="mt-8 pt-4 border-t border-gray-800 text-center space-y-2">
                        <div className="flex items-center justify-center gap-1.5 text-[11px] text-gray-500">
                            <Server className="w-3.5 h-3.5 text-emerald-400" />
                            <span>StarTech SSL Protected &bull; Audit Logging Active</span>
                        </div>
                        <p className="text-[10px] text-gray-600">
                            Need customer access instead?{' '}
                            <Link href={route('login')} className="text-orange-400 hover:underline">
                                Customer Sign In
                            </Link>
                        </p>
                    </div>
                </div>
            </main>

            {/* Bottom Footer */}
            <footer className="relative z-10 border-t border-gray-800/80 py-3 text-center text-[11px] text-gray-500 bg-[#08121E]/60">
                &copy; {new Date().getFullYear()} Star Tech & Engineering Ltd &bull; Internal Systems Division
            </footer>
        </div>
    );
}
