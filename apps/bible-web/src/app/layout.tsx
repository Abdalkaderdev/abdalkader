import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './styles/globals.css';
import { ThemeProvider } from '@/components/ThemeProvider';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Bible App - Read, Search, and Study God\'s Word',
  description: 'A clean, searchable Bible reader with bookmarks, daily verses, and offline support.',
  keywords: ['Bible', 'Scripture', 'Christian', 'Religion', 'Study', 'Daily Verse'],
  authors: [{ name: 'Abdalkader' }],
  creator: 'Abdalkader',
  publisher: 'Abdalkader',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://bible.abdalkader.dev'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'Bible App - Read, Search, and Study God\'s Word',
    description: 'A clean, searchable Bible reader with bookmarks, daily verses, and offline support.',
    url: 'https://bible.abdalkader.dev',
    siteName: 'Bible App',
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Bible App - Read, Search, and Study God\'s Word',
    description: 'A clean, searchable Bible reader with bookmarks, daily verses, and offline support.',
    creator: '@abdalkaderdev',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  manifest: '/manifest.json',
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon-16x16.png',
    apple: '/apple-touch-icon.png',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider>
          <div className="min-h-screen bg-bible-bg text-bible-text">
            {children}
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
