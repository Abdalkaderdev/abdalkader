/**
 * Staging Environment Banner
 * Displays a prominent banner to indicate staging environment
 */

'use client';

import React from 'react';
import { isStagingEnvironment } from '../config/staging';

export default function StagingBanner() {
  if (!isStagingEnvironment()) {
    return null;
  }

  return (
    <div className="fixed top-0 left-0 right-0 z-50 bg-purple-600 text-white text-center py-2 text-sm font-medium">
      <div className="flex items-center justify-center gap-2">
        <span>🚧</span>
        <span>STAGING ENVIRONMENT - dev.abdalkader.dev</span>
        <span>🚧</span>
      </div>
      <div className="text-xs opacity-75 mt-1">
        This is a development environment for testing purposes
      </div>
    </div>
  );
}