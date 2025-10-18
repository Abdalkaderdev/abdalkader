'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Globe, 
  ExternalLink, 
  Activity, 
  Users, 
  Eye, 
  Clock, 
  ChevronRight,
  CheckCircle,
  AlertCircle,
  Wrench,
  Calendar
} from 'lucide-react';
import { InteractiveCard } from '@/components/interactions/InteractiveCard';
import { InteractiveButton } from '@/components/interactions/InteractiveButton';
import { ECOSYSTEM_DOMAINS, getDomainUrl, isCurrentDomain, getEcosystemStats } from '@/lib/ecosystem';
import { useAnalytics } from '@/lib/analytics';
import { useAccessibility } from '@/hooks/useAccessibility';

interface EcosystemMapProps {
  className?: string;
  showStats?: boolean;
  showInactive?: boolean;
  onDomainSelect?: (domain: string) => void;
  compact?: boolean;
}

export const EcosystemMap: React.FC<EcosystemMapProps> = ({
  className = '',
  showStats = true,
  showInactive = false,
  onDomainSelect,
  compact = false,
}) => {
  const [selectedDomain, setSelectedDomain] = useState<string | null>(null);
  const [hoveredDomain, setHoveredDomain] = useState<string | null>(null);
  const [ecosystemStats, setEcosystemStats] = useState(getEcosystemStats());
  const [isLoading, setIsLoading] = useState(false);

  const { trackInteraction } = useAnalytics();
  const { 
    isMobile, 
    isTablet, 
    getResponsiveClasses,
    getTouchTargetSize,
    announceToScreenReader
  } = useAccessibility();

  // Filter domains based on props
  const filteredDomains = ECOSYSTEM_DOMAINS.filter(domain => 
    showInactive || domain.status === 'active'
  );

  // Handle domain selection
  const handleDomainSelect = (domain: string) => {
    setSelectedDomain(domain);
    onDomainSelect?.(domain);
    trackInteraction('domain_selected', 'ecosystem_map', { domain });
    announceToScreenReader(`Selected ${domain} domain`);
  };

  // Handle domain navigation
  const navigateToDomain = (subdomain: string) => {
    const url = getDomainUrl(subdomain);
    trackInteraction('domain_navigation', 'ecosystem_map', { 
      from: window.location.hostname,
      to: subdomain 
    });
    window.location.href = url;
  };

  // Get status icon and color
  const getStatusInfo = (status: string) => {
    switch (status) {
      case 'active':
        return { icon: CheckCircle, color: 'text-green-400', bgColor: 'bg-green-500/20' };
      case 'development':
        return { icon: Wrench, color: 'text-yellow-400', bgColor: 'bg-yellow-500/20' };
      case 'maintenance':
        return { icon: AlertCircle, color: 'text-orange-400', bgColor: 'bg-orange-500/20' };
      case 'planned':
        return { icon: Calendar, color: 'text-gray-400', bgColor: 'bg-gray-500/20' };
      default:
        return { icon: AlertCircle, color: 'text-gray-400', bgColor: 'bg-gray-500/20' };
    }
  };

  // Get responsive classes
  const getGridClasses = () => {
    if (compact) {
      return 'grid-cols-2 md:grid-cols-3 lg:grid-cols-4';
    }
    return getResponsiveClasses({
      mobile: 'grid-cols-1',
      tablet: 'grid-cols-2',
      desktop: 'grid-cols-3',
    });
  };

  // Animation variants
  const getAnimationVariants = () => {
    return {
      initial: { opacity: 0, y: 20, scale: 0.95 },
      animate: { opacity: 1, y: 0, scale: 1 },
      exit: { opacity: 0, y: -20, scale: 0.95 },
      hover: { y: -5, scale: 1.02 },
    };
  };

  const animationVariants = getAnimationVariants();

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <div className="text-center">
        <h2 className="portfolio-hero-text text-white mb-4">Ecosystem Map</h2>
        <p className="portfolio-base-text text-gray-300 max-w-3xl mx-auto">
          Explore all domains in the Abdalkader ecosystem. Each domain serves a specific purpose
          while maintaining a unified experience and shared infrastructure.
        </p>
      </div>

      {/* Ecosystem Stats */}
      {showStats && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4"
        >
          <InteractiveCard variant="ai" className="text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Users className="w-5 h-5 text-orange-400" />
              <span className="portfolio-small-text text-orange-400">Total Visitors</span>
            </div>
            <p className="portfolio-large-text text-white">
              {ecosystemStats.totalVisitors.toLocaleString()}
            </p>
          </InteractiveCard>

          <InteractiveCard variant="ai" className="text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Eye className="w-5 h-5 text-orange-400" />
              <span className="portfolio-small-text text-orange-400">Page Views</span>
            </div>
            <p className="portfolio-large-text text-white">
              {ecosystemStats.totalPageViews.toLocaleString()}
            </p>
          </InteractiveCard>

          <InteractiveCard variant="ai" className="text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Activity className="w-5 h-5 text-orange-400" />
              <span className="portfolio-small-text text-orange-400">Active Domains</span>
            </div>
            <p className="portfolio-large-text text-white">
              {ecosystemStats.activeDomains}
            </p>
          </InteractiveCard>

          <InteractiveCard variant="ai" className="text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Globe className="w-5 h-5 text-orange-400" />
              <span className="portfolio-small-text text-orange-400">Total Domains</span>
            </div>
            <p className="portfolio-large-text text-white">
              {ecosystemStats.totalDomains}
            </p>
          </InteractiveCard>
        </motion.div>
      )}

      {/* Domains Grid */}
      <div className={`grid ${getGridClasses()} gap-4`}>
        {filteredDomains.map((domain, index) => {
          const statusInfo = getStatusInfo(domain.status);
          const StatusIcon = statusInfo.icon;
          const isCurrent = isCurrentDomain(domain.subdomain);
          const isSelected = selectedDomain === domain.id;
          const isHovered = hoveredDomain === domain.id;

          return (
            <motion.div
              key={domain.id}
              initial="initial"
              animate="animate"
              exit="exit"
              whileHover="hover"
              variants={animationVariants}
              transition={{ delay: index * 0.1, duration: 0.4 }}
              onMouseEnter={() => setHoveredDomain(domain.id)}
              onMouseLeave={() => setHoveredDomain(null)}
            >
              <InteractiveCard
                variant="ai"
                className={`relative overflow-hidden transition-all duration-300 ${
                  isCurrent ? 'ring-2 ring-orange-500' : ''
                } ${isSelected ? 'bg-orange-500/10' : ''}`}
                onClick={() => handleDomainSelect(domain.id)}
              >
                {/* Domain Header */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div 
                      className="w-12 h-12 rounded-lg flex items-center justify-center text-2xl"
                      style={{ backgroundColor: domain.color + '20' }}
                    >
                      {domain.icon}
                    </div>
                    <div>
                      <h3 className="portfolio-medium-text text-white">{domain.name}</h3>
                      <p className="portfolio-small-text text-orange-400">
                        {domain.subdomain}.abdalkader.dev
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <div className={`p-1 rounded-full ${statusInfo.bgColor}`}>
                      <StatusIcon className={`w-4 h-4 ${statusInfo.color}`} />
                    </div>
                    {isCurrent && (
                      <div className="w-2 h-2 bg-orange-500 rounded-full animate-pulse" />
                    )}
                  </div>
                </div>

                {/* Domain Description */}
                <p className="text-gray-300 text-sm leading-relaxed mb-4 line-clamp-2">
                  {domain.description}
                </p>

                {/* Features */}
                <div className="mb-4">
                  <h4 className="portfolio-small-text text-orange-400 mb-2">Features</h4>
                  <div className="flex flex-wrap gap-1">
                    {domain.features.slice(0, 3).map((feature, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-1 bg-gray-700/50 text-gray-300 text-xs rounded-full"
                      >
                        {feature}
                      </span>
                    ))}
                    {domain.features.length > 3 && (
                      <span className="px-2 py-1 bg-gray-700/50 text-gray-400 text-xs rounded-full">
                        +{domain.features.length - 3}
                      </span>
                    )}
                  </div>
                </div>

                {/* Analytics */}
                <div className="grid grid-cols-2 gap-2 mb-4 text-xs">
                  <div className="text-center p-2 bg-gray-800/50 rounded">
                    <p className="text-gray-400">Visitors</p>
                    <p className="text-white font-medium">
                      {domain.analytics.visitors.toLocaleString()}
                    </p>
                  </div>
                  <div className="text-center p-2 bg-gray-800/50 rounded">
                    <p className="text-gray-400">Page Views</p>
                    <p className="text-white font-medium">
                      {domain.analytics.pageViews.toLocaleString()}
                    </p>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                  <InteractiveButton
                    onClick={(e) => {
                      e.stopPropagation();
                      navigateToDomain(domain.subdomain);
                    }}
                    variant="primary"
                    size="sm"
                    className="flex-1"
                    disabled={isCurrent}
                  >
                    {isCurrent ? 'Current' : 'Visit'}
                  </InteractiveButton>
                  
                  <InteractiveButton
                    onClick={(e) => {
                      e.stopPropagation();
                      // Open in new tab
                      window.open(getDomainUrl(domain.subdomain), '_blank');
                    }}
                    variant="ghost"
                    size="sm"
                    className={`${getTouchTargetSize()}`}
                    aria-label={`Open ${domain.name} in new tab`}
                  >
                    <ExternalLink className="w-4 h-4" />
                  </InteractiveButton>
                </div>

                {/* Hover Effect */}
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-orange-500/5 to-orange-400/5 pointer-events-none"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: isHovered ? 1 : 0 }}
                  transition={{ duration: 0.2 }}
                />

                {/* Current Domain Indicator */}
                {isCurrent && (
                  <motion.div
                    className="absolute top-2 right-2 w-3 h-3 bg-orange-500 rounded-full"
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 1, repeat: Infinity }}
                  />
                )}
              </InteractiveCard>
            </motion.div>
          );
        })}
      </div>

      {/* Selected Domain Details */}
      <AnimatePresence>
        {selectedDomain && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="mt-8"
          >
            {(() => {
              const domain = ECOSYSTEM_DOMAINS.find(d => d.id === selectedDomain);
              if (!domain) return null;

              return (
                <InteractiveCard variant="ai">
                  <div className="flex items-start justify-between mb-6">
                    <div className="flex items-center gap-4">
                      <div 
                        className="w-16 h-16 rounded-xl flex items-center justify-center text-3xl"
                        style={{ backgroundColor: domain.color + '20' }}
                      >
                        {domain.icon}
                      </div>
                      <div>
                        <h3 className="portfolio-hero-text text-white">{domain.name}</h3>
                        <p className="portfolio-large-text text-orange-400">
                          {domain.subdomain}.abdalkader.dev
                        </p>
                        <p className="portfolio-base-text text-gray-300 mt-2">
                          {domain.description}
                        </p>
                      </div>
                    </div>
                    
                    <InteractiveButton
                      onClick={() => setSelectedDomain(null)}
                      variant="ghost"
                      size="sm"
                    >
                      ✕
                    </InteractiveButton>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Features */}
                    <div>
                      <h4 className="portfolio-medium-text text-white mb-4">Features</h4>
                      <div className="space-y-2">
                        {domain.features.map((feature, index) => (
                          <motion.div
                            key={index}
                            className="flex items-center gap-3 p-3 bg-gray-800/50 rounded-lg"
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.1, duration: 0.3 }}
                          >
                            <CheckCircle className="w-4 h-4 text-green-400" />
                            <span className="text-gray-300">{feature}</span>
                          </motion.div>
                        ))}
                      </div>
                    </div>

                    {/* Analytics */}
                    <div>
                      <h4 className="portfolio-medium-text text-white mb-4">Analytics</h4>
                      <div className="space-y-3">
                        <div className="flex justify-between items-center p-3 bg-gray-800/50 rounded-lg">
                          <span className="text-gray-300">Visitors</span>
                          <span className="text-white font-medium">
                            {domain.analytics.visitors.toLocaleString()}
                          </span>
                        </div>
                        <div className="flex justify-between items-center p-3 bg-gray-800/50 rounded-lg">
                          <span className="text-gray-300">Page Views</span>
                          <span className="text-white font-medium">
                            {domain.analytics.pageViews.toLocaleString()}
                          </span>
                        </div>
                        <div className="flex justify-between items-center p-3 bg-gray-800/50 rounded-lg">
                          <span className="text-gray-300">Bounce Rate</span>
                          <span className="text-white font-medium">
                            {(domain.analytics.bounceRate * 100).toFixed(1)}%
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Last Updated */}
                  <div className="mt-6 pt-4 border-t border-gray-700">
                    <div className="flex items-center gap-2 text-gray-400">
                      <Clock className="w-4 h-4" />
                      <span className="portfolio-small-text">
                        Last updated: {new Date(domain.lastUpdated).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </InteractiveCard>
              );
            })()}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default EcosystemMap;