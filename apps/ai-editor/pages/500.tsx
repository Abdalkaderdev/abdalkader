import { motion } from 'framer-motion';
import Link from 'next/link';
import { FiHome, FiRefreshCw, FiAlertTriangle } from 'react-icons/fi';
import SEOHead from '../components/SEO/Head';

export default function Custom500() {
  return (
    <>
      <SEOHead 
        title="500 - Server Error"
        description="Something went wrong on our end. Please try again or return to the AI Lab."
        noIndex={true}
      />
      
      <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black flex items-center justify-center">
        <div className="text-center px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            {/* Error Icon */}
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="mb-8"
            >
              <div className="w-24 h-24 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <FiAlertTriangle className="w-12 h-12 text-red-500" />
              </div>
              <div className="text-6xl font-bold text-red-500 mb-4" style={{ fontFamily: 'var(--font-pp-medium)' }}>
                500
              </div>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="w-32 h-1 bg-gradient-to-r from-red-500 to-orange-500 mx-auto rounded-full"
              />
            </motion.div>

            {/* Error Message */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="mb-8"
            >
              <h1 className="text-3xl font-bold text-white mb-4" style={{ fontFamily: 'var(--font-pp-medium)' }}>
                AI Lab Malfunction
              </h1>
              <p className="text-xl text-gray-300 mb-6 max-w-md mx-auto" style={{ fontFamily: 'var(--font-pp-regular)' }}>
                Something went wrong with our AI systems. Our neural networks are working to fix this issue.
              </p>
            </motion.div>

            {/* Action Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="flex flex-col sm:flex-row gap-4 justify-center items-center"
            >
              <button
                onClick={() => window.location.reload()}
                className="lab-button flex items-center gap-2"
              >
                <FiRefreshCw className="w-5 h-5" />
                Try Again
              </button>
              
              <Link
                href="/"
                className="px-6 py-3 border border-orange-500 text-orange-500 rounded-lg font-semibold hover:bg-orange-500 hover:text-black transition-all duration-300 flex items-center gap-2"
              >
                <FiHome className="w-5 h-5" />
                Back to Lab
              </Link>
            </motion.div>

            {/* Status Info */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.7 }}
              className="mt-12"
            >
              <div className="bg-gray-800/50 rounded-lg p-4 max-w-md mx-auto">
                <p className="text-gray-400 text-sm mb-2" style={{ fontFamily: 'var(--font-pp-regular)' }}>
                  System Status:
                </p>
                <div className="flex items-center justify-center gap-2">
                  <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                  <span className="text-red-400 text-sm">Neural networks offline</span>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </>
  );
}