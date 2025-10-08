import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiRefreshCw, FiMaximize2, FiMinimize2 } from 'react-icons/fi';

interface ComponentPreviewProps {
  code: string;
  isLoading?: boolean;
  error?: string | null;
  onRefresh?: () => void;
}

export default function ComponentPreview({
  code,
  isLoading = false,
  error = null,
  onRefresh
}: ComponentPreviewProps) {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [previewContent, setPreviewContent] = useState<JSX.Element | null>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    if (code && !error) {
      try {
        // Create a safe preview by rendering in an iframe
        const previewHTML = createPreviewHTML(code);
        if (iframeRef.current) {
          const iframe = iframeRef.current;
          iframe.srcdoc = previewHTML;
        }
      } catch (err) {
        console.error('Preview error:', err);
      }
    }
  }, [code, error]);

  const createPreviewHTML = (componentCode: string) => {
    return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Component Preview</title>
  <script src="https://unpkg.com/react@18/umd/react.development.js"></script>
  <script src="https://unpkg.com/react-dom@18/umd/react-dom.development.js"></script>
  <script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
  <style>
    body {
      margin: 0;
      padding: 20px;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
      background: white;
    }
    .preview-container {
      display: flex;
      align-items: center;
      justify-content: center;
      min-height: 200px;
    }
    .error {
      color: #ef4444;
      background: #fef2f2;
      border: 1px solid #fecaca;
      border-radius: 8px;
      padding: 16px;
      margin: 16px 0;
    }
  </style>
</head>
<body>
  <div id="preview-root" class="preview-container"></div>
  
  <script type="text/babel">
    const { useState, useEffect, useRef } = React;
    
    // Mock @abdalkader/ui components for preview
    const Button = ({ variant = 'primary', size = 'md', children, onClick, disabled, ...props }) => {
      const baseStyles = 'px-4 py-2 rounded-lg font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2';
      const variants = {
        primary: 'bg-blue-500 hover:bg-blue-600 text-white focus:ring-blue-500',
        secondary: 'bg-gray-500 hover:bg-gray-600 text-white focus:ring-gray-500',
        outline: 'border-2 border-blue-500 text-blue-500 hover:bg-blue-50 focus:ring-blue-500'
      };
      const sizes = {
        sm: 'px-3 py-1 text-sm',
        md: 'px-4 py-2',
        lg: 'px-6 py-3 text-lg'
      };
      
      return React.createElement('button', {
        className: \`\${baseStyles} \${variants[variant]} \${sizes[size]} \${disabled ? 'opacity-50 cursor-not-allowed' : ''}\`,
        onClick: disabled ? undefined : onClick,
        disabled,
        ...props
      }, children);
    };
    
    const Input = ({ type = 'text', placeholder, value, onChange, disabled, ...props }) => {
      return React.createElement('input', {
        type,
        placeholder,
        value,
        onChange,
        disabled,
        className: 'px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed',
        ...props
      });
    };
    
    const Card = ({ children, className = '', ...props }) => {
      return React.createElement('div', {
        className: \`bg-white border border-gray-200 rounded-lg shadow-sm p-6 \${className}\`,
        ...props
      }, children);
    };
    
    try {
      // User's component code
      ${componentCode}
      
      // Render the component
      const root = ReactDOM.createRoot(document.getElementById('preview-root'));
      root.render(React.createElement(PreviewComponent || (() => React.createElement('div', null, 'No component to preview'))));
    } catch (error) {
      document.getElementById('preview-root').innerHTML = \`
        <div class="error">
          <strong>Preview Error:</strong><br>
          \${error.message}
        </div>
      \`;
    }
  </script>
</body>
</html>`;
  };

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  return (
    <motion.div
      className={`component-preview ${isFullscreen ? 'fixed inset-0 z-50 m-4' : 'relative'}`}
      layout
    >
      {/* Header */}
      <div className="flex items-center justify-between p-3 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
        <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">
          Component Preview
        </h3>
        <div className="flex items-center gap-2">
          {onRefresh && (
            <button
              onClick={onRefresh}
              disabled={isLoading}
              className="p-1 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
            >
              <FiRefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
            </button>
          )}
          <button
            onClick={toggleFullscreen}
            className="p-1 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
          >
            {isFullscreen ? (
              <FiMinimize2 className="w-4 h-4" />
            ) : (
              <FiMaximize2 className="w-4 h-4" />
            )}
          </button>
        </div>
      </div>

      {/* Preview Content */}
      <div className={`bg-white dark:bg-gray-900 ${isFullscreen ? 'h-full' : 'h-96'} relative overflow-hidden`}>
        <AnimatePresence mode="wait">
          {isLoading ? (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex items-center justify-center h-full"
            >
              <div className="flex flex-col items-center gap-3">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                <p className="text-sm text-gray-500">Rendering preview...</p>
              </div>
            </motion.div>
          ) : error ? (
            <motion.div
              key="error"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex items-center justify-center h-full p-4"
            >
              <div className="text-center">
                <div className="text-red-500 text-4xl mb-2">⚠️</div>
                <h4 className="text-lg font-medium text-red-600 mb-2">Preview Error</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400 max-w-md">
                  {error}
                </p>
              </div>
            </motion.div>
          ) : (
            <motion.iframe
              key="preview"
              ref={iframeRef}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="w-full h-full border-0"
              sandbox="allow-scripts allow-same-origin"
              title="Component Preview"
            />
          )}
        </AnimatePresence>
      </div>

      {/* Fullscreen overlay */}
      {isFullscreen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={toggleFullscreen}
        />
      )}
    </motion.div>
  );
}