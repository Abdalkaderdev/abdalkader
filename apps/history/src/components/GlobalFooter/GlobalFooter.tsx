'use client';

import { useEffect, useState } from 'react';
import { GlobalFooter as UIGlobalFooter } from '@abdalkader/ui';
import { getCurrentSiteContext } from '@abdalkader/ui';

export function GlobalFooter() {
  const [currentSite, setCurrentSite] = useState(getCurrentSiteContext());

  useEffect(() => {
    setCurrentSite(getCurrentSiteContext());
  }, []);

  return (
    <UIGlobalFooter
      currentSite={currentSite ? {
        id: currentSite.id,
        name: currentSite.name,
      } : undefined}
    />
  );
}

