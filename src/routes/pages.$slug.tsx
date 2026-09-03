import { createFileRoute, notFound } from "@tanstack/react-router";
import { Breadcrumbs } from "@/frontend/components/Breadcrumbs";
import { supabase } from "@/frontend/lib/supabase";

export const Route = createFileRoute("/pages/$slug")({
  component: DynamicPage,
  loader: async ({ params }) => {
    const rawSlug = params.slug || "";
    const cleanSlug = rawSlug
      .replace(/^\/+|\/+$/g, "")
      .trim()
      .toLowerCase();

    const { data: page, error } = await supabase
      .from("pages")
      .select(
        `
        *,
        main_image:main_image_id(id, file_url),
        featured_image:featured_image_id(id, file_url)
      `,
      )
      .or(`slug.eq.${cleanSlug},slug.eq./${cleanSlug}`)
      .eq("status", "published")
      .maybeSingle();

    if (error || !page) throw notFound();

    return {
      ...page,
      main_image_url:
        (page as unknown as { main_image?: { file_url: string } | null }).main_image?.file_url ??
        null,
      featured_image_url:
        (page as unknown as { featured_image?: { file_url: string } | null }).featured_image
          ?.file_url ?? null,
    };
  },
  head: ({ loaderData }) => {
    const page = loaderData;
    return {
      meta: [
        { title: `${page?.seo_title || page?.title || "Page"} — Oda Bultum University` },
        {
          name: "description",
          content:
            page?.seo_description ||
            page?.short_description ||
            "Official page of Oda Bultum University.",
        },
      ],
    };
  },
});

function DynamicPage() {
  const page = Route.useLoaderData();

  return (
    <div className="flex flex-col min-h-screen bg-white">
      {page.main_image_url ? (
        <div className="relative w-full h-[35vh] min-h-[250px] md:h-[45vh] lg:min-h-[400px] bg-gray-900">
          <img
            src={page.main_image_url}
            alt={page.title}
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-transparent" />
          <div className="absolute inset-0 flex items-end pb-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
              <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold text-white tracking-tight drop-shadow-md">
                {page.title}
              </h1>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-[#186a42] py-16 md:py-24 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
          <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white to-transparent" />
          <div className="max-w-7xl mx-auto relative z-10 text-center md:text-left">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white tracking-tight">
              {page.title}
            </h1>
          </div>
        </div>
      )}

      <main className="flex-grow container mx-auto px-4 py-8 md:py-12 max-w-4xl">
        <Breadcrumbs items={[{ label: "Pages" }, { label: page.title }]} />

        <div className="prose prose-lg prose-[#186a42] max-w-none mt-8 md:mt-12 whitespace-pre-wrap text-gray-700">
          {page.short_description && (
            <p className="lead text-xl text-gray-800 font-medium mb-8 italic border-l-4 border-[#ffcc00] pl-6 py-2 bg-gray-50/50 rounded-r-lg">
              {page.short_description}
            </p>
          )}
          <div className="leading-relaxed">{page.content}</div>
        </div>
      </main>
    </div>
  );
}
