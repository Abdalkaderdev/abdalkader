import { groqClient, groqConfig } from "@/lib/groq/groqClient";

export interface AIResponse {
  content: string;
  model: string;
  usage?: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}

export async function explainLanguageHistory(
  language: string,
  year: number
): Promise<AIResponse> {
  try {
    const response = await groqClient.chat.completions.create({
      messages: [
        {
          role: "system",
          content: "You are a programming language historian. Explain languages in their historical context with accuracy and educational value."
        },
        {
          role: "user",
          content: `Explain the historical context of ${language} created in ${year}. Focus on: problems solved, key innovations, influence on later languages, and cultural impact.`
        }
      ],
      model: groqConfig.model,
      temperature: groqConfig.temperature,
      max_tokens: groqConfig.maxTokens,
    });

    return {
      content: response.choices[0].message.content || "Unable to generate explanation",
      model: response.model,
      usage: response.usage,
    };
  } catch (error) {
    console.error("Error explaining language history:", error);
    throw new Error("Failed to generate historical explanation");
  }
}

export async function explainCode(
  language: string,
  code: string,
  era?: string
): Promise<AIResponse> {
  try {
    const response = await groqClient.chat.completions.create({
      messages: [
        {
          role: "system",
          content: "You are a programming language expert. Explain code in its historical context with clarity and educational value."
        },
        {
          role: "user",
          content: `Explain this ${language} code from ${era || 'its era'}:\n\`\`\`${language}\n${code}\n\`\`\n\nFocus on: syntax features, programming paradigm, historical significance, and how it compares to modern approaches.`
        }
      ],
      model: groqConfig.model,
      temperature: groqConfig.temperature,
      max_tokens: groqConfig.maxTokens,
    });

    return {
      content: response.choices[0].message.content || "Unable to generate explanation",
      model: response.model,
      usage: response.usage,
    };
  } catch (error) {
    console.error("Error explaining code:", error);
    throw new Error("Failed to generate code explanation");
  }
}

export async function compareLanguages(
  language1: string,
  language2: string
): Promise<AIResponse> {
  try {
    const response = await groqClient.chat.completions.create({
      messages: [
        {
          role: "system",
          content: "You are a programming language expert. Compare languages objectively with historical context and practical insights."
        },
        {
          role: "user",
          content: `Compare ${language1} and ${language2} in terms of: syntax philosophy, performance characteristics, typical use cases, historical context, and why developers might choose one over the other.`
        }
      ],
      model: groqConfig.model,
      temperature: groqConfig.temperature,
      max_tokens: groqConfig.maxTokens,
    });

    return {
      content: response.choices[0].message.content || "Unable to generate comparison",
      model: response.model,
      usage: response.usage,
    };
  } catch (error) {
    console.error("Error comparing languages:", error);
    throw new Error("Failed to generate language comparison");
  }
}

export async function explainParadigm(
  paradigm: string,
  language?: string
): Promise<AIResponse> {
  try {
    const response = await groqClient.chat.completions.create({
      messages: [
        {
          role: "system",
          content: "You are a programming paradigm expert. Explain concepts with historical context and practical examples."
        },
        {
          role: "user",
          content: `Explain ${paradigm} programming${language ? ` using ${language} as an example` : ''}. Show how it evolved, key languages that implemented it, and its impact on modern development.`
        }
      ],
      model: groqConfig.model,
      temperature: groqConfig.temperature,
      max_tokens: groqConfig.maxTokens,
    });

    return {
      content: response.choices[0].message.content || "Unable to generate paradigm explanation",
      model: response.model,
      usage: response.usage,
    };
  } catch (error) {
    console.error("Error explaining paradigm:", error);
    throw new Error("Failed to generate paradigm explanation");
  }
}

export async function askProgrammingHistoryQuestion(
  question: string
): Promise<AIResponse> {
  try {
    const response = await groqClient.chat.completions.create({
      messages: [
        {
          role: "system",
          content: "You are a programming history expert. Answer questions about programming languages, their evolution, and historical context with accuracy and educational value."
        },
        {
          role: "user",
          content: question
        }
      ],
      model: groqConfig.model,
      temperature: groqConfig.temperature,
      max_tokens: groqConfig.maxTokens,
    });

    return {
      content: response.choices[0].message.content || "Unable to generate answer",
      model: response.model,
      usage: response.usage,
    };
  } catch (error) {
    console.error("Error answering question:", error);
    throw new Error("Failed to generate answer");
  }
}
