import { NextRequest, NextResponse } from 'next/server';
import { worldBuilderAI } from '@/lib/services/world-builder-ai-service';
import type { LocationGenerationRequest } from '@/lib/services/world-builder-ai-service';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate request
    if (!body.mapId || !body.name || !body.type || !body.coordinates) {
      return NextResponse.json(
        { 
          success: false,
          error: 'MapId, name, type, and coordinates are required',
          requiredFields: ['mapId', 'name', 'type', 'coordinates'],
          optionalFields: ['description', 'atmosphere', 'includeImage', 'mood', 'style']
        },
        { status: 400 }
      );
    }

    // Validate coordinates
    if (!body.coordinates.x || !body.coordinates.y) {
      return NextResponse.json(
        { 
          success: false,
          error: 'Coordinates must include x and y values',
          example: { coordinates: { x: 100, y: 200 } }
        },
        { status: 400 }
      );
    }

    const locationRequest: LocationGenerationRequest = {
      mapId: body.mapId,
      name: body.name,
      type: body.type,
      coordinates: body.coordinates,
      description: body.description || `A ${body.type} called ${body.name}`,
      atmosphere: body.atmosphere || 'mysterious',
      includeImage: body.includeImage || false,
      mood: body.mood || 'atmospheric',
      style: body.style || 'fantasy'
    };

    // Generate location using AI service
    const response = await worldBuilderAI.generateLocation(locationRequest);

    if (!response.success) {
      return NextResponse.json(
        { 
          success: false,
          error: response.error || 'Failed to generate location',
          timestamp: new Date().toISOString()
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      data: response.data,
      metadata: response.metadata,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Location generation error:', error);
    
    return NextResponse.json(
      { 
        success: false,
        error: error instanceof Error ? error.message : 'Internal server error',
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    endpoint: 'Location Generation API',
    method: 'POST',
    description: 'Generate detailed locations with descriptions and optional images',
    usage: {
      required: ['mapId', 'name', 'type', 'coordinates'],
      optional: ['description', 'atmosphere', 'includeImage', 'mood', 'style']
    },
    locationTypes: [
      'city', 'town', 'village', 'castle', 'fort',
      'dungeon', 'cave', 'ruin', 'temple', 'shrine',
      'forest', 'mountain', 'lake', 'river', 'coast',
      'school', 'library', 'museum', 'laboratory',
      'custom'
    ],
    moods: ['mysterious', 'peaceful', 'ominous', 'magical', 'ancient', 'bustling', 'serene', 'haunted'],
    styles: ['fantasy', 'realistic', 'gothic', 'steampunk', 'medieval', 'modern', 'futuristic'],
    example: {
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
      },
      response: {
        success: true,
        data: {
          id: 'location_1234567890',
          mapId: 'map_123',
          name: 'The Whispering Archive',
          type: 'library',
          coordinates: { x: 100, y: 200 },
          description: 'Towering shelves stretch into misty shadows, filled with tomes that whisper secrets to those who dare to listen...',
          environment: {
            timeOfDay: 'noon',
            weather: 'clear',
            ambientSounds: ['mysterious and scholarly'],
            lightLevel: 75
          },
          images: ['https://example.com/library.jpg'],
          aiGenerated: true
        }
      }
    },
    timestamp: new Date().toISOString()
  });
}
