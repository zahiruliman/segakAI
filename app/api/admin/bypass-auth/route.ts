import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

// This is a temporary route to bypass authentication for development purposes
export async function POST() {
  try {
    // Create a fake session with an expiration time (24 hours from now)
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();
    
    // Create a fake regular user object
    const regularUser = {
      id: 'bypass-user',
      email: 'user@segakai.com',
      role: 'user',
      last_sign_in_at: new Date().toISOString(),
    };
    
    // Create a fake session object
    const session = {
      access_token: 'fake-access-token-for-bypass',
      refresh_token: 'fake-refresh-token-for-bypass',
      expires_at: expiresAt,
      user: regularUser,
    };
    
    // Set fake cookies that middleware will recognize
    const cookieStore = await cookies();
    
    // Set the auth token cookie (JSON string of the session)
    cookieStore.set('sb-auth-token', JSON.stringify(session), {
      expires: new Date(expiresAt),
      path: '/',
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
    });
    
    // Set the access token cookie
    cookieStore.set('sb-access-token', 'fake-access-token-for-bypass', {
      expires: new Date(expiresAt),
      path: '/',
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
    });
    
    // Set a flag to indicate this is a bypass session
    cookieStore.set('user-bypass', '1', {
      expires: new Date(expiresAt),
      path: '/',
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
    });
    
    // Return success response
    return NextResponse.json({ 
      success: true, 
      message: 'User bypass authentication successful' 
    });
  } catch (error) {
    console.error('User bypass authentication error:', error);
    
    return NextResponse.json(
      { 
        success: false, 
        message: error instanceof Error ? error.message : 'User bypass authentication failed' 
      },
      { status: 500 }
    );
  }
} 