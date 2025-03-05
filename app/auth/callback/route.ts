import { createClient } from "@supabase/supabase-js";
import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");
  const redirectTo = requestUrl.searchParams.get("redirect") || "/dashboard";
  
  if (!code) {
    console.error("No code provided in callback");
    return NextResponse.redirect(new URL("/login?error=No%20authentication%20code%20provided", requestUrl.origin));
  }
  
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
    
    // Create a Supabase client configured for PKCE
    const supabase = createClient(supabaseUrl, supabaseKey, {
      auth: {
        flowType: 'pkce',
        autoRefreshToken: false,
        persistSession: false,
        detectSessionInUrl: true, // Enable session detection for the callback
      },
    });
    
    console.log("Exchanging code for session...");
    
    // Exchange the code for a session
    // The code verifier should be in localStorage from the initial sign-in request
    const { data, error } = await supabase.auth.exchangeCodeForSession(code);
    
    if (error) {
      console.error("Error exchanging code for session:", error);
      return NextResponse.redirect(
        new URL(`/login?error=${encodeURIComponent(error.message)}`, requestUrl.origin)
      );
    }
    
    if (!data.session) {
      console.error("No session returned after code exchange");
      return NextResponse.redirect(
        new URL("/login?error=Authentication%20failed", requestUrl.origin)
      );
    }
    
    // Create a response that will redirect
    const response = NextResponse.redirect(new URL(redirectTo, requestUrl.origin));
    
    // Set the auth cookies
    const cookieStore = cookies();
    
    // Set the access token
    response.cookies.set('sb-access-token', data.session.access_token, {
      path: '/',
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60, // 1 hour
      sameSite: 'lax'
    });
    
    // Set the refresh token
    response.cookies.set('sb-refresh-token', data.session.refresh_token, {
      path: '/',
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 24 * 7, // 1 week
      sameSite: 'lax'
    });
    
    // Set a flag to indicate authentication is complete
    response.cookies.set('sb-auth-token', 'true', {
      path: '/',
      httpOnly: false,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 24 * 7, // 1 week
      sameSite: 'lax'
    });
    
    console.log("Authentication successful, redirecting to:", redirectTo);
    return response;
  } catch (error) {
    console.error("Error in auth callback:", error);
    return NextResponse.redirect(
      new URL("/login?error=Authentication%20error", requestUrl.origin)
    );
  }
}
