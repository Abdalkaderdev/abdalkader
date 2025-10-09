import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiTrendingUp, FiTarget, FiUsers, FiClock, FiMousePointer } from 'react-icons/fi';
import { CONVERSION_OPTIMIZATION, PERFORMANCE_TARGETS } from '../../utils/seoOptimizer';

interface ConversionMetrics {
  demoToContact: number;
  timeOnPage: number;
  bounceRate: number;
  pageViews: number;
  ctaClicks: number;
  formSubmissions: number;
}

interface ConversionTrackerProps {
  showDetails?: boolean;
  className?: string;
}

export default function ConversionTracker({ showDetails = false, className = '' }: ConversionTrackerProps) {
  const [metrics, setMetrics] = useState<ConversionMetrics>({
    demoToContact: 0,
    timeOnPage: 0,
    bounceRate: 0,
    pageViews: 0,
    ctaClicks: 0,
    formSubmissions: 0
  });
  const [isTracking, setIsTracking] = useState(false);
  const [sessionStart, setSessionStart] = useState<number>(Date.now());

  useEffect(() => {
    // Start tracking session
    setIsTracking(true);
    setSessionStart(Date.now());

    // Track page view
    trackPageView();

    // Track time on page
    const startTime = Date.now();
    const trackTimeOnPage = () => {
      const timeSpent = Date.now() - startTime;
      setMetrics(prev => ({
        ...prev,
        timeOnPage: Math.round(timeSpent / 1000) // Convert to seconds
      }));
    };

    // Track time every 10 seconds
    const timeInterval = setInterval(trackTimeOnPage, 10000);

    // Track on page unload
    const handleBeforeUnload = () => {
      const timeSpent = Date.now() - startTime;
      trackTimeOnPage();
      
      if (typeof window !== 'undefined' && (window as any).gtag) {
        (window as any).gtag('event', 'time_on_page', {
          time_spent: Math.round(timeSpent / 1000),
          page: window.location.pathname
        });
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    // Track scroll depth
    let maxScrollDepth = 0;
    const trackScrollDepth = () => {
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;
      const scrollPercent = (scrollTop + windowHeight) / documentHeight;
      
      if (scrollPercent > maxScrollDepth) {
        maxScrollDepth = scrollPercent;
        
        if (typeof window !== 'undefined' && (window as any).gtag) {
          (window as any).gtag('event', 'scroll_depth', {
            scroll_percent: Math.round(scrollPercent * 100),
            page: window.location.pathname
          });
        }
      }
    };

    window.addEventListener('scroll', trackScrollDepth);

    // Track CTA clicks
    const trackCTAClicks = (event: Event) => {
      const target = event.target as HTMLElement;
      if (target.matches('button, a[href*="contact"], a[href*="demo"]')) {
        setMetrics(prev => ({
          ...prev,
          ctaClicks: prev.ctaClicks + 1
        }));
        
        if (typeof window !== 'undefined' && (window as any).gtag) {
          (window as any).gtag('event', 'cta_click', {
            cta_text: target.textContent,
            cta_type: target.tagName.toLowerCase(),
            page: window.location.pathname
          });
        }
      }
    };

    document.addEventListener('click', trackCTAClicks);

    // Track form submissions
    const trackFormSubmissions = (event: Event) => {
      const target = event.target as HTMLElement;
      if (target.matches('form')) {
        setMetrics(prev => ({
          ...prev,
          formSubmissions: prev.formSubmissions + 1
        }));
        
        if (typeof window !== 'undefined' && (window as any).gtag) {
          (window as any).gtag('event', 'form_submit', {
            form_id: target.id || 'unknown',
            page: window.location.pathname
          });
        }
      }
    };

    document.addEventListener('submit', trackFormSubmissions);

    return () => {
      clearInterval(timeInterval);
      window.removeEventListener('beforeunload', handleBeforeUnload);
      window.removeEventListener('scroll', trackScrollDepth);
      document.removeEventListener('click', trackCTAClicks);
      document.removeEventListener('submit', trackFormSubmissions);
    };
  }, []);

  const trackPageView = () => {
    setMetrics(prev => ({
      ...prev,
      pageViews: prev.pageViews + 1
    }));
    
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', 'page_view', {
        page_title: document.title,
        page_location: window.location.href,
        page_path: window.location.pathname
      });
    }
  };

  const calculateConversionRate = (): number => {
    if (metrics.pageViews === 0) return 0;
    return (metrics.formSubmissions / metrics.pageViews) * 100;
  };

  const getMetricStatus = (value: number, target: number, reverse = false): 'good' | 'warning' | 'poor' => {
    const percentage = (value / target) * 100;
    if (reverse) {
      if (percentage <= 100) return 'good';
      if (percentage <= 120) return 'warning';
      return 'poor';
    } else {
      if (percentage >= 100) return 'good';
      if (percentage >= 80) return 'warning';
      return 'poor';
    }
  };

  const getStatusColor = (status: 'good' | 'warning' | 'poor') => {
    switch (status) {
      case 'good': return 'text-green-400';
      case 'warning': return 'text-yellow-400';
      case 'poor': return 'text-red-400';
      default: return 'text-gray-400';
    }
  };

  const getStatusIcon = (status: 'good' | 'warning' | 'poor') => {
    switch (status) {
      case 'good': return '✅';
      case 'warning': return '⚠️';
      case 'poor': return '❌';
      default: return '❓';
    }
  };

  const conversionRate = calculateConversionRate();
  const timeOnPageStatus = getMetricStatus(metrics.timeOnPage, PERFORMANCE_TARGETS.CONVERSION.TIME_ON_PAGE);
  const conversionRateStatus = getMetricStatus(conversionRate, PERFORMANCE_TARGETS.CONVERSION.DEMO_TO_CONTACT);

  if (!showDetails && conversionRateStatus === 'good' && timeOnPageStatus === 'good') return null;

  return (
    <div className={`fixed bottom-4 right-4 z-50 ${className}`}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gray-900 border border-gray-700 rounded-lg p-4 shadow-xl max-w-sm"
      >
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <FiTrendingUp className="w-5 h-5 text-green-400" />
            <h3 className="text-sm font-semibold text-white" style={{ fontFamily: 'var(--font-pp-medium)' }}>
              Conversion Tracker
            </h3>
          </div>
          <div className="text-xs text-gray-400">
            {isTracking ? 'Live' : 'Paused'}
          </div>
        </div>

        {/* Key Metrics */}
        <div className="space-y-3 mb-4">
          {/* Conversion Rate */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FiTarget className="w-4 h-4 text-blue-400" />
              <span className="text-xs text-gray-300" style={{ fontFamily: 'var(--font-pp-regular)' }}>
                Conversion Rate
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className={`text-sm font-semibold ${getStatusColor(conversionRateStatus)}`}>
                {conversionRate.toFixed(1)}%
              </span>
              <span className="text-xs text-gray-500">
                / {PERFORMANCE_TARGETS.CONVERSION.DEMO_TO_CONTACT}%
              </span>
              <span className="text-sm">
                {getStatusIcon(conversionRateStatus)}
              </span>
            </div>
          </div>

          {/* Time on Page */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FiClock className="w-4 h-4 text-purple-400" />
              <span className="text-xs text-gray-300" style={{ fontFamily: 'var(--font-pp-regular)' }}>
                Time on Page
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className={`text-sm font-semibold ${getStatusColor(timeOnPageStatus)}`}>
                {Math.round(metrics.timeOnPage / 60)}m {metrics.timeOnPage % 60}s
              </span>
              <span className="text-xs text-gray-500">
                / {Math.round(PERFORMANCE_TARGETS.CONVERSION.TIME_ON_PAGE / 60)}m
              </span>
              <span className="text-sm">
                {getStatusIcon(timeOnPageStatus)}
              </span>
            </div>
          </div>

          {/* CTA Clicks */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FiMousePointer className="w-4 h-4 text-orange-400" />
              <span className="text-xs text-gray-300" style={{ fontFamily: 'var(--font-pp-regular)' }}>
                CTA Clicks
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold text-white">
                {metrics.ctaClicks}
              </span>
            </div>
          </div>

          {/* Form Submissions */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FiUsers className="w-4 h-4 text-green-400" />
              <span className="text-xs text-gray-300" style={{ fontFamily: 'var(--font-pp-regular)' }}>
                Form Submissions
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold text-white">
                {metrics.formSubmissions}
              </span>
            </div>
          </div>
        </div>

        {/* Performance Indicators */}
        <div className="pt-3 border-t border-gray-700">
          <div className="text-xs text-gray-400 mb-2" style={{ fontFamily: 'var(--font-pp-regular)' }}>
            Performance Indicators:
          </div>
          <div className="space-y-1 text-xs">
            <div className="flex items-center justify-between">
              <span className="text-gray-300" style={{ fontFamily: 'var(--font-pp-regular)' }}>
                Page Views
              </span>
              <span className="text-white font-semibold">
                {metrics.pageViews}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-300" style={{ fontFamily: 'var(--font-pp-regular)' }}>
                Session Duration
              </span>
              <span className="text-white font-semibold">
                {Math.round((Date.now() - sessionStart) / 1000)}s
              </span>
            </div>
          </div>
        </div>

        {/* Recommendations */}
        {(conversionRateStatus === 'poor' || timeOnPageStatus === 'poor') && (
          <div className="mt-3 pt-3 border-t border-gray-700">
            <div className="text-xs text-gray-400 mb-2" style={{ fontFamily: 'var(--font-pp-regular)' }}>
              Recommendations:
            </div>
            <div className="space-y-1 text-xs text-gray-300">
              {conversionRateStatus === 'poor' && (
                <div style={{ fontFamily: 'var(--font-pp-regular)' }}>
                  • Optimize CTA placement and messaging
                </div>
              )}
              {timeOnPageStatus === 'poor' && (
                <div style={{ fontFamily: 'var(--font-pp-regular)' }}>
                  • Add more interactive content
                </div>
              )}
              <div style={{ fontFamily: 'var(--font-pp-regular)' }}>
                • A/B test different layouts
              </div>
              <div style={{ fontFamily: 'var(--font-pp-regular)' }}>
                • Improve page load speed
              </div>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
}