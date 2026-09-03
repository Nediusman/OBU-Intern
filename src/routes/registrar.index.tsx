import { createFileRoute, Link } from "@tanstack/react-router";
import { Breadcrumbs } from "@/frontend/components/Breadcrumbs";
import {
  CalendarDays,
  FileText,
  Info,
  Clock,
  MapPin,
  Mail,
  Phone,
  UserCheck,
  Award,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  GraduationCap,
  FileCheck2,
  HelpCircle,
} from "lucide-react";
import { supabase } from "@/frontend/lib/supabase";

export const Route = createFileRoute("/registrar/")({
  head: () => ({
    meta: [
      { title: "Office of the Registrar — Oda Bultum University" },
      {
        name: "description",
        content:
          "Official information, student records, admissions, office hours, and contact details for the Oda Bultum University Registrar.",
      },
    ],
  }),
  component: RegistrarIndex,
  loader: async () => {
    const { data, error } = await supabase
      .from("registrar_information")
      .select("*")
      .eq("status", "active")
      .order("updated_at", { ascending: false })
      .limit(1)
      .maybeSingle();
    if (error) throw error;
    return { information: data };
  },
});

function RegistrarIndex() {
  const { information } = Route.useLoaderData();

  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* Page Hero */}
      <div className="obu-gradient py-20 md:py-28 px-4 sm:px-6 lg:px-8 relative overflow-hidden text-white">
        <div className="absolute inset-0 opacity-10 mix-blend-overlay pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white/15 to-transparent blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto relative z-10 animate-fade-in-up">
          <div className="inline-flex items-center gap-2 rounded-full bg-[#ffcc00] px-4 py-1.5 text-xs font-bold uppercase tracking-[0.2em] text-[#186a42] mb-5 shadow-lg">
            <ShieldCheck className="w-3.5 h-3.5" />
            Office of Academic Records & Admissions
          </div>
          <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-tight">
            Office of the Registrar
          </h1>
          <p className="mt-4 text-lg md:text-xl text-white/90 max-w-3xl font-medium leading-relaxed">
            The central authority for student admissions, academic enrollment, official transcripts,
            graduation clearance, and permanent academic records at Oda Bultum University.
          </p>
        </div>
      </div>

      {/* Breadcrumb Bar */}
      <div className="bg-gray-50 border-b border-gray-100 py-4 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <Breadcrumbs items={[{ label: "Office of the Registrar" }]} />
        </div>
      </div>

      <main className="flex-grow">
        <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 md:py-16 space-y-16">
          {/* Main Registrar Information Showcase */}
          {information ? (
            <section className="bg-white rounded-3xl border border-gray-100 shadow-xl overflow-hidden relative card-3d-interactive">
              <div className="h-2.5 w-full obu-gradient" />

              <div className="p-8 sm:p-12 lg:p-14 space-y-8">
                {/* Header Strip */}
                <div className="flex flex-wrap items-center justify-between gap-4 border-b border-gray-100 pb-6">
                  <div>
                    <span className="text-xs font-bold uppercase tracking-widest text-[#186a42] bg-[#186a42]/10 px-3 py-1 rounded-full">
                      Official Institutional Portal
                    </span>
                    <h2 className="font-heading text-3xl sm:text-4xl font-extrabold text-gray-900 mt-2">
                      {information.title || "Academic Records & Enrollment Services"}
                    </h2>
                  </div>

                  {information.registrar_name && (
                    <div className="flex items-center gap-3 bg-gray-50 px-4 py-2.5 rounded-2xl border border-gray-200/80">
                      <div className="w-10 h-10 rounded-xl bg-[#186a42]/10 text-[#186a42] flex items-center justify-center">
                        <UserCheck className="w-5 h-5" />
                      </div>
                      <div>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 block">
                          University Registrar
                        </span>
                        <span className="text-sm font-bold text-gray-900">
                          {information.registrar_name}
                        </span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Body / Description with Comfortable Typography */}
                {information.description && (
                  <div className="prose prose-lg max-w-none text-gray-700 font-normal leading-relaxed whitespace-pre-wrap">
                    {information.description}
                  </div>
                )}

                {/* Structured Contact & Operational Grid (3D interactive cards) */}
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4 pt-4">
                  {information.address && (
                    <div className="bg-gray-50/80 hover:bg-white rounded-2xl p-5 border border-gray-200/80 hover:border-[#186a42]/30 shadow-sm hover:shadow-md transition-all">
                      <div className="w-10 h-10 rounded-xl bg-[#186a42]/10 text-[#186a42] flex items-center justify-center mb-3">
                        <MapPin className="w-5 h-5" />
                      </div>
                      <span className="text-[11px] font-bold uppercase tracking-wider text-gray-400 block mb-1">
                        Campus Location
                      </span>
                      <p className="text-sm font-bold text-gray-900 leading-snug">
                        {information.address}
                      </p>
                    </div>
                  )}

                  {information.office_hours && (
                    <div className="bg-gray-50/80 hover:bg-white rounded-2xl p-5 border border-gray-200/80 hover:border-[#186a42]/30 shadow-sm hover:shadow-md transition-all">
                      <div className="w-10 h-10 rounded-xl bg-[#ffcc00]/20 text-[#186a42] flex items-center justify-center mb-3">
                        <Clock className="w-5 h-5" />
                      </div>
                      <span className="text-[11px] font-bold uppercase tracking-wider text-gray-400 block mb-1">
                        Service Hours
                      </span>
                      <p className="text-sm font-bold text-gray-900 leading-snug">
                        {information.office_hours}
                      </p>
                    </div>
                  )}

                  {information.email && (
                    <div className="bg-gray-50/80 hover:bg-white rounded-2xl p-5 border border-gray-200/80 hover:border-[#186a42]/30 shadow-sm hover:shadow-md transition-all">
                      <div className="w-10 h-10 rounded-xl bg-[#186a42]/10 text-[#186a42] flex items-center justify-center mb-3">
                        <Mail className="w-5 h-5" />
                      </div>
                      <span className="text-[11px] font-bold uppercase tracking-wider text-gray-400 block mb-1">
                        Official Inquiries
                      </span>
                      <a
                        href={`mailto:${information.email}`}
                        className="text-sm font-bold text-[#186a42] hover:underline truncate block"
                        title={information.email}
                      >
                        {information.email}
                      </a>
                    </div>
                  )}

                  {information.phone && (
                    <div className="bg-gray-50/80 hover:bg-white rounded-2xl p-5 border border-gray-200/80 hover:border-[#186a42]/30 shadow-sm hover:shadow-md transition-all">
                      <div className="w-10 h-10 rounded-xl bg-[#186a42]/10 text-[#186a42] flex items-center justify-center mb-3">
                        <Phone className="w-5 h-5" />
                      </div>
                      <span className="text-[11px] font-bold uppercase tracking-wider text-gray-400 block mb-1">
                        Helpline
                      </span>
                      <a
                        href={`tel:${information.phone}`}
                        className="text-sm font-bold text-gray-900 hover:text-[#186a42] transition-colors"
                      >
                        {information.phone}
                      </a>
                    </div>
                  )}
                </div>
              </div>
            </section>
          ) : (
            <div className="bg-white border border-gray-100 rounded-3xl p-16 text-center shadow-sm max-w-2xl mx-auto">
              <Info className="mx-auto h-20 w-20 text-gray-300 mb-4" />
              <h2 className="font-heading text-2xl font-bold text-gray-900 mb-2">
                Registrar Information Updating
              </h2>
              <p className="text-gray-500 font-medium">
                The general office information is currently being synchronized with university
                records.
              </p>
            </div>
          )}

          {/* Quick Access Portals (3D Interactive Cards) */}
          <section className="space-y-6">
            <div className="flex items-center gap-3">
              <span className="font-mono text-xs font-bold text-[#186a42] uppercase tracking-[0.25em] bg-[#186a42]/10 px-3 py-1 rounded-full">
                Quick Services
              </span>
              <h2 className="font-heading text-2xl font-extrabold text-gray-900 tracking-tight">
                Registrar Portals & Resources
              </h2>
              <div className="h-px bg-gray-200 flex-1 ml-2" />
            </div>

            <div className="grid gap-8 sm:grid-cols-3">
              {/* Card 1: Announcements */}
              <Link
                to="/registrar/announcements"
                className="group bg-white rounded-3xl p-8 border border-gray-100 shadow-lg hover:shadow-2xl hover:border-[#186a42]/30 card-3d-interactive flex flex-col justify-between relative overflow-hidden"
              >
                <div className="absolute top-0 left-0 w-full h-1.5 bg-[#186a42] opacity-0 group-hover:opacity-100 transition-opacity" />
                <div>
                  <div className="w-14 h-14 rounded-2xl bg-[#186a42]/10 text-[#186a42] group-hover:bg-[#186a42] group-hover:text-white flex items-center justify-center transition-colors duration-500 mb-6 shadow-sm">
                    <CalendarDays className="w-7 h-7" />
                  </div>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-[#186a42] bg-[#186a42]/10 px-2.5 py-0.5 rounded-full inline-block mb-3">
                    Deadlines & Notices
                  </span>
                  <h3 className="font-heading text-2xl font-bold text-gray-900 group-hover:text-[#186a42] transition-colors leading-tight mb-2">
                    Registrar Announcements
                  </h3>
                  <p className="text-gray-600 text-sm leading-relaxed font-normal">
                    Check critical registration dates, course add/drop windows, graduation
                    deadlines, and official announcements.
                  </p>
                </div>

                <div className="mt-8 pt-4 border-t border-gray-100 flex items-center justify-between text-xs font-bold uppercase tracking-wider text-[#186a42] group-hover:translate-x-1 transition-transform">
                  <span>View Notices</span>
                  <ArrowRight className="w-4 h-4" />
                </div>
              </Link>

              {/* Card 2: Documents */}
              <Link
                to="/registrar/documents"
                className="group bg-white rounded-3xl p-8 border border-gray-100 shadow-lg hover:shadow-2xl hover:border-[#186a42]/30 card-3d-interactive flex flex-col justify-between relative overflow-hidden"
              >
                <div className="absolute top-0 left-0 w-full h-1.5 bg-[#ffcc00] opacity-0 group-hover:opacity-100 transition-opacity" />
                <div>
                  <div className="w-14 h-14 rounded-2xl bg-[#ffcc00]/20 text-[#186a42] group-hover:bg-[#186a42] group-hover:text-[#ffcc00] flex items-center justify-center transition-colors duration-500 mb-6 shadow-sm">
                    <FileText className="w-7 h-7" />
                  </div>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-[#186a42] bg-[#ffcc00]/20 px-2.5 py-0.5 rounded-full inline-block mb-3">
                    Official Repository
                  </span>
                  <h3 className="font-heading text-2xl font-bold text-gray-900 group-hover:text-[#186a42] transition-colors leading-tight mb-2">
                    Forms & Documents
                  </h3>
                  <p className="text-gray-600 text-sm leading-relaxed font-normal">
                    Download official university admission slips, withdrawal forms, transcript
                    request slips, and clearance guides.
                  </p>
                </div>

                <div className="mt-8 pt-4 border-t border-gray-100 flex items-center justify-between text-xs font-bold uppercase tracking-wider text-[#186a42] group-hover:translate-x-1 transition-transform">
                  <span>Download Forms</span>
                  <ArrowRight className="w-4 h-4" />
                </div>
              </Link>

              {/* Card 3: Academics */}
              <Link
                to="/academics"
                className="group bg-white rounded-3xl p-8 border border-gray-100 shadow-lg hover:shadow-2xl hover:border-[#186a42]/30 card-3d-interactive flex flex-col justify-between relative overflow-hidden"
              >
                <div className="absolute top-0 left-0 w-full h-1.5 bg-[#186a42] opacity-0 group-hover:opacity-100 transition-opacity" />
                <div>
                  <div className="w-14 h-14 rounded-2xl bg-[#186a42]/10 text-[#186a42] group-hover:bg-[#186a42] group-hover:text-white flex items-center justify-center transition-colors duration-500 mb-6 shadow-sm">
                    <GraduationCap className="w-7 h-7" />
                  </div>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-[#186a42] bg-[#186a42]/10 px-2.5 py-0.5 rounded-full inline-block mb-3">
                    Faculties & Degrees
                  </span>
                  <h3 className="font-heading text-2xl font-bold text-gray-900 group-hover:text-[#186a42] transition-colors leading-tight mb-2">
                    Colleges & Programs
                  </h3>
                  <p className="text-gray-600 text-sm leading-relaxed font-normal">
                    Explore undergraduate and postgraduate degrees, admission criteria, curriculum
                    pathways, and academic departments.
                  </p>
                </div>

                <div className="mt-8 pt-4 border-t border-gray-100 flex items-center justify-between text-xs font-bold uppercase tracking-wider text-[#186a42] group-hover:translate-x-1 transition-transform">
                  <span>Explore Academics</span>
                  <ArrowRight className="w-4 h-4" />
                </div>
              </Link>
            </div>
          </section>

          {/* Student Service Charter & Inquiry Guidelines */}
          <section className="bg-gray-50 rounded-3xl p-8 sm:p-12 border border-gray-200/70 relative overflow-hidden shadow-sm">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-8 space-y-4">
                <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#186a42]">
                  <FileCheck2 className="w-4 h-4 text-[#ffcc00]" />
                  Service Standards & Document Clearance
                </div>
                <h3 className="font-heading text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
                  Academic Record Services & Verification
                </h3>
                <p className="text-gray-600 text-sm sm:text-base leading-relaxed max-w-2xl font-normal">
                  All official student verification requests, official transcript copies, and degree
                  authentication are processed in accordance with the Ministry of Education
                  guidelines and Oda Bultum University Academic Senate regulations.
                </p>
              </div>

              <div className="lg:col-span-4 flex flex-col gap-3 justify-end">
                <Link
                  to="/contact"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl bg-[#186a42] hover:bg-[#125333] text-white font-bold text-xs uppercase tracking-wider shadow-md hover:shadow-lg transition-all"
                >
                  Contact Registrar Desk <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  to="/registrar/documents"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl bg-white hover:bg-gray-100 text-gray-800 font-bold text-xs uppercase tracking-wider border border-gray-200 transition-colors"
                >
                  Download Application Forms
                </Link>
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
