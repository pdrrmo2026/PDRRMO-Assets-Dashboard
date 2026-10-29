import { createClient } from '@supabase/supabase-js';

// Fallback to hardcoded values so the app works on Vercel even without env vars set
const supabaseUrl =
  import.meta.env.VITE_SUPABASE_URL ||
  'https://lfqsqqvyxxfrwyoyvcrj.supabase.co';

const supabaseAnonKey =
  import.meta.env.VITE_SUPABASE_ANON_KEY ||
  'sb_publishable_N7Lf1J_VIfgqrZTvtg6V0Q_keB7-o2V';

// Using untyped client to avoid 'never' type conflicts with strict generics.
// Type safety is handled at the mapper layer in db.ts instead.
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default supabase;
