import { createFileRoute, redirect } from "@tanstack/react-router";

// Preserve the former public URL without retaining its legacy PostgreSQL data path.
export const Route = createFileRoute("/career/vacancies")({
  beforeLoad: () => {
    throw redirect({ to: "/careers" });
  },
  component: () => null,
});
