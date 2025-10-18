'use client';

import { useEffect, useState } from 'react';
import { ThemeManager } from '@abdalkader/bible-utils';

interface ThemeProviderProps {
  children: React.ReactNode;
}

export function ThemeProvider({ children }: ThemeProviderProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const themeManager = new ThemeManager();
    themeManager.initializeTheme();
  }, []);

  if (!mounted) {
    return <>{children}</>;
  }

  return <>{children}</>;
}
