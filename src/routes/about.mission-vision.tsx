import { createFileRoute, Link } from "@tanstack/react-router";
import { Target, Eye, Star, ChevronRight } from "lucide-react";

export const Route = createFileRoute("/about/mission-vision")({
  head: () => ({
    meta: [
      { title: "Mission & Vision — Oda Bultum University" },
      {
        name: "description",
        content:
          "The mission, vision, and core values of Oda Bultum University — producing ethical, competent graduates and conducting high-impact research.",
      },
    ],
  }),
  component: MissionVisionPage,
});

const VALUES = [
  { title: "Academic Excellence", desc: "Upholding the highest standards of teaching, learning, and scholarship across all disciplines." },
  { title: "Integrity", desc: "Fostering an institutional culture grounded in honesty, transparency, and ethical conduct." },
  { title: "Innovation", desc: "Encouraging creative thinking, applied research, and entrepreneurial solutions to real-world challenges." },
  { title: "Community Service", desc: "Engaging with local and national communities to deliver demand-based, impactful services." },
  { title: "Inclusiveness", desc: "Welcoming students, staff, and partners from all backgrounds in an equitable learning environment." },
  { title: "Sustainability", desc: "Promoting environmentally conscious practices and long-term development in all our programs." },
];

function MissionVisionPage() {
  return (
    <main id="main-content" className="bg-white">
      {/* Hero Banner */}
      <section className="relative obu-gradient py-20 px-4 overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0 bg-[url('/logo.png')] bg-center bg-no-repeat bg-contain" />
        </div>
        <div className="container mx-auto max-w-4xl text-center relative z-10">
          <p className="text-[#ffcc00] font-semibold text-sm tracking-widest uppercase mb-3">Our Purpose &amp; Direction</p>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">Mission &amp; Vision</h1>
          <p className="text-white/80 text-lg max-w-2xl mx-auto">
            The guiding principles that shape everything we do at Oda Bultum University.
          </p>
          <nav aria-label="Breadcrumb" className="flex items-center justify-center gap-2 mt-6 text-sm text-white/70">
            <Link to="/" className="hover:text-[#ffcc00] transition-colors">Home</Link>
            <ChevronRight className="h-3.5 w-3.5" />
            <Link to="/about" className="hover:text-[#ffcc00] transition-colors">About Us</Link>
            <ChevronRight className="h-3.5 w-3.5" />
            <span className="text-[#ffcc00] font-medium">Mission &amp; Vision</span>
          </nav>
        </div>
      </section>

      {/* Mission & Vision Cards */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-5xl grid md:grid-cols-2 gap-10">
          <div className="flex flex-col items-start p-8 rounded-2xl border border-emerald-100 bg-gradient-to-br from-emerald-50/60 to-white shadow-sm hover:shadow-md transition-shadow">
            <div className="w-14 h-14 rounded-xl bg-[#186a42]/10 flex items-center justify-center mb-5">
              <Target className="h-7 w-7 text-[#186a42]" />
            </div>
            <h2 className="text-2xl font-bold text-[#0c3822] mb-4">Mission</h2>
            <div className="w-12 h-1 bg-[#ffcc00] rounded-full mb-5" />
            <p className="text-gray-700 leading-relaxed text-[15px]">
              To produce ethical, competent, and versatile graduates; conduct problem-solving research; and render demand-based community engagement activities that assure social, economic, and political goals in the locality and beyond in a sustainable manner.
            </p>
          </div>
          <div className="flex flex-col items-start p-8 rounded-2xl border border-blue-100 bg-gradient-to-br from-blue-50/40 to-white shadow-sm hover:shadow-md transition-shadow">
            <div className="w-14 h-14 rounded-xl bg-[#1a5276]/10 flex items-center justify-center mb-5">
              <Eye className="h-7 w-7 text-[#1a5276]" />
            </div>
            <h2 className="text-2xl font-bold text-[#0c3822] mb-4">Vision</h2>
            <div className="w-12 h-1 bg-[#ffcc00] rounded-full mb-5" />
            <p className="text-gray-700 leading-relaxed text-[15px]">
              To be a recognized university in Eastern Africa through social development, natural resource conservation, and modern technology transfer — becoming an internationally accredited center of excellence by 2030.
            </p>
          </div>
        </div>
      </section>

      {/* Motto */}
      <section className="py-12 px-4 bg-[#0c3822]">
        <div className="container mx-auto max-w-3xl text-center">
          <p className="text-[#ffcc00] font-semibold text-sm tracking-widest uppercase mb-3">Institutional Motto</p>
          <blockquote className="text-3xl md:text-4xl font-bold text-white leading-snug">
            "Productive Mind for Development"
          </blockquote>
        </div>
      </section>

      {/* Core Values */}
      <section className="py-20 px-4 bg-gray-50/60">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-[#186a42]/10 mb-4">
              <Star className="h-6 w-6 text-[#186a42]" />
            </div>
            <h2 className="text-3xl font-bold text-[#0c3822] mb-3">Core Values</h2>
            <div className="w-12 h-1 bg-[#ffcc00] rounded-full mx-auto" />
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {VALUES.map((v) => (
              <div key={v.title} className="p-6 bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md hover:border-[#186a42]/20 transition-all duration-200">
                <div className="w-2 h-8 bg-[#186a42] rounded-full mb-4" />
                <h3 className="font-bold text-[#0c3822] text-[15px] mb-2">{v.title}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-3xl text-center">
          <h2 className="text-2xl font-bold text-[#0c3822] mb-3">Learn More About OBU</h2>
          <p className="text-gray-600 mb-7">Explore our leadership, governance structure, and institutional history.</p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link to="/about/president-message" className="inline-flex items-center gap-2 px-6 py-3 bg-[#186a42] text-white rounded-xl font-semibold hover:bg-[#0c3822] transition-colors">
              President's Message
            </Link>
            <Link to="/about/governance" className="inline-flex items-center gap-2 px-6 py-3 border-2 border-[#186a42] text-[#186a42] rounded-xl font-semibold hover:bg-emerald-50 transition-colors">
              Governance
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
