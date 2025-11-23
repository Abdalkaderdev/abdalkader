import React from 'react';
import { UnifiedProject } from '../../../../../packages/ui/src/lib/projectRegistry';
import { trackCrossDomainLink } from '@/lib/analytics';
import styles from './ProjectLifecycle.module.scss';
import { Code, ExternalLink, Package } from 'lucide-react';

interface ProjectComponentsProps {
  project: UnifiedProject;
}

export function ProjectComponents({ project }: ProjectComponentsProps) {
  const components = project.storybook.components;

  if (components.length === 0) {
    return (
      <div className={styles.emptyState}>
        <Package className={styles.emptyIcon} />
        <p>No Storybook components documented for this project.</p>
        {project.storybook.url && (
          <a 
            href={project.storybook.url} 
            target="_blank" 
            rel="noopener noreferrer"
            className={styles.linkButton}
          >
            Browse All Components
          </a>
        )}
      </div>
    );
  }

  return (
    <div className={styles.componentsContainer}>
      <div className={styles.componentsGrid}>
         {components.map((component, index: number) => (
           <a
             key={index}
             href={`https://storybook.abdalkader.dev/?path=/story/${component.storybookPath}`}
             target="_blank"
             rel="noopener noreferrer"
             className={styles.componentCard}
             onClick={() => trackCrossDomainLink('portfolio', 'storybook', 'storybook', project.slug, { component: component.name })}
           >
             <div className={styles.componentHeader}>
               <Code className={styles.componentIcon} />
               {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
               <h4>{component.name}</h4>
             </div>
             {component.description && (
               <p className={styles.componentDescription}>{component.description}</p>
             )}
             <div className={styles.componentFooter}>
               <span className={styles.componentPath}>{component.storybookPath}</span>
               <ExternalLink className={styles.externalIcon} />
             </div>
           </a>
         ))}
      </div>
      
      {project.storybook.url && (
        <div className={styles.componentsFooter}>
          <a 
            href={project.storybook.url} 
            target="_blank" 
            rel="noopener noreferrer"
            className={styles.viewAllComponents}
          >
            View All Components in Storybook
          </a>
        </div>
      )}
    </div>
  );
}

