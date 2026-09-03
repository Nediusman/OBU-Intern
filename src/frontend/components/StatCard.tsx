interface StatCardProps {
  value: string;
  label: string;
}

export function StatCard({ value, label }: StatCardProps) {
  return (
    <div className="text-center">
      <div className="font-heading text-4xl font-bold text-foreground md:text-5xl">{value}</div>
      <div className="mt-1 text-sm font-medium uppercase tracking-wide text-muted-foreground">
        {label}
      </div>
    </div>
  );
}
