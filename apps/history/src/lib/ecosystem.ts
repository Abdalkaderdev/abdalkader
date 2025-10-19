export interface EcosystemDomain {
  id: string;
  name: string;
  subdomain: string;
  domain: string;
  description: string;
  icon: string;
  color: string;
  status: 'active' | 'development' | 'maintenance' | 'planned';
  features: string[];
  lastUpdated: string;
  analytics: {
    visitors: number;
    pageViews: number;
    bounceRate: number;
  };
}

export interface UserPreferences {
  theme: 'light' | 'dark' | 'auto';
  language: string;
  notifications: {
    email: boolean;
    push: boolean;
    updates: boolean;
  };
  accessibility: {
    reducedMotion: boolean;
    highContrast: boolean;
    largeText: boolean;
  };
  privacy: {
    analytics: boolean;
    cookies: boolean;
    tracking: boolean;
  };
}

export interface AuthState {
  isAuthenticated: boolean;
  user: {
    id: string;
    email: string;
    name: string;
    avatar?: string;
    role: 'user' | 'admin' | 'developer';
  } | null;
  permissions: string[];
  lastLogin: string;
}

export const ECOSYSTEM_DOMAINS: EcosystemDomain[] = [
  {
    id: 'main',
    name: 'Portfolio',
    subdomain: 'www',
    domain: 'abdalkader.dev',
    description: 'Personal portfolio and professional showcase',
    icon: '👨‍💻',
    color: '#f44e00',
    status: 'active',
    features: ['Portfolio', 'Resume', 'Contact', 'Projects'],
    lastUpdated: '2024-01-15',
    analytics: {
      visitors: 1250,
      pageViews: 3200,
      bounceRate: 0.35,
    },
  },
  {
    id: 'storybook',
    name: 'Storybook',
    subdomain: 'storybook',
    domain: 'abdalkader.dev',
    description: 'Component library and design system documentation',
    icon: '📚',
    color: '#ff6b35',
    status: 'active',
    features: ['Components', 'Design System', 'Documentation', 'Playground'],
    lastUpdated: '2024-01-14',
    analytics: {
      visitors: 890,
      pageViews: 2100,
      bounceRate: 0.28,
    },
  },
  {
    id: 'blog',
    name: 'Blog',
    subdomain: 'blog',
    domain: 'abdalkader.dev',
    description: 'Technical articles and personal insights',
    icon: '✍️',
    color: '#4ecdc4',
    status: 'active',
    features: ['Articles', 'Tutorials', 'Thoughts', 'RSS'],
    lastUpdated: '2024-01-13',
    analytics: {
      visitors: 2100,
      pageViews: 5800,
      bounceRate: 0.42,
    },
  },
  {
    id: 'history',
    name: 'Programming Museum',
    subdomain: 'history',
    domain: 'abdalkader.dev',
    description: 'Interactive journey through programming language history',
    icon: '🏛️',
    color: '#45b7d1',
    status: 'active',
    features: ['Timeline', 'Interactive', 'AI Assistant', 'Exhibitions'],
    lastUpdated: '2024-01-16',
    analytics: {
      visitors: 3200,
      pageViews: 8900,
      bounceRate: 0.31,
    },
  },
  {
    id: 'tools',
    name: 'Dev Tools',
    subdomain: 'tools',
    domain: 'abdalkader.dev',
    description: 'Collection of developer utilities and tools',
    icon: '🛠️',
    color: '#96ceb4',
    status: 'development',
    features: ['Utilities', 'Converters', 'Generators', 'APIs'],
    lastUpdated: '2024-01-10',
    analytics: {
      visitors: 450,
      pageViews: 1200,
      bounceRate: 0.38,
    },
  },
  {
    id: 'api',
    name: 'API Hub',
    subdomain: 'api',
    domain: 'abdalkader.dev',
    description: 'RESTful APIs and GraphQL endpoints',
    icon: '🔌',
    color: '#feca57',
    status: 'development',
    features: ['REST API', 'GraphQL', 'Webhooks', 'Documentation'],
    lastUpdated: '2024-01-08',
    analytics: {
      visitors: 320,
      pageViews: 850,
      bounceRate: 0.25,
    },
  },
  {
    id: 'neuro',
    name: 'Neuro Interface',
    subdomain: 'neuro',
    domain: 'abdalkader.dev',
    description: 'Brain-Computer Interface web platform with real-time bio-signal processing',
    icon: '🧠',
    color: '#8b5cf6',
    status: 'active',
    features: ['EEG Processing', 'BCI Control', 'Neuro Feedback', 'Real-time Visualization'],
    lastUpdated: '2024-01-17',
    analytics: {
      visitors: 1800,
      pageViews: 4200,
      bounceRate: 0.28,
    },
  },
  {
    id: 'therapy',
    name: 'AI Therapy',
    subdomain: 'therapy',
    domain: 'abdalkader.dev',
    description: 'Privacy-first AI therapy platform with empathetic conversations',
    icon: '💚',
    color: '#10b981',
    status: 'active',
    features: ['AI Chat', 'Mood Tracking', 'Crisis Support', 'Encrypted Storage'],
    lastUpdated: '2024-01-17',
    analytics: {
      visitors: 2500,
      pageViews: 6800,
      bounceRate: 0.22,
    },
  },
];

export const ECOSYSTEM_CONFIG = {
  name: 'Abdalkader Ecosystem',
  version: '1.0.0',
  description: 'A unified platform for development, learning, and creativity',
  domains: ECOSYSTEM_DOMAINS,
  sharedFeatures: [
    'Unified Authentication',
    'Cross-Domain Navigation',
    'Shared Component Library',
    'Consistent Design System',
    'Real-time Analytics',
    'Performance Monitoring',
  ],
  techStack: [
    'Next.js',
    'React',
    'TypeScript',
    'Tailwind CSS',
    'Framer Motion',
    'Vercel',
  ],
  social: {
    github: 'https://github.com/abdalkader',
    twitter: 'https://twitter.com/abdalkader',
    linkedin: 'https://linkedin.com/in/abdalkader',
    email: 'hello@abdalkader.dev',
  },
};

export const getCurrentDomain = (): EcosystemDomain | null => {
  if (typeof window === 'undefined') return null;
  
  const hostname = window.location.hostname;
  const subdomain = hostname.split('.')[0];
  
  return ECOSYSTEM_DOMAINS.find(domain => domain.subdomain === subdomain) || null;
};

export const getDomainUrl = (subdomain: string): string => {
  const protocol = typeof window !== 'undefined' && window.location.protocol === 'https:' ? 'https:' : 'https:';
  return `${protocol}//${subdomain}.abdalkader.dev`;
};

export const isCurrentDomain = (subdomain: string): boolean => {
  if (typeof window === 'undefined') return false;
  return window.location.hostname.startsWith(`${subdomain}.`);
};

export const getEcosystemStats = () => {
  const totalVisitors = ECOSYSTEM_DOMAINS.reduce((sum, domain) => sum + domain.analytics.visitors, 0);
  const totalPageViews = ECOSYSTEM_DOMAINS.reduce((sum, domain) => sum + domain.analytics.pageViews, 0);
  const averageBounceRate = ECOSYSTEM_DOMAINS.reduce((sum, domain) => sum + domain.analytics.bounceRate, 0) / ECOSYSTEM_DOMAINS.length;
  
  return {
    totalVisitors,
    totalPageViews,
    averageBounceRate,
    activeDomains: ECOSYSTEM_DOMAINS.filter(domain => domain.status === 'active').length,
    totalDomains: ECOSYSTEM_DOMAINS.length,
  };
};