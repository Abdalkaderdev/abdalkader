'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import * as tf from '@tensorflow/tfjs'
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
  Settings
} from 'lucide-react'

// COCO class names (simplified list - full list has 80 classes)
const COCO_CLASSES = [
  'person', 'bicycle', 'car', 'motorcycle', 'airplane', 'bus', 'train',
  'truck', 'boat', 'traffic light', 'fire hydrant', 'stop sign',
  'parking meter', 'bench', 'bird', 'cat', 'dog', 'horse', 'sheep',
  'cow', 'elephant', 'bear', 'zebra', 'giraffe', 'backpack', 'umbrella',
  'handbag', 'tie', 'suitcase', 'frisbee', 'skis', 'snowboard',
  'sports ball', 'kite', 'baseball bat', 'baseball glove', 'skateboard',
  'surfboard', 'tennis racket', 'bottle', 'wine glass', 'cup', 'fork',
  'knife', 'spoon', 'bowl', 'banana', 'apple', 'sandwich', 'orange',
  'broccoli', 'carrot', 'hot dog', 'pizza', 'donut', 'cake', 'chair',
  'couch', 'potted plant', 'bed', 'dining table', 'toilet', 'tv',
  'laptop', 'mouse', 'remote', 'keyboard', 'cell phone', 'microwave',
  'oven', 'toaster', 'sink', 'refrigerator', 'book', 'clock', 'vase',
  'scissors', 'teddy bear', 'hair drier', 'toothbrush'
]

interface Detection {
  bbox: [number, number, number, number] // [x, y, width, height]
  class: string
  score: number
}

interface PerformanceMetrics {
  fps: number
  inferenceTime: number
  totalObjects: number
  modelLoaded: boolean
}

interface ObjectDetectionDemoProps {
  className?: string
  showSettings?: boolean
  initialConfidence?: number
  initialMaxDetections?: number
}

export default function ObjectDetectionDemo({
  className = '',
  showSettings = true,
  initialConfidence = 0.5,
  initialMaxDetections = 10
}: ObjectDetectionDemoProps) {
  // State management
  const [isLoading, setIsLoading] = useState(false)
  const [isDetecting, setIsDetecting] = useState(false)
  const [isModelLoaded, setIsModelLoaded] = useState(false)
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
  const modelRef = useRef<any>(null)
  const animationFrameRef = useRef<number | null>(null)
  const fpsCounterRef = useRef({ frames: 0, lastTime: 0 })

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

  // Load COCO-SSD model
  const loadModel = useCallback(async () => {
    try {
      setIsLoading(true)
      setError(null)
      
      // Load COCO-SSD model
      const model = await tf.loadLayersModel('https://tfhub.dev/tensorflow/tfjs-model/ssd_mobilenet_v2/1/default/1')
      modelRef.current = model
      setIsModelLoaded(true)
      setPerformance(prev => ({ ...prev, modelLoaded: true }))
      
      console.log('COCO-SSD model loaded successfully')
    } catch (err) {
      console.error('Failed to load model:', err)
      setError('Failed to load AI model. Please check your internet connection and try again.')
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
      
      if (isMobile) {
        // Request mobile-optimized constraints
        const constraints = {
          video: {
            facingMode: 'environment', // Use back camera on mobile
            width: { ideal: 640, max: 1280 },
            height: { ideal: 480, max: 720 }
          }
        }
        
        const stream = await navigator.mediaDevices.getUserMedia(constraints)
        streamRef.current = stream
        
        if (videoRef.current) {
          videoRef.current.srcObject = stream
          videoRef.current.play()
        }
      } else {
        // Desktop constraints
        const constraints = {
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
    if (!modelRef.current || !videoRef.current || !canvasRef.current) return

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

      // Create tensor from video frame
      const tensor = tf.browser.fromPixels(video)
      
      // Run inference
      const predictions = await modelRef.current.executeAsync(tensor)
      
      // Process predictions (simplified - real implementation would need more complex post-processing)
      const [boxes, scores, classes] = predictions
      
      // Get data from tensors
      const boxesData = boxes.dataSync()
      const scoresData = scores.dataSync()
      const classesData = classes.dataSync()
      
      // Filter detections by confidence
      const newDetections: Detection[] = []
      
      for (let i = 0; i < scoresData.length && newDetections.length < maxDetections; i++) {
        if (scoresData[i] >= confidence) {
          const classIndex = Math.round(classesData[i])
          const className = COCO_CLASSES[classIndex] || `class_${classIndex}`
          
          newDetections.push({
            bbox: [
              boxesData[i * 4] * videoWidth,     // x
              boxesData[i * 4 + 1] * videoHeight, // y
              (boxesData[i * 4 + 2] - boxesData[i * 4]) * videoWidth,     // width
              (boxesData[i * 4 + 3] - boxesData[i * 4 + 1]) * videoHeight // height
            ],
            class: className,
            score: scoresData[i]
          })
        }
      }
      
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
        
        // Draw bounding box
        ctx.strokeStyle = '#00ff88'
        ctx.lineWidth = 2
        ctx.strokeRect(x, y, width, height)
        
        // Draw label background
        const label = `${detection.class} ${Math.round(detection.score * 100)}%`
        const textMetrics = ctx.measureText(label)
        const textHeight = 20
        
        ctx.fillStyle = 'rgba(0, 255, 136, 0.8)'
        ctx.fillRect(x, y - textHeight, textMetrics.width + 10, textHeight)
        
        // Draw label text
        ctx.fillStyle = '#000000'
        ctx.font = '14px Arial'
        ctx.fillText(label, x + 5, y - 5)
      })
      
      // Clean up tensors
      tensor.dispose()
      predictions.forEach((tensor: any) => tensor.dispose())
      
    } catch (err) {
      console.error('Detection error:', err)
      setError('Detection failed. Please try again.')
    }
  }, [confidence, maxDetections])

  // Detection loop
  const detectionLoop = useCallback(() => {
    if (!isDetecting) return
    
    detectObjects()
    updateFPS()
    animationFrameRef.current = requestAnimationFrame(detectionLoop)
  }, [isDetecting, detectObjects, updateFPS])

  // Start detection
  const startDetection = useCallback(() => {
    if (!isModelLoaded) {
      setError('Please load the AI model first.')
      return
    }
    
    if (!streamRef.current) {
      setError('Please start the webcam first.')
      return
    }
    
    setIsDetecting(true)
    detectionLoop()
  }, [isModelLoaded, detectionLoop])

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

  // Load model on mount
  useEffect(() => {
    loadModel()
    
    return () => {
      stopWebcam()
      if (modelRef.current) {
        modelRef.current.dispose()
      }
    }
  }, [loadModel, stopWebcam])

  // Mobile compatibility check
  const isMobile = typeof window !== 'undefined' && 
    /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <div className="text-center">
        <h2 className="text-2xl font-bold gradient-text mb-2">
          Real-time Object Detection
        </h2>
        <p className="text-slate-300">
          AI-powered object detection using TensorFlow.js COCO-SSD model
        </p>
      </div>

      {/* Status Indicators */}
      <div className="flex flex-wrap gap-4 justify-center">
        <div className="flex items-center space-x-2">
          <div className={`w-3 h-3 rounded-full ${isModelLoaded ? 'bg-green-500' : 'bg-red-500'}`} />
          <span className="text-sm text-slate-300">
            Model: {isModelLoaded ? 'Loaded' : 'Loading...'}
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
            style={{ transform: 'scaleX(-1)' }} // Mirror the video
          />
          
          {/* Detection Canvas Overlay */}
          <canvas
            ref={canvasRef}
            className="absolute top-0 left-0 w-full h-full"
            style={{ transform: 'scaleX(-1)' }} // Mirror the canvas
          />
          
          {/* Loading Overlay */}
          {isLoading && (
            <div className="absolute inset-0 bg-slate-900/80 flex items-center justify-center">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-400 mx-auto mb-4" />
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
          disabled={!isModelLoaded || !streamRef.current}
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
              {performance.modelLoaded ? '✓' : '✗'}
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