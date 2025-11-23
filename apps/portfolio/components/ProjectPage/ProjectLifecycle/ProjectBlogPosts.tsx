import React from 'react';
import { UnifiedProject } from '@/lib/projectRegistry';
import styles from './ProjectLifecycle.module.scss';
import { FileText, ExternalLink, Calendar } from 'lucide-react';

interface ProjectBlogPostsProps {
  project: UnifiedProject;
}

export function ProjectBlogPosts({ project }: ProjectBlogPostsProps) {
  const posts = project.blog.posts;

  if (posts.length === 0) {
    return (
      <div className={styles.emptyState}>
        <FileText className={styles.emptyIcon} />
        <p>No blog posts available for this project.</p>
        <a 
          href="https://blog.abdalkader.dev" 
          target="_blank" 
          rel="noopener noreferrer"
          className={styles.linkButton}
        >
          Browse All Blog Posts
        </a>
      </div>
    );
  }

  return (
    <div className={styles.blogContainer}>
      <div className={styles.blogGrid}>
         {posts.map((post, index: number) => (
           <a
             key={index}
             // eslint-disable-next-line @typescript-eslint/no-explicit-any
             href={(post as any).url}
             target="_blank"
             rel="noopener noreferrer"
             className={styles.blogCard}
           >
             <div className={styles.blogHeader}>
               <FileText className={styles.blogIcon} />
               {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
               <h4>{(post as any).title}</h4>
             </div>
             {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
             {(post as any).excerpt && (
               // eslint-disable-next-line @typescript-eslint/no-explicit-any
               <p className={styles.blogExcerpt}>{(post as any).excerpt}</p>
             )}
             <div className={styles.blogFooter}>
               <span className={styles.blogDate}>
                 <Calendar className={styles.dateIcon} />
                 {new Date((post as any).date).toLocaleDateString('en-US', {
                   year: 'numeric',
                   month: 'long',
                   day: 'numeric'
                 })}
               </span>
               <ExternalLink className={styles.externalIcon} />
             </div>
           </a>
         ))}
      </div>
      
      <div className={styles.blogFooter}>
        <a 
          href="https://blog.abdalkader.dev" 
          target="_blank" 
          rel="noopener noreferrer"
          className={styles.viewAllPosts}
        >
          View All Blog Posts
        </a>
      </div>
    </div>
  );
}

