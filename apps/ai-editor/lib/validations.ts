import { z } from 'zod';

// Lead capture form validation
export const leadCaptureSchema = z.object({
  email: z
    .string()
    .min(1, 'Email is required')
    .email('Please enter a valid email address'),
  interest: z
    .string()
    .min(1, 'Please select your project focus'),
  company: z
    .string()
    .optional(),
  message: z
    .string()
    .max(500, 'Message must be less than 500 characters')
    .optional(),
  budget: z
    .enum(['under-10k', '10k-50k', '50k-100k', '100k-plus', 'not-sure'])
    .optional(),
  timeline: z
    .enum(['asap', '1-3-months', '3-6-months', '6-plus-months', 'exploring'])
    .optional()
});

export type LeadCaptureFormData = z.infer<typeof leadCaptureSchema>;

// Contact form validation
export const contactSchema = z.object({
  name: z
    .string()
    .min(2, 'Name must be at least 2 characters')
    .max(50, 'Name must be less than 50 characters'),
  email: z
    .string()
    .min(1, 'Email is required')
    .email('Please enter a valid email address'),
  company: z
    .string()
    .max(100, 'Company name must be less than 100 characters')
    .optional(),
  phone: z
    .string()
    .regex(/^[\+]?[1-9][\d]{0,15}$/, 'Please enter a valid phone number')
    .optional(),
  subject: z
    .string()
    .min(5, 'Subject must be at least 5 characters')
    .max(100, 'Subject must be less than 100 characters'),
  message: z
    .string()
    .min(10, 'Message must be at least 10 characters')
    .max(1000, 'Message must be less than 1000 characters'),
  projectType: z
    .enum(['ai-integration', 'ml-model', 'computer-vision', 'nlp', 'consultation', 'other'])
    .optional(),
  budget: z
    .enum(['under-5k', '5k-15k', '15k-50k', '50k-plus', 'discuss'])
    .optional(),
  timeline: z
    .enum(['urgent', '1-month', '3-months', '6-months', 'flexible'])
    .optional()
});

export type ContactFormData = z.infer<typeof contactSchema>;

// Newsletter subscription validation
export const newsletterSchema = z.object({
  email: z
    .string()
    .min(1, 'Email is required')
    .email('Please enter a valid email address'),
  interests: z
    .array(z.string())
    .min(1, 'Please select at least one interest')
    .max(5, 'Please select no more than 5 interests'),
  frequency: z
    .enum(['weekly', 'monthly', 'quarterly'])
    .default('monthly')
});

export type NewsletterFormData = z.infer<typeof newsletterSchema>;

// Experiment feedback validation
export const experimentFeedbackSchema = z.object({
  experimentId: z.string().min(1, 'Experiment ID is required'),
  rating: z
    .number()
    .min(1, 'Rating must be at least 1')
    .max(5, 'Rating must be at most 5'),
  feedback: z
    .string()
    .min(10, 'Feedback must be at least 10 characters')
    .max(500, 'Feedback must be less than 500 characters')
    .optional(),
  difficulty: z
    .enum(['beginner', 'intermediate', 'advanced'])
    .optional(),
  wouldRecommend: z.boolean().optional()
});

export type ExperimentFeedbackFormData = z.infer<typeof experimentFeedbackSchema>;

// Search form validation
export const searchSchema = z.object({
  query: z
    .string()
    .min(1, 'Search query is required')
    .max(100, 'Search query must be less than 100 characters'),
  category: z
    .enum(['all', 'computer-vision', 'nlp', 'reinforcement-learning', 'generative-ai', 'optimization'])
    .default('all'),
  difficulty: z
    .enum(['all', 'beginner', 'intermediate', 'advanced'])
    .default('all'),
  status: z
    .enum(['all', 'active', 'coming-soon', 'archived'])
    .default('all')
});

export type SearchFormData = z.infer<typeof searchSchema>;

// Performance monitoring validation
export const performanceConfigSchema = z.object({
  enableMonitoring: z.boolean().default(true),
  enableAlerts: z.boolean().default(true),
  alertThresholds: z.object({
    lcp: z.number().min(1000).max(5000).default(2000),
    fid: z.number().min(50).max(500).default(100),
    cls: z.number().min(0.01).max(1.0).default(0.1),
    bundleSize: z.number().min(50000).max(500000).default(150000)
  }),
  reportingInterval: z.number().min(1000).max(60000).default(5000)
});

export type PerformanceConfigFormData = z.infer<typeof performanceConfigSchema>;