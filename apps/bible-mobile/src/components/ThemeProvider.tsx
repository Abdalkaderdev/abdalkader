import React, { useEffect } from 'react';
import { ThemeManager } from '@abdalkader/bible-utils';

interface ThemeProviderProps {
  children: React.ReactNode;
}

export function ThemeProvider({ children }: ThemeProviderProps) {
  useEffect(() => {
    const themeManager = new ThemeManager();
    themeManager.initializeTheme();
  }, []);

  return <>{children}</>;
}
