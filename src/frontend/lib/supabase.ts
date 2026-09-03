import { createClient } from "@supabase/supabase-js";
import type { Database } from "./database.types";

const supabaseUrl =
  import.meta.env["VITE_SUPABASE_URL"] ||
  process.env["SUPABASE_URL"] ||
  "https://ugqoyhmxvzwmbndyghvm.supabase.co";

const supabaseAnonKey =
  import.meta.env["VITE_SUPABASE_ANON_KEY"] ||
  import.meta.env["VITE_SUPABASE_PUBLISHABLE_KEY"] ||
  process.env["SUPABASE_PUBLISHABLE_KEY"] ||
  "sb_publishable_seA9-pKXxbvbRWD-OJRbIw_03QU5KJb";

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error("Missing Supabase environment variables for client.");
}

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);
