import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FiZap, FiTarget, FiTrendingUp, FiUsers, FiClock, 
  FiEye, FiMousePointer, FiCheckCircle, FiAlertTriangle,
  FiBarChart, FiSettings, FiX
} from 'react-icons/fi';
import { usePerformanceBudget } from '../../hooks/usePerformanceBudget';
import { LIGHTHOUSE_TARGETS } from '../../utils/lighthouseOptimizer';

interface PerformanceDashboardProps {
  showDetails?: boolean;
  className?: string;
}

export default function PerformanceDashboard({ showDetails = false, className = '' }: PerformanceDashboardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'performance' | 'seo' | 'conversion'>('overview');
  const { metrics, warnings, isHealthy } = usePerformanceBudget();

  // Mock data for demonstration
  const [dashboardData, setDashboardData] = useState({
    lighthouse: {
      performance: 95,
      seo: 100,
      accessibility: 100,
      bestPractices: 95,
      pwa: 90
    },
    conversion: {
      demoToContact: 5.2,
      timeOnPage: 145,
      bounceRate: 28,
      pageViews: 3.2,
      ctaClicks: 12,
      formSubmissions: 3
    },
    seo: {
      rankings: {
        'AI developer Jordan': 3,
        'ML engineer portfolio': 5,
        'machine learning consultant Amman': 2,
        'AI solutions Jordan': 4,
        'TensorFlow.js developer': 7
      },
      impressions: 1250,
      clickThroughRate: 5.8,
      averagePosition: 4.2
    },
    competitive: {
      score: 78,
      topKeywords: 3,
      keywordGaps: 5,
      improvements: 2
    }
  });

  const tabs = [
    { id: 'overview', label: 'Overview', icon: <FiBarChart className="w-4 h-4" /> },
    { id: 'performance', label: 'Performance', icon: <FiZap className="w-4 h-4" /> },
    { id: 'seo', label: 'SEO', icon: <FiTrendingUp className="w-4 h-4" /> },
    { id: 'conversion', label: 'Conversion', icon: <FiTarget className="w-4 h-4" /> }
  ];

  const getScoreColor = (score: number, target: number) => {
    if (score >= target) return 'text-green-400';
    if (score >= target * 0.9) return 'text-yellow-400';
    return 'text-red-400';
  };

  const getScoreIcon = (score: number, target: number) => {
    if (score >= target) return <FiCheckCircle className="w-4 h-4" />;
    if (score >= target * 0.9) return <FiAlertTriangle className="w-4 h-4" />;
    return <FiAlertTriangle className="w-4 h-4" />;
  };

  const getStatusColor = (value: number, target: number, reverse = false) => {
    const percentage = (value / target) * 100;
    if (reverse) {
      if (percentage <= 100) return 'text-green-400';
      if (percentage <= 120) return 'text-yellow-400';
      return 'text-red-400';
    } else {
      if (percentage >= 100) return 'text-green-400';
      if (percentage >= 80) return 'text-yellow-400';
      return 'text-red-400';
    }
  };

  if (!showDetails && isHealthy) return null;

  return (
    <div className={`fixed top-4 left-4 z-50 ${className}`}>
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="bg-gray-900 border border-gray-700 rounded-lg shadow-xl max-w-md"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-700">
          <div className="flex items-center gap-2">
            <FiSettings className="w-5 h-5 text-blue-400" />
            <h3 className="text-sm font-semibold text-white" style={{ fontFamily: 'var(--font-pp-medium)' }}>
              Performance Dashboard
            </h3>
          </div>
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-gray-400 hover:text-white transition-colors"
          >
            {isExpanded ? <FiX className="w-4 h-4" /> : <FiBarChart className="w-4 h-4" />}
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-700">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex-1 flex items-center justify-center gap-2 px-3 py-2 text-xs font-medium transition-colors ${
                activeTab === tab.id
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-400 hover:text-white hover:bg-gray-800'
              }`}
            >
              {tab.icon}
              <span style={{ fontFamily: 'var(--font-pp-regular)' }}>
                {tab.label}
              </span>
            </button>
          ))}
        </div>

        {/* Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="p-4"
          >
            {/* Overview Tab */}
            {activeTab === 'overview' && (
              <div className="space-y-4">
                {/* Overall Health Score */}
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-400 mb-1" style={{ fontFamily: 'var(--font-pp-medium)' }}>
                    {isHealthy ? '95' : '78'}
                  </div>
                  <div className="text-xs text-gray-400" style={{ fontFamily: 'var(--font-pp-regular)' }}>
                    Overall Health Score
                  </div>
                </div>

                {/* Quick Stats */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="text-center p-3 bg-gray-800 rounded-lg">
                    <div className="text-lg font-semibold text-white" style={{ fontFamily: 'var(--font-pp-medium)' }}>
                      {dashboardData.lighthouse.performance}
                    </div>
                    <div className="text-xs text-gray-400" style={{ fontFamily: 'var(--font-pp-regular)' }}>
                      Lighthouse
                    </div>
                  </div>
                  <div className="text-center p-3 bg-gray-800 rounded-lg">
                    <div className="text-lg font-semibold text-white" style={{ fontFamily: 'var(--font-pp-medium)' }}>
                      {dashboardData.conversion.demoToContact}%
                    </div>
                    <div className="text-xs text-gray-400" style={{ fontFamily: 'var(--font-pp-regular)' }}>
                      Conversion
                    </div>
                  </div>
                  <div className="text-center p-3 bg-gray-800 rounded-lg">
                    <div className="text-lg font-semibold text-white" style={{ fontFamily: 'var(--font-pp-medium)' }}>
                      {dashboardData.seo.averagePosition.toFixed(1)}
                    </div>
                    <div className="text-xs text-gray-400" style={{ fontFamily: 'var(--font-pp-regular)' }}>
                      Avg Position
                    </div>
                  </div>
                  <div className="text-center p-3 bg-gray-800 rounded-lg">
                    <div className="text-lg font-semibold text-white" style={{ fontFamily: 'var(--font-pp-medium)' }}>
                      {dashboardData.competitive.score}%
                    </div>
                    <div className="text-xs text-gray-400" style={{ fontFamily: 'var(--font-pp-regular)' }}>
                      Competitive
                    </div>
                  </div>
                </div>

                {/* Warnings */}
                {warnings.length > 0 && (
                  <div className="space-y-2">
                    <div className="text-xs text-gray-400" style={{ fontFamily: 'var(--font-pp-regular)' }}>
                      Issues to Address:
                    </div>
                    {warnings.slice(0, 3).map((warning, index) => (
                      <div key={index} className="text-xs text-yellow-400" style={{ fontFamily: 'var(--font-pp-regular)' }}>
                        • {warning}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Performance Tab */}
            {activeTab === 'performance' && (
              <div className="space-y-4">
                <div className="text-xs text-gray-400 mb-3" style={{ fontFamily: 'var(--font-pp-regular)' }}>
                  Core Web Vitals:
                </div>
                
                {/* LCP */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <FiClock className="w-4 h-4 text-blue-400" />
                    <span className="text-xs text-gray-300" style={{ fontFamily: 'var(--font-pp-regular)' }}>
                      LCP
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`text-sm font-semibold ${getScoreColor(metrics.lcp || 0, LIGHTHOUSE_TARGETS.PERFORMANCE)}`}>
                      {metrics.lcp ? `${metrics.lcp.toFixed(0)}ms` : 'Loading...'}
                    </span>
                    <span className="text-xs text-gray-500">
                      / {LIGHTHOUSE_TARGETS.PERFORMANCE}ms
                    </span>
                    {metrics.lcp && getScoreIcon(metrics.lcp, LIGHTHOUSE_TARGETS.PERFORMANCE)}
                  </div>
                </div>

                {/* FID */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <FiMousePointer className="w-4 h-4 text-green-400" />
                    <span className="text-xs text-gray-300" style={{ fontFamily: 'var(--font-pp-regular)' }}>
                      FID
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`text-sm font-semibold ${getScoreColor(metrics.fid || 0, 100)}`}>
                      {metrics.fid ? `${metrics.fid.toFixed(0)}ms` : 'Loading...'}
                    </span>
                    <span className="text-xs text-gray-500">
                      / 100ms
                    </span>
                    {metrics.fid && getScoreIcon(metrics.fid, 100)}
                  </div>
                </div>

                {/* CLS */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <FiEye className="w-4 h-4 text-purple-400" />
                    <span className="text-xs text-gray-300" style={{ fontFamily: 'var(--font-pp-regular)' }}>
                      CLS
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`text-sm font-semibold ${getScoreColor(metrics.cls || 0, 0.1)}`}>
                      {metrics.cls ? metrics.cls.toFixed(3) : 'Loading...'}
                    </span>
                    <span className="text-xs text-gray-500">
                      / 0.1
                    </span>
                    {metrics.cls && getScoreIcon(metrics.cls, 0.1)}
                  </div>
                </div>
              </div>
            )}

            {/* SEO Tab */}
            {activeTab === 'seo' && (
              <div className="space-y-4">
                <div className="text-xs text-gray-400 mb-3" style={{ fontFamily: 'var(--font-pp-regular)' }}>
                  Keyword Rankings:
                </div>
                
                {Object.entries(dashboardData.seo.rankings).map(([keyword, ranking]) => (
                  <div key={keyword} className="flex items-center justify-between">
                    <span className="text-xs text-gray-300 truncate" style={{ fontFamily: 'var(--font-pp-regular)' }}>
                      {keyword}
                    </span>
                    <div className="flex items-center gap-2">
                      <span className={`text-sm font-semibold ${getStatusColor(ranking, 10, true)}`}>
                        #{ranking}
                      </span>
                      {ranking <= 5 && <FiCheckCircle className="w-3 h-3 text-green-400" />}
                    </div>
                  </div>
                ))}

                <div className="pt-3 border-t border-gray-700">
                  <div className="grid grid-cols-2 gap-3 text-center">
                    <div>
                      <div className="text-lg font-semibold text-white" style={{ fontFamily: 'var(--font-pp-medium)' }}>
                        {dashboardData.seo.impressions}
                      </div>
                      <div className="text-xs text-gray-400" style={{ fontFamily: 'var(--font-pp-regular)' }}>
                        Impressions
                      </div>
                    </div>
                    <div>
                      <div className="text-lg font-semibold text-white" style={{ fontFamily: 'var(--font-pp-medium)' }}>
                        {dashboardData.seo.clickThroughRate}%
                      </div>
                      <div className="text-xs text-gray-400" style={{ fontFamily: 'var(--font-pp-regular)' }}>
                        CTR
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Conversion Tab */}
            {activeTab === 'conversion' && (
              <div className="space-y-4">
                <div className="text-xs text-gray-400 mb-3" style={{ fontFamily: 'var(--font-pp-regular)' }}>
                  Conversion Metrics:
                </div>
                
                {/* Demo to Contact */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <FiTarget className="w-4 h-4 text-blue-400" />
                    <span className="text-xs text-gray-300" style={{ fontFamily: 'var(--font-pp-regular)' }}>
                      Demo to Contact
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`text-sm font-semibold ${getStatusColor(dashboardData.conversion.demoToContact, 5)}`}>
                      {dashboardData.conversion.demoToContact}%
                    </span>
                    <span className="text-xs text-gray-500">
                      / 5%
                    </span>
                    {getScoreIcon(dashboardData.conversion.demoToContact, 5)}
                  </div>
                </div>

                {/* Time on Page */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <FiClock className="w-4 h-4 text-green-400" />
                    <span className="text-xs text-gray-300" style={{ fontFamily: 'var(--font-pp-regular)' }}>
                      Time on Page
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`text-sm font-semibold ${getStatusColor(dashboardData.conversion.timeOnPage, 120)}`}>
                      {Math.round(dashboardData.conversion.timeOnPage / 60)}m {dashboardData.conversion.timeOnPage % 60}s
                    </span>
                    <span className="text-xs text-gray-500">
                      / 2m
                    </span>
                    {getScoreIcon(dashboardData.conversion.timeOnPage, 120)}
                  </div>
                </div>

                {/* Other Metrics */}
                <div className="grid grid-cols-2 gap-3 pt-3 border-t border-gray-700">
                  <div className="text-center">
                    <div className="text-lg font-semibold text-white" style={{ fontFamily: 'var(--font-pp-medium)' }}>
                      {dashboardData.conversion.ctaClicks}
                    </div>
                    <div className="text-xs text-gray-400" style={{ fontFamily: 'var(--font-pp-regular)' }}>
                      CTA Clicks
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-semibold text-white" style={{ fontFamily: 'var(--font-pp-medium)' }}>
                      {dashboardData.conversion.formSubmissions}
                    </div>
                    <div className="text-xs text-gray-400" style={{ fontFamily: 'var(--font-pp-regular)' }}>
                      Form Submissions
                    </div>
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </motion.div>
    </div>
  );
}