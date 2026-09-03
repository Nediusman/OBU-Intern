import { createFileRoute, Link } from "@tanstack/react-router";
import { Breadcrumbs } from "@/frontend/components/Breadcrumbs";
import { supabase } from "@/frontend/lib/supabase";
import {
  User as UserIcon,
  Mail,
  Phone,
  Building2,
  ChevronRight,
  Award,
  Sparkles,
  GraduationCap,
  Briefcase,
  Quote,
  ArrowRight,
  Shield,
} from "lucide-react";

export const Route = createFileRoute("/leadership/")({
  head: () => ({
    meta: [
      { title: "University Leadership — Oda Bultum University" },
      {
        name: "description",
        content:
          "Meet the executive council, president, vice presidents, and academic deans of Oda Bultum University.",
      },
    ],
  }),
  component: LeadershipIndex,
  loader: async () => {
    const { data: leaders, error } = await supabase
      .from("leadership")
      .select(
        `
        *,
        media ( file_url )
      `,
      )
      .eq("status", "active")
      .order("display_order", { ascending: true })
      .order("created_at", { ascending: true });

    if (error) {
      console.error("Failed to fetch leadership:", error);
      throw new Error("Failed to fetch leadership");
    }

    return { leaders: leaders || [] };
  },
});

function LeadershipIndex() {
  const { leaders } = Route.useLoaderData();

  // Helper to extract image URL
  const getMediaUrl = (item: (typeof leaders)[number]) => {
    if (
      item.media &&
      !Array.isArray(item.media) &&
      (item.media as { file_url?: string }).file_url
    ) {
      return (item.media as { file_url?: string }).file_url;
    }
    return null;
  };

  // 1. Identify President / Primary Institutional Leader
  const president =
    leaders.find(
      (l) =>
        l.position?.toLowerCase().includes("president") &&
        !l.position?.toLowerCase().includes("vice"),
    ) || (leaders.length > 0 ? leaders[0] : null);

  // 2. Identify Senior / Executive Leadership (Vice Presidents, Deputy, Directors, Heads)
  const seniorLeaders = leaders.filter((l) => {
    if (president && l.id === president.id) return false;
    const pos = (l.position || "").toLowerCase();
    return (
      pos.includes("vice") ||
      pos.includes("deputy") ||
      pos.includes("director") ||
      pos.includes("manager") ||
      pos.includes("head")
    );
  });

  // 3. Identify Academic Leadership / Deans
  const academicLeaders = leaders.filter((l) => {
    if (president && l.id === president.id) return false;
    if (seniorLeaders.some((s) => s.id === l.id)) return false;
    const pos = (l.position || "").toLowerCase();
    const dept = (l.department_office || "").toLowerCase();
    return (
      pos.includes("dean") ||
      pos.includes("academic") ||
      pos.includes("faculty") ||
      dept.includes("college") ||
      dept.includes("academic")
    );
  });

  // 4. Other Leadership
  const otherLeaders = leaders.filter(
    (l) =>
      (!president || l.id !== president.id) &&
      !seniorLeaders.some((s) => s.id === l.id) &&
      !academicLeaders.some((a) => a.id === l.id),
  );

  // If hierarchy auto-grouping leaves middle tiers empty (e.g. homogeneous test data),
  // ensure visual rhythm by allocating remaining items gracefully.
  let displaySenior = seniorLeaders;
  let displayAcademic = academicLeaders;
  let displayOther = otherLeaders;

  if (seniorLeaders.length === 0 && academicLeaders.length === 0 && otherLeaders.length > 0) {
    displaySenior = otherLeaders.slice(0, 2);
    displayAcademic = otherLeaders.slice(2, 5);
    displayOther = otherLeaders.slice(5);
  }

  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* Page Hero */}
      <div className="obu-gradient py-20 md:py-28 px-4 sm:px-6 lg:px-8 relative overflow-hidden text-white">
        <div className="absolute inset-0 opacity-10 mix-blend-overlay pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white/15 to-transparent blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto relative z-10 animate-fade-in-up">
          <div className="inline-flex items-center gap-2 rounded-full bg-[#ffcc00] px-4 py-1.5 text-xs font-bold uppercase tracking-[0.2em] text-[#186a42] mb-5 shadow-lg">
            <Shield className="w-3.5 h-3.5" />
            Institutional Governance & Leadership
          </div>
          <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-tight">
            University Leadership
          </h1>
          <p className="mt-4 text-lg md:text-xl text-white/90 max-w-3xl font-medium leading-relaxed">
            The executive council, academic deans, and operational directors dedicated to advancing
            Oda Bultum University’s mission of academic excellence, cutting-edge research, and
            regional empowerment.
          </p>
        </div>
      </div>

      <main className="flex-grow">
        {/* Breadcrumb Bar */}
        <div className="bg-gray-50 border-b border-gray-100 py-4 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <Breadcrumbs items={[{ label: "University Leadership" }]} />
          </div>
        </div>

        {leaders.length === 0 ? (
          <div className="container mx-auto px-4 py-20 max-w-3xl text-center">
            <div className="bg-white border border-gray-100 rounded-3xl p-16 shadow-sm">
              <UserIcon className="mx-auto h-20 w-20 text-gray-300 mb-4" />
              <h2 className="font-heading text-2xl font-bold text-gray-900 mb-2">
                Leadership Directory Updating
              </h2>
              <p className="text-gray-500 font-medium">
                The university leadership profiles are currently being updated. Please check back
                shortly.
              </p>
            </div>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {/* ─── SECTION 1: PRESIDENT / CHIEF EXECUTIVE (EDITORIAL SHOWCASE) ─── */}
            {president && (
              <section className="py-16 md:py-24 bg-gradient-to-b from-gray-50/60 to-white relative overflow-hidden">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                  {/* Section Eyebrow */}
                  <div className="flex items-center gap-3 mb-10">
                    <span className="font-mono text-xs font-bold text-[#186a42] uppercase tracking-[0.25em] bg-[#186a42]/10 px-3 py-1 rounded-full">
                      01 / Executive Head
                    </span>
                    <div className="h-px bg-gray-200 flex-1" />
                  </div>

                  {(() => {
                    const presUrl = getMediaUrl(president);

                    return (
                      <div className="bg-white rounded-3xl border border-gray-100 shadow-2xl overflow-hidden relative">
                        {/* Top Gradient Ribbon */}
                        <div className="h-2.5 w-full obu-gradient" />

                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 p-8 sm:p-12 lg:p-16 items-center">
                          {/* Portrait Column */}
                          <div className="lg:col-span-5 relative">
                            <div className="relative aspect-[3/4] w-full rounded-2xl overflow-hidden shadow-xl bg-gray-100 group">
                              {presUrl ? (
                                <img
                                  src={presUrl}
                                  alt={president.full_name}
                                  className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-700"
                                />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center bg-gray-100 text-gray-300">
                                  <UserIcon className="w-32 h-32" />
                                </div>
                              )}
                              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent pointer-events-none" />

                              <div className="absolute bottom-6 left-6 right-6">
                                <span className="inline-block px-4 py-1.5 bg-[#ffcc00] text-[#186a42] text-xs font-black uppercase tracking-widest rounded-full shadow-lg">
                                  {president.position || "University President"}
                                </span>
                              </div>
                            </div>

                            {/* Decorative framing element */}
                            <div className="absolute -bottom-3 -right-3 w-32 h-32 bg-[#ffcc00]/20 rounded-2xl -z-10 blur-xl pointer-events-none" />
                          </div>

                          {/* Details Column */}
                          <div className="lg:col-span-7 space-y-6">
                            <div>
                              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#186a42] mb-2">
                                <Award className="w-4 h-4 text-[#ffcc00]" />
                                Office of the President
                              </div>
                              <h2 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-extrabold text-gray-900 tracking-tight leading-tight">
                                {president.full_name}
                              </h2>
                              <p className="text-xl font-bold text-[#186a42] mt-2">
                                {president.position}
                              </p>
                              {president.department_office && (
                                <p className="text-sm font-semibold text-gray-500 mt-1 flex items-center gap-1.5">
                                  <Building2 className="w-4 h-4" />
                                  {president.department_office}
                                </p>
                              )}
                            </div>

                            {/* Presidential Quote / Mandate Excerpt */}
                            <div className="p-6 rounded-2xl bg-gray-50 border border-gray-100 relative">
                              <Quote className="w-8 h-8 text-[#186a42]/20 absolute top-4 right-4 pointer-events-none" />
                              <p className="text-gray-700 text-base sm:text-lg leading-relaxed font-normal italic">
                                {president.biography
                                  ? president.biography.slice(0, 240) +
                                    (president.biography.length > 240 ? "..." : "")
                                  : "Leading Oda Bultum University with visionary stewardship, prioritizing academic excellence, innovative research, and impactful community outreach."}
                              </p>
                            </div>

                            {/* Contact Badges */}
                            <div className="flex flex-wrap gap-3 pt-2">
                              {president.email && (
                                <a
                                  href={`mailto:${president.email}`}
                                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gray-50 border border-gray-200 text-xs font-bold text-gray-700 hover:text-[#186a42] hover:border-[#186a42] transition-colors"
                                >
                                  <Mail className="w-4 h-4 text-[#186a42]" />
                                  {president.email}
                                </a>
                              )}
                              {president.phone && (
                                <a
                                  href={`tel:${president.phone}`}
                                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gray-50 border border-gray-200 text-xs font-bold text-gray-700 hover:text-[#186a42] hover:border-[#186a42] transition-colors"
                                >
                                  <Phone className="w-4 h-4 text-[#186a42]" />
                                  {president.phone}
                                </a>
                              )}
                            </div>

                            {/* CTA Button */}
                            <div className="pt-4 flex items-center gap-4">
                              <Link
                                to="/leadership/$slug"
                                params={{ slug: president.slug || president.id }}
                                className="inline-flex items-center gap-3 px-7 py-4 rounded-2xl bg-[#186a42] hover:bg-[#125333] text-white font-bold text-sm tracking-wider uppercase shadow-xl shadow-[#186a42]/25 hover:shadow-2xl transition-all duration-300 group"
                              >
                                View Executive Profile & Biography
                                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                              </Link>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })()}
                </div>
              </section>
            )}

            {/* ─── SECTION 2: SENIOR & EXECUTIVE LEADERSHIP (HORIZONTAL CARDS) ─── */}
            {displaySenior.length > 0 && (
              <section className="py-16 md:py-24 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                  {/* Section Eyebrow & Title */}
                  <div className="flex items-center gap-3 mb-4">
                    <span className="font-mono text-xs font-bold text-[#186a42] uppercase tracking-[0.25em] bg-[#186a42]/10 px-3 py-1 rounded-full">
                      02 / Senior Governance
                    </span>
                    <div className="h-px bg-gray-200 flex-1" />
                  </div>
                  <h2 className="font-heading text-3xl font-extrabold text-gray-900 tracking-tight mb-10">
                    Executive Council & Senior Officers
                  </h2>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {displaySenior.map((leader, index) => {
                      const imgUrl = getMediaUrl(leader);

                      return (
                        <div
                          key={leader.id}
                          className="group bg-white rounded-3xl border border-gray-100 p-6 sm:p-8 shadow-lg hover:shadow-2xl hover:border-[#186a42]/30 transition-all duration-500 hover:-translate-y-1 relative overflow-hidden flex flex-col sm:flex-row gap-6 items-start"
                        >
                          <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-[#186a42] via-[#ffcc00] to-[#186a42] opacity-0 group-hover:opacity-100 transition-opacity" />

                          {/* Image */}
                          <div className="w-full sm:w-44 aspect-[3/4] rounded-2xl overflow-hidden bg-gray-100 relative shrink-0 shadow-md">
                            {imgUrl ? (
                              <img
                                src={imgUrl}
                                alt={leader.full_name}
                                className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-700"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center bg-gray-50 text-gray-300">
                                <UserIcon className="w-16 h-16" />
                              </div>
                            )}
                          </div>

                          {/* Content */}
                          <div className="flex flex-col justify-between flex-1 h-full min-w-0 space-y-4">
                            <div>
                              <span className="inline-block px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider bg-[#186a42]/10 text-[#186a42] mb-2">
                                {leader.position}
                              </span>
                              <h3 className="font-heading text-2xl font-bold text-gray-900 group-hover:text-[#186a42] transition-colors leading-tight">
                                {leader.full_name}
                              </h3>
                              {leader.department_office && (
                                <p className="text-xs font-semibold text-gray-500 mt-1 flex items-center gap-1.5">
                                  <Building2 className="w-3.5 h-3.5 text-gray-400" />
                                  {leader.department_office}
                                </p>
                              )}
                            </div>

                            {leader.biography && (
                              <p className="text-gray-600 text-xs sm:text-sm leading-relaxed line-clamp-3">
                                {leader.biography}
                              </p>
                            )}

                            <div className="pt-2 flex items-center justify-between border-t border-gray-100">
                              <div className="flex gap-2">
                                {leader.email && (
                                  <a
                                    href={`mailto:${leader.email}`}
                                    className="p-2 rounded-lg bg-gray-50 text-gray-600 hover:text-[#186a42] hover:bg-[#186a42]/10 transition-colors"
                                    title={leader.email}
                                  >
                                    <Mail className="w-4 h-4" />
                                  </a>
                                )}
                                {leader.phone && (
                                  <a
                                    href={`tel:${leader.phone}`}
                                    className="p-2 rounded-lg bg-gray-50 text-gray-600 hover:text-[#186a42] hover:bg-[#186a42]/10 transition-colors"
                                    title={leader.phone}
                                  >
                                    <Phone className="w-4 h-4" />
                                  </a>
                                )}
                              </div>

                              <Link
                                to="/leadership/$slug"
                                params={{ slug: leader.slug || leader.id }}
                                className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#186a42] group-hover:translate-x-1 transition-transform"
                              >
                                Full Profile <ChevronRight className="w-3.5 h-3.5" />
                              </Link>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </section>
            )}

            {/* ─── SECTION 3: ACADEMIC LEADERSHIP & DEANS (3-COLUMN SHOWCASE) ─── */}
            {displayAcademic.length > 0 && (
              <section className="py-16 md:py-24 bg-gray-50/70">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                  {/* Section Eyebrow & Title */}
                  <div className="flex items-center gap-3 mb-4">
                    <span className="font-mono text-xs font-bold text-[#186a42] uppercase tracking-[0.25em] bg-[#186a42]/10 px-3 py-1 rounded-full">
                      03 / Academic Stewards
                    </span>
                    <div className="h-px bg-gray-200 flex-1" />
                  </div>
                  <h2 className="font-heading text-3xl font-extrabold text-gray-900 tracking-tight mb-10 flex items-center gap-3">
                    <GraduationCap className="w-8 h-8 text-[#186a42]" />
                    Academic Deans & Faculty Directors
                  </h2>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {displayAcademic.map((leader) => {
                      const imgUrl = getMediaUrl(leader);

                      return (
                        <Link
                          key={leader.id}
                          to="/leadership/$slug"
                          params={{ slug: leader.slug || leader.id }}
                          className="group bg-white rounded-3xl border border-gray-100 shadow-md hover:shadow-2xl hover:border-[#186a42]/30 transition-all duration-500 hover:-translate-y-1.5 flex flex-col overflow-hidden relative"
                        >
                          <div className="aspect-[4/3] w-full bg-gray-100 relative overflow-hidden flex items-center justify-center">
                            {imgUrl ? (
                              <img
                                src={imgUrl}
                                alt={leader.full_name}
                                className="absolute inset-0 w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-700"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center bg-gray-50 text-gray-300">
                                <UserIcon className="h-20 w-20" />
                              </div>
                            )}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent pointer-events-none" />

                            <div className="absolute bottom-3 left-4 right-4">
                              <span className="inline-block px-3 py-1 bg-[#ffcc00] text-[#186a42] text-[11px] font-bold uppercase tracking-wider rounded-full shadow">
                                {leader.position}
                              </span>
                            </div>
                          </div>

                          <div className="p-6 flex flex-col flex-grow">
                            <h3 className="font-heading text-xl font-bold text-gray-900 group-hover:text-[#186a42] transition-colors leading-snug mb-1">
                              {leader.full_name}
                            </h3>

                            {leader.department_office && (
                              <p className="text-xs font-semibold text-gray-500 mb-3 flex items-center gap-1.5">
                                <Building2 className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                                <span className="truncate">{leader.department_office}</span>
                              </p>
                            )}

                            {leader.biography && (
                              <p className="text-gray-600 text-xs leading-relaxed line-clamp-2 mb-4">
                                {leader.biography}
                              </p>
                            )}

                            <div className="mt-auto pt-4 border-t border-gray-100 flex items-center justify-between text-xs font-bold uppercase tracking-wider text-[#186a42] group-hover:translate-x-1 transition-transform">
                              <span>View Profile</span>
                              <ChevronRight className="w-4 h-4" />
                            </div>
                          </div>
                        </Link>
                      );
                    })}
                  </div>
                </div>
              </section>
            )}

            {/* ─── SECTION 4: OTHER UNIVERSITY OFFICERS (COMPACT LIST/GRID) ─── */}
            {displayOther.length > 0 && (
              <section className="py-16 md:py-24 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                  {/* Section Eyebrow & Title */}
                  <div className="flex items-center gap-3 mb-4">
                    <span className="font-mono text-xs font-bold text-[#186a42] uppercase tracking-[0.25em] bg-[#186a42]/10 px-3 py-1 rounded-full">
                      04 / Directorate Heads
                    </span>
                    <div className="h-px bg-gray-200 flex-1" />
                  </div>
                  <h2 className="font-heading text-3xl font-extrabold text-gray-900 tracking-tight mb-10 flex items-center gap-3">
                    <Briefcase className="w-8 h-8 text-[#186a42]" />
                    University Directors & Officers
                  </h2>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {displayOther.map((leader) => {
                      const imgUrl = getMediaUrl(leader);

                      return (
                        <Link
                          key={leader.id}
                          to="/leadership/$slug"
                          params={{ slug: leader.slug || leader.id }}
                          className="group bg-gray-50/60 hover:bg-white rounded-2xl p-5 border border-gray-200/70 hover:border-[#186a42]/30 hover:shadow-xl transition-all duration-300 flex items-center gap-4"
                        >
                          <div className="w-16 h-16 rounded-xl overflow-hidden bg-gray-200 shrink-0 shadow-sm">
                            {imgUrl ? (
                              <img
                                src={imgUrl}
                                alt={leader.full_name}
                                className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center bg-gray-100 text-gray-400">
                                <UserIcon className="w-8 h-8" />
                              </div>
                            )}
                          </div>

                          <div className="min-w-0 flex-1">
                            <span className="block text-[10px] font-bold uppercase tracking-wider text-[#186a42] truncate">
                              {leader.position}
                            </span>
                            <h4 className="font-heading font-bold text-gray-900 group-hover:text-[#186a42] text-sm truncate">
                              {leader.full_name}
                            </h4>
                            {leader.department_office && (
                              <p className="text-[11px] text-gray-500 truncate">
                                {leader.department_office}
                              </p>
                            )}
                          </div>

                          <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-[#186a42] group-hover:translate-x-0.5 transition-all shrink-0" />
                        </Link>
                      );
                    })}
                  </div>
                </div>
              </section>
            )}

            {/* ─── INSTITUTIONAL GOVERNANCE MANDATE FOOTER BANNER ─── */}
            <section className="py-16 bg-gray-50">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="obu-gradient rounded-3xl p-8 sm:p-12 text-white relative overflow-hidden shadow-2xl">
                  <div className="absolute inset-0 opacity-10 mix-blend-overlay bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]" />
                  <div className="relative z-10 max-w-3xl space-y-4">
                    <span className="inline-block px-3 py-1 rounded-full bg-white/20 backdrop-blur-sm text-xs font-bold uppercase tracking-widest text-[#ffcc00]">
                      University Charter & Mandate
                    </span>
                    <h3 className="font-heading text-2xl sm:text-3xl font-extrabold tracking-tight">
                      Committed to Excellence, Integrity & Community Transformation
                    </h3>
                    <p className="text-white/85 text-sm sm:text-base leading-relaxed font-medium">
                      Oda Bultum University’s leadership framework is structured to ensure
                      participatory governance, ethical management, and accountable public service
                      across all educational, research, and community endeavors.
                    </p>
                    <div className="pt-2">
                      <Link
                        to="/about"
                        className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white text-[#186a42] font-bold text-xs uppercase tracking-wider shadow-lg hover:bg-gray-100 transition-colors"
                      >
                        About Oda Bultum University <ArrowRight className="w-4 h-4" />
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          </div>
        )}
      </main>
    </div>
  );
}
