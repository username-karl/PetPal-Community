import React, { useState, useMemo } from 'react';
import { Search, Image, Paperclip, MoreHorizontal, Heart, MessageCircle, X, Edit3, Check, Trash2, Clock, User, Flame, Sparkles } from 'lucide-react';
import { useData } from '../context/DataContext';

const CATEGORIES = ['General', 'Advice', 'Question', 'Adoption', 'Health', 'Tips'];
const TABS = [
  { id: 'all', label: 'All Posts', icon: Flame },
  { id: 'my-posts', label: 'My Posts', icon: User },
  { id: 'pending', label: 'Pending', icon: Clock },
];

const Community = ({ user, onToggleRole }) => {
  const { posts, createPost, deletePost, updatePost, deleteComment, likePost, addComment } = useData();
  const [newPostContent, setNewPostContent] = useState('');
  const [newPostTitle, setNewPostTitle] = useState('');
  const [newPostCategory, setNewPostCategory] = useState('General');
  const [isLoading, setIsLoading] = useState(false);
  const [editingPostId, setEditingPostId] = useState(null);
  const [editTitle, setEditTitle] = useState('');
  const [editContent, setEditContent] = useState('');

  // Reddit-style filter state
  const [activeTab, setActiveTab] = useState('all');
  const [selectedCategory, setSelectedCategory] = useState(null); // null means all categories

  // Filter posts based on active tab and selected category
  const filteredPosts = useMemo(() => {
    let filtered = posts;

    // Filter by tab
    switch (activeTab) {
      case 'my-posts':
        filtered = filtered.filter(post => post.author?.id === user?.id);
        break;
      case 'pending':
        filtered = filtered.filter(post => post.status === 'PENDING' && post.author?.id === user?.id);
        break;
      default:
        // 'all' - show all posts
        break;
    }

    // Filter by category
    if (selectedCategory) {
      filtered = filtered.filter(post => post.category === selectedCategory);
    }

    return filtered;
  }, [posts, activeTab, selectedCategory, user?.id]);

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
    // Simulate slight delay for better UX
    await new Promise(resolve => setTimeout(resolve, 600));

    await createPost({
      title: newPostTitle,
      content: newPostContent,
      category: newPostCategory
      // author field removed to prevent backend deserialization error (User object expected)
    });
    setNewPostContent('');
    setNewPostTitle('');
    setNewPostCategory('General');
    setIsLoading(false);
  };


  const handleStartEdit = (post) => {
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

  const isAuthor = (post) => {
    return post.author?.id === user?.id;
  };

  return (
    <div className="fade-in">
      <div className="flex flex-col md:flex-row gap-8">
        {/* Main Feed */}
        <div className="flex-1 space-y-6">
          {/* Create Post Box */}
          <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
            <div className="flex gap-4">
              <img
                src={user?.avatarUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.name || 'User'}`}
                className="w-10 h-10 rounded-full bg-slate-100 ring-1 ring-slate-100"
                alt="Me"
              />
              <div className="flex-1 space-y-3">
                <input
                  type="text"
                  value={newPostTitle}
                  onChange={(e) => setNewPostTitle(e.target.value)}
                  placeholder="Post Title..."
                  className="w-full bg-slate-50 border-0 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-slate-200 focus:bg-white transition-all placeholder:text-slate-400 font-semibold"
                />
                <input
                  type="text"
                  value={newPostContent}
                  onChange={(e) => setNewPostContent(e.target.value)}
                  placeholder="Share a tip or ask a question..."
                  className="w-full bg-slate-50 border-0 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-slate-200 focus:bg-white transition-all placeholder:text-slate-400"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSubmit();
                    }
                  }}
                />
                <div className="flex justify-between items-center mt-3">
                  <div className="flex gap-2 items-center">
                    <button className="text-slate-400 hover:text-slate-600 hover:bg-slate-100 p-1.5 rounded-md transition-colors">
                      <Image className="w-4 h-4" />
                    </button>
                    <button className="text-slate-400 hover:text-slate-600 hover:bg-slate-100 p-1.5 rounded-md transition-colors">
                      <Paperclip className="w-4 h-4" />
                    </button>
                    <select
                      value={newPostCategory}
                      onChange={(e) => setNewPostCategory(e.target.value)}
                      className={`text-xs font-medium px-2.5 py-1 rounded-full border cursor-pointer transition-colors ${getCategoryColor(newPostCategory)}`}
                    >
                      {CATEGORIES.map(cat => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                  </div>
                  <button
                    onClick={handleSubmit}
                    disabled={isLoading || !newPostContent.trim() || !newPostTitle.trim()}
                    className="bg-slate-900 text-white text-xs font-semibold px-4 py-1.5 rounded-md hover:bg-slate-800 transition-colors disabled:opacity-50"
                  >
                    {isLoading ? 'Posting...' : 'Post'}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Reddit-style Tabs */}
          <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
            <div className="flex border-b border-slate-100">
              {TABS.map(tab => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 text-sm font-medium transition-all ${isActive
                      ? 'bg-slate-50 text-slate-900 border-b-2 border-slate-900'
                      : 'text-slate-500 hover:text-slate-700 hover:bg-slate-50'
                      }`}
                  >
                    <Icon className="w-4 h-4" />
                    {tab.label}
                  </button>
                );
              })}
            </div>

            {/* Category Filter Chips */}
            <div className="p-3 flex flex-wrap gap-2 bg-slate-50/50">
              <button
                onClick={() => setSelectedCategory(null)}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${selectedCategory === null
                  ? 'bg-slate-900 text-white shadow-sm'
                  : 'bg-white text-slate-600 border border-slate-200 hover:border-slate-300'
                  }`}
              >
                All
              </button>
              {CATEGORIES.map(cat => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all border ${selectedCategory === cat
                    ? getCategoryColor(cat).replace('bg-', 'bg-').replace('50', '100') + ' ring-2 ring-offset-1'
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
                  ? "You don't have any pending posts awaiting approval."
                  : activeTab === 'my-posts'
                    ? "You haven't created any posts yet. Share something with the community!"
                    : "No posts match your current filters."
                }
              </p>
            </div>
          ) : (
            filteredPosts.map(post => (
              <div key={post.id} className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <img
                      src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${post.author?.name || post.author || 'User'}`}
                      className="w-10 h-10 rounded-full bg-slate-100"
                      alt={post.author?.name || post.author}
                    />
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="text-sm font-semibold text-slate-900">{post.author?.name || post.author}</h4>
                        {post.status === 'PENDING' && isAuthor(post) && (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-amber-50 text-amber-600 text-xs font-medium rounded-full border border-amber-200">
                            <Clock className="w-3 h-3" />
                            Pending
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-500 flex items-center gap-1">
                        {new Date(post.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} •
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border ${getCategoryColor(post.category)}`}>
                          {post.category || 'General'}
                        </span>
                      </p>
                    </div>
                  </div>

                  {/* Action buttons */}
                  <div className="flex items-center gap-1">
                    {isAuthor(post) && editingPostId !== post.id && (
                      <button
                        onClick={() => handleStartEdit(post)}
                        className="text-slate-400 hover:text-blue-500 transition-colors p-1.5 hover:bg-blue-50 rounded-lg"
                        title="Edit post"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                    )}
                    {(isAuthor(post) || user.role === 'Moderator' || user.role === 'Admin') && (
                      <button
                        onClick={() => deletePost(post.id)}
                        className="text-slate-400 hover:text-red-500 transition-colors p-1.5 hover:bg-red-50 rounded-lg"
                        title="Delete post"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                    {!isAuthor(post) && user.role !== 'Moderator' && (
                      <button className="text-slate-400 hover:text-slate-600 p-1">
                        <MoreHorizontal className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>

                {/* Post content - editable or static */}
                {editingPostId === post.id ? (
                  <div className="space-y-3 mb-4">
                    <input
                      type="text"
                      value={editTitle}
                      onChange={(e) => setEditTitle(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-base font-semibold focus:ring-2 focus:ring-blue-200 focus:border-blue-300 outline-none"
                    />
                    <textarea
                      value={editContent}
                      onChange={(e) => setEditContent(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-200 focus:border-blue-300 outline-none resize-none"
                      rows={3}
                    />
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={handleCancelEdit}
                        className="px-3 py-1.5 text-sm text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={() => handleSaveEdit(post.id)}
                        disabled={!editTitle.trim() || !editContent.trim()}
                        className="px-3 py-1.5 text-sm bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center gap-1"
                      >
                        <Check className="w-3.5 h-3.5" /> Save
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    {post.title && <h3 className="text-base font-semibold text-slate-900 mb-2">{post.title}</h3>}
                    <p className="text-sm text-slate-600 leading-relaxed mb-4">
                      {post.content}
                    </p>
                  </>
                )}

                <div className="flex items-center gap-4 border-t border-slate-100 pt-3">
                  <button
                    onClick={() => likePost(post.id)}
                    className="flex items-center gap-1.5 text-xs font-medium text-slate-500 hover:text-red-500 transition-colors group"
                  >
                    <Heart className={`w-4 h-4 ${post.likes > 0 ? 'fill-red-500 text-red-500' : 'group-hover:fill-red-500'}`} />
                    {post.likes || 0}
                  </button>
                  <button className="flex items-center gap-1.5 text-xs font-medium text-slate-500 hover:text-blue-500 transition-colors">
                    <MessageCircle className="w-4 h-4" /> {post.comments?.length || 0} Comments
                  </button>
                </div>

                {/* Comments Section */}
                <div className="mt-4 pt-3 border-t border-slate-50 space-y-3">
                  {post.comments && post.comments.length > 0 && (
                    <div className="space-y-3">
                      {post.comments.map((comment, idx) => (
                        <div key={idx} className="flex gap-2 text-sm bg-slate-50 p-2 rounded-lg">
                          <span className="font-bold text-slate-800 text-xs whitespace-nowrap">{comment.author?.name || 'User'}</span>
                          <span className="text-slate-600 text-xs">{comment.text}</span>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Add Comment Input */}
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Write a comment..."
                      className="flex-1 bg-slate-50 border-0 rounded-lg px-3 py-2 text-xs focus:ring-1 focus:ring-slate-200 transition-all placeholder:text-slate-400"
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          addComment(post.id, e.target.value);
                          e.target.value = '';
                        }
                      }}
                    />
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Right Sidebar */}
        <div className="w-full md:w-80 space-y-6">
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 sticky top-24">
            <h3 className="text-sm font-semibold text-slate-900 mb-4">Trending Topics</h3>
            <div className="flex flex-wrap gap-2">
              {[
                'PuppyTraining',
                'VetAdvice',
                'DogFood',
                'GoldenRetriever',
                'CatBehavior',
                'AdoptionStories'
              ].map((tag) => (
                <span
                  key={tag}
                  className="px-2.5 py-1 bg-white border border-slate-200 rounded-full text-xs font-medium text-slate-600 hover:border-slate-300 hover:text-slate-900 cursor-pointer transition-colors"
                >
                  #{tag}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Community;