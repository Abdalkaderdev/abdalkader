import { motion } from 'framer-motion';
import { FiBriefcase, FiTrendingUp, FiUsers, FiGlobe, FiAward, FiCode } from 'react-icons/fi';
import SEOHead from '../components/SEO/Head';
import JsonLd from '../components/SEO/JsonLd';
import LeadCapture from '../components/Business/LeadCapture';
import AuthorityIndicators from '../components/Business/AuthorityIndicators';
import ClientTestimonials from '../components/Business/ClientTestimonials';
import RegionalExpertise from '../components/Business/RegionalExpertise';
import LabNav from '../components/Navigation/LabNav';
import { useAccessibility } from '../hooks/useAccessibility';
import { labWebsiteJsonLd, personJsonLd } from '../utils/jsonld';
import { generateBusinessTitle, generateBusinessDescription, generateBusinessKeywords } from '../utils/businessSeo';

export default function BusinessPage() {
  const { containerRef } = useAccessibility({
    enableKeyboardNavigation: true,
    enableScreenReaderAnnouncements: true
  });

  const businessSolutions = [
    {
      icon: <FiBriefcase className="w-8 h-8" />,
      title: "AI-Powered E-commerce",
      description: "Increase conversion rates by 40% with personalized product recommendations and intelligent search",
      technologies: ["TensorFlow.js", "Recommendation Engines", "Real-time Analytics"],
      benefits: ["Higher Conversion", "Better UX", "Increased Revenue"],
      color: "from-blue-500 to-cyan-500"
    },
    {
      icon: <FiTrendingUp className="w-8 h-8" />,
      title: "Predictive Analytics",
      description: "Forecast business trends and customer behavior with advanced machine learning models",
      technologies: ["Time Series Analysis", "Deep Learning", "Data Visualization"],
      benefits: ["Better Decisions", "Risk Mitigation", "Growth Planning"],
      color: "from-green-500 to-emerald-500"
    },
    {
      icon: <FiUsers className="w-8 h-8" />,
      title: "Customer Intelligence",
      description: "Understand your customers better with AI-driven insights and automated segmentation",
      technologies: ["NLP", "Clustering", "Sentiment Analysis"],
      benefits: ["Customer Retention", "Personalization", "Loyalty Programs"],
      color: "from-purple-500 to-pink-500"
    },
    {
      icon: <FiGlobe className="w-8 h-8" />,
      title: "Computer Vision",
      description: "Automate quality control, inventory management, and security with visual AI systems",
      technologies: ["Object Detection", "Image Classification", "Real-time Processing"],
      benefits: ["Cost Reduction", "Quality Assurance", "Automation"],
      color: "from-orange-500 to-red-500"
    },
    {
      icon: <FiAward className="w-8 h-8" />,
      title: "Process Optimization",
      description: "Streamline operations and reduce costs with intelligent automation and workflow optimization",
      technologies: ["Process Mining", "Optimization Algorithms", "RPA Integration"],
      benefits: ["Efficiency Gains", "Cost Savings", "Scalability"],
      color: "from-indigo-500 to-purple-500"
    },
    {
      icon: <FiCode className="w-8 h-8" />,
      title: "Custom AI Solutions",
      description: "Tailored AI implementations designed specifically for your business needs and industry",
      technologies: ["Custom Models", "API Integration", "Cloud Deployment"],
      benefits: ["Competitive Advantage", "Scalable Solutions", "Future-Proof"],
      color: "from-teal-500 to-cyan-500"
    }
  ];

  return (
    <>
      <SEOHead 
        title={generateBusinessTitle('business')}
        description={generateBusinessDescription('business')}
        keywords={generateBusinessKeywords('business')}
      />
      <JsonLd type="website" />
      <JsonLd type="person" />
      
      <div ref={containerRef as React.RefObject<HTMLDivElement>} className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black">
        <LabNav />
        <main className="container mx-auto px-4 py-16">
          {/* Hero Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h1 className="text-5xl font-bold gradient-text mb-6" style={{ fontFamily: 'var(--font-pp-medium)' }}>
              AI Business Solutions
            </h1>
            <p className="text-xl text-gray-300 max-w-4xl mx-auto mb-8" style={{ fontFamily: 'var(--font-pp-regular)' }}>
              Transform your business with cutting-edge AI solutions. From e-commerce optimization to predictive analytics, 
              I help companies across the Middle East leverage artificial intelligence for growth and efficiency.
            </p>
            <div className="flex items-center justify-center gap-4 text-sm text-gray-400">
              <span>📍 Based in Amman, Jordan</span>
              <span>•</span>
              <span>🌍 Serving MENA Region</span>
              <span>•</span>
              <span>💼 50+ Projects Delivered</span>
            </div>
          </motion.div>

          {/* Business Solutions Grid */}
          <section 
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16"
            aria-labelledby="solutions-heading"
          >
            <h2 id="solutions-heading" className="sr-only">
              AI Business Solutions
            </h2>
            {businessSolutions.map((solution, index) => (
              <motion.div
                key={solution.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <div className="lab-card p-8 h-full flex flex-col">
                  <div className={`w-16 h-16 rounded-lg bg-gradient-to-r ${solution.color} flex items-center justify-center text-white mb-6`}>
                    {solution.icon}
                  </div>
                  
                  <h3 className="text-xl font-semibold text-white mb-4" style={{ fontFamily: 'var(--font-pp-medium)' }}>
                    {solution.title}
                  </h3>
                  
                  <p className="text-gray-300 mb-6 flex-1" style={{ fontFamily: 'var(--font-pp-regular)' }}>
                    {solution.description}
                  </p>

                  <div className="space-y-4">
                    <div>
                      <h4 className="text-sm font-semibold text-gray-400 mb-2" style={{ fontFamily: 'var(--font-pp-medium)' }}>
                        Technologies:
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {solution.technologies.map((tech, techIndex) => (
                          <span
                            key={techIndex}
                            className="px-2 py-1 bg-gray-700 text-gray-300 rounded text-xs"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h4 className="text-sm font-semibold text-gray-400 mb-2" style={{ fontFamily: 'var(--font-pp-medium)' }}>
                        Benefits:
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {solution.benefits.map((benefit, benefitIndex) => (
                          <span
                            key={benefitIndex}
                            className="px-2 py-1 bg-orange-500/20 text-orange-400 rounded text-xs"
                          >
                            {benefit}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </section>

          {/* Authority Indicators */}
          <AuthorityIndicators />

          {/* Lead Capture */}
          <LeadCapture variant="hero" />

          {/* Client Testimonials */}
          <ClientTestimonials />

          {/* Regional Expertise */}
          <RegionalExpertise />

          {/* CTA Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mt-16"
          >
            <div className="lab-card p-12">
              <h2 className="text-3xl font-bold text-white mb-4" style={{ fontFamily: 'var(--font-pp-medium)' }}>
                Ready to Transform Your Business?
              </h2>
              <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto" style={{ fontFamily: 'var(--font-pp-regular)' }}>
                Let's discuss how AI can drive growth and efficiency in your organization. 
                I offer free consultations for qualified projects.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a
                  href="mailto:hello@abdalkader.dev"
                  className="lab-button inline-flex items-center justify-center"
                >
                  Schedule Free Consultation
                </a>
                <a
                  href="/experiments"
                  className="px-8 py-3 border border-orange-500 text-orange-500 rounded-lg font-semibold hover:bg-orange-500 hover:text-black transition-all duration-300 inline-flex items-center justify-center"
                >
                  Explore AI Experiments
                </a>
              </div>
            </div>
          </motion.div>
        </main>
      </div>
    </>
  );
}