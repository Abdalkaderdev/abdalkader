'use client';

import React, { useRef, useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Activity, Brain, Zap, Waves } from 'lucide-react';
import { EEGData, BioSignalState } from '@/lib/bci/eegProcessor';
import { useReducedMotion } from '@/hooks/useAnimations';

interface EEGVisualizerProps {
  eegData: EEGData | null;
  bioState: BioSignalState | null;
  className?: string;
  showSpectrogram?: boolean;
  showBrainwaves?: boolean;
  showBioState?: boolean;
}

export const EEGVisualizer: React.FC<EEGVisualizerProps> = ({
  eegData,
  bioState,
  className = '',
  showSpectrogram = true,
  showBrainwaves = true,
  showBioState = true,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const spectrogramRef = useRef<HTMLCanvasElement>(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const reducedMotion = useReducedMotion();

  // Draw real-time EEG waveform
  useEffect(() => {
    if (!eegData || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;

    // Clear canvas
    ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
    ctx.fillRect(0, 0, width, height);

    // Draw waveform for each channel
    const channels = Object.keys(eegData.channels);
    const channelHeight = height / channels.length;

    channels.forEach((channel, index) => {
      const y = index * channelHeight + channelHeight / 2;
      const value = eegData.channels[channel];
      
      // Normalize value to canvas coordinates
      const normalizedValue = (value + 100) / 200; // Assuming values between -100 and 100
      const x = normalizedValue * width;

      // Draw channel line
      ctx.strokeStyle = `hsl(${index * 60}, 70%, 60%)`;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(x, y);
      ctx.stroke();

      // Draw channel label
      ctx.fillStyle = 'white';
      ctx.font = '12px monospace';
      ctx.fillText(channel, 10, y - 5);
    });

    // Draw quality indicator
    const qualityColor = eegData.quality > 0.7 ? '#10b981' : eegData.quality > 0.4 ? '#f59e0b' : '#ef4444';
    ctx.fillStyle = qualityColor;
    ctx.fillRect(width - 20, 10, 10, 10);
  }, [eegData]);

  // Draw spectrogram
  useEffect(() => {
    if (!eegData || !spectrogramRef.current || !showSpectrogram) return;

    const canvas = spectrogramRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;

    // Clear canvas
    ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
    ctx.fillRect(0, 0, width, height);

    // Draw frequency bands
    const bands = [
      { name: 'Delta', freq: eegData.frequencies.delta, color: '#3b82f6', range: [0, 0.2] },
      { name: 'Theta', freq: eegData.frequencies.theta, color: '#8b5cf6', range: [0.2, 0.4] },
      { name: 'Alpha', freq: eegData.frequencies.alpha, color: '#10b981', range: [0.4, 0.6] },
      { name: 'Beta', freq: eegData.frequencies.beta, color: '#f59e0b', range: [0.6, 0.8] },
      { name: 'Gamma', freq: eegData.frequencies.gamma, color: '#ef4444', range: [0.8, 1.0] },
    ];

    bands.forEach((band, index) => {
      const y = band.range[0] * height;
      const bandHeight = (band.range[1] - band.range[0]) * height;
      const intensity = Math.min(1, band.freq / 100); // Normalize intensity
      
      // Draw band background
      ctx.fillStyle = `${band.color}20`;
      ctx.fillRect(0, y, width, bandHeight);
      
      // Draw intensity bar
      ctx.fillStyle = band.color;
      ctx.fillRect(0, y, intensity * width, bandHeight);
      
      // Draw band label
      ctx.fillStyle = 'white';
      ctx.font = '10px monospace';
      ctx.fillText(band.name, 5, y + bandHeight / 2 + 3);
    });
  }, [eegData, showSpectrogram]);

  // Get bio state color
  const getBioStateColor = (value: number, type: string) => {
    switch (type) {
      case 'focus':
        return value > 0.7 ? '#10b981' : value > 0.4 ? '#f59e0b' : '#ef4444';
      case 'meditation':
        return value > 0.7 ? '#8b5cf6' : value > 0.4 ? '#3b82f6' : '#6b7280';
      case 'stress':
        return value > 0.7 ? '#ef4444' : value > 0.4 ? '#f59e0b' : '#10b981';
      case 'arousal':
        return value > 0.7 ? '#f59e0b' : value > 0.4 ? '#3b82f6' : '#6b7280';
      default:
        return '#6b7280';
    }
  };

  // Get bio state label
  const getBioStateLabel = (value: number, type: string) => {
    switch (type) {
      case 'focus':
        return value > 0.7 ? 'High Focus' : value > 0.4 ? 'Moderate Focus' : 'Low Focus';
      case 'meditation':
        return value > 0.7 ? 'Deep Meditation' : value > 0.4 ? 'Light Meditation' : 'Active Mind';
      case 'stress':
        return value > 0.7 ? 'High Stress' : value > 0.4 ? 'Moderate Stress' : 'Low Stress';
      case 'arousal':
        return value > 0.7 ? 'High Arousal' : value > 0.4 ? 'Moderate Arousal' : 'Low Arousal';
      default:
        return 'Unknown';
    }
  };

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-r from-purple-500 to-blue-500 flex items-center justify-center">
            <Brain className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="portfolio-medium-text text-white">EEG Visualizer</h3>
            <p className="portfolio-small-text text-purple-400">Real-time brainwave analysis</p>
          </div>
        </div>
        
        {eegData && (
          <div className="flex items-center gap-2">
            <div className={`w-3 h-3 rounded-full ${eegData.quality > 0.7 ? 'bg-green-400' : eegData.quality > 0.4 ? 'bg-yellow-400' : 'bg-red-400'}`} />
            <span className="portfolio-small-text text-gray-300">
              {Math.round(eegData.quality * 100)}% quality
            </span>
          </div>
        )}
      </div>

      {/* EEG Waveform */}
      {showBrainwaves && (
        <div className="space-y-4">
          <h4 className="portfolio-small-text text-purple-400">Brainwave Signals</h4>
          <div className="bg-black/50 rounded-lg p-4 border border-purple-500/30">
            <canvas
              ref={canvasRef}
              width={800}
              height={200}
              className="w-full h-48 bg-gray-900/50 rounded"
            />
          </div>
        </div>
      )}

      {/* Spectrogram */}
      {showSpectrogram && (
        <div className="space-y-4">
          <h4 className="portfolio-small-text text-purple-400">Frequency Spectrum</h4>
          <div className="bg-black/50 rounded-lg p-4 border border-purple-500/30">
            <canvas
              ref={spectrogramRef}
              width={800}
              height={150}
              className="w-full h-36 bg-gray-900/50 rounded"
            />
          </div>
        </div>
      )}

      {/* Bio State Indicators */}
      {showBioState && bioState && (
        <div className="space-y-4">
          <h4 className="portfolio-small-text text-purple-400">Bio-Signal State</h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {Object.entries(bioState).map(([key, value]) => (
              <motion.div
                key={key}
                className="bg-black/50 rounded-lg p-4 border border-purple-500/30"
                whileHover={reducedMotion ? {} : { scale: 1.02 }}
                transition={{ duration: 0.2 }}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="portfolio-small-text text-gray-300 capitalize">
                    {key}
                  </span>
                  <span className="portfolio-small-text text-white">
                    {Math.round(value * 100)}%
                  </span>
                </div>
                
                {/* Progress bar */}
                <div className="w-full bg-gray-700 rounded-full h-2 mb-2">
                  <motion.div
                    className="h-2 rounded-full"
                    style={{ backgroundColor: getBioStateColor(value, key) }}
                    initial={{ width: 0 }}
                    animate={{ width: `${value * 100}%` }}
                    transition={{ duration: 0.5, ease: [0.19, 1, 0.22, 1] }}
                  />
                </div>
                
                <p className="portfolio-small-text text-gray-400">
                  {getBioStateLabel(value, key)}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* Artifacts */}
      {eegData && eegData.artifacts.length > 0 && (
        <div className="space-y-2">
          <h4 className="portfolio-small-text text-orange-400">Detected Artifacts</h4>
          <div className="flex flex-wrap gap-2">
            {eegData.artifacts.map((artifact, index) => (
              <motion.span
                key={index}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="px-3 py-1 bg-orange-500/20 text-orange-300 text-xs rounded-full border border-orange-500/30"
              >
                {artifact.replace('_', ' ')}
              </motion.span>
            ))}
          </div>
        </div>
      )}

      {/* No Data State */}
      {!eegData && (
        <div className="text-center py-12">
          <Waves className="w-12 h-12 text-gray-600 mx-auto mb-4" />
          <p className="text-gray-400">No EEG data available</p>
          <p className="text-sm text-gray-500">Connect a device to start visualization</p>
        </div>
      )}
    </div>
  );
};

export default EEGVisualizer;