'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
// @ts-expect-error - Direct import from source until package is built
import { GlobalNavigationHub } from '../../../../packages/ui/src/components/GlobalNavigationHub/GlobalNavigationHub';
// @ts-expect-error
import type { RelatedContent } from '../../../../packages/ui/src/components/GlobalNavigationHub/GlobalNavigationHub';
// @ts-expect-error
import { getCurrentSiteContext, getContextRelatedContent } from '../../../../packages/ui/src/lib/navigationContext';

export function GlobalNavigation() {
  const router = useRouter();
  const [currentSite, setCurrentSite] = useState(getCurrentSiteContext());
  const [relatedContent, setRelatedContent] = useState<RelatedContent[]>([]);

  useEffect(() => {
    const site = getCurrentSiteContext();
    setCurrentSite(site);

    if (site) {
      const related = getContextRelatedContent(site.id, router.pathname);
      setRelatedContent(related);
    }
  }, [router.pathname]);

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

