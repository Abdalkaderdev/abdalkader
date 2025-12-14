'use client';

import { useEffect, useRef, useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import * as d3 from 'd3';
import { Language } from '@/lib/types/language';
import languagesData from '@/lib/data/languages.json';
import { Card, Badge, Button, Modal } from '@abdalkader/ui';
import { 
  Code, 
  Calendar, 
  User, 
  Sparkles, 
  TrendingUp,
  X,
  ArrowRight,
  GitBranch
} from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

interface TreeNode extends d3.HierarchyNode<any> {
  data: Language & { children?: TreeNode[] };
  x?: number;
  y?: number;
}

interface ParadigmGroup {
  name: string;
  color: string;
  languages: Language[];
}

const PARADIGM_COLORS: Record<string, string> = {
  'Procedural': '#4169E1',
  'Object-Oriented': '#FF6347',
  'Functional': '#32CD32',
  'Imperative': '#9370DB',
  'Declarative': '#FFD700',
  'Symbolic': '#FF69B4',
  'Systems': '#0000FF',
};

export function AnimatedLanguageFamilyTree() {
  const svgRef = useRef<SVGSVGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [selectedLanguage, setSelectedLanguage] = useState<Language | null>(null);
  const [hoveredLanguage, setHoveredLanguage] = useState<Language | null>(null);
  const [animatedNodes, setAnimatedNodes] = useState<Set<string>>(new Set());
  const languages = languagesData as Language[];

  // Filter languages from 1950s onwards
  const filteredLanguages = useMemo(() => {
    return languages.filter(lang => lang.year >= 1950).sort((a, b) => a.year - b.year);
  }, []);

  // Build tree structure from languages
  const buildTree = useMemo(() => {
    const languageMap = new Map<string, Language>();
    filteredLanguages.forEach(lang => languageMap.set(lang.id, lang));

    // Find root languages (those with no predecessors or earliest year)
    const roots: Language[] = [];
    filteredLanguages.forEach(lang => {
      if (lang.predecessor.length === 0 || 
          !lang.predecessor.some(p => {
            const pred = filteredLanguages.find(l => 
              l.name === p || l.id === p.toLowerCase().replace(/\s+/g, '-')
            );
            return pred && pred.year < lang.year;
          })) {
        roots.push(lang);
      }
    });

    // Build tree recursively
    const buildNode = (lang: Language, visited: Set<string>): any => {
      if (visited.has(lang.id)) return null;
      visited.add(lang.id);

      const children: any[] = [];
      lang.successor.forEach(succName => {
        const succ = filteredLanguages.find(l => 
          l.name === succName || l.id === succName.toLowerCase().replace(/\s+/g, '-')
        );
        if (succ && succ.year > lang.year) {
          const child = buildNode(succ, visited);
          if (child) children.push(child);
        }
      });

      return {
        ...lang,
        children: children.length > 0 ? children : undefined
      };
    };

    const treeData = {
      name: 'Programming Languages',
      children: roots.map(root => buildNode(root, new Set())).filter(Boolean)
    };

    return d3.hierarchy(treeData);
  }, [filteredLanguages]);

  // Group languages by primary paradigm
  const paradigmGroups = useMemo(() => {
    const groups: Record<string, Language[]> = {};
    filteredLanguages.forEach(lang => {
      const primaryParadigm = lang.paradigm[0] || 'Other';
      if (!groups[primaryParadigm]) {
        groups[primaryParadigm] = [];
      }
      groups[primaryParadigm].push(lang);
    });
    return Object.entries(groups).map(([name, languages]) => ({
      name,
      color: PARADIGM_COLORS[name] || '#888',
      languages
    }));
  }, [filteredLanguages]);

  // Setup D3 tree visualization
  useEffect(() => {
    if (!svgRef.current || !buildTree) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    const width = containerRef.current?.clientWidth || 1200;
    const height = Math.max(800, filteredLanguages.length * 80);

    svg.attr('width', width).attr('height', height);

    // Create tree layout
    const treeLayout = d3.tree<TreeNode>()
      .size([height - 200, width - 300])
      .separation((a, b) => (a.parent === b.parent ? 1 : 2) / a.depth);

    const root = treeLayout(buildTree as any);

    // Create links with growing animation
    const links = svg.append('g')
      .attr('class', 'links')
      .selectAll('path')
      .data(root.links())
      .enter()
      .append('path')
      .attr('class', 'link')
      .attr('d', d => {
        const source = d.source as unknown as TreeNode;
        const target = d.target as unknown as TreeNode;
        return `M ${(source.y ?? 0) + 150} ${(source.x ?? 0) + 100} L ${(target.y ?? 0) + 150} ${(target.x ?? 0) + 100}`;
      })
      .attr('fill', 'none')
      .attr('stroke', (d: any) => {
        const target = d.target as unknown as TreeNode;
        return target.data.color || '#64748b';
      })
      .attr('stroke-width', 2)
      .attr('stroke-opacity', 0.3)
      .attr('stroke-dasharray', function() {
        const length = (this as SVGPathElement).getTotalLength();
        return `${length} ${length}`;
      })
      .attr('stroke-dashoffset', function() {
        return (this as SVGPathElement).getTotalLength();
      });

    // Animate links growing
    links.transition()
      .duration(1500)
      .delay((d, i) => i * 100)
      .attr('stroke-dashoffset', 0)
      .attr('stroke-opacity', 0.6);

    // Create nodes
    const nodes = svg.append('g')
      .attr('class', 'nodes')
      .selectAll('g')
      .data(root.descendants())
      .enter()
      .append('g')
      .attr('class', 'node')
      .attr('transform', d => `translate(${((d as unknown as TreeNode).y ?? 0) + 150},${((d as unknown as TreeNode).x ?? 0) + 100})`)
      .style('cursor', 'pointer')
      .style('opacity', 0);

    // Add circles for nodes with morphing animation
    nodes.append('circle')
      .attr('r', 0)
      .attr('fill', (d: any) => d.data.color || '#888')
      .attr('stroke', '#fff')
      .attr('stroke-width', 2)
      .transition()
      .duration(800)
      .delay((d, i) => i * 50 + 500)
      .attr('r', (d: any) => {
        const lang = d.data as Language;
        // Larger nodes for influential languages
        const influence = lang.successor.length;
        return Math.max(12, Math.min(25, 12 + influence * 2));
      })
      .on('end', function(d: any) {
        setAnimatedNodes(prev => new Set([...prev, d.data.id]));
      });

    // Add paradigm indicator rings
    nodes.append('circle')
      .attr('r', (d: any) => {
        const lang = d.data as Language;
        const influence = lang.successor.length;
        return Math.max(18, Math.min(31, 18 + influence * 2));
      })
      .attr('fill', 'none')
      .attr('stroke', (d: any) => {
        const lang = d.data as Language;
        return PARADIGM_COLORS[lang.paradigm[0]] || '#888';
      })
      .attr('stroke-width', 3)
      .attr('stroke-opacity', 0)
      .attr('stroke-dasharray', '5,5')
      .transition()
      .duration(1000)
      .delay((d, i) => i * 50 + 1000)
      .attr('stroke-opacity', 0.6);

    // Add labels
    nodes.append('text')
      .attr('dy', 35)
      .attr('text-anchor', 'middle')
      .attr('fill', '#fff')
      .attr('font-size', '12px')
      .attr('font-weight', 'bold')
      .text((d: any) => d.data.name)
      .style('opacity', 0)
      .transition()
      .duration(500)
      .delay((d, i) => i * 50 + 1200)
      .style('opacity', 1);

    // Add year labels
    nodes.append('text')
      .attr('dy', 50)
      .attr('text-anchor', 'middle')
      .attr('fill', '#888')
      .attr('font-size', '10px')
      .text((d: any) => d.data.year)
      .style('opacity', 0)
      .transition()
      .duration(500)
      .delay((d, i) => i * 50 + 1300)
      .style('opacity', 1);

    // Fade in nodes
    nodes.transition()
      .duration(500)
      .delay((d, i) => i * 50 + 500)
      .style('opacity', 1);

    // Add click handlers
    nodes.on('click', (event, d: any) => {
      event.stopPropagation();
      setSelectedLanguage(d.data);
    });

    // Add hover handlers with morphing effect
    nodes.on('mouseenter', (event, d: any) => {
      setHoveredLanguage(d.data);
      
      // Morph node size
      d3.select(event.currentTarget)
        .select('circle')
        .transition()
        .duration(300)
        .attr('r', (d: any) => {
          const lang = d.data as Language;
          const influence = lang.successor.length;
          return Math.max(18, Math.min(35, 18 + influence * 2)) + 5;
        });

      // Highlight connected links
      const nodeId = d.data.id;
      links
        .attr('stroke-width', (linkData: any) => {
          const source = linkData.source as TreeNode;
          const target = linkData.target as TreeNode;
          return (source.data.id === nodeId || target.data.id === nodeId) ? 4 : 2;
        })
        .attr('stroke-opacity', (linkData: any) => {
          const source = linkData.source as TreeNode;
          const target = linkData.target as TreeNode;
          return (source.data.id === nodeId || target.data.id === nodeId) ? 1 : 0.3;
        });
    });

    nodes.on('mouseleave', (event, d: any) => {
      setHoveredLanguage(null);
      
      // Restore node size
      d3.select(event.currentTarget)
        .select('circle')
        .transition()
        .duration(300)
        .attr('r', (d: any) => {
          const lang = d.data as Language;
          const influence = lang.successor.length;
          return Math.max(12, Math.min(25, 12 + influence * 2));
        });

      // Restore links
      links
        .attr('stroke-width', 2)
        .attr('stroke-opacity', 0.6);
    });

  }, [buildTree, filteredLanguages]);

  // Get language connections for morphing visualization
  const getLanguageConnections = (language: Language) => {
    const predecessors = language.predecessor
      .map(name => languages.find(l => l.name === name || l.id === name.toLowerCase().replace(/\s+/g, '-')))
      .filter((l): l is Language => l !== undefined && l.year < language.year);

    const successors = language.successor
      .map(name => languages.find(l => l.name === name || l.id === name.toLowerCase().replace(/\s+/g, '-')))
      .filter((l): l is Language => l !== undefined && l.year > language.year);

    return { predecessors, successors };
  };

  return (
    <div ref={containerRef} className="w-full min-h-screen bg-gradient-to-br from-black via-gray-900 to-black py-12">
      <div className="container mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12 text-center"
        >
          <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-orange-500 via-yellow-400 to-orange-300 bg-clip-text text-transparent">
            Programming Language Family Tree
          </h1>
          <p className="text-gray-400 text-lg md:text-xl max-w-3xl mx-auto mb-6">
            Watch languages evolve through time with growing branches, morphing connections, and paradigm shifts.
            Click any node to explore its history and influence.
          </p>

          {/* Paradigm Legend */}
          <div className="flex flex-wrap justify-center gap-4 mt-8">
            {paradigmGroups.map(group => (
              <div
                key={group.name}
                className="flex items-center gap-2 px-4 py-2 rounded-full bg-gray-800 border border-gray-700"
              >
                <div
                  className="w-4 h-4 rounded-full"
                  style={{ backgroundColor: group.color }}
                />
                <span className="text-sm text-gray-300">{group.name}</span>
                <span className="text-xs text-gray-500">({group.languages.length})</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* SVG Tree */}
        <div className="relative bg-gray-900 rounded-lg border border-gray-800 p-8 overflow-auto">
          <svg ref={svgRef} className="w-full" />
        </div>

        {/* Hover Tooltip */}
        <AnimatePresence>
          {hoveredLanguage && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="fixed bottom-8 left-1/2 transform -translate-x-1/2 z-40 pointer-events-none"
            >
              <div className="max-w-md bg-gray-900 border-2 rounded-lg" style={{ borderColor: hoveredLanguage.color }}>
                <div className="p-4">
                  <h3 className="text-xl font-bold mb-2" style={{ color: hoveredLanguage.color }}>
                    {hoveredLanguage.name}
                  </h3>
                  <p className="text-sm text-gray-400 mb-2">{hoveredLanguage.historicalContext}</p>
                  <div className="flex flex-wrap gap-2 mt-3">
                    {hoveredLanguage.keyInnovations.slice(0, 3).map((innovation, idx) => (
                      <Badge key={idx} variant="secondary" size="sm">
                        {innovation}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Language Detail Modal */}
        <AnimatePresence>
          {selectedLanguage && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black bg-opacity-75 z-50 flex items-center justify-center p-4"
              onClick={() => setSelectedLanguage(null)}
            >
              <motion.div
                initial={{ scale: 0.8, y: 50 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.8, y: 50 }}
                onClick={(e) => e.stopPropagation()}
                className="bg-gray-900 rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto border-2"
                style={{ borderColor: selectedLanguage.color }}
              >
                <div className="p-8">
                  {/* Header */}
                  <div className="flex items-start justify-between mb-6">
                    <div>
                      <h2 className="text-4xl font-bold mb-2" style={{ color: selectedLanguage.color }}>
                        {selectedLanguage.name}
                      </h2>
                      <div className="flex items-center gap-6 text-gray-400">
                        <span className="flex items-center gap-2">
                          <Calendar className="w-5 h-5" />
                          {selectedLanguage.year}
                        </span>
                        <span className="flex items-center gap-2">
                          <User className="w-5 h-5" />
                          {selectedLanguage.creator}
                        </span>
                      </div>
                    </div>
                    <Button
                      variant="secondary"
                      onClick={() => setSelectedLanguage(null)}
                    >
                      <X className="w-5 h-5" />
                    </Button>
                  </div>

                  {/* Paradigm Shift Indicator */}
                  <div className="mb-6 p-4 rounded-lg bg-gray-800 border border-gray-700">
                    <div className="flex items-center gap-2 mb-3">
                      <GitBranch className="w-5 h-5" style={{ color: selectedLanguage.color }} />
                      <h3 className="text-lg font-semibold text-gray-300">Paradigm Evolution</h3>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {selectedLanguage.paradigm.map((paradigm, idx) => (
                        <span
                          key={idx}
                          className="px-3 py-1 rounded-full text-sm font-medium"
                          style={{
                            backgroundColor: `${PARADIGM_COLORS[paradigm] || '#888'}20`,
                            borderColor: PARADIGM_COLORS[paradigm] || '#888',
                            color: PARADIGM_COLORS[paradigm] || '#888',
                            borderWidth: '1px',
                            borderStyle: 'solid'
                          }}
                        >
                          {paradigm}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Historical Context */}
                  <div className="mb-6">
                    <h3 className="text-xl font-semibold mb-2 text-gray-300">Historical Context</h3>
                    <p className="text-gray-400">{selectedLanguage.historicalContext}</p>
                  </div>

                  {/* Key Innovations */}
                  <div className="mb-6">
                    <h3 className="text-xl font-semibold mb-3 text-gray-300 flex items-center gap-2">
                      <Sparkles className="w-5 h-5" style={{ color: selectedLanguage.color }} />
                      Key Innovations
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {selectedLanguage.keyInnovations.map((innovation, idx) => (
                        <motion.div
                          key={idx}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: idx * 0.1 }}
                          className="p-3 rounded-lg bg-gray-800 border border-gray-700"
                        >
                          <span className="text-gray-300">{innovation}</span>
                        </motion.div>
                      ))}
                    </div>
                  </div>

                  {/* Language Family Tree */}
                  <div className="mb-6">
                    <h3 className="text-xl font-semibold mb-3 text-gray-300 flex items-center gap-2">
                      <TrendingUp className="w-5 h-5" style={{ color: selectedLanguage.color }} />
                      Language Family Tree
                    </h3>
                    <div className="space-y-4">
                      {getLanguageConnections(selectedLanguage).predecessors.length > 0 && (
                        <div>
                          <p className="text-sm text-gray-500 mb-2">Evolved From:</p>
                          <div className="flex flex-wrap gap-2">
                            {getLanguageConnections(selectedLanguage).predecessors.map((pred, idx) => (
                              <motion.div
                                key={idx}
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: idx * 0.1 }}
                                className="px-3 py-1 rounded-full text-sm border"
                                style={{
                                  backgroundColor: `${pred.color}20`,
                                  borderColor: pred.color,
                                  color: pred.color
                                }}
                              >
                                {pred.name} ({pred.year})
                              </motion.div>
                            ))}
                          </div>
                        </div>
                      )}
                      {getLanguageConnections(selectedLanguage).successors.length > 0 && (
                        <div>
                          <p className="text-sm text-gray-500 mb-2">Influenced:</p>
                          <div className="flex flex-wrap gap-2">
                            {getLanguageConnections(selectedLanguage).successors.map((succ, idx) => (
                              <motion.div
                                key={idx}
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: idx * 0.1 }}
                                className="px-3 py-1 rounded-full text-sm border inline-flex items-center gap-1"
                                style={{
                                  backgroundColor: `${succ.color}20`,
                                  borderColor: succ.color,
                                  color: succ.color
                                }}
                              >
                                {succ.name} ({succ.year})
                                <ArrowRight className="w-3 h-3" />
                              </motion.div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Hello World */}
                  <div>
                    <h3 className="text-xl font-semibold mb-3 text-gray-300 flex items-center gap-2">
                      <Code className="w-5 h-5" style={{ color: selectedLanguage.color }} />
                      Hello, World!
                    </h3>
                    <pre className="bg-gray-800 p-4 rounded-lg overflow-x-auto border border-gray-700">
                      <code className="text-sm text-gray-300">{selectedLanguage.helloWorld}</code>
                    </pre>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

