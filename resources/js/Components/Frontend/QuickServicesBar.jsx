import React, { useState } from 'react';
import { Link } from '@inertiajs/react';
import { 
    Laptop, 
    MessageSquareWarning, 
    Home, 
    Settings, 
    X, 
    Calculator, 
    Sparkles, 
    ChevronRight, 
    CheckCircle2, 
    Search,
    ThermometerSnowflake,
    Zap,
    Users,
    SunMedium,
    Building
} from 'lucide-react';

export default function QuickServicesBar({ settings = {} }) {
    const [showAcModal, setShowAcModal] = useState(false);
    const [showLaptopFinderModal, setShowLaptopFinderModal] = useState(false);

    // AC Calculator State
    const [roomLength, setRoomLength] = useState(12);
    const [roomWidth, setRoomWidth] = useState(12);
    const [isTopFloor, setIsTopFloor] = useState(false);
    const [sunlight, setSunlight] = useState('moderate'); // 'low', 'moderate', 'high'
    const [occupants, setOccupants] = useState('1-2'); // '1-2', '3-4', '5+'

    const roomSqFt = roomLength * roomWidth;
    
    // AC Tonnage Calculation
    let calculatedTon = 1.0;
    if (roomSqFt <= 120) calculatedTon = 1.0;
    else if (roomSqFt <= 180) calculatedTon = 1.5;
    else if (roomSqFt <= 250) calculatedTon = 2.0;
    else if (roomSqFt <= 320) calculatedTon = 2.5;
    else calculatedTon = 3.0;

    if (isTopFloor && calculatedTon < 3.0) calculatedTon += 0.5;
    if (sunlight === 'high' && calculatedTon < 3.0) calculatedTon += 0.5;
    if (occupants === '5+' && calculatedTon < 3.0) calculatedTon += 0.5;

    const btuRating = Math.round(calculatedTon * 12000);

    // Laptop Finder State
    const [laptopBudget, setLaptopBudget] = useState('all');
    const [laptopPurpose, setLaptopPurpose] = useState('all');

    // Today's formatted date string (e.g. "Monday, 12 October")
    const todayDate = new Date().toLocaleDateString('en-GB', { 
        weekday: 'long', 
        day: 'numeric', 
        month: 'long' 
    });

    const marqueeNotice = settings?.announcement || `${todayDate}, All our branch showrooms and outlets are open today. Customer Care & Hotline ${settings?.hotline || '16793'} is active from 10:00 AM to 8:00 PM across Bangladesh.`;

    return (
        <section className="mb-10">
            {/* 1. Daily Notice / Announcement Bar */}
            <div className="bg-white rounded-full py-2.5 px-4 sm:px-6 border border-gray-200/80 shadow-xs mb-5 flex items-center justify-between text-xs overflow-hidden gap-3">
                <div className="flex items-center gap-2 shrink-0">
                    <span className="w-2 h-2 rounded-full bg-[#EF4A23] animate-ping"></span>
                    <span className="text-[10px] sm:text-xs font-bold text-[#EF4A23] uppercase tracking-wider bg-orange-50 border border-orange-200/60 px-2 py-0.5 rounded-full">
                        Notice
                    </span>
                </div>
                <div className="overflow-hidden whitespace-nowrap flex-1 text-right sm:text-left">
                    <span className="text-gray-600 font-medium text-[11px] sm:text-xs inline-block">
                        {marqueeNotice}
                    </span>
                </div>
            </div>

            {/* 2. Four Quick Service Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                {/* Card 1: Laptop Finder */}
                <button
                    type="button"
                    onClick={() => setShowLaptopFinderModal(true)}
                    className="bg-white hover:bg-orange-50/20 border border-gray-200/80 hover:border-orange-300 rounded-2xl p-4 sm:p-5 flex items-center gap-3.5 sm:gap-4 shadow-xs hover:shadow-md transition group text-left w-full"
                >
                    <div className="w-12 h-12 rounded-full bg-[#EF4A23] text-white flex items-center justify-center shrink-0 shadow-sm group-hover:scale-105 transition-transform">
                        <Laptop className="w-6 h-6 text-white" />
                    </div>
                    <div>
                        <h3 className="text-sm sm:text-base font-black text-gray-900 group-hover:text-[#EF4A23] transition-colors leading-tight">
                            Laptop Finder
                        </h3>
                        <p className="text-[11px] sm:text-xs text-gray-500 mt-0.5">
                            Find Your Laptop Easily
                        </p>
                    </div>
                </button>

                {/* Card 2: Raise a Complain */}
                <Link
                    href="/page/service-complain"
                    className="bg-white hover:bg-orange-50/20 border border-gray-200/80 hover:border-orange-300 rounded-2xl p-4 sm:p-5 flex items-center gap-3.5 sm:gap-4 shadow-xs hover:shadow-md transition group text-left"
                >
                    <div className="w-12 h-12 rounded-full bg-[#EF4A23] text-white flex items-center justify-center shrink-0 shadow-sm group-hover:scale-105 transition-transform">
                        <MessageSquareWarning className="w-6 h-6 text-white" />
                    </div>
                    <div>
                        <h3 className="text-sm sm:text-base font-black text-gray-900 group-hover:text-[#EF4A23] transition-colors leading-tight">
                            Raise a Complain
                        </h3>
                        <p className="text-[11px] sm:text-xs text-gray-500 mt-0.5">
                            Share your experience
                        </p>
                    </div>
                </Link>

                {/* Card 3: AC Ton Calculator */}
                <button
                    type="button"
                    onClick={() => setShowAcModal(true)}
                    className="bg-white hover:bg-orange-50/20 border border-gray-200/80 hover:border-orange-300 rounded-2xl p-4 sm:p-5 flex items-center gap-3.5 sm:gap-4 shadow-xs hover:shadow-md transition group text-left w-full"
                >
                    <div className="w-12 h-12 rounded-full bg-[#EF4A23] text-white flex items-center justify-center shrink-0 shadow-sm group-hover:scale-105 transition-transform">
                        <Home className="w-6 h-6 text-white" />
                    </div>
                    <div>
                        <h3 className="text-sm sm:text-base font-black text-gray-900 group-hover:text-[#EF4A23] transition-colors leading-tight">
                            AC Ton Calculator
                        </h3>
                        <p className="text-[11px] sm:text-xs text-gray-500 mt-0.5">
                            Find Perfect AC.
                        </p>
                    </div>
                </button>

                {/* Card 4: Servicing Center */}
                <Link
                    href="/page/service-complain"
                    className="bg-white hover:bg-orange-50/20 border border-gray-200/80 hover:border-orange-300 rounded-2xl p-4 sm:p-5 flex items-center gap-3.5 sm:gap-4 shadow-xs hover:shadow-md transition group text-left"
                >
                    <div className="w-12 h-12 rounded-full bg-[#EF4A23] text-white flex items-center justify-center shrink-0 shadow-sm group-hover:scale-105 transition-transform">
                        <Settings className="w-6 h-6 text-white" />
                    </div>
                    <div>
                        <h3 className="text-sm sm:text-base font-black text-gray-900 group-hover:text-[#EF4A23] transition-colors leading-tight">
                            Servicing Center
                        </h3>
                        <p className="text-[11px] sm:text-xs text-gray-500 mt-0.5">
                            Repair Your Device
                        </p>
                    </div>
                </Link>
            </div>

            {/* ========================================================= */}
            {/* Modal: AC Ton Calculator                                  */}
            {/* ========================================================= */}
            {showAcModal && (
                <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
                    <div 
                        className="relative bg-white rounded-3xl shadow-2xl max-w-xl w-full border border-gray-100 overflow-hidden animate-scale-up"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Header */}
                        <div className="px-5 py-4 bg-gradient-to-r from-gray-900 via-[#112538] to-gray-900 text-white flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-orange-500/20 text-[#EF4A23] flex items-center justify-center shrink-0">
                                    <ThermometerSnowflake className="w-5 h-5 text-orange-400" />
                                </div>
                                <div>
                                    <h3 className="text-base font-black text-white">Air Conditioner (AC) Ton Calculator</h3>
                                    <p className="text-[11px] text-gray-300">Calculate exact cooling capacity for your room</p>
                                </div>
                            </div>
                            <button
                                type="button"
                                onClick={() => setShowAcModal(false)}
                                className="text-gray-400 hover:text-white p-1 rounded-lg hover:bg-white/10 transition"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Body */}
                        <div className="p-5 sm:p-6 space-y-5">
                            {/* Room Dimensions */}
                            <div>
                                <label className="text-xs font-bold text-gray-700 block mb-2">Room Dimensions (Feet)</label>
                                <div className="grid grid-cols-2 gap-3">
                                    <div>
                                        <span className="text-[11px] text-gray-500 block mb-1">Length: {roomLength} ft</span>
                                        <input
                                            type="range"
                                            min="8"
                                            max="30"
                                            value={roomLength}
                                            onChange={(e) => setRoomLength(Number(e.target.value))}
                                            className="w-full accent-[#EF4A23]"
                                        />
                                    </div>
                                    <div>
                                        <span className="text-[11px] text-gray-500 block mb-1">Width: {roomWidth} ft</span>
                                        <input
                                            type="range"
                                            min="8"
                                            max="30"
                                            value={roomWidth}
                                            onChange={(e) => setRoomWidth(Number(e.target.value))}
                                            className="w-full accent-[#EF4A23]"
                                        />
                                    </div>
                                </div>
                                <div className="mt-2 text-right">
                                    <span className="text-xs font-semibold text-gray-600 bg-gray-100 px-2.5 py-1 rounded-lg">
                                        Total Floor Area: <strong className="text-gray-900">{roomSqFt} sq ft</strong>
                                    </span>
                                </div>
                            </div>

                            {/* Conditions */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-3 border-t border-gray-100">
                                <div>
                                    <label className="text-xs font-bold text-gray-700 block mb-1.5">Sunlight Exposure</label>
                                    <select
                                        value={sunlight}
                                        onChange={(e) => setSunlight(e.target.value)}
                                        className="w-full text-xs rounded-xl border-gray-300 focus:border-[#EF4A23] focus:ring-[#EF4A23] py-2 px-3"
                                    >
                                        <option value="low">Shaded / Low Sunlight</option>
                                        <option value="moderate">Moderate Direct Sun</option>
                                        <option value="high">Heavy Sun / West Facing</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="text-xs font-bold text-gray-700 block mb-1.5">Floor Level</label>
                                    <select
                                        value={isTopFloor ? 'top' : 'middle'}
                                        onChange={(e) => setIsTopFloor(e.target.value === 'top')}
                                        className="w-full text-xs rounded-xl border-gray-300 focus:border-[#EF4A23] focus:ring-[#EF4A23] py-2 px-3"
                                    >
                                        <option value="middle">Ground or Middle Floor</option>
                                        <option value="top">Top Floor / Roof Direct</option>
                                    </select>
                                </div>
                            </div>

                            {/* Result Box */}
                            <div className="bg-gradient-to-br from-[#081621] to-[#112538] text-white p-5 rounded-2xl border border-gray-800 flex items-center justify-between">
                                <div>
                                    <span className="text-[10px] text-gray-400 uppercase tracking-wider block">Recommended AC Capacity</span>
                                    <div className="flex items-baseline gap-2 mt-0.5">
                                        <span className="text-3xl font-black text-[#EF4A23]">{calculatedTon.toFixed(1)} Ton</span>
                                        <span className="text-xs text-gray-300">({btuRating.toLocaleString()} BTU/hr)</span>
                                    </div>
                                    <p className="text-[11px] text-gray-400 mt-1">
                                        Optimal cooling for ~{roomSqFt} sq. ft room dimensions
                                    </p>
                                </div>
                                <div className="w-12 h-12 rounded-xl bg-orange-500/15 border border-orange-500/30 text-orange-400 flex items-center justify-center shrink-0">
                                    <ThermometerSnowflake className="w-6 h-6" />
                                </div>
                            </div>
                        </div>

                        {/* Footer Actions */}
                        <div className="px-5 py-4 bg-gray-50 border-t border-gray-100 flex items-center justify-between">
                            <Link
                                href="/search?q=air+conditioner"
                                onClick={() => setShowAcModal(false)}
                                className="text-xs font-bold text-[#EF4A23] hover:underline flex items-center gap-1"
                            >
                                <span>Browse Air Conditioners</span>
                                <ChevronRight className="w-3.5 h-3.5" />
                            </Link>

                            <button
                                type="button"
                                onClick={() => setShowAcModal(false)}
                                className="px-5 py-2 bg-[#081621] hover:bg-[#112538] text-white text-xs font-bold rounded-xl transition"
                            >
                                Done
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* ========================================================= */}
            {/* Modal: Laptop Finder Wizard                               */}
            {/* ========================================================= */}
            {showLaptopFinderModal && (
                <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
                    <div 
                        className="relative bg-white rounded-3xl shadow-2xl max-w-xl w-full border border-gray-100 overflow-hidden animate-scale-up"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Header */}
                        <div className="px-5 py-4 bg-gradient-to-r from-gray-900 via-[#112538] to-gray-900 text-white flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-orange-500/20 text-[#EF4A23] flex items-center justify-center shrink-0">
                                    <Laptop className="w-5 h-5 text-orange-400" />
                                </div>
                                <div>
                                    <h3 className="text-base font-black text-white">Laptop Finder Assistant</h3>
                                    <p className="text-[11px] text-gray-300">Find the ideal laptop matching your exact budget & needs</p>
                                </div>
                            </div>
                            <button
                                type="button"
                                onClick={() => setShowLaptopFinderModal(false)}
                                className="text-gray-400 hover:text-white p-1 rounded-lg hover:bg-white/10 transition"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Body */}
                        <div className="p-5 sm:p-6 space-y-5">
                            {/* Budget range */}
                            <div>
                                <label className="text-xs font-bold text-gray-800 block mb-2">1. Select Your Budget Range</label>
                                <div className="grid grid-cols-2 gap-2 text-xs">
                                    {[
                                        { id: 'all', label: 'Any Budget' },
                                        { id: '45000', label: 'Under ৳45,000' },
                                        { id: '75000', label: '৳45,000 - ৳75,000' },
                                        { id: '120000', label: '৳75,000 - ৳120,000' },
                                        { id: 'premium', label: '৳120,000+' }
                                    ].map((b) => (
                                        <button
                                            key={b.id}
                                            type="button"
                                            onClick={() => setLaptopBudget(b.id)}
                                            className={`p-2.5 rounded-xl border text-center font-bold transition ${
                                                laptopBudget === b.id 
                                                    ? 'bg-[#081621] text-white border-[#081621]' 
                                                    : 'bg-white hover:bg-gray-50 border-gray-200 text-gray-700'
                                            }`}
                                        >
                                            {b.label}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Purpose */}
                            <div>
                                <label className="text-xs font-bold text-gray-800 block mb-2">2. Primary Usage / Purpose</label>
                                <div className="grid grid-cols-2 gap-2 text-xs">
                                    {[
                                        { id: 'all', label: 'All Laptops' },
                                        { id: 'gaming', label: 'Gaming & High Performance' },
                                        { id: 'student', label: 'Student / Everyday Office' },
                                        { id: 'ultrabook', label: 'Slim Ultrabook & Battery Life' },
                                    ].map((p) => (
                                        <button
                                            key={p.id}
                                            type="button"
                                            onClick={() => setLaptopPurpose(p.id)}
                                            className={`p-2.5 rounded-xl border text-center font-bold transition ${
                                                laptopPurpose === p.id 
                                                    ? 'bg-[#EF4A23] text-white border-[#EF4A23]' 
                                                    : 'bg-white hover:bg-gray-50 border-gray-200 text-gray-700'
                                            }`}
                                        >
                                            {p.label}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Footer */}
                        <div className="px-5 py-4 bg-gray-50 border-t border-gray-100 flex items-center justify-between">
                            <Link
                                href={laptopPurpose === 'gaming' ? '/category/gaming-laptop' : '/category/laptop'}
                                onClick={() => setShowLaptopFinderModal(false)}
                                className="w-full py-2.5 px-4 bg-[#EF4A23] hover:bg-[#d63c17] text-white text-xs font-bold rounded-xl transition flex items-center justify-center gap-1.5 shadow-md"
                            >
                                <Search className="w-4 h-4" />
                                <span>View Matching Laptops</span>
                            </Link>
                        </div>
                    </div>
                </div>
            )}
        </section>
    );
}
