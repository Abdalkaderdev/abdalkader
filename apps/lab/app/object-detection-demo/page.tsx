import { Metadata } from 'next'
import ObjectDetectionDemo from '@/components/lab/ObjectDetectionDemo'
import LabHeader from '@/components/lab/LabHeader'

export const metadata: Metadata = {
  title: 'AI-Powered Real-time Object Detection | TensorFlow.js COCO-SSD Demo | Abdalkader.dev',
  description: 'Interactive computer vision demonstration using TensorFlow.js COCO-SSD model for real-time object detection. Experience AI-powered image recognition with 80 object classes, confidence scoring, and mobile-optimized performance.',
  keywords: ['AI object detection', 'computer vision demo', 'TensorFlow.js', 'COCO-SSD model', 'machine learning', 'real-time AI', 'browser AI', 'image recognition', 'neural networks'],
  authors: [{ name: 'Abdalkader Alhamoud' }],
  creator: 'Abdalkader Alhamoud',
  openGraph: {
    title: 'AI-Powered Real-time Object Detection | TensorFlow.js COCO-SSD Demo',
    description: 'Interactive computer vision demonstration using TensorFlow.js COCO-SSD model for real-time object detection with 80 object classes.',
    url: 'https://lab.abdalkader.dev/object-detection-demo',
    siteName: 'Abdalkader AI Lab',
    type: 'article',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AI-Powered Real-time Object Detection | TensorFlow.js COCO-SSD Demo',
    description: 'Interactive computer vision demonstration using TensorFlow.js COCO-SSD model for real-time object detection.',
    creator: '@abdalkaderdev',
  },
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: 'https://lab.abdalkader.dev/object-detection-demo',
  },
}

export default function ObjectDetectionDemoPage() {
  return (
    <main className="min-h-screen">
      <LabHeader />
      
      {/* Structured Data for CreativeWork */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'CreativeWork',
            name: 'AI-Powered Real-time Object Detection Demo',
            description: 'Interactive computer vision demonstration using TensorFlow.js COCO-SSD model for real-time object detection with 80 object classes.',
            url: 'https://lab.abdalkader.dev/object-detection-demo',
            applicationCategory: 'MLApplication',
            programmingLanguage: ['JavaScript', 'TypeScript', 'TensorFlow.js'],
            runtimePlatform: 'Web',
            creator: {
              '@type': 'Person',
              name: 'Abdalkader Alhamoud',
              jobTitle: 'AI & Full-Stack Developer',
              url: 'https://abdalkader.dev'
            },
            dateCreated: '2024-01-15',
            dateModified: '2024-01-15',
            about: [
              {
                '@type': 'Thing',
                name: 'Computer Vision'
              },
              {
                '@type': 'Thing', 
                name: 'Object Detection'
              },
              {
                '@type': 'Thing',
                name: 'Machine Learning'
              }
            ],
            keywords: 'AI object detection, computer vision, TensorFlow.js, COCO-SSD, machine learning, real-time AI',
            license: 'MIT',
            isAccessibleForFree: true
          })
        }}
      />
      
      <div className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold gradient-text mb-4">
            Real-time Object Detection
          </h1>
          <p className="text-xl text-slate-300 max-w-3xl mx-auto mb-6">
            Experience cutting-edge computer vision technology using TensorFlow.js COCO-SSD model. 
            Detect and classify objects in real-time through your webcam with AI-powered precision.
          </p>
          
          {/* Features */}
          <div className="flex flex-wrap justify-center gap-6 text-sm text-slate-400">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-blue-400 rounded-full" />
              <span>80 Object Classes</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-400 rounded-full" />
              <span>Real-time Processing</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-purple-400 rounded-full" />
              <span>Mobile Compatible</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-orange-400 rounded-full" />
              <span>Performance Optimized</span>
            </div>
          </div>
        </div>

        {/* Main Demo */}
        <ObjectDetectionDemo 
          showSettings={true}
          initialConfidence={0.5}
          initialMaxDetections={10}
        />

        {/* Technical Details */}
        <div className="mt-16 grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div className="ai-card">
            <h3 className="text-lg font-semibold text-slate-100 mb-3 flex items-center">
              <span className="w-8 h-8 bg-blue-500/20 rounded-lg flex items-center justify-center mr-3">
                🧠
              </span>
              AI Model
            </h3>
            <p className="text-slate-300 text-sm">
              Uses COCO-SSD (Single Shot MultiBox Detector) model trained on the COCO dataset 
              with 80 object classes including people, vehicles, animals, and everyday objects.
            </p>
          </div>

          <div className="ai-card">
            <h3 className="text-lg font-semibold text-slate-100 mb-3 flex items-center">
              <span className="w-8 h-8 bg-green-500/20 rounded-lg flex items-center justify-center mr-3">
                ⚡
              </span>
              Performance
            </h3>
            <p className="text-slate-300 text-sm">
              Optimized for real-time inference with TensorFlow.js WebGL backend. 
              Achieves smooth FPS while maintaining high detection accuracy.
            </p>
          </div>

          <div className="ai-card">
            <h3 className="text-lg font-semibold text-slate-100 mb-3 flex items-center">
              <span className="w-8 h-8 bg-purple-500/20 rounded-lg flex items-center justify-center mr-3">
                📱
              </span>
              Mobile Support
            </h3>
            <p className="text-slate-300 text-sm">
              Fully compatible with mobile devices. Automatically switches to back camera 
              and optimizes video resolution for mobile performance.
            </p>
          </div>

          <div className="ai-card">
            <h3 className="text-lg font-semibold text-slate-100 mb-3 flex items-center">
              <span className="w-8 h-8 bg-orange-500/20 rounded-lg flex items-center justify-center mr-3">
                🎯
              </span>
              Accuracy
            </h3>
            <p className="text-slate-300 text-sm">
              Configurable confidence thresholds allow you to balance between detection 
              accuracy and false positive rates for your specific use case.
            </p>
          </div>

          <div className="ai-card">
            <h3 className="text-lg font-semibold text-slate-100 mb-3 flex items-center">
              <span className="w-8 h-8 bg-red-500/20 rounded-lg flex items-center justify-center mr-3">
                🔒
              </span>
              Privacy
            </h3>
            <p className="text-slate-300 text-sm">
              All processing happens locally in your browser. No video data is sent to 
              external servers, ensuring complete privacy and security.
            </p>
          </div>

          <div className="ai-card">
            <h3 className="text-lg font-semibold text-slate-100 mb-3 flex items-center">
              <span className="w-8 h-8 bg-yellow-500/20 rounded-lg flex items-center justify-center mr-3">
                🛠️
              </span>
              Customizable
            </h3>
            <p className="text-slate-300 text-sm">
              Adjustable settings for confidence threshold, maximum detections, and 
              performance metrics to fine-tune the detection experience.
            </p>
          </div>
        </div>

        {/* Instructions */}
        <div className="mt-16 ai-card">
          <h2 className="text-2xl font-bold text-slate-100 mb-6">How to Use</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-lg font-semibold text-slate-100 mb-4">Getting Started</h3>
              <ol className="space-y-3 text-slate-300">
                <li className="flex items-start space-x-3">
                  <span className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center text-white text-sm font-bold flex-shrink-0">1</span>
                  <span>Click "Load Model" to download the AI model (one-time setup)</span>
                </li>
                <li className="flex items-start space-x-3">
                  <span className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center text-white text-sm font-bold flex-shrink-0">2</span>
                  <span>Click "Start Camera" and allow camera permissions when prompted</span>
                </li>
                <li className="flex items-start space-x-3">
                  <span className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center text-white text-sm font-bold flex-shrink-0">3</span>
                  <span>Click "Start Detection" to begin real-time object detection</span>
                </li>
                <li className="flex items-start space-x-3">
                  <span className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center text-white text-sm font-bold flex-shrink-0">4</span>
                  <span>Adjust settings to fine-tune detection sensitivity</span>
                </li>
              </ol>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold text-slate-100 mb-4">Tips for Best Results</h3>
              <ul className="space-y-3 text-slate-300">
                <li className="flex items-start space-x-3">
                  <span className="w-2 h-2 bg-green-400 rounded-full mt-2 flex-shrink-0" />
                  <span>Ensure good lighting conditions for better detection accuracy</span>
                </li>
                <li className="flex items-start space-x-3">
                  <span className="w-2 h-2 bg-green-400 rounded-full mt-2 flex-shrink-0" />
                  <span>Keep objects clearly visible and not too far from the camera</span>
                </li>
                <li className="flex items-start space-x-3">
                  <span className="w-2 h-2 bg-green-400 rounded-full mt-2 flex-shrink-0" />
                  <span>Lower confidence threshold for more detections (may include false positives)</span>
                </li>
                <li className="flex items-start space-x-3">
                  <span className="w-2 h-2 bg-green-400 rounded-full mt-2 flex-shrink-0" />
                  <span>Use Chrome or Firefox for optimal performance</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Browser Requirements */}
        <div className="mt-12 ai-card">
          <h3 className="text-lg font-semibold text-slate-100 mb-4">Browser Requirements</h3>
          <div className="grid md:grid-cols-3 gap-6 text-sm">
            <div>
              <h4 className="font-medium text-slate-200 mb-2">Required</h4>
              <ul className="space-y-1 text-slate-400">
                <li>• WebGL support</li>
                <li>• Camera access</li>
                <li>• Modern JavaScript</li>
                <li>• HTTPS connection</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium text-slate-200 mb-2">Recommended</h4>
              <ul className="space-y-1 text-slate-400">
                <li>• Chrome 88+</li>
                <li>• Firefox 85+</li>
                <li>• Safari 14+</li>
                <li>• Dedicated GPU</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium text-slate-200 mb-2">Mobile</h4>
              <ul className="space-y-1 text-slate-400">
                <li>• iOS 14+ Safari</li>
                <li>• Android Chrome 88+</li>
                <li>• Back camera access</li>
                <li>• Stable connection</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}