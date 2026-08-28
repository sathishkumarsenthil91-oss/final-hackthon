import { createClient, SupabaseClient } from '@supabase/supabase-js';

// ============================================================================
// 🔑 SUPABASE CLIENT CONFIGURATION
// Retrieves credentials from Vite environment variables with robust fallback handling.
// ============================================================================

const getEnvVar = (key: string): string => {
  try {
    if (typeof import.meta !== 'undefined' && import.meta.env) {
      return (import.meta.env as Record<string, string>)[key] || '';
    }
  } catch {
    // In environments without import.meta
  }
  return '';
};

// Supabase URL & Public Anon Key
export const SUPABASE_URL =
  getEnvVar('VITE_SUPABASE_URL') || 'https://nzgisrrrbabedlntmcoc.supabase.co';

export const SUPABASE_ANON_KEY =
  getEnvVar('VITE_SUPABASE_ANON_KEY') ||
  'sb_publishable_CZTBEfxJPsy4EjJSMXtydw_yZ0gzyJ0';

/**
 * Validates if the Supabase project configuration is set and non-empty.
 */
export const isSupabaseConfigured = (): boolean => {
  return Boolean(
    SUPABASE_URL &&
      SUPABASE_URL.startsWith('http') &&
      SUPABASE_ANON_KEY &&
      SUPABASE_ANON_KEY.length > 10
  );
};

/**
 * Initializes and exports the shared singleton Supabase client instance.
 */
export const supabase: SupabaseClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
    flowType: 'pkce',
    storage: typeof window !== 'undefined' ? window.localStorage : undefined,
  },
  realtime: {
    params: {
      eventsPerSecond: 20,
    },
  },
});

/**
 * Helper to get the typed client instance safely.
 */
export const getSupabase = (): SupabaseClient => supabase;

export default supabase;
