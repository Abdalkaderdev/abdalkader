/**
 * ModelOutputVisualizer Component for AI Model Outputs
 * Visualizes various types of AI model outputs including text, JSON, code, and structured data
 */

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import './ModelOutputVisualizer.css';

export type OutputType = 'text' | 'json' | 'code' | 'table' | 'markdown' | 'html';

export interface ModelOutput {
  type: OutputType;
  content: string | object | Array<Record<string, unknown>>;
  metadata?: {
    model?: string;
    timestamp?: Date | string;
    tokens?: number;
    processingTime?: number;
  };
}

export interface ModelOutputVisualizerProps {
  output: ModelOutput;
  showMetadata?: boolean;
  showRaw?: boolean;
  maxHeight?: string;
  className?: string;
  'aria-label'?: string;
  onCopy?: (content: string) => void;
}

export const ModelOutputVisualizer = React.forwardRef<HTMLDivElement, ModelOutputVisualizerProps>(
  (
    {
      output,
      showMetadata = true,
      showRaw = false,
      maxHeight = '400px',
      className = '',
      'aria-label': ariaLabel,
      onCopy,
    },
    ref
  ) => {
    const [activeTab, setActiveTab] = useState<'formatted' | 'raw'>('formatted');
    const [isExpanded, setIsExpanded] = useState(false);

    const formatContent = (): string => {
      if (typeof output.content === 'string') {
        return output.content;
      }
      return JSON.stringify(output.content, null, 2);
    };

    const formatMetadata = () => {
      if (!output.metadata) return null;
      return {
        model: output.metadata.model,
        timestamp: output.metadata.timestamp
          ? new Date(output.metadata.timestamp).toLocaleString()
          : undefined,
        tokens: output.metadata.tokens,
        processingTime: output.metadata.processingTime
          ? `${output.metadata.processingTime}ms`
          : undefined,
      };
    };

    const handleCopy = () => {
      const content = formatContent();
      if (onCopy) {
        onCopy(content);
      } else {
        navigator.clipboard.writeText(content);
      }
    };

    const renderFormattedContent = () => {
      const content = formatContent();

      switch (output.type) {
        case 'json':
          return (
            <pre className="ai-model-output__json">
              <code>{content}</code>
            </pre>
          );
        case 'code':
          return (
            <pre className="ai-model-output__code">
              <code>{content}</code>
            </pre>
          );
        case 'table':
          if (Array.isArray(output.content)) {
            const headers = Object.keys(output.content[0] || {});
            return (
              <table className="ai-model-output__table" role="table">
                <thead>
                  <tr>
                    {headers.map((header) => (
                      <th key={header}>{header}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {output.content.map((row, index) => (
                    <tr key={index}>
                      {headers.map((header) => (
                        <td key={header}>
                          {String(row[header] ?? '')}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            );
          }
          return <pre className="ai-model-output__text">{content}</pre>;
        case 'markdown':
        case 'html':
        case 'text':
        default:
          return (
            <div
              className={`ai-model-output__text ai-model-output__text--${output.type}`}
              dangerouslySetInnerHTML={
                output.type === 'html' ? { __html: content } : undefined
              }
            >
              {output.type !== 'html' && content}
            </div>
          );
      }
    };

    const metadata = formatMetadata();

    return (
      <div
        ref={ref}
        className={`ai-model-output ${className}`.trim()}
        aria-label={ariaLabel || 'Model output visualizer'}
        role="region"
      >
        <div className="ai-model-output__header">
          <div className="ai-model-output__header-left">
            <span className="ai-model-output__type-badge" data-type={output.type}>
              {output.type.toUpperCase()}
            </span>
            {metadata?.model && (
              <span className="ai-model-output__model-name">{metadata.model}</span>
            )}
          </div>
          <div className="ai-model-output__header-actions">
            {showRaw && (
              <div className="ai-model-output__tabs" role="tablist">
                <button
                  className={`ai-model-output__tab ${
                    activeTab === 'formatted' ? 'ai-model-output__tab--active' : ''
                  }`}
                  onClick={() => setActiveTab('formatted')}
                  role="tab"
                  aria-selected={activeTab === 'formatted'}
                >
                  Formatted
                </button>
                <button
                  className={`ai-model-output__tab ${
                    activeTab === 'raw' ? 'ai-model-output__tab--active' : ''
                  }`}
                  onClick={() => setActiveTab('raw')}
                  role="tab"
                  aria-selected={activeTab === 'raw'}
                >
                  Raw
                </button>
              </div>
            )}
            <button
              className="ai-model-output__copy-button"
              onClick={handleCopy}
              aria-label="Copy output"
              title="Copy output"
            >
              📋
            </button>
          </div>
        </div>

        {showMetadata && metadata && (
          <div className="ai-model-output__metadata" role="group" aria-label="Output metadata">
            {metadata.timestamp && (
              <span className="ai-model-output__metadata-item">
                <span className="ai-model-output__metadata-label">Time:</span>
                {metadata.timestamp}
              </span>
            )}
            {metadata.tokens && (
              <span className="ai-model-output__metadata-item">
                <span className="ai-model-output__metadata-label">Tokens:</span>
                {metadata.tokens.toLocaleString()}
              </span>
            )}
            {metadata.processingTime && (
              <span className="ai-model-output__metadata-item">
                <span className="ai-model-output__metadata-label">Processing:</span>
                {metadata.processingTime}
              </span>
            )}
          </div>
        )}

        <div
          className={`ai-model-output__content ${
            isExpanded ? 'ai-model-output__content--expanded' : ''
          }`}
          style={{ maxHeight: isExpanded ? 'none' : maxHeight }}
        >
          {activeTab === 'formatted' ? renderFormattedContent() : (
            <pre className="ai-model-output__raw">
              <code>{formatContent()}</code>
            </pre>
          )}
        </div>

        {!isExpanded && (
          <button
            className="ai-model-output__expand-button"
            onClick={() => setIsExpanded(true)}
            aria-label="Expand output"
          >
            Show more
          </button>
        )}
      </div>
    );
  }
);

ModelOutputVisualizer.displayName = 'ModelOutputVisualizer';

