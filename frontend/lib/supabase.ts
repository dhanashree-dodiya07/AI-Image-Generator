import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export interface Profile {
  id: string;
  email: string;
  created_at: string;
}

export interface GeneratedImage {
  id: string;
  user_id: string;
  prompt: string;
  image_url: string;
  likes: number;
  created_at: string;
}
