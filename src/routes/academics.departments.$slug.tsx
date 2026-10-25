import { createFileRoute, notFound, Link } from "@tanstack/react-router";
import { Breadcrumbs } from "@/frontend/components/Breadcrumbs";
import { supabase } from "@/frontend/lib/supabase";
import { Mail, Phone, User, ChevronRight, GraduationCap, BookOpen, Clock } from "lucide-react";

export const Route = createFileRoute("/academics/departments/$slug")({
  component: DepartmentDetail,
  loader: async ({ params }) => {
    const { data: department, error } = await supabase
      .from("academic_units")
      .select("*, media:main_image_id(file_url)")
      .eq("slug", params.slug)
      .eq("status", "active")
      .in("unit_type", ["department", "Department"])
      .maybeSingle();
    if (error || !department) throw notFound();

    const [parentResult, programsResult] = await Promise.all([
      department.parent_id
        ? supabase
            .from("academic_units")
            .select("id, name, slug, unit_type")
            .eq("id", department.parent_id)
            .eq("status", "active")
            .maybeSingle()
        : Promise.resolve({ data: null, error: null }),
      supabase
        .from("programs")
        .select("id, name, slug, degree, duration, display_order, media:main_image_id(file_url)")
        .eq("academic_unit_id", department.id)
        .eq("status", "active")
        .order("display_order"),
    ]);
    if (parentResult.error || programsResult.error)
      throw parentResult.error ?? programsResult.error;

    type DepartmentWithMedia = typeof department & {
      media: { file_url: string } | null;
    };
    const deptData = department as unknown as DepartmentWithMedia;

    type ProgramWithMedia = {
      id: string;
      name: string;
      slug: string | null;
      degree: string | null;
      duration: string | null;
      display_order: number;
      media: { file_url: string } | null;
    };

    return {
      department: {
        ...department,
        main_image_url: deptData.media?.file_url ?? null,
      },
      parentUnit: parentResult.data,
      programs: ((programsResult.data ?? []) as unknown as ProgramWithMedia[]).map((p) => ({
        id: p.id,
        name: p.name,
        slug: p.slug,
        degree: p.degree,
        duration: p.duration,
        display_order: p.display_order,
        main_image_url: p.media?.file_url ?? null,
      })),
    };
  },
});

function DepartmentDetail() {
  const { department, parentUnit, programs } = Route.useLoaderData();

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {department.main_image_url ? (
        <div className="relative w-full h-[40vh] sm:h-[45vh] min-h-[280px] sm:min-h-[350px] lg:min-h-[480px]">
          <img
            src={department.main_image_url}
            alt={department.name}
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-black/20" />
          <div className="absolute inset-0 flex items-end pb-8 sm:pb-12 md:pb-16 animate-fade-in-up">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
              {parentUnit && (
                <Link
                  to="/academics/$slug"
                  params={{ slug: parentUnit.slug ?? parentUnit.id }}
                  className="inline-block rounded-full bg-white/20 backdrop-blur-sm px-3 sm:px-4 py-1 sm:py-1.5 text-xs font-bold uppercase tracking-wider text-white mb-3 sm:mb-4 border border-white/30 shadow-sm hover:bg-white/30 transition-colors"
                >
                  {parentUnit.name}
                </Link>
              )}
              <h1 className="font-heading text-2xl sm:text-4xl md:text-5xl lg:text-7xl font-extrabold text-white tracking-tight drop-shadow-xl leading-tight break-words">
                {department.name}
              </h1>
            </div>
          </div>
        </div>
      ) : (
        <div className="obu-gradient py-12 sm:py-20 md:py-28 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
          <div className="absolute inset-0 opacity-10 mix-blend-overlay pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-[600px] h-[600px] bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white/10 to-transparent blur-3xl pointer-events-none" />
          <div className="max-w-7xl mx-auto relative z-10 animate-fade-in-up">
            {parentUnit && (
              <Link
                to="/academics/$slug"
                params={{ slug: parentUnit.slug ?? parentUnit.id }}
                className="inline-block rounded-full bg-[#ffcc00] px-3 sm:px-4 py-1 sm:py-1.5 text-xs font-bold uppercase tracking-[0.2em] text-[#186a42] mb-3 sm:mb-5 shadow-lg hover:bg-amber-300 transition-colors"
              >
                {parentUnit.name}
              </Link>
            )}
            <h1 className="font-heading text-2xl sm:text-4xl md:text-5xl lg:text-7xl font-extrabold text-white tracking-tight leading-tight break-words">
              {department.name}
            </h1>
          </div>
        </div>
      )}

      <main className="flex-grow container mx-auto px-3 sm:px-6 lg:px-8 py-8 sm:py-10 md:py-16 max-w-7xl">
        <div className="mb-6 sm:mb-10 animate-fade-in-up">
          <Breadcrumbs
            items={[
              { label: "Academics", to: "/academics" },
              { label: "Departments", to: "/academics/departments" },
              ...(parentUnit
                ? [
                    {
                      label: parentUnit.name,
                      to: `/academics/${parentUnit.slug ?? parentUnit.id}`,
                    },
                  ]
                : []),
              { label: department.name },
            ]}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 sm:gap-12 lg:gap-16">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-10 sm:space-y-16">
            {department.description && (
              <section className="animate-fade-in-up">
                <div className="flex items-center gap-3 sm:gap-4 mb-6 sm:mb-8">
                  <div className="w-8 sm:w-10 h-1.5 obu-gradient rounded-full" />
                  <h2 className="font-heading text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
                    About the Department
                  </h2>
                </div>
                <div className="prose prose-base sm:prose-lg prose-[#186a42] max-w-none text-gray-700 leading-relaxed whitespace-pre-wrap font-medium">
                  {department.description}
                </div>
              </section>
            )}

            <section className="animate-fade-in-up" style={{ animationDelay: "150ms" }}>
              <div className="flex items-center gap-3 sm:gap-4 mb-6 sm:mb-8">
                <div className="w-8 sm:w-10 h-1.5 bg-[#ffcc00] rounded-full" />
                <h2 className="font-heading text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
                  Academic Programs
                </h2>
              </div>

              {programs.length === 0 ? (
                <div className="bg-white border border-gray-100 rounded-2xl sm:rounded-3xl p-8 sm:p-12 text-center shadow-sm">
                  <BookOpen className="mx-auto h-12 w-12 sm:h-16 sm:w-16 text-gray-200 mb-4" />
                  <p className="text-gray-500 font-medium text-base sm:text-lg">
                    No programs are currently listed for this department.
                  </p>
                </div>
              ) : (
                <div className="grid gap-4 sm:gap-6">
                  {programs.map((prog, index) => (
                    <Link
                      key={prog.id}
                      to="/academics/programs/$slug"
                      params={{ slug: prog.slug ?? prog.id }}
                      className="group flex flex-col sm:flex-row sm:items-center justify-between p-5 sm:p-6 md:p-8 bg-white border border-gray-100/50 rounded-2xl sm:rounded-3xl shadow-md hover:border-[#186a42]/30 hover:shadow-xl transition-all duration-500 hover:-translate-y-1 relative overflow-hidden gap-4 sm:gap-6"
                      style={{ animationDelay: `${index * 100}ms` }}
                    >
                      <div className="absolute top-0 right-0 w-24 h-full bg-gradient-to-l from-[#186a42]/5 to-transparent pointer-events-none transition-colors duration-500 group-hover:from-[#186a42]/10" />

                      <div className="relative z-10 flex items-start gap-3 sm:gap-5 min-w-0">
                        {prog.main_image_url ? (
                          <div className="mt-1 h-12 w-12 sm:h-14 sm:w-14 shrink-0 rounded-2xl overflow-hidden border border-gray-100 shadow-sm">
                            <img
                              src={prog.main_image_url}
                              alt={prog.name}
                              className="h-full w-full object-cover group-hover:scale-110 transition-transform duration-500"
                              loading="lazy"
                            />
                          </div>
                        ) : (
                          <div className="mt-1 bg-gray-50 p-2.5 sm:p-3 rounded-2xl group-hover:bg-[#ffcc00]/20 transition-colors duration-500 shrink-0">
                            <GraduationCap className="w-6 h-6 sm:w-8 sm:h-8 text-[#186a42]" />
                          </div>
                        )}
                        <div className="min-w-0">
                          <h3 className="font-heading text-lg sm:text-2xl font-bold text-gray-900 group-hover:text-[#186a42] transition-colors leading-tight mb-2 sm:mb-3 break-words">
                            {prog.name}
                          </h3>
                          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                            {prog.degree && (
                              <span className="inline-flex items-center px-2.5 sm:px-3 py-0.5 sm:py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-[#186a42]/10 text-[#186a42]">
                                {prog.degree} Degree
                              </span>
                            )}
                            {prog.duration && (
                              <span className="inline-flex items-center px-2.5 sm:px-3 py-0.5 sm:py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-gray-100 text-gray-700">
                                {prog.duration}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="shrink-0 relative z-10 sm:self-center self-start sm:mt-0 mt-1">
                        <div className="flex items-center gap-2 text-[#186a42] font-bold text-xs sm:text-sm uppercase tracking-wider">
                          View Program
                          <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gray-50 flex items-center justify-center group-hover:bg-[#186a42] transition-colors duration-300">
                            <ChevronRight className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400 group-hover:text-white transition-transform duration-300 group-hover:translate-x-1" />
                          </div>
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
                {department.dean && (
                  <div className="flex gap-3 sm:gap-4 items-start">
                    <div className="mt-1 bg-[#186a42]/10 p-2 rounded-xl text-[#186a42] shrink-0">
                      <User className="w-4 h-4 sm:w-5 sm:h-5" />
                    </div>
                    <div className="min-w-0">
                      <dt className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-0.5">
                        Department Head
                      </dt>
                      <dd className="text-sm sm:text-base font-bold text-gray-900 break-words">
                        {department.dean}
                      </dd>
                    </div>
                  </div>
                )}

                {department.email && (
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
                          href={`mailto:${department.email}`}
                          className="text-[#186a42] hover:underline break-all"
                        >
                          {department.email}
                        </a>
                      </dd>
                    </div>
                  </div>
                )}

                {department.phone && (
                  <div className="flex gap-3 sm:gap-4 items-start">
                    <div className="mt-1 bg-[#186a42]/10 p-2 rounded-xl text-[#186a42] shrink-0">
                      <Phone className="w-4 h-4 sm:w-5 sm:h-5" />
                    </div>
                    <div className="min-w-0">
                      <dt className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-0.5">
                        Phone
                      </dt>
                      <dd className="text-sm sm:text-base font-bold text-gray-900 break-words">
                        {department.phone}
                      </dd>
                    </div>
                  </div>
                )}

                {!department.dean && !department.email && !department.phone && (
                  <div className="text-sm text-gray-500 italic bg-gray-50 p-4 rounded-xl">
                    No contact information available.
                  </div>
                )}

                <div className="flex items-center gap-2 text-xs text-gray-500 pt-4 border-t border-gray-100">
                  <Clock className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
                  <span>
                    Last Updated:{" "}
                    {department.updated_at
                      ? new Date(department.updated_at).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })
                      : "Current Academic Semester"}
                  </span>
                </div>
              </dl>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
