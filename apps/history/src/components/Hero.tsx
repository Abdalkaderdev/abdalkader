'use client';

import { ArrowRight, Sparkles } from 'lucide-react';

interface HeroProps {
  title: string;
  subtitle: string;
  onExplore: () => void;
}

export function Hero({ title, subtitle, onExplore }: HeroProps) {
  return (
    <div className="text-center py-20 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-center mb-6">
          <Sparkles className="w-8 h-8 text-purple-400 mr-3" />
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-4">
            {title}
          </h1>
          <Sparkles className="w-8 h-8 text-purple-400 ml-3" />
        </div>
        
        <p className="text-xl md:text-2xl text-slate-300 mb-8 leading-relaxed">
          {subtitle}
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <button
            onClick={onExplore}
            className="group bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-300 transform hover:scale-105 hover:shadow-2xl flex items-center space-x-2"
          >
            <span>Start Exploring</span>
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>
          
          <div className="text-slate-400 text-sm">
            Powered by <span className="text-purple-400 font-semibold">Groq AI</span>
          </div>
        </div>
        
        <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          <div className="bg-slate-800/50 rounded-lg p-4 backdrop-blur-sm">
            <div className="text-2xl font-bold text-purple-400">180+</div>
            <div className="text-slate-300 text-sm">Years of History</div>
          </div>
          <div className="bg-slate-800/50 rounded-lg p-4 backdrop-blur-sm">
            <div className="text-2xl font-bold text-pink-400">25+</div>
            <div className="text-slate-300 text-sm">Programming Languages</div>
          </div>
          <div className="bg-slate-800/50 rounded-lg p-4 backdrop-blur-sm">
            <div className="text-2xl font-bold text-blue-400">5+</div>
            <div className="text-slate-300 text-sm">Programming Paradigms</div>
          </div>
          <div className="bg-slate-800/50 rounded-lg p-4 backdrop-blur-sm">
            <div className="text-2xl font-bold text-green-400">AI</div>
            <div className="text-slate-300 text-sm">Powered Explanations</div>
          </div>
        </div>
      </div>
    </div>
  );
}
