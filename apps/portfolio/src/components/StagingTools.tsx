/**
 * Staging Environment Development Tools
 * Provides debugging and monitoring interface for staging environment
 */

'use client';

import React, { useState, useEffect } from 'react';
import { setFeatureFlag, getAllFeatureFlags } from '../lib/feature-flags';
import { getPerformanceDashboard, performanceMonitor } from '../lib/performance-monitor';
import { getErrorDashboard, errorTracker } from '../lib/error-tracker';
import { getABTestingDashboard, abTesting } from '../lib/ab-testing';

interface StagingToolsProps {
  isVisible: boolean;
  onToggle: () => void;
}

export default function StagingTools({ isVisible, onToggle }: StagingToolsProps) {
  const [activeTab, setActiveTab] = useState<'features' | 'performance' | 'errors' | 'ab-testing'>('features');
  const [featureFlags, setFeatureFlags] = useState(getAllFeatureFlags());
  const [isMinimized, setIsMinimized] = useState(false);

  useEffect(() => {
    // Only show in staging environment
    if (process.env.NEXT_PUBLIC_ENVIRONMENT !== 'staging') {
      return;
    }

    // Listen for feature flag changes
    const handleFeatureFlagChange = () => {
      setFeatureFlags(getAllFeatureFlags());
    };

    window.addEventListener('feature-flag-changed', handleFeatureFlagChange);
    
    return () => {
      window.removeEventListener('feature-flag-changed', handleFeatureFlagChange);
    };
  }, []);

  const toggleFeatureFlag = (flag: keyof typeof featureFlags) => {
    const newValue = !featureFlags[flag];
    setFeatureFlag(flag, newValue);
    setFeatureFlags(prev => ({ ...prev, [flag]: newValue }));
  };

  const refreshData = () => {
    getPerformanceDashboard();
    getErrorDashboard();
    getABTestingDashboard();
  };

  if (process.env.NEXT_PUBLIC_ENVIRONMENT !== 'staging') {
    return null;
  }

  return (
    <>
      {/* Toggle Button */}
      <button
        onClick={onToggle}
        className="fixed bottom-4 right-4 z-50 bg-purple-600 hover:bg-purple-700 text-white p-3 rounded-full shadow-lg transition-colors"
        title="Toggle Staging Tools"
      >
        🛠️
      </button>

      {/* Tools Panel */}
      {isVisible && (
        <div className={`fixed top-4 right-4 z-50 bg-white border border-gray-300 rounded-lg shadow-xl ${
          isMinimized ? 'w-80 h-12' : 'w-96 h-96'
        } transition-all duration-300`}>
          {/* Header */}
          <div className="flex items-center justify-between p-3 border-b border-gray-200 bg-gray-50 rounded-t-lg">
            <h3 className="font-semibold text-gray-800">Staging Tools</h3>
            <div className="flex gap-2">
              <button
                onClick={() => setIsMinimized(!isMinimized)}
                className="text-gray-500 hover:text-gray-700"
                title={isMinimized ? 'Expand' : 'Minimize'}
              >
                {isMinimized ? '⬆️' : '⬇️'}
              </button>
              <button
                onClick={onToggle}
                className="text-gray-500 hover:text-gray-700"
                title="Close"
              >
                ✕
              </button>
            </div>
          </div>

          {!isMinimized && (
            <div className="p-3">
              {/* Tabs */}
              <div className="flex gap-1 mb-4 border-b border-gray-200">
                {[
                  { id: 'features', label: '🚩 Features', icon: '🚩' },
                  { id: 'performance', label: '📊 Perf', icon: '📊' },
                  { id: 'errors', label: '🚨 Errors', icon: '🚨' },
                  { id: 'ab-testing', label: '🧪 A/B', icon: '🧪' },
                ].map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as 'features' | 'performance' | 'errors' | 'ab-testing')}
                    className={`px-2 py-1 text-xs rounded-t ${
                      activeTab === tab.id
                        ? 'bg-purple-100 text-purple-700 border-b-2 border-purple-500'
                        : 'text-gray-600 hover:text-gray-800'
                    }`}
                  >
                    {tab.icon}
                  </button>
                ))}
              </div>

              {/* Tab Content */}
              <div className="h-64 overflow-y-auto">
                {activeTab === 'features' && (
                  <div className="space-y-2">
                    <h4 className="font-medium text-gray-800 mb-2">Feature Flags</h4>
                    {Object.entries(featureFlags).map(([flag, value]) => (
                      <label key={flag} className="flex items-center gap-2 text-sm">
                        <input
                          type="checkbox"
                          checked={value as boolean}
                          onChange={() => toggleFeatureFlag(flag as keyof typeof featureFlags)}
                          className="rounded"
                        />
                        <span className={value ? 'text-green-700' : 'text-gray-500'}>
                          {flag.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                        </span>
                      </label>
                    ))}
                  </div>
                )}

                {activeTab === 'performance' && (
                  <div className="space-y-2">
                    <h4 className="font-medium text-gray-800 mb-2">Performance</h4>
                    <button
                      onClick={() => getPerformanceDashboard()}
                      className="w-full px-3 py-1 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded text-sm"
                    >
                      📊 View Dashboard
                    </button>
                    <div className="text-xs text-gray-600">
                      <p>Metrics: {performanceMonitor.getMetrics().length}</p>
                      <p>Avg Load: {performanceMonitor.getAverageMetric('page-load-time').toFixed(0)}ms</p>
                    </div>
                  </div>
                )}

                {activeTab === 'errors' && (
                  <div className="space-y-2">
                    <h4 className="font-medium text-gray-800 mb-2">Error Tracking</h4>
                    <button
                      onClick={() => getErrorDashboard()}
                      className="w-full px-3 py-1 bg-red-100 hover:bg-red-200 text-red-700 rounded text-sm"
                    >
                      🚨 View Dashboard
                    </button>
                    <div className="text-xs text-gray-600">
                      <p>Total Errors: {errorTracker.getErrors().length}</p>
                      <p>Recent: {errorTracker.getErrorStats().recent.length}</p>
                    </div>
                  </div>
                )}

                {activeTab === 'ab-testing' && (
                  <div className="space-y-2">
                    <h4 className="font-medium text-gray-800 mb-2">A/B Testing</h4>
                    <button
                      onClick={() => getABTestingDashboard()}
                      className="w-full px-3 py-1 bg-green-100 hover:bg-green-200 text-green-700 rounded text-sm"
                    >
                      🧪 View Dashboard
                    </button>
                    <div className="text-xs text-gray-600">
                      <p>Experiments: {abTesting.getActiveExperiments().length}</p>
                      <p>Results: {abTesting.getResults().length}</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="mt-4 pt-3 border-t border-gray-200">
                <button
                  onClick={refreshData}
                  className="w-full px-3 py-1 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded text-sm"
                >
                  🔄 Refresh All Data
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </>
  );
}