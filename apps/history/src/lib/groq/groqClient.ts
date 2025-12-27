/**
 * GROQ AI Client - Secure Implementation
 *
 * IMPORTANT: This client now uses a secure server-side API route.
 * The API key is stored server-side only (no NEXT_PUBLIC_ prefix).
 * All AI requests should go through /api/ai/chat endpoint.
 */

export interface AIResponse {
  success: boolean;
  response?: string;
  model?: string;
  error?: string;
  message?: string;
  usage?: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}

export interface AIRequestOptions {
  message: string;
  context?: string;
  signal?: AbortSignal;
}

/**
 * Secure AI client that communicates with the server-side API route
 * No API keys are exposed to the client
 */
export const secureAIClient = {
  /**
   * Send a chat message to the AI assistant
   */
  async chat(options: AIRequestOptions): Promise<AIResponse> {
    const { message, context, signal } = options;

    try {
      const response = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message, context }),
        signal,
      });

      const data = await response.json();

      if (!response.ok) {
        return {
          success: false,
          error: data.error || 'Request failed',
          message: data.message || 'Unable to process your request',
        };
      }

      return {
        success: true,
        response: data.response,
        model: data.model,
        usage: data.usage,
      };
    } catch (error) {
      if (error instanceof Error && error.name === 'AbortError') {
        return {
          success: false,
          error: 'Request cancelled',
          message: 'The request was cancelled',
        };
      }

      return {
        success: false,
        error: 'Network error',
        message: 'Unable to connect to AI service',
      };
    }
  },

  /**
   * Check if AI service is available
   */
  async checkHealth(): Promise<{ available: boolean; status: string }> {
    try {
      const response = await fetch('/api/ai/chat', {
        method: 'GET',
      });

      if (!response.ok) {
        return { available: false, status: 'unavailable' };
      }

      const data = await response.json();
      return {
        available: data.aiEnabled ?? false,
        status: data.status ?? 'unknown'
      };
    } catch {
      return { available: false, status: 'error' };
    }
  }
};

// Legacy export for backward compatibility
// This will log a warning if used
export const groqClient = {
  chat: {
    completions: {
      create: async () => {
        if (process.env.NODE_ENV === 'development') {
          console.warn(
            '[DEPRECATED] Direct groqClient usage is deprecated. ' +
            'Use secureAIClient.chat() instead for secure server-side AI requests.'
          );
        }
        throw new Error(
          'Direct GROQ client usage is disabled for security. ' +
          'Use secureAIClient.chat() instead.'
        );
      }
    }
  }
};

export const groqConfig = {
  model: "llama3-8b-8192",
  fallbackModel: "mixtral-8x7b-32768",
  temperature: 0.7,
  maxTokens: 1024,
  timeout: 30000,
};
