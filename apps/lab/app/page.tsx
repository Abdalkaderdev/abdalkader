import { Metadata } from 'next'
import LabHero from '@/components/lab/LabHero'
import ExperimentsGrid from '@/components/lab/ExperimentsGrid'
import TechStack from '@/components/lab/TechStack'
import LabFooter from '@/components/lab/LabFooter'

export const metadata: Metadata = {
  title: 'AI & Interactive Experiments Lab | Abdalkader.dev',
  description: 'Explore cutting-edge AI experiments, machine learning demos, and interactive TensorFlow.js applications. From real-time object detection to neural network visualizations.',
}

export default function LabHomePage() {
  return (
    <main className="min-h-screen">
      <LabHero />
      <ExperimentsGrid />
      <TechStack />
      <LabFooter />
    </main>
  )
}