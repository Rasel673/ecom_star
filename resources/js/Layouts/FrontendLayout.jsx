import React, { useState, useEffect } from 'react';
import { Head, usePage } from '@inertiajs/react';
import Header from '@/Components/Frontend/Header';
import Navbar from '@/Components/Frontend/Navbar';
import Footer from '@/Components/Frontend/Footer';
import { CheckCircle2, AlertCircle, X } from 'lucide-react';

export default function FrontendLayout({
    children,
    title,
    description,
    image,
    keywords,
    type = 'website',
    canonical,
    schema = null,
}) {
    const { flash, settings, ziggy } = usePage().props;
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

    const siteTitle = settings?.site_name || 'Tech Shoppers';
    const siteTagline = settings?.site_tagline || 'Leading Computer & Laptop Shop in Bangladesh';
    const metaDesc = description || settings?.seo_meta_description || siteTagline;
    const metaKeywords = keywords || settings?.seo_meta_keywords || '';
    const shareImage = image || settings?.seo_og_image || settings?.site_logo || '';
    const currentUrl = canonical || (typeof window !== 'undefined' ? window.location.href : (ziggy?.location || ''));

    // Compute page title cleanly without duplicate suffix
    let fullTitle = `${siteTitle} | ${siteTagline}`;
    if (title) {
        if (title.toLowerCase().includes(siteTitle.toLowerCase())) {
            fullTitle = title;
        } else {
            fullTitle = `${title} | ${siteTitle}`;
        }
    } else if (settings?.seo_meta_title) {
        fullTitle = settings.seo_meta_title;
    }

    const robotsValue = `${settings?.seo_robots_index || 'index'}, ${settings?.seo_robots_follow || 'follow'}${
        settings?.seo_robots_advanced ? ', ' + settings.seo_robots_advanced : ''
    }`;

    // Schema: Organization
    const sameAsProfiles = [
        settings?.facebook_url,
        settings?.youtube_url,
        settings?.instagram_url,
        settings?.twitter_url,
        settings?.linkedin_url,
    ].filter(Boolean);

    const organizationSchema = settings?.seo_schema_org_enabled !== '0' ? {
        "@context": "https://schema.org",
        "@type": "Organization",
        "name": settings?.seo_schema_org_name || siteTitle,
        "url": settings?.seo_canonical_base || (typeof window !== 'undefined' ? window.location.origin : ''),
        "logo": settings?.seo_schema_org_logo || settings?.site_logo || shareImage || undefined,
        "contactPoint": settings?.hotline || settings?.phone ? {
            "@type": "ContactPoint",
            "telephone": settings?.hotline || settings?.phone,
            "contactType": "customer service",
            "areaServed": "BD"
        } : undefined,
        "address": settings?.address ? {
            "@type": "PostalAddress",
            "streetAddress": settings?.address,
            "addressCountry": "BD"
        } : undefined,
        "sameAs": sameAsProfiles.length > 0 ? sameAsProfiles : undefined
    } : null;

    // Schema: Sitelinks SearchBox
    const searchSchema = settings?.seo_schema_search_enabled !== '0' ? {
        "@context": "https://schema.org",
        "@type": "WebSite",
        "name": siteTitle,
        "url": settings?.seo_canonical_base || (typeof window !== 'undefined' ? window.location.origin : ''),
        "potentialAction": {
            "@type": "SearchAction",
            "target": `${(settings?.seo_canonical_base || (typeof window !== 'undefined' ? window.location.origin : ''))}/search?q={search_term_string}`,
            "query-input": "required name=search_term_string"
        }
    } : null;

    return (
        <div className="min-h-screen flex flex-col bg-[#F2F4F8] text-[#111827] antialiased selection:bg-[#EF4A23] selection:text-white">
            <Head>
                <title>{fullTitle}</title>
                <meta name="description" content={metaDesc} />
                {metaKeywords && <meta name="keywords" content={metaKeywords} />}
                {settings?.seo_author && <meta name="author" content={settings.seo_author} />}
                <meta name="robots" content={robotsValue} />
                {currentUrl && <link rel="canonical" href={currentUrl} />}
                {settings?.site_favicon && <link rel="icon" href={settings.site_favicon} />}

                {/* OpenGraph / Facebook */}
                <meta property="og:title" content={title || settings?.seo_og_title || fullTitle} />
                <meta property="og:description" content={metaDesc} />
                {shareImage && <meta property="og:image" content={shareImage} />}
                {currentUrl && <meta property="og:url" content={currentUrl} />}
                <meta property="og:site_name" content={siteTitle} />
                <meta property="og:type" content={type || settings?.seo_og_type || 'website'} />

                {/* Twitter Cards */}
                <meta name="twitter:card" content={settings?.seo_twitter_card || 'summary_large_image'} />
                {settings?.seo_twitter_site && <meta name="twitter:site" content={settings.seo_twitter_site} />}
                {settings?.seo_twitter_creator && <meta name="twitter:creator" content={settings.seo_twitter_creator} />}
                <meta name="twitter:title" content={title || fullTitle} />
                <meta name="twitter:description" content={metaDesc} />
                {shareImage && <meta name="twitter:image" content={shareImage} />}
                {settings?.seo_fb_app_id && <meta property="fb:app_id" content={settings.seo_fb_app_id} />}

                {/* Structured Data (JSON-LD) */}
                {organizationSchema && (
                    <script type="application/ld+json">
                        {JSON.stringify(organizationSchema)}
                    </script>
                )}
                {searchSchema && (
                    <script type="application/ld+json">
                        {JSON.stringify(searchSchema)}
                    </script>
                )}
                {schema && (
                    <script type="application/ld+json">
                        {JSON.stringify(schema)}
                    </script>
                )}
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

            <div className="print:hidden sticky top-0 z-50 shadow-md">
                <Header />
                <Navbar />
            </div>

            <main className="flex-1 w-full max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-6 pb-20 lg:pb-8 print:p-0 print:m-0 print:max-w-none print:w-full">
                {children}
            </main>

            <div className="print:hidden">
                <Footer />
            </div>

            {/* Floating WhatsApp Live Chat Widget */}
            {settings?.whatsapp && (
                <aside aria-label="WhatsApp Live Chat" className="fixed bottom-16 lg:bottom-6 right-5 z-40 print:hidden">
                    <a
                        href={`https://wa.me/${settings.whatsapp.replace(/[^0-9]/g, '')}?text=Hello%20${encodeURIComponent(siteTitle)}%2C%20I%20have%20an%20inquiry.`}
                        target="_blank"
                        rel="noreferrer"
                        className="group flex items-center gap-2 bg-[#25D366] hover:bg-[#20ba5a] text-white p-3 lg:px-4 lg:py-3 rounded-full shadow-2xl hover:scale-105 active:scale-95 transition-all duration-200"
                        title="Chat with us on WhatsApp"
                    >
                        <svg className="w-6 h-6 shrink-0" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
                        </svg>
                        <span className="hidden lg:inline text-xs font-bold whitespace-nowrap">
                            Chat on WhatsApp
                        </span>
                    </a>
                </aside>
            )}
        </div>
    );
}
