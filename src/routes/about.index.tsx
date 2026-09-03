import { createFileRoute, Link } from "@tanstack/react-router";
import { ChevronRight, Target, Eye } from "lucide-react";
import { Calendar, FileText, Settings, Users } from "lucide-react";

export const Route = createFileRoute("/about/")({
  component: MissionVisionPage,
  head: () => ({
    meta: [
      { title: "Mission & Vision — Oda Bultum University" },
      {
        name: "description",
        content:
          "Oda Bultum University's mission and vision for academic excellence, research, and community development.",
      },
    ],
  }),
});

function MissionVisionPage() {
  return (
    <div className="min-h-screen bg-[#f8fafc] font-sans text-gray-800">
      {/* Page Header with Breadcrumbs */}
      <div className="bg-[#0f2e53] text-white py-16 px-4 md:px-8 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[url('/campuses.jpg')] bg-cover bg-center mix-blend-overlay"></div>
        <div className="container mx-auto max-w-6xl relative z-10">
          <div className="flex flex-col items-center text-center">
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-6 font-serif">
              Mission & Vision
            </h1>
            <nav className="flex items-center text-sm text-white/80 font-medium tracking-wide">
              <Link to="/" className="hover:text-[#ffcc00] transition-colors">
                Home
              </Link>
              <ChevronRight className="w-4 h-4 mx-2 opacity-50" />
              <Link to="/about" className="hover:text-[#ffcc00] transition-colors">
                About Us
              </Link>
              <ChevronRight className="w-4 h-4 mx-2 opacity-50" />
              <span className="text-[#ffcc00]">Mission & Vision</span>
            </nav>
          </div>
        </div>
      </div>

      <main className="container mx-auto px-4 py-16 md:px-6 lg:px-8 max-w-6xl">
        {/* Library Image Section */}
        <div className="mb-16">
          <div className="relative rounded-2xl overflow-hidden shadow-xl border border-gray-100 group">
            <div className="aspect-[16/9] md:aspect-[21/9] w-full">
              <img
                src="/library.jpg"
                alt="Oda Bultum University Library"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-60"></div>
          </div>
        </div>

        {/* Mission & Vision Cards */}
        <div className="grid gap-8 md:grid-cols-2 lg:gap-12">
          {/* Mission Card */}
          <div className="bg-white rounded-2xl p-8 shadow-md border-t-4 border-[#186a42] flex flex-col items-center text-center transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
            <div className="bg-[#186a42]/10 p-4 rounded-full mb-6 text-[#186a42]">
              <Target className="w-10 h-10" />
            </div>
            <h2 className="text-3xl font-bold text-[#0f2e53] font-serif mb-4">Mission</h2>
            <div className="w-12 h-1 bg-[#ffcc00] mb-6 rounded-full"></div>
            <p className="text-lg leading-relaxed text-gray-600 flex-grow">
              To produce ethical, competent graduates; conduct problem-solving research; and render
              demand-based community engagement in a sustainable manner.
            </p>
          </div>

          {/* Vision Card */}
          <div className="bg-white rounded-2xl p-8 shadow-md border-t-4 border-[#0f2e53] flex flex-col items-center text-center transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
            <div className="bg-[#0f2e53]/10 p-4 rounded-full mb-6 text-[#0f2e53]">
              <Eye className="w-10 h-10" />
            </div>
            <h2 className="text-3xl font-bold text-[#0f2e53] font-serif mb-4">Vision</h2>
            <div className="w-12 h-1 bg-[#ffcc00] mb-6 rounded-full"></div>
            <p className="text-lg leading-relaxed text-gray-600 flex-grow">
              To be a recognized university in Eastern Africa through social development, natural
              resource conservation, technology transfer and agro-processing by 2030.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
