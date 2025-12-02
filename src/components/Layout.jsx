import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { LayoutDashboard, PawPrint, MessageCircle, ShieldCheck, Menu, X, Settings, LogOut } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

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

  const sidebarVariants = {
    open: { x: 0, opacity: 1, transition: { type: 'spring', stiffness: 300, damping: 30 } },
    closed: { x: '-100%', opacity: 0, transition: { type: 'spring', stiffness: 300, damping: 30 } },
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-slate-50 font-sans text-slate-900">
      {/* Mobile Header */}
      <div className="md:hidden bg-white/90 backdrop-blur-xl border-b border-slate-200 p-4 flex items-center justify-between sticky top-0 z-40 shadow-sm">
        <div className="flex items-center gap-2 font-bold text-xl">
          <div className="w-10 h-10 bg-gradient-to-br from-primary-600 to-primary-800 rounded-xl flex items-center justify-center text-white shadow-lg shadow-primary/30">
            <PawPrint className="w-6 h-6" />
          </div>
          <span className="tracking-tight text-slate-700">PetPals</span>
        </div>
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="text-slate-600 hover:bg-slate-100 p-2 rounded-xl transition-colors active:scale-95"
        >
          {isMobileMenuOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* Sidebar Navigation */}
      <AnimatePresence mode='wait'>
        {(isMobileMenuOpen || window.innerWidth >= 768) && (
          <motion.aside
            initial={window.innerWidth < 768 ? "closed" : false}
            animate={window.innerWidth < 768 ? (isMobileMenuOpen ? "open" : "closed") : false}
            variants={sidebarVariants}
            className={`
              fixed inset-y-0 left-0 z-30 w-72 bg-white border-r border-slate-200 flex flex-col shadow-2xl md:shadow-none md:relative md:translate-x-0
              ${isMobileMenuOpen ? 'block' : 'hidden md:flex'}
            `}
          >
            <div className="p-8 flex items-center gap-3 hidden md:flex">
              <div className="w-10 h-10 bg-gradient-to-br from-primary-600 to-primary-800 rounded-xl flex items-center justify-center text-white shadow-lg shadow-primary/30">
                <PawPrint className="w-6 h-6" />
              </div>
              <span className="text-2xl font-bold tracking-tight text-slate-700">PetPals</span>
            </div>

            <div className="px-4 py-2 flex-1 overflow-y-auto">
              <p className="px-4 text-xs font-bold text-slate-400 uppercase tracking-wider mb-4 mt-2">Menu</p>
              <nav className="space-y-2">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = location.pathname === item.path ||
                    (item.path !== '/' && location.pathname.startsWith(item.path));
                  return (
                    <NavLink
                      key={item.path}
                      to={item.path}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={({ isActive }) => `
                        relative w-full flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-xl transition-all duration-300 group overflow-hidden
                        ${isActive
                          ? 'bg-primary-50 text-primary-700 shadow-sm'
                          : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                        }
                      `}
                    >
                      <Icon className={`w-5 h-5 ${isActive ? 'text-primary-700' : 'text-slate-500 group-hover:text-primary-600 transition-colors'}`} />
                      {item.label}
                    </NavLink>
                  );
                })}
              </nav>
            </div>

            {/* User Profile Section */}
            <div className="p-4 border-t border-slate-100 bg-slate-50/50 space-y-3">
              <NavLink
                to="/profile"
                onClick={() => setIsMobileMenuOpen(false)}
                className={({ isActive }) => `
                  w-full flex items-center gap-3 p-3 rounded-xl transition-all duration-200 
                  hover:bg-white hover:shadow-md hover:-translate-y-0.5
                  ${isActive ? 'bg-white shadow-md ring-1 ring-primary/10' : ''}
                `}
              >
                <div className="relative">
                  <img src={userAvatar || "https://via.placeholder.com/40"} alt="User" className="w-10 h-10 rounded-full object-cover border-2 border-white shadow-sm" />
                  <div className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 border-2 border-white rounded-full"></div>
                </div>
                <div className="overflow-hidden text-left flex-1">
                  <p className="text-sm font-bold text-slate-900 truncate group-hover:text-primary transition-colors">{userName || 'User'}</p>
                  <p className="text-xs text-slate-500 truncate">{userRole || 'Member'}</p>
                </div>
                <Settings className="w-4 h-4 text-slate-400 hover:text-primary transition-colors" />
              </NavLink>

              {onLogout && (
                <button
                  onClick={() => {
                    onLogout();
                    setIsMobileMenuOpen(false);
                  }}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-bold text-rose-600 bg-white border border-rose-100 rounded-xl hover:bg-rose-50 hover:border-rose-200 hover:shadow-sm transition-all active:scale-95"
                >
                  <LogOut className="w-4 h-4" />
                  Log out
                </button>
              )}
            </div>
          </motion.aside>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <main className="flex-1 relative overflow-hidden h-screen bg-slate-50">
        <div className="absolute inset-0 overflow-y-auto p-4 md:p-8 pb-24">
          <div className="max-w-6xl mx-auto">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              {children}
            </motion.div>
          </div>
        </div>
      </main>

      {/* Overlay for mobile */}
      {isMobileMenuOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-slate-900/20 backdrop-blur-sm z-20 md:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}
    </div>
  );
};

export default Layout;
