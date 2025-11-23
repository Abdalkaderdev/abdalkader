import React, { useState } from 'react';
// @ts-expect-error - Direct import from source until package is built
import { getProjectBySlug } from '../../../../../packages/ui/src/lib/projectRegistry';
import { ProjectTimeline } from './ProjectTimeline';
import { ProjectComponents } from './ProjectComponents';
import { ProjectDocumentation } from './ProjectDocumentation';
import { ProjectBlogPosts } from './ProjectBlogPosts';
import styles from './ProjectLifecycle.module.scss';
import { 
  Code, 
  BookOpen, 
  FileText, 
  ExternalLink,
  History,
  Sparkles
} from 'lucide-react';

interface ProjectLifecycleProps {
  projectSlug: string;
}

export function ProjectLifecycle({ projectSlug }: ProjectLifecycleProps) {
  const [activeTab, setActiveTab] = useState<'timeline' | 'components' | 'docs' | 'blog'>('timeline');
  const project = getProjectBySlug(projectSlug);

  if (!project) {
    return (
      <div className={styles.notFound}>
        <p>Project lifecycle information not available for this project.</p>
      </div>
    );
  }

  const tabs = [
    { id: 'timeline' as const, label: 'Development Timeline', icon: History, count: project.history.timelineEvents?.length || 0 },
    { id: 'components' as const, label: 'Storybook Components', icon: Code, count: project.storybook.components.length },
    { id: 'docs' as const, label: 'Documentation', icon: BookOpen, count: project.docs.sections.length },
    { id: 'blog' as const, label: 'Blog Posts', icon: FileText, count: project.blog.posts.length },
  ];

  return (
    <section className={styles.projectLifecycle}>
      <div className={styles.header}>
        <div className={styles.titleSection}>
          <Sparkles className={styles.icon} />
          <h2>Project Lifecycle</h2>
          <p className={styles.subtitle}>
            Explore this project across the entire ecosystem
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className={styles.tabs}>
        {tabs.map(tab => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              className={`${styles.tab} ${activeTab === tab.id ? styles.active : ''}`}
              onClick={() => setActiveTab(tab.id)}
            >
              <Icon className={styles.tabIcon} />
              <span>{tab.label}</span>
              {tab.count > 0 && (
                <span className={styles.badge}>{tab.count}</span>
              )}
            </button>
          );
        })}
      </div>

      {/* Tab Content */}
      <div className={styles.content}>
        {activeTab === 'timeline' && (
          <ProjectTimeline project={project} />
        )}
        
        {activeTab === 'components' && (
          <ProjectComponents project={project} />
        )}
        
        {activeTab === 'docs' && (
          <ProjectDocumentation project={project} />
        )}
        
        {activeTab === 'blog' && (
          <ProjectBlogPosts project={project} />
        )}
      </div>

      {/* Quick Links */}
      <div className={styles.quickLinks}>
        <h3>Quick Links</h3>
        <div className={styles.linksGrid}>
          {project.history.url && (
            <a 
              href={project.history.url} 
              target="_blank" 
              rel="noopener noreferrer"
              className={styles.quickLink}
            >
              <History className={styles.linkIcon} />
              <span>View on Timeline</span>
              <ExternalLink className={styles.externalIcon} />
            </a>
          )}
          {project.storybook.url && (
            <a 
              href={project.storybook.url} 
              target="_blank" 
              rel="noopener noreferrer"
              className={styles.quickLink}
            >
              <Code className={styles.linkIcon} />
              <span>Browse Components</span>
              <ExternalLink className={styles.externalIcon} />
            </a>
          )}
          {project.docs.baseUrl && (
            <a 
              href={`${project.docs.baseUrl}/projects/${project.slug}`} 
              target="_blank" 
              rel="noopener noreferrer"
              className={styles.quickLink}
            >
              <BookOpen className={styles.linkIcon} />
              <span>View Documentation</span>
              <ExternalLink className={styles.externalIcon} />
            </a>
          )}
        </div>
      </div>
    </section>
  );
}

