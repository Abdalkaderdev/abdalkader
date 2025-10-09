import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { FiCode, FiZap, FiPlay, FiGithub } from 'react-icons/fi';
import SEOHead from '../components/SEO/Head';
import JsonLd from '../components/SEO/JsonLd';
import AccessibleButton from '../components/AccessibleButton';
import LeadCapture from '../components/Business/LeadCapture';
import AuthorityIndicators from '../components/Business/AuthorityIndicators';
import ClientTestimonials from '../components/Business/ClientTestimonials';
import RegionalExpertise from '../components/Business/RegionalExpertise';
import StickyCTA from '../components/Business/StickyCTA';
import LabNav from '../components/Navigation/LabNav';
import BusinessAnalytics from '../components/Analytics/BusinessAnalytics';
import PerformanceMonitor from '../components/Performance/PerformanceMonitor';
import BundleAnalyzer from '../components/Performance/BundleAnalyzer';
import LighthouseOptimizer from '../components/Performance/LighthouseOptimizer';
import PerformanceDashboard from '../components/Performance/PerformanceDashboard';
import AccessibilityTester from '../components/Accessibility/AccessibilityTester';
import ConversionTracker from '../components/Analytics/ConversionTracker';
import CompetitiveAnalyzer from '../components/Analytics/CompetitiveAnalyzer';
import BrandMessaging from '../components/Content/BrandMessaging';
import { useAccessibility } from '../hooks/useAccessibility';
import { labWebsiteJsonLd, labCollectionJsonLd, personJsonLd } from '../utils/jsonld';

export default function Home() {
  const [isLoading, setIsLoading] = useState(false);
  const { containerRef, announce } = useAccessibility({
    enableKeyboardNavigation: true,
    enableScreenReaderAnnouncements: true
  });

  const features = [
    {
      icon: <FiCode className="w-8 h-8" />,
      title: "Real-time Object Detection with TensorFlow.js",
      description: "Interactive computer vision demo using pre-trained models for real-time object detection in web browsers",
      href: "/experiments/computer-vision-demo",
      color: "from-blue-500 to-cyan-500"
    },
    {
      icon: <FiZap className="w-8 h-8" />,
      title: "AI Code Generation & ML Model Training",
      description: "Generate components and train machine learning models using natural language prompts and interactive interfaces",
      href: "/generate",
      color: "from-purple-500 to-pink-500"
    },
    {
      icon: <FiPlay className="w-8 h-8" />,
      title: "Neural Network Visualization",
      description: "Interactive neural network playground with real-time model visualization and training simulations",
      href: "/experiments/neural-network-visualizer",
      color: "from-green-500 to-emerald-500"
    }
  ];

  return (
    <>
      <SEOHead 
        title="AI & Interactive Experiments Lab"
        description="Explore cutting-edge AI experiments, machine learning demos, and interactive TensorFlow.js applications. Real-time object detection, neural network visualizations, and AI code generation."
        keywords={['AI Lab', 'Machine Learning', 'TensorFlow.js', 'Computer Vision', 'Neural Networks', 'Interactive AI']}
      />
      <JsonLd type="website" />
      <JsonLd type="collection" />
      <JsonLd type="person" />
      <BusinessAnalytics pageName="AI Lab Homepage" />
      
      <div ref={containerRef} className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black">
      <LabNav />
      <main className="container mx-auto px-4 py-16">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h1 className="text-5xl font-bold gradient-text mb-6" style={{ fontFamily: 'var(--font-pp-medium)' }}>
            AI & Interactive Experiments Lab
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-8" style={{ fontFamily: 'var(--font-pp-regular)' }}>
            Explore cutting-edge AI experiments, machine learning demos, and interactive TensorFlow.js applications. From real-time object detection to neural network visualizations.
          </p>
          <div className="flex items-center justify-center gap-4">
            <AccessibleButton
              as={Link}
              href="/experiments"
              variant="primary"
              size="lg"
              ariaLabel="Explore AI experiments and interactive demos"
              announceOnClick
              announceMessage="Navigating to experiments page"
            >
              Explore AI Experiments
            </AccessibleButton>
            <AccessibleButton
              as={Link}
              href="/playground"
              variant="outline"
              size="lg"
              ariaLabel="Open component playground for live coding"
              announceOnClick
              announceMessage="Opening component playground"
            >
              Component Playground
            </AccessibleButton>
          </div>
        </motion.div>

        {/* Features Grid */}
        <section 
          className="grid md:grid-cols-3 gap-8 mb-16"
          aria-labelledby="features-heading"
        >
          <h2 id="features-heading" className="sr-only">
            Featured AI Experiments
          </h2>
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              <Link 
                href={feature.href}
                aria-label={`${feature.title}: ${feature.description}`}
                role="article"
              >
                <div 
                  className="lab-card p-8 hover:scale-105 cursor-pointer"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      window.location.href = feature.href;
                    }
                  }}
                >
                  <div 
                    className={`w-16 h-16 rounded-lg bg-gradient-to-r ${feature.color} flex items-center justify-center text-white mb-6`}
                    aria-hidden="true"
                  >
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-4" style={{ fontFamily: 'var(--font-pp-medium)' }}>
                    {feature.title}
                  </h3>
                  <p className="text-gray-300" style={{ fontFamily: 'var(--font-pp-regular)' }}>
                    {feature.description}
                  </p>
                </div>
              </Link>
            </motion.div>
          ))}
        </section>

        {/* Brand Messaging */}
        <BrandMessaging />

        {/* Authority Indicators */}
        <AuthorityIndicators />

        {/* Lead Capture */}
        <LeadCapture variant="hero" />

        {/* Tech Stack */}
        <section
          className="lab-card p-8"
          aria-labelledby="tech-stack-heading"
        >
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
          <h2 id="tech-stack-heading" className="text-2xl font-semibold text-white mb-6 text-center" style={{ fontFamily: 'var(--font-pp-medium)' }}>
            Powered by AI & Machine Learning Technologies
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 bg-orange-500 rounded-lg flex items-center justify-center mb-2">
                <span className="text-white font-bold">TF</span>
              </div>
              <span className="text-sm text-gray-300" style={{ fontFamily: 'var(--font-pp-regular)' }}>TensorFlow.js</span>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center mb-2">
                <FiCode className="text-white" />
              </div>
              <span className="text-sm text-gray-300" style={{ fontFamily: 'var(--font-pp-regular)' }}>Computer Vision</span>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center mb-2">
                <span className="text-white font-bold">ML</span>
              </div>
              <span className="text-sm text-gray-300" style={{ fontFamily: 'var(--font-pp-regular)' }}>Machine Learning</span>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 bg-purple-600 rounded-lg flex items-center justify-center mb-2">
                <FiZap className="text-white" />
              </div>
              <span className="text-sm text-gray-300" style={{ fontFamily: 'var(--font-pp-regular)' }}>Neural Networks</span>
            </div>
          </div>
          </motion.div>
        </section>

        {/* Client Testimonials */}
        <ClientTestimonials />

        {/* Regional Expertise */}
        <RegionalExpertise />

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="text-center mt-16"
        >
          <p className="text-gray-400" style={{ fontFamily: 'var(--font-pp-regular)' }}>
            Part of the Abdalkader AI Lab • Exploring the future of machine learning • v1.0.1
          </p>
        </motion.div>
      </main>
      <StickyCTA />
      <PerformanceDashboard showDetails={process.env.NODE_ENV === 'development'} />
      <PerformanceMonitor showDetails={process.env.NODE_ENV === 'development'} />
      <BundleAnalyzer showDetails={process.env.NODE_ENV === 'development'} />
      <LighthouseOptimizer showDetails={process.env.NODE_ENV === 'development'} />
      <AccessibilityTester showDetails={process.env.NODE_ENV === 'development'} />
      <ConversionTracker showDetails={process.env.NODE_ENV === 'development'} />
      <CompetitiveAnalyzer showDetails={process.env.NODE_ENV === 'development'} />
      </div>
    </>
  );
}