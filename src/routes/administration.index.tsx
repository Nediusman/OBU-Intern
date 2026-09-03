import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Building2,
  Search,
  ChevronRight,
  Landmark,
  Layers,
  MapPin,
  Mail,
  Phone,
  User,
  ShieldCheck,
  HelpCircle,
  ArrowRight,
} from "lucide-react";
import { Breadcrumbs } from "@/frontend/components/Breadcrumbs";
import { getAdministrativeOffices } from "@/backend/api";
import { useState, useMemo } from "react";

export const Route = createFileRoute("/administration/")({
  head: () => ({
    meta: [
      { title: "Administrative Offices — Oda Bultum University" },
      {
        name: "description",
        content:
          "Explore the administrative offices, directorates, and divisions supporting Oda Bultum University.",
      },
    ],
  }),
  component: AdministrationIndex,
  loader: async () => {
    const offices = await getAdministrativeOffices();
    return { offices: offices || [] };
  },
});

function AdministrationIndex() {
  const { offices } = Route.useLoaderData();
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");

  // Extract unique categories
  const categories = useMemo(() => {
    const cats = new Set<string>();
    offices.forEach((o) => {
      if (o.office_category && o.office_category.trim()) {
        cats.add(o.office_category.trim());
      }
    });
    return ["All", ...Array.from(cats)];
  }, [offices]);

  // Filter offices
  const filteredOffices = useMemo(() => {
    return offices.filter((office) => {
      const matchesSearch =
        search === "" ||
        office.office_name.toLowerCase().includes(search.toLowerCase()) ||
        (office.description && office.description.toLowerCase().includes(search.toLowerCase())) ||
        (office.office_category &&
          office.office_category.toLowerCase().includes(search.toLowerCase())) ||
        (office.head_of_office &&
          office.head_of_office.toLowerCase().includes(search.toLowerCase()));

      const matchesCat =
        selectedCategory === "All" ||
        (office.office_category &&
          office.office_category.trim().toLowerCase() === selectedCategory.toLowerCase());

      return matchesSearch && matchesCat;
    });
  }, [offices, search, selectedCategory]);

  // Group filtered offices by category
  const groupedOffices = useMemo(() => {
    const groups: { [key: string]: typeof offices } = {};
    filteredOffices.forEach((office) => {
      const cat =
        office.office_category && office.office_category.trim()
          ? office.office_category.trim()
          : "General Administration & Operations";
      if (!groups[cat]) {
        groups[cat] = [];
      }
      groups[cat].push(office);
    });
    return groups;
  }, [filteredOffices]);

  const groupKeys = Object.keys(groupedOffices);

  return (
    <div className="flex min-h-screen flex-col bg-white">
      {/* Page Hero */}
      <div className="obu-gradient py-12 sm:py-20 md:py-28 px-4 sm:px-6 lg:px-8 relative overflow-hidden text-white">
        <div className="absolute inset-0 opacity-10 mix-blend-overlay pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-[600px] h-[600px] bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white/15 to-transparent blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto relative z-10 animate-fade-in-up">
          <div className="inline-flex items-center gap-2 rounded-full bg-[#ffcc00] px-3 sm:px-4 py-1 sm:py-1.5 text-xs font-bold uppercase tracking-[0.2em] text-[#186a42] mb-3 sm:mb-5 shadow-lg">
            <Landmark className="w-3.5 h-3.5" />
            University Operations & Services
          </div>
          <h1 className="font-heading text-3xl sm:text-5xl md:text-6xl font-extrabold text-white tracking-tight leading-tight break-words">
            Administrative Offices
          </h1>
          <p className="mt-3 sm:mt-4 text-base sm:text-lg md:text-xl text-white/90 max-w-3xl font-medium leading-relaxed">
            The institutional directorates, administrative units, and operational service centers
            providing crucial administrative support across Oda Bultum University.
          </p>
        </div>
      </div>

      {/* Breadcrumb Bar */}
      <div className="bg-gray-50 border-b border-gray-100 py-3 sm:py-4 px-3 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <Breadcrumbs items={[{ label: "Administrative Offices" }]} />
        </div>
      </div>

      <main className="flex-grow">
        {/* Search & Directory Filter Section */}
        <section className="py-6 sm:py-10 bg-gray-50/50 border-b border-gray-100">
          <div className="container mx-auto max-w-7xl px-3 sm:px-6 lg:px-8 space-y-4 sm:space-y-6">
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 items-center justify-between">
              {/* Search Input */}
              <div className="relative w-full sm:max-w-md">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 sm:w-5 h-4 sm:h-5 text-gray-400 pointer-events-none" />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search by office name, head, or keyword..."
                  className="w-full pl-11 sm:pl-12 pr-4 py-2.5 sm:py-3.5 rounded-2xl bg-white border border-gray-200 text-sm font-medium text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#186a42] focus:border-transparent shadow-sm transition-all"
                />
              </div>

              {/* Counter */}
              <div className="text-xs font-bold uppercase tracking-widest text-gray-500 self-end sm:self-center">
                Showing <span className="text-[#186a42] font-black">{filteredOffices.length}</span>{" "}
                of {offices.length} Offices
              </div>
            </div>

            {/* Category Filter Tabs */}
            {categories.length > 2 && (
              <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
                <div className="flex items-center gap-1.5 p-1 bg-gray-100 rounded-2xl w-full sm:w-auto">
                  {categories.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setSelectedCategory(cat)}
                      className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1.5 ${
                        selectedCategory.toLowerCase() === cat.toLowerCase()
                          ? "bg-white text-[#186a42] shadow-sm"
                          : "text-gray-600 hover:text-gray-900"
                      }`}
                    >
                      {cat === "All" && <Layers className="w-3.5 h-3.5" />}
                      <span>{cat}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </section>

        {/* Directory Grid Sections */}
        <div className="container mx-auto max-w-7xl px-3 sm:px-6 lg:px-8 py-8 sm:py-12 md:py-16">
          {filteredOffices.length === 0 ? (
            <div className="text-center py-16 bg-gray-50 rounded-3xl border border-gray-100 max-w-2xl mx-auto p-6 space-y-4">
              <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center mx-auto text-gray-400 shadow-sm border border-gray-100">
                <HelpCircle className="w-8 h-8" />
              </div>
              <h3 className="font-heading text-xl font-bold text-gray-900">No Offices Found</h3>
              <p className="text-sm text-gray-600">
                We couldn't find any administrative units matching your search criteria.
              </p>
              <button
                onClick={() => {
                  setSearch("");
                  setSelectedCategory("All");
                }}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#186a42] text-white text-xs font-bold uppercase tracking-wider hover:bg-[#124e31] transition-colors"
              >
                Reset Filters
              </button>
            </div>
          ) : (
            <div className="space-y-16">
              {groupKeys.map((groupTitle) => {
                const groupOffices = groupedOffices[groupTitle] || [];
                return (
                  <section key={groupTitle} className="space-y-6">
                    {/* Category Section Header */}
                    <div className="flex items-center gap-3 border-b border-gray-100 pb-3">
                      <div className="w-2.5 h-2.5 rounded-full bg-[#ffcc00]" />
                      <h2 className="font-heading text-xl sm:text-2xl font-bold text-gray-900">
                        {groupTitle}
                      </h2>
                      <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-gray-100 text-gray-600">
                        {groupOffices.length}
                      </span>
                    </div>

                    {/* Offices Cards Layout */}
                    <div className="grid gap-6 sm:gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
                      {groupOffices.map((office) => (
                        <div
                          key={office.id}
                          className="group bg-white rounded-3xl overflow-hidden border border-gray-100 shadow-md hover:shadow-2xl hover:border-[#186a42]/30 transition-all duration-500 hover:-translate-y-1.5 flex flex-col relative"
                        >
                          <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-[#186a42] via-[#ffcc00] to-[#186a42] opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10" />

                          {/* Image or Icon Banner */}
                          {(office as { main_image_url?: string | null; image?: string | null })
                            .main_image_url ||
                          (office as { main_image_url?: string | null; image?: string | null })
                            .image ? (
                            <div className="relative aspect-[16/9] w-full overflow-hidden bg-gray-100">
                              <img
                                src={
                                  (
                                    office as {
                                      main_image_url?: string | null;
                                      image?: string | null;
                                    }
                                  ).main_image_url ||
                                  (
                                    office as {
                                      main_image_url?: string | null;
                                      image?: string | null;
                                    }
                                  ).image!
                                }
                                alt={office.office_name}
                                className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                                loading="lazy"
                              />
                              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-60 transition-opacity duration-500 group-hover:opacity-80" />
                              {office.office_category && (
                                <div className="absolute top-3.5 right-3.5 z-10">
                                  <span className="inline-block px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider bg-black/60 text-white backdrop-blur-sm border border-white/20">
                                    {office.office_category}
                                  </span>
                                </div>
                              )}
                            </div>
                          ) : (
                            <div className="p-5 sm:p-6 pb-0 flex items-start justify-between gap-4">
                              <div className="flex h-12 w-12 sm:h-14 sm:w-14 items-center justify-center rounded-2xl bg-[#186a42]/10 text-[#186a42] group-hover:bg-[#186a42] group-hover:text-white transition-colors duration-500 shadow-sm shrink-0">
                                <Building2 className="h-6 w-6 sm:h-7 sm:w-7" />
                              </div>

                              {office.office_category && (
                                <span className="inline-block px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider bg-[#ffcc00]/15 text-[#186a42] border border-[#ffcc00]/30 text-right">
                                  {office.office_category}
                                </span>
                              )}
                            </div>
                          )}

                          {/* Content Body */}
                          <div className="p-5 sm:p-6 md:p-8 flex flex-col flex-grow">
                            {/* Office Title & Description */}
                            <div className="mb-6 flex-grow space-y-3">
                              <h3 className="font-heading text-xl sm:text-2xl font-bold text-gray-900 group-hover:text-[#186a42] transition-colors leading-tight break-words">
                                {office.office_name}
                              </h3>

                              {office.head_of_office && (
                                <p className="text-xs font-semibold text-gray-600 flex items-center gap-1.5">
                                  <User className="w-3.5 h-3.5 text-[#186a42] shrink-0" />
                                  <span className="break-words">
                                    Head:{" "}
                                    <strong className="text-gray-900">
                                      {office.head_of_office}
                                    </strong>
                                  </span>
                                </p>
                              )}

                              <p className="text-gray-600 text-sm leading-relaxed line-clamp-3 font-normal">
                                {office.description ||
                                  "Learn more about this office's mission, mandates, and campus contact details."}
                              </p>
                            </div>

                            {/* Contact Info Strip if available */}
                            {(office.location || office.email || office.phone) && (
                              <div className="py-3 border-t border-gray-100 text-xs text-gray-500 space-y-1.5">
                                {office.location && (
                                  <p className="flex items-center gap-1.5 truncate">
                                    <MapPin className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                                    <span className="truncate">{office.location}</span>
                                  </p>
                                )}
                                {office.email && (
                                  <p className="flex items-center gap-1.5 truncate">
                                    <Mail className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                                    <span className="truncate">{office.email}</span>
                                  </p>
                                )}
                              </div>
                            )}

                            {/* Action Link Footer */}
                            <div className="pt-4 border-t border-gray-100 flex items-center justify-between text-xs font-bold uppercase tracking-wider text-[#186a42]">
                              <Link
                                to="/administration/$slug"
                                params={{ slug: office.slug || office.id }}
                                className="flex items-center justify-between w-full group-hover:translate-x-1 transition-transform"
                              >
                                <span>View Office & Mandates</span>
                                <div className="w-8 h-8 rounded-full bg-gray-50 group-hover:bg-[#186a42] flex items-center justify-center transition-colors shrink-0">
                                  <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-white transition-colors" />
                                </div>
                              </Link>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </section>
                );
              })}
            </div>
          )}
        </div>

        {/* ─── CENTRAL HELPDESK & CAMPUS INQUIRIES SECTION ─── */}
        <section className="py-16 bg-gray-50 border-t border-gray-100">
          <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="bg-white rounded-3xl p-8 sm:p-12 border border-gray-100 shadow-xl relative overflow-hidden">
              <div className="h-2 w-full absolute top-0 left-0 obu-gradient" />

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                <div className="lg:col-span-8 space-y-3">
                  <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#186a42]">
                    <HelpCircle className="w-4 h-4 text-[#ffcc00]" />
                    Central University Inquiries
                  </div>
                  <h3 className="font-heading text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
                    Need General Campus or Administrative Assistance?
                  </h3>
                  <p className="text-gray-600 text-sm sm:text-base leading-relaxed max-w-2xl font-normal">
                    If you are unsure which office to contact for your inquiry, reach out to the
                    Central Information Desk or University Registrar for guided support.
                  </p>
                </div>

                <div className="lg:col-span-4 flex flex-col sm:flex-row lg:flex-col gap-3 justify-end">
                  <Link
                    to="/contact"
                    className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl bg-[#186a42] hover:bg-[#125333] text-white font-bold text-xs uppercase tracking-wider shadow-md hover:shadow-lg transition-all"
                  >
                    Contact University Desk <ArrowRight className="w-4 h-4" />
                  </Link>
                  <Link
                    to="/registrar"
                    className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl bg-gray-50 hover:bg-gray-100 text-gray-800 font-bold text-xs uppercase tracking-wider border border-gray-200 transition-colors"
                  >
                    Registrar Office
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
