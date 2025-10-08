/**
 * Lab Utility Functions
 * Helper functions for lab project management and data processing
 */

import { LabProject, LabCategory, ProjectFilter, SortOption } from '@/types/lab';

/**
 * Filter projects based on criteria
 */
export function filterProjects(projects: LabProject[], filter: ProjectFilter): LabProject[] {
  return projects.filter(project => {
    // Category filter
    if (filter.category && project.category !== filter.category) {
      return false;
    }

    // Difficulty filter
    if (filter.difficulty && project.difficulty !== filter.difficulty) {
      return false;
    }

    // Status filter
    if (filter.status && project.status !== filter.status) {
      return false;
    }

    // Technology filter
    if (filter.technologies && filter.technologies.length > 0) {
      const hasMatchingTech = filter.technologies.some(tech =>
        project.technologies.some(projectTech =>
          projectTech.toLowerCase().includes(tech.toLowerCase())
        )
      );
      if (!hasMatchingTech) {
        return false;
      }
    }

    // Search term filter
    if (filter.searchTerm) {
      const searchLower = filter.searchTerm.toLowerCase();
      const matchesSearch = 
        project.title.toLowerCase().includes(searchLower) ||
        project.description.toLowerCase().includes(searchLower) ||
        project.technologies.some(tech => tech.toLowerCase().includes(searchLower));
      
      if (!matchesSearch) {
        return false;
      }
    }

    return true;
  });
}

/**
 * Sort projects by specified option
 */
export function sortProjects(projects: LabProject[], sortBy: SortOption): LabProject[] {
  const sorted = [...projects];

  switch (sortBy) {
    case 'title':
      return sorted.sort((a, b) => a.title.localeCompare(b.title));
    
    case 'difficulty':
      const difficultyOrder = { beginner: 1, intermediate: 2, advanced: 3 };
      return sorted.sort((a, b) => difficultyOrder[a.difficulty] - difficultyOrder[b.difficulty]);
    
    case 'lastUpdated':
      return sorted.sort((a, b) => {
        const dateA = new Date(a.lastUpdated || '1970-01-01');
        const dateB = new Date(b.lastUpdated || '1970-01-01');
        return dateB.getTime() - dateA.getTime();
      });
    
    case 'featured':
      return sorted.sort((a, b) => {
        if (a.featured && !b.featured) return -1;
        if (!a.featured && b.featured) return 1;
        return 0;
      });
    
    default:
      return sorted;
  }
}

/**
 * Get project statistics
 */
export function getProjectStats(projects: LabProject[]) {
  const stats = {
    total: projects.length,
    active: projects.filter(p => p.status === 'active').length,
    beta: projects.filter(p => p.status === 'beta').length,
    comingSoon: projects.filter(p => p.status === 'coming-soon').length,
    featured: projects.filter(p => p.featured).length,
    byCategory: {} as Record<string, number>,
    byDifficulty: {} as Record<string, number>,
  };

  // Count by category
  projects.forEach(project => {
    stats.byCategory[project.category] = (stats.byCategory[project.category] || 0) + 1;
    stats.byDifficulty[project.difficulty] = (stats.byDifficulty[project.difficulty] || 0) + 1;
  });

  return stats;
}

/**
 * Get related projects based on category and technologies
 */
export function getRelatedProjects(currentProject: LabProject, allProjects: LabProject[], limit = 3): LabProject[] {
  const related = allProjects
    .filter(project => project.id !== currentProject.id)
    .map(project => {
      let score = 0;
      
      // Same category
      if (project.category === currentProject.category) {
        score += 3;
      }
      
      // Shared technologies
      const sharedTechs = project.technologies.filter(tech =>
        currentProject.technologies.includes(tech)
      );
      score += sharedTechs.length;
      
      // Same difficulty
      if (project.difficulty === currentProject.difficulty) {
        score += 1;
      }
      
      return { project, score };
    })
    .filter(item => item.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map(item => item.project);

  return related;
}

/**
 * Format model size for display
 */
export function formatModelSize(sizeInMB: number): string {
  if (sizeInMB < 1) {
    return `${Math.round(sizeInMB * 1024)}KB`;
  }
  if (sizeInMB < 1024) {
    return `${sizeInMB}MB`;
  }
  return `${Math.round(sizeInMB / 1024 * 10) / 10}GB`;
}

/**
 * Get difficulty color
 */
export function getDifficultyColor(difficulty: string): string {
  switch (difficulty) {
    case 'beginner':
      return '#10B981'; // green
    case 'intermediate':
      return '#F59E0B'; // yellow
    case 'advanced':
      return '#EF4444'; // red
    default:
      return '#6B7280'; // gray
  }
}

/**
 * Get status color
 */
export function getStatusColor(status: string): string {
  switch (status) {
    case 'active':
      return '#10B981'; // green
    case 'beta':
      return '#F59E0B'; // yellow
    case 'coming-soon':
      return '#8B5CF6'; // purple
    default:
      return '#6B7280'; // gray
  }
}

/**
 * Validate browser requirements
 */
export function checkBrowserRequirements(requirements: LabProject['browserRequirements']): {
  supported: boolean;
  missing: string[];
} {
  if (!requirements) {
    return { supported: true, missing: [] };
  }

  const missing: string[] = [];
  
  // Check WebGL support
  if (requirements.webgl) {
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
    if (!gl) {
      missing.push('WebGL');
    }
  }
  
  // Check WASM support
  if (requirements.wasm) {
    if (typeof WebAssembly === 'undefined') {
      missing.push('WebAssembly');
    }
  }
  
  // Check camera access (this would need to be checked at runtime)
  if (requirements.camera) {
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      missing.push('Camera API');
    }
  }
  
  // Check microphone access
  if (requirements.microphone) {
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      missing.push('Microphone API');
    }
  }
  
  return {
    supported: missing.length === 0,
    missing,
  };
}

/**
 * Generate project URL
 */
export function getProjectUrl(project: LabProject): string {
  return `/lab/${project.id}`;
}

/**
 * Get category icon
 */
export function getCategoryIcon(category: string): string {
  const icons: Record<string, string> = {
    'computer-vision': '👁️',
    'nlp': '🧠',
    'generative': '🎨',
    'creative': '⚡',
  };
  return icons[category] || '🔬';
}