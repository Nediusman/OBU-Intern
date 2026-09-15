import { Pool } from "pg";
import fs from "fs";
import path from "path";
import "dotenv/config";

async function main() {
  const pool = new Pool({
    connectionString:
      "postgresql://postgres.ugqoyhmxvzwmbndyghvm:Henth@131314@aws-1-eu-west-1.pooler.supabase.com:6543/postgres?pgbouncer=true",
  });

  const sql = fs.readFileSync(
    "supabase/migrations/20260831110000_add_research_projects_slug.sql",
    "utf8",
  );
  try {
    await pool.query(sql);
    console.log("Migration applied successfully!");
  } catch (err) {
    console.error("Migration failed:", err);
  } finally {
    await pool.end();
  }
}

main();
