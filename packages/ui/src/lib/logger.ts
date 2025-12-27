/**
 * Secure Logging Utility
 *
 * A production-ready logging system that:
 * - Supports multiple log levels
 * - Automatically redacts sensitive information
 * - Can be conditionally disabled in production
 * - Provides structured logging for better debugging
 */

export type LogLevel = 'debug' | 'info' | 'warn' | 'error';

export interface LogEntry {
  level: LogLevel;
  message: string;
  timestamp: string;
  context?: string;
  data?: Record<string, unknown>;
  stack?: string;
}

export interface LoggerConfig {
  /** Minimum log level to output */
  minLevel: LogLevel;
  /** Whether logging is enabled */
  enabled: boolean;
  /** Context prefix for all logs */
  context?: string;
  /** Patterns to redact from logs */
  redactPatterns?: RegExp[];
  /** Custom log handler */
  handler?: (entry: LogEntry) => void;
}

// Log level priorities
const LOG_LEVELS: Record<LogLevel, number> = {
  debug: 0,
  info: 1,
  warn: 2,
  error: 3,
};

// Default sensitive patterns to redact
const DEFAULT_REDACT_PATTERNS = [
  /api[_-]?key[=:]\s*["']?[\w-]+["']?/gi,
  /password[=:]\s*["']?[^"'\s]+["']?/gi,
  /token[=:]\s*["']?[\w-]+["']?/gi,
  /secret[=:]\s*["']?[\w-]+["']?/gi,
  /bearer\s+[\w-]+/gi,
  /authorization[=:]\s*["']?[\w-]+["']?/gi,
  /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g, // emails
  /\b\d{4}[- ]?\d{4}[- ]?\d{4}[- ]?\d{4}\b/g, // credit cards
];

/**
 * Redacts sensitive information from a string
 */
function redactSensitive(value: string, patterns: RegExp[]): string {
  let result = value;
  for (const pattern of patterns) {
    result = result.replace(pattern, '[REDACTED]');
  }
  return result;
}

/**
 * Redacts sensitive information from an object
 */
function redactObject(
  obj: Record<string, unknown>,
  patterns: RegExp[]
): Record<string, unknown> {
  const result: Record<string, unknown> = {};

  for (const [key, value] of Object.entries(obj)) {
    // Check if key itself is sensitive
    const sensitiveKeys = ['password', 'token', 'secret', 'key', 'auth', 'credential'];
    if (sensitiveKeys.some((k) => key.toLowerCase().includes(k))) {
      result[key] = '[REDACTED]';
      continue;
    }

    if (typeof value === 'string') {
      result[key] = redactSensitive(value, patterns);
    } else if (typeof value === 'object' && value !== null) {
      result[key] = redactObject(value as Record<string, unknown>, patterns);
    } else {
      result[key] = value;
    }
  }

  return result;
}

/**
 * Creates a logger instance with the given configuration
 */
export function createLogger(config: Partial<LoggerConfig> = {}): Logger {
  return new Logger(config);
}

export class Logger {
  private config: LoggerConfig;

  constructor(config: Partial<LoggerConfig> = {}) {
    const isProduction = typeof process !== 'undefined' &&
                         process.env?.NODE_ENV === 'production';
    const isDebugEnabled = typeof process !== 'undefined' &&
                           process.env?.NEXT_PUBLIC_DEBUG === 'true';

    this.config = {
      minLevel: config.minLevel ?? (isProduction && !isDebugEnabled ? 'warn' : 'debug'),
      enabled: config.enabled ?? true,
      context: config.context,
      redactPatterns: [
        ...DEFAULT_REDACT_PATTERNS,
        ...(config.redactPatterns ?? []),
      ],
      handler: config.handler,
    };
  }

  private shouldLog(level: LogLevel): boolean {
    if (!this.config.enabled) return false;
    return LOG_LEVELS[level] >= LOG_LEVELS[this.config.minLevel];
  }

  private formatMessage(message: string): string {
    return redactSensitive(message, this.config.redactPatterns!);
  }

  private formatData(data?: Record<string, unknown>): Record<string, unknown> | undefined {
    if (!data) return undefined;
    return redactObject(data, this.config.redactPatterns!);
  }

  private createEntry(
    level: LogLevel,
    message: string,
    data?: Record<string, unknown>,
    error?: Error
  ): LogEntry {
    return {
      level,
      message: this.formatMessage(message),
      timestamp: new Date().toISOString(),
      context: this.config.context,
      data: this.formatData(data),
      stack: error?.stack,
    };
  }

  private output(entry: LogEntry): void {
    if (this.config.handler) {
      this.config.handler(entry);
      return;
    }

    const prefix = entry.context ? `[${entry.context}]` : '';
    const timestamp = entry.timestamp.split('T')[1]?.slice(0, 8) || '';
    const formattedMessage = `${timestamp} ${prefix} ${entry.message}`;

    switch (entry.level) {
      case 'debug':
        console.debug(formattedMessage, entry.data || '');
        break;
      case 'info':
        console.info(formattedMessage, entry.data || '');
        break;
      case 'warn':
        console.warn(formattedMessage, entry.data || '');
        break;
      case 'error':
        console.error(formattedMessage, entry.data || '', entry.stack || '');
        break;
    }
  }

  /**
   * Log a debug message
   */
  debug(message: string, data?: Record<string, unknown>): void {
    if (!this.shouldLog('debug')) return;
    this.output(this.createEntry('debug', message, data));
  }

  /**
   * Log an info message
   */
  info(message: string, data?: Record<string, unknown>): void {
    if (!this.shouldLog('info')) return;
    this.output(this.createEntry('info', message, data));
  }

  /**
   * Log a warning message
   */
  warn(message: string, data?: Record<string, unknown>): void {
    if (!this.shouldLog('warn')) return;
    this.output(this.createEntry('warn', message, data));
  }

  /**
   * Log an error message
   */
  error(message: string, error?: Error | Record<string, unknown>): void {
    if (!this.shouldLog('error')) return;

    if (error instanceof Error) {
      this.output(this.createEntry('error', message, { errorMessage: error.message }, error));
    } else {
      this.output(this.createEntry('error', message, error));
    }
  }

  /**
   * Create a child logger with additional context
   */
  child(context: string): Logger {
    const childContext = this.config.context
      ? `${this.config.context}:${context}`
      : context;

    return new Logger({
      ...this.config,
      context: childContext,
    });
  }

  /**
   * Measure and log execution time
   */
  async time<T>(label: string, fn: () => Promise<T>): Promise<T> {
    const start = performance.now();
    try {
      const result = await fn();
      const duration = performance.now() - start;
      this.debug(`${label} completed`, { durationMs: Math.round(duration) });
      return result;
    } catch (error) {
      const duration = performance.now() - start;
      this.error(`${label} failed`, {
        durationMs: Math.round(duration),
        error: error instanceof Error ? error.message : String(error),
      });
      throw error;
    }
  }
}

// Default logger instance
export const logger = createLogger();

// Pre-configured loggers for different parts of the app
export const loggers = {
  api: createLogger({ context: 'API' }),
  ui: createLogger({ context: 'UI' }),
  auth: createLogger({ context: 'Auth' }),
  analytics: createLogger({ context: 'Analytics' }),
  performance: createLogger({ context: 'Perf' }),
};
