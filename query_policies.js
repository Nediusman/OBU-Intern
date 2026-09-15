import pg from "pg";
import dotenv from "dotenv";
dotenv.config({ path: "src/backend/.env" });
const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });
const res = await pool.query(`
  SELECT polname, polcmd, qual, with_check
  FROM pg_policy
  WHERE polrelid = 'public.website_settings'::regclass;
`);
console.log(JSON.stringify(res.rows, null, 2));
pool.end();
