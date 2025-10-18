import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './TestingTools.css';

interface ViewportSize {
  name: string;
  width: number;
  height: number;
  type: 'mobile' | 'tablet' | 'desktop' | 'wide';
}

interface AccessibilityIssue {
  id: string;
  severity: 'error' | 'warning' | 'info';
  message: string;
  element: string;
  help: string;
}

interface TestingToolsProps {
  children: React.ReactNode;
}

const TestingTools: React.FC<TestingToolsProps> = ({ children }) => {
  const [activeTool, setActiveTool] = useState<'viewport' | 'accessibility' | 'visual' | 'interaction'>('viewport');
  const [currentViewport, setCurrentViewport] = useState<ViewportSize>({
    name: 'Desktop',
    width: 1200,
    height: 800,
    type: 'desktop'
  });
  const [accessibilityIssues, setAccessibilityIssues] = useState<AccessibilityIssue[]>([]);
  const [isScanning, setIsScanning] = useState(false);
  const [interactionLog, setInteractionLog] = useState<string[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);

  const viewportSizes: ViewportSize[] = [
    { name: 'iPhone SE', width: 375, height: 667, type: 'mobile' },
    { name: 'iPhone 12', width: 390, height: 844, type: 'mobile' },
    { name: 'iPad', width: 768, height: 1024, type: 'tablet' },
    { name: 'iPad Pro', width: 1024, height: 1366, type: 'tablet' },
    { name: 'Desktop', width: 1200, height: 800, type: 'desktop' },
    { name: 'Wide Desktop', width: 1920, height: 1080, type: 'wide' },
    { name: 'Ultra Wide', width: 2560, height: 1440, type: 'wide' }
  ];

  const mockAccessibilityIssues: AccessibilityIssue[] = [
    {
      id: '1',
      severity: 'error',
      message: 'Elements must have sufficient color contrast',
      element: 'button.primary',
      help: 'Ensure text has a contrast ratio of at least 4.5:1 for normal text and 3:1 for large text.'
    },
    {
      id: '2',
      severity: 'warning',
      message: 'Interactive elements should have accessible names',
      element: 'button[aria-label]',
      help: 'Provide accessible names for all interactive elements using aria-label, aria-labelledby, or visible text.'
    },
    {
      id: '3',
      severity: 'info',
      message: 'Consider adding focus indicators',
      element: 'button:focus',
      help: 'Ensure focus indicators are visible and meet WCAG guidelines for focus visibility.'
    }
  ];

  const handleViewportChange = (viewport: ViewportSize) => {
    setCurrentViewport(viewport);
  };

  const runAccessibilityScan = async () => {
    setIsScanning(true);
    setAccessibilityIssues([]);
    
    // Simulate accessibility scanning
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setAccessibilityIssues(mockAccessibilityIssues);
    setIsScanning(false);
  };

  const logInteraction = (event: string) => {
    const timestamp = new Date().toLocaleTimeString();
    setInteractionLog(prev => [`${timestamp}: ${event}`, ...prev.slice(0, 9)]);
  };

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.tagName === 'BUTTON') {
        logInteraction(`Button clicked: ${target.textContent || 'Unknown'}`);
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Tab') {
        logInteraction('Tab navigation');
      } else if (e.key === 'Enter' || e.key === ' ') {
        logInteraction(`Key pressed: ${e.key}`);
      }
    };

    document.addEventListener('click', handleClick);
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('click', handleClick);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const tools = [
    { id: 'viewport', label: 'Viewport', icon: '📱', description: 'Test responsive design' },
    { id: 'accessibility', label: 'Accessibility', icon: '♿', description: 'Check a11y compliance' },
    { id: 'visual', label: 'Visual', icon: '👁️', description: 'Visual regression testing' },
    { id: 'interaction', label: 'Interaction', icon: '🖱️', description: 'Track user interactions' }
  ] as const;

  return (
    <div className="testing-tools">
      <div className="tools-header">
        <h3>Testing Tools</h3>
        <p>Comprehensive testing and validation tools for components</p>
      </div>

      <div className="tools-tabs">
        {tools.map((tool) => (
          <button
            key={tool.id}
            className={`tool-tab ${activeTool === tool.id ? 'active' : ''}`}
            onClick={() => setActiveTool(tool.id)}
            title={tool.description}
          >
            <span className="tool-icon">{tool.icon}</span>
            <span className="tool-label">{tool.label}</span>
          </button>
        ))}
      </div>

      <div className="tools-content">
        <div className="preview-container">
          <div
            ref={containerRef}
            className="component-preview"
            style={{
              width: `${currentViewport.width}px`,
              height: `${currentViewport.height}px`,
              maxWidth: '100%',
              maxHeight: '80vh',
              overflow: 'auto',
              border: '1px solid var(--color-border, rgb(37, 37, 37))',
              borderRadius: 'var(--border-radius, 12px)',
              background: 'var(--color-bg-primary, #000)',
              margin: '0 auto'
            }}
          >
            {children}
          </div>
        </div>

        <div className="tools-panel">
          <AnimatePresence mode="wait">
            {activeTool === 'viewport' && (
              <motion.div
                key="viewport"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="viewport-panel"
              >
                <h4>Viewport Testing</h4>
                <p>Test your component across different screen sizes</p>
                
                <div className="viewport-grid">
                  {viewportSizes.map((viewport) => (
                    <button
                      key={viewport.name}
                      className={`viewport-option ${currentViewport.name === viewport.name ? 'active' : ''}`}
                      onClick={() => handleViewportChange(viewport)}
                    >
                      <div className="viewport-icon">
                        {viewport.type === 'mobile' && '📱'}
                        {viewport.type === 'tablet' && '📱'}
                        {viewport.type === 'desktop' && '💻'}
                        {viewport.type === 'wide' && '🖥️'}
                      </div>
                      <div className="viewport-info">
                        <span className="viewport-name">{viewport.name}</span>
                        <span className="viewport-size">{viewport.width} × {viewport.height}</span>
                      </div>
                    </button>
                  ))}
                </div>

                <div className="current-viewport">
                  <h5>Current Viewport</h5>
                  <div className="viewport-details">
                    <span>{currentViewport.name}</span>
                    <span>{currentViewport.width} × {currentViewport.height}</span>
                    <span className={`viewport-type ${currentViewport.type}`}>
                      {currentViewport.type.toUpperCase()}
                    </span>
                  </div>
                </div>
              </motion.div>
            )}

            {activeTool === 'accessibility' && (
              <motion.div
                key="accessibility"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="accessibility-panel"
              >
                <div className="panel-header">
                  <h4>Accessibility Testing</h4>
                  <button
                    className="scan-button"
                    onClick={runAccessibilityScan}
                    disabled={isScanning}
                  >
                    {isScanning ? 'Scanning...' : 'Run Scan'}
                  </button>
                </div>

                {isScanning && (
                  <div className="scanning-indicator">
                    <div className="spinner" />
                    <span>Scanning for accessibility issues...</span>
                  </div>
                )}

                {accessibilityIssues.length > 0 && (
                  <div className="issues-list">
                    {accessibilityIssues.map((issue) => (
                      <div key={issue.id} className={`issue-item ${issue.severity}`}>
                        <div className="issue-header">
                          <span className={`severity-badge ${issue.severity}`}>
                            {issue.severity.toUpperCase()}
                          </span>
                          <span className="issue-element">{issue.element}</span>
                        </div>
                        <p className="issue-message">{issue.message}</p>
                        <p className="issue-help">{issue.help}</p>
                      </div>
                    ))}
                  </div>
                )}

                {!isScanning && accessibilityIssues.length === 0 && (
                  <div className="no-issues">
                    <span className="success-icon">✅</span>
                    <p>No accessibility issues found!</p>
                  </div>
                )}
              </motion.div>
            )}

            {activeTool === 'visual' && (
              <motion.div
                key="visual"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="visual-panel"
              >
                <h4>Visual Regression Testing</h4>
                <p>Compare visual changes across different states</p>
                
                <div className="visual-controls">
                  <button className="capture-button">
                    📸 Capture Screenshot
                  </button>
                  <button className="compare-button">
                    🔍 Compare with Baseline
                  </button>
                </div>

                <div className="visual-examples">
                  <div className="visual-state">
                    <h5>Default State</h5>
                    <div className="visual-preview">
                      <div className="mock-component">Component</div>
                    </div>
                  </div>
                  
                  <div className="visual-state">
                    <h5>Hover State</h5>
                    <div className="visual-preview">
                      <div className="mock-component hover">Component</div>
                    </div>
                  </div>
                  
                  <div className="visual-state">
                    <h5>Focus State</h5>
                    <div className="visual-preview">
                      <div className="mock-component focus">Component</div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {activeTool === 'interaction' && (
              <motion.div
                key="interaction"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="interaction-panel"
              >
                <h4>Interaction Testing</h4>
                <p>Track user interactions and events</p>
                
                <div className="interaction-log">
                  <div className="log-header">
                    <span>Event Log</span>
                    <button 
                      className="clear-log"
                      onClick={() => setInteractionLog([])}
                    >
                      Clear
                    </button>
                  </div>
                  
                  <div className="log-entries">
                    {interactionLog.length === 0 ? (
                      <p className="no-events">No interactions recorded yet. Try clicking or using keyboard navigation.</p>
                    ) : (
                      interactionLog.map((entry, index) => (
                        <div key={index} className="log-entry">
                          {entry}
                        </div>
                      ))
                    )}
                  </div>
                </div>

                <div className="interaction-tips">
                  <h5>Testing Tips</h5>
                  <ul>
                    <li>Use Tab to navigate between interactive elements</li>
                    <li>Test with keyboard only (no mouse)</li>
                    <li>Check focus indicators are visible</li>
                    <li>Verify all interactive elements are reachable</li>
                  </ul>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default TestingTools;