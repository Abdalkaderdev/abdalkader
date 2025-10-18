export interface Language {
  id: string;
  name: string;
  year: number;
  creator: string;
  paradigm: string[];
  predecessor: string[];
  successor: string[];
  helloWorld: string;
  historicalContext: string;
  keyInnovations: string[];
  description: string;
  era: string;
  color: string;
}

export interface Era {
  name: string;
  startYear: number;
  endYear: number;
  description: string;
  color: string;
  languages: Language[];
}

export interface Paradigm {
  name: string;
  description: string;
  languages: Language[];
  color: string;
  icon: string;
}

export interface TimelineEvent {
  year: number;
  languages: Language[];
  historicalEvents: string[];
  description: string;
}

export interface AIExplanation {
  content: string;
  model: string;
  timestamp: number;
  languageId: string;
  type: 'history' | 'code' | 'comparison' | 'paradigm' | 'question';
}
