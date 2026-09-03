import { createFileRoute, Link } from "@tanstack/react-router";
import { Breadcrumbs } from "@/frontend/components/Breadcrumbs";
import {
  Bell,
  Calendar,
  Search,
  Sparkles,
  Pin,
  Clock,
  ShieldCheck,
  CheckCircle2,
  FileText,
  ChevronRight,
} from "lucide-react";
import { supabase } from "@/frontend/lib/supabase";
import type { Database } from "@/frontend/lib/database.types";
import { useState, useMemo } from "react";

export const Route = createFileRoute("/announcements/")({
  head: () => ({
    meta: [
      { title: "Announcements & Notices — Oda Bultum University" },
      {
        name: "description",
        content:
          "Official administrative notices, academic directives, student alerts, and general announcements from Oda Bultum University.",
      },
    ],
  }),
  component: AnnouncementsIndex,
  loader: async () => {
    const { data: announcements, error } = await supabase
      .from("announcements")
      .select("*, media:main_image_id(id, file_url)")
      .eq("status", "published")
      .order("published_at", { ascending: false });

    if (error) {
      console.error("Failed to fetch announcements:", error);
      throw new Error("Failed to fetch announcements");
    }

    return {
      announcements: (announcements || []) as Array<
        Database["public"]["Tables"]["announcements"]["Row"] & {
          media?: { id: string; file_url: string } | null;
        }
      >,
    };
  },
});

function AnnouncementsIndex() {
  const { announcements } = Route.useLoaderData();
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  // Get unique categories
  const categories = useMemo(() => {
    const cats = new Set(
      announcements
        .map((a) => a.category)
        .filter((c): c is string => typeof c === "string" && c.trim() !== ""),
    );
    return ["All", ...Array.from(cats)];
  }, [announcements]);

  // Filter announcements
  const filteredAnnouncements = useMemo(() => {
    return announcements.filter((ann) => {
      const matchesSearch =
        search === "" ||
        ann.title?.toLowerCase().includes(search.toLowerCase()) ||
        ann.description?.toLowerCase().includes(search.toLowerCase()) ||
        ann.content?.toLowerCase().includes(search.toLowerCase());

      const matchesCat = selectedCategory === "All" || ann.category === selectedCategory;

      return matchesSearch && matchesCat;
    });
  }, [announcements, search, selectedCategory]);

  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* Page Hero */}
      <div className="obu-gradient py-20 md:py-28 px-4 sm:px-6 lg:px-8 relative overflow-hidden text-white">
        <div className="absolute inset-0 opacity-10 mix-blend-overlay pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white/15 to-transparent blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto relative z-10 animate-fade-in-up">
          <div className="inline-flex items-center gap-2 rounded-full bg-[#ffcc00] px-4 py-1.5 text-xs font-bold uppercase tracking-[0.2em] text-[#186a42] mb-5 shadow-lg">
            <Bell className="w-3.5 h-3.5" />
            Official University Notices
          </div>
          <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-tight">
            Announcements & Alerts
          </h1>
          <p className="mt-4 text-lg md:text-xl text-white/90 max-w-3xl font-medium leading-relaxed">
            Essential directives, administrative circulars, scholarship updates, and urgent alerts
            published by Oda Bultum University.
          </p>
        </div>
      </div>

      {/* Breadcrumb Bar */}
      <div className="bg-gray-50 border-b border-gray-100 py-4 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <Breadcrumbs items={[{ label: "Announcements & Notices" }]} />
        </div>
      </div>

      <main className="flex-grow">
        <div className="container mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-12 md:py-16 space-y-10">
          {/* Controls Bar: Search & Category Pills */}
          <div className="space-y-6 bg-gray-50/80 p-6 md:p-8 rounded-3xl border border-gray-100">
            <div className="relative w-full">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search announcements by keyword, topic, or circular..."
                className="w-full pl-12 pr-4 py-3.5 rounded-2xl bg-white border border-gray-200 text-sm font-medium text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#186a42] focus:border-transparent shadow-sm transition-all"
              />
            </div>

            {/* Category Filter Pills */}
            <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-gray-200/60">
              <span className="text-xs font-bold uppercase tracking-wider text-gray-400 mr-2 flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-[#ffcc00]" /> Filter:
              </span>
              {categories.map((cat) => {
                const isSelected = selectedCategory === cat;
                return (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${
                      isSelected
                        ? "bg-[#186a42] text-white shadow-md shadow-[#186a42]/20"
                        : "bg-white text-gray-600 border border-gray-200 hover:border-[#186a42] hover:text-[#186a42]"
                    }`}
                  >
                    {cat}
                  </button>
                );
              })}

              <span className="text-xs font-bold uppercase tracking-widest text-gray-500 ml-2">
                Showing <strong className="text-[#186a42]">{filteredAnnouncements.length}</strong>{" "}
                Notices
              </span>
            </div>
          </div>

          {/* Announcements Timeline List */}
          {filteredAnnouncements.length === 0 ? (
            <div className="bg-white border border-gray-100 rounded-3xl p-16 text-center shadow-sm max-w-2xl mx-auto">
              <Bell className="mx-auto h-20 w-20 text-gray-300 mb-4" />
              <h2 className="font-heading text-2xl font-bold text-gray-900 mb-2">
                No Announcements Found
              </h2>
              <p className="text-gray-500 font-medium">
                {search || selectedCategory !== "All"
                  ? "No notices match your current filters. Try resetting search."
                  : "No official announcements are active at this moment."}
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
            <div className="space-y-6">
              {filteredAnnouncements.map((ann) => {
                const dateObj = ann.published_at ? new Date(ann.published_at) : null;
                const day = dateObj ? String(dateObj.getDate()).padStart(2, "0") : "--";
                const month = dateObj
                  ? dateObj.toLocaleString("en-US", { month: "short" }).toUpperCase()
                  : "NOTICE";
                const year = dateObj ? dateObj.getFullYear() : "";
                const targetSlug = ann.slug || ann.id;

                return (
                  <Link
                    key={ann.id}
                    to="/announcements/$slug"
                    params={{ slug: targetSlug }}
                    className="group block bg-white rounded-3xl border border-gray-100 shadow-md hover:shadow-2xl hover:border-[#186a42]/30 card-3d-interactive p-8 overflow-hidden relative"
                  >
                    <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-[#186a42] via-[#ffcc00] to-[#186a42] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                    <div className="flex flex-col md:flex-row gap-6 md:gap-8 items-start">
                      {/* Date Block */}
                      <div className="flex md:flex-col items-center justify-center bg-[#186a42]/10 group-hover:bg-[#186a42] text-[#186a42] group-hover:text-white rounded-2xl p-4 min-w-[90px] text-center transition-colors duration-500 shadow-sm shrink-0">
                        <span className="text-[11px] font-black tracking-widest block">
                          {month}
                        </span>
                        <span className="font-heading text-3xl font-extrabold leading-none my-1 block px-2">
                          {day}
                        </span>
                        <span className="text-[10px] font-bold opacity-75 block">{year}</span>
                      </div>

                      {/* Content Area */}
                      <div className="flex-1 space-y-3">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="px-3 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-[#ffcc00]/20 text-[#186a42] border border-[#ffcc00]/30">
                            {ann.category || "Official Notice"}
                          </span>
                          {ann.expires_at && (
                            <span className="text-xs text-amber-700 bg-amber-50 px-2.5 py-0.5 rounded-full font-medium border border-amber-200">
                              Valid until {new Date(ann.expires_at).toLocaleDateString()}
                            </span>
                          )}
                        </div>

                        <h2 className="font-heading text-2xl font-bold text-gray-900 group-hover:text-[#186a42] transition-colors leading-tight">
                          {ann.title}
                        </h2>

                        {/* Optional Announcement Image */}
                        {ann.media?.file_url && (
                          <div className="my-4 rounded-2xl overflow-hidden max-h-80 border border-gray-100 shadow-sm bg-gray-50">
                            <img
                              src={ann.media.file_url}
                              alt={ann.title}
                              className="w-full h-full object-cover max-h-80"
                            />
                          </div>
                        )}

                        <div className="prose prose-md max-w-none text-gray-700 font-normal leading-relaxed line-clamp-3 pt-1">
                          {ann.description || ann.content}
                        </div>

                        <div className="pt-2 flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#186a42] group-hover:text-[#125333]">
                          <span>Read Full Announcement</span>
                          <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                        </div>
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
