import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import { supabase } from "@/frontend/lib/supabase";

export const Route = createFileRoute("/admin/system")({
  beforeLoad: async () => {
    const {
      data: { session },
    } = await supabase.auth.getSession();
    if (!session) {
      throw redirect({ to: "/admin/login" });
    }

    // Check role in database
    const { data: profile } = await supabase
      .from("users")
      .select(`roles(name)`)
      .eq("id", session.user.id)
      .single();

    const roleData = profile?.roles as { name?: string } | null;
    const roleName = roleData?.name?.toLowerCase();

    // Only Super Admin can access System Settings
    if (roleName !== "super admin") {
      throw redirect({ to: "/admin/dashboard" });
    }
  },
  component: SystemLayout,
});

function SystemLayout() {
  return <Outlet />;
}
