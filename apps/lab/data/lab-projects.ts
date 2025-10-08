/**
 * Lab Projects Data
 * Sample data for AI/ML experiments and demos
 */

import { LabProject, LabCategory } from '@/types/lab';

export const labProjects: LabProject[] = [
  {
    id: 'object-detection',
    title: 'Real-time Object Detection',
    description: 'Webcam-based object detection using TensorFlow.js COCO-SSD model. Detect and classify 80 different object types in real-time with confidence scoring.',
    category: 'computer-vision',
    technologies: ['TensorFlow.js', 'COCO-SSD', 'React', 'TypeScript', 'WebRTC'],
    demoUrl: '/lab/object-detection',
    sourceUrl: 'https://github.com/abdalkaderdev/ai-lab-object-detection',
    difficulty: 'intermediate',
    modelSize: '15MB',
    dependencies: ['@tensorflow/tfjs', '@tensorflow-models/coco-ssd'],
    status: 'active',
    featured: true,
    lastUpdated: '2024-01-15',
    estimatedRuntime: '5-10 minutes',
    browserRequirements: {
      webgl: true,
      camera: true,
    },
  },
  {
    id: 'sentiment-analysis',
    title: 'Real-time Sentiment Analysis',
    description: 'Analyze text sentiment using Transformers.js BERT model. Input text and get instant sentiment scores with confidence intervals.',
    category: 'nlp',
    technologies: ['Transformers.js', 'BERT', 'React', 'TypeScript'],
    demoUrl: '/lab/sentiment-analysis',
    sourceUrl: 'https://github.com/abdalkaderdev/ai-lab-sentiment',
    difficulty: 'beginner',
    modelSize: '25MB',
    dependencies: ['@xenova/transformers'],
    status: 'active',
    featured: false,
    lastUpdated: '2024-01-10',
    estimatedRuntime: '3-5 minutes',
    browserRequirements: {
      wasm: true,
    },
  },
  {
    id: 'style-transfer',
    title: 'Neural Style Transfer',
    description: 'Transform images using neural style transfer with artistic combinations. Upload content and style images to create unique artwork.',
    category: 'computer-vision',
    technologies: ['TensorFlow.js', 'CNN', 'WebGL', 'Canvas API'],
    demoUrl: '/lab/style-transfer',
    sourceUrl: 'https://github.com/abdalkaderdev/ai-lab-style-transfer',
    difficulty: 'intermediate',
    modelSize: '45MB',
    dependencies: ['@tensorflow/tfjs'],
    status: 'beta',
    featured: true,
    lastUpdated: '2024-01-08',
    estimatedRuntime: '8-15 minutes',
    browserRequirements: {
      webgl: true,
    },
  },
  {
    id: 'text-generation',
    title: 'AI Text Generation',
    description: 'Generate creative text using GPT-2 model in the browser. Create stories, poems, and creative writing with AI assistance.',
    category: 'generative',
    technologies: ['Transformers.js', 'GPT-2', 'React', 'TypeScript'],
    demoUrl: '/lab/text-generation',
    sourceUrl: 'https://github.com/abdalkaderdev/ai-lab-text-gen',
    difficulty: 'beginner',
    modelSize: '35MB',
    dependencies: ['@xenova/transformers'],
    status: 'active',
    featured: false,
    lastUpdated: '2024-01-12',
    estimatedRuntime: '5-10 minutes',
    browserRequirements: {
      wasm: true,
    },
  },
  {
    id: 'neural-network-viz',
    title: 'Neural Network Visualization',
    description: 'Interactive playground for visualizing neural networks. Build, train, and visualize custom networks with real-time animations.',
    category: 'creative',
    technologies: ['Three.js', 'D3.js', 'TensorFlow.js', 'WebGL'],
    demoUrl: '/lab/neural-viz',
    sourceUrl: 'https://github.com/abdalkaderdev/ai-lab-neural-viz',
    difficulty: 'advanced',
    modelSize: '20MB',
    dependencies: ['three', 'd3', '@tensorflow/tfjs'],
    status: 'beta',
    featured: true,
    lastUpdated: '2024-01-05',
    estimatedRuntime: '15-30 minutes',
    browserRequirements: {
      webgl: true,
    },
  },
  {
    id: 'audio-classification',
    title: 'Audio Classification',
    description: 'Classify audio samples and sounds using machine learning models. Upload audio files or record directly to classify sounds.',
    category: 'nlp',
    technologies: ['TensorFlow.js', 'Web Audio API', 'FFT', 'React'],
    demoUrl: '/lab/audio-classification',
    sourceUrl: 'https://github.com/abdalkaderdev/ai-lab-audio',
    difficulty: 'intermediate',
    modelSize: '12MB',
    dependencies: ['@tensorflow/tfjs'],
    status: 'active',
    featured: false,
    lastUpdated: '2024-01-03',
    estimatedRuntime: '5-8 minutes',
    browserRequirements: {
      webgl: true,
      microphone: true,
    },
  },
  {
    id: 'image-generation',
    title: 'AI Image Generation',
    description: 'Generate images from text descriptions using diffusion models. Create unique artwork and illustrations from natural language prompts.',
    category: 'generative',
    technologies: ['Stable Diffusion', 'Transformers.js', 'Canvas API'],
    demoUrl: '/lab/image-generation',
    sourceUrl: 'https://github.com/abdalkaderdev/ai-lab-image-gen',
    difficulty: 'intermediate',
    modelSize: '120MB',
    dependencies: ['@xenova/transformers'],
    status: 'coming-soon',
    featured: false,
    lastUpdated: '2024-01-01',
    estimatedRuntime: '10-20 minutes',
    browserRequirements: {
      webgl: true,
      wasm: true,
    },
  },
  {
    id: 'data-visualization',
    title: 'ML Data Visualization',
    description: 'Interactive dashboard for visualizing machine learning datasets and model performance. Create charts and graphs from your ML data.',
    category: 'creative',
    technologies: ['D3.js', 'React', 'Chart.js', 'TensorFlow.js'],
    demoUrl: '/lab/data-viz',
    sourceUrl: 'https://github.com/abdalkaderdev/ai-lab-data-viz',
    difficulty: 'beginner',
    modelSize: '8MB',
    dependencies: ['d3', 'chart.js'],
    status: 'active',
    featured: false,
    lastUpdated: '2023-12-28',
    estimatedRuntime: '5-10 minutes',
    browserRequirements: {},
  },
];

export const labCategories: LabCategory[] = [
  {
    id: 'computer-vision',
    name: 'Computer Vision',
    description: 'AI-powered image and video analysis',
    icon: '👁️',
    color: '#3B82F6',
    projectCount: 2,
  },
  {
    id: 'nlp',
    name: 'Natural Language Processing',
    description: 'Text analysis and language understanding',
    icon: '🧠',
    color: '#10B981',
    projectCount: 2,
  },
  {
    id: 'generative',
    name: 'Generative AI',
    description: 'AI that creates new content',
    icon: '🎨',
    color: '#8B5CF6',
    projectCount: 2,
  },
  {
    id: 'creative',
    name: 'Creative Coding',
    description: 'Interactive visualizations and creative tools',
    icon: '⚡',
    color: '#F59E0B',
    projectCount: 2,
  },
];

// Helper functions
export function getProjectById(id: string): LabProject | undefined {
  return labProjects.find(project => project.id === id);
}

export function getProjectsByCategory(category: string): LabProject[] {
  return labProjects.filter(project => project.category === category);
}

export function getFeaturedProjects(): LabProject[] {
  return labProjects.filter(project => project.featured);
}

export function getActiveProjects(): LabProject[] {
  return labProjects.filter(project => project.status === 'active');
}

export function searchProjects(query: string): LabProject[] {
  const lowercaseQuery = query.toLowerCase();
  return labProjects.filter(project =>
    project.title.toLowerCase().includes(lowercaseQuery) ||
    project.description.toLowerCase().includes(lowercaseQuery) ||
    project.technologies.some(tech => tech.toLowerCase().includes(lowercaseQuery))
  );
}

export function getAllTechnologies(): string[] {
  const technologies = new Set<string>();
  labProjects.forEach(project => {
    project.technologies.forEach(tech => technologies.add(tech));
  });
  return Array.from(technologies).sort();
}