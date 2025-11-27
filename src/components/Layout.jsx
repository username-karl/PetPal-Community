
import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { LayoutDashboard, PawPrint, MessageCircle, ShieldCheck, Menu, X, Settings } from 'lucide-react';

const Layout = ({
  children,
  isModerator,
  userName,
  userRole,
  userAvatar,
  onLogout
}) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);
  const location = useLocation();

  const navItems = [
    { path: '/', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/pets', label: 'My Pets', icon: PawPrint },
    { path: '/community', label: 'Community', icon: MessageCircle },
  ];

  if (isModerator) {
    navItems.push({ path: '/moderation', label: 'Moderation', icon: ShieldCheck });
  }

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-gray-50 font-sans">
      {/* Mobile Header */}
      <div className="md:hidden bg-white/80 backdrop-blur-md border-b border-gray-100 p-4 flex items-center justify-between sticky top-0 z-30">
        <div className="flex items-center gap-2 text-brand-600 font-bold text-xl">
          <div className="w-8 h-8 bg-brand-500 rounded-lg flex items-center justify-center text-white">
            <PawPrint className="w-5 h-5" />
          </div>
          <span className="tracking-tight">PetPals</span>
        </div>
        <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="text-slate-600 hover:bg-slate-100 p-2 rounded-lg transition">
          {isMobileMenuOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* Sidebar Navigation */}
      <aside className={`
        fixed inset-y-0 left-0 z-20 w-72 bg-white border-r border-gray-100 transform transition-transform duration-300 cubic-bezier(0.4, 0, 0.2, 1)
        md:relative md:translate-x-0 flex flex-col
        ${isMobileMenuOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full'}
      `}>
        <div className="p-8 flex items-center gap-3 text-slate-900 font-bold text-2xl hidden md:flex">
          <div className="w-10 h-10 bg-brand-600 rounded-xl flex items-center justify-center text-white shadow-glow">
            <PawPrint className="w-6 h-6" />
          </div>
          <span className="tracking-tight">PetPals</span>
        </div>

        <div className="px-4 py-2 flex-1">
          <p className="px-4 text-xs font-semibold text-slate-400 uppercase tracking-wider mb-4 mt-2">Menu</p>
          <nav className="space-y-1.5">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path ||
                (item.path !== '/' && location.pathname.startsWith(item.path));
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`w-full flex items-center gap-3 px-4 py-3.5 text-sm font-medium rounded-xl transition-all duration-200
                    ${isActive
                      ? 'bg-brand-50 text-brand-700 shadow-sm'
                      : 'text-slate-500 hover:bg-gray-50 hover:text-slate-900'
                    }
                  `}
                >
                  <Icon className={`w-5 h-5 ${isActive ? 'text-brand-600' : 'text-slate-400'}`} />
                  {item.label}
                </NavLink>
              );
            })}
          </nav>
        </div>

        {/* User Profile Section */}
        <div className="p-4 border-t border-gray-100 bg-gray-50/50 space-y-3">
          <NavLink
            to="/profile"
            onClick={() => setIsMobileMenuOpen(false)}
            className={({ isActive }) => `w-full flex items-center gap-3 p-3 rounded-xl transition-all hover:bg-white hover:shadow-sm group ${isActive ? 'bg-white shadow-sm ring-1 ring-gray-200' : ''}`}
          >
            <div className="relative">
              <img src={userAvatar} alt="User" className="w-10 h-10 rounded-full object-cover border-2 border-white shadow-sm" />
              <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
            </div>
            <div className="overflow-hidden text-left flex-1">
              <p className="text-sm font-bold text-slate-900 truncate group-hover:text-brand-700 transition-colors">{userName}</p>
              <p className="text-xs text-slate-500 truncate">{userRole}</p>
            </div>
            <Settings className="w-4 h-4 text-slate-400 group-hover:text-slate-600" />
          </NavLink>

          {onLogout && (
            <button
              onClick={() => {
                onLogout();
                setIsMobileMenuOpen(false);
              }}
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-bold text-rose-600 bg-white border border-rose-100 rounded-xl hover:bg-rose-50 transition"
            >
              Log out
            </button>
          )}
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-4 md:p-10 overflow-y-auto h-[calc(100vh-64px)] md:h-screen bg-gray-50/50">
        <div className="max-w-5xl mx-auto animate-in fade-in duration-500">
          {children}
        </div>
      </main>

      {/* Overlay for mobile */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-10 md:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}
    </div>
  );
};

export default Layout;
