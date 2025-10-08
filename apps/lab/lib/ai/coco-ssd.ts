/**
 * COCO-SSD Object Detection Model Manager
 * Handles model loading, inference, and post-processing for real-time object detection
 */

import * as tf from '@tensorflow/tfjs'

export interface Detection {
  bbox: [number, number, number, number] // [x, y, width, height]
  class: string
  score: number
}

export interface ModelConfig {
  confidence?: number
  maxDetections?: number
  nmsThreshold?: number
}

// COCO class names (80 classes)
export const COCO_CLASSES = [
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

export class COCOSSDManager {
  private model: tf.LayersModel | null = null
  private initialized = false
  private config: ModelConfig

  constructor(config: ModelConfig = {}) {
    this.config = {
      confidence: 0.5,
      maxDetections: 10,
      nmsThreshold: 0.5,
      ...config
    }
  }

  async initialize(): Promise<void> {
    if (this.initialized) return
    
    await tf.ready()
    this.initialized = true
  }

  async loadModel(modelUrl?: string): Promise<void> {
    await this.initialize()

    try {
      // Try loading from TensorFlow Hub first
      const hubUrl = 'https://tfhub.dev/tensorflow/tfjs-model/ssd_mobilenet_v2/1/default/1'
      this.model = await tf.loadLayersModel(modelUrl || hubUrl)
    } catch (error) {
      console.warn('Failed to load from TensorFlow Hub, trying alternative:', error)
      
      try {
        // Fallback to alternative model
        const fallbackUrl = 'https://storage.googleapis.com/tfjs-models/tfjs/ssd_mobilenet_v2/model.json'
        this.model = await tf.loadLayersModel(fallbackUrl)
      } catch (fallbackError) {
        console.error('Failed to load model from all sources:', fallbackError)
        throw new Error('Unable to load COCO-SSD model. Please check your internet connection.')
      }
    }
  }

  async detectObjects(
    imageElement: HTMLImageElement | HTMLVideoElement | HTMLCanvasElement,
    config?: Partial<ModelConfig>
  ): Promise<Detection[]> {
    if (!this.model) {
      throw new Error('Model not loaded. Call loadModel() first.')
    }

    const mergedConfig = { ...this.config, ...config }
    
    try {
      // Preprocess image
      const input = this.preprocessImage(imageElement)
      
      // Run inference
      const predictions = await this.model.executeAsync(input)
      
      // Post-process results
      const detections = this.postprocessPredictions(predictions, mergedConfig)
      
      // Clean up tensors
      input.dispose()
      if (Array.isArray(predictions)) {
        predictions.forEach(tensor => tensor.dispose())
      } else {
        predictions.dispose()
      }
      
      return detections
    } catch (error) {
      console.error('Detection error:', error)
      throw new Error('Object detection failed. Please try again.')
    }
  }

  private preprocessImage(imageElement: HTMLImageElement | HTMLVideoElement | HTMLCanvasElement): tf.Tensor {
    // Convert to tensor and normalize to [0, 1]
    const tensor = tf.browser.fromPixels(imageElement)
    
    // Resize to model input size (300x300 for MobileNet SSD)
    const resized = tf.image.resizeBilinear(tensor, [300, 300])
    
    // Add batch dimension
    const batched = resized.expandDims(0)
    
    // Normalize to [-1, 1] range (required by SSD models)
    const normalized = batched.div(127.5).sub(1)
    
    // Clean up intermediate tensors
    tensor.dispose()
    resized.dispose()
    
    return normalized
  }

  private postprocessPredictions(predictions: any, config: ModelConfig): Detection[] {
    const detections: Detection[] = []
    
    try {
      // Extract prediction tensors (format varies by model)
      let boxes: tf.Tensor, scores: tf.Tensor, classes: tf.Tensor
      
      if (Array.isArray(predictions)) {
        // Handle array format
        boxes = predictions[0]
        scores = predictions[1]
        classes = predictions[2]
      } else {
        // Handle single tensor format
        const data = predictions.dataSync()
        const shape = predictions.shape
        
        // This is a simplified approach - real implementation would depend on model output format
        throw new Error('Single tensor format not implemented yet')
      }
      
      // Get data from tensors
      const boxesData = boxes.dataSync()
      const scoresData = scores.dataSync()
      const classesData = classes.dataSync()
      
      // Process detections
      for (let i = 0; i < scoresData.length; i++) {
        if (detections.length >= config.maxDetections!) break
        
        const score = scoresData[i]
        if (score < config.confidence!) continue
        
        const classIndex = Math.round(classesData[i])
        if (classIndex < 0 || classIndex >= COCO_CLASSES.length) continue
        
        // Extract bounding box coordinates
        const y1 = boxesData[i * 4]
        const x1 = boxesData[i * 4 + 1]
        const y2 = boxesData[i * 4 + 2]
        const x2 = boxesData[i * 4 + 3]
        
        // Convert from [0,1] normalized coordinates to pixel coordinates
        const bbox: [number, number, number, number] = [
          x1, // x
          y1, // y
          x2 - x1, // width
          y2 - y1  // height
        ]
        
        detections.push({
          bbox,
          class: COCO_CLASSES[classIndex],
          score
        })
      }
      
      // Sort by confidence score
      detections.sort((a, b) => b.score - a.score)
      
      // Apply Non-Maximum Suppression (simplified)
      return this.applyNMS(detections, config.nmsThreshold!)
      
    } catch (error) {
      console.error('Post-processing error:', error)
      return []
    }
  }

  private applyNMS(detections: Detection[], threshold: number): Detection[] {
    if (detections.length === 0) return []
    
    // Sort by confidence
    detections.sort((a, b) => b.score - a.score)
    
    const keep: Detection[] = []
    const suppressed = new Set<number>()
    
    for (let i = 0; i < detections.length; i++) {
      if (suppressed.has(i)) continue
      
      keep.push(detections[i])
      
      // Suppress overlapping detections
      for (let j = i + 1; j < detections.length; j++) {
        if (suppressed.has(j)) continue
        
        const iou = this.calculateIoU(detections[i].bbox, detections[j].bbox)
        if (iou > threshold) {
          suppressed.add(j)
        }
      }
    }
    
    return keep
  }

  private calculateIoU(bbox1: [number, number, number, number], bbox2: [number, number, number, number]): number {
    const [x1_1, y1_1, w1, h1] = bbox1
    const [x1_2, y1_2, w2, h2] = bbox2
    
    const x2_1 = x1_1 + w1
    const y2_1 = y1_1 + h1
    const x2_2 = x1_2 + w2
    const y2_2 = y1_2 + h2
    
    // Calculate intersection
    const x1 = Math.max(x1_1, x1_2)
    const y1 = Math.max(y1_1, y1_2)
    const x2 = Math.min(x2_1, x2_2)
    const y2 = Math.min(y2_1, y2_2)
    
    if (x2 <= x1 || y2 <= y1) return 0
    
    const intersection = (x2 - x1) * (y2 - y1)
    const area1 = w1 * h1
    const area2 = w2 * h2
    const union = area1 + area2 - intersection
    
    return intersection / union
  }

  updateConfig(config: Partial<ModelConfig>): void {
    this.config = { ...this.config, ...config }
  }

  getConfig(): ModelConfig {
    return { ...this.config }
  }

  isModelLoaded(): boolean {
    return this.model !== null
  }

  dispose(): void {
    if (this.model) {
      this.model.dispose()
      this.model = null
    }
    this.initialized = false
  }
}

// Utility function to create and configure the manager
export function createCOCOSSDManager(config?: ModelConfig): COCOSSDManager {
  return new COCOSSDManager(config)
}

export default COCOSSDManager