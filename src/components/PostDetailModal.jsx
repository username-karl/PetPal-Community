import React, { useState, useEffect } from 'react';
import {
    X,
    Heart,
    MessageCircle,
    Eye,
    Clock,
    Share2,
    Bookmark,
    Send,
    ChevronUp,
    MoreHorizontal
} from 'lucide-react';
import { format } from 'date-fns';
import { api } from '../api';

const PostDetailModal = ({ post, user, onClose, onLike, onComment, onUpdate }) => {
    const [comment, setComment] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Increment view count when modal opens
    useEffect(() => {
        const incrementView = async () => {
            try {
                const updatedPost = await api.viewPost(post.id);
                if (onUpdate) onUpdate(updatedPost);
            } catch (err) {
                console.error('Failed to increment view:', err);
            }
        };
        incrementView();
    }, [post.id]);

    const handleSubmitComment = async () => {
        if (!comment.trim()) return;
        setIsSubmitting(true);
        try {
            await onComment(post.id, comment);
            setComment('');
        } finally {
            setIsSubmitting(false);
        }
    };

    const getCategoryColor = (category) => {
        const colors = {
            'General': 'bg-slate-100 text-slate-600',
            'Advice': 'bg-blue-100 text-blue-600',
            'Question': 'bg-purple-100 text-purple-600',
            'Adoption': 'bg-pink-100 text-pink-600',
            'Health': 'bg-red-100 text-red-600',
            'Tips': 'bg-emerald-100 text-emerald-600',
        };
        return colors[category] || colors['General'];
    };

    return (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-start justify-center overflow-y-auto py-8 px-4">
            <div className="bg-white rounded-2xl max-w-3xl w-full shadow-2xl my-auto">
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b border-slate-100">
                    <div className="flex items-center gap-3">
                        <img
                            src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${post.author?.name || 'User'}`}
                            className="w-10 h-10 rounded-full bg-slate-100"
                            alt={post.author?.name}
                        />
                        <div>
                            <h4 className="font-semibold text-slate-900">{post.author?.name || 'Anonymous'}</h4>
                            <div className="flex items-center gap-2 text-xs text-slate-500">
                                <Clock className="w-3 h-3" />
                                {format(new Date(post.timestamp), 'MMM d, yyyy • h:mm a')}
                            </div>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-slate-100 rounded-lg transition"
                    >
                        <X className="w-5 h-5 text-slate-400" />
                    </button>
                </div>

                {/* Content */}
                <div className="p-6">
                    <div className="flex items-center gap-2 mb-3">
                        <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${getCategoryColor(post.category)}`}>
                            {post.category || 'General'}
                        </span>
                    </div>
                    <h2 className="text-2xl font-bold text-slate-900 mb-4">{post.title}</h2>
                    <p className="text-slate-600 leading-relaxed whitespace-pre-wrap">
                        {post.content}
                    </p>
                </div>

                {/* Stats Bar */}
                <div className="flex items-center gap-6 px-6 py-4 border-t border-b border-slate-100 bg-slate-50/50">
                    <button
                        onClick={() => onLike(post.id)}
                        className="flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-red-500 transition group"
                    >
                        <Heart className={`w-5 h-5 ${post.likes > 0 ? 'fill-red-500 text-red-500' : 'group-hover:fill-red-500'}`} />
                        <span>{post.likes || 0} Likes</span>
                    </button>
                    <div className="flex items-center gap-2 text-sm font-medium text-slate-600">
                        <MessageCircle className="w-5 h-5" />
                        <span>{post.comments?.length || 0} Comments</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm font-medium text-slate-600">
                        <Eye className="w-5 h-5" />
                        <span>{post.views || 0} Views</span>
                    </div>
                    <div className="flex-1"></div>
                    <button className="p-2 hover:bg-slate-100 rounded-lg transition text-slate-400 hover:text-slate-600">
                        <Share2 className="w-4 h-4" />
                    </button>
                    <button className="p-2 hover:bg-slate-100 rounded-lg transition text-slate-400 hover:text-slate-600">
                        <Bookmark className="w-4 h-4" />
                    </button>
                </div>

                {/* Comments Section */}
                <div className="p-6">
                    <h3 className="font-semibold text-slate-900 mb-4">
                        Comments ({post.comments?.length || 0})
                    </h3>

                    {/* Add Comment */}
                    <div className="flex gap-3 mb-6">
                        <img
                            src={user?.avatarUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.name || 'User'}`}
                            className="w-8 h-8 rounded-full bg-slate-100 flex-shrink-0"
                            alt={user?.name}
                        />
                        <div className="flex-1 flex gap-2">
                            <input
                                type="text"
                                value={comment}
                                onChange={(e) => setComment(e.target.value)}
                                placeholder="Add a comment..."
                                className="flex-1 bg-slate-50 border border-slate-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-slate-200 focus:border-slate-300"
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter' && !e.shiftKey) {
                                        e.preventDefault();
                                        handleSubmitComment();
                                    }
                                }}
                            />
                            <button
                                onClick={handleSubmitComment}
                                disabled={!comment.trim() || isSubmitting}
                                className="px-4 py-2 bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition disabled:opacity-50 flex items-center gap-2"
                            >
                                <Send className="w-4 h-4" />
                            </button>
                        </div>
                    </div>

                    {/* Comments List */}
                    <div className="space-y-4 max-h-80 overflow-y-auto">
                        {post.comments && post.comments.length > 0 ? (
                            post.comments.map((c, idx) => (
                                <div key={idx} className="flex gap-3">
                                    <img
                                        src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${c.author?.name || 'User'}`}
                                        className="w-8 h-8 rounded-full bg-slate-100 flex-shrink-0"
                                        alt={c.author?.name}
                                    />
                                    <div className="flex-1 bg-slate-50 rounded-xl p-3">
                                        <div className="flex items-center gap-2 mb-1">
                                            <span className="font-semibold text-sm text-slate-900">
                                                {c.author?.name || 'Anonymous'}
                                            </span>
                                            <span className="text-xs text-slate-400">
                                                {c.timestamp ? format(new Date(c.timestamp), 'MMM d') : ''}
                                            </span>
                                        </div>
                                        <p className="text-sm text-slate-600">{c.text}</p>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="text-center py-8 text-slate-400">
                                <MessageCircle className="w-8 h-8 mx-auto mb-2 opacity-50" />
                                <p className="text-sm">No comments yet. Be the first to comment!</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PostDetailModal;
