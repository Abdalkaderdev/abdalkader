'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Activity, 
  Users, 
  Eye, 
  Clock, 
  TrendingUp, 
  TrendingDown,
  Globe,
  BarChart3,
  PieChart,
  RefreshCw
} from 'lucide-react';
import { InteractiveCard } from '@/components/interactions/InteractiveCard';
import { InteractiveButton } from '@/components/interactions/InteractiveButton';
import { useAnalytics } from '@/lib/analytics';
import { ECOSYSTEM_DOMAINS } from '@/lib/ecosystem';
import { useAccessibility } from '@/hooks/useAccessibility';

interface AnalyticsDashboardProps {
  className?: string;
  timeRange?: '1d' | '7d' | '30d' | '90d';
  domains?: string[];
  metrics?: string[];
  realTime?: boolean;
}

interface DashboardData {
  overview: {
    totalVisitors: number;
    totalPageViews: number;
    averageBounceRate: number;
    averageSessionDuration: number;
  };
  topPages: Array<{
    path: string;
    domain: string;
    views: number;
    uniqueVisitors: number;
    bounceRate: number;
  }>;
  topDomains: Array<{
    domain: string;
    visitors: number;
    pageViews: number;
    bounceRate: number;
    growth: number;
  }>;
  realTime: {
    activeUsers: number;
    currentPage: string;
    lastActivity: string;
  };
  performance: {
    averageFCP: number;
    averageLCP: number;
    averageFID: number;
    averageCLS: number;
  };
}

export const AnalyticsDashboard: React.FC<AnalyticsDashboardProps> = ({
  className = '',
  timeRange = '7d',
  domains = ['all'],
  metrics = ['visitors', 'pageViews', 'bounceRate'],
  realTime = true,
}) => {
  const [data, setData] = useState<DashboardData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());
  const [selectedMetric, setSelectedMetric] = useState<string>('visitors');
  const [viewMode, setViewMode] = useState<'overview' | 'detailed' | 'real-time'>('overview');

  const { getEcosystemAnalytics, trackInteraction } = useAnalytics();
  const { 
    isMobile, 
    getResponsiveClasses,
    getTouchTargetSize,
    announceToScreenReader
  } = useAccessibility();

  // Load analytics data
  const loadData = async () => {
    setIsLoading(true);
    try {
      const analyticsData = await getEcosystemAnalytics();
      
      // Transform data to match our interface
      const transformedData: DashboardData = {
        overview: {
          totalVisitors: analyticsData.totalVisitors,
          totalPageViews: analyticsData.totalPageViews,
          averageBounceRate: analyticsData.averageBounceRate,
          averageSessionDuration: 180, // Mock data
        },
        topPages: analyticsData.topPages,
        topDomains: analyticsData.topDomains.map(domain => ({
          ...domain,
          growth: (domain as any).growth || 0
        })),
        realTime: {
          activeUsers: Math.floor(Math.random() * 50) + 10, // Mock real-time data
          currentPage: window.location.pathname,
          lastActivity: new Date().toLocaleTimeString(),
        },
        performance: analyticsData.performance,
      };

      setData(transformedData);
      setLastUpdated(new Date());
      
      trackInteraction('analytics_loaded', 'dashboard', {
        timeRange,
        domains: domains.length,
        metrics: metrics.length,
      });
    } catch (error) {
      console.error('Failed to load analytics data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Load data on mount and when dependencies change
  useEffect(() => {
    loadData();
  }, [timeRange, domains, metrics]);

  // Real-time updates
  useEffect(() => {
    if (!realTime) return;

    const interval = setInterval(() => {
      if (data) {
        setData(prev => prev ? {
          ...prev,
          realTime: {
            ...prev.realTime,
            activeUsers: Math.floor(Math.random() * 50) + 10,
            lastActivity: new Date().toLocaleTimeString(),
          }
        } : null);
      }
    }, 30000); // Update every 30 seconds

    return () => clearInterval(interval);
  }, [realTime, data]);

  // Get metric color
  const getMetricColor = (metric: string) => {
    switch (metric) {
      case 'visitors': return 'text-blue-400';
      case 'pageViews': return 'text-green-400';
      case 'bounceRate': return 'text-orange-400';
      case 'sessionDuration': return 'text-purple-400';
      default: return 'text-gray-400';
    }
  };

  // Get growth indicator
  const getGrowthIndicator = (growth: number) => {
    if (growth > 0) {
      return { icon: TrendingUp, color: 'text-green-400', text: `+${growth}%` };
    } else if (growth < 0) {
      return { icon: TrendingDown, color: 'text-red-400', text: `${growth}%` };
    } else {
      return { icon: TrendingUp, color: 'text-gray-400', text: '0%' };
    }
  };

  // Get responsive classes
  const getGridClasses = () => {
    return getResponsiveClasses({
      mobile: 'grid-cols-1',
      tablet: 'grid-cols-2',
      desktop: 'grid-cols-4',
    });
  };

  if (isLoading) {
    return (
      <div className={`space-y-6 ${className}`}>
        <div className="text-center py-12">
          <RefreshCw className="w-8 h-8 text-orange-400 animate-spin mx-auto mb-4" />
          <p className="text-gray-400">Loading analytics data...</p>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className={`space-y-6 ${className}`}>
        <div className="text-center py-12">
          <Activity className="w-8 h-8 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-400">No analytics data available</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="portfolio-hero-text text-white">Analytics Dashboard</h2>
          <p className="portfolio-base-text text-gray-300">
            Real-time insights across the ecosystem
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <InteractiveButton
            onClick={loadData}
            variant="ghost"
            size="sm"
            className={`${getTouchTargetSize()}`}
            aria-label="Refresh data"
          >
            <RefreshCw className="w-4 h-4" />
          </InteractiveButton>
          
          <div className="text-right">
            <p className="portfolio-small-text text-gray-400">Last updated</p>
            <p className="portfolio-small-text text-orange-400">
              {lastUpdated.toLocaleTimeString()}
            </p>
          </div>
        </div>
      </div>

      {/* View Mode Toggle */}
      <div className="flex gap-2">
        {(['overview', 'detailed', 'real-time'] as const).map((mode) => (
          <InteractiveButton
            key={mode}
            onClick={() => setViewMode(mode)}
            variant={viewMode === mode ? 'primary' : 'ghost'}
            size="sm"
            className="capitalize"
          >
            {mode.replace('-', ' ')}
          </InteractiveButton>
        ))}
      </div>

      {/* Overview Cards */}
      {viewMode === 'overview' && (
        <div className={`grid ${getGridClasses()} gap-4`}>
          <InteractiveCard variant="ai">
            <div className="flex items-center gap-3 mb-3">
              <Users className="w-6 h-6 text-blue-400" />
              <span className="portfolio-small-text text-blue-400">Total Visitors</span>
            </div>
            <p className="portfolio-hero-text text-white">
              {data.overview.totalVisitors.toLocaleString()}
            </p>
            <div className="flex items-center gap-2 mt-2">
              <TrendingUp className="w-4 h-4 text-green-400" />
              <span className="portfolio-small-text text-green-400">+12.5%</span>
            </div>
          </InteractiveCard>

          <InteractiveCard variant="ai">
            <div className="flex items-center gap-3 mb-3">
              <Eye className="w-6 h-6 text-green-400" />
              <span className="portfolio-small-text text-green-400">Page Views</span>
            </div>
            <p className="portfolio-hero-text text-white">
              {data.overview.totalPageViews.toLocaleString()}
            </p>
            <div className="flex items-center gap-2 mt-2">
              <TrendingUp className="w-4 h-4 text-green-400" />
              <span className="portfolio-small-text text-green-400">+8.3%</span>
            </div>
          </InteractiveCard>

          <InteractiveCard variant="ai">
            <div className="flex items-center gap-3 mb-3">
              <Activity className="w-6 h-6 text-orange-400" />
              <span className="portfolio-small-text text-orange-400">Bounce Rate</span>
            </div>
            <p className="portfolio-hero-text text-white">
              {(data.overview.averageBounceRate * 100).toFixed(1)}%
            </p>
            <div className="flex items-center gap-2 mt-2">
              <TrendingDown className="w-4 h-4 text-green-400" />
              <span className="portfolio-small-text text-green-400">-2.1%</span>
            </div>
          </InteractiveCard>

          <InteractiveCard variant="ai">
            <div className="flex items-center gap-3 mb-3">
              <Clock className="w-6 h-6 text-purple-400" />
              <span className="portfolio-small-text text-purple-400">Avg. Session</span>
            </div>
            <p className="portfolio-hero-text text-white">
              {Math.floor(data.overview.averageSessionDuration / 60)}m
            </p>
            <div className="flex items-center gap-2 mt-2">
              <TrendingUp className="w-4 h-4 text-green-400" />
              <span className="portfolio-small-text text-green-400">+5.2%</span>
            </div>
          </InteractiveCard>
        </div>
      )}

      {/* Real-time Data */}
      {viewMode === 'real-time' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <InteractiveCard variant="ai">
            <h3 className="portfolio-medium-text text-white mb-4">Live Activity</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="portfolio-small-text text-gray-300">Active Users</span>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                  <span className="portfolio-medium-text text-white">{data.realTime.activeUsers}</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="portfolio-small-text text-gray-300">Current Page</span>
                <span className="portfolio-small-text text-orange-400">{data.realTime.currentPage}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="portfolio-small-text text-gray-300">Last Activity</span>
                <span className="portfolio-small-text text-gray-400">{data.realTime.lastActivity}</span>
              </div>
            </div>
          </InteractiveCard>

          <InteractiveCard variant="ai">
            <h3 className="portfolio-medium-text text-white mb-4">Performance</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="portfolio-small-text text-gray-300">FCP</span>
                <span className="portfolio-small-text text-white">{data.performance.averageFCP.toFixed(0)}ms</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="portfolio-small-text text-gray-300">LCP</span>
                <span className="portfolio-small-text text-white">{data.performance.averageLCP.toFixed(0)}ms</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="portfolio-small-text text-gray-300">FID</span>
                <span className="portfolio-small-text text-white">{data.performance.averageFID.toFixed(0)}ms</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="portfolio-small-text text-gray-300">CLS</span>
                <span className="portfolio-small-text text-white">{data.performance.averageCLS.toFixed(3)}</span>
              </div>
            </div>
          </InteractiveCard>
        </div>
      )}

      {/* Detailed Analytics */}
      {viewMode === 'detailed' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Top Pages */}
          <InteractiveCard variant="ai">
            <h3 className="portfolio-medium-text text-white mb-4">Top Pages</h3>
            <div className="space-y-3">
              {data.topPages.slice(0, 5).map((page, index) => (
                <motion.div
                  key={page.path}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1, duration: 0.3 }}
                  className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg"
                >
                  <div className="flex-1">
                    <p className="portfolio-small-text text-white">{page.path}</p>
                    <p className="text-xs text-gray-400">{page.domain}</p>
                  </div>
                  <div className="text-right">
                    <p className="portfolio-small-text text-orange-400">{page.views.toLocaleString()}</p>
                    <p className="text-xs text-gray-400">{page.uniqueVisitors} unique</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </InteractiveCard>

          {/* Top Domains */}
          <InteractiveCard variant="ai">
            <h3 className="portfolio-medium-text text-white mb-4">Top Domains</h3>
            <div className="space-y-3">
              {data.topDomains.map((domain, index) => {
                const growthInfo = getGrowthIndicator(domain.growth);
                const GrowthIcon = growthInfo.icon;
                
                return (
                  <motion.div
                    key={domain.domain}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1, duration: 0.3 }}
                    className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-orange-500/20 flex items-center justify-center">
                        <Globe className="w-4 h-4 text-orange-400" />
                      </div>
                      <div>
                        <p className="portfolio-small-text text-white">{domain.domain}</p>
                        <p className="text-xs text-gray-400">{domain.visitors.toLocaleString()} visitors</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="portfolio-small-text text-orange-400">{domain.pageViews.toLocaleString()}</p>
                      <div className="flex items-center gap-1">
                        <GrowthIcon className={`w-3 h-3 ${growthInfo.color}`} />
                        <span className={`text-xs ${growthInfo.color}`}>{growthInfo.text}</span>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </InteractiveCard>
        </div>
      )}
    </div>
  );
};

export default AnalyticsDashboard;