import { useState, useCallback, useEffect } from 'react';
import { worldBuilderAI } from '../lib/services/world-builder-ai-service';
import {
  NPCGenerationRequest,
  LocationGenerationRequest,
  AdventureGenerationRequest,
  TerrainGenerationRequest,
  GeneratedNPC,
  GeneratedLocation,
  GeneratedAdventure,
  GeneratedTerrain,
  AIServiceResponse,
  // New World Builder Interfaces
  WorldHistoryRequest,
  MonsterGenerationRequest,
  MissionGenerationRequest,
  ObjectGenerationRequest,
  MapGenerationRequest,
  GeneratedWorldHistory,
  GeneratedMonster,
  GeneratedMission,
  GeneratedObject,
  GeneratedMap
} from '../lib/services/world-builder-ai-service';

interface UseWorldBuilderAIReturn {
  // Generation functions
  generateNPC: (request: NPCGenerationRequest) => Promise<AIServiceResponse<GeneratedNPC>>;
  generateLocation: (request: LocationGenerationRequest) => Promise<AIServiceResponse<GeneratedLocation>>;
  generateAdventure: (request: AdventureGenerationRequest) => Promise<AIServiceResponse<GeneratedAdventure>>;
  generateTerrain: (request: TerrainGenerationRequest) => Promise<AIServiceResponse<GeneratedTerrain>>;
  
  // New World Builder Generation functions
  generateWorldHistory: (request: WorldHistoryRequest) => Promise<AIServiceResponse<GeneratedWorldHistory>>;
  generateMonster: (request: MonsterGenerationRequest) => Promise<AIServiceResponse<GeneratedMonster>>;
  generateMission: (request: MissionGenerationRequest) => Promise<AIServiceResponse<GeneratedMission>>;
  generateObject: (request: ObjectGenerationRequest) => Promise<AIServiceResponse<GeneratedObject>>;
  generateMap: (request: MapGenerationRequest) => Promise<AIServiceResponse<GeneratedMap>>;
  
  // Service management
  checkServiceHealth: () => Promise<{ [key: string]: boolean }>;
  reinitializeServices: () => Promise<void>;
  
  // State
  isInitialized: boolean;
  isLoading: boolean;
  error: string | null;
  serviceHealth: { [key: string]: boolean } | null;
  
  // Loading states for individual operations
  loadingStates: {
    npc: boolean;
    location: boolean;
    adventure: boolean;
    terrain: boolean;
    worldHistory: boolean;
    monster: boolean;
    mission: boolean;
    object: boolean;
    map: boolean;
  };
}

export function useWorldBuilderAI(): UseWorldBuilderAIReturn {
  const [isInitialized, setIsInitialized] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [serviceHealth, setServiceHealth] = useState<{ [key: string]: boolean } | null>(null);
  
  const [loadingStates, setLoadingStates] = useState({
    npc: false,
    location: false,
    adventure: false,
    terrain: false,
    worldHistory: false,
    monster: false,
    mission: false,
    object: false,
    map: false
  });

  // Initialize services on first use
  useEffect(() => {
    const initializeServices = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        await worldBuilderAI.initialize();
        setIsInitialized(true);
        
        // Check initial service health
        const health = await worldBuilderAI.checkServiceHealth();
        setServiceHealth(health);
        
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to initialize AI services');
        setIsInitialized(false);
      } finally {
        setIsLoading(false);
      }
    };

    initializeServices();
  }, []);

  const generateNPC = useCallback(async (request: NPCGenerationRequest): Promise<AIServiceResponse<GeneratedNPC>> => {
    try {
      setLoadingStates(prev => ({ ...prev, npc: true }));
      setError(null);
      
      const response = await worldBuilderAI.generateNPC(request);
      
      if (!response.success) {
        throw new Error(response.error || 'Failed to generate NPC');
      }
      
      return response;
      
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to generate NPC';
      setError(errorMessage);
      
      return {
        success: false,
        error: errorMessage
      };
    } finally {
      setLoadingStates(prev => ({ ...prev, npc: false }));
    }
  }, []);

  const generateLocation = useCallback(async (request: LocationGenerationRequest): Promise<AIServiceResponse<GeneratedLocation>> => {
    try {
      setLoadingStates(prev => ({ ...prev, location: true }));
      setError(null);
      
      const response = await worldBuilderAI.generateLocation(request);
      
      if (!response.success) {
        throw new Error(response.error || 'Failed to generate location');
      }
      
      return response;
      
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to generate location';
      setError(errorMessage);
      
      return {
        success: false,
        error: errorMessage
      };
    } finally {
      setLoadingStates(prev => ({ ...prev, location: false }));
    }
  }, []);

  const generateAdventure = useCallback(async (request: AdventureGenerationRequest): Promise<AIServiceResponse<GeneratedAdventure>> => {
    try {
      setLoadingStates(prev => ({ ...prev, adventure: true }));
      setError(null);
      
      const response = await worldBuilderAI.generateAdventure(request);
      
      if (!response.success) {
        throw new Error(response.error || 'Failed to generate adventure');
      }
      
      return response;
      
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to generate adventure';
      setError(errorMessage);
      
      return {
        success: false,
        error: errorMessage
      };
    } finally {
      setLoadingStates(prev => ({ ...prev, adventure: false }));
    }
  }, []);

  const generateTerrain = useCallback(async (request: TerrainGenerationRequest): Promise<AIServiceResponse<GeneratedTerrain>> => {
    try {
      setLoadingStates(prev => ({ ...prev, terrain: true }));
      setError(null);
      
      const response = await worldBuilderAI.generateTerrain(request);
      
      if (!response.success) {
        throw new Error(response.error || 'Failed to generate terrain');
      }
      
      return response;
      
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to generate terrain';
      setError(errorMessage);
      
      return {
        success: false,
        error: errorMessage
      };
    } finally {
      setLoadingStates(prev => ({ ...prev, terrain: false }));
    }
  }, []);

  const checkServiceHealth = useCallback(async (): Promise<{ [key: string]: boolean }> => {
    try {
      setIsLoading(true);
      setError(null);
      
      const health = await worldBuilderAI.checkServiceHealth();
      setServiceHealth(health);
      
      return health;
      
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to check service health';
      setError(errorMessage);
      
      return {};
    } finally {
      setIsLoading(false);
    }
  }, []);

  const reinitializeServices = useCallback(async (): Promise<void> => {
    try {
      setIsLoading(true);
      setError(null);
      setIsInitialized(false);
      
      await worldBuilderAI.reinitialize();
      setIsInitialized(true);
      
      // Check service health after reinitialization
      const health = await worldBuilderAI.checkServiceHealth();
      setServiceHealth(health);
      
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to reinitialize services';
      setError(errorMessage);
      setIsInitialized(false);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // New World Builder Generation Methods
  const generateWorldHistory = useCallback(async (request: WorldHistoryRequest): Promise<AIServiceResponse<GeneratedWorldHistory>> => {
    try {
      setLoadingStates(prev => ({ ...prev, worldHistory: true }));
      setError(null);
      
      const response = await worldBuilderAI.generateWorldHistory(request);
      
      if (!response.success) {
        throw new Error(response.error || 'Failed to generate world history');
      }
      
      return response;
      
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to generate world history';
      setError(errorMessage);
      
      return {
        success: false,
        error: errorMessage
      };
    } finally {
      setLoadingStates(prev => ({ ...prev, worldHistory: false }));
    }
  }, []);

  const generateMonster = useCallback(async (request: MonsterGenerationRequest): Promise<AIServiceResponse<GeneratedMonster>> => {
    try {
      setLoadingStates(prev => ({ ...prev, monster: true }));
      setError(null);
      
      const response = await worldBuilderAI.generateMonster(request);
      
      if (!response.success) {
        throw new Error(response.error || 'Failed to generate monster');
      }
      
      return response;
      
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to generate monster';
      setError(errorMessage);
      
      return {
        success: false,
        error: errorMessage
      };
    } finally {
      setLoadingStates(prev => ({ ...prev, monster: false }));
    }
  }, []);

  const generateMission = useCallback(async (request: MissionGenerationRequest): Promise<AIServiceResponse<GeneratedMission>> => {
    try {
      setLoadingStates(prev => ({ ...prev, mission: true }));
      setError(null);
      
      const response = await worldBuilderAI.generateMission(request);
      
      if (!response.success) {
        throw new Error(response.error || 'Failed to generate mission');
      }
      
      return response;
      
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to generate mission';
      setError(errorMessage);
      
      return {
        success: false,
        error: errorMessage
      };
    } finally {
      setLoadingStates(prev => ({ ...prev, mission: false }));
    }
  }, []);

  const generateObject = useCallback(async (request: ObjectGenerationRequest): Promise<AIServiceResponse<GeneratedObject>> => {
    try {
      setLoadingStates(prev => ({ ...prev, object: true }));
      setError(null);
      
      const response = await worldBuilderAI.generateObject(request);
      
      if (!response.success) {
        throw new Error(response.error || 'Failed to generate object');
      }
      
      return response;
      
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to generate object';
      setError(errorMessage);
      
      return {
        success: false,
        error: errorMessage
      };
    } finally {
      setLoadingStates(prev => ({ ...prev, object: false }));
    }
  }, []);

  const generateMap = useCallback(async (request: MapGenerationRequest): Promise<AIServiceResponse<GeneratedMap>> => {
    try {
      setLoadingStates(prev => ({ ...prev, map: true }));
      setError(null);
      
      const response = await worldBuilderAI.generateMap(request);
      
      if (!response.success) {
        throw new Error(response.error || 'Failed to generate map');
      }
      
      return response;
      
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to generate map';
      setError(errorMessage);
      
      return {
        success: false,
        error: errorMessage
      };
    } finally {
      setLoadingStates(prev => ({ ...prev, map: false }));
    }
  }, []);

  return {
    // Generation functions
    generateNPC,
    generateLocation,
    generateAdventure,
    generateTerrain,
    
    // New World Builder Generation functions
    generateWorldHistory,
    generateMonster,
    generateMission,
    generateObject,
    generateMap,
    
    // Service management
    checkServiceHealth,
    reinitializeServices,
    
    // State
    isInitialized,
    isLoading,
    error,
    serviceHealth,
    loadingStates
  };
}

// Additional hook for batch operations
interface UseBatchAIOperationsReturn {
  generateBatch: (operations: BatchOperation[]) => Promise<BatchResult[]>;
  isBatchProcessing: boolean;
  batchProgress: number;
  batchErrors: string[];
}

export interface BatchOperation {
  type: 'npc' | 'location' | 'adventure' | 'terrain' | 'worldHistory' | 'monster' | 'mission' | 'object' | 'map';
  request: NPCGenerationRequest | LocationGenerationRequest | AdventureGenerationRequest | TerrainGenerationRequest | WorldHistoryRequest | MonsterGenerationRequest | MissionGenerationRequest | ObjectGenerationRequest | MapGenerationRequest;
  id: string;
}

export interface BatchResult {
  id: string;
  type: BatchOperation['type'];
  success: boolean;
  data?: any;
  error?: string;
}

export function useBatchAIOperations(): UseBatchAIOperationsReturn {
  const [isBatchProcessing, setIsBatchProcessing] = useState(false);
  const [batchProgress, setBatchProgress] = useState(0);
  const [batchErrors, setBatchErrors] = useState<string[]>([]);
  
  const { generateNPC, generateLocation, generateAdventure, generateTerrain, generateWorldHistory, generateMonster, generateMission, generateObject, generateMap } = useWorldBuilderAI();

  const generateBatch = useCallback(async (operations: BatchOperation[]): Promise<BatchResult[]> => {
    setIsBatchProcessing(true);
    setBatchProgress(0);
    setBatchErrors([]);
    
    const results: BatchResult[] = [];
    
    for (let i = 0; i < operations.length; i++) {
      const operation = operations[i];
      
      try {
        let response: AIServiceResponse<any>;
        
        switch (operation.type) {
          case 'npc':
            response = await generateNPC(operation.request as NPCGenerationRequest);
            break;
          case 'location':
            response = await generateLocation(operation.request as LocationGenerationRequest);
            break;
          case 'adventure':
            response = await generateAdventure(operation.request as AdventureGenerationRequest);
            break;
          case 'terrain':
            response = await generateTerrain(operation.request as TerrainGenerationRequest);
            break;
          case 'worldHistory':
            response = await generateWorldHistory(operation.request as WorldHistoryRequest);
            break;
          case 'monster':
            response = await generateMonster(operation.request as MonsterGenerationRequest);
            break;
          case 'mission':
            response = await generateMission(operation.request as MissionGenerationRequest);
            break;
          case 'object':
            response = await generateObject(operation.request as ObjectGenerationRequest);
            break;
          case 'map':
            response = await generateMap(operation.request as MapGenerationRequest);
            break;
          default:
            throw new Error(`Unknown operation type: ${operation.type}`);
        }
        
        results.push({
          id: operation.id,
          type: operation.type,
          success: response.success,
          data: response.data,
          error: response.error
        });
        
        if (!response.success) {
          setBatchErrors(prev => [...prev, `${operation.type} ${operation.id}: ${response.error}`]);
        }
        
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        
        results.push({
          id: operation.id,
          type: operation.type,
          success: false,
          error: errorMessage
        });
        
        setBatchErrors(prev => [...prev, `${operation.type} ${operation.id}: ${errorMessage}`]);
      }
      
      // Update progress
      setBatchProgress(Math.round(((i + 1) / operations.length) * 100));
    }
    
    setIsBatchProcessing(false);
    return results;
  }, [generateNPC, generateLocation, generateAdventure, generateTerrain]);

  return {
    generateBatch,
    isBatchProcessing,
    batchProgress,
    batchErrors
  };
}

// Hook for AI service status monitoring
interface UseAIServiceStatusReturn {
  isOnline: boolean;
  services: { [key: string]: boolean };
  lastCheck: Date | null;
  checkStatus: () => Promise<void>;
  autoCheckEnabled: boolean;
  toggleAutoCheck: () => void;
}

export function useAIServiceStatus(): UseAIServiceStatusReturn {
  const [isOnline, setIsOnline] = useState(false);
  const [services, setServices] = useState<{ [key: string]: boolean }>({});
  const [lastCheck, setLastCheck] = useState<Date | null>(null);
  const [autoCheckEnabled, setAutoCheckEnabled] = useState(false);
  
  const { checkServiceHealth } = useWorldBuilderAI();

  const checkStatus = useCallback(async () => {
    try {
      const health = await checkServiceHealth();
      setServices(health);
      setIsOnline(Object.values(health).some(status => status));
      setLastCheck(new Date());
    } catch (error) {
      setServices({});
      setIsOnline(false);
      setLastCheck(new Date());
    }
  }, [checkServiceHealth]);

  const toggleAutoCheck = useCallback(() => {
    setAutoCheckEnabled(prev => !prev);
  }, []);

  // Auto-check every 30 seconds when enabled
  useEffect(() => {
    if (!autoCheckEnabled) return;
    
    const interval = setInterval(checkStatus, 30000);
    return () => clearInterval(interval);
  }, [autoCheckEnabled, checkStatus]);

  return {
    isOnline,
    services,
    lastCheck,
    checkStatus,
    autoCheckEnabled,
    toggleAutoCheck
  };
}
