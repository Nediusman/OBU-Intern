import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";
dotenv.config({ path: "./src/backend/.env" });

const supabaseUrl = process.env.SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SECRET_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

async function main() {
  const { error } = await supabase.from("academic_units").insert({
    name: "Test Inactive",
    slug: "test-inactive",
    unit_type: "college",
    status: "inactive",
  });
  if (error) console.log(error.message);
  else {
    console.log("Accepted inactive");
    await supabase.from("academic_units").delete().eq("name", "Test Inactive");
  }
}
main();
