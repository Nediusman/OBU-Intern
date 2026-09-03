import { createFileRoute, notFound, Link } from "@tanstack/react-router";
import { Breadcrumbs } from "@/frontend/components/Breadcrumbs";
import { supabase } from "@/frontend/lib/supabase";
import { Clock, GraduationCap, Building2, BookOpen, CheckCircle2 } from "lucide-react";

export const Route = createFileRoute("/academics/programs/$slug")({
  component: ProgramDetail,
  loader: async ({ params }) => {
    const { data: program, error } = await supabase
      .from("programs")
      .select("*, media:main_image_id(file_url)")
      .eq("slug", params.slug)
      .eq("status", "active")
      .maybeSingle();
    if (error || !program) throw notFound();

    const unitResult = program.academic_unit_id
      ? await supabase
          .from("academic_units")
          .select("id, name, slug, unit_type, parent_id")
          .eq("id", program.academic_unit_id)
          .eq("status", "active")
          .maybeSingle()
      : { data: null, error: null };
    if (unitResult.error) throw unitResult.error;

    const parentResult = unitResult.data?.parent_id
      ? await supabase
          .from("academic_units")
          .select("id, name, slug, unit_type")
          .eq("id", unitResult.data.parent_id)
          .eq("status", "active")
          .maybeSingle()
      : { data: null, error: null };
    if (parentResult.error) throw parentResult.error;

    type ProgramWithMedia = typeof program & {
      media: { file_url: string } | null;
    };
    const programData = program as unknown as ProgramWithMedia;

    return {
      program: {
        ...program,
        main_image_url: programData.media?.file_url ?? null,
      },
      academicUnit: unitResult.data,
      parentUnit: parentResult.data,
    };
  },
});

function ProgramDetail() {
  const { program, academicUnit, parentUnit } = Route.useLoaderData();

  const unitSlug = academicUnit ? (academicUnit.slug ?? academicUnit.id) : null;
  const unitRoute =
    academicUnit?.unit_type?.toLowerCase() === "department"
      ? "/academics/departments/$slug"
      : "/academics/$slug";

  const parentSlug = parentUnit ? (parentUnit.slug ?? parentUnit.id) : null;

  const breadcrumbItems: { label: string; to?: string }[] = [
    { label: "Academics", to: "/academics" },
  ];

  if (parentUnit && parentSlug) {
    breadcrumbItems.push({
      label: parentUnit.name,
      to: `/academics/${parentSlug}`,
    });
  }

  if (academicUnit && unitSlug) {
    breadcrumbItems.push({
      label: academicUnit.name,
      to: unitRoute.replace("$slug", unitSlug),
    });
  } else {
    breadcrumbItems.push({ label: "Programs" });
  }

  breadcrumbItems.push({ label: program.name });

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {program.main_image_url ? (
        <div className="relative w-full h-[40vh] sm:h-[45vh] min-h-[280px] sm:min-h-[350px] lg:min-h-[480px]">
          <img
            src={program.main_image_url}
            alt={program.name}
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-black/20" />
          <div className="absolute inset-0 flex items-end pb-8 sm:pb-12 md:pb-16 animate-fade-in-up">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
              {program.degree && (
                <div className="inline-block px-3 sm:px-4 py-1 sm:py-1.5 mb-3 sm:mb-5 text-xs font-bold tracking-[0.2em] text-[#186a42] bg-[#ffcc00] rounded-full uppercase shadow-lg">
                  {program.degree} Degree
                </div>
              )}
              <h1 className="font-heading text-2xl sm:text-4xl md:text-5xl lg:text-7xl font-extrabold text-white tracking-tight drop-shadow-xl leading-tight break-words">
                {program.name}
              </h1>
              {academicUnit && unitSlug && (
                <Link
                  to={unitRoute}
                  params={{ slug: unitSlug }}
                  className="mt-4 sm:mt-6 inline-flex items-center text-white/90 hover:text-[#ffcc00] transition-colors font-bold text-sm sm:text-base md:text-lg drop-shadow-sm group break-words"
                >
                  <span className="opacity-80 font-normal mr-2">Offered by</span>{" "}
                  {academicUnit.name}
                  <span className="ml-2 transition-transform group-hover:translate-x-1">
                    &rarr;
                  </span>
                </Link>
              )}
            </div>
          </div>
        </div>
      ) : (
        <div className="obu-gradient py-12 sm:py-20 md:py-28 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
          <div className="absolute inset-0 opacity-10 mix-blend-overlay pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-[600px] h-[600px] bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white/10 to-transparent blur-3xl pointer-events-none" />
          <div className="max-w-7xl mx-auto relative z-10 animate-fade-in-up">
            {program.degree && (
              <div className="inline-block px-3 sm:px-4 py-1 sm:py-1.5 mb-3 sm:mb-5 text-xs font-bold tracking-[0.2em] text-[#186a42] bg-[#ffcc00] rounded-full uppercase shadow-lg">
                {program.degree} Degree
              </div>
            )}
            <h1 className="font-heading text-2xl sm:text-4xl md:text-5xl lg:text-7xl font-extrabold text-white tracking-tight leading-tight break-words">
              {program.name}
            </h1>
            {academicUnit && unitSlug && (
              <Link
                to={unitRoute}
                params={{ slug: unitSlug }}
                className="mt-4 sm:mt-6 inline-flex items-center text-white/90 hover:text-[#ffcc00] transition-colors font-bold text-sm sm:text-base md:text-lg group break-words"
              >
                <span className="opacity-80 font-normal mr-2">Offered by</span> {academicUnit.name}
                <span className="ml-2 transition-transform group-hover:translate-x-1">&rarr;</span>
              </Link>
            )}
          </div>
        </div>
      )}

      <main className="flex-grow container mx-auto px-3 sm:px-6 lg:px-8 py-8 sm:py-10 md:py-16 max-w-7xl">
        <div className="mb-6 sm:mb-10 animate-fade-in-up">
          <Breadcrumbs items={breadcrumbItems} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 sm:gap-12 lg:gap-16">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-10 sm:space-y-16">
            {program.description && (
              <section className="animate-fade-in-up">
                <div className="flex items-center gap-3 sm:gap-4 mb-6 sm:mb-8">
                  <div className="w-8 sm:w-10 h-1.5 obu-gradient rounded-full" />
                  <h2 className="font-heading text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
                    Program Overview
                  </h2>
                </div>
                <div className="prose prose-base sm:prose-lg prose-[#186a42] max-w-none text-gray-700 leading-relaxed whitespace-pre-wrap font-medium">
                  {program.description}
                </div>
              </section>
            )}

            {program.admission_requirements && (
              <section className="animate-fade-in-up" style={{ animationDelay: "150ms" }}>
                <div className="flex items-center gap-3 sm:gap-4 mb-6 sm:mb-8">
                  <div className="w-8 sm:w-10 h-1.5 bg-[#ffcc00] rounded-full" />
                  <h2 className="font-heading text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
                    Admission Requirements
                  </h2>
                </div>
                <div className="bg-white rounded-2xl sm:rounded-3xl p-5 sm:p-8 md:p-10 border border-gray-100 shadow-md">
                  <div className="flex items-start gap-3 sm:gap-5">
                    <div className="mt-1 bg-gray-50 p-2 sm:p-3 rounded-2xl shrink-0">
                      <CheckCircle2 className="w-6 h-6 sm:w-8 sm:h-8 text-[#186a42]" />
                    </div>
                    <div className="prose prose-base sm:prose-lg prose-[#186a42] max-w-none text-gray-700 leading-relaxed whitespace-pre-wrap flex-1 min-w-0">
                      {program.admission_requirements}
                    </div>
                  </div>
                </div>
              </section>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-8 animate-fade-in-up" style={{ animationDelay: "300ms" }}>
            <div className="bg-white rounded-2xl sm:rounded-3xl p-5 sm:p-6 md:p-8 border border-gray-100 shadow-xl relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-2 obu-gradient" />
              <h3 className="font-heading text-xl sm:text-2xl font-bold text-gray-900 mb-6 sm:mb-8 tracking-tight">
                Program Details
              </h3>

              <ul className="space-y-6 sm:space-y-8">
                {program.degree && (
                  <li className="flex items-start gap-3 sm:gap-4">
                    <div className="mt-1 bg-[#186a42]/10 p-2 rounded-xl text-[#186a42] shrink-0">
                      <GraduationCap className="w-4 h-4 sm:w-5 sm:h-5" />
                    </div>
                    <div className="min-w-0">
                      <div className="text-xs text-gray-500 uppercase tracking-widest font-bold mb-0.5">
                        Degree Type
                      </div>
                      <div className="font-bold text-gray-900 text-base sm:text-lg break-words">
                        {program.degree}
                      </div>
                    </div>
                  </li>
                )}

                {program.duration && (
                  <li className="flex items-start gap-3 sm:gap-4">
                    <div className="mt-1 bg-[#186a42]/10 p-2 rounded-xl text-[#186a42] shrink-0">
                      <Clock className="w-4 h-4 sm:w-5 sm:h-5" />
                    </div>
                    <div className="min-w-0">
                      <div className="text-xs text-gray-500 uppercase tracking-widest font-bold mb-0.5">
                        Duration
                      </div>
                      <div className="font-bold text-gray-900 text-base sm:text-lg break-words">
                        {program.duration}
                      </div>
                    </div>
                  </li>
                )}

                {academicUnit && unitSlug && (
                  <li className="flex items-start gap-3 sm:gap-4">
                    <div className="mt-1 bg-[#186a42]/10 p-2 rounded-xl text-[#186a42] shrink-0">
                      <BookOpen className="w-4 h-4 sm:w-5 sm:h-5" />
                    </div>
                    <div className="min-w-0">
                      <div className="text-xs text-gray-500 uppercase tracking-widest font-bold mb-0.5">
                        Department
                      </div>
                      <Link
                        to={unitRoute}
                        params={{ slug: unitSlug }}
                        className="font-bold text-[#186a42] text-base sm:text-lg hover:underline decoration-2 underline-offset-2 break-words"
                      >
                        {academicUnit.name}
                      </Link>
                    </div>
                  </li>
                )}

                {parentUnit && parentSlug && (
                  <li className="flex items-start gap-3 sm:gap-4">
                    <div className="mt-1 bg-[#186a42]/10 p-2 rounded-xl text-[#186a42] shrink-0">
                      <Building2 className="w-4 h-4 sm:w-5 sm:h-5" />
                    </div>
                    <div className="min-w-0">
                      <div className="text-xs text-gray-500 uppercase tracking-widest font-bold mb-0.5">
                        College / Faculty
                      </div>
                      <Link
                        to="/academics/$slug"
                        params={{ slug: parentSlug }}
                        className="font-bold text-[#186a42] text-base sm:text-lg hover:underline decoration-2 underline-offset-2 break-words"
                      >
                        {parentUnit.name}
                      </Link>
                    </div>
                  </li>
                )}
              </ul>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
