import { createClient } from '@supabase/supabase-js';

// ─────────────────────────────────────────────────────────────
// Supabase credentials — hardcoded as permanent fallback.
// Even if Vercel env vars are missing, the app will always
// connect to the correct project.
// ─────────────────────────────────────────────────────────────
const SUPABASE_URL  = 'https://lfqsqqvyxxfrwyoyvcrj.supabase.co';
const SUPABASE_KEY  = 'sb_publishable_N7Lf1J_VIfgqrZTvtg6V0Q_keB7-o2V';

const supabaseUrl  = import.meta.env.VITE_SUPABASE_URL  || SUPABASE_URL;
const supabaseKey  = import.meta.env.VITE_SUPABASE_ANON_KEY || SUPABASE_KEY;

export const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    persistSession: false,
    autoRefreshToken: false,
    detectSessionInUrl: false,
  },
  global: {
    // 20-second timeout — handles slow Smart TV / mobile connections
    fetch: (url: RequestInfo | URL, options?: RequestInit) => {
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), 20000);
      return fetch(url, { ...options, signal: controller.signal })
        .finally(() => clearTimeout(timer));
    },
  },
});

// ─────────────────────────────────────────────────────────────
// KEEP-ALIVE: Ping Supabase every 4 days (before the 7-day
// free-tier pause timer resets). This prevents the project
// from being paused due to inactivity.
// Only runs in browser environment (not SSR/build).
// ─────────────────────────────────────────────────────────────
if (typeof window !== 'undefined') {
  const PING_INTERVAL_MS = 4 * 24 * 60 * 60 * 1000; // 4 days

  const pingSupabase = async () => {
    try {
      await supabase.from('equipment').select('id').limit(1);
      console.log('[Supabase keep-alive] ping OK', new Date().toISOString());
    } catch {
      // silent — just a background ping
    }
  };

  // Initial ping on load, then every 4 days
  setTimeout(pingSupabase, 5000);
  setInterval(pingSupabase, PING_INTERVAL_MS);
}

export default supabase;
