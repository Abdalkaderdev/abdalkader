import React from 'react';
import { UnifiedProject } from '../../../../../packages/ui/src/lib/projectRegistry';
import { trackCrossDomainLink } from '@/lib/analytics';
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
             href={doc.url}
             target="_blank"
             rel="noopener noreferrer"
             className={styles.docCard}
             onClick={() => trackCrossDomainLink('portfolio', 'docs', 'docs', project.slug, { doc_type: doc.type, doc_title: doc.title })}
           >
             <div className={styles.docHeader}>
               {getDocIcon(doc.type)}
               <div className={styles.docTitleSection}>
                 <h4>{doc.title}</h4>
                 <span className={styles.docType}>{getDocTypeLabel(doc.type)}</span>
               </div>
             </div>
             <div className={styles.docFooter}>
               <span className={styles.docPath}>{doc.section}</span>
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

