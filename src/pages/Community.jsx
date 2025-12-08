import React, { useState } from 'react';
import { Search, Image, Paperclip, MoreHorizontal, Heart, MessageCircle, X } from 'lucide-react';
import { useData } from '../context/DataContext';

const Community = ({ user, onToggleRole }) => {
  const { posts, createPost, deletePost, deleteComment } = useData();
  const [newPostContent, setNewPostContent] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async () => {
    if (!newPostContent.trim()) return;

    setIsLoading(true);
    // Simulate slight delay for better UX
    await new Promise(resolve => setTimeout(resolve, 600));

    await createPost({
      title: 'Update', // Simplified since mockup has no title field
      content: newPostContent,
      category: 'General',
      author: user.name
    });
    setNewPostContent('');
    setIsLoading(false);
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
              <div className="flex-1">
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
                  <div className="flex gap-2 text-slate-400">
                    <button className="hover:text-slate-600 hover:bg-slate-100 p-1.5 rounded-md transition-colors">
                      <Image className="w-4 h-4" />
                    </button>
                    <button className="hover:text-slate-600 hover:bg-slate-100 p-1.5 rounded-md transition-colors">
                      <Paperclip className="w-4 h-4" />
                    </button>
                  </div>
                  <button
                    onClick={handleSubmit}
                    disabled={isLoading || !newPostContent.trim()}
                    className="bg-slate-900 text-white text-xs font-semibold px-4 py-1.5 rounded-md hover:bg-slate-800 transition-colors disabled:opacity-50"
                  >
                    {isLoading ? 'Posting...' : 'Post'}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Posts List */}
          {posts.map(post => (
            <div key={post.id} className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <img
                    src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${post.author}`}
                    className="w-10 h-10 rounded-full bg-slate-100"
                    alt={post.author}
                  />
                  <div>
                    <h4 className="text-sm font-semibold text-slate-900">{post.author}</h4>
                    <p className="text-xs text-slate-500">
                      {new Date(post.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} • <span className="text-blue-600 font-medium">{post.category}</span>
                    </p>
                  </div>
                </div>
                {user.role === 'Moderator' ? (
                  <button
                    onClick={() => deletePost(post.id)}
                    className="text-slate-400 hover:text-red-500 transition-colors p-1"
                  >
                    <X className="w-4 h-4" />
                  </button>
                ) : (
                  <button className="text-slate-400 hover:text-slate-600">
                    <MoreHorizontal className="w-4 h-4" />
                  </button>
                )}
              </div>

              {post.title && <h3 className="text-base font-semibold text-slate-900 mb-2">{post.title}</h3>}

              <p className="text-sm text-slate-600 leading-relaxed mb-4">
                {post.content}
              </p>

              <div className="flex items-center gap-4 border-t border-slate-100 pt-3">
                <button className="flex items-center gap-1.5 text-xs font-medium text-slate-500 hover:text-red-500 transition-colors group">
                  <Heart className="w-4 h-4 group-hover:fill-red-500" /> {post.likes || 24}
                </button>
                <button className="flex items-center gap-1.5 text-xs font-medium text-slate-500 hover:text-blue-500 transition-colors">
                  <MessageCircle className="w-4 h-4" /> {post.comments?.length || 8} Comments
                </button>
              </div>

              {/* Simple Comments Preview */}
              {post.comments && post.comments.length > 0 && (
                <div className="mt-4 pt-3 border-t border-slate-50 space-y-3">
                  {post.comments.slice(0, 2).map((comment, idx) => (
                    <div key={idx} className="flex gap-2 text-sm">
                      <span className="font-bold text-slate-800 text-xs">{comment.author}</span>
                      <span className="text-slate-600 text-xs">{comment.text}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
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

          {/* Mod Toggle - Kept for functionality even if not in visual mockup */}
          <div className="bg-white border border-slate-200 rounded-xl p-5">
            <h3 className="text-sm font-semibold text-slate-900 mb-2">View As</h3>
            <button
              onClick={onToggleRole}
              className="w-full py-2 bg-slate-100 hover:bg-slate-200 rounded-lg text-xs font-medium text-slate-700 transition-colors"
            >
              Switch to {user.role === 'Owner' ? 'Moderator' : 'Owner'} Mode
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Community;