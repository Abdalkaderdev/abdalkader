import { NextApiRequest, NextApiResponse } from 'next';
import Groq from 'groq-sdk';

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { input, mode } = req.body;

  if (!input || !mode) {
    return res.status(400).json({ error: 'Input and mode are required' });
  }

  const systemPrompt = mode === 'roast' 
    ? "You are the Roast Bot on Abdalkader's portfolio site. Roast anything the user types with sarcastic, playful, over-the-top humor like stand-up comedy. Be funny, never cruel or offensive. Use 🔥 emoji occasionally. Keep it 2-4 sentences max."
    : "You are the Toast Bot on Abdalkader's portfolio site. Hype up whatever the user types with over-the-top positivity like they're a superstar. Use warm, uplifting, exciting language. Use ✨💖 emojis occasionally. Keep it 2-4 sentences max.";

  try {
    const completion = await groq.chat.completions.create({
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: input }
      ],
      model: 'llama-3.1-70b-versatile',
      temperature: 0.8,
      max_tokens: 150,
    });

    const output = completion.choices[0]?.message?.content || 'No response generated';
    
    res.status(200).json({ output });
  } catch (error) {
    console.error('Groq API error:', error);
    res.status(500).json({ error: 'Failed to generate response' });
  }
}