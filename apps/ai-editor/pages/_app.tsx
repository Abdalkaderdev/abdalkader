import type { AppProps } from 'next/app';
import { ppRegular, ppMedium } from '../libs/fonts';
import '../styles/globals.css';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <div className={`${ppRegular.variable} ${ppMedium.variable}`}>
      <Component {...pageProps} />
    </div>
  );
}