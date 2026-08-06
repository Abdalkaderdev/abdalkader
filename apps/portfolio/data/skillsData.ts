export interface Skill {
  name: string;
  level: 'Expert' | 'Advanced' | 'Intermediate';
  yearsOfExperience?: number;
  /**
   * 'shipped'  — used in delivered work (a repo or a live site backs this claim).
   *              yearsOfExperience is capped at 3, since professional software
   *              work began Nov 2023.
   * 'studied'  — learned deliberately but not yet shipped in production.
   */
  evidence: 'shipped' | 'studied';
  /** Optional pointer to the evidence behind a 'studied' claim (e.g. a certification). */
  note?: string;
}

export interface SkillCategory {
  title: string;
  icon: string;
  skills: Skill[];
}

const AWS_CERT_NOTE = 'AWS Skill Builder — AI/ML & Generative AI Track (2024–2025)';

export const skillsCategories: SkillCategory[] = [
  {
    title: "AI & Machine Learning",
    icon: "🤖",
    skills: [
      { name: "OpenAI API", level: "Expert", yearsOfExperience: 3, evidence: "shipped" },
      { name: "Claude API", level: "Expert", yearsOfExperience: 2, evidence: "shipped" },
      { name: "Anthropic SDK", level: "Expert", yearsOfExperience: 2, evidence: "shipped" },
      { name: "Gemini / Vertex AI", level: "Advanced", yearsOfExperience: 2, evidence: "studied" },
      { name: "Amazon Bedrock", level: "Advanced", yearsOfExperience: 2, evidence: "studied" },
      { name: "LangChain", level: "Expert", yearsOfExperience: 3, evidence: "shipped" },
      { name: "RAG Systems", level: "Expert", yearsOfExperience: 2, evidence: "shipped" },
      { name: "Vector Databases", level: "Advanced", yearsOfExperience: 2, evidence: "shipped" },
      { name: "Embeddings", level: "Expert", yearsOfExperience: 2, evidence: "shipped" },
      { name: "Semantic Search", level: "Advanced", yearsOfExperience: 2, evidence: "shipped" },
      { name: "Fine-tuning LLMs", level: "Advanced", yearsOfExperience: 2, evidence: "shipped" },
      { name: "AI Agents", level: "Expert", yearsOfExperience: 2, evidence: "shipped" },
      { name: "LLMOps", level: "Advanced", yearsOfExperience: 2, evidence: "studied" },
      { name: "Model Deployment", level: "Advanced", yearsOfExperience: 2, evidence: "studied" },
      { name: "Hugging Face", level: "Advanced", yearsOfExperience: 2, evidence: "studied" },
      { name: "Ollama", level: "Advanced", yearsOfExperience: 1, evidence: "studied" },
      { name: "Computer Vision", level: "Intermediate", yearsOfExperience: 2, evidence: "studied" },
      { name: "NLP", level: "Advanced", yearsOfExperience: 3, evidence: "shipped" },
      { name: "Responsible AI Principles", level: "Intermediate", yearsOfExperience: 1, evidence: "studied" },
      { name: "AWS Generative AI Tools", level: "Advanced", yearsOfExperience: 2, evidence: "studied", note: AWS_CERT_NOTE },
      { name: "Machine Learning Foundations", level: "Expert", yearsOfExperience: 3, evidence: "shipped" },
      { name: "Python for AI/ML", level: "Expert", yearsOfExperience: 3, evidence: "shipped" },
      { name: "TensorFlow/PyTorch", level: "Advanced", yearsOfExperience: 2, evidence: "studied" },
      { name: "Prompt Engineering", level: "Expert", yearsOfExperience: 3, evidence: "shipped" }
    ]
  },
  {
    title: "Frontend Development",
    icon: "🎨",
    skills: [
      { name: "HTML, CSS, SCSS", level: "Expert", yearsOfExperience: 3, evidence: "shipped" },
      { name: "Tailwind CSS", level: "Expert", yearsOfExperience: 3, evidence: "shipped" },
      { name: "JavaScript", level: "Expert", yearsOfExperience: 3, evidence: "shipped" },
      { name: "TypeScript", level: "Expert", yearsOfExperience: 3, evidence: "shipped" },
      { name: "React", level: "Expert", yearsOfExperience: 3, evidence: "shipped" },
      { name: "Next.js", level: "Expert", yearsOfExperience: 3, evidence: "shipped" },
      { name: "Astro", level: "Advanced", yearsOfExperience: 1, evidence: "shipped" },
      { name: "Svelte", level: "Intermediate", yearsOfExperience: 1, evidence: "shipped" },
      { name: "Redux", level: "Expert", yearsOfExperience: 3, evidence: "studied" },
      { name: "Zustand", level: "Advanced", yearsOfExperience: 2, evidence: "studied" },
      { name: "Tanstack Query", level: "Advanced", yearsOfExperience: 2, evidence: "studied" },
      { name: "React Query", level: "Advanced", yearsOfExperience: 2, evidence: "studied" },
      { name: "Three.js", level: "Advanced", yearsOfExperience: 2, evidence: "shipped" },
      { name: "WebGL", level: "Intermediate", yearsOfExperience: 1, evidence: "studied" },
      { name: "Canvas API", level: "Advanced", yearsOfExperience: 2, evidence: "studied" },
      { name: "Framer Motion", level: "Advanced", yearsOfExperience: 2, evidence: "shipped" },
      { name: "GSAP", level: "Expert", yearsOfExperience: 3, evidence: "shipped" },
      { name: "Web Components", level: "Intermediate", yearsOfExperience: 1, evidence: "studied" },
      { name: "PWA Development", level: "Advanced", yearsOfExperience: 2, evidence: "studied" },
      { name: "Storybook", level: "Advanced", yearsOfExperience: 2, evidence: "shipped" },
      { name: "Testing Library", level: "Advanced", yearsOfExperience: 2, evidence: "shipped" },
      { name: "Cypress", level: "Advanced", yearsOfExperience: 2, evidence: "shipped" },
      { name: "Playwright", level: "Advanced", yearsOfExperience: 2, evidence: "shipped" }
    ]
  },
  {
    title: "Backend Development",
    icon: "⚙️",
    skills: [
      { name: "Python", level: "Expert", yearsOfExperience: 3, evidence: "shipped" },
      { name: "Node.js", level: "Expert", yearsOfExperience: 3, evidence: "shipped" },
      { name: "Express.js", level: "Expert", yearsOfExperience: 3, evidence: "shipped" },
      { name: "FastAPI", level: "Expert", yearsOfExperience: 3, evidence: "shipped" },
      { name: "Django", level: "Advanced", yearsOfExperience: 2, evidence: "shipped" },
      { name: "NestJS", level: "Advanced", yearsOfExperience: 2, evidence: "studied" },
      { name: "Go/Golang", level: "Intermediate", yearsOfExperience: 1, evidence: "shipped" },
      { name: "REST APIs & GraphQL", level: "Expert", yearsOfExperience: 3, evidence: "shipped" },
      { name: "WebSockets", level: "Advanced", yearsOfExperience: 2, evidence: "shipped" },
      { name: "PostgreSQL", level: "Advanced", yearsOfExperience: 2, evidence: "shipped" },
      { name: "MongoDB", level: "Advanced", yearsOfExperience: 3, evidence: "shipped" },
      { name: "SQL / MySQL", level: "Advanced", yearsOfExperience: 3, evidence: "shipped" },
      { name: "Redis", level: "Intermediate", yearsOfExperience: 1, evidence: "shipped" },
      { name: "Prisma ORM", level: "Expert", yearsOfExperience: 2, evidence: "shipped" },
      { name: "Drizzle ORM", level: "Advanced", yearsOfExperience: 1, evidence: "shipped" },
      { name: "Supabase", level: "Expert", yearsOfExperience: 2, evidence: "shipped" },
      { name: "Firebase", level: "Advanced", yearsOfExperience: 3, evidence: "shipped" },
      { name: "JWT / OAuth Authentication", level: "Advanced", yearsOfExperience: 3, evidence: "shipped" },
      { name: "Serverless", level: "Advanced", yearsOfExperience: 2, evidence: "shipped" },
      { name: "AWS Lambda", level: "Advanced", yearsOfExperience: 2, evidence: "studied", note: AWS_CERT_NOTE },
      { name: "Edge Functions", level: "Advanced", yearsOfExperience: 1, evidence: "shipped" },
      { name: "Message Queues", level: "Intermediate", yearsOfExperience: 1, evidence: "studied" },
      { name: "RabbitMQ", level: "Intermediate", yearsOfExperience: 1, evidence: "studied" },
      { name: "Kafka", level: "Intermediate", yearsOfExperience: 1, evidence: "studied" }
    ]
  },
  {
    title: "Tools & Platforms",
    icon: "🛠️",
    skills: [
      { name: "Git & GitHub", level: "Expert", yearsOfExperience: 3, evidence: "shipped" },
      // 4 WordPress sites and 2 Shopify stores delivered in freelance client work.
      // Levels reflect that volume, not the previously claimed Expert / 5 years.
      { name: "WordPress", level: "Intermediate", yearsOfExperience: 2, evidence: "shipped" },
      { name: "Shopify", level: "Intermediate", yearsOfExperience: 1, evidence: "shipped" },
      { name: "GitHub Actions", level: "Advanced", yearsOfExperience: 2, evidence: "studied" },
      { name: "CI/CD Pipelines", level: "Advanced", yearsOfExperience: 2, evidence: "studied" },
      { name: "Vercel / Netlify", level: "Expert", yearsOfExperience: 3, evidence: "shipped" },
      { name: "AWS", level: "Advanced", yearsOfExperience: 2, evidence: "studied", note: AWS_CERT_NOTE },
      { name: "Azure", level: "Intermediate", yearsOfExperience: 1, evidence: "studied" },
      { name: "Google Cloud", level: "Intermediate", yearsOfExperience: 1, evidence: "studied" },
      { name: "Cloudflare", level: "Advanced", yearsOfExperience: 2, evidence: "studied" },
      { name: "Kubernetes", level: "Intermediate", yearsOfExperience: 1, evidence: "studied" },
      { name: "Terraform", level: "Intermediate", yearsOfExperience: 1, evidence: "studied" },
      { name: "Docker", level: "Advanced", yearsOfExperience: 2, evidence: "shipped" },
      { name: "Nginx", level: "Advanced", yearsOfExperience: 2, evidence: "shipped" },
      { name: "Apache", level: "Intermediate", yearsOfExperience: 2, evidence: "studied" },
      { name: "Linux / Bash", level: "Advanced", yearsOfExperience: 3, evidence: "shipped" },
      { name: "Figma", level: "Advanced", yearsOfExperience: 2, evidence: "shipped" },
      { name: "Elasticsearch", level: "Intermediate", yearsOfExperience: 1, evidence: "studied" },
      { name: "Monitoring (Datadog/New Relic)", level: "Intermediate", yearsOfExperience: 1, evidence: "studied" },
      { name: "Postman", level: "Expert", yearsOfExperience: 3, evidence: "shipped" },
      { name: "Swagger/OpenAPI", level: "Advanced", yearsOfExperience: 2, evidence: "studied" },
      { name: "Testing Tools", level: "Advanced", yearsOfExperience: 3, evidence: "shipped" },
      { name: "cPanel / WHM", level: "Advanced", yearsOfExperience: 2, evidence: "studied" }
    ]
  }
];

// Helper function to get level color
export const getLevelColor = (level: string): string => {
  switch (level) {
    case 'Expert':
      return '#f44e00'; // Portfolio primary orange
    case 'Advanced':
      return '#fa7300'; // Portfolio secondary orange
    case 'Intermediate':
      return '#787878'; // Portfolio grey
    default:
      return '#787878';
  }
};

// Helper function to get level percentage
export const getLevelPercentage = (level: string): number => {
  switch (level) {
    case 'Expert':
      return 95;
    case 'Advanced':
      return 75;
    case 'Intermediate':
      return 50;
    default:
      return 50;
  }
};
