'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  CheckCircle, 
  Clock, 
  Target,
  Brain,
  Heart,
  Shield,
  Lightbulb,
  Star,
  TrendingUp
} from 'lucide-react';
import { InteractiveButton } from '@/components/interactions/InteractiveButton';
import { modalityManager } from '@/lib/therapy/modalities';
import { insightsEngine } from '@/lib/therapy/insightsEngine';
import { useReducedMotion } from '@/hooks/useAnimations';

interface Exercise {
  id: string;
  name: string;
  description: string;
  type: 'breathing' | 'meditation' | 'cbt' | 'mindfulness' | 'crisis' | 'wellness';
  duration: number; // minutes
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  instructions: string[];
  benefits: string[];
  tags: string[];
  completed: boolean;
  rating?: number;
  lastCompleted?: number;
}

interface PersonalizedExercisesProps {
  userProfile: {
    mood: number;
    stress: number;
    anxiety: number;
    depression: number;
    experience: 'beginner' | 'intermediate' | 'advanced';
    preferences: string[];
    goals: string[];
  };
  onExerciseComplete: (exercise: Exercise) => void;
  className?: string;
}

export const PersonalizedExercises: React.FC<PersonalizedExercisesProps> = ({
  userProfile,
  onExerciseComplete,
  className = ''
}) => {
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [currentExercise, setCurrentExercise] = useState<Exercise | null>(null);
  const [isRunning, setIsRunning] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [currentStep, setCurrentStep] = useState(0);
  const [showResults, setShowResults] = useState(false);
  const [exerciseRating, setExerciseRating] = useState(0);
  const reducedMotion = useReducedMotion();

  // Generate personalized exercises based on user profile
  useEffect(() => {
    const personalizedExercises = generatePersonalizedExercises(userProfile);
    setExercises(personalizedExercises);
  }, [userProfile]);

  // Timer effect
  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isRunning && timeRemaining > 0) {
      interval = setInterval(() => {
        setTimeRemaining(prev => {
          if (prev <= 1) {
            setIsRunning(false);
            setShowResults(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    
    return () => clearInterval(interval);
  }, [isRunning, timeRemaining]);

  // Generate personalized exercises
  const generatePersonalizedExercises = (profile: any): Exercise[] => {
    const baseExercises: Exercise[] = [
      {
        id: 'deep_breathing',
        name: 'Deep Breathing',
        description: 'Calm your nervous system with controlled breathing',
        type: 'breathing',
        duration: 5,
        difficulty: 'beginner',
        instructions: [
          'Sit comfortably with your back straight',
          'Place one hand on your chest and one on your belly',
          'Breathe in slowly through your nose for 4 counts',
          'Hold your breath for 4 counts',
          'Exhale slowly through your mouth for 6 counts',
          'Repeat for 5 minutes'
        ],
        benefits: ['Reduces stress', 'Lowers heart rate', 'Improves focus'],
        tags: ['stress', 'anxiety', 'calm'],
        completed: false
      },
      {
        id: 'body_scan',
        name: 'Body Scan Meditation',
        description: 'Bring awareness to your body and release tension',
        type: 'meditation',
        duration: 15,
        difficulty: 'beginner',
        instructions: [
          'Lie down comfortably or sit in a chair',
          'Close your eyes and take a few deep breaths',
          'Start at the top of your head',
          'Slowly scan down your body, noticing sensations',
          'Pay attention to areas of tension',
          'Breathe into tense areas and let them relax'
        ],
        benefits: ['Reduces tension', 'Improves body awareness', 'Promotes relaxation'],
        tags: ['tension', 'relaxation', 'mindfulness'],
        completed: false
      },
      {
        id: 'thought_challenge',
        name: 'Thought Challenge',
        description: 'Question and reframe negative thoughts',
        type: 'cbt',
        duration: 10,
        difficulty: 'intermediate',
        instructions: [
          'Identify a negative thought you\'re having',
          'Write it down exactly as it appears',
          'Ask: Is this thought 100% true?',
          'What evidence do I have for and against this thought?',
          'What would I tell a friend in this situation?',
          'Write a more balanced, realistic thought'
        ],
        benefits: ['Challenges negative thinking', 'Improves mood', 'Builds resilience'],
        tags: ['negative thoughts', 'cbt', 'mood'],
        completed: false
      },
      {
        id: 'gratitude_practice',
        name: 'Gratitude Practice',
        description: 'Cultivate appreciation and positive emotions',
        type: 'wellness',
        duration: 8,
        difficulty: 'beginner',
        instructions: [
          'Think of three things you\'re grateful for today',
          'They can be big or small',
          'Write them down or say them out loud',
          'For each one, think about why you\'re grateful',
          'Notice how you feel after this practice'
        ],
        benefits: ['Increases happiness', 'Improves mood', 'Builds positivity'],
        tags: ['gratitude', 'positivity', 'happiness'],
        completed: false
      },
      {
        id: 'progressive_muscle',
        name: 'Progressive Muscle Relaxation',
        description: 'Release physical tension through systematic muscle relaxation',
        type: 'wellness',
        duration: 20,
        difficulty: 'intermediate',
        instructions: [
          'Start with your toes, tense them for 5 seconds',
          'Release and notice the relaxation',
          'Move to your calves, tense and release',
          'Continue up your body: thighs, glutes, abdomen',
          'Tense and release your arms, shoulders, neck',
          'Finish with your face and scalp'
        ],
        benefits: ['Reduces muscle tension', 'Promotes relaxation', 'Improves sleep'],
        tags: ['tension', 'relaxation', 'sleep'],
        completed: false
      },
      {
        id: 'mindful_walking',
        name: 'Mindful Walking',
        description: 'Practice mindfulness while walking',
        type: 'mindfulness',
        duration: 10,
        difficulty: 'beginner',
        instructions: [
          'Find a quiet place to walk',
          'Walk slowly and deliberately',
          'Focus on the sensation of your feet touching the ground',
          'Notice your breath as you walk',
          'Be aware of your surroundings',
          'When your mind wanders, gently return to walking'
        ],
        benefits: ['Improves focus', 'Reduces stress', 'Increases awareness'],
        tags: ['mindfulness', 'focus', 'awareness'],
        completed: false
      }
    ];

    // Filter and prioritize based on user profile
    let filteredExercises = baseExercises;

    // Filter by difficulty
    if (profile.experience === 'beginner') {
      filteredExercises = filteredExercises.filter(ex => ex.difficulty === 'beginner');
    } else if (profile.experience === 'intermediate') {
      filteredExercises = filteredExercises.filter(ex => 
        ex.difficulty === 'beginner' || ex.difficulty === 'intermediate'
      );
    }

    // Prioritize based on current needs
    if (profile.stress >= 7 || profile.anxiety >= 7) {
      filteredExercises = filteredExercises.sort((a, b) => {
        const aRelevant = a.tags.some(tag => ['stress', 'anxiety', 'calm'].includes(tag));
        const bRelevant = b.tags.some(tag => ['stress', 'anxiety', 'calm'].includes(tag));
        return bRelevant ? 1 : aRelevant ? -1 : 0;
      });
    }

    if (profile.depression >= 6) {
      filteredExercises = filteredExercises.sort((a, b) => {
        const aRelevant = a.tags.some(tag => ['mood', 'positivity', 'happiness'].includes(tag));
        const bRelevant = b.tags.some(tag => ['mood', 'positivity', 'happiness'].includes(tag));
        return bRelevant ? 1 : aRelevant ? -1 : 0;
      });
    }

    return filteredExercises.slice(0, 6); // Show top 6 most relevant
  };

  // Start exercise
  const startExercise = (exercise: Exercise) => {
    setCurrentExercise(exercise);
    setTimeRemaining(exercise.duration * 60); // Convert to seconds
    setCurrentStep(0);
    setIsRunning(false);
    setShowResults(false);
    setExerciseRating(0);
  };

  // Toggle exercise timer
  const toggleExercise = () => {
    setIsRunning(!isRunning);
  };

  // Complete exercise
  const completeExercise = () => {
    if (!currentExercise) return;

    const completedExercise = {
      ...currentExercise,
      completed: true,
      rating: exerciseRating,
      lastCompleted: Date.now()
    };

    // Update exercises list
    setExercises(prev => 
      prev.map(ex => ex.id === currentExercise.id ? completedExercise : ex)
    );

    // Call parent callback
    onExerciseComplete(completedExercise);

    // Reset state
    setCurrentExercise(null);
    setShowResults(false);
    setIsRunning(false);
    setTimeRemaining(0);
    setCurrentStep(0);
    setExerciseRating(0);
  };

  // Format time
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Get exercise icon
  const getExerciseIcon = (type: string) => {
    switch (type) {
      case 'breathing': return <Heart className="w-5 h-5" />;
      case 'meditation': return <Brain className="w-5 h-5" />;
      case 'cbt': return <Target className="w-5 h-5" />;
      case 'mindfulness': return <Shield className="w-5 h-5" />;
      case 'crisis': return <AlertTriangle className="w-5 h-5" />;
      case 'wellness': return <Lightbulb className="w-5 h-5" />;
      default: return <Play className="w-5 h-5" />;
    }
  };

  // Get difficulty color
  const getDifficultyColor = (difficulty: string): string => {
    switch (difficulty) {
      case 'beginner': return '#10b981';
      case 'intermediate': return '#f59e0b';
      case 'advanced': return '#ef4444';
      default: return '#6b7280';
    }
  };

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <div className="text-center">
        <h2 className="portfolio-hero-text text-white mb-2">Personalized Exercises</h2>
        <p className="portfolio-base-text text-gray-400">
          Exercises tailored to your current needs and experience level
        </p>
      </div>

      {/* Exercise Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {exercises.map((exercise, index) => (
          <motion.div
            key={exercise.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className={`bg-gray-800/50 rounded-lg p-4 border transition-colors ${
              exercise.completed 
                ? 'border-green-500/30 bg-green-500/10' 
                : 'border-gray-600/30 hover:border-green-500/30'
            }`}
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-2">
                {getExerciseIcon(exercise.type)}
                <h3 className="portfolio-medium-text text-white">{exercise.name}</h3>
              </div>
              {exercise.completed && (
                <CheckCircle className="w-5 h-5 text-green-400" />
              )}
            </div>

            <p className="portfolio-small-text text-gray-300 mb-3">
              {exercise.description}
            </p>

            <div className="flex items-center gap-2 mb-3">
              <span 
                className="text-xs px-2 py-1 rounded-full"
                style={{ 
                  backgroundColor: getDifficultyColor(exercise.difficulty) + '20',
                  color: getDifficultyColor(exercise.difficulty)
                }}
              >
                {exercise.difficulty}
              </span>
              <span className="text-xs text-gray-400 flex items-center gap-1">
                <Clock className="w-3 h-3" />
                {exercise.duration} min
              </span>
            </div>

            <div className="flex flex-wrap gap-1 mb-4">
              {exercise.tags.slice(0, 3).map((tag) => (
                <span 
                  key={tag}
                  className="text-xs px-2 py-1 bg-gray-700/50 text-gray-300 rounded"
                >
                  {tag}
                </span>
              ))}
            </div>

            <InteractiveButton
              onClick={() => startExercise(exercise)}
              variant={exercise.completed ? "ghost" : "primary"}
              size="sm"
              className="w-full"
            >
              {exercise.completed ? 'Practice Again' : 'Start Exercise'}
            </InteractiveButton>
          </motion.div>
        ))}
      </div>

      {/* Exercise Modal */}
      <AnimatePresence>
        {currentExercise && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-gray-900 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-hidden border border-green-500/30"
            >
              {/* Header */}
              <div className="bg-green-500/20 border-b border-green-500/30 p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {getExerciseIcon(currentExercise.type)}
                    <div>
                      <h3 className="portfolio-hero-text text-white">{currentExercise.name}</h3>
                      <p className="portfolio-base-text text-green-400">{currentExercise.description}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setCurrentExercise(null)}
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    ✕
                  </button>
                </div>
              </div>

              {/* Content */}
              <div className="p-6 space-y-6">
                {/* Timer */}
                <div className="text-center">
                  <div className="text-4xl font-mono text-white mb-2">
                    {formatTime(timeRemaining)}
                  </div>
                  <div className="flex justify-center gap-2">
                    <InteractiveButton
                      onClick={toggleExercise}
                      variant="primary"
                      size="sm"
                    >
                      {isRunning ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                    </InteractiveButton>
                    <InteractiveButton
                      onClick={() => setTimeRemaining(currentExercise.duration * 60)}
                      variant="ghost"
                      size="sm"
                    >
                      <RotateCcw className="w-4 h-4" />
                    </InteractiveButton>
                  </div>
                </div>

                {/* Instructions */}
                <div className="space-y-4">
                  <h4 className="portfolio-medium-text text-white">Instructions</h4>
                  <div className="space-y-2">
                    {currentExercise.instructions.map((instruction, index) => (
                      <div key={index} className="flex items-start gap-3">
                        <span className="text-green-400 font-bold text-sm mt-1">
                          {index + 1}.
                        </span>
                        <p className="portfolio-small-text text-gray-300">
                          {instruction}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Benefits */}
                <div className="space-y-2">
                  <h4 className="portfolio-medium-text text-white">Benefits</h4>
                  <div className="flex flex-wrap gap-2">
                    {currentExercise.benefits.map((benefit, index) => (
                      <span 
                        key={index}
                        className="px-3 py-1 bg-green-500/20 text-green-400 rounded-full text-sm"
                      >
                        {benefit}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Results */}
                {showResults && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-gray-800/50 rounded-lg p-4"
                  >
                    <h4 className="portfolio-medium-text text-white mb-3">How was this exercise?</h4>
                    <div className="flex items-center gap-2 mb-4">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          onClick={() => setExerciseRating(star)}
                          className={`text-2xl transition-colors ${
                            star <= exerciseRating ? 'text-yellow-400' : 'text-gray-600'
                          }`}
                        >
                          <Star className="w-6 h-6" />
                        </button>
                      ))}
                    </div>
                    <InteractiveButton
                      onClick={completeExercise}
                      variant="primary"
                      className="w-full"
                    >
                      Complete Exercise
                    </InteractiveButton>
                  </motion.div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default PersonalizedExercises;