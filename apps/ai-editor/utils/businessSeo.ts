// Business-focused SEO configuration for lead generation and authority building

export const BUSINESS_KEYWORDS = {
  primary: [
    'AI consultant Jordan',
    'Machine learning expert Amman',
    'AI solutions Middle East',
    'ML consultant MENA',
    'Artificial intelligence Jordan',
    'AI development Amman',
    'Machine learning services Jordan',
    'AI integration Middle East',
    'Custom AI solutions Jordan',
    'AI consultant Saudi Arabia',
    'ML expert UAE',
    'AI services Dubai',
    'Machine learning Qatar',
    'AI development MENA'
  ],
  secondary: [
    'e-commerce AI',
    'predictive analytics',
    'computer vision',
    'natural language processing',
    'AI automation',
    'machine learning models',
    'AI strategy consulting',
    'data science services',
    'AI implementation',
    'intelligent automation',
    'AI optimization',
    'machine learning consulting',
    'AI transformation',
    'smart business solutions'
  ],
  longTail: [
    'AI consultant for startups Jordan',
    'machine learning expert for e-commerce',
    'AI solutions for enterprise Jordan',
    'custom AI development Amman',
    'AI integration services Middle East',
    'machine learning consultant for fintech',
    'AI automation for manufacturing',
    'predictive analytics for retail',
    'computer vision for quality control',
    'AI strategy for digital transformation'
  ]
};

export const BUSINESS_META = {
  title: 'AI Consultant Jordan | Machine Learning Expert | Abdalkader Alhamoud',
  description: 'Leading AI consultant in Jordan specializing in machine learning, computer vision, and AI integration. Serving startups and enterprises across MENA region. Free consultation available.',
  keywords: BUSINESS_KEYWORDS.primary.join(', '),
  author: 'Abdalkader Alhamoud',
  siteName: 'AI Lab - Abdalkader Alhamoud',
  twitterHandle: '@abdalkaderdev',
  ogImage: '/images/og-ai-lab-business.jpg',
  favicon: '/favicon.ico'
};

export const REGIONAL_SEO = {
  jordan: {
    title: 'AI Consultant Amman Jordan | Machine Learning Expert | Abdalkader Alhamoud',
    description: 'Top AI consultant in Amman, Jordan. Specialized in machine learning, computer vision, and AI integration for Jordanian businesses. Serving startups and enterprises.',
    keywords: 'AI consultant Amman, machine learning Jordan, AI services Amman, ML expert Jordan, artificial intelligence Amman'
  },
  saudi: {
    title: 'AI Consultant Saudi Arabia | Machine Learning Expert | Vision 2030 AI Solutions',
    description: 'AI consultant serving Saudi Arabia. Supporting Vision 2030 with machine learning, computer vision, and AI integration solutions for Saudi businesses.',
    keywords: 'AI consultant Saudi Arabia, machine learning Riyadh, AI services Jeddah, ML expert Saudi, Vision 2030 AI'
  },
  uae: {
    title: 'AI Consultant UAE | Machine Learning Expert Dubai | AI Solutions UAE',
    description: 'Leading AI consultant in UAE. Specialized in machine learning, computer vision, and AI integration for Dubai and UAE businesses.',
    keywords: 'AI consultant Dubai, machine learning UAE, AI services Abu Dhabi, ML expert UAE, artificial intelligence Dubai'
  },
  mena: {
    title: 'AI Consultant MENA | Machine Learning Expert Middle East | AI Solutions MENA',
    description: 'Premier AI consultant serving the Middle East and North Africa. Specialized in machine learning, computer vision, and AI integration across MENA region.',
    keywords: 'AI consultant MENA, machine learning Middle East, AI services MENA, ML expert Middle East, artificial intelligence MENA'
  }
};

export const INDUSTRY_SEO = {
  ecommerce: {
    title: 'E-commerce AI Consultant | Machine Learning for Online Retail | Abdalkader Alhamoud',
    description: 'E-commerce AI specialist. Increase conversion rates with personalized recommendations, intelligent search, and AI-powered customer insights.',
    keywords: 'e-commerce AI, online retail machine learning, AI recommendations, e-commerce automation, retail AI solutions'
  },
  fintech: {
    title: 'FinTech AI Consultant | Machine Learning for Financial Services | Abdalkader Alhamoud',
    description: 'FinTech AI expert. Implement fraud detection, risk assessment, and automated trading systems with cutting-edge machine learning.',
    keywords: 'fintech AI, financial machine learning, fraud detection AI, risk assessment ML, automated trading systems'
  },
  manufacturing: {
    title: 'Manufacturing AI Consultant | Industrial Machine Learning | Quality Control AI',
    description: 'Manufacturing AI specialist. Optimize production with computer vision, predictive maintenance, and intelligent quality control systems.',
    keywords: 'manufacturing AI, industrial machine learning, quality control AI, predictive maintenance, production optimization'
  },
  healthcare: {
    title: 'Healthcare AI Consultant | Medical Machine Learning | Healthcare AI Solutions',
    description: 'Healthcare AI expert. Implement medical imaging analysis, diagnostic AI, and healthcare automation solutions.',
    keywords: 'healthcare AI, medical machine learning, diagnostic AI, medical imaging, healthcare automation'
  }
};

export function generateBusinessTitle(page: string, region?: string, industry?: string): string {
  const baseTitle = 'AI Consultant | Machine Learning Expert | Abdalkader Alhamoud';
  
  if (region && REGIONAL_SEO[region as keyof typeof REGIONAL_SEO]) {
    return REGIONAL_SEO[region as keyof typeof REGIONAL_SEO].title;
  }
  
  if (industry && INDUSTRY_SEO[industry as keyof typeof INDUSTRY_SEO]) {
    return INDUSTRY_SEO[industry as keyof typeof INDUSTRY_SEO].title;
  }
  
  switch (page) {
    case 'business':
      return BUSINESS_META.title;
    case 'experiments':
      return 'AI Experiments Lab | Interactive Machine Learning Demos | Abdalkader Alhamoud';
    case 'playground':
      return 'AI Playground | Live Machine Learning Experiments | Abdalkader Alhamoud';
    default:
      return baseTitle;
  }
}

export function generateBusinessDescription(page: string, region?: string, industry?: string): string {
  if (region && REGIONAL_SEO[region as keyof typeof REGIONAL_SEO]) {
    return REGIONAL_SEO[region as keyof typeof REGIONAL_SEO].description;
  }
  
  if (industry && INDUSTRY_SEO[industry as keyof typeof INDUSTRY_SEO]) {
    return INDUSTRY_SEO[industry as keyof typeof INDUSTRY_SEO].description;
  }
  
  switch (page) {
    case 'business':
      return BUSINESS_META.description;
    case 'experiments':
      return 'Explore interactive AI experiments and machine learning demos. Hands-on learning with real-time visualizations and live coding environments.';
    case 'playground':
      return 'Interactive AI playground with live machine learning experiments. Test TensorFlow.js models, computer vision, and neural networks in real-time.';
    default:
      return BUSINESS_META.description;
  }
}

export function generateBusinessKeywords(page: string, region?: string, industry?: string): string[] {
  let keywords = [...BUSINESS_KEYWORDS.primary];
  
  if (region && REGIONAL_SEO[region as keyof typeof REGIONAL_SEO]) {
    keywords = keywords.concat(REGIONAL_SEO[region as keyof typeof REGIONAL_SEO].keywords.split(', '));
  }
  
  if (industry && INDUSTRY_SEO[industry as keyof typeof INDUSTRY_SEO]) {
    keywords = keywords.concat(INDUSTRY_SEO[industry as keyof typeof INDUSTRY_SEO].keywords.split(', '));
  }
  
  keywords = keywords.concat(BUSINESS_KEYWORDS.secondary);
  
  // Remove duplicates and return
  return [...new Set(keywords)];
}