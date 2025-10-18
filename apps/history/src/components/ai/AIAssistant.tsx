'use client';

import { useState } from 'react';
import { Language } from '@/lib/types/language';
import { AIChat } from './AIChat';
import { LanguageComparison } from './LanguageComparison';
import { ParadigmExplorer } from '../ParadigmExplorer';
import { Bot, MessageSquare, GitBranch, Layers } from 'lucide-react';

interface AIAssistantProps {
  languages: Language[];
  selectedLanguage: Language | null;
}

export function AIAssistant({ languages, selectedLanguage }: AIAssistantProps) {
  const [activeTab, setActiveTab] = useState<'chat' | 'comparison' | 'paradigms'>('chat');

  const tabs = [
    { id: 'chat', label: 'AI Chat', icon: MessageSquare },
    { id: 'comparison', label: 'Compare Languages', icon: GitBranch },
    { id: 'paradigms', label: 'Explore Paradigms', icon: Layers },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <div className="flex items-center justify-center space-x-3 mb-4">
          <Bot className="w-8 h-8 text-purple-400" />
          <h2 className="text-3xl font-bold text-white">AI Programming History Assistant</h2>
        </div>
        <p className="text-slate-300">
          Ask questions about programming history, compare languages, and explore paradigms
        </p>
      </div>

      {/* Tab Navigation */}
      <div className="flex justify-center">
        <div className="bg-slate-800/50 rounded-xl p-1 border border-purple-500/20">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-200 ${
                  activeTab === tab.id
                    ? 'bg-purple-600 text-white'
                    : 'text-slate-300 hover:text-white hover:bg-slate-700'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Tab Content */}
      <div className="min-h-96">
        {activeTab === 'chat' && (
          <AIChat languages={languages} selectedLanguage={selectedLanguage} />
        )}
        {activeTab === 'comparison' && (
          <LanguageComparison languages={languages} />
        )}
        {activeTab === 'paradigms' && (
          <ParadigmExplorer languages={languages} />
        )}
      </div>
    </div>
  );
}
