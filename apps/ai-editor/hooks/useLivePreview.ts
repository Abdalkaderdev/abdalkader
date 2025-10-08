import { useState, useEffect, useCallback, useRef } from 'react';
import { debounce } from '../utils/debounce';

interface UseLivePreviewOptions {
  code: string;
  delay?: number;
  onError?: (error: string) => void;
  onSuccess?: () => void;
}

interface LivePreviewState {
  isLoading: boolean;
  error: string | null;
  previewKey: number;
}

export function useLivePreview({
  code,
  delay = 1000,
  onError,
  onSuccess
}: UseLivePreviewOptions) {
  const [state, setState] = useState<LivePreviewState>({
    isLoading: false,
    error: null,
    previewKey: 0
  });

  const abortControllerRef = useRef<AbortController | null>(null);

  const validateCode = useCallback((code: string): string | null => {
    if (!code.trim()) {
      return 'Code cannot be empty';
    }

    // Basic syntax validation
    try {
      // Check for basic React component structure
      if (!code.includes('function') && !code.includes('const') && !code.includes('class')) {
        return 'Code must contain a React component';
      }

      // Check for JSX return
      if (!code.includes('return') && !code.includes('=>')) {
        return 'Component must return JSX';
      }

      // Check for balanced brackets
      const openBrackets = (code.match(/\{/g) || []).length;
      const closeBrackets = (code.match(/\}/g) || []).length;
      if (openBrackets !== closeBrackets) {
        return 'Unbalanced curly brackets';
      }

      // Check for balanced parentheses
      const openParens = (code.match(/\(/g) || []).length;
      const closeParens = (code.match(/\)/g) || []).length;
      if (openParens !== closeParens) {
        return 'Unbalanced parentheses';
      }

      return null;
    } catch (error) {
      return `Syntax error: ${error instanceof Error ? error.message : 'Unknown error'}`;
    }
  }, []);

  const updatePreview = useCallback(async (newCode: string) => {
    // Cancel previous request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    // Create new abort controller
    abortControllerRef.current = new AbortController();

    setState(prev => ({
      ...prev,
      isLoading: true,
      error: null
    }));

    try {
      // Validate code
      const validationError = validateCode(newCode);
      if (validationError) {
        throw new Error(validationError);
      }

      // Simulate processing time
      await new Promise(resolve => setTimeout(resolve, 300));

      // Check if request was aborted
      if (abortControllerRef.current?.signal.aborted) {
        return;
      }

      setState(prev => ({
        ...prev,
        isLoading: false,
        error: null,
        previewKey: prev.previewKey + 1
      }));

      onSuccess?.();
    } catch (error) {
      if (error instanceof Error && error.name === 'AbortError') {
        return;
      }

      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: errorMessage
      }));

      onError?.(errorMessage);
    }
  }, [validateCode, onError, onSuccess]);

  // Debounced update function
  const debouncedUpdate = useCallback(
    debounce(updatePreview, delay),
    [updatePreview, delay]
  );

  // Effect to trigger preview updates
  useEffect(() => {
    if (code) {
      debouncedUpdate(code);
    } else {
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: null
      }));
    }

    // Cleanup function
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [code, debouncedUpdate]);

  const refresh = useCallback(() => {
    if (code) {
      updatePreview(code);
    }
  }, [code, updatePreview]);

  const clearError = useCallback(() => {
    setState(prev => ({
      ...prev,
      error: null
    }));
  }, []);

  return {
    isLoading: state.isLoading,
    error: state.error,
    previewKey: state.previewKey,
    refresh,
    clearError
  };
}