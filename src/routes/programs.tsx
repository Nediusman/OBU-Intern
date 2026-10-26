import { createFileRoute, redirect } from "@tanstack/react-router";

// Redirect legacy /programs route directly to the active /academics/programs catalog
export const Route = createFileRoute("/programs")({
  beforeLoad: () => {
    throw redirect({ to: "/academics/programs" });
  },
  component: () => null,
});
