import React, { useState, useEffect } from 'react';
import { Link } from '@inertiajs/react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function HeroSlider({ banners = [] }) {
    const [current, setCurrent] = useState(0);

    useEffect(() => {
        if (!banners.length) return;
        const interval = setInterval(() => {
            setCurrent((prev) => (prev + 1) % banners.length);
        }, 5000);
        return () => clearInterval(interval);
    }, [banners.length]);

    if (!banners.length) return null;

    const nextSlide = () => setCurrent((prev) => (prev + 1) % banners.length);
    const prevSlide = () => setCurrent((prev) => (prev - 1 + banners.length) % banners.length);

    const banner = banners[current];

    return (
        <div className="relative rounded-2xl overflow-hidden bg-gray-900 shadow-md group h-[190px] xs:h-[240px] sm:h-[320px] md:h-[380px] lg:h-[400px]">
            {/* Banner Image */}
            <Link href={banner.link || '#'} className="block w-full h-full relative">
                <img
                    src={banner.image}
                    alt={banner.title || 'Star Tech Promo'}
                    className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent flex flex-col justify-end p-6 md:p-8">
                    {banner.title && (
                        <h2 className="text-xl md:text-3xl font-extrabold text-white tracking-tight drop-shadow-md">
                            {banner.title}
                        </h2>
                    )}
                    {banner.subtitle && (
                        <p className="text-sm md:text-base text-gray-200 mt-1 max-w-xl drop-shadow">
                            {banner.subtitle}
                        </p>
                    )}
                </div>
            </Link>

            {/* Prev / Next Controls */}
            {banners.length > 1 && (
                <>
                    <button
                        onClick={prevSlide}
                        className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/40 hover:bg-black/70 text-white flex items-center justify-center transition opacity-0 group-hover:opacity-100"
                        title="Previous"
                    >
                        <ChevronLeft className="w-5 h-5" />
                    </button>
                    <button
                        onClick={nextSlide}
                        className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/40 hover:bg-black/70 text-white flex items-center justify-center transition opacity-0 group-hover:opacity-100"
                        title="Next"
                    >
                        <ChevronRight className="w-5 h-5" />
                    </button>

                    {/* Dots indicator */}
                    <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-1.5 z-10">
                        {banners.map((_, idx) => (
                            <button
                                key={idx}
                                onClick={() => setCurrent(idx)}
                                className={`h-2 rounded-full transition-all duration-300 ${
                                    current === idx ? 'w-6 bg-[#EF4A23]' : 'w-2 bg-white/60 hover:bg-white'
                                }`}
                            />
                        ))}
                    </div>
                </>
            )}
        </div>
    );
}
