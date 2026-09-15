import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";
dotenv.config({ path: "./src/backend/.env" });

const supabaseUrl = process.env.SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SECRET_KEY!;

const supabase = createClient(supabaseUrl, supabaseKey);

async function main() {
  console.log("Testing status constraint...");

  const statuses = ["draft", "active", "published", "archived", "pending"];

  for (const s of statuses) {
    const { error: insertError } = await supabase.from("programs").insert({
      name: `Test Program ${s}`,
      slug: `test-program-${s}`,
      degree: "BSc",
      status: s,
    });

    if (insertError) {
      console.log(`❌ Program Reject: '${s}' -> ${insertError.message}`);
    } else {
      console.log(`✅ Program Accept: '${s}'`);
      await supabase.from("programs").delete().eq("status", s).like("name", "Test Program %");
    }
  }

  for (const s of statuses) {
    const { error: insertError } = await supabase.from("academic_units").insert({
      name: `Test Unit ${s}`,
      unit_type: "college",
      slug: `test-unit-${s}`,
      status: s,
    });

    if (insertError) {
      console.log(`❌ Unit Reject: '${s}' -> ${insertError.message}`);
    } else {
      console.log(`✅ Unit Accept: '${s}'`);
      await supabase.from("academic_units").delete().eq("status", s).like("name", "Test Unit %");
    }
  }
}

main();
