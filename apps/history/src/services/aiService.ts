import { secureAIClient } from "@/lib/groq/groqClient";

export interface AIResponse {
  content: string;
  model: string;
  usage?: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}

/**
 * Helper function to make AI requests through the secure client
 */
async function makeAIRequest(
  systemPrompt: string,
  userMessage: string
): Promise<AIResponse> {
  const context = systemPrompt;
  const response = await secureAIClient.chat({
    message: userMessage,
    context,
  });

  if (!response.success || !response.response) {
    throw new Error(response.message || "Failed to generate response");
  }

  return {
    content: response.response,
    model: response.model || "llama3-8b-8192",
    usage: response.usage,
  };
}

export async function explainLanguageHistory(
  language: string,
  year: number
): Promise<AIResponse> {
  const systemPrompt =
    "You are a programming language historian. Explain languages in their historical context with accuracy and educational value.";
  const userMessage = `Explain the historical context of ${language} created in ${year}. Focus on: problems solved, key innovations, influence on later languages, and cultural impact.`;

  return makeAIRequest(systemPrompt, userMessage);
}

export async function explainCode(
  language: string,
  code: string,
  era?: string
): Promise<AIResponse> {
  const systemPrompt =
    "You are a programming language expert. Explain code in its historical context with clarity and educational value.";
  const userMessage = `Explain this ${language} code from ${era || "its era"}:\n\`\`\`${language}\n${code}\n\`\`\`\n\nFocus on: syntax features, programming paradigm, historical significance, and how it compares to modern approaches.`;

  return makeAIRequest(systemPrompt, userMessage);
}

export async function compareLanguages(
  language1: string,
  language2: string
): Promise<AIResponse> {
  const systemPrompt =
    "You are a programming language expert. Compare languages objectively with historical context and practical insights.";
  const userMessage = `Compare ${language1} and ${language2} in terms of: syntax philosophy, performance characteristics, typical use cases, historical context, and why developers might choose one over the other.`;

  return makeAIRequest(systemPrompt, userMessage);
}

export async function explainParadigm(
  paradigm: string,
  language?: string
): Promise<AIResponse> {
  const systemPrompt =
    "You are a programming paradigm expert. Explain concepts with historical context and practical examples.";
  const userMessage = `Explain ${paradigm} programming${language ? ` using ${language} as an example` : ""}. Show how it evolved, key languages that implemented it, and its impact on modern development.`;

  return makeAIRequest(systemPrompt, userMessage);
}

export async function askProgrammingHistoryQuestion(
  question: string
): Promise<AIResponse> {
  const systemPrompt =
    "You are a programming history expert. Answer questions about programming languages, their evolution, and historical context with accuracy and educational value.";

  return makeAIRequest(systemPrompt, question);
}
