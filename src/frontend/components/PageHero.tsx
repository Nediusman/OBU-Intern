interface PageHeroProps {
  title: string;
  subtitle?: string;
}

export function PageHero({ title, subtitle }: PageHeroProps) {
  return (
    <section className="bg-primary py-20 text-primary-foreground md:py-28">
      <div className="container mx-auto px-4 text-center md:px-6">
        <h1 className="font-heading text-4xl font-bold md:text-5xl lg:text-6xl">{title}</h1>
        {subtitle && (
          <p className="mx-auto mt-4 max-w-3xl text-lg text-primary-foreground/90">{subtitle}</p>
        )}
      </div>
    </section>
  );
}
