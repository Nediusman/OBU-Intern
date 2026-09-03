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

function DesktopNavDropdown({
  items,
  isRoot = false,
  isRightAligned = false,
}: {
  items: NavItem[];
  isRoot?: boolean;
  isRightAligned?: boolean;
}) {
  if (!items || items.length === 0) return null;

  const containerClasses = isRoot
    ? `invisible absolute ${
        isRightAligned ? "right-0 left-auto" : "left-0 right-auto"
      } top-[calc(100%-1px)] z-50 min-w-[260px] opacity-0 transition-all duration-200 group-hover:visible group-hover:opacity-100 bg-white/98 backdrop-blur-xl rounded-b-2xl border-t-[3px] border-[#186a42] border-x border-b border-gray-100 shadow-[0_20px_40px_rgba(12,56,34,0.1),0_4px_12px_rgba(0,0,0,0.04)] py-1.5`
    : `nav-flyout invisible absolute ${
        isRightAligned ? "right-full left-auto -mr-1" : "left-full right-auto -ml-1"
      } top-0 z-50 min-w-[260px] opacity-0 transition-all duration-200 bg-white/98 backdrop-blur-xl rounded-2xl border border-gray-100 shadow-[0_20px_40px_rgba(12,56,34,0.12),0_4px_12px_rgba(0,0,0,0.04)] -mt-1.5 py-1.5`;

  return (
    <div className={containerClasses}>
      <div className="flex flex-col">
        {items.map((subItem) => {
          const hasChildren = Boolean(subItem.children && subItem.children.length > 0);

          if (hasChildren) {
            return (
              <div
                key={subItem.id || subItem.label}
                className="relative [&:hover>.nav-flyout]:visible [&:hover>.nav-flyout]:opacity-100"
              >
                {subItem.href ? (
                  <a
                    href={subItem.href}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center justify-between px-4 py-2.5 text-[13.5px] font-medium text-gray-700 transition-all duration-150 hover:bg-emerald-50/70 hover:text-[#186a42] hover:pl-5 border-b border-gray-50/80 last:border-0"
                  >
                    <span>{subItem.label}</span>
                    <ChevronDown
                      className={`h-3.5 w-3.5 opacity-60 text-gray-400 group-hover:text-[#186a42] ${
                        isRightAligned ? "rotate-90" : "-rotate-90"
                      } shrink-0`}
                    />
                  </a>
                ) : subItem.to ? (
                  <Link
                    to={subItem.to}
                    className="flex items-center justify-between px-4 py-2.5 text-[13.5px] font-medium text-gray-700 transition-all duration-150 hover:bg-emerald-50/70 hover:text-[#186a42] hover:pl-5 border-b border-gray-50/80 last:border-0"
                  >
                    <span>{subItem.label}</span>
                    <ChevronDown
                      className={`h-3.5 w-3.5 opacity-60 text-gray-400 group-hover:text-[#186a42] ${
                        isRightAligned ? "rotate-90" : "-rotate-90"
                      } shrink-0`}
                    />
                  </Link>
                ) : (
                  <div className="flex items-center justify-between px-4 py-2.5 text-[13.5px] font-semibold text-gray-800 transition-all duration-150 hover:bg-emerald-50/70 hover:text-[#186a42] hover:pl-5 border-b border-gray-50/80 last:border-0 cursor-default select-none">
                    <span>{subItem.label}</span>
                    <ChevronDown
                      className={`h-3.5 w-3.5 opacity-60 text-gray-400 ${
                        isRightAligned ? "rotate-90" : "-rotate-90"
                      } shrink-0`}
                    />
                  </div>
                )}

                {/* Recursive nested flyout submenu */}
                <DesktopNavDropdown
                  items={subItem.children!}
                  isRoot={false}
                  isRightAligned={isRightAligned}
                />
              </div>
            );
          }

          return (
            <div key={subItem.id || subItem.label}>
              {subItem.href ? (
                <a
                  href={subItem.href}
                  target="_blank"
                  rel="noreferrer"
                  className="block px-4 py-2.5 text-[14px] font-medium text-gray-700 transition-all duration-150 hover:bg-emerald-50/70 hover:text-[#186a42] hover:pl-5 border-b border-gray-50/80 last:border-0"
                >
                  {subItem.label}
                </a>
              ) : subItem.to ? (
                <Link
                  to={subItem.to}
                  className="block px-4 py-2.5 text-[14px] font-medium text-gray-700 transition-all duration-150 hover:bg-emerald-50/70 hover:text-[#186a42] hover:pl-5 border-b border-gray-50/80 last:border-0"
                >
                  {subItem.label}
                </Link>
              ) : (
                <div className="block px-4 py-2.5 text-[14px] font-medium text-gray-400 border-b border-gray-50/80 last:border-0 select-none">
                  {subItem.label}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function MobileNavNode({
  item,
  depth = 0,
  openMap,
  toggleOpen,
  onClose,
  isItemActive,
}: {
  item: NavItem;
  depth?: number;
  openMap: Record<string, boolean>;
  toggleOpen: (id: string) => void;
  onClose: () => void;
  isItemActive: (item: NavItem) => boolean;
}) {
  const hasChildren = Boolean(item.children && item.children.length > 0);
  const isOpen = Boolean(openMap[item.id]);
  const active = isItemActive(item);

  const paddingLeft = depth === 0 ? "px-4" : depth === 1 ? "px-3" : "px-2.5";
  const fontSize = depth === 0 ? "text-[15px]" : depth === 1 ? "text-[14px]" : "text-[13.5px]";
  const fontWeight = depth === 0 ? "font-semibold" : depth === 1 ? "font-medium" : "font-normal";

  return (
    <div className="w-full">
      <div className="flex items-center justify-between gap-1">
        {item.href ? (
          <a
            href={item.href}
            target="_blank"
            rel="noreferrer"
            onClick={onClose}
            className={`flex-1 rounded-xl ${paddingLeft} py-2.5 ${fontSize} ${fontWeight} transition-colors ${
              active
                ? "bg-emerald-50 text-[#0c3822] font-semibold"
                : "text-gray-800 hover:bg-emerald-50/60 hover:text-[#186a42]"
            }`}
          >
            {item.label}
          </a>
        ) : item.to ? (
          <Link
            to={item.to}
            onClick={onClose}
            className={`flex-1 rounded-xl ${paddingLeft} py-2.5 ${fontSize} ${fontWeight} transition-colors ${
              active
                ? "bg-emerald-50 text-[#0c3822] font-semibold"
                : "text-gray-800 hover:bg-emerald-50/60 hover:text-[#186a42]"
            }`}
          >
            {item.label}
          </Link>
        ) : (
          <button
            type="button"
            onClick={() => hasChildren && toggleOpen(item.id)}
            className={`flex-1 text-left rounded-xl ${paddingLeft} py-2.5 ${fontSize} ${fontWeight} transition-colors ${
              active
                ? "bg-emerald-50 text-[#0c3822] font-semibold"
                : "text-gray-800 hover:bg-emerald-50/60 hover:text-[#186a42]"
            }`}
          >
            {item.label}
          </button>
        )}

        {hasChildren && (
          <button
            type="button"
            onClick={() => toggleOpen(item.id)}
            aria-label={`Toggle ${item.label} submenu`}
            aria-expanded={isOpen}
            className="inline-flex h-9 w-9 items-center justify-center rounded-lg text-gray-500 bg-gray-50 hover:bg-emerald-50 hover:text-[#186a42] transition-colors shrink-0"
          >
            <ChevronDown
              className={`h-4 w-4 transition-transform duration-200 ${
                isOpen ? "rotate-180 text-[#186a42]" : ""
              }`}
            />
          </button>
        )}
      </div>

      {hasChildren && isOpen && (
        <div className="ml-3 mt-1 mb-1.5 space-y-1 border-l-2 border-emerald-200/80 pl-2.5">
          {item.children!.map((child) => (
            <MobileNavNode
              key={child.id || child.label}
              item={child}
              depth={depth + 1}
              openMap={openMap}
              toggleOpen={toggleOpen}
              onClose={onClose}
              isItemActive={isItemActive}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export function Navbar({ settings }: { settings?: WebsiteSettings | SiteSettingsRecord | null }) {
  const [open, setOpen] = useState(false);
  const [openItems, setOpenItems] = useState<Record<string, boolean>>({});
  const { currentUser } = useAuth();
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  const toggleOpen = (id: string) => {
    setOpenItems((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const { data: dbNavItems = [] } = useQuery({
    queryKey: ["navigation", "main"],
    queryFn: () => getNavigationItems({ data: "main" }),
  });

  const navItems = buildNavTree(dbNavItems).filter(
    (item) => item.label !== "Admin Portal" && item.label !== "Admin",
  );

  const isItemActive = (item: NavItem): boolean => {
    if (item.to && item.to !== "/") {
      if (pathname === item.to || pathname.startsWith(item.to + "/")) return true;
    }
    if (item.to === "/" && pathname === "/") return true;
    if (item.children && item.children.length > 0) {
      return item.children.some(isItemActive);
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
          {navItems.map((item, index) => {
            const hasChildren = Boolean(item.children && item.children.length > 0);
            const active = isItemActive(item);
            const isRightAligned = index >= navItems.length - 2;

            const activeClass =
              "text-[#0c3822] font-bold relative after:absolute after:bottom-0 after:left-1.5 after:right-1.5 2xl:after:left-2.5 2xl:after:right-2.5 after:h-[3px] after:bg-gradient-to-r after:from-[#186a42] after:via-[#ffcc00] after:to-[#186a42] after:rounded-t-full";
            const inactiveClass =
              "text-gray-800 hover:text-[#0c3822] hover:bg-emerald-50/40 rounded-lg xl:rounded-none xl:hover:bg-transparent";

            return (
              <div key={item.id || item.label} className="group h-full flex items-center relative shrink-0">
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
                    {hasChildren && (
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
                    {hasChildren && (
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
                    {hasChildren && (
                      <ChevronDown className="h-3.5 w-3.5 opacity-60 text-gray-500 transition-transform duration-250 ease-out group-hover:rotate-180 group-hover:text-[#186a42] group-hover:opacity-100 shrink-0" />
                    )}
                  </button>
                )}

                {/* Recursive Desktop Dropdown Menu */}
                {hasChildren && (
                  <DesktopNavDropdown
                    items={item.children!}
                    isRoot={true}
                    isRightAligned={isRightAligned}
                  />
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
            {navItems.map((item) => (
              <MobileNavNode
                key={item.id || item.label}
                item={item}
                depth={0}
                openMap={openItems}
                toggleOpen={toggleOpen}
                onClose={() => setOpen(false)}
                isItemActive={isItemActive}
              />
            ))}
          </div>
        </div>
      )}
    </header>
  );
}
