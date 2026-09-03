import { createFileRoute } from "@tanstack/react-router";
import {
  Briefcase,
  CalendarDays,
  Building2,
  FileText,
  Wallet,
  Clock,
  Search,
  ChevronDown,
  ChevronUp,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  Send,
} from "lucide-react";
import { Breadcrumbs } from "@/frontend/components/Breadcrumbs";
import { EmptyState } from "@/frontend/components/EmptyState";
import { getVacancies } from "@/backend/api";
import { useState, useMemo } from "react";

export const Route = createFileRoute("/careers")({
  head: () => ({
    meta: [
      { title: "Careers & Vacancies — Oda Bultum University" },
      {
        name: "description",
        content:
          "Explore current academic, research, administrative, and clinical career opportunities at Oda Bultum University.",
      },
    ],
  }),
  component: Careers,
  loader: async () => {
    const vacancies = await getVacancies();
    return { vacancies };
  },
});

function Careers() {
  const { vacancies } = Route.useLoaderData();
  const [search, setSearch] = useState("");
  const [expandedJobs, setExpandedJobs] = useState<Record<string, boolean>>({});

  const toggleExpand = (id: string) => {
    setExpandedJobs((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const filteredVacancies = useMemo(() => {
    return vacancies.filter((job) => {
      const q = search.toLowerCase();
      return (
        search === "" ||
        job.job_title?.toLowerCase().includes(q) ||
        job.department?.toLowerCase().includes(q) ||
        job.vacancy_code?.toLowerCase().includes(q) ||
        job.position_type?.toLowerCase().includes(q) ||
        job.description?.toLowerCase().includes(q)
      );
    });
  }, [vacancies, search]);

  return (
    <div className="flex min-h-screen flex-col bg-white">
      {/* Page Hero */}
      <div className="obu-gradient py-20 md:py-28 px-4 sm:px-6 lg:px-8 relative overflow-hidden text-white">
        <div className="absolute inset-0 opacity-10 mix-blend-overlay pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white/15 to-transparent blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto relative z-10 animate-fade-in-up">
          <div className="inline-flex items-center gap-2 rounded-full bg-[#ffcc00] px-4 py-1.5 text-xs font-bold uppercase tracking-[0.2em] text-[#186a42] mb-5 shadow-lg">
            <Briefcase className="w-3.5 h-3.5" />
            University Recruitment Portal
          </div>
          <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-tight">
            Careers & Opportunities
          </h1>
          <p className="mt-4 text-lg md:text-xl text-white/90 max-w-3xl font-medium leading-relaxed">
            Join Oda Bultum University's academic, research, healthcare, and administrative
            community. Explore open positions and career paths.
          </p>
        </div>
      </div>

      {/* Breadcrumb Bar */}
      <div className="bg-gray-50 border-b border-gray-100 py-4 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <Breadcrumbs items={[{ label: "Careers & Vacancies" }]} />
        </div>
      </div>

      <main className="container mx-auto max-w-5xl flex-1 px-4 sm:px-6 lg:px-8 py-12 md:py-16 space-y-10">
        {/* Search Bar */}
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-gray-50/80 p-6 rounded-3xl border border-gray-100">
          <div className="relative w-full md:max-w-md">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search positions by title, department, code..."
              className="w-full pl-12 pr-4 py-3.5 rounded-2xl bg-white border border-gray-200 text-sm font-medium text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#186a42] focus:border-transparent shadow-sm transition-all"
            />
          </div>

          <div className="text-xs font-bold uppercase tracking-widest text-gray-500 self-start md:self-center">
            Showing <strong className="text-[#186a42]">{filteredVacancies.length}</strong> Open
            Positions
          </div>
        </div>

        {/* Vacancy Directory */}
        {filteredVacancies.length === 0 ? (
          <div className="bg-white border border-gray-100 rounded-3xl p-16 text-center shadow-sm max-w-2xl mx-auto">
            <Briefcase className="mx-auto h-20 w-20 text-gray-300 mb-4" />
            <h2 className="font-heading text-2xl font-bold text-gray-900 mb-2">
              No Open Vacancies
            </h2>
            <p className="text-gray-500 font-medium">
              {search
                ? "No vacancies match your search query. Try clearing your search."
                : "There are currently no public vacancies with an active application period."}
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
          <div className="space-y-6">
            {filteredVacancies.map((job) => {
              const isExpanded = !!expandedJobs[job.id];
              const formattedDeadline = job.application_deadline
                ? new Date(job.application_deadline).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })
                : null;

              return (
                <article
                  key={job.id}
                  className="group bg-white rounded-3xl border border-gray-100 shadow-md hover:shadow-2xl hover:border-[#186a42]/30 card-3d-interactive overflow-hidden transition-all duration-300 relative"
                >
                  <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-[#186a42] via-[#ffcc00] to-[#186a42] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                  <div className="p-8 space-y-6">
                    {/* Header Strip */}
                    <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                      <div className="space-y-2 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          {job.vacancy_code && (
                            <span className="px-3 py-1 rounded-full text-[10px] font-mono font-bold uppercase bg-gray-100 text-gray-700">
                              Ref: {job.vacancy_code}
                            </span>
                          )}
                          {job.position_type && (
                            <span className="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-[#186a42]/10 text-[#186a42]">
                              {job.position_type}
                            </span>
                          )}
                          {job.department && (
                            <span className="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-blue-50 text-blue-700">
                              {job.department}
                            </span>
                          )}
                        </div>

                        <h2 className="font-heading text-2xl sm:text-3xl font-bold text-gray-900 group-hover:text-[#186a42] transition-colors leading-tight pt-1">
                          {job.job_title}
                        </h2>
                      </div>

                      {/* Deadline Tag */}
                      {formattedDeadline && (
                        <div className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-amber-50 text-amber-900 border border-amber-200/80 font-bold text-xs shrink-0 self-start">
                          <CalendarDays className="w-4 h-4 text-amber-700 shrink-0" />
                          <span>Deadline: {formattedDeadline}</span>
                        </div>
                      )}
                    </div>

                    {/* Metadata Strip */}
                    <div className="flex flex-wrap items-center gap-4 text-xs text-gray-600 bg-gray-50/80 p-4 rounded-2xl border border-gray-100">
                      {job.department && (
                        <div className="flex items-center gap-1.5">
                          <Building2 className="w-4 h-4 text-[#186a42]" />
                          <span>{job.department}</span>
                        </div>
                      )}
                      {job.salary_information && (
                        <div className="flex items-center gap-1.5">
                          <Wallet className="w-4 h-4 text-[#186a42]" />
                          <span>Salary: {job.salary_information}</span>
                        </div>
                      )}
                      <div className="flex items-center gap-1.5">
                        <CheckCircle2 className="w-4 h-4 text-[#186a42]" />
                        <span>Status: Active Recruitment</span>
                      </div>
                    </div>

                    {/* Summary Description */}
                    {job.description && (
                      <p className="text-gray-700 text-sm leading-relaxed whitespace-pre-wrap font-normal">
                        {job.description}
                      </p>
                    )}

                    {/* Expandable Full Sections */}
                    {isExpanded && (
                      <div className="space-y-6 pt-4 border-t border-gray-100 animate-fade-in-up">
                        {job.requirements && (
                          <div className="space-y-2">
                            <h3 className="text-xs font-bold uppercase tracking-wider text-[#186a42] flex items-center gap-1.5">
                              <Sparkles className="w-4 h-4 text-[#ffcc00]" />
                              Position Requirements
                            </h3>
                            <div className="bg-gray-50 p-5 rounded-2xl text-xs sm:text-sm text-gray-700 leading-relaxed whitespace-pre-wrap border border-gray-100">
                              {job.requirements}
                            </div>
                          </div>
                        )}

                        {job.responsibilities && (
                          <div className="space-y-2">
                            <h3 className="text-xs font-bold uppercase tracking-wider text-[#186a42] flex items-center gap-1.5">
                              <FileText className="w-4 h-4 text-[#ffcc00]" />
                              Key Responsibilities & Duties
                            </h3>
                            <div className="bg-gray-50 p-5 rounded-2xl text-xs sm:text-sm text-gray-700 leading-relaxed whitespace-pre-wrap border border-gray-100">
                              {job.responsibilities}
                            </div>
                          </div>
                        )}

                        {job.application_instructions && (
                          <div className="space-y-2">
                            <h3 className="text-xs font-bold uppercase tracking-wider text-[#186a42] flex items-center gap-1.5">
                              <Send className="w-4 h-4 text-[#ffcc00]" />
                              Application Procedures
                            </h3>
                            <div className="bg-[#186a42]/5 border border-[#186a42]/20 p-5 rounded-2xl text-xs sm:text-sm text-gray-800 leading-relaxed whitespace-pre-wrap">
                              {job.application_instructions}
                            </div>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Toggle Action */}
                    <div className="pt-2 flex justify-between items-center">
                      <button
                        onClick={() => toggleExpand(job.id)}
                        className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#186a42] hover:text-[#125333] transition-colors"
                      >
                        <span>
                          {isExpanded ? "Show Less Details" : "View Full Position Details"}
                        </span>
                        {isExpanded ? (
                          <ChevronUp className="w-4 h-4" />
                        ) : (
                          <ChevronDown className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}
