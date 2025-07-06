/**
 * AI Services Client Implementation
 * Based on AI_SERVICES_API_DOCUMENTATION.md
 */

// Base configuration
const AI_SERVICES_BASE_URL = 'https://us-central1-gen-lang-client-0780430254.cloudfunctions.net';

// TypeScript interfaces based on the API documentation
export interface AIServiceResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  code?: string;
  service?: string;
  operation?: string;
  timestamp: string;
}

export interface HealthCheckResponse {
  status: 'healthy' | 'unhealthy';
  timestamp: string;
  version: string;
  services: string[];
  caching: string;
}

export interface CharacterGenerationRequest {
  service: 'character';
  operation: 'create';
  data: {
    prompt: string;
  };
}

export interface VoiceGenerationRequest {
  service: 'voice';
  operation: 'generate';
  data: {
    text: string;
    voiceConfig?: VoiceConfig;
  };
}

export interface VoiceConfig {
  languageCode?: string;
  voiceName?: string;
  characterId?: 'narrator' | 'merchant' | 'sage' | 'mysterious' | 'companion';
  emotion?: 'neutral' | 'dramatic' | 'mysterious' | 'excited';
}

export interface CharacterData {
  personaje_creado: {
    informacion_basica: {
      nombre_sugerido: string;
      titulo_o_apodo: string;
      edad: string;
      genero: string;
      raza_sugerida: string;
      origen_geografico: string;
    };
    arquetipo: string;
    trasfondo: {
      historia_personal: string;
      evento_definitorio: string;
      familia_y_conexiones: string;
      secreto_o_misterio: string;
    };
    personalidad: {
      rasgos_principales: string[];
      motivaciones: string;
      miedos_o_debilidades: string;
      quirks_o_manias: string;
    };
    atributos_base: {
      Fuerza: number;
      Agilidad: number;
      Resistencia: number;
      Intelecto: number;
      Percepcion: number;
      Presencia: number;
    };
    habilidades_competentes: string[];
    equipo_inicial: {
      arma_principal: string;
      armadura_o_proteccion: string;
      herramientas_especiales: string[];
      objetos_personales: string[];
    };
    ganchos_narrativos: {
      enemigo_o_rival: string;
      aliado_o_mentor: string;
      objetivo_personal: string;
      conflicto_interno: string;
    };
    descripcion_fisica: string;
    notas_de_interpretacion: string;
    prompt_descripcion_completa: string;
  };
}

export class AIServicesError extends Error {
  constructor(
    message: string,
    public code?: string,
    public timestamp?: string
  ) {
    super(message);
    this.name = 'AIServicesError';
  }
}

/**
 * AI Services Client
 */
export class AIServicesClient {
  private baseUrl: string;

  constructor(baseUrl: string = AI_SERVICES_BASE_URL) {
    this.baseUrl = baseUrl;
  }

  /**
   * Check the health status of AI services
   */
  async checkHealth(): Promise<HealthCheckResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/ai-services-health`);
      
      if (!response.ok) {
        throw new AIServicesError(
          `Health check failed: ${response.status} ${response.statusText}`
        );
      }

      return await response.json();
    } catch (error) {
      if (error instanceof AIServicesError) {
        throw error;
      }
      throw new AIServicesError(
        `Network error during health check: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }
  }

  /**
   * Generate a character using AI
   */
  async generateCharacter(prompt: string): Promise<CharacterData> {
    try {
      const requestBody: CharacterGenerationRequest = {
        service: 'character',
        operation: 'create',
        data: { prompt }
      };

      const response = await fetch(`${this.baseUrl}/ai-services`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody)
      });

      const result: AIServiceResponse<string> = await response.json();

      if (!result.success) {
        throw new AIServicesError(
          result.error || 'Character generation failed',
          result.code,
          result.timestamp
        );
      }

      if (!result.data) {
        throw new AIServicesError('No character data received');
      }

      // Parse the JSON string returned in the data field
      return JSON.parse(result.data);
    } catch (error) {
      if (error instanceof AIServicesError) {
        throw error;
      }
      if (error instanceof SyntaxError) {
        throw new AIServicesError('Invalid character data format received');
      }
      throw new AIServicesError(
        `Network error during character generation: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }
  }

  /**
   * Generate voice audio using AI
   */
  async generateVoice(text: string, voiceConfig?: VoiceConfig): Promise<string> {
    try {
      const requestBody: VoiceGenerationRequest = {
        service: 'voice',
        operation: 'generate',
        data: { text, voiceConfig: voiceConfig || {} }
      };

      const response = await fetch(`${this.baseUrl}/ai-services`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody)
      });

      const result: AIServiceResponse<string> = await response.json();

      if (!result.success) {
        throw new AIServicesError(
          result.error || 'Voice generation failed',
          result.code,
          result.timestamp
        );
      }

      if (!result.data) {
        throw new AIServicesError('No audio data received');
      }

      return result.data; // Base64 audio data URL
    } catch (error) {
      if (error instanceof AIServicesError) {
        throw error;
      }
      throw new AIServicesError(
        `Network error during voice generation: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }
  }

  /**
   * Generate character using dedicated endpoint
   */
  async generateCharacterDedicated(prompt: string, cached: boolean = true): Promise<CharacterData> {
    try {
      const response = await fetch(`${this.baseUrl}/ai-services-character`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt, cached })
      });

      const result: AIServiceResponse<string> = await response.json();

      if (!result.success) {
        throw new AIServicesError(
          result.error || 'Character generation failed',
          result.code,
          result.timestamp
        );
      }

      if (!result.data) {
        throw new AIServicesError('No character data received');
      }

      return JSON.parse(result.data);
    } catch (error) {
      if (error instanceof AIServicesError) {
        throw error;
      }
      if (error instanceof SyntaxError) {
        throw new AIServicesError('Invalid character data format received');
      }
      throw new AIServicesError(
        `Network error during character generation: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }
  }
}

// Default client instance
export const aiServices = new AIServicesClient();

// Utility functions for common operations
export const aiServiceUtils = {
  /**
   * Create an audio element from base64 data URL
   */
  createAudioFromDataUrl(dataUrl: string): HTMLAudioElement {
    const audio = new Audio(dataUrl);
    return audio;
  },

  /**
   * Play audio from base64 data URL
   */
  playAudioFromDataUrl(dataUrl: string): Promise<void> {
    return new Promise((resolve, reject) => {
      const audio = this.createAudioFromDataUrl(dataUrl);
      audio.onended = () => resolve();
      audio.onerror = () => reject(new Error('Audio playback failed'));
      audio.play().catch(reject);
    });
  },

  /**
   * Download audio from base64 data URL
   */
  downloadAudioFromDataUrl(dataUrl: string, filename: string = 'audio.mp3'): void {
    const link = document.createElement('a');
    link.href = dataUrl;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  },

  /**
   * Health check with retry logic
   */
  async healthCheckWithRetry(maxRetries: number = 3, delay: number = 1000): Promise<HealthCheckResponse> {
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        return await aiServices.checkHealth();
      } catch (error) {
        if (attempt === maxRetries) {
          throw error;
        }
        await new Promise(resolve => setTimeout(resolve, delay * attempt));
      }
    }
    throw new AIServicesError('Max retries exceeded');
  },

  /**
   * Exponential backoff retry logic for any AI service call
   */
  async withRetry<T>(
    operation: () => Promise<T>,
    maxRetries: number = 3,
    baseDelay: number = 1000
  ): Promise<T> {
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        return await operation();
      } catch (error) {
        if (attempt === maxRetries) {
          throw error;
        }
        
        // Check if it's a rate limit error and apply exponential backoff
        if (error instanceof AIServicesError && error.code === 'RATE_LIMIT_EXCEEDED') {
          const delay = baseDelay * Math.pow(2, attempt - 1);
          await new Promise(resolve => setTimeout(resolve, delay));
        } else {
          throw error; // Don't retry non-rate-limit errors
        }
      }
    }
    throw new AIServicesError('Max retries exceeded');
  }
};