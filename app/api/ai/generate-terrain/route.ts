import { NextRequest, NextResponse } from 'next/server';
import { worldBuilderAI } from '@/lib/services/world-builder-ai-service';
import type { TerrainGenerationRequest } from '@/types';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate request
    if (!body.biome || !body.size || !body.climate) {
      return NextResponse.json(
        { error: 'biome, size, and climate are required' },
        { status: 400 }
      );
    }

    const terrainRequest: TerrainGenerationRequest = {
      biome: body.biome,
      size: body.size,
      climate: body.climate,
      features: body.features || [],
      includeImage: body.includeImage || false
    };

    // Generate terrain using AI service
    const terrain = await worldBuilderAI.generateTerrain(terrainRequest);

    return NextResponse.json({
      success: true,
      data: terrain,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Terrain generation error:', error);
    
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
    message: 'Terrain Generation API',
    usage: 'POST with { biome, size, climate, features?, includeImage? }',
    supportedBiomes: [
      'forest', 'grassland', 'desert', 'tundra', 'mountains',
      'swamp', 'jungle', 'coastal', 'volcanic', 'arctic',
      'savanna', 'wetlands', 'plateau', 'canyon', 'valley'
    ],
    supportedSizes: [
      'small', 'medium', 'large', 'vast', 'continental'
    ],
    supportedClimates: [
      'arctic', 'cold', 'temperate', 'warm', 'tropical',
      'arid', 'humid', 'maritime', 'continental'
    ],
    exampleFeatures: [
      'rivers', 'lakes', 'caves', 'cliffs', 'waterfalls',
      'ruins', 'roads', 'bridges', 'settlements', 'resources'
    ],
    timestamp: new Date().toISOString()
  });
}
