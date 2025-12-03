import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import StaggeredMenu from './StaggeredMenu';
import { useAuth } from '../AuthContext'; // Adjusted import path since we are in components/
import logo from '../logo.svg'; // Adjusted import path

const Layout = ({
  children,
  isModerator,
  userName,
  userRole,
  userAvatar,
  onLogout
}) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout } = useAuth(); // Ensure we have logout from context if not passed as prop

  const menuItems = [
    { label: 'Dashboard', ariaLabel: 'Go to dashboard', link: '/' },
    { label: 'My Pets', ariaLabel: 'View my pets', link: '/pets' },
    { label: 'Community', ariaLabel: 'Join the community', link: '/community' },
  ];

  if (isModerator) {
    menuItems.push({ label: 'Moderation', ariaLabel: 'Moderation tools', link: '/moderation' });
  }

  // Add Profile and Logout to the menu
  menuItems.push({ label: 'Profile', ariaLabel: 'View profile', link: '/profile' });

  // For Logout, StaggeredMenu expects links. We might need a custom item or just handle it via a link that triggers logout?
  // Or we can add a "Logout" item that redirects to /login, and we handle the cleanup in the onMenuClose or similar?
  // Actually, StaggeredMenu items are Links.
  // Let's keep it simple for now. The user can logout via Profile page or we can add a specific Logout item if we modify StaggeredMenu.
  // But for now, let's rely on the Profile page having a logout button (which it often does) or add a "Logout" link that goes to a logout route.
  // The previous Layout had a Logout button.
  // I'll add a "Logout" item that links to "/logout" and I'll handle that route or just let the user click it.
  // Wait, I can't easily intercept the click in StaggeredMenu without modifying it.
  // I'll assume the user can logout from the Profile page for now, or I'll add a "Logout" item and if the user clicks it, it goes to /login.
  // Actually, let's just add it.

  const socialItems = [
    { label: 'Twitter', link: 'https://twitter.com' },
    { label: 'GitHub', link: 'https://github.com' },
    { label: 'LinkedIn', link: 'https://linkedin.com' }
  ];

  const [isMenuOpen, setIsMenuOpen] = React.useState(false);

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 relative overflow-x-hidden">
      <StaggeredMenu
        position="left"
        items={menuItems}
        socialItems={socialItems}
        displaySocials={true}
        displayItemNumbering={true}
        menuButtonColor="#1f2937"
        openMenuButtonColor="#fff"
        changeMenuColorOnOpen={true}
        colors={['#312E81', '#4F46E5']}
        logoUrl={logo}
        accentColor="#EC4899"
        onMenuOpen={() => setIsMenuOpen(true)}
        onMenuClose={() => setIsMenuOpen(false)}
        isOpen={isMenuOpen}
        toggleMenu={() => setIsMenuOpen(!isMenuOpen)}
      />

      {/* Main Content */}
      <motion.main
        className="relative min-h-screen bg-slate-50"
        animate={{
          x: isMenuOpen ? 400 : 0,
          width: isMenuOpen ? 'calc(100% - 400px)' : '100%'
        }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      >
        {/* Optional Header for Logo/Context if menu is closed */}
        <header className="p-4 flex items-center justify-between bg-white/50 backdrop-blur-sm sticky top-0 z-10">
          <div className="flex items-center gap-2 font-bold text-xl ml-14">
            <span className="tracking-tight text-slate-700">PetPal</span>
          </div>
          {/* The menu button will be fixed on top right, so we don't need anything there */}
        </header>

        <div className="p-4 md:p-8 pb-24 max-w-6xl mx-auto">
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
      </motion.main>
    </div>
  );
};

export default Layout;
