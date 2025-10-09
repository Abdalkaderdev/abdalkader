import { useState } from 'react';
import { motion } from 'framer-motion';
import { FiMail, FiDownload, FiExternalLink, FiCheck } from 'react-icons/fi';
import AccessibleButton from '../AccessibleButton';

interface LeadCaptureProps {
  variant?: 'hero' | 'sidebar' | 'modal';
  className?: string;
}

export default function LeadCapture({ variant = 'hero', className = '' }: LeadCaptureProps) {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [interest, setInterest] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    setIsSuccess(true);
    setIsSubmitting(false);
    
    // Reset after 3 seconds
    setTimeout(() => {
      setIsSuccess(false);
      setEmail('');
      setInterest('');
    }, 3000);
  };

  const getVariantStyles = () => {
    switch (variant) {
      case 'hero':
        return 'bg-gradient-to-r from-orange-500/10 to-red-500/10 border border-orange-500/30 p-8 rounded-xl';
      case 'sidebar':
        return 'bg-gray-800/50 border border-gray-700 p-6 rounded-lg';
      case 'modal':
        return 'bg-gray-900 border border-gray-700 p-8 rounded-xl';
      default:
        return 'bg-gray-800/50 border border-gray-700 p-6 rounded-lg';
    }
  };

  if (isSuccess) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className={`${getVariantStyles()} ${className}`}
      >
        <div className="text-center">
          <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <FiCheck className="w-8 h-8 text-white" />
          </div>
          <h3 className="text-xl font-semibold text-white mb-2" style={{ fontFamily: 'var(--font-pp-medium)' }}>
            Thank You!
          </h3>
          <p className="text-gray-300" style={{ fontFamily: 'var(--font-pp-regular)' }}>
            I'll be in touch within 24 hours to discuss your AI project needs.
          </p>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`${getVariantStyles()} ${className}`}
    >
      <div className="text-center mb-6">
        <h3 className="text-xl font-semibold text-white mb-2" style={{ fontFamily: 'var(--font-pp-medium)' }}>
          Ready to Build Something Amazing?
        </h3>
        <p className="text-gray-300 text-sm" style={{ fontFamily: 'var(--font-pp-regular)' }}>
          Let's discuss your AI project requirements and explore collaboration opportunities.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <input
            type="email"
            placeholder="your.email@company.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-orange-500 focus:outline-none"
            style={{ fontFamily: 'var(--font-pp-regular)' }}
          />
        </div>

        <div>
          <select
            value={interest}
            onChange={(e) => setInterest(e.target.value)}
            required
            className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white focus:border-orange-500 focus:outline-none"
            style={{ fontFamily: 'var(--font-pp-regular)' }}
          >
            <option value="">What's your project focus?</option>
            <option value="ai-integration">AI Integration for Existing App</option>
            <option value="ml-model">Custom ML Model Development</option>
            <option value="computer-vision">Computer Vision Solution</option>
            <option value="nlp">Natural Language Processing</option>
            <option value="ecommerce-ai">E-commerce AI Enhancement</option>
            <option value="consultation">AI Strategy Consultation</option>
            <option value="collaboration">Open Source Collaboration</option>
          </select>
        </div>

        <AccessibleButton
          type="submit"
          variant="primary"
          size="lg"
          loading={isSubmitting}
          className="w-full"
          ariaLabel="Submit project inquiry"
        >
          {isSubmitting ? 'Sending...' : 'Start Conversation'}
        </AccessibleButton>
      </form>

      <div className="mt-4 text-center">
        <p className="text-xs text-gray-400" style={{ fontFamily: 'var(--font-pp-regular)' }}>
          Based in Amman, Jordan • Available for remote collaboration
        </p>
      </div>
    </motion.div>
  );
}