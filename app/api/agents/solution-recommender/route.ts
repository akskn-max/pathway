import { NextRequest, NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';

interface RecommendationRequest {
  journey_type: string;
  persona_profile: any;
  health_data?: any;
  preferences?: any;
}

export async function POST(request: NextRequest) {
  try {
    const supabase = createRouteHandlerClient({ cookies });
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { journey_type, persona_profile, health_data, preferences } = await request.json() as RecommendationRequest;

    // Fetch relevant providers based on journey type and location
    const { data: providers, error: providersError } = await supabase
      .from('providers')
      .select('*')
      .eq('verification_status', 'verified')
      .contains('specializations', [journey_type])
      .order('rating_average', { ascending: false })
      .limit(10);

    if (providersError) {
      throw providersError;
    }

    // Generate recommendations based on persona and providers
    const recommendations = generatePersonalizedRecommendations(
      providers || [],
      persona_profile,
      health_data,
      preferences
    );

    // Log the recommendation request
    await supabase
      .from('agent_interactions')
      .insert({
        user_id: user.id,
        agent_type: 'solution_recommender',
        interaction_type: 'generate_recommendations',
        input_data: { journey_type, persona_profile, health_data, preferences },
        output_data: { recommendations: recommendations.length },
        success: true
      });

    return NextResponse.json({ 
      recommendations,
      total_providers: providers?.length || 0
    });

  } catch (error) {
    console.error('Solution Recommender Error:', error);
    return NextResponse.json(
      { error: 'Failed to generate recommendations' },
      { status: 500 }
    );
  }
}

function generatePersonalizedRecommendations(
  providers: any[],
  personaProfile: any,
  healthData?: any,
  preferences?: any
) {
  return providers.map(provider => {
    let score = provider.rating_average * 20; // Base score from ratings
    
    // Adjust score based on persona profile
    if (personaProfile.financial_readiness === 'limited' && 
        provider.outcome_metrics?.cost_effectiveness) {
      score += 15;
    }
    
    if (personaProfile.emotional_state === 'anxious' && 
        provider.specializations?.includes('emotional_support')) {
      score += 10;
    }
    
    if (personaProfile.timeline_urgency === 'urgent' && 
        provider.location_data?.availability === 'immediate') {
      score += 10;
    }
    
    // Adjust for insurance coverage
    if (preferences?.insurance_plan && 
        provider.insurance_accepted?.includes(preferences.insurance_plan)) {
      score += 20;
    }

    return {
      ...provider,
      recommendation_score: Math.min(score, 100), // Cap at 100
      match_reasons: generateMatchReasons(provider, personaProfile, preferences)
    };
  })
  .sort((a, b) => b.recommendation_score - a.recommendation_score);
}

function generateMatchReasons(provider: any, personaProfile: any, preferences?: any): string[] {
  const reasons = [];
  
  if (provider.rating_average >= 4.5) {
    reasons.push('Highly rated by patients');
  }
  
  if (provider.specializations?.includes(personaProfile.journey_type)) {
    reasons.push(`Specializes in ${personaProfile.journey_type}`);
  }
  
  if (personaProfile.emotional_state === 'anxious' && 
      provider.specializations?.includes('emotional_support')) {
    reasons.push('Provides emotional support services');
  }
  
  if (preferences?.insurance_plan && 
      provider.insurance_accepted?.includes(preferences.insurance_plan)) {
    reasons.push('Accepts your insurance');
  }
  
  if (provider.outcome_metrics?.success_rate > 0.7) {
    reasons.push('High success rate');
  }

  return reasons;
}