/**
 * AI Generators Service
 * High-level generators using the AI services for specific content types
 */

import { aiServices, AIServicesError } from './ai-services';
import type { CharacterData } from './ai-services';

export interface GeneratedWorld {
  name: string;
  description: string;
  geography: string;
  climate: string;
  cultures: string[];
  history: string;
  conflicts: string[];
  resources: string[];
}

export interface GeneratedLocation {
  name: string;
  type: string;
  description: string;
  inhabitants: string;
  features: string[];
  hooks: string[];
  atmosphere: string;
}

export interface GeneratedLore {
  title: string;
  type: 'legend' | 'history' | 'mythology' | 'culture';
  content: string;
  significance: string;
  connections: string[];
}

export interface GeneratedEncounter {
  type: 'combat' | 'social' | 'exploration' | 'puzzle';
  description: string;
  participants: string[];
  objectives: string[];
  challenges: string[];
  rewards: string[];
}

export interface GeneratedNames {
  category: string;
  names: string[];
  origins: string[];
}

/**
 * AI Generators Service Class
 */
export class AIGeneratorsService {
  /**
   * Generate a fantasy world
   */
  async generateWorld(prompt: string): Promise<GeneratedWorld> {
    try {
      const fullPrompt = `Create a detailed fantasy world based on: ${prompt}. 
      Include: world name, overall description, geography, climate, major cultures, 
      brief history, current conflicts, and available resources. 
      Format as JSON with fields: name, description, geography, climate, cultures (array), 
      history, conflicts (array), resources (array).`;

      const character = await aiServices.generateCharacter(fullPrompt);
      
      // Extract world information from character response
      // Note: The AI service returns character data, so we need to adapt it
      const worldData = this.adaptCharacterToWorld(character, prompt);
      return worldData;
    } catch (error) {
      throw new AIServicesError(
        `World generation failed: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }
  }

  /**
   * Generate a location
   */
  async generateLocation(prompt: string): Promise<GeneratedLocation> {
    try {
      const fullPrompt = `Create a detailed fantasy location based on: ${prompt}.
      Include: location name, type (city, dungeon, forest, etc.), detailed description,
      typical inhabitants, notable features, adventure hooks, and atmosphere.
      Format as JSON with fields: name, type, description, inhabitants, 
      features (array), hooks (array), atmosphere.`;

      const character = await aiServices.generateCharacter(fullPrompt);
      const locationData = this.adaptCharacterToLocation(character, prompt);
      return locationData;
    } catch (error) {
      throw new AIServicesError(
        `Location generation failed: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }
  }

  /**
   * Generate an NPC using the character service
   */
  async generateNPC(prompt: string): Promise<CharacterData> {
    try {
      const fullPrompt = `Create a detailed NPC character for a fantasy RPG based on: ${prompt}.
      Include complete personality, background, motivations, and role in the world.`;

      return await aiServices.generateCharacter(fullPrompt);
    } catch (error) {
      throw new AIServicesError(
        `NPC generation failed: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }
  }

  /**
   * Generate lore content
   */
  async generateLore(prompt: string): Promise<GeneratedLore> {
    try {
      const fullPrompt = `Create detailed lore content based on: ${prompt}.
      Include: title, type (legend/history/mythology/culture), main content,
      significance to the world, and connections to other elements.
      Format as JSON with fields: title, type, content, significance, connections (array).`;

      const character = await aiServices.generateCharacter(fullPrompt);
      const loreData = this.adaptCharacterToLore(character, prompt);
      return loreData;
    } catch (error) {
      throw new AIServicesError(
        `Lore generation failed: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }
  }

  /**
   * Generate an encounter
   */
  async generateEncounter(prompt: string): Promise<GeneratedEncounter> {
    try {
      const fullPrompt = `Create a detailed RPG encounter based on: ${prompt}.
      Include: encounter type (combat/social/exploration/puzzle), description,
      participants involved, objectives, challenges, and potential rewards.
      Format as JSON with fields: type, description, participants (array),
      objectives (array), challenges (array), rewards (array).`;

      const character = await aiServices.generateCharacter(fullPrompt);
      const encounterData = this.adaptCharacterToEncounter(character, prompt);
      return encounterData;
    } catch (error) {
      throw new AIServicesError(
        `Encounter generation failed: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }
  }

  /**
   * Generate names
   */
  async generateNames(prompt: string): Promise<GeneratedNames> {
    try {
      const fullPrompt = `Generate a list of fantasy names based on: ${prompt}.
      Include: category description, array of 10-15 names, and their cultural origins.
      Format as JSON with fields: category, names (array), origins (array).`;

      const character = await aiServices.generateCharacter(fullPrompt);
      const namesData = this.adaptCharacterToNames(character, prompt);
      return namesData;
    } catch (error) {
      throw new AIServicesError(
        `Name generation failed: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }
  }

  /**
   * Generate voice narration for content
   */
  async generateVoiceNarration(
    text: string, 
    characterType: 'narrator' | 'merchant' | 'sage' | 'mysterious' | 'companion' = 'narrator'
  ): Promise<string> {
    try {
      return await aiServices.generateVoice(text, {
        languageCode: 'en-US',
        characterId: characterType,
        emotion: 'neutral'
      });
    } catch (error) {
      throw new AIServicesError(
        `Voice generation failed: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }
  }

  // Adaptation methods to convert character responses to specific content types
  private adaptCharacterToWorld(character: CharacterData, originalPrompt: string): GeneratedWorld {
    const char = character.personaje_creado;
    return {
      name: char.informacion_basica.nombre_sugerido || `Generated World`,
      description: char.descripcion_fisica || `A world created from: ${originalPrompt}`,
      geography: char.trasfondo.historia_personal || 'Diverse geographical features',
      climate: char.trasfondo.evento_definitorio || 'Varied climate zones',
      cultures: char.habilidades_competentes || ['Various cultures'],
      history: char.trasfondo.familia_y_conexiones || 'Rich historical background',
      conflicts: [char.ganchos_narrativos.conflicto_interno || 'Ancient conflicts'],
      resources: char.equipo_inicial.herramientas_especiales || ['Natural resources']
    };
  }

  private adaptCharacterToLocation(character: CharacterData, originalPrompt: string): GeneratedLocation {
    const char = character.personaje_creado;
    return {
      name: char.informacion_basica.nombre_sugerido || 'Generated Location',
      type: char.arquetipo || 'Settlement',
      description: char.descripcion_fisica || `A location based on: ${originalPrompt}`,
      inhabitants: char.trasfondo.familia_y_conexiones || 'Various inhabitants',
      features: char.habilidades_competentes || ['Notable features'],
      hooks: [char.ganchos_narrativos.objetivo_personal || 'Adventure opportunities'],
      atmosphere: char.personalidad.motivaciones || 'Mysterious atmosphere'
    };
  }

  private adaptCharacterToLore(character: CharacterData, originalPrompt: string): GeneratedLore {
    const char = character.personaje_creado;
    return {
      title: char.informacion_basica.titulo_o_apodo || 'Ancient Lore',
      type: 'legend',
      content: char.trasfondo.historia_personal || `Lore content based on: ${originalPrompt}`,
      significance: char.personalidad.motivaciones || 'Significant to the world',
      connections: char.habilidades_competentes || ['Connected to other stories']
    };
  }

  private adaptCharacterToEncounter(character: CharacterData, originalPrompt: string): GeneratedEncounter {
    const char = character.personaje_creado;
    return {
      type: 'combat',
      description: char.descripcion_fisica || `An encounter based on: ${originalPrompt}`,
      participants: [char.informacion_basica.nombre_sugerido || 'Unknown entity'],
      objectives: [char.ganchos_narrativos.objetivo_personal || 'Survive the encounter'],
      challenges: [char.personalidad.miedos_o_debilidades || 'Overcome obstacles'],
      rewards: char.equipo_inicial.objetos_personales || ['Experience and treasure']
    };
  }

  private adaptCharacterToNames(character: CharacterData, originalPrompt: string): GeneratedNames {
    const char = character.personaje_creado;
    const baseNames = [
      char.informacion_basica.nombre_sugerido,
      char.informacion_basica.titulo_o_apodo,
      char.informacion_basica.origen_geografico
    ].filter(Boolean);
    
    // Generate additional names based on the character data
    const additionalNames = char.habilidades_competentes || [];
    
    return {
      category: `Names inspired by: ${originalPrompt}`,
      names: [...baseNames, ...additionalNames].slice(0, 15),
      origins: [char.informacion_basica.origen_geografico || 'Fantasy realm']
    };
  }
}

// Default service instance
export const aiGenerators = new AIGeneratorsService();

// Re-export CharacterData for easier imports
export type { CharacterData };