import type { NextApiRequest, NextApiResponse } from 'next';
import { getEnvironment } from '../../src/utils/environment';

interface PerformanceMetric {
  name: string;
  value: number;
  timestamp: number;
  url: string;
  userAgent: string;
  [key: string]: unknown;
}

interface PerformanceResponse {
  success: boolean;
  message?: string;
}

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<PerformanceResponse>
) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({
      success: false,
      message: 'Method not allowed',
    });
  }

  // Only enable in staging environment
  if (getEnvironment() !== 'staging') {
    return res.status(404).json({
      success: false,
      message: 'Performance monitoring not available in this environment',
    });
  }

  try {
    const metric: PerformanceMetric = req.body;

    // Validate required fields
    if (!metric.name || typeof metric.value !== 'number') {
      return res.status(400).json({
        success: false,
        message: 'Invalid metric data',
      });
    }

    // Log performance metric (in production, this would go to a monitoring service)
    console.log('[Performance Metric]', {
      name: metric.name,
      value: metric.value,
      timestamp: new Date(metric.timestamp).toISOString(),
      url: metric.url,
      userAgent: metric.userAgent?.substring(0, 100), // Truncate for logging
      ...Object.fromEntries(
        Object.entries(metric).filter(([key]) => 
          !['name', 'value', 'timestamp', 'url', 'userAgent'].includes(key)
        )
      ),
    });

    res.status(200).json({
      success: true,
    });

  } catch {
    res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
}