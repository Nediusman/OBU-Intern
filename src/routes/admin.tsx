import { createFileRoute, Outlet, redirect, useRouterState } from "@tanstack/react-router";
import { AdminShell } from "@/frontend/admin/layouts/AdminShell";
import { supabase } from "@/frontend/lib/supabase";

export const Route = createFileRoute("/admin")({
  beforeLoad: async ({ location }) => {
    // Allow access to login page
    if (location.pathname === "/admin/login") return;

    // Check real Supabase session
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session) {
      throw redirect({
        to: "/admin/login",
        search: { redirect: location.href },
      });
    }
  },
  component: AdminLayout,
});

function AdminLayout() {
  const routerState = useRouterState();
  const isLoginPage = routerState.location.pathname === "/admin/login";

  if (isLoginPage) {
    return <Outlet />;
  }

  return (
    <AdminShell>
      <Outlet />
    </AdminShell>
  );
}
