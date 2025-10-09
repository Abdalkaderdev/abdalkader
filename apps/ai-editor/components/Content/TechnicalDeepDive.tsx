import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiCode, FiPlay, FiCopy, FiCheck, FiExternalLink, FiBookOpen } from 'react-icons/fi';

interface TechnicalDeepDiveProps {
  article: {
    title: string;
    description: string;
    problemStatement: string;
    technicalApproach: string;
    codeExamples: {
      language: string;
      code: string;
      explanation: string;
    }[];
    performanceMetrics: {
      metric: string;
      before: string;
      after: string;
      improvement: string;
    }[];
    bestPractices: string[];
    lessonsLearned: string[];
    relatedArticles: {
      title: string;
      url: string;
      description: string;
    }[];
  };
  className?: string;
}

export default function TechnicalDeepDive({ article, className = '' }: TechnicalDeepDiveProps) {
  const [activeCodeExample, setActiveCodeExample] = useState(0);
  const [copiedCode, setCopiedCode] = useState<number | null>(null);

  const copyToClipboard = async (code: string, index: number) => {
    try {
      await navigator.clipboard.writeText(code);
      setCopiedCode(index);
      setTimeout(() => setCopiedCode(null), 2000);
    } catch (err) {
      console.error('Failed to copy code:', err);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`lab-card p-8 ${className}`}
    >
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <FiCode className="w-8 h-8 text-orange-500" />
          <h1 className="text-3xl font-bold text-white" style={{ fontFamily: 'var(--font-pp-medium)' }}>
            {article.title}
          </h1>
        </div>
        <p className="text-xl text-gray-300" style={{ fontFamily: 'var(--font-pp-regular)' }}>
          {article.description}
        </p>
      </div>

      {/* Problem Statement */}
      <div className="mb-8">
        <h2 className="text-2xl font-semibold text-white mb-4 flex items-center gap-2" style={{ fontFamily: 'var(--font-pp-medium)' }}>
          <div className="w-2 h-2 bg-red-500 rounded-full"></div>
          Problem Statement
        </h2>
        <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-6">
          <p className="text-gray-300" style={{ fontFamily: 'var(--font-pp-regular)' }}>
            {article.problemStatement}
          </p>
        </div>
      </div>

      {/* Technical Approach */}
      <div className="mb-8">
        <h2 className="text-2xl font-semibold text-white mb-4 flex items-center gap-2" style={{ fontFamily: 'var(--font-pp-medium)' }}>
          <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
          Technical Approach
        </h2>
        <p className="text-gray-300 leading-relaxed" style={{ fontFamily: 'var(--font-pp-regular)' }}>
          {article.technicalApproach}
        </p>
      </div>

      {/* Code Examples */}
      <div className="mb-8">
        <h2 className="text-2xl font-semibold text-white mb-4 flex items-center gap-2" style={{ fontFamily: 'var(--font-pp-medium)' }}>
          <FiCode className="w-6 h-6 text-orange-500" />
          Code Examples
        </h2>
        
        {/* Code Example Tabs */}
        <div className="flex gap-2 mb-4">
          {article.codeExamples.map((example, index) => (
            <button
              key={index}
              onClick={() => setActiveCodeExample(index)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                activeCodeExample === index
                  ? 'bg-orange-500 text-black'
                  : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
              }`}
              style={{ fontFamily: 'var(--font-pp-medium)' }}
            >
              {example.language}
            </button>
          ))}
        </div>

        {/* Active Code Example */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeCodeExample}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="bg-gray-900 rounded-lg overflow-hidden"
          >
            <div className="flex items-center justify-between bg-gray-800 px-4 py-2">
              <span className="text-sm text-gray-400" style={{ fontFamily: 'var(--font-pp-regular)' }}>
                {article.codeExamples[activeCodeExample].language}
              </span>
              <button
                onClick={() => copyToClipboard(article.codeExamples[activeCodeExample].code, activeCodeExample)}
                className="flex items-center gap-2 px-3 py-1 bg-gray-700 hover:bg-gray-600 text-gray-300 rounded text-sm transition-colors"
              >
                {copiedCode === activeCodeExample ? (
                  <>
                    <FiCheck className="w-4 h-4" />
                    Copied!
                  </>
                ) : (
                  <>
                    <FiCopy className="w-4 h-4" />
                    Copy
                  </>
                )}
              </button>
            </div>
            <pre className="p-4 overflow-x-auto">
              <code className="text-gray-300 text-sm" style={{ fontFamily: 'var(--font-pp-regular)' }}>
                {article.codeExamples[activeCodeExample].code}
              </code>
            </pre>
            <div className="bg-gray-800 px-4 py-3 border-t border-gray-700">
              <p className="text-sm text-gray-300" style={{ fontFamily: 'var(--font-pp-regular)' }}>
                {article.codeExamples[activeCodeExample].explanation}
              </p>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Performance Metrics */}
      <div className="mb-8">
        <h2 className="text-2xl font-semibold text-white mb-4 flex items-center gap-2" style={{ fontFamily: 'var(--font-pp-medium)' }}>
          <FiPlay className="w-6 h-6 text-green-500" />
          Performance Metrics
        </h2>
        <div className="grid md:grid-cols-2 gap-4">
          {article.performanceMetrics.map((metric, index) => (
            <div key={index} className="bg-gray-800 rounded-lg p-4">
              <div className="text-sm text-gray-400 mb-2" style={{ fontFamily: 'var(--font-pp-regular)' }}>
                {metric.metric}
              </div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-300" style={{ fontFamily: 'var(--font-pp-regular)' }}>
                  Before: {metric.before}
                </span>
                <span className="text-gray-300" style={{ fontFamily: 'var(--font-pp-regular)' }}>
                  After: {metric.after}
                </span>
              </div>
              <div className="text-orange-400 font-semibold" style={{ fontFamily: 'var(--font-pp-medium)' }}>
                {metric.improvement} improvement
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Best Practices */}
      <div className="mb-8">
        <h2 className="text-2xl font-semibold text-white mb-4" style={{ fontFamily: 'var(--font-pp-medium)' }}>
          Best Practices
        </h2>
        <div className="space-y-3">
          {article.bestPractices.map((practice, index) => (
            <div key={index} className="flex items-start gap-3">
              <div className="w-2 h-2 bg-orange-500 rounded-full mt-2 flex-shrink-0"></div>
              <span className="text-gray-300" style={{ fontFamily: 'var(--font-pp-regular)' }}>
                {practice}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Lessons Learned */}
      <div className="mb-8">
        <h2 className="text-2xl font-semibold text-white mb-4" style={{ fontFamily: 'var(--font-pp-medium)' }}>
          Lessons Learned
        </h2>
        <div className="space-y-3">
          {article.lessonsLearned.map((lesson, index) => (
            <div key={index} className="flex items-start gap-3">
              <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
              <span className="text-gray-300" style={{ fontFamily: 'var(--font-pp-regular)' }}>
                {lesson}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Related Articles */}
      <div>
        <h2 className="text-2xl font-semibold text-white mb-4 flex items-center gap-2" style={{ fontFamily: 'var(--font-pp-medium)' }}>
          <FiBookOpen className="w-6 h-6 text-purple-500" />
          Related Articles
        </h2>
        <div className="space-y-3">
          {article.relatedArticles.map((related, index) => (
            <a
              key={index}
              href={related.url}
              className="block p-4 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors group"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-white font-semibold group-hover:text-orange-400 transition-colors" style={{ fontFamily: 'var(--font-pp-medium)' }}>
                    {related.title}
                  </h3>
                  <p className="text-gray-400 text-sm mt-1" style={{ fontFamily: 'var(--font-pp-regular)' }}>
                    {related.description}
                  </p>
                </div>
                <FiExternalLink className="w-4 h-4 text-gray-400 group-hover:text-orange-400 transition-colors" />
              </div>
            </a>
          ))}
        </div>
      </div>
    </motion.div>
  );
}