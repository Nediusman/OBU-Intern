import { createFileRoute, notFound, Link } from "@tanstack/react-router";
import { Breadcrumbs } from "@/frontend/components/Breadcrumbs";
import { getResearchProjectBySlug } from "@/backend/api";
import {
  FileText,
  Download,
  Calendar,
  DollarSign,
  Building2,
  User,
  FlaskConical,
  ArrowLeft,
  Award,
  ShieldCheck,
  CheckCircle2,
  Mail,
  Sparkles,
} from "lucide-react";

export const Route = createFileRoute("/research/projects/$slug")({
  head: () => ({
    meta: [
      { title: "Research Project Details — Oda Bultum University" },
      {
        name: "description",
        content:
          "Read detailed project objectives, methodology, publications, and findings from Oda Bultum University research teams.",
      },
    ],
  }),
  loader: async ({ params }) => {
    const project = await getResearchProjectBySlug({ data: params.slug });
    if (!project) throw notFound();
    return project;
  },
  component: ResearchProjectDetail,
});

function getStatusBadge(status?: string) {
  const s = (status || "active").toLowerCase();
  if (s === "completed") {
    return "bg-blue-50 text-blue-700 border-blue-200/80";
  }
  if (s === "ongoing" || s === "in_progress") {
    return "bg-amber-50 text-amber-700 border-amber-200/80";
  }
  return "bg-emerald-50 text-emerald-700 border-emerald-200/80";
}

function ResearchProjectDetail() {
  const project = Route.useLoaderData();

  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* Cover Hero */}
      <div className="relative obu-gradient py-20 md:py-28 px-4 sm:px-6 lg:px-8 text-white overflow-hidden">
        {project.image ? (
          <>
            <img
              src={project.image}
              alt={project.project_title}
              className="absolute inset-0 h-full w-full object-cover opacity-20 mix-blend-overlay"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#186a42] via-[#186a42]/80 to-transparent pointer-events-none" />
          </>
        ) : (
          <div className="absolute inset-0 opacity-10 mix-blend-overlay pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]" />
        )}

        <div className="max-w-7xl mx-auto relative z-10 animate-fade-in-up space-y-4">
          <Link
            to="/research/projects"
            className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#ffcc00] hover:underline mb-2"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Research Projects
          </Link>

          <div className="flex flex-wrap items-center gap-3">
            {project.category && (
              <span className="px-3 py-1 bg-[#ffcc00] text-[#186a42] text-xs font-black uppercase tracking-wider rounded-full shadow">
                {project.category}
              </span>
            )}
            <span
              className={`px-3 py-1 text-xs font-bold uppercase tracking-wider rounded-full border bg-white/20 text-white backdrop-blur-sm`}
            >
              {project.status || "Active Project"}
            </span>
            {project.project_code && (
              <span className="text-xs text-white/75 font-mono">Ref: {project.project_code}</span>
            )}
          </div>

          <h1 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-tight max-w-4xl">
            {project.project_title}
          </h1>
        </div>
      </div>

      {/* Breadcrumb Bar */}
      <div className="bg-gray-50 border-b border-gray-100 py-4 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <Breadcrumbs
            items={[
              { label: "Research", to: "/research" },
              { label: "Research Projects", to: "/research/projects" },
              { label: project.project_title },
            ]}
          />
        </div>
      </div>

      <main className="flex-grow">
        <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 md:py-16">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            {/* ─── MAIN COLUMN (8 COLS) ─── */}
            <div className="lg:col-span-8 space-y-12">
              {/* Project Image Banner if available */}
              {project.image && (
                <div className="rounded-3xl overflow-hidden shadow-xl border border-gray-100 bg-gray-100 aspect-video w-full">
                  <img
                    src={project.image}
                    alt={project.project_title}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}

              {/* About the Project / Description */}
              {(project.short_description || project.full_description) && (
                <section className="bg-white rounded-3xl p-8 sm:p-10 border border-gray-100 shadow-lg space-y-6">
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-xs font-bold text-[#186a42] uppercase tracking-[0.25em] bg-[#186a42]/10 px-3 py-1 rounded-full">
                      Overview
                    </span>
                    <h2 className="font-heading text-2xl font-extrabold text-gray-900 tracking-tight">
                      About the Project & Objectives
                    </h2>
                  </div>

                  <div className="prose prose-lg max-w-none text-gray-700 font-normal leading-relaxed whitespace-pre-wrap">
                    {project.short_description || project.full_description}
                  </div>
                </section>
              )}

              {/* Project Documents / Publications if available */}
              {project.documents &&
                Array.isArray(project.documents) &&
                project.documents.length > 0 && (
                  <section className="bg-white rounded-3xl p-8 sm:p-10 border border-gray-100 shadow-lg space-y-6">
                    <div className="flex items-center gap-3">
                      <span className="font-mono text-xs font-bold text-[#186a42] uppercase tracking-[0.25em] bg-[#186a42]/10 px-3 py-1 rounded-full">
                        Resources
                      </span>
                      <h2 className="font-heading text-2xl font-extrabold text-gray-900 tracking-tight">
                        Publications & Project Documents
                      </h2>
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2">
                      {project.documents.map((doc: Record<string, unknown>, idx: number) => {
                        const name = String(
                          doc["original_name"] || doc["file_name"] || "Project Document",
                        );
                        const url = doc["file_url"] ? String(doc["file_url"]) : null;

                        return (
                          <div
                            key={idx}
                            className="bg-gray-50/80 hover:bg-white rounded-2xl p-5 border border-gray-200/80 hover:border-[#186a42]/30 shadow-sm hover:shadow-md card-3d-interactive flex items-center justify-between gap-4"
                          >
                            <div className="flex items-center gap-3.5 min-w-0">
                              <div className="w-10 h-10 rounded-xl bg-[#186a42]/10 text-[#186a42] flex items-center justify-center shrink-0">
                                <FileText className="w-5 h-5" />
                              </div>
                              <div className="min-w-0">
                                <span
                                  className="font-heading font-bold text-gray-900 text-sm truncate block"
                                  title={name}
                                >
                                  {name}
                                </span>
                                <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">
                                  Official File
                                </span>
                              </div>
                            </div>

                            {url && (
                              <a
                                href={url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="p-2.5 rounded-xl bg-[#186a42] hover:bg-[#125333] text-white shadow-md transition-colors shrink-0"
                                title="Download Document"
                              >
                                <Download className="w-4 h-4" />
                              </a>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </section>
                )}

              {/* Research Methodology & Ethical Standards */}
              <section className="bg-gray-50 rounded-3xl p-8 sm:p-10 border border-gray-200/70 space-y-4">
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#186a42]">
                  <ShieldCheck className="w-4 h-4 text-[#ffcc00]" />
                  Institutional Ethics & Senate Oversight
                </div>
                <h3 className="font-heading text-xl font-bold text-gray-900">
                  Academic Rigor & Community-Centric Impact
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed font-normal">
                  This investigation operates under the oversight of Oda Bultum University’s
                  Academic Senate and the Directorate of Research and Technology Transfer, adhering
                  to national research ethics guidelines and sustainable development priorities.
                </p>
              </section>
            </div>

            {/* ─── STICKY SIDEBAR (4 COLS) ─── */}
            <div className="lg:col-span-4 space-y-8 sticky top-28">
              {/* Project Metadata Card */}
              <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-xl space-y-6">
                <div className="flex items-center justify-between border-b border-gray-100 pb-4">
                  <h3 className="font-heading text-xl font-bold text-gray-900">Project Details</h3>
                  <span
                    className={`px-3 py-1 text-xs font-bold uppercase tracking-wider rounded-full border ${getStatusBadge(project.status)}`}
                  >
                    {project.status || "Active"}
                  </span>
                </div>

                <dl className="space-y-4 text-sm">
                  {project.principal_researcher && (
                    <div className="bg-gray-50/80 p-4 rounded-2xl border border-gray-100">
                      <dt className="text-xs font-bold uppercase tracking-wider text-gray-400 flex items-center gap-1.5 mb-1">
                        <User className="w-3.5 h-3.5 text-[#186a42]" />
                        Principal Investigator
                      </dt>
                      <dd className="font-bold text-gray-900 text-base">
                        {project.principal_researcher}
                      </dd>
                    </div>
                  )}

                  {project.department && (
                    <div className="bg-gray-50/80 p-4 rounded-2xl border border-gray-100">
                      <dt className="text-xs font-bold uppercase tracking-wider text-gray-400 flex items-center gap-1.5 mb-1">
                        <Building2 className="w-3.5 h-3.5 text-[#186a42]" />
                        Academic Department
                      </dt>
                      <dd className="font-bold text-gray-900">{project.department}</dd>
                    </div>
                  )}

                  {project.funding_source && (
                    <div className="bg-gray-50/80 p-4 rounded-2xl border border-gray-100">
                      <dt className="text-xs font-bold uppercase tracking-wider text-gray-400 flex items-center gap-1.5 mb-1">
                        <Award className="w-3.5 h-3.5 text-[#186a42]" />
                        Funding Sponsor
                      </dt>
                      <dd className="font-bold text-gray-900">{project.funding_source}</dd>
                    </div>
                  )}

                  {(project.start_date || project.end_date) && (
                    <div className="bg-gray-50/80 p-4 rounded-2xl border border-gray-100">
                      <dt className="text-xs font-bold uppercase tracking-wider text-gray-400 flex items-center gap-1.5 mb-1">
                        <Calendar className="w-3.5 h-3.5 text-[#186a42]" />
                        Project Timeline
                      </dt>
                      <dd className="font-semibold text-gray-900">
                        {project.start_date
                          ? new Date(project.start_date).toLocaleDateString()
                          : "Ongoing"}
                        {" — "}
                        {project.end_date
                          ? new Date(project.end_date).toLocaleDateString()
                          : "Present"}
                      </dd>
                    </div>
                  )}

                  {project.budget && (
                    <div className="bg-gray-50/80 p-4 rounded-2xl border border-gray-100">
                      <dt className="text-xs font-bold uppercase tracking-wider text-gray-400 flex items-center gap-1.5 mb-1">
                        <DollarSign className="w-3.5 h-3.5 text-[#186a42]" />
                        Allocated Budget
                      </dt>
                      <dd className="font-bold text-[#186a42]">{project.budget} ETB</dd>
                    </div>
                  )}
                </dl>
              </div>

              {/* Research Contact Action Card */}
              <div className="obu-gradient rounded-3xl p-8 text-white relative overflow-hidden shadow-xl space-y-4">
                <div className="relative z-10 space-y-3">
                  <span className="text-xs font-bold uppercase tracking-widest text-[#ffcc00] block">
                    Inquire About This Research
                  </span>
                  <h4 className="font-heading text-xl font-bold">
                    Collaborate with the Research Team
                  </h4>
                  <p className="text-white/80 text-xs sm:text-sm leading-relaxed">
                    Interested in citing this work, requesting dataset access, or proposing an
                    extension partnership?
                  </p>
                  <div className="pt-2">
                    <Link
                      to="/contact"
                      className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-white text-[#186a42] font-bold text-xs uppercase tracking-wider shadow-md hover:bg-gray-100 transition-colors"
                    >
                      Contact Research Office
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
