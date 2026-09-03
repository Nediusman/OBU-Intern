import { createFileRoute, Link } from "@tanstack/react-router";
import { Breadcrumbs } from "@/frontend/components/Breadcrumbs";
import { supabase } from "@/frontend/lib/supabase";
import { BookOpen } from "lucide-react";

export const Route = createFileRoute("/academics/")({
  component: AcademicsIndex,
  loader: async () => {
    const { data, error } = await supabase
      .from("academic_units")
      .select(
        "id, slug, name, unit_type, description, display_order, media:main_image_id(file_url)",
      )
      .eq("status", "active")
      .in("unit_type", ["college", "College", "faculty", "Faculty", "institute", "Institute"])
      .order("display_order");
    if (error) throw error;

    type UnitWithMedia = {
      id: string;
      slug: string | null;
      name: string;
      unit_type: string;
      description: string | null;
      display_order: number;
      media: { file_url: string } | null;
    };

    const colleges = ((data ?? []) as unknown as UnitWithMedia[]).map((unit) => ({
      id: unit.id,
      slug: unit.slug,
      name: unit.name,
      unit_type: unit.unit_type,
      description: unit.description,
      display_order: unit.display_order,
      main_image_url: unit.media?.file_url ?? null,
    }));
    return { colleges };
  },
});

function AcademicsIndex() {
  const { colleges } = Route.useLoaderData();

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <div className="obu-gradient py-12 sm:py-20 md:py-28 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        {/* Decorative background overlay */}
        <div className="absolute inset-0 opacity-20 mix-blend-overlay pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-[600px] h-[600px] bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-white/10 to-transparent blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto relative z-10 text-center animate-fade-in-up">
          <h1 className="font-heading text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold text-white tracking-tight drop-shadow-md">
            Academics
          </h1>
          <p className="mt-4 sm:mt-6 text-white/95 max-w-2xl mx-auto text-base sm:text-lg md:text-xl font-medium leading-relaxed drop-shadow-sm">
            Discover our academic programs, colleges, and institutes dedicated to excellence in
            education and problem-solving research.
          </p>
        </div>
      </div>

      <main className="flex-grow container mx-auto px-3 sm:px-6 lg:px-8 py-8 sm:py-12 md:py-16 max-w-7xl">
        <div className="mb-6 sm:mb-10 animate-fade-in-up">
          <Breadcrumbs items={[{ label: "Academics" }]} />
        </div>

        {colleges.length === 0 ? (
          <div className="mt-8 text-center glass-panel rounded-3xl py-16 sm:py-24 px-4 sm:px-6 animate-fade-in-up">
            <BookOpen className="mx-auto h-16 w-16 sm:h-20 sm:w-20 text-[#186a42]/20 mb-4 sm:mb-6" />
            <p className="font-heading text-xl sm:text-2xl font-bold text-gray-900">
              No academic units available
            </p>
            <p className="text-gray-500 mt-2 sm:mt-3 text-base sm:text-lg">
              Please check back later for updates to our academic offerings.
            </p>
          </div>
        ) : (
          <div className="grid gap-6 sm:gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            {colleges.map((college, index) => (
              <Link
                key={college.id}
                to="/academics/$slug"
                params={{ slug: college.slug ?? college.id }}
                className="group flex flex-col bg-white rounded-3xl overflow-hidden border border-gray-100/50 shadow-lg transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl hover:border-[#186a42]/30 animate-fade-in-up"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                {college.main_image_url ? (
                  <div className="relative aspect-[4/3] w-full overflow-hidden bg-gray-100">
                    <img
                      src={college.main_image_url}
                      alt={college.name}
                      className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-60 transition-opacity duration-500 group-hover:opacity-80" />
                  </div>
                ) : (
                  <div className="relative aspect-[4/3] w-full bg-[#186a42]/5 flex items-center justify-center border-b border-gray-100 overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-[#186a42]/5 to-[#ffcc00]/5" />
                    <BookOpen className="h-16 w-16 sm:h-20 sm:w-20 text-[#186a42]/20 transition-transform duration-500 group-hover:scale-110 relative z-10" />
                  </div>
                )}
                <div className="flex flex-col flex-grow p-5 sm:p-6 md:p-8 bg-white relative z-10">
                  <div className="mb-3 sm:mb-5">
                    <span className="inline-block rounded-full bg-[#ffcc00]/20 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.2em] text-[#186a42]">
                      {college.unit_type}
                    </span>
                  </div>
                  <h2 className="font-heading text-xl sm:text-2xl font-bold text-gray-900 leading-tight mb-3 sm:mb-4 group-hover:text-[#186a42] transition-colors break-words">
                    {college.name}
                  </h2>
                  <p className="text-gray-600 text-sm sm:text-[15px] leading-relaxed mb-6 sm:mb-8 line-clamp-3 flex-grow">
                    {college.description ||
                      `Explore the departments and programs offered by the ${college.name}.`}
                  </p>
                  <div className="mt-auto flex items-center justify-between font-bold text-[#186a42] pt-2">
                    <span className="uppercase tracking-wider text-xs sm:text-sm">
                      Explore College
                    </span>
                    <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gray-50 flex items-center justify-center group-hover:bg-[#186a42] transition-colors duration-300 shrink-0">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400 group-hover:text-white transition-transform duration-300 group-hover:translate-x-1"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z"
                          clipRule="evenodd"
                        />
                      </svg>
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
