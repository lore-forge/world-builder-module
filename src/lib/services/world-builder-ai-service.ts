import { 
  initializeAIServices,
  VertexAICharacterService,
  VertexAISceneCreatorService,
  VertexAIAdventureService,
  VoiceCharactersService,
  RPGAICharImgServices,
  type CharacterGenerationRequest,
  type SceneCreationRequest,
  type AdventureGenerationRequest,
  type VoiceGenerationRequest,
  type ImageGenerationRequest
} from 'lore-forge-ai-services';

import type { 
  NPC, 
  Location, 
  Adventure, 
  WorldGenerationRequest,
  NPCGenerationRequest,
  LocationGenerationRequest,
  AdventureGenerationRequest as WorldAdventureRequest
} from '@/types';

/**
 * World Builder AI Services Integration
 * 
 * This service integrates the world-builder module with the lore-forge-ai-services
 * providing AI-powered generation for NPCs, locations, adventures, and other content.
 */
export class WorldBuilderAIService {
  private characterService: VertexAICharacterService;
  private sceneService: VertexAISceneCreatorService;
  private adventureService: VertexAIAdventureService;
  private voiceService: VoiceCharactersService;
  private imageService: RPGAICharImgServices;
  private initialized = false;

  constructor() {
    this.characterService = new VertexAICharacterService();
    this.sceneService = new VertexAISceneCreatorService();
    this.adventureService = new VertexAIAdventureService();
    this.voiceService = new VoiceCharactersService();
    this.imageService = new RPGAICharImgServices();
  }

  /**
   * Initialize the AI services
   */
  async initialize(): Promise<void> {
    if (this.initialized) return;
    
    try {
      await initializeAIServices();
      this.initialized = true;
      console.log('WorldBuilderAIService initialized successfully');
    } catch (error) {
      console.error('Failed to initialize WorldBuilderAIService:', error);
      throw error;
    }
  }

  /**
   * Generate an NPC with AI assistance
   */
  async generateNPC(request: NPCGenerationRequest): Promise<NPC> {
    await this.initialize();

    try {
      // Convert world-builder request to lore-forge format
      const characterRequest: CharacterGenerationRequest = {
        prompt: this.buildNPCPrompt(request),
        cached: true,
        options: {
          temperature: 0.7,
          maxTokens: 2048
        }
      };

      const characterResponse = await this.characterService.createCharacter(characterRequest);
      
      if (!characterResponse.success) {
        throw new Error(`Character generation failed: ${characterResponse.error}`);
      }

      const character = characterResponse.data;

      // Generate portrait if requested
      let portraitUrl: string | undefined;
      if (request.includePortrait) {
        const imageRequest: ImageGenerationRequest = {
          prompt: this.buildPortraitPrompt(character, request.setting),
          style: 'fantasy',
          size: '1024x1024',
          type: 'character'
        };
        
        const imageResponse = await this.imageService.generateImage(imageRequest);
        if (imageResponse.success) {
          portraitUrl = imageResponse.data.url;
        }
      }

      // Generate voice if requested
      let voiceUrl: string | undefined;
      if (request.includeVoice && character.personality) {
        const voiceRequest: VoiceGenerationRequest = {
          text: this.buildVoiceIntroduction(character),
          voiceConfig: this.selectVoiceConfig(character)
        };
        
        const voiceResponse = await this.voiceService.generateSpeech(voiceRequest);
        if (voiceResponse.success) {
          voiceUrl = voiceResponse.data.audioUrl;
        }
      }

      // Convert to world-builder NPC format
      const npc: NPC = {
        id: `npc_${Date.now()}`,
        name: character.name,
        race: character.race,
        occupation: request.occupation || 'Citizen',
        personality: {
          traits: character.personality ? [character.personality] : [],
          motivations: character.background ? [character.background] : [],
          fears: [],
          secrets: []
        },
        backstory: character.background || '',
        knowledge: request.knowledgeAreas || [],
        dialogueTree: [], // Will be populated later
        relationships: [],
        stats: character.stats ? {
          strength: character.stats.strength,
          dexterity: character.stats.dexterity,
          constitution: character.stats.constitution,
          intelligence: character.stats.intelligence,
          wisdom: character.stats.wisdom,
          charisma: character.stats.charisma
        } : undefined,
        voiceId: voiceUrl,
        imageUrl: portraitUrl,
        createdAt: new Date(),
        updatedAt: new Date()
      };

      return npc;
    } catch (error) {
      console.error('NPC generation failed:', error);
      throw error;
    }
  }

  /**
   * Generate a location with AI assistance
   */
  async generateLocation(request: LocationGenerationRequest): Promise<Location> {
    await this.initialize();

    try {
      const sceneRequest: SceneCreationRequest = {
        prompt: this.buildLocationPrompt(request),
        includeImage: request.includeImage || false,
        mood: request.mood || 'neutral',
        style: request.style || 'fantasy'
      };

      const sceneResponse = await this.sceneService.createScene(sceneRequest);
      
      if (!sceneResponse.success) {
        throw new Error(`Location generation failed: ${sceneResponse.error}`);
      }

      const scene = sceneResponse.data;

      const location: Location = {
        id: `location_${Date.now()}`,
        mapId: request.mapId,
        name: request.name,
        type: request.type,
        coordinates: request.coordinates,
        description: scene.description,
        educationalContent: request.educationalContent,
        npcs: [],
        items: [],
        quests: [],
        environment: {
          temperature: request.environment?.temperature || 20,
          weather: request.environment?.weather || 'clear',
          timeOfDay: request.environment?.timeOfDay || 'day',
          season: request.environment?.season || 'spring'
        },
        images: scene.imageUrl ? [scene.imageUrl] : [],
        createdAt: new Date(),
        updatedAt: new Date()
      };

      return location;
    } catch (error) {
      console.error('Location generation failed:', error);
      throw error;
    }
  }

  /**
   * Generate an adventure with AI assistance
   */
  async generateAdventure(request: WorldAdventureRequest): Promise<Adventure> {
    await this.initialize();

    try {
      const adventureRequest: AdventureGenerationRequest = {
        prompt: this.buildAdventurePrompt(request),
        genre: request.genre || 'fantasy',
        difficulty: request.difficulty || 'medium',
        includeImage: request.includeImage || false
      };

      const adventureResponse = await this.adventureService.generateAdventure(adventureRequest);
      
      if (!adventureResponse.success) {
        throw new Error(`Adventure generation failed: ${adventureResponse.error}`);
      }

      const adventure = adventureResponse.data;

      // Convert to world-builder adventure format
      const worldAdventure: Adventure = {
        id: `adventure_${Date.now()}`,
        worldId: request.worldId,
        name: request.title,
        description: adventure.description,
        storyArcs: adventure.storyArcs || [],
        questChains: adventure.questChains || [],
        educationalObjectives: request.educationalObjectives || [],
        sessions: [],
        playerNotes: false,
        gmNotes: adventure.gmNotes || '',
        createdAt: new Date(),
        updatedAt: new Date()
      };

      return worldAdventure;
    } catch (error) {
      console.error('Adventure generation failed:', error);
      throw error;
    }
  }

  /**
   * Generate terrain description with AI assistance
   */
  async generateTerrain(request: {
    biome: string;
    size: string;
    features: string[];
    climate: string;
  }): Promise<{
    description: string;
    features: string[];
    imageUrl?: string;
  }> {
    await this.initialize();

    try {
      const sceneRequest: SceneCreationRequest = {
        prompt: `Generate a detailed terrain description for a ${request.biome} biome. 
                Size: ${request.size}. Climate: ${request.climate}. 
                Include these features: ${request.features.join(', ')}. 
                Focus on the landscape, geography, and natural elements.`,
        includeImage: true,
        mood: 'scenic',
        style: 'landscape'
      };

      const response = await this.sceneService.createScene(sceneRequest);
      
      if (!response.success) {
        throw new Error(`Terrain generation failed: ${response.error}`);
      }

      return {
        description: response.data.description,
        features: request.features,
        imageUrl: response.data.imageUrl
      };
    } catch (error) {
      console.error('Terrain generation failed:', error);
      throw error;
    }
  }

  // Helper methods for building prompts

  private buildNPCPrompt(request: NPCGenerationRequest): string {
    const parts = [
      `Create a ${request.race} ${request.occupation}`,
      request.setting ? `in a ${request.setting} setting` : '',
      request.personality ? `with ${request.personality} personality` : '',
      request.background ? `Background: ${request.background}` : '',
      request.knowledgeAreas?.length ? `Knowledgeable about: ${request.knowledgeAreas.join(', ')}` : ''
    ].filter(Boolean);

    return parts.join('. ') + '.';
  }

  private buildLocationPrompt(request: LocationGenerationRequest): string {
    const parts = [
      `Describe a ${request.type} called "${request.name}"`,
      request.description ? `Context: ${request.description}` : '',
      request.educationalContent ? `Educational focus: ${request.educationalContent.subject}` : '',
      request.atmosphere ? `Atmosphere: ${request.atmosphere}` : ''
    ].filter(Boolean);

    return parts.join('. ') + '.';
  }

  private buildAdventurePrompt(request: WorldAdventureRequest): string {
    const parts = [
      `Create an adventure titled "${request.title}"`,
      request.description ? `Description: ${request.description}` : '',
      request.genre ? `Genre: ${request.genre}` : '',
      request.theme ? `Theme: ${request.theme}` : '',
      request.educationalObjectives?.length ? `Educational goals: ${request.educationalObjectives.map(obj => obj.description).join(', ')}` : ''
    ].filter(Boolean);

    return parts.join('. ') + '.';
  }

  private buildPortraitPrompt(character: any, setting?: string): string {
    const parts = [
      `Portrait of ${character.name}`,
      `a ${character.race} ${character.class || 'character'}`,
      character.appearance ? character.appearance : '',
      setting ? `in ${setting} setting` : '',
      'fantasy art style, detailed, high quality'
    ].filter(Boolean);

    return parts.join(', ');
  }

  private buildVoiceIntroduction(character: any): string {
    const greetings = [
      'Greetings, traveler.',
      'Well met, friend.',
      'Welcome to my domain.',
      'What brings you here?',
      'How may I assist you?'
    ];

    return greetings[Math.floor(Math.random() * greetings.length)];
  }

  private selectVoiceConfig(character: any): any {
    // Voice selection logic based on character traits
    const voices = {
      default: {
        language: 'en-US',
        voice: 'en-US-Neural2-J',
        pitch: 0.0,
        speakingRate: 1.0,
        volumeGainDb: 0.0,
        ssmlGender: 'NEUTRAL'
      },
      deep: {
        language: 'en-US',
        voice: 'en-US-Neural2-D',
        pitch: -2.0,
        speakingRate: 0.9,
        volumeGainDb: 0.0,
        ssmlGender: 'MALE'
      },
      melodic: {
        language: 'en-US',
        voice: 'en-US-Neural2-F',
        pitch: 1.0,
        speakingRate: 1.0,
        volumeGainDb: 0.0,
        ssmlGender: 'FEMALE'
      }
    };

    // Simple voice selection based on character race/class
    if (character.race?.toLowerCase().includes('dwarf')) {
      return voices.deep;
    } else if (character.race?.toLowerCase().includes('elf')) {
      return voices.melodic;
    }

    return voices.default;
  }
}

// Export singleton instance
export const worldBuilderAI = new WorldBuilderAIService();
