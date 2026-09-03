import { createFileRoute, Link } from "@tanstack/react-router";
import { ChevronRight } from "lucide-react";

export const Route = createFileRoute("/about/president-message")({
  head: () => ({
    meta: [
      { title: "President's Message — Oda Bultum University" },
      { name: "description", content: "Message from the President of Oda Bultum University." },
    ],
  }),
  component: PresidentMessagePage,
  errorComponent: ({ error }) => {
    console.error("PAGE ERROR:", error);
    return <div>Error: {error?.message || "Unknown error"}</div>;
  },
});

const MESSAGE_PARAGRAPHS = [
  "I am happy to invite you to explore our university's wisdom. The university is one of the youngest, energetic and leading public higher education institutions, located 326 kilometers east of the national capital Addis Ababa, in the center of the sociable community of Eastern Oromia, Ethiopia. I have been entrusted with academic excellence, research quality, community engagement and enriching the quality of student life, and I have gained a deep respect for the culture and tradition in our university.",
  'Recently, the university was differentiated into a comprehensive university with a core responsibility focusing on producing ethical, competent and qualified graduates, problem-solving research outreaches, and demand-driven community services. The university has set its motto as "Productive Mind for Development" and a 10-year strategic plan to be one of the recognized universities in Eastern Africa through social development, natural resource conservation, technology transfer and agro-processing by 2030.',
];

function PresidentMessagePage() {
  return (
    <div className="min-h-screen bg-[#f8fafc] font-sans text-gray-800">
      {/* Page Header with Breadcrumbs */}
      <div className="bg-[#0f2e53] text-white py-16 px-4 md:px-8 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[url('/campuses.jpg')] bg-cover bg-center mix-blend-overlay"></div>
        <div className="container mx-auto max-w-6xl relative z-10">
          <div className="flex flex-col items-center text-center">
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-6 font-serif">
              President's Message
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
              <span className="text-[#ffcc00]">President's Message</span>
            </nav>
          </div>
        </div>
      </div>

      <main className="container mx-auto px-4 py-20 md:px-6 lg:px-8 max-w-6xl">
        <div className="grid gap-12 lg:gap-16 lg:grid-cols-12 items-start">
          {/* Left Side: President's Photograph */}
          <div className="lg:col-span-5 order-1 lg:order-1">
            <div className="relative rounded-2xl bg-white p-3 shadow-xl border border-gray-100/60 transform transition-transform duration-500 hover:-translate-y-1">
              <div className="absolute inset-0 bg-gradient-to-tr from-[#186a42]/10 to-transparent rounded-2xl -z-10 blur-xl"></div>
              <div className="relative aspect-[3/4] overflow-hidden rounded-xl bg-gray-100">
                <img
                  src="/President-1.jpeg"
                  alt="President of Oda Bultum University"
                  className="w-full h-full object-contain bg-gray-50"
                />
              </div>
            </div>
          </div>

          {/* Right Side: Message Content */}
          <div className="lg:col-span-7 order-2 lg:order-2 flex flex-col justify-center h-full space-y-8">
            <div>
              <p className="text-xs font-bold tracking-widest uppercase text-[#186a42] mb-3">
                Message from the President
              </p>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0f2e53] font-serif leading-tight">
                President's Message
              </h2>
              <div className="mt-6 h-1 w-20 bg-[#ffcc00] rounded-full" />
            </div>

            <div className="prose prose-lg max-w-none text-gray-600 leading-relaxed space-y-6">
              <p className="text-lg leading-relaxed text-gray-700">{MESSAGE_PARAGRAPHS[0]}</p>
              <p className="text-lg leading-relaxed text-gray-700">{MESSAGE_PARAGRAPHS[1]}</p>
            </div>

            {/* Elegant Quote Treatment */}
            <div className="mt-6 relative">
              <blockquote className="bg-white border-l-4 border-[#186a42] p-8 rounded-r-xl shadow-sm text-center relative z-10">
                <p className="text-2xl font-bold text-[#0f2e53] font-serif italic">
                  "Productive Mind for Development"
                </p>
                <footer className="mt-3 text-sm font-medium text-gray-500 uppercase tracking-widest">
                  — University Motto
                </footer>
              </blockquote>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
