export interface WebcamBioData {
  timestamp: number;
  heartRate: number;
  heartRateVariability: number;
  stressLevel: number;
  pupilDilation: number;
  microExpressions: {
    joy: number;
    sadness: number;
    anger: number;
    fear: number;
    surprise: number;
    disgust: number;
  };
  cognitiveLoad: number;
  quality: number;
}

class WebcamBioProcessor {
  private video: HTMLVideoElement | null = null;
  private canvas: HTMLCanvasElement | null = null;
  private ctx: CanvasRenderingContext2D | null = null;
  private isProcessing = false;
  private frameCount = 0;
  private lastHeartRate = 0;
  private heartRateHistory: number[] = [];
  private pupilHistory: number[] = [];

  async initialize(): Promise<boolean> {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { 
          width: 640, 
          height: 480,
          frameRate: 30 
        } 
      });
      
      this.video = document.createElement('video');
      this.video.srcObject = stream;
      this.video.play();
      
      this.canvas = document.createElement('canvas');
      this.canvas.width = 640;
      this.canvas.height = 480;
      this.ctx = this.canvas.getContext('2d');
      
      return true;
    } catch (error) {
      console.error('Failed to initialize webcam:', error);
      return false;
    }
  }

  startProcessing(): void {
    if (!this.video || !this.canvas || !this.ctx) return;
    
    this.isProcessing = true;
    this.processFrame();
  }

  stopProcessing(): void {
    this.isProcessing = false;
  }

  private processFrame(): void {
    if (!this.isProcessing || !this.video || !this.canvas || !this.ctx) return;
    
    this.ctx.drawImage(this.video, 0, 0, this.canvas.width, this.canvas.height);
    const imageData = this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height);
    
    const bioData = this.analyzeImageData(imageData);
    this.frameCount++;
    
    // Process every 5th frame for performance
    if (this.frameCount % 5 === 0) {
      this.onBioDataUpdate?.(bioData);
    }
    
    requestAnimationFrame(() => this.processFrame());
  }

  private analyzeImageData(imageData: ImageData): WebcamBioData {
    const { data, width, height } = imageData;
    
    // Extract face region (simplified - in real implementation, use face detection)
    const faceRegion = this.extractFaceRegion(data, width, height);
    
    // Calculate heart rate from color changes
    const heartRate = this.calculateHeartRate(faceRegion);
    
    // Calculate pupil dilation
    const pupilDilation = this.calculatePupilDilation(faceRegion);
    
    // Detect micro-expressions
    const microExpressions = this.detectMicroExpressions(faceRegion);
    
    // Calculate cognitive load
    const cognitiveLoad = this.calculateCognitiveLoad(faceRegion);
    
    // Calculate stress level
    const stressLevel = this.calculateStressLevel(heartRate, pupilDilation, microExpressions);
    
    // Calculate heart rate variability
    const heartRateVariability = this.calculateHRV(heartRate);
    
    // Calculate overall quality
    const quality = this.calculateQuality(faceRegion);

    return {
      timestamp: Date.now(),
      heartRate,
      heartRateVariability,
      stressLevel,
      pupilDilation,
      microExpressions,
      cognitiveLoad,
      quality
    };
  }

  private extractFaceRegion(data: Uint8ClampedArray, width: number, height: number): Uint8ClampedArray {
    // Simplified face region extraction
    // In real implementation, use face detection API
    const centerX = Math.floor(width / 2);
    const centerY = Math.floor(height / 2);
    const faceWidth = Math.floor(width * 0.3);
    const faceHeight = Math.floor(height * 0.4);
    
    const startX = centerX - Math.floor(faceWidth / 2);
    const startY = centerY - Math.floor(faceHeight / 2);
    
    const faceData = new Uint8ClampedArray(faceWidth * faceHeight * 4);
    let faceIndex = 0;
    
    for (let y = startY; y < startY + faceHeight; y++) {
      for (let x = startX; x < startX + faceWidth; x++) {
        const pixelIndex = (y * width + x) * 4;
        faceData[faceIndex] = data[pixelIndex];     // R
        faceData[faceIndex + 1] = data[pixelIndex + 1]; // G
        faceData[faceIndex + 2] = data[pixelIndex + 2]; // B
        faceData[faceIndex + 3] = data[pixelIndex + 3]; // A
        faceIndex += 4;
      }
    }
    
    return faceData;
  }

  private calculateHeartRate(faceRegion: Uint8ClampedArray): number {
    // Extract green channel for heart rate calculation
    const greenValues: number[] = [];
    for (let i = 1; i < faceRegion.length; i += 4) {
      greenValues.push(faceRegion[i]);
    }
    
    // Calculate average green intensity
    const avgGreen = greenValues.reduce((sum, val) => sum + val, 0) / greenValues.length;
    
    // Store in history
    this.heartRateHistory.push(avgGreen);
    if (this.heartRateHistory.length > 150) { // 5 seconds at 30fps
      this.heartRateHistory.shift();
    }
    
    if (this.heartRateHistory.length < 30) {
      return this.lastHeartRate;
    }
    
    // Calculate heart rate from green channel variation
    const variation = this.calculateVariation(new Uint8ClampedArray(this.heartRateHistory));
    const heartRate = 60 + (variation * 20); // Convert to BPM
    
    this.lastHeartRate = Math.max(40, Math.min(200, heartRate));
    return this.lastHeartRate;
  }

  private calculatePupilDilation(faceRegion: Uint8ClampedArray): number {
    // Simplified pupil detection (in real implementation, use eye detection)
    const eyeRegion = this.extractEyeRegion(faceRegion);
    const pupilSize = this.detectPupilSize(eyeRegion);
    
    this.pupilHistory.push(pupilSize);
    if (this.pupilHistory.length > 30) {
      this.pupilHistory.shift();
    }
    
    const avgPupilSize = this.pupilHistory.reduce((sum, val) => sum + val, 0) / this.pupilHistory.length;
    return Math.min(1, Math.max(0, avgPupilSize / 100));
  }

  private extractEyeRegion(faceRegion: Uint8ClampedArray): Uint8ClampedArray {
    // Extract upper portion of face for eye region
    const eyeHeight = Math.floor(faceRegion.length / 4);
    return faceRegion.slice(0, eyeHeight);
  }

  private detectPupilSize(eyeRegion: Uint8ClampedArray): number {
    // Simplified pupil size detection based on dark regions
    let darkPixels = 0;
    for (let i = 0; i < eyeRegion.length; i += 4) {
      const brightness = (eyeRegion[i] + eyeRegion[i + 1] + eyeRegion[i + 2]) / 3;
      if (brightness < 50) {
        darkPixels++;
      }
    }
    return darkPixels;
  }

  private detectMicroExpressions(faceRegion: Uint8ClampedArray): WebcamBioData['microExpressions'] {
    // Simplified emotion detection based on color patterns
    // In real implementation, use machine learning models
    
    const avgRed = this.calculateAverageChannel(faceRegion, 0);
    const avgGreen = this.calculateAverageChannel(faceRegion, 1);
    const avgBlue = this.calculateAverageChannel(faceRegion, 2);
    
    // Basic emotion mapping (simplified)
    const joy = Math.min(1, Math.max(0, (avgRed - 100) / 50));
    const sadness = Math.min(1, Math.max(0, (100 - avgRed) / 50));
    const anger = Math.min(1, Math.max(0, (avgRed - avgBlue) / 100));
    const fear = Math.min(1, Math.max(0, (avgBlue - avgRed) / 100));
    const surprise = Math.min(1, Math.max(0, (avgGreen - avgRed) / 100));
    const disgust = Math.min(1, Math.max(0, (avgRed - avgGreen) / 100));
    
    return { joy, sadness, anger, fear, surprise, disgust };
  }

  private calculateCognitiveLoad(faceRegion: Uint8ClampedArray): number {
    // Cognitive load based on micro-movements and color changes
    const variation = this.calculateVariation(faceRegion);
    return Math.min(1, Math.max(0, variation / 100));
  }

  private calculateStressLevel(heartRate: number, pupilDilation: number, microExpressions: WebcamBioData['microExpressions']): number {
    const hrStress = Math.min(1, Math.max(0, (heartRate - 60) / 40));
    const pupilStress = pupilDilation;
    const emotionStress = (microExpressions.anger + microExpressions.fear + microExpressions.sadness) / 3;
    
    return (hrStress + pupilStress + emotionStress) / 3;
  }

  private calculateHRV(heartRate: number): number {
    if (this.heartRateHistory.length < 10) return 0;
    
    // Calculate standard deviation of heart rate as HRV proxy
    const mean = this.heartRateHistory.reduce((sum, val) => sum + val, 0) / this.heartRateHistory.length;
    const variance = this.heartRateHistory.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / this.heartRateHistory.length;
    return Math.sqrt(variance);
  }

  private calculateQuality(faceRegion: Uint8ClampedArray): number {
    // Calculate image quality based on brightness and contrast
    const brightness = this.calculateAverageBrightness(faceRegion);
    const contrast = this.calculateContrast(faceRegion);
    
    let quality = 1.0;
    
    // Reduce quality for poor lighting
    if (brightness < 50 || brightness > 200) {
      quality -= 0.3;
    }
    
    // Reduce quality for low contrast
    if (contrast < 30) {
      quality -= 0.2;
    }
    
    return Math.max(0, Math.min(1, quality));
  }

  private calculateAverageChannel(data: Uint8ClampedArray, channel: number): number {
    let sum = 0;
    let count = 0;
    
    for (let i = channel; i < data.length; i += 4) {
      sum += data[i];
      count++;
    }
    
    return sum / count;
  }

  private calculateVariation(data: Uint8ClampedArray): number {
    const values: number[] = [];
    for (let i = 0; i < data.length; i += 4) {
      values.push((data[i] + data[i + 1] + data[i + 2]) / 3);
    }
    
    const mean = values.reduce((sum, val) => sum + val, 0) / values.length;
    const variance = values.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / values.length;
    return Math.sqrt(variance);
  }

  private calculateAverageBrightness(data: Uint8ClampedArray): number {
    let sum = 0;
    let count = 0;
    
    for (let i = 0; i < data.length; i += 4) {
      sum += (data[i] + data[i + 1] + data[i + 2]) / 3;
      count++;
    }
    
    return sum / count;
  }

  private calculateContrast(data: Uint8ClampedArray): number {
    const values: number[] = [];
    for (let i = 0; i < data.length; i += 4) {
      values.push((data[i] + data[i + 1] + data[i + 2]) / 3);
    }
    
    const min = Math.min(...values);
    const max = Math.max(...values);
    return max - min;
  }

  // Event callback
  onBioDataUpdate?: (data: WebcamBioData) => void;

  // Cleanup
  cleanup(): void {
    this.stopProcessing();
    if (this.video && this.video.srcObject) {
      const stream = this.video.srcObject as MediaStream;
      stream.getTracks().forEach(track => track.stop());
    }
  }
}

export const webcamBioProcessor = new WebcamBioProcessor();
export default webcamBioProcessor;