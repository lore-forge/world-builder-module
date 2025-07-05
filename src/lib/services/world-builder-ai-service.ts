import { 
  VertexAICharacterService, 
  VertexAISceneCreatorService, 
  VertexAIAdventureService, 
  VoiceCharactersService, 
  RPGAICharImgServices 
} from 'lore-forge-ai-services';

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

export class WorldBuilderAIService {
  private static instance: WorldBuilderAIService;
  private characterService: VertexAICharacterService;
  private sceneService: VertexAISceneCreatorService;
  private adventureService: VertexAIAdventureService;
  private voiceService: VoiceCharactersService;
  private imageService: RPGAICharImgServices;
  private initialized = false;

  private constructor() {
    this.characterService = new VertexAICharacterService();
    this.sceneService = new VertexAISceneCreatorService();
    this.adventureService = new VertexAIAdventureService();
    this.voiceService = new VoiceCharactersService();
    this.imageService = new RPGAICharImgServices();
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
      // Initialize all AI services
      await this.characterService.initialize();
      await this.sceneService.initialize();
      await this.adventureService.initialize();
      await this.voiceService.initialize();
      await this.imageService.initialize();
      
      this.initialized = true;
      console.log('World Builder AI Service initialized successfully');
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

      const prompt = `Create a ${request.race} ${request.occupation} with the following characteristics:
        - Personality: ${request.personality}
        - Background: ${request.background}
        - Setting: ${request.setting}
        - Knowledge Areas: ${request.knowledgeAreas.join(', ')}
        
        Please provide a detailed character with name, backstory, personality traits, and knowledge base.`;

      // Generate character using AI service
      const characterResponse = await this.characterService.generateCharacter(prompt);
      
      let portraitUrl: string | undefined;
      let voiceId: string | undefined;

      // Generate portrait if requested
      if (request.includePortrait) {
        const portraitPrompt = `Portrait of a ${request.race} ${request.occupation}, ${request.personality}, fantasy style`;
        const portraitResponse = await this.imageService.generateCharacterPortrait(portraitPrompt);
        portraitUrl = portraitResponse.imageUrl;
      }

      // Generate voice if requested
      if (request.includeVoice) {
        const voiceCharacteristics = {
          race: request.race,
          personality: request.personality,
          occupation: request.occupation
        };
        const voiceResponse = await this.voiceService.generateVoice(voiceCharacteristics);
        voiceId = voiceResponse.voiceId;
      }

      // Parse AI response and create NPC
      const npc: GeneratedNPC = {
        id: `npc_${Date.now()}`,
        name: characterResponse.name || `${request.race} ${request.occupation}`,
        race: request.race,
        occupation: request.occupation,
        personality: this.parsePersonalityTraits(characterResponse.personality || request.personality),
        backstory: characterResponse.backstory || '',
        knowledge: this.parseKnowledgeBase(request.knowledgeAreas, characterResponse.knowledge),
        dialogueTree: [], // Will be populated by dialogue generation
        relationships: [],
        stats: characterResponse.stats,
        voiceId,
        imageUrl: portraitUrl,
        aiGenerated: true,
        generationMetadata: {
          prompt,
          version: '1.0.0',
          timestamp: new Date()
        }
      };

      return {
        success: true,
        data: npc,
        metadata: {
          tokensUsed: characterResponse.tokensUsed,
          processingTime: characterResponse.processingTime,
          cacheHit: characterResponse.cacheHit
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

      const prompt = `Create a detailed ${request.type} location called "${request.name}":
        - Description: ${request.description}
        - Atmosphere: ${request.atmosphere}
        - Setting: Fantasy world
        
        Please provide rich descriptions, environmental details, and any notable features.`;

      // Generate location using AI service
      const locationResponse = await this.sceneService.generateScene(prompt);
      
      let imageUrl: string | undefined;

      // Generate image if requested
      if (request.includeImage) {
        const imagePrompt = `${request.name}, ${request.type}, ${request.atmosphere}, ${request.mood || 'atmospheric'}, ${request.style || 'fantasy'} style`;
        const imageResponse = await this.imageService.generateSceneImage(imagePrompt);
        imageUrl = imageResponse.imageUrl;
      }

      // Create location object
      const location: GeneratedLocation = {
        id: `location_${Date.now()}`,
        mapId: request.mapId,
        name: request.name,
        type: request.type as any,
        coordinates: request.coordinates,
        description: locationResponse.description || request.description,
        educationalContent: undefined,
        npcs: [],
        items: [],
        quests: [],
        environment: this.parseEnvironmentSettings(locationResponse.environment || request.atmosphere),
        images: imageUrl ? [imageUrl] : [],
        aiGenerated: true,
        generationMetadata: {
          prompt,
          version: '1.0.0',
          timestamp: new Date()
        }
      };

      return {
        success: true,
        data: location,
        metadata: {
          tokensUsed: locationResponse.tokensUsed,
          processingTime: locationResponse.processingTime,
          cacheHit: locationResponse.cacheHit
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

  async checkServiceHealth(): Promise<{ [key: string]: boolean }> {
    const health = {
      characterService: false,
      sceneService: false,
      adventureService: false,
      voiceService: false,
      imageService: false
    };

    try {
      health.characterService = await this.characterService.healthCheck();
      health.sceneService = await this.sceneService.healthCheck();
      health.adventureService = await this.adventureService.healthCheck();
      health.voiceService = await this.voiceService.healthCheck();
      health.imageService = await this.imageService.healthCheck();
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
