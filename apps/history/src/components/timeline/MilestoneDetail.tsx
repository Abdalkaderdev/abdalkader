'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { TechnicalMilestone } from '@/lib/data/milestones';
import { Modal, Button, Badge, Card, Tabs } from '@abdalkader/ui';
import { 
  ExternalLink, 
  Calendar, 
  Code, 
  Briefcase, 
  BookOpen, 
  FileText,
  X,
  Globe,
  Github,
  TrendingUp,
  Tag
} from 'lucide-react';
import { openCrossDomainLink } from '@/lib/utils/crossDomainLinks';

interface MilestoneDetailProps {
  milestone: TechnicalMilestone;
  onClose: () => void;
}

export function MilestoneDetail({ milestone, onClose }: MilestoneDetailProps) {
  const linkIcons = {
    portfolio: Briefcase,
    storybook: Code,
    docs: BookOpen,
    blog: FileText,
  };

  const handleLinkClick = (url: string) => {
    openCrossDomainLink(url);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        />

        {/* Modal Content */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-gray-900 rounded-2xl border border-gray-700 shadow-2xl"
        >
          {/* Header */}
          <div className="sticky top-0 bg-gray-900/95 backdrop-blur-sm border-b border-gray-700 p-6 z-10">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-4">
                <span className="text-5xl">{milestone.icon}</span>
                <div>
                  <h2 className="text-3xl font-bold text-white mb-2">{milestone.title}</h2>
                  <div className="flex items-center gap-4 text-sm text-gray-400">
                    <span className="flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      {new Date(milestone.date).toLocaleDateString('en-US', { 
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric' 
                      })}
                    </span>
                    <Badge variant="primary" className="capitalize">
                      {milestone.category}
                    </Badge>
                  </div>
                </div>
              </div>
              <Button
                variant="ghost"
                size="small"
                onClick={onClose}
                className="text-gray-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </Button>
            </div>
          </div>

          {/* Content */}
          <div className="p-6 space-y-6">
            {/* Description */}
            <div>
              <h3 className="text-lg font-semibold text-white mb-2">Description</h3>
              <p className="text-gray-300 leading-relaxed">{milestone.description}</p>
            </div>

            {/* Impact */}
            {milestone.impact && (
              <div className="bg-orange-500/10 border border-orange-500/20 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <TrendingUp className="w-5 h-5 text-orange-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-1">Impact</h3>
                    <p className="text-gray-300">{milestone.impact}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Technologies */}
            <div>
              <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
                <Code className="w-5 h-5" />
                Technologies
              </h3>
              <div className="flex flex-wrap gap-2">
                {milestone.technologies.map(tech => (
                  <Badge key={tech} variant="secondary" size="md">
                    {tech}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Tags */}
            {milestone.tags.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
                  <Tag className="w-5 h-5" />
                  Tags
                </h3>
                <div className="flex flex-wrap gap-2">
                  {milestone.tags.map(tag => (
                    <Badge key={tag} variant="secondary" size="sm">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {/* Connected Resources */}
            <div>
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <Globe className="w-5 h-5" />
                Connected Resources
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {milestone.links.map((link, index) => {
                  const Icon = linkIcons[link.type] || ExternalLink;
                  const typeColors = {
                    portfolio: 'border-orange-500/30 bg-orange-500/10 hover:bg-orange-500/20',
                    storybook: 'border-blue-500/30 bg-blue-500/10 hover:bg-blue-500/20',
                    docs: 'border-purple-500/30 bg-purple-500/10 hover:bg-purple-500/20',
                    blog: 'border-green-500/30 bg-green-500/10 hover:bg-green-500/20',
                  };

                  return (
                    <Card
                      key={index}
                      className={`cursor-pointer transition-all duration-200 ${typeColors[link.type] || 'border-gray-700'}`}
                      onClick={() => handleLinkClick(link.url)}
                    >
                      <div className="p-4">
                        <div className="flex items-start gap-3">
                          <div className="p-2 bg-white/5 rounded-lg">
                            <Icon className="w-5 h-5 text-white" />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <h4 className="font-semibold text-white">{link.title}</h4>
                              <ExternalLink className="w-4 h-4 text-gray-400" />
                            </div>
                            <Badge variant="secondary" size="sm" className="mb-2 capitalize">
                              {link.type}
                            </Badge>
                            {link.description && (
                              <p className="text-sm text-gray-400">{link.description}</p>
                            )}
                          </div>
                        </div>
                      </div>
                    </Card>
                  );
                })}
              </div>
            </div>

            {/* Actions */}
            <div className="flex justify-end gap-3 pt-4 border-t border-gray-700">
              <Button variant="secondary" onClick={onClose}>
                Close
              </Button>
              <Button
                variant="primary"
                onClick={() => {
                  // Open first portfolio link if available, otherwise first link
                  const portfolioLink = milestone.links.find(l => l.type === 'portfolio');
                  const linkToOpen = portfolioLink || milestone.links[0];
                  if (linkToOpen) {
                    handleLinkClick(linkToOpen.url);
                  }
                }}
                className="flex items-center gap-2"
              >
                View Project
                <ExternalLink className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

