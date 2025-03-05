import { createClient, SupabaseClient } from '@supabase/supabase-js'

// Log Supabase URL and key presence (no values) for debugging
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

// Debug environment variables (safe to log existence, not values)
console.log('[Supabase] URL defined:', !!supabaseUrl)
console.log('[Supabase] Anon key defined:', !!supabaseAnonKey)

// This is for client-side usage (browser)
export const createClientComponentClient = (): SupabaseClient => {
  if (!supabaseUrl || !supabaseAnonKey) {
    console.error('[Supabase] Missing environment variables')
    throw new Error('Missing Supabase environment variables')
  }

  try {
    // Create a client with minimal configuration
    // We'll let the auth callback handle session management
    const client = createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        flowType: 'pkce',
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: true, // Enable session detection in URL
        storage: {
          getItem: (key) => {
            if (typeof window === 'undefined') {
              return null;
            }
            return window.localStorage.getItem(key);
          },
          setItem: (key, value) => {
            if (typeof window !== 'undefined') {
              window.localStorage.setItem(key, value);
            }
          },
          removeItem: (key) => {
            if (typeof window !== 'undefined') {
              window.localStorage.removeItem(key);
            }
          },
        },
      },
    })
    console.log('[Supabase] Client initialized successfully')
    return client
  } catch (error) {
    console.error('[Supabase] Failed to initialize client:', error)
    throw error
  }
}

// Create a simpler placeholder to avoid TS errors with complex typings
const createPlaceholderClient = (): any => ({
  auth: {
    getSession: async () => ({ data: { session: null }, error: null }),
    getUser: async () => ({ data: { user: null }, error: null }),
    signInWithOAuth: async () => ({ data: null, error: new Error("Not available in SSR") }),
    signOut: async () => ({ error: null }),
  },
  from: () => ({
    select: () => ({
      eq: () => ({
        order: () => ({})
      })
    })
  }),
})

// Export the instance for direct import
export let supabase: SupabaseClient
try {
  supabase = createClientComponentClient()
} catch (error) {
  console.error('[Supabase] Error creating client:', error)
  // Use the placeholder client as a fallback
  supabase = createPlaceholderClient() as unknown as SupabaseClient
}
