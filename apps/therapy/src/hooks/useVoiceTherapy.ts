import { useState, useEffect, useRef, useCallback } from 'react';

export interface VoiceSettings {
  language: string;
  voice: string;
  rate: number;
  pitch: number;
  volume: number;
  enabled: boolean;
}

export interface VoiceState {
  isListening: boolean;
  isSpeaking: boolean;
  transcript: string;
  confidence: number;
  error: string | null;
  isSupported: boolean;
}

export const useVoiceTherapy = () => {
  const [voiceState, setVoiceState] = useState<VoiceState>({
    isListening: false,
    isSpeaking: false,
    transcript: '',
    confidence: 0,
    error: null,
    isSupported: false
  });

  const [voiceSettings, setVoiceSettings] = useState<VoiceSettings>({
    language: 'en-US',
    voice: 'default',
    rate: 1,
    pitch: 1,
    volume: 1,
    enabled: true
  });

  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const synthesisRef = useRef<SpeechSynthesisUtterance | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Check for voice support
  useEffect(() => {
    const checkSupport = () => {
      const speechRecognitionSupported = 'webkitSpeechRecognition' in window || 'SpeechRecognition' in window;
      const speechSynthesisSupported = 'speechSynthesis' in window;
      
      setVoiceState(prev => ({
        ...prev,
        isSupported: speechRecognitionSupported && speechSynthesisSupported,
        error: !speechRecognitionSupported ? 'Speech recognition not supported' : 
               !speechSynthesisSupported ? 'Speech synthesis not supported' : null
      }));
    };

    checkSupport();
  }, []);

  // Initialize speech recognition
  const initializeRecognition = useCallback(() => {
    if (!voiceState.isSupported) return;

    const SpeechRecognition = window.SpeechRecognition || (window as any).webkitSpeechRecognition;
    const recognition = new SpeechRecognition();

    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = voiceSettings.language;
    recognition.maxAlternatives = 1;

    recognition.onstart = () => {
      setVoiceState(prev => ({
        ...prev,
        isListening: true,
        error: null
      }));
    };

    recognition.onresult = (event) => {
      let finalTranscript = '';
      let interimTranscript = '';
      let confidence = 0;

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const result = event.results[i];
        if (result.isFinal) {
          finalTranscript += result[0].transcript;
          confidence = result[0].confidence;
        } else {
          interimTranscript += result[0].transcript;
        }
      }

      setVoiceState(prev => ({
        ...prev,
        transcript: finalTranscript || interimTranscript,
        confidence: confidence || 0
      }));
    };

    recognition.onerror = (event) => {
      let errorMessage = 'Speech recognition error';
      
      switch (event.error) {
        case 'no-speech':
          errorMessage = 'No speech detected. Please try again.';
          break;
        case 'audio-capture':
          errorMessage = 'No microphone found. Please check your microphone.';
          break;
        case 'not-allowed':
          errorMessage = 'Microphone access denied. Please allow microphone access.';
          break;
        case 'network':
          errorMessage = 'Network error. Please check your connection.';
          break;
        default:
          errorMessage = `Speech recognition error: ${event.error}`;
      }

      setVoiceState(prev => ({
        ...prev,
        isListening: false,
        error: errorMessage
      }));
    };

    recognition.onend = () => {
      setVoiceState(prev => ({
        ...prev,
        isListening: false
      }));
    };

    recognitionRef.current = recognition;
  }, [voiceSettings.language, voiceState.isSupported]);

  // Start listening
  const startListening = useCallback(() => {
    if (!recognitionRef.current || voiceState.isListening) return;

    try {
      recognitionRef.current.start();
    } catch (error) {
      setVoiceState(prev => ({
        ...prev,
        error: 'Failed to start speech recognition'
      }));
    }
  }, [voiceState.isListening]);

  // Stop listening
  const stopListening = useCallback(() => {
    if (!recognitionRef.current || !voiceState.isListening) return;

    try {
      recognitionRef.current.stop();
    } catch (error) {
      setVoiceState(prev => ({
        ...prev,
        error: 'Failed to stop speech recognition'
      }));
    }
  }, [voiceState.isListening]);

  // Speak text
  const speak = useCallback((text: string, options?: Partial<VoiceSettings>) => {
    if (!voiceState.isSupported || !voiceSettings.enabled) return;

    // Cancel any ongoing speech
    if (synthesisRef.current) {
      speechSynthesis.cancel();
    }

    const utterance = new SpeechSynthesisUtterance(text);
    
    // Apply voice settings
    utterance.rate = options?.rate || voiceSettings.rate;
    utterance.pitch = options?.pitch || voiceSettings.pitch;
    utterance.volume = options?.volume || voiceSettings.volume;
    utterance.lang = options?.language || voiceSettings.language;

    // Set voice if specified
    if (options?.voice || voiceSettings.voice !== 'default') {
      const voices = speechSynthesis.getVoices();
      const selectedVoice = voices.find(voice => 
        voice.name === (options?.voice || voiceSettings.voice)
      );
      if (selectedVoice) {
        utterance.voice = selectedVoice;
      }
    }

    utterance.onstart = () => {
      setVoiceState(prev => ({
        ...prev,
        isSpeaking: true,
        error: null
      }));
    };

    utterance.onend = () => {
      setVoiceState(prev => ({
        ...prev,
        isSpeaking: false
      }));
    };

    utterance.onerror = (event) => {
      setVoiceState(prev => ({
        ...prev,
        isSpeaking: false,
        error: `Speech synthesis error: ${event.error}`
      }));
    };

    synthesisRef.current = utterance;
    speechSynthesis.speak(utterance);
  }, [voiceState.isSupported, voiceSettings]);

  // Stop speaking
  const stopSpeaking = useCallback(() => {
    if (synthesisRef.current) {
      speechSynthesis.cancel();
      setVoiceState(prev => ({
        ...prev,
        isSpeaking: false
      }));
    }
  }, []);

  // Update voice settings
  const updateVoiceSettings = useCallback((newSettings: Partial<VoiceSettings>) => {
    setVoiceSettings(prev => ({
      ...prev,
      ...newSettings
    }));
  }, []);

  // Get available voices
  const getAvailableVoices = useCallback(() => {
    if (!voiceState.isSupported) return [];

    return speechSynthesis.getVoices().map(voice => ({
      name: voice.name,
      lang: voice.lang,
      default: voice.default,
      localService: voice.localService
    }));
  }, [voiceState.isSupported]);

  // Clear transcript
  const clearTranscript = useCallback(() => {
    setVoiceState(prev => ({
      ...prev,
      transcript: '',
      confidence: 0
    }));
  }, []);

  // Clear error
  const clearError = useCallback(() => {
    setVoiceState(prev => ({
      ...prev,
      error: null
    }));
  }, []);

  // Auto-stop listening after timeout
  useEffect(() => {
    if (voiceState.isListening) {
      timeoutRef.current = setTimeout(() => {
        stopListening();
      }, 30000); // 30 seconds timeout
    } else {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
    }

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [voiceState.isListening, stopListening]);

  // Initialize recognition on mount
  useEffect(() => {
    if (voiceState.isSupported) {
      initializeRecognition();
    }
  }, [initializeRecognition, voiceState.isSupported]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      if (synthesisRef.current) {
        speechSynthesis.cancel();
      }
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return {
    ...voiceState,
    voiceSettings,
    startListening,
    stopListening,
    speak,
    stopSpeaking,
    updateVoiceSettings,
    getAvailableVoices,
    clearTranscript,
    clearError
  };
};

export default useVoiceTherapy;