/**
 * General AI utilities and helper functions
 * Common utilities used across different AI experiments
 */

import * as tf from '@tensorflow/tfjs'

export interface PerformanceMetrics {
  inferenceTime: number
  memoryUsage: number
  modelSize: number
  accuracy?: number
}

export class PerformanceMonitor {
  private startTime: number = 0
  private memoryBefore: number = 0

  start(): void {
    this.startTime = performance.now()
    this.memoryBefore = (performance as any).memory?.usedJSHeapSize || 0
  }

  end(): PerformanceMetrics {
    const inferenceTime = performance.now() - this.startTime
    const memoryAfter = (performance as any).memory?.usedJSHeapSize || 0
    const memoryUsage = memoryAfter - this.memoryBefore

    return {
      inferenceTime,
      memoryUsage,
      modelSize: 0 // Would need to be calculated separately
    }
  }

  static measureAsync<T>(fn: () => Promise<T>): Promise<{ result: T; metrics: PerformanceMetrics }> {
    const monitor = new PerformanceMonitor()
    monitor.start()
    
    return fn().then(result => ({
      result,
      metrics: monitor.end()
    }))
  }
}

export class DataProcessor {
  static normalizeArray(data: number[]): number[] {
    const min = Math.min(...data)
    const max = Math.max(...data)
    const range = max - min
    
    if (range === 0) return data.map(() => 0)
    
    return data.map(value => (value - min) / range)
  }

  static standardizeArray(data: number[]): number[] {
    const mean = data.reduce((sum, val) => sum + val, 0) / data.length
    const variance = data.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / data.length
    const stdDev = Math.sqrt(variance)
    
    if (stdDev === 0) return data.map(() => 0)
    
    return data.map(value => (value - mean) / stdDev)
  }

  static shuffleArray<T>(array: T[]): T[] {
    const shuffled = [...array]
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
    }
    return shuffled
  }

  static splitData<T>(data: T[], trainRatio: number = 0.8): { train: T[]; test: T[] } {
    const shuffled = this.shuffleArray(data)
    const splitIndex = Math.floor(shuffled.length * trainRatio)
    
    return {
      train: shuffled.slice(0, splitIndex),
      test: shuffled.slice(splitIndex)
    }
  }
}

export class TensorUtils {
  static async downloadTensorAsImage(tensor: tf.Tensor, filename: string = 'tensor.png'): Promise<void> {
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')!
    
    // Ensure tensor is in the right format for display
    let displayTensor = tensor
    if (tensor.shape.length === 4) {
      displayTensor = tensor.squeeze([0])
    }
    
    const [height, width] = displayTensor.shape
    canvas.width = width
    canvas.height = height
    
    // Convert tensor to image data
    const imageData = ctx.createImageData(width, height)
    const data = displayTensor.dataSync()
    
    for (let i = 0; i < data.length; i++) {
      const pixelIndex = i * 4
      const value = Math.max(0, Math.min(255, data[i] * 255))
      imageData.data[pixelIndex] = value     // R
      imageData.data[pixelIndex + 1] = value // G
      imageData.data[pixelIndex + 2] = value // B
      imageData.data[pixelIndex + 3] = 255   // A
    }
    
    ctx.putImageData(imageData, 0, 0)
    
    // Download the image
    canvas.toBlob((blob) => {
      if (blob) {
        const url = URL.createObjectURL(blob)
        const link = document.createElement('a')
        link.href = url
        link.download = filename
        link.click()
        URL.revokeObjectURL(url)
      }
    })
  }

  static tensorToImageData(tensor: tf.Tensor): ImageData {
    const [height, width] = tensor.shape
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')!
    
    canvas.width = width
    canvas.height = height
    
    const imageData = ctx.createImageData(width, height)
    const data = tensor.dataSync()
    
    for (let i = 0; i < data.length; i++) {
      const pixelIndex = i * 4
      const value = Math.max(0, Math.min(255, data[i] * 255))
      imageData.data[pixelIndex] = value     // R
      imageData.data[pixelIndex + 1] = value // G
      imageData.data[pixelIndex + 2] = value // B
      imageData.data[pixelIndex + 3] = 255   // A
    }
    
    return imageData
  }

  static async loadImageFromUrl(url: string): Promise<HTMLImageElement> {
    return new Promise((resolve, reject) => {
      const img = new Image()
      img.crossOrigin = 'anonymous'
      img.onload = () => resolve(img)
      img.onerror = reject
      img.src = url
    })
  }

  static async loadImageFromFile(file: File): Promise<HTMLImageElement> {
    return new Promise((resolve, reject) => {
      const img = new Image()
      img.onload = () => resolve(img)
      img.onerror = reject
      img.src = URL.createObjectURL(file)
    })
  }
}

export class ModelCache {
  private static cache: Map<string, tf.LayersModel> = new Map()

  static async loadModel(url: string, name?: string): Promise<tf.LayersModel> {
    const cacheKey = name || url
    
    if (this.cache.has(cacheKey)) {
      return this.cache.get(cacheKey)!
    }

    const model = await tf.loadLayersModel(url)
    this.cache.set(cacheKey, model)
    return model
  }

  static getModel(name: string): tf.LayersModel | undefined {
    return this.cache.get(name)
  }

  static clearCache(): void {
    this.cache.forEach(model => model.dispose())
    this.cache.clear()
  }

  static disposeModel(name: string): boolean {
    const model = this.cache.get(name)
    if (model) {
      model.dispose()
      this.cache.delete(name)
      return true
    }
    return false
  }
}

export const constants = {
  IMAGE_SIZE: {
    MOBILENET: [224, 224] as [number, number],
    INCEPTION: [299, 299] as [number, number],
    EFFICIENTNET: [224, 224] as [number, number]
  },
  
  COLOR_MEAN: {
    IMAGENET: [0.485, 0.456, 0.406] as [number, number, number],
    DEFAULT: [0.5, 0.5, 0.5] as [number, number, number]
  },
  
  COLOR_STD: {
    IMAGENET: [0.229, 0.224, 0.225] as [number, number, number],
    DEFAULT: [0.5, 0.5, 0.5] as [number, number, number]
  }
}

export default {
  PerformanceMonitor,
  DataProcessor,
  TensorUtils,
  ModelCache,
  constants
}