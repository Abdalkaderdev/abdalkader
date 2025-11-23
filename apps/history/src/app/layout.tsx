import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import '@/styles/design-system.css'
import { ThemeProvider } from '@/contexts/ThemeContext'
import { GlobalNavigation } from '@/components/GlobalNavigation/GlobalNavigation'
import { GlobalFooter } from '@/components/GlobalFooter/GlobalFooter'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Programming Language History Museum',
  description: 'Explore the evolution of programming languages from 1843 to present with AI-powered insights',
  keywords: 'programming languages, history, AI, Groq, computer science, education',
  authors: [{ name: 'Abdalkader Dev' }],
  openGraph: {
    title: 'Programming Language History Museum',
    description: 'Interactive museum showcasing programming language evolution with AI explanations',
    type: 'website',
    url: 'https://history.abdalkader.dev',
    images: [
      {
        url: 'https://history.abdalkader.dev/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Programming Language History Museum',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Programming Language History Museum',
    description: 'Interactive museum showcasing programming language evolution with AI explanations',
    images: ['https://history.abdalkader.dev/og-image.png'],
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <meta name="theme-color" content="#f44e00" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link rel="canonical" href="https://history.abdalkader.dev" />
      </head>
      <body className={`${inter.className} antialiased`}>
        <ThemeProvider defaultTheme="dark">
          <GlobalNavigation />
          {children}
          <GlobalFooter />
        </ThemeProvider>
      </body>
    </html>
  )
}
