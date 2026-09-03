import { createFileRoute, notFound, Link } from "@tanstack/react-router";
import { Breadcrumbs } from "@/frontend/components/Breadcrumbs";
import { getCommunityEngagementBySlug } from "@/backend/api";
import {
  FileText,
  Download,
  MapPin,
  Building,
  User,
  Mail,
  Phone,
  ArrowLeft,
  HeartHandshake,
  ShieldCheck,
  CheckCircle2,
  Sparkles,
} from "lucide-react";

export const Route = createFileRoute("/research/community-engagement/$slug")({
  head: () => ({
    meta: [
      { title: "Community Engagement Initiative — Oda Bultum University" },
      {
        name: "description",
        content:
          "Read detailed community objectives, target regions, extension materials, and direct contacts for this Oda Bultum University initiative.",
      },
    ],
  }),
  loader: async ({ params }) => {
    const engagement = await getCommunityEngagementBySlug({ data: params.slug });
    if (!engagement) throw notFound();
    return engagement;
  },
  component: CommunityEngagementDetail,
});

function CommunityEngagementDetail() {
  const engagement = Route.useLoaderData();

  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* Cover Hero */}
      <div className="relative obu-gradient py-20 md:py-28 px-4 sm:px-6 lg:px-8 text-white overflow-hidden">
        {engagement.image ? (
          <>
            <img
              src={engagement.image}
              alt={engagement.title}
              className="absolute inset-0 h-full w-full object-cover opacity-20 mix-blend-overlay"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#186a42] via-[#186a42]/80 to-transparent pointer-events-none" />
          </>
        ) : (
          <div className="absolute inset-0 opacity-10 mix-blend-overlay pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]" />
        )}

        <div className="max-w-7xl mx-auto relative z-10 animate-fade-in-up space-y-4">
          <Link
            to="/research/community-engagement"
            className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#ffcc00] hover:underline mb-2"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Community Engagement
          </Link>

          <div className="flex flex-wrap items-center gap-3">
            {engagement.category && (
              <span className="px-3 py-1 bg-[#ffcc00] text-[#186a42] text-xs font-black uppercase tracking-wider rounded-full shadow">
                {engagement.category}
              </span>
            )}
            <span className="px-3 py-1 text-xs font-bold uppercase tracking-wider rounded-full border bg-white/20 text-white backdrop-blur-sm">
              {engagement.status || "Active Initiative"}
            </span>
          </div>

          <h1 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-tight max-w-4xl">
            {engagement.title}
          </h1>
        </div>
      </div>

      {/* Breadcrumb Bar */}
      <div className="bg-gray-50 border-b border-gray-100 py-4 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <Breadcrumbs
            items={[
              { label: "Research", to: "/research" },
              {
                label: "Community Engagement",
                to: "/research/community-engagement",
              },
              { label: engagement.title },
            ]}
          />
        </div>
      </div>

      <main className="flex-grow">
        <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 md:py-16">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            {/* ─── MAIN COLUMN (8 COLS) ─── */}
            <div className="lg:col-span-8 space-y-12">
              {/* Image if available */}
              {engagement.image && (
                <div className="rounded-3xl overflow-hidden shadow-xl border border-gray-100 bg-gray-100 aspect-video w-full">
                  <img
                    src={engagement.image}
                    alt={engagement.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}

              {/* Description / Mission */}
              {engagement.description && (
                <section className="bg-white rounded-3xl p-8 sm:p-10 border border-gray-100 shadow-lg space-y-6">
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-xs font-bold text-[#186a42] uppercase tracking-[0.25em] bg-[#186a42]/10 px-3 py-1 rounded-full">
                      Initiative Scope
                    </span>
                    <h2 className="font-heading text-2xl font-extrabold text-gray-900 tracking-tight">
                      About the Initiative & Community Impact
                    </h2>
                  </div>

                  <div className="prose prose-lg max-w-none text-gray-700 font-normal leading-relaxed whitespace-pre-wrap">
                    {engagement.description}
                  </div>
                </section>
              )}

              {/* Downloadable Documents / Manuals if available */}
              {engagement.documents &&
                Array.isArray(engagement.documents) &&
                engagement.documents.length > 0 && (
                  <section className="bg-white rounded-3xl p-8 sm:p-10 border border-gray-100 shadow-lg space-y-6">
                    <div className="flex items-center gap-3">
                      <span className="font-mono text-xs font-bold text-[#186a42] uppercase tracking-[0.25em] bg-[#186a42]/10 px-3 py-1 rounded-full">
                        Resources
                      </span>
                      <h2 className="font-heading text-2xl font-extrabold text-gray-900 tracking-tight">
                        Extension Guides & Documents
                      </h2>
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2">
                      {engagement.documents.map((doc: Record<string, unknown>, idx: number) => {
                        const name = String(
                          doc["original_name"] || doc["file_name"] || "Resource Guide",
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

              {/* Community Extension Impact Charter */}
              <section className="bg-gray-50 rounded-3xl p-8 sm:p-10 border border-gray-200/70 space-y-4">
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#186a42]">
                  <HeartHandshake className="w-4 h-4 text-[#ffcc00]" />
                  Community Co-Creation & Extension Commitment
                </div>
                <h3 className="font-heading text-xl font-bold text-gray-900">
                  Empowering Local Livelihoods Through Knowledge
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed font-normal">
                  All community engagement programs at Oda Bultum University are co-designed with
                  local stakeholders to ensure culturally respectful, environmentally sustainable,
                  and long-term socio-economic benefits.
                </p>
              </section>
            </div>

            {/* ─── STICKY SIDEBAR (4 COLS) ─── */}
            <div className="lg:col-span-4 space-y-8 sticky top-28">
              {/* Key Details Card */}
              <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-xl space-y-6">
                <div className="flex items-center justify-between border-b border-gray-100 pb-4">
                  <h3 className="font-heading text-xl font-bold text-gray-900">Key Information</h3>
                  <span className="px-3 py-1 text-xs font-bold uppercase tracking-wider rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                    {engagement.status || "Active"}
                  </span>
                </div>

                <dl className="space-y-4 text-sm">
                  {engagement.responsible_office && (
                    <div className="bg-gray-50/80 p-4 rounded-2xl border border-gray-100">
                      <dt className="text-xs font-bold uppercase tracking-wider text-gray-400 flex items-center gap-1.5 mb-1">
                        <Building className="w-3.5 h-3.5 text-[#186a42]" />
                        Responsible Office
                      </dt>
                      <dd className="font-bold text-gray-900">{engagement.responsible_office}</dd>
                    </div>
                  )}

                  {engagement.contact_person && (
                    <div className="bg-gray-50/80 p-4 rounded-2xl border border-gray-100">
                      <dt className="text-xs font-bold uppercase tracking-wider text-gray-400 flex items-center gap-1.5 mb-1">
                        <User className="w-3.5 h-3.5 text-[#186a42]" />
                        Lead Coordinator
                      </dt>
                      <dd className="font-bold text-gray-900 text-base">
                        {engagement.contact_person}
                      </dd>
                    </div>
                  )}

                  {engagement.location && (
                    <div className="bg-gray-50/80 p-4 rounded-2xl border border-gray-100">
                      <dt className="text-xs font-bold uppercase tracking-wider text-gray-400 flex items-center gap-1.5 mb-1">
                        <MapPin className="w-3.5 h-3.5 text-[#186a42]" />
                        Target Location
                      </dt>
                      <dd className="font-bold text-gray-900">{engagement.location}</dd>
                    </div>
                  )}

                  {engagement.email && (
                    <div className="bg-gray-50/80 p-4 rounded-2xl border border-gray-100">
                      <dt className="text-xs font-bold uppercase tracking-wider text-gray-400 flex items-center gap-1.5 mb-1">
                        <Mail className="w-3.5 h-3.5 text-[#186a42]" />
                        Contact Email
                      </dt>
                      <dd className="font-semibold text-gray-900 truncate">
                        <a
                          href={`mailto:${engagement.email}`}
                          className="text-[#186a42] hover:underline"
                        >
                          {engagement.email}
                        </a>
                      </dd>
                    </div>
                  )}

                  {engagement.phone && (
                    <div className="bg-gray-50/80 p-4 rounded-2xl border border-gray-100">
                      <dt className="text-xs font-bold uppercase tracking-wider text-gray-400 flex items-center gap-1.5 mb-1">
                        <Phone className="w-3.5 h-3.5 text-[#186a42]" />
                        Direct Telephone
                      </dt>
                      <dd className="font-semibold text-gray-900">
                        <a
                          href={`tel:${engagement.phone}`}
                          className="text-[#186a42] hover:underline"
                        >
                          {engagement.phone}
                        </a>
                      </dd>
                    </div>
                  )}
                </dl>
              </div>

              {/* Get Involved Banner */}
              <div className="obu-gradient rounded-3xl p-8 text-white relative overflow-hidden shadow-xl space-y-4">
                <div className="relative z-10 space-y-3">
                  <span className="text-xs font-bold uppercase tracking-widest text-[#ffcc00] block">
                    Participate or Volunteer
                  </span>
                  <h4 className="font-heading text-xl font-bold">Join This Community Program</h4>
                  <p className="text-white/80 text-xs sm:text-sm leading-relaxed">
                    Are you a local farmer, student volunteer, healthcare worker, or NGO partner
                    wanting to participate?
                  </p>
                  <div className="pt-2">
                    <Link
                      to="/contact"
                      className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-white text-[#186a42] font-bold text-xs uppercase tracking-wider shadow-md hover:bg-gray-100 transition-colors"
                    >
                      Connect with Coordinator
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
