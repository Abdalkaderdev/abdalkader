import React from 'react';
import { UnifiedProject } from '@/lib/projectRegistry';
import styles from './ProjectLifecycle.module.scss';
import { BookOpen, ExternalLink, FileText, Code, GraduationCap, Book } from 'lucide-react';

interface ProjectDocumentationProps {
  project: UnifiedProject;
}

export function ProjectDocumentation({ project }: ProjectDocumentationProps) {
  const sections = project.docs.sections;

  if (sections.length === 0) {
    return (
      <div className={styles.emptyState}>
        <BookOpen className={styles.emptyIcon} />
        <p>No documentation available for this project.</p>
        {project.docs.baseUrl && (
          <a 
            href={project.docs.baseUrl} 
            target="_blank" 
            rel="noopener noreferrer"
            className={styles.linkButton}
          >
            Browse All Documentation
          </a>
        )}
      </div>
    );
  }

  const getDocIcon = (type: string) => {
    switch (type) {
      case 'api':
        return <Code className={styles.docIcon} />;
      case 'guide':
        return <GraduationCap className={styles.docIcon} />;
      case 'tutorial':
        return <Book className={styles.docIcon} />;
      default:
        return <FileText className={styles.docIcon} />;
    }
  };

  const getDocTypeLabel = (type: string) => {
    switch (type) {
      case 'api':
        return 'API Reference';
      case 'guide':
        return 'Guide';
      case 'tutorial':
        return 'Tutorial';
      case 'overview':
        return 'Overview';
      default:
        return 'Documentation';
    }
  };

  return (
    <div className={styles.docsContainer}>
      <div className={styles.docsGrid}>
         {sections.map((doc, index: number) => (
           <a
             key={index}
             // eslint-disable-next-line @typescript-eslint/no-explicit-any
             href={(doc as any).url}
             target="_blank"
             rel="noopener noreferrer"
             className={styles.docCard}
           >
             <div className={styles.docHeader}>
               {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
               {getDocIcon((doc as any).type)}
               <div className={styles.docTitleSection}>
                 {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                 <h4>{(doc as any).title}</h4>
                 {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                 <span className={styles.docType}>{getDocTypeLabel((doc as any).type)}</span>
               </div>
             </div>
             <div className={styles.docFooter}>
               {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
               <span className={styles.docPath}>{(doc as any).section}</span>
               <ExternalLink className={styles.externalIcon} />
             </div>
           </a>
         ))}
      </div>
      
      {project.docs.baseUrl && (
        <div className={styles.docsFooter}>
          <a 
            href={`${project.docs.baseUrl}/projects/${project.slug}`} 
            target="_blank" 
            rel="noopener noreferrer"
            className={styles.viewAllDocs}
          >
            View All Project Documentation
          </a>
        </div>
      )}
    </div>
  );
}

