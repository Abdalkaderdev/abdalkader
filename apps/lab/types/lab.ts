/**
 * Lab Project Data Structures
 * Type definitions for AI/ML experiments and demos
 */

export interface LabProject {
  id: string;
  title: string;
  description: string;
  category: 'computer-vision' | 'nlp' | 'generative' | 'creative';
  technologies: string[];
  demoUrl: string;
  sourceUrl?: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  modelSize?: string; // for AI demos
  dependencies: string[];
  status?: 'active' | 'beta' | 'coming-soon';
  featured?: boolean;
  lastUpdated?: string;
  estimatedRuntime?: string; // e.g., "5-10 minutes"
  browserRequirements?: {
    webgl?: boolean;
    wasm?: boolean;
    camera?: boolean;
    microphone?: boolean;
  };
}

export interface LabCategory {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  projectCount: number;
}

export interface LabStats {
  totalProjects: number;
  activeProjects: number;
  betaProjects: number;
  comingSoonProjects: number;
  categoryCounts: Record<string, number>;
  totalTechnologies: string[];
}

// Helper types for filtering and searching
export type ProjectFilter = {
  category?: string;
  difficulty?: string;
  status?: string;
  technologies?: string[];
  searchTerm?: string;
};

export type SortOption = 'title' | 'difficulty' | 'lastUpdated' | 'featured';

// API response types
export interface LabProjectsResponse {
  projects: LabProject[];
  categories: LabCategory[];
  stats: LabStats;
}

export interface LabProjectResponse {
  project: LabProject;
  relatedProjects: LabProject[];
}