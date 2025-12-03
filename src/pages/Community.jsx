import React, { useState } from 'react';
import { Search, Filter, Camera, Send, Trash2, Heart, MessageSquare, X, Sparkles, User as UserIcon } from 'lucide-react';
import { useData } from '../context/DataContext';
import { Button } from '../components/ui/stateful-button';

const Community = ({ user, onToggleRole }) => {
  const { posts, createPost, deletePost, deleteComment } = useData();
  const [newPostTitle, setNewPostTitle] = useState('');
  const [newPostContent, setNewPostContent] = useState('');
  const [newPostCategory, setNewPostCategory] = useState('Advice');

  const handleSubmit = async (e) => {
    e.preventDefault();
    await createPost({
      title: newPostTitle,
      content: newPostContent,
      category: newPostCategory,
      author: user.name
    });
    setNewPostTitle('');
    setNewPostContent('');
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 h-full">
      <div className="lg:col-span-2 space-y-8">
        <div className="flex items-center justify-between">
          <h2 className="text-3xl font-bold text-slate-900">Community Feed</h2>
          <div className="flex gap-2">
            <button className="p-3 text-slate-500 hover:text-primary-600 bg-white border border-slate-200 rounded-xl shadow-soft hover:shadow-primary/20 transition">
              <Search className="w-5 h-5" />
            </button>
            <button className="p-3 text-slate-500 hover:text-primary-600 bg-white border border-slate-200 rounded-xl shadow-soft hover:shadow-primary/20 transition">
              <Filter className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Create Post Box */}
        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-soft">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-gradient-to-br from-primary-100 to-primary-200 rounded-full flex items-center justify-center text-primary-700 font-bold">
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
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-primary-500 focus:outline-none font-bold text-slate-800 placeholder-slate-400 transition-all"
              required
            />
            <textarea
              placeholder="Share your tips, questions, or stories..."
              value={newPostContent}
              onChange={(e) => setNewPostContent(e.target.value)}
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-primary-500 focus:outline-none min-h-[120px] resize-none text-slate-700 placeholder-slate-400 transition-all"
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
              <Button type="submit" onClick={handleSubmit}>
                Post
                <Send className="w-4 h-4" />
              </Button>
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
                    <p className="text-xs text-slate-500 font-medium mt-0.5">{new Date(post.timestamp).toLocaleDateString()} • <span className="text-primary">{post.category}</span></p>
                  </div>
                </div>
                {user.role === 'Moderator' && (
                  <button
                    onClick={() => deletePost(post.id)}
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
                <button className="flex items-center gap-2 hover:text-primary transition group">
                  <div className="p-2 bg-slate-50 rounded-full group-hover:bg-indigo-50 transition">
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
                          onClick={() => deleteComment(post.id, comment.id)}
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
            <Sparkles className="w-4 h-4 text-primary fill-primary" />
            Trending Topics
          </h3>
          <ul className="space-y-4">
            {['Summer Safety Tips', 'Dog Training 101', 'Best Cat Toys', 'Senior Pet Diet', 'Local Vet Reviews'].map((topic, i) => (
              <li key={i} className="flex items-center gap-4 text-slate-600 hover:text-primary cursor-pointer group transition">
                <span className="w-8 h-8 rounded-lg bg-slate-50 text-slate-500 group-hover:bg-gradient-to-br group-hover:from-primary-600 group-hover:to-accent-600 group-hover:text-white flex items-center justify-center text-sm font-bold transition duration-300">#{i + 1}</span>
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