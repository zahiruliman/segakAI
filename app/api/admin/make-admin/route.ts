import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { cookies } from 'next/headers';

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Missing Supabase environment variables');
}

export async function POST(request: NextRequest) {
  try {
    // Create Supabase client for auth
    const supabaseClient = createClient(supabaseUrl, supabaseKey, {
      auth: {
        persistSession: false,
      },
    });
    
    // Get auth token from cookies
    const authToken = request.cookies.get('sb-auth-token')?.value;
    if (authToken) {
      await supabaseClient.auth.setSession({
        access_token: authToken,
        refresh_token: '',
      });
    }

    // Check if current user is authenticated
    const { data: { user } } = await supabaseClient.auth.getUser();
    
    if (!user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }
    
    // Parse request body to get email/user to make admin
    const body = await request.json();
    const { email, password } = body;
    
    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      );
    }
    
    // Check if the admin password is correct
    const { data: adminConfig, error: adminConfigError } = await supabaseClient
      .from('app_config')
      .select('value')
      .eq('key', 'ADMIN_PASSWORD')
      .single();
    
    if (adminConfigError || !adminConfig?.value) {
      return NextResponse.json(
        { error: 'Admin configuration not found' },
        { status: 500 }
      );
    }
    
    if (password !== adminConfig.value) {
      return NextResponse.json(
        { error: 'Invalid admin password' },
        { status: 403 }
      );
    }
    
    // Get user by email
    const { data: usersData, error: getUserError } = await supabaseClient
      .from('users')
      .select('id, email')
      .eq('email', email)
      .limit(1);
    
    // If the direct query fails, try searching by email
    if (getUserError || !usersData || usersData.length === 0) {
      // Since we can't filter by email directly in the admin API, we'll fetch all users
      // and find the one we need - this is not optimal but works for testing
      const { data: userData, error: authError } = await supabaseClient.auth.admin.listUsers({
        page: 1,
        perPage: 100 // Fetch enough users to find the one we need
      });
      
      if (authError || !userData) {
        return NextResponse.json(
          { error: 'Failed to list users' },
          { status: 500 }
        );
      }
      
      // Find the user with matching email
      const userMatch = userData.users.find(u => u.email === email);
      
      if (!userMatch) {
        return NextResponse.json(
          { error: 'User not found' },
          { status: 404 }
        );
      }
      
      const userId = userMatch.id;
      
      // Update user metadata to make them an admin
      const { error: updateError } = await supabaseClient.auth.admin.updateUserById(
        userId,
        { 
          user_metadata: { is_admin: true } 
        }
      );
      
      if (updateError) {
        return NextResponse.json(
          { error: 'Failed to update user: ' + updateError.message },
          { status: 500 }
        );
      }
    } else {
      // If we found the user through the direct query
      const userId = usersData[0].id;
      
      // Update user metadata to make them an admin
      const { error: updateError } = await supabaseClient.auth.admin.updateUserById(
        userId,
        { 
          user_metadata: { is_admin: true } 
        }
      );
      
      if (updateError) {
        return NextResponse.json(
          { error: 'Failed to update user: ' + updateError.message },
          { status: 500 }
        );
      }
    }
    
    return NextResponse.json({
      success: true,
      message: `User ${email} has been promoted to admin`
    });
  } catch (error) {
    console.error('Error making user admin:', error);
    return NextResponse.json(
      { error: 'An unexpected error occurred' },
      { status: 500 }
    );
  }
} 