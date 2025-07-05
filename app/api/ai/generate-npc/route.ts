import { NextRequest, NextResponse } from 'next/server';
import { worldBuilderAI } from '@/lib/services/world-builder-ai-service';
import type { NPCGenerationRequest } from '@/types';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate request
    if (!body.race || !body.occupation) {
      return NextResponse.json(
        { error: 'Race and occupation are required' },
        { status: 400 }
      );
    }

    const npcRequest: NPCGenerationRequest = {
      name: body.name,
      race: body.race,
      occupation: body.occupation,
      personality: body.personality,
      background: body.background,
      setting: body.setting,
      knowledgeAreas: body.knowledgeAreas || [],
      includePortrait: body.includePortrait || false,
      includeVoice: body.includeVoice || false
    };

    // Generate NPC using AI service
    const npc = await worldBuilderAI.generateNPC(npcRequest);

    return NextResponse.json({
      success: true,
      data: npc,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('NPC generation error:', error);
    
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
    message: 'NPC Generation API',
    usage: 'POST with { race, occupation, personality?, background?, setting?, knowledgeAreas?, includePortrait?, includeVoice? }',
    timestamp: new Date().toISOString()
  });
}
