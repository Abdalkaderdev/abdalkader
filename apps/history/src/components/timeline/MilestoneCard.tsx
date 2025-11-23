'use client';

import { forwardRef } from 'react';
import { motion } from 'framer-motion';
import { TechnicalMilestone } from '@/lib/data/milestones';
import { Card, Badge, Button } from '@abdalkader/ui';
import { ExternalLink, Calendar, Code, TrendingUp } from 'lucide-react';

interface MilestoneCardProps {
  milestone: TechnicalMilestone;
  index: number;
  onClick: () => void;
  position: 'left' | 'right';
}

export const MilestoneCard = forwardRef<HTMLDivElement, MilestoneCardProps>(
  ({ milestone, index, onClick, position }, ref) => {
    const isLeft = position === 'left';
    
    return (
      <motion.div
        ref={ref}
        data-milestone-id={milestone.id}
        initial={{ opacity: 0, x: isLeft ? -50 : 50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: index * 0.1 }}
        className={`relative flex items-center ${isLeft ? 'md:flex-row' : 'md:flex-row-reverse'} flex-col milestone-card`}
      >
      {/* Timeline Dot */}
      <div className="absolute left-8 md:left-1/2 transform -translate-x-1/2 w-4 h-4 rounded-full bg-orange-500 border-4 border-black z-10 shadow-lg" />

      {/* Content Card */}
      <div className={`w-full md:w-5/12 ${isLeft ? 'md:pr-8 md:text-right' : 'md:pl-8'}`}>
        <Card
          className="cursor-pointer hover:border-orange-500 transition-all duration-300 hover:shadow-xl hover:shadow-orange-500/20 milestone-card"
          onClick={onClick}
        >
          <div className="p-6">
            {/* Header */}
            <div className={`flex items-start justify-between mb-4 ${isLeft ? 'md:flex-row-reverse' : ''}`}>
              <div className="flex items-center gap-3">
                <span className="text-3xl">{milestone.icon}</span>
                <div>
                  <h3 className="text-xl font-bold text-white">{milestone.title}</h3>
                  <div className="flex items-center gap-2 mt-1 text-sm text-gray-400">
                    <Calendar className="w-4 h-4" />
                    <span>{new Date(milestone.date).toLocaleDateString('en-US', { 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric' 
                    })}</span>
                  </div>
                </div>
              </div>
              <Badge variant="primary" className="capitalize">
                {milestone.category}
              </Badge>
            </div>

            {/* Description */}
            <p className="text-gray-300 mb-4 line-clamp-3">{milestone.description}</p>

            {/* Technologies */}
            <div className={`flex flex-wrap gap-2 mb-4 ${isLeft ? 'md:justify-end' : ''}`}>
              {milestone.technologies.slice(0, 4).map(tech => (
                <Badge key={tech} variant="secondary" size="sm">
                  {tech}
                </Badge>
              ))}
              {milestone.technologies.length > 4 && (
                <Badge variant="secondary" size="sm">
                  +{milestone.technologies.length - 4}
                </Badge>
              )}
            </div>

            {/* Links Preview */}
            <div className="flex items-center justify-between pt-4 border-t border-gray-700">
              <div className="flex items-center gap-4 text-sm text-gray-400">
                <span className="flex items-center gap-1">
                  <Code className="w-4 h-4" />
                  {milestone.links.length} connection{milestone.links.length !== 1 ? 's' : ''}
                </span>
              </div>
              <Button
                variant="ghost"
                size="small"
                onClick={(e) => {
                  e.stopPropagation();
                  onClick();
                }}
                className="flex items-center gap-2"
              >
                View Details
                <ExternalLink className="w-4 h-4" />
              </Button>
            </div>

            {/* Impact Badge */}
            {milestone.impact && (
              <div className="mt-4 pt-4 border-t border-gray-700">
                <div className="flex items-start gap-2">
                  <TrendingUp className="w-4 h-4 text-orange-500 mt-0.5" />
                  <p className="text-sm text-gray-400 italic">{milestone.impact}</p>
                </div>
              </div>
            )}
          </div>
        </Card>
      </div>
    </motion.div>
    );
  }
);

MilestoneCard.displayName = 'MilestoneCard';

