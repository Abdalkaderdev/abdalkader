import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'AI Mental Wellness Therapist | Abdalkader',
  description: 'Privacy-first AI therapy platform with empathetic conversations and evidence-based techniques.',
  keywords: ['AI therapy', 'mental health', 'privacy', 'wellness', 'therapy'],
  authors: [{ name: 'Abdalkader' }],
  openGraph: {
    title: 'AI Mental Wellness Therapist',
    description: 'Privacy-first AI therapy platform with empathetic conversations.',
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