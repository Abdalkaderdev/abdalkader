import Head from 'next/head';

type JsonLdProps = {
  data: Record<string, unknown> | Array<Record<string, unknown>>;
};

export default function JsonLd({ data }: JsonLdProps) {
  return (
    <Head>
      <script
        key="jsonld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
      />
    </Head>
  );
}

