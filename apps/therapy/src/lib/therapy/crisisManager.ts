export interface CrisisLevel {
  level: 'low' | 'medium' | 'high' | 'critical';
  score: number;
  triggers: string[];
  immediateActions: string[];
  resources: string[];
  followUpRequired: boolean;
}

export interface CrisisResponse {
  isCrisis: boolean;
  level: CrisisLevel;
  emergencyContacts: string[];
  professionalResources: string[];
  selfHelpActions: string[];
  followUpPlan: string[];
}

class CrisisManager {
  private crisisKeywords = {
    suicide: [
      'suicide', 'kill myself', 'end it all', 'not worth living',
      'hurt myself', 'self harm', 'cut myself', 'overdose',
      'jump off', 'hang myself', 'gun', 'pills', 'die',
      'dead', 'death', 'end my life', 'suicidal'
    ],
    selfHarm: [
      'cut', 'cutting', 'burn', 'burning', 'hurt myself',
      'self harm', 'self-harm', 'self injury', 'bleeding',
      'scar', 'scarring', 'wound', 'wounds'
    ],
    violence: [
      'hurt others', 'kill someone', 'violence', 'attack',
      'fight', 'punch', 'hit', 'stab', 'shoot'
    ],
    substance: [
      'overdose', 'too many pills', 'drink too much',
      'drugs', 'alcohol', 'poison', 'toxic'
    ]
  };

  private crisisPatterns = [
    { pattern: /i want to die/i, severity: 'critical' },
    { pattern: /i should die/i, severity: 'critical' },
    { pattern: /i'm going to kill myself/i, severity: 'critical' },
    { pattern: /i can't go on/i, severity: 'high' },
    { pattern: /life isn't worth living/i, severity: 'high' },
    { pattern: /i wish i was dead/i, severity: 'high' },
    { pattern: /i want to hurt myself/i, severity: 'high' },
    { pattern: /i'm thinking about suicide/i, severity: 'critical' },
    { pattern: /i have a plan/i, severity: 'critical' },
    { pattern: /i have the means/i, severity: 'critical' }
  ];

  private emergencyResources = {
    immediate: [
      'National Suicide Prevention Lifeline: 988',
      'Crisis Text Line: Text HOME to 741741',
      'Emergency Services: 911',
      'National Suicide Prevention Lifeline (Spanish): 1-888-628-9454',
      'Lifeline Chat: suicidepreventionlifeline.org/chat'
    ],
    professional: [
      'National Alliance on Mental Illness (NAMI): 1-800-950-NAMI',
      'Substance Abuse and Mental Health Services Administration: 1-800-662-4357',
      'National Institute of Mental Health: 1-866-615-6464',
      'Mental Health America: 1-800-969-6642',
      'American Foundation for Suicide Prevention: 1-800-273-8255'
    ],
    international: [
      'International Association for Suicide Prevention: iasp.info',
      'Befrienders Worldwide: befrienders.org',
      'International Suicide Prevention: suicideprevention.ca'
    ]
  };

  // Analyze text for crisis indicators
  analyzeCrisis(text: string, context?: any): CrisisResponse {
    const lowerText = text.toLowerCase();
    const triggers: string[] = [];
    let crisisScore = 0;

    // Check for keyword matches
    for (const [category, keywords] of Object.entries(this.crisisKeywords)) {
      for (const keyword of keywords) {
        if (lowerText.includes(keyword)) {
          triggers.push(`${category}: ${keyword}`);
          crisisScore += this.getKeywordSeverity(category);
        }
      }
    }

    // Check for pattern matches
    for (const { pattern, severity } of this.crisisPatterns) {
      if (pattern.test(text)) {
        triggers.push(`pattern: ${pattern.toString()}`);
        crisisScore += this.getPatternSeverity(severity);
      }
    }

    // Determine crisis level
    const level = this.determineCrisisLevel(crisisScore, triggers.length);
    
    return {
      isCrisis: level.level !== 'low',
      level,
      emergencyContacts: this.getEmergencyContacts(level.level),
      professionalResources: this.emergencyResources.professional,
      selfHelpActions: this.getSelfHelpActions(level.level),
      followUpPlan: this.getFollowUpPlan(level.level)
    };
  }

  // Get keyword severity score
  private getKeywordSeverity(category: string): number {
    const severityScores = {
      suicide: 10,
      selfHarm: 8,
      violence: 9,
      substance: 7
    };
    return severityScores[category as keyof typeof severityScores] || 0;
  }

  // Get pattern severity score
  private getPatternSeverity(severity: string): number {
    const severityScores = {
      critical: 15,
      high: 10,
      medium: 5,
      low: 2
    };
    return severityScores[severity as keyof typeof severityScores] || 0;
  }

  // Determine crisis level based on score and triggers
  private determineCrisisLevel(score: number, triggerCount: number): CrisisLevel {
    if (score >= 20 || triggerCount >= 3) {
      return {
        level: 'critical',
        score,
        triggers: [],
        immediateActions: [
          'Call 911 or emergency services immediately',
          'Go to the nearest emergency room',
          'Stay with a trusted person',
          'Remove any means of self-harm'
        ],
        resources: this.emergencyResources.immediate,
        followUpRequired: true
      };
    } else if (score >= 15 || triggerCount >= 2) {
      return {
        level: 'high',
        score,
        triggers: [],
        immediateActions: [
          'Call a crisis hotline immediately',
          'Tell someone you trust about your thoughts',
          'Go to a safe place',
          'Remove any means of self-harm'
        ],
        resources: this.emergencyResources.immediate,
        followUpRequired: true
      };
    } else if (score >= 10 || triggerCount >= 1) {
      return {
        level: 'medium',
        score,
        triggers: [],
        immediateActions: [
          'Reach out to a mental health professional',
          'Call a crisis hotline',
          'Stay with a trusted person if possible',
          'Use coping strategies'
        ],
        resources: this.emergencyResources.professional,
        followUpRequired: true
      };
    } else {
      return {
        level: 'low',
        score,
        triggers: [],
        immediateActions: [
          'Consider reaching out to a trusted friend',
          'Try some grounding techniques',
          'Consider speaking with a mental health professional'
        ],
        resources: this.emergencyResources.professional,
        followUpRequired: false
      };
    }
  }

  // Get emergency contacts based on crisis level
  private getEmergencyContacts(level: string): string[] {
    if (level === 'critical' || level === 'high') {
      return this.emergencyResources.immediate;
    }
    return this.emergencyResources.professional;
  }

  // Get self-help actions based on crisis level
  private getSelfHelpActions(level: string): string[] {
    const actions = {
      critical: [
        'Call 911 immediately',
        'Go to the nearest emergency room',
        'Stay with a trusted person',
        'Remove any means of self-harm'
      ],
      high: [
        'Call a crisis hotline',
        'Tell someone you trust',
        'Go to a safe place',
        'Use breathing exercises'
      ],
      medium: [
        'Reach out to a mental health professional',
        'Call a crisis hotline',
        'Use coping strategies',
        'Practice grounding techniques'
      ],
      low: [
        'Talk to a trusted friend or family member',
        'Use relaxation techniques',
        'Consider professional help',
        'Practice self-care'
      ]
    };
    return actions[level as keyof typeof actions] || actions.low;
  }

  // Get follow-up plan based on crisis level
  private getFollowUpPlan(level: string): string[] {
    const plans = {
      critical: [
        'Immediate emergency intervention',
        '24-hour crisis team follow-up',
        'Safety planning with mental health professional',
        'Regular check-ins for 72 hours'
      ],
      high: [
        'Crisis team follow-up within 24 hours',
        'Safety planning session',
        'Regular check-ins for 48 hours',
        'Connection to ongoing mental health services'
      ],
      medium: [
        'Follow-up within 48 hours',
        'Safety planning session',
        'Connection to mental health services',
        'Regular check-ins for 1 week'
      ],
      low: [
        'Follow-up within 1 week',
        'Connection to mental health services',
        'Regular check-ins for 2 weeks',
        'Ongoing support as needed'
      ]
    };
    return plans[level as keyof typeof plans] || plans.low;
  }

  // Generate crisis response message
  generateCrisisMessage(crisis: CrisisResponse): string {
    if (!crisis.isCrisis) {
      return "I'm here to listen and support you. How can I help you today?";
    }

    const { level } = crisis;
    
    let message = `I'm very concerned about your safety. What you're sharing sounds serious and I want to make sure you get the help you need.\n\n`;
    
    message += `**Immediate Actions:**\n`;
    crisis.level.immediateActions.forEach((action, index) => {
      message += `${index + 1}. ${action}\n`;
    });
    
    message += `\n**Emergency Resources:**\n`;
    crisis.emergencyContacts.forEach((resource, index) => {
      message += `${index + 1}. ${resource}\n`;
    });
    
    if (level.level === 'critical' || level.level === 'high') {
      message += `\n**This is a medical emergency. Please call 911 or go to your nearest emergency room immediately.**\n`;
    }
    
    message += `\n**Remember:** Your life has value and there are people who care about you and want to help. You don't have to go through this alone.`;
    
    return message;
  }

  // Check if immediate intervention is needed
  requiresImmediateIntervention(crisis: CrisisResponse): boolean {
    return crisis.level.level === 'critical' || crisis.level.level === 'high';
  }

  // Get crisis level color for UI
  getCrisisLevelColor(level: string): string {
    const colors = {
      critical: '#ef4444', // red
      high: '#f59e0b',     // orange
      medium: '#eab308',   // yellow
      low: '#10b981'       // green
    };
    return colors[level as keyof typeof colors] || colors.low;
  }

  // Get crisis level icon for UI
  getCrisisLevelIcon(level: string): string {
    const icons = {
      critical: '🚨',
      high: '⚠️',
      medium: '⚠️',
      low: 'ℹ️'
    };
    return icons[level as keyof typeof icons] || icons.low;
  }
}

// Create singleton instance
export const crisisManager = new CrisisManager();
export default crisisManager;