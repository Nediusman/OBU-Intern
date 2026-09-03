import { useState } from "react";
import { Link, useRouterState } from "@tanstack/react-router";
import {
  Menu,
  X,
  ChevronDown,
  MapPin,
  Mail,
  Phone,
  Facebook,
  Twitter,
  Youtube,
  Instagram,
} from "lucide-react";
import { useAuth } from "@/frontend/contexts/AuthContext";

import { NavItem, buildNavTree } from "@/frontend/services/navigation.service";
import { useQuery } from "@tanstack/react-query";
import { getNavigationItems } from "@/backend/api";

const socials = [
  { Icon: Facebook, label: "Facebook", key: "facebook_url" },
  { Icon: Twitter, label: "X (Twitter)", key: "twitter_url" },
  { Icon: Youtube, label: "YouTube", key: "youtube_url" },
  { Icon: Instagram, label: "Instagram", key: "instagram_url" },
];

import { type WebsiteSettings } from "./Footer";
import { type SiteSettingsRecord } from "@/backend/api";

export function Navbar({ settings }: { settings?: WebsiteSettings | SiteSettingsRecord | null }) {
  const [open, setOpen] = useState(false);
  const [openGroup, setOpenGroup] = useState<string | null>(null);
  const { currentUser } = useAuth();
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  const { data: dbNavItems = [] } = useQuery({
    queryKey: ["navigation", "main"],
    queryFn: () => getNavigationItems({ data: "main" }),
  });

  const navItems = buildNavTree(dbNavItems).filter(
    (item) => item.label !== "Admin Portal" && item.label !== "Admin",
  );

  const isItemActive = (item: NavItem) => {
    if (item.to && item.to !== "/") {
      if (pathname === item.to || pathname.startsWith(item.to + "/")) return true;
    }
    if (item.to === "/" && pathname === "/") return true;
    if (item.groups) {
      return item.groups.some((group) =>
        group.items.some((sub) => {
          if (sub.to && sub.to !== "/") {
            return pathname === sub.to || pathname.startsWith(sub.to + "/");
          }
          return false;
        }),
      );
    }
    return false;
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-white/95 backdrop-blur-md border-b border-gray-200/80 shadow-xs transition-all duration-300">
      {/* Top Bar (Dark Green) */}
      <div className="hidden obu-gradient xl:block border-b border-emerald-900/30">
        <div className="container mx-auto flex h-9 items-center justify-between gap-6 px-4 text-xs font-medium text-white/90 md:px-8 max-w-screen-2xl">
          <div className="flex items-center gap-6">
            <span className="flex items-center gap-2">
              <MapPin className="h-3.5 w-3.5 text-[#ffcc00] shrink-0" />
              {settings?.address || "P.O. Box 226, Oda Bultum University, Chiro, Ethiopia"}
            </span>
            <a
              href={`mailto:${settings?.email || "obuofficial@obu.edu.et"}`}
              className="flex items-center gap-2 transition-colors hover:text-[#ffcc00]"
            >
              <Mail className="h-3.5 w-3.5 text-[#ffcc00] shrink-0" />
              obuofficial@obu.edu.et
            </a>
            <a
              href={`tel:${settings?.phone || "+251256510040"}`}
              className="flex items-center gap-2 transition-colors hover:text-[#ffcc00]"
            >
              <Phone className="h-3.5 w-3.5 text-[#ffcc00] shrink-0" />
              +251256510040
            </a>
          </div>
          <div className="flex items-center gap-4">
            {socials.map(({ Icon, label, key }) => {
              const url = (settings?.[key] as string | undefined) || "";
              if (!url) return null;
              return (
                <a
                  key={label}
                  href={url}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={label}
                  className="text-white/80 transition-all hover:text-[#ffcc00] hover:scale-110"
                >
                  <Icon className="h-3.5 w-3.5" />
                </a>
              );
            })}
          </div>
        </div>
      </div>

      {/* Main Navbar (White) */}
      <div className="container mx-auto flex h-[80px] sm:h-[88px] items-center justify-between px-3 sm:px-4 xl:px-4 2xl:px-8 max-w-screen-2xl">
        <Link
          to="/"
          className="flex items-center gap-2.5 sm:gap-3.5 group shrink-0 pr-2 sm:pr-3 select-none"
        >
          <img
            src={settings?.logo_url || "/logo.png"}
            alt="Oda Bultum University logo"
            className="h-14 w-14 sm:h-[68px] sm:w-[68px] lg:h-[72px] lg:w-[72px] shrink-0 object-contain transition-transform duration-300 group-hover:scale-105"
          />
          <div className="border-l-2 border-[#ffcc00] pl-2.5 sm:pl-3.5 py-0.5 flex flex-col justify-center gap-0.5 min-w-0">
            <p className="font-heading text-xs sm:text-[14px] lg:text-[15px] font-bold leading-tight text-[#186a42] tracking-tight whitespace-nowrap">
              Yuunivarsiitii Odaa Bultum
            </p>
            <p className="font-heading text-[11px] sm:text-[12px] lg:text-[13px] font-bold leading-tight text-[#d97706] whitespace-nowrap">
              ኦዳ ቡልቱም ዩኒቨርሲቲ
            </p>
            <p className="font-heading text-[9px] sm:text-[10px] lg:text-[11px] font-semibold tracking-[0.12em] text-[#186a42] uppercase mt-0.5 whitespace-nowrap">
              {settings?.university_name || "Oda Bultum University"}
            </p>
          </div>
        </Link>

        <nav className="hidden items-center xl:flex h-full gap-0 2xl:gap-1 shrink-0">
          {navItems.map((item) => {
            const active = isItemActive(item);
            const activeClass =
              "text-[#0c3822] font-bold relative after:absolute after:bottom-0 after:left-1.5 after:right-1.5 2xl:after:left-2.5 2xl:after:right-2.5 after:h-[3px] after:bg-gradient-to-r after:from-[#186a42] after:via-[#ffcc00] after:to-[#186a42] after:rounded-t-full";
            const inactiveClass =
              "text-gray-800 hover:text-[#0c3822] hover:bg-emerald-50/40 rounded-lg xl:rounded-none xl:hover:bg-transparent";

            return (
              <div key={item.label} className="group h-full flex items-center relative shrink-0">
                {item.href ? (
                  <a
                    href={item.href}
                    target="_blank"
                    rel="noreferrer"
                    className={`flex items-center gap-1 2xl:gap-1.5 px-1.5 xl:px-2 2xl:px-3 text-[12.5px] xl:text-[13px] 2xl:text-[14.5px] font-semibold transition-all duration-200 h-full tracking-[-0.01em] whitespace-nowrap ${
                      active ? activeClass : inactiveClass
                    }`}
                  >
                    <span>{item.label}</span>
                    {item.groups && (
                      <ChevronDown className="h-3.5 w-3.5 opacity-60 text-gray-500 transition-transform duration-250 ease-out group-hover:rotate-180 group-hover:text-[#186a42] group-hover:opacity-100 shrink-0" />
                    )}
                  </a>
                ) : item.to ? (
                  <Link
                    to={item.to}
                    className={`flex items-center gap-1 2xl:gap-1.5 px-1.5 xl:px-2 2xl:px-3 text-[12.5px] xl:text-[13px] 2xl:text-[14.5px] font-semibold transition-all duration-200 h-full tracking-[-0.01em] whitespace-nowrap ${
                      active ? activeClass : inactiveClass
                    }`}
                  >
                    <span>{item.label}</span>
                    {item.groups && (
                      <ChevronDown className="h-3.5 w-3.5 opacity-60 text-gray-500 transition-transform duration-250 ease-out group-hover:rotate-180 group-hover:text-[#186a42] group-hover:opacity-100 shrink-0" />
                    )}
                  </Link>
                ) : (
                  <button
                    type="button"
                    className={`flex items-center gap-1 2xl:gap-1.5 px-1.5 xl:px-2 2xl:px-3 text-[12.5px] xl:text-[13px] 2xl:text-[14.5px] font-semibold transition-all duration-200 h-full tracking-[-0.01em] whitespace-nowrap cursor-default ${
                      active ? activeClass : inactiveClass
                    }`}
                  >
                    <span>{item.label}</span>
                    {item.groups && (
                      <ChevronDown className="h-3.5 w-3.5 opacity-60 text-gray-500 transition-transform duration-250 ease-out group-hover:rotate-180 group-hover:text-[#186a42] group-hover:opacity-100 shrink-0" />
                    )}
                  </button>
                )}

                {item.groups && (
                  <div className="invisible absolute left-0 group-last:left-auto group-last:right-0 top-[calc(100%-1px)] z-50 min-w-[260px] opacity-0 transition-all duration-200 group-hover:visible group-hover:opacity-100 bg-white/98 backdrop-blur-xl rounded-b-2xl border-t-[3px] border-[#186a42] border-x border-b border-gray-100 shadow-[0_20px_40px_rgba(12,56,34,0.1),0_4px_12px_rgba(0,0,0,0.04)] py-1.5 overflow-hidden">
                    <div className="flex flex-col">
                      {item.groups.map((group, i) => (
                        <div key={i} className="relative group/sub">
                          {group.heading && (
                            <div className="flex items-center justify-between px-4 py-2.5 text-[11px] font-bold text-[#186a42] uppercase tracking-wider bg-emerald-50/70 border-b border-emerald-100/50 cursor-pointer select-none">
                              <span>{group.heading}</span>
                              <ChevronDown className="h-3 w-3 -rotate-90 opacity-60 text-[#186a42]" />
                            </div>
                          )}

                          {group.heading ? (
                            <div className="invisible absolute left-full group-last:left-auto group-last:right-full top-0 z-50 min-w-[260px] opacity-0 transition-all duration-200 group-hover/sub:visible group-hover/sub:opacity-100 bg-white/98 backdrop-blur-xl rounded-2xl border border-gray-100 shadow-[0_20px_40px_rgba(12,56,34,0.12),0_4px_12px_rgba(0,0,0,0.04)] -mt-1.5 py-1.5">
                              {group.items.map((sub) =>
                                sub.href ? (
                                  <a
                                    key={sub.label}
                                    href={sub.href}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="block px-4 py-2.5 text-[14px] font-medium text-gray-700 transition-all duration-150 hover:bg-emerald-50/70 hover:text-[#186a42] hover:pl-5 border-b border-gray-50/80 last:border-0"
                                  >
                                    {sub.label}
                                  </a>
                                ) : (
                                  <Link
                                    key={sub.label}
                                    to={sub.to ?? "/"}
                                    className="block px-4 py-2.5 text-[14px] font-medium text-gray-700 transition-all duration-150 hover:bg-emerald-50/70 hover:text-[#186a42] hover:pl-5 border-b border-gray-50/80 last:border-0"
                                  >
                                    {sub.label}
                                  </Link>
                                ),
                              )}
                            </div>
                          ) : (
                            <ul className="flex flex-col">
                              {group.items.map((sub) =>
                                sub.href ? (
                                  <li key={sub.label}>
                                    <a
                                      href={sub.href}
                                      target="_blank"
                                      rel="noreferrer"
                                      className="block px-4 py-2.5 text-[14px] font-medium text-gray-700 transition-all duration-150 hover:bg-emerald-50/70 hover:text-[#186a42] hover:pl-5 border-b border-gray-50/80 last:border-0"
                                    >
                                      {sub.label}
                                    </a>
                                  </li>
                                ) : (
                                  <li key={sub.label}>
                                    <Link
                                      to={sub.to ?? "/"}
                                      className="block px-4 py-2.5 text-[14px] font-medium text-gray-700 transition-all duration-150 hover:bg-emerald-50/70 hover:text-[#186a42] hover:pl-5 border-b border-gray-50/80 last:border-0"
                                    >
                                      {sub.label}
                                    </Link>
                                  </li>
                                ),
                              )}
                            </ul>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </nav>

        <button
          onClick={() => setOpen(!open)}
          className="inline-flex h-10 w-10 items-center justify-center rounded-lg text-[#186a42] xl:hidden bg-emerald-50/60 hover:bg-emerald-100/60 transition-colors shrink-0"
          aria-label="Toggle menu"
          aria-expanded={open}
        >
          {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile Menu */}
      {open && (
        <div className="max-h-[75vh] overflow-y-auto border-t border-gray-100 bg-white/98 backdrop-blur-xl shadow-2xl xl:hidden">
          <div className="container mx-auto space-y-1 px-4 py-4">
            {navItems.map((item) => {
              const active = isItemActive(item);
              return (
                <div key={item.label}>
                  <div className="flex items-center">
                    {item.href ? (
                      <a
                        href={item.href}
                        target="_blank"
                        rel="noreferrer"
                        onClick={() => setOpen(false)}
                        className={`flex-1 rounded-xl px-4 py-3 text-[15px] font-semibold transition-colors ${
                          active
                            ? "bg-emerald-50 text-[#0c3822]"
                            : "text-gray-800 hover:bg-emerald-50/60 hover:text-[#186a42]"
                        }`}
                      >
                        {item.label}
                      </a>
                    ) : item.to ? (
                      <Link
                        to={item.to}
                        onClick={() => setOpen(false)}
                        className={`flex-1 rounded-xl px-4 py-3 text-[15px] font-semibold transition-colors ${
                          active
                            ? "bg-emerald-50 text-[#0c3822]"
                            : "text-gray-800 hover:bg-emerald-50/60 hover:text-[#186a42]"
                        }`}
                      >
                        {item.label}
                      </Link>
                    ) : (
                      <button
                        type="button"
                        onClick={() => setOpenGroup(openGroup === item.label ? null : item.label)}
                        className={`flex-1 text-left rounded-xl px-4 py-3 text-[15px] font-semibold transition-colors ${
                          active
                            ? "bg-emerald-50 text-[#0c3822]"
                            : "text-gray-800 hover:bg-emerald-50/60 hover:text-[#186a42]"
                        }`}
                      >
                        {item.label}
                      </button>
                    )}
                    {item.groups && (
                      <button
                        onClick={() => setOpenGroup(openGroup === item.label ? null : item.label)}
                        aria-label={`Toggle ${item.label} submenu`}
                        className="inline-flex h-10 w-10 items-center justify-center rounded-lg text-gray-500 bg-gray-50 hover:bg-emerald-50 hover:text-[#186a42] transition-colors"
                      >
                        <ChevronDown
                          className={`h-4 w-4 transition-transform duration-200 ${
                            openGroup === item.label ? "rotate-180 text-[#186a42]" : ""
                          }`}
                        />
                      </button>
                    )}
                  </div>
                  {item.groups && openGroup === item.label && (
                    <div className="ml-3 mt-1 mb-2 space-y-1 border-l-2 border-emerald-200/80 pl-3">
                      {item.groups.map((group, i) => (
                        <div key={i} className="mb-3">
                          {group.heading && (
                            <p className="px-2.5 py-1 text-[11px] font-bold text-[#186a42] uppercase tracking-wider">
                              {group.heading}
                            </p>
                          )}
                          {group.items.map((sub) =>
                            sub.href ? (
                              <a
                                key={sub.label}
                                href={sub.href}
                                target="_blank"
                                rel="noreferrer"
                                onClick={() => setOpen(false)}
                                className="block rounded-lg px-3 py-2 text-[14px] font-medium text-gray-600 hover:text-[#186a42] hover:bg-emerald-50/60 transition-colors"
                              >
                                {sub.label}
                              </a>
                            ) : (
                              <Link
                                key={sub.label}
                                to={sub.to ?? "/"}
                                onClick={() => setOpen(false)}
                                className="block rounded-lg px-3 py-2 text-[14px] font-medium text-gray-600 hover:text-[#186a42] hover:bg-emerald-50/60 transition-colors"
                              >
                                {sub.label}
                              </Link>
                            ),
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </header>
  );
}
