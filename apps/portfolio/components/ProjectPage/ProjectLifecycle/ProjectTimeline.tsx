import React from 'react';
import { UnifiedProject } from '../../../../../packages/ui/src/lib/projectRegistry';
import { trackCrossDomainLink } from '@/lib/analytics';
import styles from './ProjectLifecycle.module.scss';
import { Calendar, CheckCircle, Code, Rocket, Sparkles } from 'lucide-react';

interface TimelineEvent {
  id: string;
  title: string;
  description: string;
  date: string | Date;
  type: string;
}

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
         {events.map((event) => {
           const timelineEvent = event as TimelineEvent;
           return (
           <div key={timelineEvent.id} className={styles.timelineEvent}>
             <div className={styles.eventMarker}>
               {getEventIcon(timelineEvent.type)}
             </div>
             <div className={styles.eventContent}>
               <div className={styles.eventHeader}>
                 <h4>{timelineEvent.title}</h4>
                 <span className={styles.eventDate}>
                   <Calendar className={styles.dateIcon} />
                   {new Date(timelineEvent.date).toLocaleDateString('en-US', {
                     year: 'numeric',
                     month: 'long',
                     day: 'numeric'
                   })}
                 </span>
               </div>
               <p className={styles.eventDescription}>{timelineEvent.description}</p>
               <span className={styles.eventType}>{timelineEvent.type}</span>
             </div>
           </div>
           );
         })}
      </div>
      
      {project.history.url && (
        <div className={styles.timelineFooter}>
          <a 
            href={project.history.url} 
            target="_blank" 
            rel="noopener noreferrer"
            className={styles.viewFullTimeline}
            onClick={() => trackCrossDomainLink('portfolio', 'history', 'history', project.slug, { milestone_id: project.history.milestoneId })}
          >
            View Full Development Timeline on History
          </a>
        </div>
      )}
    </div>
  );
}

