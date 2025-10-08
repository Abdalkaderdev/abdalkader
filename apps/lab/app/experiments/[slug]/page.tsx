import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { experiments } from '@/data/projects/experiments'
import ExperimentViewer from '@/components/lab/ExperimentViewer'
import LabHeader from '@/components/lab/LabHeader'

interface ExperimentPageProps {
  params: {
    slug: string
  }
}

export async function generateStaticParams() {
  return experiments.map((experiment) => ({
    slug: experiment.slug,
  }))
}

export async function generateMetadata({ params }: ExperimentPageProps): Promise<Metadata> {
  const experiment = experiments.find((exp) => exp.slug === params.slug)
  
  if (!experiment) {
    return {
      title: 'Experiment Not Found',
    }
  }

  return {
    title: `${experiment.title} | AI Lab Experiment`,
    description: experiment.description,
    keywords: experiment.tags,
    openGraph: {
      title: `${experiment.title} | AI Lab Experiment`,
      description: experiment.description,
      type: 'article',
    },
  }
}

export default function ExperimentPage({ params }: ExperimentPageProps) {
  const experiment = experiments.find((exp) => exp.slug === params.slug)

  if (!experiment) {
    notFound()
  }

  return (
    <main className="min-h-screen">
      <LabHeader />
      <ExperimentViewer experiment={experiment} />
    </main>
  )
}