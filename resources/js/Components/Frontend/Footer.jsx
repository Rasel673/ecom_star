import React from 'react';
import { Link, usePage } from '@inertiajs/react';
import { PhoneCall, MapPin, Mail, Clock, ShieldCheck, RefreshCw, Truck } from 'lucide-react';

export default function Footer() {
    const { settings } = usePage().props;

    return (
        <footer className="w-full bg-[#081621] text-gray-400 text-xs border-t border-gray-800 pt-12 pb-8 mt-16">
            {/* Value Props Bar */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-10 border-b border-gray-800">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-gray-300">
                    <div className="flex items-center gap-4 p-4 rounded-xl bg-[#0f2131] border border-gray-800">
                        <div className="w-12 h-12 rounded-full bg-[#EF4A23]/10 flex items-center justify-center text-[#EF4A23]">
                            <Truck className="w-6 h-6" />
                        </div>
                        <div>
                            <h4 className="text-sm font-bold text-white">Fast Home Delivery</h4>
                            <p className="text-xs text-gray-400">Within 24 Hours in Dhaka & Express Nationwide</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-4 p-4 rounded-xl bg-[#0f2131] border border-gray-800">
                        <div className="w-12 h-12 rounded-full bg-[#EF4A23]/10 flex items-center justify-center text-[#EF4A23]">
                            <ShieldCheck className="w-6 h-6" />
                        </div>
                        <div>
                            <h4 className="text-sm font-bold text-white">100% Genuine Products</h4>
                            <p className="text-xs text-gray-400">Official Brand Warranty & Verified Authentic</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-4 p-4 rounded-xl bg-[#0f2131] border border-gray-800">
                        <div className="w-12 h-12 rounded-full bg-[#EF4A23]/10 flex items-center justify-center text-[#EF4A23]">
                            <RefreshCw className="w-6 h-6" />
                        </div>
                        <div>
                            <h4 className="text-sm font-bold text-white">Easy Return & Warranty</h4>
                            <p className="text-xs text-gray-400">Hassle-free replacement policy & repair support</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Footer Links */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                {/* Support Column */}
                <div>
                    <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-4 border-l-2 border-[#EF4A23] pl-2">
                        Support & Helpline
                    </h3>
                    <div className="space-y-3">
                        <div className="p-3 bg-[#0e1d2c] rounded-lg border border-gray-800">
                            <span className="text-[11px] text-gray-400 block">10:00 AM - 7:00 PM</span>
                            <div className="flex items-center gap-2 mt-1">
                                <PhoneCall className="w-5 h-5 text-[#EF4A23]" />
                                <span className="text-xl font-black text-white">{settings?.hotline || '16793'}</span>
                            </div>
                        </div>
                        <div className="p-3 bg-[#0e1d2c] rounded-lg border border-gray-800">
                            <span className="text-[11px] text-gray-400 block">Store Support</span>
                            <span className="text-sm font-bold text-white">{settings?.phone || '09678002003'}</span>
                        </div>
                        <p className="text-xs text-gray-400 flex items-start gap-2 pt-2">
                            <MapPin className="w-4 h-4 text-[#EF4A23] shrink-0 mt-0.5" />
                            <span>{settings?.address || '28 Kazi Nazrul Islam Avenue, Banglamotor, Dhaka 1000'}</span>
                        </p>
                    </div>
                </div>

                {/* About Column */}
                <div>
                    <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-4 border-l-2 border-[#EF4A23] pl-2">
                        About Star Tech
                    </h3>
                    <ul className="space-y-2">
                        <li><Link href="/" className="hover:text-white transition">About Us</Link></li>
                        <li><Link href="/" className="hover:text-white transition">Branches & Outlets</Link></li>
                        <li><Link href="/" className="hover:text-white transition">Career Opportunities</Link></li>
                        <li><Link href="/" className="hover:text-white transition">Terms and Conditions</Link></li>
                        <li><Link href="/" className="hover:text-white transition">Privacy Policy</Link></li>
                        <li><Link href="/" className="hover:text-white transition">Star Point Policy</Link></li>
                    </ul>
                </div>

                {/* Help & Support */}
                <div>
                    <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-4 border-l-2 border-[#EF4A23] pl-2">
                        Customer Help
                    </h3>
                    <ul className="space-y-2">
                        <li><Link href="/pc-builder" className="hover:text-white transition">PC Builder Guide</Link></li>
                        <li><Link href="/cart" className="hover:text-white transition">Shopping Cart</Link></li>
                        <li><Link href="/" className="hover:text-white transition">Order Tracking</Link></li>
                        <li><Link href="/" className="hover:text-white transition">EMI Calculation</Link></li>
                        <li><Link href="/" className="hover:text-white transition">Online Service & Complain</Link></li>
                        <li><Link href="/" className="hover:text-white transition">Contact Us</Link></li>
                    </ul>
                </div>

                {/* Stay Connected */}
                <div>
                    <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-4 border-l-2 border-[#EF4A23] pl-2">
                        Stay Connected
                    </h3>
                    <p className="text-xs text-gray-400 mb-4">
                        Star Tech & Engineering Ltd is the largest Computer, Laptop & Gaming accessory retailer in Bangladesh.
                    </p>
                    <div className="flex items-center gap-3">
                        <a href="https://facebook.com" target="_blank" rel="noreferrer" className="w-8 h-8 rounded-full bg-blue-600/20 text-blue-400 flex items-center justify-center hover:bg-blue-600 hover:text-white transition">
                            f
                        </a>
                        <a href="https://youtube.com" target="_blank" rel="noreferrer" className="w-8 h-8 rounded-full bg-red-600/20 text-red-400 flex items-center justify-center hover:bg-red-600 hover:text-white transition">
                            ▶
                        </a>
                        <a href="https://instagram.com" target="_blank" rel="noreferrer" className="w-8 h-8 rounded-full bg-pink-600/20 text-pink-400 flex items-center justify-center hover:bg-pink-600 hover:text-white transition">
                            📷
                        </a>
                    </div>

                    <div className="mt-6 pt-4 border-t border-gray-800">
                        <span className="text-[11px] text-gray-500 block mb-2">Accepted Payment Methods</span>
                        <div className="flex flex-wrap gap-2 text-[10px] font-bold text-gray-300">
                            <span className="px-2 py-1 bg-pink-900/40 text-pink-300 rounded border border-pink-700/50">bKash</span>
                            <span className="px-2 py-1 bg-orange-900/40 text-orange-300 rounded border border-orange-700/50">Nagad</span>
                            <span className="px-2 py-1 bg-purple-900/40 text-purple-300 rounded border border-purple-700/50">Rocket</span>
                            <span className="px-2 py-1 bg-blue-900/40 text-blue-300 rounded border border-blue-700/50">VISA</span>
                            <span className="px-2 py-1 bg-red-900/40 text-red-300 rounded border border-red-700/50">Mastercard</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Bottom Bar */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 border-t border-gray-800 flex flex-col md:flex-row items-center justify-between text-gray-500 text-[11px] gap-4">
                <p>© {new Date().getFullYear()} Star Tech & Engineering Ltd | All Rights Reserved</p>
                <p>Powered by Laravel 12 + React + MySQL</p>
            </div>
        </footer>
    );
}
