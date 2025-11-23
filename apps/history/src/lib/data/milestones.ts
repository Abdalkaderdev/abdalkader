export interface MilestoneLink {
  type: 'portfolio' | 'storybook' | 'docs' | 'blog';
  title: string;
  url: string;
  description?: string;
}

export interface TechnicalMilestone {
  id: string;
  title: string;
  date: string; // ISO date string
  year: number;
  month?: number;
  description: string;
  category: 'project' | 'component' | 'learning' | 'achievement' | 'technology';
  technologies: string[];
  links: MilestoneLink[];
  color: string;
  icon: string;
  impact?: string;
  tags: string[];
}

export const technicalMilestones: TechnicalMilestone[] = [
  {
    id: 'milestone-2024-11-apple-tv',
    title: 'Apple TV Clone - UI/UX Mastery',
    date: '2024-11-15',
    year: 2024,
    month: 11,
    description: 'Created a pixel-perfect recreation of the Apple TV interface, demonstrating mastery of modern frontend development, CSS animations, and responsive design principles.',
    category: 'project',
    technologies: ['React', 'Next.js', 'TypeScript', 'GSAP', 'CSS'],
    links: [
      {
        type: 'portfolio',
        title: 'Apple TV Clone Project',
        url: 'https://abdalkader.dev/projects/apple-tv-clone',
        description: 'View the complete project case study'
      },
      {
        type: 'docs',
        title: 'Apple TV Clone Documentation',
        url: 'https://docs.abdalkader.dev/projects/apple-tv-clone',
        description: 'Technical documentation and implementation details'
      },
      {
        type: 'storybook',
        title: 'Animation Components',
        url: 'https://storybook.abdalkader.dev/?path=/story/design-system-animations',
        description: 'Animation components used in the project'
      }
    ],
    color: '#f44e00',
    icon: '📺',
    impact: 'Established credibility as a frontend developer capable of handling complex UI/UX challenges',
    tags: ['Frontend', 'UI/UX', 'Animation', 'Responsive Design']
  },
  {
    id: 'milestone-2024-11-virtualview',
    title: 'VirtualView - Web-Based VR Platform',
    date: '2024-11-20',
    year: 2024,
    month: 11,
    description: 'Developed an innovative virtual reality platform enabling 3D space exploration through web browsers, democratizing VR access without specialized hardware.',
    category: 'project',
    technologies: ['Three.js', 'WebGL', 'Next.js', 'React', '3D Graphics'],
    links: [
      {
        type: 'portfolio',
        title: 'VirtualView Project',
        url: 'https://abdalkader.dev/projects/virtualview',
        description: 'Explore the VR platform project'
      },
      {
        type: 'docs',
        title: 'VirtualView Documentation',
        url: 'https://docs.abdalkader.dev/projects/virtualview',
        description: '3D rendering and WebGL implementation guide'
      },
      {
        type: 'storybook',
        title: '3D Components',
        url: 'https://storybook.abdalkader.dev/?path=/story/components-3d',
        description: 'Three.js and WebGL components'
      }
    ],
    color: '#8b5cf6',
    icon: '🥽',
    impact: 'Enabled 5+ real estate companies to offer virtual property tours, reducing physical visit costs by 40%',
    tags: ['VR', '3D', 'WebGL', 'Real Estate']
  },
  {
    id: 'milestone-2024-12-doner-qr',
    title: 'Doner QR Menu Magic - Restaurant Tech',
    date: '2024-12-01',
    year: 2024,
    month: 12,
    description: 'Built an innovative QR menu system for restaurants, transforming traditional ordering experiences with modern web technology.',
    category: 'project',
    technologies: ['Next.js', 'React', 'SCSS', 'QR Code', 'Mobile-First'],
    links: [
      {
        type: 'portfolio',
        title: 'Doner QR Menu Project',
        url: 'https://abdalkader.dev/projects/doner-qr-menu-magic',
        description: 'View the restaurant technology solution'
      },
      {
        type: 'docs',
        title: 'QR Menu Documentation',
        url: 'https://docs.abdalkader.dev/projects/doner-qr-menu-magic',
        description: 'Mobile-first design and QR implementation'
      },
      {
        type: 'blog',
        title: 'Building Modern Restaurant Tech',
        url: 'https://blog.abdalkader.dev/blog/building-modern-restaurant-tech',
        description: 'Article about restaurant technology solutions'
      }
    ],
    color: '#4ecdc4',
    icon: '🍔',
    impact: 'Modernized ordering experience for restaurants, improving customer satisfaction and operational efficiency',
    tags: ['Restaurant Tech', 'Mobile', 'QR Code', 'UX']
  },
  {
    id: 'milestone-2024-12-real-estate',
    title: 'Real Estate Platform Development',
    date: '2024-12-05',
    year: 2024,
    month: 12,
    description: 'Developed comprehensive real estate platforms (Headquarter Iraq, Hamilton Iraq) serving as digital hubs for property transactions across Iraq.',
    category: 'project',
    technologies: ['Next.js', 'TypeScript', 'Real Estate', 'Search', 'Performance'],
    links: [
      {
        type: 'portfolio',
        title: 'Headquarter Iraq Real Estate',
        url: 'https://abdalkader.dev/projects/headquarter-iraq-real-estate',
        description: 'Comprehensive real estate platform'
      },
      {
        type: 'portfolio',
        title: 'Hamilton Iraq Real Estate',
        url: 'https://abdalkader.dev/projects/hamilton-iraq-real-estate',
        description: 'Modern property platform'
      },
      {
        type: 'docs',
        title: 'Real Estate Platform Docs',
        url: 'https://docs.abdalkader.dev/projects/headquarter-iraq-real-estate',
        description: 'Architecture and implementation details'
      }
    ],
    color: '#3b82f6',
    icon: '🏢',
    impact: 'Established leading real estate platforms in Iraq, facilitating numerous property transactions',
    tags: ['Real Estate', 'Full Stack', 'Performance', 'SEO']
  },
  {
    id: 'milestone-2025-01-quantum-animation',
    title: 'Quantum Animation System - Physics Education',
    date: '2025-01-15',
    year: 2025,
    month: 1,
    description: 'Created an innovative interactive playground demonstrating quantum physics principles through UI animations, making complex concepts accessible through modern web technologies.',
    category: 'project',
    technologies: ['Next.js 15', 'TypeScript', 'Three.js', 'Framer Motion', 'GSAP', 'Physics'],
    links: [
      {
        type: 'portfolio',
        title: 'Quantum Animation System',
        url: 'https://abdalkader.dev/projects/quantum-animation-system',
        description: 'Interactive physics education platform'
      },
      {
        type: 'docs',
        title: 'Quantum Animation Documentation',
        url: 'https://docs.abdalkader.dev/projects/quantum-animation-system',
        description: 'Physics simulation and animation techniques'
      },
      {
        type: 'blog',
        title: 'Quantum Animation System Post',
        url: 'https://blog.abdalkader.dev/blog/quantum-animation-system-interactive-physics-playground',
        description: 'Blog post about the quantum animation project'
      },
      {
        type: 'storybook',
        title: 'Animation Components',
        url: 'https://storybook.abdalkader.dev/?path=/story/design-system-animations',
        description: 'Animation and physics components'
      }
    ],
    color: '#8b5cf6',
    icon: '⚛️',
    impact: 'Established new standard for educational technology, leading to partnerships with 3 educational institutions',
    tags: ['Education', 'Physics', 'Animation', '3D', 'Innovation']
  },
  {
    id: 'milestone-2024-design-system',
    title: 'Design System & Component Library',
    date: '2024-01-01',
    year: 2024,
    month: 1,
    description: 'Established comprehensive design system and component library, ensuring consistency across all digital properties with reusable, accessible components.',
    category: 'component',
    technologies: ['React', 'TypeScript', 'Storybook', 'Design Tokens', 'Accessibility'],
    links: [
      {
        type: 'storybook',
        title: 'Component Library',
        url: 'https://storybook.abdalkader.dev',
        description: 'Complete component library documentation'
      },
      {
        type: 'docs',
        title: 'Design System Overview',
        url: 'https://docs.abdalkader.dev/design-system/overview',
        description: 'Design system documentation and guidelines'
      },
      {
        type: 'docs',
        title: 'Design Tokens',
        url: 'https://docs.abdalkader.dev/design-system/colors',
        description: 'Color, typography, and spacing tokens'
      }
    ],
    color: '#ff6b35',
    icon: '🎨',
    impact: 'Unified design language across all properties, improving consistency and development velocity',
    tags: ['Design System', 'Components', 'Accessibility', 'Documentation']
  },
  {
    id: 'milestone-2024-blog-launch',
    title: 'Professional Knowledge Hub Launch',
    date: '2024-01-01',
    year: 2024,
    month: 1,
    description: 'Launched professional blog platform with technical articles, case studies, tutorials, and resources, establishing thought leadership in web development.',
    category: 'achievement',
    technologies: ['Hexo.js', 'Markdown', 'SEO', 'Content Strategy'],
    links: [
      {
        type: 'blog',
        title: 'Blog Home',
        url: 'https://blog.abdalkader.dev',
        description: 'Browse all blog posts and articles'
      },
      {
        type: 'blog',
        title: 'Getting Started with React Hooks',
        url: 'https://blog.abdalkader.dev/blog/getting-started-with-react-hooks-a-complete-guide',
        description: 'React Hooks tutorial'
      },
      {
        type: 'blog',
        title: 'TypeScript Best Practices',
        url: 'https://blog.abdalkader.dev/blog/typescript-best-practices-for-react-developers',
        description: 'TypeScript guide for React developers'
      }
    ],
    color: '#4ecdc4',
    icon: '✍️',
    impact: 'Established thought leadership and knowledge sharing platform',
    tags: ['Content', 'SEO', 'Education', 'Writing']
  },
  {
    id: 'milestone-2024-history-museum',
    title: 'Programming History Museum',
    date: '2024-01-16',
    year: 2024,
    month: 1,
    description: 'Created interactive programming language history museum with AI integration, timeline visualizations, and educational exhibitions.',
    category: 'project',
    technologies: ['Next.js', 'TypeScript', 'Groq AI', 'D3.js', 'GSAP', 'Monaco Editor'],
    links: [
      {
        type: 'portfolio',
        title: 'History Museum',
        url: 'https://history.abdalkader.dev',
        description: 'Explore the programming history museum'
      },
      {
        type: 'docs',
        title: 'AI Integration Guide',
        url: 'https://docs.abdalkader.dev/guides/ai-integration',
        description: 'AI and Groq integration documentation'
      }
    ],
    color: '#45b7d1',
    icon: '🏛️',
    impact: 'Created engaging educational platform for programming history with 3,200+ visitors',
    tags: ['Education', 'AI', 'Visualization', 'History']
  },
  {
    id: 'milestone-2024-nextjs-mastery',
    title: 'Next.js 14 & 15 Mastery',
    date: '2024-06-01',
    year: 2024,
    month: 6,
    description: 'Achieved deep expertise in Next.js 14 and 15, implementing advanced features like App Router, Server Components, and performance optimizations.',
    category: 'learning',
    technologies: ['Next.js 14', 'Next.js 15', 'App Router', 'Server Components', 'React Server Components'],
    links: [
      {
        type: 'blog',
        title: 'Building Modern Web Apps with Next.js 14',
        url: 'https://blog.abdalkader.dev/blog/building-modern-web-apps-with-next-js-14',
        description: 'Next.js 14 best practices and patterns'
      },
      {
        type: 'docs',
        title: 'Next.js Quickstart',
        url: 'https://docs.abdalkader.dev/quickstart',
        description: 'Next.js implementation guide'
      }
    ],
    color: '#000000',
    icon: '⚡',
    impact: 'Enabled faster development cycles and improved performance across all projects',
    tags: ['Next.js', 'Performance', 'Full Stack', 'Modern Web']
  },
  {
    id: 'milestone-2024-typescript-expertise',
    title: 'TypeScript Expertise Development',
    date: '2024-03-01',
    year: 2024,
    month: 3,
    description: 'Developed comprehensive TypeScript expertise, implementing type-safe solutions across all projects and sharing knowledge through documentation.',
    category: 'learning',
    technologies: ['TypeScript', 'Type Safety', 'React', 'Next.js'],
    links: [
      {
        type: 'blog',
        title: 'TypeScript Best Practices',
        url: 'https://blog.abdalkader.dev/blog/typescript-best-practices-for-react-developers',
        description: 'TypeScript guide for React developers'
      },
      {
        type: 'docs',
        title: 'TypeScript Guide',
        url: 'https://docs.abdalkader.dev/guides/typescript',
        description: 'TypeScript implementation patterns'
      }
    ],
    color: '#3178c6',
    icon: '📘',
    impact: 'Improved code quality and developer experience across all projects',
    tags: ['TypeScript', 'Type Safety', 'Best Practices']
  }
];

// Helper functions
export const getMilestonesByYear = (year: number): TechnicalMilestone[] => {
  return technicalMilestones.filter(m => m.year === year).sort((a, b) => {
    const dateA = new Date(a.date).getTime();
    const dateB = new Date(b.date).getTime();
    return dateA - dateB;
  });
};

export const getMilestonesByCategory = (category: TechnicalMilestone['category']): TechnicalMilestone[] => {
  return technicalMilestones.filter(m => m.category === category);
};

export const getMilestonesByTechnology = (tech: string): TechnicalMilestone[] => {
  return technicalMilestones.filter(m => 
    m.technologies.some(t => t.toLowerCase().includes(tech.toLowerCase()))
  );
};

export const getMilestoneById = (id: string): TechnicalMilestone | undefined => {
  return technicalMilestones.find(m => m.id === id);
};

export const getAllYears = (): number[] => {
  const years = new Set(technicalMilestones.map(m => m.year));
  return Array.from(years).sort((a, b) => b - a);
};

export const getMilestonesByDateRange = (startDate: string, endDate: string): TechnicalMilestone[] => {
  const start = new Date(startDate).getTime();
  const end = new Date(endDate).getTime();
  return technicalMilestones.filter(m => {
    const milestoneDate = new Date(m.date).getTime();
    return milestoneDate >= start && milestoneDate <= end;
  }).sort((a, b) => {
    const dateA = new Date(a.date).getTime();
    const dateB = new Date(b.date).getTime();
    return dateA - dateB;
  });
};

