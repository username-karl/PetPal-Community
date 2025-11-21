import React, { useState } from 'react';
import { Search, Filter, Camera, Send, Trash2, Heart, MessageSquare, X, Sparkles, User as UserIcon } from 'lucide-react';

const Community = ({ user, posts, onCreatePost, onDeletePost, onDeleteComment, onToggleRole }) => {
  const [newPostTitle, setNewPostTitle] = useState('');
  const [newPostContent, setNewPostContent] = useState('');
  const [newPostCategory, setNewPostCategory] = useState('Advice');
  const [isPosting, setIsPosting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsPosting(true);
    await onCreatePost({
        title: newPostTitle,
        content: newPostContent,
        category: newPostCategory
    });
    setNewPostTitle('');
    setNewPostContent('');
    setIsPosting(false);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 h-full">
      <div className="lg:col-span-2 space-y-8">
        <div className="flex items-center justify-between">
          <h2 className="text-3xl font-bold text-slate-900">Community Feed</h2>
          <div className="flex gap-2">
            <button className="p-3 text-slate-500 hover:text-brand-600 bg-white border border-slate-200 rounded-xl shadow-sm transition">
              <Search className="w-5 h-5" />
            </button>
            <button className="p-3 text-slate-500 hover:text-brand-600 bg-white border border-slate-200 rounded-xl shadow-sm transition">
              <Filter className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Create Post Box */}
        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-soft">
          <div className="flex items-center gap-3 mb-4">
             <div className="w-10 h-10 bg-brand-100 rounded-full flex items-center justify-center text-brand-700 font-bold">
                {user.name.charAt(0)}
             </div>
             <h3 className="font-bold text-slate-800">Start a discussion</h3>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="text"
              placeholder="Title your post..."
              value={newPostTitle}
              onChange={(e) => setNewPostTitle(e.target.value)}
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-brand-500 focus:outline-none font-bold text-slate-800 placeholder-slate-400 transition-all"
              required
            />
            <textarea 
              placeholder="Share your tips, questions, or stories..."
              value={newPostContent}
              onChange={(e) => setNewPostContent(e.target.value)}
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-brand-500 focus:outline-none min-h-[120px] resize-none text-slate-700 placeholder-slate-400 transition-all"
              required
            />
            <div className="flex justify-between items-center pt-2">
              <div className="flex gap-2">
                <button type="button" className="p-2 hover:bg-slate-100 rounded-lg text-slate-400 transition">
                  <Camera className="w-5 h-5" />
                </button>
                <select 
                  value={newPostCategory}
                  onChange={(e) => setNewPostCategory(e.target.value)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 rounded-lg text-sm font-bold text-slate-700 focus:outline-none cursor-pointer transition"
                >
                  <option value="Advice">Advice</option>
                  <option value="Story">Story</option>
                  <option value="Lost & Found">Lost & Found</option>
                  <option value="Adoption">Adoption</option>
                </select>
              </div>
              <button 
                type="submit" 
                disabled={isPosting}
                className="bg-brand-600 text-white px-8 py-2.5 rounded-xl font-bold hover:bg-brand-700 transition disabled:opacity-50 shadow-lg shadow-brand-500/20 flex items-center gap-2"
              >
                {isPosting ? 'Publishing...' : 'Post'}
                {!isPosting && <Send className="w-4 h-4" />}
              </button>
            </div>
          </form>
        </div>

        {/* Post Feed */}
        <div className="space-y-6">
          {posts.map(post => (
            <div key={post.id} className="bg-white p-8 rounded-3xl border border-slate-100 shadow-soft hover:shadow-lg transition duration-300">
              <div className="flex justify-between items-start mb-4">
                 <div className="flex items-center gap-4">
                   <div className="w-12 h-12 bg-gradient-to-br from-slate-100 to-slate-200 rounded-full flex items-center justify-center text-slate-600 font-bold text-lg shadow-inner border border-white">
                     {post.author.charAt(0)}
                   </div>
                   <div>
                     <p className="font-bold text-slate-900 text-base">{post.author}</p>
                     <p className="text-xs text-slate-500 font-medium mt-0.5">{new Date(post.timestamp).toLocaleDateString()} • <span className="text-brand-600">{post.category}</span></p>
                   </div>
                 </div>
                 {user.role === 'Moderator' && (
                   <button 
                    onClick={() => onDeletePost(post.id)}
                    className="text-slate-300 hover:text-rose-600 hover:bg-rose-50 p-2 rounded-lg transition" 
                    title="Moderator Delete"
                   >
                     <Trash2 className="w-5 h-5" />
                   </button>
                 )}
              </div>
              
              <h3 className="text-xl font-bold text-slate-900 mb-3">{post.title}</h3>
              <p className="text-slate-600 leading-relaxed mb-6 text-base">{post.content}</p>
              
              <div className="flex items-center gap-6 pt-6 border-t border-slate-50 text-slate-500">
                <button className="flex items-center gap-2 hover:text-rose-500 transition group">
                  <div className="p-2 bg-slate-50 rounded-full group-hover:bg-rose-50 transition">
                    <Heart className="w-5 h-5 group-hover:fill-rose-500 group-hover:text-rose-500" />
                  </div>
                  <span className="text-sm font-bold">{post.likes}</span>
                </button>
                <button className="flex items-center gap-2 hover:text-brand-600 transition group">
                  <div className="p-2 bg-slate-50 rounded-full group-hover:bg-brand-50 transition">
                    <MessageSquare className="w-5 h-5" />
                  </div>
                  <span className="text-sm font-bold">{post.comments.length} Comments</span>
                </button>
              </div>

              {/* Comments Section */}
              {post.comments.length > 0 && (
                <div className="mt-6 bg-slate-50/80 rounded-2xl p-6 space-y-4 border border-slate-100">
                  {post.comments.map(comment => (
                    <div key={comment.id} className="flex justify-between items-start group">
                      <div className="flex gap-3">
                        <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center text-xs font-bold text-slate-500 border border-slate-200">
                           {comment.author.charAt(0)}
                        </div>
                        <div className="bg-white p-3 rounded-r-xl rounded-bl-xl shadow-sm border border-slate-100">
                          <span className="font-bold text-xs text-slate-900 block mb-1">{comment.author}</span>
                          <p className="text-sm text-slate-600">{comment.text}</p>
                        </div>
                      </div>
                      {user.role === 'Moderator' && (
                        <button 
                          onClick={() => onDeleteComment(post.id, comment.id)} 
                          className="text-slate-300 hover:text-rose-600 opacity-0 group-hover:opacity-100 transition"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-8">
        {/* Trending Topics Widget */}
        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-soft sticky top-8">
          <h3 className="font-bold text-slate-800 mb-6 text-lg flex items-center gap-2">
             <Sparkles className="w-4 h-4 text-brand-500 fill-brand-500" />
             Trending Topics
          </h3>
          <ul className="space-y-4">
            {['Summer Safety Tips', 'Dog Training 101', 'Best Cat Toys', 'Senior Pet Diet', 'Local Vet Reviews'].map((topic, i) => (
              <li key={i} className="flex items-center gap-4 text-slate-600 hover:text-brand-600 cursor-pointer group transition">
                <span className="w-8 h-8 rounded-lg bg-slate-50 text-slate-500 group-hover:bg-brand-500 group-hover:text-white flex items-center justify-center text-sm font-bold transition duration-300">#{i + 1}</span>
                <span className="font-medium">{topic}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Mod Toggle */}
        <div className="bg-slate-900 text-slate-400 p-6 rounded-3xl text-sm border border-slate-800">
           <p className="mb-3 font-bold text-white flex items-center gap-2">
             <UserIcon className="w-4 h-4" /> Role Switcher
           </p>
           <p className="mb-4 leading-relaxed">Toggle between a regular User and a Moderator to see different controls.</p>
           <button 
             onClick={onToggleRole}
             className="w-full py-3 bg-slate-800 hover:bg-slate-700 rounded-xl text-white font-bold transition border border-slate-700"
           >
             Switch to {user.role === 'Owner' ? 'Moderator' : 'Owner'}
           </button>
        </div>
      </div>
    </div>
  );
};

export default Community;