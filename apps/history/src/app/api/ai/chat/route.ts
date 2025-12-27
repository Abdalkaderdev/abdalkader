import { NextRequest, NextResponse } from 'next/server';
import Groq from 'groq-sdk';

// Rate limiting configuration
const RATE_LIMIT_WINDOW = 60 * 1000; // 1 minute
const MAX_REQUESTS_PER_WINDOW = 20;
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();

// Secure server-side only GROQ client
const createSecureGroqClient = () => {
  const apiKey = process.env.GROQ_API_KEY; // Server-side only - no NEXT_PUBLIC_ prefix

  if (!apiKey) {
    return null;
  }

  return new Groq({ apiKey });
};

const groqClient = createSecureGroqClient();

// Configuration
const AI_CONFIG = {
  model: 'llama3-8b-8192',
  fallbackModel: 'mixtral-8x7b-32768',
  temperature: 0.7,
  maxTokens: 1024,
  timeout: 30000,
} as const;

// System prompt for the programming history assistant
const SYSTEM_PROMPT = `You are an expert programming historian and educator. You help users learn about:
- The history and evolution of programming languages
- Key figures and pioneers in computer science
- Programming paradigms and their origins
- The relationships between different programming languages
- Modern developments in software engineering

Be concise, accurate, and engaging. Use examples when helpful. If you're unsure about something, say so.`;

// Rate limiting helper
function checkRateLimit(clientId: string): { allowed: boolean; retryAfter?: number } {
  const now = Date.now();
  const clientData = rateLimitMap.get(clientId);

  if (!clientData || now > clientData.resetTime) {
    rateLimitMap.set(clientId, { count: 1, resetTime: now + RATE_LIMIT_WINDOW });
    return { allowed: true };
  }

  if (clientData.count >= MAX_REQUESTS_PER_WINDOW) {
    return {
      allowed: false,
      retryAfter: Math.ceil((clientData.resetTime - now) / 1000)
    };
  }

  clientData.count++;
  return { allowed: true };
}

// Input validation
function validateInput(body: unknown): { valid: boolean; error?: string; data?: { message: string; context?: string } } {
  if (!body || typeof body !== 'object') {
    return { valid: false, error: 'Invalid request body' };
  }

  const { message, context } = body as Record<string, unknown>;

  if (!message || typeof message !== 'string') {
    return { valid: false, error: 'Message is required and must be a string' };
  }

  if (message.length > 4000) {
    return { valid: false, error: 'Message exceeds maximum length of 4000 characters' };
  }

  if (context !== undefined && typeof context !== 'string') {
    return { valid: false, error: 'Context must be a string if provided' };
  }

  return {
    valid: true,
    data: {
      message: message.trim(),
      context: typeof context === 'string' ? context.trim() : undefined
    }
  };
}

export async function POST(request: NextRequest) {
  try {
    // Check if GROQ is configured
    if (!groqClient) {
      return NextResponse.json(
        {
          error: 'AI service not configured',
          message: 'The AI assistant is currently unavailable. Please try again later.'
        },
        { status: 503 }
      );
    }

    // Get client identifier for rate limiting
    const clientId = request.headers.get('x-forwarded-for') ||
                     request.headers.get('x-real-ip') ||
                     'anonymous';

    // Check rate limit
    const rateLimit = checkRateLimit(clientId);
    if (!rateLimit.allowed) {
      return NextResponse.json(
        {
          error: 'Rate limit exceeded',
          message: `Too many requests. Please try again in ${rateLimit.retryAfter} seconds.`,
          retryAfter: rateLimit.retryAfter
        },
        {
          status: 429,
          headers: { 'Retry-After': String(rateLimit.retryAfter) }
        }
      );
    }

    // Parse and validate input
    const body = await request.json().catch(() => null);
    const validation = validateInput(body);

    if (!validation.valid || !validation.data) {
      return NextResponse.json(
        { error: 'Validation error', message: validation.error },
        { status: 400 }
      );
    }

    const { message, context } = validation.data;

    // Build messages array
    const messages: Array<{ role: 'system' | 'user' | 'assistant'; content: string }> = [
      { role: 'system', content: SYSTEM_PROMPT }
    ];

    if (context) {
      messages.push({
        role: 'system',
        content: `Current context: ${context}`
      });
    }

    messages.push({ role: 'user', content: message });

    // Make the API call with timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), AI_CONFIG.timeout);

    try {
      const completion = await groqClient.chat.completions.create({
        model: AI_CONFIG.model,
        messages,
        temperature: AI_CONFIG.temperature,
        max_tokens: AI_CONFIG.maxTokens,
      });

      clearTimeout(timeoutId);

      const response = completion.choices[0]?.message?.content;

      if (!response) {
        throw new Error('Empty response from AI');
      }

      return NextResponse.json({
        success: true,
        response,
        model: AI_CONFIG.model,
        usage: completion.usage
      });

    } catch (aiError) {
      clearTimeout(timeoutId);

      // Try fallback model
      if (aiError instanceof Error && aiError.name !== 'AbortError') {
        try {
          const fallbackCompletion = await groqClient.chat.completions.create({
            model: AI_CONFIG.fallbackModel,
            messages,
            temperature: AI_CONFIG.temperature,
            max_tokens: AI_CONFIG.maxTokens,
          });

          const fallbackResponse = fallbackCompletion.choices[0]?.message?.content;

          if (fallbackResponse) {
            return NextResponse.json({
              success: true,
              response: fallbackResponse,
              model: AI_CONFIG.fallbackModel,
              usage: fallbackCompletion.usage,
              fallback: true
            });
          }
        } catch {
          // Fallback also failed
        }
      }

      throw aiError;
    }

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';

    // Don't expose internal error details
    return NextResponse.json(
      {
        error: 'AI request failed',
        message: 'Unable to process your request. Please try again.'
      },
      { status: 500 }
    );
  }
}

// Health check endpoint
export async function GET() {
  const isConfigured = !!process.env.GROQ_API_KEY;

  return NextResponse.json({
    status: isConfigured ? 'healthy' : 'degraded',
    service: 'ai-chat',
    aiEnabled: isConfigured,
    timestamp: new Date().toISOString()
  });
}
