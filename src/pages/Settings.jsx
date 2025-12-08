import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';
import { useAuth } from '../AuthContext';
import { api } from '../api';

const Settings = ({ user, onUpdateUser }) => {
    const { user: authUser, setUser } = useAuth();
    const currentUser = user || authUser;

    const [firstName, setFirstName] = useState(currentUser?.name?.split(' ')[0] || '');
    const [lastName, setLastName] = useState(currentUser?.name?.split(' ').slice(1).join(' ') || '');
    const [email, setEmail] = useState(currentUser?.email || '');
    const [saving, setSaving] = useState(false);

    const [notifications, setNotifications] = useState({
        dailyReminder: true,
        communityReplies: true,
        marketing: false
    });

    const handleSaveProfile = async () => {
        setSaving(true);
        try {
            const fullName = `${firstName} ${lastName}`.trim();
            if (onUpdateUser) {
                await onUpdateUser({ name: fullName, email });
            } else {
                const updatedUser = await api.updateUser(currentUser.id, { name: fullName, email });
                setUser(updatedUser);
                localStorage.setItem('petpal_user', JSON.stringify(updatedUser));
            }
        } catch (error) {
            console.error('Error saving profile:', error);
        } finally {
            setSaving(false);
        }
    };

    const toggleNotification = (key) => {
        setNotifications(prev => ({
            ...prev,
            [key]: !prev[key]
        }));
    };

    return (
        <div className="max-w-2xl mx-auto">
            {/* Profile Settings */}
            <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm mb-6">
                <div className="p-6 border-b border-slate-100 flex items-center gap-4">
                    <Link to="/profile" className="p-2 hover:bg-slate-100 rounded-lg transition-colors text-slate-500 hover:text-slate-900">
                        <ChevronLeft className="w-5 h-5" />
                    </Link>
                    <div>
                        <h3 className="text-lg font-semibold text-slate-900">Profile Settings</h3>
                        <p className="text-sm text-slate-500">Manage your account and pet information.</p>
                    </div>
                </div>
                <div className="p-6 space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-medium text-slate-700 mb-1.5">First Name</label>
                            <input
                                type="text"
                                value={firstName}
                                onChange={(e) => setFirstName(e.target.value)}
                                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-slate-400 transition-colors"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-slate-700 mb-1.5">Last Name</label>
                            <input
                                type="text"
                                value={lastName}
                                onChange={(e) => setLastName(e.target.value)}
                                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-slate-400 transition-colors"
                            />
                        </div>
                    </div>
                    <div>
                        <label className="block text-xs font-medium text-slate-700 mb-1.5">Email Address</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-slate-400 transition-colors"
                        />
                    </div>
                </div>
                <div className="px-6 py-3 bg-slate-50 border-t border-slate-100 flex justify-end">
                    <button
                        onClick={handleSaveProfile}
                        disabled={saving}
                        className="bg-slate-900 text-white text-xs font-medium px-4 py-2 rounded-lg hover:bg-slate-800 transition-colors disabled:opacity-50"
                    >
                        {saving ? 'Saving...' : 'Save Changes'}
                    </button>
                </div>
            </div>

            {/* Notification Settings */}
            <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
                <div className="p-6 border-b border-slate-100">
                    <h3 className="text-lg font-semibold text-slate-900">Notifications</h3>
                    <p className="text-sm text-slate-500">Control how you receive alerts.</p>
                </div>
                <div className="p-6 space-y-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-slate-900">Daily Reminder</p>
                            <p className="text-xs text-slate-500">Receive a summary of tasks at 8:00 AM</p>
                        </div>
                        <button
                            onClick={() => toggleNotification('dailyReminder')}
                            className={`w-11 h-6 rounded-full relative transition-colors focus:outline-none ${notifications.dailyReminder ? 'bg-slate-900' : 'bg-slate-200'
                                }`}
                            role="switch"
                            aria-checked={notifications.dailyReminder}
                        >
                            <span className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${notifications.dailyReminder ? 'right-1' : 'left-1'
                                }`}></span>
                        </button>
                    </div>
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-slate-900">Community Replies</p>
                            <p className="text-xs text-slate-500">Notify when someone comments on your post</p>
                        </div>
                        <button
                            onClick={() => toggleNotification('communityReplies')}
                            className={`w-11 h-6 rounded-full relative transition-colors focus:outline-none ${notifications.communityReplies ? 'bg-slate-900' : 'bg-slate-200'
                                }`}
                            role="switch"
                            aria-checked={notifications.communityReplies}
                        >
                            <span className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${notifications.communityReplies ? 'right-1' : 'left-1'
                                }`}></span>
                        </button>
                    </div>
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-slate-900">Marketing Emails</p>
                            <p className="text-xs text-slate-500">Receive news and special offers</p>
                        </div>
                        <button
                            onClick={() => toggleNotification('marketing')}
                            className={`w-11 h-6 rounded-full relative transition-colors focus:outline-none ${notifications.marketing ? 'bg-slate-900' : 'bg-slate-200'
                                }`}
                            role="switch"
                            aria-checked={notifications.marketing}
                        >
                            <span className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${notifications.marketing ? 'right-1' : 'left-1'
                                }`}></span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Settings;
