import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiPlay, FiPause, FiSquare, FiSettings } from 'react-icons/fi';
import WebcamFallback from './WebcamFallback';

interface ComputerVisionExperimentProps {
  className?: string;
}

export default function ComputerVisionExperiment({ className = '' }: ComputerVisionExperimentProps) {
  const [isRunning, setIsRunning] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [detections, setDetections] = useState<any[]>([]);
  const [fps, setFps] = useState(0);
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const animationRef = useRef<number | null>(null);
  const lastTimeRef = useRef<number>(0);
  const frameCountRef = useRef<number>(0);

  // Mock TensorFlow.js detection (replace with actual implementation)
  const runDetection = async (video: HTMLVideoElement, canvas: HTMLCanvasElement) => {
    if (!video || !canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Draw video frame to canvas
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    // Mock detection results (replace with actual TensorFlow.js model)
    const mockDetections = [
      {
        bbox: [100, 100, 200, 150],
        class: 'person',
        score: 0.95
      },
      {
        bbox: [300, 200, 150, 100],
        class: 'laptop',
        score: 0.87
      }
    ];

    // Draw bounding boxes
    mockDetections.forEach(detection => {
      const [x, y, width, height] = detection.bbox;
      
      ctx.strokeStyle = '#f44e00';
      ctx.lineWidth = 2;
      ctx.strokeRect(x, y, width, height);
      
      ctx.fillStyle = '#f44e00';
      ctx.font = '14px var(--font-pp-medium)';
      ctx.fillText(`${detection.class} (${Math.round(detection.score * 100)}%)`, x, y - 5);
    });

    setDetections(mockDetections);
  };

  const startDetection = async () => {
    try {
      setIsLoading(true);
      setError(null);

      // This would normally load the TensorFlow.js model
      // await loadModel();
      
      setIsRunning(true);
      setIsLoading(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to start detection');
      setIsLoading(false);
    }
  };

  const stopDetection = () => {
    setIsRunning(false);
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
  };

  const handleWebcamReady = (stream: MediaStream) => {
    if (videoRef.current) {
      videoRef.current.srcObject = stream;
      streamRef.current = stream;
    }
  };

  const handleWebcamError = (error: string) => {
    setError(error);
  };

  // Animation loop
  useEffect(() => {
    if (!isRunning || !videoRef.current || !canvasRef.current) return;

    const animate = (currentTime: number) => {
      if (lastTimeRef.current === 0) {
        lastTimeRef.current = currentTime;
      }

      const deltaTime = currentTime - lastTimeRef.current;
      frameCountRef.current++;

      if (deltaTime >= 1000) {
        setFps(Math.round((frameCountRef.current * 1000) / deltaTime));
        frameCountRef.current = 0;
        lastTimeRef.current = currentTime;
      }

      if (videoRef.current && canvasRef.current) {
        runDetection(videoRef.current, canvasRef.current);
      }

      animationRef.current = requestAnimationFrame(animate);
    };

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isRunning]);

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Controls */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <h3 className="text-lg font-semibold text-white" style={{ fontFamily: 'var(--font-pp-medium)' }}>
            Real-time Object Detection
          </h3>
          {fps > 0 && (
            <div className="px-3 py-1 bg-green-500/20 text-green-400 rounded-full text-sm">
              {fps} FPS
            </div>
          )}
        </div>
        
        <div className="flex items-center gap-2">
          {!isRunning ? (
            <button
              onClick={startDetection}
              disabled={isLoading}
              className="lab-button flex items-center gap-2"
            >
              <FiPlay className="w-4 h-4" />
              {isLoading ? 'Starting...' : 'Start Detection'}
            </button>
          ) : (
            <button
              onClick={stopDetection}
              className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg font-semibold transition-colors flex items-center gap-2"
            >
              <FiSquare className="w-4 h-4" />
              Stop
            </button>
          )}
        </div>
      </div>

      {/* Video and Canvas */}
      <div className="relative bg-black rounded-lg overflow-hidden">
        <video
          ref={videoRef}
          autoPlay
          muted
          playsInline
          className="w-full h-auto"
          style={{ display: isRunning ? 'block' : 'none' }}
        />
        <canvas
          ref={canvasRef}
          className="absolute top-0 left-0 w-full h-full"
          style={{ display: isRunning ? 'block' : 'none' }}
        />
        
        {!isRunning && (
          <WebcamFallback
            onWebcamReady={handleWebcamReady}
            onError={handleWebcamError}
            className="h-64"
          />
        )}
      </div>

      {/* Detection Results */}
      {detections.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="lab-card p-4"
        >
          <h4 className="text-sm font-semibold text-white mb-3" style={{ fontFamily: 'var(--font-pp-medium)' }}>
            Detected Objects ({detections.length})
          </h4>
          <div className="space-y-2">
            {detections.map((detection, index) => (
              <div key={index} className="flex items-center justify-between text-sm">
                <span className="text-gray-300 capitalize">{detection.class}</span>
                <span className="text-orange-500 font-medium">
                  {Math.round(detection.score * 100)}%
                </span>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Error Display */}
      {error && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-red-900/20 border border-red-500/30 rounded-lg p-4"
        >
          <p className="text-red-400 text-sm" style={{ fontFamily: 'var(--font-pp-regular)' }}>
            {error}
          </p>
        </motion.div>
      )}
    </div>
  );
}