'use client';

import { useEffect, useState } from 'react';
// @ts-expect-error - Direct import from source until package is built
import { GlobalFooter as UIGlobalFooter } from '../../../../packages/ui/src/components/GlobalFooter/GlobalFooter';
// @ts-expect-error
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

