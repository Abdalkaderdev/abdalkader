'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Menu, 
  X, 
  User, 
  Settings, 
  LogOut, 
  LogIn, 
  Home, 
  BookOpen, 
  Code, 
  Layers,
  Globe,
  ChevronDown,
  Bell,
  Search,
  Moon,
  Sun,
  Monitor
} from 'lucide-react';
import { InteractiveButton } from '@/components/interactions/InteractiveButton';
import { useEcosystemAuth } from '@/contexts/EcosystemAuthContext';
import { ECOSYSTEM_DOMAINS, getCurrentDomain, getDomainUrl, isCurrentDomain } from '@/lib/ecosystem';
import { useAccessibility } from '@/hooks/useAccessibility';

interface UnifiedHeaderProps {
  className?: string;
  showSearch?: boolean;
  showNotifications?: boolean;
  showUserMenu?: boolean;
  showEcosystemMap?: boolean;
}

export const UnifiedHeader: React.FC<UnifiedHeaderProps> = ({
  className = '',
  showSearch = true,
  showNotifications = true,
  showUserMenu = true,
  showEcosystemMap = true,
}) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isEcosystemMapOpen, setIsEcosystemMapOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentDomain, setCurrentDomain] = useState(getCurrentDomain());
  
  const { 
    authState, 
    preferences, 
    logout, 
    updatePreferences,
    isLoading 
  } = useEcosystemAuth();
  
  const { 
    isMobile, 
    isTablet, 
    getResponsiveClasses,
    getTouchTargetSize,
    announceToScreenReader
  } = useAccessibility();

  const userMenuRef = useRef<HTMLDivElement>(null);
  const ecosystemMapRef = useRef<HTMLDivElement>(null);

  // Close menus when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setIsUserMenuOpen(false);
      }
      if (ecosystemMapRef.current && !ecosystemMapRef.current.contains(event.target as Node)) {
        setIsEcosystemMapOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Update current domain when route changes
  useEffect(() => {
    setCurrentDomain(getCurrentDomain());
  }, []);

  // Handle search
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      // In a real implementation, this would search across all domains
      announceToScreenReader(`Searching for: ${searchQuery}`);
    }
  };

  // Handle domain navigation
  const navigateToDomain = (subdomain: string) => {
    const url = getDomainUrl(subdomain);
    window.location.href = url;
  };

  // Handle theme toggle
  const handleThemeToggle = () => {
    const themes = ['light', 'dark', 'auto'];
    const currentIndex = themes.indexOf(preferences.theme);
    const nextTheme = themes[(currentIndex + 1) % themes.length] as 'light' | 'dark' | 'auto';
    
    updatePreferences({ theme: nextTheme });
    announceToScreenReader(`Theme changed to ${nextTheme}`);
  };

  // Get theme icon
  const getThemeIcon = () => {
    switch (preferences.theme) {
      case 'light': return <Sun className="w-4 h-4" />;
      case 'dark': return <Moon className="w-4 h-4" />;
      case 'auto': return <Monitor className="w-4 h-4" />;
      default: return <Monitor className="w-4 h-4" />;
    }
  };

  // Get responsive classes
  const getHeaderClasses = () => {
    return getResponsiveClasses({
      mobile: 'px-4 py-3',
      tablet: 'px-6 py-4',
      desktop: 'px-8 py-6',
    });
  };

  return (
    <header className={`bg-black/80 backdrop-blur-lg border-b border-orange-500/20 sticky top-0 z-50 ${getHeaderClasses()} ${className}`}>
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between">
          {/* Logo and Brand */}
          <motion.div 
            className="flex items-center gap-4"
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.2 }}
          >
            <a 
              href={getDomainUrl('www')}
              className="flex items-center gap-3"
              aria-label="Go to main portfolio"
            >
              <div className="w-10 h-10 rounded-lg bg-gradient-to-r from-orange-500 to-orange-400 flex items-center justify-center">
                <span className="text-black font-bold text-lg">A</span>
              </div>
              <div className="hidden sm:block">
                <h1 className="portfolio-medium-text text-white">Abdalkader</h1>
                <p className="portfolio-small-text text-orange-400">
                  {currentDomain?.name || 'Ecosystem'}
                </p>
              </div>
            </a>
          </motion.div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-6">
            {ECOSYSTEM_DOMAINS.filter(domain => domain.status === 'active').map((domain) => (
              <motion.a
                key={domain.id}
                href={getDomainUrl(domain.subdomain)}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-all ${
                  isCurrentDomain(domain.subdomain)
                    ? 'bg-orange-500/20 text-orange-400'
                    : 'text-gray-300 hover:text-white hover:bg-gray-800/50'
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                aria-current={isCurrentDomain(domain.subdomain) ? 'page' : undefined}
              >
                <span className="text-lg">{domain.icon}</span>
                <span className="portfolio-small-text">{domain.name}</span>
              </motion.a>
            ))}
          </nav>

          {/* Right Side Actions */}
          <div className="flex items-center gap-3">
            {/* Search */}
            {showSearch && (
              <form onSubmit={handleSearch} className="hidden md:block">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search ecosystem..."
                    className="bg-gray-800/50 border border-gray-600 rounded-lg pl-10 pr-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-orange-500 transition-colors w-64"
                    aria-label="Search across ecosystem"
                  />
                </div>
              </form>
            )}

            {/* Ecosystem Map */}
            {showEcosystemMap && (
              <div className="relative" ref={ecosystemMapRef}>
                <InteractiveButton
                  onClick={() => setIsEcosystemMapOpen(!isEcosystemMapOpen)}
                  variant="ghost"
                  size="sm"
                  className={`${getTouchTargetSize()}`}
                  aria-label="Open ecosystem map"
                >
                  <Globe className="w-4 h-4" />
                </InteractiveButton>

                <AnimatePresence>
                  {isEcosystemMapOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      transition={{ duration: 0.2 }}
                      className="absolute right-0 top-full mt-2 w-80 bg-black/90 backdrop-blur-lg rounded-xl border border-orange-500/30 p-4"
                    >
                      <h3 className="portfolio-medium-text text-white mb-3">Ecosystem Map</h3>
                      <div className="space-y-2">
                        {ECOSYSTEM_DOMAINS.map((domain) => (
                          <motion.button
                            key={domain.id}
                            onClick={() => {
                              navigateToDomain(domain.subdomain);
                              setIsEcosystemMapOpen(false);
                            }}
                            className={`w-full flex items-center gap-3 p-3 rounded-lg transition-all ${
                              isCurrentDomain(domain.subdomain)
                                ? 'bg-orange-500/20 border border-orange-500/30'
                                : 'hover:bg-gray-800/50'
                            }`}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                          >
                            <span className="text-lg">{domain.icon}</span>
                            <div className="flex-1 text-left">
                              <p className="portfolio-small-text text-white">{domain.name}</p>
                              <p className="text-xs text-gray-400">{domain.description}</p>
                            </div>
                            <div className={`w-2 h-2 rounded-full ${
                              domain.status === 'active' ? 'bg-green-400' :
                              domain.status === 'development' ? 'bg-yellow-400' :
                              domain.status === 'maintenance' ? 'bg-orange-400' : 'bg-gray-400'
                            }`} />
                          </motion.button>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}

            {/* Theme Toggle */}
            <InteractiveButton
              onClick={handleThemeToggle}
              variant="ghost"
              size="sm"
              className={`${getTouchTargetSize()}`}
              aria-label={`Switch to ${preferences.theme === 'light' ? 'dark' : preferences.theme === 'dark' ? 'auto' : 'light'} theme`}
            >
              {getThemeIcon()}
            </InteractiveButton>

            {/* Notifications */}
            {showNotifications && authState.isAuthenticated && (
              <InteractiveButton
                variant="ghost"
                size="sm"
                className={`${getTouchTargetSize()}`}
                aria-label="Notifications"
              >
                <Bell className="w-4 h-4" />
              </InteractiveButton>
            )}

            {/* User Menu */}
            {showUserMenu && (
              <div className="relative" ref={userMenuRef}>
                {authState.isAuthenticated ? (
                  <InteractiveButton
                    onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                    variant="ghost"
                    size="sm"
                    className={`${getTouchTargetSize()}`}
                    aria-label="User menu"
                  >
                    {authState.user?.avatar ? (
                      <img 
                        src={authState.user.avatar} 
                        alt={authState.user.name}
                        className="w-6 h-6 rounded-full"
                      />
                    ) : (
                      <User className="w-4 h-4" />
                    )}
                  </InteractiveButton>
                ) : (
                  <InteractiveButton
                    onClick={() => {/* Handle login */}}
                    variant="primary"
                    size="sm"
                    className={`${getTouchTargetSize()}`}
                    aria-label="Login"
                  >
                    <LogIn className="w-4 h-4 mr-2" />
                    Login
                  </InteractiveButton>
                )}

                <AnimatePresence>
                  {isUserMenuOpen && authState.isAuthenticated && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      transition={{ duration: 0.2 }}
                      className="absolute right-0 top-full mt-2 w-64 bg-black/90 backdrop-blur-lg rounded-xl border border-orange-500/30 p-4"
                    >
                      <div className="flex items-center gap-3 mb-4 pb-4 border-b border-gray-700">
                        {authState.user?.avatar && (
                          <img 
                            src={authState.user.avatar} 
                            alt={authState.user.name}
                            className="w-10 h-10 rounded-full"
                          />
                        )}
                        <div>
                          <p className="portfolio-small-text text-white">{authState.user?.name}</p>
                          <p className="text-xs text-gray-400">{authState.user?.email}</p>
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <button className="w-full flex items-center gap-3 p-2 rounded-lg hover:bg-gray-800/50 transition-colors">
                          <Settings className="w-4 h-4" />
                          <span className="portfolio-small-text text-gray-300">Settings</span>
                        </button>
                        <button 
                          onClick={logout}
                          className="w-full flex items-center gap-3 p-2 rounded-lg hover:bg-gray-800/50 transition-colors"
                        >
                          <LogOut className="w-4 h-4" />
                          <span className="portfolio-small-text text-gray-300">Logout</span>
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}

            {/* Mobile Menu Toggle */}
            <InteractiveButton
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              variant="ghost"
              size="sm"
              className={`lg:hidden ${getTouchTargetSize()}`}
              aria-label="Toggle mobile menu"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </InteractiveButton>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="lg:hidden mt-4 pt-4 border-t border-gray-700"
            >
              <nav className="space-y-2">
                {ECOSYSTEM_DOMAINS.filter(domain => domain.status === 'active').map((domain) => (
                  <a
                    key={domain.id}
                    href={getDomainUrl(domain.subdomain)}
                    className={`flex items-center gap-3 p-3 rounded-lg transition-all ${
                      isCurrentDomain(domain.subdomain)
                        ? 'bg-orange-500/20 text-orange-400'
                        : 'text-gray-300 hover:text-white hover:bg-gray-800/50'
                    }`}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <span className="text-lg">{domain.icon}</span>
                    <div>
                      <p className="portfolio-small-text">{domain.name}</p>
                      <p className="text-xs text-gray-400">{domain.description}</p>
                    </div>
                  </a>
                ))}
              </nav>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
};

export default UnifiedHeader;