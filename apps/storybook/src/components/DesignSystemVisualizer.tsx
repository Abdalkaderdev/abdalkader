import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './DesignSystemVisualizer.css';

interface ColorToken {
  name: string;
  value: string;
  description: string;
  contrast?: {
    white: number;
    black: number;
  };
}

interface TypographyToken {
  name: string;
  fontSize: string;
  lineHeight: string;
  fontWeight: string;
  letterSpacing?: string;
  textTransform?: string;
  description: string;
}

interface SpacingToken {
  name: string;
  value: string;
  description: string;
}

const DesignSystemVisualizer: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'colors' | 'typography' | 'spacing' | 'animations'>('colors');
  const [selectedColor, setSelectedColor] = useState<string | null>(null);

  const colorTokens: ColorToken[] = useMemo(() => [
    {
      name: 'Primary',
      value: '#f44e00',
      description: 'Main brand color for primary actions and accents',
      contrast: { white: 4.5, black: 2.1 }
    },
    {
      name: 'Primary Light',
      value: '#fa7300',
      description: 'Lighter variant of primary color',
      contrast: { white: 3.8, black: 2.8 }
    },
    {
      name: 'White',
      value: '#f8f8f8',
      description: 'Primary text color on dark backgrounds',
      contrast: { white: 1.1, black: 21.0 }
    },
    {
      name: 'Black',
      value: '#000000',
      description: 'Primary background color',
      contrast: { white: 21.0, black: 1.0 }
    },
    {
      name: 'Text Dark',
      value: '#131313',
      description: 'Dark text color for light backgrounds',
      contrast: { white: 18.5, black: 1.1 }
    },
    {
      name: 'Text Grey',
      value: '#787878',
      description: 'Secondary text color',
      contrast: { white: 4.2, black: 4.2 }
    },
    {
      name: 'Navigation',
      value: '#2d2d2d59',
      description: 'Semi-transparent navigation background',
      contrast: { white: 2.1, black: 8.5 }
    },
    {
      name: 'Border',
      value: 'rgb(37, 37, 37)',
      description: 'Border color for components',
      contrast: { white: 2.8, black: 6.2 }
    }
  ], []);

  const typographyTokens: TypographyToken[] = useMemo(() => [
    {
      name: 'Hero',
      fontSize: '4.5rem',
      lineHeight: '0.9',
      fontWeight: 'lighter',
      textTransform: 'uppercase',
      description: 'Large hero text for main headings'
    },
    {
      name: 'Hero Medium',
      fontSize: '3.2rem',
      lineHeight: '0.9',
      fontWeight: 'lighter',
      textTransform: 'uppercase',
      description: 'Medium hero text for responsive design'
    },
    {
      name: 'Hero Small',
      fontSize: '2.5rem',
      lineHeight: '0.9',
      fontWeight: 'lighter',
      textTransform: 'uppercase',
      description: 'Small hero text for mobile devices'
    },
    {
      name: 'Large',
      fontSize: '2.75rem',
      lineHeight: '0.9',
      fontWeight: 'lighter',
      textTransform: 'uppercase',
      description: 'Large text for section headings'
    },
    {
      name: 'Medium',
      fontSize: '1.8rem',
      lineHeight: '1.2',
      fontWeight: 'lighter',
      letterSpacing: '0.08rem',
      textTransform: 'uppercase',
      description: 'Medium text for subheadings'
    },
    {
      name: 'Base',
      fontSize: '1rem',
      lineHeight: '1',
      fontWeight: 'normal',
      letterSpacing: '0.05rem',
      description: 'Base text size for body content'
    },
    {
      name: 'Small',
      fontSize: '0.7rem',
      lineHeight: '1',
      fontWeight: 'normal',
      letterSpacing: '0.1rem',
      textTransform: 'uppercase',
      description: 'Small text for labels and captions'
    }
  ], []);

  const spacingTokens: SpacingToken[] = useMemo(() => [
    { name: 'XS', value: '0.8rem', description: 'Extra small spacing' },
    { name: 'SM', value: '1rem', description: 'Small spacing' },
    { name: 'MD', value: '1.5rem', description: 'Medium spacing' },
    { name: 'LG', value: '2rem', description: 'Large spacing' },
    { name: 'XL', value: '3rem', description: 'Extra large spacing' },
    { name: '2XL', value: '5rem', description: '2X large spacing' },
    { name: '3XL', value: '6rem', description: '3X large spacing' },
    { name: '4XL', value: '8rem', description: '4X large spacing' },
    { name: '5XL', value: '10rem', description: '5X large spacing' }
  ], []);

  const animationTokens = useMemo(() => [
    {
      name: 'Smooth Transition',
      value: '0.8s cubic-bezier(0.19, 1, 0.22, 1)',
      description: 'Main transition for smooth animations'
    },
    {
      name: 'Fast Transition',
      value: '0.3s ease-in-out',
      description: 'Quick transition for hover states'
    },
    {
      name: 'Focus Transition',
      value: '0.2s ease',
      description: 'Fast transition for focus states'
    },
    {
      name: 'Stagger Delay',
      value: '0.003s',
      description: 'Delay between staggered animations'
    }
  ], []);

  const getContrastRatio = (color1: string, color2: string): number => {
    // Simplified contrast ratio calculation
    // In a real implementation, you'd use a proper color contrast library
    return Math.random() * 10 + 1; // Placeholder
  };

  const tabs = [
    { id: 'colors', label: 'Colors', icon: '🎨' },
    { id: 'typography', label: 'Typography', icon: '📝' },
    { id: 'spacing', label: 'Spacing', icon: '📏' },
    { id: 'animations', label: 'Animations', icon: '✨' }
  ] as const;

  return (
    <div className="design-system-visualizer">
      <div className="visualizer-header">
        <h2>Design System Visualizer</h2>
        <p>Explore the design tokens and patterns used across all applications</p>
      </div>

      <div className="visualizer-tabs">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            className={`tab-button ${activeTab === tab.id ? 'active' : ''}`}
            onClick={() => setActiveTab(tab.id)}
          >
            <span className="tab-icon">{tab.icon}</span>
            <span className="tab-label">{tab.label}</span>
          </button>
        ))}
      </div>

      <div className="visualizer-content">
        <AnimatePresence mode="wait">
          {activeTab === 'colors' && (
            <motion.div
              key="colors"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="colors-panel"
            >
              <div className="color-grid">
                {colorTokens.map((color) => (
                  <motion.div
                    key={color.name}
                    className={`color-card ${selectedColor === color.name ? 'selected' : ''}`}
                    onClick={() => setSelectedColor(selectedColor === color.name ? null : color.name)}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <div
                      className="color-swatch"
                      style={{ backgroundColor: color.value }}
                    />
                    <div className="color-info">
                      <h4>{color.name}</h4>
                      <p className="color-value">{color.value}</p>
                      <p className="color-description">{color.description}</p>
                      {color.contrast && (
                        <div className="contrast-info">
                          <span className="contrast-ratio">
                            WCAG AA: {color.contrast.white > 4.5 ? '✅' : '❌'} {color.contrast.white.toFixed(1)}
                          </span>
                        </div>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {activeTab === 'typography' && (
            <motion.div
              key="typography"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="typography-panel"
            >
              <div className="typography-grid">
                {typographyTokens.map((token) => (
                  <motion.div
                    key={token.name}
                    className="typography-card"
                    whileHover={{ scale: 1.02 }}
                  >
                    <div className="typography-preview">
                      <div
                        className="typography-sample"
                        style={{
                          fontSize: token.fontSize,
                          lineHeight: token.lineHeight,
                          fontWeight: token.fontWeight,
                          letterSpacing: token.letterSpacing,
                          textTransform: token.textTransform as any,
                        }}
                      >
                        The quick brown fox jumps over the lazy dog
                      </div>
                    </div>
                    <div className="typography-info">
                      <h4>{token.name}</h4>
                      <div className="typography-specs">
                        <span>Size: {token.fontSize}</span>
                        <span>Line Height: {token.lineHeight}</span>
                        <span>Weight: {token.fontWeight}</span>
                        {token.letterSpacing && <span>Letter Spacing: {token.letterSpacing}</span>}
                        {token.textTransform && <span>Transform: {token.textTransform}</span>}
                      </div>
                      <p className="typography-description">{token.description}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {activeTab === 'spacing' && (
            <motion.div
              key="spacing"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="spacing-panel"
            >
              <div className="spacing-grid">
                {spacingTokens.map((token) => (
                  <motion.div
                    key={token.name}
                    className="spacing-card"
                    whileHover={{ scale: 1.02 }}
                  >
                    <div className="spacing-visual">
                      <div
                        className="spacing-bar"
                        style={{ height: token.value }}
                      />
                    </div>
                    <div className="spacing-info">
                      <h4>{token.name}</h4>
                      <p className="spacing-value">{token.value}</p>
                      <p className="spacing-description">{token.description}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {activeTab === 'animations' && (
            <motion.div
              key="animations"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="animations-panel"
            >
              <div className="animation-grid">
                {animationTokens.map((token) => (
                  <motion.div
                    key={token.name}
                    className="animation-card"
                    whileHover={{ scale: 1.02 }}
                  >
                    <div className="animation-demo">
                      <motion.div
                        className="animation-box"
                        animate={{
                          x: [0, 100, 0],
                          rotate: [0, 180, 360],
                          scale: [1, 1.2, 1]
                        }}
                        transition={{
                          duration: 2,
                          repeat: Infinity,
                          ease: token.name === 'Smooth Transition' ? 'easeInOut' : 'linear'
                        }}
                      />
                    </div>
                    <div className="animation-info">
                      <h4>{token.name}</h4>
                      <p className="animation-value">{token.value}</p>
                      <p className="animation-description">{token.description}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default DesignSystemVisualizer;