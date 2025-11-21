import React from 'react';
import { ShieldAlert, Trash2 } from 'lucide-react';

const Moderation = ({ posts, onDeletePost }) => {
  return (
    <div className="space-y-8">
      <h2 className="text-3xl font-bold text-slate-900 flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-rose-100 flex items-center justify-center text-rose-600">
           <ShieldAlert className="w-6 h-6" />
        </div>
        Moderation Dashboard
      </h2>
      <div className="bg-white rounded-3xl border border-slate-100 shadow-soft overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-slate-50 border-b border-slate-100">
            <tr>
              <th className="p-6 font-bold text-slate-500 text-xs uppercase tracking-wider">Author</th>
              <th className="p-6 font-bold text-slate-500 text-xs uppercase tracking-wider">Content Preview</th>
              <th className="p-6 font-bold text-slate-500 text-xs uppercase tracking-wider">Status</th>
              <th className="p-6 font-bold text-slate-500 text-xs uppercase tracking-wider text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {posts.map(post => (
              <tr key={post.id} className="border-b border-slate-50 last:border-0 hover:bg-slate-50/80 transition">
                <td className="p-6 text-slate-900 font-bold text-sm">{post.author}</td>
                <td className="p-6 max-w-md">
                  <p className="text-slate-900 font-bold text-sm mb-1">{post.title}</p>
                  <p className="text-slate-500 text-xs truncate">{post.content}</p>
                </td>
                <td className="p-6">
                  <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-600 border border-emerald-100">
                    Active
                  </span>
                </td>
                <td className="p-6 text-right">
                  <button 
                    onClick={() => onDeletePost(post.id)}
                    className="text-slate-400 hover:text-rose-600 hover:bg-rose-50 p-2 rounded-lg transition"
                    title="Delete Post"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Moderation;