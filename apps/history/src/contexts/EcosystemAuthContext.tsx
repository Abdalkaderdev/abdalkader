'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { AuthState, UserPreferences, ECOSYSTEM_CONFIG } from '@/lib/ecosystem';

interface EcosystemAuthContextType {
  authState: AuthState;
  preferences: UserPreferences;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  updatePreferences: (preferences: Partial<UserPreferences>) => void;
  syncAcrossDomains: () => void;
  hasPermission: (permission: string) => boolean;
  isEcosystemAdmin: () => boolean;
}

const EcosystemAuthContext = createContext<EcosystemAuthContextType | undefined>(undefined);

// Storage keys are derived from environment to prevent hardcoding sensitive identifiers
const getStoragePrefix = () => {
  // Use environment variable if available, otherwise use a hash of the domain
  if (typeof window !== 'undefined') {
    const domain = window.location.hostname;
    // Simple hash for consistent key generation
    const hash = domain.split('').reduce((a, b) => {
      a = ((a << 5) - a) + b.charCodeAt(0);
      return a & a;
    }, 0);
    return `ae_${Math.abs(hash).toString(36)}`;
  }
  return 'ae_default';
};

const createStorageKeys = () => {
  const prefix = getStoragePrefix();
  return {
    AUTH: `${prefix}_auth`,
    PREFERENCES: `${prefix}_prefs`,
    SYNC_TOKEN: `${prefix}_sync`,
  };
};

// Lazy initialization to handle SSR
let STORAGE_KEYS: ReturnType<typeof createStorageKeys> | null = null;
const getStorageKeys = () => {
  if (!STORAGE_KEYS && typeof window !== 'undefined') {
    STORAGE_KEYS = createStorageKeys();
  }
  return STORAGE_KEYS || { AUTH: '', PREFERENCES: '', SYNC_TOKEN: '' };
};

const DEFAULT_PREFERENCES: UserPreferences = {
  theme: 'auto',
  language: 'en',
  notifications: {
    email: true,
    push: false,
    updates: true,
  },
  accessibility: {
    reducedMotion: false,
    highContrast: false,
    largeText: false,
  },
  privacy: {
    analytics: true,
    cookies: true,
    tracking: false,
  },
};

const DEFAULT_AUTH_STATE: AuthState = {
  isAuthenticated: false,
  user: null,
  permissions: [],
  lastLogin: '',
};

export const EcosystemAuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [authState, setAuthState] = useState<AuthState>(DEFAULT_AUTH_STATE);
  const [preferences, setPreferences] = useState<UserPreferences>(DEFAULT_PREFERENCES);
  const [isLoading, setIsLoading] = useState(true);

  // Load data from localStorage on mount
  useEffect(() => {
    const loadStoredData = () => {
      try {
        // Load auth state
        const storedAuth = localStorage.getItem(getStorageKeys().AUTH);
        if (storedAuth) {
          const parsedAuth = JSON.parse(storedAuth);
          // Check if auth is still valid (not expired)
          if (parsedAuth.expiresAt && new Date(parsedAuth.expiresAt) > new Date()) {
            setAuthState(parsedAuth);
          } else {
            // Auth expired, clear it
            localStorage.removeItem(getStorageKeys().AUTH);
          }
        }

        // Load preferences
        const storedPreferences = localStorage.getItem(getStorageKeys().PREFERENCES);
        if (storedPreferences) {
          setPreferences(JSON.parse(storedPreferences));
        }
      } catch (error) {
        console.error('Error loading stored data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadStoredData();
  }, []);

  // Save auth state to localStorage
  const saveAuthState = useCallback((newAuthState: AuthState) => {
    try {
      const authWithExpiry = {
        ...newAuthState,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days
      };
      localStorage.setItem(getStorageKeys().AUTH, JSON.stringify(authWithExpiry));
      setAuthState(newAuthState);
    } catch (error) {
      console.error('Error saving auth state:', error);
    }
  }, []);

  // Save preferences to localStorage
  const savePreferences = useCallback((newPreferences: UserPreferences) => {
    try {
      localStorage.setItem(getStorageKeys().PREFERENCES, JSON.stringify(newPreferences));
      setPreferences(newPreferences);
    } catch (error) {
      console.error('Error saving preferences:', error);
    }
  }, []);

  // Login function
  const login = useCallback(async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    
    try {
      // In a real implementation, this would call your authentication API
      // For now, we'll simulate a login process
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock authentication - replace with real API call
      if (email && password) {
        const mockUser = {
          id: 'user_123',
          email,
          name: email.split('@')[0],
          avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${email}`,
          role: 'user' as const,
        };

        const newAuthState: AuthState = {
          isAuthenticated: true,
          user: mockUser,
          permissions: ['read', 'write', 'comment'],
          lastLogin: new Date().toISOString(),
        };

        saveAuthState(newAuthState);
        
        // Sync across domains
        syncAcrossDomains();
        
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [saveAuthState]);

  // Logout function
  const logout = useCallback(() => {
    setAuthState(DEFAULT_AUTH_STATE);
    localStorage.removeItem(getStorageKeys().AUTH);
    
    // Sync across domains
    syncAcrossDomains();
  }, []);

  // Update preferences
  const updatePreferences = useCallback((newPreferences: Partial<UserPreferences>) => {
    const updatedPreferences = { ...preferences, ...newPreferences };
    savePreferences(updatedPreferences);
    
    // Apply theme changes immediately
    if (newPreferences.theme) {
      applyTheme(newPreferences.theme);
    }
    
    // Sync across domains
    syncAcrossDomains();
  }, [preferences, savePreferences]);

  // Apply theme to document
  const applyTheme = useCallback((theme: string) => {
    if (typeof document !== 'undefined') {
      const root = document.documentElement;
      root.setAttribute('data-theme', theme);
      
      if (theme === 'dark') {
        root.classList.add('dark');
      } else if (theme === 'light') {
        root.classList.remove('dark');
      } else {
        // Auto theme - follow system preference
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        if (prefersDark) {
          root.classList.add('dark');
        } else {
          root.classList.remove('dark');
        }
      }
    }
  }, []);

  // Sync data across domains using postMessage
  const syncAcrossDomains = useCallback(() => {
    const syncData = {
      auth: authState,
      preferences,
      timestamp: Date.now(),
    };

    // Send to all subdomains
    ECOSYSTEM_CONFIG.domains.forEach(domain => {
      if (domain.status === 'active') {
        const targetOrigin = `https://${domain.subdomain}.abdalkader.dev`;
        window.postMessage({
          type: 'ABDALKADER_ECOSYSTEM_SYNC',
          data: syncData,
        }, targetOrigin);
      }
    });

    // Also store in localStorage for same-domain access
    localStorage.setItem(getStorageKeys().SYNC_TOKEN, JSON.stringify(syncData));
  }, [authState, preferences]);

  // Listen for cross-domain sync messages
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      // Verify origin for security
      const allowedOrigins = ECOSYSTEM_CONFIG.domains
        .filter(domain => domain.status === 'active')
        .map(domain => `https://${domain.subdomain}.abdalkader.dev`);
      
      if (!allowedOrigins.includes(event.origin)) return;

      if (event.data?.type === 'ABDALKADER_ECOSYSTEM_SYNC') {
        const { auth, preferences: newPreferences } = event.data.data;
        
        if (auth && auth.isAuthenticated) {
          setAuthState(auth);
        }
        
        if (newPreferences) {
          setPreferences(newPreferences);
          applyTheme(newPreferences.theme);
        }
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [applyTheme]);

  // Check permissions
  const hasPermission = useCallback((permission: string): boolean => {
    return authState.permissions.includes(permission);
  }, [authState.permissions]);

  // Check if user is ecosystem admin
  const isEcosystemAdmin = useCallback((): boolean => {
    return authState.user?.role === 'admin' || authState.user?.role === 'developer';
  }, [authState.user?.role]);

  // Apply initial theme
  useEffect(() => {
    applyTheme(preferences.theme);
  }, [preferences.theme, applyTheme]);

  const value: EcosystemAuthContextType = {
    authState,
    preferences,
    isLoading,
    login,
    logout,
    updatePreferences,
    syncAcrossDomains,
    hasPermission,
    isEcosystemAdmin,
  };

  return (
    <EcosystemAuthContext.Provider value={value}>
      {children}
    </EcosystemAuthContext.Provider>
  );
};

export const useEcosystemAuth = (): EcosystemAuthContextType => {
  const context = useContext(EcosystemAuthContext);
  if (context === undefined) {
    throw new Error('useEcosystemAuth must be used within an EcosystemAuthProvider');
  }
  return context;
};

export default EcosystemAuthContext;