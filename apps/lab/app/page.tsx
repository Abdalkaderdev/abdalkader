import LabHeader from '@/components/LabHeader'
import LabHero from '@/components/LabHero'
import ExperimentsGrid from '@/components/ExperimentsGrid'
import LabFooter from '@/components/LabFooter'

export default function HomePage() {
  return (
    <main className="min-h-screen">
      <LabHeader />
      <LabHero />
      <ExperimentsGrid />
      <LabFooter />
    </main>
  )
}