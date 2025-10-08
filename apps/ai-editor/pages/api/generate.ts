import type { NextApiRequest, NextApiResponse } from 'next';
import { generateComponent, improveComponent, type GenerateComponentRequest } from '../../services/aiService';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { action, ...requestData } = req.body;

    if (!process.env.OPENAI_API_KEY) {
      return res.status(500).json({ 
        error: 'OpenAI API key not configured. Please set OPENAI_API_KEY environment variable.' 
      });
    }

    let result;

    switch (action) {
      case 'generate':
        if (!requestData.prompt) {
          return res.status(400).json({ error: 'Prompt is required' });
        }
        result = await generateComponent(requestData as GenerateComponentRequest);
        break;

      case 'improve':
        if (!requestData.code || !requestData.improvements) {
          return res.status(400).json({ error: 'Code and improvements are required' });
        }
        result = await improveComponent(requestData.code, requestData.improvements);
        break;

      default:
        return res.status(400).json({ error: 'Invalid action. Use "generate" or "improve"' });
    }

    res.status(200).json(result);
  } catch (error) {
    console.error('API Error:', error);
    
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    
    // Handle specific OpenAI errors
    if (errorMessage.includes('API key')) {
      return res.status(401).json({ error: 'Invalid OpenAI API key' });
    }
    
    if (errorMessage.includes('quota')) {
      return res.status(429).json({ error: 'OpenAI API quota exceeded' });
    }
    
    if (errorMessage.includes('rate limit')) {
      return res.status(429).json({ error: 'Rate limit exceeded. Please try again later.' });
    }

    res.status(500).json({ 
      error: `AI generation failed: ${errorMessage}` 
    });
  }
}