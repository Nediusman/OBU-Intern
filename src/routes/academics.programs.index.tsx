import { createFileRoute, Link } from "@tanstack/react-router";
import { Breadcrumbs } from "@/frontend/components/Breadcrumbs";
import { getActivePrograms, type ProgramItem } from "@/backend/api";
import { GraduationCap, Search, Filter, Clock, ArrowRight } from "lucide-react";
import { useState, useMemo } from "react";

export const Route = createFileRoute("/academics/programs/")({
  component: ProgramsIndex,
  loader: async () => {
    const programs = await getActivePrograms();
    return { programs: programs ?? [] };
  },
});

function ProgramsIndex() {
  const { programs } = Route.useLoaderData();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDegree, setSelectedDegree] = useState<string>("all");

  // Dynamically derive distinct degree options from loaded data
  const availableDegrees = useMemo(() => {
    const set = new Set<string>();
    programs.forEach((p) => {
      if (p.degree && p.degree.trim().length > 0) {
        set.add(p.degree.trim());
      }
    });
    return Array.from(set).sort();
  }, [programs]);

  // Client-side filtering by search query and degree
  const filteredPrograms = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    return programs.filter((prog) => {
      const matchesSearch =
        !query ||
        prog.name.toLowerCase().includes(query) ||
        (prog.description && prog.description.toLowerCase().includes(query)) ||
        (prog.department_name && prog.department_name.toLowerCase().includes(query));

      const matchesDegree =
        selectedDegree === "all" ||
        (prog.degree && prog.degree.trim().toLowerCase() === selectedDegree.toLowerCase());

      return matchesSearch && matchesDegree;
    });
  }, [programs, searchQuery, selectedDegree]);

  const hasActiveFilters = searchQuery.trim() !== "" || selectedDegree !== "all";

  const clearFilters = () => {
    setSearchQuery("");
    setSelectedDegree("all");
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* Header with OBU emerald gradient */}
      <div className="obu-gradient py-12 sm:py-20 md:py-28 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        <div className="absolute inset-0 opacity-20 mix-blend-overlay pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-[600px] h-[600px] bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-white/10 to-transparent blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto relative z-10 text-center animate-fade-in-up">
          <span className="inline-block rounded-full bg-[#ffcc00] px-4 py-1.5 text-xs font-bold uppercase tracking-[0.2em] text-[#186a42] mb-4 shadow-lg">
            Academic Offerings
          </span>
          <h1 className="font-heading text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold text-white tracking-tight drop-shadow-md">
            Academic Programs
          </h1>
          <p className="mt-4 sm:mt-6 text-white/95 max-w-2xl mx-auto text-base sm:text-lg md:text-xl font-medium leading-relaxed drop-shadow-sm">
            Discover our diverse range of undergraduate and graduate degree programs designed to
            equip students with the skills, knowledge, and practical experience for future success.
          </p>
        </div>
      </div>

      {/* Main Content */}
      <main className="flex-grow container mx-auto px-3 sm:px-6 lg:px-8 py-8 sm:py-12 md:py-16 max-w-7xl">
        <div className="mb-6 sm:mb-10 animate-fade-in-up">
          <Breadcrumbs
            items={[{ label: "Academics", to: "/academics" }, { label: "Programs" }]}
          />
        </div>

        {/* Filter and Search Bar */}
        <div className="mb-8 sm:mb-12 bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-6 border border-gray-100 shadow-sm animate-fade-in-up">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4">
            {/* Search Input */}
            <div className="relative sm:col-span-2 md:col-span-2">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
              <input
                type="text"
                placeholder="Search programs by title, keyword, or department..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 sm:py-3 text-sm rounded-xl border border-gray-200 bg-gray-50/50 focus:bg-white focus:border-[#186a42] focus:ring-2 focus:ring-[#186a42]/10 outline-none transition-all placeholder:text-gray-400"
              />
            </div>

            {/* Dynamic Degree Filter Dropdown */}
            <div className="relative">
              <Filter className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
              <select
                value={selectedDegree}
                onChange={(e) => setSelectedDegree(e.target.value)}
                aria-label="Filter by Degree"
                className="w-full pl-10 pr-8 py-2.5 sm:py-3 text-sm rounded-xl border border-gray-200 bg-gray-50/50 focus:bg-white focus:border-[#186a42] focus:ring-2 focus:ring-[#186a42]/10 outline-none transition-all text-gray-700 appearance-none cursor-pointer"
              >
                <option value="all">All Degrees</option>
                {availableDegrees.map((deg) => (
                  <option key={deg} value={deg}>
                    {deg}
                  </option>
                ))}
              </select>
              <div className="absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400 text-xs">
                ▼
              </div>
            </div>
          </div>

          {/* Active Filter Count and Clear Trigger */}
          <div className="mt-4 pt-4 border-t border-gray-100 flex flex-wrap items-center justify-between gap-2 text-xs sm:text-sm text-gray-500">
            <span>
              Showing <strong className="text-gray-900">{filteredPrograms.length}</strong> of{" "}
              {programs.length} programs
            </span>
            {hasActiveFilters && (
              <button
                onClick={clearFilters}
                className="text-[#186a42] font-semibold hover:underline"
              >
                Clear all filters
              </button>
            )}
          </div>
        </div>

        {/* Empty State */}
        {filteredPrograms.length === 0 ? (
          <div className="text-center glass-panel rounded-3xl py-16 sm:py-24 px-4 sm:px-6 animate-fade-in-up">
            <GraduationCap className="mx-auto h-16 w-16 sm:h-20 sm:w-20 text-[#186a42]/20 mb-4 sm:mb-6" />
            <p className="font-heading text-xl sm:text-2xl font-bold text-gray-900">
              No programs found
            </p>
            <p className="text-gray-500 mt-2 sm:mt-3 text-base sm:text-lg max-w-md mx-auto">
              {hasActiveFilters
                ? "No academic programs match your current filter or search criteria. Try adjusting your keywords or clearing filters."
                : "Academic programs will be listed here once published."}
            </p>
            {hasActiveFilters && (
              <button
                onClick={clearFilters}
                className="mt-6 inline-flex items-center justify-center rounded-xl bg-[#186a42] px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-[#125333] transition-colors"
              >
                Clear all filters
              </button>
            )}
          </div>
        ) : (
          /* Programs Responsive Grid */
          <div className="grid gap-6 sm:gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            {filteredPrograms.map((program: ProgramItem, index: number) => (
              <Link
                key={program.id}
                to="/academics/programs/$slug"
                params={{ slug: program.slug }}
                className="group flex flex-col bg-white rounded-3xl overflow-hidden border border-gray-100/50 shadow-lg transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl hover:border-[#186a42]/30 animate-fade-in-up"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                {/* Program Card Header Image or Fallback */}
                {program.main_image_url ? (
                  <div className="relative aspect-[4/3] w-full overflow-hidden bg-gray-100">
                    <img
                      src={program.main_image_url}
                      alt={program.name}
                      className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-60 transition-opacity duration-500 group-hover:opacity-80" />
                  </div>
                ) : (
                  <div className="relative aspect-[4/3] w-full bg-[#186a42]/5 flex items-center justify-center border-b border-gray-100 overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-[#186a42]/5 to-[#ffcc00]/5" />
                    <GraduationCap className="h-16 w-16 sm:h-20 sm:w-20 text-[#186a42]/20 transition-transform duration-500 group-hover:scale-110 relative z-10" />
                  </div>
                )}

                {/* Card Body */}
                <div className="flex flex-col flex-grow p-5 sm:p-6 md:p-8 bg-white relative z-10">
                  {/* Badges: Degree & Department */}
                  <div className="flex flex-wrap items-center gap-2 mb-3 sm:mb-4">
                    {program.degree && (
                      <span className="inline-block rounded-full bg-[#ffcc00]/20 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.2em] text-[#186a42]">
                        {program.degree}
                      </span>
                    )}
                    {program.department_name && (
                      <span className="inline-block rounded-full bg-emerald-50 text-[#186a42] border border-emerald-200/60 px-3 py-1 text-[11px] font-bold uppercase tracking-wider line-clamp-1 max-w-full">
                        {program.department_name}
                      </span>
                    )}
                  </div>

                  {/* Program Title */}
                  <h2 className="font-heading text-xl sm:text-2xl font-bold text-gray-900 leading-tight mb-3 sm:mb-4 group-hover:text-[#186a42] transition-colors break-words">
                    {program.name}
                  </h2>

                  {/* Program Description */}
                  <p className="text-gray-600 text-sm sm:text-[15px] leading-relaxed mb-6 sm:mb-8 line-clamp-3 flex-grow">
                    {program.description ||
                      `Learn more about the curriculum, admission requirements, and career prospects for ${program.name}.`}
                  </p>

                  {/* Duration Tag & Footer Action */}
                  <div className="mt-auto pt-4 border-t border-gray-50 flex items-center justify-between font-bold text-[#186a42]">
                    {program.duration ? (
                      <span className="inline-flex items-center gap-1.5 text-xs text-gray-500 font-medium">
                        <Clock className="w-3.5 h-3.5 text-gray-400" />
                        {program.duration}
                      </span>
                    ) : (
                      <span />
                    )}

                    <div className="flex items-center gap-2">
                      <span className="uppercase tracking-wider text-xs sm:text-sm">
                        Explore Program
                      </span>
                      <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gray-50 flex items-center justify-center group-hover:bg-[#186a42] transition-colors duration-300 shrink-0">
                        <ArrowRight className="h-4 w-4 text-gray-400 group-hover:text-white transition-transform duration-300 group-hover:translate-x-1" />
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
