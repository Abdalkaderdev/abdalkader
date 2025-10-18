'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { ECOSYSTEM_CONFIG, getCurrentDomain } from '@/lib/ecosystem';
import { useAnalytics } from '@/lib/analytics';

interface CrossDomainContextType {
  currentDomain: string | null;
  availableComponents: string[];
  loadComponent: (componentName: string) => Promise<React.ComponentType<any> | null>;
  shareComponent: (componentName: string, component: React.ComponentType<any>) => void;
  isComponentAvailable: (componentName: string) => boolean;
  getComponentMetadata: (componentName: string) => ComponentMetadata | null;
}

interface ComponentMetadata {
  name: string;
  version: string;
  description: string;
  domain: string;
  lastUpdated: string;
  dependencies: string[];
  props: Record<string, any>;
  examples: Array<{
    title: string;
    code: string;
    description: string;
  }>;
}

interface SharedComponent {
  component: React.ComponentType<any>;
  metadata: ComponentMetadata;
  loadedAt: number;
}

const CrossDomainContext = createContext<CrossDomainContextType | undefined>(undefined);

// Component registry for cross-domain sharing
const componentRegistry = new Map<string, SharedComponent>();

// Available components across the ecosystem
const AVAILABLE_COMPONENTS: ComponentMetadata[] = [
  {
    name: 'InteractiveButton',
    version: '1.0.0',
    description: 'A versatile button component with multiple variants and animations',
    domain: 'storybook.abdalkader.dev',
    lastUpdated: '2024-01-15',
    dependencies: ['framer-motion', 'lucide-react'],
    props: {
      variant: 'primary | secondary | ghost | danger',
      size: 'sm | md | lg',
      disabled: 'boolean',
      loading: 'boolean',
      children: 'ReactNode',
    },
    examples: [
      {
        title: 'Basic Button',
        code: '<InteractiveButton variant="primary">Click me</InteractiveButton>',
        description: 'A simple primary button',
      },
    ],
  },
  {
    name: 'InteractiveCard',
    version: '1.0.0',
    description: 'An animated card component with hover effects and variants',
    domain: 'storybook.abdalkader.dev',
    lastUpdated: '2024-01-15',
    dependencies: ['framer-motion'],
    props: {
      variant: 'timeline | language | paradigm | code | ai',
      tilt: 'boolean',
      glow: 'boolean',
      children: 'ReactNode',
    },
    examples: [
      {
        title: 'Timeline Card',
        code: '<InteractiveCard variant="timeline">Content</InteractiveCard>',
        description: 'A card designed for timeline items',
      },
    ],
  },
  {
    name: 'UnifiedHeader',
    version: '1.0.0',
    description: 'The unified header component used across all domains',
    domain: 'www.abdalkader.dev',
    lastUpdated: '2024-01-16',
    dependencies: ['framer-motion', 'lucide-react'],
    props: {
      showSearch: 'boolean',
      showNotifications: 'boolean',
      showUserMenu: 'boolean',
      showEcosystemMap: 'boolean',
    },
    examples: [
      {
        title: 'Full Header',
        code: '<UnifiedHeader showSearch showNotifications showUserMenu showEcosystemMap />',
        description: 'Header with all features enabled',
      },
    ],
  },
  {
    name: 'EcosystemMap',
    version: '1.0.0',
    description: 'Interactive map showing all ecosystem domains and their status',
    domain: 'www.abdalkader.dev',
    lastUpdated: '2024-01-16',
    dependencies: ['framer-motion'],
    props: {
      showStats: 'boolean',
      showInactive: 'boolean',
      onDomainSelect: 'function',
    },
    examples: [
      {
        title: 'Basic Map',
        code: '<EcosystemMap showStats onDomainSelect={handleSelect} />',
        description: 'Map with stats and domain selection',
      },
    ],
  },
  {
    name: 'AnalyticsDashboard',
    version: '1.0.0',
    description: 'Real-time analytics dashboard for ecosystem monitoring',
    domain: 'tools.abdalkader.dev',
    lastUpdated: '2024-01-14',
    dependencies: ['recharts', 'framer-motion'],
    props: {
      timeRange: 'string',
      domains: 'string[]',
      metrics: 'string[]',
    },
    examples: [
      {
        title: 'Full Dashboard',
        code: '<AnalyticsDashboard timeRange="7d" domains={["all"]} />',
        description: 'Complete analytics dashboard',
      },
    ],
  },
];

export const CrossDomainProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentDomain, setCurrentDomain] = useState<string | null>(null);
  const [availableComponents, setAvailableComponents] = useState<string[]>([]);
  const { trackInteraction } = useAnalytics();

  // Initialize current domain
  useEffect(() => {
    const domain = getCurrentDomain();
    setCurrentDomain(domain?.subdomain || null);
  }, []);

  // Load available components
  useEffect(() => {
    const loadAvailableComponents = async () => {
      try {
        // In a real implementation, this would fetch from a component registry API
        const components = AVAILABLE_COMPONENTS.map(comp => comp.name);
        setAvailableComponents(components);
        
        trackInteraction('component_registry_loaded', 'cross_domain', {
          componentCount: components.length,
          domain: currentDomain,
        });
      } catch (error) {
        console.error('Failed to load available components:', error);
      }
    };

    loadAvailableComponents();
  }, [currentDomain, trackInteraction]);

  // Load a component from another domain
  const loadComponent = useCallback(async (componentName: string): Promise<React.ComponentType<any> | null> => {
    try {
      // Check if component is already loaded
      if (componentRegistry.has(componentName)) {
        const shared = componentRegistry.get(componentName)!;
        trackInteraction('component_loaded_from_cache', 'cross_domain', {
          componentName,
          domain: currentDomain,
        });
        return shared.component;
      }

      // Find component metadata
      const metadata = AVAILABLE_COMPONENTS.find(comp => comp.name === componentName);
      if (!metadata) {
        console.warn(`Component ${componentName} not found in registry`);
        return null;
      }

      // In a real implementation, this would dynamically import from the source domain
      // For now, we'll simulate loading
      await new Promise(resolve => setTimeout(resolve, 100));

      // Mock component loading - in reality this would be a dynamic import
      const MockComponent: React.FC<any> = ({ children, ...props }) => (
        <div className="p-4 border border-orange-500/30 rounded-lg bg-orange-500/10">
          <h3 className="text-orange-400 font-medium mb-2">{componentName}</h3>
          <p className="text-gray-300 text-sm mb-2">
            Loaded from {metadata.domain}
          </p>
          {children}
        </div>
      );

      // Register the component
      componentRegistry.set(componentName, {
        component: MockComponent,
        metadata,
        loadedAt: Date.now(),
      });

      trackInteraction('component_loaded', 'cross_domain', {
        componentName,
        sourceDomain: metadata.domain,
        targetDomain: currentDomain,
      });

      return MockComponent;
    } catch (error) {
      console.error(`Failed to load component ${componentName}:`, error);
      trackInteraction('component_load_error', 'cross_domain', {
        componentName,
        error: error instanceof Error ? error.message : 'Unknown error',
      });
      return null;
    }
  }, [currentDomain, trackInteraction]);

  // Share a component with other domains
  const shareComponent = useCallback((componentName: string, component: React.ComponentType<any>) => {
    const metadata: ComponentMetadata = {
      name: componentName,
      version: '1.0.0',
      description: `Shared component from ${currentDomain}`,
      domain: `${currentDomain}.abdalkader.dev`,
      lastUpdated: new Date().toISOString(),
      dependencies: [],
      props: {},
      examples: [],
    };

    componentRegistry.set(componentName, {
      component,
      metadata,
      loadedAt: Date.now(),
    });

    trackInteraction('component_shared', 'cross_domain', {
      componentName,
      domain: currentDomain,
    });
  }, [currentDomain, trackInteraction]);

  // Check if a component is available
  const isComponentAvailable = useCallback((componentName: string): boolean => {
    return availableComponents.includes(componentName) || componentRegistry.has(componentName);
  }, [availableComponents]);

  // Get component metadata
  const getComponentMetadata = useCallback((componentName: string): ComponentMetadata | null => {
    const shared = componentRegistry.get(componentName);
    if (shared) {
      return shared.metadata;
    }

    return AVAILABLE_COMPONENTS.find(comp => comp.name === componentName) || null;
  }, []);

  const value: CrossDomainContextType = {
    currentDomain,
    availableComponents,
    loadComponent,
    shareComponent,
    isComponentAvailable,
    getComponentMetadata,
  };

  return (
    <CrossDomainContext.Provider value={value}>
      {children}
    </CrossDomainContext.Provider>
  );
};

export const useCrossDomain = (): CrossDomainContextType => {
  const context = useContext(CrossDomainContext);
  if (context === undefined) {
    throw new Error('useCrossDomain must be used within a CrossDomainProvider');
  }
  return context;
};

// Hook for loading components from other domains
export const useCrossDomainComponent = (componentName: string) => {
  const { loadComponent, isComponentAvailable, getComponentMetadata } = useCrossDomain();
  const [Component, setComponent] = useState<React.ComponentType<any> | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!componentName) return;

    const load = async () => {
      if (!isComponentAvailable(componentName)) {
        setError(`Component ${componentName} is not available`);
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        const loadedComponent = await loadComponent(componentName);
        setComponent(loadedComponent);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load component');
      } finally {
        setIsLoading(false);
      }
    };

    load();
  }, [componentName, loadComponent, isComponentAvailable]);

  return {
    Component,
    isLoading,
    error,
    metadata: getComponentMetadata(componentName),
  };
};

export default CrossDomainProvider;