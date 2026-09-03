import { createClient } from "@supabase/supabase-js";
import type { Database } from "../../frontend/lib/database.types";
import dotenv from "dotenv";
import path from "path";

// Load environment variables for the server execution environment
dotenv.config({ path: path.resolve(process.cwd(), "src/backend/.env") });

const supabaseUrl = process.env["SUPABASE_URL"] || "";
const supabaseServiceRoleKey = process.env["SUPABASE_SERVICE_ROLE_KEY"] || "";

if (!supabaseUrl || !supabaseServiceRoleKey) {
  throw new Error(
    "Missing Supabase environment variables for server. Ensure SUPABASE_SERVICE_ROLE_KEY is set in src/backend/.env",
  );
}

export const supabaseServer = createClient<Database>(supabaseUrl, supabaseServiceRoleKey);
