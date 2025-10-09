import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiX, FiMail, FiBriefcase } from 'react-icons/fi';
import AccessibleButton from '../AccessibleButton';

export default function StickyCTA() {
  const [isVisible, setIsVisible] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (!isDismissed) {
        setIsVisible(true);
      }
    }, 5000); // Show after 5 seconds

    return () => clearTimeout(timer);
  }, [isDismissed]);

  const handleDismiss = () => {
    setIsVisible(false);
    setIsDismissed(true);
    // Store dismissal in localStorage
    localStorage.setItem('cta-dismissed', 'true');
  };

  useEffect(() => {
    const dismissed = localStorage.getItem('cta-dismissed');
    if (dismissed === 'true') {
      setIsDismissed(true);
    }
  }, []);

  if (!isVisible || isDismissed) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 100 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 100 }}
        className="fixed bottom-4 right-4 z-50 max-w-sm"
      >
        <div className="bg-gray-900 border border-orange-500/30 rounded-lg p-4 shadow-xl">
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center gap-2">
              <FiBriefcase className="w-5 h-5 text-orange-500" />
              <h3 className="text-sm font-semibold text-white" style={{ fontFamily: 'var(--font-pp-medium)' }}>
                Need AI Solutions?
              </h3>
            </div>
            <button
              onClick={handleDismiss}
              className="text-gray-400 hover:text-white transition-colors"
              aria-label="Dismiss notification"
            >
              <FiX className="w-4 h-4" />
            </button>
          </div>
          
          <p className="text-gray-300 text-sm mb-4" style={{ fontFamily: 'var(--font-pp-regular)' }}>
            Let's discuss how AI can transform your business. Free consultation available.
          </p>
          
          <div className="flex gap-2">
            <a
              href="mailto:hello@abdalkader.dev?subject=AI Consultation Request"
              className="flex-1 px-3 py-2 bg-orange-500 hover:bg-orange-600 text-black text-sm font-semibold rounded transition-colors text-center"
            >
              <FiMail className="w-4 h-4 inline mr-1" />
              Contact
            </a>
            <a
              href="/business"
              className="flex-1 px-3 py-2 border border-gray-600 text-gray-300 hover:border-orange-500 hover:text-orange-500 text-sm font-semibold rounded transition-colors text-center"
            >
              Learn More
            </a>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}