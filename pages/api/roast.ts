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

  const modeInstruction = mode === 'roast' 
    ? 'Roast this with sarcastic, playful humor like stand-up comedy. Be funny, never cruel. Use 🔥 occasionally:'
    : 'Hype this up with over-the-top positivity like they are a superstar. Be warm and exciting. Use ✨💖 occasionally:';

  const systemPrompt = 'You are the Roast/Toast Bot on Abdalkader portfolio site. Keep responses 2-4 sentences max. Be funny, witty, creative. Never offensive, hateful, political, or NSFW.';

  try {
    const completion = await groq.chat.completions.create({
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: `${modeInstruction} ${input}` }
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