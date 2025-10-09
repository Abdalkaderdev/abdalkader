// Brand voice and messaging framework

export const BRAND_PERSONALITY = {
  EXPERT_BUT_APPROACHABLE: {
    tone: 'confident yet humble',
    language: 'technical but accessible',
    examples: [
      'I specialize in TensorFlow.js, but I explain it in plain English',
      'My AI solutions work in production, not just demos',
      'I bridge the gap between complex algorithms and business results'
    ]
  },
  INNOVATIVE_BUT_PRACTICAL: {
    tone: 'forward-thinking yet grounded',
    language: 'cutting-edge with real-world focus',
    examples: [
      'Latest AI research meets practical business needs',
      'Innovation that actually works in production',
      'Advanced algorithms solving real problems'
    ]
  },
  JORDANIAN_PRIDE: {
    tone: 'proud and regional',
    language: 'showcasing Middle East talent',
    examples: [
      'From Amman to AI - Building the future from Jordan',
      'Proud to represent Jordan\'s growing tech ecosystem',
      'Bringing Middle Eastern innovation to global AI'
    ]
  }
};

export const MESSAGING_PILLARS = {
  PILLAR_1: {
    headline: 'From Amman to AI - Building the future from Jordan',
    description: 'Showcasing how Jordan\'s tech talent is making global impact in artificial intelligence',
    supportingPoints: [
      'Based in Amman, serving clients worldwide',
      'Part of Jordan\'s growing AI ecosystem',
      'Contributing to Middle East tech innovation',
      'Global reach with local expertise'
    ],
    cta: 'See how Jordan is leading AI innovation'
  },
  PILLAR_2: {
    headline: 'Full-stack developer who speaks AI fluently',
    description: 'Combining traditional software development with cutting-edge AI expertise',
    supportingPoints: [
      'Full-stack development + AI specialization',
      'Production-ready AI implementations',
      'End-to-end solution delivery',
      'Technical depth with business understanding'
    ],
    cta: 'Explore my technical expertise'
  },
  PILLAR_3: {
    headline: 'Production-ready AI solutions, not just experiments',
    description: 'Delivering AI that works in real business environments, not just demos',
    supportingPoints: [
      'Scalable AI architectures',
      'Production deployment experience',
      'Performance optimization',
      'Business impact measurement'
    ],
    cta: 'See production AI in action'
  },
  PILLAR_4: {
    headline: 'Bridging business needs with technical innovation',
    description: 'Translating complex AI concepts into business value and practical solutions',
    supportingPoints: [
      'Business-first AI approach',
      'Clear ROI and impact metrics',
      'Stakeholder communication',
      'Technical translation for non-technical teams'
    ],
    cta: 'Learn about AI business value'
  }
};

export const CALLS_TO_ACTION = {
  PRIMARY: {
    text: 'Let\'s build your AI solution',
    description: 'Start a conversation about your AI project needs',
    context: 'Main CTA for lead generation',
    variations: [
      'Let\'s build your AI solution',
      'Start your AI project',
      'Build AI that works',
      'Create your AI solution'
    ]
  },
  SECONDARY: {
    text: 'View my professional work',
    description: 'Explore portfolio and case studies',
    context: 'Portfolio and credibility building',
    variations: [
      'View my professional work',
      'See my AI projects',
      'Explore my portfolio',
      'Check out my work'
    ]
  },
  TERTIARY: {
    text: 'Explore my AI research',
    description: 'Dive into technical experiments and research',
    context: 'Technical credibility and learning',
    variations: [
      'Explore my AI research',
      'See my experiments',
      'Dive into AI demos',
      'Try interactive AI'
    ]
  }
};

export const CONTENT_TYPES = {
  PROJECT_CASE_STUDIES: {
    title: 'Project Case Studies with Business Impact',
    description: 'Real-world AI implementations with measurable results',
    examples: [
      'E-commerce AI: 40% conversion increase',
      'Manufacturing AI: 60% quality improvement',
      'Healthcare AI: 30% diagnosis accuracy boost'
    ],
    structure: [
      'Challenge',
      'Solution',
      'Implementation',
      'Results',
      'Technical Details',
      'Business Impact'
    ]
  },
  TECHNICAL_DEEP_DIVES: {
    title: 'Technical Deep-Dive Articles',
    description: 'In-depth technical content for developers and technical stakeholders',
    examples: [
      'TensorFlow.js Performance Optimization',
      'Computer Vision in Production',
      'ML Model Deployment Strategies'
    ],
    structure: [
      'Problem Statement',
      'Technical Approach',
      'Code Examples',
      'Performance Metrics',
      'Best Practices',
      'Lessons Learned'
    ]
  },
  AI_EXPLANATIONS: {
    title: 'AI Model Explanations for Non-Technical Visitors',
    description: 'Making complex AI concepts accessible to business stakeholders',
    examples: [
      'What is Machine Learning? (Business Guide)',
      'Computer Vision Explained Simply',
      'AI ROI: How to Measure Success'
    ],
    structure: [
      'Simple Definition',
      'Real-World Analogy',
      'Business Applications',
      'Benefits and Limitations',
      'Getting Started',
      'Next Steps'
    ]
  },
  JORDAN_TECH_INSIGHTS: {
    title: 'Jordan Tech Ecosystem Insights',
    description: 'Content about Jordan\'s growing tech scene and AI opportunities',
    examples: [
      'Jordan\'s AI Startup Scene',
      'Tech Talent in Amman',
      'Middle East AI Opportunities',
      'Vision 2030 and AI'
    ],
    structure: [
      'Current State',
      'Growth Opportunities',
      'Key Players',
      'Challenges',
      'Future Outlook',
      'How to Get Involved'
    ]
  }
};

export const BRAND_VOICE_GUIDELINES = {
  TONE: {
    CONFIDENT: 'Use strong, assured language without being arrogant',
    APPROACHABLE: 'Explain complex concepts in accessible terms',
    PRIDE: 'Showcase Jordanian and Middle Eastern achievements',
    PRACTICAL: 'Focus on real-world applications and business value'
  },
  LANGUAGE: {
    TECHNICAL_TERMS: 'Define technical terms when first used',
    BUSINESS_FOCUS: 'Always connect technical concepts to business value',
    REGIONAL_RELEVANCE: 'Include Jordan/Middle East context where relevant',
    ACCESSIBILITY: 'Use analogies and examples to explain complex ideas'
  },
  MESSAGING: {
    CONSISTENCY: 'Maintain consistent voice across all content',
    AUTHENTICITY: 'Be genuine about expertise and limitations',
    VALUE_PROPOSITION: 'Always lead with value to the reader',
    CALL_TO_ACTION: 'Include clear next steps in every piece of content'
  }
};

// Content generation helpers
export class BrandVoiceGenerator {
  static generateHeroMessage(pillar: keyof typeof MESSAGING_PILLARS): string {
    const pillarData = MESSAGING_PILLARS[pillar];
    return `${pillarData.headline} - ${pillarData.description}`;
  }

  static generateCTAText(type: keyof typeof CALLS_TO_ACTION): string {
    return CALLS_TO_ACTION[type].text;
  }

  static generateContentOutline(type: keyof typeof CONTENT_TYPES): string[] {
    return CONTENT_TYPES[type].structure;
  }

  static generateJordanianPrideMessage(): string {
    const messages = [
      'Proud to represent Jordan\'s growing AI ecosystem',
      'From Amman to AI - Building the future from Jordan',
      'Showcasing Middle Eastern innovation in artificial intelligence',
      'Jordan\'s tech talent making global AI impact',
      'Bridging Middle East innovation with global AI solutions'
    ];
    return messages[Math.floor(Math.random() * messages.length)];
  }

  static generateTechnicalExplanation(concept: string, businessValue: string): string {
    return `Let me explain ${concept} in simple terms: it's like ${businessValue}. In technical terms, it involves advanced algorithms that analyze data patterns to make predictions, but what matters to your business is that it can ${businessValue}.`;
  }

  static generateProjectImpact(metric: string, improvement: string, businessValue: string): string {
    return `Our AI solution delivered ${metric}, representing a ${improvement} improvement. This translates to ${businessValue} for your business, making it a clear win for your bottom line.`;
  }
}

// Regional messaging variations
export const REGIONAL_MESSAGING = {
  JORDAN: {
    pride: 'Proud to represent Jordan\'s growing AI ecosystem',
    location: 'Based in Amman, serving clients worldwide',
    expertise: 'Jordan\'s leading AI developer and consultant',
    vision: 'Building the future of AI from the heart of the Middle East'
  },
  MIDDLE_EAST: {
    pride: 'Showcasing Middle Eastern innovation in AI',
    location: 'Serving the MENA region with global expertise',
    expertise: 'MENA\'s premier AI solutions provider',
    vision: 'Bridging Middle East innovation with global AI solutions'
  },
  GLOBAL: {
    pride: 'Global AI expertise with Middle Eastern perspective',
    location: 'Worldwide reach with regional understanding',
    expertise: 'International AI consultant with local insights',
    vision: 'Bringing diverse perspectives to global AI challenges'
  }
};