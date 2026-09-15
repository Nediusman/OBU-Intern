import { Pool } from 'pg';
import dotenv from 'dotenv';
dotenv.config({ path: 'src/backend/.env' });

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

async function main() {
  const result = await pool.query(`
    SELECT column_name, data_type, is_nullable, column_default
    FROM information_schema.columns
    WHERE table_name = 'research_facilities';
  `);
  console.log("COLUMNS:");
  console.table(result.rows);

  const data = await pool.query('SELECT * FROM research_facilities LIMIT 3;');
  console.log("DATA:");
  console.log(JSON.stringify(data.rows, null, 2));

  pool.end();
}
main();
