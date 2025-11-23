import React, { createContext, useContext, useEffect, useState } from 'react';

// Theme types
export type Theme = 'dark' | 'light' | 'auto';
export type ColorScheme = 'portfolio' | 'blue' | 'green' | 'purple';

// User preferences interface
export interface UserPreferences {
  theme: Theme;
  colorScheme: ColorScheme;
  animationsEnabled: boolean;
  reducedMotion: boolean;
  fontSize: 'small' | 'medium' | 'large';
  language: string;
}

// Default preferences
const defaultPreferences: UserPreferences = {
  theme: 'auto',
  colorScheme: 'portfolio',
  animationsEnabled: true,
  reducedMotion: false,
  fontSize: 'medium',
  language: 'en',
};

// Theme context interface
interface ThemeContextType {
  preferences: UserPreferences;
  updatePreferences: (updates: Partial<UserPreferences>) => void;
  resetPreferences: () => void;
  currentTheme: 'dark' | 'light';
  isDarkMode: boolean;
}

// Create context
const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

// Storage key
const STORAGE_KEY = 'abdalkader-user-preferences';

// Theme provider component
export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [preferences, setPreferences] = useState<UserPreferences>(defaultPreferences);
  const [currentTheme, setCurrentTheme] = useState<'dark' | 'light'>('dark');

  // Load preferences from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        setPreferences(prev => ({ ...prev, ...parsed }));
      }
    } catch (error) {
      console.warn('Failed to load user preferences:', error);
    }
  }, []);

  // Detect system theme and apply preferences
  useEffect(() => {
    const detectTheme = () => {
      const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      
      let theme: 'dark' | 'light';
      
      if (preferences.theme === 'auto') {
        theme = systemPrefersDark ? 'dark' : 'light';
      } else {
        theme = preferences.theme;
      }
      
      setCurrentTheme(theme);
      
      // Apply theme to document
      document.documentElement.setAttribute('data-theme', theme);
      document.documentElement.setAttribute('data-color-scheme', preferences.colorScheme);
      
      // Apply font size
      document.documentElement.setAttribute('data-font-size', preferences.fontSize);
      
      // Apply motion preferences
      if (prefersReducedMotion || !preferences.animationsEnabled) {
        document.documentElement.setAttribute('data-reduced-motion', 'true');
      } else {
        document.documentElement.removeAttribute('data-reduced-motion');
      }
      
      // Apply color scheme CSS variables
      applyColorScheme(preferences.colorScheme);
    };

    detectTheme();

    // Listen for system theme changes
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    mediaQuery.addEventListener('change', detectTheme);
    
    // Listen for reduced motion changes
    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    motionQuery.addEventListener('change', detectTheme);

    return () => {
      mediaQuery.removeEventListener('change', detectTheme);
      motionQuery.removeEventListener('change', detectTheme);
    };
  }, [preferences]);

  // Save preferences to localStorage when they change
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(preferences));
    } catch (error) {
      console.warn('Failed to save user preferences:', error);
    }
  }, [preferences]);

  // Update preferences function
  const updatePreferences = (updates: Partial<UserPreferences>) => {
    setPreferences(prev => ({ ...prev, ...updates }));
  };

  // Reset preferences function
  const resetPreferences = () => {
    setPreferences(defaultPreferences);
  };

  // Apply color scheme CSS variables
  const applyColorScheme = (scheme: ColorScheme) => {
    const root = document.documentElement;
    
    switch (scheme) {
      case 'portfolio':
        root.style.setProperty('--primary-color', '#f44e00');
        root.style.setProperty('--primary-light', '#fa7300');
        root.style.setProperty('--primary-dark', '#d63384');
        break;
      case 'blue':
        root.style.setProperty('--primary-color', '#3b82f6');
        root.style.setProperty('--primary-light', '#60a5fa');
        root.style.setProperty('--primary-dark', '#2563eb');
        break;
      case 'green':
        root.style.setProperty('--primary-color', '#10b981');
        root.style.setProperty('--primary-light', '#34d399');
        root.style.setProperty('--primary-dark', '#059669');
        break;
      case 'purple':
        root.style.setProperty('--primary-color', '#8b5cf6');
        root.style.setProperty('--primary-light', '#a78bfa');
        root.style.setProperty('--primary-dark', '#7c3aed');
        break;
    }
  };

  const contextValue: ThemeContextType = {
    preferences,
    updatePreferences,
    resetPreferences,
    currentTheme,
    isDarkMode: currentTheme === 'dark',
  };

  return (
    <ThemeContext.Provider value={contextValue}>
      {children}
    </ThemeContext.Provider>
  );
};

// Hook to use theme context
export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

// Utility function to get CSS variables
export const getThemeVariables = (scheme: ColorScheme) => {
  const schemes = {
    portfolio: {
      primary: '#f44e00',
      primaryLight: '#fa7300',
      primaryDark: '#d63384',
    },
    blue: {
      primary: '#3b82f6',
      primaryLight: '#60a5fa',
      primaryDark: '#2563eb',
    },
    green: {
      primary: '#10b981',
      primaryLight: '#34d399',
      primaryDark: '#059669',
    },
    purple: {
      primary: '#8b5cf6',
      primaryLight: '#a78bfa',
      primaryDark: '#7c3aed',
    },
  };
  
  return schemes[scheme];
};
