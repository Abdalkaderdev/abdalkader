import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiCamera, FiAlertTriangle, FiRefreshCw } from 'react-icons/fi';

interface WebcamFallbackProps {
  onWebcamReady?: (stream: MediaStream) => void;
  onError?: (error: string) => void;
  className?: string;
}

export default function WebcamFallback({ 
  onWebcamReady, 
  onError, 
  className = '' 
}: WebcamFallbackProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hasWebcam, setHasWebcam] = useState<boolean | null>(null);
  const [retryCount, setRetryCount] = useState(0);

  const checkWebcamSupport = async () => {
    try {
      // Check if getUserMedia is supported
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error('Webcam not supported in this browser');
      }

      // Check if webcam is available
      const devices = await navigator.mediaDevices.enumerateDevices();
      const videoDevices = devices.filter(device => device.kind === 'videoinput');
      
      if (videoDevices.length === 0) {
        throw new Error('No webcam detected');
      }

      setHasWebcam(true);
      return true;
    } catch (err) {
      setHasWebcam(false);
      setError(err instanceof Error ? err.message : 'Webcam check failed');
      return false;
    }
  };

  const requestWebcamAccess = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 640 },
          height: { ideal: 480 },
          facingMode: 'user'
        },
        audio: false
      });

      onWebcamReady?.(stream);
      setError(null);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to access webcam';
      setError(errorMessage);
      onError?.(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRetry = () => {
    setRetryCount(prev => prev + 1);
    setError(null);
    checkWebcamSupport().then(supported => {
      if (supported) {
        requestWebcamAccess();
      }
    });
  };

  useEffect(() => {
    checkWebcamSupport();
  }, []);

  if (hasWebcam === null) {
    return (
      <div className={`flex items-center justify-center h-64 bg-gray-800 rounded-lg ${className}`}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500 mx-auto mb-4"></div>
          <p className="text-gray-300">Checking webcam support...</p>
        </div>
      </div>
    );
  }

  if (hasWebcam === false) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className={`bg-red-900/20 border border-red-500/30 rounded-lg p-6 ${className}`}
      >
        <div className="text-center">
          <FiAlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-red-400 mb-2" style={{ fontFamily: 'var(--font-pp-medium)' }}>
            Webcam Not Available
          </h3>
          <p className="text-red-300 text-sm mb-4" style={{ fontFamily: 'var(--font-pp-regular)' }}>
            {error || 'No webcam detected on this device'}
          </p>
          <div className="space-y-2 text-sm text-gray-400">
            <p>• Make sure a webcam is connected</p>
            <p>• Check browser permissions</p>
            <p>• Try using Chrome or Firefox</p>
          </div>
        </div>
      </motion.div>
    );
  }

  if (error) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className={`bg-yellow-900/20 border border-yellow-500/30 rounded-lg p-6 ${className}`}
      >
        <div className="text-center">
          <FiAlertTriangle className="w-12 h-12 text-yellow-500 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-yellow-400 mb-2" style={{ fontFamily: 'var(--font-pp-medium)' }}>
            Webcam Access Denied
          </h3>
          <p className="text-yellow-300 text-sm mb-4" style={{ fontFamily: 'var(--font-pp-regular)' }}>
            {error}
          </p>
          <button
            onClick={handleRetry}
            disabled={isLoading}
            className="px-4 py-2 bg-yellow-500 hover:bg-yellow-600 disabled:bg-gray-600 text-black rounded-lg font-semibold transition-colors flex items-center gap-2 mx-auto"
          >
            <FiRefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
            {isLoading ? 'Retrying...' : 'Try Again'}
          </button>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`bg-gray-800 rounded-lg p-6 ${className}`}
    >
      <div className="text-center">
        <FiCamera className="w-12 h-12 text-orange-500 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-white mb-2" style={{ fontFamily: 'var(--font-pp-medium)' }}>
          Webcam Ready
        </h3>
        <p className="text-gray-300 text-sm mb-4" style={{ fontFamily: 'var(--font-pp-regular)' }}>
          Click the button below to start the computer vision experiment
        </p>
        <button
          onClick={requestWebcamAccess}
          disabled={isLoading}
          className="lab-button flex items-center gap-2 mx-auto"
        >
          <FiCamera className="w-5 h-5" />
          {isLoading ? 'Starting...' : 'Start Experiment'}
        </button>
      </div>
    </motion.div>
  );
}