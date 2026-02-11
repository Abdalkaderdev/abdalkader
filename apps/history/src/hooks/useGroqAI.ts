import { useState, useCallback } from 'react';
import { AIResponse } from '@/services/aiService';
import { AIExplanation } from '@/lib/types/language';

interface UseGroqAIOptions {
  cacheResponses?: boolean;
  maxCacheSize?: number;
}

export function useGroqAI(options: UseGroqAIOptions = {}) {
  const { cacheResponses = true, maxCacheSize = 100 } = options;
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [cache, setCache] = useState<Map<string, AIExplanation>>(new Map());

  const generateCacheKey = useCallback((type: string, ...args: any[]) => {
    return `${type}:${args.join(':')}`;
  }, []);

  const getCachedResponse = useCallback((key: string): AIExplanation | null => {
    if (!cacheResponses) return null;
    return cache.get(key) || null;
  }, [cache, cacheResponses]);

  const setCachedResponse = useCallback((key: string, response: AIExplanation) => {
    if (!cacheResponses) return;
    
    setCache(prev => {
      const newCache = new Map(prev);
      if (newCache.size >= maxCacheSize) {
        const firstKey = newCache.keys().next().value;
        if (firstKey) {
          newCache.delete(firstKey);
        }
      }
      newCache.set(key, response);
      return newCache;
    });
  }, [cacheResponses, maxCacheSize]);

  const executeAIRequest = useCallback(async <T extends any[]>(
    aiFunction: (...args: T) => Promise<AIResponse>,
    type: AIExplanation['type'],
    languageId: string,
    ...args: T
  ): Promise<AIExplanation | null> => {
    const cacheKey = generateCacheKey(type, languageId, ...args);
    const cached = getCachedResponse(cacheKey);
    
    if (cached) {
      return cached;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await aiFunction(...args);
      const explanation: AIExplanation = {
        content: response.content,
        model: response.model,
        timestamp: Date.now(),
        languageId,
        type,
      };

      setCachedResponse(cacheKey, explanation);
      return explanation;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      setError(errorMessage);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [generateCacheKey, getCachedResponse, setCachedResponse]);

  const clearCache = useCallback(() => {
    setCache(new Map());
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    isLoading,
    error,
    executeAIRequest,
    clearCache,
    clearError,
    cacheSize: cache.size,
  };
}
