'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { Brain, Github, Linkedin, Twitter, ArrowUpRight } from 'lucide-react'

export default function LabFooter() {
  return (
    <footer className="bg-slate-900/50 border-t border-slate-700 mt-16">
      <div className="container mx-auto px-4 py-12">
        <div className="grid md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="flex items-center space-x-2 mb-4">
                <Brain className="w-8 h-8 text-blue-400" />
                <span className="text-2xl font-bold gradient-text">
                  Abdalkader AI Lab
                </span>
              </div>
              <p className="text-slate-300 mb-6 max-w-md">
                Exploring the future of machine learning through interactive experiments 
                and cutting-edge AI demonstrations. Building the next generation of 
                intelligent web applications.
              </p>
              <div className="flex space-x-4">
                <a
                  href="https://github.com/abdalkaderdev"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-slate-400 hover:text-white transition-colors"
                >
                  <Github className="w-5 h-5" />
                </a>
                <a
                  href="https://linkedin.com/in/abdalkaderdev"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-slate-400 hover:text-white transition-colors"
                >
                  <Linkedin className="w-5 h-5" />
                </a>
                <a
                  href="https://twitter.com/abdalkaderdev"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-slate-400 hover:text-white transition-colors"
                >
                  <Twitter className="w-5 h-5" />
                </a>
              </div>
            </motion.div>
          </div>

          {/* Quick Links */}
          <div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              <h3 className="text-lg font-semibold text-slate-100 mb-4">
                Quick Links
              </h3>
              <ul className="space-y-2">
                <li>
                  <Link 
                    href="/experiments" 
                    className="text-slate-300 hover:text-white transition-colors flex items-center group"
                  >
                    All Experiments
                    <ArrowUpRight className="w-3 h-3 ml-1 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </Link>
                </li>
                <li>
                  <Link 
                    href="/experiments?category=Computer Vision" 
                    className="text-slate-300 hover:text-white transition-colors flex items-center group"
                  >
                    Computer Vision
                    <ArrowUpRight className="w-3 h-3 ml-1 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </Link>
                </li>
                <li>
                  <Link 
                    href="/experiments?category=NLP" 
                    className="text-slate-300 hover:text-white transition-colors flex items-center group"
                  >
                    Natural Language Processing
                    <ArrowUpRight className="w-3 h-3 ml-1 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </Link>
                </li>
                <li>
                  <Link 
                    href="/experiments?category=Interactive ML" 
                    className="text-slate-300 hover:text-white transition-colors flex items-center group"
                  >
                    Interactive ML
                    <ArrowUpRight className="w-3 h-3 ml-1 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </Link>
                </li>
              </ul>
            </motion.div>
          </div>

          {/* Main Portfolio */}
          <div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <h3 className="text-lg font-semibold text-slate-100 mb-4">
                Main Portfolio
              </h3>
              <ul className="space-y-2">
                <li>
                  <Link 
                    href="https://abdalkader.dev" 
                    className="text-slate-300 hover:text-white transition-colors flex items-center group"
                  >
                    Professional Work
                    <ArrowUpRight className="w-3 h-3 ml-1 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </Link>
                </li>
                <li>
                  <Link 
                    href="https://abdalkader.dev/projects" 
                    className="text-slate-300 hover:text-white transition-colors flex items-center group"
                  >
                    AI Projects
                    <ArrowUpRight className="w-3 h-3 ml-1 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </Link>
                </li>
                <li>
                  <Link 
                    href="https://abdalkader.dev/about" 
                    className="text-slate-300 hover:text-white transition-colors flex items-center group"
                  >
                    About Me
                    <ArrowUpRight className="w-3 h-3 ml-1 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </Link>
                </li>
                <li>
                  <Link 
                    href="https://abdalkader.dev/contact" 
                    className="text-slate-300 hover:text-white transition-colors flex items-center group"
                  >
                    Contact
                    <ArrowUpRight className="w-3 h-3 ml-1 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </Link>
                </li>
              </ul>
            </motion.div>
          </div>
        </div>

        {/* Bottom Bar */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="border-t border-slate-700 mt-8 pt-8 text-center"
        >
          <p className="text-slate-400">
            Part of the Abdalkader AI Lab • Exploring the future of machine learning • v1.0.0
          </p>
          <p className="text-slate-500 text-sm mt-2">
            Built with Next.js 14, TensorFlow.js, and ❤️ for the AI community
          </p>
        </motion.div>
      </div>
    </footer>
  )
}