import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { FiCode, FiZap, FiPlay, FiGithub } from 'react-icons/fi';

export default function Home() {
  const [isLoading, setIsLoading] = useState(false);

  const features = [
    {
      icon: <FiCode className="w-8 h-8" />,
      title: "Component Playground",
      description: "Live editor for @abdalkader/ui components with real-time preview",
      href: "/playground",
      color: "from-blue-500 to-cyan-500"
    },
    {
      icon: <FiZap className="w-8 h-8" />,
      title: "AI Code Generation",
      description: "Generate components using natural language prompts",
      href: "/generate",
      color: "from-purple-500 to-pink-500"
    },
    {
      icon: <FiPlay className="w-8 h-8" />,
      title: "Live Preview",
      description: "Real-time component rendering with WebSocket updates",
      href: "/playground",
      color: "from-green-500 to-emerald-500"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-16">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-6">
            AI Code Editor MVP
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto mb-8">
            Interactive AI-powered code editor for component development with real-time preview and intelligent code generation.
          </p>
          <div className="flex items-center justify-center gap-4">
            <Link
              href="/playground"
              className="px-8 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg font-semibold hover:shadow-lg transition-all duration-300 transform hover:scale-105"
            >
              Start Coding
            </Link>
            <Link
              href="/generate"
              className="px-8 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg font-semibold hover:bg-gray-50 dark:hover:bg-gray-800 transition-all duration-300"
            >
              AI Generate
            </Link>
          </div>
        </motion.div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              <Link href={feature.href}>
                <div className="bg-white dark:bg-gray-800 rounded-xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 cursor-pointer">
                  <div className={`w-16 h-16 rounded-lg bg-gradient-to-r ${feature.color} flex items-center justify-center text-white mb-6`}>
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    {feature.description}
                  </p>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* Tech Stack */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="bg-white dark:bg-gray-800 rounded-xl p-8 shadow-lg"
        >
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6 text-center">
            Built with Modern Technologies
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 bg-black rounded-lg flex items-center justify-center mb-2">
                <span className="text-white font-bold">N</span>
              </div>
              <span className="text-sm text-gray-600 dark:text-gray-300">Next.js 14</span>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center mb-2">
                <FiCode className="text-white" />
              </div>
              <span className="text-sm text-gray-600 dark:text-gray-300">Monaco Editor</span>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center mb-2">
                <span className="text-white font-bold">WS</span>
              </div>
              <span className="text-sm text-gray-600 dark:text-gray-300">WebSocket</span>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 bg-purple-600 rounded-lg flex items-center justify-center mb-2">
                <FiZap className="text-white" />
              </div>
              <span className="text-sm text-gray-600 dark:text-gray-300">OpenAI API</span>
            </div>
          </div>
        </motion.div>

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="text-center mt-16"
        >
          <p className="text-gray-500 dark:text-gray-400">
            Part of the Abdalkader Web Ecosystem • Built with ❤️ for developers • v1.0.1
          </p>
        </motion.div>
      </div>
    </div>
  );
}