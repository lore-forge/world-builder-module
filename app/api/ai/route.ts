import { NextRequest, NextResponse } from 'next/server';
import { worldBuilderAI } from '@/lib/services/world-builder-ai-service';

export async function GET() {
  try {
    // Test AI service initialization
    await worldBuilderAI.initialize();
    
    return NextResponse.json({
      message: 'World Builder AI Services',
      status: 'healthy',
      version: '1.0.0',
      timestamp: new Date().toISOString(),
      services: {
        npcGeneration: {
          endpoint: '/api/ai/generate-npc',
          method: 'POST',
          description: 'Generate NPCs with AI-powered personalities, backgrounds, and optional portraits/voices',
          parameters: {
            required: ['race', 'occupation'],
            optional: ['name', 'personality', 'background', 'setting', 'knowledgeAreas', 'includePortrait', 'includeVoice']
          }
        },
        locationGeneration: {
          endpoint: '/api/ai/generate-location',
          method: 'POST',
          description: 'Generate detailed locations with descriptions and optional images',
          parameters: {
            required: ['mapId', 'name', 'type', 'coordinates'],
            optional: ['description', 'atmosphere', 'educationalContent', 'environment', 'includeImage', 'mood', 'style']
          }
        },
        adventureGeneration: {
          endpoint: '/api/ai/generate-adventure',
          method: 'POST',
          description: 'Generate complete adventures with story arcs and quest chains',
          parameters: {
            required: ['worldId', 'title'],
            optional: ['description', 'genre', 'theme', 'difficulty', 'educationalObjectives', 'includeImage']
          }
        },
        terrainGeneration: {
          endpoint: '/api/ai/generate-terrain',
          method: 'POST',
          description: 'Generate terrain descriptions with geographical features',
          parameters: {
            required: ['biome', 'size', 'climate'],
            optional: ['features', 'includeImage']
          }
        }
      },
      integration: {
        package: 'lore-forge-ai-services',
        version: '^0.1.1',
        features: [
          'Character generation with full stats',
          'Scene creation with mood and atmosphere',
          'Adventure generation with educational objectives',
          'Voice synthesis for NPCs',
          'Image generation for characters, scenes, and terrain',
          'Cached responses for performance'
        ]
      },
      examples: {
        npcGeneration: {
          request: {
            race: 'elf',
            occupation: 'librarian',
            personality: 'wise and mysterious',
            background: 'keeper of ancient knowledge',
            setting: 'magical library',
            knowledgeAreas: ['ancient history', 'magical artifacts'],
            includePortrait: true,
            includeVoice: true
          }
        },
        locationGeneration: {
          request: {
            mapId: 'map_123',
            name: 'The Whispering Archive',
            type: 'library',
            coordinates: { x: 100, y: 200 },
            description: 'A vast magical library',
            atmosphere: 'mysterious and scholarly',
            includeImage: true,
            mood: 'mystical',
            style: 'fantasy'
          }
        },
        adventureGeneration: {
          request: {
            worldId: 'world_456',
            title: 'The Lost Codex',
            description: 'A quest to find an ancient magical tome',
            genre: 'fantasy',
            theme: 'knowledge vs ignorance',
            difficulty: 'medium',
            includeImage: true
          }
        },
        terrainGeneration: {
          request: {
            biome: 'forest',
            size: 'large',
            climate: 'temperate',
            features: ['ancient ruins', 'hidden springs', 'old growth trees'],
            includeImage: true
          }
        }
      }
    });
  } catch (error) {
    console.error('AI service health check failed:', error);
    
    return NextResponse.json(
      {
        message: 'World Builder AI Services',
        status: 'error',
        error: error instanceof Error ? error.message : 'Service initialization failed',
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Handle different AI operations based on the action parameter
    switch (body.action) {
      case 'health-check':
        await worldBuilderAI.initialize();
        return NextResponse.json({
          status: 'healthy',
          services: ['character', 'scene', 'adventure', 'voice', 'image'],
          timestamp: new Date().toISOString()
        });
      
      case 'reinitialize':
        await worldBuilderAI.initialize();
        return NextResponse.json({
          status: 'reinitialized',
          timestamp: new Date().toISOString()
        });
      
      default:
        return NextResponse.json(
          { error: 'Invalid action. Supported actions: health-check, reinitialize' },
          { status: 400 }
        );
    }
  } catch (error) {
    console.error('AI service operation failed:', error);
    
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : 'Operation failed',
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    );
  }
}
