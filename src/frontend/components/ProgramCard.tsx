import { Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";

interface ProgramCardProps {
  title: string;
  description: string;
  to?: string;
}

export function ProgramCard({ title, description, to = "/programs" }: ProgramCardProps) {
  return (
    <Link
      to={to}
      className="group flex flex-col rounded-xl border border-border bg-card p-6 shadow-sm transition-all hover:border-accent hover:shadow-md"
    >
      <h3 className="font-heading text-xl font-semibold text-card-foreground transition-colors group-hover:text-accent">
        {title}
      </h3>
      <p className="mt-3 flex-1 text-sm leading-relaxed text-muted-foreground">{description}</p>
      <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-medium text-accent transition-colors group-hover:underline">
        Learn more
        <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
      </span>
    </Link>
  );
}
