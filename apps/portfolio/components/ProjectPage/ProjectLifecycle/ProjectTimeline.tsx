import React from 'react';
import { UnifiedProject } from '@/lib/projectRegistry';
import styles from './ProjectLifecycle.module.scss';
import { Calendar, CheckCircle, Code, Rocket, Sparkles } from 'lucide-react';

interface ProjectTimelineProps {
  project: UnifiedProject;
}

export function ProjectTimeline({ project }: ProjectTimelineProps) {
  const events = project.history.timelineEvents || [];

  if (events.length === 0) {
    return (
      <div className={styles.emptyState}>
        <Calendar className={styles.emptyIcon} />
        <p>No timeline events available for this project.</p>
        {project.history.url && (
          <a 
            href={project.history.url} 
            target="_blank" 
            rel="noopener noreferrer"
            className={styles.linkButton}
          >
            View on History Timeline
          </a>
        )}
      </div>
    );
  }

  const getEventIcon = (type: string) => {
    switch (type) {
      case 'milestone':
        return <Sparkles className={styles.eventIcon} />;
      case 'release':
        return <Rocket className={styles.eventIcon} />;
      case 'feature':
        return <Code className={styles.eventIcon} />;
      default:
        return <CheckCircle className={styles.eventIcon} />;
    }
  };

  return (
    <div className={styles.timelineContainer}>
      <div className={styles.timelineLine} />
      <div className={styles.timelineEvents}>
         {events.map((event) => (
           // eslint-disable-next-line @typescript-eslint/no-explicit-any
           <div key={(event as any).id} className={styles.timelineEvent}>
             <div className={styles.eventMarker}>
               {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
               {getEventIcon((event as any).type)}
             </div>
             <div className={styles.eventContent}>
               <div className={styles.eventHeader}>
                 {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                 <h4>{(event as any).title}</h4>
                 <span className={styles.eventDate}>
                   <Calendar className={styles.dateIcon} />
                   {new Date((event as any).date).toLocaleDateString('en-US', {
                     year: 'numeric',
                     month: 'long',
                     day: 'numeric'
                   })}
                 </span>
               </div>
               {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
               <p className={styles.eventDescription}>{(event as any).description}</p>
               {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
               <span className={styles.eventType}>{(event as any).type}</span>
             </div>
           </div>
         ))}
      </div>
      
      {project.history.url && (
        <div className={styles.timelineFooter}>
          <a 
            href={project.history.url} 
            target="_blank" 
            rel="noopener noreferrer"
            className={styles.viewFullTimeline}
          >
            View Full Development Timeline on History
          </a>
        </div>
      )}
    </div>
  );
}

