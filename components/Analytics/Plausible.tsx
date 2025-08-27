import Script from 'next/script';

type Props = { domain: string };

export default function Plausible({ domain }: Props) {
  if (!domain) return null;
  return (
    <>
      <Script
        strategy="afterInteractive"
        data-domain={domain}
        src="https://plausible.io/js/script.js"
      />
    </>
  );
}

