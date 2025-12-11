import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    ChevronLeft,
    Bell,
    Shield,
    Trash2,
    AlertTriangle,
    X,
    Moon,
    Globe,
    HelpCircle,
    FileText,
    ExternalLink
} from 'lucide-react';
import { useAuth } from '../AuthContext';

const Settings = ({ user }) => {
    const navigate = useNavigate();
    const { logout } = useAuth();
    const currentUser = user;

    // Notification settings
    const [notifications, setNotifications] = useState({
        dailyReminder: true,
        communityReplies: true,
        marketing: false
    });

    // Delete account modal
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [deleteConfirmText, setDeleteConfirmText] = useState('');
    const [isDeleting, setIsDeleting] = useState(false);

    const toggleNotification = (key) => {
        setNotifications(prev => ({
            ...prev,
            [key]: !prev[key]
        }));
    };

    const handleDeleteAccount = async () => {
        if (deleteConfirmText !== 'DELETE') return;

        setIsDeleting(true);
        try {
            // In a real app, this would call an API to delete the account
            // await api.deleteAccount(currentUser.id);

            // For now, just log out and redirect
            setTimeout(() => {
                logout();
                navigate('/login');
            }, 1500);
        } catch (error) {
            console.error('Error deleting account:', error);
            setIsDeleting(false);
        }
    };

    const ToggleSwitch = ({ enabled, onToggle }) => (
        <button
            onClick={onToggle}
            className={`w-11 h-6 rounded-full relative transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-500 ${enabled ? 'bg-slate-900' : 'bg-slate-200'
                }`}
            role="switch"
            aria-checked={enabled}
        >
            <span className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-transform ${enabled ? 'right-1' : 'left-1'
                }`}></span>
        </button>
    );

    return (
        <div className="max-w-2xl mx-auto pb-20 fade-in">
            {/* Header */}
            <div className="flex items-center gap-4 mb-8">
                <button
                    onClick={() => navigate('/profile')}
                    className="p-2 hover:bg-slate-100 rounded-lg transition-colors text-slate-500 hover:text-slate-900"
                >
                    <ChevronLeft className="w-5 h-5" />
                </button>
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Settings</h1>
                    <p className="text-sm text-slate-500">Manage your preferences</p>
                </div>
            </div>

            {/* Notifications Section */}
            <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm mb-6">
                <div className="p-5 border-b border-slate-100 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                        <Bell className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                        <h3 className="font-semibold text-slate-900">Notifications</h3>
                        <p className="text-xs text-slate-500">Manage how you receive alerts</p>
                    </div>
                </div>
                <div className="p-5 space-y-5">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-slate-900">Daily Reminder</p>
                            <p className="text-xs text-slate-500">Get a summary of tasks at 8:00 AM</p>
                        </div>
                        <ToggleSwitch
                            enabled={notifications.dailyReminder}
                            onToggle={() => toggleNotification('dailyReminder')}
                        />
                    </div>
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-slate-900">Community Replies</p>
                            <p className="text-xs text-slate-500">Notify when someone comments on your post</p>
                        </div>
                        <ToggleSwitch
                            enabled={notifications.communityReplies}
                            onToggle={() => toggleNotification('communityReplies')}
                        />
                    </div>
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-slate-900">Marketing Emails</p>
                            <p className="text-xs text-slate-500">Receive news and special offers</p>
                        </div>
                        <ToggleSwitch
                            enabled={notifications.marketing}
                            onToggle={() => toggleNotification('marketing')}
                        />
                    </div>
                </div>
            </div>

            {/* Appearance & Language */}
            <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm mb-6">
                <div className="p-5 border-b border-slate-100 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center">
                        <Moon className="w-5 h-5 text-purple-600" />
                    </div>
                    <div>
                        <h3 className="font-semibold text-slate-900">Appearance</h3>
                        <p className="text-xs text-slate-500">Customize your experience</p>
                    </div>
                </div>
                <div className="p-5 space-y-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <Globe className="w-4 h-4 text-slate-400" />
                            <span className="text-sm text-slate-900">Language</span>
                        </div>
                        <span className="text-sm text-slate-500">English</span>
                    </div>
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <Moon className="w-4 h-4 text-slate-400" />
                            <span className="text-sm text-slate-900">Theme</span>
                        </div>
                        <span className="text-sm text-slate-500">Light</span>
                    </div>
                </div>
            </div>

            {/* Support */}
            <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm mb-6">
                <div className="p-5 border-b border-slate-100 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-emerald-100 flex items-center justify-center">
                        <HelpCircle className="w-5 h-5 text-emerald-600" />
                    </div>
                    <div>
                        <h3 className="font-semibold text-slate-900">Support</h3>
                        <p className="text-xs text-slate-500">Get help and information</p>
                    </div>
                </div>
                <div className="divide-y divide-slate-100">
                    <button className="w-full p-4 flex items-center justify-between text-left hover:bg-slate-50 transition">
                        <div className="flex items-center gap-3">
                            <HelpCircle className="w-4 h-4 text-slate-400" />
                            <span className="text-sm text-slate-900">Help Center</span>
                        </div>
                        <ExternalLink className="w-4 h-4 text-slate-300" />
                    </button>
                    <button className="w-full p-4 flex items-center justify-between text-left hover:bg-slate-50 transition">
                        <div className="flex items-center gap-3">
                            <FileText className="w-4 h-4 text-slate-400" />
                            <span className="text-sm text-slate-900">Terms of Service</span>
                        </div>
                        <ExternalLink className="w-4 h-4 text-slate-300" />
                    </button>
                    <button className="w-full p-4 flex items-center justify-between text-left hover:bg-slate-50 transition">
                        <div className="flex items-center gap-3">
                            <Shield className="w-4 h-4 text-slate-400" />
                            <span className="text-sm text-slate-900">Privacy Policy</span>
                        </div>
                        <ExternalLink className="w-4 h-4 text-slate-300" />
                    </button>
                </div>
            </div>

            {/* Danger Zone */}
            <div className="bg-white border border-red-200 rounded-xl overflow-hidden shadow-sm">
                <div className="p-5 border-b border-red-100 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-red-100 flex items-center justify-center">
                        <AlertTriangle className="w-5 h-5 text-red-600" />
                    </div>
                    <div>
                        <h3 className="font-semibold text-red-900">Danger Zone</h3>
                        <p className="text-xs text-red-600">Irreversible actions</p>
                    </div>
                </div>
                <div className="p-5">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-slate-900">Delete Account</p>
                            <p className="text-xs text-slate-500">Permanently delete your account and all data</p>
                        </div>
                        <button
                            onClick={() => setShowDeleteModal(true)}
                            className="px-4 py-2 bg-red-100 text-red-700 text-sm font-medium rounded-lg hover:bg-red-200 transition flex items-center gap-2"
                        >
                            <Trash2 className="w-4 h-4" />
                            Delete
                        </button>
                    </div>
                </div>
            </div>

            {/* App Version */}
            <p className="text-center text-xs text-slate-400 mt-8">
                PetPal Community v1.2.0
            </p>

            {/* Delete Account Confirmation Modal */}
            {showDeleteModal && (
                <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl overflow-hidden">
                        {/* Modal Header */}
                        <div className="p-6 border-b border-slate-100">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center">
                                        <AlertTriangle className="w-6 h-6 text-red-600" />
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-bold text-slate-900">Delete Account</h3>
                                        <p className="text-sm text-slate-500">This action cannot be undone</p>
                                    </div>
                                </div>
                                <button
                                    onClick={() => {
                                        setShowDeleteModal(false);
                                        setDeleteConfirmText('');
                                    }}
                                    className="p-2 hover:bg-slate-100 rounded-lg transition"
                                >
                                    <X className="w-5 h-5 text-slate-400" />
                                </button>
                            </div>
                        </div>

                        {/* Modal Body */}
                        <div className="p-6">
                            <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6">
                                <h4 className="font-semibold text-red-900 mb-2">Warning:</h4>
                                <ul className="text-sm text-red-700 space-y-1">
                                    <li>• All your pets will be removed</li>
                                    <li>• All your reminders will be deleted</li>
                                    <li>• All your posts will be removed</li>
                                    <li>• This action is permanent and irreversible</li>
                                </ul>
                            </div>

                            <div className="mb-6">
                                <label className="block text-sm font-medium text-slate-700 mb-2">
                                    Type <span className="font-bold text-red-600">DELETE</span> to confirm
                                </label>
                                <input
                                    type="text"
                                    value={deleteConfirmText}
                                    onChange={(e) => setDeleteConfirmText(e.target.value.toUpperCase())}
                                    placeholder="Type DELETE"
                                    className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                                />
                            </div>

                            <div className="flex gap-3">
                                <button
                                    onClick={() => {
                                        setShowDeleteModal(false);
                                        setDeleteConfirmText('');
                                    }}
                                    className="flex-1 px-4 py-3 bg-slate-100 text-slate-700 font-medium rounded-xl hover:bg-slate-200 transition"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleDeleteAccount}
                                    disabled={deleteConfirmText !== 'DELETE' || isDeleting}
                                    className={`flex-1 px-4 py-3 font-medium rounded-xl transition flex items-center justify-center gap-2 ${deleteConfirmText === 'DELETE' && !isDeleting
                                        ? 'bg-red-600 text-white hover:bg-red-700'
                                        : 'bg-slate-100 text-slate-400 cursor-not-allowed'
                                        }`}
                                >
                                    {isDeleting ? (
                                        <>
                                            <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                                            Deleting...
                                        </>
                                    ) : (
                                        <>
                                            <Trash2 className="w-4 h-4" />
                                            Delete Account
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Settings;
