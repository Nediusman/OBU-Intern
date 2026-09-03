import { createFileRoute, notFound, Link } from "@tanstack/react-router";
import { Breadcrumbs } from "@/frontend/components/Breadcrumbs";
import { Image as ImageIcon, ArrowLeft, Camera, Sparkles, Eye, Download } from "lucide-react";
import { EmptyState } from "@/frontend/components/EmptyState";
import { supabase } from "@/frontend/lib/supabase";

export const Route = createFileRoute("/galleries/$slug")({
  head: () => ({
    meta: [
      { title: "Photo Gallery — Oda Bultum University" },
      {
        name: "description",
        content:
          "View high-resolution photo collections and campus visual archives from Oda Bultum University.",
      },
    ],
  }),
  component: GalleryDetail,
  loader: async ({ params }) => {
    const { data: gallery, error } = await supabase
      .from("galleries")
      .select(
        `
        *,
        media ( file_url ),
        gallery_images (
          id,
          caption,
          display_order,
          media ( file_url, alt_text )
        )
      `,
      )
      .eq("slug", params.slug)
      .eq("status", "active")
      .single();

    if (error || !gallery) {
      if (error && error.code !== "PGRST116") {
        console.error("Failed to fetch gallery:", error);
      }
      throw notFound();
    }

    return { gallery };
  },
});

function GalleryDetail() {
  const { gallery } = Route.useLoaderData();

  // Extract images from gallery_images relationship
  const images = Array.isArray(gallery.gallery_images)
    ? gallery.gallery_images
        .sort((a, b) => (a.display_order || 0) - (b.display_order || 0))
        .map((img) => ({
          url:
            img.media && !Array.isArray(img.media) && (img.media as { file_url?: string }).file_url
              ? (img.media as { file_url?: string }).file_url
              : null,
          caption:
            img.caption ||
            (img.media && !Array.isArray(img.media)
              ? (img.media as { alt_text?: string }).alt_text
              : null),
        }))
        .filter((img) => img.url !== null)
    : [];

  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* Cover Hero */}
      <div className="relative obu-gradient py-20 md:py-28 px-4 sm:px-6 lg:px-8 text-white overflow-hidden">
        <div className="absolute inset-0 opacity-10 mix-blend-overlay pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white/15 to-transparent blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto relative z-10 animate-fade-in-up space-y-4">
          <Link
            to="/galleries"
            className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#ffcc00] hover:underline mb-2"
          >
            <ArrowLeft className="w-4 h-4" /> Back to All Galleries
          </Link>

          <div className="flex flex-wrap items-center gap-3">
            <span className="px-3 py-1 bg-[#ffcc00] text-[#186a42] text-xs font-black uppercase tracking-wider rounded-full shadow-sm">
              Photo Album
            </span>
            <span className="px-3 py-1 text-xs font-bold uppercase tracking-wider rounded-full border bg-white/20 text-white backdrop-blur-sm">
              {images.length} {images.length === 1 ? "Photograph" : "Photographs"}
            </span>
          </div>

          <h1 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-tight max-w-4xl">
            {gallery.title}
          </h1>

          {gallery.description && (
            <p className="mt-4 text-base sm:text-lg text-white/90 max-w-3xl leading-relaxed font-medium">
              {gallery.description}
            </p>
          )}
        </div>
      </div>

      {/* Breadcrumb Bar */}
      <div className="bg-gray-50 border-b border-gray-100 py-4 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <Breadcrumbs
            items={[{ label: "Galleries", to: "/galleries" }, { label: gallery.title }]}
          />
        </div>
      </div>

      <main className="flex-grow">
        <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 md:py-16">
          {images.length === 0 ? (
            <div className="bg-white border border-gray-100 rounded-3xl p-16 text-center shadow-sm max-w-2xl mx-auto">
              <Camera className="mx-auto h-20 w-20 text-gray-300 mb-4" />
              <h2 className="font-heading text-2xl font-bold text-gray-900 mb-2">Empty Album</h2>
              <p className="text-gray-500 font-medium">
                There are currently no uploaded photographs in this album.
              </p>
              <Link
                to="/galleries"
                className="mt-6 inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-[#186a42] hover:bg-[#125333] text-white font-bold text-xs uppercase tracking-wider shadow-md transition-all"
              >
                <ArrowLeft className="w-4 h-4" /> Browse Other Galleries
              </Link>
            </div>
          ) : (
            <div className="space-y-12">
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {images.map((img, idx) => (
                  <div
                    key={idx}
                    className="group bg-white rounded-3xl overflow-hidden border border-gray-100 shadow-md hover:shadow-2xl card-3d-interactive relative aspect-square"
                  >
                    <img
                      src={img.url || undefined}
                      alt={img.caption || `${gallery.title} - Photograph ${idx + 1}`}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    />

                    {/* Gradient Overlay & Caption on Hover */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-5 text-white">
                      {img.caption && (
                        <p className="text-xs font-semibold leading-snug line-clamp-2">
                          {img.caption}
                        </p>
                      )}
                      <span className="text-[10px] font-mono text-white/70 uppercase tracking-widest mt-1">
                        Photo {idx + 1} of {images.length}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Album Footer Bar */}
              <div className="pt-8 border-t border-gray-200 flex flex-col sm:flex-row items-center justify-between gap-4">
                <p className="text-xs text-gray-500 font-medium">
                  Showing {images.length} photographs from <strong>{gallery.title}</strong>
                </p>

                <Link
                  to="/galleries"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-[#186a42] hover:bg-[#125333] text-white font-bold text-xs uppercase tracking-wider shadow-md hover:shadow-lg transition-all"
                >
                  <ArrowLeft className="w-4 h-4" /> Explore All Galleries
                </Link>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
