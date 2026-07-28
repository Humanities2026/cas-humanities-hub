import { createClient } from '@supabase/supabase-js';

// ── Pull credentials from Vite environment variables ──────────────
// Add these in Vercel: Project → Settings → Environment Variables
// Also create a local .env file (never commit it to git):
//
//   VITE_SUPABASE_URL=https://jawmpnzvdiznomgfsxza.supabase.co
//   VITE_SUPABASE_KEY=your_anon_key_here
//
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error(
    '⚠️  Supabase env vars missing. ' +
    'Create a .env file with VITE_SUPABASE_URL and VITE_SUPABASE_KEY.'
  );
}

export const supabase = createClient(
  supabaseUrl || 'https://placeholder.supabase.co',
  supabaseKey || 'placeholder-key'
);
