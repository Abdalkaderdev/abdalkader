import React, { useState, useCallback, useMemo } from 'react';
import { Editor } from '@monaco-editor/react';
import { Button, Input } from '@abdalkader/ui';
import { motion, AnimatePresence } from 'framer-motion';
import './InteractivePlayground.css';

interface PlaygroundProps {
  componentName: string;
  initialCode: string;
  component: React.ComponentType<any>;
}

const InteractivePlayground: React.FC<PlaygroundProps> = ({
  componentName,
  initialCode,
  component: Component,
}) => {
  const [code, setCode] = useState(initialCode);
  const [isRunning, setIsRunning] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [previewProps, setPreviewProps] = useState<any>({});

  // Parse props from code
  const parsePropsFromCode = useCallback((codeString: string) => {
    try {
      // Extract props from JSX
      const propsMatch = codeString.match(/<(\w+)([^>]*)>/);
      if (!propsMatch) return {};

      const propsString = propsMatch[2];
      const props: any = {};

      // Simple prop parsing (this could be enhanced)
      const propMatches = propsString.matchAll(/(\w+)=["']([^"']*)["']/g);
      for (const match of propMatches) {
        const [, key, value] = match;
        props[key] = value === 'true' ? true : value === 'false' ? false : value;
      }

      return props;
    } catch (err) {
      console.error('Error parsing props:', err);
      return {};
    }
  }, []);

  const handleCodeChange = useCallback((value: string | undefined) => {
    if (value) {
      setCode(value);
      setError(null);
      const newProps = parsePropsFromCode(value);
      setPreviewProps(newProps);
    }
  }, [parsePropsFromCode]);

  const handleRun = useCallback(() => {
    setIsRunning(true);
    setError(null);
    
    // Simulate running the code
    setTimeout(() => {
      try {
        const newProps = parsePropsFromCode(code);
        setPreviewProps(newProps);
        setIsRunning(false);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
        setIsRunning(false);
      }
    }, 500);
  }, [code, parsePropsFromCode]);

  const handleCopyCode = useCallback(() => {
    navigator.clipboard.writeText(code);
  }, [code]);

  const handleReset = useCallback(() => {
    setCode(initialCode);
    setError(null);
    setPreviewProps({});
  }, [initialCode]);

  const editorOptions = useMemo(() => ({
    minimap: { enabled: false },
    fontSize: 14,
    lineNumbers: 'on' as const,
    roundedSelection: false,
    scrollBeyondLastLine: false,
    automaticLayout: true,
    tabSize: 2,
    insertSpaces: true,
    wordWrap: 'on' as const,
  }), []);

  return (
    <div className="interactive-playground">
      <div className="playground-header">
        <h3>Interactive Playground: {componentName}</h3>
        <div className="playground-actions">
          <Button
            variant="secondary"
            size="small"
            onClick={handleReset}
            disabled={isRunning}
          >
            Reset
          </Button>
          <Button
            variant="secondary"
            size="small"
            onClick={handleCopyCode}
            disabled={isRunning}
          >
            Copy Code
          </Button>
          <Button
            variant="primary"
            size="small"
            onClick={handleRun}
            disabled={isRunning}
          >
            {isRunning ? 'Running...' : 'Run Code'}
          </Button>
        </div>
      </div>

      <div className="playground-content">
        <div className="code-editor">
          <div className="editor-header">
            <span>Code Editor</span>
            <span className="language-badge">TSX</span>
          </div>
          <Editor
            height="400px"
            language="typescript"
            value={code}
            onChange={handleCodeChange}
            options={editorOptions}
            theme="vs-dark"
          />
        </div>

        <div className="preview-panel">
          <div className="preview-header">
            <span>Live Preview</span>
            <AnimatePresence>
              {isRunning && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="loading-indicator"
                >
                  <div className="spinner" />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          
          <div className="preview-content">
            <AnimatePresence mode="wait">
              {error ? (
                <motion.div
                  key="error"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="error-message"
                >
                  <h4>Error</h4>
                  <p>{error}</p>
                </motion.div>
              ) : (
                <motion.div
                  key="preview"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="component-preview"
                >
                  <Component {...previewProps} />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      <div className="playground-footer">
        <div className="props-display">
          <h4>Current Props:</h4>
          <pre>{JSON.stringify(previewProps, null, 2)}</pre>
        </div>
      </div>
    </div>
  );
};

export default InteractivePlayground;