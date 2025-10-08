import { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { FiHome, FiCode, FiDownload, FiCopy, FiRefreshCw } from 'react-icons/fi';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { useLivePreview } from '../hooks/useLivePreview';
import { codeTemplates, getTemplatesByCategory } from '../utils/codeTemplates';

const AIPrompt = dynamic(() => import('../components/AIPrompt'), {
  ssr: false,
  loading: () => (
    <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-4 animate-pulse">
      <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded mb-4"></div>
      <div className="h-20 bg-gray-300 dark:bg-gray-600 rounded"></div>
    </div>
  )
});

const CodeEditor = dynamic(() => import('../components/CodeEditor'), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center h-96 bg-gray-100 dark:bg-gray-800 rounded-lg">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
    </div>
  )
});

const ComponentPreview = dynamic(() => import('../components/ComponentPreview'), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center h-96 bg-gray-100 dark:bg-gray-800 rounded-lg">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
    </div>
  )
});

interface GenerationOptions {
  componentType: 'functional' | 'class';
  includeState: boolean;
  includeProps: boolean;
  designSystem: 'abdalkader' | 'custom';
}

interface GenerationResult {
  code: string;
  explanation: string;
  suggestions: string[];
}

export default function Generate() {
  const [code, setCode] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationError, setGenerationError] = useState<string | null>(null);
  const [generationResult, setGenerationResult] = useState<GenerationResult | null>(null);
  const [copySuccess, setCopySuccess] = useState(false);

  const { isLoading: isPreviewLoading, error: previewError, refresh } = useLivePreview({
    code,
    delay: 1000,
    onError: (error) => console.error('Preview error:', error),
    onSuccess: () => console.log('Preview updated successfully')
  });

  const handleGenerate = useCallback(async (prompt: string, options: GenerationOptions) => {
    setIsGenerating(true);
    setGenerationError(null);
    setGenerationResult(null);

    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'generate',
          prompt,
          ...options
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Generation failed');
      }

      const result: GenerationResult = await response.json();
      setGenerationResult(result);
      setCode(result.code);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      setGenerationError(errorMessage);
      console.error('Generation error:', error);
    } finally {
      setIsGenerating(false);
    }
  }, []);

  const handleImprove = useCallback(async (improvements: string) => {
    if (!code) return;

    setIsGenerating(true);
    setGenerationError(null);

    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'improve',
          code,
          improvements
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Improvement failed');
      }

      const result: GenerationResult = await response.json();
      setGenerationResult(result);
      setCode(result.code);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      setGenerationError(errorMessage);
      console.error('Improvement error:', error);
    } finally {
      setIsGenerating(false);
    }
  }, [code]);

  const handleCodeChange = useCallback((value: string | undefined) => {
    setCode(value || '');
  }, []);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    } catch (err) {
      console.error('Failed to copy code:', err);
    }
  };

  const handleDownload = () => {
    const blob = new Blob([code], { type: 'text/typescript' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'generated-component.tsx';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const loadTemplate = (templateCode: string) => {
    setCode(templateCode);
    setGenerationResult(null);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/" className="flex items-center gap-2 text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100">
                <FiHome className="w-5 h-5" />
                <span>Home</span>
              </Link>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                AI Code Generator
              </h1>
            </div>
            <div className="flex items-center gap-2">
              <Link
                href="/playground"
                className="flex items-center gap-2 px-3 py-2 text-sm bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-lg transition-colors"
              >
                <FiCode className="w-4 h-4" />
                Playground
              </Link>
              {code && (
                <>
                  <button
                    onClick={handleCopy}
                    className="flex items-center gap-2 px-3 py-2 text-sm bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-lg transition-colors"
                  >
                    <FiCopy className="w-4 h-4" />
                    {copySuccess ? 'Copied!' : 'Copy'}
                  </button>
                  <button
                    onClick={handleDownload}
                    className="flex items-center gap-2 px-3 py-2 text-sm bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors"
                  >
                    <FiDownload className="w-4 h-4" />
                    Download
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6">
        <div className="grid lg:grid-cols-3 gap-6">
          {/* AI Prompt Panel */}
          <div className="lg:col-span-1 space-y-6">
            <AIPrompt
              onGenerate={handleGenerate}
              isLoading={isGenerating}
              error={generationError}
              suggestions={generationResult?.suggestions}
            />

            {/* Templates */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700"
            >
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Quick Templates
              </h3>
              <div className="space-y-2">
                {codeTemplates.slice(0, 4).map((template) => (
                  <button
                    key={template.name}
                    onClick={() => loadTemplate(template.code)}
                    className="w-full text-left p-3 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors"
                    disabled={isGenerating}
                  >
                    <div className="font-medium text-gray-900 dark:text-white">
                      {template.name}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      {template.description}
                    </div>
                  </button>
                ))}
              </div>
            </motion.div>

            {/* Generation Result Info */}
            {generationResult && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4"
              >
                <h4 className="text-sm font-medium text-green-900 dark:text-green-100 mb-2">
                  Generation Complete
                </h4>
                <p className="text-sm text-green-700 dark:text-green-300">
                  {generationResult.explanation}
                </p>
                {code && (
                  <div className="mt-3">
                    <input
                      type="text"
                      placeholder="Describe improvements..."
                      className="w-full px-3 py-2 text-sm border border-green-300 dark:border-green-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          const target = e.target as HTMLInputElement;
                          if (target.value.trim()) {
                            handleImprove(target.value.trim());
                            target.value = '';
                          }
                        }
                      }}
                    />
                    <p className="text-xs text-green-600 dark:text-green-400 mt-1">
                      Press Enter to improve the component
                    </p>
                  </div>
                )}
              </motion.div>
            )}
          </div>

          {/* Code Editor and Preview */}
          <div className="lg:col-span-2 space-y-6">
            <div className="grid lg:grid-cols-2 gap-6">
              {/* Code Editor */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Generated Code
                  </h2>
                  {isGenerating && (
                    <div className="flex items-center gap-2 text-sm text-blue-600">
                      <FiRefreshCw className="w-4 h-4 animate-spin" />
                      Generating...
                    </div>
                  )}
                </div>
                
                <CodeEditor
                  value={code}
                  onChange={handleCodeChange}
                  height="500px"
                  language="typescript"
                  theme="vs-dark"
                />
              </div>

              {/* Preview */}
              <div className="space-y-4">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Live Preview
                </h2>
                
                <ComponentPreview
                  code={code}
                  isLoading={isPreviewLoading}
                  error={previewError}
                  onRefresh={refresh}
                />
              </div>
            </div>

            {/* Getting Started */}
            {!code && !isGenerating && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white dark:bg-gray-800 rounded-lg p-8 border border-gray-200 dark:border-gray-700 text-center"
              >
                <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FiCode className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  Ready to Generate Components
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                  Describe the component you want to create using natural language, and AI will generate clean, production-ready React code for you.
                </p>
                <div className="flex flex-wrap justify-center gap-2 text-sm">
                  <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full">
                    TypeScript
                  </span>
                  <span className="px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded-full">
                    @abdalkader/ui
                  </span>
                  <span className="px-3 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 rounded-full">
                    Tailwind CSS
                  </span>
                  <span className="px-3 py-1 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300 rounded-full">
                    Accessible
                  </span>
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}