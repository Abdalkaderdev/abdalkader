'use client';

import { useEffect, useState } from 'react';
import { GlobalFooter as UIGlobalFooter } from '../../../../packages/ui/src/components/GlobalFooter/GlobalFooter';
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

