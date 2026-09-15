import { Pool } from 'pg';
import dotenv from 'dotenv';
dotenv.config({ path: 'src/backend/.env' });

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

async function main() {
  try {
    console.log("Adding columns to research_facilities...");
    await pool.query(`
      ALTER TABLE research_facilities ADD COLUMN IF NOT EXISTS slug VARCHAR(255);
      ALTER TABLE research_facilities ADD COLUMN IF NOT EXISTS main_image_id UUID REFERENCES media(id) ON DELETE SET NULL;
    `);

    console.log("Backfilling slugs...");
    const facilities = await pool.query("SELECT id, name FROM research_facilities WHERE slug IS NULL");
    
    for (const fac of facilities.rows) {
      let slug = (fac.name || 'facility').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
      if (!slug) slug = 'facility-' + Math.floor(Math.random() * 10000);
      
      let uniqueSlug = slug;
      let counter = 1;
      while (true) {
        const existing = await pool.query("SELECT id FROM research_facilities WHERE slug = $1 AND id != $2", [uniqueSlug, fac.id]);
        if (existing.rows.length === 0) break;
        uniqueSlug = `${slug}-${counter}`;
        counter++;
      }
      await pool.query("UPDATE research_facilities SET slug = $1 WHERE id = $2", [uniqueSlug, fac.id]);
      console.log(`Updated facility ${fac.id} with slug ${uniqueSlug}`);
    }

    console.log("Adding constraints...");
    await pool.query(`
      ALTER TABLE research_facilities DROP CONSTRAINT IF EXISTS research_facilities_slug_key;
      ALTER TABLE research_facilities ADD CONSTRAINT research_facilities_slug_key UNIQUE (slug);
    `);
    
    console.log("Migration complete!");
  } catch (err) {
    console.error("Migration failed:", err);
  } finally {
    pool.end();
  }
}
main();
