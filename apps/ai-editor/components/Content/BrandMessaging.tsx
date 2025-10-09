import { motion } from 'framer-motion';
import { FiMapPin, FiCode, FiZap, FiTrendingUp, FiGlobe, FiStar } from 'react-icons/fi';
import { MESSAGING_PILLARS, BRAND_PERSONALITY, REGIONAL_MESSAGING } from '../../utils/brandVoice';

interface BrandMessagingProps {
  className?: string;
}

export default function BrandMessaging({ className = '' }: BrandMessagingProps) {
  const pillars = Object.entries(MESSAGING_PILLARS);

  return (
    <div className={`space-y-12 ${className}`}>
      {/* Hero Brand Message */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <h1 className="text-4xl md:text-6xl font-bold gradient-text mb-6" style={{ fontFamily: 'var(--font-pp-medium)' }}>
          From Amman to AI
        </h1>
        <p className="text-xl md:text-2xl text-gray-300 mb-4" style={{ fontFamily: 'var(--font-pp-regular)' }}>
          Building the future from Jordan
        </p>
        <p className="text-lg text-gray-400 max-w-3xl mx-auto" style={{ fontFamily: 'var(--font-pp-regular)' }}>
          Full-stack developer who speaks AI fluently. I bridge business needs with technical innovation, 
          delivering production-ready AI solutions that actually work.
        </p>
      </motion.div>

      {/* Messaging Pillars */}
      <div className="grid md:grid-cols-2 gap-8">
        {pillars.map(([key, pillar], index) => (
          <motion.div
            key={key}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="lab-card p-8"
          >
            <div className="flex items-start gap-4 mb-4">
              <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-red-500 rounded-lg flex items-center justify-center text-black">
                {index === 0 && <FiMapPin className="w-6 h-6" />}
                {index === 1 && <FiCode className="w-6 h-6" />}
                {index === 2 && <FiZap className="w-6 h-6" />}
                {index === 3 && <FiTrendingUp className="w-6 h-6" />}
              </div>
              <div>
                <h3 className="text-xl font-semibold text-white mb-2" style={{ fontFamily: 'var(--font-pp-medium)' }}>
                  {pillar.headline}
                </h3>
                <p className="text-gray-300" style={{ fontFamily: 'var(--font-pp-regular)' }}>
                  {pillar.description}
                </p>
              </div>
            </div>

            <div className="space-y-3 mb-6">
              {pillar.supportingPoints.map((point, pointIndex) => (
                <div key={pointIndex} className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                  <span className="text-gray-300 text-sm" style={{ fontFamily: 'var(--font-pp-regular)' }}>
                    {point}
                  </span>
                </div>
              ))}
            </div>

            <button className="lab-button">
              {pillar.cta}
            </button>
          </motion.div>
        ))}
      </div>

      {/* Jordanian Pride Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="lab-card p-8 text-center"
      >
        <div className="flex items-center justify-center gap-3 mb-4">
          <FiGlobe className="w-8 h-8 text-orange-500" />
          <h2 className="text-2xl font-semibold text-white" style={{ fontFamily: 'var(--font-pp-medium)' }}>
            Proud to Represent Jordan
          </h2>
        </div>
        
        <p className="text-lg text-gray-300 mb-6 max-w-2xl mx-auto" style={{ fontFamily: 'var(--font-pp-regular)' }}>
          {REGIONAL_MESSAGING.JORDAN.pride} I'm based in Amman, serving clients worldwide while 
          contributing to Jordan's growing tech ecosystem and the broader Middle East AI innovation.
        </p>

        <div className="grid md:grid-cols-3 gap-6 text-center">
          <div>
            <div className="text-3xl font-bold text-orange-500 mb-2" style={{ fontFamily: 'var(--font-pp-medium)' }}>
              50+
            </div>
            <div className="text-gray-300" style={{ fontFamily: 'var(--font-pp-regular)' }}>
              AI Projects Delivered
            </div>
          </div>
          <div>
            <div className="text-3xl font-bold text-orange-500 mb-2" style={{ fontFamily: 'var(--font-pp-medium)' }}>
              4
            </div>
            <div className="text-gray-300" style={{ fontFamily: 'var(--font-pp-regular)' }}>
              Countries Served
            </div>
          </div>
          <div>
            <div className="text-3xl font-bold text-orange-500 mb-2" style={{ fontFamily: 'var(--font-pp-medium)' }}>
              95%
            </div>
            <div className="text-gray-300" style={{ fontFamily: 'var(--font-pp-regular)' }}>
              Client Satisfaction
            </div>
          </div>
        </div>
      </motion.div>

      {/* Brand Personality Traits */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="grid md:grid-cols-3 gap-6"
      >
        {Object.entries(BRAND_PERSONALITY).map(([key, trait], index) => (
          <div key={key} className="lab-card p-6 text-center">
            <div className="w-16 h-16 bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <FiStar className="w-8 h-8 text-black" />
            </div>
            <h3 className="text-lg font-semibold text-white mb-3" style={{ fontFamily: 'var(--font-pp-medium)' }}>
              {key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
            </h3>
            <p className="text-gray-300 text-sm mb-4" style={{ fontFamily: 'var(--font-pp-regular)' }}>
              {trait.tone}
            </p>
            <div className="space-y-2">
              {trait.examples.slice(0, 2).map((example, exampleIndex) => (
                <div key={exampleIndex} className="text-xs text-gray-400 italic" style={{ fontFamily: 'var(--font-pp-regular)' }}>
                  "{example}"
                </div>
              ))}
            </div>
          </div>
        ))}
      </motion.div>
    </div>
  );
}