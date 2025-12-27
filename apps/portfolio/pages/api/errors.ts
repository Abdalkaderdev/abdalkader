import type { NextApiRequest, NextApiResponse } from 'next';
import { getEnvironment } from '../../src/utils/environment';

interface ErrorReport {
  message: string;
  stack?: string;
  url: string;
  userAgent: string;
  timestamp: number;
  userId?: string;
  sessionId: string;
  buildId?: string;
  environment: string;
  additionalContext?: Record<string, unknown>;
}

interface ErrorResponse {
  success: boolean;
  message?: string;
  errorId?: string;
}

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<ErrorResponse>
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
      message: 'Error tracking not available in this environment',
    });
  }

  try {
    const errorReport: ErrorReport = req.body;

    // Validate required fields
    if (!errorReport.message || !errorReport.sessionId) {
      return res.status(400).json({
        success: false,
        message: 'Invalid error report data',
      });
    }

    // Generate unique error ID
    const errorId = `err_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    // Enhanced error logging for staging
    const logData = {
      errorId,
      message: errorReport.message,
      stack: errorReport.stack,
      url: errorReport.url,
      timestamp: new Date(errorReport.timestamp).toISOString(),
      sessionId: errorReport.sessionId,
      buildId: errorReport.buildId,
      environment: errorReport.environment,
      userAgent: errorReport.userAgent?.substring(0, 200), // Truncate for logging
      additionalContext: errorReport.additionalContext,
    };

    // Log error with structured format
    console.error('[Error Report]', JSON.stringify(logData, null, 2));

    res.status(200).json({
      success: true,
      errorId,
    });

  } catch {
    res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
}