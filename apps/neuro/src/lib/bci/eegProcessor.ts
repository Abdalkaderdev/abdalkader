export interface EEGData {
  timestamp: number;
  channels: {
    [channel: string]: number;
  };
  frequencies: {
    delta: number;    // 0.5-4 Hz
    theta: number;    // 4-8 Hz
    alpha: number;    // 8-13 Hz
    beta: number;     // 13-30 Hz
    gamma: number;    // 30-100 Hz
  };
  quality: number;    // 0-1 signal quality
  artifacts: string[]; // detected artifacts
}

export interface BioSignalState {
  focus: number;      // 0-1 focus level
  meditation: number; // 0-1 meditation depth
  stress: number;     // 0-1 stress level
  arousal: number;    // 0-1 arousal level
  valence: number;    // -1 to 1 emotional valence
}

export interface BCIEvent {
  type: 'focus_change' | 'meditation_state' | 'stress_alert' | 'artifact_detected';
  timestamp: number;
  data: any;
  confidence: number;
}

class EEGProcessor {
  private sampleRate: number = 256; // Hz
  private bufferSize: number = 1024;
  private dataBuffer: number[][] = [];
  private frequencyBands = {
    delta: [0.5, 4],
    theta: [4, 8],
    alpha: [8, 13],
    beta: [13, 30],
    gamma: [30, 100]
  };
  private eventListeners: Map<string, ((event: BCIEvent) => void)[]> = new Map();

  constructor(sampleRate: number = 256) {
    this.sampleRate = sampleRate;
  }

  // Process raw EEG data and extract features
  processEEGData(rawData: number[], channels: string[]): EEGData {
    const timestamp = Date.now();
    
    // Add to buffer
    this.dataBuffer.push([...rawData]);
    if (this.dataBuffer.length > this.bufferSize) {
      this.dataBuffer.shift();
    }

    // Calculate frequency bands using FFT
    const frequencies = this.calculateFrequencyBands(rawData);
    
    // Detect artifacts
    const artifacts = this.detectArtifacts(rawData);
    
    // Calculate signal quality
    const quality = this.calculateSignalQuality(rawData, artifacts);

    // Create channel data
    const channelData: { [key: string]: number } = {};
    channels.forEach((channel, index) => {
      channelData[channel] = rawData[index] || 0;
    });

    return {
      timestamp,
      channels: channelData,
      frequencies,
      quality,
      artifacts
    };
  }

  // Calculate frequency band power using simplified FFT
  private calculateFrequencyBands(data: number[]): EEGData['frequencies'] {
    // Simplified FFT implementation for real-time processing
    const fft = this.simpleFFT(data);
    const frequencies = fft.map((_, i) => (i * this.sampleRate) / data.length);
    
    const bands = {
      delta: 0,
      theta: 0,
      alpha: 0,
      beta: 0,
      gamma: 0
    };

    // Calculate power in each frequency band
    Object.entries(this.frequencyBands).forEach(([band, [low, high]]) => {
      const startIdx = Math.floor((low * data.length) / this.sampleRate);
      const endIdx = Math.floor((high * data.length) / this.sampleRate);
      
      let power = 0;
      for (let i = startIdx; i < endIdx && i < fft.length; i++) {
        power += Math.abs(fft[i]) ** 2;
      }
      
      bands[band as keyof typeof bands] = power / (endIdx - startIdx);
    });

    return bands;
  }

  // Simplified FFT implementation
  private simpleFFT(data: number[]): number[] {
    const N = data.length;
    const fft = new Array(N).fill(0);
    
    // Cooley-Tukey FFT algorithm (simplified)
    for (let k = 0; k < N; k++) {
      let real = 0;
      let imag = 0;
      
      for (let n = 0; n < N; n++) {
        const angle = -2 * Math.PI * k * n / N;
        real += data[n] * Math.cos(angle);
        imag += data[n] * Math.sin(angle);
      }
      
      fft[k] = Math.sqrt(real * real + imag * imag);
    }
    
    return fft;
  }

  // Detect common EEG artifacts
  private detectArtifacts(data: number[]): string[] {
    const artifacts: string[] = [];
    
    // Eye blink detection (high amplitude, short duration)
    const maxAmplitude = Math.max(...data.map(Math.abs));
    if (maxAmplitude > 100) { // Threshold for eye blinks
      artifacts.push('eye_blink');
    }
    
    // Muscle artifact detection (high frequency content)
    const highFreqPower = this.calculateBandPower(data, 30, 100);
    if (highFreqPower > 50) {
      artifacts.push('muscle_artifact');
    }
    
    // Movement artifact detection (sudden changes)
    const variance = this.calculateVariance(data);
    if (variance > 1000) {
      artifacts.push('movement_artifact');
    }
    
    return artifacts;
  }

  // Calculate signal quality based on artifacts and noise
  private calculateSignalQuality(data: number[], artifacts: string[]): number {
    let quality = 1.0;
    
    // Reduce quality for each artifact
    artifacts.forEach(artifact => {
      switch (artifact) {
        case 'eye_blink':
          quality -= 0.1;
          break;
        case 'muscle_artifact':
          quality -= 0.2;
          break;
        case 'movement_artifact':
          quality -= 0.3;
          break;
      }
    });
    
    // Check for signal saturation
    const maxValue = Math.max(...data.map(Math.abs));
    if (maxValue > 200) {
      quality -= 0.2;
    }
    
    // Check for flat line (no signal)
    const variance = this.calculateVariance(data);
    if (variance < 1) {
      quality -= 0.5;
    }
    
    return Math.max(0, Math.min(1, quality));
  }

  // Calculate power in a specific frequency band
  private calculateBandPower(data: number[], lowFreq: number, highFreq: number): number {
    const fft = this.simpleFFT(data);
    const startIdx = Math.floor((lowFreq * data.length) / this.sampleRate);
    const endIdx = Math.floor((highFreq * data.length) / this.sampleRate);
    
    let power = 0;
    for (let i = startIdx; i < endIdx && i < fft.length; i++) {
      power += fft[i] ** 2;
    }
    
    return power / (endIdx - startIdx);
  }

  // Calculate variance of signal
  private calculateVariance(data: number[]): number {
    const mean = data.reduce((sum, val) => sum + val, 0) / data.length;
    const variance = data.reduce((sum, val) => sum + (val - mean) ** 2, 0) / data.length;
    return variance;
  }

  // Analyze bio-signal state from EEG data
  analyzeBioSignalState(eegData: EEGData): BioSignalState {
    const { frequencies } = eegData;
    
    // Focus calculation (beta/alpha ratio)
    const focus = Math.min(1, Math.max(0, frequencies.beta / (frequencies.alpha + 0.001)));
    
    // Meditation calculation (theta/alpha ratio)
    const meditation = Math.min(1, Math.max(0, frequencies.theta / (frequencies.alpha + 0.001)));
    
    // Stress calculation (beta power)
    const stress = Math.min(1, Math.max(0, frequencies.beta / 100));
    
    // Arousal calculation (beta + gamma)
    const arousal = Math.min(1, Math.max(0, (frequencies.beta + frequencies.gamma) / 200));
    
    // Valence calculation (alpha asymmetry - simplified)
    const valence = Math.tanh((frequencies.alpha - 50) / 25); // -1 to 1
    
    return {
      focus,
      meditation,
      stress,
      arousal,
      valence
    };
  }

  // Add event listener for BCI events
  addEventListener(eventType: string, callback: (event: BCIEvent) => void): void {
    if (!this.eventListeners.has(eventType)) {
      this.eventListeners.set(eventType, []);
    }
    this.eventListeners.get(eventType)!.push(callback);
  }

  // Remove event listener
  removeEventListener(eventType: string, callback: (event: BCIEvent) => void): void {
    const listeners = this.eventListeners.get(eventType);
    if (listeners) {
      const index = listeners.indexOf(callback);
      if (index > -1) {
        listeners.splice(index, 1);
      }
    }
  }

  // Emit BCI event
  private emitEvent(event: BCIEvent): void {
    const listeners = this.eventListeners.get(event.type);
    if (listeners) {
      listeners.forEach(callback => callback(event));
    }
  }

  // Process continuous EEG stream
  processStream(rawData: number[], channels: string[]): void {
    const eegData = this.processEEGData(rawData, channels);
    const bioState = this.analyzeBioSignalState(eegData);
    
    // Emit events based on state changes
    if (bioState.focus > 0.7) {
      this.emitEvent({
        type: 'focus_change',
        timestamp: Date.now(),
        data: { focus: bioState.focus },
        confidence: eegData.quality
      });
    }
    
    if (bioState.meditation > 0.8) {
      this.emitEvent({
        type: 'meditation_state',
        timestamp: Date.now(),
        data: { meditation: bioState.meditation },
        confidence: eegData.quality
      });
    }
    
    if (bioState.stress > 0.8) {
      this.emitEvent({
        type: 'stress_alert',
        timestamp: Date.now(),
        data: { stress: bioState.stress },
        confidence: eegData.quality
      });
    }
    
    if (eegData.artifacts.length > 0) {
      this.emitEvent({
        type: 'artifact_detected',
        timestamp: Date.now(),
        data: { artifacts: eegData.artifacts },
        confidence: 1.0
      });
    }
  }

  // Get current buffer for analysis
  getBuffer(): number[][] {
    return [...this.dataBuffer];
  }

  // Clear buffer
  clearBuffer(): void {
    this.dataBuffer = [];
  }
}

export const eegProcessor = new EEGProcessor();

// Utility functions for BCI applications
export const calculateAttentionScore = (eegData: EEGData): number => {
  const { frequencies } = eegData;
  // Attention is typically associated with beta waves and low theta
  const attention = (frequencies.beta / (frequencies.theta + 0.001)) * 0.5;
  return Math.min(1, Math.max(0, attention));
};

export const calculateMeditationScore = (eegData: EEGData): number => {
  const { frequencies } = eegData;
  // Meditation is associated with high alpha and theta, low beta
  const meditation = (frequencies.alpha + frequencies.theta) / (frequencies.beta + 0.001);
  return Math.min(1, Math.max(0, meditation / 10));
};

export const detectMentalState = (eegData: EEGData): string => {
  const focus = calculateAttentionScore(eegData);
  const meditation = calculateMeditationScore(eegData);
  
  if (meditation > 0.7) return 'meditation';
  if (focus > 0.7) return 'focused';
  if (focus < 0.3) return 'relaxed';
  return 'neutral';
};

export default eegProcessor;