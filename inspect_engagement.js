const { Pool } = require("pg");
require("dotenv").config({ path: "src/backend/.env" });

async function main() {
  const pool = new Pool({
    connectionString:
      "postgresql://postgres.ugqoyhmxvzwmbndyghvm:Henth@131314@aws-1-eu-west-1.pooler.supabase.com:6543/postgres?pgbouncer=true",
  });

  try {
    const res = await pool.query("SELECT id, title, gallery FROM community_engagements LIMIT 5");
    console.log("Existing Engagements:", res.rows);
  } catch (err) {
    console.error("Error:", err);
  } finally {
    await pool.end();
  }
}
main();
