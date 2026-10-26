import { createFileRoute, Link } from "@tanstack/react-router";
import { ChevronRight, Quote } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { getPresidentInfo } from "@/backend/api";

export const Route = createFileRoute("/about/president-message")({
  head: () => ({
    meta: [
      { title: "President's Message — Oda Bultum University" },
      { name: "description", content: "Official message from the President of Oda Bultum University, Dr. Muktar Mohammed." },
    ],
  }),
  component: PresidentMessagePage,
  errorComponent: ({ error }: { error?: any }) => {
    console.error("PAGE ERROR:", error);
    return <div>Error: {error?.message || "Unknown error"}</div>;
  },
});

const DEFAULT_PARAGRAPHS: string[] = [
  "Welcome to Oda Bultum University’s official portal. I am deeply honored to invite you to explore our university’s wisdom, achievements, and vibrant academic community. The university is one of the energetic, forward-looking public higher education institutions in Ethiopia, located 326 kilometers east of the national capital Addis Ababa, in the heart of the hospitable and culturally rich community of West Hararghe, Oromia.",
  "Entrusted with academic excellence, high-impact research, and meaningful community outreach, we have cultivated an institutional environment grounded in integrity, innovation, and service. Recently differentiated as a comprehensive university, Oda Bultum University focuses on producing ethical, competent, and versatile graduates equipped to address national priorities and global challenges.",
  "Under our institutional motto, \"Productive Mind for Development\", our 10-year strategic plan positions Oda Bultum University to become an internationally recognized center of excellence in Eastern Africa by 2030, championing agro-processing, natural resource conservation, modern technology transfer, and socio-economic empowerment.",
  "As we educate our students to lead purposeful lives and make principled decisions, our top priority remains fostering a productive mindset across all academic units and collaborative partnerships. I warmly invite prospective students, researchers, alumni, and stakeholders to partner with us as we build a transformative future together.",
];

function PresidentMessagePage() {
  const { data: president } = useQuery({
    queryKey: ["president"],
    queryFn: () => getPresidentInfo(),
  });

  const presidentName = president?.name || "Dr. Muktar Mohammed";
  const presidentPhoto = president?.photo || "/President.jpeg";

  // Parse paragraphs from biography if set, otherwise use default paragraphs
  const messageParagraphs: string[] = president?.biography
    ? president.biography
        .split(/\n\s*\n/)
        .map((p: string) => p.trim())
        .filter(Boolean)
    : DEFAULT_PARAGRAPHS;

  return (
    <div className="min-h-screen bg-[#f8fafc] font-sans text-gray-800">
      {/* Page Header with Breadcrumbs */}
      <div className="bg-[#0c3822] text-white py-16 px-4 md:px-8 relative overflow-hidden">
        <div className="absolute inset-0 opacity-15 bg-[url('/campuses.jpg')] bg-cover bg-center mix-blend-overlay"></div>
        <div className="container mx-auto max-w-6xl relative z-10">
          <div className="flex flex-col items-center text-center">
            <span className="text-[#ffcc00] text-xs font-bold uppercase tracking-widest mb-3">
              Institutional Leadership
            </span>
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4 font-serif">
              President's Message
            </h1>
            <p className="text-white/80 max-w-xl text-sm md:text-base mb-6">
              A personal welcome and strategic vision from {presidentName}, President of Oda Bultum University.
            </p>
            <nav className="flex items-center text-xs md:text-sm text-white/80 font-medium tracking-wide">
              <Link to="/" className="hover:text-[#ffcc00] transition-colors">
                Home
              </Link>
              <ChevronRight className="w-4 h-4 mx-2 opacity-50" />
              <Link to="/about" className="hover:text-[#ffcc00] transition-colors">
                About Us
              </Link>
              <ChevronRight className="w-4 h-4 mx-2 opacity-50" />
              <span className="text-[#ffcc00]">President's Message</span>
            </nav>
          </div>
        </div>
      </div>

      <main className="container mx-auto px-4 py-16 md:py-24 md:px-6 lg:px-8 max-w-6xl">
        <div className="grid gap-12 lg:gap-16 lg:grid-cols-12 items-start">
          {/* Left Side: President's Photograph Card */}
          <div className="lg:col-span-5 order-1 lg:order-1 lg:sticky lg:top-28">
            <div className="relative rounded-2xl bg-white p-4 shadow-xl border border-gray-100 transform transition-transform duration-500 hover:-translate-y-1">
              <div className="absolute inset-0 bg-gradient-to-tr from-[#186a42]/15 to-[#ffcc00]/10 rounded-2xl -z-10 blur-xl"></div>
              <div className="relative aspect-[4/5] overflow-hidden rounded-xl bg-gray-100 shadow-inner">
                <img
                  src={presidentPhoto}
                  alt={presidentName}
                  className="w-full h-full object-cover object-[center_top] transition-transform duration-700 hover:scale-105"
                  onError={(e) => {
                    e.currentTarget.src = "/President.jpeg";
                  }}
                />
              </div>

              {/* President Title Badge */}
              <div className="mt-5 text-center px-2">
                <h3 className="font-heading text-2xl font-bold text-gray-900">
                  {presidentName}
                </h3>
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#186a42] mt-1.5">
                  President, Oda Bultum University
                </p>
                <div className="mt-4 pt-4 border-t border-gray-100 flex items-center justify-center gap-3 text-xs text-gray-500">
                  <span>Chiro, West Hararghe, Ethiopia</span>
                </div>
              </div>
            </div>

            {/* University Motto Quote Card */}
            <div className="mt-6 rounded-2xl bg-[#0c3822] text-white p-6 shadow-lg relative overflow-hidden">
              <Quote className="absolute -bottom-3 -right-3 w-20 h-20 text-white/5 pointer-events-none" />
              <p className="text-lg font-serif italic text-[#ffcc00] leading-snug">
                "Productive Mind for Development"
              </p>
              <p className="mt-2 text-xs font-semibold uppercase tracking-wider text-white/70">
                — Official University Motto
              </p>
            </div>
          </div>

          {/* Right Side: Message Content */}
          <div className="lg:col-span-7 order-2 lg:order-2 flex flex-col justify-center space-y-8 bg-white p-8 md:p-12 rounded-3xl shadow-sm border border-gray-100">
            <div>
              <span className="inline-block px-3 py-1 bg-[#186a42]/10 text-[#186a42] text-xs font-bold uppercase tracking-widest rounded-full mb-3">
                Official Address
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0c3822] font-serif leading-tight">
                Welcome to Oda Bultum University
              </h2>
              <div className="mt-4 h-1.5 w-24 bg-gradient-to-r from-[#186a42] via-[#ffcc00] to-[#186a42] rounded-full" />
            </div>

            <div className="prose prose-lg max-w-none text-gray-700 leading-relaxed space-y-6 text-[16px] md:text-[17px]">
              {messageParagraphs.map((paragraph, index) => (
                <p key={index} className="leading-relaxed">
                  {paragraph}
                </p>
              ))}
            </div>

            {/* Presidential Signature Block */}
            <div className="pt-8 border-t border-gray-200/80 flex items-center justify-between flex-wrap gap-4">
              <div>
                <p className="font-heading font-bold text-xl text-gray-900">
                  {presidentName}
                </p>
                <p className="text-sm font-semibold text-[#186a42]">
                  President, Oda Bultum University
                </p>
                <p className="text-xs text-gray-500 mt-0.5">
                  Office of the President &bull; Chiro, Ethiopia
                </p>
              </div>

              <Link
                to="/about"
                className="inline-flex items-center gap-2 text-sm font-bold text-[#186a42] hover:text-[#0c3822] transition-colors"
              >
                Learn More About OBU &rarr;
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
