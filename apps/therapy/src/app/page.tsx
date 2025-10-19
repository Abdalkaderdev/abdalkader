'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Heart, Brain, BookOpen, Shield, Activity, Globe } from 'lucide-react';
import { UnifiedHeader } from '@/components/ecosystem/UnifiedHeader';
import { CrossDomainProvider } from '@/components/ecosystem/CrossDomainProvider';
import { EcosystemAuthProvider } from '@/contexts/EcosystemAuthContext';
import PortfolioHeader from '@/components/shared/PortfolioHeader';
import { AIConversation } from '@/components/therapy/AIConversation';
import { MedicalDisclaimers } from '@/components/legal/MedicalDisclaimers';
import { AdvancedMoodTracker } from '@/components/tracking/AdvancedMoodTracker';
import { PersonalizedExercises } from '@/components/exercises/PersonalizedExercises';
import { TherapyMessage, TherapySession } from '@/lib/therapy/aiTherapist';
import { insightsEngine } from '@/lib/therapy/insightsEngine';
import { privacyManager } from '@/lib/storage/privacyManager';
import { modalityManager } from '@/lib/therapy/modalities';
import { useReducedMotion } from '@/hooks/useAnimations';
import { useAccessibility } from '@/hooks/useAccessibility';
import { InteractiveButton } from '@/components/interactions/InteractiveButton';

type ActiveSection = 'chat' | 'journal' | 'exercises' | 'resources' | 'dashboard';

export default function TherapyPlatform() {
  const [activeSection, setActiveSection] = useState<ActiveSection>('dashboard');
  const [currentSession, setCurrentSession] = useState<TherapySession | null>(null);
  const [sessions, setSessions] = useState<TherapySession[]>([]);
  const [mood, setMood] = useState(5);
  const [stress, setStress] = useState(5);
  const [showDisclaimers, setShowDisclaimers] = useState(true);
  const [moodEntries, setMoodEntries] = useState<any[]>([]);
  const [insights, setInsights] = useState<any>(null);
  const [selectedModality, setSelectedModality] = useState<string | null>(null);
  const [userProfile, setUserProfile] = useState({
    mood: 5,
    stress: 5,
    anxiety: 5,
    depression: 5,
    experience: 'beginner' as 'beginner' | 'intermediate' | 'advanced',
    preferences: [] as string[],
    goals: [] as string[]
  });
  const reducedMotion = useReducedMotion();
  const { settings: accessibilitySettings, features: accessibilityFeatures } = useAccessibility();

  const navigationItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Activity },
    { id: 'chat', label: 'AI Chat', icon: Brain },
    { id: 'journal', label: 'Journal', icon: BookOpen },
    { id: 'exercises', label: 'Exercises', icon: Heart },
    { id: 'resources', label: 'Resources', icon: Shield },
  ];

  // Start new therapy session
  const startNewSession = (modality: TherapySession['modality'] = 'cbt') => {
    const newSession: TherapySession = {
      id: Date.now().toString(),
      startTime: Date.now(),
      modality,
      messages: [],
      mood: 5,
      stress: 5,
      progress: 0
    };

    setCurrentSession(newSession);
    setActiveSection('chat');
  };

  // Handle message sent
  const handleMessageSent = (message: TherapyMessage) => {
    if (!currentSession) return;

    const updatedSession = {
      ...currentSession,
      messages: [...currentSession.messages, message]
    };

    setCurrentSession(updatedSession);
  };

  // Handle crisis detection
  const handleCrisisDetected = (crisis: any) => {
    console.log('Crisis detected:', crisis);
    // In real implementation, this would trigger appropriate crisis response
    // For now, we'll just log it and show an alert
    alert(`Crisis detected: ${crisis.level.level}. Please call 988 or 911 immediately.`);
  };

  // Handle disclaimers
  const handleAcceptDisclaimers = () => {
    setShowDisclaimers(false);
    // Store acceptance in localStorage
    localStorage.setItem('therapy_disclaimers_accepted', 'true');
  };

  const handleDeclineDisclaimers = () => {
    // Redirect to a safe page or show alternative resources
    window.location.href = 'https://suicidepreventionlifeline.org';
  };

  // Check if disclaimers were already accepted
  useEffect(() => {
    const accepted = localStorage.getItem('therapy_disclaimers_accepted');
    if (accepted === 'true') {
      setShowDisclaimers(false);
    }
  }, []);

  // Load insights when mood entries change
  useEffect(() => {
    if (moodEntries.length > 0) {
      const analysis = insightsEngine.analyzeMoodPatterns();
      setInsights(analysis);
    }
  }, [moodEntries]);

  // Update user profile when mood changes
  useEffect(() => {
    setUserProfile(prev => ({
      ...prev,
      mood,
      stress,
      anxiety: mood <= 3 ? 8 : mood <= 5 ? 6 : mood <= 7 ? 4 : 2,
      depression: mood <= 3 ? 8 : mood <= 5 ? 6 : mood <= 7 ? 4 : 2
    }));
  }, [mood, stress]);

  // Handle mood entry
  const handleMoodEntry = (entry: any) => {
    setMoodEntries(prev => [...prev, entry]);
    setMood(entry.mood);
    setStress(entry.stress);
    
    // Announce to screen readers
    accessibilityFeatures.announce(`Mood entry saved: ${entry.mood} out of 10`);
  };

  // Handle exercise completion
  const handleExerciseComplete = (exercise: any) => {
    console.log('Exercise completed:', exercise);
    
    // Announce to screen readers
    accessibilityFeatures.announce(`Exercise completed: ${exercise.name}`);
    
    // Update user profile based on exercise type
    if (exercise.type === 'breathing' || exercise.type === 'meditation') {
      setStress(prev => Math.max(1, prev - 1));
    }
  };

  // Get recommended modality
  const getRecommendedModality = () => {
    return modalityManager.getRecommendedModality(userProfile);
  };

  const renderActiveSection = () => {
    switch (activeSection) {
      case 'dashboard':
        return (
          <div className="space-y-8">
            {/* Hero Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center"
            >
              <div className="flex items-center justify-center gap-4 mb-6">
                <motion.div
                  className="w-16 h-16 rounded-xl bg-gradient-to-r from-green-500 to-blue-500 flex items-center justify-center text-3xl shadow-lg"
                  animate={reducedMotion ? {} : { rotate: [0, 5, -5, 0] }}
                  transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                >
                  <Heart className="w-8 h-8 text-white" />
                </motion.div>
                <div>
                  <h1 className="portfolio-hero-text text-white">AI Mental Wellness Therapist</h1>
                  <p className="portfolio-large-text text-green-400">Privacy-First AI Therapy Platform</p>
                </div>
              </div>
              
              <p className="portfolio-base-text text-gray-300 max-w-4xl mx-auto leading-relaxed">
                Experience compassionate, AI-powered mental health support in a completely private environment. 
                Your conversations are encrypted and never leave your device. Get the help you need, when you need it.
              </p>
            </motion.div>

            {/* Quick Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="grid grid-cols-1 md:grid-cols-3 gap-6"
            >
              <div className="bg-black/50 rounded-lg p-6 border border-green-500/30 text-center">
                <div className="w-12 h-12 rounded-full mx-auto mb-4 flex items-center justify-center bg-green-500/20">
                  <Brain className="w-6 h-6 text-green-400" />
                </div>
                <h3 className="portfolio-medium-text text-white mb-2">AI Sessions</h3>
                <p className="portfolio-small-text text-gray-300">
                  {sessions.length} completed
                </p>
              </div>

              <div className="bg-black/50 rounded-lg p-6 border border-green-500/30 text-center">
                <div className="w-12 h-12 rounded-full mx-auto mb-4 flex items-center justify-center bg-blue-500/20">
                  <Heart className="w-6 h-6 text-blue-400" />
                </div>
                <h3 className="portfolio-medium-text text-white mb-2">Current Mood</h3>
                <p className="portfolio-small-text text-gray-300">
                  {mood}/10
                </p>
              </div>

              <div className="bg-black/50 rounded-lg p-6 border border-green-500/30 text-center">
                <div className="w-12 h-12 rounded-full mx-auto mb-4 flex items-center justify-center bg-orange-500/20">
                  <Shield className="w-6 h-6 text-orange-400" />
                </div>
                <h3 className="portfolio-medium-text text-white mb-2">Privacy</h3>
                <p className="portfolio-small-text text-gray-300">
                  100% Encrypted
                </p>
              </div>
            </motion.div>

            {/* Quick Actions */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"
            >
              {navigationItems.map((item, index) => (
                <motion.button
                  key={item.id}
                  onClick={() => setActiveSection(item.id as ActiveSection)}
                  className="bg-black/50 rounded-lg p-6 border border-green-500/30 hover:border-green-400/50 transition-all text-left group"
                  whileHover={reducedMotion ? {} : { scale: 1.02 }}
                  whileTap={reducedMotion ? {} : { scale: 0.98 }}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 + index * 0.1 }}
                >
                  <div className="w-10 h-10 rounded-lg bg-green-500/20 flex items-center justify-center mb-4 group-hover:bg-green-500/30 transition-colors">
                    <item.icon className="w-5 h-5 text-green-400" />
                  </div>
                  <h3 className="portfolio-medium-text text-white mb-2">{item.label}</h3>
                  <p className="portfolio-small-text text-gray-400">
                    {item.id === 'dashboard' && 'Overview of your mental health journey'}
                    {item.id === 'chat' && 'Start a conversation with AI therapist'}
                    {item.id === 'journal' && 'Track your thoughts and feelings'}
                    {item.id === 'exercises' && 'Guided exercises and techniques'}
                    {item.id === 'resources' && 'Crisis resources and support'}
                  </p>
                </motion.button>
              ))}
            </motion.div>

            {/* Therapy Modalities */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className="space-y-6"
            >
              <h2 className="portfolio-hero-text text-white text-center">Choose Your Therapy Approach</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                  { id: 'cbt', name: 'Cognitive Behavioral Therapy', description: 'Identify and change negative thought patterns', color: 'blue' },
                  { id: 'mbsr', name: 'Mindfulness-Based Stress Reduction', description: 'Cultivate present-moment awareness', color: 'green' },
                  { id: 'sfbt', name: 'Solution-Focused Brief Therapy', description: 'Focus on strengths and solutions', color: 'purple' },
                  { id: 'positive', name: 'Positive Psychology', description: 'Build resilience and well-being', color: 'yellow' }
                ].map((modality, index) => (
                  <motion.button
                    key={modality.id}
                    onClick={() => startNewSession(modality.id as TherapySession['modality'])}
                    className={`bg-black/50 rounded-lg p-6 border border-${modality.color}-500/30 hover:border-${modality.color}-400/50 transition-all text-left`}
                    whileHover={reducedMotion ? {} : { scale: 1.02 }}
                    whileTap={reducedMotion ? {} : { scale: 0.98 }}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1 + index * 0.1 }}
                  >
                    <h3 className="portfolio-medium-text text-white mb-2">{modality.name}</h3>
                    <p className="portfolio-small-text text-gray-400">{modality.description}</p>
                  </motion.button>
                ))}
              </div>
            </motion.div>
          </div>
        );

      case 'chat':
        return (
          <div className="h-[600px]">
            <AIConversation
              session={currentSession}
              onMessageSent={handleMessageSent}
              onCrisisDetected={handleCrisisDetected}
            />
          </div>
        );

      case 'journal':
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="portfolio-hero-text text-white mb-4">Mental Health Journal</h2>
              <p className="portfolio-base-text text-gray-300">
                Track your thoughts, feelings, and progress over time
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <AdvancedMoodTracker
                onMoodEntry={handleMoodEntry}
                className="lg:col-span-1"
              />
              <div className="bg-black/50 rounded-lg p-6 border border-green-500/30">
                <h3 className="portfolio-medium-text text-white mb-4">Journal Entry</h3>
                <textarea
                  placeholder="What's on your mind today?"
                  className="w-full h-32 bg-gray-800/50 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-green-500 transition-colors resize-none"
                  aria-label="Journal entry text area"
                />
                <div className="mt-4 flex gap-2">
                  <InteractiveButton variant="primary" size="sm">
                    Save Entry
                  </InteractiveButton>
                  <InteractiveButton variant="ghost" size="sm">
                    Clear
                  </InteractiveButton>
                </div>
              </div>
            </div>
          </div>
        );

      case 'exercises':
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="portfolio-hero-text text-white mb-4">Therapeutic Exercises</h2>
              <p className="portfolio-base-text text-gray-300">
                Guided exercises to support your mental health journey
              </p>
            </div>

            <PersonalizedExercises
              userProfile={userProfile}
              onExerciseComplete={handleExerciseComplete}
            />
          </div>
        );

      case 'resources':
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="portfolio-hero-text text-white mb-4">Crisis Resources</h2>
              <p className="portfolio-base-text text-gray-300">
                Immediate help and support when you need it most
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-red-500/20 border border-red-500/30 rounded-lg p-6">
                <h3 className="portfolio-medium-text text-red-400 mb-4">Emergency Contacts</h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-white">National Suicide Prevention Lifeline</span>
                    <span className="text-red-400 font-mono">988</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-white">Crisis Text Line</span>
                    <span className="text-red-400 font-mono">Text HOME to 741741</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-white">Emergency Services</span>
                    <span className="text-red-400 font-mono">911</span>
                  </div>
                </div>
              </div>

              <div className="bg-blue-500/20 border border-blue-500/30 rounded-lg p-6">
                <h3 className="portfolio-medium-text text-blue-400 mb-4">Mental Health Resources</h3>
                <div className="space-y-3">
                  <a href="#" className="block text-blue-300 hover:text-blue-200 transition-colors">
                    National Alliance on Mental Illness (NAMI)
                  </a>
                  <a href="#" className="block text-blue-300 hover:text-blue-200 transition-colors">
                    Mental Health America
                  </a>
                  <a href="#" className="block text-blue-300 hover:text-blue-200 transition-colors">
                    American Psychological Association
                  </a>
                  <a href="#" className="block text-blue-300 hover:text-blue-200 transition-colors">
                    Substance Abuse and Mental Health Services Administration
                  </a>
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <EcosystemAuthProvider>
      <CrossDomainProvider>
        <div className="min-h-screen bg-gradient-to-br from-black via-green-900/20 to-black relative overflow-hidden">
          {/* Medical Disclaimers Modal */}
          {showDisclaimers && (
            <MedicalDisclaimers
              onAccept={handleAcceptDisclaimers}
              onDecline={handleDeclineDisclaimers}
            />
          )}
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-5">
            <div className="absolute inset-0" style={{
              backgroundImage: `radial-gradient(circle at 20% 50%, rgba(34, 197, 94, 0.3) 0%, transparent 50%),
                              radial-gradient(circle at 80% 20%, rgba(59, 130, 246, 0.3) 0%, transparent 50%),
                              radial-gradient(circle at 40% 80%, rgba(168, 85, 247, 0.3) 0%, transparent 50%)`
            }} />
          </div>
          
          <div className="relative z-10">
            {/* Portfolio Style Header */}
            <PortfolioHeader 
              appName="AI Therapy"
              appDescription="Privacy-first AI therapy platform with empathetic conversations"
              currentApp="AI Therapy"
            />
            
            {/* Navigation */}
            <nav className="container mx-auto px-4 py-6">
              <div className="flex gap-2">
                {navigationItems.map((item) => (
                  <motion.button
                    key={item.id}
                    onClick={() => setActiveSection(item.id as ActiveSection)}
                    className={`px-4 py-2 rounded-lg transition-all ${
                      activeSection === item.id
                        ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                        : 'text-gray-300 hover:text-white hover:bg-gray-800/50'
                    }`}
                    whileHover={reducedMotion ? {} : { scale: 1.05 }}
                    whileTap={reducedMotion ? {} : { scale: 0.95 }}
                  >
                    <div className="flex items-center gap-2">
                      <item.icon className="w-4 h-4" />
                      <span className="portfolio-small-text">{item.label}</span>
                    </div>
                  </motion.button>
                ))}
              </div>
            </nav>
            
            {/* Main Content */}
            <main className="container mx-auto px-4 pb-12">
              {renderActiveSection()}
            </main>
          </div>
        </div>
      </CrossDomainProvider>
    </EcosystemAuthProvider>
  );
}