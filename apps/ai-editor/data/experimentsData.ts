export interface Experiment {
  id: string;
  title: string;
  description: string;
  longDescription: string;
  category: string;
  technologies: string[];
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  estimatedTime: string;
  features: string[];
  image: string;
  demoUrl: string;
  githubUrl?: string;
  status: 'active' | 'coming-soon' | 'deprecated';
  lastUpdated: string;
  author: string;
  tags: string[];
}

export const experiments: Experiment[] = [
  {
    id: 'component-playground',
    title: 'Component Playground',
    description: 'Interactive component playground with live preview, code editing, and real-time updates.',
    longDescription: 'A comprehensive development environment for testing React components with live preview, code editing using Monaco Editor, and real-time updates. Perfect for prototyping UI components, testing different props and states, and experimenting with design patterns.',
    category: 'Interactive Development',
    technologies: ['React', 'TypeScript', 'Monaco Editor', 'Tailwind CSS'],
    difficulty: 'beginner',
    estimatedTime: '5-10 minutes',
    features: [
      'Live code editing with syntax highlighting',
      'Real-time component preview',
      'Code templates and examples',
      'Export functionality',
      'Error handling and debugging',
      'Responsive design testing'
    ],
    image: '/images/experiments/component-playground.jpg',
    demoUrl: '/playground',
    status: 'active',
    lastUpdated: '2024-01-15',
    author: 'Abdalkader Alhamoud',
    tags: ['react', 'typescript', 'monaco-editor', 'live-preview']
  },
  {
    id: 'ai-code-generator',
    title: 'AI Code Generator',
    description: 'Generate React components using natural language prompts with AI-powered code generation.',
    longDescription: 'An intelligent code generation tool that uses OpenAI\'s GPT models to create React components from natural language descriptions. Features include live preview, TypeScript support, design system integration, and iterative improvement suggestions.',
    category: 'AI Code Generation',
    technologies: ['React', 'TypeScript', 'OpenAI', 'Monaco Editor', 'Tailwind CSS'],
    difficulty: 'intermediate',
    estimatedTime: '10-15 minutes',
    features: [
      'Natural language to code conversion',
      'Live preview of generated components',
      'TypeScript support',
      'Design system integration',
      'Iterative improvement suggestions',
      'Code export and download',
      'Template library'
    ],
    image: '/images/experiments/ai-code-generator.jpg',
    demoUrl: '/generate',
    status: 'active',
    lastUpdated: '2024-01-15',
    author: 'Abdalkader Alhamoud',
    tags: ['ai', 'openai', 'code-generation', 'react', 'typescript']
  },
  {
    id: 'computer-vision-demo',
    title: 'Real-time Object Detection',
    description: 'Interactive computer vision demo using TensorFlow.js for real-time object detection.',
    longDescription: 'A real-time object detection system using TensorFlow.js and pre-trained models. Detects objects in webcam feed with bounding boxes, confidence scores, and performance metrics. Perfect for learning computer vision concepts and TensorFlow.js integration.',
    category: 'Computer Vision',
    technologies: ['TensorFlow.js', 'COCO-SSD', 'WebRTC', 'Canvas API'],
    difficulty: 'advanced',
    estimatedTime: '15-20 minutes',
    features: [
      'Real-time webcam object detection',
      'Multiple pre-trained models',
      'Performance metrics (FPS)',
      'Bounding box visualization',
      'Confidence score display',
      'Model switching capability',
      'Error handling and fallbacks'
    ],
    image: '/images/experiments/computer-vision.jpg',
    demoUrl: '/experiments/computer-vision',
    status: 'coming-soon',
    lastUpdated: '2024-01-10',
    author: 'Abdalkader Alhamoud',
    tags: ['tensorflow', 'computer-vision', 'object-detection', 'webrtc']
  },
  {
    id: 'neural-network-visualizer',
    title: 'Neural Network Visualizer',
    description: 'Interactive neural network playground with real-time model visualization and training simulations.',
    longDescription: 'An educational tool for visualizing neural networks with interactive layers, real-time training simulations, and parameter adjustment. Learn about different architectures, activation functions, and training processes through hands-on experimentation.',
    category: 'Machine Learning',
    technologies: ['TensorFlow.js', 'D3.js', 'WebGL', 'Canvas API'],
    difficulty: 'advanced',
    estimatedTime: '20-30 minutes',
    features: [
      'Interactive network architecture builder',
      'Real-time training visualization',
      'Multiple activation functions',
      'Loss function visualization',
      'Parameter adjustment controls',
      'Export network configurations',
      'Educational tooltips and guides'
    ],
    image: '/images/experiments/neural-network.jpg',
    demoUrl: '/experiments/neural-network',
    status: 'coming-soon',
    lastUpdated: '2024-01-05',
    author: 'Abdalkader Alhamoud',
    tags: ['neural-networks', 'tensorflow', 'visualization', 'machine-learning']
  },
  {
    id: 'data-visualization-lab',
    title: 'Data Visualization Lab',
    description: 'Interactive data visualization playground with multiple chart types and real-time data manipulation.',
    longDescription: 'A comprehensive data visualization laboratory featuring multiple chart types, real-time data manipulation, and interactive filtering. Perfect for exploring data patterns, creating dashboards, and learning visualization best practices.',
    category: 'Data Visualization',
    technologies: ['D3.js', 'React', 'TypeScript', 'WebGL'],
    difficulty: 'intermediate',
    estimatedTime: '15-25 minutes',
    features: [
      'Multiple chart types (bar, line, scatter, etc.)',
      'Real-time data manipulation',
      'Interactive filtering and sorting',
      'Custom color schemes',
      'Export to various formats',
      'Responsive design',
      'Animation controls'
    ],
    image: '/images/experiments/data-visualization.jpg',
    demoUrl: '/experiments/data-visualization',
    status: 'coming-soon',
    lastUpdated: '2024-01-08',
    author: 'Abdalkader Alhamoud',
    tags: ['data-visualization', 'd3', 'charts', 'interactive']
  }
];

export function getExperimentById(id: string): Experiment | undefined {
  return experiments.find(exp => exp.id === id);
}

export function getExperimentsByCategory(category: string): Experiment[] {
  return experiments.filter(exp => exp.category === category);
}

export function getExperimentsByDifficulty(difficulty: string): Experiment[] {
  return experiments.filter(exp => exp.difficulty === difficulty);
}

export function getActiveExperiments(): Experiment[] {
  return experiments.filter(exp => exp.status === 'active');
}

export function searchExperiments(query: string): Experiment[] {
  const lowercaseQuery = query.toLowerCase();
  return experiments.filter(exp => 
    exp.title.toLowerCase().includes(lowercaseQuery) ||
    exp.description.toLowerCase().includes(lowercaseQuery) ||
    exp.tags.some(tag => tag.toLowerCase().includes(lowercaseQuery)) ||
    exp.technologies.some(tech => tech.toLowerCase().includes(lowercaseQuery))
  );
}