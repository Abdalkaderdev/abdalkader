'use client';

import { useEffect, useState } from 'react';
import { GlobalNavigationHub } from '@abdalkader/ui';
import type { RelatedContent } from '@abdalkader/ui';
import { getCurrentSiteContext, getContextRelatedContent } from '@abdalkader/ui';
import { usePathname } from 'next/navigation';

export function GlobalNavigation() {
  const pathname = usePathname();
  const [currentSite, setCurrentSite] = useState(getCurrentSiteContext());
  const [relatedContent, setRelatedContent] = useState<RelatedContent[]>([]);

  useEffect(() => {
    const site = getCurrentSiteContext();
    setCurrentSite(site);

    if (site) {
      const related = getContextRelatedContent(site.id, pathname);
      setRelatedContent(related);
    }
  }, [pathname]);

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

