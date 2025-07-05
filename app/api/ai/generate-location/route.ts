import { NextRequest, NextResponse } from 'next/server';
import { worldBuilderAI } from '@/lib/services/world-builder-ai-service';
import type { LocationGenerationRequest } from '@/types';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate request
    if (!body.mapId || !body.name || !body.type || !body.coordinates) {
      return NextResponse.json(
        { error: 'mapId, name, type, and coordinates are required' },
        { status: 400 }
      );
    }

    const locationRequest: LocationGenerationRequest = {
      mapId: body.mapId,
      name: body.name,
      type: body.type,
      coordinates: body.coordinates,
      description: body.description,
      atmosphere: body.atmosphere,
      educationalContent: body.educationalContent,
      environment: body.environment,
      includeImage: body.includeImage || false,
      mood: body.mood,
      style: body.style
    };

    // Generate location using AI service
    const location = await worldBuilderAI.generateLocation(locationRequest);

    return NextResponse.json({
      success: true,
      data: location,
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
    message: 'Location Generation API',
    usage: 'POST with { mapId, name, type, coordinates, description?, atmosphere?, educationalContent?, environment?, includeImage?, mood?, style? }',
    supportedTypes: [
      'city', 'town', 'village', 'castle', 'fort',
      'dungeon', 'cave', 'ruin', 'temple', 'shrine',
      'forest', 'mountain', 'lake', 'river', 'coast',
      'school', 'library', 'museum', 'laboratory', 'custom'
    ],
    timestamp: new Date().toISOString()
  });
}
