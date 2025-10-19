'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mic, MicOff, Volume2, VolumeX, Bot, User, Play, Pause, RotateCcw } from 'lucide-react';
import { InteractiveCard } from '@/components/interactions/InteractiveCard';
import { InteractiveButton } from '@/components/interactions/InteractiveButton';
import { useGroqAI } from '@/hooks/useGroqAI';
import { useReducedMotion } from '@/hooks/useAnimations';

interface VoiceMessage {
  id: string;
  type: 'user' | 'ai';
  audioBlob?: Blob;
  transcript?: string;
  timestamp: Date;
  isPlaying?: boolean;
}

interface VoiceToAIProps {
  className?: string;
  onMessageSent?: (message: VoiceMessage) => void;
}

export const VoiceToAI: React.FC<VoiceToAIProps> = ({
  className = '',
  onMessageSent,
}) => {
  const [isRecording, setIsRecording] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isPlaying, setIsPlaying] = useState<string | null>(null);
  const [messages, setMessages] = useState<VoiceMessage[]>([]);
  const [audioContext, setAudioContext] = useState<AudioContext | null>(null);
  const [isMuted, setIsMuted] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const { executeAIRequest } = useGroqAI();
  const reducedMotion = useReducedMotion();

  // Initialize audio context
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const context = new (window.AudioContext || (window as any).webkitAudioContext)();
      setAudioContext(context);
    }
  }, []);

  // Check for speech recognition support
  const isSpeechRecognitionSupported = typeof window !== 'undefined' && 'webkitSpeechRecognition' in window;

  const startRecording = async () => {
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      alert('Microphone access is not supported in this browser.');
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
        handleAudioComplete(audioBlob);
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
      setIsListening(true);
    } catch (error) {
      console.error('Error accessing microphone:', error);
      alert('Could not access microphone. Please check permissions.');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      setIsListening(false);
    }
  };

  const handleAudioComplete = async (audioBlob: Blob) => {
    const userMessage: VoiceMessage = {
      id: Date.now().toString(),
      type: 'user',
      audioBlob,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    onMessageSent?.(userMessage);
    setIsProcessing(true);

    try {
      // In a real implementation, you would send the audio to a speech-to-text service
      // For now, we'll simulate with a text prompt
      const response = await executeAIRequest(
        (prompt: string) => ({
          messages: [
            { 
              role: 'system', 
              content: 'You are an expert programming language historian. Respond to voice questions about programming languages, their history, and evolution. Keep responses conversational and engaging.' 
            },
            { role: 'user', content: 'User asked a question about programming languages via voice.' }
          ]
        }),
        'voice-chat',
        'voice',
        'Voice question about programming languages'
      );

      if (response) {
        const aiMessage: VoiceMessage = {
          id: (Date.now() + 1).toString(),
          type: 'ai',
          transcript: response.content,
          timestamp: new Date(),
        };

        setMessages(prev => [...prev, aiMessage]);
        
        // Generate speech for AI response
        if (audioContext && !isMuted) {
          generateSpeech(response.content);
        }
      }
    } catch (error) {
      console.error('Error processing voice message:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  const generateSpeech = async (text: string) => {
    if (!audioContext) return;

    try {
      // In a real implementation, you would use a text-to-speech service
      // For now, we'll create a simple audio visualization
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      oscillator.frequency.setValueAtTime(200, audioContext.currentTime);
      gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
      
      oscillator.start();
      oscillator.stop(audioContext.currentTime + 0.5);
    } catch (error) {
      console.error('Error generating speech:', error);
    }
  };

  const playAudio = async (messageId: string) => {
    const message = messages.find(m => m.id === messageId);
    if (!message || !message.audioBlob) return;

    try {
      const audioUrl = URL.createObjectURL(message.audioBlob);
      const audio = new Audio(audioUrl);
      
      audio.onplay = () => setIsPlaying(messageId);
      audio.onended = () => setIsPlaying(null);
      audio.onerror = () => setIsPlaying(null);
      
      await audio.play();
    } catch (error) {
      console.error('Error playing audio:', error);
    }
  };

  const stopAudio = () => {
    setIsPlaying(null);
    // Stop all audio elements
    const audioElements = document.querySelectorAll('audio');
    audioElements.forEach(audio => {
      audio.pause();
      audio.currentTime = 0;
    });
  };

  const clearMessages = () => {
    setMessages([]);
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
    if (!isMuted) {
      stopAudio();
    }
  };

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <h2 className="portfolio-hero-text text-white mb-4">Voice-to-AI Chat</h2>
        <p className="portfolio-base-text text-gray-300 max-w-3xl mx-auto">
          Have a conversation with AI about programming languages using your voice. 
          Speak naturally and get instant audio responses about programming history and concepts.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Voice Controls */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
        >
          <InteractiveCard variant="ai" className="h-full">
            <div className="space-y-6">
              <h3 className="portfolio-medium-text text-white">Voice Controls</h3>

              {/* Main Recording Button */}
              <div className="text-center space-y-4">
                <motion.div
                  className={`w-32 h-32 mx-auto rounded-full flex items-center justify-center cursor-pointer ${
                    isRecording 
                      ? 'bg-red-500 animate-pulse' 
                      : isListening 
                        ? 'bg-orange-500 animate-pulse' 
                        : 'bg-orange-500 hover:bg-orange-400'
                  }`}
                  onClick={isRecording ? stopRecording : startRecording}
                  whileHover={reducedMotion ? {} : { scale: 1.05 }}
                  whileTap={reducedMotion ? {} : { scale: 0.95 }}
                  animate={isRecording ? { scale: [1, 1.1, 1] } : {}}
                  transition={{ duration: 0.5, repeat: isRecording ? Infinity : 0 }}
                >
                  {isRecording ? (
                    <MicOff className="w-12 h-12 text-white" />
                  ) : (
                    <Mic className="w-12 h-12 text-white" />
                  )}
                </motion.div>

                <div className="space-y-2">
                  <p className="portfolio-medium-text text-white">
                    {isRecording ? 'Recording...' : isListening ? 'Listening...' : 'Tap to Speak'}
                  </p>
                  <p className="portfolio-small-text text-gray-400">
                    {isRecording ? 'Tap again to stop' : 'Ask about programming languages'}
                  </p>
                </div>
              </div>

              {/* Status Indicators */}
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg">
                  <span className="portfolio-small-text text-gray-300">Microphone</span>
                  <div className={`w-3 h-3 rounded-full ${isRecording ? 'bg-red-500' : 'bg-gray-500'}`} />
                </div>
                
                <div className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg">
                  <span className="portfolio-small-text text-gray-300">Processing</span>
                  <div className={`w-3 h-3 rounded-full ${isProcessing ? 'bg-yellow-500 animate-pulse' : 'bg-gray-500'}`} />
                </div>

                <div className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg">
                  <span className="portfolio-small-text text-gray-300">Audio Output</span>
                  <div className={`w-3 h-3 rounded-full ${!isMuted ? 'bg-green-500' : 'bg-gray-500'}`} />
                </div>
              </div>

              {/* Control Buttons */}
              <div className="flex gap-3">
                <InteractiveButton
                  onClick={toggleMute}
                  variant="ghost"
                  size="sm"
                  className="flex-1"
                >
                  {isMuted ? <VolumeX className="w-4 h-4 mr-2" /> : <Volume2 className="w-4 h-4 mr-2" />}
                  {isMuted ? 'UNMUTE' : 'MUTE'}
                </InteractiveButton>

                <InteractiveButton
                  onClick={clearMessages}
                  variant="ghost"
                  size="sm"
                  className="flex-1"
                >
                  <RotateCcw className="w-4 h-4 mr-2" />
                  CLEAR
                </InteractiveButton>
              </div>

              {/* Browser Support Warning */}
              {!isSpeechRecognitionSupported && (
                <div className="bg-yellow-500/20 border border-yellow-500/30 rounded-lg p-3">
                  <p className="portfolio-small-text text-yellow-300">
                    Voice recognition is not supported in this browser. Please use Chrome or Edge for full functionality.
                  </p>
                </div>
              )}
            </div>
          </InteractiveCard>
        </motion.div>

        {/* Voice Messages */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
        >
          <InteractiveCard variant="ai" className="h-full">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="portfolio-medium-text text-white">Voice Messages</h3>
                <span className="portfolio-small-text text-gray-400">
                  {messages.length} message{messages.length !== 1 ? 's' : ''}
                </span>
              </div>

              <div className="space-y-4 max-h-96 overflow-y-auto">
                <AnimatePresence>
                  {messages.length === 0 ? (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="text-center py-8"
                    >
                      <Mic className="w-12 h-12 text-gray-600 mx-auto mb-4" />
                      <p className="text-gray-400">No voice messages yet</p>
                      <p className="text-sm text-gray-500">Start recording to begin the conversation</p>
                    </motion.div>
                  ) : (
                    messages.map((message, index) => (
                      <motion.div
                        key={message.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ delay: index * 0.1, duration: 0.3 }}
                        className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                      >
                        <div className={`max-w-[85%] group`}>
                          {/* Message Header */}
                          <div className={`flex items-center gap-2 mb-2 ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                            <div className={`flex items-center gap-2 ${message.type === 'user' ? 'flex-row-reverse' : ''}`}>
                              <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
                                message.type === 'user' 
                                  ? 'bg-orange-500 text-black' 
                                  : 'bg-gray-700 text-orange-400'
                              }`}>
                                {message.type === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                              </div>
                              <span className="portfolio-small-text text-gray-400">
                                {message.type === 'user' ? 'You' : 'AI Historian'}
                              </span>
                              <span className="portfolio-small-text text-gray-500">
                                {message.timestamp.toLocaleTimeString()}
                              </span>
                            </div>
                          </div>

                          {/* Message Content */}
                          <div className={`p-4 rounded-xl ${
                            message.type === 'user' 
                              ? 'bg-orange-500 text-black' 
                              : 'bg-gray-800/50 text-gray-300'
                          }`}>
                            {message.audioBlob ? (
                              <div className="flex items-center gap-3">
                                <motion.button
                                  onClick={() => isPlaying === message.id ? stopAudio() : playAudio(message.id)}
                                  className="p-2 rounded-full bg-black/20 hover:bg-black/40 transition-colors"
                                  whileHover={reducedMotion ? {} : { scale: 1.1 }}
                                  whileTap={reducedMotion ? {} : { scale: 0.9 }}
                                >
                                  {isPlaying === message.id ? (
                                    <Pause className="w-4 h-4" />
                                  ) : (
                                    <Play className="w-4 h-4" />
                                  )}
                                </motion.button>
                                <div>
                                  <p className="text-sm font-medium">
                                    {message.type === 'user' ? 'Voice Message' : 'AI Response'}
                                  </p>
                                  <p className="text-xs opacity-75">
                                    {message.type === 'user' ? 'Tap to play' : 'Tap to play response'}
                                  </p>
                                </div>
                              </div>
                            ) : (
                              <p className="text-sm leading-relaxed">{message.transcript}</p>
                            )}
                          </div>

                          {/* Audio Visualization */}
                          {message.audioBlob && (
                            <div className="mt-2">
                              <div className="flex items-center gap-1">
                                {[...Array(20)].map((_, i) => (
                                  <motion.div
                                    key={i}
                                    className="w-1 bg-orange-400 rounded-full"
                                    animate={isPlaying === message.id ? {
                                      height: [4, 20, 4],
                                      opacity: [0.5, 1, 0.5]
                                    } : { height: 4, opacity: 0.3 }}
                                    transition={{
                                      duration: 0.5,
                                      repeat: isPlaying === message.id ? Infinity : 0,
                                      delay: i * 0.05
                                    }}
                                  />
                                ))}
                              </div>
                            </div>
                          )}
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
                    className="flex justify-start"
                  >
                    <div className="bg-gray-800/50 text-gray-300 p-4 rounded-xl max-w-[85%]">
                      <div className="flex items-center gap-3">
                        <Bot className="w-4 h-4 text-orange-400" />
                        <div className="flex items-center gap-2">
                          <div className="flex gap-1">
                            <motion.div
                              className="w-2 h-2 bg-orange-400 rounded-full"
                              animate={{ scale: [1, 1.5, 1] }}
                              transition={{ duration: 0.6, repeat: Infinity, delay: 0 }}
                            />
                            <motion.div
                              className="w-2 h-2 bg-orange-400 rounded-full"
                              animate={{ scale: [1, 1.5, 1] }}
                              transition={{ duration: 0.6, repeat: Infinity, delay: 0.2 }}
                            />
                            <motion.div
                              className="w-2 h-2 bg-orange-400 rounded-full"
                              animate={{ scale: [1, 1.5, 1] }}
                              transition={{ duration: 0.6, repeat: Infinity, delay: 0.4 }}
                            />
                          </div>
                          <span className="text-sm">AI is thinking...</span>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </div>
            </div>
          </InteractiveCard>
        </motion.div>
      </div>
    </div>
  );
};

export default VoiceToAI;