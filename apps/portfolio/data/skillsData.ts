export interface Skill {
  name: string;
  level: 'Expert' | 'Advanced' | 'Intermediate';
  yearsOfExperience?: number;
  projectsCount?: number;
}

export interface SkillCategory {
  title: string;
  icon: string;
  skills: Skill[];
}

export const skillsCategories: SkillCategory[] = [
  {
    title: "AI & Machine Learning",
    icon: "🤖",
    skills: [
      { name: "OpenAI API", level: "Expert", yearsOfExperience: 3, projectsCount: 12 },
      { name: "Gemini / Vertex AI", level: "Advanced", yearsOfExperience: 2, projectsCount: 8 },
      { name: "Amazon Bedrock", level: "Advanced", yearsOfExperience: 2, projectsCount: 6 },
      { name: "LangChain", level: "Expert", yearsOfExperience: 3, projectsCount: 15 },
      { name: "Vector Databases", level: "Advanced", yearsOfExperience: 2, projectsCount: 7 },
      { name: "LLMOps", level: "Advanced", yearsOfExperience: 2, projectsCount: 5 },
      { name: "Responsible AI Principles", level: "Intermediate", yearsOfExperience: 1, projectsCount: 3 },
      { name: "AWS Generative AI Tools", level: "Advanced", yearsOfExperience: 2, projectsCount: 9 },
      { name: "Machine Learning Foundations", level: "Expert", yearsOfExperience: 4, projectsCount: 18 },
      { name: "Python for AI/ML", level: "Expert", yearsOfExperience: 4, projectsCount: 20 },
      { name: "TensorFlow/PyTorch", level: "Advanced", yearsOfExperience: 2, projectsCount: 6 },
      { name: "Prompt Engineering", level: "Expert", yearsOfExperience: 3, projectsCount: 25 }
    ]
  },
  {
    title: "Frontend Development",
    icon: "🎨",
    skills: [
      { name: "HTML, CSS, SCSS", level: "Expert", yearsOfExperience: 5, projectsCount: 50 },
      { name: "Tailwind CSS", level: "Expert", yearsOfExperience: 3, projectsCount: 30 },
      { name: "JavaScript", level: "Expert", yearsOfExperience: 5, projectsCount: 45 },
      { name: "React", level: "Expert", yearsOfExperience: 4, projectsCount: 35 },
      { name: "Next.js", level: "Expert", yearsOfExperience: 4, projectsCount: 28 },
      { name: "Three.js", level: "Advanced", yearsOfExperience: 2, projectsCount: 8 },
      { name: "Framer Motion", level: "Advanced", yearsOfExperience: 2, projectsCount: 12 },
      { name: "GSAP", level: "Expert", yearsOfExperience: 3, projectsCount: 20 },
      { name: "TypeScript", level: "Expert", yearsOfExperience: 3, projectsCount: 25 },
      { name: "Vue.js", level: "Intermediate", yearsOfExperience: 1, projectsCount: 4 }
    ]
  },
  {
    title: "Backend Development",
    icon: "⚙️",
    skills: [
      { name: "Python", level: "Expert", yearsOfExperience: 4, projectsCount: 30 },
      { name: "Node.js", level: "Expert", yearsOfExperience: 4, projectsCount: 25 },
      { name: "Express.js", level: "Expert", yearsOfExperience: 4, projectsCount: 22 },
      { name: "MongoDB", level: "Advanced", yearsOfExperience: 3, projectsCount: 18 },
      { name: "SQL / MySQL", level: "Advanced", yearsOfExperience: 3, projectsCount: 15 },
      { name: "REST APIs & GraphQL", level: "Expert", yearsOfExperience: 4, projectsCount: 28 },
      { name: "JWT / OAuth Authentication", level: "Advanced", yearsOfExperience: 3, projectsCount: 12 },
      { name: "PostgreSQL", level: "Advanced", yearsOfExperience: 2, projectsCount: 8 },
      { name: "Redis", level: "Intermediate", yearsOfExperience: 1, projectsCount: 5 },
      { name: "Docker", level: "Advanced", yearsOfExperience: 2, projectsCount: 10 }
    ]
  },
  {
    title: "Tools & Platforms",
    icon: "🛠️",
    skills: [
      { name: "Git & GitHub", level: "Expert", yearsOfExperience: 5, projectsCount: 100 },
      { name: "Vercel / Netlify", level: "Expert", yearsOfExperience: 4, projectsCount: 40 },
      { name: "AWS", level: "Advanced", yearsOfExperience: 3, projectsCount: 15 },
      { name: "CI/CD Pipelines", level: "Advanced", yearsOfExperience: 2, projectsCount: 12 },
      { name: "WordPress", level: "Expert", yearsOfExperience: 5, projectsCount: 35 },
      { name: "Shopify", level: "Advanced", yearsOfExperience: 3, projectsCount: 18 },
      { name: "Figma", level: "Advanced", yearsOfExperience: 2, projectsCount: 20 },
      { name: "Linux / Bash", level: "Advanced", yearsOfExperience: 3, projectsCount: 25 },
      { name: "cPanel / WHM", level: "Advanced", yearsOfExperience: 2, projectsCount: 8 }
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
