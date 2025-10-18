import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { ThemeProvider } from '@/contexts/ThemeContext'

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
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} antialiased`}>
        <ThemeProvider defaultTheme="dark">
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}
