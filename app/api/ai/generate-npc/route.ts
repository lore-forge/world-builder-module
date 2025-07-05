import { NextRequest, NextResponse } from 'next/server';
import { worldBuilderAI } from '@/lib/services/world-builder-ai-service';
import type { NPCGenerationRequest } from '@/lib/services/world-builder-ai-service';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate request
    if (!body.race || !body.occupation) {
      return NextResponse.json(
        { 
          success: false,
          error: 'Race and occupation are required',
          requiredFields: ['race', 'occupation'],
          optionalFields: ['personality', 'background', 'setting', 'knowledgeAreas', 'includePortrait', 'includeVoice']
        },
        { status: 400 }
      );
    }

    const npcRequest: NPCGenerationRequest = {
      race: body.race,
      occupation: body.occupation,
      personality: body.personality || 'neutral',
      background: body.background || `A typical ${body.race} ${body.occupation}`,
      setting: body.setting || 'fantasy world',
      knowledgeAreas: body.knowledgeAreas || [body.occupation],
      includePortrait: body.includePortrait || false,
      includeVoice: body.includeVoice || false
    };

    // Generate NPC using AI service
    const response = await worldBuilderAI.generateNPC(npcRequest);

    if (!response.success) {
      return NextResponse.json(
        { 
          success: false,
          error: response.error || 'Failed to generate NPC',
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
    endpoint: 'NPC Generation API',
    method: 'POST',
    description: 'Generate NPCs with AI-powered personalities, backgrounds, and optional portraits/voices',
    usage: {
      required: ['race', 'occupation'],
      optional: ['personality', 'background', 'setting', 'knowledgeAreas', 'includePortrait', 'includeVoice']
    },
    example: {
      request: {
        race: 'elf',
        occupation: 'librarian',
        personality: 'wise and mysterious',
        background: 'keeper of ancient knowledge',
        setting: 'magical library',
        knowledgeAreas: ['ancient history', 'magical artifacts'],
        includePortrait: true,
        includeVoice: true
      },
      response: {
        success: true,
        data: {
          id: 'npc_1234567890',
          name: 'Elara Moonwhisper',
          race: 'elf',
          occupation: 'librarian',
          personality: {
            alignment: 'Neutral Good',
            ideals: ['Knowledge should be preserved and shared'],
            bonds: ['The Great Library is my sacred trust'],
            flaws: ['I sometimes value books more than people']
          },
          backstory: 'Born in the twilight realm between worlds...',
          imageUrl: 'https://example.com/portrait.jpg',
          voiceId: 'voice_abc123',
          aiGenerated: true
        }
      }
    },
    timestamp: new Date().toISOString()
  });
}
