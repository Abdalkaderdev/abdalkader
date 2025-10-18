import type { NextApiRequest, NextApiResponse } from 'next';
import { getEnvironment } from '../../src/utils/environment';

interface HealthCheckResponse {
  status: 'healthy' | 'unhealthy';
  timestamp: string;
  environment: string;
  version?: string;
  uptime: number;
  checks: {
    database?: 'healthy' | 'unhealthy';
    external_apis?: 'healthy' | 'unhealthy';
    memory_usage?: number;
    disk_space?: number;
  };
}

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<HealthCheckResponse>
) {
  if (req.method !== 'GET') {
    return res.status(405).json({
      status: 'unhealthy',
      timestamp: new Date().toISOString(),
      environment: getEnvironment(),
      uptime: process.uptime(),
      checks: {},
    });
  }

  try {
    // Basic health checks
    const memoryUsage = process.memoryUsage();
    const memoryUsagePercent = (memoryUsage.heapUsed / memoryUsage.heapTotal) * 100;

    const healthResponse: HealthCheckResponse = {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      environment: getEnvironment(),
      version: process.env.NEXT_PUBLIC_BUILD_ID || '1.0.0',
      uptime: process.uptime(),
      checks: {
        memory_usage: Math.round(memoryUsagePercent),
      },
    };

    // Set appropriate cache headers
    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');

    res.status(200).json(healthResponse);
  } catch (error) {
    console.error('Health check failed:', error);
    
    res.status(503).json({
      status: 'unhealthy',
      timestamp: new Date().toISOString(),
      environment: getEnvironment(),
      uptime: process.uptime(),
      checks: {},
    });
  }
}