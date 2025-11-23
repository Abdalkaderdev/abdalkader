import React from 'react';
import { UnifiedProject } from '../../../../../packages/ui/src/lib/projectRegistry';
import { trackCrossDomainLink } from '@/lib/analytics';
import styles from './ProjectLifecycle.module.scss';
import { FileText, ExternalLink, Calendar } from 'lucide-react';

interface BlogPost {
  url: string;
  title: string;
  excerpt?: string;
  date: string | Date;
}

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
         {posts.map((post, index: number) => {
           const blogPost = post as BlogPost;
           return (
           <a
             key={index}
             href={blogPost.url}
             target="_blank"
             rel="noopener noreferrer"
             className={styles.blogCard}
             onClick={() => trackCrossDomainLink('portfolio', 'blog', 'blog', project.slug, { post_slug: blogPost.slug, post_title: blogPost.title })}
           >
             <div className={styles.blogHeader}>
               <FileText className={styles.blogIcon} />
               <h4>{blogPost.title}</h4>
             </div>
             {blogPost.excerpt && (
               <p className={styles.blogExcerpt}>{blogPost.excerpt}</p>
             )}
             <div className={styles.blogFooter}>
               <span className={styles.blogDate}>
                 <Calendar className={styles.dateIcon} />
                 {new Date(blogPost.date).toLocaleDateString('en-US', {
                   year: 'numeric',
                   month: 'long',
                   day: 'numeric'
                 })}
               </span>
               <ExternalLink className={styles.externalIcon} />
             </div>
           </a>
           );
         })}
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

