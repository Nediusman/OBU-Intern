import { createFileRoute, Link } from "@tanstack/react-router";
import { Breadcrumbs } from "@/frontend/components/Breadcrumbs";
import { supabase } from "@/frontend/lib/supabase";
import { Building2, Search, Filter, ChevronRight } from "lucide-react";
import { useState, useMemo } from "react";

export interface DepartmentListItem {
  id: string;
  slug: string | null;
  name: string;
  short_name: string | null;
  unit_type: string;
  description: string | null;
  parent_id: string | null;
  display_order: number;
  main_image_url: string | null;
  parent_name: string | null;
  parent_slug: string | null;
  parent_type: string | null;
}

export const Route = createFileRoute("/academics/departments/")({
  component: DepartmentsIndex,
  loader: async () => {
    // 1. Fetch active departments with parent college and media
    const { data: deptData, error: deptError } = await supabase
      .from("academic_units")
      .select(
        `
        id, slug, name, short_name, unit_type, description, parent_id, display_order,
        media:main_image_id(file_url),
        parent:parent_id(id, name, slug, unit_type)
      `,
      )
      .eq("status", "active")
      .in("unit_type", ["department", "Department"])
      .order("display_order");

    if (deptError) throw deptError;

    // 2. Fetch active colleges for filter list
    const { data: collegeData, error: collegeError } = await supabase
      .from("academic_units")
      .select("id, name, slug, unit_type")
      .eq("status", "active")
      .in("unit_type", ["college", "College", "faculty", "Faculty", "institute", "Institute"])
      .order("name");

    if (collegeError) throw collegeError;

    type RawDept = {
      id: string;
      slug: string | null;
      name: string;
      short_name: string | null;
      unit_type: string;
      description: string | null;
      parent_id: string | null;
      display_order: number;
      media: { file_url: string } | null;
      parent: { id: string; name: string; slug: string | null; unit_type: string } | null;
    };

    const departments: DepartmentListItem[] = ((deptData ?? []) as unknown as RawDept[]).map(
      (item) => ({
        id: item.id,
        slug: item.slug,
        name: item.name,
        short_name: item.short_name,
        unit_type: item.unit_type,
        description: item.description,
        parent_id: item.parent_id,
        display_order: item.display_order,
        main_image_url: item.media?.file_url ?? null,
        parent_name: item.parent?.name ?? null,
        parent_slug: item.parent?.slug ?? item.parent?.id ?? null,
        parent_type: item.parent?.unit_type ?? null,
      }),
    );

    return {
      departments,
      colleges: collegeData ?? [],
    };
  },
});

function DepartmentsIndex() {
  const { departments, colleges } = Route.useLoaderData();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCollege, setSelectedCollege] = useState<string>("all");

  const filteredDepartments = useMemo(() => {
    return departments.filter((dept) => {
      const matchesSearch =
        searchQuery.trim() === "" ||
        dept.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (dept.short_name && dept.short_name.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (dept.description && dept.description.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (dept.parent_name && dept.parent_name.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesCollege = selectedCollege === "all" || dept.parent_id === selectedCollege;

      return matchesSearch && matchesCollege;
    });
  }, [departments, searchQuery, selectedCollege]);

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* Hero Header */}
      <div className="obu-gradient py-12 sm:py-20 md:py-28 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        <div className="absolute inset-0 opacity-20 mix-blend-overlay pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-[600px] h-[600px] bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-white/10 to-transparent blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto relative z-10 text-center animate-fade-in-up">
          <span className="inline-block rounded-full bg-[#ffcc00] px-4 py-1.5 text-xs font-bold uppercase tracking-[0.2em] text-[#186a42] mb-4 shadow-lg">
            Academic Units
          </span>
          <h1 className="font-heading text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold text-white tracking-tight drop-shadow-md">
            Academic Departments
          </h1>
          <p className="mt-4 sm:mt-6 text-white/95 max-w-2xl mx-auto text-base sm:text-lg md:text-xl font-medium leading-relaxed drop-shadow-sm">
            Explore specialized academic departments fostering research innovation, hands-on
            learning, and community impact.
          </p>
        </div>
      </div>

      {/* Main Content */}
      <main className="flex-grow container mx-auto px-3 sm:px-6 lg:px-8 py-8 sm:py-12 md:py-16 max-w-7xl">
        <div className="mb-6 sm:mb-10 animate-fade-in-up">
          <Breadcrumbs
            items={[{ label: "Academics", to: "/academics" }, { label: "Departments" }]}
          />
        </div>

        {/* Filter / Search Bar */}
        <div className="mb-8 sm:mb-12 bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-6 border border-gray-100 shadow-sm animate-fade-in-up">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4">
            {/* Search Input */}
            <div className="relative sm:col-span-2 md:col-span-2">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
              <input
                type="text"
                placeholder="Search departments by name or keyword..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 sm:py-3 text-sm rounded-xl border border-gray-200 bg-gray-50/50 focus:bg-white focus:border-[#186a42] focus:ring-2 focus:ring-[#186a42]/10 outline-none transition-all placeholder:text-gray-400"
              />
            </div>

            {/* College Filter Dropdown */}
            <div className="relative">
              <Filter className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
              <select
                value={selectedCollege}
                onChange={(e) => setSelectedCollege(e.target.value)}
                aria-label="Filter by College / Faculty"
                className="w-full pl-10 pr-8 py-2.5 sm:py-3 text-sm rounded-xl border border-gray-200 bg-gray-50/50 focus:bg-white focus:border-[#186a42] focus:ring-2 focus:ring-[#186a42]/10 outline-none transition-all text-gray-700 appearance-none cursor-pointer"
              >
                <option value="all">All Colleges & Faculties</option>
                {colleges.map((col) => (
                  <option key={col.id} value={col.id}>
                    {col.name}
                  </option>
                ))}
              </select>
              <div className="absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400 text-xs">
                ▼
              </div>
            </div>
          </div>

          {/* Active Filter Count */}
          <div className="mt-4 pt-4 border-t border-gray-100 flex flex-wrap items-center justify-between gap-2 text-xs sm:text-sm text-gray-500">
            <span>
              Showing <strong className="text-gray-900">{filteredDepartments.length}</strong> of{" "}
              {departments.length} departments
            </span>
            {(searchQuery || selectedCollege !== "all") && (
              <button
                onClick={() => {
                  setSearchQuery("");
                  setSelectedCollege("all");
                }}
                className="text-[#186a42] font-semibold hover:underline"
              >
                Clear all filters
              </button>
            )}
          </div>
        </div>

        {/* Departments Grid */}
        {filteredDepartments.length === 0 ? (
          <div className="text-center glass-panel rounded-3xl py-16 sm:py-24 px-4 sm:px-6 animate-fade-in-up">
            <Building2 className="mx-auto h-16 w-16 sm:h-20 sm:w-20 text-[#186a42]/20 mb-4 sm:mb-6" />
            <p className="font-heading text-xl sm:text-2xl font-bold text-gray-900">
              No departments found
            </p>
            <p className="text-gray-500 mt-2 sm:mt-3 text-base sm:text-lg">
              {searchQuery || selectedCollege !== "all"
                ? "Try adjusting your search criteria or clearing filters."
                : "Departments will appear here once published."}
            </p>
          </div>
        ) : (
          <div className="grid gap-6 sm:gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            {filteredDepartments.map((dept, index) => (
              <Link
                key={dept.id}
                to="/academics/departments/$slug"
                params={{ slug: dept.slug ?? dept.id }}
                className="group flex flex-col bg-white rounded-3xl overflow-hidden border border-gray-100/50 shadow-lg transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl hover:border-[#186a42]/30 animate-fade-in-up"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                {/* Department Image or Fallback */}
                {dept.main_image_url ? (
                  <div className="relative aspect-[4/3] w-full overflow-hidden bg-gray-100">
                    <img
                      src={dept.main_image_url}
                      alt={dept.name}
                      className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-60 transition-opacity duration-500 group-hover:opacity-80" />
                  </div>
                ) : (
                  <div className="relative aspect-[4/3] w-full bg-[#186a42]/5 flex items-center justify-center border-b border-gray-100 overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-[#186a42]/5 to-[#ffcc00]/5" />
                    <Building2 className="h-16 w-16 sm:h-20 sm:w-20 text-[#186a42]/20 transition-transform duration-500 group-hover:scale-110 relative z-10" />
                  </div>
                )}

                <div className="flex flex-col flex-grow p-5 sm:p-6 md:p-8 bg-white relative z-10">
                  {/* Parent College Tag */}
                  {dept.parent_name && (
                    <div className="mb-3 sm:mb-4">
                      <span className="inline-block rounded-full bg-emerald-50 text-[#186a42] border border-emerald-200/60 px-3 py-1 text-[11px] font-bold uppercase tracking-wider line-clamp-1 max-w-full">
                        {dept.parent_name}
                      </span>
                    </div>
                  )}

                  {/* Department Name */}
                  <h2 className="font-heading text-xl sm:text-2xl font-bold text-gray-900 leading-tight mb-3 sm:mb-4 group-hover:text-[#186a42] transition-colors break-words">
                    {dept.name}
                  </h2>

                  {/* Description */}
                  <p className="text-gray-600 text-sm sm:text-[15px] leading-relaxed mb-6 sm:mb-8 line-clamp-3 flex-grow">
                    {dept.description ||
                      `Learn more about academic degree programs and research activities in the ${dept.name}.`}
                  </p>

                  {/* Card Action Footer */}
                  <div className="mt-auto flex items-center justify-between font-bold text-[#186a42] pt-2">
                    <span className="uppercase tracking-wider text-xs sm:text-sm">
                      View Department
                    </span>
                    <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gray-50 flex items-center justify-center group-hover:bg-[#186a42] transition-colors duration-300 shrink-0">
                      <ChevronRight className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400 group-hover:text-white transition-transform duration-300 group-hover:translate-x-1" />
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
