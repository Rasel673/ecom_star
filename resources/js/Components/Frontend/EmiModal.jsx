import React, { useState, useEffect } from 'react';
import { Link } from '@inertiajs/react';
import { 
    X, 
    Calculator, 
    CreditCard, 
    CheckCircle2, 
    AlertCircle, 
    ChevronRight, 
    Building2,
    ShieldCheck,
    HelpCircle,
    BadgePercent
} from 'lucide-react';

export const EMI_BANKS = [
    { name: 'City Bank AMEX', maxMonths: 36, cards: 'American Express, Visa, Mastercard', promo: '0% Interest' },
    { name: 'Eastern Bank (EBL)', maxMonths: 36, cards: 'Visa, Mastercard', promo: '0% Interest' },
    { name: 'BRAC Bank', maxMonths: 24, cards: 'Visa, Mastercard', promo: '0% Interest' },
    { name: 'Standard Chartered (SCB)', maxMonths: 24, cards: 'Visa, Mastercard', promo: '0% Interest' },
    { name: 'Mutual Trust Bank (MTB)', maxMonths: 24, cards: 'Visa, Mastercard', promo: '0% Interest' },
    { name: 'Prime Bank', maxMonths: 24, cards: 'Visa, Mastercard', promo: '0% Interest' },
    { name: 'Dhaka Bank', maxMonths: 24, cards: 'Visa, Mastercard', promo: '0% Interest' },
    { name: 'Southeast Bank', maxMonths: 24, cards: 'Visa, Mastercard', promo: '0% Interest' },
    { name: 'United Commercial Bank (UCB)', maxMonths: 18, cards: 'Visa, Mastercard', promo: '0% Interest' },
    { name: 'LankaBangla Finance', maxMonths: 24, cards: 'Visa, Mastercard', promo: '0% Interest' },
    { name: 'Dutch Bangla Bank (DBBL)', maxMonths: 12, cards: 'Nexus, Visa, Mastercard', promo: '0% Interest' },
    { name: 'Bank Asia', maxMonths: 12, cards: 'Visa, Mastercard', promo: '0% Interest' },
    { name: 'NCC Bank', maxMonths: 12, cards: 'Visa, Mastercard', promo: '0% Interest' },
    { name: 'Jamuna Bank', maxMonths: 12, cards: 'Visa, Mastercard', promo: '0% Interest' },
    { name: 'Trust Bank', maxMonths: 12, cards: 'Visa, Mastercard', promo: '0% Interest' },
];

export const TENURE_MONTHS = [3, 6, 9, 12, 18, 24, 36];

export default function EmiModal({ isOpen, onClose, product }) {
    if (!isOpen || !product) return null;

    const basePrice = Number(product.special_price || product.price || product.regular_price || 0);
    const [downPayment, setDownPayment] = useState(0);
    const [selectedTenure, setSelectedTenure] = useState(12);
    const [selectedBank, setSelectedBank] = useState(EMI_BANKS[0].name);

    // Close on Escape key and prevent background scroll
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === 'Escape') onClose();
        };
        window.addEventListener('keydown', handleKeyDown);
        document.body.style.overflow = 'hidden';

        return () => {
            window.removeEventListener('keydown', handleKeyDown);
            document.body.style.overflow = 'auto';
        };
    }, [onClose]);

    // Current bank info
    const currentBankObj = EMI_BANKS.find(b => b.name === selectedBank) || EMI_BANKS[0];

    // Financed amount
    const financedAmount = Math.max(0, basePrice - Number(downPayment));

    // Calculate monthly for a given tenure
    const calcMonthly = (months) => {
        if (!months || months <= 0) return 0;
        return Math.round(financedAmount / months);
    };

    const monthlyInstallment = calcMonthly(selectedTenure);

    // Down payment presets
    const handleSetDownPaymentPercent = (pct) => {
        const calculated = Math.round((basePrice * pct) / 100);
        setDownPayment(calculated);
    };

    return (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4">
            <div 
                className="relative bg-white rounded-3xl shadow-2xl max-w-4xl w-full max-h-[92vh] flex flex-col border border-gray-100 overflow-hidden animate-scale-up"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="px-5 py-4 sm:px-6 sm:py-5 border-b border-gray-100 flex items-center justify-between bg-gradient-to-r from-gray-900 via-[#112538] to-gray-900 text-white shrink-0">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-orange-500/20 border border-orange-500/30 text-[#EF4A23] flex items-center justify-center shrink-0">
                            <Calculator className="w-5 h-5 text-orange-400" />
                        </div>
                        <div>
                            <div className="flex items-center gap-2">
                                <h3 className="text-base sm:text-lg font-black tracking-tight text-white">
                                    0% EMI Installment Calculator
                                </h3>
                                <span className="text-[10px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-bold px-2 py-0.5 rounded-full uppercase">
                                    Up to 36 Months
                                </span>
                            </div>
                            <p className="text-[11px] text-gray-300">
                                Available on credit cards from 28+ leading banks across Bangladesh
                            </p>
                        </div>
                    </div>
                    <button
                        type="button"
                        onClick={onClose}
                        className="text-gray-400 hover:text-white p-1.5 rounded-xl hover:bg-white/10 transition"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Content Body */}
                <div className="overflow-y-auto p-5 sm:p-6 space-y-6">
                    {/* Product Summary Row */}
                    <div className="flex flex-col sm:flex-row items-center gap-4 bg-gray-50/80 p-4 rounded-2xl border border-gray-100">
                        {product.thumbnail && (
                            <img 
                                src={product.thumbnail} 
                                alt={product.name} 
                                className="w-16 h-16 object-contain rounded-xl bg-white p-1 border border-gray-200 shrink-0"
                            />
                        )}
                        <div className="flex-1 text-center sm:text-left min-w-0">
                            <h4 className="font-bold text-gray-900 text-xs sm:text-sm line-clamp-1">{product.name}</h4>
                            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 mt-1">
                                <span className="text-xs text-gray-500">Product Price:</span>
                                <span className="text-base font-black text-[#EF4A23]">৳{basePrice.toLocaleString()}</span>
                                {product.model && (
                                    <span className="text-[11px] text-gray-400 bg-white px-2 py-0.5 rounded border border-gray-200">
                                        Model: {product.model}
                                    </span>
                                )}
                            </div>
                        </div>
                        <div className="text-center sm:text-right shrink-0 bg-white p-3 rounded-xl border border-gray-100 shadow-sm w-full sm:w-auto">
                            <span className="text-[10px] text-gray-400 uppercase font-semibold block">Estimated Monthly</span>
                            <span className="text-xl sm:text-2xl font-black text-[#EF4A23]">
                                ৳{monthlyInstallment.toLocaleString()}
                                <span className="text-xs text-gray-500 font-normal"> /mo</span>
                            </span>
                        </div>
                    </div>

                    {/* Inputs & Bank Config */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                        {/* Down Payment & Loan */}
                        <div className="space-y-3 bg-white p-4 sm:p-5 rounded-2xl border border-gray-200/90 shadow-sm">
                            <div className="flex items-center justify-between">
                                <label className="text-xs font-bold text-gray-800 flex items-center gap-1.5">
                                    <CreditCard className="w-4 h-4 text-[#EF4A23]" />
                                    <span>Down Payment (Optional ৳)</span>
                                </label>
                                <span className="text-xs font-black text-gray-900 font-mono">
                                    ৳{Number(downPayment).toLocaleString()}
                                </span>
                            </div>

                            <input
                                type="number"
                                min="0"
                                max={Math.max(0, basePrice - 1000)}
                                step="500"
                                value={downPayment}
                                onChange={(e) => setDownPayment(Math.min(Math.max(0, Number(e.target.value)), basePrice - 1000))}
                                className="w-full text-xs rounded-xl border-gray-300 focus:border-[#EF4A23] focus:ring-[#EF4A23] py-2 px-3"
                                placeholder="0"
                            />

                            {/* Quick percentages */}
                            <div className="flex items-center gap-1.5">
                                <span className="text-[11px] text-gray-400">Quick:</span>
                                {[0, 10, 20, 30, 50].map((pct) => (
                                    <button
                                        key={pct}
                                        type="button"
                                        onClick={() => handleSetDownPaymentPercent(pct)}
                                        className={`px-2 py-1 text-[11px] rounded-lg font-semibold transition border ${
                                            downPayment === Math.round((basePrice * pct) / 100)
                                                ? 'bg-[#EF4A23] text-white border-[#EF4A23]'
                                                : 'bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100'
                                        }`}
                                    >
                                        {pct}%
                                    </button>
                                ))}
                            </div>

                            <div className="pt-2 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500">
                                <span>Financed (EMI) Amount:</span>
                                <span className="font-black text-gray-900 font-mono">৳{financedAmount.toLocaleString()}</span>
                            </div>
                        </div>

                        {/* Partner Bank Selector */}
                        <div className="space-y-3 bg-white p-4 sm:p-5 rounded-2xl border border-gray-200/90 shadow-sm">
                            <label className="text-xs font-bold text-gray-800 flex items-center gap-1.5">
                                <Building2 className="w-4 h-4 text-[#EF4A23]" />
                                <span>Select Credit Card Bank</span>
                            </label>

                            <select
                                value={selectedBank}
                                onChange={(e) => {
                                    setSelectedBank(e.target.value);
                                    const b = EMI_BANKS.find(x => x.name === e.target.value);
                                    if (b && selectedTenure > b.maxMonths) {
                                        setSelectedTenure(b.maxMonths);
                                    }
                                }}
                                className="w-full text-xs rounded-xl border-gray-300 focus:border-[#EF4A23] focus:ring-[#EF4A23] py-2.5 px-3 font-semibold text-gray-800"
                            >
                                {EMI_BANKS.map((b, idx) => (
                                    <option key={idx} value={b.name}>
                                        {b.name} (Up to {b.maxMonths}M)
                                    </option>
                                ))}
                            </select>

                            <div className="bg-orange-50/70 border border-orange-200/70 p-3 rounded-xl text-xs space-y-1">
                                <div className="flex items-center justify-between font-bold text-gray-900">
                                    <span>{currentBankObj.name}</span>
                                    <span className="text-[#EF4A23]">{currentBankObj.promo}</span>
                                </div>
                                <p className="text-[11px] text-gray-500">
                                    Supported Cards: <strong className="text-gray-700">{currentBankObj.cards}</strong>
                                </p>
                                <p className="text-[11px] text-gray-500">
                                    Maximum Tenure: <strong className="text-gray-700">{currentBankObj.maxMonths} Months</strong>
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Tenure Options Cards */}
                    <div>
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-xs font-bold text-gray-800 uppercase tracking-wider">
                                Select Duration (Months)
                            </span>
                            <span className="text-[11px] text-gray-400">
                                Click any duration to recalculate
                            </span>
                        </div>

                        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2.5">
                            {TENURE_MONTHS.map((months) => {
                                const isSupported = months <= currentBankObj.maxMonths;
                                const isSelected = selectedTenure === months;
                                const installment = calcMonthly(months);

                                return (
                                    <button
                                        key={months}
                                        type="button"
                                        disabled={!isSupported}
                                        onClick={() => setSelectedTenure(months)}
                                        className={`p-3 rounded-2xl border text-center transition flex flex-col items-center justify-center relative ${
                                            !isSupported
                                                ? 'opacity-40 bg-gray-50 border-gray-200 cursor-not-allowed'
                                                : isSelected
                                                ? 'bg-[#081621] text-white border-[#081621] shadow-md ring-2 ring-[#EF4A23]/30 scale-[1.02]'
                                                : 'bg-white hover:bg-orange-50/40 border-gray-200 text-gray-700 hover:border-orange-300'
                                        }`}
                                    >
                                        <span className={`text-xs font-extrabold ${isSelected ? 'text-orange-400' : 'text-gray-900'}`}>
                                            {months} Months
                                        </span>
                                        <span className={`text-xs font-black mt-1 ${isSelected ? 'text-white' : 'text-[#EF4A23]'}`}>
                                            ৳{installment.toLocaleString()}
                                        </span>
                                        <span className={`text-[10px] mt-0.5 ${isSelected ? 'text-gray-300' : 'text-gray-400'}`}>
                                            per month
                                        </span>
                                        {isSelected && (
                                            <span className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-[#EF4A23] rounded-full text-white text-[9px] flex items-center justify-center">
                                                ✓
                                            </span>
                                        )}
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* Full Breakdown Matrix Table */}
                    <div className="border border-gray-200 rounded-2xl overflow-hidden bg-white shadow-sm">
                        <div className="bg-gray-50 px-4 py-3 border-b border-gray-200 flex items-center justify-between">
                            <span className="text-xs font-bold text-gray-900 uppercase tracking-wider flex items-center gap-1.5">
                                <BadgePercent className="w-4 h-4 text-[#EF4A23]" />
                                <span>Installment Breakdown Matrix for {currentBankObj.name}</span>
                            </span>
                            <span className="text-[11px] text-gray-500 font-medium">0% Interest Scheme</span>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-xs">
                                <thead>
                                    <tr className="bg-gray-100/70 text-gray-500 font-bold uppercase text-[10px] border-b border-gray-200">
                                        <th className="py-2.5 px-4">Duration</th>
                                        <th className="py-2.5 px-4">Monthly Payment</th>
                                        <th className="py-2.5 px-4">Financed Amount</th>
                                        <th className="py-2.5 px-4">Interest Rate</th>
                                        <th className="py-2.5 px-4">Total Payable</th>
                                        <th className="py-2.5 px-4 text-center">Status</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100 font-medium">
                                    {TENURE_MONTHS.map((m) => {
                                        const isSupported = m <= currentBankObj.maxMonths;
                                        const isSelected = selectedTenure === m;
                                        const monthly = calcMonthly(m);
                                        const total = (monthly * m) + Number(downPayment);

                                        return (
                                            <tr 
                                                key={m} 
                                                onClick={() => isSupported && setSelectedTenure(m)}
                                                className={`transition cursor-pointer ${
                                                    isSelected 
                                                        ? 'bg-orange-50 font-bold text-gray-900' 
                                                        : isSupported 
                                                        ? 'hover:bg-gray-50/70 text-gray-700' 
                                                        : 'opacity-40 bg-gray-50/40 text-gray-400 cursor-not-allowed'
                                                }`}
                                            >
                                                <td className="py-2.5 px-4">
                                                    <span className={`inline-flex items-center gap-1.5 ${isSelected ? 'text-[#EF4A23]' : ''}`}>
                                                        {isSelected && <span className="w-1.5 h-1.5 rounded-full bg-[#EF4A23]"></span>}
                                                        {m} Months
                                                    </span>
                                                </td>
                                                <td className="py-2.5 px-4 font-black text-gray-900">
                                                    ৳{monthly.toLocaleString()}
                                                </td>
                                                <td className="py-2.5 px-4 text-gray-600">
                                                    ৳{financedAmount.toLocaleString()}
                                                </td>
                                                <td className="py-2.5 px-4 text-emerald-600 font-bold">
                                                    0% Promo
                                                </td>
                                                <td className="py-2.5 px-4 font-semibold text-gray-800">
                                                    ৳{total.toLocaleString()}
                                                </td>
                                                <td className="py-2.5 px-4 text-center">
                                                    {isSupported ? (
                                                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                                                            <CheckCircle2 className="w-3 h-3" />
                                                            Available
                                                        </span>
                                                    ) : (
                                                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium bg-gray-100 text-gray-400">
                                                            Bank Excluded
                                                        </span>
                                                    )}
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* How It Works & Terms Note */}
                    <div className="bg-amber-50/60 border border-amber-200/80 rounded-2xl p-4 text-xs text-amber-900 space-y-2">
                        <div className="flex items-center gap-2 font-bold">
                            <ShieldCheck className="w-4 h-4 text-amber-600 shrink-0" />
                            <span>Important Guidelines for EMI Facility</span>
                        </div>
                        <ul className="grid grid-cols-1 md:grid-cols-2 gap-1.5 text-[11px] text-amber-800 list-disc list-inside">
                            <li>Available for eligible Credit Cards from listed banks with sufficient card limit.</li>
                            <li>Minimum order value for EMI is ৳5,000.</li>
                            <li>Debit Cards are not eligible for bank EMI as per Bangladesh Bank policy.</li>
                            <li>Available for both online checkout and nationwide branch POS machines.</li>
                        </ul>
                    </div>
                </div>

                {/* Footer Actions */}
                <div className="px-5 py-4 sm:px-6 sm:py-4 bg-gray-50 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0">
                    <Link
                        href="/page/emi-calculation"
                        className="text-xs text-gray-600 hover:text-[#EF4A23] font-semibold flex items-center gap-1 transition"
                    >
                        <span>View All 28+ Partner Banks & Official Policy</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                    </Link>

                    <button
                        type="button"
                        onClick={onClose}
                        className="w-full sm:w-auto px-6 py-2.5 bg-[#081621] hover:bg-[#112538] text-white text-xs font-bold rounded-xl transition shadow-sm"
                    >
                        Close Calculator
                    </button>
                </div>
            </div>
        </div>
    );
}
