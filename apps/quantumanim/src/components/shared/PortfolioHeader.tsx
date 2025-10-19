'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';

// Cross-app navigation links
const crossAppLinks = [
  { name: 'Portfolio', path: 'https://abdalkader.dev', external: true },
  { name: 'Blog', path: 'https://blog.abdalkader.dev', external: true },
  { name: 'Docs', path: 'https://docs.abdalkader.dev', external: true },
  { name: 'Components', path: 'https://storybook.abdalkader.dev', external: true },
  { name: 'Programming Museum', path: 'https://history.abdalkader.dev', external: true, current: true },
  { name: 'AI Therapy', path: 'https://therapy.abdalkader.dev', external: true },
  { name: 'Neuro Interface', path: 'https://neuro.abdalkader.dev', external: true },
  { name: 'Quantum Lab', path: 'https://quantumanim.abdalkader.dev', external: true },
];

interface PortfolioHeaderProps {
  appName: string;
  appDescription?: string;
  currentApp?: string;
}

export default function PortfolioHeader({ 
  appName, 
  appDescription,
  currentApp = 'history'
}: PortfolioHeaderProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [hoveredLink, setHoveredLink] = useState<string | null>(null);
  const pathname = usePathname();

  // Update current app based on the appName prop
  const updatedLinks = crossAppLinks.map(link => ({
    ...link,
    current: link.name === appName
  }));

  // Close menu on escape key
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && menuOpen) {
        setMenuOpen(false);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [menuOpen]);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuOpen && !(event.target as Element).closest('.navigation-menu')) {
        setMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [menuOpen]);

  return (
    <>
      <nav className="fixed top-0 left-0 w-full px-8 py-6 flex items-start justify-between z-50 mix-blend-difference">
        {/* Logo */}
        <Link 
          href="/" 
          className="text-white font-medium text-lg transition-all duration-300 hover:text-orange-500 hover:drop-shadow-[0_0_6px_rgba(244,78,0,0.6)] focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 focus:ring-offset-black"
        >
          <span>{appName}</span>
        </Link>

        {/* Menu Toggle Button */}
        <button
          type="button"
          className="flex flex-col items-center gap-3 cursor-pointer absolute left-1/2 transform -translate-x-1/2 bg-transparent border-0 group"
          aria-haspopup="true"
          aria-expanded={menuOpen}
          aria-controls="site-navigation-menu"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          <div className="w-36 h-1 bg-white rounded-full transition-all duration-300 group-hover:w-40"></div>
          <span className="text-xs tracking-widest text-white">
            {menuOpen ? 'CLOSE' : 'MENU'}
          </span>
        </button>

        {/* Contact Link - Hidden on mobile */}
        <Link 
          href="/contact" 
          className="text-white font-medium text-lg transition-all duration-300 hover:text-orange-500 hover:drop-shadow-[0_0_6px_rgba(244,78,0,0.6)] focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 focus:ring-offset-black hidden md:block"
        >
          <span>Contact</span>
        </Link>
      </nav>

      {/* Navigation Menu Overlay */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            className="fixed inset-0 z-40 bg-black/20 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={() => setMenuOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Navigation Menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            className="navigation-menu fixed z-50 w-[calc(100%-20px)] top-2.5 left-2.5 rounded-lg bg-gray-900/60 backdrop-blur-xl flex flex-col items-center justify-end py-36 px-0"
            initial={{ clipPath: 'inset(0% 0% 100% 0%)', opacity: 0 }}
            animate={{ clipPath: 'inset(0% 0% 0% 0%)', opacity: 1 }}
            exit={{ clipPath: 'inset(0% 0% 100% 0%)', opacity: 0 }}
            transition={{ duration: 0.8, ease: [0.19, 1, 0.22, 1] }}
            role="dialog"
            aria-modal="true"
            aria-labelledby="site-navigation-menu-heading"
          >
            <h2 id="site-navigation-menu-heading" className="sr-only">
              Main navigation
            </h2>
            
            <ul className="flex flex-col items-center gap-4">
              {updatedLinks.map((link, index) => (
                <motion.li
                  key={link.name}
                  className="overflow-hidden"
                  initial={{ y: '-100%' }}
                  animate={{ y: '0%' }}
                  exit={{ y: '-100%' }}
                  transition={{ 
                    duration: 0.8, 
                    delay: index * 0.05,
                    ease: [0.19, 1, 0.22, 1] 
                  }}
                >
                  <a
                    href={link.path}
                    target={link.external ? "_blank" : "_self"}
                    rel={link.external ? "noopener noreferrer" : undefined}
                    className={`text-4xl md:text-5xl lg:text-6xl font-light uppercase leading-tight block transition-all duration-300 ${
                      link.current 
                        ? 'text-orange-500' 
                        : hoveredLink === link.name 
                          ? 'text-white' 
                          : 'text-white/30'
                    } hover:text-white focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 focus:ring-offset-gray-900`}
                    onMouseEnter={() => setHoveredLink(link.name)}
                    onMouseLeave={() => setHoveredLink(null)}
                  >
                    {link.name}
                  </a>
                </motion.li>
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>

      {/* App Description Banner */}
      {appDescription && (
        <div className="fixed top-20 left-0 w-full z-30 px-8">
          <div className="bg-gray-900/80 backdrop-blur-sm rounded-lg px-6 py-3 max-w-2xl">
            <p className="text-white/80 text-sm font-medium">
              {appDescription}
            </p>
          </div>
        </div>
      )}
    </>
  );
}