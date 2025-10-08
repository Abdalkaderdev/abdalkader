import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import '../styles/globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'AI & Interactive Experiments Lab | Abdalkader.dev',
  description: 'Explore cutting-edge AI experiments, machine learning demos, and interactive TensorFlow.js applications. From real-time object detection to neural network visualizations.',
  keywords: ['AI experiments', 'machine learning', 'TensorFlow.js', 'computer vision', 'neural networks', 'interactive demos'],
  authors: [{ name: 'Abdalkader Alhamoud' }],
  creator: 'Abdalkader Alhamoud',
  openGraph: {
    title: 'AI & Interactive Experiments Lab | Abdalkader.dev',
    description: 'Explore cutting-edge AI experiments, machine learning demos, and interactive TensorFlow.js applications.',
    url: 'https://lab.abdalkader.dev',
    siteName: 'Abdalkader AI Lab',
    type: 'website',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AI & Interactive Experiments Lab | Abdalkader.dev',
    description: 'Explore cutting-edge AI experiments, machine learning demos, and interactive TensorFlow.js applications.',
    creator: '@abdalkaderdev',
  },
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: 'https://lab.abdalkader.dev',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="dark">
      <body className={inter.className}>
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
          {children}
        </div>
      </body>
    </html>
  )
}