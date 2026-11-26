import { createClient } from '@supabase/supabase-js';

// Hardcoded credentials — always used as fallback even if env vars are missing on Vercel
const supabaseUrl =
  import.meta.env.VITE_SUPABASE_URL ||
  'https://lfqsqqvyxxfrwyoyvcrj.supabase.co';

const supabaseAnonKey =
  import.meta.env.VITE_SUPABASE_ANON_KEY ||
  'sb_publishable_N7Lf1J_VIfgqrZTvtg6V0Q_keB7-o2V';

// Using untyped client to avoid 'never' type conflicts with strict generics.
// Type safety is handled at the mapper layer in db.ts instead.
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: false,     // no localStorage auth session needed
    autoRefreshToken: false,   // reduces background requests
    detectSessionInUrl: false,
  },
  global: {
    // Increase timeout — Smart TVs / slow connections need more time
    fetch: (url: RequestInfo | URL, options?: RequestInit) => {
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), 20000); // 20s timeout
      return fetch(url, { ...options, signal: controller.signal })
        .finally(() => clearTimeout(timer));
    },
  },
});

export default supabase;
