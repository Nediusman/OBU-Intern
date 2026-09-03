import { createFileRoute, Link } from "@tanstack/react-router";
import { Breadcrumbs } from "@/frontend/components/Breadcrumbs";
import { Image as ImageIcon } from "lucide-react";
import { supabase } from "@/frontend/lib/supabase";

export const Route = createFileRoute("/admin/research/gallery")({
  component: GalleriesIndex,
  loader: async () => {
    const { data: galleries, error } = await supabase
      .from("galleries")
      .select(
        `
        *,
        media ( file_url ),
        gallery_images ( id )
      `,
      )
      .eq("status", "active")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Failed to fetch galleries:", error);
      throw new Error("Failed to fetch galleries");
    }

    return { galleries: galleries || [] };
  },
});

function GalleriesIndex() {
  const { galleries } = Route.useLoaderData();

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <div className="bg-[#186a42] py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold text-white tracking-tight">Photo Galleries</h1>
          <p className="mt-2 text-white/80 max-w-2xl">
            Visual highlights from Oda Bultum University.
          </p>
        </div>
      </div>

      <main className="flex-grow container mx-auto px-4 py-8 max-w-7xl">
        <Breadcrumbs items={[{ label: "Galleries" }]} />

        <div className="mt-8 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {galleries.map((gallery) => {
            // Safely get cover image URL
            const coverUrl =
              gallery.media &&
              !Array.isArray(gallery.media) &&
              (gallery.media as { file_url?: string }).file_url
                ? (gallery.media as { file_url?: string }).file_url
                : null;

            // Photo count is either the number of child gallery_images, or fallback to 0
            const photoCount = Array.isArray(gallery.gallery_images)
              ? gallery.gallery_images.length
              : 0;

            return (
              <Link
                key={gallery.id}
                to="/galleries/$slug"
                params={{ slug: gallery.slug || gallery.id }}
                className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow group flex flex-col"
              >
                <div className="h-48 overflow-hidden bg-gray-100 relative">
                  {coverUrl ? (
                    <img
                      src={coverUrl}
                      alt={gallery.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                      <ImageIcon className="h-12 w-12" />
                    </div>
                  )}
                  <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded font-semibold flex items-center gap-1">
                    <ImageIcon className="h-3.5 w-3.5" />
                    {photoCount} Photos
                  </div>
                </div>
                <div className="p-4 flex flex-col flex-grow">
                  <h2 className="text-lg font-bold text-gray-900 group-hover:text-[#186a42] mb-2">
                    {gallery.title}
                  </h2>
                  <p className="text-sm text-gray-600 line-clamp-2 mb-4">{gallery.description}</p>
                  <div className="text-xs font-semibold text-[#186a42] mt-auto uppercase tracking-wider flex items-center gap-1">
                    View Gallery &rarr;
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </main>
    </div>
  );
}
