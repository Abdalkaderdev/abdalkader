/**
 * AI Lab Experiments Data
 * Defines all available AI experiments and their configurations
 */

export interface Experiment {
  id: string
  slug: string
  title: string
  description: string
  category: 'Computer Vision' | 'NLP' | 'Generative AI' | 'Interactive ML' | 'Data Visualization' | 'Audio Processing'
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced'
  duration: string
  complexity: string
  technologies: string[]
  tags: string[]
  githubUrl?: string
  demoUrl?: string
  status: 'Active' | 'Beta' | 'Coming Soon'
  featured: boolean
  lastUpdated: string
  requirements: {
    browser: string[]
    hardware?: string[]
    dependencies: string[]
  }
  instructions: {
    setup: string[]
    usage: string[]
    troubleshooting: string[]
  }
}

export const experiments: Experiment[] = [
  {
    id: 'object-detection-tfjs',
    slug: 'object-detection',
    title: 'Real-time Object Detection with TensorFlow.js',
    description: 'Interactive computer vision demo using pre-trained models for real-time object detection in web browsers. Upload images or use your camera to detect objects with confidence scores.',
    category: 'Computer Vision',
    difficulty: 'Intermediate',
    duration: '5-10 minutes',
    complexity: 'Real-time processing',
    technologies: ['TensorFlow.js', 'MobileNet SSD', 'WebRTC', 'Canvas API'],
    tags: ['object-detection', 'computer-vision', 'tensorflow', 'real-time'],
    githubUrl: 'https://github.com/abdalkaderdev/ai-lab-object-detection',
    status: 'Active',
    featured: true,
    lastUpdated: '2024-01-15',
    requirements: {
      browser: ['Chrome 88+', 'Firefox 85+', 'Safari 14+'],
      hardware: ['WebGL-capable GPU recommended'],
      dependencies: ['@tensorflow/tfjs']
    },
    instructions: {
      setup: [
        'Allow camera access when prompted',
        'Choose between camera input or image upload',
        'Ensure you have a stable internet connection'
      ],
      usage: [
        'Click "Start Detection" to begin',
        'Point your camera at objects or upload an image',
        'View detected objects with confidence scores',
        'Click on detected objects for more information'
      ],
      troubleshooting: [
        'If detection is slow, try reducing image resolution',
        'Ensure good lighting for camera input',
        'Try refreshing the page if models fail to load'
      ]
    }
  },
  {
    id: 'ai-code-generation',
    slug: 'ai-code-gen',
    title: 'AI Code Generation & ML Model Training',
    description: 'Generate React components and train machine learning models using natural language prompts. Interactive interface for creating custom ML models with real-time visualization.',
    category: 'Generative AI',
    difficulty: 'Advanced',
    duration: '15-30 minutes',
    complexity: 'Multi-step workflow',
    technologies: ['OpenAI API', 'Transformers.js', 'React', 'D3.js'],
    tags: ['code-generation', 'ml-training', 'nlp', 'interactive'],
    githubUrl: 'https://github.com/abdalkaderdev/ai-lab-code-gen',
    status: 'Beta',
    featured: true,
    lastUpdated: '2024-01-10',
    requirements: {
      browser: ['Chrome 88+', 'Firefox 85+'],
      dependencies: ['@xenova/transformers', 'openai']
    },
    instructions: {
      setup: [
        'Enter your OpenAI API key (optional for demo)',
        'Select the type of code generation you want',
        'Prepare your training data if creating custom models'
      ],
      usage: [
        'Describe the component or model you want to create',
        'Adjust parameters using the interactive sliders',
        'Review generated code and train models',
        'Export results or integrate into your projects'
      ],
      troubleshooting: [
        'API rate limits may apply for OpenAI features',
        'Large models may take time to load initially',
        'Check browser console for detailed error messages'
      ]
    }
  },
  {
    id: 'neural-network-viz',
    slug: 'neural-viz',
    title: 'Neural Network Visualization',
    description: 'Interactive neural network playground with real-time model visualization and training simulations. Build, train, and visualize custom neural networks in your browser.',
    category: 'Interactive ML',
    difficulty: 'Intermediate',
    duration: '10-20 minutes',
    complexity: 'Interactive simulation',
    technologies: ['TensorFlow.js', 'D3.js', 'WebGL', 'Three.js'],
    tags: ['neural-networks', 'visualization', 'machine-learning', 'interactive'],
    githubUrl: 'https://github.com/abdalkaderdev/ai-lab-neural-viz',
    status: 'Active',
    featured: true,
    lastUpdated: '2024-01-12',
    requirements: {
      browser: ['Chrome 88+', 'Firefox 85+', 'Safari 14+'],
      hardware: ['WebGL support required'],
      dependencies: ['@tensorflow/tfjs', 'd3', 'three']
    },
    instructions: {
      setup: [
        'Ensure WebGL is enabled in your browser',
        'Allow pop-ups for interactive visualizations',
        'Have a modern browser with good performance'
      ],
      usage: [
        'Drag and drop to build your network architecture',
        'Adjust hyperparameters using the control panel',
        'Watch real-time training visualizations',
        'Export network configurations and results'
      ],
      troubleshooting: [
        'Disable browser extensions that might interfere',
        'Try incognito mode if visualizations don\'t load',
        'Reduce network complexity if performance is poor'
      ]
    }
  },
  {
    id: 'sentiment-analysis',
    slug: 'sentiment-analysis',
    title: 'Real-time Sentiment Analysis',
    description: 'Analyze text sentiment in real-time using state-of-the-art transformer models. Input text and get instant sentiment scores with confidence intervals.',
    category: 'NLP',
    difficulty: 'Beginner',
    duration: '3-5 minutes',
    complexity: 'Simple text processing',
    technologies: ['Transformers.js', 'BERT', 'React'],
    tags: ['sentiment-analysis', 'nlp', 'text-processing', 'transformers'],
    status: 'Active',
    featured: false,
    lastUpdated: '2024-01-08',
    requirements: {
      browser: ['Chrome 88+', 'Firefox 85+'],
      dependencies: ['@xenova/transformers']
    },
    instructions: {
      setup: [
        'Ensure stable internet connection for model loading',
        'Allow JavaScript execution',
        'Have some text ready to analyze'
      ],
      usage: [
        'Type or paste text in the input field',
        'Click "Analyze" to get sentiment scores',
        'View detailed breakdown of sentiment components',
        'Try different text samples to see variations'
      ],
      troubleshooting: [
        'Models may take time to load on first visit',
        'Very long text may be truncated automatically',
        'Some languages may have limited accuracy'
      ]
    }
  },
  {
    id: 'image-style-transfer',
    slug: 'style-transfer',
    title: 'Neural Style Transfer',
    description: 'Transform images using neural style transfer. Upload a content image and a style image to create artistic combinations using deep learning.',
    category: 'Computer Vision',
    difficulty: 'Intermediate',
    duration: '8-15 minutes',
    complexity: 'Image processing',
    technologies: ['TensorFlow.js', 'CNN', 'WebGL'],
    tags: ['style-transfer', 'computer-vision', 'artistic', 'deep-learning'],
    githubUrl: 'https://github.com/abdalkaderdev/ai-lab-style-transfer',
    status: 'Beta',
    featured: false,
    lastUpdated: '2024-01-05',
    requirements: {
      browser: ['Chrome 88+', 'Firefox 85+'],
      hardware: ['WebGL-capable GPU recommended'],
      dependencies: ['@tensorflow/tfjs']
    },
    instructions: {
      setup: [
        'Prepare content and style images (JPG/PNG)',
        'Ensure images are not too large (max 1024px)',
        'Allow sufficient processing time'
      ],
      usage: [
        'Upload a content image (what you want to transform)',
        'Upload a style image (artistic style to apply)',
        'Adjust style strength and other parameters',
        'Click "Transfer Style" and wait for processing',
        'Download the result when complete'
      ],
      troubleshooting: [
        'Processing may take several minutes for high-quality results',
        'Try reducing image resolution if processing fails',
        'Some style images work better than others'
      ]
    }
  },
  {
    id: 'text-to-image',
    slug: 'text-to-image',
    title: 'Text-to-Image Generation',
    description: 'Generate images from text descriptions using diffusion models. Create unique artwork and illustrations from natural language prompts.',
    category: 'Generative AI',
    difficulty: 'Beginner',
    duration: '5-10 minutes',
    complexity: 'API-based generation',
    technologies: ['Stable Diffusion', 'Transformers.js', 'Canvas API'],
    tags: ['text-to-image', 'generative-ai', 'diffusion', 'creative'],
    status: 'Coming Soon',
    featured: false,
    lastUpdated: '2024-01-01',
    requirements: {
      browser: ['Chrome 88+', 'Firefox 85+'],
      hardware: ['WebGL support'],
      dependencies: ['@xenova/transformers']
    },
    instructions: {
      setup: [
        'Ensure stable internet connection',
        'Allow pop-ups for image downloads',
        'Have creative text prompts ready'
      ],
      usage: [
        'Enter a detailed text description',
        'Adjust generation parameters',
        'Click "Generate Image" and wait',
        'Download or share your creations'
      ],
      troubleshooting: [
        'Generation may take 1-2 minutes',
        'Try more specific prompts for better results',
        'Some prompts may not generate appropriate content'
      ]
    }
  }
]

// Helper functions
export function getExperimentsByCategory(category: string): Experiment[] {
  return experiments.filter(exp => exp.category === category)
}

export function getFeaturedExperiments(): Experiment[] {
  return experiments.filter(exp => exp.featured)
}

export function getExperimentBySlug(slug: string): Experiment | undefined {
  return experiments.find(exp => exp.slug === slug)
}

export function getExperimentsByDifficulty(difficulty: string): Experiment[] {
  return experiments.filter(exp => exp.difficulty === difficulty)
}

export function searchExperiments(query: string): Experiment[] {
  const lowercaseQuery = query.toLowerCase()
  return experiments.filter(exp => 
    exp.title.toLowerCase().includes(lowercaseQuery) ||
    exp.description.toLowerCase().includes(lowercaseQuery) ||
    exp.tags.some(tag => tag.toLowerCase().includes(lowercaseQuery)) ||
    exp.technologies.some(tech => tech.toLowerCase().includes(lowercaseQuery))
  )
}

export function getActiveExperiments(): Experiment[] {
  return experiments.filter(exp => exp.status === 'Active')
}

export default experiments