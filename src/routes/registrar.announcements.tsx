import { createFileRoute, Link } from "@tanstack/react-router";
import { Breadcrumbs } from "@/frontend/components/Breadcrumbs";
import { EmptyState } from "@/frontend/components/EmptyState";
import {
  CalendarDays,
  Bell,
  Clock,
  AlertCircle,
  Search,
  ChevronRight,
  Sparkles,
  CalendarCheck,
  FileText,
  Pin,
  ArrowRight,
} from "lucide-react";
import { supabase } from "@/frontend/lib/supabase";
import { useState, useMemo } from "react";

export const Route = createFileRoute("/registrar/announcements")({
  head: () => ({
    meta: [
      { title: "Registrar Announcements — Oda Bultum University" },
      {
        name: "description",
        content:
          "Official registration notices, semester deadlines, graduation clearances, and academic announcements from Oda Bultum University Registrar.",
      },
    ],
  }),
  component: RegistrarAnnouncements,
  loader: async () => {
    const now = new Date().toISOString();
    const { data, error } = await supabase
      .from("registrar_announcements")
      .select("id, title, short_description, content, published_at, expires_at, created_at")
      .eq("status", "published")
      .or(`published_at.is.null,published_at.lte.${now}`)
      .or(`expires_at.is.null,expires_at.gte.${now}`)
      .order("published_at", { ascending: false });
    if (error) throw error;
    return { announcements: data ?? [] };
  },
});

function RegistrarAnnouncements() {
  const { announcements } = Route.useLoaderData();
  const [search, setSearch] = useState("");

  const filteredAnnouncements = useMemo(() => {
    if (!search.trim()) return announcements;
    const q = search.toLowerCase();
    return announcements.filter(
      (a) =>
        a.title?.toLowerCase().includes(q) ||
        a.short_description?.toLowerCase().includes(q) ||
        a.content?.toLowerCase().includes(q),
    );
  }, [announcements, search]);

  const featured = filteredAnnouncements.length > 0 ? filteredAnnouncements[0] : null;
  const listItems = filteredAnnouncements.length > 1 ? filteredAnnouncements.slice(1) : [];

  const formatDateObj = (dateStr?: string | null) => {
    if (!dateStr) return { day: "--", month: "---", year: "----", full: "Recent" };
    const date = new Date(dateStr);
    return {
      day: date.getDate().toString().padStart(2, "0"),
      month: date.toLocaleDateString("en-US", { month: "short" }).toUpperCase(),
      year: date.getFullYear().toString(),
      full: date.toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
      }),
    };
  };

  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* Page Hero */}
      <div className="obu-gradient py-20 md:py-28 px-4 sm:px-6 lg:px-8 relative overflow-hidden text-white">
        <div className="absolute inset-0 opacity-10 mix-blend-overlay pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white/15 to-transparent blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto relative z-10 animate-fade-in-up">
          <div className="inline-flex items-center gap-2 rounded-full bg-[#ffcc00] px-4 py-1.5 text-xs font-bold uppercase tracking-[0.2em] text-[#186a42] mb-5 shadow-lg">
            <Bell className="w-3.5 h-3.5" />
            Official Registrar Bulletins
          </div>
          <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-tight">
            Registrar Announcements
          </h1>
          <p className="mt-4 text-lg md:text-xl text-white/90 max-w-3xl font-medium leading-relaxed">
            Stay updated with official academic schedules, semester registration deadlines, add/drop
            periods, exam timetables, and graduation clearance notices.
          </p>
        </div>
      </div>

      {/* Breadcrumb Bar */}
      <div className="bg-gray-50 border-b border-gray-100 py-4 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <Breadcrumbs
            items={[
              { label: "Office of the Registrar", to: "/registrar" },
              { label: "Announcements" },
            ]}
          />
        </div>
      </div>

      <main className="flex-grow">
        <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 md:py-16 space-y-12">
          {/* Search & Notice Control Bar */}
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-between bg-gray-50/80 p-6 rounded-3xl border border-gray-100">
            <div className="relative w-full sm:max-w-md">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search announcements by keyword..."
                className="w-full pl-12 pr-4 py-3 rounded-2xl bg-white border border-gray-200 text-sm font-medium text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#186a42] focus:border-transparent shadow-sm transition-all"
              />
            </div>

            <div className="text-xs font-bold uppercase tracking-widest text-gray-500 self-end sm:self-center">
              Active Bulletins:{" "}
              <span className="text-[#186a42] font-black">{filteredAnnouncements.length}</span>
            </div>
          </div>

          {filteredAnnouncements.length === 0 ? (
            <div className="bg-white border border-gray-100 rounded-3xl p-16 text-center shadow-sm max-w-2xl mx-auto">
              <CalendarDays className="mx-auto h-20 w-20 text-gray-300 mb-4" />
              <h2 className="font-heading text-2xl font-bold text-gray-900 mb-2">
                No Active Announcements
              </h2>
              <p className="text-gray-500 font-medium">
                {search
                  ? "No announcements matched your search. Try a different keyword."
                  : "There are currently no active registrar announcements. Please check back regularly for semester updates."}
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
            <div className="space-y-12">
              {/* ─── FEATURED / LATEST ANNOUNCEMENT (FLAGSHIP 3D CARD) ─── */}
              {featured && (
                <section className="space-y-4">
                  <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#186a42]">
                    <Pin className="w-4 h-4 text-[#ffcc00] fill-[#ffcc00]" />
                    Latest Official Bulletin
                  </div>

                  {(() => {
                    const dateObj = formatDateObj(featured.published_at || featured.created_at);

                    return (
                      <div className="group bg-white rounded-3xl border border-gray-100 p-8 sm:p-12 shadow-xl hover:shadow-2xl hover:border-[#186a42]/30 card-3d-interactive relative overflow-hidden">
                        <div className="h-2 w-full absolute top-0 left-0 obu-gradient" />

                        <div className="flex flex-col lg:flex-row gap-8 items-start">
                          {/* Left Date Block */}
                          <div className="flex lg:flex-col items-center justify-center bg-[#186a42]/10 border border-[#186a42]/20 rounded-2xl p-4 lg:w-28 shrink-0 text-center shadow-inner">
                            <span className="text-3xl lg:text-4xl font-extrabold text-[#186a42] font-mono leading-none">
                              {dateObj.day}
                            </span>
                            <span className="text-xs font-black tracking-widest text-[#186a42] uppercase mt-1">
                              {dateObj.month}
                            </span>
                            <span className="text-[10px] font-bold text-gray-400 mt-0.5 hidden lg:block">
                              {dateObj.year}
                            </span>
                          </div>

                          {/* Main Content */}
                          <div className="flex-1 space-y-4">
                            <div className="flex flex-wrap items-center gap-3">
                              <span className="inline-block px-3 py-1 bg-[#ffcc00] text-[#186a42] text-xs font-bold uppercase tracking-wider rounded-full shadow-sm">
                                Priority Notice
                              </span>
                              <span className="text-xs text-gray-400 font-semibold flex items-center gap-1.5">
                                <Clock className="w-3.5 h-3.5" />
                                Published on {dateObj.full}
                              </span>
                              {featured.expires_at && (
                                <span className="text-xs text-amber-700 bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-200/60 font-semibold flex items-center gap-1">
                                  <AlertCircle className="w-3 h-3" />
                                  Valid until {formatDateObj(featured.expires_at).full}
                                </span>
                              )}
                            </div>

                            <h2 className="font-heading text-2xl sm:text-3xl lg:text-4xl font-extrabold text-gray-900 group-hover:text-[#186a42] transition-colors leading-tight">
                              {featured.title}
                            </h2>

                            <div className="prose prose-base sm:prose-lg max-w-none text-gray-700 font-normal leading-relaxed whitespace-pre-wrap pt-2">
                              {featured.content || featured.short_description}
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })()}
                </section>
              )}

              {/* ─── RECENT ANNOUNCEMENTS LIST / 3D CARDS FEED ─── */}
              {listItems.length > 0 && (
                <section className="space-y-6">
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-xs font-bold text-[#186a42] uppercase tracking-[0.25em] bg-[#186a42]/10 px-3 py-1 rounded-full">
                      Timeline
                    </span>
                    <h2 className="font-heading text-2xl font-extrabold text-gray-900 tracking-tight">
                      Previous Registrar Notices
                    </h2>
                    <div className="h-px bg-gray-200 flex-1 ml-2" />
                  </div>

                  <div className="grid gap-6 sm:grid-cols-2">
                    {listItems.map((ann, idx) => {
                      const dateObj = formatDateObj(ann.published_at || ann.created_at);

                      return (
                        <div
                          key={ann.id}
                          className="group bg-white rounded-3xl p-7 border border-gray-100 shadow-md hover:shadow-xl hover:border-[#186a42]/30 card-3d-interactive flex flex-col justify-between relative overflow-hidden"
                        >
                          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#186a42] to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

                          <div className="space-y-4">
                            <div className="flex items-start justify-between gap-4">
                              <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 px-3 py-1.5 rounded-xl">
                                <CalendarDays className="w-4 h-4 text-[#186a42]" />
                                <span className="text-xs font-bold text-gray-800">
                                  {dateObj.month} {dateObj.day}, {dateObj.year}
                                </span>
                              </div>

                              {ann.expires_at && (
                                <span className="text-[11px] font-semibold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200/60">
                                  Expires: {formatDateObj(ann.expires_at).month}{" "}
                                  {formatDateObj(ann.expires_at).day}
                                </span>
                              )}
                            </div>

                            <h3 className="font-heading text-xl font-bold text-gray-900 group-hover:text-[#186a42] transition-colors leading-snug">
                              {ann.title}
                            </h3>

                            <p className="text-gray-600 text-sm leading-relaxed line-clamp-4 font-normal whitespace-pre-wrap">
                              {ann.content || ann.short_description}
                            </p>
                          </div>

                          <div className="pt-5 mt-4 border-t border-gray-100 flex items-center justify-between text-xs font-bold uppercase tracking-wider text-[#186a42]">
                            <span className="flex items-center gap-1.5 text-gray-500 group-hover:text-[#186a42] transition-colors">
                              Official Record
                            </span>
                            <span className="group-hover:translate-x-1 transition-transform">
                              &rarr;
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </section>
              )}
            </div>
          )}

          {/* Academic Calendar Resource Callout */}
          <section className="bg-gray-50 rounded-3xl p-8 sm:p-12 border border-gray-200/70 relative overflow-hidden shadow-sm">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-8 space-y-3">
                <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#186a42]">
                  <CalendarCheck className="w-4 h-4 text-[#ffcc00]" />
                  Annual Academic Timetable
                </div>
                <h3 className="font-heading text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
                  University Academic Calendar & Semester Schedules
                </h3>
                <p className="text-gray-600 text-sm sm:text-base leading-relaxed max-w-2xl font-normal">
                  Download official academic calendars including class start dates, mid-term breaks,
                  final examination windows, and senate meetings.
                </p>
              </div>

              <div className="lg:col-span-4 flex flex-col gap-3 justify-end">
                <Link
                  to="/registrar/documents"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl bg-[#186a42] hover:bg-[#125333] text-white font-bold text-xs uppercase tracking-wider shadow-md hover:shadow-lg transition-all"
                >
                  Download Academic Documents <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  to="/registrar"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl bg-white hover:bg-gray-100 text-gray-800 font-bold text-xs uppercase tracking-wider border border-gray-200 transition-colors"
                >
                  Registrar Office Info
                </Link>
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
