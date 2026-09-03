import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import {
  GraduationCap,
  Users,
  FlaskConical,
  ArrowRight,
  Calendar,
  Tag,
  BookOpen,
} from "lucide-react";
import {
  getLatestNews,
  getUpcomingEvents,
  getSiteStats,
  getHeroSlides,
  getHomepageSections,
  getQuickLinks,
  getPresidentInfo,
  getSiteSettings,
} from "@/backend/api";
import { useCollection } from "@/frontend/lib/store";

import { Button } from "@/frontend/components/Button";
import { SectionHeader } from "@/frontend/components/SectionHeader";
import { PageHero } from "@/frontend/components/PageHero";
import { ImageCarousel } from "@/frontend/components/ImageCarousel";

const campusHero = "/campus-hero.jpg";
const researchLab = "/research-lab.jpg";
const ahgu = "/ahgu.jpg";
const benef = "/benef.jpg";
const presidentImg = "https://obu.edu.et/wp-content/uploads/2026/01/President.jpeg";
const president1Img = "https://obu.edu.et/wp-content/uploads/2026/01/President.jpeg";

const heroSlides = [
  {
    src: "https://z-p3-scontent.fadd2-1.fna.fbcdn.net/v/t39.99422-6/750229681_1549692956664278_3814203319237201195_n.png?stp=c16.0.1248.1248a_dst-jpg_tt6&cstp=mx1248x1248&ctp=s552x414&_nc_cat=109&ccb=1-7&_nc_sid=50ad20&_nc_eui2=AeFFmI-LKjZThPsayeL5If_yx-kVYEcV1XPH6RVgRxXVcxAqhKpkCR8ulpZa_XvU7N9cYhpgM2XadrTc2UDESWzJ&_nc_ohc=P2sIG8AgrVUQ7kNvwERuwTF&_nc_oc=AdqXWLu7_lF8P1TMnYdMDw2gYldUNRMNpdD29r5Sljy1G__sovZ6YXfdjc6jUH48zQ4&_nc_zt=14&_nc_ht=z-p3-scontent.fadd2-1.fna&_nc_gid=0egbxcV1I0sZRe4a0fLHmQ&_nc_ss=7b2a8&oh=00_AQLpuuXP5QDH5qjNNPtkzwB0h2IP0AiMh8eUS2xLR9feKA&oe=6A9B9635",
    alt: "Oda Bultum University — Academic Excellence",
  },
  {
    src: "https://z-p3-scontent.fadd2-1.fna.fbcdn.net/v/t39.99422-6/730905546_1339509234180920_1875935067468081847_n.png?stp=c342.0.1365.1365a_dst-jpg_tt6&cstp=mx1365x1365&ctp=s552x414&_nc_cat=107&ccb=1-7&_nc_sid=714c7a&_nc_eui2=AeF2haa0ysAQA2BVkPP4Ebb4dDn5q6xYA-N0OfmrrFgD4zKgrPiT8ZRWiyUL6Q5v7jwxWQvl2gq1u1YMMsOfU6eK&_nc_ohc=Qrll2ZxBtOUQ7kNvwF21YzN&_nc_oc=AdpWESdO5c-3tHl-6RL5bkILVHF3lZBhtW3Y_FE1_kzIewKpv2MwAWJR6OVoVYWv4GQ&_nc_zt=14&_nc_ht=z-p3-scontent.fadd2-1.fna&_nc_gid=TCLaThVH09rIwRBkj5-QsA&_nc_ss=7b2a8&oh=00_AQLJvUYOqUR0uR-2uQjxjIpmEIQlzLuvwKlIwKGG2jnlDw&oe=6A9B913A",
    alt: "Oda Bultum University — Research & Community Impact",
  },
  {
    src: "https://z-p3-scontent.fadd2-1.fna.fbcdn.net/v/t39.30808-6/509428185_1247579247382818_3911525484726819377_n.jpg?stp=c166.0.823.823a_dst-jpg_tt6&cstp=mx823x823&ctp=s552x414&_nc_cat=104&ccb=1-7&_nc_sid=714c7a&_nc_eui2=AeENgXNnz8m4xDED9y9zKlp0ND91hL8EMAY0P3WEvwQwBqNYlw9pqRg854-zJKG2HCWWiWzeTrU7DC2UzWx1I7gK&_nc_ohc=RalYzlhcCW0Q7kNvwF1chJ4&_nc_oc=AdpAK19M1OECp_-oozLOuDxTUnIn04CrZsqZDVIshCqSnXH63zRJC51uSfaMi2UTMx8&_nc_zt=23&_nc_ht=z-p3-scontent.fadd2-1.fna&_nc_gid=gA_kz69dwFu-oOj-m-utTQ&_nc_ss=7b2a8&oh=00_AQI1XlN4a8NlCCdLycMEuhAyqoowLUVKlS0MPQeZy5VglA&oe=6A9BADDC",
    alt: "Oda Bultum University — Campus Life & Student Success",
  },
  {
    src: "https://z-p3-scontent.fadd1-1.fna.fbcdn.net/v/t39.99422-6/720603215_2455375454964000_4816870884213677354_n.png?stp=c214.0.853.853a_dst-jpg_tt6&cstp=mx853x853&ctp=s552x414&_nc_cat=102&ccb=1-7&_nc_sid=714c7a&_nc_eui2=AeEtehJ_ZTDTc_rJG3i0MoCP3DuhRoiRHDncO6FGiJEcOXtZwih27SgNvDvTaNb7FsHizLc2Q9wpD8wmpuk-Rp9v&_nc_ohc=y6bCIo8hdrEQ7kNvwHpYe_s&_nc_oc=Adrd1SHEb4RkMBMM3Xu-acmLOwW7ltGd99ojOexhJTPbokeUPboA8pITbvB-xxjiIzc&_nc_zt=14&_nc_ht=z-p3-scontent.fadd1-1.fna&_nc_gid=7WY9XDXpEgGpfTv1y5AB_Q&_nc_ss=7b2a8&oh=00_AQJ7sZr2yaVfEsnhiHBgQlvmjsqmlOm4zWQuRY37f_UnXw&oe=6A9B98E6",
    alt: "Oda Bultum University — Commencement Ceremony",
  },
  {
    src: "https://z-p3-scontent.fadd2-1.fna.fbcdn.net/v/t39.99422-6/756345118_889425130905755_5061757023587169666_n.png?stp=c316.0.649.649a_dst-jpg_tt6&cstp=mx649x649&ctp=s552x414&_nc_cat=104&ccb=1-7&_nc_sid=714c7a&_nc_eui2=AeHi7ZQptK2Kk1-jufQVY_aQ4YhUbC755r7hiFRsLvnmvqYHQ7DO5owkV0kPwmxjHj-j_me0MqBTr4MXjGg6mwgG&_nc_ohc=elK2c44vQHoQ7kNvwEuaHLU&_nc_oc=AdpWESdO5c-3tHl-6RL5bkILVHF3lZBhtW3Y_FE1_kzIewKpv2MwAWJR6OVoVYWv4GQ&_nc_zt=14&_nc_ht=z-p3-scontent.fadd2-1.fna&_nc_gid=eUcpph8PduCL4IaJF1bApA&_nc_ss=7b2a8&oh=00_AQLbq7P0fiogAayO84LMI0qnqGdrrBq5xa3goasTaCQ-Yw&oe=6A9B8422",
    alt: "Oda Bultum University — Faculty & Leadership",
  },
];

export const Route = createFileRoute("/")({
  component: Index,
  head: () => ({
    meta: [
      { title: "Oda Bultum University — Productive Mind for Development" },
      {
        name: "description",
        content:
          "Oda Bultum University in Chiro, West Hararghe, Ethiopia — producing ethical, competent graduates through quality education, problem-solving research, and community engagement.",
      },
      {
        property: "og:title",
        content: "Oda Bultum University — Productive Mind for Development",
      },
      {
        property: "og:description",
        content:
          "Oda Bultum University in Chiro, West Hararghe, Ethiopia — producing ethical, competent graduates through quality education, problem-solving research, and community engagement.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
});

function Index() {
  const { data: sections = [] } = useQuery({
    queryKey: ["homepage-sections"],
    queryFn: () => getHomepageSections(),
  });

  const getSection = (name: string) =>
    sections.find((s) => s.name === name || s.section_type === name);

  const welcomeSection = getSection("welcome");
  const statsSection = getSection("stats");
  const featuredSection = getSection("featured");

  const isVisible = (name: string, sectionType: string) => {
    if (sections.length === 0) return true; // Default to true if not loaded
    const section = sections.find((s) => s.name === name || s.section_type === sectionType);
    return section ? section.status === "published" : true;
  };

  return (
    <>
      <Hero />
      <Highlights />
      {isVisible("President's Message", "welcome") && (
        <PresidentMessage welcomeSection={welcomeSection} />
      )}
      {isVisible("Mission & Vision", "mission") && <MissionVision />}
      {isVisible("Gallery", "gallery") && <CampusVideo />}
      {isVisible("Featured News", "featured") && <LatestPosts />}

      {isVisible("Statistics", "stats") && <Stats />}
      {isVisible("Services", "services") && <QuickLinks />}
      <Partners />
      <CTA />
    </>
  );
}

function CampusVideo() {
  return (
    <section className="py-16 md:py-24 bg-secondary/30 border-y border-border">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center mb-10">
          <h2 className="font-heading text-3xl font-bold text-foreground md:text-4xl">
            Experience Oda Bultum University
          </h2>
          <p className="mt-4 text-muted-foreground max-w-2xl mx-auto">
            A glimpse into our vibrant campus life, state-of-the-art facilities, and the community
            that makes us unique.
          </p>
        </div>
        <div className="mx-auto max-w-5xl overflow-hidden rounded-2xl shadow-2xl relative aspect-video bg-black border border-border/50 pointer-events-none">
          <iframe
            src="https://www.youtube.com/embed/u6PwSz-wTsw?si=DF_zgd1H1t_0fMnX&autoplay=1&mute=1&loop=1&controls=0&playlist=u6PwSz-wTsw&playsinline=1"
            title="Oda Bultum University Video"
            className="absolute inset-0 h-full w-full scale-105"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
            style={{ border: "none" }}
          ></iframe>
        </div>
      </div>
    </section>
  );
}

function Hero() {
  const { data: dynamicSlides = [] } = useQuery({
    queryKey: ["hero-slides"],
    queryFn: () => getHeroSlides(),
  });

  const slides =
    dynamicSlides.length > 0
      ? dynamicSlides.map((slide: { image?: string; title?: string; [key: string]: unknown }) => ({
          src: slide.image || "https://obu.edu.et/wp-content/uploads/2026/01/20.jpeg",
          alt: slide.title || "Hero slide",
          objectPosition:
            typeof slide.title === "string" &&
            (slide.title.includes("Excellence") ||
              slide.title.includes("Faculty") ||
              slide.title.includes("President") ||
              slide.title.includes("Graduates"))
              ? "object-[center_15%]"
              : "object-[center_22%]",
          ...slide,
        }))
      : heroSlides.map((slide) => ({
          ...slide,
          objectPosition:
            slide.alt.includes("Excellence") ||
            slide.alt.includes("Faculty") ||
            slide.alt.includes("Commencement")
              ? "object-[center_15%]"
              : "object-[center_22%]",
        }));

  return (
    <section className="relative min-h-[70vh] md:min-h-[85vh] lg:min-h-[90vh] overflow-hidden bg-[#0c3822]">
      {/* Background Slideshow */}
      <div className="absolute inset-0 w-full h-full z-0">
        <ImageCarousel
          images={slides}
          interval={6000}
          showOverlay={true}
          objectFit="cover"
          objectPosition="object-[center_18%]"
          overlayClassName="absolute inset-0 bg-gradient-to-t from-[#0c3822]/90 via-[#0c3822]/35 to-black/25"
          renderOverlay={(slide) => (
            <div className="mx-auto max-w-5xl px-4 text-center pb-12 md:pb-0">
              {slide.subtitle && (
                <span className="inline-block rounded-full border border-white/20 bg-white/10 backdrop-blur-md px-4 py-1.5 text-xs font-bold uppercase tracking-[0.2em] text-[#ffcc00] shadow-sm mb-6">
                  {slide.subtitle}
                </span>
              )}
              <h1 className="mx-auto font-heading text-5xl font-extrabold leading-tight text-white drop-shadow-2xl md:text-6xl lg:text-7xl lg:leading-[1.15] animate-fade-in-up">
                {slide.title || "Oda Bultum University"}
              </h1>
              <p
                className="mx-auto mt-6 max-w-2xl text-lg text-white/95 md:text-xl font-medium drop-shadow-md animate-fade-in-up"
                style={{ animationDelay: "150ms" }}
              >
                {slide.description ||
                  '"Productive Mind for Development" — a fourth-generation public university in Eastern Ethiopia committed to ethical graduates, problem-solving research, and community service.'}
              </p>
              <div
                className="mt-10 flex flex-wrap items-center justify-center gap-4 animate-fade-in-up"
                style={{ animationDelay: "300ms" }}
              >
                <Link to={slide.buttonUrl || "/programs"}>
                  <Button
                    size="lg"
                    className="obu-gradient hover:brightness-110 text-white border-none shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 font-bold px-8 h-14 text-base rounded-lg"
                  >
                    {slide.buttonText || "Explore Academics"}
                  </Button>
                </Link>
                <Link to="/registrar">
                  <Button
                    size="lg"
                    variant="outline"
                    className="border-white/40 bg-transparent text-white hover:bg-white/10 hover:border-white transition-all duration-300 font-semibold px-8 h-14 text-base rounded-lg hover:-translate-y-1 shadow-sm hover:shadow-md"
                  >
                    Apply Now
                  </Button>
                </Link>
              </div>
            </div>
          )}
        />
      </div>

      {/* Subtle institutional green radial ambient lighting (No black multiply layer) */}
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_center,transparent_0%,rgba(12,56,34,0.35)_100%)] z-10" />
    </section>
  );
}

function Highlights() {
  const { data: news = [] } = useQuery({
    queryKey: ["latest-news"],
    queryFn: () => getLatestNews(),
  });
  const latestNews = news[0];

  return (
    <section className="bg-gray-50 border-b border-border relative z-20 -mt-12 py-16 md:py-24 overflow-hidden">
      <div className="container mx-auto max-w-7xl px-4 md:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Box 1: Latest News */}
          <div className="obu-gradient text-white p-10 rounded-3xl shadow-xl relative group transition-all duration-500 hover:shadow-2xl hover:-translate-y-2 overflow-hidden animate-fade-in-up card-3d-interactive">
            <div className="absolute -right-10 -top-10 w-48 h-48 bg-white opacity-5 rounded-full blur-3xl group-hover:opacity-20 transition-opacity duration-500" />
            <GraduationCap className="absolute top-10 right-10 h-10 w-10 text-[#ffcc00] opacity-90 drop-shadow-md" />
            <h3 className="font-heading text-3xl font-bold mb-4 text-[#ffcc00]">Latest News</h3>
            {latestNews ? (
              <Link to="/news" className="flex flex-col gap-5 relative z-10">
                <p className="text-lg leading-relaxed font-semibold text-white group-hover:text-white/90 transition-colors">
                  {latestNews.title}
                </p>
                <span className="text-xs text-white/80 font-bold uppercase tracking-wider flex items-center gap-1 group-hover:text-white mt-2">
                  Read More{" "}
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </span>
              </Link>
            ) : (
              <p className="text-sm text-white/90">No recent news available.</p>
            )}
          </div>

          {/* Box 2: CBE */}
          <div
            className="bg-white p-10 rounded-3xl shadow-lg border border-gray-100/50 relative group transition-all duration-500 hover:shadow-2xl hover:border-[#186a42]/20 hover:-translate-y-2 animate-fade-in-up card-3d-interactive overflow-hidden"
            style={{ animationDelay: "150ms" }}
          >
            <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-[#186a42] via-[#ffcc00] to-[#186a42] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <div className="inline-flex p-4 rounded-2xl bg-[#186a42]/5 text-[#186a42] mb-6 group-hover:bg-[#186a42] group-hover:text-[#ffcc00] transition-colors duration-500">
              <Users className="h-7 w-7" />
            </div>
            <h3 className="font-heading text-2xl font-bold mb-4 text-gray-900 group-hover:text-[#186a42] transition-colors">
              Community Based Education
            </h3>
            <p className="text-base text-gray-600 leading-relaxed mb-8">
              Empowering students to learn with purpose and serve with passion through active
              community engagement and practical problem-solving.
            </p>
            <Link
              to="/about"
              className="text-xs text-[#186a42] font-bold uppercase tracking-wider flex items-center gap-1 hover:underline"
            >
              Learn More{" "}
              <ArrowRight className="w-3 h-3 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>

          {/* Box 3: Research */}
          <div
            className="bg-white p-10 rounded-3xl shadow-lg border border-gray-100/50 relative group transition-all duration-500 hover:shadow-2xl hover:border-[#186a42]/20 hover:-translate-y-2 animate-fade-in-up card-3d-interactive overflow-hidden"
            style={{ animationDelay: "300ms" }}
          >
            <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-[#186a42] via-[#ffcc00] to-[#186a42] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <div className="inline-flex p-4 rounded-2xl bg-[#186a42]/5 text-[#186a42] mb-6 group-hover:bg-[#186a42] group-hover:text-[#ffcc00] transition-colors duration-500">
              <BookOpen className="h-7 w-7" />
            </div>
            <h3 className="font-heading text-2xl font-bold mb-4 text-gray-900 group-hover:text-[#186a42] transition-colors">
              Research at OBU
            </h3>
            <p className="text-base text-gray-600 leading-relaxed mb-8">
              Undertaking quality, demand-driven research to address societal challenges and foster
              sustainable development across Eastern Ethiopia.
            </p>
            <Link
              to="/research"
              className="text-xs text-[#186a42] font-bold uppercase tracking-wider flex items-center gap-1 hover:underline"
            >
              Explore Research{" "}
              <ArrowRight className="w-3 h-3 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

function PresidentMessage({
  welcomeSection,
}: {
  welcomeSection?: {
    title?: string;
    content?: string;
    description?: string;
    button_text?: string;
    button_url?: string;
  } | null;
}) {
  const { data: president } = useQuery({
    queryKey: ["president"],
    queryFn: () => getPresidentInfo(),
  });

  return (
    <section className="py-20 md:py-28 relative overflow-hidden bg-white">
      {/* Decorative background element */}
      <div className="absolute top-0 right-0 w-1/3 h-full bg-[#f8f9fa] skew-x-12 translate-x-16 pointer-events-none" />

      <div className="container mx-auto grid items-center gap-16 px-4 md:grid-cols-2 md:px-6 relative z-10">
        <div className="space-y-6 md:pr-8 animate-fade-in-up">
          <div className="relative group mx-auto sm:mx-0 max-w-md">
            {/* Image framing / offset border */}
            <div className="absolute inset-0 border-[3px] border-[#ffcc00] rounded-2xl translate-x-5 translate-y-5 transition-transform duration-500 group-hover:translate-x-7 group-hover:translate-y-7" />
            <div className="relative overflow-hidden rounded-2xl bg-gray-100 aspect-[4/5] shadow-2xl card-3d-interactive">
              <img
                src={president?.photo ?? presidentImg}
                alt={president?.name ?? "Dr. Muktar Mohammed"}
                className="w-full h-full object-cover object-[center_top] transition-all duration-700 group-hover:scale-105"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            </div>
          </div>
          <div className="text-center sm:text-left pt-4">
            <p className="font-heading text-3xl font-bold text-gray-900">
              {president?.name ?? "Dr. Muktar Mohammed"}
            </p>
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-[#186a42] mt-2">
              President
            </p>
          </div>
        </div>

        <div
          className="flex flex-col justify-center h-full space-y-8 animate-fade-in-up"
          style={{ animationDelay: "200ms" }}
        >
          <div className="space-y-2">
            <span className="inline-block px-3 py-1 bg-[#186a42]/10 text-[#186a42] text-xs font-bold uppercase tracking-widest rounded-full">
              Leadership
            </span>
            <SectionHeader
              title={welcomeSection?.title || "President's Message"}
              centered={false}
            />
          </div>
          <div className="prose prose-lg text-gray-700 whitespace-pre-wrap leading-relaxed max-w-none font-medium">
            {welcomeSection?.content ? (
              <p>{welcomeSection.content}</p>
            ) : president?.biography ? (
              <p>{president.biography}</p>
            ) : (
              <>
                <p>
                  I am happy to invite you to explore our university's wisdom. The university is one
                  of the youngest, energetic and leading public higher education institutions,
                  located 326 kilometers east of the national capital Addis Ababa, in the center of
                  the sociable community of Eastern Oromia, Ethiopia. I have been entrusted with
                  academic excellence, research quality, community engagement and enriching the
                  quality of student life, and I have gained a deep respect for the culture and
                  tradition in our university.
                </p>
                <p>
                  Recently, the university was differentiated into a comprehensive university with a
                  core responsibility focusing on producing ethical, competent and qualified
                  graduates, problem-solving research outreaches, and demand-driven community
                  services. The university has set its motto as "Productive Mind for Development"
                  and a 10-year strategic plan to be one of the recognized universities in Eastern
                  Africa through social development, natural resource conservation, technology
                  transfer and agro-processing by 2030.
                </p>
              </>
            )}
          </div>
          <div className="pt-4">
            <Link to={welcomeSection?.button_url || "/about"}>
              <Button className="obu-gradient hover:brightness-110 text-white shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 px-10 py-6 text-base font-bold rounded-xl flex items-center gap-2 group">
                {welcomeSection?.button_text || "Read Full Message"}
                <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

function MissionVision() {
  const { data: settings } = useQuery({
    queryKey: ["settings"],
    queryFn: () => getSiteSettings(),
  });

  const missionVisionText =
    settings?.mission_vision ??
    "The university aims to produce ethical, competent graduates; conduct problem-solving research; and render demand-based community engagement activities to assure social, economic and political goals in the locality and beyond in a sustainable manner.";

  return (
    <section className="bg-gray-50 py-24 md:py-32 relative overflow-hidden">
      {/* Decorative dots pattern */}
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: "radial-gradient(#186a42 2px, transparent 2px)",
          backgroundSize: "32px 32px",
        }}
      />
      {/* Soft gradient orb */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-tr from-[#186a42]/5 to-[#ffcc00]/5 rounded-full blur-3xl pointer-events-none" />

      <div className="container mx-auto px-4 md:px-6 relative z-10 animate-fade-in-up">
        <div className="max-w-4xl mx-auto text-center glass-panel p-10 md:p-16 rounded-3xl shadow-2xl relative overflow-hidden group hover:border-[#186a42]/20 transition-colors duration-500 card-3d-interactive">
          {/* Subtle accent line */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-2 bg-[#ffcc00] rounded-b-full group-hover:w-48 transition-all duration-500" />
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-32 h-2 bg-[#186a42] rounded-t-full group-hover:w-48 transition-all duration-500" />

          <SectionHeader
            title="Mission & Vision"
            subtitle="Assuring social, economic and political goals in the locality and beyond, in a sustainable manner."
          />
          <p className="mx-auto max-w-3xl mt-8 text-xl md:text-3xl leading-relaxed text-gray-800 font-medium font-heading italic text-center whitespace-pre-wrap">
            "{missionVisionText}"
          </p>
        </div>
      </div>
    </section>
  );
}

function LatestPosts() {
  const { data: news = [] } = useQuery({
    queryKey: ["latest-news"],
    queryFn: () => getLatestNews(),
  });
  const { data: events = [] } = useQuery({
    queryKey: ["upcoming-events"],
    queryFn: () => getUpcomingEvents(),
  });

  return (
    <section className="bg-white py-20 md:py-28 relative">
      <div className="container mx-auto px-4 md:px-8 max-w-7xl relative z-10">
        <div className="grid gap-16 lg:grid-cols-2 items-start">
          {/* News Column */}
          <div className="animate-fade-in-up flex flex-col justify-between h-full">
            <div>
              <div className="flex items-center justify-between gap-4 mb-8">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-8 bg-[#186a42] rounded-full" />
                  <h2 className="text-3xl md:text-4xl font-heading font-extrabold text-gray-900 tracking-tight">
                    Latest News
                  </h2>
                </div>
                <Link
                  to="/news"
                  className="hidden sm:inline-flex text-xs font-bold uppercase tracking-wider text-[#186a42] hover:text-[#125333] items-center gap-1 hover:underline"
                >
                  All News <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>

              <div className="flex flex-col gap-6">
                {news.length > 0 ? (
                  news.slice(0, 3).map((item) => {
                    const d = new Date(item.publishedDate);
                    const dateString = isNaN(d.getTime())
                      ? ""
                      : d.toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        });

                    return (
                      <article
                        key={item.id}
                        className="group flex flex-col sm:flex-row gap-5 bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1 hover:border-[#186a42]/30 transition-all duration-300 border border-gray-100/90 card-3d-interactive"
                      >
                        {/* Image */}
                        <div className="shrink-0 w-full sm:w-48 h-40 sm:h-auto bg-gray-100 overflow-hidden relative">
                          {item.image ? (
                            <img
                              src={item.image}
                              alt={item.title}
                              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                            />
                          ) : (
                            <div className="w-full h-full bg-[#186a42]/5 flex items-center justify-center">
                              <GraduationCap className="w-9 h-9 text-[#186a42]/30" />
                            </div>
                          )}
                        </div>

                        {/* Content */}
                        <div className="flex-1 min-w-0 p-5 sm:py-5 sm:pr-5 sm:pl-1 flex flex-col justify-center">
                          <div className="flex items-center gap-2 mb-2 text-xs font-bold text-[#186a42] uppercase tracking-wider">
                            <span className="w-2 h-2 rounded-full bg-[#ffcc00]" />
                            {dateString || "University Update"}
                            {item.category && (
                              <span className="text-gray-400 font-normal">| {item.category}</span>
                            )}
                          </div>
                          <Link to="/news">
                            <h3 className="font-heading text-lg font-bold text-gray-900 group-hover:text-[#186a42] transition-colors leading-snug mb-2 line-clamp-2">
                              {item.title}
                            </h3>
                          </Link>
                          <p className="text-sm leading-relaxed text-gray-600 line-clamp-2">
                            {item.excerpt || "Read more about this official university update."}
                          </p>
                        </div>
                      </article>
                    );
                  })
                ) : (
                  <div className="bg-gray-50 border border-gray-100 rounded-2xl p-8 text-center">
                    <p className="text-gray-500 font-medium">No recent news available.</p>
                  </div>
                )}
              </div>
            </div>

            <div className="pt-8">
              <Link to="/news">
                <Button className="obu-gradient hover:brightness-110 text-white rounded-xl px-8 py-5 h-auto text-sm font-bold tracking-wider hover:-translate-y-0.5 shadow-md hover:shadow-lg transition-all duration-300 w-full sm:w-auto">
                  View All News
                </Button>
              </Link>
            </div>
          </div>

          {/* Events Column */}
          <div
            className="animate-fade-in-up flex flex-col justify-between h-full"
            style={{ animationDelay: "150ms" }}
          >
            <div>
              <div className="flex items-center justify-between gap-4 mb-8">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-8 bg-[#ffcc00] rounded-full" />
                  <h2 className="text-3xl md:text-4xl font-heading font-extrabold text-gray-900 tracking-tight">
                    Upcoming Events
                  </h2>
                </div>
                <Link
                  to="/events"
                  className="hidden sm:inline-flex text-xs font-bold uppercase tracking-wider text-[#186a42] hover:text-[#125333] items-center gap-1 hover:underline"
                >
                  All Events <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>

              <div className="flex flex-col gap-6">
                {events.length > 0 ? (
                  events.slice(0, 3).map((ev) => {
                    const d = new Date(ev.date);
                    const month = isNaN(d.getTime())
                      ? "EVENT"
                      : d.toLocaleString("en-US", { month: "short" }).toUpperCase();
                    const day = isNaN(d.getTime()) ? "--" : d.getDate();

                    return (
                      <div
                        key={ev.id}
                        className="group flex gap-5 bg-white p-5 rounded-2xl shadow-sm border border-gray-100/90 hover:shadow-xl hover:-translate-y-1 hover:border-[#186a42]/30 transition-all duration-300 card-3d-interactive overflow-hidden relative"
                      >
                        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#186a42] via-[#ffcc00] to-[#186a42] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                        {/* Calendar Badge */}
                        <div className="flex shrink-0 flex-col w-16 h-16 items-center justify-center bg-[#186a42]/10 group-hover:bg-[#186a42] text-[#186a42] group-hover:text-white rounded-xl p-2 text-center transition-colors duration-300 shadow-sm">
                          <span className="text-[10px] font-black tracking-widest block">
                            {month}
                          </span>
                          <span className="font-heading text-xl font-black leading-none my-0.5 block">
                            {day}
                          </span>
                        </div>

                        {/* Event Content */}
                        <div className="flex-1 min-w-0 flex flex-col justify-center">
                          <p className="text-xs font-bold tracking-wide text-[#186a42] mb-1.5 flex items-center gap-1.5 flex-wrap">
                            <Calendar className="w-3.5 h-3.5 text-[#186a42]" />
                            <span>
                              {ev.startTime
                                ? `${ev.startTime}${ev.endTime ? ` - ${ev.endTime}` : ""}`
                                : "All Day Event"}
                            </span>
                            {ev.location && (
                              <span className="text-gray-500 font-normal">• {ev.location}</span>
                            )}
                          </p>
                          <Link to="/events">
                            <h3 className="font-heading text-base font-bold text-gray-900 group-hover:text-[#186a42] transition-colors leading-snug">
                              {ev.title}
                            </h3>
                          </Link>
                          {ev.description && (
                            <p className="text-xs text-gray-500 line-clamp-1 mt-1">
                              {ev.description}
                            </p>
                          )}
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="bg-gray-50 border border-gray-100 rounded-2xl p-8 text-center">
                    <p className="text-gray-500 font-medium">No upcoming events scheduled.</p>
                  </div>
                )}
              </div>
            </div>

            <div className="pt-8">
              <Link to="/events">
                <Button className="obu-gradient hover:brightness-110 text-white rounded-xl px-8 py-5 h-auto text-sm font-bold tracking-wider hover:-translate-y-0.5 shadow-md hover:shadow-lg transition-all duration-300 w-full sm:w-auto">
                  View All Events
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Stats() {
  const { data } = useQuery({
    queryKey: ["site-stats"],
    queryFn: () => getSiteStats(),
  });

  const stats = [
    { value: String(data?.staffCount ?? "697"), label: "Academic Staff" },
    { value: String(data?.studentCount ?? "8,084"), label: "Registered Students" },
    { value: String(data?.programs ?? "42"), label: "Academic Programs" },
    { value: String(data?.researchCenters ?? "8") + "+", label: "Research Centers" },
  ];

  return (
    <section className="obu-gradient py-24 relative overflow-hidden text-white">
      {/* Decorative background overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(255,255,255,0.03)_50%,transparent_75%,transparent_100%)] bg-[length:4px_4px] pointer-events-none" />
      <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-white/5 rounded-full blur-3xl" />

      <div className="container mx-auto grid grid-cols-2 gap-6 md:grid-cols-4 px-4 md:px-6 relative z-10 animate-fade-in-up">
        {stats.map((s) => (
          <div
            key={s.label}
            className="text-center bg-white/10 backdrop-blur-md rounded-3xl p-8 border border-white/10 card-3d-interactive hover:bg-white/15 transition-all duration-300 shadow-xl"
          >
            <p className="font-heading text-4xl sm:text-5xl lg:text-6xl font-black text-white drop-shadow-md group-hover:text-[#ffcc00] transition-colors duration-500">
              {s.value}
            </p>
            <p className="mt-4 text-xs sm:text-sm font-bold uppercase tracking-[0.2em] text-white/90">
              {s.label}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}

const quickLinksFallback = [
  { label: "OBU e-SHE Platform", url: "http://courses.obu.edu.et" },
  { label: "OBU Fleet Management System", url: "https://fms.ppa.gov.et/" },
  { label: "OBU Institutional Email", url: "https://office.com" },
];

function QuickLinks() {
  const { data: qLinks } = useQuery({
    queryKey: ["quick-links"],
    queryFn: () => getQuickLinks(),
  });

  const rawLinks = qLinks && qLinks.length > 0 ? qLinks : quickLinksFallback;
  const links = rawLinks.filter(
    (link) => !["OBU Procurement", "OBU LMS Platform", "OBU-FTP", "OBU FTP"].includes(link.label),
  );

  return (
    <section className="py-24 md:py-32 bg-gray-50 relative border-b border-border">
      <div className="container mx-auto px-4 md:px-6 relative z-10 animate-fade-in-up">
        <SectionHeader
          title="University Services"
          subtitle="Quick access to essential resources and portals for our community."
        />
        <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-6">
          {links.map(({ label, url }) => (
            <a
              key={label}
              href={url}
              target="_blank"
              rel="noreferrer"
              className="group flex flex-col items-center gap-5 rounded-3xl border border-gray-100 bg-white p-8 text-center shadow-md transition-all duration-500 hover:-translate-y-2 hover:border-[#186a42]/30 hover:shadow-2xl card-3d-interactive relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-[#186a42]/5 rounded-bl-full pointer-events-none group-hover:bg-[#186a42]/10 transition-colors duration-500" />
              <div className="rounded-2xl bg-[#f4f6f8] p-5 transition-colors duration-500 group-hover:bg-[#186a42] group-hover:text-white text-[#186a42] shadow-inner">
                <Tag className="h-8 w-8" />
              </div>
              <div className="flex-1 flex items-center justify-center">
                <span className="font-heading font-bold text-lg text-gray-900 group-hover:text-[#186a42] transition-colors leading-tight">
                  {label}
                </span>
              </div>
              <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center group-hover:bg-[#ffcc00] transition-all duration-500">
                <ArrowRight className="h-5 w-5 text-gray-400 group-hover:text-white transition-transform duration-300 group-hover:translate-x-1" />
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}

function Partners() {
  const partners = [
    {
      src: "/PARTNER_HARAMAYA_UNIVERSITY.jpg",
      name: "Haramaya University",
      description:
        "Joint postgraduate programs, agricultural research collaboration, and student exchange serving Eastern Ethiopia.",
    },
    {
      src: "/PARTNER_MINISTRY_OF_AGRICULTURE.jpg",
      name: "Ministry of Agriculture",
      description:
        "Applied research and community outreach aligned with national food security and agricultural development strategies.",
    },
    {
      src: "/PARTNER_BENEFIT_REALISE.jpg",
      name: "Benefit Realise",
      description:
        "Livelihood improvement, capacity building, and community development initiatives across West Hararghe Zone.",
    },
    {
      src: "/PARTNER_FAMILY_GUIDANCE_ASSOCIATION_OF_ETHIOPIA.jpg",
      name: "Family Guidance Association",
      description:
        "Joint initiatives in reproductive health, community education, and public health outreach for maternal wellbeing.",
    },
    {
      src: "/PARTNER_OBN_OR_OROMIA_BRODACASTING_NETWORK.jpg",
      name: "Oromia Broadcasting Network",
      description:
        "Media partnership for disseminating research findings and community education content to the public.",
    },
    {
      src: "/PARTNER_BIROO_QONNA_OROMIYAA.jpg",
      name: "Biroo Qonna Oromiyaa",
      description:
        "Collaboration on teacher training, curriculum development, and educational quality improvement programs.",
    },
    {
      src: "/partner_DINA_FOOD_PROCESSING.jpg",
      name: "Dina Food Processing",
      description:
        "Industry-university linkage for agro-processing research, internships, and technology transfer in the food sector.",
    },
    {
      src: "/partner_LIVELIHOOD_RESILIENCE_PROJECT.jpg",
      name: "Livelihood Resilience Project",
      description:
        "Addressing food insecurity, climate adaptation, and sustainable livelihoods in dryland farming communities.",
    },
  ];

  const track = [...partners, ...partners];

  return (
    <section className="bg-gray-50 py-24 md:py-32 overflow-hidden">
      <div className="container mx-auto px-4 md:px-6 mb-16 text-center animate-fade-in-up">
        <div className="inline-flex items-center justify-center gap-4 mb-6">
          <div className="w-12 h-0.5 bg-[#186a42]" />
          <p className="text-sm font-bold uppercase tracking-[0.25em] text-[#186a42]">
            Collaboration
          </p>
          <div className="w-12 h-0.5 bg-[#186a42]" />
        </div>
        <h2 className="font-heading text-4xl font-extrabold text-gray-900 md:text-5xl tracking-tight">
          Featured Partners
        </h2>
        <p className="mt-6 text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
          Institutions and organisations working with OBU to drive lasting impact.{" "}
          <Link
            to="/contact"
            className="font-bold text-[#186a42] underline-offset-4 hover:underline transition-all"
          >
            Become a partner →
          </Link>
        </p>
      </div>

      {/* Marquee */}
      <div className="relative overflow-hidden w-full max-w-[100vw]">
        {/* Edge fades */}
        <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-32 bg-gradient-to-r from-gray-50 to-transparent" />
        <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-32 bg-gradient-to-l from-gray-50 to-transparent" />

        <div
          className="flex gap-6 py-4"
          style={{
            animation: "partners-marquee 40s linear infinite",
            width: "max-content",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.animationPlayState = "paused")}
          onMouseLeave={(e) => (e.currentTarget.style.animationPlayState = "running")}
        >
          {track.map((p, i) => (
            <div
              key={`${p.name}-${i}`}
              className="flex w-[320px] shrink-0 flex-col overflow-hidden rounded-2xl border border-gray-200/80 bg-white shadow-sm"
            >
              {/* Logo area */}
              <div className="flex h-44 items-center justify-center border-b border-gray-100 bg-white p-6 relative">
                <img
                  src={p.src}
                  alt={p.name}
                  loading="lazy"
                  className="max-h-24 w-full object-contain"
                />
              </div>
              {/* Text area */}
              <div className="flex flex-1 flex-col gap-2 p-6 bg-gray-50/40">
                <p className="font-heading text-base font-bold text-gray-900 leading-tight">
                  {p.name}
                </p>
                <p className="text-xs leading-relaxed text-gray-600 line-clamp-3">
                  {p.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        @keyframes partners-marquee {
          0%   { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
      `}</style>
    </section>
  );
}

function CTA() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-[#0e4428] via-[#0c3822] to-[#072416] py-24 md:py-32 text-white border-t border-emerald-700/40">
      {/* Top subtle gold decorative accent line */}
      <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#ffcc00]/70 to-transparent" />

      {/* Decorative subtle concentric rings in background */}
      <div className="pointer-events-none absolute inset-0 z-0 flex items-center justify-center">
        <svg
          className="h-[650px] w-[650px] opacity-[0.06] text-[#ffcc00]"
          viewBox="0 0 600 600"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <circle
            cx="300"
            cy="300"
            r="120"
            stroke="currentColor"
            strokeWidth="1"
            strokeDasharray="4 4"
          />
          <circle cx="300" cy="300" r="190" stroke="currentColor" strokeWidth="1.2" />
          <circle
            cx="300"
            cy="300"
            r="260"
            stroke="currentColor"
            strokeWidth="1"
            strokeDasharray="6 6"
          />
        </svg>
      </div>

      {/* Giant Watermark Seal */}
      <div className="pointer-events-none absolute inset-0 z-0 flex items-center justify-center opacity-[0.05]">
        <img
          src="/obu_transparen_logos.png"
          alt="Watermark"
          className="h-[460px] w-[460px] object-contain brightness-0 invert"
        />
      </div>

      {/* Layered radial ambient glows */}
      <div className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[550px] w-[700px] rounded-full bg-[radial-gradient(ellipse_at_center,rgba(24,106,66,0.45)_0%,rgba(12,56,34,0.15)_50%,transparent_75%)] blur-3xl" />
      <div className="pointer-events-none absolute -top-24 left-1/2 -translate-x-1/2 h-[260px] w-[500px] rounded-full bg-[#ffcc00]/10 blur-3xl" />
      <div className="pointer-events-none absolute bottom-0 right-10 h-[280px] w-[280px] rounded-full bg-emerald-400/10 blur-3xl" />

      {/* Subtle geometric dot pattern */}
      <div className="absolute inset-0 opacity-[0.025] mix-blend-overlay pointer-events-none bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:24px_24px]" />

      <div className="container relative z-10 mx-auto px-4 text-center md:px-6 animate-fade-in-up max-w-4xl">
        <div className="inline-flex items-center gap-2.5 rounded-full border border-[#ffcc00]/35 bg-[#0c3822]/80 backdrop-blur-md px-4 py-1.5 text-xs font-bold uppercase tracking-[0.22em] text-[#ffcc00] mb-6 shadow-[0_2px_12px_rgba(0,0,0,0.2)]">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#ffcc00] opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-[#ffcc00]" />
          </span>
          Admissions Open
        </div>

        <h2 className="font-heading text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-tight drop-shadow-[0_2px_12px_rgba(0,0,0,0.35)]">
          Join 2025 OBU Students
        </h2>

        <p className="mx-auto mt-6 max-w-2xl text-base sm:text-lg text-emerald-50/90 font-normal leading-relaxed">
          Oda Bultum University is one of the fourth-generation universities found in the eastern
          part of Ethiopia. Take the first step toward a transformative education.
        </p>

        <div className="mt-10 flex flex-wrap justify-center items-center gap-4">
          <Link to="/registrar">
            <Button
              size="lg"
              className="bg-[#ffcc00] text-[#0c3822] hover:bg-[#ffe066] font-bold px-8 py-6 h-auto text-base rounded-xl shadow-[0_8px_20px_rgba(255,204,0,0.25)] hover:shadow-[0_12px_28px_rgba(255,204,0,0.35)] hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 flex items-center gap-2 group cursor-pointer"
            >
              <span>Apply Now</span>
              <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" />
            </Button>
          </Link>
          <Link to="/contact">
            <Button
              size="lg"
              variant="outline"
              className="border-white/30 bg-white/10 backdrop-blur-md text-white hover:bg-white/20 hover:border-white/50 transition-all duration-200 font-semibold px-8 py-6 h-auto text-base rounded-xl hover:-translate-y-0.5 active:translate-y-0 shadow-sm cursor-pointer"
            >
              Contact Us
            </Button>
          </Link>
        </div>
      </div>

      {/* Bottom subtle border line */}
      <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-emerald-700/50 to-transparent" />
    </section>
  );
}

export function ErrorBoundary() {
  return <PageHero title="Something went wrong" subtitle="Please try again." />;
}
