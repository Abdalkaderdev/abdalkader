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

    // In a real application, you would:
    // 1. Send to monitoring service (e.g., DataDog, New Relic, custom analytics)
    // 2. Store in database for analysis
    // 3. Trigger alerts for performance regressions

    // Example: Send to external monitoring service
    // await sendToMonitoringService(metric);

    res.status(200).json({
      success: true,
    });

  } catch (error) {
    console.error('Failed to process performance metric:', error);
    
    res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
}

// Example function to send metrics to external service
// eslint-disable-next-line @typescript-eslint/no-unused-vars
async function sendToMonitoringService(_metric: PerformanceMetric): Promise<void> {
  // This is where you would integrate with your monitoring service
  // Examples:
  
  // DataDog
  // await datadogClient.increment('portfolio.performance', 1, [`metric:${metric.name}`]);
  
  // New Relic
  // newrelic.recordMetric(`Custom/Performance/${metric.name}`, metric.value);
  
  // Custom Analytics
  // await fetch('https://analytics.yourdomain.com/metrics', {
  //   method: 'POST',
  //   headers: { 'Content-Type': 'application/json' },
  //   body: JSON.stringify(metric)
  // });
}