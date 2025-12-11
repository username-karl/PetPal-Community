import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    User,
    Settings,
    LogOut,
    MapPin,
    Mail,
    PawPrint,
    Calendar,
    CheckCircle2,
    MessageSquare,
    Heart,
    TrendingUp,
    Award,
    Clock,
    Edit3,
    Camera
} from 'lucide-react';
import { useData } from '../context/DataContext';
import { useAuth } from '../AuthContext';
import { isToday, isThisWeek, isThisMonth, format, startOfWeek, differenceInDays } from 'date-fns';

const Profile = ({ user, onUpdateUser }) => {
    const navigate = useNavigate();
    const { logout } = useAuth();
    const { pets, posts, reminders } = useData();

    // Filter posts by current user
    const myPosts = posts.filter(post => post.author?.id === user?.id);

    // Edit Profile State
    const [isEditing, setIsEditing] = useState(false);
    const [editForm, setEditForm] = useState({
        name: user.name,
        location: user.location || '',
        bio: user.bio || ''
    });

    // Calculate activity stats
    const stats = useMemo(() => {
        const now = new Date();
        const weekStart = startOfWeek(now);

        // Reminders stats
        const completedThisWeek = reminders.filter(r =>
            r.completed && isThisWeek(new Date(r.date))
        ).length;

        const completedThisMonth = reminders.filter(r =>
            r.completed && isThisMonth(new Date(r.date))
        ).length;

        const pendingReminders = reminders.filter(r => !r.completed).length;
        const totalReminders = reminders.length;

        // Calculate streak (consecutive days with completed tasks)
        // Get unique completed dates sorted descending (most recent first)
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const completedDates = [...new Set(
            reminders
                .filter(r => r.completed)
                .map(r => {
                    const d = new Date(r.date);
                    d.setHours(0, 0, 0, 0);
                    return d.getTime();
                })
        )].sort((a, b) => b - a); // Sort descending

        let streak = 0;
        let expectedDate = today.getTime();

        for (const dateTime of completedDates) {
            const diff = Math.round((expectedDate - dateTime) / (1000 * 60 * 60 * 24));
            if (diff === 0) {
                streak++;
                expectedDate = dateTime - (1000 * 60 * 60 * 24); // Move to previous day
            } else if (diff === 1) {
                // If today has no task but yesterday does, still count
                streak++;
                expectedDate = dateTime - (1000 * 60 * 60 * 24);
            } else {
                break;
            }
        }

        // Posts stats
        const totalLikes = myPosts.reduce((sum, post) => sum + (post.likes || 0), 0);
        const totalComments = myPosts.reduce((sum, post) => sum + (post.comments?.length || 0), 0);

        return {
            completedThisWeek,
            completedThisMonth,
            pendingReminders,
            totalReminders,
            streak,
            petsCount: pets.length,
            postsCount: myPosts.length,
            totalLikes,
            totalComments
        };
    }, [reminders, pets, myPosts]);

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const handleSave = () => {
        onUpdateUser(editForm);
        setIsEditing(false);
    };

    return (
        <div className="max-w-4xl mx-auto pb-20 fade-in">
            {/* Hero Section with Large Cover */}
            <div className="relative mb-8">
                {/* Cover Background */}
                <div className="h-48 md:h-56 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-2xl overflow-hidden relative">
                    <div className="absolute inset-0 opacity-30 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%23ffffff%22%20fill-opacity%3D%220.1%22%3E%3Cpath%20d%3D%22M36%2034v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6%2034v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6%204V0H4v4H0v2h4v4h2V6h4V4H6z%22%2F%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fsvg%3E')]"></div>
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 to-transparent"></div>

                    {/* Decorative elements */}
                    <div className="absolute top-4 right-4 flex items-center gap-2">
                        <span className="px-3 py-1 bg-white/10 backdrop-blur-sm text-white text-xs font-medium rounded-full border border-white/20">
                            {user.role || 'Member'}
                        </span>
                    </div>
                </div>

                {/* Profile Info Overlay */}
                <div className="absolute bottom-0 left-0 right-0 translate-y-1/2 px-6">
                    <div className="bg-white rounded-2xl shadow-xl border border-slate-200 p-6">
                        <div className="flex flex-col md:flex-row gap-6 items-start md:items-center">
                            {/* Avatar */}
                            <div className="relative -mt-16 md:-mt-20 flex-shrink-0">
                                <img
                                    src={user.avatarUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.name}`}
                                    alt={user.name}
                                    className="w-24 h-24 md:w-28 md:h-28 rounded-2xl border-4 border-white shadow-lg bg-white object-cover"
                                />
                                <div className="absolute -bottom-1 -right-1 w-7 h-7 bg-emerald-500 border-4 border-white rounded-full flex items-center justify-center">
                                    <CheckCircle2 className="w-3.5 h-3.5 text-white" />
                                </div>
                            </div>

                            {/* User Info */}
                            <div className="flex-1 min-w-0">
                                {isEditing ? (
                                    <div className="space-y-3">
                                        <input
                                            value={editForm.name}
                                            onChange={e => setEditForm({ ...editForm, name: e.target.value })}
                                            className="w-full text-xl font-bold text-slate-900 border-b-2 border-slate-200 focus:border-slate-900 outline-none py-1 bg-transparent"
                                            placeholder="Your name"
                                        />
                                        <div className="flex items-center gap-2">
                                            <MapPin className="w-4 h-4 text-slate-400" />
                                            <input
                                                value={editForm.location}
                                                onChange={e => setEditForm({ ...editForm, location: e.target.value })}
                                                className="flex-1 text-sm text-slate-600 border-b border-slate-200 focus:border-slate-900 outline-none py-1 bg-transparent"
                                                placeholder="Add location"
                                            />
                                        </div>
                                        <textarea
                                            value={editForm.bio}
                                            onChange={e => setEditForm({ ...editForm, bio: e.target.value })}
                                            className="w-full text-sm text-slate-600 border border-slate-200 rounded-lg p-3 focus:border-slate-900 outline-none resize-none h-20"
                                            placeholder="Tell us about yourself..."
                                        />
                                    </div>
                                ) : (
                                    <>
                                        <h1 className="text-2xl font-bold text-slate-900">{user.name}</h1>
                                        <div className="flex flex-wrap items-center gap-4 mt-2 text-sm text-slate-500">
                                            <span className="flex items-center gap-1.5">
                                                <Mail className="w-4 h-4" />
                                                {user.email}
                                            </span>
                                            {user.location && (
                                                <span className="flex items-center gap-1.5">
                                                    <MapPin className="w-4 h-4" />
                                                    {user.location}
                                                </span>
                                            )}
                                        </div>
                                        {user.bio && (
                                            <p className="mt-3 text-sm text-slate-600 leading-relaxed">
                                                {user.bio}
                                            </p>
                                        )}
                                    </>
                                )}
                            </div>

                            {/* Action Buttons */}
                            <div className="flex gap-2 flex-shrink-0">
                                {isEditing ? (
                                    <>
                                        <button
                                            onClick={() => setIsEditing(false)}
                                            className="px-4 py-2 text-slate-600 font-medium text-sm hover:bg-slate-100 rounded-lg transition"
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            onClick={handleSave}
                                            className="px-4 py-2 bg-slate-900 text-white font-medium text-sm rounded-lg hover:bg-slate-800 transition"
                                        >
                                            Save
                                        </button>
                                    </>
                                ) : (
                                    <button
                                        onClick={() => setIsEditing(true)}
                                        className="flex items-center gap-2 px-4 py-2 bg-slate-100 text-slate-700 font-medium text-sm rounded-lg hover:bg-slate-200 transition"
                                    >
                                        <Edit3 className="w-4 h-4" />
                                        Edit Profile
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Spacer for the overlapping card */}
            <div className="h-24 md:h-20"></div>

            {/* Activity Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                <div className="bg-white rounded-xl border border-slate-200 p-4 hover:shadow-md transition">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-emerald-100 flex items-center justify-center">
                            <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-slate-900">{stats.completedThisWeek}</p>
                            <p className="text-xs text-slate-500">Tasks This Week</p>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-xl border border-slate-200 p-4 hover:shadow-md transition">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-amber-100 flex items-center justify-center">
                            <Clock className="w-5 h-5 text-amber-600" />
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-slate-900">{stats.pendingReminders}</p>
                            <p className="text-xs text-slate-500">Pending Tasks</p>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-xl border border-slate-200 p-4 hover:shadow-md transition">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                            <PawPrint className="w-5 h-5 text-blue-600" />
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-slate-900">{stats.petsCount}</p>
                            <p className="text-xs text-slate-500">Pets</p>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-xl border border-slate-200 p-4 hover:shadow-md transition">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center">
                            <MessageSquare className="w-5 h-5 text-purple-600" />
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-slate-900">{stats.postsCount}</p>
                            <p className="text-xs text-slate-500">Posts</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Two Column Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                {/* Activity Summary Card */}
                <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
                    <div className="p-5 border-b border-slate-100">
                        <h3 className="font-semibold text-slate-900 flex items-center gap-2">
                            <TrendingUp className="w-4 h-4 text-slate-400" />
                            Activity Summary
                        </h3>
                    </div>
                    <div className="p-5 space-y-4">
                        <div className="flex items-center justify-between">
                            <span className="text-sm text-slate-600">Tasks completed this month</span>
                            <span className="font-semibold text-slate-900">{stats.completedThisMonth}</span>
                        </div>
                        <div className="flex items-center justify-between">
                            <span className="text-sm text-slate-600">Pending reminders</span>
                            <span className="font-semibold text-amber-600">{stats.pendingReminders}</span>
                        </div>
                        <div className="flex items-center justify-between">
                            <span className="text-sm text-slate-600">Total likes received</span>
                            <span className="font-semibold text-slate-900 flex items-center gap-1">
                                <Heart className="w-3.5 h-3.5 text-red-500" />
                                {stats.totalLikes}
                            </span>
                        </div>
                        <div className="flex items-center justify-between">
                            <span className="text-sm text-slate-600">Comments on your posts</span>
                            <span className="font-semibold text-slate-900">{stats.totalComments}</span>
                        </div>
                        <div className="pt-3 border-t border-slate-100">
                            <button
                                onClick={() => navigate('/reminders')}
                                className="w-full py-2.5 bg-slate-100 text-slate-700 text-sm font-medium rounded-lg hover:bg-slate-200 transition"
                            >
                                View All Reminders
                            </button>
                        </div>
                    </div>
                </div>

                {/* My Pets Card */}
                <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
                    <div className="p-5 border-b border-slate-100 flex items-center justify-between">
                        <h3 className="font-semibold text-slate-900 flex items-center gap-2">
                            <PawPrint className="w-4 h-4 text-slate-400" />
                            My Pets
                        </h3>
                        <button
                            onClick={() => navigate('/pets')}
                            className="text-xs font-medium text-slate-500 hover:text-slate-900"
                        >
                            View All
                        </button>
                    </div>
                    <div className="p-5">
                        {pets.length > 0 ? (
                            <div className="space-y-3">
                                {pets.slice(0, 3).map(pet => (
                                    <div
                                        key={pet.id}
                                        onClick={() => navigate(`/pets/${pet.id}`)}
                                        className="flex items-center gap-4 p-3 rounded-xl hover:bg-slate-50 cursor-pointer transition -mx-2"
                                    >
                                        <img
                                            src={pet.imageUrl}
                                            alt={pet.name}
                                            className="w-12 h-12 rounded-xl object-cover bg-slate-100"
                                        />
                                        <div className="flex-1 min-w-0">
                                            <p className="font-semibold text-sm text-slate-900">{pet.name}</p>
                                            <p className="text-xs text-slate-500">{pet.breed || pet.type} • {pet.age} yrs</p>
                                        </div>
                                        <div className="text-xs text-slate-400 bg-slate-100 px-2 py-1 rounded-full">
                                            {pet.type}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-6">
                                <PawPrint className="w-10 h-10 text-slate-200 mx-auto mb-2" />
                                <p className="text-sm text-slate-500 mb-3">No pets added yet</p>
                                <button
                                    onClick={() => navigate('/pets')}
                                    className="text-sm font-medium text-slate-900 hover:underline"
                                >
                                    Add your first pet
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* My Posts Section - Always visible */}
            <div className="bg-white rounded-xl border border-slate-200 overflow-hidden mb-8">
                <div className="p-5 border-b border-slate-100 flex items-center justify-between">
                    <h3 className="font-semibold text-slate-900 flex items-center gap-2">
                        <MessageSquare className="w-4 h-4 text-slate-400" />
                        My Posts
                    </h3>
                    {myPosts.length > 0 && (
                        <button
                            onClick={() => navigate('/community')}
                            className="text-xs font-medium text-slate-500 hover:text-slate-900"
                        >
                            View All
                        </button>
                    )}
                </div>
                {myPosts.length > 0 ? (
                    <div className="divide-y divide-slate-100">
                        {myPosts.slice(0, 3).map(post => (
                            <div
                                key={post.id}
                                onClick={() => navigate('/community')}
                                className="p-5 hover:bg-slate-50 cursor-pointer transition"
                            >
                                <h4 className="font-medium text-sm text-slate-900 mb-1">{post.title}</h4>
                                <p className="text-xs text-slate-500 line-clamp-2 mb-3">{post.content}</p>
                                <div className="flex items-center gap-4 text-xs text-slate-400">
                                    <span className="flex items-center gap-1">
                                        <Heart className="w-3.5 h-3.5" /> {post.likes || 0}
                                    </span>
                                    <span className="flex items-center gap-1">
                                        <MessageSquare className="w-3.5 h-3.5" /> {post.comments?.length || 0}
                                    </span>
                                    <span>{format(new Date(post.timestamp), 'MMM d, yyyy')}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="p-8 text-center">
                        <MessageSquare className="w-10 h-10 text-slate-200 mx-auto mb-3" />
                        <p className="text-sm text-slate-500 mb-3">You haven't posted anything yet</p>
                        <button
                            onClick={() => navigate('/community')}
                            className="text-sm font-medium text-slate-900 hover:underline"
                        >
                            Create your first post
                        </button>
                    </div>
                )}
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-2 gap-4 mb-8">
                <button
                    onClick={() => navigate('/settings')}
                    className="flex items-center gap-3 p-4 bg-white rounded-xl border border-slate-200 hover:border-slate-300 hover:shadow-sm transition text-left"
                >
                    <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center">
                        <Settings className="w-5 h-5 text-slate-600" />
                    </div>
                    <div>
                        <p className="font-medium text-sm text-slate-900">Settings</p>
                        <p className="text-xs text-slate-500">Account & preferences</p>
                    </div>
                </button>

                <button
                    onClick={handleLogout}
                    className="flex items-center gap-3 p-4 bg-white rounded-xl border border-slate-200 hover:border-red-200 hover:bg-red-50 transition text-left group"
                >
                    <div className="w-10 h-10 rounded-lg bg-slate-100 group-hover:bg-red-100 flex items-center justify-center transition">
                        <LogOut className="w-5 h-5 text-slate-600 group-hover:text-red-600 transition" />
                    </div>
                    <div>
                        <p className="font-medium text-sm text-slate-900 group-hover:text-red-600 transition">Log Out</p>
                        <p className="text-xs text-slate-500">Sign out of your account</p>
                    </div>
                </button>
            </div>

            {/* Footer */}
            <p className="text-center text-xs text-slate-400 font-medium">
                PetPal Community v1.2.0
            </p>
        </div>
    );
};

export default Profile;
