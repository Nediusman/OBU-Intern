import { Link, useLocation } from "@tanstack/react-router";
import { useAuth } from "@/frontend/contexts/AuthContext";
import {
  LayoutDashboard,
  Globe,
  FileText,
  Users,
  Settings,
  GraduationCap,
  Building,
  Microscope,
  Calendar,
  Image as ImageIcon,
  MessageSquare,
  Megaphone,
  BookOpen,
  LogOut,
  X,
  ChevronDown,
  Archive,
  Briefcase,
  User,
} from "lucide-react";
import { useState } from "react";

type SidebarItem = { label: string; href: string; icon?: React.ElementType };
type SidebarGroup = { heading: string; icon?: React.ElementType; items: SidebarItem[] };

const SIDEBAR_ITEMS: SidebarGroup[] = [
  {
    heading: "Dashboard",
    items: [{ label: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard }],
  },
  {
    heading: "Account",
    icon: User,
    items: [{ label: "My Account", href: "/admin/account" }],
  },
  {
    heading: "Website",
    icon: Globe,
    items: [
      { label: "Homepage", href: "/admin/website/homepage" },
      { label: "Pages", href: "/admin/website/pages" },
      { label: "Navigation", href: "/admin/website/navigation" },
      { label: "Media Library", href: "/admin/website/media" },
      { label: "Site Settings", href: "/admin/website/settings" },
    ],
  },
  {
    heading: "Academics",
    icon: GraduationCap,
    items: [
      { label: "Academic Units", href: "/admin/academics/units" },
      { label: "Colleges / Faculties", href: "/admin/academics/faculties" },
      { label: "Departments", href: "/admin/academics/departments" },
      { label: "Programs", href: "/admin/academics/programs" },
    ],
  },
  {
    heading: "Leadership & Admin",
    icon: Building,
    items: [
      { label: "University Leadership", href: "/admin/leadership" },
      { label: "Administrative Offices", href: "/admin/administration" },
    ],
  },
  {
    heading: "Registrar",
    icon: Archive,
    items: [
      { label: "Registrar Information", href: "/admin/registrar/information" },
      { label: "Registration Announcements", href: "/admin/registrar/announcements" },
      { label: "Registrar Documents", href: "/admin/registrar/documents" },
    ],
  },
  {
    heading: "Research",
    icon: Microscope,
    items: [
      { label: "Research Projects", href: "/admin/research/projects" },
      { label: "Community Engagement", href: "/admin/research/engagement" },
      { label: "Research Facilities", href: "/admin/research/facilities" },
      { label: "Research Gallery", href: "/admin/research/gallery" },
    ],
  },
  {
    heading: "Services",
    icon: MessageSquare,
    items: [{ label: "Services", href: "/admin/services" }],
  },
  {
    heading: "Career",
    icon: Briefcase,
    items: [{ label: "Vacancies", href: "/admin/career/vacancies" }],
  },
  {
    heading: "Content / Communication",
    icon: Megaphone,
    items: [
      { label: "News", href: "/admin/content/news" },
      { label: "Announcements", href: "/admin/content/announcements" },
      { label: "Events", href: "/admin/content/events" },
      { label: "Contact Messages", href: "/admin/content/messages" },
      { label: "Galleries", href: "/admin/content/galleries" },
    ],
  },
  {
    heading: "System",
    icon: Settings,
    items: [
      { label: "Users", href: "/admin/system/users" },
      { label: "Roles & Permissions", href: "/admin/system/roles" },
      { label: "Activity Logs", href: "/admin/system/activity-logs" },
      { label: "System Settings", href: "/admin/system/settings" },
    ],
  },
];

export function AdminSidebar({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const location = useLocation();
  const pathname = location.pathname;
  const { currentUser, logout } = useAuth();
  const isSuperAdmin = currentUser?.role_name?.toLowerCase() === "super admin";

  const visibleNavigation = SIDEBAR_ITEMS.filter((group) => {
    if (group.heading === "System" && !isSuperAdmin) {
      return false;
    }
    return true;
  });

  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>({});

  const toggleGroup = (heading: string) => {
    setOpenGroups((prev) => ({ ...prev, [heading]: !prev[heading] }));
  };

  const isCurrentPath = (href: string) =>
    location.pathname === href || location.pathname.startsWith(`${href}/`);

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && <div className="fixed inset-0 z-40 bg-black/50 lg:hidden" onClick={onClose} />}

      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-50 w-64 transform flex-col bg-white border-r border-gray-200 transition-transform duration-200 ease-in-out lg:static lg:flex lg:translate-x-0 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex h-16 items-center justify-between px-4 border-b border-gray-200">
          <div className="font-bold text-[#186a42] flex items-center gap-2.5">
            <img
              src="/logo.png"
              alt="Oda Bultum University"
              className="h-9 w-9 shrink-0 object-contain"
            />
            <span className="text-lg tracking-tight">OBU Admin</span>
          </div>
          <button onClick={onClose} className="lg:hidden text-gray-500 hover:text-gray-700">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto py-4">
          <nav className="space-y-1 px-3">
            {visibleNavigation.map((group) => {
              // If group has no nested items structurally except its single link
              if (group.items.length === 1 && !group.icon) {
                const item = group.items[0]!;
                const active = isCurrentPath(item.href);
                return (
                  <Link
                    key={item.href}
                    to={item.href as "/"}
                    onClick={() => onClose()}
                    className={`group flex items-center rounded-md px-3 py-2 text-sm font-medium ${
                      active ? "bg-[#186a42]/10 text-[#186a42]" : "text-gray-700 hover:bg-gray-100"
                    }`}
                  >
                    {item.icon && (
                      <item.icon
                        className={`mr-3 h-5 w-5 flex-shrink-0 ${active ? "text-[#186a42]" : "text-gray-400 group-hover:text-gray-500"}`}
                      />
                    )}
                    {item.label}
                  </Link>
                );
              }

              // Group with nested items
              const isActiveGroup = group.items.some((item) => isCurrentPath(item.href));
              const isOpenGroup =
                openGroups[group.heading] !== undefined ? openGroups[group.heading] : isActiveGroup;

              return (
                <div key={group.heading} className="space-y-1 pt-2">
                  <button
                    onClick={() => toggleGroup(group.heading)}
                    className="flex w-full items-center justify-between rounded-md px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100"
                  >
                    <div className="flex items-center">
                      {group.icon && (
                        <group.icon className="mr-3 h-5 w-5 flex-shrink-0 text-gray-400" />
                      )}
                      {group.heading}
                    </div>
                    <ChevronDown
                      className={`h-4 w-4 text-gray-400 transition-transform ${isOpenGroup ? "rotate-180" : ""}`}
                    />
                  </button>

                  {isOpenGroup && (
                    <div className="space-y-1 px-3 pt-1">
                      {group.items.map((item) => {
                        const active = isCurrentPath(item.href);
                        return (
                          <Link
                            key={item.href}
                            to={item.href as "/"}
                            onClick={() => onClose()}
                            className={`group flex items-center rounded-md pl-8 pr-2 py-1.5 text-sm font-medium ${
                              active
                                ? "bg-[#186a42]/10 text-[#186a42]"
                                : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                            }`}
                          >
                            {item.icon && (
                              <item.icon
                                className={`mr-2 h-4 w-4 flex-shrink-0 ${active ? "text-[#186a42]" : "text-gray-400"}`}
                              />
                            )}
                            {item.label}
                          </Link>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </nav>
        </div>

        <div className="border-t border-gray-200 p-4">
          <button
            onClick={() => logout()}
            className="flex w-full items-center rounded-md px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50"
          >
            <LogOut className="mr-3 h-5 w-5" />
            Sign Out
          </button>
        </div>
      </div>
    </>
  );
}
