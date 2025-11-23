'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { TechnicalMilestone, getAllYears, getMilestonesByYear } from '@/lib/data/milestones';
import { MilestoneCard } from './MilestoneCard';
import { MilestoneDetail } from './MilestoneDetail';
import { Card, Button, Tabs, Badge } from '@abdalkader/ui';
import { 
  Calendar, 
  Filter, 
  Search, 
  ExternalLink, 
  Code, 
  BookOpen, 
  FileText, 
  Briefcase,
  TrendingUp,
  Sparkles
} from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

interface UnifiedTimelineProps {
  onMilestoneSelect?: (milestone: TechnicalMilestone) => void;
}

export function UnifiedTimeline({ onMilestoneSelect }: UnifiedTimelineProps) {
  const [selectedYear, setSelectedYear] = useState<number | null>(null);
  const [selectedMilestone, setSelectedMilestone] = useState<TechnicalMilestone | null>(null);
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'timeline' | 'grid'>('timeline');
  const timelineRef = useRef<HTMLDivElement>(null);
  const years = getAllYears();
  const currentYear = new Date().getFullYear();

  // Get filtered milestones
  const getFilteredMilestones = (): TechnicalMilestone[] => {
    let milestones = selectedYear 
      ? getMilestonesByYear(selectedYear)
      : getMilestonesByYear(currentYear);

    if (filterCategory !== 'all') {
      milestones = milestones.filter(m => m.category === filterCategory);
    }

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      milestones = milestones.filter(m => 
        m.title.toLowerCase().includes(query) ||
        m.description.toLowerCase().includes(query) ||
        m.technologies.some(t => t.toLowerCase().includes(query)) ||
        m.tags.some(t => t.toLowerCase().includes(query))
      );
    }

    return milestones.sort((a, b) => {
      const dateA = new Date(a.date).getTime();
      const dateB = new Date(b.date).getTime();
      return dateB - dateA; // Most recent first
    });
  };

  const filteredMilestones = getFilteredMilestones();

  useEffect(() => {
    if (timelineRef.current && viewMode === 'timeline') {
      const cards = timelineRef.current.querySelectorAll('.milestone-card');
      
      gsap.fromTo(cards, 
        { 
          opacity: 0, 
          y: 50,
          scale: 0.95
        },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.6,
          stagger: 0.1,
          ease: "power2.out",
          scrollTrigger: {
            trigger: timelineRef.current,
            start: "top 80%",
            toggleActions: "play none none reverse"
          }
        }
      );
    }
  }, [filteredMilestones, viewMode]);

  const handleMilestoneClick = (milestone: TechnicalMilestone) => {
    setSelectedMilestone(milestone);
    if (onMilestoneSelect) {
      onMilestoneSelect(milestone);
    }
  };

  const categories = [
    { value: 'all', label: 'All', icon: Sparkles },
    { value: 'project', label: 'Projects', icon: Briefcase },
    { value: 'component', label: 'Components', icon: Code },
    { value: 'learning', label: 'Learning', icon: BookOpen },
    { value: 'achievement', label: 'Achievements', icon: TrendingUp },
  ];

  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-black via-gray-900 to-black py-12">
      <div className="container mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <h1 className="text-4xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-orange-500 to-orange-300 bg-clip-text text-transparent">
            Technical Evolution Timeline
          </h1>
          <p className="text-gray-400 text-lg md:text-xl max-w-3xl">
            Explore my journey through web development, from early projects to cutting-edge innovations. 
            Each milestone connects to portfolio projects, Storybook components, documentation, and blog posts.
          </p>
        </motion.div>

        {/* Filters and Controls */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8 space-y-4"
        >
          {/* Year Selector */}
          <div className="flex flex-wrap gap-2 mb-4">
            <Button
              variant={selectedYear === null ? 'primary' : 'secondary'}
              size="small"
              onClick={() => setSelectedYear(null)}
            >
              All Years
            </Button>
            {years.map(year => (
              <Button
                key={year}
                variant={selectedYear === year ? 'primary' : 'secondary'}
                size="small"
                onClick={() => setSelectedYear(year)}
              >
                {year}
              </Button>
            ))}
          </div>

          {/* Search and Category Filter */}
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search milestones, technologies, tags..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>

            <div className="flex gap-2 flex-wrap">
              {categories.map(cat => {
                const Icon = cat.icon;
                return (
                  <Button
                    key={cat.value}
                    variant={filterCategory === cat.value ? 'primary' : 'secondary'}
                    size="small"
                    onClick={() => setFilterCategory(cat.value)}
                    className="flex items-center gap-2"
                  >
                    <Icon className="w-4 h-4" />
                    {cat.label}
                  </Button>
                );
              })}
            </div>

            <div className="flex gap-2">
              <Button
                variant={viewMode === 'timeline' ? 'primary' : 'secondary'}
                size="small"
                onClick={() => setViewMode('timeline')}
              >
                Timeline
              </Button>
              <Button
                variant={viewMode === 'grid' ? 'primary' : 'secondary'}
                size="small"
                onClick={() => setViewMode('grid')}
              >
                Grid
              </Button>
            </div>
          </div>

          {/* Results Count */}
          <div className="text-gray-400 text-sm">
            Showing {filteredMilestones.length} milestone{filteredMilestones.length !== 1 ? 's' : ''}
            {selectedYear && ` in ${selectedYear}`}
            {filterCategory !== 'all' && ` • ${categories.find(c => c.value === filterCategory)?.label}`}
          </div>
        </motion.div>

        {/* Timeline View */}
        {viewMode === 'timeline' ? (
          <div ref={timelineRef} className="relative">
            {/* Timeline Line */}
            <div className="absolute left-8 md:left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-orange-500 via-orange-400 to-orange-500 opacity-30" />

            <div className="space-y-8">
              {filteredMilestones.map((milestone, index) => (
                <MilestoneCard
                  key={milestone.id}
                  milestone={milestone}
                  index={index}
                  onClick={() => handleMilestoneClick(milestone)}
                  position={index % 2 === 0 ? 'left' : 'right'}
                />
              ))}
            </div>

            {filteredMilestones.length === 0 && (
              <div className="text-center py-20">
                <p className="text-gray-400 text-lg">No milestones found matching your criteria.</p>
                <Button
                  variant="secondary"
                  onClick={() => {
                    setSearchQuery('');
                    setFilterCategory('all');
                    setSelectedYear(null);
                  }}
                  className="mt-4"
                >
                  Clear Filters
                </Button>
              </div>
            )}
          </div>
        ) : (
          /* Grid View */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredMilestones.map((milestone) => (
              <motion.div
                key={milestone.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                whileHover={{ scale: 1.02 }}
                className="milestone-card"
              >
                <Card
                  className="h-full cursor-pointer hover:border-orange-500 transition-colors"
                  onClick={() => handleMilestoneClick(milestone)}
                >
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <span className="text-4xl">{milestone.icon}</span>
                      <Badge variant="primary">{milestone.category}</Badge>
                    </div>
                    <h3 className="text-xl font-bold mb-2 text-white">{milestone.title}</h3>
                    <p className="text-gray-400 text-sm mb-4 line-clamp-3">{milestone.description}</p>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {milestone.technologies.slice(0, 3).map(tech => (
                        <Badge key={tech} variant="secondary" size="sm">
                          {tech}
                        </Badge>
                      ))}
                      {milestone.technologies.length > 3 && (
                        <Badge variant="secondary" size="sm">
                          +{milestone.technologies.length - 3}
                        </Badge>
                      )}
                    </div>
                    <div className="flex items-center justify-between text-sm text-gray-500">
                      <span>{new Date(milestone.date).toLocaleDateString()}</span>
                      <span className="flex items-center gap-1">
                        {milestone.links.length} link{milestone.links.length !== 1 ? 's' : ''}
                        <ExternalLink className="w-4 h-4" />
                      </span>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        )}

        {/* Milestone Detail Modal */}
        <AnimatePresence>
          {selectedMilestone && (
            <MilestoneDetail
              milestone={selectedMilestone}
              onClose={() => setSelectedMilestone(null)}
            />
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

