import React, { useState, useEffect } from 'react';
import { getFeatureFlags, type FeatureFlags } from '../../utils/featureFlags';
import { performanceMonitor } from '../../utils/performanceMonitoring';
import { errorTracker } from '../../utils/errorTracking';
import { getEnvironment } from '../../src/utils/environment';
import styles from './StagingDashboard.module.scss';

interface StagingDashboardProps {
  isVisible: boolean;
  onToggle: () => void;
}

interface Breadcrumb {
  message: string;
  category: string;
  timestamp: number;
  data?: Record<string, unknown>;
}

export default function StagingDashboard({ isVisible, onToggle }: StagingDashboardProps) {
  const [featureFlags, setFeatureFlags] = useState<FeatureFlags | null>(null);
  const [performanceMetrics, setPerformanceMetrics] = useState<Record<string, number>>({});
  const [breadcrumbs, setBreadcrumbs] = useState<Breadcrumb[]>([]);
  const [activeTab, setActiveTab] = useState<'flags' | 'performance' | 'errors'>('flags');

  useEffect(() => {
    if (isVisible) {
      loadDashboardData();
    }
  }, [isVisible]);

  const loadDashboardData = () => {
    // Load feature flags
    setFeatureFlags(getFeatureFlags());
    
    // Load performance metrics
    setPerformanceMetrics(performanceMonitor.getPerformanceSummary());
    
    // Load error breadcrumbs
    setBreadcrumbs(errorTracker.getBreadcrumbs());
  };

  const testError = () => {
    errorTracker.captureException(new Error('Test error from staging dashboard'), {
      source: 'staging-dashboard',
      type: 'test-error',
    });
  };

  const testPerformanceMetric = () => {
    performanceMonitor.trackCustomMetric('test-metric', Math.random() * 1000, {
      source: 'staging-dashboard',
    });
    loadDashboardData();
  };

  if (!isVisible) {
    return (
      <button 
        className={styles.toggleButton}
        onClick={onToggle}
        title="Open Staging Dashboard"
      >
        🔧
      </button>
    );
  }

  return (
    <div className={styles.dashboard}>
      <div className={styles.header}>
        <h3>🚀 Staging Dashboard</h3>
        <button className={styles.closeButton} onClick={onToggle}>×</button>
      </div>

      <div className={styles.tabs}>
        <button 
          className={`${styles.tab} ${activeTab === 'flags' ? styles.active : ''}`}
          onClick={() => setActiveTab('flags')}
        >
          Feature Flags
        </button>
        <button 
          className={`${styles.tab} ${activeTab === 'performance' ? styles.active : ''}`}
          onClick={() => setActiveTab('performance')}
        >
          Performance
        </button>
        <button 
          className={`${styles.tab} ${activeTab === 'errors' ? styles.active : ''}`}
          onClick={() => setActiveTab('errors')}
        >
          Error Tracking
        </button>
      </div>

      <div className={styles.content}>
        {activeTab === 'flags' && (
          <div className={styles.section}>
            <h4>Active Feature Flags</h4>
            {featureFlags && (
              <div className={styles.flagsList}>
                {Object.entries(featureFlags).map(([flag, enabled]) => (
                  <div key={flag} className={styles.flagItem}>
                    <span className={`${styles.flagStatus} ${enabled ? styles.enabled : styles.disabled}`}>
                      {enabled ? '✅' : '❌'}
                    </span>
                    <span className={styles.flagName}>{flag}</span>
                  </div>
                ))}
              </div>
            )}
            <div className={styles.actions}>
              <button onClick={loadDashboardData} className={styles.refreshButton}>
                Refresh Flags
              </button>
            </div>
          </div>
        )}

        {activeTab === 'performance' && (
          <div className={styles.section}>
            <h4>Performance Metrics</h4>
            <div className={styles.metricsList}>
              {Object.entries(performanceMetrics).map(([metric, value]) => (
                <div key={metric} className={styles.metricItem}>
                  <span className={styles.metricName}>{metric}</span>
                  <span className={styles.metricValue}>
                    {typeof value === 'number' ? value.toFixed(2) : value}
                  </span>
                </div>
              ))}
            </div>
            <div className={styles.actions}>
              <button onClick={testPerformanceMetric} className={styles.testButton}>
                Test Performance Metric
              </button>
              <button onClick={loadDashboardData} className={styles.refreshButton}>
                Refresh Metrics
              </button>
            </div>
          </div>
        )}

        {activeTab === 'errors' && (
          <div className={styles.section}>
            <h4>Error Tracking</h4>
            <div className={styles.breadcrumbsList}>
              <h5>Recent Breadcrumbs</h5>
              {breadcrumbs.length > 0 ? (
                breadcrumbs.slice(-10).map((breadcrumb, index) => (
                  <div key={index} className={styles.breadcrumbItem}>
                    <span className={styles.breadcrumbTime}>
                      {new Date(breadcrumb.timestamp).toLocaleTimeString()}
                    </span>
                    <span className={styles.breadcrumbCategory}>
                      [{breadcrumb.category}]
                    </span>
                    <span className={styles.breadcrumbMessage}>
                      {breadcrumb.message}
                    </span>
                  </div>
                ))
              ) : (
                <p className={styles.noBreadcrumbs}>No breadcrumbs recorded</p>
              )}
            </div>
            <div className={styles.actions}>
              <button onClick={testError} className={styles.testButton}>
                Test Error Tracking
              </button>
              <button onClick={loadDashboardData} className={styles.refreshButton}>
                Refresh Data
              </button>
            </div>
          </div>
        )}
      </div>

      <div className={styles.footer}>
        <div className={styles.environmentInfo}>
          <span>Environment: {getEnvironment()}</span>
          <span>Session: {errorTracker.sessionId?.substring(0, 8)}...</span>
        </div>
      </div>
    </div>
  );
}