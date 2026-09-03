interface EventCardProps {
  month: string;
  day: string;
  title: string;
  excerpt: string;
}

export function EventCard({ month, day, title, excerpt }: EventCardProps) {
  return (
    <article className="flex gap-4 rounded-xl border border-border bg-card p-4 transition-colors hover:border-accent">
      <div className="flex h-16 w-16 shrink-0 flex-col items-center justify-center rounded-lg bg-primary text-primary-foreground">
        <span className="text-[10px] font-semibold uppercase tracking-wide">{month}</span>
        <span className="text-2xl font-bold leading-none">{day}</span>
      </div>
      <div className="min-w-0">
        <h3 className="font-heading text-lg font-semibold leading-tight text-card-foreground">
          {title}
        </h3>
        <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">{excerpt}</p>
      </div>
    </article>
  );
}
