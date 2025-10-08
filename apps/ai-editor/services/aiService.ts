import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  dangerouslyAllowBrowser: false // This should only run on server-side
});

export interface GenerateComponentRequest {
  prompt: string;
  componentType?: 'functional' | 'class';
  includeState?: boolean;
  includeProps?: boolean;
  designSystem?: 'abdalkader' | 'custom';
}

export interface GenerateComponentResponse {
  code: string;
  explanation: string;
  suggestions: string[];
}

const DESIGN_SYSTEM_CONTEXT = `
You are generating React components using the @abdalkader/ui design system. 

Available components:
- Button: Props include variant ('primary' | 'secondary' | 'outline'), size ('sm' | 'md' | 'lg'), disabled, onClick
- Input: Props include type, placeholder, value, onChange, disabled
- Card: Props include children, className

Design principles:
- Use Tailwind CSS classes for styling
- Follow modern React patterns with hooks
- Ensure accessibility with proper ARIA attributes
- Use semantic HTML elements
- Implement responsive design
- Follow the existing design token system

Color palette:
- Primary: Blue (#3B82F6)
- Secondary: Gray (#6B7280)
- Success: Green (#10B981)
- Warning: Yellow (#F59E0B)
- Error: Red (#EF4444)

Typography:
- Headings: font-bold, text-xl/2xl/3xl
- Body: text-base, text-gray-600/700
- Small: text-sm, text-gray-500

Spacing:
- Use space-y-4, gap-4, p-4, m-4 for consistent spacing
- Use max-w-md, max-w-lg for container widths
`;

export async function generateComponent(request: GenerateComponentRequest): Promise<GenerateComponentResponse> {
  try {
    const systemPrompt = `${DESIGN_SYSTEM_CONTEXT}

Generate a React component based on the user's request. The component should:
1. Be a functional component using modern React hooks
2. Use TypeScript for type safety
3. Import components from '@abdalkader/ui'
4. Follow the design system guidelines
5. Be named 'PreviewComponent' for the playground
6. Include proper error handling and loading states if needed
7. Be responsive and accessible

Return the response in this exact JSON format:
{
  "code": "// The complete React component code",
  "explanation": "Brief explanation of what the component does",
  "suggestions": ["suggestion1", "suggestion2", "suggestion3"]
}`;

    const userPrompt = `Create a React component: ${request.prompt}

Requirements:
- Component type: ${request.componentType || 'functional'}
- Include state management: ${request.includeState ? 'yes' : 'no'}
- Include props interface: ${request.includeProps ? 'yes' : 'no'}
- Design system: ${request.designSystem || 'abdalkader'}

Please generate clean, production-ready code that follows best practices.`;

    const completion = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt }
      ],
      temperature: 0.7,
      max_tokens: 2000,
    });

    const response = completion.choices[0]?.message?.content;
    if (!response) {
      throw new Error('No response from OpenAI');
    }

    // Try to parse JSON response
    try {
      const parsed = JSON.parse(response);
      return {
        code: parsed.code || response,
        explanation: parsed.explanation || 'Generated component based on your request',
        suggestions: parsed.suggestions || []
      };
    } catch {
      // If not JSON, treat as raw code
      return {
        code: response,
        explanation: 'Generated component based on your request',
        suggestions: [
          'Try adding more interactive elements',
          'Consider adding form validation',
          'Add loading and error states'
        ]
      };
    }
  } catch (error) {
    console.error('AI generation error:', error);
    throw new Error(
      error instanceof Error 
        ? `AI generation failed: ${error.message}`
        : 'AI generation failed with unknown error'
    );
  }
}

export async function improveComponent(code: string, improvements: string): Promise<GenerateComponentResponse> {
  try {
    const systemPrompt = `${DESIGN_SYSTEM_CONTEXT}

You are improving an existing React component. Analyze the provided code and apply the requested improvements while maintaining the existing functionality and design system compliance.

Return the response in this exact JSON format:
{
  "code": "// The improved React component code",
  "explanation": "Explanation of what improvements were made",
  "suggestions": ["suggestion1", "suggestion2", "suggestion3"]
}`;

    const userPrompt = `Improve this React component:

\`\`\`tsx
${code}
\`\`\`

Requested improvements: ${improvements}

Please maintain the existing functionality while applying the improvements.`;

    const completion = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt }
      ],
      temperature: 0.5,
      max_tokens: 2000,
    });

    const response = completion.choices[0]?.message?.content;
    if (!response) {
      throw new Error('No response from OpenAI');
    }

    try {
      const parsed = JSON.parse(response);
      return {
        code: parsed.code || response,
        explanation: parsed.explanation || 'Applied requested improvements',
        suggestions: parsed.suggestions || []
      };
    } catch {
      return {
        code: response,
        explanation: 'Applied requested improvements',
        suggestions: [
          'Consider adding more error handling',
          'Add unit tests for the component',
          'Optimize for performance'
        ]
      };
    }
  } catch (error) {
    console.error('AI improvement error:', error);
    throw new Error(
      error instanceof Error 
        ? `AI improvement failed: ${error.message}`
        : 'AI improvement failed with unknown error'
    );
  }
}

export function validateApiKey(): boolean {
  return !!process.env.OPENAI_API_KEY;
}