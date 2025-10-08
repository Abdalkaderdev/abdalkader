'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Play, 
  Square, 
  Camera, 
  CameraOff, 
  AlertTriangle, 
  Smartphone,
  Monitor,
  Zap,
  Target,
  Settings,
  RefreshCw
} from 'lucide-react'
import { COCOSSDManager, Detection } from '@/lib/ai/coco-ssd'

interface PerformanceMetrics {
  fps: number
  inferenceTime: number
  totalObjects: number
  modelLoaded: boolean
}

interface ObjectDetectionDemoV2Props {
  className?: string
  showSettings?: boolean
  initialConfidence?: number
  initialMaxDetections?: number
}

export default function ObjectDetectionDemoV2({
  className = '',
  showSettings = true,
  initialConfidence = 0.5,
  initialMaxDetections = 10
}: ObjectDetectionDemoV2Props) {
  // State management
  const [isLoading, setIsLoading] = useState(false)
  const [isDetecting, setIsDetecting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [detections, setDetections] = useState<Detection[]>([])
  const [performance, setPerformance] = useState<PerformanceMetrics>({
    fps: 0,
    inferenceTime: 0,
    totalObjects: 0,
    modelLoaded: false
  })

  // Settings
  const [confidence, setConfidence] = useState(initialConfidence)
  const [maxDetections, setMaxDetections] = useState(initialMaxDetections)
  const [showPerformance, setShowPerformance] = useState(false)

  // Refs
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const streamRef = useRef<MediaStream | null>(null)
  const managerRef = useRef<COCOSSDManager | null>(null)
  const animationFrameRef = useRef<number | null>(null)
  const fpsCounterRef = useRef({ frames: 0, lastTime: 0 })

  // Initialize COCO-SSD manager
  useEffect(() => {
    managerRef.current = new COCOSSDManager({
      confidence,
      maxDetections
    })

    return () => {
      if (managerRef.current) {
        managerRef.current.dispose()
      }
    }
  }, [])

  // Update manager config when settings change
  useEffect(() => {
    if (managerRef.current) {
      managerRef.current.updateConfig({
        confidence,
        maxDetections
      })
    }
  }, [confidence, maxDetections])

  // Performance tracking
  const updateFPS = useCallback(() => {
    const now = performance.now()
    fpsCounterRef.current.frames++
    
    if (now - fpsCounterRef.current.lastTime >= 1000) {
      const fps = Math.round((fpsCounterRef.current.frames * 1000) / (now - fpsCounterRef.current.lastTime))
      setPerformance(prev => ({ ...prev, fps }))
      fpsCounterRef.current = { frames: 0, lastTime: now }
    }
  }, [])

  // Load model
  const loadModel = useCallback(async () => {
    if (!managerRef.current) return
    
    try {
      setIsLoading(true)
      setError(null)
      
      await managerRef.current.loadModel()
      setPerformance(prev => ({ ...prev, modelLoaded: true }))
      
      console.log('COCO-SSD model loaded successfully')
    } catch (err) {
      console.error('Failed to load model:', err)
      setError(err instanceof Error ? err.message : 'Failed to load AI model.')
    } finally {
      setIsLoading(false)
    }
  }, [])

  // Get user media
  const startWebcam = useCallback(async () => {
    try {
      setError(null)
      
      // Check for mobile compatibility
      const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
      
      const constraints = isMobile ? {
        video: {
          facingMode: 'environment',
          width: { ideal: 640, max: 1280 },
          height: { ideal: 480, max: 720 }
        }
      } : {
        video: {
          width: { ideal: 640 },
          height: { ideal: 480 }
        }
      }
      
      const stream = await navigator.mediaDevices.getUserMedia(constraints)
      streamRef.current = stream
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream
        videoRef.current.play()
      }
    } catch (err) {
      console.error('Camera access error:', err)
      if (err instanceof Error) {
        if (err.name === 'NotAllowedError') {
          setError('Camera access denied. Please allow camera permissions and try again.')
        } else if (err.name === 'NotFoundError') {
          setError('No camera found. Please connect a camera and try again.')
        } else {
          setError('Failed to access camera. Please check your camera connection.')
        }
      } else {
        setError('Unknown camera error occurred.')
      }
    }
  }, [])

  // Stop webcam
  const stopWebcam = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop())
      streamRef.current = null
    }
    
    if (videoRef.current) {
      videoRef.current.srcObject = null
    }
    
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current)
      animationFrameRef.current = null
    }
    
    setIsDetecting(false)
    setDetections([])
  }, [])

  // Run object detection
  const detectObjects = useCallback(async () => {
    if (!managerRef.current || !videoRef.current || !canvasRef.current) return

    const video = videoRef.current
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    
    if (!ctx) return

    const startTime = performance.now()

    try {
      // Get video dimensions
      const videoWidth = video.videoWidth
      const videoHeight = video.videoHeight
      
      // Set canvas dimensions to match video
      canvas.width = videoWidth
      canvas.height = videoHeight

      // Run detection
      const newDetections = await managerRef.current.detectObjects(video)
      setDetections(newDetections)
      
      // Update performance metrics
      const inferenceTime = performance.now() - startTime
      setPerformance(prev => ({
        ...prev,
        inferenceTime: Math.round(inferenceTime),
        totalObjects: newDetections.length
      }))
      
      // Draw detections on canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      
      newDetections.forEach(detection => {
        const [x, y, width, height] = detection.bbox
        
        // Scale coordinates to video dimensions
        const scaleX = videoWidth / 300 // Model input size
        const scaleY = videoHeight / 300
        
        const scaledX = x * scaleX
        const scaledY = y * scaleY
        const scaledWidth = width * scaleX
        const scaledHeight = height * scaleY
        
        // Draw bounding box
        ctx.strokeStyle = '#00ff88'
        ctx.lineWidth = 2
        ctx.strokeRect(scaledX, scaledY, scaledWidth, scaledHeight)
        
        // Draw label background
        const label = `${detection.class} ${Math.round(detection.score * 100)}%`
        const textMetrics = ctx.measureText(label)
        const textHeight = 20
        
        ctx.fillStyle = 'rgba(0, 255, 136, 0.8)'
        ctx.fillRect(scaledX, scaledY - textHeight, textMetrics.width + 10, textHeight)
        
        // Draw label text
        ctx.fillStyle = '#000000'
        ctx.font = '14px Arial'
        ctx.fillText(label, scaledX + 5, scaledY - 5)
      })
      
    } catch (err) {
      console.error('Detection error:', err)
      setError('Detection failed. Please try again.')
    }
  }, [])

  // Detection loop
  const detectionLoop = useCallback(() => {
    if (!isDetecting) return
    
    detectObjects()
    updateFPS()
    animationFrameRef.current = requestAnimationFrame(detectionLoop)
  }, [isDetecting, detectObjects, updateFPS])

  // Start detection
  const startDetection = useCallback(() => {
    if (!managerRef.current?.isModelLoaded()) {
      setError('Please load the AI model first.')
      return
    }
    
    if (!streamRef.current) {
      setError('Please start the webcam first.')
      return
    }
    
    setIsDetecting(true)
    detectionLoop()
  }, [detectionLoop])

  // Stop detection
  const stopDetection = useCallback(() => {
    setIsDetecting(false)
    
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current)
      animationFrameRef.current = null
    }
    
    // Clear canvas
    if (canvasRef.current) {
      const ctx = canvasRef.current.getContext('2d')
      if (ctx) {
        ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height)
      }
    }
    
    setDetections([])
  }, [])

  // Mobile compatibility check
  const isMobile = typeof window !== 'undefined' && 
    /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <div className="text-center">
        <h2 className="text-2xl font-bold gradient-text mb-2">
          Real-time Object Detection v2
        </h2>
        <p className="text-slate-300">
          Enhanced AI-powered object detection with improved accuracy and performance
        </p>
      </div>

      {/* Status Indicators */}
      <div className="flex flex-wrap gap-4 justify-center">
        <div className="flex items-center space-x-2">
          <div className={`w-3 h-3 rounded-full ${managerRef.current?.isModelLoaded() ? 'bg-green-500' : 'bg-red-500'}`} />
          <span className="text-sm text-slate-300">
            Model: {managerRef.current?.isModelLoaded() ? 'Loaded' : 'Not Loaded'}
          </span>
        </div>
        
        <div className="flex items-center space-x-2">
          <div className={`w-3 h-3 rounded-full ${streamRef.current ? 'bg-green-500' : 'bg-gray-500'}`} />
          <span className="text-sm text-slate-300">
            Camera: {streamRef.current ? 'Active' : 'Inactive'}
          </span>
        </div>

        {isMobile && (
          <div className="flex items-center space-x-2">
            <Smartphone className="w-4 h-4 text-blue-400" />
            <span className="text-sm text-slate-300">Mobile Mode</span>
          </div>
        )}
      </div>

      {/* Error Display */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-red-900/50 border border-red-500 rounded-lg p-4 flex items-center space-x-3"
          >
            <AlertTriangle className="w-5 h-5 text-red-400 flex-shrink-0" />
            <p className="text-red-300">{error}</p>
            <button
              onClick={() => setError(null)}
              className="text-red-400 hover:text-red-300 ml-auto"
            >
              ×
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Demo Area */}
      <div className="relative">
        <div className="relative bg-slate-900 rounded-lg overflow-hidden">
          {/* Video Feed */}
          <video
            ref={videoRef}
            className="w-full h-auto"
            playsInline
            muted
            style={{ transform: 'scaleX(-1)' }}
          />
          
          {/* Detection Canvas Overlay */}
          <canvas
            ref={canvasRef}
            className="absolute top-0 left-0 w-full h-full"
            style={{ transform: 'scaleX(-1)' }}
          />
          
          {/* Loading Overlay */}
          {isLoading && (
            <div className="absolute inset-0 bg-slate-900/80 flex items-center justify-center">
              <div className="text-center">
                <RefreshCw className="animate-spin w-12 h-12 text-blue-400 mx-auto mb-4" />
                <p className="text-slate-300">Loading AI model...</p>
              </div>
            </div>
          )}
        </div>

        {/* Detection Info Overlay */}
        {isDetecting && (
          <div className="absolute top-4 left-4 bg-black/70 backdrop-blur-sm rounded-lg p-3 text-white">
            <div className="flex items-center space-x-2 mb-2">
              <Target className="w-4 h-4 text-green-400" />
              <span className="text-sm font-medium">Detecting Objects</span>
            </div>
            <p className="text-xs text-gray-300">
              {detections.length} objects found
            </p>
          </div>
        )}
      </div>

      {/* Controls */}
      <div className="flex flex-wrap gap-4 justify-center">
        <button
          onClick={loadModel}
          disabled={isLoading}
          className="flex items-center space-x-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 disabled:bg-slate-600 text-white rounded-lg transition-colors"
        >
          <Zap className="w-4 h-4" />
          <span>{isLoading ? 'Loading...' : 'Load Model'}</span>
        </button>

        <button
          onClick={streamRef.current ? stopWebcam : startWebcam}
          className="flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
        >
          {streamRef.current ? (
            <>
              <CameraOff className="w-4 h-4" />
              <span>Stop Camera</span>
            </>
          ) : (
            <>
              <Camera className="w-4 h-4" />
              <span>Start Camera</span>
            </>
          )}
        </button>

        <button
          onClick={isDetecting ? stopDetection : startDetection}
          disabled={!managerRef.current?.isModelLoaded() || !streamRef.current}
          className="flex items-center space-x-2 px-4 py-2 bg-green-600 hover:bg-green-700 disabled:bg-slate-600 text-white rounded-lg transition-colors"
        >
          {isDetecting ? (
            <>
              <Square className="w-4 h-4" />
              <span>Stop Detection</span>
            </>
          ) : (
            <>
              <Play className="w-4 h-4" />
              <span>Start Detection</span>
            </>
          )}
        </button>
      </div>

      {/* Performance Metrics */}
      {showPerformance && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="ai-card text-center">
            <div className="text-2xl font-bold text-blue-400">{performance.fps}</div>
            <div className="text-sm text-slate-400">FPS</div>
          </div>
          <div className="ai-card text-center">
            <div className="text-2xl font-bold text-green-400">{performance.inferenceTime}ms</div>
            <div className="text-sm text-slate-400">Inference Time</div>
          </div>
          <div className="ai-card text-center">
            <div className="text-2xl font-bold text-purple-400">{performance.totalObjects}</div>
            <div className="text-sm text-slate-400">Objects</div>
          </div>
          <div className="ai-card text-center">
            <div className="text-2xl font-bold text-orange-400">
              {managerRef.current?.isModelLoaded() ? '✓' : '✗'}
            </div>
            <div className="text-sm text-slate-400">Model Status</div>
          </div>
        </div>
      )}

      {/* Settings */}
      {showSettings && (
        <div className="ai-card">
          <div className="flex items-center space-x-2 mb-4">
            <Settings className="w-5 h-5 text-slate-400" />
            <h3 className="text-lg font-semibold text-slate-100">Settings</h3>
          </div>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Confidence Threshold: {Math.round(confidence * 100)}%
              </label>
              <input
                type="range"
                min="0.1"
                max="1"
                step="0.1"
                value={confidence}
                onChange={(e) => setConfidence(parseFloat(e.target.value))}
                className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Max Detections: {maxDetections}
              </label>
              <input
                type="range"
                min="1"
                max="20"
                step="1"
                value={maxDetections}
                onChange={(e) => setMaxDetections(parseInt(e.target.value))}
                className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer"
              />
            </div>
          </div>
          
          <div className="mt-4">
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={showPerformance}
                onChange={(e) => setShowPerformance(e.target.checked)}
                className="rounded border-slate-600 bg-slate-700 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-sm text-slate-300">Show Performance Metrics</span>
            </label>
          </div>
        </div>
      )}

      {/* Detection Results */}
      {detections.length > 0 && (
        <div className="ai-card">
          <h3 className="text-lg font-semibold text-slate-100 mb-4">Detected Objects</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {detections.map((detection, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-slate-800 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-green-500/20 rounded-full flex items-center justify-center">
                    <Target className="w-4 h-4 text-green-400" />
                  </div>
                  <div>
                    <div className="font-medium text-slate-100 capitalize">
                      {detection.class}
                    </div>
                    <div className="text-sm text-slate-400">
                      Confidence: {Math.round(detection.score * 100)}%
                    </div>
                  </div>
                </div>
                <div className="text-xs text-slate-500">
                  {Math.round(detection.bbox[2])} × {Math.round(detection.bbox[3])}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}