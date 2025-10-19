import { useState, useEffect, useCallback, useRef } from 'react';
import { EEGData, BioSignalState, BCIEvent } from '@/lib/bci/eegProcessor';
import { eegProcessor } from '@/lib/bci/eegProcessor';

// Web Bluetooth API type declarations
declare global {
  interface BluetoothDevice {
    id: string;
    name?: string;
    gatt?: BluetoothRemoteGATTServer;
  }
  
  interface BluetoothRemoteGATTServer {
    device: BluetoothDevice;
    connected: boolean;
    connect(): Promise<BluetoothRemoteGATTServer>;
    disconnect(): void;
    getPrimaryService(service: string): Promise<BluetoothRemoteGATTService>;
  }
  
  interface BluetoothRemoteGATTService {
    device: BluetoothDevice;
    uuid: string;
    getCharacteristic(characteristic: string): Promise<BluetoothRemoteGATTCharacteristic>;
  }
  
  interface BluetoothRemoteGATTCharacteristic {
    service: BluetoothRemoteGATTService;
    uuid: string;
    value?: DataView;
    readValue(): Promise<DataView>;
    writeValue(value: BufferSource): Promise<void>;
    startNotifications(): Promise<BluetoothRemoteGATTCharacteristic>;
    stopNotifications(): Promise<BluetoothRemoteGATTCharacteristic>;
    addEventListener(type: string, listener: (event: any) => void): void;
    removeEventListener(type: string, listener: (event: any) => void): void;
  }
  
  interface Navigator {
    bluetooth?: {
      requestDevice(options: RequestDeviceOptions): Promise<BluetoothDevice>;
      getAvailability(): Promise<boolean>;
    };
  }
  
  interface RequestDeviceOptions {
    filters?: BluetoothLEScanFilter[];
    optionalServices?: string[];
    acceptAllDevices?: boolean;
  }
  
  interface BluetoothLEScanFilter {
    services?: string[];
    name?: string;
    namePrefix?: string;
  }
}

export interface EEGState {
  isConnected: boolean;
  isRecording: boolean;
  data: EEGData | null;
  bioState: BioSignalState | null;
  quality: number;
  artifacts: string[];
  error: string | null;
}

export interface EEGConfig {
  sampleRate: number;
  channels: string[];
  enableArtifactDetection: boolean;
  enableBioStateAnalysis: boolean;
}

export const useEEG = (config: EEGConfig = {
  sampleRate: 256,
  channels: ['AF7', 'AF8', 'TP9', 'TP10'],
  enableArtifactDetection: true,
  enableBioStateAnalysis: true
}) => {
  const [state, setState] = useState<EEGState>({
    isConnected: false,
    isRecording: false,
    data: null,
    bioState: null,
    quality: 0,
    artifacts: [],
    error: null
  });

  const [events, setEvents] = useState<BCIEvent[]>([]);
  const [isSupported, setIsSupported] = useState(false);
  const deviceRef = useRef<BluetoothDevice | null>(null);
  const characteristicRef = useRef<BluetoothRemoteGATTCharacteristic | null>(null);

  // Check if WebBLE is supported
  useEffect(() => {
    const checkSupport = () => {
      const supported = 'bluetooth' in navigator && 'serviceWorker' in navigator;
      setIsSupported(supported);
      
      if (!supported) {
        setState(prev => ({
          ...prev,
          error: 'WebBLE not supported in this browser'
        }));
      }
    };

    checkSupport();
  }, []);

  // Connect to EEG device
  const connect = useCallback(async (): Promise<boolean> => {
    if (!isSupported) {
      setState(prev => ({ ...prev, error: 'WebBLE not supported' }));
      return false;
    }

    try {
      setState(prev => ({ ...prev, error: null }));

      // Request Bluetooth device
      if (!navigator.bluetooth) {
        throw new Error('Web Bluetooth API not supported');
      }
      
      const device = await navigator.bluetooth.requestDevice({
        acceptAllDevices: true,
        optionalServices: ['battery_service', 'device_information']
      });

      deviceRef.current = device;

      // Connect to GATT server
      const server = await device.gatt?.connect();
      if (!server) {
        throw new Error('Failed to connect to GATT server');
      }

      // Get primary service (this would be device-specific)
      const service = await server.getPrimaryService('battery_service');
      const characteristic = await service.getCharacteristic('battery_level');
      characteristicRef.current = characteristic;

      // Set up data listener
      characteristic.addEventListener('characteristicvaluechanged', handleDataReceived);
      await characteristic.startNotifications();

      setState(prev => ({
        ...prev,
        isConnected: true,
        error: null
      }));

      return true;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      setState(prev => ({
        ...prev,
        error: `Connection failed: ${errorMessage}`,
        isConnected: false
      }));
      return false;
    }
  }, [isSupported]);

  // Disconnect from device
  const disconnect = useCallback(async () => {
    try {
      if (characteristicRef.current) {
        await characteristicRef.current.stopNotifications();
        characteristicRef.current.removeEventListener('characteristicvaluechanged', handleDataReceived);
      }

      if (deviceRef.current?.gatt?.connected) {
        deviceRef.current.gatt.disconnect();
      }

      setState(prev => ({
        ...prev,
        isConnected: false,
        isRecording: false,
        data: null,
        bioState: null
      }));

      deviceRef.current = null;
      characteristicRef.current = null;
    } catch (error) {
      console.error('Disconnect error:', error);
    }
  }, []);

  // Start recording
  const startRecording = useCallback(() => {
    if (!state.isConnected) {
      setState(prev => ({ ...prev, error: 'Not connected to device' }));
      return;
    }

    setState(prev => ({ ...prev, isRecording: true, error: null }));
    
    // Start mock data generation for demo purposes
    startMockDataGeneration();
  }, [state.isConnected]);

  // Stop recording
  const stopRecording = useCallback(() => {
    setState(prev => ({ ...prev, isRecording: false }));
    stopMockDataGeneration();
  }, []);

  // Handle received data
  const handleDataReceived = useCallback((event: Event) => {
    const characteristic = event.target as unknown as BluetoothRemoteGATTCharacteristic;
    const value = characteristic.value;
    
    if (!value) return;

    // Convert data to array (device-specific implementation)
    const dataArray = new Uint8Array(value.buffer);
    const eegData = convertToEEGData(dataArray);
    
    setState(prev => ({
      ...prev,
      data: eegData,
      quality: eegData.quality,
      artifacts: eegData.artifacts
    }));

    // Analyze bio-signal state
    if (config.enableBioStateAnalysis) {
      const bioState = eegProcessor.analyzeBioSignalState(eegData);
      setState(prev => ({ ...prev, bioState }));
    }

    // Process stream for events
    eegProcessor.processStream(Array.from(dataArray), config.channels);
  }, [config]);

  // Convert raw data to EEG format (device-specific)
  const convertToEEGData = (data: Uint8Array): EEGData => {
    // This is a mock implementation - real implementation would be device-specific
    const mockData = Array.from(data).map(() => Math.random() * 100 - 50);
    return eegProcessor.processEEGData(mockData, config.channels);
  };

  // Mock data generation for demo
  const mockIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const startMockDataGeneration = useCallback(() => {
    if (mockIntervalRef.current) return;

    mockIntervalRef.current = setInterval(() => {
      // Generate mock EEG data
      const mockData = Array.from({ length: config.channels.length }, () => 
        Math.random() * 100 - 50 + Math.sin(Date.now() / 1000) * 20
      );

      const eegData = eegProcessor.processEEGData(mockData, config.channels);
      
      setState(prev => ({
        ...prev,
        data: eegData,
        quality: eegData.quality,
        artifacts: eegData.artifacts
      }));

      // Analyze bio-signal state
      if (config.enableBioStateAnalysis) {
        const bioState = eegProcessor.analyzeBioSignalState(eegData);
        setState(prev => ({ ...prev, bioState }));
      }

      // Process stream for events
      eegProcessor.processStream(mockData, config.channels);
    }, 1000 / config.sampleRate * 10); // 10x slower for demo
  }, [config]);

  const stopMockDataGeneration = useCallback(() => {
    if (mockIntervalRef.current) {
      clearInterval(mockIntervalRef.current);
      mockIntervalRef.current = null;
    }
  }, []);

  // Set up event listeners
  useEffect(() => {
    const handleBCIEvent = (event: BCIEvent) => {
      setEvents(prev => [event, ...prev.slice(0, 99)]); // Keep last 100 events
    };

    eegProcessor.addEventListener('focus_change', handleBCIEvent);
    eegProcessor.addEventListener('meditation_state', handleBCIEvent);
    eegProcessor.addEventListener('stress_alert', handleBCIEvent);
    eegProcessor.addEventListener('artifact_detected', handleBCIEvent);

    return () => {
      eegProcessor.removeEventListener('focus_change', handleBCIEvent);
      eegProcessor.removeEventListener('meditation_state', handleBCIEvent);
      eegProcessor.removeEventListener('stress_alert', handleBCIEvent);
      eegProcessor.removeEventListener('artifact_detected', handleBCIEvent);
    };
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopMockDataGeneration();
      disconnect();
    };
  }, [disconnect, stopMockDataGeneration]);

  return {
    ...state,
    isSupported,
    events,
    connect,
    disconnect,
    startRecording,
    stopRecording,
    clearEvents: () => setEvents([])
  };
};

export default useEEG;