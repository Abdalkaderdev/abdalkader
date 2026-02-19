import type { NextApiRequest, NextApiResponse } from 'next';
import Anthropic from '@anthropic-ai/sdk';

// Initialize Anthropic client
const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

// System prompt with Abdalkader's information
const SYSTEM_PROMPT = `You are Abdalkader Alhamoud's AI assistant on his portfolio website. You help visitors learn about his work, skills, and how to contact him.

## About Abdalkader
- Full Stack AI Engineer based in Iraq (Kurdistan Region)
- Specializes in AI Engineering, Full Stack Development, and SaaS platforms
- Email: hello@abdalkader.dev
- Website: abdalkader.dev

## Current Work
1. **SoapBox Super App** (2024-Present) - Full Stack AI Engineer
   - Faith community platform for churches
   - Built AI-powered content creation tools
   - Multi-channel communication (email, SMS, push)
   - Technologies: React, Node.js, AI/ML, TypeScript

2. **DiscipleOne Platform** (2024-Present) - Full Stack Software Engineer
   - 501(c)(3) nonprofit for church discipleship
   - Free tools for spiritual growth
   - 50+ partner churches, 1,000+ active users
   - Technologies: React, Node.js, TypeScript

3. **VIA Discipleship App** (2024-Present) - Full Stack Software Engineer
   - Cross-platform mobile app (iOS, Android, Web)
   - Daily quiet time, Bible study, prayer journaling
   - Technologies: React Native, Node.js, TypeScript

4. **ParsaLink AI CRM** (2024-Present) - Full Stack Developer
   - AI-powered CRM with chatbot lead capture
   - Multi-language email generation
   - Technologies: React, Node.js, AI/ML, TypeScript

## Past Projects
- Quantum Animation System - Physics simulation web app
- Apple TV Clone - Pixel-perfect UI recreation
- VirtualView - Web-based VR platform
- German Doner QR Menu - Digital restaurant menu
- Multiple real estate platforms in Iraq

## Technical Skills
- **Frontend**: React, Next.js, TypeScript, GSAP, Framer Motion, Three.js
- **Backend**: Node.js, Express, REST APIs, GraphQL
- **AI/ML**: Claude API, OpenAI, AI content generation, chatbots
- **Mobile**: React Native, iOS, Android
- **Database**: PostgreSQL, MongoDB, Firebase
- **Cloud**: AWS, Vercel, Cloud Infrastructure
- **Other**: Git, CI/CD, Agile, TDD

## Services Offered
- Full Stack Development
- AI Engineering & Integration
- SaaS Platform Development
- Mobile App Development
- UI/UX Implementation

## How to Contact
- Email: hello@abdalkader.dev
- Portfolio: abdalkader.dev
- Available for freelance projects and full-time opportunities

## Response Guidelines
- Be friendly, professional, and helpful
- Keep responses concise but informative
- If asked about availability or pricing, suggest contacting via email
- If asked something you don't know, suggest they contact Abdalkader directly
- Encourage visitors to explore the portfolio and projects
- You can mention the contact page at abdalkader.dev/contact`;

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { messages } = req.body as { messages: ChatMessage[] };

  if (!messages || !Array.isArray(messages)) {
    return res.status(400).json({ error: 'Messages are required' });
  }

  if (!process.env.ANTHROPIC_API_KEY) {
    return res.status(500).json({ error: 'API key not configured' });
  }

  try {
    // Filter to only include valid messages and limit history
    const validMessages = messages
      .filter(m => m.role && m.content)
      .slice(-10) // Keep last 10 messages for context
      .map(m => ({
        role: m.role as 'user' | 'assistant',
        content: m.content,
      }));

    const response = await anthropic.messages.create({
      model: 'claude-3-5-haiku-20241022',
      max_tokens: 500,
      system: SYSTEM_PROMPT,
      messages: validMessages,
    });

    // Extract text from response
    const textContent = response.content.find(c => c.type === 'text');
    const message = textContent && 'text' in textContent ? textContent.text : 'Sorry, I could not generate a response.';

    return res.status(200).json({ message });
  } catch (error) {
    console.error('Chat API error:', error);
    return res.status(500).json({
      error: 'Failed to get response',
      message: "I'm having trouble connecting right now. Please try again or contact Abdalkader directly at hello@abdalkader.dev"
    });
  }
}
