import { createFileRoute, Link } from "@tanstack/react-router";
import { AdminPageHeader } from "@/frontend/admin/components/AdminPageHeader";
import {
  FileText,
  Megaphone,
  Briefcase,
  Calendar,
  Microscope,
  Image as ImageIcon,
  Plus,
  AlertCircle,
  MessageSquare,
  ArrowRight,
  Shield,
  Clock,
} from "lucide-react";
import { useDashboardStats } from "@/frontend/admin/hooks/useDashboard";
import { formatDistanceToNow } from "date-fns";

export const Route = createFileRoute("/admin/dashboard")({
  component: Dashboard,
});

function Dashboard() {
  const { data, isLoading } = useDashboardStats();

  if (isLoading || !data) {
    return (
      <div className="space-y-6">
        <AdminPageHeader
          title="Dashboard"
          description="Overview of the Oda Bultum University website content and activity."
        />
        <div className="flex h-64 items-center justify-center">
          <div className="text-sm text-gray-500">Loading dashboard data...</div>
        </div>
      </div>
    );
  }

  const STATS = [
    {
      name: "Total Pages",
      value: data.counts.pages.toString(),
      subValue: "Total active pages",
      icon: FileText,
      color: "bg-blue-500",
    },
    {
      name: "Total News",
      value: data.counts.news.toString(),
      subValue: "All news articles",
      icon: Megaphone,
      color: "bg-green-500",
    },
    {
      name: "Active Vacancies",
      value: data.counts.vacancies.toString(),
      subValue: "Job postings",
      icon: Briefcase,
      color: "bg-purple-500",
    },
    {
      name: "Announcements",
      value: data.counts.announcements.toString(),
      subValue: "All announcements",
      icon: Megaphone,
      color: "bg-yellow-500",
    },
    {
      name: "Upcoming Events",
      value: data.counts.events.toString(),
      subValue: "All events",
      icon: Calendar,
      color: "bg-orange-500",
    },
    {
      name: "Research Projects",
      value: data.counts.research_projects.toString(),
      subValue: "Total projects",
      icon: Microscope,
      color: "bg-indigo-500",
    },
    {
      name: "Uploaded Media",
      value: data.counts.media.toString(),
      subValue: "Images & Documents",
      icon: ImageIcon,
      color: "bg-pink-500",
    },
  ];

  const PENDING_ACTIONS = [
    {
      id: 1,
      title: "Draft Pages",
      count: data.pending.draftPages,
      type: "pages",
      icon: FileText,
      color: "text-gray-500",
      link: "/admin/website/pages",
    },
    {
      id: 2,
      title: "Unread Messages",
      count: data.pending.unreadMessages,
      type: "messages",
      icon: MessageSquare,
      color: "text-blue-600",
      link: "/admin/content/messages",
    },
  ];

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Dashboard"
        description="Overview of the Oda Bultum University website content and activity."
      />

      {/* Quick Actions */}
      <div>
        <h2 className="text-sm font-semibold text-gray-900 mb-3 uppercase tracking-wider">
          Quick Actions
        </h2>
        <div className="flex flex-wrap gap-3">
          <Link
            to="/admin/website/pages"
            className="inline-flex items-center gap-2 rounded-md bg-white px-4 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
          >
            <Plus className="h-4 w-4 text-gray-400" /> Add Page
          </Link>
          <Link
            to="/admin/content/news"
            className="inline-flex items-center gap-2 rounded-md bg-white px-4 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
          >
            <Plus className="h-4 w-4 text-gray-400" /> Add News
          </Link>
          <Link
            to="/admin/content/announcements"
            className="inline-flex items-center gap-2 rounded-md bg-white px-4 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
          >
            <Plus className="h-4 w-4 text-gray-400" /> Add Announcement
          </Link>
          <Link
            to="/admin/career/vacancies"
            className="inline-flex items-center gap-2 rounded-md bg-white px-4 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
          >
            <Plus className="h-4 w-4 text-gray-400" /> Add Vacancy
          </Link>
          <Link
            to="/admin/content/events"
            className="inline-flex items-center gap-2 rounded-md bg-white px-4 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
          >
            <Plus className="h-4 w-4 text-gray-400" /> Add Event
          </Link>
          <Link
            to="/admin/website/media"
            className="inline-flex items-center gap-2 rounded-md bg-white px-4 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
          >
            <Plus className="h-4 w-4 text-gray-400" /> Upload Media
          </Link>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {STATS.map((stat) => (
          <div
            key={stat.name}
            className="overflow-hidden rounded-lg bg-white px-4 py-5 shadow sm:p-6 ring-1 ring-gray-200 flex items-center"
          >
            <div className={`flex-shrink-0 p-3 rounded-md ${stat.color} text-white mr-4`}>
              <stat.icon className="h-6 w-6" aria-hidden="true" />
            </div>
            <div>
              <dt className="truncate text-sm font-medium text-gray-500">{stat.name}</dt>
              <dd className="mt-1 flex items-baseline text-2xl font-semibold tracking-tight text-gray-900">
                {stat.value}
              </dd>
              <dd className="mt-1 text-xs text-gray-500">{stat.subValue}</dd>
            </div>
          </div>
        ))}
      </div>

      {/* Official Website Governance Monitoring (Policy Section 7.3 & 15) */}
      <div className="rounded-xl bg-white p-6 shadow-sm ring-1 ring-gray-200 border-l-4 border-[#186a42]">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
          <div className="flex items-center gap-2.5">
            <Shield className="h-5 w-5 text-[#186a42]" />
            <div>
              <h2 className="text-base font-bold text-gray-900">Website Governance & Content Health (Policy Sec 7.3)</h2>
              <p className="text-xs text-gray-500">Tracking institutional review frequency standards mandated by the Web Governance Committee.</p>
            </div>
          </div>
          <Link
            to="/governance"
            target="_blank"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-[#186a42] hover:underline"
          >
            View Full Policy Document &rarr;
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs pt-2">
          <div className="p-3 bg-emerald-50/70 rounded-lg border border-emerald-100 flex items-center justify-between">
            <div>
              <span className="font-bold text-emerald-950 block">Homepage & News</span>
              <span className="text-emerald-700 text-[11px]">Daily / Continuous</span>
            </div>
            <span className="px-2 py-0.5 rounded-full bg-emerald-200 text-emerald-900 font-bold text-[10px]">ACTIVE</span>
          </div>
          <div className="p-3 bg-emerald-50/70 rounded-lg border border-emerald-100 flex items-center justify-between">
            <div>
              <span className="font-bold text-emerald-950 block">Academic Departments</span>
              <span className="text-emerald-700 text-[11px]">Once Per Semester</span>
            </div>
            <span className="px-2 py-0.5 rounded-full bg-emerald-200 text-emerald-900 font-bold text-[10px]">COMPLIANT</span>
          </div>
          <div className="p-3 bg-emerald-50/70 rounded-lg border border-emerald-100 flex items-center justify-between">
            <div>
              <span className="font-bold text-emerald-950 block">Admissions & Registrar</span>
              <span className="text-emerald-700 text-[11px]">Before Intake Cycle</span>
            </div>
            <span className="px-2 py-0.5 rounded-full bg-emerald-200 text-emerald-900 font-bold text-[10px]">ACTIVE</span>
          </div>
          <div className="p-3 bg-blue-50/70 rounded-lg border border-blue-100 flex items-center justify-between">
            <div>
              <span className="font-bold text-blue-950 block">Technical Audit & SSL</span>
              <span className="text-blue-700 text-[11px]">Monthly (ICT Directorate)</span>
            </div>
            <span className="px-2 py-0.5 rounded-full bg-blue-200 text-blue-900 font-bold text-[10px]">SCHEDULED</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Pending Actions */}
        <div className="lg:col-span-1 space-y-4">
          <h2 className="text-sm font-semibold text-gray-900 uppercase tracking-wider">
            Pending Actions
          </h2>
          <div className="rounded-lg bg-white shadow ring-1 ring-gray-200 overflow-hidden divide-y divide-gray-200">
            {PENDING_ACTIONS.map((action) => (
              <Link
                to={action.link}
                key={action.id}
                className="p-4 flex items-center justify-between hover:bg-gray-50 cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <action.icon className={`h-5 w-5 ${action.color}`} />
                  <span className="text-sm font-medium text-gray-900">{action.title}</span>
                </div>
                <div className="flex items-center gap-3">
                  {action.count > 0 && (
                    <span className="inline-flex items-center rounded-full bg-red-100 px-2.5 py-0.5 text-xs font-medium text-red-800">
                      {action.count}
                    </span>
                  )}
                  <ArrowRight className="h-4 w-4 text-gray-400" />
                </div>
              </Link>
            ))}
            {PENDING_ACTIONS.every((a) => a.count === 0) && (
              <div className="p-4 text-sm text-gray-500 text-center">No pending actions.</div>
            )}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="lg:col-span-2 space-y-4">
          <h2 className="text-sm font-semibold text-gray-900 uppercase tracking-wider">
            Recent Activity
          </h2>
          <div className="rounded-lg bg-white shadow ring-1 ring-gray-200 overflow-hidden">
            {data.recentActivity.length === 0 ? (
              <div className="p-6 text-center text-sm text-gray-500">No recent activity logs.</div>
            ) : (
              <ul role="list" className="divide-y divide-gray-200">
                {data.recentActivity.map((activity) => (
                  <li key={activity.id} className="p-4 hover:bg-gray-50">
                    <div className="flex justify-between gap-x-6">
                      <div className="flex min-w-0 gap-x-4 items-center">
                        <div className="h-8 w-8 flex-none rounded-full bg-gray-100 flex items-center justify-center text-xs font-bold text-gray-500 ring-1 ring-gray-300">
                          {((activity.user as { full_name?: string } | null)?.full_name || "U")
                            .charAt(0)
                            .toUpperCase()}
                        </div>
                        <div className="min-w-0 flex-auto">
                          <p className="text-sm font-semibold leading-6 text-gray-900">
                            {activity.action} <span className="font-normal text-gray-500">→</span>{" "}
                            {activity.entity_type}
                          </p>
                          <p className="mt-1 truncate text-xs leading-5 text-gray-500">
                            {activity.description} by{" "}
                            {(activity.user as { full_name?: string } | null)?.full_name ||
                              "Unknown User"}
                          </p>
                        </div>
                      </div>
                      <div className="hidden sm:flex sm:flex-col sm:items-end">
                        <p className="text-xs leading-6 text-gray-500">
                          {formatDistanceToNow(new Date(activity.created_at), { addSuffix: true })}
                        </p>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            )}
            <div className="bg-gray-50 px-4 py-3 border-t border-gray-200 text-center">
              <Link
                to="/admin/system/activity-logs"
                className="text-sm font-medium text-[#186a42] hover:text-[#125333]"
              >
                View all activity logs
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
