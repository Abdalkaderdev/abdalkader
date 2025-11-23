/**
 * Unified Project Registry
 * 
 * Central registry for all projects across the ecosystem.
 * Each project has a unique ID that links to resources across:
 * - Portfolio (project pages)
 * - History (development timeline)
 * - Storybook (components used)
 * - Docs (API documentation)
 * - Blog (related posts)
 */

export interface ProjectComponent {
  name: string;
  storybookPath: string;
  description?: string;
}

export interface ProjectDocumentation {
  section: string;
  url: string;
  title: string;
  type: 'api' | 'guide' | 'overview' | 'tutorial';
}

export interface ProjectBlogPost {
  slug: string;
  title: string;
  url: string;
  date: string;
  excerpt?: string;
}

export interface ProjectTimelineEvent {
  id: string;
  date: string;
  title: string;
  description: string;
  type: 'milestone' | 'release' | 'update' | 'feature';
}

export interface UnifiedProject {
  id: string; // Unique project ID (e.g., 'quantum-animation-system')
  slug: string; // URL slug (matches portfolio slug)
  title: string;
  description: string;
  
  // Cross-property links
  portfolio: {
    url: string;
    slug: string;
  };
  
  history: {
    milestoneId?: string; // ID in milestones.ts
    timelineEvents?: ProjectTimelineEvent[];
    url?: string;
  };
  
  storybook: {
    components: ProjectComponent[];
    url?: string;
  };
  
  docs: {
    sections: ProjectDocumentation[];
    baseUrl?: string;
  };
  
  blog: {
    posts: ProjectBlogPost[];
  };
  
  // Metadata
  technologies: string[];
  category: string[];
  startDate: string;
  lastUpdated: string;
  status: 'active' | 'completed' | 'archived';
}

/**
 * Central Project Registry
 * 
 * This is the single source of truth for project IDs and their
 * connections across all ecosystem properties.
 */
export const PROJECT_REGISTRY: Record<string, UnifiedProject> = {
  'quantum-animation-system': {
    id: 'quantum-animation-system',
    slug: 'quantum-animation-system',
    title: 'Quantum Animation System',
    description: 'Interactive playground demonstrating quantum physics principles through UI animations',
    portfolio: {
      url: 'https://abdalkader.dev/projects/quantum-animation-system',
      slug: 'quantum-animation-system',
    },
    history: {
      milestoneId: 'milestone-2025-01-quantum-animation',
      timelineEvents: [
        {
          id: 'quantum-1',
          date: '2025-01-01',
          title: 'Project Initiation',
          description: 'Started research into quantum physics principles and educational methodologies',
          type: 'milestone',
        },
        {
          id: 'quantum-2',
          date: '2025-01-10',
          title: 'Three.js Integration',
          description: 'Integrated Three.js for 3D particle systems and physics simulations',
          type: 'feature',
        },
        {
          id: 'quantum-3',
          date: '2025-01-15',
          title: 'Launch',
          description: 'Successfully launched the Quantum Animation System platform',
          type: 'release',
        },
      ],
      url: 'https://history.abdalkader.dev?milestone=milestone-2025-01-quantum-animation',
    },
    storybook: {
      components: [
        {
          name: 'Animation Components',
          storybookPath: 'design-system-animations',
          description: 'Animation and physics components used in the project',
        },
        {
          name: 'Particle System',
          storybookPath: 'components-particle-system',
          description: '3D particle system components',
        },
      ],
      url: 'https://storybook.abdalkader.dev',
    },
    docs: {
      sections: [
        {
          section: 'projects/quantum-animation-system',
          url: 'https://docs.abdalkader.dev/projects/quantum-animation-system',
          title: 'Quantum Animation System Documentation',
          type: 'overview',
        },
        {
          section: 'api/physics-simulation',
          url: 'https://docs.abdalkader.dev/api/physics-simulation',
          title: 'Physics Simulation API',
          type: 'api',
        },
      ],
      baseUrl: 'https://docs.abdalkader.dev',
    },
    blog: {
      posts: [
        {
          slug: 'quantum-animation-system-interactive-physics-playground',
          title: 'Quantum Animation System: Interactive Physics Playground',
          url: 'https://blog.abdalkader.dev/blog/quantum-animation-system-interactive-physics-playground',
          date: '2025-01-15',
          excerpt: 'Exploring quantum physics through interactive web animations',
        },
      ],
    },
    technologies: ['Next.js 15', 'TypeScript', 'Three.js', 'Framer Motion', 'GSAP'],
    category: ['Web Development', 'Interactive Animation', 'Physics Simulation'],
    startDate: '2025-01-01',
    lastUpdated: '2025-01-15',
    status: 'active',
  },
  
  'apple-tv-clone': {
    id: 'apple-tv-clone',
    slug: 'apple-tv-clone',
    title: 'Apple TV Clone',
    description: 'Pixel-perfect recreation of the Apple TV interface',
    portfolio: {
      url: 'https://abdalkader.dev/projects/apple-tv-clone',
      slug: 'apple-tv-clone',
    },
    history: {
      milestoneId: 'milestone-2024-11-apple-tv',
      timelineEvents: [
        {
          id: 'apple-1',
          date: '2024-11-01',
          title: 'Design Analysis',
          description: 'Analyzed Apple TV interface design patterns and animations',
          type: 'milestone',
        },
        {
          id: 'apple-2',
          date: '2024-11-10',
          title: 'Animation Implementation',
          description: 'Implemented smooth 60fps animations using GSAP',
          type: 'feature',
        },
        {
          id: 'apple-3',
          date: '2024-11-15',
          title: 'Launch',
          description: 'Launched pixel-perfect Apple TV clone',
          type: 'release',
        },
      ],
      url: 'https://history.abdalkader.dev?milestone=milestone-2024-11-apple-tv',
    },
    storybook: {
      components: [
        {
          name: 'Animation Components',
          storybookPath: 'design-system-animations',
          description: 'Animation components used in the clone',
        },
        {
          name: 'Card Components',
          storybookPath: 'components-card',
          description: 'Card and grid layout components',
        },
      ],
      url: 'https://storybook.abdalkader.dev',
    },
    docs: {
      sections: [
        {
          section: 'projects/apple-tv-clone',
          url: 'https://docs.abdalkader.dev/projects/apple-tv-clone',
          title: 'Apple TV Clone Documentation',
          type: 'overview',
        },
      ],
      baseUrl: 'https://docs.abdalkader.dev',
    },
    blog: {
      posts: [],
    },
    technologies: ['React', 'Next.js', 'TypeScript', 'GSAP', 'CSS'],
    category: ['Frontend Development', 'UI/UX Design'],
    startDate: '2024-11-01',
    lastUpdated: '2024-11-15',
    status: 'completed',
  },
  
  'virtualview': {
    id: 'virtualview',
    slug: 'virtualview',
    title: 'VirtualView',
    description: 'Web-based virtual reality platform for 3D space exploration',
    portfolio: {
      url: 'https://abdalkader.dev/projects/virtualview',
      slug: 'virtualview',
    },
    history: {
      milestoneId: 'milestone-2024-11-virtualview',
      timelineEvents: [
        {
          id: 'vr-1',
          date: '2024-11-05',
          title: 'WebGL Research',
          description: 'Researched web-based VR technologies and 3D rendering',
          type: 'milestone',
        },
        {
          id: 'vr-2',
          date: '2024-11-15',
          title: 'Three.js Integration',
          description: 'Integrated Three.js for 3D scene rendering',
          type: 'feature',
        },
        {
          id: 'vr-3',
          date: '2024-11-20',
          title: 'Launch',
          description: 'Launched VirtualView platform',
          type: 'release',
        },
      ],
      url: 'https://history.abdalkader.dev?milestone=milestone-2024-11-virtualview',
    },
    storybook: {
      components: [
        {
          name: '3D Components',
          storybookPath: 'components-3d',
          description: 'Three.js and WebGL components',
        },
        {
          name: 'VR Controls',
          storybookPath: 'components-vr-controls',
          description: 'Virtual reality navigation controls',
        },
      ],
      url: 'https://storybook.abdalkader.dev',
    },
    docs: {
      sections: [
        {
          section: 'projects/virtualview',
          url: 'https://docs.abdalkader.dev/projects/virtualview',
          title: 'VirtualView Documentation',
          type: 'overview',
        },
        {
          section: 'api/3d-rendering',
          url: 'https://docs.abdalkader.dev/api/3d-rendering',
          title: '3D Rendering API',
          type: 'api',
        },
      ],
      baseUrl: 'https://docs.abdalkader.dev',
    },
    blog: {
      posts: [],
    },
    technologies: ['Three.js', 'WebGL', 'Next.js', 'React', '3D Graphics'],
    category: ['Web Development', 'Virtual Reality'],
    startDate: '2024-11-05',
    lastUpdated: '2024-11-20',
    status: 'active',
  },
  
  'doner-qr-menu-magic': {
    id: 'doner-qr-menu-magic',
    slug: 'doner-qr-menu-magic',
    title: 'Doner QR Menu Magic',
    description: 'Innovative QR menu system for restaurants',
    portfolio: {
      url: 'https://abdalkader.dev/projects/doner-qr-menu-magic',
      slug: 'doner-qr-menu-magic',
    },
    history: {
      milestoneId: 'milestone-2024-12-doner-qr',
      timelineEvents: [
        {
          id: 'doner-1',
          date: '2024-11-25',
          title: 'Research Phase',
          description: 'Researched restaurant operations and QR menu solutions',
          type: 'milestone',
        },
        {
          id: 'doner-2',
          date: '2024-12-01',
          title: 'Launch',
          description: 'Launched Doner QR Menu Magic',
          type: 'release',
        },
      ],
      url: 'https://history.abdalkader.dev?milestone=milestone-2024-12-doner-qr',
    },
    storybook: {
      components: [
        {
          name: 'QR Components',
          storybookPath: 'components-qr',
          description: 'QR code generation and scanning components',
        },
        {
          name: 'Menu Components',
          storybookPath: 'components-menu',
          description: 'Restaurant menu display components',
        },
      ],
      url: 'https://storybook.abdalkader.dev',
    },
    docs: {
      sections: [
        {
          section: 'projects/doner-qr-menu-magic',
          url: 'https://docs.abdalkader.dev/projects/doner-qr-menu-magic',
          title: 'QR Menu Documentation',
          type: 'overview',
        },
      ],
      baseUrl: 'https://docs.abdalkader.dev',
    },
    blog: {
      posts: [
        {
          slug: 'building-modern-restaurant-tech',
          title: 'Building Modern Restaurant Technology',
          url: 'https://blog.abdalkader.dev/blog/building-modern-restaurant-tech',
          date: '2024-12-01',
          excerpt: 'How QR menus are transforming restaurant operations',
        },
      ],
    },
    technologies: ['Next.js', 'React', 'SCSS', 'QR Code', 'Mobile-First'],
    category: ['Web Development', 'Restaurant Technology'],
    startDate: '2024-11-25',
    lastUpdated: '2024-12-01',
    status: 'completed',
  },
};

/**
 * Get project by ID
 */
export function getProjectById(id: string): UnifiedProject | undefined {
  return PROJECT_REGISTRY[id];
}

/**
 * Get project by slug
 */
export function getProjectBySlug(slug: string): UnifiedProject | undefined {
  return Object.values(PROJECT_REGISTRY).find(p => p.slug === slug);
}

/**
 * Get all projects
 */
export function getAllProjects(): UnifiedProject[] {
  return Object.values(PROJECT_REGISTRY);
}

/**
 * Get projects by technology
 */
export function getProjectsByTechnology(tech: string): UnifiedProject[] {
  return Object.values(PROJECT_REGISTRY).filter(p =>
    p.technologies.some(t => t.toLowerCase().includes(tech.toLowerCase()))
  );
}

/**
 * Get projects by category
 */
export function getProjectsByCategory(category: string): UnifiedProject[] {
  return Object.values(PROJECT_REGISTRY).filter(p =>
    p.category.some(c => c.toLowerCase().includes(category.toLowerCase()))
  );
}

/**
 * Get projects by status
 */
export function getProjectsByStatus(status: UnifiedProject['status']): UnifiedProject[] {
  return Object.values(PROJECT_REGISTRY).filter(p => p.status === status);
}

