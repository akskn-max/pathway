import { NextRequest, NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';

export async function POST(request: NextRequest) {
  try {
    const supabase = createRouteHandlerClient({ cookies });
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { data_type, data_values, data_source = 'manual', metadata = {} } = await request.json();

    if (!data_type || !data_values) {
      return NextResponse.json({ error: 'data_type and data_values are required' }, { status: 400 });
    }

    // Validate data_type
    const validDataTypes = ['vitals', 'lab_results', 'cycle_tracking', 'medication', 'symptoms', 'wearable_data'];
    if (!validDataTypes.includes(data_type)) {
      return NextResponse.json({ error: 'Invalid data_type' }, { status: 400 });
    }

    // Store health data
    const { data, error } = await supabase
      .from('health_data')
      .insert({
        user_id: user.id,
        data_type,
        data_values,
        data_source,
        metadata,
        verified: data_source !== 'manual' // Auto-verify non-manual sources
      })
      .select()
      .single();

    if (error) {
      throw error;
    }

    // Log the interaction
    await supabase
      .from('agent_interactions')
      .insert({
        user_id: user.id,
        agent_type: 'health_data_input',
        interaction_type: 'data_ingestion',
        input_data: { data_type, data_source },
        output_data: { health_data_id: data.id },
        success: true
      });

    return NextResponse.json({ 
      success: true,
      health_data_id: data.id,
      message: 'Health data successfully recorded'
    });

  } catch (error) {
    console.error('Health Data Input Error:', error);
    return NextResponse.json(
      { error: 'Failed to record health data' },
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
    const data_type = searchParams.get('data_type');
    const limit = parseInt(searchParams.get('limit') || '50');
    const offset = parseInt(searchParams.get('offset') || '0');

    let query = supabase
      .from('health_data')
      .select('*')
      .eq('user_id', user.id)
      .order('recorded_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (data_type) {
      query = query.eq('data_type', data_type);
    }

    const { data: healthData, error } = await query;

    if (error) {
      throw error;
    }

    return NextResponse.json({ 
      health_data: healthData,
      count: healthData?.length || 0
    });

  } catch (error) {
    console.error('Health Data Retrieval Error:', error);
    return NextResponse.json(
      { error: 'Failed to retrieve health data' },
      { status: 500 }
    );
  }
}