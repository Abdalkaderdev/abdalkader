import { motion } from 'framer-motion';
import Link from 'next/link';
import { FiHome, FiArrowLeft, FiSearch } from 'react-icons/fi';
import SEOHead from '../components/SEO/Head';

export default function Custom404() {
  return (
    <>
      <SEOHead 
        title="404 - Page Not Found"
        description="The page you're looking for doesn't exist. Return to the AI Lab to explore our experiments."
        noIndex={true}
      />
      
      <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black flex items-center justify-center">
        <div className="text-center px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            {/* 404 Animation */}
            <div className="mb-8">
              <motion.div
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="text-8xl font-bold gradient-text mb-4"
                style={{ fontFamily: 'var(--font-pp-medium)' }}
              >
                404
              </motion.div>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="w-32 h-1 bg-gradient-to-r from-orange-500 to-red-500 mx-auto rounded-full"
              />
            </div>

            {/* Error Message */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="mb-8"
            >
              <h1 className="text-3xl font-bold text-white mb-4" style={{ fontFamily: 'var(--font-pp-medium)' }}>
                Experiment Not Found
              </h1>
              <p className="text-xl text-gray-300 mb-6 max-w-md mx-auto" style={{ fontFamily: 'var(--font-pp-regular)' }}>
                The AI experiment you're looking for doesn't exist. It might have been moved, deleted, or never existed.
              </p>
            </motion.div>

            {/* Action Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="flex flex-col sm:flex-row gap-4 justify-center items-center"
            >
              <Link
                href="/"
                className="lab-button flex items-center gap-2"
              >
                <FiHome className="w-5 h-5" />
                Back to Lab
              </Link>
              
              <Link
                href="/playground"
                className="px-6 py-3 border border-orange-500 text-orange-500 rounded-lg font-semibold hover:bg-orange-500 hover:text-black transition-all duration-300 flex items-center gap-2"
              >
                <FiSearch className="w-5 h-5" />
                Explore Experiments
              </Link>
            </motion.div>

            {/* Helpful Links */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.7 }}
              className="mt-12"
            >
              <p className="text-gray-400 mb-4" style={{ fontFamily: 'var(--font-pp-regular)' }}>
                Popular experiments:
              </p>
              <div className="flex flex-wrap justify-center gap-2">
                <Link
                  href="/playground"
                  className="px-4 py-2 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-lg transition-colors text-sm"
                >
                  Component Playground
                </Link>
                <Link
                  href="/generate"
                  className="px-4 py-2 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-lg transition-colors text-sm"
                >
                  AI Code Generator
                </Link>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </>
  );
}