import React, { useState, useEffect } from 'react';
import { Head, usePage } from '@inertiajs/react';
import Header from '@/Components/Frontend/Header';
import Navbar from '@/Components/Frontend/Navbar';
import Footer from '@/Components/Frontend/Footer';
import { CheckCircle2, AlertCircle, X } from 'lucide-react';

export default function FrontendLayout({ children, title, description, image }) {
    const { flash } = usePage().props;
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

    return (
        <div className="min-h-screen flex flex-col bg-[#F2F4F8] text-[#111827] antialiased selection:bg-[#EF4A23] selection:text-white">
            <Head>
                <title>{title ? `${title} | Star Tech` : 'Star Tech & Engineering Ltd | Leading Computer & Laptop Shop in Bangladesh'}</title>
                <meta name="description" content={description || 'Leading Computer, Laptop & Component Shop in Bangladesh. Buy Desktop PC, Laptop, Gaming Component at best price in BD.'} />
                {image && <meta property="og:image" content={image} />}
                <meta property="og:site_name" content="Star Tech" />
                <meta property="og:type" content="website" />
            </Head>

            {/* Notification Toast */}
            {alertMessage && (
                <div className="fixed bottom-6 right-6 z-50 animate-in slide-in-from-bottom-5 duration-200">
                    <div className={`flex items-center gap-3 px-4 py-3 rounded-xl shadow-2xl text-sm font-medium border text-white ${
                        alertType === 'success' ? 'bg-emerald-600 border-emerald-500' : 'bg-rose-600 border-rose-500'
                    }`}>
                        {alertType === 'success' ? (
                            <CheckCircle2 className="w-5 h-5 shrink-0" />
                        ) : (
                            <AlertCircle className="w-5 h-5 shrink-0" />
                        )}
                        <span>{alertMessage}</span>
                        <button 
                            onClick={() => setAlertMessage(null)}
                            className="ml-2 hover:opacity-75"
                        >
                            <X className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            )}

            <div className="print:hidden">
                <Header />
                <Navbar />
            </div>

            <main className="flex-1 w-full max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-6 pb-20 lg:pb-8 print:p-0 print:m-0 print:max-w-none print:w-full">
                {children}
            </main>

            <div className="print:hidden">
                <Footer />
            </div>
        </div>
    );
}
