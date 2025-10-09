import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiCode, FiBookOpen, FiZap, FiMapPin, FiChevronRight } from 'react-icons/fi';
import SEOHead from '../components/SEO/Head';
import JsonLd from '../components/SEO/JsonLd';
import LabNav from '../components/Navigation/LabNav';
import ProjectCaseStudy from '../components/Content/ProjectCaseStudy';
import TechnicalDeepDive from '../components/Content/TechnicalDeepDive';
import AIExplanation from '../components/Content/AIExplanation';
import JordanTechInsights from '../components/Content/JordanTechInsights';
import { useAccessibility } from '../hooks/useAccessibility';
import { labWebsiteJsonLd, personJsonLd } from '../utils/jsonld';
import { generateBusinessTitle, generateBusinessDescription, generateBusinessKeywords } from '../utils/businessSeo';

export default function ContentShowcase() {
  const [activeContent, setActiveContent] = useState<'case-study' | 'technical' | 'explanation' | 'insights'>('case-study');
  const { containerRef } = useAccessibility({
    enableKeyboardNavigation: true,
    enableScreenReaderAnnouncements: true
  });

  const contentTypes = [
    {
      id: 'case-study',
      title: 'Project Case Studies',
      description: 'Real-world AI implementations with business impact',
      icon: <FiBookOpen className="w-6 h-6" />,
      color: 'from-blue-500 to-cyan-500'
    },
    {
      id: 'technical',
      title: 'Technical Deep-Dives',
      description: 'In-depth technical content for developers',
      icon: <FiCode className="w-6 h-6" />,
      color: 'from-green-500 to-emerald-500'
    },
    {
      id: 'explanation',
      title: 'AI Explanations',
      description: 'Making AI accessible to non-technical audiences',
      icon: <FiZap className="w-6 h-6" />,
      color: 'from-purple-500 to-pink-500'
    },
    {
      id: 'insights',
      title: 'Jordan Tech Insights',
      description: 'Exploring Jordan\'s growing AI ecosystem',
      icon: <FiMapPin className="w-6 h-6" />,
      color: 'from-orange-500 to-red-500'
    }
  ];

  // Sample data for demonstration
  const sampleCaseStudy = {
    title: 'E-commerce AI Recommendation Engine',
    client: 'TechStart Dubai',
    industry: 'E-commerce',
    challenge: 'Low conversion rates due to poor product recommendations and high cart abandonment. Customers were struggling to find relevant products, leading to a 15% conversion rate and 70% cart abandonment.',
    solution: 'Developed a real-time AI recommendation engine using TensorFlow.js and collaborative filtering. The system analyzes user behavior, purchase history, and product attributes to provide personalized product suggestions.',
    implementation: 'Built a microservices architecture with real-time data processing. Implemented A/B testing framework to optimize recommendation algorithms. Integrated with existing e-commerce platform using RESTful APIs.',
    results: {
      metric: '40% increase in conversion rate',
      improvement: '40%',
      businessValue: 'estimated $2.3M additional revenue annually'
    },
    technicalDetails: [
      'TensorFlow.js for client-side ML inference',
      'Node.js microservices for recommendation API',
      'Redis for real-time caching and session management',
      'PostgreSQL for user behavior and product data',
      'Docker containerization for scalable deployment'
    ],
    businessImpact: [
      'Increased average order value by 25%',
      'Reduced cart abandonment rate to 45%',
      'Improved customer satisfaction scores by 30%',
      'Generated $2.3M additional annual revenue'
    ],
    duration: '3 months',
    teamSize: 4,
    technologies: ['TensorFlow.js', 'Node.js', 'PostgreSQL', 'Redis', 'Docker', 'AWS']
  };

  const sampleTechnicalArticle = {
    title: 'Optimizing TensorFlow.js Performance for Production',
    description: 'A comprehensive guide to maximizing TensorFlow.js performance in real-world applications',
    problemStatement: 'TensorFlow.js models often suffer from slow inference times and high memory usage in production environments, leading to poor user experience and high server costs.',
    technicalApproach: 'We implemented a multi-layered optimization strategy including model quantization, WebGL backend optimization, memory management, and caching strategies to achieve 3x performance improvement.',
    codeExamples: [
      {
        language: 'JavaScript',
        code: `// Model optimization with quantization
const model = await tf.loadLayersModel('model.json');
const quantizedModel = await model.quantize({
  inputRange: [0, 1],
  weightRange: [-1, 1]
});

// WebGL backend optimization
await tf.setBackend('webgl');
await tf.ready();

// Memory management
const disposeModel = () => {
  model.dispose();
  tf.disposeVariables();
};`,
        explanation: 'This code shows how to quantize a model for better performance and implement proper memory management to prevent memory leaks.'
      },
      {
        language: 'TypeScript',
        code: `interface ModelConfig {
  inputShape: number[];
  outputShape: number[];
  quantization: boolean;
  backend: 'webgl' | 'wasm' | 'cpu';
}

class OptimizedModel {
  private model: tf.LayersModel;
  private config: ModelConfig;

  async loadModel(path: string, config: ModelConfig) {
    this.config = config;
    await tf.setBackend(config.backend);
    this.model = await tf.loadLayersModel(path);
    
    if (config.quantization) {
      this.model = await this.quantizeModel();
    }
  }
}`,
        explanation: 'TypeScript interface and class for managing optimized models with proper configuration and quantization support.'
      }
    ],
    performanceMetrics: [
      {
        metric: 'Inference Time',
        before: '150ms',
        after: '45ms',
        improvement: '70% faster'
      },
      {
        metric: 'Memory Usage',
        before: '45MB',
        after: '18MB',
        improvement: '60% reduction'
      },
      {
        metric: 'Model Size',
        before: '12MB',
        after: '4.2MB',
        improvement: '65% smaller'
      }
    ],
    bestPractices: [
      'Always quantize models for production deployment',
      'Use WebGL backend for GPU acceleration when available',
      'Implement proper memory management with dispose() calls',
      'Cache model predictions to avoid redundant computations',
      'Monitor performance metrics in production'
    ],
    lessonsLearned: [
      'Quantization can reduce accuracy by 2-5% but improves performance significantly',
      'WebGL backend provides best performance but requires GPU support',
      'Memory leaks are common without proper cleanup',
      'A/B testing is crucial for performance optimization'
    ],
    relatedArticles: [
      {
        title: 'TensorFlow.js Model Deployment Best Practices',
        url: '/articles/tfjs-deployment',
        description: 'Learn how to deploy TensorFlow.js models efficiently'
      },
      {
        title: 'WebGL Optimization for Machine Learning',
        url: '/articles/webgl-optimization',
        description: 'Advanced WebGL techniques for ML applications'
      }
    ]
  };

  const sampleAIExplanation = {
    title: 'Machine Learning Explained Simply',
    simpleDefinition: 'Machine Learning is like teaching a computer to recognize patterns and make decisions, similar to how humans learn from experience.',
    realWorldAnalogy: 'Imagine teaching a child to recognize different types of fruits. You show them many examples of apples, bananas, and oranges. After seeing enough examples, the child can identify a new fruit they\'ve never seen before. Machine Learning works the same way - we feed the computer thousands of examples, and it learns to make predictions about new data.',
    businessApplications: [
      {
        industry: 'E-commerce',
        useCase: 'Product recommendations',
        benefit: 'Increase sales by 25-40%'
      },
      {
        industry: 'Healthcare',
        useCase: 'Medical diagnosis assistance',
        benefit: 'Improve accuracy by 30%'
      },
      {
        industry: 'Finance',
        useCase: 'Fraud detection',
        benefit: 'Reduce false positives by 50%'
      },
      {
        industry: 'Manufacturing',
        useCase: 'Quality control',
        benefit: 'Reduce defects by 60%'
      }
    ],
    benefits: [
      'Automates repetitive decision-making tasks',
      'Improves accuracy and consistency',
      'Scales to handle large amounts of data',
      'Learns and improves over time',
      'Reduces human error and bias'
    ],
    limitations: [
      'Requires large amounts of data to train',
      'Can be expensive to implement initially',
      'May not work well with small datasets',
      'Requires technical expertise to maintain',
      'Results can be difficult to interpret'
    ],
    gettingStarted: [
      {
        step: 'Identify a business problem',
        description: 'Look for repetitive tasks or decisions that could benefit from automation'
      },
      {
        step: 'Gather relevant data',
        description: 'Collect historical data related to your problem'
      },
      {
        step: 'Start with simple solutions',
        description: 'Begin with basic algorithms before moving to complex models'
      },
      {
        step: 'Measure and iterate',
        description: 'Track performance and continuously improve your solution'
      }
    ],
    nextSteps: [
      'Schedule a consultation to discuss your specific needs',
      'Explore our AI solutions for your industry',
      'Learn more about our implementation process',
      'See real-world examples of AI in action'
    ]
  };

  return (
    <>
      <SEOHead 
        title={generateBusinessTitle('content-showcase')}
        description={generateBusinessDescription('content-showcase')}
        keywords={generateBusinessKeywords('content-showcase')}
      />
      <JsonLd type="website" />
      <JsonLd type="person" />
      
      <div ref={containerRef as React.RefObject<HTMLDivElement>} className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black">
        <LabNav />
        <main className="container mx-auto px-4 py-16">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <h1 className="text-4xl md:text-6xl font-bold gradient-text mb-6" style={{ fontFamily: 'var(--font-pp-medium)' }}>
              Content Showcase
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto" style={{ fontFamily: 'var(--font-pp-regular)' }}>
              Explore different types of content that demonstrate my expertise and approach to AI solutions
            </p>
          </motion.div>

          {/* Content Type Selector */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
            {contentTypes.map((type) => (
              <button
                key={type.id}
                onClick={() => setActiveContent(type.id as any)}
                className={`p-6 rounded-lg transition-all duration-300 ${
                  activeContent === type.id
                    ? 'bg-gradient-to-r from-orange-500 to-red-500 text-black'
                    : 'bg-gray-800 hover:bg-gray-700 text-white'
                }`}
              >
                <div className="text-center">
                  <div className={`w-12 h-12 mx-auto mb-3 ${
                    activeContent === type.id ? 'text-black' : 'text-orange-500'
                  }`}>
                    {type.icon}
                  </div>
                  <h3 className="font-semibold mb-2" style={{ fontFamily: 'var(--font-pp-medium)' }}>
                    {type.title}
                  </h3>
                  <p className="text-sm opacity-80" style={{ fontFamily: 'var(--font-pp-regular)' }}>
                    {type.description}
                  </p>
                </div>
              </button>
            ))}
          </div>

          {/* Content Display */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeContent}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              {activeContent === 'case-study' && (
                <ProjectCaseStudy project={sampleCaseStudy} />
              )}
              
              {activeContent === 'technical' && (
                <TechnicalDeepDive article={sampleTechnicalArticle} />
              )}
              
              {activeContent === 'explanation' && (
                <AIExplanation concept={sampleAIExplanation} />
              )}
              
              {activeContent === 'insights' && (
                <JordanTechInsights />
              )}
            </motion.div>
          </AnimatePresence>

          {/* Navigation */}
          <div className="mt-12 text-center">
            <div className="flex items-center justify-center gap-4">
              <button className="lab-button">
                View All Content
              </button>
              <button className="px-8 py-3 border border-orange-500 text-orange-500 rounded-lg font-semibold hover:bg-orange-500 hover:text-black transition-all duration-300">
                Contact Me
              </button>
            </div>
          </div>
        </main>
      </div>
    </>
  );
}