import { createFileRoute, Link } from "@tanstack/react-router";
import { Breadcrumbs } from "@/frontend/components/Breadcrumbs";
import {
  Calendar,
  Search,
  Newspaper,
  ArrowRight,
  ChevronRight,
  Sparkles,
  Tag,
  Clock,
  User,
  Eye,
} from "lucide-react";
import { supabase } from "@/frontend/lib/supabase";
import type { Database } from "@/frontend/lib/database.types";
import { useState, useMemo } from "react";

export const Route = createFileRoute("/news/")({
  head: () => ({
    meta: [
      { title: "News & Media — Oda Bultum University" },
      {
        name: "description",
        content:
          "Read official news, stories, press releases, and campus updates from Oda Bultum University.",
      },
    ],
  }),
  component: NewsIndex,
  loader: async () => {
    const { data: news, error } = await supabase
      .from("news")
      .select("*, media:featured_image_id(id, file_url)")
      .eq("status", "published")
      .order("published_at", { ascending: false });

    if (error) {
      console.error("Failed to fetch news:", error);
      throw new Error("Failed to fetch news");
    }

    return {
      news: (news || []) as Array<
        Database["public"]["Tables"]["news"]["Row"] & {
          media?: { id: string; file_url: string } | null;
        }
      >,
    };
  },
});

function NewsIndex() {
  const { news } = Route.useLoaderData();
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  // Extract unique categories from actual data
  const categories = useMemo(() => {
    const cats = new Set<string>();
    news.forEach((item) => {
      if (item.category && item.category.trim()) {
        cats.add(item.category.trim());
      }
    });
    return ["All", ...Array.from(cats)];
  }, [news]);

  // Filter news
  const filteredNews = useMemo(() => {
    return news.filter((item) => {
      const q = search.toLowerCase();
      const matchesSearch =
        search === "" ||
        item.title?.toLowerCase().includes(q) ||
        item.short_description?.toLowerCase().includes(q) ||
        item.content?.toLowerCase().includes(q) ||
        item.author?.toLowerCase().includes(q);

      const matchesCat =
        selectedCategory === "All" ||
        (item.category && item.category.trim().toLowerCase() === selectedCategory.toLowerCase());

      return matchesSearch && matchesCat;
    });
  }, [news, search, selectedCategory]);

  const latestArticle = filteredNews.length > 0 ? filteredNews[0] : null;
  const otherArticles = filteredNews.length > 1 ? filteredNews.slice(1) : [];

  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* Page Hero */}
      <div className="obu-gradient py-20 md:py-28 px-4 sm:px-6 lg:px-8 relative overflow-hidden text-white">
        <div className="absolute inset-0 opacity-10 mix-blend-overlay pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white/15 to-transparent blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto relative z-10 animate-fade-in-up">
          <div className="inline-flex items-center gap-2 rounded-full bg-[#ffcc00] px-4 py-1.5 text-xs font-bold uppercase tracking-[0.2em] text-[#186a42] mb-5 shadow-lg">
            <Newspaper className="w-3.5 h-3.5" />
            Official University Newsroom
          </div>
          <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-tight">
            News & Press Releases
          </h1>
          <p className="mt-4 text-lg md:text-xl text-white/90 max-w-3xl font-medium leading-relaxed">
            The latest official announcements, academic achievements, research breakthroughs, and
            institutional milestones from Oda Bultum University.
          </p>
        </div>
      </div>

      {/* Breadcrumb Bar */}
      <div className="bg-gray-50 border-b border-gray-100 py-4 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <Breadcrumbs items={[{ label: "News & Media" }]} />
        </div>
      </div>

      <main className="flex-grow">
        <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 md:py-16 space-y-12">
          {/* Search & Category Filter Section */}
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-gray-50/80 p-6 rounded-3xl border border-gray-100">
            <div className="relative w-full md:max-w-md">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search articles by keyword, topic, author..."
                className="w-full pl-12 pr-4 py-3.5 rounded-2xl bg-white border border-gray-200 text-sm font-medium text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#186a42] focus:border-transparent shadow-sm transition-all"
              />
            </div>

            {/* Category Filter Pills */}
            <div className="flex flex-wrap items-center gap-2 self-start md:self-center">
              {categories.length > 2 &&
                categories.map((cat) => {
                  const isActive = selectedCategory === cat;
                  return (
                    <button
                      key={cat}
                      onClick={() => setSelectedCategory(cat)}
                      className={`px-3.5 py-1.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all duration-300 ${
                        isActive
                          ? "bg-[#186a42] text-white shadow-md shadow-[#186a42]/20"
                          : "bg-white text-gray-600 border border-gray-200 hover:border-[#186a42] hover:text-[#186a42]"
                      }`}
                    >
                      {cat}
                    </button>
                  );
                })}

              <span className="text-xs font-bold uppercase tracking-widest text-gray-500 ml-2">
                Showing <strong className="text-[#186a42]">{filteredNews.length}</strong> Articles
              </span>
            </div>
          </div>

          {filteredNews.length === 0 ? (
            <div className="bg-white border border-gray-100 rounded-3xl p-16 text-center shadow-sm max-w-2xl mx-auto">
              <Newspaper className="mx-auto h-20 w-20 text-gray-300 mb-4" />
              <h2 className="font-heading text-2xl font-bold text-gray-900 mb-2">
                No News Articles Found
              </h2>
              <p className="text-gray-500 font-medium">
                {search || selectedCategory !== "All"
                  ? "No published articles match your query. Try clearing your filters."
                  : "News articles are currently being prepared for publication."}
              </p>
              {(search || selectedCategory !== "All") && (
                <button
                  onClick={() => {
                    setSearch("");
                    setSelectedCategory("All");
                  }}
                  className="mt-6 inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#186a42] text-white font-bold text-xs uppercase tracking-wider shadow-sm hover:bg-[#125333] transition-colors"
                >
                  Reset Filters
                </button>
              )}
            </div>
          ) : (
            <div className="space-y-12">
              {/* ─── LATEST PUBLISHED ARTICLE (EDITORIAL SHOWCASE) ─── */}
              {latestArticle && (
                <section className="space-y-4">
                  <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#186a42]">
                    <Sparkles className="w-4 h-4 text-[#ffcc00]" />
                    Latest University Story
                  </div>

                  <Link
                    to="/news/$slug"
                    params={{ slug: latestArticle.slug }}
                    className="group block bg-white rounded-3xl border border-gray-100 shadow-xl hover:shadow-2xl hover:border-[#186a42]/30 card-3d-interactive overflow-hidden relative"
                  >
                    <div className="h-2 w-full absolute top-0 left-0 obu-gradient z-10" />

                    <div
                      className={`grid grid-cols-1 ${latestArticle.media?.file_url ? "lg:grid-cols-12" : ""}`}
                    >
                      {latestArticle.media?.file_url && (
                        <div className="lg:col-span-5 relative overflow-hidden min-h-[260px] lg:min-h-[380px]">
                          <img
                            src={latestArticle.media.file_url}
                            alt={latestArticle.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent lg:hidden" />
                        </div>
                      )}

                      <div
                        className={`p-8 sm:p-12 space-y-5 flex flex-col justify-between ${latestArticle.media?.file_url ? "lg:col-span-7" : ""}`}
                      >
                        <div className="space-y-4">
                          <div className="flex flex-wrap items-center gap-3">
                            <span className="px-3.5 py-1 bg-[#ffcc00] text-[#186a42] text-xs font-black uppercase tracking-wider rounded-full shadow-sm">
                              {latestArticle.category || "General"}
                            </span>
                            <div className="flex items-center gap-1.5 text-xs font-bold text-gray-500">
                              <Calendar className="w-4 h-4 text-[#186a42]" />
                              <span>
                                {latestArticle.published_at
                                  ? new Date(latestArticle.published_at).toLocaleDateString(
                                      "en-US",
                                      {
                                        month: "long",
                                        day: "numeric",
                                        year: "numeric",
                                      },
                                    )
                                  : "Recent"}
                              </span>
                            </div>
                            {latestArticle.author && (
                              <div className="flex items-center gap-1.5 text-xs text-gray-500">
                                <User className="w-3.5 h-3.5 text-gray-400" />
                                <span>{latestArticle.author}</span>
                              </div>
                            )}
                          </div>

                          <h2 className="font-heading text-2xl sm:text-3xl lg:text-4xl font-extrabold text-gray-900 group-hover:text-[#186a42] transition-colors leading-tight">
                            {latestArticle.title}
                          </h2>

                          {latestArticle.short_description && (
                            <p className="text-gray-600 text-sm sm:text-base leading-relaxed line-clamp-3 font-normal max-w-4xl">
                              {latestArticle.short_description}
                            </p>
                          )}
                        </div>

                        <div className="pt-4 flex items-center justify-between border-t border-gray-100">
                          <span className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#186a42] group-hover:translate-x-1 transition-transform">
                            <span>Read Full Story</span>
                            <ArrowRight className="w-4 h-4" />
                          </span>
                        </div>
                      </div>
                    </div>
                  </Link>
                </section>
              )}

              {/* ─── ALL OTHER ARTICLES (3D EDITORIAL GRID) ─── */}
              {otherArticles.length > 0 && (
                <section className="space-y-6">
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-xs font-bold text-[#186a42] uppercase tracking-[0.25em] bg-[#186a42]/10 px-3 py-1 rounded-full">
                      News Archive
                    </span>
                    <h2 className="font-heading text-2xl font-extrabold text-gray-900 tracking-tight">
                      Recent Stories & Dispatches
                    </h2>
                    <div className="h-px bg-gray-200 flex-1 ml-2" />
                  </div>

                  <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
                    {otherArticles.map((item) => (
                      <Link
                        key={item.id}
                        to="/news/$slug"
                        params={{ slug: item.slug }}
                        className="group bg-white rounded-3xl border border-gray-100 shadow-md hover:shadow-2xl hover:border-[#186a42]/30 card-3d-interactive flex flex-col justify-between overflow-hidden relative"
                      >
                        <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-[#186a42] via-[#ffcc00] to-[#186a42] opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10" />

                        {item.media?.file_url && (
                          <div className="relative h-48 w-full overflow-hidden bg-gray-100">
                            <img
                              src={item.media.file_url}
                              alt={item.title}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                            />
                          </div>
                        )}

                        <div className="p-7 space-y-4 flex-1">
                          <div className="flex items-center justify-between gap-2">
                            <span className="text-[10px] font-black uppercase tracking-wider bg-[#186a42]/10 text-[#186a42] px-2.5 py-1 rounded-full truncate max-w-[60%]">
                              {item.category || "General"}
                            </span>
                            <span className="text-xs text-gray-400 font-medium flex items-center gap-1">
                              <Calendar className="w-3.5 h-3.5 text-gray-400" />
                              {item.published_at
                                ? new Date(item.published_at).toLocaleDateString("en-US", {
                                    month: "short",
                                    day: "numeric",
                                    year: "numeric",
                                  })
                                : "Recent"}
                            </span>
                          </div>

                          <h3 className="font-heading text-xl font-bold text-gray-900 group-hover:text-[#186a42] transition-colors leading-snug">
                            {item.title}
                          </h3>

                          {item.short_description && (
                            <p className="text-gray-600 text-xs sm:text-sm leading-relaxed line-clamp-3 font-normal">
                              {item.short_description}
                            </p>
                          )}
                        </div>

                        {/* Action Footer */}
                        <div className="p-7 pt-0">
                          <div className="w-full inline-flex items-center justify-between px-5 py-3 rounded-2xl bg-gray-50 group-hover:bg-[#186a42] text-gray-800 group-hover:text-white font-bold text-xs uppercase tracking-wider transition-all duration-300">
                            <span>Read Article</span>
                            <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                </section>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
