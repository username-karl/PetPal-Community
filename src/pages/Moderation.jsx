import React, { useEffect, useState } from 'react';
import { ShieldAlert, Trash2, Check, X, Clock, Inbox, Flag, Eye, AlertTriangle } from 'lucide-react';
import { useData } from '../context/DataContext';
import { api } from '../api';

const Moderation = ({ user }) => {
  const { pendingPosts, refreshPendingPosts, approvePost, rejectPost, deletePost } = useData();
  const [reports, setReports] = useState([]);
  const [activeTab, setActiveTab] = useState('pending');
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);

  useEffect(() => {
    refreshPendingPosts();
    fetchReports();
  }, []);

  const fetchReports = async () => {
    try {
      const data = await api.getReports('PENDING');
      setReports(data);
    } catch (err) {
      console.error('Failed to fetch reports:', err);
    }
  };

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

  const handleDeletePost = async (postId) => {
    try {
      await deletePost(postId);
      setDeleteConfirmId(null);
      fetchReports(); // Refresh reports as the post is now deleted
    } catch (err) {
      console.error('Failed to delete post:', err);
    }
  };

  const handleReviewReport = async (reportId, action) => {
    try {
      await api.reviewReport(reportId, user.id, action);
      fetchReports();
    } catch (err) {
      console.error('Failed to review report:', err);
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

  const getReasonLabel = (reason) => {
    const labels = {
      'spam': 'Spam',
      'harassment': 'Harassment',
      'inappropriate': 'Inappropriate Content',
      'misinformation': 'Misinformation',
      'other': 'Other'
    };
    return labels[reason] || reason;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-100 flex items-center justify-center text-indigo-600">
            <ShieldAlert className="w-5 h-5" />
          </div>
          Moderation
        </h2>
        <button
          onClick={() => {
            refreshPendingPosts();
            fetchReports();
          }}
          className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition"
        >
          Refresh
        </button>
      </div>

      {/* Tabs */}
      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
        <div className="flex border-b border-slate-100">
          <button
            onClick={() => setActiveTab('pending')}
            className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 text-sm font-medium transition ${activeTab === 'pending'
                ? 'text-slate-900 border-b-2 border-slate-900 bg-slate-50'
                : 'text-slate-500 hover:text-slate-700 hover:bg-slate-50'
              }`}
          >
            <Clock className="w-4 h-4" />
            Pending Posts
            <span className="bg-amber-100 text-amber-700 text-xs font-bold px-2 py-0.5 rounded-full">
              {pendingPosts.length}
            </span>
          </button>
          <button
            onClick={() => setActiveTab('reports')}
            className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 text-sm font-medium transition ${activeTab === 'reports'
                ? 'text-slate-900 border-b-2 border-slate-900 bg-slate-50'
                : 'text-slate-500 hover:text-slate-700 hover:bg-slate-50'
              }`}
          >
            <Flag className="w-4 h-4" />
            Reports
            <span className="bg-red-100 text-red-700 text-xs font-bold px-2 py-0.5 rounded-full">
              {reports.length}
            </span>
          </button>
        </div>

        {/* Pending Posts Tab */}
        {activeTab === 'pending' && (
          <>
            {pendingPosts.length === 0 ? (
              <div className="p-12 text-center">
                <Inbox className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                <h4 className="text-lg font-semibold text-slate-400 mb-2">No Pending Posts</h4>
                <p className="text-sm text-slate-400">All community posts have been reviewed.</p>
              </div>
            ) : (
              <div className="divide-y divide-slate-100">
                {pendingPosts.map(post => (
                  <div key={post.id} className="p-5 hover:bg-slate-50/50 transition">
                    <div className="flex items-start gap-4">
                      <img
                        src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${post.author?.name || 'User'}`}
                        className="w-10 h-10 rounded-full bg-slate-100 flex-shrink-0"
                        alt={post.author?.name}
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1 flex-wrap">
                          <span className="font-bold text-slate-900 text-sm">{post.author?.name || 'Unknown'}</span>
                          <span className="text-slate-400 text-xs">•</span>
                          <span className="text-slate-400 text-xs">
                            {new Date(post.timestamp).toLocaleDateString()}
                          </span>
                          <span className={`px-2 py-0.5 rounded-full text-xs font-medium border ${getCategoryColor(post.category)}`}>
                            {post.category || 'General'}
                          </span>
                        </div>
                        <h4 className="font-semibold text-slate-900 mb-1">{post.title}</h4>
                        <p className="text-sm text-slate-600 line-clamp-2">{post.content}</p>
                      </div>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <button
                          onClick={() => handleApprove(post.id)}
                          className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 text-emerald-600 text-sm font-medium rounded-lg hover:bg-emerald-100 transition border border-emerald-200"
                        >
                          <Check className="w-4 h-4" />
                          Approve
                        </button>
                        <button
                          onClick={() => handleReject(post.id)}
                          className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-50 text-amber-600 text-sm font-medium rounded-lg hover:bg-amber-100 transition border border-amber-200"
                        >
                          <X className="w-4 h-4" />
                          Reject
                        </button>
                        <button
                          onClick={() => setDeleteConfirmId(post.id)}
                          className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}

        {/* Reports Tab */}
        {activeTab === 'reports' && (
          <>
            {reports.length === 0 ? (
              <div className="p-12 text-center">
                <Flag className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                <h4 className="text-lg font-semibold text-slate-400 mb-2">No Pending Reports</h4>
                <p className="text-sm text-slate-400">No community reports require attention.</p>
              </div>
            ) : (
              <div className="divide-y divide-slate-100">
                {reports.map(report => (
                  <div key={report.id} className="p-5 hover:bg-slate-50/50 transition">
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0">
                        <Flag className="w-5 h-5 text-red-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-2 flex-wrap">
                          <span className="px-2 py-0.5 bg-red-100 text-red-700 text-xs font-medium rounded-full">
                            {getReasonLabel(report.reason)}
                          </span>
                          <span className="text-slate-400 text-xs">
                            Reported by {report.reporter?.name || 'Unknown'}
                          </span>
                          <span className="text-slate-400 text-xs">•</span>
                          <span className="text-slate-400 text-xs">
                            {new Date(report.timestamp).toLocaleDateString()}
                          </span>
                        </div>
                        {report.description && (
                          <p className="text-sm text-slate-600 mb-3 italic">"{report.description}"</p>
                        )}
                        <div className="bg-slate-50 rounded-lg p-3 border border-slate-200">
                          <div className="flex items-center gap-2 mb-1">
                            <img
                              src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${report.post?.author?.name || 'User'}`}
                              className="w-5 h-5 rounded-full"
                              alt=""
                            />
                            <span className="text-xs font-medium text-slate-700">
                              {report.post?.author?.name || 'Unknown'}
                            </span>
                          </div>
                          <h5 className="font-semibold text-sm text-slate-900">{report.post?.title}</h5>
                          <p className="text-xs text-slate-500 line-clamp-2">{report.post?.content}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <button
                          onClick={() => handleReviewReport(report.id, 'dismiss')}
                          className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 text-slate-600 text-sm font-medium rounded-lg hover:bg-slate-200 transition"
                        >
                          <X className="w-4 h-4" />
                          Dismiss
                        </button>
                        <button
                          onClick={() => setDeleteConfirmId(report.post?.id)}
                          className="flex items-center gap-1.5 px-3 py-1.5 bg-red-50 text-red-600 text-sm font-medium rounded-lg hover:bg-red-100 transition border border-red-200"
                        >
                          <Trash2 className="w-4 h-4" />
                          Delete Post
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {deleteConfirmId && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full shadow-2xl overflow-hidden">
            <div className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center">
                  <AlertTriangle className="w-6 h-6 text-red-600" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900">Delete Post</h3>
                  <p className="text-sm text-slate-500">This action cannot be undone</p>
                </div>
              </div>
              <p className="text-sm text-slate-600 mb-6">
                Are you sure you want to delete this post? All comments and reports will also be removed.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setDeleteConfirmId(null)}
                  className="flex-1 px-4 py-2.5 bg-slate-100 text-slate-700 font-medium rounded-xl hover:bg-slate-200 transition"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleDeletePost(deleteConfirmId)}
                  className="flex-1 px-4 py-2.5 bg-red-600 text-white font-medium rounded-xl hover:bg-red-700 transition flex items-center justify-center gap-2"
                >
                  <Trash2 className="w-4 h-4" />
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Moderation;