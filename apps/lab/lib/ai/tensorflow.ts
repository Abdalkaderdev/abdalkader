/**
 * TensorFlow.js utilities for AI experiments
 * Provides common functions for model loading, inference, and visualization
 */

import * as tf from '@tensorflow/tfjs'

export interface ModelConfig {
  modelUrl?: string
  inputShape?: number[]
  outputShape?: number[]
  preprocess?: (input: any) => tf.Tensor
  postprocess?: (output: tf.Tensor) => any
}

export class TensorFlowManager {
  private static instance: TensorFlowManager
  private models: Map<string, tf.LayersModel> = new Map()
  private initialized = false

  private constructor() {}

  static getInstance(): TensorFlowManager {
    if (!TensorFlowManager.instance) {
      TensorFlowManager.instance = new TensorFlowManager()
    }
    return TensorFlowManager.instance
  }

  async initialize(): Promise<void> {
    if (this.initialized) return
    
    // Set backend for optimal performance
    await tf.ready()
    this.initialized = true
  }

  async loadModel(name: string, config: ModelConfig): Promise<tf.LayersModel> {
    await this.initialize()
    
    if (this.models.has(name)) {
      return this.models.get(name)!
    }

    let model: tf.LayersModel
    
    if (config.modelUrl) {
      model = await tf.loadLayersModel(config.modelUrl)
    } else {
      throw new Error(`Model URL not provided for ${name}`)
    }

    this.models.set(name, model)
    return model
  }

  async predict(
    modelName: string, 
    input: any, 
    config: ModelConfig
  ): Promise<any> {
    const model = this.models.get(modelName)
    if (!model) {
      throw new Error(`Model ${modelName} not loaded`)
    }

    let processedInput = input
    if (config.preprocess) {
      processedInput = config.preprocess(input)
    }

    const prediction = model.predict(processedInput) as tf.Tensor
    let result = prediction
    
    if (config.postprocess) {
      result = config.postprocess(prediction)
    }

    // Clean up tensors to prevent memory leaks
    if (processedInput !== input && processedInput.dispose) {
      processedInput.dispose()
    }
    prediction.dispose()

    return result
  }

  disposeModel(name: string): void {
    const model = this.models.get(name)
    if (model) {
      model.dispose()
      this.models.delete(name)
    }
  }

  disposeAll(): void {
    this.models.forEach((model, name) => {
      model.dispose()
    })
    this.models.clear()
  }
}

// Common preprocessing functions
export const preprocessors = {
  imageToTensor: (imageElement: HTMLImageElement, size: [number, number] = [224, 224]): tf.Tensor => {
    return tf.browser.fromPixels(imageElement)
      .resizeBilinear(size)
      .expandDims(0)
      .div(255.0)
  },

  normalizeImage: (tensor: tf.Tensor, mean: number[] = [0.485, 0.456, 0.406], std: number[] = [0.229, 0.224, 0.225]): tf.Tensor => {
    return tensor.sub(mean).div(std)
  }
}

// Common postprocessing functions
export const postprocessors = {
  softmaxToClasses: (logits: tf.Tensor, classNames: string[], topK: number = 5): Array<{className: string, probability: number}> => {
    const probabilities = tf.softmax(logits)
    const values = probabilities.dataSync()
    
    const results = Array.from(values)
      .map((prob, index) => ({ className: classNames[index], probability: prob }))
      .sort((a, b) => b.probability - a.probability)
      .slice(0, topK)
    
    probabilities.dispose()
    return results
  },

  argmax: (tensor: tf.Tensor): number => {
    const result = tensor.argMax().dataSync()[0]
    tensor.dispose()
    return result
  }
}

export default TensorFlowManager