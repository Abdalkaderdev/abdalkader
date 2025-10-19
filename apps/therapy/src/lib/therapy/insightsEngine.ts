export interface MoodEntry {
  id: string;
  timestamp: number;
  mood: number; // 1-10 scale
  stress: number; // 1-10 scale
  energy: number; // 1-10 scale
  sleep: number; // 1-10 scale
  anxiety: number; // 1-10 scale
  depression: number; // 1-10 scale
  notes?: string;
  tags?: string[];
}

export interface TherapySession {
  id: string;
  startTime: number;
  endTime?: number;
  modality: string;
  messages: any[];
  mood: number;
  stress: number;
  progress: number;
}

export interface InsightPattern {
  type: 'trend' | 'correlation' | 'anomaly' | 'prediction';
  title: string;
  description: string;
  confidence: number;
  severity: 'low' | 'medium' | 'high';
  recommendations: string[];
  data: any;
}

export interface MoodAnalysis {
  currentMood: number;
  moodTrend: 'improving' | 'declining' | 'stable';
  stressLevel: 'low' | 'moderate' | 'high' | 'critical';
  riskFactors: string[];
  protectiveFactors: string[];
  recommendations: string[];
  patterns: InsightPattern[];
}

class InsightsEngine {
  private moodEntries: MoodEntry[] = [];
  private therapySessions: TherapySession[] = [];
  private patterns: InsightPattern[] = [];

  // Add mood entry
  addMoodEntry(entry: MoodEntry): void {
    this.moodEntries.push(entry);
    this.analyzePatterns();
  }

  // Add therapy session
  addTherapySession(session: TherapySession): void {
    this.therapySessions.push(session);
    this.analyzePatterns();
  }

  // Analyze mood patterns
  analyzeMoodPatterns(): MoodAnalysis {
    const recentEntries = this.getRecentMoodEntries(30); // Last 30 days
    const currentMood = this.getCurrentMood();
    const moodTrend = this.calculateMoodTrend(recentEntries);
    const stressLevel = this.assessStressLevel(recentEntries);
    const riskFactors = this.identifyRiskFactors(recentEntries);
    const protectiveFactors = this.identifyProtectiveFactors(recentEntries);
    const recommendations = this.generateRecommendations(moodTrend, stressLevel, riskFactors);
    const patterns = this.detectPatterns(recentEntries);

    return {
      currentMood,
      moodTrend,
      stressLevel,
      riskFactors,
      protectiveFactors,
      recommendations,
      patterns
    };
  }

  // Get recent mood entries
  private getRecentMoodEntries(days: number): MoodEntry[] {
    const cutoffDate = Date.now() - (days * 24 * 60 * 60 * 1000);
    return this.moodEntries.filter(entry => entry.timestamp >= cutoffDate);
  }

  // Get current mood
  private getCurrentMood(): number {
    if (this.moodEntries.length === 0) return 5;
    
    const recentEntries = this.getRecentMoodEntries(7);
    if (recentEntries.length === 0) return this.moodEntries[this.moodEntries.length - 1].mood;
    
    return recentEntries.reduce((sum, entry) => sum + entry.mood, 0) / recentEntries.length;
  }

  // Calculate mood trend
  private calculateMoodTrend(entries: MoodEntry[]): 'improving' | 'declining' | 'stable' {
    if (entries.length < 7) return 'stable';
    
    const firstWeek = entries.slice(0, Math.floor(entries.length / 2));
    const lastWeek = entries.slice(Math.floor(entries.length / 2));
    
    const firstWeekAvg = firstWeek.reduce((sum, entry) => sum + entry.mood, 0) / firstWeek.length;
    const lastWeekAvg = lastWeek.reduce((sum, entry) => sum + entry.mood, 0) / lastWeek.length;
    
    const difference = lastWeekAvg - firstWeekAvg;
    
    if (difference > 0.5) return 'improving';
    if (difference < -0.5) return 'declining';
    return 'stable';
  }

  // Assess stress level
  private assessStressLevel(entries: MoodEntry[]): 'low' | 'moderate' | 'high' | 'critical' {
    if (entries.length === 0) return 'moderate';
    
    const avgStress = entries.reduce((sum, entry) => sum + entry.stress, 0) / entries.length;
    
    if (avgStress >= 8) return 'critical';
    if (avgStress >= 6) return 'high';
    if (avgStress >= 4) return 'moderate';
    return 'low';
  }

  // Identify risk factors
  private identifyRiskFactors(entries: MoodEntry[]): string[] {
    const riskFactors: string[] = [];
    
    if (entries.length === 0) return riskFactors;
    
    const avgMood = entries.reduce((sum, entry) => sum + entry.mood, 0) / entries.length;
    const avgStress = entries.reduce((sum, entry) => sum + entry.stress, 0) / entries.length;
    const avgAnxiety = entries.reduce((sum, entry) => sum + entry.anxiety, 0) / entries.length;
    const avgDepression = entries.reduce((sum, entry) => sum + entry.depression, 0) / entries.length;
    
    if (avgMood <= 3) riskFactors.push('Persistently low mood');
    if (avgStress >= 7) riskFactors.push('High stress levels');
    if (avgAnxiety >= 7) riskFactors.push('High anxiety levels');
    if (avgDepression >= 7) riskFactors.push('High depression levels');
    
    // Check for declining trends
    if (this.calculateMoodTrend(entries) === 'declining') {
      riskFactors.push('Declining mood trend');
    }
    
    // Check for sleep issues
    const avgSleep = entries.reduce((sum, entry) => sum + entry.sleep, 0) / entries.length;
    if (avgSleep <= 3) riskFactors.push('Poor sleep quality');
    
    return riskFactors;
  }

  // Identify protective factors
  private identifyProtectiveFactors(entries: MoodEntry[]): string[] {
    const protectiveFactors: string[] = [];
    
    if (entries.length === 0) return protectiveFactors;
    
    const avgMood = entries.reduce((sum, entry) => sum + entry.mood, 0) / entries.length;
    const avgEnergy = entries.reduce((sum, entry) => sum + entry.energy, 0) / entries.length;
    const avgSleep = entries.reduce((sum, entry) => sum + entry.sleep, 0) / entries.length;
    
    if (avgMood >= 7) protectiveFactors.push('Good mood levels');
    if (avgEnergy >= 7) protectiveFactors.push('High energy levels');
    if (avgSleep >= 7) protectiveFactors.push('Good sleep quality');
    
    // Check for improving trends
    if (this.calculateMoodTrend(entries) === 'improving') {
      protectiveFactors.push('Improving mood trend');
    }
    
    // Check for therapy engagement
    const recentSessions = this.getRecentTherapySessions(30);
    if (recentSessions.length >= 4) {
      protectiveFactors.push('Regular therapy engagement');
    }
    
    return protectiveFactors;
  }

  // Generate recommendations
  private generateRecommendations(
    moodTrend: string,
    stressLevel: string,
    riskFactors: string[]
  ): string[] {
    const recommendations: string[] = [];
    
    // Mood-based recommendations
    if (moodTrend === 'declining') {
      recommendations.push('Consider increasing therapy session frequency');
      recommendations.push('Try mood-boosting activities like exercise or socializing');
    }
    
    // Stress-based recommendations
    if (stressLevel === 'high' || stressLevel === 'critical') {
      recommendations.push('Practice stress-reduction techniques like deep breathing');
      recommendations.push('Consider mindfulness or meditation exercises');
      recommendations.push('Ensure adequate sleep and rest');
    }
    
    // Risk factor-based recommendations
    if (riskFactors.includes('Persistently low mood')) {
      recommendations.push('Seek professional mental health support');
      recommendations.push('Consider medication evaluation with a psychiatrist');
    }
    
    if (riskFactors.includes('High anxiety levels')) {
      recommendations.push('Practice anxiety management techniques');
      recommendations.push('Consider cognitive behavioral therapy for anxiety');
    }
    
    if (riskFactors.includes('Poor sleep quality')) {
      recommendations.push('Establish a consistent sleep schedule');
      recommendations.push('Create a relaxing bedtime routine');
      recommendations.push('Avoid screens before bedtime');
    }
    
    // General recommendations
    recommendations.push('Maintain regular therapy sessions');
    recommendations.push('Keep a mood journal to track patterns');
    recommendations.push('Engage in regular physical activity');
    
    return recommendations;
  }

  // Detect patterns
  private detectPatterns(entries: MoodEntry[]): InsightPattern[] {
    const patterns: InsightPattern[] = [];
    
    if (entries.length < 7) return patterns;
    
    // Weekly pattern detection
    const weeklyPattern = this.detectWeeklyPattern(entries);
    if (weeklyPattern) patterns.push(weeklyPattern);
    
    // Correlation patterns
    const correlationPatterns = this.detectCorrelationPatterns(entries);
    patterns.push(...correlationPatterns);
    
    // Anomaly detection
    const anomalies = this.detectAnomalies(entries);
    patterns.push(...anomalies);
    
    return patterns;
  }

  // Detect weekly patterns
  private detectWeeklyPattern(entries: MoodEntry[]): InsightPattern | null {
    const weeklyAverages: { [key: string]: number[] } = {};
    
    entries.forEach(entry => {
      const dayOfWeek = new Date(entry.timestamp).toLocaleDateString('en-US', { weekday: 'long' });
      if (!weeklyAverages[dayOfWeek]) weeklyAverages[dayOfWeek] = [];
      weeklyAverages[dayOfWeek].push(entry.mood);
    });
    
    const dayAverages: { [key: string]: number } = {};
    Object.keys(weeklyAverages).forEach(day => {
      dayAverages[day] = weeklyAverages[day].reduce((sum, mood) => sum + mood, 0) / weeklyAverages[day].length;
    });
    
    const days = Object.keys(dayAverages);
    if (days.length < 3) return null;
    
    const sortedDays = days.sort((a, b) => dayAverages[a] - dayAverages[b]);
    const lowestDay = sortedDays[0];
    const highestDay = sortedDays[sortedDays.length - 1];
    const difference = dayAverages[highestDay] - dayAverages[lowestDay];
    
    if (difference > 1.5) {
      return {
        type: 'trend',
        title: 'Weekly Mood Pattern',
        description: `Your mood tends to be lowest on ${lowestDay}s and highest on ${highestDay}s`,
        confidence: 0.7,
        severity: 'medium',
        recommendations: [
          `Plan enjoyable activities for ${lowestDay}s`,
          `Use ${highestDay}s for challenging tasks`,
          'Consider what makes certain days better or worse'
        ],
        data: { dayAverages, lowestDay, highestDay, difference }
      };
    }
    
    return null;
  }

  // Detect correlation patterns
  private detectCorrelationPatterns(entries: MoodEntry[]): InsightPattern[] {
    const patterns: InsightPattern[] = [];
    
    // Sleep-Mood correlation
    const sleepMoodCorrelation = this.calculateCorrelation(
      entries.map(e => e.sleep),
      entries.map(e => e.mood)
    );
    
    if (Math.abs(sleepMoodCorrelation) > 0.5) {
      patterns.push({
        type: 'correlation',
        title: 'Sleep-Mood Correlation',
        description: sleepMoodCorrelation > 0 
          ? 'Better sleep is associated with better mood'
          : 'Poor sleep is associated with better mood',
        confidence: Math.abs(sleepMoodCorrelation),
        severity: 'medium',
        recommendations: [
          'Prioritize good sleep hygiene',
          'Track sleep quality and mood together',
          'Consider sleep as a mood management tool'
        ],
        data: { correlation: sleepMoodCorrelation }
      });
    }
    
    // Stress-Anxiety correlation
    const stressAnxietyCorrelation = this.calculateCorrelation(
      entries.map(e => e.stress),
      entries.map(e => e.anxiety)
    );
    
    if (Math.abs(stressAnxietyCorrelation) > 0.6) {
      patterns.push({
        type: 'correlation',
        title: 'Stress-Anxiety Correlation',
        description: 'High stress levels are associated with high anxiety levels',
        confidence: Math.abs(stressAnxietyCorrelation),
        severity: 'high',
        recommendations: [
          'Focus on stress management techniques',
          'Practice anxiety reduction exercises',
          'Consider professional help for stress management'
        ],
        data: { correlation: stressAnxietyCorrelation }
      });
    }
    
    return patterns;
  }

  // Detect anomalies
  private detectAnomalies(entries: MoodEntry[]): InsightPattern[] {
    const patterns: InsightPattern[] = [];
    
    if (entries.length < 5) return patterns;
    
    const moods = entries.map(e => e.mood);
    const mean = moods.reduce((sum, mood) => sum + mood, 0) / moods.length;
    const variance = moods.reduce((sum, mood) => sum + Math.pow(mood - mean, 2), 0) / moods.length;
    const stdDev = Math.sqrt(variance);
    
    entries.forEach((entry, index) => {
      const zScore = Math.abs(entry.mood - mean) / stdDev;
      
      if (zScore > 2) {
        patterns.push({
          type: 'anomaly',
          title: 'Mood Anomaly Detected',
          description: `Unusual mood level of ${entry.mood} on ${new Date(entry.timestamp).toLocaleDateString()}`,
          confidence: Math.min(0.9, zScore / 3),
          severity: entry.mood < mean ? 'high' : 'medium',
          recommendations: [
            'Reflect on what might have caused this unusual mood',
            'Consider if this was a one-time event or part of a pattern',
            'Reach out for support if needed'
          ],
          data: { entry, zScore, mean, stdDev }
        });
      }
    });
    
    return patterns;
  }

  // Calculate correlation coefficient
  private calculateCorrelation(x: number[], y: number[]): number {
    if (x.length !== y.length || x.length === 0) return 0;
    
    const n = x.length;
    const sumX = x.reduce((sum, val) => sum + val, 0);
    const sumY = y.reduce((sum, val) => sum + val, 0);
    const sumXY = x.reduce((sum, val, i) => sum + val * y[i], 0);
    const sumXX = x.reduce((sum, val) => sum + val * val, 0);
    const sumYY = y.reduce((sum, val) => sum + val * val, 0);
    
    const numerator = n * sumXY - sumX * sumY;
    const denominator = Math.sqrt((n * sumXX - sumX * sumX) * (n * sumYY - sumY * sumY));
    
    return denominator === 0 ? 0 : numerator / denominator;
  }

  // Get recent therapy sessions
  private getRecentTherapySessions(days: number): TherapySession[] {
    const cutoffDate = Date.now() - (days * 24 * 60 * 60 * 1000);
    return this.therapySessions.filter(session => session.startTime >= cutoffDate);
  }

  // Analyze patterns (called when new data is added)
  private analyzePatterns(): void {
    this.patterns = this.detectPatterns(this.moodEntries);
  }

  // Get all patterns
  getPatterns(): InsightPattern[] {
    return [...this.patterns];
  }

  // Get mood statistics
  getMoodStatistics(): {
    totalEntries: number;
    averageMood: number;
    moodRange: { min: number; max: number };
    trend: 'improving' | 'declining' | 'stable';
    riskLevel: 'low' | 'medium' | 'high';
  } {
    if (this.moodEntries.length === 0) {
      return {
        totalEntries: 0,
        averageMood: 5,
        moodRange: { min: 5, max: 5 },
        trend: 'stable',
        riskLevel: 'low'
      };
    }
    
    const moods = this.moodEntries.map(e => e.mood);
    const averageMood = moods.reduce((sum, mood) => sum + mood, 0) / moods.length;
    const moodRange = { min: Math.min(...moods), max: Math.max(...moods) };
    const trend = this.calculateMoodTrend(this.moodEntries);
    
    let riskLevel: 'low' | 'medium' | 'high' = 'low';
    if (averageMood <= 3) riskLevel = 'high';
    else if (averageMood <= 5) riskLevel = 'medium';
    
    return {
      totalEntries: this.moodEntries.length,
      averageMood,
      moodRange,
      trend,
      riskLevel
    };
  }
}

// Create singleton instance
export const insightsEngine = new InsightsEngine();
export default insightsEngine;