'use client';

import { Language } from '@/lib/types/language';
import { Bot, AlertCircle, Loader } from 'lucide-react';

interface AIExplanationProps {
  explanation: string | null;
  isLoading: boolean;
  error: string | null;
  language: Language | null;
}

export function AIExplanation({ 
  explanation, 
  isLoading, 
  error, 
  language 
}: AIExplanationProps) {
  if (isLoading) {
    return (
      <div className="bg-slate-800/50 rounded-xl p-6 border border-purple-500/20 h-96 flex items-center justify-center">
        <div className="text-center">
          <Loader className="w-8 h-8 text-purple-400 animate-spin mx-auto mb-4" />
          <div className="text-purple-400 font-semibold mb-2">AI is analyzing your code...</div>
          <div className="text-slate-400 text-sm">
            Powered by Groq AI • {language?.name}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-slate-800/50 rounded-xl p-6 border border-red-500/20 h-96 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-8 h-8 text-red-400 mx-auto mb-4" />
          <div className="text-red-400 font-semibold mb-2">Error generating explanation</div>
          <div className="text-slate-400 text-sm">{error}</div>
        </div>
      </div>
    );
  }

  if (!explanation) {
    return (
      <div className="bg-slate-800/50 rounded-xl p-6 border border-purple-500/20 h-96 flex items-center justify-center">
        <div className="text-center">
          <Bot className="w-8 h-8 text-purple-400 mx-auto mb-4" />
          <div className="text-white font-semibold mb-2">AI Code Analysis</div>
          <div className="text-slate-400 text-sm mb-4">
            Click "Explain Code" to get AI-powered insights about your code
          </div>
          {language && (
            <div className="text-xs text-slate-500">
              Current language: {language.name} ({language.year})
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-slate-800/50 rounded-xl p-6 border border-purple-500/20 h-96 overflow-y-auto">
      <div className="flex items-center space-x-2 mb-4">
        <Bot className="w-5 h-5 text-purple-400" />
        <span className="text-white font-semibold">AI Analysis</span>
        {language && (
          <span className="text-xs text-slate-400 bg-slate-700 px-2 py-1 rounded">
            {language.name}
          </span>
        )}
      </div>
      
      <div className="prose prose-invert max-w-none">
        <div className="text-slate-300 leading-relaxed whitespace-pre-wrap">
          {explanation}
        </div>
      </div>
    </div>
  );
}
