/**
 * Transformers.js utilities for AI experiments
 * Provides common functions for NLP tasks and text processing
 */

import { pipeline, Pipeline } from '@xenova/transformers'

export interface PipelineConfig {
  task: string
  model: string
  revision?: string
  quantized?: boolean
}

export interface TextClassificationResult {
  label: string
  score: number
}

export interface TextGenerationResult {
  generated_text: string
}

export interface QuestionAnsweringResult {
  answer: string
  score: number
  start: number
  end: number
}

export class TransformersManager {
  private static instance: TransformersManager
  private pipelines: Map<string, Pipeline> = new Map()
  private initialized = false

  private constructor() {}

  static getInstance(): TransformersManager {
    if (!TransformersManager.instance) {
      TransformersManager.instance = new TransformersManager()
    }
    return TransformersManager.instance
  }

  async initialize(): Promise<void> {
    if (this.initialized) return
    
    // Initialize transformers.js with default configuration
    this.initialized = true
  }

  async loadPipeline(name: string, config: PipelineConfig): Promise<Pipeline> {
    await this.initialize()
    
    if (this.pipelines.has(name)) {
      return this.pipelines.get(name)!
    }

    const pipe = await pipeline(config.task, config.model, {
      revision: config.revision,
      quantized: config.quantized !== false // Default to quantized for better performance
    })

    this.pipelines.set(name, pipe)
    return pipe
  }

  async classifyText(pipelineName: string, text: string): Promise<TextClassificationResult[]> {
    const pipe = this.pipelines.get(pipelineName)
    if (!pipe) {
      throw new Error(`Pipeline ${pipelineName} not loaded`)
    }

    const result = await pipe(text)
    return Array.isArray(result) ? result : [result]
  }

  async generateText(
    pipelineName: string, 
    prompt: string, 
    maxLength: number = 100
  ): Promise<string> {
    const pipe = this.pipelines.get(pipelineName)
    if (!pipe) {
      throw new Error(`Pipeline ${pipelineName} not loaded`)
    }

    const result = await pipe(prompt, {
      max_length: maxLength,
      do_sample: true,
      temperature: 0.7
    })

    return result[0]?.generated_text || ''
  }

  async answerQuestion(
    pipelineName: string,
    question: string,
    context: string
  ): Promise<QuestionAnsweringResult> {
    const pipe = this.pipelines.get(pipelineName)
    if (!pipe) {
      throw new Error(`Pipeline ${pipelineName} not loaded`)
    }

    const result = await pipe(question, context)
    return result
  }

  async summarizeText(pipelineName: string, text: string): Promise<string> {
    const pipe = this.pipelines.get(pipelineName)
    if (!pipe) {
      throw new Error(`Pipeline ${pipelineName} not loaded`)
    }

    const result = await pipe(text, {
      max_length: 100,
      min_length: 30,
      do_sample: false
    })

    return result[0]?.summary_text || ''
  }

  disposePipeline(name: string): void {
    this.pipelines.delete(name)
  }

  disposeAll(): void {
    this.pipelines.clear()
  }
}

// Common pipeline configurations
export const pipelineConfigs = {
  sentimentAnalysis: {
    task: 'sentiment-analysis',
    model: 'Xenova/distilbert-base-uncased-finetuned-sst-2-english',
    quantized: true
  },

  textGeneration: {
    task: 'text-generation',
    model: 'Xenova/gpt2',
    quantized: true
  },

  questionAnswering: {
    task: 'question-answering',
    model: 'Xenova/distilbert-base-cased-distilled-squad',
    quantized: true
  },

  textSummarization: {
    task: 'summarization',
    model: 'Xenova/distilbart-cnn-12-6',
    quantized: true
  },

  namedEntityRecognition: {
    task: 'token-classification',
    model: 'Xenova/distilbert-base-uncased',
    quantized: true
  }
}

// Utility functions for text processing
export const textUtils = {
  cleanText: (text: string): string => {
    return text
      .replace(/\s+/g, ' ')
      .replace(/[^\w\s.,!?;:]/g, '')
      .trim()
  },

  extractKeywords: (text: string, maxKeywords: number = 10): string[] => {
    const words = text.toLowerCase().split(/\W+/)
    const wordFreq: { [key: string]: number } = {}
    
    words.forEach(word => {
      if (word.length > 3) {
        wordFreq[word] = (wordFreq[word] || 0) + 1
      }
    })
    
    return Object.entries(wordFreq)
      .sort(([,a], [,b]) => b - a)
      .slice(0, maxKeywords)
      .map(([word]) => word)
  },

  calculateReadabilityScore: (text: string): number => {
    const words = text.split(/\s+/).length
    const sentences = text.split(/[.!?]+/).length
    const syllables = text.split(/[aeiou]/gi).length - 1
    
    if (words === 0 || sentences === 0) return 0
    
    const avgWordsPerSentence = words / sentences
    const avgSyllablesPerWord = syllables / words
    
    return 206.835 - (1.015 * avgWordsPerSentence) - (84.6 * avgSyllablesPerWord)
  }
}

export default TransformersManager