'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bot, MessageCircle, Code, Scale, Map, GitBranch, Mic, Settings } from 'lucide-react';
import { InteractiveCard } from '@/components/interactions/InteractiveCard';
import { InteractiveButton } from '@/components/interactions/InteractiveButton';
import { EnhancedAIChat } from '@/components/ai/EnhancedAIChat';
import { CodeTransformationAI } from '@/components/ai/CodeTransformationAI';
import { ParadigmComparisonAI } from '@/components/ai/ParadigmComparisonAI';
import { PersonalLearningPathAI } from '@/components/ai/PersonalLearningPathAI';
import { FamilyTreeExplanationsAI } from '@/components/ai/FamilyTreeExplanationsAI';
import { VoiceToAI } from '@/components/ai/VoiceToAI';
import { useSmartCache, useOfflineContent } from '@/hooks/useSmartCache';
import { useReducedMotion } from '@/hooks/useAnimations';

interface EnhancedAIIntegrationProps {
  className?: string;
}

type AIFeature = 
  | 'chat'
  | 'code-transform'
  | 'paradigm-comparison'
  | 'learning-path'
  | 'family-tree'
  | 'voice';

const aiFeatures = [
  {
    id: 'chat' as AIFeature,
    title: 'Real-time Q&A Chat',
    description: 'Ask questions about programming languages and get instant AI responses',
    icon: MessageCircle,
    color: '#4ECDC4',
    component: EnhancedAIChat,
  },
  {
    id: 'code-transform' as AIFeature,
    title: 'Code Transformation',
    description: 'Transform modern code to historical programming styles',
    icon: Code,
    color: '#45B7D1',
    component: CodeTransformationAI,
  },
  {
    id: 'paradigm-comparison' as AIFeature,
    title: 'Paradigm Comparison',
    description: 'Compare programming paradigms in historical context',
    icon: Scale,
    color: '#96CEB4',
    component: ParadigmComparisonAI,
  },
  {
    id: 'learning-path' as AIFeature,
    title: 'Personal Learning Path',
    description: 'Get AI-generated learning paths tailored to your interests',
    icon: Map,
    color: '#FECA57',
    component: PersonalLearningPathAI,
  },
  {
    id: 'family-tree' as AIFeature,
    title: 'Family Tree Explanations',
    description: 'AI-generated explanations about language relationships',
    icon: GitBranch,
    color: '#FF9FF3',
    component: FamilyTreeExplanationsAI,
  },
  {
    id: 'voice' as AIFeature,
    title: 'Voice-to-AI Chat',
    description: 'Have voice conversations with AI about programming',
    icon: Mic,
    color: '#54A0FF',
    component: VoiceToAI,
  },
];

export const EnhancedAIIntegration: React.FC<EnhancedAIIntegrationProps> = ({
  className = '',
}) => {
  const [activeFeature, setActiveFeature] = useState<AIFeature>('chat');
  const [isOffline, setIsOffline] = useState(false);
  const reducedMotion = useReducedMotion();

  // Cache and offline content management
  const { cacheStats } = useSmartCache('ai-features', async () => aiFeatures);
  const { content: offlineContent, getContentByCategory } = useOfflineContent();

  // Check online status
  React.useEffect(() => {
    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    setIsOffline(!navigator.onLine);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const activeFeatureData = aiFeatures.find(feature => feature.id === activeFeature);
  const ActiveComponent = activeFeatureData?.component;

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <div className="flex items-center justify-center gap-4 mb-6">
          <motion.div
            className="w-16 h-16 rounded-xl bg-gradient-to-r from-orange-500 to-red-500 flex items-center justify-center text-3xl shadow-lg"
            animate={reducedMotion ? {} : { rotate: [0, 5, -5, 0] }}
            transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
          >
            <Bot className="w-8 h-8 text-black" />
          </motion.div>
          <div>
            <h1 className="portfolio-hero-text text-white">Enhanced AI Integration</h1>
            <p className="portfolio-large-text text-orange-400">Advanced AI-Powered Learning Tools</p>
          </div>
        </div>
        
        <p className="portfolio-base-text text-gray-300 max-w-4xl mx-auto leading-relaxed">
          Experience the future of programming education with our advanced AI integration. 
          From real-time conversations to code transformations, get personalized insights 
          and learn at your own pace with intelligent assistance.
        </p>

        {/* Offline Indicator */}
        {isOffline && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-4 inline-flex items-center gap-2 bg-yellow-500/20 border border-yellow-500/30 rounded-lg px-4 py-2"
          >
            <div className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse" />
            <span className="portfolio-small-text text-yellow-300">
              Offline Mode - Using cached content and offline fallbacks
            </span>
          </motion.div>
        )}
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Feature Navigation */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
        >
          <InteractiveCard variant="ai" className="h-full">
            <div className="space-y-4">
              <h3 className="portfolio-medium-text text-white">AI Features</h3>
              
              <div className="space-y-2">
                {aiFeatures.map((feature, index) => (
                  <motion.button
                    key={feature.id}
                    onClick={() => setActiveFeature(feature.id)}
                    className={`w-full p-3 rounded-lg border transition-all text-left ${
                      activeFeature === feature.id
                        ? 'border-orange-500 bg-orange-500/10'
                        : 'border-gray-600 hover:border-orange-500/50'
                    }`}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 + index * 0.1, duration: 0.4 }}
                    whileHover={reducedMotion ? {} : { scale: 1.02 }}
                    whileTap={reducedMotion ? {} : { scale: 0.98 }}
                  >
                    <div className="flex items-center gap-3">
                      <div 
                        className="w-8 h-8 rounded-lg flex items-center justify-center"
                        style={{ backgroundColor: feature.color + '20' }}
                      >
                        <feature.icon 
                          className="w-4 h-4" 
                          style={{ color: feature.color }}
                        />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm text-white font-medium">{feature.title}</p>
                        <p className="text-xs text-gray-400 line-clamp-2">{feature.description}</p>
                      </div>
                    </div>
                  </motion.button>
                ))}
              </div>

              {/* Cache Stats */}
              <div className="mt-6 p-3 bg-gray-800/50 rounded-lg">
                <h4 className="portfolio-small-text text-orange-400 mb-2">Cache Statistics</h4>
                <div className="space-y-1 text-xs text-gray-300">
                  <div className="flex justify-between">
                    <span>Items:</span>
                    <span>{cacheStats.totalItems}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Memory:</span>
                    <span>{(cacheStats.memoryUsage / 1024).toFixed(1)}KB</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Status:</span>
                    <span className={isOffline ? 'text-yellow-400' : 'text-green-400'}>
                      {isOffline ? 'Offline' : 'Online'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </InteractiveCard>
        </motion.div>

        {/* Active Feature Content */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="lg:col-span-3"
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={activeFeature}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3, ease: [0.19, 1, 0.22, 1] }}
            >
              {ActiveComponent && (
                <ActiveComponent 
                  context={activeFeature}
                  className="w-full"
                />
              )}
            </motion.div>
          </AnimatePresence>
        </motion.div>
      </div>

      {/* Offline Content Fallback */}
      {isOffline && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-8"
        >
          <InteractiveCard variant="ai">
            <div className="space-y-4">
              <h3 className="portfolio-medium-text text-white">Offline Content Available</h3>
              <p className="portfolio-base-text text-gray-300">
                While offline, you can still access these pre-loaded educational materials:
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {offlineContent.map((content, index) => (
                  <motion.div
                    key={content.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1, duration: 0.4 }}
                    className="p-4 bg-gray-800/50 rounded-lg border border-gray-700"
                  >
                    <h4 className="portfolio-small-text text-orange-400 mb-2">{content.title}</h4>
                    <p className="text-xs text-gray-300 line-clamp-3">{content.content}</p>
                    <div className="mt-2">
                      <span className="text-xs text-gray-500 capitalize">{content.category}</span>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </InteractiveCard>
        </motion.div>
      )}
    </div>
  );
};

export default EnhancedAIIntegration;