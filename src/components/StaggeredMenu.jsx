import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Twitter, Github, Linkedin, Facebook, Instagram } from 'lucide-react';

const StaggeredMenu = ({
    position = 'right',
    items = [],
    socialItems = [],
    displaySocials = true,
    displayItemNumbering = true,
    menuButtonColor = '#000',
    openMenuButtonColor = '#fff',
    changeMenuColorOnOpen = true,
    colors = ['#B19EEF', '#5227FF'],
    logoUrl,
    accentColor = '#ff6b6b',
    onMenuOpen,
    onMenuClose,
    isOpen: propIsOpen,
    toggleMenu: propToggleMenu,
}) => {
    const [internalIsOpen, setInternalIsOpen] = useState(false);
    const location = useLocation();

    const isControlled = propIsOpen !== undefined;
    const isOpen = isControlled ? propIsOpen : internalIsOpen;

    const toggleMenu = () => {
        if (isControlled) {
            propToggleMenu();
        } else {
            setInternalIsOpen(!internalIsOpen);
        }

        if (!isOpen && onMenuOpen) onMenuOpen();
        if (isOpen && onMenuClose) onMenuClose();
    };

    // Close menu when route changes
    useEffect(() => {
        if (!isControlled) {
            setInternalIsOpen(false);
        }
        if (onMenuClose) onMenuClose();
    }, [location.pathname]);

    const menuVariants = {
        closed: {
            x: position === 'right' ? '100%' : '-100%',
            transition: {
                type: 'spring',
                stiffness: 400,
                damping: 40,
                staggerChildren: 0.05,
                staggerDirection: -1,
            },
        },
        open: {
            x: 0,
            transition: {
                type: 'spring',
                stiffness: 400,
                damping: 40,
                staggerChildren: 0.07,
                delayChildren: 0.2,
            },
        },
    };

    const itemVariants = {
        closed: {
            opacity: 0,
            y: 50,
            transition: {
                y: { stiffness: 1000 },
            },
        },
        open: {
            opacity: 1,
            y: 0,
            transition: {
                y: { stiffness: 1000, velocity: -100 },
            },
        },
    };

    const socialVariants = {
        closed: { opacity: 0, y: 20 },
        open: { opacity: 1, y: 0, transition: { delay: 0.5, duration: 0.5 } },
    };

    return (
        <>
            {/* Menu Button */}
            <button
                onClick={toggleMenu}
                style={{
                    position: 'fixed',
                    top: '20px',
                    [position]: '20px',
                    zIndex: 1000,
                    background: 'transparent',
                    border: 'none',
                    cursor: 'pointer',
                    color: isOpen && changeMenuColorOnOpen ? openMenuButtonColor : menuButtonColor,
                    transition: 'color 0.3s ease',
                }}
                aria-label={isOpen ? "Close menu" : "Open menu"}
            >
                {isOpen ? <X size={32} /> : <Menu size={32} />}
            </button>

            {/* Menu Overlay */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial="closed"
                        animate="open"
                        exit="closed"
                        variants={menuVariants}
                        style={{
                            position: 'fixed',
                            top: 0,
                            [position]: 0,
                            width: '100%',
                            maxWidth: '400px',
                            height: '100vh',
                            background: `linear-gradient(135deg, ${colors[0]}, ${colors[1]})`,
                            zIndex: 999,
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'center',
                            padding: '40px',
                            boxShadow: '-5px 0 25px rgba(0,0,0,0.2)',
                            overflowY: 'auto',
                        }}
                    >
                        {/* Logo */}
                        {logoUrl && (
                            <motion.div
                                variants={itemVariants}
                                style={{
                                    position: 'absolute',
                                    top: '40px',
                                    left: '40px',
                                    marginBottom: '40px',
                                }}
                            >
                                <img src={logoUrl} alt="Logo" style={{ height: '40px' }} />
                            </motion.div>
                        )}

                        {/* Menu Items */}
                        <nav style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                            {items.map((item, index) => (
                                <motion.div key={index} variants={itemVariants}>
                                    <Link
                                        to={item.link}
                                        style={{
                                            textDecoration: 'none',
                                            color: 'white',
                                            fontSize: '2rem',
                                            fontWeight: 'bold',
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '15px',
                                            position: 'relative',
                                        }}
                                        aria-label={item.ariaLabel}
                                    >
                                        {displayItemNumbering && (
                                            <span
                                                style={{
                                                    fontSize: '1rem',
                                                    opacity: 0.6,
                                                    fontFamily: 'monospace',
                                                }}
                                            >
                                                {String(index + 1).padStart(2, '0')}
                                            </span>
                                        )}
                                        <span
                                            style={{
                                                position: 'relative',
                                            }}
                                            onMouseEnter={(e) => {
                                                e.target.style.color = accentColor;
                                            }}
                                            onMouseLeave={(e) => {
                                                e.target.style.color = 'white';
                                            }}
                                        >
                                            {item.label}
                                        </span>
                                    </Link>
                                </motion.div>
                            ))}
                        </nav>

                        {/* Social Items */}
                        {displaySocials && socialItems.length > 0 && (
                            <motion.div
                                variants={socialVariants}
                                style={{
                                    marginTop: '60px',
                                    display: 'flex',
                                    gap: '20px',
                                    borderTop: '1px solid rgba(255,255,255,0.2)',
                                    paddingTop: '30px',
                                }}
                            >
                                {socialItems.map((social, index) => {
                                    const Icon = getSocialIcon(social.label);
                                    return (
                                        <a
                                            key={index}
                                            href={social.link}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            style={{ color: 'white', transition: 'transform 0.2s' }}
                                            onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.2)')}
                                            onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
                                        >
                                            {Icon ? <Icon size={24} /> : social.label}
                                        </a>
                                    );
                                })}
                            </motion.div>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
};

// Helper to get icon based on label
const getSocialIcon = (label) => {
    const lowerLabel = label.toLowerCase();
    if (lowerLabel.includes('twitter') || lowerLabel.includes('x')) return Twitter;
    if (lowerLabel.includes('github')) return Github;
    if (lowerLabel.includes('linkedin')) return Linkedin;
    if (lowerLabel.includes('facebook')) return Facebook;
    if (lowerLabel.includes('instagram')) return Instagram;
    return null;
};

export default StaggeredMenu;
