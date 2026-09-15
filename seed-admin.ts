import { createClient } from "@supabase/supabase-js";
import * as dotenv from "dotenv";
import * as path from "path";

dotenv.config({ path: path.resolve(process.cwd(), "src/backend/.env") });

const supabaseUrl = process.env["SUPABASE_URL"];
const supabaseSecretKey = process.env["SUPABASE_SECRET_KEY"];

if (!supabaseUrl || !supabaseSecretKey) {
  console.error("Missing Supabase credentials in .env");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseSecretKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

async function createAdmin() {
  // NOTE: These are development/test credentials only.
  // Do not use this script or these credentials in a production environment.
  const email = "admin@obu.edu.et";
  const password = "obu2025admin";

  console.log("Checking if user exists...");
  // List users is admin only, but we have secret key.
  // Actually it's easier to just create. If it fails due to existing, we can update password.
  const { data, error } = await supabase.auth.admin.createUser({
    email: email,
    password: password,
    email_confirm: true, // Auto-confirm the email
    user_metadata: {
      full_name: "OBU Administrator",
    },
  });

  if (error) {
    if (error.message.includes("already exists") || error.message.includes("already registered")) {
      console.log(`User ${email} already exists. Updating password...`);
      // Get user id
      const { data: usersData } = await supabase.auth.admin.listUsers();
      const existingUser = usersData.users.find((u) => u.email === email);
      if (existingUser) {
        const { error: updateError } = await supabase.auth.admin.updateUserById(existingUser.id, {
          password: password,
          email_confirm: true,
        });
        if (updateError) {
          console.error("Failed to update password:", updateError.message);
        } else {
          console.log(`Successfully reset password for ${email} to ${password}`);
        }
      }
    } else {
      console.error("Failed to create user:", error.message);
    }
  } else {
    console.log(`Successfully created admin user ${email} with password ${password}`);
  }
}

createAdmin();
