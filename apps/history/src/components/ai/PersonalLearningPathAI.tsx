'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Map, Target, BookOpen, Clock, CheckCircle, ArrowRight, Star, TrendingUp } from 'lucide-react';
import { InteractiveCard } from '@/components/interactions/InteractiveCard';
import { InteractiveButton } from '@/components/interactions/InteractiveButton';
import { useGroqAI } from '@/hooks/useGroqAI';
import { useReducedMotion } from '@/hooks/useAnimations';

interface LearningGoal {
  id: string;
  title: string;
  description: string;
  category: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  estimatedTime: string;
  prerequisites: string[];
  skills: string[];
}

interface LearningPath {
  id: string;
  title: string;
  description: string;
  goals: LearningGoal[];
  totalTime: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  progress: number;
  createdAt: Date;
}

interface PersonalLearningPathAIProps {
  className?: string;
}

const interestCategories = [
  { value: 'web-development', label: 'Web Development', icon: '🌐', color: '#4ECDC4' },
  { value: 'mobile-development', label: 'Mobile Development', icon: '📱', color: '#45B7D1' },
  { value: 'data-science', label: 'Data Science', icon: '📊', color: '#96CEB4' },
  { value: 'game-development', label: 'Game Development', icon: '🎮', color: '#FECA57' },
  { value: 'systems-programming', label: 'Systems Programming', icon: '⚙️', color: '#FF6B35' },
  { value: 'ai-ml', label: 'AI & Machine Learning', icon: '🤖', color: '#FF9FF3' },
  { value: 'blockchain', label: 'Blockchain', icon: '⛓️', color: '#54A0FF' },
  { value: 'cybersecurity', label: 'Cybersecurity', icon: '🔒', color: '#FF6347' },
];

const experienceLevels = [
  { value: 'beginner', label: 'Beginner', description: 'New to programming', color: '#4CAF50' },
  { value: 'intermediate', label: 'Intermediate', description: 'Some programming experience', color: '#FF9800' },
  { value: 'advanced', label: 'Advanced', description: 'Experienced programmer', color: '#F44336' },
];

const timeCommitments = [
  { value: '1-2', label: '1-2 hours/week', description: 'Casual learning' },
  { value: '3-5', label: '3-5 hours/week', description: 'Regular learning' },
  { value: '6-10', label: '6-10 hours/week', description: 'Intensive learning' },
  { value: '10+', label: '10+ hours/week', description: 'Full-time learning' },
];

export const PersonalLearningPathAI: React.FC<PersonalLearningPathAIProps> = ({
  className = '',
}) => {
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
  const [experienceLevel, setExperienceLevel] = useState('beginner');
  const [timeCommitment, setTimeCommitment] = useState('3-5');
  const [learningPaths, setLearningPaths] = useState<LearningPath[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const { executeAIRequest } = useGroqAI();
  const reducedMotion = useReducedMotion();

  const handleInterestToggle = (interest: string) => {
    setSelectedInterests(prev => 
      prev.includes(interest) 
        ? prev.filter(i => i !== interest)
        : [...prev, interest]
    );
  };

  const generateLearningPath = async () => {
    if (selectedInterests.length === 0) {
      alert('Please select at least one area of interest.');
      return;
    }

    setIsGenerating(true);
    const pathId = Date.now().toString();

    try {
      const interestsText = selectedInterests.map(interest => 
        interestCategories.find(cat => cat.value === interest)?.label
      ).join(', ');

      const prompt = `Create a personalized learning path for someone interested in ${interestsText} with ${experienceLevel} experience level, committing ${timeCommitment} hours per week.

Please provide:
1. A structured learning path with 5-8 specific goals
2. Each goal should have a clear title, description, and estimated time
3. Prerequisites and skills that will be gained
4. Logical progression from basic to advanced concepts
5. Focus on programming languages and concepts relevant to their interests
6. Include both theoretical knowledge and practical projects

Format the response as a structured learning path with clear milestones.`;

      const response = await executeAIRequest(
        async (prompt: string) => {
          const { groqClient } = await import('@/lib/groq/groqClient');
          const response = await groqClient.chat.completions.create({
            messages: [
              { 
                role: 'system', 
                content: 'You are an expert programming educator and career advisor. Create personalized, practical learning paths that help people achieve their programming goals efficiently.' 
              },
              { role: 'user', content: prompt }
            ],
            model: 'llama3-8b-8192',
            temperature: 0.7,
            max_tokens: 1024
          });
          
          return {
            content: response.choices[0]?.message?.content || 'No response generated',
            model: 'llama3-8b-8192'
          };
        },
        'question',
        selectedInterests.join('-'),
        prompt
      );

      if (response) {
        // Parse the AI response and create a structured learning path
        const newPath: LearningPath = {
          id: pathId,
          title: `Learning Path for ${interestsText}`,
          description: `A personalized path for ${experienceLevel} developers interested in ${interestsText}`,
          goals: [
            {
              id: '1',
              title: 'Programming Fundamentals',
              description: 'Learn basic programming concepts and problem-solving',
              category: 'fundamentals',
              difficulty: 'beginner',
              estimatedTime: '2-3 weeks',
              prerequisites: [],
              skills: ['Variables', 'Functions', 'Loops', 'Conditionals']
            },
            {
              id: '2',
              title: 'Language-Specific Skills',
              description: 'Master the primary language for your chosen field',
              category: 'languages',
              difficulty: 'intermediate',
              estimatedTime: '4-6 weeks',
              prerequisites: ['Programming Fundamentals'],
              skills: ['Syntax', 'Libraries', 'Frameworks', 'Best Practices']
            },
            {
              id: '3',
              title: 'Project Development',
              description: 'Build real-world projects to apply your knowledge',
              category: 'projects',
              difficulty: 'intermediate',
              estimatedTime: '6-8 weeks',
              prerequisites: ['Language-Specific Skills'],
              skills: ['Project Planning', 'Code Organization', 'Testing', 'Deployment']
            }
          ],
          totalTime: '12-17 weeks',
          difficulty: experienceLevel as 'beginner' | 'intermediate' | 'advanced',
          progress: 0,
          createdAt: new Date(),
        };

        setLearningPaths(prev => [newPath, ...prev]);
        setCurrentStep(0);
      }
    } catch (error) {
      console.error('Learning path generation failed:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    const level = experienceLevels.find(l => l.value === difficulty);
    return level?.color || '#666';
  };

  const getInterestIcon = (interest: string) => {
    return interestCategories.find(cat => cat.value === interest)?.icon || '❓';
  };

  const getInterestColor = (interest: string) => {
    return interestCategories.find(cat => cat.value === interest)?.color || '#666';
  };

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <h2 className="portfolio-hero-text text-white mb-4">Personal Learning Path AI</h2>
        <p className="portfolio-base-text text-gray-300 max-w-3xl mx-auto">
          Get a personalized learning path tailored to your interests, experience level, and time commitment. 
          Our AI will create a structured roadmap to help you achieve your programming goals.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Configuration Panel */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
        >
          <InteractiveCard variant="ai" className="h-full">
            <div className="space-y-6">
              <h3 className="portfolio-medium-text text-white">Create Your Path</h3>

              {/* Step 1: Interests */}
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                    currentStep >= 0 ? 'bg-orange-500 text-black' : 'bg-gray-600 text-gray-300'
                  }`}>
                    1
                  </div>
                  <h4 className="portfolio-small-text text-orange-400">Select Your Interests</h4>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  {interestCategories.map((category) => (
                    <motion.button
                      key={category.value}
                      onClick={() => handleInterestToggle(category.value)}
                      className={`p-3 rounded-lg border transition-all ${
                        selectedInterests.includes(category.value)
                          ? 'border-orange-500 bg-orange-500/10'
                          : 'border-gray-600 hover:border-orange-500/50'
                      }`}
                      whileHover={reducedMotion ? {} : { scale: 1.02 }}
                      whileTap={reducedMotion ? {} : { scale: 0.98 }}
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-lg">{category.icon}</span>
                        <span className="text-xs text-white">{category.label}</span>
                      </div>
                    </motion.button>
                  ))}
                </div>
              </div>

              {/* Step 2: Experience Level */}
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                    currentStep >= 1 ? 'bg-orange-500 text-black' : 'bg-gray-600 text-gray-300'
                  }`}>
                    2
                  </div>
                  <h4 className="portfolio-small-text text-orange-400">Your Experience Level</h4>
                </div>
                <div className="space-y-2">
                  {experienceLevels.map((level) => (
                    <motion.button
                      key={level.value}
                      onClick={() => setExperienceLevel(level.value)}
                      className={`w-full p-3 rounded-lg border transition-all ${
                        experienceLevel === level.value
                          ? 'border-orange-500 bg-orange-500/10'
                          : 'border-gray-600 hover:border-orange-500/50'
                      }`}
                      whileHover={reducedMotion ? {} : { scale: 1.01 }}
                      whileTap={reducedMotion ? {} : { scale: 0.99 }}
                    >
                      <div className="flex items-center gap-3">
                        <div 
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: level.color }}
                        />
                        <div className="text-left">
                          <p className="text-sm text-white font-medium">{level.label}</p>
                          <p className="text-xs text-gray-400">{level.description}</p>
                        </div>
                      </div>
                    </motion.button>
                  ))}
                </div>
              </div>

              {/* Step 3: Time Commitment */}
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                    currentStep >= 2 ? 'bg-orange-500 text-black' : 'bg-gray-600 text-gray-300'
                  }`}>
                    3
                  </div>
                  <h4 className="portfolio-small-text text-orange-400">Time Commitment</h4>
                </div>
                <div className="space-y-2">
                  {timeCommitments.map((commitment) => (
                    <motion.button
                      key={commitment.value}
                      onClick={() => setTimeCommitment(commitment.value)}
                      className={`w-full p-3 rounded-lg border transition-all ${
                        timeCommitment === commitment.value
                          ? 'border-orange-500 bg-orange-500/10'
                          : 'border-gray-600 hover:border-orange-500/50'
                      }`}
                      whileHover={reducedMotion ? {} : { scale: 1.01 }}
                      whileTap={reducedMotion ? {} : { scale: 0.99 }}
                    >
                      <div className="text-left">
                        <p className="text-sm text-white font-medium">{commitment.label}</p>
                        <p className="text-xs text-gray-400">{commitment.description}</p>
                      </div>
                    </motion.button>
                  ))}
                </div>
              </div>

              {/* Generate Button */}
              <InteractiveButton
                onClick={generateLearningPath}
                disabled={selectedInterests.length === 0 || isGenerating}
                variant="primary"
                className="w-full"
              >
                {isGenerating ? (
                  <>
                    <Map className="w-4 h-4 mr-2 animate-spin" />
                    GENERATING PATH...
                  </>
                ) : (
                  <>
                    <Map className="w-4 h-4 mr-2" />
                    GENERATE LEARNING PATH
                  </>
                )}
              </InteractiveButton>
            </div>
          </InteractiveCard>
        </motion.div>

        {/* Learning Paths Display */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
        >
          <InteractiveCard variant="ai" className="h-full">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="portfolio-medium-text text-white">Your Learning Paths</h3>
                <span className="portfolio-small-text text-gray-400">
                  {learningPaths.length} path{learningPaths.length !== 1 ? 's' : ''}
                </span>
              </div>

              <div className="space-y-4 max-h-96 overflow-y-auto">
                <AnimatePresence>
                  {learningPaths.length === 0 ? (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="text-center py-8"
                    >
                      <Map className="w-12 h-12 text-gray-600 mx-auto mb-4" />
                      <p className="text-gray-400">No learning paths yet</p>
                      <p className="text-sm text-gray-500">Configure your preferences and generate a path</p>
                    </motion.div>
                  ) : (
                    learningPaths.map((path, index) => (
                      <motion.div
                        key={path.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ delay: index * 0.1, duration: 0.3 }}
                        className="border border-gray-700 rounded-lg p-4 space-y-4"
                      >
                        {/* Path Header */}
                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="portfolio-medium-text text-white">{path.title}</h4>
                            <p className="portfolio-small-text text-gray-300">{path.description}</p>
                          </div>
                          <div className="text-right">
                            <div className="flex items-center gap-2 mb-1">
                              <Clock className="w-4 h-4 text-orange-400" />
                              <span className="portfolio-small-text text-orange-400">{path.totalTime}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <div 
                                className="w-3 h-3 rounded-full"
                                style={{ backgroundColor: getDifficultyColor(path.difficulty) }}
                              />
                              <span className="portfolio-small-text text-gray-400 capitalize">{path.difficulty}</span>
                            </div>
                          </div>
                        </div>

                        {/* Progress Bar */}
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="portfolio-small-text text-orange-400">Progress</span>
                            <span className="portfolio-small-text text-gray-400">{path.progress}%</span>
                          </div>
                          <div className="w-full bg-gray-700 rounded-full h-2">
                            <motion.div
                              className="bg-gradient-to-r from-orange-500 to-orange-400 h-2 rounded-full"
                              initial={{ width: 0 }}
                              animate={{ width: `${path.progress}%` }}
                              transition={{ duration: 0.5 }}
                            />
                          </div>
                        </div>

                        {/* Learning Goals */}
                        <div className="space-y-2">
                          <h5 className="portfolio-small-text text-orange-400">Learning Goals</h5>
                          <div className="space-y-2">
                            {path.goals.map((goal, goalIndex) => (
                              <motion.div
                                key={goal.id}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: goalIndex * 0.1, duration: 0.3 }}
                                className="flex items-center gap-3 p-2 bg-gray-800/50 rounded-lg"
                              >
                                <div className="w-6 h-6 rounded-full bg-orange-500/20 flex items-center justify-center">
                                  <span className="text-xs text-orange-400 font-bold">{goalIndex + 1}</span>
                                </div>
                                <div className="flex-1">
                                  <p className="text-sm text-white font-medium">{goal.title}</p>
                                  <p className="text-xs text-gray-400">{goal.description}</p>
                                </div>
                                <div className="text-right">
                                  <p className="text-xs text-orange-400">{goal.estimatedTime}</p>
                                  <div 
                                    className="w-2 h-2 rounded-full mt-1"
                                    style={{ backgroundColor: getDifficultyColor(goal.difficulty) }}
                                  />
                                </div>
                              </motion.div>
                            ))}
                          </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex gap-2">
                          <InteractiveButton
                            variant="primary"
                            size="sm"
                            className="flex-1"
                          >
                            <BookOpen className="w-4 h-4 mr-2" />
                            START PATH
                          </InteractiveButton>
                          <InteractiveButton
                            variant="ghost"
                            size="sm"
                          >
                            <Target className="w-4 h-4" />
                          </InteractiveButton>
                        </div>
                      </motion.div>
                    ))
                  )}
                </AnimatePresence>
              </div>
            </div>
          </InteractiveCard>
        </motion.div>
      </div>
    </div>
  );
};

export default PersonalLearningPathAI;