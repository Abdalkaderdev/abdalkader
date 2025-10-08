/**
 * Computer Vision utilities for AI experiments
 * Provides functions for image processing, object detection, and visual analysis
 */

import * as tf from '@tensorflow/tfjs'
import { TensorFlowManager } from './tensorflow'

export interface DetectionResult {
  bbox: [number, number, number, number] // [x, y, width, height]
  score: number
  class: string
  className: string
}

export interface ImageAnalysisResult {
  width: number
  height: number
  channels: number
  dominantColors: Array<{ r: number; g: number; b: number; percentage: number }>
  brightness: number
  contrast: number
}

export class ComputerVisionManager {
  private tfManager: TensorFlowManager
  private objectDetectionModel: tf.LayersModel | null = null

  constructor() {
    this.tfManager = TensorFlowManager.getInstance()
  }

  async initialize(): Promise<void> {
    await this.tfManager.initialize()
  }

  async loadObjectDetectionModel(): Promise<void> {
    try {
      // Load MobileNet SSD model for object detection
      this.objectDetectionModel = await tf.loadLayersModel(
        'https://tfhub.dev/tensorflow/tfjs-model/ssd_mobilenet_v2/1/default/1'
      )
    } catch (error) {
      console.warn('Failed to load object detection model:', error)
      // Fallback to a simpler model or use a different approach
    }
  }

  async detectObjects(imageElement: HTMLImageElement): Promise<DetectionResult[]> {
    if (!this.objectDetectionModel) {
      await this.loadObjectDetectionModel()
    }

    if (!this.objectDetectionModel) {
      throw new Error('Object detection model not available')
    }

    // Preprocess image
    const input = tf.browser.fromPixels(imageElement)
      .resizeBilinear([300, 300])
      .expandDims(0)
      .div(255.0)

    // Run inference
    const predictions = this.objectDetectionModel.predict(input) as tf.Tensor[]
    
    // Process results
    const results: DetectionResult[] = []
    
    // Note: This is a simplified implementation
    // Real object detection would require more complex post-processing
    const [boxes, scores, classes] = predictions
    
    const boxesData = boxes.dataSync()
    const scoresData = scores.dataSync()
    const classesData = classes.dataSync()

    // COCO class names (simplified list)
    const classNames = [
      'person', 'bicycle', 'car', 'motorcycle', 'airplane', 'bus', 'train',
      'truck', 'boat', 'traffic light', 'fire hydrant', 'stop sign',
      'parking meter', 'bench', 'bird', 'cat', 'dog', 'horse', 'sheep',
      'cow', 'elephant', 'bear', 'zebra', 'giraffe', 'backpack', 'umbrella'
    ]

    for (let i = 0; i < Math.min(scoresData.length, 10); i++) {
      if (scoresData[i] > 0.5) {
        results.push({
          bbox: [
            boxesData[i * 4],
            boxesData[i * 4 + 1],
            boxesData[i * 4 + 2],
            boxesData[i * 4 + 3]
          ],
          score: scoresData[i],
          class: classesData[i].toString(),
          className: classNames[Math.floor(classesData[i])] || 'unknown'
        })
      }
    }

    // Clean up tensors
    input.dispose()
    predictions.forEach(tensor => tensor.dispose())

    return results
  }

  async analyzeImage(imageElement: HTMLImageElement): Promise<ImageAnalysisResult> {
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')!
    
    canvas.width = imageElement.width
    canvas.height = imageElement.height
    ctx.drawImage(imageElement, 0, 0)

    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
    const { data, width, height } = imageData

    // Calculate basic image properties
    const channels = 4 // RGBA
    
    // Calculate dominant colors using a simplified approach
    const colorCounts: { [key: string]: number } = {}
    let totalPixels = 0

    for (let i = 0; i < data.length; i += 4) {
      const r = Math.floor(data[i] / 32) * 32
      const g = Math.floor(data[i + 1] / 32) * 32
      const b = Math.floor(data[i + 2] / 32) * 32
      const key = `${r},${g},${b}`
      
      colorCounts[key] = (colorCounts[key] || 0) + 1
      totalPixels++
    }

    const dominantColors = Object.entries(colorCounts)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 5)
      .map(([color, count]) => {
        const [r, g, b] = color.split(',').map(Number)
        return {
          r, g, b,
          percentage: (count / totalPixels) * 100
        }
      })

    // Calculate brightness and contrast
    let brightness = 0
    let contrast = 0

    for (let i = 0; i < data.length; i += 4) {
      const pixelBrightness = (data[i] + data[i + 1] + data[i + 2]) / 3
      brightness += pixelBrightness
    }

    brightness /= totalPixels

    // Calculate contrast (standard deviation of brightness)
    for (let i = 0; i < data.length; i += 4) {
      const pixelBrightness = (data[i] + data[i + 1] + data[i + 2]) / 3
      contrast += Math.pow(pixelBrightness - brightness, 2)
    }

    contrast = Math.sqrt(contrast / totalPixels)

    return {
      width,
      height,
      channels,
      dominantColors,
      brightness,
      contrast
    }
  }

  async classifyImage(imageElement: HTMLImageElement): Promise<Array<{className: string, probability: number}>> {
    // Load MobileNet model for image classification
    const model = await tf.loadLayersModel(
      'https://storage.googleapis.com/tfjs-models/tfjs/mobilenet_v1_1.0_224/model.json'
    )

    // Preprocess image
    const input = tf.browser.fromPixels(imageElement)
      .resizeBilinear([224, 224])
      .expandDims(0)
      .div(255.0)

    // Run inference
    const predictions = model.predict(input) as tf.Tensor
    
    // MobileNet class names (simplified list)
    const classNames = [
      'background', 'tench', 'goldfish', 'great white shark', 'tiger shark',
      'hammerhead', 'electric ray', 'stingray', 'cock', 'hen'
      // ... more class names would be here
    ]

    const results = []
    const values = predictions.dataSync()
    
    for (let i = 0; i < Math.min(values.length, 10); i++) {
      results.push({
        className: classNames[i] || `class_${i}`,
        probability: values[i]
      })
    }

    // Clean up
    input.dispose()
    predictions.dispose()
    model.dispose()

    return results.sort((a, b) => b.probability - a.probability)
  }

  async generateImageEmbedding(imageElement: HTMLImageElement): Promise<number[]> {
    // Load a feature extraction model (simplified implementation)
    const model = await tf.loadLayersModel(
      'https://storage.googleapis.com/tfjs-models/tfjs/mobilenet_v1_1.0_224/model.json'
    )

    const input = tf.browser.fromPixels(imageElement)
      .resizeBilinear([224, 224])
      .expandDims(0)
      .div(255.0)

    // Get features from an intermediate layer
    const features = model.predict(input) as tf.Tensor
    
    const embedding = Array.from(features.dataSync())

    // Clean up
    input.dispose()
    features.dispose()
    model.dispose()

    return embedding
  }

  dispose(): void {
    if (this.objectDetectionModel) {
      this.objectDetectionModel.dispose()
      this.objectDetectionModel = null
    }
  }
}

export default ComputerVisionManager