import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import '../styles/globals.scss';
import RoastToastWidget from '../components/RoastToastWidget';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Abdalkader Alhamoud | Web Developer & AI Engineer',
  description: 'Portfolio of Abdalkader Alhamoud, a Web Developer and AI Engineer specializing in building modern, user-focused digital experiences.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {children}
        <RoastToastWidget />
      </body>
    </html>
  );
}