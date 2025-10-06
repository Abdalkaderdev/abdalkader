import localFont from 'next/font/local';

export const ppRegular = localFont({
  src: [
    { path: '../public/fonts/PPNeueMontreal-Regular.woff2', weight: '400', style: 'normal' },
  ],
  variable: '--font-pp-regular',
  display: 'swap',
  preload: true,
});

export const ppMedium = localFont({
  src: [
    { path: '../public/fonts/PPNeueMontreal-Medium.woff2', weight: '500', style: 'normal' },
  ],
  variable: '--font-pp-medium',
  display: 'swap',
  preload: true,
});

