import { createFileRoute, Link } from "@tanstack/react-router";
import { Breadcrumbs } from "@/frontend/components/Breadcrumbs";
import { getServices } from "@/backend/api";
import {
  Building2,
  Stethoscope,
  Library,
  Laptop,
  Utensils,
  Trophy,
  Home,
  Bus,
  Users,
  MapPin,
  Clock,
  Mail,
  ExternalLink,
  Search,
  ArrowRight,
  ChevronRight,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  Layers,
} from "lucide-react";
import { useState, useMemo } from "react";

export const Route = createFileRoute("/services/")({
  head: () => ({
    meta: [
      { title: "University Services — Oda Bultum University" },
      {
        name: "description",
        content:
          "Explore essential academic, healthcare, residential, library, and support services provided to students, faculty, and the university community at Oda Bultum University.",
      },
    ],
  }),
  loader: () => getServices(),
  component: ServicesIndex,
});

function getServiceIcon(iconName?: string | null) {
  const name = (iconName || "").toLowerCase().trim();
  if (
    name.includes("health") ||
    name.includes("steth") ||
    name.includes("medic") ||
    name.includes("clinic")
  ) {
    return Stethoscope;
  }
  if (
    name.includes("library") ||
    name.includes("book") ||
    name.includes("read") ||
    name.includes("academic")
  ) {
    return Library;
  }
  if (
    name.includes("tech") ||
    name.includes("computer") ||
    name.includes("it") ||
    name.includes("digital") ||
    name.includes("wifi")
  ) {
    return Laptop;
  }
  if (
    name.includes("cafeteria") ||
    name.includes("food") ||
    name.includes("dining") ||
    name.includes("meal")
  ) {
    return Utensils;
  }
  if (
    name.includes("sport") ||
    name.includes("gym") ||
    name.includes("fitness") ||
    name.includes("recreation")
  ) {
    return Trophy;
  }
  if (
    name.includes("dorm") ||
    name.includes("housing") ||
    name.includes("hostel") ||
    name.includes("residence")
  ) {
    return Home;
  }
  if (
    name.includes("bus") ||
    name.includes("transport") ||
    name.includes("shuttle") ||
    name.includes("vehicle")
  ) {
    return Bus;
  }
  if (
    name.includes("guidance") ||
    name.includes("counsel") ||
    name.includes("student") ||
    name.includes("support")
  ) {
    return Users;
  }
  return Building2;
}

function ServicesIndex() {
  const services = Route.useLoaderData();
  const [search, setSearch] = useState("");

  const filteredServices = useMemo(() => {
    return services.filter((s) => {
      const q = search.toLowerCase();
      return (
        search === "" ||
        s.service_name?.toLowerCase().includes(q) ||
        s.short_description?.toLowerCase().includes(q) ||
        s.full_description?.toLowerCase().includes(q) ||
        s.location?.toLowerCase().includes(q) ||
        s.icon?.toLowerCase().includes(q)
      );
    });
  }, [services, search]);

  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* Page Hero */}
      <div className="obu-gradient py-20 md:py-28 px-4 sm:px-6 lg:px-8 relative overflow-hidden text-white">
        <div className="absolute inset-0 opacity-10 mix-blend-overlay pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white/15 to-transparent blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto relative z-10 animate-fade-in-up">
          <div className="inline-flex items-center gap-2 rounded-full bg-[#ffcc00] px-4 py-1.5 text-xs font-bold uppercase tracking-[0.2em] text-[#186a42] mb-5 shadow-lg">
            <Layers className="w-3.5 h-3.5" />
            Campus Life & Community Support
          </div>
          <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-tight">
            University Services
          </h1>
          <p className="mt-4 text-lg md:text-xl text-white/90 max-w-3xl font-medium leading-relaxed">
            Comprehensive services and facilities supporting academic excellence, campus welfare,
            health, and daily life for all students, faculty, and staff at Oda Bultum University.
          </p>
        </div>
      </div>

      {/* Breadcrumb Bar */}
      <div className="bg-gray-50 border-b border-gray-100 py-4 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <Breadcrumbs items={[{ label: "University Services" }]} />
        </div>
      </div>

      <main className="flex-grow">
        <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 md:py-16 space-y-12">
          {/* Search & Counter Bar */}
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-gray-50/80 p-6 rounded-3xl border border-gray-100">
            <div className="relative w-full md:max-w-md">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search services by name, description, location..."
                className="w-full pl-12 pr-4 py-3.5 rounded-2xl bg-white border border-gray-200 text-sm font-medium text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#186a42] focus:border-transparent shadow-sm transition-all"
              />
            </div>

            <div className="text-xs font-bold uppercase tracking-widest text-gray-500 self-start md:self-center">
              Showing <strong className="text-[#186a42]">{filteredServices.length}</strong> Services
            </div>
          </div>

          {/* Equal-Weight Services Directory */}
          {filteredServices.length === 0 ? (
            <div className="bg-white border border-gray-100 rounded-3xl p-16 text-center shadow-sm max-w-2xl mx-auto">
              <Building2 className="mx-auto h-20 w-20 text-gray-300 mb-4" />
              <h2 className="font-heading text-2xl font-bold text-gray-900 mb-2">
                No Services Found
              </h2>
              <p className="text-gray-500 font-medium">
                {search
                  ? "No services match your search query. Try clearing your search."
                  : "University services are currently being published."}
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
              {filteredServices.map((service) => {
                const Icon = getServiceIcon(service.icon);
                const description = service.short_description || service.full_description || "";

                return (
                  <div
                    key={service.id}
                    className="group bg-white rounded-3xl border border-gray-100 shadow-md hover:shadow-2xl hover:border-[#186a42]/30 card-3d-interactive flex flex-col justify-between overflow-hidden relative"
                  >
                    <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-[#186a42] via-[#ffcc00] to-[#186a42] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                    <div>
                      {/* Optional Image Banner if provided */}
                      {(service.main_image_url || service.image) && (
                        <div className="aspect-[16/9] w-full bg-gray-100 relative overflow-hidden">
                          <img
                            src={service.main_image_url || service.image || ""}
                            alt={service.service_name}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                          />
                        </div>
                      )}

                      {/* Card Body */}
                      <div className="p-7 space-y-4">
                        <div className="flex items-center justify-between gap-3">
                          <div className="w-12 h-12 rounded-2xl bg-[#186a42]/10 text-[#186a42] group-hover:bg-[#186a42] group-hover:text-white flex items-center justify-center transition-colors duration-500 shadow-sm shrink-0">
                            <Icon className="w-6 h-6" />
                          </div>

                          {service.icon && (
                            <span className="text-[10px] font-black uppercase tracking-wider bg-gray-100 text-gray-700 group-hover:bg-[#186a42]/10 group-hover:text-[#186a42] px-2.5 py-1 rounded-full truncate max-w-[50%] transition-colors">
                              {service.icon}
                            </span>
                          )}
                        </div>

                        <div>
                          <h2 className="font-heading text-xl font-bold text-gray-900 group-hover:text-[#186a42] transition-colors leading-snug">
                            {service.service_name}
                          </h2>

                          {description && (
                            <p className="text-gray-600 text-xs sm:text-sm leading-relaxed line-clamp-3 font-normal mt-2">
                              {description}
                            </p>
                          )}
                        </div>

                        {/* Optional Meta Information Strip */}
                        {(service.location || service.opening_hours || service.contact) && (
                          <div className="pt-3 border-t border-gray-100 text-xs text-gray-500 space-y-2">
                            {service.location && (
                              <div className="flex items-center gap-2 truncate">
                                <MapPin className="w-3.5 h-3.5 text-[#186a42] shrink-0" />
                                <span className="truncate">{service.location}</span>
                              </div>
                            )}
                            {service.opening_hours && (
                              <div className="flex items-center gap-2 truncate">
                                <Clock className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                                <span className="truncate">{service.opening_hours}</span>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Card Action Footer */}
                    <div className="p-7 pt-0">
                      <Link
                        to="/services/$slug"
                        params={{ slug: service.slug || service.id }}
                        className="w-full inline-flex items-center justify-between px-5 py-3 rounded-2xl bg-gray-50 hover:bg-[#186a42] text-gray-800 hover:text-white font-bold text-xs uppercase tracking-wider transition-all duration-300 group/btn"
                      >
                        <span>View Service Details</span>
                        <ChevronRight className="w-4 h-4 transition-transform group-hover/btn:translate-x-1" />
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* ─── UNIVERSITY SERVICE STANDARDS CHARTER ─── */}
          <section className="bg-gray-50 rounded-3xl p-8 sm:p-12 border border-gray-200/70 relative overflow-hidden shadow-sm">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-8 space-y-3">
                <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#186a42]">
                  <ShieldCheck className="w-4 h-4 text-[#ffcc00]" />
                  Service Charter & Quality Commitment
                </div>
                <h3 className="font-heading text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
                  Dedicated to Serving the University Community
                </h3>
                <p className="text-gray-600 text-sm sm:text-base leading-relaxed max-w-2xl font-normal">
                  Oda Bultum University is committed to delivering accessible, efficient, and
                  courteous services to all students, academic staff, and campus visitors across all
                  campuses.
                </p>
              </div>

              <div className="lg:col-span-4 flex flex-col sm:flex-row lg:flex-col gap-3 justify-end">
                <Link
                  to="/contact"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl bg-[#186a42] hover:bg-[#125333] text-white font-bold text-xs uppercase tracking-wider shadow-md hover:shadow-lg transition-all"
                >
                  Contact Campus Helpdesk <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  to="/administration"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl bg-white hover:bg-gray-100 text-gray-800 font-bold text-xs uppercase tracking-wider border border-gray-200 transition-colors"
                >
                  Administrative Offices
                </Link>
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
