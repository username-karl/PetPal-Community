import React, { useState, useMemo } from 'react';
import {
  Search,
  Image,
  Paperclip,
  MoreHorizontal,
  Heart,
  MessageCircle,
  X,
  Edit3,
  Check,
  Trash2,
  Clock,
  User,
  Flame,
  Sparkles,
  TrendingUp,
  Eye,
  ChevronDown,
  MessageSquare,
  AlertTriangle
} from 'lucide-react';
import { useData } from '../context/DataContext';
import PostDetailModal from '../components/PostDetailModal';

const CATEGORIES = ['General', 'Advice', 'Question', 'Adoption', 'Health', 'Tips'];

const SORT_OPTIONS = [
  { id: 'newest', label: 'New', icon: Clock },
  { id: 'popular', label: 'Top', icon: TrendingUp },
  { id: 'hot', label: 'Hot', icon: Flame },
  { id: 'views', label: 'Views', icon: Eye },
];

const TABS = [
  { id: 'all', label: 'All Posts', icon: Flame },
  { id: 'my-posts', label: 'My Posts', icon: User },
  { id: 'pending', label: 'Pending', icon: Clock },
];

const Community = ({ user, onToggleRole }) => {
  const { posts, createPost, deletePost, updatePost, deleteComment, likePost, addComment, refreshPosts } = useData();
  const [newPostContent, setNewPostContent] = useState('');
  const [newPostTitle, setNewPostTitle] = useState('');
  const [newPostCategory, setNewPostCategory] = useState('General');
  const [isLoading, setIsLoading] = useState(false);
  const [editingPostId, setEditingPostId] = useState(null);
  const [editTitle, setEditTitle] = useState('');
  const [editContent, setEditContent] = useState('');

  // Filter and sort state
  const [activeTab, setActiveTab] = useState('all');
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [sortBy, setSortBy] = useState('newest');

  // Modal state
  const [selectedPost, setSelectedPost] = useState(null);

  // Delete confirmation state
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);

  // Filter and sort posts
  const filteredPosts = useMemo(() => {
    let filtered = [...posts];

    // Filter by tab
    switch (activeTab) {
      case 'my-posts':
        filtered = filtered.filter(post => post.author?.id === user?.id);
        break;
      case 'pending':
        filtered = filtered.filter(post => post.status === 'PENDING' && post.author?.id === user?.id);
        break;
      default:
        break;
    }

    // Filter by category
    if (selectedCategory) {
      filtered = filtered.filter(post => post.category === selectedCategory);
    }

    // Sort posts
    switch (sortBy) {
      case 'popular':
        filtered.sort((a, b) => (b.likes || 0) - (a.likes || 0));
        break;
      case 'hot':
        filtered.sort((a, b) => (b.comments?.length || 0) - (a.comments?.length || 0));
        break;
      case 'views':
        filtered.sort((a, b) => (b.views || 0) - (a.views || 0));
        break;
      case 'newest':
      default:
        filtered.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
        break;
    }

    return filtered;
  }, [posts, activeTab, selectedCategory, sortBy, user?.id]);

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

  const handleSubmit = async () => {
    if (!newPostContent.trim() || !newPostTitle.trim()) return;

    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 600));

    await createPost({
      title: newPostTitle,
      content: newPostContent,
      category: newPostCategory
    });
    setNewPostContent('');
    setNewPostTitle('');
    setNewPostCategory('General');
    setIsLoading(false);
  };

  const handleStartEdit = (post, e) => {
    e.stopPropagation();
    setEditingPostId(post.id);
    setEditTitle(post.title || '');
    setEditContent(post.content || '');
  };

  const handleCancelEdit = () => {
    setEditingPostId(null);
    setEditTitle('');
    setEditContent('');
  };

  const handleSaveEdit = async (postId) => {
    if (!editTitle.trim() || !editContent.trim()) return;
    try {
      await updatePost(postId, { title: editTitle, content: editContent });
      setEditingPostId(null);
      setEditTitle('');
      setEditContent('');
    } catch (err) {
      console.error('Failed to update post:', err);
    }
  };

  const handlePostClick = (post) => {
    if (editingPostId !== post.id) {
      setSelectedPost(post);
    }
  };

  const handleUpdatePost = (updatedPost) => {
    // Update the post in the selected state
    setSelectedPost(updatedPost);
    // Refresh posts to update view count
    if (refreshPosts) refreshPosts();
  };

  const isAuthor = (post) => post.author?.id === user?.id;

  const formatTimeAgo = (timestamp) => {
    const now = new Date();
    const date = new Date(timestamp);
    const diff = Math.floor((now - date) / 1000);

    if (diff < 60) return 'just now';
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    if (diff < 604800) return `${Math.floor(diff / 86400)}d ago`;
    return date.toLocaleDateString();
  };

  return (
    <div className="fade-in">
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Main Feed */}
        <div className="flex-1 space-y-4">
          {/* Create Post Box */}
          <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
            <div className="flex gap-3">
              <img
                src={user?.avatarUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.name || 'User'}`}
                className="w-10 h-10 rounded-full bg-slate-100"
                alt="Me"
              />
              <div className="flex-1 space-y-2">
                <input
                  type="text"
                  value={newPostTitle}
                  onChange={(e) => setNewPostTitle(e.target.value)}
                  placeholder="Post title"
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-200 font-semibold"
                />
                <textarea
                  value={newPostContent}
                  onChange={(e) => setNewPostContent(e.target.value)}
                  placeholder="Share a tip or ask a question..."
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-200 resize-none"
                  rows={2}
                />
                <div className="flex justify-between items-center">
                  <div className="flex gap-2 items-center">
                    <button className="text-slate-400 hover:text-slate-600 p-1.5 rounded-md transition">
                      <Image className="w-4 h-4" />
                    </button>
                    <select
                      value={newPostCategory}
                      onChange={(e) => setNewPostCategory(e.target.value)}
                      className={`text-xs font-medium px-2.5 py-1 rounded-full border cursor-pointer ${getCategoryColor(newPostCategory)}`}
                    >
                      {CATEGORIES.map(cat => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                  </div>
                  <button
                    onClick={handleSubmit}
                    disabled={isLoading || !newPostContent.trim() || !newPostTitle.trim()}
                    className="bg-slate-900 text-white text-xs font-semibold px-4 py-2 rounded-lg hover:bg-slate-800 transition disabled:opacity-50"
                  >
                    {isLoading ? 'Posting...' : 'Post'}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Sort & Filter Bar */}
          <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
            {/* Tabs */}
            <div className="flex border-b border-slate-100">
              {TABS.map(tab => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 text-sm font-medium transition ${activeTab === tab.id
                      ? 'text-slate-900 border-b-2 border-slate-900 bg-slate-50'
                      : 'text-slate-500 hover:text-slate-700 hover:bg-slate-50'
                      }`}
                  >
                    <Icon className="w-4 h-4" />
                    {tab.label}
                  </button>
                );
              })}
            </div>

            {/* Sort Options */}
            <div className="p-3 flex items-center gap-3 bg-slate-50/50">
              <span className="text-xs font-medium text-slate-500">Sort by:</span>
              <div className="flex gap-1">
                {SORT_OPTIONS.map(opt => {
                  const Icon = opt.icon;
                  return (
                    <button
                      key={opt.id}
                      onClick={() => setSortBy(opt.id)}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition ${sortBy === opt.id
                        ? 'bg-slate-900 text-white'
                        : 'bg-white text-slate-600 border border-slate-200 hover:border-slate-300'
                        }`}
                    >
                      <Icon className="w-3.5 h-3.5" />
                      {opt.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Category Pills */}
            <div className="px-3 pb-3 flex flex-wrap gap-2">
              <button
                onClick={() => setSelectedCategory(null)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium transition ${selectedCategory === null
                  ? 'bg-slate-900 text-white'
                  : 'bg-white text-slate-600 border border-slate-200 hover:border-slate-300'
                  }`}
              >
                All
              </button>
              {CATEGORIES.map(cat => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium transition border ${selectedCategory === cat
                    ? getCategoryColor(cat) + ' ring-2 ring-offset-1 ring-slate-300'
                    : getCategoryColor(cat) + ' hover:opacity-80'
                    }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Posts List */}
          {filteredPosts.length === 0 ? (
            <div className="bg-white border border-slate-200 rounded-xl p-12 text-center">
              <Sparkles className="w-12 h-12 text-slate-300 mx-auto mb-4" />
              <h4 className="text-lg font-semibold text-slate-400 mb-2">No Posts Found</h4>
              <p className="text-sm text-slate-400">
                {activeTab === 'pending'
                  ? "You don't have any pending posts."
                  : activeTab === 'my-posts'
                    ? "You haven't created any posts yet."
                    : "No posts match your filters."
                }
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredPosts.map(post => (
                <div
                  key={post.id}
                  onClick={() => handlePostClick(post)}
                  className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md hover:border-slate-300 transition cursor-pointer"
                >
                  <div className="flex">
                    {/* Like Column */}
                    <div className="flex flex-col items-center justify-center py-3 px-3 bg-slate-50 border-r border-slate-100">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          likePost(post.id);
                        }}
                        className="p-1.5 hover:bg-red-50 rounded-lg transition group"
                      >
                        <Heart className={`w-5 h-5 ${post.likes > 0 ? 'fill-red-500 text-red-500' : 'text-slate-400 group-hover:text-red-500'}`} />
                      </button>
                      <span className={`text-sm font-bold mt-0.5 ${post.likes > 0 ? 'text-red-500' : 'text-slate-500'}`}>
                        {post.likes || 0}
                      </span>
                    </div>

                    {/* Content */}
                    <div className="flex-1 p-4">
                      {/* Header */}
                      <div className="flex items-center gap-2 mb-2 text-xs text-slate-500">
                        <img
                          src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${post.author?.name || 'User'}`}
                          className="w-5 h-5 rounded-full"
                          alt={post.author?.name}
                        />
                        <span className="font-medium text-slate-700">{post.author?.name || 'Anonymous'}</span>
                        <span>•</span>
                        <span>{formatTimeAgo(post.timestamp)}</span>
                        {post.status === 'PENDING' && isAuthor(post) && (
                          <>
                            <span>•</span>
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-amber-50 text-amber-600 rounded-full border border-amber-200">
                              <Clock className="w-3 h-3" />
                              Pending
                            </span>
                          </>
                        )}
                      </div>

                      {/* Title & Content */}
                      {editingPostId === post.id ? (
                        <div className="space-y-2" onClick={(e) => e.stopPropagation()}>
                          <input
                            type="text"
                            value={editTitle}
                            onChange={(e) => setEditTitle(e.target.value)}
                            className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-base font-semibold focus:outline-none focus:ring-2 focus:ring-blue-200"
                          />
                          <textarea
                            value={editContent}
                            onChange={(e) => setEditContent(e.target.value)}
                            className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-200 resize-none"
                            rows={3}
                          />
                          <div className="flex justify-end gap-2">
                            <button
                              onClick={handleCancelEdit}
                              className="px-3 py-1.5 text-sm text-slate-600 hover:bg-slate-100 rounded-lg"
                            >
                              Cancel
                            </button>
                            <button
                              onClick={() => handleSaveEdit(post.id)}
                              className="px-3 py-1.5 text-sm bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 flex items-center gap-1"
                            >
                              <Check className="w-3.5 h-3.5" /> Save
                            </button>
                          </div>
                        </div>
                      ) : (
                        <>
                          <div className="flex items-start gap-2 mb-1">
                            <span className={`px-2 py-0.5 rounded text-[10px] font-medium ${getCategoryColor(post.category)}`}>
                              {post.category || 'General'}
                            </span>
                            <h3 className="text-base font-semibold text-slate-900 flex-1 hover:text-blue-600 transition">
                              {post.title}
                            </h3>
                          </div>
                          <p className="text-sm text-slate-600 line-clamp-2 mb-3">
                            {post.content}
                          </p>
                        </>
                      )}

                      {/* Footer Stats */}
                      {editingPostId !== post.id && (
                        <div className="flex items-center gap-4 text-xs text-slate-500">
                          <span className="flex items-center gap-1">
                            <MessageCircle className="w-4 h-4" />
                            {post.comments?.length || 0} comments
                          </span>
                          <span className="flex items-center gap-1">
                            <Eye className="w-4 h-4" />
                            {post.views || 0} views
                          </span>
                          {isAuthor(post) && (
                            <button
                              onClick={(e) => handleStartEdit(post, e)}
                              className="flex items-center gap-1 hover:text-blue-500 transition"
                            >
                              <Edit3 className="w-3.5 h-3.5" />
                              Edit
                            </button>
                          )}
                          {(isAuthor(post) || user.role === 'Admin') && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setDeleteConfirmId(post.id);
                              }}
                              className="flex items-center gap-1 hover:text-red-500 transition"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                              Delete
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right Sidebar */}
        <div className="w-full lg:w-80 space-y-4">
          {/* Community Info */}
          <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
            <div className="bg-gradient-to-r from-slate-900 to-slate-800 p-4">
              <h3 className="font-bold text-white">PetPal Community</h3>
              <p className="text-xs text-slate-300 mt-1">Share tips, ask questions, connect with pet lovers</p>
            </div>
            <div className="p-4">
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <p className="text-lg font-bold text-slate-900">{posts.length}</p>
                  <p className="text-xs text-slate-500">Posts</p>
                </div>
                <div>
                  <p className="text-lg font-bold text-slate-900">
                    {posts.reduce((sum, p) => sum + (p.comments?.length || 0), 0)}
                  </p>
                  <p className="text-xs text-slate-500">Comments</p>
                </div>
                <div>
                  <p className="text-lg font-bold text-slate-900">
                    {posts.reduce((sum, p) => sum + (p.likes || 0), 0)}
                  </p>
                  <p className="text-xs text-slate-500">Likes</p>
                </div>
              </div>
            </div>
          </div>

          {/* Trending Topics */}
          <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
            <h3 className="text-sm font-semibold text-slate-900 mb-3 flex items-center gap-2">
              <TrendingUp className="w-4 h-4" />
              Trending Topics
            </h3>
            <div className="flex flex-wrap gap-2">
              {['PuppyTraining', 'VetAdvice', 'DogFood', 'GoldenRetriever', 'CatBehavior', 'AdoptionStories'].map((tag) => (
                <span
                  key={tag}
                  className="px-2.5 py-1 bg-slate-50 border border-slate-200 rounded-full text-xs font-medium text-slate-600 hover:border-slate-300 hover:bg-slate-100 cursor-pointer transition"
                >
                  #{tag}
                </span>
              ))}
            </div>
          </div>

          {/* Community Rules */}
          <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
            <h3 className="text-sm font-semibold text-slate-900 mb-3">Community Rules</h3>
            <ol className="text-xs text-slate-600 space-y-2">
              <li className="flex gap-2">
                <span className="font-bold text-slate-400">1.</span>
                Be respectful to all members
              </li>
              <li className="flex gap-2">
                <span className="font-bold text-slate-400">2.</span>
                No spam or self-promotion
              </li>
              <li className="flex gap-2">
                <span className="font-bold text-slate-400">3.</span>
                Use appropriate categories
              </li>
              <li className="flex gap-2">
                <span className="font-bold text-slate-400">4.</span>
                Report inappropriate content
              </li>
            </ol>
          </div>
        </div>
      </div>

      {/* Post Detail Modal */}
      {selectedPost && (
        <PostDetailModal
          post={selectedPost}
          user={user}
          onClose={() => setSelectedPost(null)}
          onLike={likePost}
          onComment={addComment}
          onUpdate={handleUpdatePost}
        />
      )}

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
                Are you sure you want to delete this post? All comments and likes will also be removed.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setDeleteConfirmId(null)}
                  className="flex-1 px-4 py-2.5 bg-slate-100 text-slate-700 font-medium rounded-xl hover:bg-slate-200 transition"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    deletePost(deleteConfirmId);
                    setDeleteConfirmId(null);
                  }}
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

export default Community;