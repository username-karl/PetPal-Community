
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    User,
    Settings,
    LogOut,
    ChevronRight,
    MapPin,
    Mail,
    PawPrint,
    Plus,
    Edit3,
    MessageSquare,
    Heart
} from 'lucide-react';
import { useData } from '../context/DataContext';
import { useAuth } from '../AuthContext';

const Profile = ({ user, onUpdateUser }) => {
    const navigate = useNavigate();
    const { logout } = useAuth();
    const { pets, posts } = useData();

    // Filter posts by current user
    const myPosts = posts.filter(post => post.author?.id === user?.id);

    // Edit Profile State
    const [isEditing, setIsEditing] = useState(false);
    const [editForm, setEditForm] = useState({
        name: user.name,
        location: user.location || '',
        bio: user.bio || ''
    });

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const handleSave = () => {
        onUpdateUser(editForm);
        setIsEditing(false);
    };

    const MenuItem = ({ icon: Icon, label, onClick, subtitle, isDanger }) => (
        <button
            onClick={onClick}
            className={`w-full flex items-center justify-between p-4 bg-white border border-slate-100 first:rounded-t-2xl last:rounded-b-2xl hover:bg-slate-50 transition-all group ${isDanger ? 'text-red-600 hover:bg-red-50 hover:border-red-100' : 'text-slate-900'
                }`}
        >
            <div className="flex items-center gap-4">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${isDanger ? 'bg-red-100 text-red-600' : 'bg-slate-100 text-slate-500 group-hover:bg-white group-hover:shadow-sm group-hover:text-slate-900 transition-all'
                    }`}>
                    <Icon className="w-5 h-5" />
                </div>
                <div className="text-left">
                    <p className="font-semibold text-sm">{label}</p>
                    {subtitle && <p className="text-xs text-slate-500 font-medium">{subtitle}</p>}
                </div>
            </div>
            {!isDanger && <ChevronRight className="w-5 h-5 text-slate-300 group-hover:text-slate-500 transition-colors" />}
        </button>
    );

    return (
        <div className="max-w-xl mx-auto pb-20 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Header / Profile Card */}
            <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden mb-8 relative">
                {/* Cover / Accent */}
                <div className="h-32 bg-slate-900 relative">
                    <div className="absolute inset-0 opacity-20 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-slate-400 via-slate-900 to-black"></div>
                </div>

                <div className="px-6 pb-6">
                    <div className="relative flex justify-between items-end -mt-12 mb-6">
                        <div className="relative">
                            <img
                                src={user.avatarUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.name}`}
                                alt={user.name}
                                className="w-24 h-24 rounded-2xl border-4 border-white shadow-md bg-white object-cover"
                            />
                            <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-emerald-500 border-4 border-white rounded-full"></div>
                        </div>
                        {!isEditing ? (
                            <button
                                onClick={() => setIsEditing(true)}
                                className="mb-2 px-4 py-2 bg-slate-900 text-white text-xs font-bold rounded-xl hover:bg-slate-800 transition shadow-lg shadow-slate-200"
                            >
                                Edit Profile
                            </button>
                        ) : (
                            <div className="flex gap-2 mb-2">
                                <button onClick={() => setIsEditing(false)} className="px-3 py-1.5 text-slate-500 font-bold text-xs hover:bg-slate-100 rounded-lg transition">Cancel</button>
                                <button onClick={handleSave} className="px-3 py-1.5 bg-slate-900 text-white font-bold text-xs rounded-lg hover:bg-slate-800 transition">Save</button>
                            </div>
                        )}
                    </div>

                    {isEditing ? (
                        <div className="space-y-4 animate-in fade-in duration-300">
                            <div>
                                <label className="text-[10px] uppercase font-bold text-slate-400">Display Name</label>
                                <input
                                    value={editForm.name}
                                    onChange={e => setEditForm({ ...editForm, name: e.target.value })}
                                    className="w-full text-lg font-bold text-slate-900 border-b border-slate-200 focus:border-slate-900 outline-none py-1 bg-transparent"
                                />
                            </div>
                            <div>
                                <label className="text-[10px] uppercase font-bold text-slate-400">Location</label>
                                <input
                                    value={editForm.location}
                                    onChange={e => setEditForm({ ...editForm, location: e.target.value })}
                                    placeholder="Add location"
                                    className="w-full text-sm font-medium text-slate-600 border-b border-slate-200 focus:border-slate-900 outline-none py-1 bg-transparent"
                                />
                            </div>
                            <div>
                                <label className="text-[10px] uppercase font-bold text-slate-400">Bio</label>
                                <textarea
                                    value={editForm.bio}
                                    onChange={e => setEditForm({ ...editForm, bio: e.target.value })}
                                    placeholder="Tell us about yourself..."
                                    className="w-full text-sm text-slate-600 border border-slate-200 rounded-lg p-3 mt-1 focus:border-slate-900 outline-none resize-none h-24"
                                />
                            </div>
                        </div>
                    ) : (
                        <div>
                            <h2 className="text-2xl font-bold text-slate-900">{user.name}</h2>
                            <div className="flex items-center gap-2 text-slate-500 text-sm font-medium mt-1">
                                <MapPin className="w-4 h-4" />
                                {user.location || "No location set"}
                            </div>
                            {user.bio && (
                                <p className="mt-4 text-slate-600 text-sm leading-relaxed bg-slate-50 p-4 rounded-xl border border-slate-100">
                                    {user.bio}
                                </p>
                            )}
                            <div className="flex items-center gap-2 text-slate-400 text-xs font-semibold mt-4 uppercase tracking-wider">
                                <Mail className="w-3 h-3" /> {user.email}
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Pets Preview Section */}
            <div className="mb-8">
                <div className="flex items-center justify-between mb-4 px-2">
                    <h3 className="font-bold text-slate-900">My Pets</h3>
                    <button onClick={() => navigate('/pets')} className="text-xs font-bold text-indigo-600 hover:text-indigo-700">View All</button>
                </div>
                <div className="grid grid-cols-2 gap-3">
                    {pets.slice(0, 2).map(pet => (
                        <div key={pet.id} onClick={() => navigate(`/pets/${pet.id}`)} className="bg-white p-3 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition cursor-pointer flex items-center gap-3">
                            <img src={pet.imageUrl} className="w-10 h-10 rounded-full bg-slate-100 object-cover" alt={pet.name} />
                            <div className="min-w-0">
                                <p className="font-bold text-sm text-slate-900 truncate">{pet.name}</p>
                                <p className="text-xs text-slate-500 truncate">{pet.breed}</p>
                            </div>
                        </div>
                    ))}
                    <button onClick={() => navigate('/pets')} className="bg-slate-50 p-3 rounded-2xl border border-dashed border-slate-300 hover:bg-slate-100 transition flex items-center justify-center text-slate-400 hover:text-slate-600">
                        <Plus className="w-5 h-5" />
                    </button>
                </div>
            </div>

            {/* My Posts Section */}
            <div className="mb-8">
                <div className="flex items-center justify-between mb-4 px-2">
                    <h3 className="font-bold text-slate-900">My Posts</h3>
                    <button onClick={() => navigate('/community')} className="text-xs font-bold text-indigo-600 hover:text-indigo-700">View All</button>
                </div>
                {myPosts.length > 0 ? (
                    <div className="space-y-3">
                        {myPosts.slice(0, 3).map(post => (
                            <div
                                key={post.id}
                                onClick={() => navigate('/community')}
                                className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition cursor-pointer"
                            >
                                <h4 className="font-semibold text-sm text-slate-900 truncate mb-1">{post.title}</h4>
                                <p className="text-xs text-slate-500 line-clamp-2 mb-2">{post.content}</p>
                                <div className="flex items-center gap-3 text-xs text-slate-400">
                                    <span className="flex items-center gap-1">
                                        <Heart className="w-3 h-3" /> {post.likes || 0}
                                    </span>
                                    <span className="flex items-center gap-1">
                                        <MessageSquare className="w-3 h-3" /> {post.comments?.length || 0}
                                    </span>
                                    <span>{new Date(post.timestamp).toLocaleDateString()}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="bg-slate-50 p-6 rounded-2xl border border-dashed border-slate-300 text-center">
                        <MessageSquare className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                        <p className="text-sm text-slate-500">No posts yet</p>
                        <button
                            onClick={() => navigate('/community')}
                            className="text-xs font-bold text-indigo-600 hover:text-indigo-700 mt-2"
                        >
                            Create your first post
                        </button>
                    </div>
                )}
            </div>

            {/* Menu Actions */}
            <div className="space-y-6">
                <div>
                    <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 px-2">Account</h3>
                    <div className="shadow-sm rounded-2xl overflow-hidden">
                        <MenuItem
                            icon={Settings}
                            label="Settings"
                            subtitle="Notifications, Password, Security"
                            onClick={() => navigate('/settings')}
                        />
                        <MenuItem
                            icon={User}
                            label="Personal Information"
                            subtitle="Edit name, email, and location"
                            onClick={() => setIsEditing(true)}
                        />
                    </div>
                </div>

                <div>
                    <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 px-2">App</h3>
                    <div className="shadow-sm rounded-2xl overflow-hidden">
                        <MenuItem
                            icon={LogOut}
                            label="Log Out"
                            isDanger
                            onClick={handleLogout}
                        />
                    </div>
                </div>
            </div>

            <p className="text-center text-xs text-slate-300 font-medium mt-12 pb-6">
                PetPal Community v1.2.0 • Build 2024
            </p>
        </div>
    );
};

export default Profile;
