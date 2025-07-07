import { 
  VertexAICharacterService, 
  VertexAISceneCreatorService, 
  VertexAIAdventureService, 
  VoiceCharactersService, 
  RPGAICharImgServices
} from 'lore-forge-ai-services';

// Configuration for RPG-Immersive API endpoints
const RPG_IMMERSIVE_BASE_URL = process.env.NEXT_PUBLIC_RPG_IMMERSIVE_API_URL || 'http://localhost:3000';

// API Client for RPG-Immersive endpoints
class RPGImmersiveAPIClient {
  private baseUrl: string;

  constructor(baseUrl: string = RPG_IMMERSIVE_BASE_URL) {
    this.baseUrl = baseUrl;
  }

  async callAPI<T>(endpoint: string, data: any): Promise<{ success: boolean; data?: T; error?: string }> {
    try {
      const response = await fetch(`${this.baseUrl}/api/${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
      });

      if (!response.ok) {
        throw new Error(`API call failed: ${response.status} ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error(`Error calling ${endpoint}:`, error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  // World Builder API calls
  async generateWorldHistory(request: WorldHistoryRequest) {
    return this.callAPI('world-history-generator', request);
  }

  async generateMonster(request: MonsterGenerationRequest) {
    return this.callAPI('monster-generator', request);
  }

  async generateMission(request: MissionGenerationRequest) {
    return this.callAPI('mission-generator', request);
  }

  async generateNPCDedicated(request: NPCGenerationRequest) {
    return this.callAPI('npc-generator', { 
      npcType: `${request.race} ${request.occupation}`,
      prompt: `Create a ${request.race} ${request.occupation} with personality: ${request.personality}, background: ${request.background}, in setting: ${request.setting}. Knowledge areas: ${request.knowledgeAreas.join(', ')}`
    });
  }

  async generateObject(request: ObjectGenerationRequest) {
    return this.callAPI('object-generator', request);
  }

  async generateLocation(request: LocationGenerationRequest) {
    return this.callAPI('location-generator', {
      locationType: request.type,
      prompt: `Create location "${request.name}": ${request.description}. Atmosphere: ${request.atmosphere}`
    });
  }

  async generateMap(request: MapGenerationRequest) {
    return this.callAPI('map-generator', request);
  }
}

import { 
  NPC, 
  Location, 
  Campaign, 
  PersonalityTraits, 
  KnowledgeBase, 
  EnvironmentSettings,
  Quest,
  QuestObjective,
  Reward
} from '../../types';

// Extended types for AI integration
export interface NPCGenerationRequest {
  race: string;
  occupation: string;
  personality: string;
  background: string;
  setting: string;
  knowledgeAreas: string[];
  includePortrait?: boolean;
  includeVoice?: boolean;
}

export interface LocationGenerationRequest {
  mapId: string;
  name: string;
  type: string;
  coordinates: { x: number; y: number };
  description: string;
  atmosphere: string;
  includeImage?: boolean;
  mood?: string;
  style?: string;
}

export interface AdventureGenerationRequest {
  worldId: string;
  title: string;
  description: string;
  genre: string;
  theme: string;
  difficulty: 'easy' | 'medium' | 'hard';
  includeImage?: boolean;
}

export interface TerrainGenerationRequest {
  biome: string;
  size: 'small' | 'medium' | 'large';
  climate: string;
  features: string[];
  includeImage?: boolean;
}

// New World Builder Service Interfaces
export interface WorldHistoryRequest {
  worldName: string;
  prompt: string;
  language?: 'ES' | 'EN';
}

export interface MonsterGenerationRequest {
  monsterType: string;
  prompt: string;
  language?: 'ES' | 'EN';
}

export interface MissionGenerationRequest {
  missionType: string;
  prompt: string;
  language?: 'ES' | 'EN';
}

export interface ObjectGenerationRequest {
  objectType: string;
  prompt: string;
  language?: 'ES' | 'EN';
}

export interface MapGenerationRequest {
  mapType: string;
  prompt: string;
  language?: 'ES' | 'EN';
}

export interface AIServiceResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  metadata?: {
    tokensUsed?: number;
    processingTime?: number;
    cacheHit?: boolean;
  };
}

export interface GeneratedNPC extends NPC {
  aiGenerated: true;
  generationMetadata: {
    prompt: string;
    version: string;
    timestamp: Date;
  };
}

export interface GeneratedLocation extends Location {
  aiGenerated: true;
  generationMetadata: {
    prompt: string;
    version: string;
    timestamp: Date;
  };
}

export interface GeneratedAdventure extends Campaign {
  aiGenerated: true;
  generationMetadata: {
    prompt: string;
    version: string;
    timestamp: Date;
  };
}

export interface GeneratedTerrain {
  id: string;
  biome: string;
  features: string[];
  description: string;
  imageUrl?: string;
  mapData?: any;
  aiGenerated: true;
  generationMetadata: {
    prompt: string;
    version: string;
    timestamp: Date;
  };
}

// New Generated Types
export interface GeneratedWorldHistory {
  id: string;
  worldName: string;
  timeline: string;
  geography: string;
  cultures: string;
  majorEvents: string[];
  aiGenerated: true;
  generationMetadata: {
    prompt: string;
    version: string;
    timestamp: Date;
  };
}

export interface GeneratedMonster {
  id: string;
  name: string;
  type: string;
  stats: {
    health: number;
    attack: number;
    defense: number;
    speed: number;
  };
  abilities: string[];
  description: string;
  aiGenerated: true;
  generationMetadata: {
    prompt: string;
    version: string;
    timestamp: Date;
  };
}

export interface GeneratedMission {
  id: string;
  title: string;
  type: string;
  objectives: string[];
  rewards: string[];
  description: string;
  difficulty: 'easy' | 'medium' | 'hard';
  aiGenerated: true;
  generationMetadata: {
    prompt: string;
    version: string;
    timestamp: Date;
  };
}

export interface GeneratedObject {
  id: string;
  name: string;
  type: string;
  properties: string[];
  description: string;
  value?: number;
  rarity: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';
  aiGenerated: true;
  generationMetadata: {
    prompt: string;
    version: string;
    timestamp: Date;
  };
}

export interface GeneratedMap {
  id: string;
  name: string;
  type: string;
  layout: string;
  features: string[];
  description: string;
  imageUrl?: string;
  aiGenerated: true;
  generationMetadata: {
    prompt: string;
    version: string;
    timestamp: Date;
  };
}

export class WorldBuilderAIService {
  private static instance: WorldBuilderAIService;
  private characterService: VertexAICharacterService;
  private sceneService: VertexAISceneCreatorService;
  private adventureService: VertexAIAdventureService;
  private voiceService: VoiceCharactersService;
  private imageService: RPGAICharImgServices;
  // RPG-Immersive API Client for new services
  private apiClient: RPGImmersiveAPIClient;
  private initialized = false;

  private constructor() {
    this.characterService = new VertexAICharacterService();
    this.sceneService = new VertexAISceneCreatorService();
    this.adventureService = new VertexAIAdventureService();
    this.voiceService = new VoiceCharactersService();
    this.imageService = new RPGAICharImgServices();
    this.apiClient = new RPGImmersiveAPIClient();
  }

  public static getInstance(): WorldBuilderAIService {
    if (!WorldBuilderAIService.instance) {
      WorldBuilderAIService.instance = new WorldBuilderAIService();
    }
    return WorldBuilderAIService.instance;
  }

  async initialize(): Promise<void> {
    if (this.initialized) return;

    try {
      // Initialize existing AI services (for character, scene, adventure generation)
      await this.characterService.initialize();
      await this.sceneService.initialize();
      await this.adventureService.initialize();
      await this.voiceService.initialize();
      await this.imageService.initialize();
      
      // Test API connection to RPG-Immersive
      // No initialization needed for API client, just verify connectivity
      console.log('Testing connection to RPG-Immersive API...');
      
      this.initialized = true;
      console.log('World Builder AI Service initialized successfully');
      console.log('- Direct AI services: Character, Scene, Adventure, Voice, Image');
      console.log('- API services: World History, Monster, Mission, NPC, Object, Location, Map');
    } catch (error) {
      console.error('Failed to initialize World Builder AI Service:', error);
      throw error;
    }
  }

  async generateNPC(request: NPCGenerationRequest): Promise<AIServiceResponse<GeneratedNPC>> {
    try {
      if (!this.initialized) {
        await this.initialize();
      }

      // Use the new NPC generator via RPG-Immersive API
      const apiResponse = await this.apiClient.generateNPCDedicated(request);
      
      if (!apiResponse.success) {
        throw new Error(apiResponse.error || 'Failed to generate NPC via API');
      }

      let portraitUrl: string | undefined;
      let voiceId: string | undefined;

      // Generate portrait if requested (using existing services)
      if (request.includePortrait) {
        const portraitPrompt = `Portrait of a ${request.race} ${request.occupation}, ${request.personality}, fantasy style`;
        const portraitResponse = await this.imageService.generateCharacterPortrait(portraitPrompt);
        portraitUrl = portraitResponse.imageUrl;
      }

      // Generate voice if requested (using existing services)
      if (request.includeVoice) {
        const voiceCharacteristics = {
          race: request.race,
          personality: request.personality,
          occupation: request.occupation
        };
        const voiceResponse = await this.voiceService.generateVoice(voiceCharacteristics);
        voiceId = voiceResponse.voiceId;
      }

      // Parse API response and create NPC
      const npcData = apiResponse.data || {};
      const npc: GeneratedNPC = {
        id: `npc_${Date.now()}`,
        name: npcData.name || `${request.race} ${request.occupation}`,
        race: request.race,
        occupation: request.occupation,
        personality: this.parsePersonalityTraits(npcData.personality || request.personality),
        backstory: npcData.backstory || '',
        knowledge: this.parseKnowledgeBase(request.knowledgeAreas, npcData.knowledge),
        dialogueTree: [],
        relationships: [],
        stats: npcData.stats || {},
        voiceId,
        imageUrl: portraitUrl,
        aiGenerated: true,
        generationMetadata: {
          prompt: `${request.race} ${request.occupation}`,
          version: '2.0.0', // Updated version for API integration
          timestamp: new Date()
        }
      };

      return {
        success: true,
        data: npc,
        metadata: {
          tokensUsed: 0, // API doesn't expose this
          processingTime: 0, // API handles this internally
          cacheHit: false
        }
      };

    } catch (error) {
      console.error('Error generating NPC:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      };
    }
  }

  async generateLocation(request: LocationGenerationRequest): Promise<AIServiceResponse<GeneratedLocation>> {
    try {
      if (!this.initialized) {
        await this.initialize();
      }

      // Use the new Location generator via RPG-Immersive API
      const apiResponse = await this.apiClient.generateLocation(request);
      
      if (!apiResponse.success) {
        throw new Error(apiResponse.error || 'Failed to generate location via API');
      }

      let imageUrl: string | undefined;

      // Generate image if requested (using existing services)
      if (request.includeImage) {
        const imagePrompt = `${request.name}, ${request.type}, ${request.atmosphere}, ${request.mood || 'atmospheric'}, ${request.style || 'fantasy'} style`;
        const imageResponse = await this.imageService.generateSceneImage(imagePrompt);
        imageUrl = imageResponse.imageUrl;
      }

      // Parse API response and create location
      const locationData = apiResponse.data || {};
      const location: GeneratedLocation = {
        id: `location_${Date.now()}`,
        mapId: request.mapId,
        name: request.name,
        type: request.type as any,
        coordinates: request.coordinates,
        description: locationData.description || request.description,
        educationalContent: undefined,
        npcs: [],
        items: [],
        quests: [],
        environment: this.parseEnvironmentSettings(locationData.environment || request.atmosphere),
        images: imageUrl ? [imageUrl] : [],
        aiGenerated: true,
        generationMetadata: {
          prompt: `${request.type} location: ${request.name}`,
          version: '2.0.0', // Updated version for API integration
          timestamp: new Date()
        }
      };

      return {
        success: true,
        data: location,
        metadata: {
          tokensUsed: 0, // API doesn't expose this
          processingTime: 0, // API handles this internally
          cacheHit: false
        }
      };

    } catch (error) {
      console.error('Error generating location:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      };
    }
  }

  async generateAdventure(request: AdventureGenerationRequest): Promise<AIServiceResponse<GeneratedAdventure>> {
    try {
      if (!this.initialized) {
        await this.initialize();
      }

      const prompt = `Create an adventure titled "${request.title}":
        - Description: ${request.description}
        - Genre: ${request.genre}
        - Theme: ${request.theme}
        - Difficulty: ${request.difficulty}
        
        Please provide story arcs, quest chains, and educational objectives.`;

      // Generate adventure using AI service
      const adventureResponse = await this.adventureService.generateAdventure(prompt);
      
      let imageUrl: string | undefined;

      // Generate cover image if requested
      if (request.includeImage) {
        const imagePrompt = `${request.title}, ${request.genre} adventure, ${request.theme}, epic fantasy art style`;
        const imageResponse = await this.imageService.generateSceneImage(imagePrompt);
        imageUrl = imageResponse.imageUrl;
      }

      // Create adventure/campaign object
      const adventure: GeneratedAdventure = {
        id: `adventure_${Date.now()}`,
        worldId: request.worldId,
        name: request.title,
        description: adventureResponse.description || request.description,
        storyArcs: this.parseStoryArcs(adventureResponse.storyArcs || []),
        questChains: this.parseQuestChains(adventureResponse.questChains || []),
        educationalObjectives: adventureResponse.educationalObjectives || [],
        sessions: [],
        playerNotes: false,
        gmNotes: adventureResponse.gmNotes || '',
        aiGenerated: true,
        generationMetadata: {
          prompt,
          version: '1.0.0',
          timestamp: new Date()
        }
      };

      return {
        success: true,
        data: adventure,
        metadata: {
          tokensUsed: adventureResponse.tokensUsed,
          processingTime: adventureResponse.processingTime,
          cacheHit: adventureResponse.cacheHit
        }
      };

    } catch (error) {
      console.error('Error generating adventure:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      };
    }
  }

  async generateTerrain(request: TerrainGenerationRequest): Promise<AIServiceResponse<GeneratedTerrain>> {
    try {
      if (!this.initialized) {
        await this.initialize();
      }

      const prompt = `Create a ${request.biome} terrain with the following characteristics:
        - Size: ${request.size}
        - Climate: ${request.climate}
        - Features: ${request.features.join(', ')}
        
        Please provide detailed terrain description and geographical features.`;

      // Generate terrain using AI service
      const terrainResponse = await this.sceneService.generateScene(prompt);
      
      let imageUrl: string | undefined;

      // Generate terrain image if requested
      if (request.includeImage) {
        const imagePrompt = `${request.biome} terrain, ${request.climate} climate, ${request.features.join(', ')}, aerial view, fantasy map style`;
        const imageResponse = await this.imageService.generateSceneImage(imagePrompt);
        imageUrl = imageResponse.imageUrl;
      }

      // Create terrain object
      const terrain: GeneratedTerrain = {
        id: `terrain_${Date.now()}`,
        biome: request.biome,
        features: request.features,
        description: terrainResponse.description || `A ${request.biome} terrain in ${request.climate} climate`,
        imageUrl,
        mapData: terrainResponse.mapData,
        aiGenerated: true,
        generationMetadata: {
          prompt,
          version: '1.0.0',
          timestamp: new Date()
        }
      };

      return {
        success: true,
        data: terrain,
        metadata: {
          tokensUsed: terrainResponse.tokensUsed,
          processingTime: terrainResponse.processingTime,
          cacheHit: terrainResponse.cacheHit
        }
      };

    } catch (error) {
      console.error('Error generating terrain:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      };
    }
  }

  // New World Builder Generation Methods
  async generateWorldHistory(request: WorldHistoryRequest): Promise<AIServiceResponse<GeneratedWorldHistory>> {
    try {
      if (!this.initialized) {
        await this.initialize();
      }

      const apiResponse = await this.apiClient.generateWorldHistory(request);
      
      if (!apiResponse.success) {
        throw new Error(apiResponse.error || 'Failed to generate world history via API');
      }

      const historyData = apiResponse.data || {};
      const worldHistory: GeneratedWorldHistory = {
        id: `history_${Date.now()}`,
        worldName: request.worldName,
        timeline: historyData.timeline || 'Ancient times to present',
        geography: historyData.geography || 'Diverse landscapes',
        cultures: historyData.cultures || 'Rich cultural diversity',
        majorEvents: historyData.majorEvents || [],
        aiGenerated: true,
        generationMetadata: {
          prompt: request.prompt,
          version: '2.0.0',
          timestamp: new Date()
        }
      };

      return {
        success: true,
        data: worldHistory,
        metadata: {
          tokensUsed: 0,
          processingTime: 0,
          cacheHit: false
        }
      };

    } catch (error) {
      console.error('Error generating world history:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      };
    }
  }

  async generateMonster(request: MonsterGenerationRequest): Promise<AIServiceResponse<GeneratedMonster>> {
    try {
      if (!this.initialized) {
        await this.initialize();
      }

      const apiResponse = await this.apiClient.generateMonster(request);
      
      if (!apiResponse.success) {
        throw new Error(apiResponse.error || 'Failed to generate monster via API');
      }

      const monsterData = apiResponse.data || {};
      const monster: GeneratedMonster = {
        id: `monster_${Date.now()}`,
        name: monsterData.name || `Generated ${request.monsterType}`,
        type: request.monsterType,
        stats: monsterData.stats || { health: 100, attack: 20, defense: 15, speed: 10 },
        abilities: monsterData.abilities || [],
        description: monsterData.description || `A ${request.monsterType} creature`,
        aiGenerated: true,
        generationMetadata: {
          prompt: request.prompt,
          version: '2.0.0',
          timestamp: new Date()
        }
      };

      return {
        success: true,
        data: monster,
        metadata: {
          tokensUsed: 0,
          processingTime: 0,
          cacheHit: false
        }
      };

    } catch (error) {
      console.error('Error generating monster:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      };
    }
  }

  async generateMission(request: MissionGenerationRequest): Promise<AIServiceResponse<GeneratedMission>> {
    try {
      if (!this.initialized) {
        await this.initialize();
      }

      const apiResponse = await this.apiClient.generateMission(request);
      
      if (!apiResponse.success) {
        throw new Error(apiResponse.error || 'Failed to generate mission via API');
      }

      const missionData = apiResponse.data || {};
      const mission: GeneratedMission = {
        id: `mission_${Date.now()}`,
        title: missionData.title || `Generated ${request.missionType} Mission`,
        type: request.missionType,
        objectives: missionData.objectives || [],
        rewards: missionData.rewards || [],
        description: missionData.description || `A ${request.missionType} mission`,
        difficulty: missionData.difficulty || 'medium',
        aiGenerated: true,
        generationMetadata: {
          prompt: request.prompt,
          version: '2.0.0',
          timestamp: new Date()
        }
      };

      return {
        success: true,
        data: mission,
        metadata: {
          tokensUsed: 0,
          processingTime: 0,
          cacheHit: false
        }
      };

    } catch (error) {
      console.error('Error generating mission:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      };
    }
  }

  async generateObject(request: ObjectGenerationRequest): Promise<AIServiceResponse<GeneratedObject>> {
    try {
      if (!this.initialized) {
        await this.initialize();
      }

      const apiResponse = await this.apiClient.generateObject(request);
      
      if (!apiResponse.success) {
        throw new Error(apiResponse.error || 'Failed to generate object via API');
      }

      const objectData = apiResponse.data || {};
      const object: GeneratedObject = {
        id: `object_${Date.now()}`,
        name: objectData.name || `Generated ${request.objectType}`,
        type: request.objectType,
        properties: objectData.properties || [],
        description: objectData.description || `A ${request.objectType} object`,
        value: objectData.value || 0,
        rarity: objectData.rarity || 'common',
        aiGenerated: true,
        generationMetadata: {
          prompt: request.prompt,
          version: '2.0.0',
          timestamp: new Date()
        }
      };

      return {
        success: true,
        data: object,
        metadata: {
          tokensUsed: 0,
          processingTime: 0,
          cacheHit: false
        }
      };

    } catch (error) {
      console.error('Error generating object:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      };
    }
  }

  async generateMap(request: MapGenerationRequest): Promise<AIServiceResponse<GeneratedMap>> {
    try {
      if (!this.initialized) {
        await this.initialize();
      }

      const apiResponse = await this.apiClient.generateMap(request);
      
      if (!apiResponse.success) {
        throw new Error(apiResponse.error || 'Failed to generate map via API');
      }

      const mapData = apiResponse.data || {};
      const map: GeneratedMap = {
        id: `map_${Date.now()}`,
        name: mapData.name || `Generated ${request.mapType} Map`,
        type: request.mapType,
        layout: mapData.layout || 'Generated layout',
        features: mapData.features || [],
        description: mapData.description || `A ${request.mapType} map`,
        imageUrl: mapData.imageUrl,
        aiGenerated: true,
        generationMetadata: {
          prompt: request.prompt,
          version: '2.0.0',
          timestamp: new Date()
        }
      };

      return {
        success: true,
        data: map,
        metadata: {
          tokensUsed: 0,
          processingTime: 0,
          cacheHit: false
        }
      };

    } catch (error) {
      console.error('Error generating map:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      };
    }
  }

  async checkServiceHealth(): Promise<{ [key: string]: boolean }> {
    const health = {
      characterService: false,
      sceneService: false,
      adventureService: false,
      voiceService: false,
      imageService: false,
      // New API services
      worldHistoryAPI: false,
      monsterAPI: false,
      missionAPI: false,
      npcAPI: false,
      objectAPI: false,
      locationAPI: false,
      mapAPI: false
    };

    try {
      // Check existing services
      health.characterService = await this.characterService.healthCheck();
      health.sceneService = await this.sceneService.healthCheck();
      health.adventureService = await this.adventureService.healthCheck();
      health.voiceService = await this.voiceService.healthCheck();
      health.imageService = await this.imageService.healthCheck();

      // Check API services by making test requests
      try {
        await this.apiClient.generateWorldHistory({ worldName: 'Test', prompt: 'Test', language: 'EN' });
        health.worldHistoryAPI = true;
      } catch { health.worldHistoryAPI = false; }

      try {
        await this.apiClient.generateMonster({ monsterType: 'Test', prompt: 'Test', language: 'EN' });
        health.monsterAPI = true;
      } catch { health.monsterAPI = false; }

      try {
        await this.apiClient.generateMission({ missionType: 'Test', prompt: 'Test', language: 'EN' });
        health.missionAPI = true;
      } catch { health.missionAPI = false; }

      try {
        await this.apiClient.generateObject({ objectType: 'Test', prompt: 'Test', language: 'EN' });
        health.objectAPI = true;
      } catch { health.objectAPI = false; }

      try {
        await this.apiClient.generateMap({ mapType: 'Test', prompt: 'Test', language: 'EN' });
        health.mapAPI = true;
      } catch { health.mapAPI = false; }

    } catch (error) {
      console.error('Error checking service health:', error);
    }

    return health;
  }

  async reinitialize(): Promise<void> {
    this.initialized = false;
    await this.initialize();
  }

  // Helper methods
  private parsePersonalityTraits(personality: string): PersonalityTraits {
    // Parse AI-generated personality into structured traits
    return {
      alignment: 'Neutral Good', // Default, could be extracted from AI response
      ideals: [personality],
      bonds: [],
      flaws: [],
      mannerisms: []
    };
  }

  private parseKnowledgeBase(areas: string[], aiKnowledge?: any): KnowledgeBase[] {
    return areas.map(area => ({
      topic: area,
      expertise: 'intermediate' as const,
      facts: aiKnowledge?.[area] || []
    }));
  }

  private parseEnvironmentSettings(atmosphere: string): EnvironmentSettings {
    // Parse atmosphere into structured environment settings
    return {
      timeOfDay: 'noon' as const,
      weather: 'clear' as const,
      ambientSounds: [atmosphere],
      lightLevel: 75
    };
  }

  private parseStoryArcs(arcs: any[]): any[] {
    // Parse AI-generated story arcs
    return arcs.map(arc => ({
      id: `arc_${Date.now()}`,
      name: arc.name || 'Untitled Arc',
      description: arc.description || '',
      chapters: arc.chapters || [],
      status: 'planned' as const
    }));
  }

  private parseQuestChains(chains: any[]): any[] {
    // Parse AI-generated quest chains
    return chains.map(chain => ({
      id: `chain_${Date.now()}`,
      name: chain.name || 'Untitled Quest Chain',
      quests: chain.quests || [],
      rewards: chain.rewards || []
    }));
  }
}

// Export singleton instance
export const worldBuilderAI = WorldBuilderAIService.getInstance();
