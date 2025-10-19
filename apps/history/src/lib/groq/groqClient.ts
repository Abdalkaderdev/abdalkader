import Groq from "groq-sdk";

// Create a mock client if no API key is provided
const createGroqClient = () => {
  const apiKey = process.env.NEXT_PUBLIC_GROQ_API_KEY;
  
  if (!apiKey) {
    console.warn('GROQ_API_KEY not found. AI features will be disabled.');
    return {
      chat: {
        completions: {
          create: async () => {
            throw new Error('GROQ API key not configured. Please add NEXT_PUBLIC_GROQ_API_KEY to your environment variables.');
          }
        }
      }
    };
  }
  
  return new Groq({
    apiKey: apiKey,
  });
};

export const groqClient = createGroqClient();

export const groqConfig = {
  model: "llama3-8b-8192",
  fallbackModel: "mixtral-8x7b-32768",
  temperature: 0.7,
  maxTokens: 1024,
  timeout: 30000,
};
