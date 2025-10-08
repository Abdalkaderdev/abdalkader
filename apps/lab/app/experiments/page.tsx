import { Metadata } from 'next'
import ExperimentsList from '@/components/lab/ExperimentsList'
import LabHeader from '@/components/lab/LabHeader'

export const metadata: Metadata = {
  title: 'AI Experiments | Interactive Machine Learning Demos',
  description: 'Browse all AI experiments and machine learning demonstrations. Interactive TensorFlow.js demos, computer vision projects, and neural network visualizations.',
}

export default function ExperimentsPage() {
  return (
    <main className="min-h-screen">
      <LabHeader />
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold gradient-text mb-4">
            AI Experiments Collection
          </h1>
          <p className="text-xl text-slate-300 max-w-3xl mx-auto">
            Explore our collection of interactive machine learning experiments and AI demonstrations
          </p>
        </div>
        <ExperimentsList />
      </div>
    </main>
  )
}