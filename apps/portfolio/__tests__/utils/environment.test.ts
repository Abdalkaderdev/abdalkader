/**
 * Tests for environment utility functions
 */
import {
  getEnvironment,
  isDevelopment,
  isStaging,
  isProduction,
  getEnvironmentConfig,
  type Environment,
} from '@/src/utils/environment';

describe('environment utilities', () => {
  const originalEnv = process.env;

  beforeEach(() => {
    // Reset process.env before each test
    jest.resetModules();
    process.env = { ...originalEnv };
    // Clear all environment variables that affect the result
    delete process.env.NEXT_PUBLIC_ENVIRONMENT;
    delete process.env.VERCEL_ENV;
  });

  afterAll(() => {
    process.env = originalEnv;
  });

  describe('getEnvironment', () => {
    it('returns development when NEXT_PUBLIC_ENVIRONMENT is development', () => {
      process.env.NEXT_PUBLIC_ENVIRONMENT = 'development';
      // Re-import to get fresh values
      const { getEnvironment: getEnv } = require('@/src/utils/environment');
      expect(getEnv()).toBe('development');
    });

    it('returns staging when NEXT_PUBLIC_ENVIRONMENT is staging', () => {
      process.env.NEXT_PUBLIC_ENVIRONMENT = 'staging';
      const { getEnvironment: getEnv } = require('@/src/utils/environment');
      expect(getEnv()).toBe('staging');
    });

    it('returns production when NEXT_PUBLIC_ENVIRONMENT is production', () => {
      process.env.NEXT_PUBLIC_ENVIRONMENT = 'production';
      const { getEnvironment: getEnv } = require('@/src/utils/environment');
      expect(getEnv()).toBe('production');
    });

    it('returns staging when VERCEL_ENV is preview', () => {
      process.env.VERCEL_ENV = 'preview';
      const { getEnvironment: getEnv } = require('@/src/utils/environment');
      expect(getEnv()).toBe('staging');
    });

    it('returns production when VERCEL_ENV is production', () => {
      process.env.VERCEL_ENV = 'production';
      const { getEnvironment: getEnv } = require('@/src/utils/environment');
      expect(getEnv()).toBe('production');
    });

    it('prioritizes NEXT_PUBLIC_ENVIRONMENT over VERCEL_ENV', () => {
      process.env.NEXT_PUBLIC_ENVIRONMENT = 'staging';
      process.env.VERCEL_ENV = 'production';
      const { getEnvironment: getEnv } = require('@/src/utils/environment');
      expect(getEnv()).toBe('staging');
    });
  });

  describe('isDevelopment', () => {
    it('returns true when environment is development', () => {
      process.env.NEXT_PUBLIC_ENVIRONMENT = 'development';
      const { isDevelopment: isDev } = require('@/src/utils/environment');
      expect(isDev()).toBe(true);
    });

    it('returns false when environment is not development', () => {
      process.env.NEXT_PUBLIC_ENVIRONMENT = 'production';
      const { isDevelopment: isDev } = require('@/src/utils/environment');
      expect(isDev()).toBe(false);
    });
  });

  describe('isStaging', () => {
    it('returns true when environment is staging', () => {
      process.env.NEXT_PUBLIC_ENVIRONMENT = 'staging';
      const { isStaging: isStg } = require('@/src/utils/environment');
      expect(isStg()).toBe(true);
    });

    it('returns false when environment is not staging', () => {
      process.env.NEXT_PUBLIC_ENVIRONMENT = 'production';
      const { isStaging: isStg } = require('@/src/utils/environment');
      expect(isStg()).toBe(false);
    });
  });

  describe('isProduction', () => {
    it('returns true when environment is production', () => {
      process.env.NEXT_PUBLIC_ENVIRONMENT = 'production';
      const { isProduction: isProd } = require('@/src/utils/environment');
      expect(isProd()).toBe(true);
    });

    it('returns false when environment is not production', () => {
      process.env.NEXT_PUBLIC_ENVIRONMENT = 'staging';
      const { isProduction: isProd } = require('@/src/utils/environment');
      expect(isProd()).toBe(false);
    });
  });

  describe('getEnvironmentConfig', () => {
    it('returns correct config for development', () => {
      process.env.NEXT_PUBLIC_ENVIRONMENT = 'development';
      const { getEnvironmentConfig: getConfig } = require('@/src/utils/environment');
      const config = getConfig();

      expect(config.environment).toBe('development');
      expect(config.isDevelopment).toBe(true);
      expect(config.isStaging).toBe(false);
      expect(config.isProduction).toBe(false);
      expect(config.enableDebug).toBe(true);
      expect(config.enableErrorTracking).toBe(false);
    });

    it('returns correct config for staging', () => {
      process.env.NEXT_PUBLIC_ENVIRONMENT = 'staging';
      const { getEnvironmentConfig: getConfig } = require('@/src/utils/environment');
      const config = getConfig();

      expect(config.environment).toBe('staging');
      expect(config.isDevelopment).toBe(false);
      expect(config.isStaging).toBe(true);
      expect(config.isProduction).toBe(false);
      expect(config.enableDebug).toBe(true);
      expect(config.enableFeatureFlags).toBe(true);
      expect(config.enableABTesting).toBe(true);
    });

    it('returns correct config for production', () => {
      process.env.NEXT_PUBLIC_ENVIRONMENT = 'production';
      const { getEnvironmentConfig: getConfig } = require('@/src/utils/environment');
      const config = getConfig();

      expect(config.environment).toBe('production');
      expect(config.isDevelopment).toBe(false);
      expect(config.isStaging).toBe(false);
      expect(config.isProduction).toBe(true);
      expect(config.enableDebug).toBe(false);
      expect(config.enableFeatureFlags).toBe(false);
      expect(config.enableErrorTracking).toBe(true);
    });
  });
});
