import React from 'react';
import { Link, usePage } from '@inertiajs/react';
import { 
    PhoneCall, 
    MapPin, 
    Mail, 
    Clock, 
    ShieldCheck, 
    RefreshCw, 
    Truck 
} from 'lucide-react';

const FacebookIcon = ({ className = "w-4 h-4" }) => (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24">
        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
    </svg>
);

const YoutubeIcon = ({ className = "w-4 h-4" }) => (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24">
        <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
    </svg>
);

const InstagramIcon = ({ className = "w-4 h-4" }) => (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
    </svg>
);

const TwitterIcon = ({ className = "w-4 h-4" }) => (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
);

const WhatsAppIcon = ({ className = "w-4 h-4" }) => (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24">
        <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.711 2.598 2.669-.699c.974.557 1.956.884 3.01.884l.003-.001c3.181 0 5.767-2.586 5.768-5.766 0-1.54-.599-2.989-1.688-4.079-1.09-1.09-2.538-1.69-4.29-1.69zm7.042 12.809c-1.89 1.889-4.398 2.93-7.07 2.93-.007 0-.014 0-.02 0-2.433 0-4.814-.654-6.885-1.891l-4.798 1.258 1.28-4.673c-1.357-2.148-2.073-4.636-2.072-7.189.003-7.513 6.118-13.626 13.633-13.626 3.638 0 7.059 1.417 9.632 3.99 2.573 2.573 3.99 5.993 3.99 9.632 0 3.638-1.417 7.058-3.69 9.569z" />
    </svg>
);

const LinkedinIcon = ({ className = "w-4 h-4" }) => (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24">
        <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
    </svg>
);

export default function Footer() {
    const { settings } = usePage().props;

    const primaryColor = settings?.primary_color || '#EF4A23';
    const footerBgColor = settings?.footer_bg_color || '#081621';

    return (
        <footer 
            className="w-full text-gray-400 text-xs border-t border-gray-800 pt-12 pb-8 mt-16 print:hidden"
            style={{ backgroundColor: footerBgColor }}
        >
            {/* Value Props Bar */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-10 border-b border-gray-800">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-gray-300">
                    <div className="flex items-center gap-4 p-4 rounded-xl bg-[#0f2131]/70 border border-gray-800">
                        <div 
                            className="w-12 h-12 rounded-full flex items-center justify-center"
                            style={{ backgroundColor: `${primaryColor}1A`, color: primaryColor }}
                        >
                            <Truck className="w-6 h-6" />
                        </div>
                        <div>
                            <h4 className="text-sm font-bold text-white">Fast Home Delivery</h4>
                            <p className="text-xs text-gray-400">Within 24 Hours in Dhaka & Express Nationwide</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-4 p-4 rounded-xl bg-[#0f2131]/70 border border-gray-800">
                        <div 
                            className="w-12 h-12 rounded-full flex items-center justify-center"
                            style={{ backgroundColor: `${primaryColor}1A`, color: primaryColor }}
                        >
                            <ShieldCheck className="w-6 h-6" />
                        </div>
                        <div>
                            <h4 className="text-sm font-bold text-white">100% Genuine Products</h4>
                            <p className="text-xs text-gray-400">Official Brand Warranty & Verified Authentic</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-4 p-4 rounded-xl bg-[#0f2131]/70 border border-gray-800">
                        <div 
                            className="w-12 h-12 rounded-full flex items-center justify-center"
                            style={{ backgroundColor: `${primaryColor}1A`, color: primaryColor }}
                        >
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
                    <h3 
                        className="text-sm font-bold text-white uppercase tracking-wider mb-4 border-l-2 pl-2"
                        style={{ borderColor: primaryColor }}
                    >
                        Support & Helpline
                    </h3>
                    <div className="space-y-3">
                        <div className="p-3 bg-[#0e1d2c]/80 rounded-lg border border-gray-800">
                            <span className="text-[11px] text-gray-400 block">{settings?.working_hours || '10:00 AM - 7:00 PM'}</span>
                            <div className="flex items-center gap-2 mt-1">
                                <PhoneCall className="w-5 h-5" style={{ color: primaryColor }} />
                                <span className="text-xl font-black text-white">{settings?.hotline || '16793'}</span>
                            </div>
                        </div>
                        <div className="p-3 bg-[#0e1d2c]/80 rounded-lg border border-gray-800">
                            <span className="text-[11px] text-gray-400 block">Store Support</span>
                            <span className="text-sm font-bold text-white">{settings?.phone || '09678002003'}</span>
                        </div>
                        {settings?.whatsapp && (
                            <a 
                                href={`https://wa.me/${settings.whatsapp.replace(/[^0-9]/g, '')}?text=Hello%20${encodeURIComponent(settings?.site_name || 'Support')}%2C%20I%20have%20an%20inquiry.`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="p-3 bg-[#0e1d2c]/80 hover:bg-[#112437] rounded-lg border border-emerald-500/30 flex items-center justify-between transition group"
                            >
                                <div>
                                    <span className="text-[11px] text-emerald-400 block font-bold">WhatsApp Direct</span>
                                    <span className="text-sm font-bold text-white">{settings.whatsapp}</span>
                                </div>
                                <div className="w-8 h-8 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center group-hover:scale-110 transition">
                                    <WhatsAppIcon className="w-4 h-4" />
                                </div>
                            </a>
                        )}
                        {settings?.email && (
                            <p className="text-xs text-gray-400 flex items-center gap-2 pt-1">
                                <Mail className="w-4 h-4 shrink-0" style={{ color: primaryColor }} />
                                <a href={`mailto:${settings.email}`} className="hover:text-white transition">{settings.email}</a>
                            </p>
                        )}
                        <p className="text-xs text-gray-400 flex items-start gap-2 pt-1">
                            <MapPin className="w-4 h-4 shrink-0 mt-0.5" style={{ color: primaryColor }} />
                            <span>{settings?.address || '28 Kazi Nazrul Islam Avenue, Banglamotor, Dhaka 1000'}</span>
                        </p>
                    </div>
                </div>

                {/* About Column */}
                <div>
                    <h3 
                        className="text-sm font-bold text-white uppercase tracking-wider mb-4 border-l-2 pl-2"
                        style={{ borderColor: primaryColor }}
                    >
                        About {settings?.site_name?.split(' ')[0] || 'Tech Shoppers'}
                    </h3>
                    <ul className="space-y-2">
                        <li><Link href="/page/about-us" className="hover:text-white transition">About Us</Link></li>
                        <li><Link href="/page/branches-outlets" className="hover:text-white transition">Branches & Outlets</Link></li>
                        <li><Link href="/page/terms-conditions" className="hover:text-white transition">Terms and Conditions</Link></li>
                        <li><Link href="/page/privacy-policy" className="hover:text-white transition">Privacy Policy</Link></li>
                        <li><Link href="/page/emi-calculation" className="hover:text-white transition">Reward Points & EMI Policy</Link></li>
                    </ul>
                </div>

                {/* Help & Support */}
                <div>
                    <h3 
                        className="text-sm font-bold text-white uppercase tracking-wider mb-4 border-l-2 pl-2"
                        style={{ borderColor: primaryColor }}
                    >
                        Customer Help
                    </h3>
                    <ul className="space-y-2">
                        <li><Link href="/page/pc-builder-guide" className="hover:text-white transition">PC Builder Guide</Link></li>
                        <li><Link href="/cart" className="hover:text-white transition">Shopping Cart</Link></li>
                        <li><Link href="/page/order-tracking" className="hover:text-white transition">Order Tracking</Link></li>
                        <li><Link href="/page/emi-calculation" className="hover:text-white transition">EMI Calculation</Link></li>
                        <li><Link href="/page/service-complain" className="hover:text-white transition">Online Service & Complain</Link></li>
                        <li><Link href="/page/contact-us" className="hover:text-white transition">Contact Us</Link></li>
                    </ul>
                </div>

                {/* Stay Connected */}
                <div>
                    <h3 
                        className="text-sm font-bold text-white uppercase tracking-wider mb-4 border-l-2 pl-2"
                        style={{ borderColor: primaryColor }}
                    >
                        Stay Connected
                    </h3>
                    <p className="text-xs text-gray-400 mb-4 leading-relaxed">
                        {settings?.footer_about || 'Tech Shoppers is the leading Computer, Laptop & Gaming accessory retailer in Bangladesh.'}
                    </p>
                    <div className="flex items-center gap-2.5">
                        <a 
                            href={settings?.facebook_url || 'https://facebook.com'} 
                            target="_blank" 
                            rel="noreferrer" 
                            className="w-8 h-8 rounded-full bg-blue-600/20 text-blue-400 flex items-center justify-center hover:bg-blue-600 hover:text-white transition"
                            title="Facebook"
                        >
                            <FacebookIcon className="w-4 h-4" />
                        </a>
                        <a 
                            href={settings?.youtube_url || 'https://youtube.com'} 
                            target="_blank" 
                            rel="noreferrer" 
                            className="w-8 h-8 rounded-full bg-red-600/20 text-red-400 flex items-center justify-center hover:bg-red-600 hover:text-white transition"
                            title="YouTube"
                        >
                            <YoutubeIcon className="w-4 h-4" />
                        </a>
                        <a 
                            href={settings?.instagram_url || 'https://instagram.com'} 
                            target="_blank" 
                            rel="noreferrer" 
                            className="w-8 h-8 rounded-full bg-pink-600/20 text-pink-400 flex items-center justify-center hover:bg-pink-600 hover:text-white transition"
                            title="Instagram"
                        >
                            <InstagramIcon className="w-4 h-4" />
                        </a>
                        {settings?.twitter_url && (
                            <a 
                                href={settings.twitter_url} 
                                target="_blank" 
                                rel="noreferrer" 
                                className="w-8 h-8 rounded-full bg-sky-500/20 text-sky-400 flex items-center justify-center hover:bg-sky-500 hover:text-white transition"
                                title="Twitter / X"
                            >
                                <TwitterIcon className="w-4 h-4" />
                            </a>
                        )}
                        {settings?.linkedin_url && (
                            <a 
                                href={settings.linkedin_url} 
                                target="_blank" 
                                rel="noreferrer" 
                                className="w-8 h-8 rounded-full bg-blue-700/20 text-blue-300 flex items-center justify-center hover:bg-blue-700 hover:text-white transition"
                                title="LinkedIn"
                            >
                                <LinkedinIcon className="w-4 h-4" />
                            </a>
                        )}
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
                <p>{settings?.footer_copyright || `© ${new Date().getFullYear()} ${settings?.site_name || 'Tech Shoppers'} | All Rights Reserved`}</p>
                <p>Powered by Laravel + React + MySQL</p>
            </div>
        </footer>
    );
}
