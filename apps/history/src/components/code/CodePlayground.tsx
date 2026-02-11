'use client';

import { useState, useEffect } from 'react';
import { Language } from '@/lib/types/language';
import { LanguageSelector } from './LanguageSelector';
import { CodeEditor } from './CodeEditor';
import { AIExplanation } from './AIExplanation';
import { useGroqAI } from '@/hooks/useGroqAI';
import { explainCode } from '@/services/aiService';

interface CodePlaygroundProps {
  languages: Language[];
  selectedLanguage: Language | null;
  onLanguageSelect: (language: Language) => void;
}

// Simulated output based on language's Hello World pattern
function getSimulatedOutput(language: Language | null, code: string): string {
  if (!language || !code.trim()) {
    return 'No code to execute.';
  }

  // Common Hello World outputs based on language
  const outputs: Record<string, string> = {
    python: 'Hello, World!',
    javascript: 'Hello, World!',
    typescript: 'Hello, World!',
    java: 'Hello, World!',
    c: 'Hello, World!',
    cpp: 'Hello, World!',
    csharp: 'Hello, World!',
    go: 'Hello, World!',
    rust: 'Hello, World!',
    ruby: 'Hello, World!',
    php: 'Hello, World!',
    swift: 'Hello, World!',
    kotlin: 'Hello, World!',
    scala: 'Hello, World!',
    perl: 'Hello, World!',
    haskell: 'Hello, World!',
    lisp: 'HELLO, WORLD!',
    fortran: ' Hello, World!',
    cobol: 'Hello, World!',
    pascal: 'Hello, World!',
    ada: 'Hello, World!',
    assembly: 'Hello, World!',
    basic: 'Hello, World!',
    prolog: 'Hello, World!',
    erlang: 'Hello, World!',
    elixir: 'Hello, World!',
    clojure: 'Hello, World!',
    lua: 'Hello, World!',
    r: '[1] "Hello, World!"',
    matlab: 'Hello, World!',
    julia: 'Hello, World!',
    dart: 'Hello, World!',
    objectivec: 'Hello, World!',
    fsharp: 'Hello, World!',
    ocaml: 'Hello, World!',
    scheme: 'Hello, World!',
    smalltalk: 'Hello, World!',
    tcl: 'Hello, World!',
    forth: 'Hello, World!',
    apl: 'Hello, World!',
    sql: '| message       |\n|---------------|\n| Hello, World! |',
  };

  const langId = language.id.toLowerCase();
  return outputs[langId] || 'Hello, World!';
}

export function CodePlayground({
  languages,
  selectedLanguage,
  onLanguageSelect
}: CodePlaygroundProps) {
  const [currentLanguage, setCurrentLanguage] = useState<Language | null>(selectedLanguage);
  const [code, setCode] = useState<string>('');
  const [aiExplanation, setAiExplanation] = useState<string | null>(null);
  const [output, setOutput] = useState<string | null>(null);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const { executeAIRequest, isLoading, error } = useGroqAI();

  useEffect(() => {
    if (selectedLanguage) {
      setCurrentLanguage(selectedLanguage);
      setCode(selectedLanguage.helloWorld);
    }
  }, [selectedLanguage]);

  useEffect(() => {
    if (currentLanguage) {
      setCode(currentLanguage.helloWorld);
    }
  }, [currentLanguage]);

  const handleLanguageChange = (language: Language) => {
    setCurrentLanguage(language);
    onLanguageSelect(language);
    setCode(language.helloWorld);
    setAiExplanation(null);
    setOutput(null);
  };

  const handleCodeChange = (newCode: string) => {
    setCode(newCode);
  };

  const handleExplainCode = async () => {
    if (!currentLanguage || !code) return;

    const explanation = await executeAIRequest(
      explainCode,
      'code',
      currentLanguage.id,
      currentLanguage.name,
      code,
      currentLanguage.era
    );

    if (explanation) {
      setAiExplanation(explanation.content);
    }
  };

  const handleRunCode = () => {
    if (!currentLanguage || !code.trim()) {
      setOutput('No code to execute.');
      return;
    }

    setIsRunning(true);
    setOutput(null);

    // Simulate execution delay for realism
    setTimeout(() => {
      const simulatedOutput = getSimulatedOutput(currentLanguage, code);
      const timestamp = new Date().toLocaleTimeString();
      setOutput(`[${timestamp}] Executing ${currentLanguage.name} code...\n\n${simulatedOutput}\n\n[Process completed successfully]`);
      setIsRunning(false);
    }, 800);
  };

  const handleClearOutput = () => {
    setOutput(null);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-3xl font-bold text-white mb-2">Code Playground</h2>
        <p className="text-slate-300">
          Write and explore code from different programming languages throughout history
        </p>
      </div>

      {/* Language Selector */}
      <LanguageSelector
        languages={languages}
        selectedLanguage={currentLanguage}
        onLanguageSelect={handleLanguageChange}
      />

      {/* Main Playground */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Code Editor */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-semibold text-white">
              {currentLanguage?.name} Editor
            </h3>
            <div className="flex space-x-2">
              <button
                onClick={handleExplainCode}
                disabled={isLoading || !code}
                className="px-4 py-2 bg-purple-600 hover:bg-purple-700 disabled:bg-slate-600 text-white rounded-lg transition-colors flex items-center space-x-2"
              >
                {isLoading ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                ) : (
                  <span>🤖 Explain Code</span>
                )}
              </button>
              <button
                onClick={handleRunCode}
                disabled={!code}
                className="px-4 py-2 bg-green-600 hover:bg-green-700 disabled:bg-slate-600 text-white rounded-lg transition-colors"
              >
                ▶️ Run
              </button>
            </div>
          </div>

          <CodeEditor
            language={currentLanguage}
            code={code}
            onCodeChange={handleCodeChange}
          />

          {/* Output Panel */}
          <div className="mt-4">
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-lg font-semibold text-white flex items-center">
                <span className="mr-2">Output</span>
                {isRunning && (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-green-400"></div>
                )}
              </h4>
              {output && (
                <button
                  onClick={handleClearOutput}
                  className="px-3 py-1 text-sm bg-slate-700 hover:bg-slate-600 text-slate-300 rounded transition-colors"
                >
                  Clear
                </button>
              )}
            </div>
            <div className="bg-slate-900 rounded-lg border border-slate-700 p-4 min-h-[120px] max-h-[200px] overflow-auto font-mono text-sm">
              {isRunning ? (
                <div className="text-green-400 flex items-center">
                  <span className="animate-pulse">Running code...</span>
                </div>
              ) : output ? (
                <pre className="text-green-400 whitespace-pre-wrap">{output}</pre>
              ) : (
                <span className="text-slate-500 italic">
                  Click &quot;Run&quot; to execute the code and see the output here.
                </span>
              )}
            </div>
          </div>
        </div>

        {/* AI Explanation */}
        <div>
          <h3 className="text-xl font-semibold text-white mb-4">
            AI Code Analysis
          </h3>
          <AIExplanation
            explanation={aiExplanation}
            isLoading={isLoading}
            error={error}
            language={currentLanguage}
          />
        </div>
      </div>

      {/* Historical Context */}
      {currentLanguage && (
        <div className="bg-slate-800/50 rounded-xl p-6 border border-purple-500/20">
          <h3 className="text-lg font-semibold text-white mb-3">
            Historical Context: {currentLanguage.name}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h4 className="text-purple-400 font-semibold mb-2">Key Innovations</h4>
              <ul className="text-slate-300 space-y-1">
                {currentLanguage.keyInnovations.map((innovation, index) => (
                  <li key={index} className="text-sm">• {innovation}</li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="text-purple-400 font-semibold mb-2">Historical Impact</h4>
              <p className="text-slate-300 text-sm">
                {currentLanguage.historicalContext}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
