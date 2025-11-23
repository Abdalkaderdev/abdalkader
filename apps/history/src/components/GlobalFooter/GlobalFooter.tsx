'use client';

import { useEffect, useState } from 'react';
// @ts-ignore - Direct import from source
import { GlobalFooter as UIGlobalFooter } from '../../../../packages/ui/src/components/GlobalFooter/GlobalFooter';
// @ts-ignore
import { getCurrentSiteContext } from '../../../../packages/ui/src/lib/navigationContext';

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

