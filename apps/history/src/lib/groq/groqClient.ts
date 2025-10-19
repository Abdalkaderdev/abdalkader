import Groq from "groq-sdk";

const groq = new Groq({
  apiKey: process.env.NEXT_PUBLIC_GROQ_API_KEY,
});

export const groqClient = groq;

export const groqConfig = {
  model: "llama3-8b-8192",
  fallbackModel: "mixtral-8x7b-32768",
  temperature: 0.7,
  maxTokens: 1024,
  timeout: 30000,
};
