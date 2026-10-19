import React, { useState, useRef } from 'react';
import { useForm } from '@inertiajs/react';
import {
    X,
    UploadCloud,
    FileSpreadsheet,
    Download,
    CheckCircle2,
    AlertCircle,
    Info,
    Loader2,
    FileText
} from 'lucide-react';

export default function BulkImportModal({ isOpen, onClose }) {
    const fileInputRef = useRef(null);
    const [dragActive, setDragActive] = useState(false);

    const { data, setData, post, processing, errors, reset, progress } = useForm({
        file: null,
        update_existing: true,
    });

    if (!isOpen) return null;

    const handleDrag = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === 'dragenter' || e.type === 'dragover') {
            setDragActive(true);
        } else if (e.type === 'dragleave') {
            setDragActive(false);
        }
    };

    const handleDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            setData('file', e.dataTransfer.files[0]);
        }
    };

    const handleFileChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            setData('file', e.target.files[0]);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!data.file) return;

        post(route('admin.products.import'), {
            onSuccess: () => {
                reset();
                onClose();
            },
        });
    };

    const formatFileSize = (bytes) => {
        if (!bytes) return '0 B';
        const k = 1024;
        const sizes = ['B', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    };

    return (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl max-w-xl w-full border border-gray-200 shadow-2xl overflow-hidden transition-all animate-in fade-in zoom-in-95 duration-150">
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-gray-50/50">
                    <div className="flex items-center gap-2.5">
                        <div className="w-9 h-9 rounded-xl bg-orange-100 text-[#EF4A23] flex items-center justify-center">
                            <FileSpreadsheet className="w-5 h-5" />
                        </div>
                        <div>
                            <h2 className="text-base font-black text-gray-900">Bulk Import Products</h2>
                            <p className="text-xs text-gray-500">Upload Excel (.xlsx) or CSV (.csv) file to import catalog</p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        disabled={processing}
                        className="p-1.5 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition"
                    >
                        <X className="w-4 h-4" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-5">
                    {/* Sample Template Download Card */}
                    <div className="p-4 rounded-xl bg-amber-50/60 border border-amber-200/60 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                        <div className="flex items-start gap-2.5">
                            <Info className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                            <div className="text-xs text-amber-900">
                                <p className="font-bold">Need a spreadsheet template?</p>
                                <p className="text-amber-800/80">Download our pre-formatted sample with sample data and columns.</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                            <a
                                href={route('admin.products.sample-template', { format: 'xlsx' })}
                                className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] font-bold shadow-xs transition"
                            >
                                <Download className="w-3 h-3" />
                                <span>Excel (.xlsx)</span>
                            </a>
                            <a
                                href={route('admin.products.sample-template', { format: 'csv' })}
                                className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-gray-700 hover:bg-gray-800 text-white text-[11px] font-bold shadow-xs transition"
                            >
                                <Download className="w-3 h-3" />
                                <span>CSV</span>
                            </a>
                        </div>
                    </div>

                    {/* Drag and Drop Zone */}
                    <div
                        onDragEnter={handleDrag}
                        onDragLeave={handleDrag}
                        onDragOver={handleDrag}
                        onDrop={handleDrop}
                        onClick={() => fileInputRef.current?.click()}
                        className={`relative border-2 border-dashed rounded-2xl p-6 text-center cursor-pointer transition flex flex-col items-center justify-center ${
                            dragActive
                                ? 'border-[#EF4A23] bg-orange-50/50 scale-[0.99]'
                                : data.file
                                ? 'border-emerald-500 bg-emerald-50/30'
                                : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50/50'
                        }`}
                    >
                        <input
                            ref={fileInputRef}
                            type="file"
                            accept=".xlsx,.csv,.txt"
                            onChange={handleFileChange}
                            className="hidden"
                        />

                        {data.file ? (
                            <div className="flex items-center gap-3">
                                <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0">
                                    <FileSpreadsheet className="w-6 h-6" />
                                </div>
                                <div className="text-left">
                                    <p className="text-xs font-bold text-gray-900 truncate max-w-xs">{data.file.name}</p>
                                    <p className="text-[11px] text-gray-500">{formatFileSize(data.file.size)}</p>
                                    <p className="text-[10px] text-emerald-600 font-semibold mt-0.5 flex items-center gap-1">
                                        <CheckCircle2 className="w-3 h-3" /> Ready to import
                                    </p>
                                </div>
                                <button
                                    type="button"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setData('file', null);
                                    }}
                                    className="p-1 rounded-md text-gray-400 hover:text-rose-600 hover:bg-rose-50 ml-2"
                                >
                                    <X className="w-4 h-4" />
                                </button>
                            </div>
                        ) : (
                            <>
                                <div className="w-12 h-12 rounded-2xl bg-orange-50 text-[#EF4A23] flex items-center justify-center mb-3">
                                    <UploadCloud className="w-6 h-6" />
                                </div>
                                <p className="text-xs font-bold text-gray-800 mb-1">
                                    Click to choose file or drag and drop
                                </p>
                                <p className="text-[11px] text-gray-400">
                                    Supports Microsoft Excel (.xlsx) and CSV (.csv) up to 25MB
                                </p>
                            </>
                        )}
                    </div>

                    {errors.file && (
                        <div className="flex items-center gap-1.5 text-xs text-rose-600 font-medium">
                            <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                            <span>{errors.file}</span>
                        </div>
                    )}

                    {progress && (
                        <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
                            <div
                                className="bg-[#EF4A23] h-2 rounded-full transition-all duration-200"
                                style={{ width: `${progress.percentage}%` }}
                            />
                        </div>
                    )}

                    {/* Options */}
                    <div className="space-y-3 pt-2">
                        <label className="flex items-start gap-2.5 cursor-pointer">
                            <input
                                type="checkbox"
                                checked={data.update_existing}
                                onChange={(e) => setData('update_existing', e.target.checked)}
                                className="rounded text-[#EF4A23] focus:ring-[#EF4A23] mt-0.5"
                            />
                            <div className="text-xs">
                                <span className="font-bold text-gray-800">Update existing products</span>
                                <p className="text-[11px] text-gray-500">
                                    If a product with the same SKU, Slug, or ID already exists, update its details instead of skipping.
                                </p>
                            </div>
                        </label>
                    </div>

                    {/* Helpful tips */}
                    <div className="bg-gray-50 rounded-xl p-3 text-[11px] text-gray-600 space-y-1 border border-gray-100">
                        <p className="font-bold text-gray-700 flex items-center gap-1">
                            <Info className="w-3.5 h-3.5 text-blue-500" /> Smart Import Features:
                        </p>
                        <ul className="list-disc list-inside space-y-0.5 text-gray-500 pl-1">
                            <li>New Categories & Brands are auto-created if they do not exist yet.</li>
                            <li>Numeric prices are cleaned automatically (currency signs ৳ or commas are stripped).</li>
                            <li>Key features can be listed with bullet points or pipe (<code className="bg-gray-200 px-1 rounded">|</code>) separation.</li>
                        </ul>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-gray-100">
                        <button
                            type="button"
                            onClick={onClose}
                            disabled={processing}
                            className="px-4 py-2 rounded-xl text-xs font-semibold text-gray-600 hover:bg-gray-100 transition"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={!data.file || processing}
                            className="inline-flex items-center gap-2 px-5 py-2 rounded-xl bg-[#EF4A23] hover:bg-[#d63c17] disabled:bg-gray-300 disabled:cursor-not-allowed text-white text-xs font-bold transition shadow-sm"
                        >
                            {processing ? (
                                <>
                                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                    <span>Importing Products...</span>
                                </>
                            ) : (
                                <>
                                    <UploadCloud className="w-3.5 h-3.5" />
                                    <span>Upload & Import</span>
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
