import { GetStaticPaths, GetStaticProps } from 'next';
import { useRouter } from 'next/router';
import { motion } from 'framer-motion';
import { FiArrowLeft, FiExternalLink, FiGithub, FiClock, FiUsers, FiTag } from 'react-icons/fi';
import Link from 'next/link';
import SEOHead from '../../components/SEO/Head';
import JsonLd from '../../components/SEO/JsonLd';
import { experimentJsonLd, breadcrumbsJsonLd } from '../../utils/jsonld';
import { experiments, getExperimentById, Experiment } from '../../data/experimentsData';

interface ExperimentPageProps {
  experiment: Experiment;
}

export default function ExperimentPage({ experiment }: ExperimentPageProps) {
  const router = useRouter();

  if (router.isFallback) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500 mx-auto mb-4"></div>
          <p className="text-gray-300">Loading experiment...</p>
        </div>
      </div>
    );
  }

  const breadcrumbs = [
    { name: 'AI Lab', item: '/' },
    { name: 'Experiments', item: '/experiments' },
    { name: experiment.title, item: `/experiments/${experiment.id}` }
  ];

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'text-green-400 bg-green-500/20';
      case 'intermediate': return 'text-yellow-400 bg-yellow-500/20';
      case 'advanced': return 'text-red-400 bg-red-500/20';
      default: return 'text-gray-400 bg-gray-500/20';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'text-green-400 bg-green-500/20';
      case 'coming-soon': return 'text-yellow-400 bg-yellow-500/20';
      case 'deprecated': return 'text-red-400 bg-red-500/20';
      default: return 'text-gray-400 bg-gray-500/20';
    }
  };

  return (
    <>
      <SEOHead 
        title={`${experiment.title} - AI Lab Experiment`}
        description={experiment.description}
        keywords={experiment.tags}
      />
      <JsonLd type="experiment" data={experiment} />
      <JsonLd type="breadcrumbs" data={breadcrumbs} />
      
      <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black">
        {/* Header */}
        <div className="bg-gray-900/50 backdrop-blur-sm border-b border-gray-800">
          <div className="container mx-auto px-4 py-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Link
                  href="/"
                  className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
                >
                  <FiArrowLeft className="w-5 h-5" />
                  <span>Back to Lab</span>
                </Link>
                <div className="h-6 w-px bg-gray-700"></div>
                <h1 className="text-2xl font-bold text-white" style={{ fontFamily: 'var(--font-pp-medium)' }}>
                  {experiment.title}
                </h1>
              </div>
              
              <div className="flex items-center gap-3">
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(experiment.status)}`}>
                  {experiment.status.replace('-', ' ')}
                </span>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getDifficultyColor(experiment.difficulty)}`}>
                  {experiment.difficulty}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 py-8">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* Hero Section */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="lab-card p-8"
              >
                <div className="aspect-video bg-gray-800 rounded-lg mb-6 flex items-center justify-center">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-orange-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                      <FiExternalLink className="w-8 h-8 text-orange-500" />
                    </div>
                    <p className="text-gray-400">Experiment Preview</p>
                  </div>
                </div>
                
                <h2 className="text-xl font-semibold text-white mb-4" style={{ fontFamily: 'var(--font-pp-medium)' }}>
                  About This Experiment
                </h2>
                <p className="text-gray-300 leading-relaxed" style={{ fontFamily: 'var(--font-pp-regular)' }}>
                  {experiment.longDescription}
                </p>
              </motion.div>

              {/* Features */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="lab-card p-8"
              >
                <h3 className="text-lg font-semibold text-white mb-6" style={{ fontFamily: 'var(--font-pp-medium)' }}>
                  Features
                </h3>
                <div className="grid md:grid-cols-2 gap-4">
                  {experiment.features.map((feature, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-orange-500 rounded-full mt-2 flex-shrink-0"></div>
                      <span className="text-gray-300 text-sm" style={{ fontFamily: 'var(--font-pp-regular)' }}>
                        {feature}
                      </span>
                    </div>
                  ))}
                </div>
              </motion.div>

              {/* Action Buttons */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="flex flex-col sm:flex-row gap-4"
              >
                {experiment.status === 'active' ? (
                  <Link
                    href={experiment.demoUrl}
                    className="lab-button flex items-center justify-center gap-2"
                  >
                    <FiExternalLink className="w-5 h-5" />
                    Try Experiment
                  </Link>
                ) : (
                  <button
                    disabled
                    className="px-8 py-3 bg-gray-600 text-gray-400 rounded-lg font-semibold cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    <FiClock className="w-5 h-5" />
                    Coming Soon
                  </button>
                )}
                
                {experiment.githubUrl && (
                  <a
                    href={experiment.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-8 py-3 border border-gray-600 text-gray-300 hover:border-orange-500 hover:text-orange-500 rounded-lg font-semibold transition-colors flex items-center justify-center gap-2"
                  >
                    <FiGithub className="w-5 h-5" />
                    View Code
                  </a>
                )}
              </motion.div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Experiment Info */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
                className="lab-card p-6"
              >
                <h3 className="text-lg font-semibold text-white mb-4" style={{ fontFamily: 'var(--font-pp-medium)' }}>
                  Experiment Details
                </h3>
                
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <FiClock className="w-4 h-4 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-400">Estimated Time</p>
                      <p className="text-white font-medium">{experiment.estimatedTime}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <FiUsers className="w-4 h-4 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-400">Author</p>
                      <p className="text-white font-medium">{experiment.author}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <FiTag className="w-4 h-4 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-400">Category</p>
                      <p className="text-white font-medium">{experiment.category}</p>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Technologies */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className="lab-card p-6"
              >
                <h3 className="text-lg font-semibold text-white mb-4" style={{ fontFamily: 'var(--font-pp-medium)' }}>
                  Technologies
                </h3>
                <div className="flex flex-wrap gap-2">
                  {experiment.technologies.map((tech, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-gray-700 text-gray-300 rounded-full text-sm"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </motion.div>

              {/* Tags */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
                className="lab-card p-6"
              >
                <h3 className="text-lg font-semibold text-white mb-4" style={{ fontFamily: 'var(--font-pp-medium)' }}>
                  Tags
                </h3>
                <div className="flex flex-wrap gap-2">
                  {experiment.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 bg-orange-500/20 text-orange-400 rounded text-sm"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export const getStaticPaths: GetStaticPaths = async () => {
  const paths = experiments.map((experiment) => ({
    params: { id: experiment.id },
  }));

  return {
    paths,
    fallback: true,
  };
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const experiment = getExperimentById(params?.id as string);

  if (!experiment) {
    return {
      notFound: true,
    };
  }

  return {
    props: {
      experiment,
    },
    revalidate: 3600, // Revalidate every hour
  };
};