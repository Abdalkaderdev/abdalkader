'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bot, Volume2, VolumeX, Play, Pause, RotateCcw, Settings } from 'lucide-react';
import { InteractiveButton } from '@/components/interactions/InteractiveButton';
import { useAccessibility } from '@/hooks/useAccessibility';
import { useGroqAI } from '@/hooks/useGroqAI';

interface ScreenReaderAIProps {
  className?: string;
  context?: string;
  onResponse?: (response: string) => void;
}

interface AIResponse {
  id: string;
  content: string;
  timestamp: Date;
  isPlaying?: boolean;
}

export const ScreenReaderAI: React.FC<ScreenReaderAIProps> = ({
  className = '',
  context = 'general',
  onResponse,
}) => {
  const [responses, setResponses] = useState<AIResponse[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [currentResponse, setCurrentResponse] = useState<string | null>(null);
  const [speechRate, setSpeechRate] = useState(1);
  const [speechPitch, setSpeechPitch] = useState(1);
  const [speechVolume, setSpeechVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  
  const { executeAIRequest } = useGroqAI();
  const { 
    settings, 
    announceToScreenReader,
    getAccessibilityClasses,
    getTouchTargetSize
  } = useAccessibility();
  
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
  const responsesRef = useRef<HTMLDivElement>(null);

  // Initialize speech synthesis
  useEffect(() => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      // Speech synthesis is available
    }
  }, []);

  // Handle AI request
  const handleAIRequest = async (prompt: string) => {
    if (!prompt.trim()) return;

    setIsProcessing(true);
    announceToScreenReader('Processing your request...');

    try {
      const response = await executeAIRequest(
        async (prompt: string) => {
          const { groqClient } = await import('@/lib/groq/groqClient');
          const response = await groqClient.chat.completions.create({
            messages: [
              { 
                role: 'system', 
                content: `You are an expert programming language historian and educator. Provide detailed, accurate, and engaging responses about programming languages, their history, and evolution. Context: ${context}. Make your responses clear and well-structured for screen readers.` 
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
        context,
        prompt
      );

      if (response) {
        const newResponse: AIResponse = {
          id: Date.now().toString(),
          content: response.content,
          timestamp: new Date(),
        };

        setResponses(prev => [newResponse, ...prev]);
        onResponse?.(response.content);
        
        // Auto-speak the response if not muted
        if (!isMuted) {
          speakText(response.content);
        }
        
        announceToScreenReader('Response received and ready to read');
      }
    } catch (error) {
      const errorMessage = 'Sorry, I encountered an error processing your request. Please try again.';
      announceToScreenReader(errorMessage);
      console.error('AI request failed:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  // Speak text using speech synthesis
  const speakText = (text: string) => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      return;
    }

    // Stop any current speech
    if (utteranceRef.current) {
      speechSynthesis.cancel();
    }

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = speechRate;
    utterance.pitch = speechPitch;
    utterance.volume = speechVolume;
    
    utterance.onstart = () => {
      setIsSpeaking(true);
      setCurrentResponse(text);
      announceToScreenReader('Reading response...');
    };
    
    utterance.onend = () => {
      setIsSpeaking(false);
      setCurrentResponse(null);
      announceToScreenReader('Finished reading response');
    };
    
    utterance.onerror = (event) => {
      setIsSpeaking(false);
      setCurrentResponse(null);
      announceToScreenReader('Error reading response');
      console.error('Speech synthesis error:', event);
    };

    utteranceRef.current = utterance;
    speechSynthesis.speak(utterance);
  };

  // Stop speech
  const stopSpeech = () => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      speechSynthesis.cancel();
      setIsSpeaking(false);
      setCurrentResponse(null);
      announceToScreenReader('Stopped reading');
    }
  };

  // Handle keyboard input
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      const input = e.currentTarget;
      const prompt = input.value.trim();
      if (prompt) {
        handleAIRequest(prompt);
        input.value = '';
      }
    }
  };

  // Handle voice input
  const handleVoiceInput = () => {
    if (typeof window !== 'undefined' && 'webkitSpeechRecognition' in window) {
      const recognition = new (window as any).webkitSpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = 'en-US';

      recognition.onstart = () => {
        announceToScreenReader('Listening for your voice input...');
      };

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        announceToScreenReader(`Heard: ${transcript}`);
        handleAIRequest(transcript);
      };

      recognition.onerror = (event: any) => {
        announceToScreenReader('Voice recognition error. Please try again.');
        console.error('Voice recognition error:', event);
      };

      recognition.start();
    } else {
      announceToScreenReader('Voice recognition is not supported in this browser.');
    }
  };

  // Clear responses
  const clearResponses = () => {
    setResponses([]);
    stopSpeech();
    announceToScreenReader('Cleared all responses');
  };

  // Get accessibility classes
  const getResponseClasses = () => {
    return getAccessibilityClasses();
  };

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <div className="text-center">
        <h2 className="portfolio-hero-text text-white mb-4">Screen Reader AI Assistant</h2>
        <p className="portfolio-base-text text-gray-300 max-w-3xl mx-auto">
          An AI assistant optimized for screen readers and accessibility tools. 
          Get spoken responses and navigate using keyboard shortcuts.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Input Section */}
        <div className="space-y-4">
          <h3 className="portfolio-medium-text text-white">Ask a Question</h3>
          
          {/* Text Input */}
          <div className="space-y-2">
            <label htmlFor="ai-input" className="portfolio-small-text text-orange-400">
              Type your question about programming languages:
            </label>
            <input
              id="ai-input"
              type="text"
              onKeyDown={handleKeyDown}
              placeholder="Ask about programming language history..."
              className="w-full bg-gray-800/50 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-orange-500 transition-colors"
              aria-describedby="input-help"
            />
            <p id="input-help" className="portfolio-small-text text-gray-400">
              Press Enter to send your question
            </p>
          </div>

          {/* Voice Input */}
          <div className="space-y-2">
            <label className="portfolio-small-text text-orange-400">
              Or use voice input:
            </label>
            <InteractiveButton
              onClick={handleVoiceInput}
              variant="primary"
              className={`w-full ${getTouchTargetSize()}`}
              aria-label="Start voice input"
            >
              <Volume2 className="w-4 h-4 mr-2" />
              VOICE INPUT
            </InteractiveButton>
          </div>

          {/* Speech Controls */}
          <div className="space-y-4 p-4 bg-gray-800/50 rounded-lg">
            <h4 className="portfolio-small-text text-orange-400">Speech Settings</h4>
            
            <div className="grid grid-cols-1 gap-4">
              <div>
                <label htmlFor="speech-rate" className="portfolio-small-text text-gray-300">
                  Speech Rate: {speechRate}x
                </label>
                <input
                  id="speech-rate"
                  type="range"
                  min="0.5"
                  max="2"
                  step="0.1"
                  value={speechRate}
                  onChange={(e) => setSpeechRate(parseFloat(e.target.value))}
                  className="w-full mt-1"
                  aria-label={`Speech rate: ${speechRate} times normal`}
                />
              </div>

              <div>
                <label htmlFor="speech-pitch" className="portfolio-small-text text-gray-300">
                  Speech Pitch: {speechPitch}x
                </label>
                <input
                  id="speech-pitch"
                  type="range"
                  min="0.5"
                  max="2"
                  step="0.1"
                  value={speechPitch}
                  onChange={(e) => setSpeechPitch(parseFloat(e.target.value))}
                  className="w-full mt-1"
                  aria-label={`Speech pitch: ${speechPitch} times normal`}
                />
              </div>

              <div>
                <label htmlFor="speech-volume" className="portfolio-small-text text-gray-300">
                  Speech Volume: {Math.round(speechVolume * 100)}%
                </label>
                <input
                  id="speech-volume"
                  type="range"
                  min="0"
                  max="1"
                  step="0.1"
                  value={speechVolume}
                  onChange={(e) => setSpeechVolume(parseFloat(e.target.value))}
                  className="w-full mt-1"
                  aria-label={`Speech volume: ${Math.round(speechVolume * 100)} percent`}
                />
              </div>
            </div>

            <div className="flex gap-2">
              <InteractiveButton
                onClick={() => setIsMuted(!isMuted)}
                variant="ghost"
                size="sm"
                className="flex-1"
                aria-label={isMuted ? 'Unmute speech' : 'Mute speech'}
              >
                {isMuted ? <VolumeX className="w-4 h-4 mr-2" /> : <Volume2 className="w-4 h-4 mr-2" />}
                {isMuted ? 'UNMUTE' : 'MUTE'}
              </InteractiveButton>

              <InteractiveButton
                onClick={clearResponses}
                variant="ghost"
                size="sm"
                className="flex-1"
                aria-label="Clear all responses"
              >
                <RotateCcw className="w-4 h-4 mr-2" />
                CLEAR
              </InteractiveButton>
            </div>
          </div>
        </div>

        {/* Responses Section */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="portfolio-medium-text text-white">AI Responses</h3>
            <span className="portfolio-small-text text-gray-400">
              {responses.length} response{responses.length !== 1 ? 's' : ''}
            </span>
          </div>

          <div 
            ref={responsesRef}
            className="space-y-4 max-h-96 overflow-y-auto"
            role="region"
            aria-label="AI responses"
            aria-live="polite"
          >
            <AnimatePresence>
              {responses.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center py-8"
                >
                  <Bot className="w-12 h-12 text-gray-600 mx-auto mb-4" />
                  <p className="text-gray-400">No responses yet</p>
                  <p className="text-sm text-gray-500">Ask a question to get started</p>
                </motion.div>
              ) : (
                responses.map((response, index) => (
                  <motion.div
                    key={response.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ delay: index * 0.1, duration: 0.3 }}
                    className={`p-4 rounded-lg border ${
                      currentResponse === response.content
                        ? 'border-orange-500 bg-orange-500/10'
                        : 'border-gray-700 bg-gray-800/50'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <Bot className="w-4 h-4 text-orange-400" />
                        <span className="portfolio-small-text text-orange-400">
                          AI Response
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="portfolio-small-text text-gray-500">
                          {response.timestamp.toLocaleTimeString()}
                        </span>
                        <InteractiveButton
                          onClick={() => {
                            if (isSpeaking && currentResponse === response.content) {
                              stopSpeech();
                            } else {
                              speakText(response.content);
                            }
                          }}
                          variant="ghost"
                          size="sm"
                          aria-label={
                            isSpeaking && currentResponse === response.content
                              ? 'Stop reading this response'
                              : 'Read this response aloud'
                          }
                        >
                          {isSpeaking && currentResponse === response.content ? (
                            <Pause className="w-4 h-4" />
                          ) : (
                            <Play className="w-4 h-4" />
                          )}
                        </InteractiveButton>
                      </div>
                    </div>
                    
                    <div className="text-gray-300 text-sm leading-relaxed">
                      {response.content}
                    </div>
                  </motion.div>
                ))
              )}
            </AnimatePresence>

            {/* Processing Indicator */}
            {isProcessing && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-3 p-4 bg-gray-800/50 rounded-lg"
              >
                <Bot className="w-4 h-4 text-orange-400 animate-pulse" />
                <span className="text-gray-300">AI is thinking...</span>
              </motion.div>
            )}
          </div>
        </div>
      </div>

      {/* Keyboard Shortcuts Help */}
      <div className="mt-8 p-4 bg-gray-800/50 rounded-lg">
        <h4 className="portfolio-small-text text-orange-400 mb-3">Keyboard Shortcuts</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-gray-300">
          <div>• <kbd className="px-1 py-0.5 bg-gray-700 rounded text-xs">Enter</kbd> - Send question</div>
          <div>• <kbd className="px-1 py-0.5 bg-gray-700 rounded text-xs">Space</kbd> - Play/pause speech</div>
          <div>• <kbd className="px-1 py-0.5 bg-gray-700 rounded text-xs">Escape</kbd> - Stop speech</div>
          <div>• <kbd className="px-1 py-0.5 bg-gray-700 rounded text-xs">Tab</kbd> - Navigate between elements</div>
        </div>
      </div>
    </div>
  );
};

export default ScreenReaderAI;