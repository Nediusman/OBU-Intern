import { getDb, initDb } from "./src/backend/database/db.ts";
async function main() {
  await initDb();
  const res = await getDb().query(
    "SELECT column_name, data_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'users';",
  );
  console.log(JSON.stringify(res.rows, null, 2));
  process.exit(0);
}
main();
