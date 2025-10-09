import { useState, useEffect, useCallback } from 'react';

interface TensorFlowModel {
  loaded: boolean;
  loading: boolean;
  error: string | null;
  model: any;
}

interface TensorFlowLazyOptions {
  enableWebGL?: boolean;
  enableWASM?: boolean;
  enableCPU?: boolean;
  onLoadStart?: () => void;
  onLoadComplete?: () => void;
  onError?: (error: string) => void;
}

export function useTensorFlowLazy(options: TensorFlowLazyOptions = {}) {
  const [tf, setTf] = useState<any>(null);
  const [models, setModels] = useState<Record<string, TensorFlowModel>>({});
  const [isInitialized, setIsInitialized] = useState(false);

  const {
    enableWebGL = true,
    enableWASM = true,
    enableCPU = true,
    onLoadStart,
    onError
  } = options;

  // Initialize TensorFlow.js
  const initializeTensorFlow = useCallback(async () => {
    if (isInitialized || tf) return tf;

    try {
      onLoadStart?.();
      
      // Dynamically import TensorFlow.js
      const tfModule = await import('@tensorflow/tfjs');
      const tfCore = tfModule.default || tfModule;
      
      // Set backend based on availability
      if (enableWebGL) {
        try {
          await import('@tensorflow/tfjs-backend-webgl');
          await tfCore.setBackend('webgl');
        } catch (e) {
          console.warn('WebGL backend not available, falling back to WASM');
        }
      }
      
      if (enableWASM && tfCore.getBackend() !== 'webgl') {
        try {
          await import('@tensorflow/tfjs-backend-wasm');
          await tfCore.setBackend('wasm');
        } catch (e) {
          console.warn('WASM backend not available, falling back to CPU');
        }
      }
      
      // Initialize TensorFlow
      await tfCore.ready();
      
      setTf(tfCore);
      setIsInitialized(true);
      
      return tfCore;
    } catch (error) {
      const errorMessage = `Failed to initialize TensorFlow.js: ${error}`;
      console.error(errorMessage);
      onError?.(errorMessage);
      throw error;
    }
  }, [isInitialized, tf, enableWebGL, enableWASM, enableCPU, onLoadStart, onError]);

  // Load a specific model
  const loadModel = useCallback(async (modelName: string, modelLoader: () => Promise<any>) => {
    if (!tf) {
      await initializeTensorFlow();
    }

    // Check if model is already loaded or loading
    if (models[modelName]?.loading || models[modelName]?.loaded) {
      return models[modelName];
    }

    // Set loading state
    setModels(prev => ({
      ...prev,
      [modelName]: {
        loaded: false,
        loading: true,
        error: null,
        model: null
      }
    }));

    try {
      const model = await modelLoader();
      
      setModels(prev => ({
        ...prev,
        [modelName]: {
          loaded: true,
          loading: false,
          error: null,
          model
        }
      }));

      return model;
    } catch (error) {
      const errorMessage = `Failed to load model ${modelName}: ${error}`;
      console.error(errorMessage);
      
      setModels(prev => ({
        ...prev,
        [modelName]: {
          loaded: false,
          loading: false,
          error: errorMessage,
          model: null
        }
      }));

      onError?.(errorMessage);
      throw error;
    }
  }, [tf, models, initializeTensorFlow, onError]);

  // Load COCO-SSD model
  const loadCOCOSSD = useCallback(async () => {
    return loadModel('coco-ssd', async () => {
      const cocoSsd = await import('@tensorflow-models/coco-ssd');
      return await cocoSsd.load();
    });
  }, [loadModel]);

  // Load MobileNet model
  const loadMobileNet = useCallback(async () => {
    return loadModel('mobilenet', async () => {
      const mobilenet = await import('@tensorflow-models/mobilenet');
      return await mobilenet.load();
    });
  }, [loadModel]);

  // Load PoseNet model
  const loadPoseNet = useCallback(async () => {
    return loadModel('posenet', async () => {
      const posenet = await import('@tensorflow-models/posenet');
      return await posenet.load();
    });
  }, [loadModel]);

  // Get model status
  const getModelStatus = useCallback((modelName: string) => {
    return models[modelName] || {
      loaded: false,
      loading: false,
      error: null,
      model: null
    };
  }, [models]);

  // Check if any model is loading
  const isLoading = Object.values(models).some(model => model.loading);

  // Check if all models are loaded
  const allModelsLoaded = Object.values(models).every(model => model.loaded);

  // Get total bundle size impact
  const getBundleSizeImpact = useCallback(() => {
    const loadedModels = Object.values(models).filter(model => model.loaded);
    return {
      modelsLoaded: loadedModels.length,
      totalModels: Object.keys(models).length,
      estimatedSize: loadedModels.length * 50 // Rough estimate in KB
    };
  }, [models]);

  return {
    tf,
    isInitialized,
    models,
    isLoading,
    allModelsLoaded,
    initializeTensorFlow,
    loadModel,
    loadCOCOSSD,
    loadMobileNet,
    loadPoseNet,
    getModelStatus,
    getBundleSizeImpact
  };
}