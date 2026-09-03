import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { getNavigationItems } from "@/backend/api";
import { buildNavTree } from "@/frontend/services/navigation.service";
import { MapPin, Phone, Mail, Facebook, Twitter, Youtube, Instagram, Send } from "lucide-react";
import { type SiteSettingsRecord } from "@/backend/api";

export interface WebsiteSettings extends Record<string, unknown> {
  logo_url?: string;
  university_name?: string;
  phone?: string;
  email?: string;
  address?: string;
  twitter_url?: string;
  youtube_url?: string;
  facebook_url?: string;
  instagram_url?: string;
  footer_text?: string;
}

export function Footer({
  settings: siteSettings,
}: {
  settings?: WebsiteSettings | SiteSettingsRecord | null;
}) {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const { data: dbFooterItems = [] } = useQuery({
    queryKey: ["navigation", "footer"],
    queryFn: () => getNavigationItems({ data: "footer" }),
  });

  const footerTree = buildNavTree(dbFooterItems);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setSubscribed(true);
      setEmail("");
    }
  };

  return (
    <>
      {/* Newsletter Section */}
      <div className="relative overflow-hidden bg-gradient-to-b from-emerald-50/60 via-[#f4f8f5] to-white py-12 border-b border-emerald-900/10 animate-fade-in-up">
        {/* Giant Watermark Logo */}
        <div className="pointer-events-none absolute inset-0 z-0 flex items-center justify-center opacity-[0.03]">
          <img
            src={siteSettings?.logo_url || "/obu_transparen_logos.png"}
            alt="Watermark"
            className="h-[400px] w-[400px] object-contain grayscale"
          />
        </div>

        <div className="container relative z-10 mx-auto flex flex-col items-center gap-6 px-4 md:flex-row md:justify-between md:px-6">
          <div className="flex items-center gap-5">
            {/* OBU seal */}
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-white p-2 shadow-sm ring-1 ring-emerald-900/10 shrink-0 overflow-hidden">
              <img
                src={siteSettings?.logo_url || "/logo.png"}
                alt={siteSettings?.university_name || "Oda Bultum University seal"}
                className="h-full w-full object-contain"
              />
            </div>
            <div>
              <p className="font-heading text-lg font-bold text-[#186a42]">
                Subscribe to Our Newsletter
              </p>
              <p className="text-sm text-gray-600 mt-0.5">
                Stay updated with the latest news, academic notices, and research updates from OBU.
              </p>
            </div>
          </div>

          {subscribed ? (
            <p className="text-sm font-bold text-[#186a42] bg-emerald-100/80 px-4 py-2 rounded-lg">
              ✓ Thank you for subscribing!
            </p>
          ) : (
            <form onSubmit={handleSubscribe} className="flex w-full max-w-md gap-3">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email address"
                required
                className="flex-1 rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm text-gray-800 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#186a42] shadow-sm"
              />
              <button
                type="submit"
                className="flex items-center gap-2 rounded-lg bg-[#186a42] px-6 py-3 text-sm font-bold text-white transition-all hover:bg-[#125333] hover:shadow-md shadow-sm"
              >
                <Send className="h-4 w-4" />
                Subscribe
              </button>
            </form>
          )}
        </div>
      </div>

      {/* Main footer in OBU Forest Green */}
      <footer className="bg-[#0c3822] border-t border-emerald-800/40 text-white">
        <div className="container mx-auto px-4 py-16 md:px-6">
          <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-5">
            {/* Brand */}
            <div className="lg:col-span-1 space-y-4">
              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-white p-2.5 shadow-lg ring-2 ring-[#ffcc00]/40 overflow-hidden shrink-0">
                <img
                  src={siteSettings?.logo_url || "/logo.png"}
                  alt={siteSettings?.university_name || "Oda Bultum University seal"}
                  className="h-full w-full object-contain"
                />
              </div>
              <div>
                <p className="font-heading text-sm font-bold text-[#ffcc00]">ኦዳ ቡልቱም ዩኒቨርሲቲ</p>
                <p className="font-heading text-sm font-bold uppercase tracking-wide text-white">
                  {siteSettings?.university_name || "ODA BULTUM UNIVERSITY"}
                </p>
                <p className="mt-0.5 text-xs text-white/50">EST. 2015 • Chiro, Ethiopia</p>
              </div>

              <div className="space-y-2 pt-2 text-xs">
                <a
                  href={`tel:${siteSettings?.phone || "+251 25 551 0001"}`}
                  className="flex items-center gap-2 text-white/80 transition-colors hover:text-[#ffcc00]"
                >
                  <Phone className="h-3.5 w-3.5 shrink-0 text-[#ffcc00]" />
                  <span>{siteSettings?.phone || "+251 25 551 0001"}</span>
                </a>
                <a
                  href={`mailto:${siteSettings?.email || "obuofficial@obu.edu.et"}`}
                  className="flex items-center gap-2 text-white/80 transition-colors hover:text-[#ffcc00]"
                >
                  <Mail className="h-3.5 w-3.5 shrink-0 text-[#ffcc00]" />
                  <span>{siteSettings?.email || "obuofficial@obu.edu.et"}</span>
                </a>
                <span className="flex items-start gap-2 text-white/80">
                  <MapPin className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[#ffcc00]" />
                  <span>{siteSettings?.address || "Chiro, West Hararghe, Oromia, Ethiopia"}</span>
                </span>
              </div>
            </div>

            {/* Link columns */}
            {footerTree.map((column) => (
              <div key={column.label}>
                <h4 className="mb-4 text-xs font-bold uppercase tracking-widest text-[#ffcc00]">
                  {column.label}
                </h4>
                <ul className="space-y-2.5 text-sm">
                  {column.groups &&
                    column.groups[0]?.items.map(
                      (l: { label: string; href?: string; to?: string }) => (
                        <li key={l.label}>
                          {"href" in l ? (
                            <a
                              href={l.href}
                              target="_blank"
                              rel="noreferrer"
                              className="text-white/75 transition-colors hover:text-[#ffcc00]"
                            >
                              {l.label}
                            </a>
                          ) : (
                            <Link
                              to={l.to}
                              className="text-white/75 transition-colors hover:text-[#ffcc00]"
                            >
                              {l.label}
                            </Link>
                          )}
                        </li>
                      ),
                    )}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-emerald-900/80 bg-[#082617]">
          <div className="container mx-auto flex flex-col items-center justify-between gap-4 px-4 py-5 text-xs text-white/60 md:flex-row md:px-6">
            <div className="flex items-center gap-4">
              {[
                { Icon: Twitter, label: "X (Twitter)", link: siteSettings?.twitter_url },
                { Icon: Youtube, label: "YouTube", link: siteSettings?.youtube_url },
                {
                  Icon: Facebook,
                  label: "Facebook",
                  link: siteSettings?.facebook_url as string | undefined,
                },
                {
                  Icon: Instagram,
                  label: "Instagram",
                  link: siteSettings?.instagram_url as string | undefined,
                },
              ].map(({ Icon, label, link }) => {
                if (!link) return null;
                const href =
                  typeof link === "string" && link.startsWith("http") ? link : `https://${link}`;
                return (
                  <a
                    key={label}
                    href={href}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={label}
                    className="rounded-full bg-white/5 p-2 text-white/70 transition-all hover:bg-[#ffcc00] hover:text-[#0c3822]"
                  >
                    <Icon className="h-4 w-4" />
                  </a>
                );
              })}
            </div>
            <p className="text-center md:text-right">
              © {new Date().getFullYear()}{" "}
              <span className="font-semibold text-white/90">
                {siteSettings?.university_name || "Oda Bultum University"}
              </span>
              . All rights reserved.
              {siteSettings?.footer_text && (
                <span className="ml-2 text-white/50 block sm:inline">
                  {siteSettings.footer_text}
                </span>
              )}
            </p>
          </div>
        </div>
      </footer>
    </>
  );
}
