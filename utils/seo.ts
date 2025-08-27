export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://abdalkader.dev';

export function buildCanonical(pathname: string): string {
  if (!pathname || pathname === '/') return SITE_URL;
  const normalized = pathname.endsWith('/') ? pathname.slice(0, -1) : pathname;
  return `${SITE_URL}${normalized}`;
}

