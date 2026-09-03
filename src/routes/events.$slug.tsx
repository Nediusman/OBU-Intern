import { createFileRoute, notFound, Link } from "@tanstack/react-router";
import { Breadcrumbs } from "@/frontend/components/Breadcrumbs";
import {
  CalendarDays,
  Clock,
  MapPin,
  Building2,
  ArrowLeft,
  Share2,
  ExternalLink,
  ShieldCheck,
  Mail,
  CalendarCheck2,
} from "lucide-react";
import { supabase } from "@/frontend/lib/supabase";
import type { Database } from "@/frontend/lib/database.types";

export const Route = createFileRoute("/events/$slug")({
  head: () => ({
    meta: [
      { title: "University Event Details — Oda Bultum University" },
      {
        name: "description",
        content: "Academic and campus event details at Oda Bultum University.",
      },
    ],
  }),
  component: EventDetail,
  loader: async ({ params }) => {
    const { data: event, error } = await supabase
      .from("events")
      .select("*, media:event_image_id(id, file_url)")
      .eq("slug", params.slug)
      .eq("status", "published")
      .single();

    if (error || !event) {
      if (error && error.code !== "PGRST116") {
        console.error("Failed to fetch event:", error);
      }
      throw notFound();
    }

    return {
      event: event as Database["public"]["Tables"]["events"]["Row"] & {
        media?: { id: string; file_url: string } | null;
      },
      slug: params.slug,
    };
  },
});

function EventDetail() {
  const { event } = Route.useLoaderData();

  let day = "--";
  let month = "EVENT";
  let year = "";
  let fullDateStr = event.start_date;

  if (event.start_date) {
    const parts = event.start_date.split("-");
    if (parts.length === 3) {
      year = parts[0] || "";
      const d = new Date(event.start_date);
      day = parts[2] || "--";
      month = isNaN(d.getTime())
        ? "EVENT"
        : d.toLocaleString("en-US", { month: "short" }).toUpperCase();
      fullDateStr = isNaN(d.getTime())
        ? event.start_date
        : d.toLocaleDateString("en-US", {
            month: "long",
            day: "numeric",
            year: "numeric",
          });
    }
  }

  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* Cover Hero */}
      <div className="relative obu-gradient py-20 md:py-28 px-4 sm:px-6 lg:px-8 text-white overflow-hidden">
        <div className="absolute inset-0 opacity-10 mix-blend-overlay pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white/15 to-transparent blur-3xl pointer-events-none" />

        <div className="max-w-4xl mx-auto relative z-10 animate-fade-in-up space-y-4">
          <Link
            to="/events"
            className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#ffcc00] hover:underline mb-2"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Upcoming Events
          </Link>

          <div className="flex flex-wrap items-center gap-3">
            <span className="px-3 py-1 bg-[#ffcc00] text-[#186a42] text-xs font-black uppercase tracking-wider rounded-full shadow-sm flex items-center gap-1.5">
              <CalendarDays className="w-3.5 h-3.5" />
              Official Campus Event
            </span>

            <div className="flex items-center gap-1.5 text-xs text-white/85 font-semibold">
              <Clock className="w-3.5 h-3.5 text-[#ffcc00]" />
              <span>
                {event.start_time
                  ? `${event.start_time}${event.end_time ? ` – ${event.end_time}` : ""}`
                  : "Time to be announced"}
              </span>
            </div>

            {event.location && (
              <div className="flex items-center gap-1.5 text-xs text-white/85 font-semibold">
                <MapPin className="w-3.5 h-3.5 text-[#ffcc00]" />
                <span className="truncate">{event.location}</span>
              </div>
            )}
          </div>

          <h1 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-tight">
            {event.title}
          </h1>
        </div>
      </div>

      {/* Breadcrumb Bar */}
      <div className="bg-gray-50 border-b border-gray-100 py-4 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <Breadcrumbs
            items={[{ label: "Events & Calendar", to: "/events" }, { label: event.title }]}
          />
        </div>
      </div>

      <main className="flex-grow">
        <article className="container mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-12 md:py-16 space-y-10">
          {/* Event Poster / Banner Image */}
          {event.media?.file_url && (
            <div className="rounded-3xl overflow-hidden shadow-2xl border border-gray-100 max-h-[600px] w-full bg-gray-100">
              <img
                src={event.media.file_url}
                alt={event.title}
                className="w-full h-full object-cover max-h-[600px]"
              />
            </div>
          )}

          {/* Event Key Info Grid */}
          <div className="bg-gray-50/90 rounded-3xl p-6 sm:p-8 border border-gray-100 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 text-xs text-gray-600">
            <div className="flex items-start gap-3">
              <div className="p-3 bg-[#186a42]/10 text-[#186a42] rounded-2xl shrink-0">
                <CalendarDays className="w-5 h-5" />
              </div>
              <div>
                <span className="font-bold text-gray-400 uppercase tracking-wider block">Date</span>
                <span className="font-semibold text-gray-900 text-sm block mt-0.5">
                  {fullDateStr}
                </span>
                {event.end_date && event.end_date !== event.start_date && (
                  <span className="text-[11px] text-gray-500 block">Through {event.end_date}</span>
                )}
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="p-3 bg-[#186a42]/10 text-[#186a42] rounded-2xl shrink-0">
                <Clock className="w-5 h-5" />
              </div>
              <div>
                <span className="font-bold text-gray-400 uppercase tracking-wider block">
                  Schedule Time
                </span>
                <span className="font-semibold text-gray-900 text-sm block mt-0.5">
                  {event.start_time
                    ? `${event.start_time}${event.end_time ? ` – ${event.end_time}` : ""}`
                    : "Schedule Announced Soon"}
                </span>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="p-3 bg-[#186a42]/10 text-[#186a42] rounded-2xl shrink-0">
                <MapPin className="w-5 h-5" />
              </div>
              <div>
                <span className="font-bold text-gray-400 uppercase tracking-wider block">
                  Venue / Location
                </span>
                <span className="font-semibold text-gray-900 text-sm block mt-0.5">
                  {event.location || "Oda Bultum University Main Campus"}
                </span>
              </div>
            </div>

            {event.organizer && (
              <div className="flex items-start gap-3">
                <div className="p-3 bg-[#186a42]/10 text-[#186a42] rounded-2xl shrink-0">
                  <Building2 className="w-5 h-5" />
                </div>
                <div>
                  <span className="font-bold text-gray-400 uppercase tracking-wider block">
                    Host Organizer
                  </span>
                  <span className="font-semibold text-gray-900 text-sm block mt-0.5">
                    {event.organizer}
                  </span>
                </div>
              </div>
            )}

            {event.contact_information && (
              <div className="flex items-start gap-3">
                <div className="p-3 bg-[#186a42]/10 text-[#186a42] rounded-2xl shrink-0">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <span className="font-bold text-gray-400 uppercase tracking-wider block">
                    Contact Details
                  </span>
                  <span className="font-semibold text-gray-900 text-sm block mt-0.5">
                    {event.contact_information}
                  </span>
                </div>
              </div>
            )}

            <div className="flex items-start gap-3">
              <div className="p-3 bg-[#186a42]/10 text-[#186a42] rounded-2xl shrink-0">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <span className="font-bold text-gray-400 uppercase tracking-wider block">
                  Event Status
                </span>
                <span className="font-semibold text-[#186a42] text-sm block mt-0.5 capitalize">
                  {event.status || "Scheduled"}
                </span>
              </div>
            </div>
          </div>

          {/* Registration / External Link if available */}
          {event.registration_link && (
            <div className="p-6 bg-amber-50 rounded-3xl border border-amber-200 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="space-y-1">
                <h3 className="font-bold text-amber-900 text-base">Registration / RSVP Required</h3>
                <p className="text-xs text-amber-800">
                  Please register in advance to reserve your seat at this event.
                </p>
              </div>
              <a
                href={event.registration_link}
                target="_blank"
                rel="noreferrer noopener"
                className="inline-flex items-center gap-2 px-6 py-3 bg-[#186a42] hover:bg-[#125333] text-white rounded-2xl font-bold text-xs uppercase tracking-wider shadow-md transition-all shrink-0"
              >
                <span>Register Online</span>
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>
          )}

          {/* Full Description */}
          {event.description ? (
            <div className="space-y-4">
              <h2 className="font-heading text-2xl font-bold text-gray-900">About This Event</h2>
              <div className="prose prose-lg prose-[#186a42] max-w-none text-gray-800 font-normal leading-relaxed whitespace-pre-wrap">
                {event.description}
              </div>
            </div>
          ) : (
            <p className="text-gray-600 font-medium italic">
              Detailed itinerary for this event will be published soon.
            </p>
          )}

          {/* Footer Navigation */}
          <div className="pt-10 border-t border-gray-200/80 flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-3 text-xs text-gray-500 font-medium">
              <CalendarCheck2 className="w-4 h-4 text-[#186a42]" />
              <span>Official Oda Bultum University Academic & Campus Calendar</span>
            </div>

            <Link
              to="/events"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-[#186a42] hover:bg-[#125333] text-white font-bold text-xs uppercase tracking-wider shadow-md hover:shadow-lg transition-all"
            >
              <ArrowLeft className="w-4 h-4" /> View All Events
            </Link>
          </div>
        </article>
      </main>
    </div>
  );
}
