import { Metadata } from 'next'
import ProjectGridSimple from '@/components/lab/ProjectGridSimple'

export const metadata: Metadata = {
  title: 'Project Grid Demo | AI Lab',
  description: 'Demo of the filterable project grid component for the AI lab.',
}

// Sample data for demonstration
const sampleProjects = [
  {
    id: '1',
    title: 'Real-time Object Detection',
    description: 'Interactive computer vision demo using pre-trained models for real-time object detection in web browsers. Upload images or use your camera to detect objects with confidence scores.',
    category: 'Computer Vision' as const,
    difficulty: 'Intermediate' as const,
    technologies: ['TensorFlow.js', 'WebRTC', 'Canvas API', 'MobileNet'],
    imageUrl: '/api/placeholder/400/300',
    demoUrl: '/demo/object-detection',
    githubUrl: 'https://github.com/abdalkaderdev/object-detection',
    status: 'Active' as const,
    featured: true
  },
  {
    id: '2',
    title: 'AI Code Generation',
    description: 'Generate React components and train machine learning models using natural language prompts. Interactive interface for creating custom ML models with real-time visualization.',
    category: 'Generative AI' as const,
    difficulty: 'Advanced' as const,
    technologies: ['OpenAI API', 'Transformers.js', 'React', 'D3.js'],
    imageUrl: '/api/placeholder/400/300',
    demoUrl: '/demo/ai-code-gen',
    githubUrl: 'https://github.com/abdalkaderdev/ai-code-gen',
    status: 'Beta' as const,
    featured: true
  },
  {
    id: '3',
    title: 'Neural Network Visualization',
    description: 'Interactive neural network playground with real-time model visualization and training simulations. Build, train, and visualize custom neural networks in your browser.',
    category: 'Interactive ML' as const,
    difficulty: 'Intermediate' as const,
    technologies: ['TensorFlow.js', 'D3.js', 'WebGL', 'Three.js'],
    imageUrl: '/api/placeholder/400/300',
    demoUrl: '/demo/neural-viz',
    githubUrl: 'https://github.com/abdalkaderdev/neural-viz',
    status: 'Active' as const,
    featured: true
  },
  {
    id: '4',
    title: 'Sentiment Analysis',
    description: 'Analyze text sentiment in real-time using state-of-the-art transformer models. Input text and get instant sentiment scores with confidence intervals.',
    category: 'NLP' as const,
    difficulty: 'Beginner' as const,
    technologies: ['Transformers.js', 'BERT', 'React', 'Natural Language Processing'],
    imageUrl: '/api/placeholder/400/300',
    demoUrl: '/demo/sentiment-analysis',
    status: 'Active' as const,
    featured: false
  },
  {
    id: '5',
    title: 'Style Transfer',
    description: 'Transform images using neural style transfer with artistic combinations using deep learning. Upload content and style images to create unique artwork.',
    category: 'Computer Vision' as const,
    difficulty: 'Intermediate' as const,
    technologies: ['TensorFlow.js', 'CNN', 'WebGL', 'Image Processing'],
    imageUrl: '/api/placeholder/400/300',
    demoUrl: '/demo/style-transfer',
    status: 'Beta' as const,
    featured: false
  },
  {
    id: '6',
    title: 'Text-to-Image Generation',
    description: 'Generate images from text descriptions using diffusion models. Create unique artwork and illustrations from natural language prompts.',
    category: 'Generative AI' as const,
    difficulty: 'Beginner' as const,
    technologies: ['Stable Diffusion', 'Transformers.js', 'Canvas API'],
    imageUrl: '/api/placeholder/400/300',
    demoUrl: '/demo/text-to-image',
    status: 'Coming Soon' as const,
    featured: false
  },
  {
    id: '7',
    title: 'Audio Classification',
    description: 'Classify audio samples and sounds using machine learning models in the browser. Upload audio files or record directly to classify sounds.',
    category: 'Audio Processing' as const,
    difficulty: 'Intermediate' as const,
    technologies: ['TensorFlow.js', 'Web Audio API', 'Machine Learning'],
    imageUrl: '/api/placeholder/400/300',
    demoUrl: '/demo/audio-classification',
    status: 'Active' as const,
    featured: false
  },
  {
    id: '8',
    title: 'Data Visualization Dashboard',
    description: 'Interactive dashboard for visualizing machine learning datasets and model performance. Create charts and graphs from your ML data.',
    category: 'Data Visualization' as const,
    difficulty: 'Beginner' as const,
    technologies: ['D3.js', 'React', 'Chart.js', 'Data Analysis'],
    imageUrl: '/api/placeholder/400/300',
    demoUrl: '/demo/data-viz',
    status: 'Active' as const,
    featured: false
  },
  {
    id: '9',
    title: 'Language Translation',
    description: 'Real-time language translation using neural machine translation models. Translate text between multiple languages instantly.',
    category: 'NLP' as const,
    difficulty: 'Beginner' as const,
    technologies: ['Transformers.js', 'Neural Translation', 'Multilingual Models'],
    imageUrl: '/api/placeholder/400/300',
    demoUrl: '/demo/translation',
    status: 'Active' as const,
    featured: false
  }
]

export default function DemoPage() {
  return (
    <main className="min-h-screen">
      <div className="container mx-auto px-4 py-16">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold gradient-text mb-4">
            Project Grid Component Demo
          </h1>
          <p className="text-xl text-slate-300 max-w-3xl mx-auto">
            Interactive filterable grid showcasing AI lab experiments with search, category filtering, and responsive design.
          </p>
        </div>

        {/* Component Demo */}
        <ProjectGridSimple 
          projects={sampleProjects}
          showFilters={true}
          showSearch={true}
        />

        {/* Features List */}
        <div className="mt-16 grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div className="ai-card">
            <h3 className="text-lg font-semibold text-slate-100 mb-3">🔍 Search Functionality</h3>
            <p className="text-slate-300 text-sm">
              Search across project titles, descriptions, and technology stacks with real-time filtering.
            </p>
          </div>

          <div className="ai-card">
            <h3 className="text-lg font-semibold text-slate-100 mb-3">🏷️ Category Filtering</h3>
            <p className="text-slate-300 text-sm">
              Filter by AI categories: Computer Vision, NLP, Generative AI, Interactive ML, Data Visualization, and Audio Processing.
            </p>
          </div>

          <div className="ai-card">
            <h3 className="text-lg font-semibold text-slate-100 mb-3">📱 Responsive Design</h3>
            <p className="text-slate-300 text-sm">
              Mobile-first design that adapts from single column on mobile to three columns on desktop.
            </p>
          </div>

          <div className="ai-card">
            <h3 className="text-lg font-semibold text-slate-100 mb-3">🎨 Animated Transitions</h3>
            <p className="text-slate-300 text-sm">
              Smooth Framer Motion animations for filtering, hover effects, and layout changes.
            </p>
          </div>

          <div className="ai-card">
            <h3 className="text-lg font-semibold text-slate-100 mb-3">⚡ Performance Optimized</h3>
            <p className="text-slate-300 text-sm">
              Efficient filtering with useMemo hooks and optimized re-renders for smooth performance.
            </p>
          </div>

          <div className="ai-card">
            <h3 className="text-lg font-semibold text-slate-100 mb-3">🔧 TypeScript Ready</h3>
            <p className="text-slate-300 text-sm">
              Fully typed with TypeScript for better development experience and type safety.
            </p>
          </div>
        </div>
      </div>
    </main>
  )
}