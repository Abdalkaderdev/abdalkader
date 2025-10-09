import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion } from 'framer-motion';
import { FiMail, FiDownload, FiExternalLink, FiCheck, FiAlertCircle } from 'react-icons/fi';
import AccessibleButton from '../AccessibleButton';
import { leadCaptureSchema, type LeadCaptureFormData } from '../../lib/validations';

interface LeadCaptureProps {
  variant?: 'hero' | 'sidebar' | 'modal';
  className?: string;
}

export default function LeadCapture({ variant = 'hero', className = '' }: LeadCaptureProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting: isFormSubmitting },
    reset,
    watch
  } = useForm<LeadCaptureFormData>({
    resolver: zodResolver(leadCaptureSchema),
    defaultValues: {
      email: '',
      interest: '',
      company: '',
      message: '',
      budget: 'not-sure',
      timeline: 'exploring'
    }
  });

  const onSubmit = async (data: LeadCaptureFormData) => {
    setIsSubmitting(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Track lead generation
      if (typeof window !== 'undefined' && (window as any).trackLeadGeneration) {
        (window as any).trackLeadGeneration('lead_capture_form', data.interest);
      }
      
      setIsSuccess(true);
      reset();
      
      // Reset success state after 3 seconds
      setTimeout(() => {
        setIsSuccess(false);
      }, 3000);
    } catch (error) {
      console.error('Lead capture error:', error);
    } finally {
      setIsSubmitting(false);
    }
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

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Email Field */}
        <div>
          <input
            {...register('email')}
            type="email"
            placeholder="your.email@company.com"
            className={`w-full px-4 py-3 bg-gray-800 border rounded-lg text-white placeholder-gray-400 focus:outline-none transition-colors ${
              errors.email 
                ? 'border-red-500 focus:border-red-500' 
                : 'border-gray-600 focus:border-orange-500'
            }`}
            style={{ fontFamily: 'var(--font-pp-regular)' }}
          />
          {errors.email && (
            <div className="flex items-center gap-1 mt-1 text-red-400 text-sm">
              <FiAlertCircle className="w-4 h-4" />
              <span style={{ fontFamily: 'var(--font-pp-regular)' }}>
                {errors.email.message}
              </span>
            </div>
          )}
        </div>

        {/* Interest Field */}
        <div>
          <select
            {...register('interest')}
            className={`w-full px-4 py-3 bg-gray-800 border rounded-lg text-white focus:outline-none transition-colors ${
              errors.interest 
                ? 'border-red-500 focus:border-red-500' 
                : 'border-gray-600 focus:border-orange-500'
            }`}
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
          {errors.interest && (
            <div className="flex items-center gap-1 mt-1 text-red-400 text-sm">
              <FiAlertCircle className="w-4 h-4" />
              <span style={{ fontFamily: 'var(--font-pp-regular)' }}>
                {errors.interest.message}
              </span>
            </div>
          )}
        </div>

        {/* Company Field (Optional) */}
        <div>
          <input
            {...register('company')}
            type="text"
            placeholder="Company name (optional)"
            className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-orange-500 focus:outline-none transition-colors"
            style={{ fontFamily: 'var(--font-pp-regular)' }}
          />
        </div>

        {/* Message Field (Optional) */}
        <div>
          <textarea
            {...register('message')}
            placeholder="Tell me about your project (optional)"
            rows={3}
            className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-orange-500 focus:outline-none transition-colors resize-none"
            style={{ fontFamily: 'var(--font-pp-regular)' }}
          />
          {errors.message && (
            <div className="flex items-center gap-1 mt-1 text-red-400 text-sm">
              <FiAlertCircle className="w-4 h-4" />
              <span style={{ fontFamily: 'var(--font-pp-regular)' }}>
                {errors.message.message}
              </span>
            </div>
          )}
        </div>

        <AccessibleButton
          type="submit"
          variant="primary"
          size="lg"
          loading={isSubmitting || isFormSubmitting}
          className="w-full"
          ariaLabel="Submit project inquiry"
        >
          {isSubmitting || isFormSubmitting ? 'Sending...' : 'Start Conversation'}
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