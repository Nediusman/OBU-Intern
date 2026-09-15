const { Pool } = require("pg");

async function main() {
  const pool = new Pool({
    connectionString:
      "postgresql://postgres.ugqoyhmxvzwmbndyghvm:Henth@131314@aws-1-eu-west-1.pooler.supabase.com:6543/postgres?pgbouncer=true",
  });

  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    // Add column if not exists
    await client.query(`
      ALTER TABLE community_engagements ADD COLUMN IF NOT EXISTS slug TEXT;
    `);

    // Fetch existing records without slugs
    const res = await client.query(
      "SELECT id, title FROM community_engagements WHERE slug IS NULL",
    );

    // Backfill slugs
    const seenSlugs = new Set();

    for (const row of res.rows) {
      let baseSlug = (row.title || "engagement")
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, "");
      if (!baseSlug) baseSlug = "engagement";

      let slug = baseSlug;
      let counter = 1;
      while (seenSlugs.has(slug)) {
        slug = `${baseSlug}-${counter}`;
        counter++;
      }
      seenSlugs.add(slug);

      await client.query("UPDATE community_engagements SET slug = $1 WHERE id = $2", [
        slug,
        row.id,
      ]);
    }

    // Create unique index
    await client.query(`
      CREATE UNIQUE INDEX IF NOT EXISTS community_engagements_slug_idx ON community_engagements(slug);
    `);

    await client.query("COMMIT");
    console.log("Migration and backfill completed successfully!");
  } catch (err) {
    await client.query("ROLLBACK");
    console.error("Error during migration:", err);
  } finally {
    client.release();
    await pool.end();
  }
}
main();
