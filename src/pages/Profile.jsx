
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User as UserIcon, PawPrint as PawPrintIcon, Settings, Edit3, MapPin, Mail, Calendar, Plus, ChevronRight } from 'lucide-react';
import { useData } from '../context/DataContext';

const Profile = ({ user, onUpdateUser, onAddPetClick }) => {
    const navigate = useNavigate();
    const { pets } = useData();
    const [activeTab, setActiveTab] = useState('overview');
    const [isEditingProfile, setIsEditingProfile] = useState(false);
    const [profileForm, setProfileForm] = useState({
        name: user.name,
        location: user.location,
        bio: user.bio
    });

    const [notifications, setNotifications] = useState({
        email: true,
        push: false,
        marketing: false
    });

    const handleSaveProfile = () => {
        onUpdateUser({
            name: profileForm.name,
            location: profileForm.location,
            bio: profileForm.bio
        });
        setIsEditingProfile(false);
    };

    const SidebarItem = ({ id, label, icon: Icon }) => (
        <button
            onClick={() => setActiveTab(id)}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold transition-all ${activeTab === id
                ? 'bg-indigo-600 text-white shadow-lg shadow-primary/20'
                : 'bg-white text-slate-500 hover:bg-slate-50 hover:text-primary'
                }`}
        >
            <Icon className="w-5 h-5" />
            {label}
        </button>
    );

    return (
        <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in duration-500">
            <div>
                <h2 className="text-3xl font-bold text-slate-900">Account & Settings</h2>
                <p className="text-slate-500 font-medium">Manage your profile, pets, and preferences.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Sidebar Navigation */}
                <div className="lg:col-span-3 space-y-6">
                    <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-soft flex flex-col items-center text-center">
                        <div className="relative mb-4">
                            <img src={user.avatarUrl} alt={user.name} className="w-24 h-24 rounded-full object-cover border-4 border-slate-50" />
                            <div className="absolute bottom-0 right-0 w-6 h-6 bg-green-500 border-4 border-white rounded-full"></div>
                        </div>
                        <h3 className="font-bold text-slate-900 text-lg">{user.name}</h3>
                        <p className="text-slate-500 text-sm font-medium">{user.email}</p>
                        <span className="mt-3 px-3 py-1 bg-indigo-50 text-indigo-700 text-xs font-bold uppercase tracking-wider rounded-full">{user.role}</span>
                    </div>

                    <nav className="space-y-2">
                        <SidebarItem id="overview" label="Overview" icon={UserIcon} />
                        <SidebarItem id="pets" label="My Pets" icon={PawPrintIcon} />
                        <SidebarItem id="settings" label="Settings" icon={Settings} />
                    </nav>
                </div>

                {/* Main Content Area */}
                <div className="lg:col-span-9">

                    {/* OVERVIEW TAB */}
                    {activeTab === 'overview' && (
                        <div className="space-y-6">
                            {/* Profile Info Card */}
                            <div className="bg-white rounded-3xl border border-slate-100 shadow-soft overflow-hidden">
                                <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                                    <h3 className="font-bold text-slate-900 text-lg">Profile Information</h3>
                                    {!isEditingProfile ? (
                                        <button onClick={() => setIsEditingProfile(true)} className="text-primary hover:bg-indigo-50 px-4 py-2 rounded-xl text-sm font-bold transition flex items-center gap-2">
                                            <Edit3 className="w-4 h-4" /> Edit
                                        </button>
                                    ) : (
                                        <div className="flex gap-2">
                                            <button onClick={() => setIsEditingProfile(false)} className="text-slate-500 hover:bg-slate-100 px-4 py-2 rounded-xl text-sm font-bold transition">Cancel</button>
                                            <button onClick={handleSaveProfile} className="bg-indigo-600 text-white px-4 py-2 rounded-xl text-sm font-bold transition shadow-lg shadow-primary/20">Save Changes</button>
                                        </div>
                                    )}
                                </div>
                                <div className="p-8">
                                    {isEditingProfile ? (
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div className="space-y-2">
                                                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Display Name</label>
                                                <input
                                                    value={profileForm.name}
                                                    onChange={e => setProfileForm({ ...profileForm, name: e.target.value })}
                                                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary outline-none font-bold text-slate-900"
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Location</label>
                                                <input
                                                    value={profileForm.location}
                                                    onChange={e => setProfileForm({ ...profileForm, location: e.target.value })}
                                                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary outline-none font-bold text-slate-900"
                                                />
                                            </div>
                                            <div className="md:col-span-2 space-y-2">
                                                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Bio</label>
                                                <textarea
                                                    value={profileForm.bio}
                                                    onChange={e => setProfileForm({ ...profileForm, bio: e.target.value })}
                                                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary outline-none font-medium text-slate-600 h-32 resize-none"
                                                />
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="space-y-6">
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                                <div>
                                                    <label className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1 block">Display Name</label>
                                                    <p className="text-lg font-bold text-slate-900">{user.name}</p>
                                                </div>
                                                <div>
                                                    <label className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1 block">Location</label>
                                                    <div className="flex items-center gap-2 text-slate-900 font-medium">
                                                        <MapPin className="w-4 h-4 text-slate-400" />
                                                        {user.location}
                                                    </div>
                                                </div>
                                            </div>
                                            <div>
                                                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 block">Bio</label>
                                                <p className="text-slate-600 leading-relaxed bg-slate-50 p-4 rounded-2xl border border-slate-100">
                                                    {user.bio}
                                                </p>
                                            </div>
                                            <div className="pt-6 border-t border-slate-100 grid grid-cols-1 md:grid-cols-2 gap-6">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center text-slate-400">
                                                        <Mail className="w-5 h-5" />
                                                    </div>
                                                    <div>
                                                        <p className="text-xs font-bold text-slate-400 uppercase">Email Address</p>
                                                        <p className="font-bold text-slate-900">{user.email}</p>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center text-slate-400">
                                                        <Calendar className="w-5 h-5" />
                                                    </div>
                                                    <div>
                                                        <p className="text-xs font-bold text-slate-400 uppercase">Member Since</p>
                                                        <p className="font-bold text-slate-900">March 2023</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* PETS TAB */}
                    {activeTab === 'pets' && (
                        <div className="space-y-6">
                            <div className="flex justify-between items-center">
                                <h3 className="text-xl font-bold text-slate-900">My Pets</h3>
                                <button onClick={onAddPetClick} className="bg-indigo-600 text-white px-4 py-2 rounded-xl font-bold text-sm hover:bg-indigo-700 transition shadow-lg shadow-primary/20 flex items-center gap-2">
                                    <Plus className="w-4 h-4" /> Add Pet
                                </button>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {pets.map(pet => (
                                    <div
                                        key={pet.id}
                                        onClick={() => navigate(`/pets/${pet.id}`)}
                                        className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition cursor-pointer group flex items-center gap-4"
                                    >
                                        <img src={pet.imageUrl} alt={pet.name} className="w-20 h-20 rounded-xl object-cover" />
                                        <div className="flex-1">
                                            <div className="flex justify-between items-start">
                                                <div>
                                                    <h4 className="font-bold text-slate-900 text-lg group-hover:text-primary transition">{pet.name}</h4>
                                                    <p className="text-xs font-bold text-slate-500 uppercase">{pet.breed}</p>
                                                </div>
                                                <div className="bg-slate-50 p-2 rounded-lg text-slate-400 group-hover:bg-indigo-50 group-hover:text-primary transition">
                                                    <ChevronRight className="w-5 h-5" />
                                                </div>
                                            </div>
                                            <div className="mt-2 flex gap-2">
                                                <span className="text-xs bg-slate-50 text-slate-600 px-2 py-1 rounded-md font-medium">{pet.age} years</span>
                                                <span className="text-xs bg-slate-50 text-slate-600 px-2 py-1 rounded-md font-medium">{pet.weight} kg</span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* SETTINGS TAB */}
                    {activeTab === 'settings' && (
                        <div className="space-y-6">
                            {/* Notifications */}
                            <div className="bg-white rounded-3xl border border-slate-100 shadow-soft overflow-hidden">
                                <div className="p-6 border-b border-slate-100">
                                    <h3 className="font-bold text-slate-900">Notification Preferences</h3>
                                </div>
                                <div className="p-6 space-y-4">
                                    {Object.entries(notifications).map(([key, enabled]) => (
                                        <div key={key} className="flex items-center justify-between">
                                            <div>
                                                <p className="font-bold text-slate-900 capitalize">{key} Notifications</p>
                                                <p className="text-sm text-slate-500">Receive updates via {key}.</p>
                                            </div>
                                            <button
                                                onClick={() => setNotifications({ ...notifications, [key]: !enabled })}
                                                className={`w-12 h-6 rounded-full transition-colors relative ${enabled ? 'bg-indigo-600' : 'bg-slate-200'}`}
                                            >
                                                <div className={`w-5 h-5 bg-white rounded-full absolute top-0.5 left-0.5 transition-transform shadow-sm ${enabled ? 'translate-x-6' : 'translate-x-0'}`}></div>
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Security */}
                            <div className="bg-white rounded-3xl border border-slate-100 shadow-soft overflow-hidden">
                                <div className="p-6 border-b border-slate-100">
                                    <h3 className="font-bold text-slate-900">Security</h3>
                                </div>
                                <div className="p-6 space-y-4">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <label className="text-xs font-bold text-slate-500 uppercase">Current Password</label>
                                            <input type="password" placeholder="••••••••" className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary outline-none" />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-xs font-bold text-slate-500 uppercase">New Password</label>
                                            <input type="password" placeholder="••••••••" className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary outline-none" />
                                        </div>
                                    </div>
                                    <div className="flex justify-end">
                                        <button className="bg-slate-900 text-white px-5 py-2.5 rounded-xl font-bold text-sm hover:bg-slate-800 transition">Update Password</button>
                                    </div>
                                </div>
                            </div>

                            {/* Danger Zone */}
                            <div className="bg-red-50 rounded-3xl border border-red-100 overflow-hidden">
                                <div className="p-6 flex items-center justify-between">
                                    <div>
                                        <h3 className="font-bold text-rose-700">Danger Zone</h3>
                                        <p className="text-rose-600/70 text-sm">Permanently delete your account and all data.</p>
                                    </div>
                                    <button className="bg-white border border-rose-200 text-rose-600 px-5 py-2.5 rounded-xl font-bold text-sm hover:bg-rose-600 hover:text-white transition">
                                        Delete Account
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Profile;
