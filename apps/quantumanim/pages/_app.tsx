import '../styles/globals.css';
import type { AppProps } from 'next/app';
import { QuantumProvider } from '../context/QuantumContext';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <QuantumProvider>
      <Component {...pageProps} />
    </QuantumProvider>
  );
}