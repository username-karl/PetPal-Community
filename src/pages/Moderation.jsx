import React, { useEffect } from 'react';
import { ShieldAlert, Trash2, Check, X, Clock, Inbox } from 'lucide-react';
import { useData } from '../context/DataContext';

const Moderation = ({ user }) => {
  const { pendingPosts, refreshPendingPosts, approvePost, rejectPost, deletePost } = useData();

  useEffect(() => {
    refreshPendingPosts();
  }, []);

  const handleApprove = async (postId) => {
    try {
      await approvePost(postId);
    } catch (err) {
      console.error('Failed to approve post:', err);
    }
  };

  const handleReject = async (postId) => {
    try {
      await rejectPost(postId);
    } catch (err) {
      console.error('Failed to reject post:', err);
    }
  };

  const handleDelete = async (postId) => {
    if (window.confirm('Are you sure you want to delete this post?')) {
      try {
        await deletePost(postId);
      } catch (err) {
        console.error('Failed to delete post:', err);
      }
    }
  };

  const getCategoryColor = (category) => {
    const colors = {
      'General': 'bg-slate-100 text-slate-600 border-slate-200',
      'Advice': 'bg-blue-50 text-blue-600 border-blue-200',
      'Question': 'bg-purple-50 text-purple-600 border-purple-200',
      'Adoption': 'bg-pink-50 text-pink-600 border-pink-200',
      'Health': 'bg-red-50 text-red-600 border-red-200',
      'Tips': 'bg-emerald-50 text-emerald-600 border-emerald-200',
    };
    return colors[category] || colors['General'];
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold text-slate-900 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-100 flex items-center justify-center text-indigo-600">
            <ShieldAlert className="w-6 h-6" />
          </div>
          Moderation Dashboard
        </h2>
        <button
          onClick={refreshPendingPosts}
          className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
        >
          Refresh
        </button>
      </div>

      {/* Pending Posts Section */}
      <div className="bg-white rounded-3xl border border-slate-100 shadow-soft overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex items-center gap-3">
          <Clock className="w-5 h-5 text-amber-500" />
          <h3 className="font-bold text-slate-900">Pending Approval</h3>
          <span className="ml-auto bg-amber-100 text-amber-700 text-xs font-bold px-2.5 py-1 rounded-full">
            {pendingPosts.length} posts
          </span>
        </div>

        {pendingPosts.length === 0 ? (
          <div className="p-12 text-center">
            <Inbox className="w-12 h-12 text-slate-300 mx-auto mb-4" />
            <h4 className="text-lg font-semibold text-slate-400 mb-2">No Pending Posts</h4>
            <p className="text-sm text-slate-400">All community posts have been reviewed.</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-50">
            {pendingPosts.map(post => (
              <div key={post.id} className="p-6 hover:bg-slate-50/50 transition-colors">
                <div className="flex items-start gap-4">
                  {/* Author Avatar */}
                  <img
                    src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${post.author?.name || 'User'}`}
                    className="w-10 h-10 rounded-full bg-slate-100 flex-shrink-0"
                    alt={post.author?.name}
                  />

                  {/* Post Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-bold text-slate-900 text-sm">{post.author?.name || 'Unknown User'}</span>
                      <span className="text-slate-400 text-xs">•</span>
                      <span className="text-slate-400 text-xs">
                        {new Date(post.timestamp).toLocaleDateString()}
                      </span>
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border ${getCategoryColor(post.category)}`}>
                        {post.category || 'General'}
                      </span>
                    </div>
                    <h4 className="font-semibold text-slate-900 mb-1">{post.title}</h4>
                    <p className="text-sm text-slate-600 line-clamp-2">{post.content}</p>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <button
                      onClick={() => handleApprove(post.id)}
                      className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 text-emerald-600 text-sm font-medium rounded-lg hover:bg-emerald-100 transition-colors border border-emerald-200"
                      title="Approve post"
                    >
                      <Check className="w-4 h-4" />
                      Approve
                    </button>
                    <button
                      onClick={() => handleReject(post.id)}
                      className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-50 text-amber-600 text-sm font-medium rounded-lg hover:bg-amber-100 transition-colors border border-amber-200"
                      title="Reject post"
                    >
                      <X className="w-4 h-4" />
                      Reject
                    </button>
                    <button
                      onClick={() => handleDelete(post.id)}
                      className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      title="Delete post"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Moderation;