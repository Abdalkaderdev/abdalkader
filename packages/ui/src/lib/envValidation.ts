/**
 * Environment Validation System
 *
 * Validates environment variables at build/runtime to catch configuration
 * issues early and prevent security vulnerabilities.
 */

export type EnvVarType = 'string' | 'number' | 'boolean' | 'url' | 'email';

export interface EnvVarConfig {
  /** The environment variable name */
  name: string;
  /** Whether this variable is required */
  required: boolean;
  /** The expected type for validation */
  type?: EnvVarType;
  /** Default value if not set (only for optional vars) */
  default?: string;
  /** Custom validation function */
  validate?: (value: string) => boolean;
  /** Error message for validation failures */
  errorMessage?: string;
  /** Whether this is a secret that should never be logged */
  isSecret?: boolean;
  /** Whether this should only exist on server (no NEXT_PUBLIC_ prefix) */
  serverOnly?: boolean;
}

export interface ValidationResult {
  valid: boolean;
  errors: string[];
  warnings: string[];
  validated: Record<string, string | undefined>;
}

// Common validation patterns
const patterns = {
  url: /^https?:\/\/.+/,
  email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
};

/**
 * Validates a single environment variable
 */
function validateEnvVar(
  config: EnvVarConfig,
  value: string | undefined
): { valid: boolean; error?: string; warning?: string } {
  const { name, required, type, validate, errorMessage, serverOnly } = config;

  // Check for server-only variables exposed to client
  if (serverOnly && name.startsWith('NEXT_PUBLIC_')) {
    return {
      valid: false,
      error: `Security: ${name} is marked as server-only but uses NEXT_PUBLIC_ prefix`,
    };
  }

  // Check if required variable is missing
  if (required && !value) {
    return {
      valid: false,
      error: errorMessage || `Required environment variable ${name} is not set`,
    };
  }

  // If not set and not required, it's valid
  if (!value) {
    return { valid: true };
  }

  // Type validation
  if (type) {
    switch (type) {
      case 'number':
        if (isNaN(Number(value))) {
          return {
            valid: false,
            error: `${name} must be a valid number`,
          };
        }
        break;
      case 'boolean':
        if (!['true', 'false', '1', '0'].includes(value.toLowerCase())) {
          return {
            valid: false,
            error: `${name} must be a boolean (true/false)`,
          };
        }
        break;
      case 'url':
        if (!patterns.url.test(value)) {
          return {
            valid: false,
            error: `${name} must be a valid URL starting with http:// or https://`,
          };
        }
        break;
      case 'email':
        if (!patterns.email.test(value)) {
          return {
            valid: false,
            error: `${name} must be a valid email address`,
          };
        }
        break;
    }
  }

  // Custom validation
  if (validate && !validate(value)) {
    return {
      valid: false,
      error: errorMessage || `${name} failed custom validation`,
    };
  }

  return { valid: true };
}

/**
 * Validates all environment variables based on provided schema
 */
export function validateEnv(schema: EnvVarConfig[]): ValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];
  const validated: Record<string, string | undefined> = {};

  for (const config of schema) {
    const value = process.env[config.name] || config.default;
    const result = validateEnvVar(config, value);

    if (!result.valid && result.error) {
      errors.push(result.error);
    }

    if (result.warning) {
      warnings.push(result.warning);
    }

    // Store validated value (never store secrets in validated output)
    validated[config.name] = config.isSecret ? '[REDACTED]' : value;
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings,
    validated,
  };
}

/**
 * Portfolio-specific environment schema
 */
export const portfolioEnvSchema: EnvVarConfig[] = [
  {
    name: 'NEXT_PUBLIC_ENVIRONMENT',
    required: false,
    type: 'string',
    default: 'development',
    validate: (v) => ['development', 'staging', 'production'].includes(v),
    errorMessage: 'NEXT_PUBLIC_ENVIRONMENT must be development, staging, or production',
  },
  {
    name: 'NEXT_PUBLIC_API_URL',
    required: false,
    type: 'url',
  },
  {
    name: 'NEXT_PUBLIC_DEBUG',
    required: false,
    type: 'boolean',
    default: 'false',
  },
  {
    name: 'NEXT_PUBLIC_PERFORMANCE_MONITORING',
    required: false,
    type: 'boolean',
    default: 'false',
  },
  {
    name: 'NEXT_PUBLIC_ERROR_TRACKING',
    required: false,
    type: 'boolean',
    default: 'false',
  },
];

/**
 * History app environment schema
 */
export const historyEnvSchema: EnvVarConfig[] = [
  {
    name: 'GROQ_API_KEY',
    required: false,
    isSecret: true,
    serverOnly: true,
    errorMessage: 'GROQ_API_KEY should be set for AI features',
  },
  // This check ensures NEXT_PUBLIC_GROQ_API_KEY is NOT used
  {
    name: 'NEXT_PUBLIC_GROQ_API_KEY',
    required: false,
    isSecret: true,
    serverOnly: true, // This will flag it as an error if set
  },
];

/**
 * Validates environment and throws if critical errors exist
 */
export function validateEnvOrThrow(schema: EnvVarConfig[]): void {
  const result = validateEnv(schema);

  if (!result.valid) {
    const errorMessage = [
      'Environment validation failed:',
      ...result.errors.map((e) => `  - ${e}`),
    ].join('\n');

    throw new Error(errorMessage);
  }

  if (result.warnings.length > 0) {
    console.warn('Environment warnings:', result.warnings);
  }
}

/**
 * Get a validated environment value with type safety
 */
export function getEnv(name: string, defaultValue?: string): string {
  const value = process.env[name];
  if (value === undefined && defaultValue === undefined) {
    throw new Error(`Environment variable ${name} is not set`);
  }
  return value ?? defaultValue!;
}

/**
 * Get a boolean environment value
 */
export function getEnvBoolean(name: string, defaultValue = false): boolean {
  const value = process.env[name];
  if (value === undefined) return defaultValue;
  return value.toLowerCase() === 'true' || value === '1';
}

/**
 * Get a numeric environment value
 */
export function getEnvNumber(name: string, defaultValue?: number): number {
  const value = process.env[name];
  if (value === undefined) {
    if (defaultValue === undefined) {
      throw new Error(`Environment variable ${name} is not set`);
    }
    return defaultValue;
  }
  const parsed = Number(value);
  if (isNaN(parsed)) {
    throw new Error(`Environment variable ${name} is not a valid number`);
  }
  return parsed;
}
