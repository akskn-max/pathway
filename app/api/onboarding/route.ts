import { NextRequest, NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { PersonaEngine } from '@/lib/persona-engine';

export async function POST(request: NextRequest) {
  try {
    const supabase = createRouteHandlerClient({ cookies });
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const onboardingData = await request.json();

    // Generate persona profile from onboarding data
    const personaProfile = PersonaEngine.generatePersonaFromOnboarding(onboardingData);

    // Create or update user profile
    const { data: existingProfile } = await supabase
      .from('user_profiles')
      .select('id')
      .eq('user_id', user.id)
      .single();

    let profileResult;
    
    if (existingProfile) {
      // Update existing profile
      profileResult = await supabase
        .from('user_profiles')
        .update({
          first_name: onboardingData.first_name || '',
          last_name: onboardingData.last_name || '',
          date_of_birth: onboardingData.date_of_birth || null,
          persona_profile: personaProfile,
          onboarding_completed: true,
          updated_at: new Date().toISOString()
        })
        .eq('user_id', user.id)
        .select()
        .single();
    } else {
      // Create new profile
      profileResult = await supabase
        .from('user_profiles')
        .insert({
          user_id: user.id,
          email: user.email || '',
          first_name: onboardingData.first_name || '',
          last_name: onboardingData.last_name || '',
          date_of_birth: onboardingData.date_of_birth || null,
          persona_profile: personaProfile,
          onboarding_completed: true
        })
        .select()
        .single();
    }

    if (profileResult.error) {
      throw profileResult.error;
    }

    // Create initial journey record
    const { error: journeyError } = await supabase
      .from('journeys')
      .insert({
        user_id: user.id,
        journey_type: personaProfile.journey_type,
        status: 'planning',
        current_phase: 'assessment',
        journey_data: {
          onboarding_data: onboardingData,
          initial_goals: onboardingData.priorities || []
        }
      });

    if (journeyError) {
      console.error('Journey creation error:', journeyError);
      // Don't fail the whole onboarding if journey creation fails
    }

    // Log the onboarding completion
    await supabase
      .from('agent_interactions')
      .insert({
        user_id: user.id,
        agent_type: 'demographic_input',
        interaction_type: 'onboarding_completion',
        input_data: onboardingData,
        output_data: { persona_profile: personaProfile },
        success: true
      });

    return NextResponse.json({ 
      success: true,
      persona_profile: personaProfile,
      user_profile: profileResult.data,
      message: 'Onboarding completed successfully'
    });

  } catch (error) {
    console.error('Onboarding Error:', error);
    return NextResponse.json(
      { error: 'Failed to complete onboarding' },
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

    // Check onboarding status
    const { data: userProfile, error } = await supabase
      .from('user_profiles')
      .select('onboarding_completed, persona_profile')
      .eq('user_id', user.id)
      .single();

    if (error && error.code !== 'PGRST116') {
      throw error;
    }

    return NextResponse.json({ 
      onboarding_completed: userProfile?.onboarding_completed || false,
      persona_profile: userProfile?.persona_profile || null
    });

  } catch (error) {
    console.error('Onboarding Status Error:', error);
    return NextResponse.json(
      { error: 'Failed to check onboarding status' },
      { status: 500 }
    );
  }
}