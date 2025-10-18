import type { NextApiRequest, NextApiResponse } from 'next';
import { getFeatureFlags, type FeatureFlags } from '../../../utils/featureFlags';

interface FeatureFlagsResponse {
  success: boolean;
  flags?: FeatureFlags;
  message?: string;
}

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<FeatureFlagsResponse>
) {
  // Only enable in staging environment
  if (process.env.NEXT_PUBLIC_ENVIRONMENT !== 'staging') {
    return res.status(404).json({
      success: false,
      message: 'Feature flags API not available in this environment',
    });
  }

  if (req.method === 'GET') {
    // Return current feature flags
    try {
      const flags = getFeatureFlags();
      
      res.status(200).json({
        success: true,
        flags,
      });
    } catch (error) {
      console.error('Failed to get feature flags:', error);
      
      res.status(500).json({
        success: false,
        message: 'Internal server error',
      });
    }
  } else {
    res.status(405).json({
      success: false,
      message: 'Method not allowed',
    });
  }
}