import { createFileRoute, Link } from "@tanstack/react-router";
import { Breadcrumbs } from "@/frontend/components/Breadcrumbs";
import {
  CalendarDays,
  Clock,
  MapPin,
  User,
  Search,
  Sparkles,
  Building2,
  CalendarCheck2,
  ShieldCheck,
  ChevronRight,
} from "lucide-react";
import { supabase } from "@/frontend/lib/supabase";
import type { Database } from "@/frontend/lib/database.types";
import { useState, useMemo } from "react";

export const Route = createFileRoute("/events/")({
  head: () => ({
    meta: [
      { title: "University Events & Calendar — Oda Bultum University" },
      {
        name: "description",
        content:
          "Discover academic conferences, graduation ceremonies, guest seminars, student workshops, and campus activities at Oda Bultum University.",
      },
    ],
  }),
  component: EventsIndex,
  loader: async () => {
    const { data: events, error } = await supabase
      .from("events")
      .select("*, media:event_image_id(id, file_url)")
      .eq("status", "published")
      .order("start_date", { ascending: false });

    if (error) {
      console.error("Failed to fetch events:", error);
      throw new Error("Failed to fetch events");
    }

    return {
      events: (events || []) as Array<
        Database["public"]["Tables"]["events"]["Row"] & {
          media?: { id: string; file_url: string } | null;
        }
      >,
    };
  },
});

function EventsIndex() {
  const { events } = Route.useLoaderData();
  const [search, setSearch] = useState("");

  // Filter events
  const filteredEvents = useMemo(() => {
    return events.filter((event) => {
      const q = search.toLowerCase();
      return (
        search === "" ||
        event.title?.toLowerCase().includes(q) ||
        event.description?.toLowerCase().includes(q) ||
        event.location?.toLowerCase().includes(q) ||
        event.organizer?.toLowerCase().includes(q)
      );
    });
  }, [events, search]);

  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* Page Hero */}
      <div className="obu-gradient py-20 md:py-28 px-4 sm:px-6 lg:px-8 relative overflow-hidden text-white">
        <div className="absolute inset-0 opacity-10 mix-blend-overlay pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white/15 to-transparent blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto relative z-10 animate-fade-in-up">
          <div className="inline-flex items-center gap-2 rounded-full bg-[#ffcc00] px-4 py-1.5 text-xs font-bold uppercase tracking-[0.2em] text-[#186a42] mb-5 shadow-lg">
            <CalendarDays className="w-3.5 h-3.5" />
            Academic Calendar & Campus Gatherings
          </div>
          <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-tight">
            Upcoming Events
          </h1>
          <p className="mt-4 text-lg md:text-xl text-white/90 max-w-3xl font-medium leading-relaxed">
            Stay connected with academic symposiums, research conferences, cultural festivals,
            public lectures, and student activities across all campuses.
          </p>
        </div>
      </div>

      {/* Breadcrumb Bar */}
      <div className="bg-gray-50 border-b border-gray-100 py-4 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <Breadcrumbs items={[{ label: "Events & Calendar" }]} />
        </div>
      </div>

      <main className="flex-grow">
        <div className="container mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-12 md:py-16 space-y-10">
          {/* Search Bar */}
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-gray-50/80 p-6 rounded-3xl border border-gray-100">
            <div className="relative w-full md:max-w-md">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search events by name, venue, organizer..."
                className="w-full pl-12 pr-4 py-3.5 rounded-2xl bg-white border border-gray-200 text-sm font-medium text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#186a42] focus:border-transparent shadow-sm transition-all"
              />
            </div>

            <div className="text-xs font-bold uppercase tracking-widest text-gray-500 self-start md:self-center">
              Showing <strong className="text-[#186a42]">{filteredEvents.length}</strong> Scheduled
              Events
            </div>
          </div>

          {/* Events List */}
          {filteredEvents.length === 0 ? (
            <div className="bg-white border border-gray-100 rounded-3xl p-16 text-center shadow-sm max-w-2xl mx-auto">
              <CalendarDays className="mx-auto h-20 w-20 text-gray-300 mb-4" />
              <h2 className="font-heading text-2xl font-bold text-gray-900 mb-2">
                No Events Scheduled
              </h2>
              <p className="text-gray-500 font-medium">
                {search
                  ? "No events match your search query. Try clearing your search."
                  : "Upcoming university events are currently being scheduled."}
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
            <div className="space-y-8">
              {filteredEvents.map((event) => {
                let day = "--";
                let month = "EVENT";
                let year = "";

                if (event.start_date) {
                  const parts = event.start_date.split("-");
                  if (parts.length === 3) {
                    year = parts[0] || "";
                    const d = new Date(event.start_date);
                    day = parts[2] || "--";
                    month = isNaN(d.getTime())
                      ? "EVENT"
                      : d.toLocaleString("en-US", { month: "short" }).toUpperCase();
                  }
                }

                const targetSlug = event.slug || event.id;

                return (
                  <Link
                    key={event.id}
                    to="/events/$slug"
                    params={{ slug: targetSlug }}
                    className="group block bg-white rounded-3xl border border-gray-100 shadow-md hover:shadow-2xl hover:border-[#186a42]/30 card-3d-interactive p-8 overflow-hidden relative"
                  >
                    <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-[#186a42] via-[#ffcc00] to-[#186a42] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                    <div className="flex flex-col md:flex-row gap-6 md:gap-8 items-start">
                      {/* 3D Date Block */}
                      <div className="flex md:flex-col items-center justify-center bg-[#186a42]/10 group-hover:bg-[#186a42] text-[#186a42] group-hover:text-white rounded-2xl p-5 min-w-[110px] text-center transition-colors duration-500 shadow-sm shrink-0">
                        <span className="text-xs font-black tracking-widest block">{month}</span>
                        <span className="font-heading text-4xl font-black leading-none my-1.5 block">
                          {day}
                        </span>
                        <span className="text-[11px] font-bold opacity-80 block">{year}</span>
                      </div>

                      {/* Event Details */}
                      <div className="flex-1 space-y-4">
                        <h2 className="font-heading text-2xl sm:text-3xl font-bold text-gray-900 group-hover:text-[#186a42] transition-colors leading-tight">
                          {event.title}
                        </h2>

                        {/* Optional Event Banner Image */}
                        {event.media?.file_url && (
                          <div className="my-4 rounded-2xl overflow-hidden max-h-80 border border-gray-100 shadow-sm bg-gray-50">
                            <img
                              src={event.media.file_url}
                              alt={event.title}
                              className="w-full h-full object-cover max-h-80"
                            />
                          </div>
                        )}

                        {/* Metadata Grid */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-gray-600 bg-gray-50/80 p-4 rounded-2xl border border-gray-100">
                          <div className="flex items-center gap-2">
                            <Clock className="w-4 h-4 text-[#186a42] shrink-0" />
                            <span>
                              {event.start_time
                                ? `${event.start_time}${event.end_time ? ` – ${event.end_time}` : ""}`
                                : "Schedule Announced Soon"}
                            </span>
                          </div>

                          <div className="flex items-center gap-2">
                            <MapPin className="w-4 h-4 text-[#186a42] shrink-0" />
                            <span className="truncate">
                              {event.location || "Oda Bultum University Main Campus"}
                            </span>
                          </div>

                          {event.end_date && event.end_date !== event.start_date && (
                            <div className="flex items-center gap-2">
                              <CalendarDays className="w-4 h-4 text-[#186a42] shrink-0" />
                              <span>Multi-day Event until {event.end_date}</span>
                            </div>
                          )}

                          {event.organizer && (
                            <div className="flex items-center gap-2">
                              <Building2 className="w-4 h-4 text-gray-400 shrink-0" />
                              <span className="truncate">Host: {event.organizer}</span>
                            </div>
                          )}
                        </div>

                        {event.description && (
                          <div className="prose prose-md max-w-none text-gray-700 font-normal leading-relaxed line-clamp-3 pt-1">
                            {event.description}
                          </div>
                        )}

                        <div className="pt-2 flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#186a42] group-hover:text-[#125333]">
                          <span>View Full Event Details</span>
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
