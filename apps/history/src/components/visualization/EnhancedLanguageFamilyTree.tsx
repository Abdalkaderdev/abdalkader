'use client';

import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import { motion, AnimatePresence } from 'framer-motion';
import { Language } from '@/lib/types/language';
import { usePortfolioAnimations, useReducedMotion } from '@/hooks/useAnimations';

interface EnhancedLanguageFamilyTreeProps {
  languages: Language[];
  onLanguageSelect?: (language: Language) => void;
  width?: number;
  height?: number;
}

interface TreeNode {
  id: string;
  name: string;
  year: number;
  paradigm: string;
  creator: string;
  children?: TreeNode[];
  parent?: TreeNode;
  x?: number;
  y?: number;
  fx?: number | null;
  fy?: number | null;
}

export const EnhancedLanguageFamilyTree: React.FC<EnhancedLanguageFamilyTreeProps> = ({
  languages,
  onLanguageSelect,
  width = 1200,
  height = 800,
}) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const [selectedNode, setSelectedNode] = useState<TreeNode | null>(null);
  const [hoveredNode, setHoveredNode] = useState<TreeNode | null>(null);
  const { animateLanguageNode } = usePortfolioAnimations();
  const reducedMotion = useReducedMotion();

  // Transform languages data into tree structure
  const createTreeData = (languages: Language[]): TreeNode => {
    const root: TreeNode = {
      id: 'root',
      name: 'Programming Languages',
      year: 0,
      paradigm: 'Root',
      creator: 'Evolution',
    };

    // Group languages by paradigm
    const paradigmGroups = languages.reduce((acc, lang) => {
      const paradigm = lang.paradigm || 'Unknown';
      if (!acc[paradigm]) {
        acc[paradigm] = [];
      }
      acc[paradigm].push(lang);
      return acc;
    }, {} as Record<string, Language[]>);

    // Create paradigm nodes
    const paradigmNodes: TreeNode[] = Object.entries(paradigmGroups).map(([paradigm, langs]) => ({
      id: `paradigm-${paradigm}`,
      name: paradigm,
      year: Math.min(...langs.map(l => l.year)),
      paradigm,
      creator: 'Paradigm',
      children: langs.map(lang => ({
        id: lang.id,
        name: lang.name,
        year: lang.year,
        paradigm: lang.paradigm || 'Unknown',
        creator: lang.creator || 'Unknown',
      })),
    }));

    root.children = paradigmNodes;
    return root;
  };

  useEffect(() => {
    if (!svgRef.current || languages.length === 0) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    const treeData = createTreeData(languages);
    
    // Create force simulation
    const simulation = d3.forceSimulation<TreeNode>()
      .force('link', d3.forceLink<TreeNode, any>().id(d => d.id).distance(100))
      .force('charge', d3.forceManyBody().strength(-300))
      .force('center', d3.forceCenter(width / 2, height / 2))
      .force('collision', d3.forceCollide().radius(40));

    // Create links
    const links = svg.append('g')
      .attr('class', 'links')
      .selectAll('line')
      .data([])
      .enter()
      .append('line')
      .attr('stroke', '#f44e00')
      .attr('stroke-opacity', 0.6)
      .attr('stroke-width', 2);

    // Create nodes
    const nodes = svg.append('g')
      .attr('class', 'nodes')
      .selectAll('g')
      .data([])
      .enter()
      .append('g')
      .attr('class', 'node')
      .style('cursor', 'pointer');

    // Add circles for nodes
    nodes.append('circle')
      .attr('r', 0)
      .attr('fill', d => {
        if (d.id === 'root') return '#f44e00';
        if (d.id.startsWith('paradigm-')) return '#fa7300';
        return '#8b5cf6';
      })
      .attr('stroke', '#fff')
      .attr('stroke-width', 2);

    // Add text labels
    nodes.append('text')
      .attr('text-anchor', 'middle')
      .attr('dy', '.35em')
      .attr('font-family', 'PPNeueMontreal-Regular, sans-serif')
      .attr('font-size', '12px')
      .attr('fill', '#fff')
      .text(d => d.name)
      .style('opacity', 0);

    // Add hover effects
    nodes
      .on('mouseover', function(event, d) {
        if (reducedMotion) return;
        
        setHoveredNode(d);
        d3.select(this).select('circle')
          .transition()
          .duration(200)
          .attr('r', 25)
          .attr('stroke-width', 3);
        
        d3.select(this).select('text')
          .transition()
          .duration(200)
          .style('opacity', 1)
          .attr('font-size', '14px');
      })
      .on('mouseout', function(event, d) {
        if (reducedMotion) return;
        
        setHoveredNode(null);
        d3.select(this).select('circle')
          .transition()
          .duration(200)
          .attr('r', d.id === 'root' ? 20 : d.id.startsWith('paradigm-') ? 15 : 10)
          .attr('stroke-width', 2);
        
        d3.select(this).select('text')
          .transition()
          .duration(200)
          .style('opacity', 0.8)
          .attr('font-size', '12px');
      })
      .on('click', function(event, d) {
        if (d.id !== 'root' && !d.id.startsWith('paradigm-')) {
          const language = languages.find(l => l.id === d.id);
          if (language && onLanguageSelect) {
            onLanguageSelect(language);
            setSelectedNode(d);
          }
        }
      });

    // Flatten the tree data for simulation
    const flattenTree = (node: TreeNode): TreeNode[] => {
      const result = [node];
      if (node.children) {
        node.children.forEach(child => {
          result.push(...flattenTree(child));
        });
      }
      return result;
    };

    const allNodes = flattenTree(treeData);
    
    // Update simulation with data
    simulation.nodes(allNodes);
    
    // Create links between parent and children
    const linkData = allNodes
      .filter(d => d.parent)
      .map(d => ({ source: d.parent!.id, target: d.id }));

    links.data(linkData);

    // Update positions on tick
    simulation.on('tick', () => {
      links
        .attr('x1', d => (d.source as any).x)
        .attr('y1', d => (d.source as any).y)
        .attr('x2', d => (d.target as any).x)
        .attr('y2', d => (d.target as any).y);

      nodes
        .attr('transform', d => `translate(${d.x},${d.y})`);
    });

    // Animate nodes in
    if (!reducedMotion) {
      nodes.select('circle')
        .transition()
        .duration(800)
        .delay((d, i) => i * 100)
        .attr('r', d => d.id === 'root' ? 20 : d.id.startsWith('paradigm-') ? 15 : 10)
        .ease(d3.easeBackOut);

      nodes.select('text')
        .transition()
        .duration(600)
        .delay((d, i) => i * 100 + 400)
        .style('opacity', 0.8);
    } else {
      nodes.select('circle')
        .attr('r', d => d.id === 'root' ? 20 : d.id.startsWith('paradigm-') ? 15 : 10);
      
      nodes.select('text')
        .style('opacity', 0.8);
    }

    // Cleanup
    return () => {
      simulation.stop();
    };
  }, [languages, width, height, onLanguageSelect, reducedMotion]);

  return (
    <div className="relative w-full h-full">
      <svg
        ref={svgRef}
        width={width}
        height={height}
        className="w-full h-full"
        style={{ background: 'transparent' }}
      />
      
      {/* Node details panel */}
      <AnimatePresence>
        {hoveredNode && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            transition={{ duration: 0.3, ease: [0.19, 1, 0.22, 1] }}
            className="absolute top-4 right-4 bg-black/80 backdrop-blur-lg border border-orange-500/30 rounded-lg p-4 max-w-xs"
          >
            <h3 className="portfolio-medium-text text-white mb-2">{hoveredNode.name}</h3>
            <div className="space-y-1 text-sm">
              <p className="text-gray-300">
                <span className="text-orange-400">Year:</span> {hoveredNode.year}
              </p>
              <p className="text-gray-300">
                <span className="text-orange-400">Paradigm:</span> {hoveredNode.paradigm}
              </p>
              <p className="text-gray-300">
                <span className="text-orange-400">Creator:</span> {hoveredNode.creator}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Selected node info */}
      <AnimatePresence>
        {selectedNode && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            transition={{ duration: 0.5, ease: [0.19, 1, 0.22, 1] }}
            className="absolute bottom-4 left-4 bg-gradient-to-r from-orange-500/20 to-orange-400/20 backdrop-blur-lg border border-orange-500/50 rounded-lg p-6 max-w-md"
          >
            <h3 className="portfolio-large-text text-white mb-3">{selectedNode.name}</h3>
            <p className="text-sm text-gray-300 leading-relaxed">
              Selected language from the family tree. Click on other nodes to explore more languages.
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default EnhancedLanguageFamilyTree;