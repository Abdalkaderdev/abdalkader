import { motion } from 'framer-motion';
import { FiMapPin, FiTrendingUp, FiUsers, FiHome, FiGlobe, FiStar, FiTarget, FiZap } from 'react-icons/fi';

interface JordanTechInsightsProps {
  className?: string;
}

export default function JordanTechInsights({ className = '' }: JordanTechInsightsProps) {
  const insights = {
    currentState: {
      title: 'Jordan\'s AI Ecosystem Today',
      description: 'A thriving tech scene with growing AI adoption and talent development',
      stats: [
        { label: 'AI Startups', value: '25+', icon: <FiHome className="w-5 h-5" /> },
        { label: 'Tech Companies', value: '500+', icon: <FiHome className="w-5 h-5" /> },
        { label: 'Developers', value: '15K+', icon: <FiUsers className="w-5 h-5" /> },
        { label: 'AI Specialists', value: '200+', icon: <FiZap className="w-5 h-5" /> }
      ]
    },
    growthOpportunities: [
      {
        title: 'Vision 2030 Alignment',
        description: 'AI integration in government services and smart city initiatives',
        impact: 'High',
        timeline: '2024-2030'
      },
      {
        title: 'Startup Ecosystem Growth',
        description: 'Increasing investment in AI and tech startups',
        impact: 'High',
        timeline: 'Ongoing'
      },
      {
        title: 'Talent Development',
        description: 'More universities offering AI and ML programs',
        impact: 'Medium',
        timeline: '2024-2026'
      },
      {
        title: 'Regional Expansion',
        description: 'Jordan as a tech hub for the broader MENA region',
        impact: 'High',
        timeline: '2025-2030'
      }
    ],
    keyPlayers: [
      {
        name: 'AI Startups',
        description: 'Innovative companies building AI solutions',
        examples: ['Tech startups', 'AI consultancies', 'ML service providers'],
        icon: <FiZap className="w-6 h-6" />
      },
      {
        name: 'Universities',
        description: 'Educational institutions developing AI talent',
        examples: ['University of Jordan', 'German Jordanian University', 'Princess Sumaya University'],
        icon: <FiHome className="w-6 h-6" />
      },
      {
        name: 'Government',
        description: 'Public sector AI initiatives and support',
        examples: ['Vision 2030', 'Smart Amman', 'Digital transformation'],
        icon: <FiTarget className="w-6 h-6" />
      },
      {
        name: 'International Companies',
        description: 'Global tech companies with Jordan presence',
        examples: ['Microsoft', 'Amazon', 'Oracle', 'IBM'],
        icon: <FiGlobe className="w-6 h-6" />
      }
    ],
    challenges: [
      'Limited AI talent pool compared to global standards',
      'Need for more specialized AI education programs',
      'Access to large-scale datasets for training',
      'Infrastructure requirements for AI development',
      'Regulatory framework for AI applications'
    ],
    futureOutlook: {
      title: 'Future Outlook',
      description: 'Jordan is positioned to become a leading AI hub in the Middle East',
      predictions: [
        'AI talent pool will double by 2026',
        'Government AI initiatives will accelerate',
        'More international AI companies will establish presence',
        'Jordan will lead regional AI innovation',
        'AI exports will become significant economic driver'
      ]
    },
    howToGetInvolved: [
      'Join local AI and tech meetups',
      'Participate in hackathons and competitions',
      'Contribute to open source AI projects',
      'Attend AI conferences and workshops',
      'Connect with local AI professionals',
      'Support AI education initiatives'
    ]
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`space-y-12 ${className}`}
    >
      {/* Header */}
      <div className="text-center">
        <div className="flex items-center justify-center gap-3 mb-4">
          <FiMapPin className="w-8 h-8 text-orange-500" />
          <h1 className="text-4xl font-bold text-white" style={{ fontFamily: 'var(--font-pp-medium)' }}>
            Jordan Tech Ecosystem
          </h1>
        </div>
        <p className="text-xl text-gray-300 max-w-3xl mx-auto" style={{ fontFamily: 'var(--font-pp-regular)' }}>
          Exploring Jordan's growing AI and technology landscape, from Amman's startup scene to regional innovation
        </p>
      </div>

      {/* Current State */}
      <div className="lab-card p-8">
        <h2 className="text-2xl font-semibold text-white mb-6" style={{ fontFamily: 'var(--font-pp-medium)' }}>
          {insights.currentState.title}
        </h2>
        <p className="text-gray-300 mb-8" style={{ fontFamily: 'var(--font-pp-regular)' }}>
          {insights.currentState.description}
        </p>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {insights.currentState.stats.map((stat, index) => (
            <div key={index} className="text-center p-4 bg-gray-800 rounded-lg">
              <div className="text-orange-500 mb-2 flex justify-center">
                {stat.icon}
              </div>
              <div className="text-2xl font-bold text-white mb-1" style={{ fontFamily: 'var(--font-pp-medium)' }}>
                {stat.value}
              </div>
              <div className="text-gray-400 text-sm" style={{ fontFamily: 'var(--font-pp-regular)' }}>
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Growth Opportunities */}
      <div className="lab-card p-8">
        <h2 className="text-2xl font-semibold text-white mb-6" style={{ fontFamily: 'var(--font-pp-medium)' }}>
          Growth Opportunities
        </h2>
        <div className="grid md:grid-cols-2 gap-6">
          {insights.growthOpportunities.map((opportunity, index) => (
            <div key={index} className="p-6 bg-gray-800 rounded-lg">
              <div className="flex items-start justify-between mb-4">
                <h3 className="text-lg font-semibold text-white" style={{ fontFamily: 'var(--font-pp-medium)' }}>
                  {opportunity.title}
                </h3>
                <div className="flex items-center gap-2">
                  <span className={`px-2 py-1 rounded text-xs font-semibold ${
                    opportunity.impact === 'High' ? 'bg-green-500/20 text-green-400' :
                    opportunity.impact === 'Medium' ? 'bg-yellow-500/20 text-yellow-400' :
                    'bg-gray-500/20 text-gray-400'
                  }`}>
                    {opportunity.impact}
                  </span>
                </div>
              </div>
              <p className="text-gray-300 mb-4" style={{ fontFamily: 'var(--font-pp-regular)' }}>
                {opportunity.description}
              </p>
              <div className="text-sm text-gray-400" style={{ fontFamily: 'var(--font-pp-regular)' }}>
                Timeline: {opportunity.timeline}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Key Players */}
      <div className="lab-card p-8">
        <h2 className="text-2xl font-semibold text-white mb-6" style={{ fontFamily: 'var(--font-pp-medium)' }}>
          Key Players in Jordan's AI Ecosystem
        </h2>
        <div className="grid md:grid-cols-2 gap-6">
          {insights.keyPlayers.map((player, index) => (
            <div key={index} className="p-6 bg-gray-800 rounded-lg">
              <div className="flex items-center gap-3 mb-4">
                <div className="text-orange-500">
                  {player.icon}
                </div>
                <h3 className="text-lg font-semibold text-white" style={{ fontFamily: 'var(--font-pp-medium)' }}>
                  {player.name}
                </h3>
              </div>
              <p className="text-gray-300 mb-4" style={{ fontFamily: 'var(--font-pp-regular)' }}>
                {player.description}
              </p>
              <div className="space-y-1">
                {player.examples.map((example, exampleIndex) => (
                  <div key={exampleIndex} className="text-sm text-gray-400" style={{ fontFamily: 'var(--font-pp-regular)' }}>
                    • {example}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Challenges */}
      <div className="lab-card p-8">
        <h2 className="text-2xl font-semibold text-white mb-6" style={{ fontFamily: 'var(--font-pp-medium)' }}>
          Current Challenges
        </h2>
        <div className="space-y-3">
          {insights.challenges.map((challenge, index) => (
            <div key={index} className="flex items-start gap-3">
              <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2 flex-shrink-0"></div>
              <span className="text-gray-300" style={{ fontFamily: 'var(--font-pp-regular)' }}>
                {challenge}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Future Outlook */}
      <div className="lab-card p-8">
        <h2 className="text-2xl font-semibold text-white mb-6" style={{ fontFamily: 'var(--font-pp-medium)' }}>
          {insights.futureOutlook.title}
        </h2>
        <p className="text-gray-300 mb-6" style={{ fontFamily: 'var(--font-pp-regular)' }}>
          {insights.futureOutlook.description}
        </p>
        <div className="space-y-3">
          {insights.futureOutlook.predictions.map((prediction, index) => (
            <div key={index} className="flex items-start gap-3">
              <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
              <span className="text-gray-300" style={{ fontFamily: 'var(--font-pp-regular)' }}>
                {prediction}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* How to Get Involved */}
      <div className="lab-card p-8">
        <h2 className="text-2xl font-semibold text-white mb-6" style={{ fontFamily: 'var(--font-pp-medium)' }}>
          How to Get Involved
        </h2>
        <div className="grid md:grid-cols-2 gap-4">
          {insights.howToGetInvolved.map((action, index) => (
            <div key={index} className="flex items-center gap-3 p-3 bg-gray-800 rounded-lg">
              <FiStar className="w-4 h-4 text-orange-500" />
              <span className="text-gray-300" style={{ fontFamily: 'var(--font-pp-regular)' }}>
                {action}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Call to Action */}
      <div className="text-center lab-card p-8">
        <h2 className="text-2xl font-semibold text-white mb-4" style={{ fontFamily: 'var(--font-pp-medium)' }}>
          Ready to Be Part of Jordan's AI Future?
        </h2>
        <p className="text-gray-300 mb-6" style={{ fontFamily: 'var(--font-pp-regular)' }}>
          Join me in building the future of AI from Jordan. Let's create innovative solutions that make a global impact.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button className="lab-button">
            Start Your AI Project
          </button>
          <button className="px-8 py-3 border border-orange-500 text-orange-500 rounded-lg font-semibold hover:bg-orange-500 hover:text-black transition-all duration-300">
            Learn More About AI
          </button>
        </div>
      </div>
    </motion.div>
  );
}