import type { NextApiRequest, NextApiResponse } from 'next';
import { getEnvironment } from '../../src/utils/environment';

/**
 * Comprehensive Health Check System
 *
 * Provides detailed health status for monitoring and alerting.
 * Supports different levels of health checks:
 * - shallow (default): Quick check that service is running
 * - deep (?deep=true): Full check including memory analysis
 */

interface HealthCheck {
  name: string;
  status: 'healthy' | 'degraded' | 'unhealthy';
  latencyMs?: number;
  message?: string;
  lastChecked: string;
}

interface HealthCheckResponse {
  status: 'healthy' | 'degraded' | 'unhealthy';
  timestamp: string;
  environment: string;
  version: string;
  uptime: number;
  checks: HealthCheck[];
  metadata: {
    nodeVersion: string;
    platform: string;
    memoryUsage: {
      heapUsedMB: number;
      heapTotalMB: number;
      rssMB: number;
      percentUsed: number;
    };
  };
}

// Track server start time for more accurate uptime
const serverStartTime = Date.now();

/**
 * Check memory usage health
 */
function checkMemory(): HealthCheck {
  const timestamp = new Date().toISOString();
  const memUsage = process.memoryUsage();
  const heapUsedPercent = (memUsage.heapUsed / memUsage.heapTotal) * 100;

  let status: HealthCheck['status'] = 'healthy';
  let message: string | undefined;

  if (heapUsedPercent > 90) {
    status = 'unhealthy';
    message = `Critical memory usage: ${heapUsedPercent.toFixed(1)}%`;
  } else if (heapUsedPercent > 75) {
    status = 'degraded';
    message = `Elevated memory usage: ${heapUsedPercent.toFixed(1)}%`;
  }

  return {
    name: 'memory',
    status,
    message,
    lastChecked: timestamp,
  };
}

/**
 * Check environment configuration
 */
function checkEnvironment(): HealthCheck {
  const timestamp = new Date().toISOString();
  const env = getEnvironment();

  // Warn if running in production without proper config
  if (env === 'production') {
    const hasMonitoring = process.env.NEXT_PUBLIC_PERFORMANCE_MONITORING === 'true';
    const hasErrorTracking = process.env.NEXT_PUBLIC_ERROR_TRACKING === 'true';

    if (!hasMonitoring || !hasErrorTracking) {
      return {
        name: 'environment',
        status: 'degraded',
        message: 'Production environment missing recommended monitoring config',
        lastChecked: timestamp,
      };
    }
  }

  return {
    name: 'environment',
    status: 'healthy',
    lastChecked: timestamp,
  };
}

/**
 * Self-check (API responsiveness)
 */
function checkSelf(): HealthCheck {
  return {
    name: 'api',
    status: 'healthy',
    lastChecked: new Date().toISOString(),
  };
}

/**
 * Check if critical features are available
 */
function checkFeatures(): HealthCheck {
  const timestamp = new Date().toISOString();

  // Check for any feature flags that might indicate degraded service
  const debugMode = process.env.NEXT_PUBLIC_DEBUG === 'true';
  const isProduction = getEnvironment() === 'production';

  if (debugMode && isProduction) {
    return {
      name: 'features',
      status: 'degraded',
      message: 'Debug mode enabled in production',
      lastChecked: timestamp,
    };
  }

  return {
    name: 'features',
    status: 'healthy',
    lastChecked: timestamp,
  };
}

/**
 * Aggregate overall status from individual checks
 */
function aggregateStatus(checks: HealthCheck[]): 'healthy' | 'degraded' | 'unhealthy' {
  if (checks.some((c) => c.status === 'unhealthy')) {
    return 'unhealthy';
  }
  if (checks.some((c) => c.status === 'degraded')) {
    return 'degraded';
  }
  return 'healthy';
}

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<HealthCheckResponse | { error: string }>
) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', ['GET']);
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Determine check depth
    const deep = req.query.deep === 'true';

    // Run health checks
    const checks: HealthCheck[] = [
      checkSelf(),
      checkMemory(),
    ];

    // Add more checks for deep health check
    if (deep) {
      checks.push(checkEnvironment());
      checks.push(checkFeatures());
    }

    const status = aggregateStatus(checks);

    // Get memory stats
    const memUsage = process.memoryUsage();
    const heapUsedPercent = (memUsage.heapUsed / memUsage.heapTotal) * 100;

    const healthResponse: HealthCheckResponse = {
      status,
      timestamp: new Date().toISOString(),
      environment: getEnvironment(),
      version: process.env.NEXT_PUBLIC_BUILD_ID || process.env.npm_package_version || '0.1.0',
      uptime: Math.floor((Date.now() - serverStartTime) / 1000),
      checks,
      metadata: {
        nodeVersion: process.version,
        platform: process.platform,
        memoryUsage: {
          heapUsedMB: Math.round(memUsage.heapUsed / 1024 / 1024),
          heapTotalMB: Math.round(memUsage.heapTotal / 1024 / 1024),
          rssMB: Math.round(memUsage.rss / 1024 / 1024),
          percentUsed: Math.round(heapUsedPercent),
        },
      },
    };

    // Set appropriate cache headers (don't cache health checks)
    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');

    // Set appropriate status code based on health
    const statusCode = status === 'unhealthy' ? 503 : 200;

    res.status(statusCode).json(healthResponse);
  } catch {
    res.status(503).json({
      status: 'unhealthy',
      timestamp: new Date().toISOString(),
      environment: getEnvironment(),
      version: '0.1.0',
      uptime: Math.floor((Date.now() - serverStartTime) / 1000),
      checks: [{
        name: 'self',
        status: 'unhealthy',
        message: 'Health check threw an exception',
        lastChecked: new Date().toISOString(),
      }],
      metadata: {
        nodeVersion: process.version,
        platform: process.platform,
        memoryUsage: {
          heapUsedMB: 0,
          heapTotalMB: 0,
          rssMB: 0,
          percentUsed: 0,
        },
      },
    });
  }
}