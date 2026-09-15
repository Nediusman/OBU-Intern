import { getDb, initDb } from "./src/backend/database/db.ts";
async function main() {
  await initDb();
  const res = await getDb().query(
    "SELECT relname, relrowsecurity FROM pg_class WHERE relname IN ('pages', 'navigation_items', 'media', 'website_settings', 'academic_units', 'programs', 'homepage_sections');",
  );
  console.log(JSON.stringify(res.rows, null, 2));
  process.exit(0);
}
main();
