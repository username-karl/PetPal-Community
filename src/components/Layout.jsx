import React from 'react';
import { useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import Sidebar from './Sidebar';
import NotificationBell from './NotificationBell';

const Layout = ({
  children,
  isModerator,
  userName,
  userRole,
  userAvatar,
  userId,
  onLogout
}) => {
  const location = useLocation();

  // Page titles mapping
  const getPageTitle = () => {
    const paths = {
      '/': 'Dashboard',
      '/reminders': 'My Reminders',
      '/community': 'Community Feed',
      '/pets': 'My Pets',
      '/settings': 'Account Settings',
      '/profile': 'Profile',
      '/moderation': 'Moderation'
    };

    // Check for dynamic routes
    if (location.pathname.startsWith('/pets/')) return 'Pet Details';

    return paths[location.pathname] || 'PetPal';
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-white text-slate-900 selection:bg-slate-900 selection:text-white overflow-x-hidden">
      {/* Sidebar */}
      <Sidebar
        userName={userName}
        userRole={userRole}
        onLogout={onLogout}
      />

      {/* Main Content Area */}
      <main className="flex-1 h-screen overflow-y-auto custom-scroll relative bg-white">
        {/* Sticky Header */}
        <div className="sticky top-0 z-20 bg-white/80 backdrop-blur-md border-b border-slate-100 px-6 md:px-10 py-4 flex justify-between items-center">
          <div>
            <h2 className="text-sm font-semibold text-slate-900">{getPageTitle()}</h2>
          </div>
          <div className="flex items-center gap-4">
            <NotificationBell userId={userId} />
          </div>
        </div>

        {/* Page Content */}
        <div className="p-6 md:p-10">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            {children}
          </motion.div>
        </div>
      </main>
    </div>
  );
};

export default Layout;
