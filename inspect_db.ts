import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";
dotenv.config({ path: "./src/backend/.env" });

const supabaseUrl = process.env.SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SECRET_KEY!;

const supabase = createClient(supabaseUrl, supabaseKey);

async function main() {
  console.log("Fetching existing academic_units unit_types...");
  const { data, error } = await supabase.from("academic_units").select("id, name, unit_type");
  if (error) {
    console.error("Error fetching units:", error);
  } else {
    console.log("Existing units:");
    data?.forEach((u) => console.log(`- ${u.name} | ${u.unit_type}`));
  }

  console.log("\nTesting constraint with different capitalizations...");

  const testTypes = [
    "College",
    "college",
    "Institute",
    "institute",
    "School",
    "school",
    "Department",
    "department",
    "Faculty",
    "faculty",
    "program",
    "Program",
  ];

  for (const t of testTypes) {
    const { error: insertError } = await supabase.from("academic_units").insert({
      name: `Test Unit ${t}`,
      unit_type: t,
      slug: `test-unit-${t.toLowerCase()}`,
    });

    if (insertError) {
      console.log(`❌ Reject: '${t}' -> ${insertError.message}`);
    } else {
      console.log(`✅ Accept: '${t}'`);
      // cleanup
      await supabase.from("academic_units").delete().eq("unit_type", t).like("name", "Test Unit %");
    }
  }
}

main();
