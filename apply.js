import { Client } from "pg";
import fs from "fs";
async function main() {
  const client = new Client({ connectionString: process.env.DATABASE_URL });
  await client.connect();
  await client.query(fs.readFileSync("supabase/migrations/20260825_media_bucket.sql", "utf-8"));
  console.log("Success");
  process.exit(0);
}
main();
