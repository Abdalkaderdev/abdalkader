/**
 * PredictionDisplay Component for AI Predictions
 * Displays AI model predictions with confidence scores and visualizations
 */

import React from 'react';
import { motion } from 'framer-motion';
import './PredictionDisplay.css';

export interface Prediction {
  label: string;
  value: number | string;
  confidence?: number;
  color?: string;
}

export interface PredictionDisplayProps {
  predictions: Prediction[];
  title?: string;
  modelName?: string;
  showConfidence?: boolean;
  showValues?: boolean;
  variant?: 'bar' | 'pie' | 'list';
  maxDisplayItems?: number;
  className?: string;
  'aria-label'?: string;
}

export const PredictionDisplay = React.forwardRef<HTMLDivElement, PredictionDisplayProps>(
  (
    {
      predictions,
      title,
      modelName,
      showConfidence = true,
      showValues = true,
      variant = 'bar',
      maxDisplayItems,
      className = '',
      'aria-label': ariaLabel,
    },
    ref
  ) => {
    const displayPredictions = maxDisplayItems
      ? predictions.slice(0, maxDisplayItems)
      : predictions;

    const sortedPredictions = [...displayPredictions].sort((a, b) => {
      const aValue = typeof a.value === 'number' ? a.value : parseFloat(String(a.value));
      const bValue = typeof b.value === 'number' ? b.value : parseFloat(String(b.value));
      return bValue - aValue;
    });

    const maxValue = Math.max(
      ...sortedPredictions.map((p) =>
        typeof p.value === 'number' ? p.value : parseFloat(String(p.value))
      )
    );

    const getConfidenceColor = (confidence?: number): string => {
      if (confidence === undefined) return 'var(--color-text-grey, #787878)';
      if (confidence >= 0.8) return '#4caf50';
      if (confidence >= 0.6) return '#ff9800';
      return '#f44336';
    };

    const formatValue = (value: number | string): string => {
      if (typeof value === 'number') {
        return value.toFixed(2);
      }
      return String(value);
    };

    const formatPercentage = (value: number): string => {
      return `${(value * 100).toFixed(1)}%`;
    };

    return (
      <div
        ref={ref}
        className={`ai-prediction-display ai-prediction-display--${variant} ${className}`.trim()}
        aria-label={ariaLabel || `Prediction display${title ? `: ${title}` : ''}`}
        role="region"
      >
        {(title || modelName) && (
          <div className="ai-prediction-display__header">
            {title && <h3 className="ai-prediction-display__title">{title}</h3>}
            {modelName && (
              <span className="ai-prediction-display__model-name">{modelName}</span>
            )}
          </div>
        )}

        <div className="ai-prediction-display__content" role="list">
          {variant === 'bar' && (
            <div className="ai-prediction-display__bars">
              {sortedPredictions.map((prediction, index) => {
                const value = typeof prediction.value === 'number'
                  ? prediction.value
                  : parseFloat(String(prediction.value));
                const percentage = maxValue > 0 ? (value / maxValue) * 100 : 0;
                const confidence = prediction.confidence ?? value / maxValue;

                return (
                  <div
                    key={`${prediction.label}-${index}`}
                    className="ai-prediction-display__bar-item"
                    role="listitem"
                  >
                    <div className="ai-prediction-display__bar-label-row">
                      <span className="ai-prediction-display__bar-label">
                        {prediction.label}
                      </span>
                      {showValues && (
                        <span className="ai-prediction-display__bar-value">
                          {formatValue(value)}
                        </span>
                      )}
                    </div>
                    <div className="ai-prediction-display__bar-container">
                      <motion.div
                        className="ai-prediction-display__bar-fill"
                        style={{
                          backgroundColor: prediction.color || getConfidenceColor(confidence),
                        }}
                        initial={{ width: 0 }}
                        animate={{ width: `${percentage}%` }}
                        transition={{ duration: 0.5, delay: index * 0.1 }}
                        role="progressbar"
                        aria-valuenow={percentage}
                        aria-valuemin={0}
                        aria-valuemax={100}
                        aria-label={`${prediction.label}: ${formatValue(value)}`}
                      />
                    </div>
                    {showConfidence && confidence !== undefined && (
                      <div className="ai-prediction-display__bar-confidence">
                        <span
                          className="ai-prediction-display__confidence-badge"
                          style={{
                            backgroundColor: getConfidenceColor(confidence),
                            color: 'white',
                          }}
                        >
                          {formatPercentage(confidence)}
                        </span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}

          {variant === 'list' && (
            <ul className="ai-prediction-display__list">
              {sortedPredictions.map((prediction, index) => {
                const value = typeof prediction.value === 'number'
                  ? prediction.value
                  : parseFloat(String(prediction.value));
                const confidence = prediction.confidence ?? value / maxValue;

                return (
                  <li
                    key={`${prediction.label}-${index}`}
                    className="ai-prediction-display__list-item"
                  >
                    <div className="ai-prediction-display__list-content">
                      <span className="ai-prediction-display__list-label">
                        {prediction.label}
                      </span>
                      <div className="ai-prediction-display__list-values">
                        {showValues && (
                          <span className="ai-prediction-display__list-value">
                            {formatValue(value)}
                          </span>
                        )}
                        {showConfidence && confidence !== undefined && (
                          <span
                            className="ai-prediction-display__list-confidence"
                            style={{ color: getConfidenceColor(confidence) }}
                          >
                            {formatPercentage(confidence)}
                          </span>
                        )}
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}

          {variant === 'pie' && (
            <div className="ai-prediction-display__pie-container">
              <svg
                className="ai-prediction-display__pie-chart"
                viewBox="0 0 200 200"
                aria-label="Pie chart visualization"
              >
                {sortedPredictions.reduce(
                  (acc, prediction, index) => {
                    const value = typeof prediction.value === 'number'
                      ? prediction.value
                      : parseFloat(String(prediction.value));
                    const percentage = maxValue > 0 ? (value / maxValue) * 100 : 0;
                    const angle = (percentage / 100) * 360;
                    const startAngle = acc.currentAngle;
                    const endAngle = startAngle + angle;

                    const startAngleRad = (startAngle * Math.PI) / 180;
                    const endAngleRad = (endAngle * Math.PI) / 180;

                    const x1 = 100 + 80 * Math.cos(startAngleRad);
                    const y1 = 100 + 80 * Math.sin(startAngleRad);
                    const x2 = 100 + 80 * Math.cos(endAngleRad);
                    const y2 = 100 + 80 * Math.sin(endAngleRad);

                    const largeArcFlag = angle > 180 ? 1 : 0;

                    const pathData = [
                      `M 100 100`,
                      `L ${x1} ${y1}`,
                      `A 80 80 0 ${largeArcFlag} 1 ${x2} ${y2}`,
                      `Z`,
                    ].join(' ');

                    acc.paths.push(
                      <motion.path
                        key={`${prediction.label}-${index}`}
                        d={pathData}
                        fill={prediction.color || getConfidenceColor(prediction.confidence)}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.3, delay: index * 0.1 }}
                        aria-label={`${prediction.label}: ${formatValue(value)}`}
                      />
                    );

                    acc.currentAngle = endAngle;
                    return acc;
                  },
                  { currentAngle: 0, paths: [] as JSX.Element[] }
                ).paths}
              </svg>
              <div className="ai-prediction-display__pie-legend">
                {sortedPredictions.map((prediction, index) => (
                  <div key={`legend-${index}`} className="ai-prediction-display__legend-item">
                    <span
                      className="ai-prediction-display__legend-color"
                      style={{
                        backgroundColor:
                          prediction.color || getConfidenceColor(prediction.confidence),
                      }}
                    />
                    <span className="ai-prediction-display__legend-label">
                      {prediction.label}
                    </span>
                    {showValues && (
                      <span className="ai-prediction-display__legend-value">
                        {formatValue(
                          typeof prediction.value === 'number'
                            ? prediction.value
                            : parseFloat(String(prediction.value))
                        )}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }
);

PredictionDisplay.displayName = 'PredictionDisplay';

