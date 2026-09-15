import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";
dotenv.config({ path: "./src/backend/.env" });

const supabaseUrl = process.env.SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SECRET_KEY!;

const supabase = createClient(supabaseUrl, supabaseKey);

async function main() {
  // query information schema for triggers
  // Wait, Supabase client via REST cannot query information_schema.
  // Instead, let's insert a program and see the exact error.
  console.log("Attempting to insert a program...");

  const { error: insertError } = await supabase.from("programs").insert({
    name: "Test Program",
    slug: "test-program",
    degree: "BSc",
    status: "draft",
  });

  if (insertError) {
    console.log(`❌ Program Insert Reject: ${insertError.message}`);
  } else {
    console.log(`✅ Program Insert Accept`);
    await supabase.from("programs").delete().eq("slug", "test-program");
  }
}

main();
