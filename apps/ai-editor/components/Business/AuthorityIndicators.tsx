import { motion } from 'framer-motion';
import { FiAward, FiUsers, FiGlobe, FiTrendingUp, FiCode, FiZap } from 'react-icons/fi';

interface AuthorityIndicatorsProps {
  className?: string;
}

export default function AuthorityIndicators({ className = '' }: AuthorityIndicatorsProps) {
  const indicators = [
    {
      icon: <FiAward className="w-6 h-6" />,
      label: "AI/ML Expertise",
      value: "5+ Years",
      description: "Specialized in TensorFlow, PyTorch, and production ML systems"
    },
    {
      icon: <FiUsers className="w-6 h-6" />,
      label: "Projects Delivered",
      value: "50+",
      description: "AI solutions for startups and enterprises across MENA"
    },
    {
      icon: <FiGlobe className="w-6 h-6" />,
      label: "Geographic Reach",
      value: "MENA",
      description: "Serving clients in Jordan, Saudi Arabia, UAE, and Qatar"
    },
    {
      icon: <FiTrendingUp className="w-6 h-6" />,
      label: "Success Rate",
      value: "95%",
      description: "Client satisfaction and project completion rate"
    },
    {
      icon: <FiCode className="w-6 h-6" />,
      label: "Open Source",
      value: "Active",
      description: "Contributing to AI/ML community and open source projects"
    },
    {
      icon: <FiZap className="w-6 h-6" />,
      label: "Innovation",
      value: "Cutting-edge",
      description: "Always exploring latest AI technologies and methodologies"
    }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`lab-card p-6 ${className}`}
    >
      <div className="text-center mb-6">
        <h3 className="text-lg font-semibold text-white mb-2" style={{ fontFamily: 'var(--font-pp-medium)' }}>
          Why Work With Me?
        </h3>
        <p className="text-gray-300 text-sm" style={{ fontFamily: 'var(--font-pp-regular)' }}>
          Proven track record in AI/ML development across the Middle East
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {indicators.map((indicator, index) => (
          <motion.div
            key={indicator.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="text-center p-4 bg-gray-800/50 rounded-lg hover:bg-gray-700/50 transition-colors"
          >
            <div className="text-orange-500 mb-2 flex justify-center">
              {indicator.icon}
            </div>
            <div className="text-white font-semibold text-lg mb-1" style={{ fontFamily: 'var(--font-pp-medium)' }}>
              {indicator.value}
            </div>
            <div className="text-gray-300 text-sm mb-2" style={{ fontFamily: 'var(--font-pp-regular)' }}>
              {indicator.label}
            </div>
            <div className="text-gray-400 text-xs" style={{ fontFamily: 'var(--font-pp-regular)' }}>
              {indicator.description}
            </div>
          </motion.div>
        ))}
      </div>

      <div className="mt-6 pt-4 border-t border-gray-700">
        <div className="flex items-center justify-center gap-4 text-sm text-gray-400">
          <span>📍 Amman, Jordan</span>
          <span>•</span>
          <span>🌍 Remote Available</span>
          <span>•</span>
          <span>💼 Open to Opportunities</span>
        </div>
      </div>
    </motion.div>
  );
}