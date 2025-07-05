import { NextRequest, NextResponse } from 'next/server';
import { worldBuilderAI } from '@/lib/services/world-builder-ai-service';
import type { AdventureGenerationRequest } from '@/types';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate request
    if (!body.worldId || !body.title) {
      return NextResponse.json(
        { error: 'worldId and title are required' },
        { status: 400 }
      );
    }

    const adventureRequest: AdventureGenerationRequest = {
      worldId: body.worldId,
      title: body.title,
      description: body.description,
      genre: body.genre,
      theme: body.theme,
      difficulty: body.difficulty,
      educationalObjectives: body.educationalObjectives || [],
      includeImage: body.includeImage || false
    };

    // Generate adventure using AI service
    const adventure = await worldBuilderAI.generateAdventure(adventureRequest);

    return NextResponse.json({
      success: true,
      data: adventure,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Adventure generation error:', error);
    
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
    message: 'Adventure Generation API',
    usage: 'POST with { worldId, title, description?, genre?, theme?, difficulty?, educationalObjectives?, includeImage? }',
    supportedGenres: ['fantasy', 'scifi', 'historical', 'educational', 'custom'],
    supportedDifficulties: ['easy', 'medium', 'hard'],
    timestamp: new Date().toISOString()
  });
}
