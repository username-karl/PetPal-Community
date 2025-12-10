import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
    LayoutGrid,
    CheckCircle2,
    Users,
    Dog,
    ChevronRight,
    PawPrint,
    LogOut,
    ShieldAlert
} from 'lucide-react';
import { useAuth } from '../AuthContext';

const Sidebar = ({ userName, userRole, onLogout }) => {
    const location = useLocation();
    const navigate = useNavigate();
    const { logout } = useAuth();
    const isAdmin = userRole === 'Admin';

    const handleLogout = () => {
        if (onLogout) {
            onLogout();
        } else {
            logout();
        }
        navigate('/login');
    };

    const navItems = [
        { path: '/', label: 'Dashboard', icon: LayoutGrid },
        { path: '/reminders', label: 'My Reminders', icon: CheckCircle2 },
        { path: '/community', label: 'Community', icon: Users },
        { path: '/pets', label: 'My Pets', icon: Dog },
        ...(isAdmin ? [{ path: '/moderation', label: 'Moderation', icon: ShieldAlert }] : []),
    ];


    const isActive = (path) => {
        if (path === '/') return location.pathname === '/';
        return location.pathname.startsWith(path);
    };

    return (
        <aside className="w-full md:w-64 bg-slate-50/80 border-b md:border-b-0 md:border-r border-slate-200 flex flex-col sticky top-0 md:h-screen z-30 backdrop-blur-md">
            {/* Brand */}
            <div className="p-6">
                <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 bg-slate-900 text-white flex items-center justify-center rounded-lg shadow-sm">
                        <PawPrint className="w-4 h-4" />
                    </div>
                    <h1 className="text-lg font-semibold tracking-tight text-slate-900">
                        PetPal<span className="text-slate-400">.</span>
                    </h1>
                </div>
            </div>

            {/* Navigation */}
            <nav className="flex-1 px-3 space-y-1 overflow-y-auto">
                {navItems.map((item) => {
                    const Icon = item.icon;
                    const active = isActive(item.path);

                    return (
                        <Link
                            key={item.path}
                            to={item.path}
                            className={`w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-all group ${active
                                ? 'bg-white border border-slate-200 shadow-sm text-slate-900'
                                : 'text-slate-500 hover:text-slate-900 hover:bg-slate-100 border border-transparent'
                                }`}
                        >
                            <Icon className={`w-4 h-4 ${active ? 'text-slate-900' : 'group-hover:text-slate-900'}`} />
                            <span>{item.label}</span>
                            {item.badge && (
                                <span className="ml-auto bg-blue-50 text-blue-600 text-[10px] font-semibold px-2 py-0.5 rounded-full border border-blue-100">
                                    {item.badge}
                                </span>
                            )}
                        </Link>
                    );
                })}

                {/* Logout Button */}
                <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium text-slate-500 hover:text-red-600 hover:bg-red-50 transition-all border border-transparent group mt-4"
                >
                    <LogOut className="w-4 h-4 group-hover:text-red-600" />
                    <span>Logout</span>
                </button>
            </nav>

            {/* User Profile */}
            <div className="p-4 border-t border-slate-200">
                <Link
                    to="/profile"
                    className="flex items-center gap-3 p-2 rounded-lg hover:bg-white hover:shadow-sm hover:border-slate-200 border border-transparent cursor-pointer transition-all"
                >
                    <img
                        src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${userName || 'User'}`}
                        alt="User"
                        className="w-8 h-8 rounded-full bg-slate-100 ring-1 ring-slate-200"
                    />
                    <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-slate-900 truncate">{userName || 'User'}</p>
                        <p className="text-xs text-slate-500 truncate">{userRole || 'Member'}</p>
                    </div>
                    <ChevronRight className="w-4 h-4 text-slate-400" />
                </Link>
            </div>
        </aside>
    );
};

export default Sidebar;
