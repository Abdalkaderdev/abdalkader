import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiZap, FiSend, FiRefreshCw, FiSettings } from 'react-icons/fi';
import { HiLightBulb } from 'react-icons/hi';

interface AIPromptProps {
  onGenerate: (prompt: string, options: GenerationOptions) => void;
  isLoading?: boolean;
  error?: string | null;
  suggestions?: string[];
}

interface GenerationOptions {
  componentType: 'functional' | 'class';
  includeState: boolean;
  includeProps: boolean;
  designSystem: 'abdalkader' | 'custom';
}

export default function AIPrompt({ onGenerate, isLoading = false, error = null, suggestions = [] }: AIPromptProps) {
  const [prompt, setPrompt] = useState('');
  const [showOptions, setShowOptions] = useState(false);
  const [options, setOptions] = useState<GenerationOptions>({
    componentType: 'functional',
    includeState: true,
    includeProps: true,
    designSystem: 'abdalkader'
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (prompt.trim() && !isLoading) {
      onGenerate(prompt.trim(), options);
    }
  };

  const quickPrompts = [
    "Create a login form with email and password fields",
    "Build a product card with image, title, price, and buy button",
    "Make a todo list with add, delete, and toggle functionality",
    "Design a user profile card with avatar and social links",
    "Create a pricing table with three tiers",
    "Build a contact form with validation",
    "Make a dashboard widget showing statistics",
    "Design a navigation menu with dropdown"
  ];

  const handleQuickPrompt = (quickPrompt: string) => {
    setPrompt(quickPrompt);
  };

  return (
    <div className="ai-prompt-container">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-8 h-8 bg-portfolio-primary rounded-lg flex items-center justify-center">
          <FiZap className="w-4 h-4 text-portfolio-black" />
        </div>
        <h2 className="portfolio-heading-large text-lg">
          AI Code Generator
        </h2>
        <button
          onClick={() => setShowOptions(!showOptions)}
          className="ml-auto p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
        >
          <FiSettings className="w-4 h-4" />
        </button>
      </div>

      {/* Options Panel */}
      <AnimatePresence>
        {showOptions && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mb-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700"
          >
            <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-3">
              Generation Options
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs text-gray-600 dark:text-gray-400 mb-1">
                  Component Type
                </label>
                <select
                  value={options.componentType}
                  onChange={(e) => setOptions(prev => ({ ...prev, componentType: e.target.value as 'functional' | 'class' }))}
                  className="w-full px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                >
                  <option value="functional">Functional</option>
                  <option value="class">Class</option>
                </select>
              </div>
              <div>
                <label className="block text-xs text-gray-600 dark:text-gray-400 mb-1">
                  Design System
                </label>
                <select
                  value={options.designSystem}
                  onChange={(e) => setOptions(prev => ({ ...prev, designSystem: e.target.value as 'abdalkader' | 'custom' }))}
                  className="w-full px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                >
                  <option value="abdalkader">@abdalkader/ui</option>
                  <option value="custom">Custom</option>
                </select>
              </div>
            </div>
            <div className="flex gap-4 mt-3">
              <label className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                <input
                  type="checkbox"
                  checked={options.includeState}
                  onChange={(e) => setOptions(prev => ({ ...prev, includeState: e.target.checked }))}
                  className="rounded"
                />
                Include State
              </label>
              <label className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                <input
                  type="checkbox"
                  checked={options.includeProps}
                  onChange={(e) => setOptions(prev => ({ ...prev, includeProps: e.target.checked }))}
                  className="rounded"
                />
                Include Props Interface
              </label>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Prompt Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="relative">
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Describe the component you want to create... (e.g., 'Create a user profile card with avatar, name, email, and edit button')"
            className="w-full px-4 py-3 pr-12 border border-gray-300 dark:border-gray-600 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
            rows={3}
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={!prompt.trim() || isLoading}
            className="portfolio-btn absolute bottom-3 right-3 p-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <FiRefreshCw className="w-4 h-4 animate-spin" />
            ) : (
              <FiSend className="w-4 h-4" />
            )}
          </button>
        </div>

        {/* Error Display */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg"
            >
              <p className="text-sm text-red-600 dark:text-red-400">
                {error}
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </form>

      {/* Quick Prompts */}
      <div className="mt-6">
        <div className="flex items-center gap-2 mb-3">
          <HiLightBulb className="w-4 h-4 text-yellow-500" />
          <h3 className="text-sm font-medium text-gray-900 dark:text-white">
            Quick Prompts
          </h3>
        </div>
        <div className="grid grid-cols-1 gap-2">
          {quickPrompts.slice(0, 4).map((quickPrompt, index) => (
            <button
              key={index}
              onClick={() => handleQuickPrompt(quickPrompt)}
              className="text-left p-2 text-sm text-gray-600 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400 hover:bg-purple-50 dark:hover:bg-purple-900/20 rounded-lg transition-colors"
              disabled={isLoading}
            >
              {quickPrompt}
            </button>
          ))}
        </div>
      </div>

      {/* Suggestions */}
      <AnimatePresence>
        {suggestions.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg"
          >
            <h4 className="text-sm font-medium text-blue-900 dark:text-blue-100 mb-2">
              Suggestions for improvement:
            </h4>
            <ul className="space-y-1">
              {suggestions.map((suggestion, index) => (
                <li key={index} className="text-sm text-blue-700 dark:text-blue-300">
                  • {suggestion}
                </li>
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}