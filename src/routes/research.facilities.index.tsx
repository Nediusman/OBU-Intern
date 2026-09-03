import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Building2,
  ArrowRight,
  MapPin,
  Beaker,
  Search,
  Sparkles,
  ChevronRight,
  ShieldCheck,
  CheckCircle2,
} from "lucide-react";
import { Breadcrumbs } from "@/frontend/components/Breadcrumbs";
import { getResearchFacilities } from "@/backend/api";
import { useState, useMemo } from "react";

export const Route = createFileRoute("/research/facilities/")({
  head: () => ({
    meta: [
      { title: "Research Facilities & Labs — Oda Bultum University" },
      {
        name: "description",
        content:
          "Tour state-of-the-art laboratories, agricultural test centers, computing infrastructure, and experimental facilities at Oda Bultum University.",
      },
    ],
  }),
  loader: async () => {
    const facilities = await getResearchFacilities();
    return { facilities };
  },
  component: Facilities,
});

function Facilities() {
  const { facilities } = Route.useLoaderData();
  const [search, setSearch] = useState("");

  const filteredFacilities = useMemo(() => {
    return facilities.filter((f) => {
      const q = search.toLowerCase();
      return (
        search === "" ||
        f.name?.toLowerCase().includes(q) ||
        f.description?.toLowerCase().includes(q) ||
        f.location?.toLowerCase().includes(q) ||
        f.services?.toLowerCase().includes(q)
      );
    });
  }, [facilities, search]);

  const featured = filteredFacilities.length > 0 ? filteredFacilities[0] : null;
  const otherFacilities = filteredFacilities.length > 1 ? filteredFacilities.slice(1) : [];

  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* Page Hero */}
      <div className="obu-gradient py-20 md:py-28 px-4 sm:px-6 lg:px-8 relative overflow-hidden text-white">
        <div className="absolute inset-0 opacity-10 mix-blend-overlay pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white/15 to-transparent blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto relative z-10 animate-fade-in-up">
          <div className="inline-flex items-center gap-2 rounded-full bg-[#ffcc00] px-4 py-1.5 text-xs font-bold uppercase tracking-[0.2em] text-[#186a42] mb-5 shadow-lg">
            <Building2 className="w-3.5 h-3.5" />
            Laboratories & Scientific Infrastructure
          </div>
          <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-tight">
            Research Facilities
          </h1>
          <p className="mt-4 text-lg md:text-xl text-white/90 max-w-3xl font-medium leading-relaxed">
            State-of-the-art diagnostic laboratories, biotechnology facilities, agricultural
            experimental farms, and high-performance computing centers powering research at OBU.
          </p>
        </div>
      </div>

      {/* Breadcrumb Bar */}
      <div className="bg-gray-50 border-b border-gray-100 py-4 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <Breadcrumbs
            items={[{ label: "Research", to: "/research" }, { label: "Research Facilities" }]}
          />
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
                placeholder="Search facility name, equipment, location..."
                className="w-full pl-12 pr-4 py-3.5 rounded-2xl bg-white border border-gray-200 text-sm font-medium text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#186a42] focus:border-transparent shadow-sm transition-all"
              />
            </div>

            <div className="text-xs font-bold uppercase tracking-widest text-gray-500 self-start md:self-center">
              Showing <strong className="text-[#186a42]">{filteredFacilities.length}</strong>{" "}
              Research Facilities
            </div>
          </div>

          {filteredFacilities.length === 0 ? (
            <div className="bg-white border border-gray-100 rounded-3xl p-16 text-center shadow-sm max-w-2xl mx-auto">
              <Building2 className="mx-auto h-20 w-20 text-gray-300 mb-4" />
              <h2 className="font-heading text-2xl font-bold text-gray-900 mb-2">
                No Facilities Found
              </h2>
              <p className="text-gray-500 font-medium">
                {search
                  ? "No research facilities match your search query. Try clearing your search."
                  : "No public research facilities are currently published."}
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
              {/* ─── FEATURED FLAGSHIP FACILITY (IF AVAILABLE) ─── */}
              {featured && (
                <section className="space-y-4">
                  <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#186a42]">
                    <Sparkles className="w-4 h-4 text-[#ffcc00]" />
                    Featured Infrastructure Hub
                  </div>

                  <div className="group bg-white rounded-3xl border border-gray-100 shadow-xl hover:shadow-2xl hover:border-[#186a42]/30 card-3d-interactive overflow-hidden relative">
                    <div className="h-2 w-full absolute top-0 left-0 obu-gradient" />

                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 p-8 sm:p-12 items-center">
                      {/* Image */}
                      {featured.image ? (
                        <div className="lg:col-span-5 aspect-[16/10] w-full rounded-2xl overflow-hidden bg-gray-100 relative shadow-md">
                          <img
                            src={featured.image}
                            alt={featured.name}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                          />
                        </div>
                      ) : (
                        <div className="lg:col-span-5 aspect-[16/10] w-full rounded-2xl bg-[#186a42]/5 border border-[#186a42]/10 flex items-center justify-center text-[#186a42]">
                          <Building2 className="w-20 h-20 opacity-30" />
                        </div>
                      )}

                      {/* Content */}
                      <div className="lg:col-span-7 space-y-4">
                        <div className="flex flex-wrap items-center gap-3">
                          <span className="px-3 py-1 bg-[#186a42]/10 text-[#186a42] text-xs font-bold uppercase tracking-wider rounded-full">
                            Research Laboratory
                          </span>
                          <span className="px-3 py-1 text-xs font-bold uppercase tracking-wider rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                            Operational
                          </span>
                        </div>

                        <h2 className="font-heading text-2xl sm:text-3xl lg:text-4xl font-extrabold text-gray-900 group-hover:text-[#186a42] transition-colors leading-tight">
                          {featured.name}
                        </h2>

                        {featured.description && (
                          <p className="text-gray-600 text-sm sm:text-base leading-relaxed line-clamp-3 font-normal">
                            {featured.description}
                          </p>
                        )}

                        {/* Location Strip */}
                        {featured.location && (
                          <div className="flex items-center gap-2 pt-3 border-t border-gray-100 text-xs text-gray-600">
                            <MapPin className="w-4 h-4 text-[#186a42] shrink-0" />
                            <span>
                              Campus Location: <strong>{featured.location}</strong>
                            </span>
                          </div>
                        )}

                        {/* CTA */}
                        <div className="pt-4">
                          <Link
                            to="/research/facilities/$slug"
                            params={{ slug: featured.slug || featured.id }}
                            className="inline-flex items-center gap-3 px-6 py-3.5 rounded-2xl bg-[#186a42] hover:bg-[#125333] text-white font-bold text-xs uppercase tracking-wider shadow-lg shadow-[#186a42]/20 hover:shadow-xl transition-all duration-300 group/btn"
                          >
                            <span>Tour Laboratory & Equipment</span>
                            <ArrowRight className="w-4 h-4 transition-transform group-hover/btn:translate-x-1" />
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                </section>
              )}

              {/* ─── RESEARCH FACILITIES GRID (3D CARDS) ─── */}
              {otherFacilities.length > 0 && (
                <section className="space-y-6">
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-xs font-bold text-[#186a42] uppercase tracking-[0.25em] bg-[#186a42]/10 px-3 py-1 rounded-full">
                      Directory
                    </span>
                    <h2 className="font-heading text-2xl font-extrabold text-gray-900 tracking-tight">
                      All Research Laboratories & Field Stations
                    </h2>
                    <div className="h-px bg-gray-200 flex-1 ml-2" />
                  </div>

                  <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
                    {otherFacilities.map((facility) => (
                      <div
                        key={facility.id}
                        className="group bg-white rounded-3xl border border-gray-100 shadow-md hover:shadow-2xl hover:border-[#186a42]/30 card-3d-interactive flex flex-col justify-between overflow-hidden relative"
                      >
                        <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-[#186a42] via-[#ffcc00] to-[#186a42] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                        <div>
                          {/* Image */}
                          {facility.image ? (
                            <div className="aspect-[16/10] w-full bg-gray-100 relative overflow-hidden">
                              <img
                                src={facility.image}
                                alt={facility.name}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                              />
                            </div>
                          ) : (
                            <div className="aspect-[16/10] w-full bg-gray-50 flex items-center justify-center text-gray-300">
                              <Building2 className="w-14 h-14" />
                            </div>
                          )}

                          {/* Content */}
                          <div className="p-7 space-y-3">
                            <div className="flex items-center justify-between gap-2">
                              <span className="text-[10px] font-bold uppercase tracking-wider bg-[#186a42]/10 text-[#186a42] px-2.5 py-0.5 rounded-full">
                                Facility
                              </span>
                              <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                                Active
                              </span>
                            </div>

                            <h3 className="font-heading text-xl font-bold text-gray-900 group-hover:text-[#186a42] transition-colors leading-snug">
                              {facility.name}
                            </h3>

                            {facility.description && (
                              <p className="text-gray-600 text-xs sm:text-sm leading-relaxed line-clamp-3 font-normal">
                                {facility.description}
                              </p>
                            )}

                            {facility.location && (
                              <div className="pt-3 border-t border-gray-100 text-xs text-gray-500 flex items-center gap-1.5">
                                <MapPin className="w-3.5 h-3.5 text-[#186a42] shrink-0" />
                                <span className="truncate">{facility.location}</span>
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Action Footer */}
                        <div className="p-7 pt-0">
                          <Link
                            to="/research/facilities/$slug"
                            params={{ slug: facility.slug || facility.id }}
                            className="w-full inline-flex items-center justify-between px-5 py-3 rounded-2xl bg-gray-50 hover:bg-[#186a42] text-gray-800 hover:text-white font-bold text-xs uppercase tracking-wider transition-all duration-300 group/btn"
                          >
                            <span>Facility Details</span>
                            <ChevronRight className="w-4 h-4 transition-transform group-hover/btn:translate-x-1" />
                          </Link>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              )}
            </div>
          )}

          {/* ─── LABORATORY SAFETY & BOOKING CHARTER ─── */}
          <section className="bg-gray-50 rounded-3xl p-8 sm:p-12 border border-gray-200/70 relative overflow-hidden shadow-sm">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-8 space-y-3">
                <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#186a42]">
                  <ShieldCheck className="w-4 h-4 text-[#ffcc00]" />
                  Laboratory Access & Biosafety Compliance
                </div>
                <h3 className="font-heading text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
                  Request Equipment Access or Laboratory Booking
                </h3>
                <p className="text-gray-600 text-sm sm:text-base leading-relaxed max-w-2xl font-normal">
                  All researchers, postgraduate students, and external partners must complete
                  biosafety orientation and receive clearance before accessing specialized
                  equipment.
                </p>
              </div>

              <div className="lg:col-span-4 flex flex-col gap-3 justify-end">
                <Link
                  to="/contact"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl bg-[#186a42] hover:bg-[#125333] text-white font-bold text-xs uppercase tracking-wider shadow-md hover:shadow-lg transition-all"
                >
                  Contact Lab Administrator <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  to="/research"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl bg-white hover:bg-gray-100 text-gray-800 font-bold text-xs uppercase tracking-wider border border-gray-200 transition-colors"
                >
                  Research Portal
                </Link>
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
