import { motion } from 'framer-motion';
import { FiTrendingUp, FiUsers, FiDollarSign, FiClock, FiCode, FiTarget } from 'react-icons/fi';

interface ProjectCaseStudyProps {
  project: {
    title: string;
    client: string;
    industry: string;
    challenge: string;
    solution: string;
    implementation: string;
    results: {
      metric: string;
      improvement: string;
      businessValue: string;
    };
    technicalDetails: string[];
    businessImpact: string[];
    duration: string;
    teamSize: number;
    technologies: string[];
  };
  className?: string;
}

export default function ProjectCaseStudy({ project, className = '' }: ProjectCaseStudyProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`lab-card p-8 ${className}`}
    >
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-2">
          <FiTarget className="w-6 h-6 text-orange-500" />
          <h2 className="text-2xl font-semibold text-white" style={{ fontFamily: 'var(--font-pp-medium)' }}>
            {project.title}
          </h2>
        </div>
        <div className="text-gray-400" style={{ fontFamily: 'var(--font-pp-regular)' }}>
          {project.client} • {project.industry}
        </div>
      </div>

      {/* Project Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="text-center p-4 bg-gray-800 rounded-lg">
          <FiClock className="w-6 h-6 text-blue-400 mx-auto mb-2" />
          <div className="text-lg font-semibold text-white" style={{ fontFamily: 'var(--font-pp-medium)' }}>
            {project.duration}
          </div>
          <div className="text-xs text-gray-400" style={{ fontFamily: 'var(--font-pp-regular)' }}>
            Duration
          </div>
        </div>
        <div className="text-center p-4 bg-gray-800 rounded-lg">
          <FiUsers className="w-6 h-6 text-green-400 mx-auto mb-2" />
          <div className="text-lg font-semibold text-white" style={{ fontFamily: 'var(--font-pp-medium)' }}>
            {project.teamSize}
          </div>
          <div className="text-xs text-gray-400" style={{ fontFamily: 'var(--font-pp-regular)' }}>
            Team Size
          </div>
        </div>
        <div className="text-center p-4 bg-gray-800 rounded-lg">
          <FiTrendingUp className="w-6 h-6 text-purple-400 mx-auto mb-2" />
          <div className="text-lg font-semibold text-white" style={{ fontFamily: 'var(--font-pp-medium)' }}>
            {project.results.improvement}
          </div>
          <div className="text-xs text-gray-400" style={{ fontFamily: 'var(--font-pp-regular)' }}>
            Improvement
          </div>
        </div>
        <div className="text-center p-4 bg-gray-800 rounded-lg">
          <FiDollarSign className="w-6 h-6 text-yellow-400 mx-auto mb-2" />
          <div className="text-lg font-semibold text-white" style={{ fontFamily: 'var(--font-pp-medium)' }}>
            ROI
          </div>
          <div className="text-xs text-gray-400" style={{ fontFamily: 'var(--font-pp-regular)' }}>
            Positive
          </div>
        </div>
      </div>

      {/* Challenge & Solution */}
      <div className="grid md:grid-cols-2 gap-8 mb-8">
        <div>
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2" style={{ fontFamily: 'var(--font-pp-medium)' }}>
            <div className="w-2 h-2 bg-red-500 rounded-full"></div>
            The Challenge
          </h3>
          <p className="text-gray-300" style={{ fontFamily: 'var(--font-pp-regular)' }}>
            {project.challenge}
          </p>
        </div>
        <div>
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2" style={{ fontFamily: 'var(--font-pp-medium)' }}>
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            Our Solution
          </h3>
          <p className="text-gray-300" style={{ fontFamily: 'var(--font-pp-regular)' }}>
            {project.solution}
          </p>
        </div>
      </div>

      {/* Implementation */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2" style={{ fontFamily: 'var(--font-pp-medium)' }}>
          <FiCode className="w-5 h-5 text-orange-500" />
          Implementation Approach
        </h3>
        <p className="text-gray-300" style={{ fontFamily: 'var(--font-pp-regular)' }}>
          {project.implementation}
        </p>
      </div>

      {/* Results */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold text-white mb-4" style={{ fontFamily: 'var(--font-pp-medium)' }}>
          Measurable Results
        </h3>
        <div className="bg-gradient-to-r from-orange-500/10 to-red-500/10 border border-orange-500/30 rounded-lg p-6">
          <div className="text-center mb-4">
            <div className="text-3xl font-bold text-orange-500 mb-2" style={{ fontFamily: 'var(--font-pp-medium)' }}>
              {project.results.metric}
            </div>
            <div className="text-lg text-white" style={{ fontFamily: 'var(--font-pp-regular)' }}>
              {project.results.improvement} improvement
            </div>
          </div>
          <p className="text-gray-300 text-center" style={{ fontFamily: 'var(--font-pp-regular)' }}>
            {project.results.businessValue}
          </p>
        </div>
      </div>

      {/* Technical Details */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold text-white mb-4" style={{ fontFamily: 'var(--font-pp-medium)' }}>
          Technical Implementation
        </h3>
        <div className="space-y-2">
          {project.technicalDetails.map((detail, index) => (
            <div key={index} className="flex items-start gap-3">
              <div className="w-2 h-2 bg-orange-500 rounded-full mt-2 flex-shrink-0"></div>
              <span className="text-gray-300" style={{ fontFamily: 'var(--font-pp-regular)' }}>
                {detail}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Technologies Used */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold text-white mb-4" style={{ fontFamily: 'var(--font-pp-medium)' }}>
          Technologies Used
        </h3>
        <div className="flex flex-wrap gap-2">
          {project.technologies.map((tech, index) => (
            <span
              key={index}
              className="px-3 py-1 bg-gray-800 text-gray-300 rounded-full text-sm"
              style={{ fontFamily: 'var(--font-pp-regular)' }}
            >
              {tech}
            </span>
          ))}
        </div>
      </div>

      {/* Business Impact */}
      <div>
        <h3 className="text-lg font-semibold text-white mb-4" style={{ fontFamily: 'var(--font-pp-medium)' }}>
          Business Impact
        </h3>
        <div className="space-y-2">
          {project.businessImpact.map((impact, index) => (
            <div key={index} className="flex items-start gap-3">
              <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
              <span className="text-gray-300" style={{ fontFamily: 'var(--font-pp-regular)' }}>
                {impact}
              </span>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}