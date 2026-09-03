import { createFileRoute, notFound, Link } from "@tanstack/react-router";
import { Breadcrumbs } from "@/frontend/components/Breadcrumbs";
import {
  Mail,
  Phone,
  User as UserIcon,
  Building2,
  ArrowLeft,
  Award,
  Sparkles,
  BookOpen,
} from "lucide-react";
import { supabase } from "@/frontend/lib/supabase";

export const Route = createFileRoute("/leadership/$slug")({
  component: LeadershipDetail,
  loader: async ({ params }) => {
    const { data: leader, error } = await supabase
      .from("leadership")
      .select(
        `
        *,
        media ( file_url )
      `,
      )
      .eq("slug", params.slug)
      .eq("status", "active")
      .single();

    if (error || !leader) {
      if (error && error.code !== "PGRST116") {
        console.error("Failed to fetch leader:", error);
      }
      throw notFound();
    }

    return { leader };
  },
});

function LeadershipDetail() {
  const { leader } = Route.useLoaderData();

  const profileUrl =
    leader.media && !Array.isArray(leader.media) && (leader.media as { file_url?: string }).file_url
      ? (leader.media as { file_url?: string }).file_url
      : null;

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* Hero Banner */}
      <div className="obu-gradient py-20 md:py-28 px-4 sm:px-6 lg:px-8 relative overflow-hidden text-white">
        <div className="absolute inset-0 opacity-10 mix-blend-overlay pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white/15 to-transparent blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto relative z-10 animate-fade-in-up">
          <div className="inline-flex items-center gap-2 rounded-full bg-[#ffcc00] px-4 py-1.5 text-xs font-bold uppercase tracking-[0.2em] text-[#186a42] mb-5 shadow-lg">
            <Award className="w-3.5 h-3.5" />
            {leader.position || "Executive Leadership"}
          </div>
          <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-tight">
            {leader.full_name}
          </h1>
          {leader.department_office && (
            <p className="mt-3 text-lg md:text-xl text-white/90 font-medium flex items-center gap-2">
              <Building2 className="w-5 h-5 text-[#ffcc00]" />
              {leader.department_office}
            </p>
          )}
        </div>
      </div>

      <main className="flex-grow container mx-auto px-4 py-10 md:py-16 max-w-7xl">
        <div className="mb-10 animate-fade-in-up">
          <Breadcrumbs
            items={[
              { label: "University Leadership", to: "/leadership" },
              { label: leader.full_name },
            ]}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
          {/* Left Column: Portrait & Contact Sidebar */}
          <div className="lg:col-span-4 space-y-8 animate-fade-in-up">
            {/* Portrait Card */}
            <div className="bg-white rounded-3xl p-3 border border-gray-100/80 shadow-xl overflow-hidden relative group">
              <div className="aspect-[3/4] w-full bg-gray-100 rounded-2xl overflow-hidden relative flex items-center justify-center shadow-inner">
                {profileUrl ? (
                  <img
                    src={profileUrl}
                    alt={leader.full_name}
                    className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-700"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gray-50 text-gray-300">
                    <UserIcon className="h-32 w-32" />
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent pointer-events-none" />
                <div className="absolute bottom-4 left-4 right-4">
                  <span className="inline-block px-3.5 py-1 bg-[#ffcc00] text-[#186a42] text-xs font-bold uppercase tracking-wider rounded-full shadow">
                    {leader.position}
                  </span>
                </div>
              </div>
            </div>

            {/* Contact Details Card */}
            <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-xl relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-2 obu-gradient" />
              <h3 className="font-heading text-xl font-bold text-gray-900 mb-6 tracking-tight flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-[#186a42]" />
                Contact & Office Details
              </h3>

              <ul className="space-y-6">
                {leader.email && (
                  <li className="flex items-start gap-4">
                    <div className="mt-1 bg-[#186a42]/10 p-2.5 rounded-xl text-[#186a42] shrink-0">
                      <Mail className="w-4 h-4" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-1">
                        Email Address
                      </div>
                      <a
                        href={`mailto:${leader.email}`}
                        className="text-sm font-semibold text-[#186a42] hover:underline break-all"
                      >
                        {leader.email}
                      </a>
                    </div>
                  </li>
                )}

                {leader.phone && (
                  <li className="flex items-start gap-4">
                    <div className="mt-1 bg-[#186a42]/10 p-2.5 rounded-xl text-[#186a42] shrink-0">
                      <Phone className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-1">
                        Phone Number
                      </div>
                      <a
                        href={`tel:${leader.phone}`}
                        className="text-sm font-semibold text-gray-900 hover:text-[#186a42] transition-colors"
                      >
                        {leader.phone}
                      </a>
                    </div>
                  </li>
                )}

                {leader.department_office && (
                  <li className="flex items-start gap-4">
                    <div className="mt-1 bg-[#186a42]/10 p-2.5 rounded-xl text-[#186a42] shrink-0">
                      <Building2 className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-1">
                        Department / Office
                      </div>
                      <div className="text-sm font-semibold text-gray-900">
                        {leader.department_office}
                      </div>
                    </div>
                  </li>
                )}

                {!leader.email && !leader.phone && !leader.department_office && (
                  <li className="text-sm text-gray-500 italic bg-gray-50 p-4 rounded-2xl text-center">
                    No direct contact information is currently listed.
                  </li>
                )}
              </ul>

              <div className="mt-8 pt-6 border-t border-gray-100">
                <Link
                  to="/leadership"
                  className="w-full inline-flex items-center justify-center gap-2 px-4 py-3 rounded-2xl bg-gray-50 hover:bg-gray-100 text-gray-700 font-bold text-xs uppercase tracking-wider transition-colors"
                >
                  <ArrowLeft className="w-4 h-4" />
                  All Leadership Profiles
                </Link>
              </div>
            </div>
          </div>

          {/* Right Column: Biography & Mandate */}
          <div
            className="lg:col-span-8 space-y-10 animate-fade-in-up"
            style={{ animationDelay: "150ms" }}
          >
            <div className="bg-white rounded-3xl p-8 sm:p-10 lg:p-12 border border-gray-100 shadow-xl relative overflow-hidden">
              <div className="flex items-center gap-4 mb-8">
                <div className="w-10 h-1.5 obu-gradient rounded-full" />
                <h2 className="font-heading text-3xl font-extrabold text-gray-900 tracking-tight">
                  Executive Profile & Biography
                </h2>
              </div>

              {leader.biography ? (
                <div className="prose prose-lg prose-[#186a42] max-w-none text-gray-700 leading-relaxed font-medium whitespace-pre-wrap">
                  {leader.biography}
                </div>
              ) : (
                <div className="bg-gray-50 rounded-2xl p-8 text-center text-gray-500 font-medium">
                  <BookOpen className="mx-auto h-12 w-12 text-gray-300 mb-3" />
                  Biography details for {leader.full_name} are currently being prepared.
                </div>
              )}

              {/* Institutional Mandate Callout */}
              <div className="mt-12 p-8 rounded-2xl bg-gradient-to-br from-[#186a42]/5 via-transparent to-[#ffcc00]/10 border border-[#186a42]/10 relative">
                <div className="flex items-start gap-4">
                  <div className="bg-[#186a42] p-2.5 rounded-xl text-white shrink-0 mt-1">
                    <Award className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-heading text-lg font-bold text-gray-900 mb-1">
                      Institutional Commitment
                    </h3>
                    <p className="text-sm text-gray-600 leading-relaxed">
                      As part of Oda Bultum University's executive stewardship, this office is
                      committed to upholding academic excellence, ethical scholarship, and
                      empowering regional socioeconomic transformation.
                    </p>
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
