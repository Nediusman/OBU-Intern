import { createFileRoute, notFound, Link } from "@tanstack/react-router";
import { Breadcrumbs } from "@/frontend/components/Breadcrumbs";
import { getServiceBySlug } from "@/backend/api";
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
  Phone,
  ArrowLeft,
  ExternalLink,
  ShieldCheck,
  CheckCircle2,
  Sparkles,
} from "lucide-react";

export const Route = createFileRoute("/services/$slug")({
  head: () => ({
    meta: [
      { title: "Service Details — Oda Bultum University" },
      {
        name: "description",
        content:
          "Read detailed information, opening hours, location, and contact details for university services at Oda Bultum University.",
      },
    ],
  }),
  component: ServiceDetail,
  loader: async ({ params }) => {
    const service = await getServiceBySlug({ data: params.slug });
    if (!service) {
      throw notFound();
    }
    return { service };
  },
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

function ServiceDetail() {
  const { service } = Route.useLoaderData();
  const Icon = getServiceIcon(service.icon);
  const description = service.full_description || service.short_description || "";

  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* Cover Hero */}
      <div className="relative obu-gradient py-20 md:py-28 px-4 sm:px-6 lg:px-8 text-white overflow-hidden">
        {service.main_image_url || service.image ? (
          <>
            <img
              src={service.main_image_url || service.image || ""}
              alt={service.service_name}
              className="absolute inset-0 h-full w-full object-cover opacity-20 mix-blend-overlay"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#186a42] via-[#186a42]/80 to-transparent pointer-events-none" />
          </>
        ) : (
          <div className="absolute inset-0 opacity-10 mix-blend-overlay pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]" />
        )}

        <div className="max-w-7xl mx-auto relative z-10 animate-fade-in-up space-y-4">
          <Link
            to="/services"
            className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#ffcc00] hover:underline mb-2"
          >
            <ArrowLeft className="w-4 h-4" /> Back to University Services
          </Link>

          <div className="flex flex-wrap items-center gap-3">
            {service.icon && (
              <span className="px-3 py-1 bg-[#ffcc00] text-[#186a42] text-xs font-black uppercase tracking-wider rounded-full shadow">
                {service.icon}
              </span>
            )}
            <span className="px-3 py-1 text-xs font-bold uppercase tracking-wider rounded-full border bg-white/20 text-white backdrop-blur-sm">
              {service.status || "Operational"}
            </span>
          </div>

          <h1 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-tight max-w-4xl">
            {service.service_name}
          </h1>

          {service.location && (
            <div className="flex items-center gap-2 text-white/90 text-sm font-medium">
              <MapPin className="w-4 h-4 text-[#ffcc00]" />
              <span>{service.location}</span>
            </div>
          )}
        </div>
      </div>

      {/* Breadcrumb Bar */}
      <div className="bg-gray-50 border-b border-gray-100 py-4 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <Breadcrumbs
            items={[{ label: "Services", to: "/services" }, { label: service.service_name }]}
          />
        </div>
      </div>

      <main className="flex-grow">
        <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 md:py-16">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            {/* ─── MAIN CONTENT COLUMN (8 COLS) ─── */}
            <div className="lg:col-span-8 space-y-12">
              {/* Optional Service Image */}
              {(service.main_image_url || service.image) && (
                <div className="rounded-3xl overflow-hidden shadow-xl border border-gray-100 bg-gray-100 aspect-video w-full">
                  <img
                    src={service.main_image_url || service.image || ""}
                    alt={service.service_name}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}

              {/* Service Description */}
              <section className="bg-white rounded-3xl p-8 sm:p-10 border border-gray-100 shadow-lg space-y-6">
                <div className="flex items-center gap-3">
                  <span className="font-mono text-xs font-bold text-[#186a42] uppercase tracking-[0.25em] bg-[#186a42]/10 px-3 py-1 rounded-full">
                    Overview
                  </span>
                  <h2 className="font-heading text-2xl font-extrabold text-gray-900 tracking-tight">
                    About this Service
                  </h2>
                </div>

                <div className="prose prose-lg max-w-none text-gray-700 font-normal leading-relaxed whitespace-pre-wrap">
                  {description ? (
                    description
                  ) : (
                    <p className="italic text-gray-400">
                      Service description is currently being updated.
                    </p>
                  )}
                </div>

                {/* External Link button if provided */}
                {service.external_link && (
                  <div className="pt-4 border-t border-gray-100">
                    <a
                      href={service.external_link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-[#186a42] hover:bg-[#125333] text-white font-bold text-xs uppercase tracking-wider shadow-lg shadow-[#186a42]/20 transition-all"
                    >
                      Access Online Service Portal <ExternalLink className="w-4 h-4" />
                    </a>
                  </div>
                )}
              </section>

              {/* Service Standards Charter */}
              <section className="bg-gray-50 rounded-3xl p-8 sm:p-10 border border-gray-200/70 space-y-4">
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#186a42]">
                  <ShieldCheck className="w-4 h-4 text-[#ffcc00]" />
                  University Quality Commitment
                </div>
                <h3 className="font-heading text-xl font-bold text-gray-900">
                  Service Standards & Community Access
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed font-normal">
                  All university facilities and support desks adhere to official university service
                  standards to ensure accessibility, efficiency, and support for all members of the
                  Oda Bultum University community.
                </p>
              </section>
            </div>

            {/* ─── STICKY SIDEBAR (4 COLS) ─── */}
            <div className="lg:col-span-4 space-y-8 sticky top-28">
              {/* Information Card */}
              <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-xl space-y-6">
                <div className="flex items-center justify-between border-b border-gray-100 pb-4">
                  <h3 className="font-heading text-xl font-bold text-gray-900">
                    Service Information
                  </h3>
                  <span className="px-3 py-1 text-xs font-bold uppercase tracking-wider rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                    {service.status || "Active"}
                  </span>
                </div>

                <dl className="space-y-4 text-sm">
                  {service.location && (
                    <div className="bg-gray-50/80 p-4 rounded-2xl border border-gray-100">
                      <dt className="text-xs font-bold uppercase tracking-wider text-gray-400 flex items-center gap-1.5 mb-1">
                        <MapPin className="w-3.5 h-3.5 text-[#186a42]" />
                        Campus Location
                      </dt>
                      <dd className="font-bold text-gray-900">{service.location}</dd>
                    </div>
                  )}

                  {service.opening_hours && (
                    <div className="bg-gray-50/80 p-4 rounded-2xl border border-gray-100">
                      <dt className="text-xs font-bold uppercase tracking-wider text-gray-400 flex items-center gap-1.5 mb-1">
                        <Clock className="w-3.5 h-3.5 text-[#186a42]" />
                        Operating Hours
                      </dt>
                      <dd className="font-bold text-gray-900">{service.opening_hours}</dd>
                    </div>
                  )}

                  {service.contact && (
                    <div className="bg-gray-50/80 p-4 rounded-2xl border border-gray-100">
                      <dt className="text-xs font-bold uppercase tracking-wider text-gray-400 flex items-center gap-1.5 mb-1">
                        <Mail className="w-3.5 h-3.5 text-[#186a42]" />
                        Contact / Helpdesk
                      </dt>
                      <dd className="font-semibold text-gray-900 truncate">
                        {service.contact.includes("@") ? (
                          <a
                            href={`mailto:${service.contact}`}
                            className="text-[#186a42] hover:underline"
                          >
                            {service.contact}
                          </a>
                        ) : (
                          service.contact
                        )}
                      </dd>
                    </div>
                  )}

                  <div className="bg-gray-50/80 p-4 rounded-2xl border border-gray-100">
                    <dt className="text-xs font-bold uppercase tracking-wider text-gray-400 flex items-center gap-1.5 mb-1">
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#186a42]" />
                      Availability
                    </dt>
                    <dd className="font-bold text-emerald-700">Open to University Community</dd>
                  </div>
                </dl>
              </div>

              {/* Inquiry Action Card */}
              <div className="obu-gradient rounded-3xl p-8 text-white relative overflow-hidden shadow-xl space-y-4">
                <div className="relative z-10 space-y-3">
                  <span className="text-xs font-bold uppercase tracking-widest text-[#ffcc00] block">
                    Assistance & Support
                  </span>
                  <h4 className="font-heading text-xl font-bold">Need Help with this Service?</h4>
                  <p className="text-white/80 text-xs sm:text-sm leading-relaxed">
                    Have questions about service access, facilities, or schedules? Contact the
                    central campus support team.
                  </p>
                  <div className="pt-2">
                    <Link
                      to="/contact"
                      className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-white text-[#186a42] font-bold text-xs uppercase tracking-wider shadow-md hover:bg-gray-100 transition-colors"
                    >
                      Contact University Desk
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
