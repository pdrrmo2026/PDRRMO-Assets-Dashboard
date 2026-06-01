import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    'Missing Supabase environment variables. ' +
    'Tiyaking naka-set ang VITE_SUPABASE_URL at VITE_SUPABASE_ANON_KEY sa iyong .env file.'
  );
}

// Using untyped client to avoid 'never' type conflicts with strict generics.
// Type safety is handled at the mapper layer in db.ts instead.
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default supabase;
