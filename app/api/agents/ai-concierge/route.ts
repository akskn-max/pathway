import { NextRequest, NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { aiConcierge } from '@/lib/gemini';

export async function POST(request: NextRequest) {
  try {
    const supabase = createRouteHandlerClient({ cookies });
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { message, conversationHistory = [] } = await request.json();

    if (!message) {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 });
    }

    // Fetch user's persona profile
    const { data: userProfile, error: profileError } = await supabase
      .from('user_profiles')
      .select('persona_profile')
      .eq('user_id', user.id)
      .single();

    if (profileError) {
      return NextResponse.json({ error: 'Failed to fetch user profile' }, { status: 500 });
    }

    const personaProfile = userProfile?.persona_profile || {
      journey_type: 'natural_conception',
      emotional_state: 'hopeful',
      priorities: ['health', 'support'],
      theme: 'sanctuary_orange'
    };

    // Generate AI response
    const response = await aiConcierge.generateResponse(
      message,
      personaProfile,
      conversationHistory
    );

    // Log the interaction
    await supabase
      .from('agent_interactions')
      .insert({
        user_id: user.id,
        agent_type: 'ai_concierge',
        interaction_type: 'chat_message',
        input_data: { message, conversationHistory },
        output_data: { response },
        processing_time_ms: Date.now() - parseInt(request.headers.get('x-start-time') || '0'),
        success: true
      });

    return NextResponse.json({ 
      response,
      persona_profile: personaProfile
    });

  } catch (error) {
    console.error('AI Concierge Error:', error);
    
    return NextResponse.json(
      { 
        error: 'I apologize, but I\'m having trouble connecting right now. Please try again in a moment.',
        fallback: true
      },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const supabase = createRouteHandlerClient({ cookies });
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type');

    if (type === 'recommendations') {
      // Fetch user's journey and profile data
      const [profileResult, journeyResult] = await Promise.all([
        supabase
          .from('user_profiles')
          .select('persona_profile')
          .eq('user_id', user.id)
          .single(),
        supabase
          .from('journeys')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })
          .limit(1)
          .single()
      ]);

      const personaProfile = profileResult.data?.persona_profile;
      const journeyData = journeyResult.data;

      if (!personaProfile) {
        return NextResponse.json({ recommendations: [] });
      }

      const recommendations = await aiConcierge.generatePersonalizedRecommendations(
        personaProfile,
        journeyData || {}
      );

      return NextResponse.json({ recommendations });
    }

    return NextResponse.json({ error: 'Invalid request type' }, { status: 400 });

  } catch (error) {
    console.error('AI Concierge GET Error:', error);
    return NextResponse.json(
      { error: 'Failed to process request' },
      { status: 500 }
    );
  }
}