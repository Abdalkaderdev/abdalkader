import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { motion, AnimatePresence } from 'framer-motion';
import { FiMenu, FiX, FiHome, FiCode, FiZap, FiBriefcase, FiUsers } from 'react-icons/fi';
import { useAccessibility } from '../../hooks/useAccessibility';

export default function LabNav() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const router = useRouter();
  const { announce } = useAccessibility();

  const navigationItems = [
    { name: 'Home', href: '/', icon: <FiHome className="w-5 h-5" /> },
    { name: 'Experiments', href: '/experiments', icon: <FiCode className="w-5 h-5" /> },
    { name: 'Playground', href: '/playground', icon: <FiZap className="w-5 h-5" /> },
    { name: 'Business', href: '/business', icon: <FiBriefcase className="w-5 h-5" /> },
  ];

  const handleMenuToggle = () => {
    setIsMenuOpen(!isMenuOpen);
    announce(isMenuOpen ? 'Menu closed' : 'Menu opened');
  };

  const handleLinkClick = (href: string) => {
    setIsMenuOpen(false);
    announce(`Navigating to ${href}`);
  };

  // Close menu on route change
  useEffect(() => {
    const handleRouteChange = () => {
      setIsMenuOpen(false);
    };

    router.events.on('routeChangeStart', handleRouteChange);
    return () => router.events.off('routeChangeStart', handleRouteChange);
  }, [router.events]);

  return (
    <nav className="bg-gray-900/95 backdrop-blur-sm border-b border-gray-800 sticky top-0 z-40">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center gap-2 text-white hover:text-orange-500 transition-colors"
            onClick={() => handleLinkClick('Home')}
          >
            <div className="w-8 h-8 bg-gradient-to-r from-orange-500 to-red-500 rounded-lg flex items-center justify-center">
              <FiCode className="w-5 h-5 text-black" />
            </div>
            <span className="font-semibold" style={{ fontFamily: 'var(--font-pp-medium)' }}>
              AI Lab
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-1">
            {navigationItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                  router.pathname === item.href
                    ? 'bg-orange-500 text-black'
                    : 'text-gray-300 hover:text-white hover:bg-gray-800'
                }`}
                onClick={() => handleLinkClick(item.name)}
              >
                {item.icon}
                <span className="text-sm font-medium" style={{ fontFamily: 'var(--font-pp-regular)' }}>
                  {item.name}
                </span>
              </Link>
            ))}
          </div>

          {/* CTA Button */}
          <div className="hidden md:flex items-center gap-4">
            <a
              href="mailto:hello@abdalkader.dev"
              className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-black rounded-lg font-semibold transition-colors text-sm"
              style={{ fontFamily: 'var(--font-pp-medium)' }}
            >
              Contact
            </a>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={handleMenuToggle}
            className="md:hidden p-2 text-gray-300 hover:text-white transition-colors"
            aria-label="Toggle menu"
            aria-expanded={isMenuOpen}
          >
            {isMenuOpen ? <FiX className="w-6 h-6" /> : <FiMenu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden border-t border-gray-800"
            >
              <div className="py-4 space-y-2">
                {navigationItems.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                      router.pathname === item.href
                        ? 'bg-orange-500 text-black'
                        : 'text-gray-300 hover:text-white hover:bg-gray-800'
                    }`}
                    onClick={() => handleLinkClick(item.name)}
                  >
                    {item.icon}
                    <span className="font-medium" style={{ fontFamily: 'var(--font-pp-regular)' }}>
                      {item.name}
                    </span>
                  </Link>
                ))}
                
                <div className="pt-4 border-t border-gray-800">
                  <a
                    href="mailto:hello@abdalkader.dev"
                    className="flex items-center gap-3 px-4 py-3 bg-orange-500 text-black rounded-lg font-semibold transition-colors"
                    style={{ fontFamily: 'var(--font-pp-medium)' }}
                  >
                    <FiUsers className="w-5 h-5" />
                    Contact Me
                  </a>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </nav>
  );
}