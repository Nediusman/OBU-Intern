import { createFileRoute, notFound, Link } from "@tanstack/react-router";
import { Breadcrumbs } from "@/frontend/components/Breadcrumbs";
import { getAdministrativeOfficeBySlug } from "@/backend/api";
import {
  Building2,
  Mail,
  Phone,
  MapPin,
  User,
  ArrowLeft,
  CheckCircle2,
  Sparkles,
  ShieldCheck,
} from "lucide-react";

export const Route = createFileRoute("/administration/$slug")({
  component: AdministrationDetail,
  loader: async ({ params }) => {
    const office = await getAdministrativeOfficeBySlug({ data: params.slug });
    if (!office) throw notFound();
    return { office };
  },
});

function AdministrationDetail() {
  const { office } = Route.useLoaderData();

  // Split responsibilities into readable lines if multiline
  const responsibilityList = office.responsibilities
    ? office.responsibilities
        .split("\n")
        .map((r: string) => r.trim())
        .filter((r: string) => r.length > 0)
    : [];

  return (
    <div className="flex min-h-screen flex-col bg-gray-50">
      {/* Hero Header */}
      {office.main_image_url || office.image ? (
        <div className="relative w-full h-[40vh] sm:h-[45vh] min-h-[280px] sm:min-h-[350px] lg:min-h-[480px]">
          <img
            src={office.main_image_url || office.image!}
            alt={office.office_name}
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-black/30" />
          <div className="absolute inset-0 flex items-end pb-8 sm:pb-12 md:pb-16 animate-fade-in-up">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
              {office.office_category && (
                <span className="inline-block rounded-full bg-white/20 backdrop-blur-sm px-3 sm:px-4 py-1 sm:py-1.5 text-xs font-bold uppercase tracking-wider text-white mb-3 sm:mb-4 border border-white/30 shadow-sm">
                  {office.office_category}
                </span>
              )}
              <h1 className="font-heading text-2xl sm:text-4xl md:text-5xl lg:text-7xl font-extrabold text-white tracking-tight drop-shadow-xl leading-tight break-words">
                {office.office_name}
              </h1>
            </div>
          </div>
        </div>
      ) : (
        <div className="obu-gradient py-12 sm:py-20 md:py-28 px-4 sm:px-6 lg:px-8 relative overflow-hidden text-white">
          <div className="absolute inset-0 opacity-10 mix-blend-overlay pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-[600px] h-[600px] bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white/15 to-transparent blur-3xl pointer-events-none" />

          <div className="max-w-7xl mx-auto relative z-10 animate-fade-in-up">
            {office.office_category && (
              <div className="inline-block px-3 sm:px-4 py-1 sm:py-1.5 mb-3 sm:mb-5 text-xs font-bold tracking-[0.2em] text-[#186a42] bg-[#ffcc00] rounded-full uppercase shadow-lg">
                {office.office_category}
              </div>
            )}
            <h1 className="font-heading text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-tight break-words">
              {office.office_name}
            </h1>
          </div>
        </div>
      )}

      <main className="container mx-auto max-w-7xl flex-grow px-3 sm:px-6 lg:px-8 py-8 sm:py-10 md:py-16">
        <div className="mb-6 sm:mb-10 animate-fade-in-up">
          <Breadcrumbs
            items={[
              { label: "Administrative Offices", to: "/administration" },
              { label: office.office_name },
            ]}
          />
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:gap-16">
          {/* Main Content (8 cols) */}
          <div className="space-y-8 sm:space-y-12 lg:col-span-8 animate-fade-in-up">
            {/* About Section */}
            {office.description && (
              <section className="bg-white rounded-2xl sm:rounded-3xl p-5 sm:p-8 md:p-10 border border-gray-100 shadow-md">
                <div className="flex items-center gap-3 sm:gap-4 mb-4 sm:mb-6">
                  <div className="w-8 sm:w-10 h-1.5 obu-gradient rounded-full" />
                  <h2 className="font-heading text-xl sm:text-2xl md:text-3xl font-extrabold text-gray-900 tracking-tight">
                    About the Office
                  </h2>
                </div>
                <div className="prose prose-base sm:prose-lg prose-[#186a42] max-w-none text-gray-700 leading-relaxed font-medium whitespace-pre-wrap">
                  {office.description}
                </div>
              </section>
            )}

            {/* Responsibilities Section */}
            {office.responsibilities && (
              <section className="bg-white rounded-2xl sm:rounded-3xl p-5 sm:p-8 md:p-10 border border-gray-100 shadow-md">
                <div className="flex items-center gap-3 sm:gap-4 mb-4 sm:mb-6">
                  <div className="w-8 sm:w-10 h-1.5 bg-[#ffcc00] rounded-full" />
                  <h2 className="font-heading text-xl sm:text-2xl md:text-3xl font-extrabold text-gray-900 tracking-tight flex items-center gap-2">
                    <ShieldCheck className="w-6 h-6 sm:w-7 sm:h-7 text-[#186a42] shrink-0" />
                    Key Mandates & Responsibilities
                  </h2>
                </div>

                {responsibilityList.length > 1 ? (
                  <div className="grid gap-3 sm:gap-4 mt-4 sm:mt-6">
                    {responsibilityList.map((resp: string, idx: number) => (
                      <div
                        key={idx}
                        className="flex items-start gap-3 sm:gap-4 p-3.5 sm:p-4 rounded-xl sm:rounded-2xl bg-gray-50 border border-gray-100 hover:border-[#186a42]/30 transition-colors"
                      >
                        <div className="mt-0.5 p-1 rounded-full bg-[#186a42]/10 text-[#186a42] shrink-0">
                          <CheckCircle2 className="w-4 h-4" />
                        </div>
                        <p className="text-gray-700 text-sm sm:text-base font-medium leading-relaxed break-words min-w-0 flex-1">
                          {resp}
                        </p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="prose prose-base sm:prose-lg prose-[#186a42] max-w-none text-gray-700 leading-relaxed font-medium whitespace-pre-wrap">
                    {office.responsibilities}
                  </div>
                )}
              </section>
            )}
          </div>

          {/* Sidebar (4 cols) */}
          <aside
            className="lg:col-span-4 space-y-8 animate-fade-in-up"
            style={{ animationDelay: "150ms" }}
          >
            <div className="sticky top-28 bg-white rounded-2xl sm:rounded-3xl p-5 sm:p-8 border border-gray-100 shadow-xl relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-2 obu-gradient" />

              <h3 className="font-heading text-xl font-bold text-gray-900 mb-6 tracking-tight flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-[#186a42]" />
                Office Information
              </h3>

              <dl className="space-y-6">
                {office.head_of_office && (
                  <div className="flex items-start gap-4">
                    <div className="mt-1 bg-[#186a42]/10 p-2.5 rounded-xl text-[#186a42] shrink-0">
                      <User className="w-4 h-4" />
                    </div>
                    <div>
                      <dt className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-1">
                        Head of Office
                      </dt>
                      <dd className="text-base font-bold text-gray-900">{office.head_of_office}</dd>
                    </div>
                  </div>
                )}

                {office.office_category && (
                  <div className="flex items-start gap-4">
                    <div className="mt-1 bg-[#186a42]/10 p-2.5 rounded-xl text-[#186a42] shrink-0">
                      <Building2 className="w-4 h-4" />
                    </div>
                    <div>
                      <dt className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-1">
                        Office Category
                      </dt>
                      <dd className="text-sm font-semibold text-gray-900">
                        {office.office_category}
                      </dd>
                    </div>
                  </div>
                )}

                {office.email && (
                  <div className="flex items-start gap-4">
                    <div className="mt-1 bg-[#186a42]/10 p-2.5 rounded-xl text-[#186a42] shrink-0">
                      <Mail className="w-4 h-4" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <dt className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-1">
                        Official Email
                      </dt>
                      <dd className="text-sm font-semibold">
                        <a
                          href={`mailto:${office.email}`}
                          className="text-[#186a42] hover:underline break-all"
                        >
                          {office.email}
                        </a>
                      </dd>
                    </div>
                  </div>
                )}

                {office.phone && (
                  <div className="flex items-start gap-4">
                    <div className="mt-1 bg-[#186a42]/10 p-2.5 rounded-xl text-[#186a42] shrink-0">
                      <Phone className="w-4 h-4" />
                    </div>
                    <div>
                      <dt className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-1">
                        Telephone
                      </dt>
                      <dd className="text-sm font-semibold">
                        <a
                          href={`tel:${office.phone}`}
                          className="text-gray-900 hover:text-[#186a42] transition-colors"
                        >
                          {office.phone}
                        </a>
                      </dd>
                    </div>
                  </div>
                )}

                {office.location && (
                  <div className="flex items-start gap-4">
                    <div className="mt-1 bg-[#186a42]/10 p-2.5 rounded-xl text-[#186a42] shrink-0">
                      <MapPin className="w-4 h-4" />
                    </div>
                    <div>
                      <dt className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-1">
                        Campus Location
                      </dt>
                      <dd className="text-sm font-semibold text-gray-900">{office.location}</dd>
                    </div>
                  </div>
                )}

                {!office.head_of_office && !office.email && !office.phone && !office.location && (
                  <p className="text-sm text-gray-500 italic bg-gray-50 p-4 rounded-2xl text-center">
                    No direct contact information is currently listed.
                  </p>
                )}
              </dl>

              <div className="mt-8 pt-6 border-t border-gray-100">
                <Link
                  to="/administration"
                  className="w-full inline-flex items-center justify-center gap-2 px-4 py-3 rounded-2xl bg-gray-50 hover:bg-gray-100 text-gray-700 font-bold text-xs uppercase tracking-wider transition-colors"
                >
                  <ArrowLeft className="w-4 h-4" />
                  All Administrative Offices
                </Link>
              </div>
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
}
