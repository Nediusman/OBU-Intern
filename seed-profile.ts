import { createClient } from "@supabase/supabase-js";
import * as dotenv from "dotenv";
import * as path from "path";

dotenv.config({ path: path.resolve(process.cwd(), "src/backend/.env") });

const supabaseUrl = process.env["SUPABASE_URL"];
const supabaseSecretKey = process.env["SUPABASE_SECRET_KEY"];

const supabase = createClient(supabaseUrl, supabaseSecretKey);

async function setupProfile() {
  // NOTE: This is a development/test account only.
  const email = "admin@obu.edu.et";

  // Get user ID
  const { data: usersData } = await supabase.auth.admin.listUsers();
  const user = usersData.users.find((u) => u.email === email);

  if (!user) {
    console.error("User not found in auth.users");
    return;
  }

  // Find super admin role
  const { data: roles } = await supabase.from("roles").select("*").ilike("name", "%super admin%");
  let roleId = null;
  if (roles && roles.length > 0) {
    roleId = roles[0].id;
  } else {
    // create super admin role
    const { data: newRole } = await supabase
      .from("roles")
      .insert({
        name: "Super Admin",
        description: "Full system access",
      })
      .select()
      .single();
    if (newRole) roleId = newRole.id;
  }

  const { error } = await supabase.from("users").upsert({
    id: user.id,
    email: email,
    full_name: "OBU Administrator",
    role_id: roleId,
    password_hash: "SUPABASE_AUTH_DELEGATED",
  });

  if (error) {
    console.error("Failed to setup public profile:", error);
  } else {
    console.log("Successfully linked admin to Super Admin role in public.users!");
  }
}

setupProfile();
