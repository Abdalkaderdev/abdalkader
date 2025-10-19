export interface TherapyMessage {
  id: string;
  role: 'user' | 'therapist';
  content: string;
  timestamp: number;
  modality?: 'cbt' | 'mbsr' | 'sfbt' | 'positive';
  emotion?: string;
  confidence?: number;
}

export interface TherapySession {
  id: string;
  startTime: number;
  endTime?: number;
  modality: 'cbt' | 'mbsr' | 'sfbt' | 'positive';
  messages: TherapyMessage[];
  mood: number;
  stress: number;
  progress: number;
}

export interface CrisisDetection {
  isCrisis: boolean;
  severity: 'low' | 'medium' | 'high' | 'critical';
  triggers: string[];
  recommendations: string[];
  emergencyResources: string[];
}

class AITherapist {
  private apiKey: string;
  private baseUrl: string = 'https://api.groq.com/openai/v1';
  private currentSession: TherapySession | null = null;
  private crisisKeywords = [
    'suicide', 'kill myself', 'end it all', 'not worth living',
    'hurt myself', 'self harm', 'cut myself', 'overdose',
    'jump off', 'hang myself', 'gun', 'pills'
  ];
  private crisisPatterns = [
    /i want to die/i,
    /i should die/i,
    /i'm going to kill myself/i,
    /i can't go on/i,
    /life isn't worth living/i
  ];

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  // Start a new therapy session
  async startSession(modality: TherapySession['modality'] = 'cbt'): Promise<TherapySession> {
    const session: TherapySession = {
      id: this.generateSessionId(),
      startTime: Date.now(),
      modality,
      messages: [],
      mood: 5, // 1-10 scale
      stress: 5, // 1-10 scale
      progress: 0
    };

    this.currentSession = session;

    // Send initial greeting based on modality
    const greeting = await this.generateGreeting(modality);
    const therapistMessage: TherapyMessage = {
      id: this.generateMessageId(),
      role: 'therapist',
      content: greeting,
      timestamp: Date.now(),
      modality,
      confidence: 0.9
    };

    session.messages.push(therapistMessage);
    return session;
  }

  // Send a message and get therapist response
  async sendMessage(content: string, emotion?: string): Promise<TherapyMessage> {
    if (!this.currentSession) {
      throw new Error('No active session');
    }

    // Check for crisis indicators
    const crisisDetection = this.detectCrisis(content);
    if (crisisDetection.isCrisis) {
      return this.handleCrisis(crisisDetection);
    }

    // Add user message
    const userMessage: TherapyMessage = {
      id: this.generateMessageId(),
      role: 'user',
      content,
      timestamp: Date.now(),
      emotion,
      confidence: 1.0
    };

    this.currentSession.messages.push(userMessage);

    // Generate therapist response
    const therapistResponse = await this.generateResponse(content, emotion);
    
    const therapistMessage: TherapyMessage = {
      id: this.generateMessageId(),
      role: 'therapist',
      content: therapistResponse.content,
      timestamp: Date.now(),
      modality: this.currentSession.modality,
      emotion: therapistResponse.emotion,
      confidence: therapistResponse.confidence
    };

    this.currentSession.messages.push(therapistMessage);
    this.updateSessionProgress();

    return therapistMessage;
  }

  // Generate therapist greeting based on modality
  private async generateGreeting(modality: TherapySession['modality']): Promise<string> {
    const prompts = {
      cbt: "Hello! I'm here to help you work through your thoughts and feelings using Cognitive Behavioral Therapy. How are you feeling today? What's on your mind?",
      mbsr: "Welcome to our mindfulness session. Let's take a moment to breathe and be present. How is your mind and body feeling right now?",
      sfbt: "Hi there! I'm here to help you focus on solutions and your strengths. What would you like to work on today? What's going well in your life?",
      positive: "Hello! I'm excited to help you cultivate positivity and well-being. What are you grateful for today? What brings you joy?"
    };

    return prompts[modality];
  }

  // Generate therapist response using Groq API
  private async generateResponse(content: string, emotion?: string): Promise<{
    content: string;
    emotion: string;
    confidence: number;
  }> {
    try {
      // Check for crisis indicators first
      const { crisisManager } = await import('./crisisManager');
      const crisisAnalysis = crisisManager.analyzeCrisis(content);
      
      if (crisisAnalysis.isCrisis) {
        return {
          content: crisisManager.generateCrisisMessage(crisisAnalysis),
          emotion: 'concern',
          confidence: 1.0
        };
      }

      const systemPrompt = this.getSystemPrompt();
      const conversationHistory = this.getConversationHistory();
      
      // Add emotion context to the prompt
      const emotionContext = emotion ? `\n\nUser's current emotional state: ${emotion}` : '';
      const enhancedSystemPrompt = `${systemPrompt}${emotionContext}`;
      
      const response = await fetch(`${this.baseUrl}/chat/completions`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model: 'llama3-8b-8192',
          messages: [
            { role: 'system', content: enhancedSystemPrompt },
            ...conversationHistory,
            { role: 'user', content: content }
          ],
          max_tokens: 500,
          temperature: 0.7,
          top_p: 0.9,
          stream: false
        })
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(`API request failed: ${response.status} - ${errorData.error?.message || 'Unknown error'}`);
      }

      const data = await response.json();
      
      if (!data.choices || !data.choices[0] || !data.choices[0].message) {
        throw new Error('Invalid API response format');
      }

      const aiResponse = data.choices[0].message.content;

      // Analyze response for emotion and confidence
      const emotionAnalysis = this.analyzeEmotion(aiResponse);
      const confidence = this.calculateConfidence(aiResponse);

      return {
        content: aiResponse,
        emotion: emotionAnalysis,
        confidence
      };
    } catch (error) {
      console.error('Error generating response:', error);
      
      // Return appropriate fallback based on error type
      if (error instanceof Error && error.message.includes('API request failed')) {
        return {
          content: "I'm experiencing technical difficulties right now. Please try again in a moment, or if you're in crisis, please call 988 or 911 immediately.",
          emotion: 'concern',
          confidence: 0.2
        };
      }
      
      return {
        content: "I'm here to listen and support you. Could you please tell me more about what's on your mind?",
        emotion: 'empathy',
        confidence: 0.5
      };
    }
  }

  // Get system prompt based on current modality
  private getSystemPrompt(): string {
    if (!this.currentSession) return this.getDefaultSystemPrompt();

    const basePrompt = "You are a compassionate, professional AI therapist. You provide supportive, evidence-based therapy in a warm, non-judgmental manner. Always prioritize the user's safety and well-being.";

    const modalityPrompts = {
      cbt: "Use Cognitive Behavioral Therapy techniques. Help identify and challenge negative thought patterns. Focus on the connection between thoughts, feelings, and behaviors.",
      mbsr: "Use Mindfulness-Based Stress Reduction techniques. Guide the user to be present and aware. Incorporate breathing exercises and mindfulness practices.",
      sfbt: "Use Solution-Focused Brief Therapy techniques. Focus on the user's strengths and resources. Help identify what's working and build on successes.",
      positive: "Use Positive Psychology interventions. Focus on strengths, gratitude, and positive emotions. Help build resilience and well-being."
    };

    return `${basePrompt} ${modalityPrompts[this.currentSession.modality]}`;
  }

  private getDefaultSystemPrompt(): string {
    return "You are a compassionate, professional AI therapist. You provide supportive, evidence-based therapy in a warm, non-judgmental manner. Always prioritize the user's safety and well-being.";
  }

  // Get conversation history for context
  private getConversationHistory(): Array<{ role: string; content: string }> {
    if (!this.currentSession) return [];

    return this.currentSession.messages
      .slice(-10) // Last 10 messages for context
      .map(msg => ({
        role: msg.role,
        content: msg.content
      }));
  }

  // Detect crisis indicators in user input
  private detectCrisis(content: string): CrisisDetection {
    const lowerContent = content.toLowerCase();
    
    // Check for crisis keywords
    const foundKeywords = this.crisisKeywords.filter(keyword => 
      lowerContent.includes(keyword)
    );

    // Check for crisis patterns
    const foundPatterns = this.crisisPatterns.filter(pattern => 
      pattern.test(content)
    );

    const isCrisis = foundKeywords.length > 0 || foundPatterns.length > 0;
    
    let severity: CrisisDetection['severity'] = 'low';
    if (foundKeywords.length > 2 || foundPatterns.length > 0) {
      severity = 'critical';
    } else if (foundKeywords.length > 0) {
      severity = 'high';
    }

    return {
      isCrisis,
      severity,
      triggers: [...foundKeywords, ...foundPatterns.map(p => p.toString())],
      recommendations: this.getCrisisRecommendations(severity),
      emergencyResources: this.getEmergencyResources()
    };
  }

  // Handle crisis situation
  private handleCrisis(crisisDetection: CrisisDetection): TherapyMessage {
    const crisisResponses = {
      low: "I'm concerned about what you're sharing. It sounds like you're going through a really difficult time. You're not alone, and there are people who want to help you.",
      medium: "I'm very concerned about your safety. What you're describing sounds very serious. Please know that your life has value and there are people who care about you.",
      high: "I'm extremely concerned about your safety right now. It sounds like you might be having thoughts of hurting yourself. This is a medical emergency.",
      critical: "This is a medical emergency. Please call emergency services (911) or go to your nearest emergency room immediately. Your life is valuable and there are people who want to help you."
    };

    const response = crisisResponses[crisisDetection.severity];
    const emergencyInfo = crisisDetection.emergencyResources.join('\n');

    return {
      id: this.generateMessageId(),
      role: 'therapist',
      content: `${response}\n\n${emergencyInfo}`,
      timestamp: Date.now(),
      confidence: 1.0
    };
  }

  // Get crisis recommendations based on severity
  private getCrisisRecommendations(severity: CrisisDetection['severity']): string[] {
    const recommendations = {
      low: [
        "Consider reaching out to a trusted friend or family member",
        "Try some grounding techniques or breathing exercises",
        "Consider speaking with a mental health professional"
      ],
      medium: [
        "Please reach out to a mental health professional immediately",
        "Consider calling a crisis hotline",
        "Stay with a trusted person if possible"
      ],
      high: [
        "Call a crisis hotline immediately",
        "Go to your nearest emergency room",
        "Tell someone you trust about your thoughts"
      ],
      critical: [
        "Call 911 or emergency services immediately",
        "Go to the nearest emergency room",
        "Do not be alone - stay with someone you trust"
      ]
    };

    return recommendations[severity];
  }

  // Get emergency resources
  private getEmergencyResources(): string[] {
    return [
      "National Suicide Prevention Lifeline: 988",
      "Crisis Text Line: Text HOME to 741741",
      "Emergency Services: 911",
      "National Alliance on Mental Illness: 1-800-950-NAMI"
    ];
  }

  // Analyze emotion in AI response
  private analyzeEmotion(content: string): string {
    const emotions = {
      'empathy': ['understand', 'feel', 'hear', 'care', 'support'],
      'encouragement': ['can', 'will', 'strength', 'proud', 'believe'],
      'concern': ['worried', 'concerned', 'troubled', 'alarmed'],
      'neutral': ['okay', 'alright', 'fine', 'good']
    };

    const lowerContent = content.toLowerCase();
    
    for (const [emotion, keywords] of Object.entries(emotions)) {
      if (keywords.some(keyword => lowerContent.includes(keyword))) {
        return emotion;
      }
    }

    return 'neutral';
  }

  // Calculate confidence score
  private calculateConfidence(content: string): number {
    // Simple confidence calculation based on response length and structure
    const length = content.length;
    const hasQuestions = content.includes('?');
    const hasEmpathy = ['understand', 'feel', 'hear', 'care'].some(word => 
      content.toLowerCase().includes(word)
    );

    let confidence = 0.5;
    
    if (length > 50) confidence += 0.2;
    if (hasQuestions) confidence += 0.1;
    if (hasEmpathy) confidence += 0.2;

    return Math.min(1, Math.max(0.1, confidence));
  }

  // Update session progress
  private updateSessionProgress(): void {
    if (!this.currentSession) return;

    const messageCount = this.currentSession.messages.length;
    const userMessages = this.currentSession.messages.filter(m => m.role === 'user');
    
    // Progress based on engagement and session length
    const engagementScore = userMessages.length / messageCount;
    const timeScore = Math.min(1, (Date.now() - this.currentSession.startTime) / (30 * 60 * 1000)); // 30 minutes max
    
    this.currentSession.progress = (engagementScore + timeScore) / 2;
  }

  // End current session
  endSession(): TherapySession | null {
    if (!this.currentSession) return null;

    this.currentSession.endTime = Date.now();
    const completedSession = { ...this.currentSession };
    this.currentSession = null;

    return completedSession;
  }

  // Get current session
  getCurrentSession(): TherapySession | null {
    return this.currentSession;
  }

  // Generate session ID
  private generateSessionId(): string {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  // Generate message ID
  private generateMessageId(): string {
    return `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
}

// Create singleton instance
export const aiTherapist = new AITherapist(process.env.NEXT_PUBLIC_GROQ_API_KEY || '');

export default aiTherapist;