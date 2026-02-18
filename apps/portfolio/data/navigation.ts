export interface NavLink {
  name: string;
  path: string;
}

export const MAIN_NAVIGATION: NavLink[] = [
  { name: 'Home', path: '/' },
  { name: 'About', path: '/about' },
  { name: 'Projects', path: '/projects' },
  { name: 'Contact', path: '/contact' },
] as const;

export const SECONDARY_NAVIGATION: NavLink[] = [
  { name: 'Guidance', path: '/guidance' },
  { name: 'Prayer', path: '/prayer' },
] as const;

export const ALL_NAVIGATION = [...MAIN_NAVIGATION, ...SECONDARY_NAVIGATION];

// Combined navigation in display order (Home, About, Projects, Guidance, Prayer, Contact)
export const NAVIGATION_LINKS = [
  { name: 'Home', path: '/' },
  { name: 'About', path: '/about' },
  { name: 'Projects', path: '/projects' },
  { name: 'Guidance', path: '/guidance' },
  { name: 'Prayer', path: '/prayer' },
  { name: 'Contact', path: '/contact' },
] as const;

export type NavigationPath = typeof NAVIGATION_LINKS[number]['path'];
