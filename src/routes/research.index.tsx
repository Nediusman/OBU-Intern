import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import {
  FlaskConical,
  Microscope,
  BookOpenCheck,
  Users,
  ArrowRight,
  Sparkles,
  Building2,
  FileText,
  Award,
  Globe2,
  ChevronRight,
  ExternalLink,
  CheckCircle2,
} from "lucide-react";
import { Breadcrumbs } from "@/frontend/components/Breadcrumbs";
import { getResearchCenters, getPublications, getSiteStats } from "@/backend/api";

const focusAreas = [
  {
    icon: FlaskConical,
    title: "Agricultural Innovation & Food Security",
    description:
      "Improving crop resilience, post-harvest technology, livestock genetics, and sustainable farming systems for communities across Eastern Ethiopia.",
    tag: "Priority Domain",
  },
  {
    icon: Microscope,
    title: "Climate Resilience & Ecosystem Science",
    description:
      "Investigating dryland ecology, watershed management, renewable energy adoption, and climate adaptation strategies.",
    tag: "Environmental",
  },
  {
    icon: BookOpenCheck,
    title: "Public Health & Community Medicine",
    description:
      "Advancing rural epidemiology, infectious disease prevention, maternal and child healthcare, and indigenous medicinal knowledge.",
    tag: "Health & Care",
  },
  {
    icon: Users,
    title: "Applied Technology & Social Development",
    description:
      "Harnessing digital technologies, data science, agricultural value chains, and socio-economic policy research for regional empowerment.",
    tag: "Technology",
  },
];

export const Route = createFileRoute("/research/")({
  component: ResearchIndex,
  head: () => ({
    meta: [
      { title: "Research & Innovation — Oda Bultum University" },
      {
        name: "description",
        content:
          "Explore cutting-edge research, scientific centers, publications, and community engagement at Oda Bultum University.",
      },
      { property: "og:title", content: "Research & Innovation — Oda Bultum University" },
      { property: "og:type", content: "website" },
    ],
  }),
});

function ResearchIndex() {
  const { data: centers = [] } = useQuery({
    queryKey: ["research-centers"],
    queryFn: () => getResearchCenters(),
  });
  const { data: publications = [] } = useQuery({
    queryKey: ["publications"],
    queryFn: () => getPublications(),
  });
  const { data: stats } = useQuery({
    queryKey: ["site-stats"],
    queryFn: () => getSiteStats(),
  });

  const liveStats = [
    { value: "34+", label: "Active Research Projects", icon: FlaskConical },
    {
      value: String(publications.length || "120") + "+",
      label: "Scientific Publications",
      icon: BookOpenCheck,
    },
    {
      value: String(centers.length || stats?.researchCenters || "8"),
      label: "Research Centers & Labs",
      icon: Building2,
    },
    { value: "18+", label: "Partner Institutions", icon: Globe2 },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* Page Hero */}
      <div className="obu-gradient py-20 md:py-28 px-4 sm:px-6 lg:px-8 relative overflow-hidden text-white">
        <div className="absolute inset-0 opacity-10 mix-blend-overlay pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white/15 to-transparent blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto relative z-10 animate-fade-in-up">
          <div className="inline-flex items-center gap-2 rounded-full bg-[#ffcc00] px-4 py-1.5 text-xs font-bold uppercase tracking-[0.2em] text-[#186a42] mb-5 shadow-lg">
            <Sparkles className="w-3.5 h-3.5" />
            Excellence in Discovery & Innovation
          </div>
          <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-tight">
            Research & Innovation
          </h1>
          <p className="mt-4 text-lg md:text-xl text-white/90 max-w-3xl font-medium leading-relaxed">
            Pioneering scientific discoveries, sustainable agricultural breakthroughs, and
            community-driven solutions to empower Eastern Ethiopia and contribute to global
            knowledge.
          </p>
        </div>
      </div>

      {/* Breadcrumb Bar */}
      <div className="bg-gray-50 border-b border-gray-100 py-4 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <Breadcrumbs items={[{ label: "Research & Innovation" }]} />
        </div>
      </div>

      <main className="flex-grow">
        {/* ─── LIVE STATS RIBBON ─── */}
        <section className="bg-gray-50/80 border-b border-gray-100 py-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
              {liveStats.map((s) => {
                const Icon = s.icon;
                return (
                  <div
                    key={s.label}
                    className="bg-white rounded-2xl p-6 border border-gray-200/80 shadow-sm hover:shadow-md transition-all flex items-center gap-4"
                  >
                    <div className="w-12 h-12 rounded-xl bg-[#186a42]/10 text-[#186a42] flex items-center justify-center shrink-0">
                      <Icon className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="font-heading text-2xl sm:text-3xl font-extrabold text-[#186a42] leading-none">
                        {s.value}
                      </p>
                      <p className="text-xs font-bold text-gray-500 mt-1 uppercase tracking-wider">
                        {s.label}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-24">
          {/* ─── RESEARCH QUICK PORTALS (3D INTERACTIVE CARDS) ─── */}
          <section className="space-y-8">
            <div className="flex items-center gap-3">
              <span className="font-mono text-xs font-bold text-[#186a42] uppercase tracking-[0.25em] bg-[#186a42]/10 px-3 py-1 rounded-full">
                01 / Portals
              </span>
              <h2 className="font-heading text-3xl font-extrabold text-gray-900 tracking-tight">
                Research Portals & Directories
              </h2>
              <div className="h-px bg-gray-200 flex-1 ml-2" />
            </div>

            <div className="grid gap-8 sm:grid-cols-3">
              {/* Projects Card */}
              <Link
                to="/research/projects"
                className="group bg-white rounded-3xl p-8 border border-gray-100 shadow-lg hover:shadow-2xl hover:border-[#186a42]/30 card-3d-interactive flex flex-col justify-between relative overflow-hidden"
              >
                <div className="absolute top-0 left-0 w-full h-1.5 obu-gradient" />
                <div>
                  <div className="w-14 h-14 rounded-2xl bg-[#186a42]/10 text-[#186a42] group-hover:bg-[#186a42] group-hover:text-white flex items-center justify-center transition-colors duration-500 mb-6 shadow-sm">
                    <FlaskConical className="w-7 h-7" />
                  </div>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-[#186a42] bg-[#186a42]/10 px-2.5 py-0.5 rounded-full inline-block mb-3">
                    Active & Completed
                  </span>
                  <h3 className="font-heading text-2xl font-bold text-gray-900 group-hover:text-[#186a42] transition-colors leading-tight mb-2">
                    Research Projects
                  </h3>
                  <p className="text-gray-600 text-sm leading-relaxed font-normal">
                    Explore peer-reviewed scientific studies, grant-funded agricultural innovations,
                    and technical research investigations.
                  </p>
                </div>

                <div className="mt-8 pt-4 border-t border-gray-100 flex items-center justify-between text-xs font-bold uppercase tracking-wider text-[#186a42] group-hover:translate-x-1 transition-transform">
                  <span>View All Projects</span>
                  <ArrowRight className="w-4 h-4" />
                </div>
              </Link>

              {/* Community Engagement Card */}
              <Link
                to="/research/community-engagement"
                className="group bg-white rounded-3xl p-8 border border-gray-100 shadow-lg hover:shadow-2xl hover:border-[#186a42]/30 card-3d-interactive flex flex-col justify-between relative overflow-hidden"
              >
                <div className="absolute top-0 left-0 w-full h-1.5 bg-[#ffcc00]" />
                <div>
                  <div className="w-14 h-14 rounded-2xl bg-[#ffcc00]/20 text-[#186a42] group-hover:bg-[#186a42] group-hover:text-[#ffcc00] flex items-center justify-center transition-colors duration-500 mb-6 shadow-sm">
                    <Users className="w-7 h-7" />
                  </div>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-[#186a42] bg-[#ffcc00]/20 px-2.5 py-0.5 rounded-full inline-block mb-3">
                    Social Impact
                  </span>
                  <h3 className="font-heading text-2xl font-bold text-gray-900 group-hover:text-[#186a42] transition-colors leading-tight mb-2">
                    Community Engagement
                  </h3>
                  <p className="text-gray-600 text-sm leading-relaxed font-normal">
                    Discover university extension programs, technology transfers, health outreach
                    camps, and community capacity-building.
                  </p>
                </div>

                <div className="mt-8 pt-4 border-t border-gray-100 flex items-center justify-between text-xs font-bold uppercase tracking-wider text-[#186a42] group-hover:translate-x-1 transition-transform">
                  <span>View Community Work</span>
                  <ArrowRight className="w-4 h-4" />
                </div>
              </Link>

              {/* Research Facilities Card */}
              <Link
                to="/research/facilities"
                className="group bg-white rounded-3xl p-8 border border-gray-100 shadow-lg hover:shadow-2xl hover:border-[#186a42]/30 card-3d-interactive flex flex-col justify-between relative overflow-hidden"
              >
                <div className="absolute top-0 left-0 w-full h-1.5 obu-gradient" />
                <div>
                  <div className="w-14 h-14 rounded-2xl bg-[#186a42]/10 text-[#186a42] group-hover:bg-[#186a42] group-hover:text-white flex items-center justify-center transition-colors duration-500 mb-6 shadow-sm">
                    <Building2 className="w-7 h-7" />
                  </div>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-[#186a42] bg-[#186a42]/10 px-2.5 py-0.5 rounded-full inline-block mb-3">
                    Infrastructure & Labs
                  </span>
                  <h3 className="font-heading text-2xl font-bold text-gray-900 group-hover:text-[#186a42] transition-colors leading-tight mb-2">
                    Research Facilities
                  </h3>
                  <p className="text-gray-600 text-sm leading-relaxed font-normal">
                    Tour our state-of-the-art analytical laboratories, experimental test farms,
                    high-performance computing centers, and field stations.
                  </p>
                </div>

                <div className="mt-8 pt-4 border-t border-gray-100 flex items-center justify-between text-xs font-bold uppercase tracking-wider text-[#186a42] group-hover:translate-x-1 transition-transform">
                  <span>Explore Facilities</span>
                  <ArrowRight className="w-4 h-4" />
                </div>
              </Link>
            </div>
          </section>

          {/* ─── RESEARCH FOCUS PILLARS ─── */}
          <section className="space-y-8">
            <div className="flex items-center gap-3">
              <span className="font-mono text-xs font-bold text-[#186a42] uppercase tracking-[0.25em] bg-[#186a42]/10 px-3 py-1 rounded-full">
                02 / Strategic Themes
              </span>
              <h2 className="font-heading text-3xl font-extrabold text-gray-900 tracking-tight">
                Interdisciplinary Research Pillars
              </h2>
              <div className="h-px bg-gray-200 flex-1 ml-2" />
            </div>

            <div className="grid gap-8 md:grid-cols-2">
              {focusAreas.map((area) => {
                const Icon = area.icon;
                return (
                  <div
                    key={area.title}
                    className="bg-white rounded-3xl p-8 border border-gray-100 shadow-md hover:shadow-xl hover:border-[#186a42]/30 card-3d-interactive transition-all flex flex-col justify-between relative overflow-hidden"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-5">
                        <div className="w-12 h-12 rounded-2xl bg-[#186a42]/10 text-[#186a42] flex items-center justify-center shadow-sm">
                          <Icon className="w-6 h-6" />
                        </div>
                        <span className="text-[11px] font-bold uppercase tracking-wider bg-gray-100 text-gray-700 px-3 py-1 rounded-full">
                          {area.tag}
                        </span>
                      </div>

                      <h3 className="font-heading text-2xl font-bold text-gray-900 mb-3 leading-snug">
                        {area.title}
                      </h3>
                      <p className="text-gray-600 text-sm leading-relaxed font-normal">
                        {area.description}
                      </p>
                    </div>

                    <div className="pt-6 mt-6 border-t border-gray-100 flex items-center gap-2 text-xs font-bold text-[#186a42]">
                      <CheckCircle2 className="w-4 h-4 text-[#186a42]" />
                      <span>Dedicated Academic Faculty & Grants</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>

          {/* ─── RESEARCH CENTERS (FROM DB) ─── */}
          {centers.length > 0 && (
            <section className="space-y-8">
              <div className="flex items-center gap-3">
                <span className="font-mono text-xs font-bold text-[#186a42] uppercase tracking-[0.25em] bg-[#186a42]/10 px-3 py-1 rounded-full">
                  03 / Institutes
                </span>
                <h2 className="font-heading text-3xl font-extrabold text-gray-900 tracking-tight">
                  Research Centers & Specialized Institutes
                </h2>
                <div className="h-px bg-gray-200 flex-1 ml-2" />
              </div>

              <div className="grid gap-6 md:grid-cols-3">
                {centers.map((c) => (
                  <div
                    key={c.id}
                    className="bg-white rounded-3xl p-7 border border-gray-100 shadow-md hover:shadow-xl hover:border-[#186a42]/30 card-3d-interactive transition-all flex flex-col justify-between"
                  >
                    <div>
                      {c.projects !== undefined && (
                        <span className="text-[10px] font-black uppercase tracking-wider bg-[#186a42]/10 text-[#186a42] px-3 py-1 rounded-full inline-block mb-3">
                          {c.projects} Active Initiatives
                        </span>
                      )}
                      <h3 className="font-heading text-xl font-bold text-gray-900 leading-snug mb-2">
                        {c.name}
                      </h3>
                      {c.description && (
                        <p className="text-gray-600 text-xs sm:text-sm leading-relaxed line-clamp-3 mb-4">
                          {c.description}
                        </p>
                      )}
                    </div>

                    {c.director && (
                      <div className="pt-4 border-t border-gray-100 text-xs text-gray-500">
                        Director: <strong className="text-gray-900">{c.director}</strong>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* ─── PUBLICATIONS SHOWCASE (FROM DB) ─── */}
          {publications.length > 0 && (
            <section className="space-y-8">
              <div className="flex items-center gap-3">
                <span className="font-mono text-xs font-bold text-[#186a42] uppercase tracking-[0.25em] bg-[#186a42]/10 px-3 py-1 rounded-full">
                  04 / Scholarly Output
                </span>
                <h2 className="font-heading text-3xl font-extrabold text-gray-900 tracking-tight">
                  Recent Scientific Publications
                </h2>
                <div className="h-px bg-gray-200 flex-1 ml-2" />
              </div>

              <div className="bg-white rounded-3xl border border-gray-100 shadow-xl divide-y divide-gray-100 overflow-hidden">
                {publications.map((p) => (
                  <div
                    key={p.id}
                    className="p-6 sm:p-8 hover:bg-gray-50/70 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-6"
                  >
                    <div className="space-y-2 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        {p.category && (
                          <span className="text-[10px] font-bold uppercase tracking-wider bg-[#ffcc00]/20 text-[#186a42] px-2.5 py-0.5 rounded-full">
                            {p.category}
                          </span>
                        )}
                        {p.journal && (
                          <span className="text-xs font-semibold text-gray-500">
                            {p.journal} {p.publicationDate ? `(${p.publicationDate})` : ""}
                          </span>
                        )}
                      </div>

                      <h4 className="font-heading text-lg font-bold text-gray-900 leading-snug">
                        {p.title}
                      </h4>

                      {p.authors && (
                        <p className="text-xs text-gray-500 font-medium">Authors: {p.authors}</p>
                      )}
                    </div>

                    {p.doi && (
                      <a
                        href={`https://doi.org/${p.doi}`}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gray-100 hover:bg-[#186a42] text-gray-700 hover:text-white font-bold text-xs uppercase tracking-wider transition-colors shrink-0"
                      >
                        View DOI <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    )}
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* ─── INSTITUTIONAL RESEARCH MANDATE BANNER ─── */}
          <section className="obu-gradient rounded-3xl p-8 sm:p-14 text-white relative overflow-hidden shadow-2xl">
            <div className="absolute inset-0 opacity-10 mix-blend-overlay bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]" />
            <div className="relative z-10 max-w-3xl space-y-4">
              <span className="inline-block px-3 py-1 rounded-full bg-white/20 backdrop-blur-sm text-xs font-bold uppercase tracking-widest text-[#ffcc00]">
                Institutional Research Directorate
              </span>
              <h3 className="font-heading text-2xl sm:text-4xl font-extrabold tracking-tight leading-tight">
                Partner with Oda Bultum University for Groundbreaking Discovery
              </h3>
              <p className="text-white/85 text-sm sm:text-base leading-relaxed font-medium">
                We invite international academic partners, non-governmental organizations,
                governmental ministries, and industry innovators to collaborate with our
                multidisciplinary research teams.
              </p>
              <div className="pt-4 flex flex-wrap gap-4">
                <Link
                  to="/contact"
                  className="inline-flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-white text-[#186a42] font-bold text-xs uppercase tracking-wider shadow-lg hover:bg-gray-100 transition-colors"
                >
                  Initiate Research Partnership <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  to="/research/projects"
                  className="inline-flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs uppercase tracking-wider border border-white/20 transition-colors"
                >
                  Browse Current Projects
                </Link>
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
