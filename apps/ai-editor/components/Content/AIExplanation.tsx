import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiLightbulb, FiTarget, FiTrendingUp, FiUsers, FiDollarSign, FiArrowRight, FiPlay } from 'react-icons/fi';

interface AIExplanationProps {
  concept: {
    title: string;
    simpleDefinition: string;
    realWorldAnalogy: string;
    businessApplications: {
      industry: string;
      useCase: string;
      benefit: string;
    }[];
    benefits: string[];
    limitations: string[];
    gettingStarted: {
      step: string;
      description: string;
    }[];
    nextSteps: string[];
  };
  className?: string;
}

export default function AIExplanation({ concept, className = '' }: AIExplanationProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'applications' | 'benefits' | 'getting-started'>('overview');

  const tabs = [
    { id: 'overview', label: 'Overview', icon: <FiLightbulb className="w-4 h-4" /> },
    { id: 'applications', label: 'Applications', icon: <FiTarget className="w-4 h-4" /> },
    { id: 'benefits', label: 'Benefits', icon: <FiTrendingUp className="w-4 h-4" /> },
    { id: 'getting-started', label: 'Getting Started', icon: <FiPlay className="w-4 h-4" /> }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`lab-card p-8 ${className}`}
    >
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-white mb-4" style={{ fontFamily: 'var(--font-pp-medium)' }}>
          {concept.title}
        </h1>
        <p className="text-xl text-gray-300 max-w-3xl mx-auto" style={{ fontFamily: 'var(--font-pp-regular)' }}>
          {concept.simpleDefinition}
        </p>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-2 mb-8">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              activeTab === tab.id
                ? 'bg-orange-500 text-black'
                : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
            }`}
            style={{ fontFamily: 'var(--font-pp-medium)' }}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
        >
          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <div className="space-y-8">
              {/* Real World Analogy */}
              <div>
                <h2 className="text-2xl font-semibold text-white mb-4 flex items-center gap-2" style={{ fontFamily: 'var(--font-pp-medium)' }}>
                  <FiLightbulb className="w-6 h-6 text-yellow-500" />
                  Think of it like...
                </h2>
                <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-6">
                  <p className="text-lg text-gray-300" style={{ fontFamily: 'var(--font-pp-regular)' }}>
                    {concept.realWorldAnalogy}
                  </p>
                </div>
              </div>

              {/* Benefits and Limitations */}
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2" style={{ fontFamily: 'var(--font-pp-medium)' }}>
                    <FiTrendingUp className="w-5 h-5 text-green-500" />
                    Benefits
                  </h3>
                  <div className="space-y-3">
                    {concept.benefits.map((benefit, index) => (
                      <div key={index} className="flex items-start gap-3">
                        <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                        <span className="text-gray-300" style={{ fontFamily: 'var(--font-pp-regular)' }}>
                          {benefit}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2" style={{ fontFamily: 'var(--font-pp-medium)' }}>
                    <div className="w-5 h-5 bg-red-500 rounded-full flex items-center justify-center">
                      <span className="text-white text-xs">!</span>
                    </div>
                    Limitations
                  </h3>
                  <div className="space-y-3">
                    {concept.limitations.map((limitation, index) => (
                      <div key={index} className="flex items-start gap-3">
                        <div className="w-2 h-2 bg-red-500 rounded-full mt-2 flex-shrink-0"></div>
                        <span className="text-gray-300" style={{ fontFamily: 'var(--font-pp-regular)' }}>
                          {limitation}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Applications Tab */}
          {activeTab === 'applications' && (
            <div className="space-y-6">
              <h2 className="text-2xl font-semibold text-white mb-6" style={{ fontFamily: 'var(--font-pp-medium)' }}>
                Real-World Applications
              </h2>
              <div className="grid md:grid-cols-2 gap-6">
                {concept.businessApplications.map((app, index) => (
                  <div key={index} className="bg-gray-800 rounded-lg p-6">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-red-500 rounded-lg flex items-center justify-center">
                        <FiTarget className="w-6 h-6 text-black" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-white" style={{ fontFamily: 'var(--font-pp-medium)' }}>
                          {app.industry}
                        </h3>
                        <p className="text-gray-400 text-sm" style={{ fontFamily: 'var(--font-pp-regular)' }}>
                          {app.useCase}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <FiDollarSign className="w-4 h-4 text-green-400" />
                      <span className="text-green-400 font-semibold" style={{ fontFamily: 'var(--font-pp-medium)' }}>
                        {app.benefit}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Benefits Tab */}
          {activeTab === 'benefits' && (
            <div className="space-y-6">
              <h2 className="text-2xl font-semibold text-white mb-6" style={{ fontFamily: 'var(--font-pp-medium)' }}>
                Business Benefits
              </h2>
              <div className="grid md:grid-cols-2 gap-6">
                {concept.benefits.map((benefit, index) => (
                  <div key={index} className="flex items-start gap-4 p-4 bg-gray-800 rounded-lg">
                    <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
                      <FiTrendingUp className="w-4 h-4 text-black" />
                    </div>
                    <div>
                      <h3 className="text-white font-semibold mb-2" style={{ fontFamily: 'var(--font-pp-medium)' }}>
                        Benefit #{index + 1}
                      </h3>
                      <p className="text-gray-300" style={{ fontFamily: 'var(--font-pp-regular)' }}>
                        {benefit}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Getting Started Tab */}
          {activeTab === 'getting-started' && (
            <div className="space-y-6">
              <h2 className="text-2xl font-semibold text-white mb-6" style={{ fontFamily: 'var(--font-pp-medium)' }}>
                How to Get Started
              </h2>
              <div className="space-y-4">
                {concept.gettingStarted.map((step, index) => (
                  <div key={index} className="flex items-start gap-4">
                    <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center text-black font-bold flex-shrink-0">
                      {index + 1}
                    </div>
                    <div className="flex-1">
                      <h3 className="text-white font-semibold mb-2" style={{ fontFamily: 'var(--font-pp-medium)' }}>
                        {step.step}
                      </h3>
                      <p className="text-gray-300" style={{ fontFamily: 'var(--font-pp-regular)' }}>
                        {step.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Next Steps */}
              <div className="mt-8 p-6 bg-gradient-to-r from-orange-500/10 to-red-500/10 border border-orange-500/30 rounded-lg">
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2" style={{ fontFamily: 'var(--font-pp-medium)' }}>
                  <FiArrowRight className="w-5 h-5" />
                  Next Steps
                </h3>
                <div className="space-y-2">
                  {concept.nextSteps.map((step, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                      <span className="text-gray-300" style={{ fontFamily: 'var(--font-pp-regular)' }}>
                        {step}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </motion.div>
  );
}