'use client';

import { useEffect, useState } from 'react';
// @ts-ignore - Direct import from source
import { GlobalNavigationHub } from '../../../../packages/ui/src/components/GlobalNavigationHub/GlobalNavigationHub';
// @ts-ignore
import type { RelatedContent } from '../../../../packages/ui/src/components/GlobalNavigationHub/GlobalNavigationHub';
// @ts-ignore
import { getCurrentSiteContext, getContextRelatedContent } from '../../../../packages/ui/src/lib/navigationContext';

export function GlobalNavigation() {
  const [currentSite, setCurrentSite] = useState(getCurrentSiteContext());
  const [relatedContent, setRelatedContent] = useState<RelatedContent[]>([]);

  useEffect(() => {
    const site = getCurrentSiteContext();
    setCurrentSite(site);

    if (site) {
      // Get related content based on current URL
      const pathname = typeof window !== 'undefined' ? window.location.pathname : '';
      const related = getContextRelatedContent(site.id, pathname);
      setRelatedContent(related);
    }
  }, []);

  if (!currentSite) return null;

  return (
    <GlobalNavigationHub
      currentSite={{
        id: currentSite.id,
        name: currentSite.name,
        url: currentSite.url,
        icon: currentSite.icon,
        color: currentSite.color,
      }}
      relatedContent={relatedContent}
      showContext={true}
    />
  );
}

