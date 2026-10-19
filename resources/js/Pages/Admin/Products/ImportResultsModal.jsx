import React from 'react';
import {
    X,
    CheckCircle2,
    RefreshCw,
    AlertTriangle,
    FileSpreadsheet,
    Layers
} from 'lucide-react';

export default function ImportResultsModal({ results, onClose }) {
    if (!results) return null;

    const { total_rows = 0, imported = 0, updated = 0, skipped = 0, errors = [] } = results;

    return (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl max-w-2xl w-full border border-gray-200 shadow-2xl overflow-hidden transition-all animate-in fade-in zoom-in-95 duration-150">
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-gray-50/50">
                    <div className="flex items-center gap-2.5">
                        <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center">
                            <CheckCircle2 className="w-5 h-5" />
                        </div>
                        <div>
                            <h2 className="text-base font-black text-gray-900">Import Results Summary</h2>
                            <p className="text-xs text-gray-500">Overview of imported product data</p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-1.5 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition"
                    >
                        <X className="w-4 h-4" />
                    </button>
                </div>

                <div className="p-6 space-y-6">
                    {/* Stat Badges */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                        <div className="p-3.5 rounded-xl bg-gray-50 border border-gray-200/80">
                            <span className="text-[11px] font-semibold text-gray-500 block">Total Rows</span>
                            <span className="text-xl font-black text-gray-900 mt-1 block">{total_rows}</span>
                        </div>
                        <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200/80">
                            <span className="text-[11px] font-semibold text-emerald-700 block">New Created</span>
                            <span className="text-xl font-black text-emerald-800 mt-1 block">{imported}</span>
                        </div>
                        <div className="p-3.5 rounded-xl bg-blue-50 border border-blue-200/80">
                            <span className="text-[11px] font-semibold text-blue-700 block">Updated</span>
                            <span className="text-xl font-black text-blue-800 mt-1 block">{updated}</span>
                        </div>
                        <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200/80">
                            <span className="text-[11px] font-semibold text-amber-700 block">Skipped / Failed</span>
                            <span className="text-xl font-black text-amber-800 mt-1 block">{skipped}</span>
                        </div>
                    </div>

                    {/* Errors List */}
                    {errors.length > 0 && (
                        <div>
                            <div className="flex items-center gap-1.5 text-xs font-bold text-amber-900 mb-2.5">
                                <AlertTriangle className="w-4 h-4 text-amber-600" />
                                <span>Issues Detected in File ({errors.length})</span>
                            </div>
                            <div className="max-h-56 overflow-y-auto border border-gray-200 rounded-xl divide-y divide-gray-100 text-xs">
                                {errors.map((err, idx) => (
                                    <div key={idx} className="p-3 flex items-start justify-between gap-3 bg-amber-50/30">
                                        <div>
                                            <span className="inline-block px-1.5 py-0.5 rounded bg-gray-200 text-gray-700 text-[10px] font-bold mr-2">
                                                Row {err.row}
                                            </span>
                                            <span className="font-semibold text-gray-800">{err.name || 'Unnamed Product'}</span>
                                            <p className="text-[11px] text-rose-600 mt-0.5">{err.reason}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Footer Close */}
                    <div className="flex justify-end pt-2">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-5 py-2.5 rounded-xl bg-[#081621] hover:bg-gray-800 text-white text-xs font-bold transition shadow-sm"
                        >
                            Done
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
