export interface FaqItem {
  question: string;
  answer: string;
}

/**
 * Single source of truth for the FAQ.
 *
 * Consumed by BOTH `faqPageJsonLd()` in utils/jsonld.ts and the visible
 * `FAQSection` component. Keeping one copy is not cosmetic: Google's FAQPage
 * guidelines require the declared questions and answers to be visible on the
 * page that declares them, so two copies drifting apart is a structured-data
 * violation rather than a tidiness problem.
 *
 * If you edit an answer here, the rendered page and the schema both change.
 * There is a test asserting they stay identical.
 */
export const faqItems: FaqItem[] = [
  {
    question: 'What services do you offer?',
    answer:
      'AI and LLM engineering alongside full-stack web and mobile development: LLM integration and AI agents, RAG systems, workflow automation, full-stack builds in React, Next.js, Node.js and Python, React Native apps, and API design and integration. I also take on ERP work in Odoo and IT and infrastructure consulting.',
  },
  {
    question: 'What technologies do you work in?',
    answer:
      'Day to day: TypeScript and Python, React and Next.js, Node.js, Express, FastAPI and Django, React Native, PostgreSQL and MongoDB, Docker, and the Claude and OpenAI APIs with LangChain. On the frontend I use GSAP and Framer Motion heavily. I also work in Svelte and Go, and hold an AWS Skill Builder certification in AI/ML and generative AI.',
  },
  {
    question: 'Do you work remotely with international clients?',
    answer:
      'Yes. Most of my current work is remote, across several time zones — nonprofit platforms in the US, product work in Europe, and clients here in Erbil. Remote delivery is the default rather than the exception.',
  },
  {
    question: 'What is your typical project timeline?',
    answer:
      'It depends entirely on scope. A focused site or landing build is usually two to four weeks; a full application is one to three months; platform work with multiple surfaces runs longer and is better handled as an ongoing engagement than a fixed deadline. I give a real estimate after understanding the scope, not before.',
  },
  {
    question: 'How can I get started with a project?',
    answer:
      'Use the contact form on this site and tell me what you are trying to build and what is currently blocking it. I will come back with an honest read on whether I am the right person for it, a rough timeline, and what I would need from you to start.',
  },
];
