import { createFileRoute, notFound, Link } from "@tanstack/react-router";
import { Breadcrumbs } from "@/frontend/components/Breadcrumbs";
import {
  Calendar,
  Tag,
  User,
  ArrowLeft,
  Share2,
  Newspaper,
  Sparkles,
  BookOpen,
} from "lucide-react";
import { supabase } from "@/frontend/lib/supabase";
import type { Database } from "@/frontend/lib/database.types";

export const Route = createFileRoute("/news/$slug")({
  head: () => ({
    meta: [
      { title: "University News — Oda Bultum University" },
      {
        name: "description",
        content: "Read official news, stories, and press updates from Oda Bultum University.",
      },
    ],
  }),
  component: NewsDetail,
  loader: async ({ params }) => {
    const { data: news, error } = await supabase
      .from("news")
      .select("*, media:featured_image_id(id, file_url)")
      .eq("slug", params.slug)
      .eq("status", "published")
      .single();

    if (error || !news) {
      if (error && error.code !== "PGRST116") {
        console.error("Failed to fetch news article:", error);
      }
      throw notFound();
    }

    return {
      news: news as Database["public"]["Tables"]["news"]["Row"] & {
        media?: { id: string; file_url: string } | null;
      },
      slug: params.slug,
    };
  },
});

function NewsDetail() {
  const { news } = Route.useLoaderData();

  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* Cover Hero */}
      <div className="relative obu-gradient py-20 md:py-28 px-4 sm:px-6 lg:px-8 text-white overflow-hidden">
        <div className="absolute inset-0 opacity-10 mix-blend-overlay pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white/15 to-transparent blur-3xl pointer-events-none" />

        <div className="max-w-4xl mx-auto relative z-10 animate-fade-in-up space-y-4">
          <Link
            to="/news"
            className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#ffcc00] hover:underline mb-2"
          >
            <ArrowLeft className="w-4 h-4" /> Back to News & Media
          </Link>

          <div className="flex flex-wrap items-center gap-3">
            <span className="px-3 py-1 bg-[#ffcc00] text-[#186a42] text-xs font-black uppercase tracking-wider rounded-full shadow-sm">
              {news.category || "Official Release"}
            </span>
            <div className="flex items-center gap-1.5 text-xs text-white/85 font-semibold">
              <Calendar className="w-3.5 h-3.5 text-[#ffcc00]" />
              <span>
                {news.published_at
                  ? new Date(news.published_at).toLocaleDateString("en-US", {
                      month: "long",
                      day: "numeric",
                      year: "numeric",
                    })
                  : "Recent"}
              </span>
            </div>
            {news.author && (
              <div className="flex items-center gap-1.5 text-xs text-white/85">
                <User className="w-3.5 h-3.5 text-[#ffcc00]" />
                <span>By {news.author}</span>
              </div>
            )}
          </div>

          <h1 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-tight">
            {news.title}
          </h1>
        </div>
      </div>

      {/* Breadcrumb Bar */}
      <div className="bg-gray-50 border-b border-gray-100 py-4 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <Breadcrumbs items={[{ label: "News & Media", to: "/news" }, { label: news.title }]} />
        </div>
      </div>

      <main className="flex-grow">
        <article className="container mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-12 md:py-16 space-y-10">
          {/* Featured Hero Photo */}
          {news.media?.file_url && (
            <div className="rounded-3xl overflow-hidden shadow-2xl border border-gray-100 max-h-[500px] w-full bg-gray-100">
              <img
                src={news.media.file_url}
                alt={news.title}
                className="w-full h-full object-cover max-h-[500px]"
              />
            </div>
          )}

          {/* Lead Summary if present */}
          {news.short_description && (
            <div className="bg-[#186a42]/5 border-l-4 border-[#186a42] p-6 sm:p-8 rounded-r-3xl text-gray-800">
              <p className="font-heading text-lg sm:text-xl font-semibold leading-relaxed">
                {news.short_description}
              </p>
            </div>
          )}

          {/* Full Article Content */}
          <div className="prose prose-lg prose-[#186a42] max-w-none text-gray-800 font-normal leading-relaxed whitespace-pre-wrap">
            {news.content}
          </div>

          {/* Article Footer Strip */}
          <div className="pt-10 border-t border-gray-200/80 flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-3 text-xs text-gray-500 font-medium">
              <Newspaper className="w-4 h-4 text-[#186a42]" />
              <span>Official Oda Bultum University Public Affairs Communication</span>
            </div>

            <Link
              to="/news"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-[#186a42] hover:bg-[#125333] text-white font-bold text-xs uppercase tracking-wider shadow-md hover:shadow-lg transition-all"
            >
              <ArrowLeft className="w-4 h-4" /> Browse More Stories
            </Link>
          </div>
        </article>
      </main>
    </div>
  );
}
