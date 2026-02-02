// Supabase client — safe initialization
// Returns a no-op client if env vars are not configured
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_PUBLISHABLE_KEY = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

function createSafeClient(): SupabaseClient<Database> {
  if (SUPABASE_URL && SUPABASE_PUBLISHABLE_KEY) {
    return createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
      auth: {
        storage: localStorage,
        persistSession: true,
        autoRefreshToken: true,
      },
    });
  }

  // Return a stub that won't crash — all calls fail gracefully
  console.warn('[Lumiq] Supabase not configured (VITE_SUPABASE_URL / VITE_SUPABASE_PUBLISHABLE_KEY missing). Supabase features disabled.');
  return createClient<Database>(
    'https://placeholder.supabase.co',
    'placeholder-key',
    {
      auth: {
        storage: localStorage,
        persistSession: false,
        autoRefreshToken: false,
      },
    }
  );
}

export const supabase = createSafeClient();
