import React from 'react';
import { UnifiedProject } from '@/lib/projectRegistry';
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
             // eslint-disable-next-line @typescript-eslint/no-explicit-any
             href={`${project.storybook.url || 'https://storybook.abdalkader.dev'}?path=/story/${(component as any).storybookPath}`}
             target="_blank"
             rel="noopener noreferrer"
             className={styles.componentCard}
           >
             <div className={styles.componentHeader}>
               <Code className={styles.componentIcon} />
               {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
               <h4>{(component as any).name}</h4>
             </div>
             {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
             {(component as any).description && (
               // eslint-disable-next-line @typescript-eslint/no-explicit-any
               <p className={styles.componentDescription}>{(component as any).description}</p>
             )}
             <div className={styles.componentFooter}>
               {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
               <span className={styles.componentPath}>{(component as any).storybookPath}</span>
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

