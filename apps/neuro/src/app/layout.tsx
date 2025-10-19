import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Neuro Interface Platform | Abdalkader',
  description: 'Brain-Computer Interface web platform with real-time bio-signal processing and neuro-feedback.',
  keywords: ['BCI', 'brain-computer interface', 'neuro-feedback', 'EEG', 'bio-signals'],
  authors: [{ name: 'Abdalkader' }],
  openGraph: {
    title: 'Neuro Interface Platform',
    description: 'Brain-Computer Interface web platform with real-time bio-signal processing.',
    type: 'website',
    locale: 'en_US',
  },
  robots: {
    index: false,
    follow: false,
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {children}
      </body>
    </html>
  )
}