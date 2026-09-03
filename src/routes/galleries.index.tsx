import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Image as ImageIcon,
  Search,
  Sparkles,
  Camera,
  ArrowRight,
  ChevronRight,
} from "lucide-react";
import { Breadcrumbs } from "@/frontend/components/Breadcrumbs";
import { supabase } from "@/frontend/lib/supabase";
import { useState, useMemo } from "react";

export const Route = createFileRoute("/galleries/")({
  head: () => ({
    meta: [
      { title: "Campus Galleries & Visual Media — Oda Bultum University" },
      {
        name: "description",
        content:
          "Explore photographic galleries, campus landmarks, academic ceremonies, and student life at Oda Bultum University.",
      },
    ],
  }),
  component: GalleriesIndex,
  loader: async () => {
    const { data, error } = await supabase
      .from("galleries")
      .select("id, title, slug, description, gallery_images(count)")
      .eq("status", "active")
      .order("created_at", { ascending: false });
    if (error) throw error;
    return { galleries: data ?? [] };
  },
});

function GalleriesIndex() {
  const { galleries } = Route.useLoaderData();
  const [search, setSearch] = useState("");

  const filteredGalleries = useMemo(() => {
    return galleries.filter((g) => {
      const q = search.toLowerCase();
      return (
        search === "" ||
        g.title?.toLowerCase().includes(q) ||
        g.description?.toLowerCase().includes(q)
      );
    });
  }, [galleries, search]);

  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* Page Hero */}
      <div className="obu-gradient py-20 md:py-28 px-4 sm:px-6 lg:px-8 relative overflow-hidden text-white">
        <div className="absolute inset-0 opacity-10 mix-blend-overlay pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white/15 to-transparent blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto relative z-10 animate-fade-in-up">
          <div className="inline-flex items-center gap-2 rounded-full bg-[#ffcc00] px-4 py-1.5 text-xs font-bold uppercase tracking-[0.2em] text-[#186a42] mb-5 shadow-lg">
            <Camera className="w-3.5 h-3.5" />
            Visual History & Campus Life
          </div>
          <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-tight">
            Campus Galleries
          </h1>
          <p className="mt-4 text-lg md:text-xl text-white/90 max-w-3xl font-medium leading-relaxed">
            Moments, landmarks, academic ceremonies, and vibrant student experiences captured across
            Oda Bultum University campuses.
          </p>
        </div>
      </div>

      {/* Breadcrumb Bar */}
      <div className="bg-gray-50 border-b border-gray-100 py-4 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <Breadcrumbs items={[{ label: "Galleries" }]} />
        </div>
      </div>

      <main className="flex-grow">
        <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 md:py-16 space-y-12">
          {/* Search & Control Bar */}
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-gray-50/80 p-6 rounded-3xl border border-gray-100">
            <div className="relative w-full md:max-w-md">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search galleries by title or topic..."
                className="w-full pl-12 pr-4 py-3.5 rounded-2xl bg-white border border-gray-200 text-sm font-medium text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#186a42] focus:border-transparent shadow-sm transition-all"
              />
            </div>

            <div className="text-xs font-bold uppercase tracking-widest text-gray-500 self-start md:self-center">
              Showing <strong className="text-[#186a42]">{filteredGalleries.length}</strong> Photo
              Collections
            </div>
          </div>

          {/* Galleries Grid */}
          {filteredGalleries.length === 0 ? (
            <div className="bg-white border border-gray-100 rounded-3xl p-16 text-center shadow-sm max-w-2xl mx-auto">
              <ImageIcon className="mx-auto h-20 w-20 text-gray-300 mb-4" />
              <h2 className="font-heading text-2xl font-bold text-gray-900 mb-2">
                No Galleries Found
              </h2>
              <p className="text-gray-500 font-medium">
                {search
                  ? "No galleries match your search query. Try clearing your search."
                  : "Campus galleries are currently being curated."}
              </p>
              {search && (
                <button
                  onClick={() => setSearch("")}
                  className="mt-6 inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#186a42] text-white font-bold text-xs uppercase tracking-wider shadow-sm hover:bg-[#125333] transition-colors"
                >
                  Clear Search
                </button>
              )}
            </div>
          ) : (
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {filteredGalleries.map((gallery) => {
                const count = Array.isArray(gallery.gallery_images)
                  ? (gallery.gallery_images[0]?.count ?? 0)
                  : 0;

                return (
                  <Link
                    key={gallery.id}
                    to="/galleries/$slug"
                    params={{ slug: gallery.slug ?? gallery.id }}
                    className="group bg-white rounded-3xl border border-gray-100 shadow-md hover:shadow-2xl hover:border-[#186a42]/30 card-3d-interactive flex flex-col justify-between overflow-hidden relative"
                  >
                    <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-[#186a42] via-[#ffcc00] to-[#186a42] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                    <div>
                      {/* Visual Header Tile */}
                      <div className="aspect-[16/10] w-full bg-[#186a42]/5 group-hover:bg-[#186a42]/10 transition-colors flex items-center justify-center relative overflow-hidden">
                        <Camera className="w-16 h-16 text-[#186a42]/30 group-hover:scale-110 group-hover:text-[#186a42]/50 transition-all duration-500" />
                        <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold text-[#186a42] shadow-sm border border-gray-200/50">
                          {count} {count === 1 ? "Photograph" : "Photographs"}
                        </div>
                      </div>

                      {/* Content */}
                      <div className="p-7 space-y-3">
                        <span className="text-[10px] font-black uppercase tracking-wider bg-[#186a42]/10 text-[#186a42] px-2.5 py-0.5 rounded-full inline-block">
                          Photo Collection
                        </span>

                        <h2 className="font-heading text-xl font-bold text-gray-900 group-hover:text-[#186a42] transition-colors leading-snug">
                          {gallery.title}
                        </h2>

                        {gallery.description && (
                          <p className="text-gray-600 text-xs sm:text-sm leading-relaxed line-clamp-3 font-normal">
                            {gallery.description}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Action Footer */}
                    <div className="p-7 pt-0">
                      <div className="w-full inline-flex items-center justify-between px-5 py-3 rounded-2xl bg-gray-50 group-hover:bg-[#186a42] text-gray-800 group-hover:text-white font-bold text-xs uppercase tracking-wider transition-all duration-300">
                        <span>View Photo Album</span>
                        <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
