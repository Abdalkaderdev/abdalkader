'use client';

import { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import { Language } from '@/lib/types/language';
import { useGroqAI } from '@/hooks/useGroqAI';
import { explainLanguageHistory } from '@/services/aiService';
import { Loader, AlertCircle } from 'lucide-react';

interface LanguageFamilyTreeProps {
  languages: Language[];
  onLanguageSelect: (language: Language) => void;
}

interface NodeData {
  id: string;
  name: string;
  year: number;
  color: string;
  paradigm: string[];
  x?: number;
  y?: number;
  fx?: number | null;
  fy?: number | null;
}

interface LinkData {
  source: string;
  target: string;
  type: 'predecessor' | 'successor';
}

export function LanguageFamilyTree({ languages, onLanguageSelect }: LanguageFamilyTreeProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const [selectedLanguage, setSelectedLanguage] = useState<Language | null>(null);
  const [aiExplanation, setAiExplanation] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { executeAIRequest, error } = useGroqAI();

  useEffect(() => {
    if (!svgRef.current || languages.length === 0) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    const width = 800;
    const height = 600;
    svg.attr('width', width).attr('height', height);

    // Create nodes and links
    const nodes: NodeData[] = languages.map(lang => ({
      id: lang.id,
      name: lang.name,
      year: lang.year,
      color: lang.color,
      paradigm: lang.paradigm,
    }));

    const links: LinkData[] = [];
    languages.forEach(lang => {
      lang.predecessor.forEach(pred => {
        const predLang = languages.find(l => l.name === pred);
        if (predLang) {
          links.push({
            source: predLang.id,
            target: lang.id,
            type: 'predecessor'
          });
        }
      });
    });

    // Create force simulation
    const simulation = d3.forceSimulation(nodes)
      .force('link', d3.forceLink(links).id((d: any) => d.id).distance(100))
      .force('charge', d3.forceManyBody().strength(-300))
      .force('center', d3.forceCenter(width / 2, height / 2))
      .force('collision', d3.forceCollide().radius(30));

    // Create links
    const link = svg.append('g')
      .selectAll('line')
      .data(links)
      .enter().append('line')
      .attr('stroke', '#64748b')
      .attr('stroke-width', 2)
      .attr('stroke-opacity', 0.6);

    // Create nodes
    const node = svg.append('g')
      .selectAll('circle')
      .data(nodes)
      .enter().append('circle')
      .attr('r', 20)
      .attr('fill', d => d.color)
      .attr('stroke', '#ffffff')
      .attr('stroke-width', 2)
      .style('cursor', 'pointer')
      .on('click', (event, d) => {
        const language = languages.find(l => l.id === d.id);
        if (language) {
          setSelectedLanguage(language);
          onLanguageSelect(language);
          handleLanguageClick(language);
        }
      })
      .on('mouseover', function(event, d) {
        d3.select(this)
          .transition()
          .duration(200)
          .attr('r', 25)
          .attr('stroke-width', 3);
        
        // Show tooltip
        const tooltip = svg.append('g')
          .attr('class', 'tooltip')
          .style('pointer-events', 'none');
        
        tooltip.append('rect')
          .attr('x', event.pageX - svgRef.current!.getBoundingClientRect().left - 60)
          .attr('y', event.pageY - svgRef.current!.getBoundingClientRect().top - 40)
          .attr('width', 120)
          .attr('height', 30)
          .attr('fill', '#1e293b')
          .attr('stroke', '#7c3aed')
          .attr('rx', 4);
        
        tooltip.append('text')
          .attr('x', event.pageX - svgRef.current!.getBoundingClientRect().left - 10)
          .attr('y', event.pageY - svgRef.current!.getBoundingClientRect().top - 20)
          .attr('text-anchor', 'middle')
          .attr('fill', 'white')
          .attr('font-size', '12px')
          .text(d.name);
      })
      .on('mouseout', function() {
        d3.select(this)
          .transition()
          .duration(200)
          .attr('r', 20)
          .attr('stroke-width', 2);
        
        svg.selectAll('.tooltip').remove();
      });

    // Add labels
    const labels = svg.append('g')
      .selectAll('text')
      .data(nodes)
      .enter().append('text')
      .attr('text-anchor', 'middle')
      .attr('dy', 35)
      .attr('fill', '#ffffff')
      .attr('font-size', '10px')
      .attr('font-weight', 'bold')
      .text(d => d.name);

    // Update positions on simulation tick
    simulation.on('tick', () => {
      link
        .attr('x1', (d: any) => d.source.x)
        .attr('y1', (d: any) => d.source.y)
        .attr('x2', (d: any) => d.target.x)
        .attr('y2', (d: any) => d.target.y);

      node
        .attr('cx', (d: any) => d.x)
        .attr('cy', (d: any) => d.y);

      labels
        .attr('x', (d: any) => d.x)
        .attr('y', (d: any) => d.y + 35);
    });

    // Add drag behavior
    const drag = d3.drag<SVGCircleElement, NodeData>()
      .on('start', (event, d) => {
        if (!event.active) simulation.alphaTarget(0.3).restart();
        d.fx = d.x;
        d.fy = d.y;
      })
      .on('drag', (event, d) => {
        d.fx = event.x;
        d.fy = event.y;
      })
      .on('end', (event, d) => {
        if (!event.active) simulation.alphaTarget(0);
        d.fx = null;
        d.fy = null;
      });

    node.call(drag as any);

    // CRITICAL: Clean up simulation on unmount to prevent memory leaks
    return () => {
      simulation.stop();
    };
  }, [languages, onLanguageSelect]);

  const handleLanguageClick = async (language: Language) => {
    setIsLoading(true);
    setAiExplanation(null);

    const explanation = await executeAIRequest(
      explainLanguageHistory,
      'history',
      language.id,
      language.name,
      language.year
    );

    if (explanation) {
      setAiExplanation(explanation.content);
    }
    setIsLoading(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-3xl font-bold text-white mb-2">Language Family Tree</h2>
        <p className="text-slate-300">
          Interactive visualization showing the relationships between programming languages
        </p>
      </div>

      {/* Visualization */}
      <div className="flex justify-center">
        <div className="bg-slate-800/50 rounded-xl p-6 border border-purple-500/20">
          <svg ref={svgRef} className="block"></svg>
        </div>
      </div>

      {/* Legend */}
      <div className="bg-slate-800/50 rounded-xl p-4 border border-purple-500/20">
        <h3 className="text-lg font-semibold text-white mb-3">Legend</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-blue-500 rounded-full"></div>
            <span className="text-slate-300 text-sm">Imperative</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-purple-500 rounded-full"></div>
            <span className="text-slate-300 text-sm">Object-Oriented</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-green-500 rounded-full"></div>
            <span className="text-slate-300 text-sm">Functional</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-orange-500 rounded-full"></div>
            <span className="text-slate-300 text-sm">Procedural</span>
          </div>
        </div>
        <div className="mt-3 text-sm text-slate-400">
          Click on any language to learn about its history and influence
        </div>
      </div>

      {/* AI Explanation */}
      {selectedLanguage && (
        <div className="bg-slate-800/50 rounded-xl p-6 border border-purple-500/20">
          <div className="flex items-center space-x-2 mb-4">
            <div 
              className="w-4 h-4 rounded-full"
              style={{ backgroundColor: selectedLanguage.color }}
            ></div>
            <h3 className="text-xl font-semibold text-white">
              {selectedLanguage.name} - AI Historical Analysis
            </h3>
          </div>
          
          {isLoading ? (
            <div className="flex items-center space-x-2 text-purple-400">
              <Loader className="w-5 h-5 animate-spin" />
              <span>AI is analyzing {selectedLanguage.name}...</span>
            </div>
          ) : error ? (
            <div className="flex items-center space-x-2 text-red-400">
              <AlertCircle className="w-5 h-5" />
              <span>Error: {error}</span>
            </div>
          ) : aiExplanation ? (
            <div className="prose prose-invert max-w-none">
              <div className="text-slate-300 leading-relaxed whitespace-pre-wrap">
                {aiExplanation}
              </div>
            </div>
          ) : (
            <div className="text-slate-400">
              Click on a language in the tree to get AI-powered historical context
            </div>
          )}
        </div>
      )}
    </div>
  );
}
