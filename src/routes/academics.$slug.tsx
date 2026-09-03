import { createFileRoute, notFound, Link } from "@tanstack/react-router";
import { Breadcrumbs } from "@/frontend/components/Breadcrumbs";
import { supabase } from "@/frontend/lib/supabase";
import { Mail, Phone, User, Building2, ChevronRight, BookOpen } from "lucide-react";

export const Route = createFileRoute("/academics/$slug")({
  component: CollegeDetail,
  loader: async ({ params }) => {
    const { data: college, error } = await supabase
      .from("academic_units")
      .select("*, media:main_image_id(file_url)")
      .eq("slug", params.slug)
      .eq("status", "active")
      .maybeSingle();
    if (error || !college) throw notFound();

    const { data: departments, error: departmentsError } = await supabase
      .from("academic_units")
      .select("id, name, slug, unit_type, display_order, media:main_image_id(file_url)")
      .eq("parent_id", college.id)
      .eq("status", "active")
      .in("unit_type", ["department", "Department"])
      .order("display_order");
    if (departmentsError) throw departmentsError;

    type CollegeWithMedia = typeof college & {
      media: { file_url: string } | null;
    };
    const collegeData = college as unknown as CollegeWithMedia;

    type DepartmentWithMedia = {
      id: string;
      name: string;
      slug: string | null;
      unit_type: string;
      display_order: number;
      media: { file_url: string } | null;
    };

    return {
      college: {
        ...college,
        main_image_url: collegeData.media?.file_url ?? null,
      },
      departments: ((departments ?? []) as unknown as DepartmentWithMedia[]).map((dept) => ({
        id: dept.id,
        name: dept.name,
        slug: dept.slug,
        unit_type: dept.unit_type,
        display_order: dept.display_order,
        main_image_url: dept.media?.file_url ?? null,
      })),
    };
  },
});

function CollegeDetail() {
  const { college, departments } = Route.useLoaderData();

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {college.main_image_url ? (
        <div className="relative w-full h-[40vh] sm:h-[45vh] min-h-[280px] sm:min-h-[350px] lg:min-h-[480px]">
          <img
            src={college.main_image_url}
            alt={college.name}
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-black/20" />
          <div className="absolute inset-0 flex items-end pb-8 sm:pb-12 md:pb-16 animate-fade-in-up">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
              <span className="inline-block rounded-full bg-[#ffcc00] px-3 sm:px-4 py-1 sm:py-1.5 text-xs font-bold uppercase tracking-[0.2em] text-[#186a42] mb-3 sm:mb-5 shadow-lg">
                {college.unit_type}
              </span>
              <h1 className="font-heading text-2xl sm:text-4xl md:text-5xl lg:text-7xl font-extrabold text-white tracking-tight drop-shadow-xl leading-tight break-words">
                {college.name}
              </h1>
            </div>
          </div>
        </div>
      ) : (
        <div className="obu-gradient py-12 sm:py-20 md:py-28 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
          <div className="absolute inset-0 opacity-10 mix-blend-overlay pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-[600px] h-[600px] bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white/10 to-transparent blur-3xl pointer-events-none" />
          <div className="max-w-7xl mx-auto relative z-10 animate-fade-in-up">
            <span className="inline-block rounded-full bg-[#ffcc00] px-3 sm:px-4 py-1 sm:py-1.5 text-xs font-bold uppercase tracking-[0.2em] text-[#186a42] mb-3 sm:mb-5 shadow-lg">
              {college.unit_type}
            </span>
            <h1 className="font-heading text-2xl sm:text-4xl md:text-5xl lg:text-7xl font-extrabold text-white tracking-tight leading-tight break-words">
              {college.name}
            </h1>
          </div>
        </div>
      )}

      <main className="flex-grow container mx-auto px-3 sm:px-6 lg:px-8 py-8 sm:py-10 md:py-16 max-w-7xl">
        <div className="mb-6 sm:mb-10 animate-fade-in-up">
          <Breadcrumbs
            items={[{ label: "Academics", to: "/academics" }, { label: college.name }]}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 sm:gap-12 lg:gap-16">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-10 sm:space-y-16">
            {college.description && (
              <section className="animate-fade-in-up">
                <div className="flex items-center gap-3 sm:gap-4 mb-6 sm:mb-8">
                  <div className="w-8 sm:w-10 h-1.5 obu-gradient rounded-full" />
                  <h2 className="font-heading text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
                    Overview
                  </h2>
                </div>
                <div className="prose prose-base sm:prose-lg prose-[#186a42] max-w-none text-gray-700 leading-relaxed whitespace-pre-wrap font-medium">
                  {college.description}
                </div>
              </section>
            )}

            <section className="animate-fade-in-up" style={{ animationDelay: "150ms" }}>
              <div className="flex items-center gap-3 sm:gap-4 mb-6 sm:mb-8">
                <div className="w-8 sm:w-10 h-1.5 bg-[#ffcc00] rounded-full" />
                <h2 className="font-heading text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
                  Departments
                </h2>
              </div>

              {departments.length === 0 ? (
                <div className="bg-white border border-gray-100 rounded-2xl sm:rounded-3xl p-8 sm:p-12 text-center shadow-sm">
                  <BookOpen className="mx-auto h-12 w-12 sm:h-16 sm:w-16 text-gray-200 mb-4" />
                  <p className="text-gray-500 font-medium text-base sm:text-lg">
                    No departments are currently listed for this {college.unit_type}.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                  {departments.map((dept, index) => (
                    <Link
                      key={dept.id}
                      to="/academics/departments/$slug"
                      params={{ slug: dept.slug ?? dept.id }}
                      className="group flex flex-col justify-between p-5 sm:p-6 md:p-8 bg-white border border-gray-100/50 rounded-2xl sm:rounded-3xl shadow-md hover:border-[#186a42]/30 hover:shadow-xl transition-all duration-500 hover:-translate-y-2 relative overflow-hidden"
                    >
                      <div className="absolute top-0 right-0 w-20 sm:w-24 h-20 sm:h-24 bg-[#186a42]/5 rounded-bl-[100px] transition-colors duration-500 group-hover:bg-[#ffcc00]/20" />
                      <div>
                        {dept.main_image_url ? (
                          <div className="mb-3 sm:mb-4 h-12 w-12 rounded-2xl overflow-hidden border border-gray-100 shadow-sm">
                            <img
                              src={dept.main_image_url}
                              alt={dept.name}
                              className="h-full w-full object-cover group-hover:scale-110 transition-transform duration-500"
                              loading="lazy"
                            />
                          </div>
                        ) : (
                          <Building2 className="h-7 w-7 sm:h-8 sm:w-8 text-[#186a42]/40 mb-3 sm:mb-4 group-hover:text-[#186a42] transition-colors duration-500" />
                        )}
                        <span className="font-heading text-lg sm:text-xl font-bold text-gray-900 group-hover:text-[#186a42] transition-colors line-clamp-2 leading-tight break-words">
                          {dept.name}
                        </span>
                      </div>
                      <div className="mt-6 sm:mt-8 flex items-center justify-between">
                        <span className="text-[#186a42] text-xs sm:text-sm font-bold uppercase tracking-wider">
                          View Department
                        </span>
                        <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center group-hover:bg-[#186a42] transition-colors duration-300 shrink-0">
                          <ChevronRight className="h-4 w-4 text-gray-400 group-hover:text-white transition-transform duration-300 group-hover:translate-x-1" />
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </section>
          </div>

          {/* Sidebar */}
          <div className="space-y-8 animate-fade-in-up" style={{ animationDelay: "300ms" }}>
            <div className="bg-white rounded-2xl sm:rounded-3xl p-5 sm:p-6 md:p-8 border border-gray-100 shadow-xl relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-2 obu-gradient" />
              <h3 className="font-heading text-xl sm:text-2xl font-bold text-gray-900 mb-6 sm:mb-8 tracking-tight">
                Leadership & Contact
              </h3>

              <dl className="space-y-5 sm:space-y-6">
                {college.dean && (
                  <div className="flex gap-3 sm:gap-4 items-start">
                    <div className="mt-1 bg-[#186a42]/10 p-2 rounded-xl text-[#186a42] shrink-0">
                      <User className="w-4 h-4 sm:w-5 sm:h-5" />
                    </div>
                    <div className="min-w-0">
                      <dt className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-0.5">
                        Dean / Head
                      </dt>
                      <dd className="text-sm sm:text-base font-bold text-gray-900 break-words">
                        {college.dean}
                      </dd>
                    </div>
                  </div>
                )}

                {college.email && (
                  <div className="flex gap-3 sm:gap-4 items-start">
                    <div className="mt-1 bg-[#186a42]/10 p-2 rounded-xl text-[#186a42] shrink-0">
                      <Mail className="w-4 h-4 sm:w-5 sm:h-5" />
                    </div>
                    <div className="min-w-0">
                      <dt className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-0.5">
                        Email
                      </dt>
                      <dd className="text-sm sm:text-base font-medium">
                        <a
                          href={`mailto:${college.email}`}
                          className="text-[#186a42] hover:underline break-all"
                        >
                          {college.email}
                        </a>
                      </dd>
                    </div>
                  </div>
                )}

                {college.phone && (
                  <div className="flex gap-3 sm:gap-4 items-start">
                    <div className="mt-1 bg-[#186a42]/10 p-2 rounded-xl text-[#186a42] shrink-0">
                      <Phone className="w-4 h-4 sm:w-5 sm:h-5" />
                    </div>
                    <div className="min-w-0">
                      <dt className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-0.5">
                        Phone
                      </dt>
                      <dd className="text-sm sm:text-base font-bold text-gray-900 break-words">
                        {college.phone}
                      </dd>
                    </div>
                  </div>
                )}

                {!college.dean && !college.email && !college.phone && (
                  <div className="text-sm text-gray-500 italic bg-gray-50 p-4 rounded-xl">
                    No contact information available.
                  </div>
                )}
              </dl>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
