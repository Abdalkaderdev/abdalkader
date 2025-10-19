'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Target, Brain, Zap, Trophy, Play, Pause, RotateCcw } from 'lucide-react';
import { InteractiveButton } from '@/components/interactions/InteractiveButton';
import { useEEG } from '@/hooks/useEEG';
import { useReducedMotion } from '@/hooks/useAnimations';

interface FocusTrainerProps {
  className?: string;
}

interface TrainingSession {
  id: string;
  startTime: number;
  endTime?: number;
  focusScore: number;
  duration: number;
  level: number;
  completed: boolean;
}

export const FocusTrainer: React.FC<FocusTrainerProps> = ({
  className = '',
}) => {
  const [isTraining, setIsTraining] = useState(false);
  const [currentLevel, setCurrentLevel] = useState(1);
  const [focusScore, setFocusScore] = useState(0);
  const [targetFocus, setTargetFocus] = useState(0.7);
  const [session, setSession] = useState<TrainingSession | null>(null);
  const [sessions, setSessions] = useState<TrainingSession[]>([]);
  const [gameState, setGameState] = useState<'waiting' | 'playing' | 'success' | 'failure'>('waiting');
  const [timeRemaining, setTimeRemaining] = useState(30);
  const [particles, setParticles] = useState<Array<{ id: number; x: number; y: number; vx: number; vy: number; color: string }>>([]);
  
  const { 
    isConnected, 
    isRecording, 
    bioState, 
    connect, 
    startRecording, 
    stopRecording 
  } = useEEG();
  
  const reducedMotion = useReducedMotion();
  const gameRef = useRef<HTMLDivElement>(null);
  const particleIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Update focus score based on bio-signal state
  useEffect(() => {
    if (bioState && isTraining) {
      setFocusScore(bioState.focus);
      
      // Check if target is reached
      if (bioState.focus >= targetFocus) {
        setGameState('success');
        if (session) {
          setSession(prev => prev ? { ...prev, completed: true, endTime: Date.now() } : null);
        }
      }
    }
  }, [bioState, isTraining, targetFocus, session]);

  // Game timer
  useEffect(() => {
    if (isTraining && timeRemaining > 0) {
      const timer = setTimeout(() => {
        setTimeRemaining(prev => prev - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else if (isTraining && timeRemaining === 0) {
      setGameState('failure');
      setIsTraining(false);
      if (session) {
        setSession(prev => prev ? { ...prev, endTime: Date.now() } : null);
      }
    }
  }, [isTraining, timeRemaining, session]);

  // Generate particles for visual feedback
  useEffect(() => {
    if (isTraining && !reducedMotion) {
      particleIntervalRef.current = setInterval(() => {
        setParticles(prev => {
          const newParticles = [...prev];
          
          // Add new particles based on focus score
          if (Math.random() < focusScore) {
            newParticles.push({
              id: Date.now() + Math.random(),
              x: Math.random() * 400,
              y: Math.random() * 300,
              vx: (Math.random() - 0.5) * 2,
              vy: (Math.random() - 0.5) * 2,
              color: focusScore > 0.7 ? '#10b981' : focusScore > 0.4 ? '#f59e0b' : '#ef4444'
            });
          }
          
          // Update existing particles
          return newParticles
            .map(particle => ({
              ...particle,
              x: particle.x + particle.vx,
              y: particle.y + particle.vy
            }))
            .filter(particle => particle.x > -10 && particle.x < 410 && particle.y > -10 && particle.y < 310)
            .slice(-50); // Keep only last 50 particles
        });
      }, 100);
    } else {
      if (particleIntervalRef.current) {
        clearInterval(particleIntervalRef.current);
        particleIntervalRef.current = null;
      }
    }

    return () => {
      if (particleIntervalRef.current) {
        clearInterval(particleIntervalRef.current);
        particleIntervalRef.current = null;
      }
    };
  }, [isTraining, focusScore, reducedMotion]);

  const startTraining = async () => {
    if (!isConnected) {
      const connected = await connect();
      if (!connected) return;
    }

    if (!isRecording) {
      startRecording();
    }

    const newSession: TrainingSession = {
      id: Date.now().toString(),
      startTime: Date.now(),
      focusScore: 0,
      duration: 30,
      level: currentLevel,
      completed: false
    };

    setSession(newSession);
    setIsTraining(true);
    setGameState('playing');
    setTimeRemaining(30);
    setParticles([]);
  };

  const stopTraining = () => {
    setIsTraining(false);
    setGameState('waiting');
    
    if (session) {
      const completedSession = {
        ...session,
        endTime: Date.now(),
        focusScore: focusScore
      };
      setSessions(prev => [completedSession, ...prev]);
      setSession(null);
    }
  };

  const nextLevel = () => {
    setCurrentLevel(prev => prev + 1);
    setTargetFocus(prev => Math.min(0.95, prev + 0.05));
    setGameState('waiting');
    setFocusScore(0);
  };

  const resetTraining = () => {
    setCurrentLevel(1);
    setTargetFocus(0.7);
    setSessions([]);
    setGameState('waiting');
    setFocusScore(0);
  };

  const getFocusColor = () => {
    if (focusScore >= targetFocus) return '#10b981';
    if (focusScore >= targetFocus * 0.7) return '#f59e0b';
    return '#ef4444';
  };

  const getFocusLabel = () => {
    if (focusScore >= targetFocus) return 'Excellent Focus!';
    if (focusScore >= targetFocus * 0.7) return 'Good Focus';
    if (focusScore >= targetFocus * 0.4) return 'Moderate Focus';
    return 'Low Focus';
  };

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <div className="text-center">
        <h2 className="portfolio-hero-text text-white mb-4">Focus Trainer</h2>
        <p className="portfolio-base-text text-gray-300 max-w-2xl mx-auto">
          Train your focus and attention using real-time brainwave feedback. 
          Maintain high focus levels to complete each level.
        </p>
      </div>

      {/* Connection Status */}
      <div className="flex items-center justify-center gap-4">
        <div className={`flex items-center gap-2 px-4 py-2 rounded-lg ${
          isConnected ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
        }`}>
          <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-400' : 'bg-red-400'}`} />
          <span className="portfolio-small-text">
            {isConnected ? 'EEG Connected' : 'EEG Disconnected'}
          </span>
        </div>
        
        <div className={`flex items-center gap-2 px-4 py-2 rounded-lg ${
          isRecording ? 'bg-blue-500/20 text-blue-400' : 'bg-gray-500/20 text-gray-400'
        }`}>
          <div className={`w-2 h-2 rounded-full ${isRecording ? 'bg-blue-400' : 'bg-gray-400'}`} />
          <span className="portfolio-small-text">
            {isRecording ? 'Recording' : 'Not Recording'}
          </span>
        </div>
      </div>

      {/* Game Area */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Visual Game */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="portfolio-medium-text text-white">Focus Game</h3>
            <div className="flex items-center gap-2">
              <span className="portfolio-small-text text-gray-400">Level {currentLevel}</span>
              <div className="w-2 h-2 bg-orange-400 rounded-full" />
            </div>
          </div>

          <div 
            ref={gameRef}
            className="relative w-full h-80 bg-black/50 rounded-lg border border-purple-500/30 overflow-hidden"
          >
            {/* Target Circle */}
            <motion.div
              className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
              animate={isTraining ? {
                scale: [1, 1.1, 1],
                opacity: [0.7, 1, 0.7]
              } : {}}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <div 
                className="w-32 h-32 rounded-full border-4 border-dashed flex items-center justify-center"
                style={{ borderColor: getFocusColor() }}
              >
                <Target className="w-8 h-8" style={{ color: getFocusColor() }} />
              </div>
            </motion.div>

            {/* Particles */}
            <AnimatePresence>
              {particles.map(particle => (
                <motion.div
                  key={particle.id}
                  className="absolute w-2 h-2 rounded-full"
                  style={{ 
                    left: particle.x, 
                    top: particle.y, 
                    backgroundColor: particle.color 
                  }}
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0 }}
                  transition={{ duration: 0.5 }}
                />
              ))}
            </AnimatePresence>

            {/* Game State Overlay */}
            <AnimatePresence>
              {gameState === 'success' && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  className="absolute inset-0 flex items-center justify-center bg-green-500/20 backdrop-blur-sm"
                >
                  <div className="text-center">
                    <Trophy className="w-12 h-12 text-green-400 mx-auto mb-2" />
                    <p className="portfolio-medium-text text-green-400">Level Complete!</p>
                  </div>
                </motion.div>
              )}

              {gameState === 'failure' && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  className="absolute inset-0 flex items-center justify-center bg-red-500/20 backdrop-blur-sm"
                >
                  <div className="text-center">
                    <Zap className="w-12 h-12 text-red-400 mx-auto mb-2" />
                    <p className="portfolio-medium-text text-red-400">Time's Up!</p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Controls */}
          <div className="flex gap-3">
            {!isTraining ? (
              <InteractiveButton
                onClick={startTraining}
                disabled={!isConnected}
                variant="primary"
                className="flex-1"
              >
                <Play className="w-4 h-4 mr-2" />
                Start Training
              </InteractiveButton>
            ) : (
              <InteractiveButton
                onClick={stopTraining}
                variant="secondary"
                className="flex-1"
              >
                <Pause className="w-4 h-4 mr-2" />
                Stop Training
              </InteractiveButton>
            )}
            
            <InteractiveButton
              onClick={resetTraining}
              variant="ghost"
            >
              <RotateCcw className="w-4 h-4" />
            </InteractiveButton>
          </div>
        </div>

        {/* Focus Metrics */}
        <div className="space-y-4">
          <h3 className="portfolio-medium-text text-white">Focus Metrics</h3>
          
          {/* Current Focus Score */}
          <div className="bg-black/50 rounded-lg p-6 border border-purple-500/30">
            <div className="flex items-center justify-between mb-4">
              <span className="portfolio-small-text text-gray-300">Current Focus</span>
              <span className="portfolio-medium-text text-white">
                {Math.round(focusScore * 100)}%
              </span>
            </div>
            
            <div className="w-full bg-gray-700 rounded-full h-3 mb-2">
              <motion.div
                className="h-3 rounded-full"
                style={{ backgroundColor: getFocusColor() }}
                initial={{ width: 0 }}
                animate={{ width: `${focusScore * 100}%` }}
                transition={{ duration: 0.5, ease: [0.19, 1, 0.22, 1] }}
              />
            </div>
            
            <p className="portfolio-small-text" style={{ color: getFocusColor() }}>
              {getFocusLabel()}
            </p>
          </div>

          {/* Target Focus */}
          <div className="bg-black/50 rounded-lg p-6 border border-purple-500/30">
            <div className="flex items-center justify-between mb-4">
              <span className="portfolio-small-text text-gray-300">Target Focus</span>
              <span className="portfolio-medium-text text-white">
                {Math.round(targetFocus * 100)}%
              </span>
            </div>
            
            <div className="w-full bg-gray-700 rounded-full h-3 mb-2">
              <div
                className="h-3 rounded-full bg-orange-400"
                style={{ width: `${targetFocus * 100}%` }}
              />
            </div>
            
            <p className="portfolio-small-text text-orange-400">
              Level {currentLevel} Target
            </p>
          </div>

          {/* Timer */}
          {isTraining && (
            <div className="bg-black/50 rounded-lg p-6 border border-purple-500/30">
              <div className="flex items-center justify-between mb-4">
                <span className="portfolio-small-text text-gray-300">Time Remaining</span>
                <span className="portfolio-medium-text text-white">
                  {timeRemaining}s
                </span>
              </div>
              
              <div className="w-full bg-gray-700 rounded-full h-3">
                <motion.div
                  className="h-3 rounded-full bg-blue-400"
                  initial={{ width: '100%' }}
                  animate={{ width: `${(timeRemaining / 30) * 100}%` }}
                  transition={{ duration: 1, ease: 'linear' }}
                />
              </div>
            </div>
          )}

          {/* Session Stats */}
          {session && (
            <div className="bg-black/50 rounded-lg p-6 border border-purple-500/30">
              <h4 className="portfolio-small-text text-gray-300 mb-4">Session Stats</h4>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-400">Duration:</span>
                  <span className="text-sm text-white">
                    {Math.floor((Date.now() - session.startTime) / 1000)}s
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-400">Best Focus:</span>
                  <span className="text-sm text-white">
                    {Math.round(focusScore * 100)}%
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-400">Level:</span>
                  <span className="text-sm text-white">{session.level}</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Session History */}
      {sessions.length > 0 && (
        <div className="space-y-4">
          <h3 className="portfolio-medium-text text-white">Training History</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {sessions.slice(0, 6).map((session, index) => (
              <motion.div
                key={session.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-black/50 rounded-lg p-4 border border-purple-500/30"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="portfolio-small-text text-gray-300">Level {session.level}</span>
                  <span className="portfolio-small-text text-white">
                    {Math.round(session.focusScore * 100)}%
                  </span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2 mb-2">
                  <div
                    className="h-2 rounded-full bg-green-400"
                    style={{ width: `${session.focusScore * 100}%` }}
                  />
                </div>
                <p className="text-xs text-gray-400">
                  {new Date(session.startTime).toLocaleTimeString()}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* Next Level Button */}
      {gameState === 'success' && (
        <div className="text-center">
          <InteractiveButton
            onClick={nextLevel}
            variant="primary"
            size="lg"
          >
            <Trophy className="w-5 h-5 mr-2" />
            Next Level
          </InteractiveButton>
        </div>
      )}
    </div>
  );
};

export default FocusTrainer;