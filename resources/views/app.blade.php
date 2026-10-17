<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">

        @php
            $siteName = \App\Models\Setting::get('site_name', config('app.name', 'Tech Shoppers'));
            $siteFavicon = \App\Models\Setting::get('site_favicon');
            $googleVerification = \App\Models\Setting::get('seo_google_verification');
            $bingVerification = \App\Models\Setting::get('seo_bing_verification');
            $pinterestVerification = \App\Models\Setting::get('seo_pinterest_verification');
            $yandexVerification = \App\Models\Setting::get('seo_yandex_verification');
            $ga4Id = \App\Models\Setting::get('seo_ga4_id');
            $gtmId = \App\Models\Setting::get('seo_gtm_id');
            $fbPixelId = \App\Models\Setting::get('seo_fb_pixel_id');
            $customHeadScripts = \App\Models\Setting::get('seo_custom_head_scripts');
            $customBodyScripts = \App\Models\Setting::get('seo_custom_body_scripts');
        @endphp

        <title inertia>{{ $siteName }}</title>

        @if($siteFavicon)
        <link rel="icon" href="{{ $siteFavicon }}">
        @endif

        {{-- Search Engine Webmaster Verification --}}
        @if($googleVerification)
        <meta name="google-site-verification" content="{{ $googleVerification }}">
        @endif
        @if($bingVerification)
        <meta name="msvalidate.01" content="{{ $bingVerification }}">
        @endif
        @if($pinterestVerification)
        <meta name="p:domain_verify" content="{{ $pinterestVerification }}">
        @endif
        @if($yandexVerification)
        <meta name="yandex-verification" content="{{ $yandexVerification }}">
        @endif

        {{-- Google Tag Manager (GTM) --}}
        @if($gtmId)
        <script>(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
        new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
        j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
        'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
        })(window,document,'script','dataLayer','{{ $gtmId }}');</script>
        @endif

        {{-- Google Analytics 4 (GA4) --}}
        @if($ga4Id)
        <script async src="https://www.googletagmanager.com/gtag/js?id={{ $ga4Id }}"></script>
        <script>
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '{{ $ga4Id }}');
        </script>
        @endif

        {{-- Facebook Pixel --}}
        @if($fbPixelId)
        <script>
            !function(f,b,e,v,n,t,s)
            {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
            n.callMethod.apply(n,arguments):n.queue.push(arguments)};
            if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
            n.queue=[];t=b.createElement(e);t.async=!0;
            t.src=v;s=b.getElementsByTagName(e)[0];
            s.parentNode.insertBefore(t,s)}(window, document,'script',
            'https://connect.facebook.net/en_US/fbevents.js');
            fbq('init', '{{ $fbPixelId }}');
            fbq('track', 'PageView');
        </script>
        <noscript><img height="1" width="1" style="display:none"
        src="https://www.facebook.com/tr?id={{ $fbPixelId }}&ev=PageView&noscript=1"
        /></noscript>
        @endif

        {{-- Custom Head Scripts from SEO Panel --}}
        @if($customHeadScripts)
        {!! $customHeadScripts !!}
        @endif

        <!-- Fonts -->
        <link rel="preconnect" href="https://fonts.bunny.net">
        <link href="https://fonts.bunny.net/css?family=figtree:400,500,600&display=swap" rel="stylesheet" />

        <!-- Scripts -->
        @routes
        @viteReactRefresh
        @vite(['resources/js/app.jsx', "resources/js/Pages/{$page['component']}.jsx"])
        @inertiaHead
    </head>
    <body class="font-sans antialiased">
        {{-- GTM Noscript Fallback --}}
        @if($gtmId)
        <noscript><iframe src="https://www.googletagmanager.com/ns.html?id={{ $gtmId }}"
        height="0" width="0" style="display:none;visibility:hidden"></iframe></noscript>
        @endif

        @inertia

        {{-- Custom Body Scripts from SEO Panel --}}
        @if($customBodyScripts)
        {!! $customBodyScripts !!}
        @endif
    </body>
</html>
