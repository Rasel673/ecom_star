import React, { useState } from 'react';
import { Link, router } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { MessageSquare, Send, CheckCircle2, Clock, User, Hash, AlertCircle } from 'lucide-react';

export default function Messages({ messages }) {
    const [selectedMessage, setSelectedMessage] = useState(null);
    const [replyText, setReplyText] = useState('');
    const [replyStatus, setReplyStatus] = useState('replied');
    const [submitting, setSubmitting] = useState(false);

    const handleOpenReply = (msg) => {
        setSelectedMessage(msg);
        setReplyText(msg.admin_reply || '');
        setReplyStatus(msg.status === 'open' ? 'replied' : msg.status);
    };

    const handleSendReply = (e) => {
        e.preventDefault();
        if (!selectedMessage || !replyText.trim()) return;

        setSubmitting(true);
        router.post(route('admin.messages.reply', selectedMessage.id), {
            admin_reply: replyText,
            status: replyStatus,
        }, {
            preserveScroll: true,
            onSuccess: () => {
                setSelectedMessage(null);
                setReplyText('');
            },
            onFinish: () => setSubmitting(false),
        });
    };

    const getStatusBadge = (status) => {
        switch (status) {
            case 'replied':
                return (
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-50 text-blue-700 border border-blue-200">
                        <CheckCircle2 className="w-3 h-3" /> Replied
                    </span>
                );
            case 'closed':
                return (
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-gray-100 text-gray-700 border border-gray-300">
                        Closed
                    </span>
                );
            default:
                return (
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-50 text-amber-700 border border-amber-200">
                        <Clock className="w-3 h-3" /> Pending Reply
                    </span>
                );
        }
    };

    return (
        <AdminLayout title="Customer Messages & Inquiries">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
                <div>
                    <h1 className="text-xl font-black text-gray-900 flex items-center gap-2">
                        <MessageSquare className="w-6 h-6 text-[#EF4A23]" />
                        <span>Customer Inquiries & Messages</span>
                    </h1>
                    <p className="text-xs text-gray-500">Respond directly to customer support questions, order queries, and assistance requests.</p>
                </div>
            </div>

            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs text-gray-600">
                        <thead className="bg-gray-50 text-gray-700 uppercase font-semibold border-b text-[11px] tracking-wider">
                            <tr>
                                <th className="p-4">Customer</th>
                                <th className="p-4">Subject & Details</th>
                                <th className="p-4">Order Ref</th>
                                <th className="p-4">Date</th>
                                <th className="p-4">Status</th>
                                <th className="p-4 text-right">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {messages.data && messages.data.length > 0 ? (
                                messages.data.map((msg) => (
                                    <tr key={msg.id} className="hover:bg-gray-50/70 transition">
                                        <td className="p-4">
                                            <div className="font-bold text-gray-900 flex items-center gap-1.5">
                                                <User className="w-3.5 h-3.5 text-gray-400" />
                                                <span>{msg.user?.name || 'Customer'}</span>
                                            </div>
                                            <div className="text-[11px] text-gray-400 mt-0.5">{msg.user?.email}</div>
                                            {msg.user?.phone && (
                                                <div className="text-[11px] text-gray-400">{msg.user?.phone}</div>
                                            )}
                                        </td>
                                        <td className="p-4 max-w-md">
                                            <div className="font-bold text-gray-900 mb-1">{msg.subject}</div>
                                            <p className="text-gray-500 line-clamp-2 leading-relaxed">{msg.message}</p>
                                            {msg.admin_reply && (
                                                <div className="mt-2 text-[11px] bg-blue-50/80 border border-blue-100 rounded-lg p-2 text-blue-900">
                                                    <span className="font-bold block text-blue-700">Official Reply:</span>
                                                    <span className="line-clamp-2">{msg.admin_reply}</span>
                                                </div>
                                            )}
                                        </td>
                                        <td className="p-4 whitespace-nowrap">
                                            {msg.order_number ? (
                                                <span className="font-mono font-bold text-xs bg-gray-100 text-gray-800 px-2 py-1 rounded">
                                                    #{msg.order_number}
                                                </span>
                                            ) : (
                                                <span className="text-gray-400">—</span>
                                            )}
                                        </td>
                                        <td className="p-4 whitespace-nowrap text-gray-500 text-[11px]">
                                            {new Date(msg.created_at).toLocaleString('en-US', {
                                                month: 'short',
                                                day: 'numeric',
                                                year: 'numeric',
                                                hour: '2-digit',
                                                minute: '2-digit'
                                            })}
                                        </td>
                                        <td className="p-4 whitespace-nowrap">
                                            {getStatusBadge(msg.status)}
                                        </td>
                                        <td className="p-4 text-right whitespace-nowrap">
                                            <button
                                                onClick={() => handleOpenReply(msg)}
                                                className="px-3 py-1.5 bg-[#081621] hover:bg-[#EF4A23] text-white text-xs font-semibold rounded-lg transition shadow-sm inline-flex items-center gap-1.5"
                                            >
                                                <Send className="w-3.5 h-3.5" />
                                                <span>{msg.admin_reply ? 'Edit Reply' : 'Reply'}</span>
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="6" className="p-8 text-center text-gray-400">
                                        No customer messages found yet.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                {messages.links && messages.links.length > 3 && (
                    <div className="p-4 border-t border-gray-100 flex items-center justify-between">
                        <div className="text-xs text-gray-500">
                            Showing {messages.from || 0} to {messages.to || 0} of {messages.total} messages
                        </div>
                        <div className="flex items-center gap-1">
                            {messages.links.map((link, idx) => (
                                <Link
                                    key={idx}
                                    href={link.url || '#'}
                                    dangerouslySetInnerHTML={{ __html: link.label }}
                                    className={`px-3 py-1 text-xs rounded-lg border transition ${
                                        link.active
                                            ? 'bg-[#EF4A23] text-white border-[#EF4A23]'
                                            : !link.url
                                            ? 'text-gray-300 border-gray-200 cursor-not-allowed'
                                            : 'text-gray-600 border-gray-200 hover:bg-gray-50'
                                    }`}
                                />
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {/* Reply Modal */}
            {selectedMessage && (
                <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl max-w-lg w-full overflow-hidden shadow-2xl border border-gray-100">
                        <div className="bg-[#081621] px-6 py-4 flex items-center justify-between text-white">
                            <h3 className="text-sm font-bold flex items-center gap-2">
                                <MessageSquare className="w-4 h-4 text-[#EF4A23]" />
                                <span>Reply to {selectedMessage.user?.name || 'Customer'}</span>
                            </h3>
                            <button
                                onClick={() => setSelectedMessage(null)}
                                className="text-gray-400 hover:text-white text-lg leading-none"
                            >
                                &times;
                            </button>
                        </div>

                        <form onSubmit={handleSendReply} className="p-6 space-y-4">
                            <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
                                <div className="text-xs text-gray-500 mb-1">
                                    Subject: <strong className="text-gray-900">{selectedMessage.subject}</strong>
                                    {selectedMessage.order_number && (
                                        <span className="ml-2 font-mono text-xs bg-gray-200 px-1.5 py-0.5 rounded text-gray-700">
                                            Order #{selectedMessage.order_number}
                                        </span>
                                    )}
                                </div>
                                <p className="text-xs text-gray-700 whitespace-pre-wrap leading-relaxed mt-2 bg-white p-3 rounded-lg border border-gray-100">
                                    {selectedMessage.message}
                                </p>
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-gray-700 mb-1">
                                    Official Admin Response *
                                </label>
                                <textarea
                                    required
                                    rows="5"
                                    value={replyText}
                                    onChange={(e) => setReplyText(e.target.value)}
                                    placeholder="Type your official answer, delivery update, or support solution here..."
                                    className="w-full text-xs rounded-xl border-gray-300 focus:border-[#EF4A23] focus:ring-[#EF4A23] p-3 leading-relaxed"
                                ></textarea>
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-gray-700 mb-1">
                                    Update Ticket Status
                                </label>
                                <select
                                    value={replyStatus}
                                    onChange={(e) => setReplyStatus(e.target.value)}
                                    className="w-full text-xs rounded-lg border-gray-300 focus:border-[#EF4A23] focus:ring-[#EF4A23] py-2 px-3"
                                >
                                    <option value="replied">Replied (Customer will see answer)</option>
                                    <option value="closed">Closed (Issue resolved)</option>
                                </select>
                            </div>

                            <div className="flex items-center justify-end gap-3 pt-2">
                                <button
                                    type="button"
                                    onClick={() => setSelectedMessage(null)}
                                    className="px-4 py-2 text-xs font-semibold text-gray-600 hover:text-gray-800"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={submitting}
                                    className="px-5 py-2.5 rounded-xl bg-[#EF4A23] hover:bg-[#d63c17] text-white font-bold text-xs flex items-center gap-1.5 shadow-md disabled:opacity-50 transition"
                                >
                                    <Send className="w-4 h-4" />
                                    <span>{submitting ? 'Sending...' : 'Send Response'}</span>
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </AdminLayout>
    );
}
