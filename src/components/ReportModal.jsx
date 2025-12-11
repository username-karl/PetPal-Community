import React, { useState } from 'react';
import { X, Flag, AlertTriangle, Send } from 'lucide-react';
import { api } from '../api';

const REPORT_REASONS = [
    { id: 'spam', label: 'Spam', description: 'Misleading or repetitive content' },
    { id: 'harassment', label: 'Harassment', description: 'Attacking or bullying others' },
    { id: 'inappropriate', label: 'Inappropriate Content', description: 'Offensive or explicit material' },
    { id: 'misinformation', label: 'Misinformation', description: 'False or misleading information' },
    { id: 'other', label: 'Other', description: 'Something else not listed above' },
];

const ReportModal = ({ post, userId, onClose, onReported }) => {
    const [selectedReason, setSelectedReason] = useState('');
    const [description, setDescription] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);

    const handleSubmit = async () => {
        if (!selectedReason) {
            setError('Please select a reason for your report');
            return;
        }

        setIsSubmitting(true);
        setError('');

        try {
            await api.createReport(post.id, selectedReason, description, userId);
            setSuccess(true);
            setTimeout(() => {
                if (onReported) onReported();
                onClose();
            }, 1500);
        } catch (err) {
            setError(err.message || 'Failed to submit report. You may have already reported this post.');
        } finally {
            setIsSubmitting(false);
        }
    };

    if (success) {
        return (
            <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl p-8 text-center">
                    <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-4">
                        <Flag className="w-8 h-8 text-emerald-600" />
                    </div>
                    <h3 className="text-xl font-bold text-slate-900 mb-2">Report Submitted</h3>
                    <p className="text-sm text-slate-500">Thank you for helping keep our community safe. Our moderators will review your report.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl overflow-hidden">
                {/* Header */}
                <div className="p-5 border-b border-slate-100 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center">
                            <Flag className="w-5 h-5 text-red-600" />
                        </div>
                        <div>
                            <h3 className="font-bold text-slate-900">Report Post</h3>
                            <p className="text-xs text-slate-500">Help us understand the issue</p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-slate-100 rounded-lg transition"
                    >
                        <X className="w-5 h-5 text-slate-400" />
                    </button>
                </div>

                {/* Post Preview */}
                <div className="px-5 py-3 bg-slate-50 border-b border-slate-100">
                    <p className="text-xs text-slate-500 mb-1">Reporting:</p>
                    <p className="text-sm font-medium text-slate-900 line-clamp-1">{post.title}</p>
                </div>

                {/* Content */}
                <div className="p-5">
                    {error && (
                        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2 text-sm text-red-600">
                            <AlertTriangle className="w-4 h-4 flex-shrink-0" />
                            {error}
                        </div>
                    )}

                    <p className="text-sm font-medium text-slate-700 mb-3">Why are you reporting this post?</p>

                    <div className="space-y-2 mb-4">
                        {REPORT_REASONS.map(reason => (
                            <button
                                key={reason.id}
                                onClick={() => setSelectedReason(reason.id)}
                                className={`w-full p-3 rounded-xl text-left transition border ${selectedReason === reason.id
                                        ? 'border-red-300 bg-red-50'
                                        : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                                    }`}
                            >
                                <p className={`text-sm font-medium ${selectedReason === reason.id ? 'text-red-700' : 'text-slate-900'}`}>
                                    {reason.label}
                                </p>
                                <p className="text-xs text-slate-500">{reason.description}</p>
                            </button>
                        ))}
                    </div>

                    <div className="mb-4">
                        <label className="text-sm font-medium text-slate-700 mb-2 block">
                            Additional details (optional)
                        </label>
                        <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="Provide more context about your report..."
                            className="w-full border border-slate-200 rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-red-200 focus:border-red-300 resize-none"
                            rows={3}
                        />
                    </div>

                    <div className="flex gap-3">
                        <button
                            onClick={onClose}
                            className="flex-1 px-4 py-2.5 bg-slate-100 text-slate-700 font-medium rounded-xl hover:bg-slate-200 transition"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleSubmit}
                            disabled={!selectedReason || isSubmitting}
                            className="flex-1 px-4 py-2.5 bg-red-600 text-white font-medium rounded-xl hover:bg-red-700 transition disabled:opacity-50 flex items-center justify-center gap-2"
                        >
                            {isSubmitting ? (
                                <>
                                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                                    Submitting...
                                </>
                            ) : (
                                <>
                                    <Send className="w-4 h-4" />
                                    Submit Report
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ReportModal;
