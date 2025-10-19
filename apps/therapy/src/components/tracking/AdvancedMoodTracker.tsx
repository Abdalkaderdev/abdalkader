'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  TrendingUp, 
  TrendingDown, 
  Activity, 
  Heart, 
  Brain, 
  Moon, 
  Sun,
  AlertTriangle,
  CheckCircle,
  BarChart3,
  Calendar,
  Target
} from 'lucide-react';
import { InteractiveButton } from '@/components/interactions/InteractiveButton';
import { insightsEngine } from '@/lib/therapy/insightsEngine';
import { useReducedMotion } from '@/hooks/useAnimations';

interface MoodEntry {
  id: string;
  timestamp: number;
  mood: number;
  stress: number;
  energy: number;
  sleep: number;
  anxiety: number;
  depression: number;
  notes?: string;
  tags?: string[];
}

interface MoodTrackerProps {
  onMoodEntry: (entry: MoodEntry) => void;
  className?: string;
}

export const AdvancedMoodTracker: React.FC<MoodTrackerProps> = ({
  onMoodEntry,
  className = ''
}) => {
  const [currentEntry, setCurrentEntry] = useState<Partial<MoodEntry>>({
    mood: 5,
    stress: 5,
    energy: 5,
    sleep: 5,
    anxiety: 5,
    depression: 5,
    tags: []
  });
  const [showInsights, setShowInsights] = useState(false);
  const [insights, setInsights] = useState<any>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const reducedMotion = useReducedMotion();

  // Load insights when component mounts
  useEffect(() => {
    const analysis = insightsEngine.analyzeMoodPatterns();
    setInsights(analysis);
  }, []);

  // Handle mood entry submission
  const handleSubmit = async () => {
    if (!currentEntry.mood || !currentEntry.stress || !currentEntry.energy) return;

    setIsSubmitting(true);
    
    const entry: MoodEntry = {
      id: Date.now().toString(),
      timestamp: Date.now(),
      mood: currentEntry.mood!,
      stress: currentEntry.stress!,
      energy: currentEntry.energy!,
      sleep: currentEntry.sleep!,
      anxiety: currentEntry.anxiety!,
      depression: currentEntry.depression!,
      notes: currentEntry.notes,
      tags: currentEntry.tags || []
    };

    // Add to insights engine
    insightsEngine.addMoodEntry(entry);
    
    // Call parent callback
    onMoodEntry(entry);
    
    // Reset form
    setCurrentEntry({
      mood: 5,
      stress: 5,
      energy: 5,
      sleep: 5,
      anxiety: 5,
      depression: 5,
      tags: []
    });
    
    setIsSubmitting(false);
    
    // Update insights
    const newAnalysis = insightsEngine.analyzeMoodPatterns();
    setInsights(newAnalysis);
  };

  // Handle slider change
  const handleSliderChange = (field: keyof MoodEntry, value: number) => {
    setCurrentEntry(prev => ({ ...prev, [field]: value }));
  };

  // Handle tag toggle
  const handleTagToggle = (tag: string) => {
    setCurrentEntry(prev => ({
      ...prev,
      tags: prev.tags?.includes(tag) 
        ? prev.tags.filter(t => t !== tag)
        : [...(prev.tags || []), tag]
    }));
  };

  // Get mood color based on value
  const getMoodColor = (value: number): string => {
    if (value <= 3) return '#ef4444'; // red
    if (value <= 5) return '#f59e0b'; // orange
    if (value <= 7) return '#eab308'; // yellow
    return '#10b981'; // green
  };

  // Get mood emoji based on value
  const getMoodEmoji = (value: number): string => {
    if (value <= 2) return '😢';
    if (value <= 4) return '😔';
    if (value <= 6) return '😐';
    if (value <= 8) return '😊';
    return '😄';
  };

  // Get trend icon
  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'improving': return <TrendingUp className="w-4 h-4 text-green-400" />;
      case 'declining': return <TrendingDown className="w-4 h-4 text-red-400" />;
      default: return <Activity className="w-4 h-4 text-blue-400" />;
    }
  };

  // Get risk level color
  const getRiskColor = (level: string): string => {
    switch (level) {
      case 'low': return '#10b981';
      case 'medium': return '#f59e0b';
      case 'high': return '#ef4444';
      default: return '#6b7280';
    }
  };

  const moodTags = [
    'Work stress', 'Relationship', 'Health', 'Family', 'Financial',
    'Social', 'Creative', 'Physical', 'Emotional', 'Spiritual'
  ];

  const moodMetrics = [
    { key: 'mood', label: 'Mood', icon: Heart, color: '#ef4444' },
    { key: 'stress', label: 'Stress', icon: AlertTriangle, color: '#f59e0b' },
    { key: 'energy', label: 'Energy', icon: Sun, color: '#eab308' },
    { key: 'sleep', label: 'Sleep', icon: Moon, color: '#8b5cf6' },
    { key: 'anxiety', label: 'Anxiety', icon: Brain, color: '#06b6d4' },
    { key: 'depression', label: 'Depression', icon: Activity, color: '#6366f1' }
  ];

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <div className="text-center">
        <h2 className="portfolio-hero-text text-white mb-2">Mood Tracker</h2>
        <p className="portfolio-base-text text-gray-400">
          Track your emotional well-being and discover patterns
        </p>
      </div>

      {/* Current Mood Display */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gray-800/50 rounded-lg p-6 text-center"
      >
        <div className="text-6xl mb-4">
          {getMoodEmoji(currentEntry.mood || 5)}
        </div>
        <div 
          className="text-2xl font-bold mb-2"
          style={{ color: getMoodColor(currentEntry.mood || 5) }}
        >
          {currentEntry.mood || 5}/10
        </div>
        <p className="portfolio-base-text text-gray-400">
          {currentEntry.mood && currentEntry.mood <= 3 ? 'I need support' :
           currentEntry.mood && currentEntry.mood <= 5 ? 'I\'m okay' :
           currentEntry.mood && currentEntry.mood <= 7 ? 'I\'m good' :
           'I\'m great!'}
        </p>
      </motion.div>

      {/* Mood Metrics */}
      <div className="space-y-4">
        {moodMetrics.map((metric, index) => (
          <motion.div
            key={metric.key}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-gray-800/30 rounded-lg p-4"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <metric.icon className="w-5 h-5" style={{ color: metric.color }} />
                <span className="portfolio-base-text text-white">{metric.label}</span>
              </div>
              <span 
                className="portfolio-base-text font-bold"
                style={{ color: getMoodColor(currentEntry[metric.key as keyof MoodEntry] as number || 5) }}
              >
                {currentEntry[metric.key as keyof MoodEntry] || 5}/10
              </span>
            </div>
            
            <input
              type="range"
              min="1"
              max="10"
              value={currentEntry[metric.key as keyof MoodEntry] || 5}
              onChange={(e) => handleSliderChange(metric.key as keyof MoodEntry, parseInt(e.target.value))}
              className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
              style={{
                background: `linear-gradient(to right, ${metric.color} 0%, ${metric.color} ${((currentEntry[metric.key as keyof MoodEntry] as number || 5) - 1) * 11.11}%, #374151 ${((currentEntry[metric.key as keyof MoodEntry] as number || 5) - 1) * 11.11}%, #374151 100%)`
              }}
            />
            
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>Very Low</span>
              <span>Very High</span>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Tags */}
      <div className="space-y-3">
        <h3 className="portfolio-medium-text text-white">What's affecting your mood?</h3>
        <div className="flex flex-wrap gap-2">
          {moodTags.map((tag) => (
            <button
              key={tag}
              onClick={() => handleTagToggle(tag)}
              className={`px-3 py-1 rounded-full text-sm transition-colors ${
                currentEntry.tags?.includes(tag)
                  ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                  : 'bg-gray-700/50 text-gray-300 border border-gray-600/30 hover:bg-gray-600/50'
              }`}
            >
              {tag}
            </button>
          ))}
        </div>
      </div>

      {/* Notes */}
      <div className="space-y-3">
        <h3 className="portfolio-medium-text text-white">Additional Notes</h3>
        <textarea
          value={currentEntry.notes || ''}
          onChange={(e) => setCurrentEntry(prev => ({ ...prev, notes: e.target.value }))}
          placeholder="How are you feeling? What's on your mind?"
          className="w-full h-24 bg-gray-800/50 border border-gray-600/30 rounded-lg p-3 text-white placeholder-gray-400 focus:outline-none focus:border-green-500/50 focus:ring-1 focus:ring-green-500/20"
        />
      </div>

      {/* Submit Button */}
      <InteractiveButton
        onClick={handleSubmit}
        disabled={isSubmitting}
        variant="primary"
        className="w-full"
      >
        {isSubmitting ? 'Saving...' : 'Save Mood Entry'}
      </InteractiveButton>

      {/* Insights Toggle */}
      <InteractiveButton
        onClick={() => setShowInsights(!showInsights)}
        variant="ghost"
        className="w-full"
      >
        <BarChart3 className="w-4 h-4 mr-2" />
        {showInsights ? 'Hide Insights' : 'Show Insights'}
      </InteractiveButton>

      {/* Insights Panel */}
      <AnimatePresence>
        {showInsights && insights && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-gray-800/50 rounded-lg p-6 space-y-4"
          >
            <h3 className="portfolio-medium-text text-white flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-green-400" />
              Your Mood Insights
            </h3>

            {/* Current Status */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-gray-700/50 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  {getTrendIcon(insights.moodTrend)}
                  <span className="portfolio-small-text text-gray-300">Mood Trend</span>
                </div>
                <p className="portfolio-base-text text-white capitalize">
                  {insights.moodTrend}
                </p>
              </div>

              <div className="bg-gray-700/50 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <AlertTriangle className="w-4 h-4" style={{ color: getRiskColor(insights.stressLevel) }} />
                  <span className="portfolio-small-text text-gray-300">Stress Level</span>
                </div>
                <p className="portfolio-base-text text-white capitalize">
                  {insights.stressLevel}
                </p>
              </div>

              <div className="bg-gray-700/50 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Target className="w-4 h-4 text-blue-400" />
                  <span className="portfolio-small-text text-gray-300">Risk Level</span>
                </div>
                <p className="portfolio-base-text text-white capitalize">
                  {insights.riskFactors.length > 0 ? 'Medium' : 'Low'}
                </p>
              </div>
            </div>

            {/* Risk Factors */}
            {insights.riskFactors.length > 0 && (
              <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4">
                <h4 className="portfolio-small-text text-red-400 font-medium mb-2">
                  Risk Factors Identified
                </h4>
                <ul className="space-y-1">
                  {insights.riskFactors.map((factor: string, index: number) => (
                    <li key={index} className="portfolio-small-text text-red-300 flex items-center gap-2">
                      <AlertTriangle className="w-3 h-3" />
                      {factor}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Protective Factors */}
            {insights.protectiveFactors.length > 0 && (
              <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4">
                <h4 className="portfolio-small-text text-green-400 font-medium mb-2">
                  Protective Factors
                </h4>
                <ul className="space-y-1">
                  {insights.protectiveFactors.map((factor: string, index: number) => (
                    <li key={index} className="portfolio-small-text text-green-300 flex items-center gap-2">
                      <CheckCircle className="w-3 h-3" />
                      {factor}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Recommendations */}
            <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
              <h4 className="portfolio-small-text text-blue-400 font-medium mb-2">
                Recommendations
              </h4>
              <ul className="space-y-1">
                {insights.recommendations.map((rec: string, index: number) => (
                  <li key={index} className="portfolio-small-text text-blue-300 flex items-start gap-2">
                    <span className="text-blue-400 mt-1">•</span>
                    {rec}
                  </li>
                ))}
              </ul>
            </div>

            {/* Patterns */}
            {insights.patterns && insights.patterns.length > 0 && (
              <div className="bg-purple-500/10 border border-purple-500/30 rounded-lg p-4">
                <h4 className="portfolio-small-text text-purple-400 font-medium mb-2">
                  Detected Patterns
                </h4>
                <div className="space-y-3">
                  {insights.patterns.map((pattern: any, index: number) => (
                    <div key={index} className="bg-gray-700/30 rounded p-3">
                      <h5 className="portfolio-small-text text-purple-300 font-medium mb-1">
                        {pattern.title}
                      </h5>
                      <p className="portfolio-small-text text-gray-300">
                        {pattern.description}
                      </p>
                      <div className="mt-2">
                        <span className="text-xs text-purple-400">
                          Confidence: {Math.round(pattern.confidence * 100)}%
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdvancedMoodTracker;