import { motion } from 'framer-motion';
import { FiMapPin, FiGlobe, FiTrendingUp, FiUsers } from 'react-icons/fi';

interface RegionalExpertiseProps {
  className?: string;
}

export default function RegionalExpertise({ className = '' }: RegionalExpertiseProps) {
  const regions = [
    {
      country: "Jordan",
      city: "Amman",
      flag: "🇯🇴",
      expertise: ["AI Startups", "E-commerce", "FinTech"],
      clients: "15+",
      description: "Based in Amman, serving the growing tech ecosystem"
    },
    {
      country: "Saudi Arabia",
      city: "Riyadh",
      flag: "🇸🇦",
      expertise: ["Vision 2030", "Industrial AI", "Smart Cities"],
      clients: "12+",
      description: "Supporting Saudi Arabia's digital transformation"
    },
    {
      country: "UAE",
      city: "Dubai",
      flag: "🇦🇪",
      expertise: ["FinTech", "Logistics", "Tourism Tech"],
      clients: "18+",
      description: "Powering innovation in the region's tech hub"
    },
    {
      country: "Qatar",
      city: "Doha",
      flag: "🇶🇦",
      expertise: ["Energy Tech", "Smart Infrastructure", "Healthcare AI"],
      clients: "8+",
      description: "Contributing to Qatar's smart nation initiatives"
    }
  ];

  const stats = [
    { label: "Countries Served", value: "4", icon: <FiGlobe className="w-5 h-5" /> },
    { label: "Total Clients", value: "53+", icon: <FiUsers className="w-5 h-5" /> },
    { label: "Success Rate", value: "95%", icon: <FiTrendingUp className="w-5 h-5" /> },
    { label: "Years Experience", value: "5+", icon: <FiMapPin className="w-5 h-5" /> }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`space-y-8 ${className}`}
    >
      <div className="text-center">
        <h3 className="text-2xl font-semibold text-white mb-2" style={{ fontFamily: 'var(--font-pp-medium)' }}>
          Regional AI Expertise
        </h3>
        <p className="text-gray-300" style={{ fontFamily: 'var(--font-pp-regular)' }}>
          Deep understanding of Middle Eastern markets and business culture
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.1 }}
            className="lab-card p-4 text-center"
          >
            <div className="text-orange-500 mb-2 flex justify-center">
              {stat.icon}
            </div>
            <div className="text-2xl font-bold text-white mb-1" style={{ fontFamily: 'var(--font-pp-medium)' }}>
              {stat.value}
            </div>
            <div className="text-gray-400 text-sm" style={{ fontFamily: 'var(--font-pp-regular)' }}>
              {stat.label}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Regional Breakdown */}
      <div className="grid md:grid-cols-2 gap-6">
        {regions.map((region, index) => (
          <motion.div
            key={region.country}
            initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="lab-card p-6"
          >
            <div className="flex items-start justify-between mb-4">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-2xl">{region.flag}</span>
                  <div>
                    <h4 className="text-lg font-semibold text-white" style={{ fontFamily: 'var(--font-pp-medium)' }}>
                      {region.city}
                    </h4>
                    <p className="text-gray-400 text-sm" style={{ fontFamily: 'var(--font-pp-regular)' }}>
                      {region.country}
                    </p>
                  </div>
                </div>
                <p className="text-gray-300 text-sm mb-4" style={{ fontFamily: 'var(--font-pp-regular)' }}>
                  {region.description}
                </p>
              </div>
              <div className="text-right">
                <div className="text-orange-500 font-bold text-lg" style={{ fontFamily: 'var(--font-pp-medium)' }}>
                  {region.clients}
                </div>
                <div className="text-gray-400 text-xs" style={{ fontFamily: 'var(--font-pp-regular)' }}>
                  clients
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <div className="text-gray-400 text-sm" style={{ fontFamily: 'var(--font-pp-regular)' }}>
                Specializations:
              </div>
              <div className="flex flex-wrap gap-2">
                {region.expertise.map((area, areaIndex) => (
                  <span
                    key={areaIndex}
                    className="px-2 py-1 bg-orange-500/20 text-orange-400 rounded text-xs"
                  >
                    {area}
                  </span>
                ))}
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="text-center mt-8 p-6 bg-gradient-to-r from-orange-500/10 to-red-500/10 border border-orange-500/30 rounded-xl">
        <h4 className="text-lg font-semibold text-white mb-2" style={{ fontFamily: 'var(--font-pp-medium)' }}>
          Ready to Expand Your AI Capabilities?
        </h4>
        <p className="text-gray-300 mb-4" style={{ fontFamily: 'var(--font-pp-regular)' }}>
          Let's discuss how AI can transform your business in the Middle East market
        </p>
        <div className="flex items-center justify-center gap-4 text-sm text-gray-400">
          <span>📧 hello@abdalkader.dev</span>
          <span>•</span>
          <span>📱 +962 79 123 4567</span>
          <span>•</span>
          <span>📍 Amman, Jordan</span>
        </div>
      </div>
    </motion.div>
  );
}