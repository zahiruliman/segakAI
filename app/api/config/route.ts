import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { cookies } from 'next/headers';

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Missing Supabase environment variables');
}

export async function GET(request: NextRequest) {
  try {
    // Create Supabase client with server auth
    const cookieStore = cookies();
    const supabaseClient = createClient(supabaseUrl, supabaseKey, {
      auth: {
        persistSession: false,
      },
    });
    
    // Get the session cookie directly from request headers
    const authToken = request.cookies.get('sb-auth-token')?.value;
    if (authToken) {
      await supabaseClient.auth.setSession({
        access_token: authToken,
        refresh_token: '',
      });
    }

    // Check if user is authenticated and is admin
    const { data: { user } } = await supabaseClient.auth.getUser();
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    // For security, verify the user is an admin
    const { data: userData, error: userError } = await supabaseClient
      .from('users')
      .select('*')
      .eq('id', user.id)
      .single();
    
    // Check if user has admin privileges (you need to define this logic based on your user model)
    const isAdmin = userData?.raw_user_meta_data?.is_admin === true || 
                    userData?.user_metadata?.is_admin === true;
    
    if (!isAdmin) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // Get query parameters
    const searchParams = request.nextUrl.searchParams;
    const configKey = searchParams.get('key');

    if (configKey) {
      // Fetch specific config
      const { data, error } = await supabaseClient
        .from('app_config')
        .select('*')
        .eq('key', configKey)
        .single();

      if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
      }

      // Mask secret values in the response
      if (data.is_secret) {
        data.value = data.value ? '••••••••••••••••' : '';
      }

      return NextResponse.json(data);
    } else {
      // Fetch all configs
      const { data, error } = await supabaseClient
        .from('app_config')
        .select('*')
        .order('key');

      if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
      }

      // Mask secret values in the response
      for (const config of data) {
        if (config.is_secret && config.value) {
          config.value = '••••••••••••••••';
        }
      }

      return NextResponse.json(data);
    }
  } catch (error) {
    console.error('Error fetching config:', error);
    return NextResponse.json(
      { error: 'Failed to fetch config' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    // Create Supabase client with server auth
    const cookieStore = cookies();
    const supabaseClient = createClient(supabaseUrl, supabaseKey, {
      auth: {
        persistSession: false,
      },
    });
    
    // Get the session cookie directly from request headers
    const authToken = request.cookies.get('sb-auth-token')?.value;
    if (authToken) {
      await supabaseClient.auth.setSession({
        access_token: authToken,
        refresh_token: '',
      });
    }

    // Check if user is authenticated and is admin
    const { data: { user } } = await supabaseClient.auth.getUser();
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    // Verify admin privileges (this should match your admin verification logic)
    const { data: userData, error: userError } = await supabaseClient
      .from('users')
      .select('*')
      .eq('id', user.id)
      .single();
    
    const isAdmin = userData?.raw_user_meta_data?.is_admin === true || 
                    userData?.user_metadata?.is_admin === true;
    
    if (!isAdmin) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // Parse the request body
    const body = await request.json();
    const { key, value } = body;

    if (!key || value === undefined) {
      return NextResponse.json(
        { error: 'Key and value are required' },
        { status: 400 }
      );
    }

    // Update or insert the config
    const { data, error } = await supabaseClient
      .from('app_config')
      .update({ value, updated_at: new Date().toISOString() })
      .eq('key', key)
      .select();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error('Error updating config:', error);
    return NextResponse.json(
      { error: 'Failed to update config' },
      { status: 500 }
    );
  }
} 