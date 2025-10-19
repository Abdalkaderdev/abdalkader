export interface TherapyModality {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  techniques: TherapyTechnique[];
  sessionStructure: SessionStructure;
  goals: string[];
  duration: number; // minutes
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  evidenceBased: boolean;
  crisisAppropriate: boolean;
}

export interface TherapyTechnique {
  id: string;
  name: string;
  description: string;
  steps: string[];
  duration: number; // minutes
  materials?: string[];
  tips: string[];
}

export interface SessionStructure {
  phases: SessionPhase[];
  totalDuration: number;
  breaks: Break[];
}

export interface SessionPhase {
  name: string;
  duration: number;
  activities: string[];
  goals: string[];
}

export interface Break {
  duration: number;
  activity: string;
  timing: 'after' | 'before' | 'during';
  phase: string;
}

export const THERAPY_MODALITIES: TherapyModality[] = [
  {
    id: 'cbt',
    name: 'Cognitive Behavioral Therapy',
    description: 'Evidence-based therapy focusing on identifying and changing negative thought patterns and behaviors',
    icon: '🧠',
    color: '#3b82f6',
    evidenceBased: true,
    crisisAppropriate: true,
    difficulty: 'intermediate',
    duration: 50,
    goals: [
      'Identify negative thought patterns',
      'Challenge cognitive distortions',
      'Develop healthier coping strategies',
      'Improve emotional regulation'
    ],
    techniques: [
      {
        id: 'thought_record',
        name: 'Thought Record',
        description: 'Systematically examine and challenge negative thoughts',
        steps: [
          'Identify the triggering situation',
          'Record automatic thoughts',
          'Identify emotions and intensity',
          'Challenge thoughts with evidence',
          'Develop balanced thoughts',
          'Rate mood after reframing'
        ],
        duration: 15,
        materials: ['Thought record worksheet', 'Pen/pencil'],
        tips: [
          'Be specific about the situation',
          'Write down thoughts exactly as they occur',
          'Look for evidence both for and against the thought',
          'Practice regularly for best results'
        ]
      },
      {
        id: 'behavioral_experiment',
        name: 'Behavioral Experiment',
        description: 'Test beliefs through real-world experiments',
        steps: [
          'Identify the belief to test',
          'Design a specific experiment',
          'Predict what will happen',
          'Conduct the experiment',
          'Record actual results',
          'Compare with predictions'
        ],
        duration: 20,
        materials: ['Experiment worksheet', 'Courage'],
        tips: [
          'Start with small, safe experiments',
          'Be specific about what you\'re testing',
          'Record results objectively',
          'Learn from both positive and negative outcomes'
        ]
      },
      {
        id: 'exposure_therapy',
        name: 'Exposure Therapy',
        description: 'Gradual exposure to feared situations or thoughts',
        steps: [
          'Create fear hierarchy',
          'Start with least anxiety-provoking item',
          'Practice exposure until anxiety decreases',
          'Move to next level',
          'Practice in real-world situations',
          'Maintain gains through regular practice'
        ],
        duration: 30,
        materials: ['Fear hierarchy worksheet', 'Anxiety scale'],
        tips: [
          'Start small and build gradually',
          'Stay in the situation until anxiety decreases',
          'Practice regularly',
          'Celebrate small victories'
        ]
      }
    ],
    sessionStructure: {
      totalDuration: 50,
      phases: [
        {
          name: 'Check-in and Mood Assessment',
          duration: 5,
          activities: ['Mood check', 'Review previous session', 'Set session goals'],
          goals: ['Establish baseline', 'Identify current concerns']
        },
        {
          name: 'Skill Practice',
          duration: 30,
          activities: ['Practice CBT techniques', 'Work on thought records', 'Behavioral experiments'],
          goals: ['Develop new skills', 'Challenge negative patterns']
        },
        {
          name: 'Homework Assignment',
          duration: 10,
          activities: ['Assign practice exercises', 'Set goals for next session'],
          goals: ['Maintain progress', 'Build skills']
        },
        {
          name: 'Session Summary',
          duration: 5,
          activities: ['Review key points', 'Plan for next session'],
          goals: ['Consolidate learning', 'Maintain motivation']
        }
      ],
      breaks: [
        {
          duration: 5,
          activity: 'Deep breathing or stretching',
          timing: 'after',
          phase: 'Skill Practice'
        }
      ]
    }
  },
  {
    id: 'dbt',
    name: 'Dialectical Behavior Therapy',
    description: 'Skills-based therapy focusing on emotional regulation, distress tolerance, and interpersonal effectiveness',
    icon: '⚖️',
    color: '#8b5cf6',
    evidenceBased: true,
    crisisAppropriate: true,
    difficulty: 'intermediate',
    duration: 60,
    goals: [
      'Improve emotional regulation',
      'Develop distress tolerance skills',
      'Enhance interpersonal effectiveness',
      'Build mindfulness skills'
    ],
    techniques: [
      {
        id: 'mindfulness_observe',
        name: 'Mindfulness: Observe',
        description: 'Practice observing without judgment',
        steps: [
          'Find a comfortable position',
          'Focus on your breath',
          'Observe thoughts without judgment',
          'Notice when mind wanders',
          'Gently return to breath',
          'Practice for 5-10 minutes'
        ],
        duration: 10,
        materials: ['Quiet space', 'Timer'],
        tips: [
          'Start with short sessions',
          'Be patient with yourself',
          'Practice regularly',
          'Focus on the process, not perfection'
        ]
      },
      {
        id: 'distress_tolerance_tip',
        name: 'Distress Tolerance: TIPP',
        description: 'Temperature, Intense exercise, Paced breathing, Paired muscle relaxation',
        steps: [
          'Temperature: Hold ice cubes or splash cold water on face',
          'Intense exercise: Do jumping jacks or push-ups',
          'Paced breathing: Breathe out longer than in',
          'Paired muscle relaxation: Tense and release muscle groups'
        ],
        duration: 5,
        materials: ['Ice cubes or cold water', 'Space for exercise'],
        tips: [
          'Use when in crisis or high distress',
          'Practice when calm to build skill',
          'Combine techniques for maximum effect',
          'Be gentle with yourself'
        ]
      },
      {
        id: 'interpersonal_effectiveness_dear_man',
        name: 'Interpersonal Effectiveness: DEAR MAN',
        description: 'Structured approach to asking for what you need',
        steps: [
          'Describe the situation objectively',
          'Express your feelings and opinions',
          'Assert your needs clearly',
          'Reinforce the positive outcomes',
          'Stay Mindful of your goals',
          'Appear confident',
          'Negotiate when appropriate'
        ],
        duration: 15,
        materials: ['DEAR MAN worksheet', 'Practice scenarios'],
        tips: [
          'Practice with low-stakes situations first',
          'Be specific and clear',
          'Stay focused on your goals',
          'Be willing to compromise'
        ]
      }
    ],
    sessionStructure: {
      totalDuration: 60,
      phases: [
        {
          name: 'Mindfulness Practice',
          duration: 10,
          activities: ['Mindfulness exercise', 'Check-in with body and mind'],
          goals: ['Center attention', 'Prepare for session']
        },
        {
          name: 'Skill Review and Practice',
          duration: 35,
          activities: ['Review homework', 'Practice new skills', 'Troubleshoot difficulties'],
          goals: ['Build skills', 'Address challenges']
        },
        {
          name: 'Crisis Planning',
          duration: 10,
          activities: ['Review crisis plan', 'Practice distress tolerance'],
          goals: ['Prepare for difficult times', 'Build resilience']
        },
        {
          name: 'Homework and Planning',
          duration: 5,
          activities: ['Assign practice exercises', 'Plan for next session'],
          goals: ['Maintain progress', 'Build skills']
        }
      ],
      breaks: [
        {
          duration: 5,
          activity: 'Mindful walking or stretching',
          timing: 'after',
          phase: 'Skill Review and Practice'
        }
      ]
    }
  },
  {
    id: 'emdr',
    name: 'Eye Movement Desensitization and Reprocessing',
    description: 'Trauma-focused therapy using bilateral stimulation to process traumatic memories',
    icon: '👁️',
    color: '#f59e0b',
    evidenceBased: true,
    crisisAppropriate: false,
    difficulty: 'advanced',
    duration: 90,
    goals: [
      'Process traumatic memories',
      'Reduce PTSD symptoms',
      'Improve emotional regulation',
      'Build resilience'
    ],
    techniques: [
      {
        id: 'bilateral_stimulation',
        name: 'Bilateral Stimulation',
        description: 'Use eye movements, taps, or sounds to process traumatic memories',
        steps: [
          'Identify target memory',
          'Rate distress level (0-10)',
          'Begin bilateral stimulation',
          'Follow therapist\'s guidance',
          'Process the memory',
          'Install positive beliefs'
        ],
        duration: 45,
        materials: ['Bilateral stimulation device', 'Safe space'],
        tips: [
          'Work with trained therapist',
          'Ensure you feel safe',
          'Take breaks as needed',
          'Trust the process'
        ]
      },
      {
        id: 'safe_place_imagery',
        name: 'Safe Place Imagery',
        description: 'Create and strengthen a mental safe place for grounding',
        steps: [
          'Close your eyes and relax',
          'Imagine a safe, peaceful place',
          'Use all senses to make it real',
          'Practice accessing this place',
          'Use when feeling overwhelmed',
          'Strengthen the image over time'
        ],
        duration: 15,
        materials: ['Quiet space', 'Comfortable position'],
        tips: [
          'Choose a place that feels truly safe',
          'Use all five senses',
          'Practice regularly',
          'Make it your own'
        ]
      }
    ],
    sessionStructure: {
      totalDuration: 90,
      phases: [
        {
          name: 'Preparation and Assessment',
          duration: 15,
          activities: ['Check-in', 'Assess current state', 'Prepare for processing'],
          goals: ['Ensure safety', 'Set intentions']
        },
        {
          name: 'Memory Processing',
          duration: 45,
          activities: ['Bilateral stimulation', 'Memory processing', 'Emotional regulation'],
          goals: ['Process traumatic memories', 'Reduce distress']
        },
        {
          name: 'Integration and Closure',
          duration: 20,
          activities: ['Install positive beliefs', 'Grounding exercises', 'Session summary'],
          goals: ['Integrate new insights', 'Ensure stability']
        },
        {
          name: 'Planning and Homework',
          duration: 10,
          activities: ['Plan for next session', 'Assign grounding exercises'],
          goals: ['Maintain progress', 'Build skills']
        }
      ],
      breaks: [
        {
          duration: 10,
          activity: 'Grounding and stabilization',
          timing: 'after',
          phase: 'Memory Processing'
        }
      ]
    }
  },
  {
    id: 'mindfulness',
    name: 'Mindfulness-Based Stress Reduction',
    description: 'Meditation and mindfulness practices to reduce stress and improve well-being',
    icon: '🧘',
    color: '#10b981',
    evidenceBased: true,
    crisisAppropriate: true,
    difficulty: 'beginner',
    duration: 45,
    goals: [
      'Reduce stress and anxiety',
      'Improve focus and attention',
      'Enhance emotional regulation',
      'Increase self-awareness'
    ],
    techniques: [
      {
        id: 'body_scan',
        name: 'Body Scan Meditation',
        description: 'Systematic attention to different parts of the body',
        steps: [
          'Lie down comfortably',
          'Close your eyes and relax',
          'Start at the top of your head',
          'Slowly scan down your body',
          'Notice sensations without judgment',
          'Complete the full body scan'
        ],
        duration: 20,
        materials: ['Comfortable surface', 'Quiet space'],
        tips: [
          'Start with shorter sessions',
          'Be patient with wandering mind',
          'Practice regularly',
          'Focus on the process, not perfection'
        ]
      },
      {
        id: 'loving_kindness',
        name: 'Loving-Kindness Meditation',
        description: 'Cultivate compassion for yourself and others',
        steps: [
          'Sit comfortably and close eyes',
          'Start with yourself: "May I be happy"',
          'Extend to loved ones',
          'Include neutral people',
          'Include difficult people',
          'Extend to all beings'
        ],
        duration: 15,
        materials: ['Quiet space', 'Comfortable position'],
        tips: [
          'Start with yourself',
          'Be genuine in your wishes',
          'Practice regularly',
          'Be patient with difficult people'
        ]
      },
      {
        id: 'walking_meditation',
        name: 'Walking Meditation',
        description: 'Mindful walking to cultivate awareness',
        steps: [
          'Find a quiet path',
          'Walk slowly and deliberately',
          'Focus on the sensation of walking',
          'Notice your breath',
          'Be aware of your surroundings',
          'Return to walking when mind wanders'
        ],
        duration: 10,
        materials: ['Quiet walking path', 'Comfortable shoes'],
        tips: [
          'Start with short walks',
          'Focus on the process',
          'Practice regularly',
          'Be patient with distractions'
        ]
      }
    ],
    sessionStructure: {
      totalDuration: 45,
      phases: [
        {
          name: 'Centering and Intention',
          duration: 5,
          activities: ['Settle into position', 'Set intention for practice'],
          goals: ['Prepare for mindfulness', 'Focus attention']
        },
        {
          name: 'Mindfulness Practice',
          duration: 25,
          activities: ['Guided meditation', 'Mindfulness exercise', 'Breathing practice'],
          goals: ['Develop mindfulness skills', 'Reduce stress']
        },
        {
          name: 'Reflection and Integration',
          duration: 10,
          activities: ['Reflect on experience', 'Share insights', 'Plan home practice'],
          goals: ['Integrate learning', 'Build skills']
        },
        {
          name: 'Closing and Planning',
          duration: 5,
          activities: ['Gratitude practice', 'Plan for next session'],
          goals: ['End positively', 'Maintain motivation']
        }
      ],
      breaks: [
        {
          duration: 5,
          activity: 'Gentle stretching or walking',
          timing: 'after',
          phase: 'Mindfulness Practice'
        }
      ]
    }
  }
];

export class ModalityManager {
  private currentModality: TherapyModality | null = null;
  private sessionProgress: { [key: string]: any } = {};

  // Get all available modalities
  getAvailableModalities(): TherapyModality[] {
    return THERAPY_MODALITIES;
  }

  // Get modality by ID
  getModality(id: string): TherapyModality | undefined {
    return THERAPY_MODALITIES.find(modality => modality.id === id);
  }

  // Set current modality
  setCurrentModality(modality: TherapyModality): void {
    this.currentModality = modality;
    this.sessionProgress[modality.id] = {
      startTime: Date.now(),
      currentPhase: 0,
      completedTechniques: [],
      notes: []
    };
  }

  // Get current modality
  getCurrentModality(): TherapyModality | null {
    return this.currentModality;
  }

  // Get session progress
  getSessionProgress(modalityId: string): any {
    return this.sessionProgress[modalityId] || null;
  }

  // Update session progress
  updateSessionProgress(modalityId: string, updates: any): void {
    if (!this.sessionProgress[modalityId]) {
      this.sessionProgress[modalityId] = {
        startTime: Date.now(),
        currentPhase: 0,
        completedTechniques: [],
        notes: []
      };
    }
    this.sessionProgress[modalityId] = { ...this.sessionProgress[modalityId], ...updates };
  }

  // Get recommended modality based on user needs
  getRecommendedModality(userNeeds: {
    anxiety: number;
    depression: number;
    trauma: number;
    stress: number;
    experience: 'beginner' | 'intermediate' | 'advanced';
  }): TherapyModality | null {
    const { anxiety, depression, trauma, stress, experience } = userNeeds;
    
    // High trauma scores recommend EMDR
    if (trauma >= 7) {
      return this.getModality('emdr');
    }
    
    // High anxiety and stress recommend DBT
    if (anxiety >= 7 || stress >= 7) {
      return this.getModality('dbt');
    }
    
    // Depression and general issues recommend CBT
    if (depression >= 6) {
      return this.getModality('cbt');
    }
    
    // General stress and beginners recommend Mindfulness
    if (experience === 'beginner' || stress >= 5) {
      return this.getModality('mindfulness');
    }
    
    // Default to CBT for intermediate/advanced users
    return this.getModality('cbt');
  }

  // Get technique by ID
  getTechnique(modalityId: string, techniqueId: string): TherapyTechnique | null {
    const modality = this.getModality(modalityId);
    if (!modality) return null;
    
    return modality.techniques.find(technique => technique.id === techniqueId) || null;
  }

  // Complete technique
  completeTechnique(modalityId: string, techniqueId: string, notes?: string): void {
    if (!this.sessionProgress[modalityId]) {
      this.sessionProgress[modalityId] = {
        startTime: Date.now(),
        currentPhase: 0,
        completedTechniques: [],
        notes: []
      };
    }
    
    this.sessionProgress[modalityId].completedTechniques.push({
      techniqueId,
      completedAt: Date.now(),
      notes
    });
  }

  // Get session summary
  getSessionSummary(modalityId: string): {
    modality: TherapyModality | null;
    duration: number;
    completedTechniques: number;
    progress: number;
    notes: string[];
  } {
    const modality = this.getModality(modalityId);
    const progress = this.sessionProgress[modalityId];
    
    if (!modality || !progress) {
      return {
        modality: null,
        duration: 0,
        completedTechniques: 0,
        progress: 0,
        notes: []
      };
    }
    
    const duration = Date.now() - progress.startTime;
    const completedTechniques = progress.completedTechniques.length;
    const totalTechniques = modality.techniques.length;
    const progressPercentage = (completedTechniques / totalTechniques) * 100;
    
    return {
      modality,
      duration,
      completedTechniques,
      progress: progressPercentage,
      notes: progress.notes || []
    };
  }
}

// Create singleton instance
export const modalityManager = new ModalityManager();
export default modalityManager;