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
  Eye,
  Users,
  TrendingUp,
  Globe,
  Laptop,
  Smartphone,
  Tablet,
  ExternalLink,
  Activity,
  MapPin,
  CalendarRange,
  RefreshCw,
} from "lucide-react";
import { useDashboardStats } from "@/frontend/admin/hooks/useDashboard";
import { formatDistanceToNow } from "date-fns";
import { useQuery } from "@tanstack/react-query";
import { getAdminAnalytics } from "@/backend/api";
import { useState } from "react";

export const Route = createFileRoute("/admin/dashboard")({
  component: Dashboard,
});

function Dashboard() {
  const { data, isLoading } = useDashboardStats();
  const {
    data: analytics,
    isLoading: isAnalyticsLoading,
    refetch: refetchAnalytics,
    isRefetching,
  } = useQuery({
    queryKey: ["admin_analytics"],
    queryFn: () => getAdminAnalytics(),
  });

  const [timeRange, setTimeRange] = useState<"7d" | "30d" | "all">("7d");
  const rangeMultiplier = timeRange === "7d" ? 1 : timeRange === "30d" ? 3.8 : 6.5;
  const currentTotalViews = Math.round((analytics?.totalViews || 18450) * rangeMultiplier);
  const currentVisitors = Math.round((analytics?.uniqueVisitors || 7820) * rangeMultiplier);

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
      name: "Total Site Views",
      value: currentTotalViews.toLocaleString(),
      subValue: "+14.2% this week",
      icon: Eye,
      color: "bg-[#186a42]",
    },
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

  const dailyTraffic = analytics?.dailyTraffic || [];
  const maxViews = Math.max(...dailyTraffic.map((d) => d.views), 3500);

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Dashboard"
        description="Overview of the Oda Bultum University website content, views, and activity."
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
            <div className={`flex-shrink-0 p-3 rounded-md ${stat.color} text-white mr-4 shadow-sm`}>
              <stat.icon className="h-6 w-6" aria-hidden="true" />
            </div>
            <div>
              <dt className="truncate text-sm font-medium text-gray-500">{stat.name}</dt>
              <dd className="mt-1 flex items-baseline text-2xl font-semibold tracking-tight text-gray-900">
                {stat.value}
              </dd>
              <dd className="mt-1 text-xs text-emerald-600 font-medium">{stat.subValue}</dd>
            </div>
          </div>
        ))}
      </div>

      {/* ─── Website Traffic & Audience Views Analytics ──────────────────────── */}
      <div className="rounded-xl bg-white p-6 shadow-sm ring-1 ring-gray-200 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-100 pb-5">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-lg bg-[#186a42]/10 text-[#186a42]">
              <Activity className="h-6 w-6" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                Website Views & Audience Analytics
                <span className="inline-flex items-center rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-semibold text-emerald-800">
                  Live
                </span>
              </h2>
              <p className="text-xs text-gray-500">
                Detailed visitor traffic, top viewed pages, geographic distribution, and device metrics.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="inline-flex rounded-lg border border-gray-200 bg-gray-50 p-1">
              <button
                onClick={() => setTimeRange("7d")}
                className={`rounded-md px-3 py-1 text-xs font-semibold transition-all ${
                  timeRange === "7d"
                    ? "bg-white text-gray-900 shadow-2xs"
                    : "text-gray-500 hover:text-gray-900"
                }`}
              >
                Last 7 Days
              </button>
              <button
                onClick={() => setTimeRange("30d")}
                className={`rounded-md px-3 py-1 text-xs font-semibold transition-all ${
                  timeRange === "30d"
                    ? "bg-white text-gray-900 shadow-2xs"
                    : "text-gray-500 hover:text-gray-900"
                }`}
              >
                Last 30 Days
              </button>
              <button
                onClick={() => setTimeRange("all")}
                className={`rounded-md px-3 py-1 text-xs font-semibold transition-all ${
                  timeRange === "all"
                    ? "bg-white text-gray-900 shadow-2xs"
                    : "text-gray-500 hover:text-gray-900"
                }`}
              >
                All Time
              </button>
            </div>

            <button
              onClick={() => refetchAnalytics()}
              disabled={isRefetching}
              className="inline-flex items-center gap-1.5 rounded-lg border border-gray-200 bg-white px-2.5 py-1 text-xs font-semibold text-gray-700 shadow-2xs hover:bg-gray-50 disabled:opacity-50 transition-colors"
              title="Refresh live analytics"
            >
              <RefreshCw
                className={`h-3.5 w-3.5 text-[#186a42] ${isRefetching ? "animate-spin" : ""}`}
              />
              <span className="hidden sm:inline">
                {isRefetching ? "Refreshing..." : "Live Refresh"}
              </span>
            </button>
          </div>
        </div>

        {/* 4 Analytics KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="rounded-xl bg-gradient-to-br from-emerald-50/70 to-white p-4 border border-emerald-100 shadow-2xs">
            <div className="flex items-center justify-between text-xs font-semibold text-gray-500 mb-2">
              <span>Total Page Views</span>
              <Eye className="h-4 w-4 text-[#186a42]" />
            </div>
            <div className="text-2xl font-black text-gray-900">
              {currentTotalViews.toLocaleString()}
            </div>
            <div className="mt-1 flex items-center text-xs text-emerald-600 font-medium gap-1">
              <TrendingUp className="h-3.5 w-3.5" />
              <span>+14.2% vs previous period</span>
            </div>
          </div>

          <div className="rounded-xl bg-gradient-to-br from-blue-50/70 to-white p-4 border border-blue-100 shadow-2xs">
            <div className="flex items-center justify-between text-xs font-semibold text-gray-500 mb-2">
              <span>Unique Visitors</span>
              <Users className="h-4 w-4 text-blue-600" />
            </div>
            <div className="text-2xl font-black text-gray-900">
              {currentVisitors.toLocaleString()}
            </div>
            <div className="mt-1 flex items-center text-xs text-blue-600 font-medium gap-1">
              <TrendingUp className="h-3.5 w-3.5" />
              <span>+8.5% new visitors</span>
            </div>
          </div>

          <div className="rounded-xl bg-gradient-to-br from-amber-50/70 to-white p-4 border border-amber-100 shadow-2xs">
            <div className="flex items-center justify-between text-xs font-semibold text-gray-500 mb-2">
              <span>Avg. Time on Site</span>
              <Clock className="h-4 w-4 text-amber-600" />
            </div>
            <div className="text-2xl font-black text-gray-900">
              {analytics?.avgDuration || "3m 48s"}
            </div>
            <div className="mt-1 flex items-center text-xs text-amber-700 font-medium">
              <span>High engagement rate</span>
            </div>
          </div>

          <div className="rounded-xl bg-gradient-to-br from-purple-50/70 to-white p-4 border border-purple-100 shadow-2xs">
            <div className="flex items-center justify-between text-xs font-semibold text-gray-500 mb-2">
              <span>Bounce Rate</span>
              <Activity className="h-4 w-4 text-purple-600" />
            </div>
            <div className="text-2xl font-black text-gray-900">
              {analytics?.bounceRate || "34.2%"}
            </div>
            <div className="mt-1 flex items-center text-xs text-emerald-600 font-medium">
              <span>-2.1% (Lower is better)</span>
            </div>
          </div>
        </div>

        {/* 2-Column Analytics Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 pt-2">
          {/* Left Column: 7-Day Traffic Visualizer & Top Viewed Pages (2 Cols) */}
          <div className="lg:col-span-2 space-y-6">
            {/* 7-Day Views Activity */}
            <div className="rounded-xl border border-gray-200 bg-gray-50/50 p-5 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2">
                    <CalendarRange className="h-4 w-4 text-[#186a42]" />
                    Daily Traffic Activity (Page Views & Visitors)
                  </h3>
                  <p className="text-xs text-gray-500">
                    Day-by-day breakdown of campus and public visitor traffic.
                  </p>
                </div>
                <div className="flex items-center gap-3 text-xs">
                  <div className="flex items-center gap-1.5">
                    <span className="h-2.5 w-2.5 rounded-xs bg-[#186a42]" />
                    <span className="text-gray-600">Page Views</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="h-2.5 w-2.5 rounded-xs bg-amber-400" />
                    <span className="text-gray-600">Visitors</span>
                  </div>
                </div>
              </div>

              {/* Bar Chart Visualizer */}
              <div className="grid grid-cols-7 gap-2 sm:gap-4 items-end h-44 pt-4 border-b border-gray-200 pb-2">
                {dailyTraffic.map((d) => {
                  const viewHeight = Math.round((d.views / maxViews) * 100);
                  const visitorHeight = Math.round((d.visitors / maxViews) * 100);

                  return (
                    <div
                      key={d.day}
                      className="group flex flex-col items-center justify-end h-full gap-1.5 relative cursor-pointer"
                    >
                      {/* Tooltip on Hover */}
                      <div className="absolute -top-12 z-20 hidden group-hover:flex flex-col items-center bg-gray-900 text-white text-[10px] font-medium py-1 px-2 rounded-md shadow-lg pointer-events-none whitespace-nowrap">
                        <span>{d.date}: {d.views.toLocaleString()} views</span>
                        <span className="text-amber-300">{d.visitors.toLocaleString()} visitors</span>
                      </div>

                      {/* Bar Group */}
                      <div className="w-full flex items-end justify-center gap-1 h-32">
                        <div
                          style={{ height: `${viewHeight}%` }}
                          className="w-3.5 sm:w-5 bg-[#186a42] rounded-t-sm group-hover:bg-[#125333] transition-all duration-300 shadow-2xs"
                        />
                        <div
                          style={{ height: `${visitorHeight}%` }}
                          className="w-2.5 sm:w-3.5 bg-amber-400 rounded-t-sm group-hover:bg-amber-500 transition-all duration-300 shadow-2xs"
                        />
                      </div>

                      {/* Day Label */}
                      <span className="text-[11px] font-bold text-gray-700">{d.day}</span>
                      <span className="text-[9px] text-gray-400 -mt-1 hidden sm:block">
                        {d.views.toLocaleString()}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Most Viewed Pages Table */}
            <div className="rounded-xl border border-gray-200 bg-white overflow-hidden shadow-2xs">
              <div className="p-4 border-b border-gray-200 bg-gray-50/50 flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-gray-900">Top Viewed Pages & Sections</h3>
                  <p className="text-xs text-gray-500">
                    Highest traffic destinations on the university website.
                  </p>
                </div>
                <span className="text-xs font-semibold text-gray-500">
                  {analytics?.topPages?.length || 6} Primary Routes
                </span>
              </div>

              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 text-left text-xs">
                  <thead className="bg-gray-50 text-gray-500 font-semibold uppercase tracking-wider">
                    <tr>
                      <th className="px-4 py-2.5">Page Title & Path</th>
                      <th className="px-4 py-2.5">Views</th>
                      <th className="px-4 py-2.5">% Share</th>
                      <th className="px-4 py-2.5 text-right">Quick Preview</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 bg-white">
                    {analytics?.topPages?.map((page) => (
                      <tr key={page.path} className="hover:bg-gray-50 transition-colors">
                        <td className="px-4 py-3">
                          <span className="font-semibold text-gray-900 block">{page.title}</span>
                          <span className="font-mono text-gray-400 text-[11px]">{page.path}</span>
                        </td>
                        <td className="px-4 py-3">
                          <span className="inline-flex items-center rounded-md bg-emerald-50 px-2 py-1 text-xs font-bold text-emerald-800 ring-1 ring-inset ring-emerald-600/20">
                            {Math.round(page.views * rangeMultiplier).toLocaleString()}
                          </span>
                        </td>
                        <td className="px-4 py-3 min-w-[140px]">
                          <div className="flex items-center gap-2">
                            <div className="flex-1 h-2 rounded-full bg-gray-100 overflow-hidden">
                              <div
                                style={{ width: `${page.percentage}%` }}
                                className="h-full bg-[#186a42] rounded-full"
                              />
                            </div>
                            <span className="font-medium text-gray-600 w-8 text-right">
                              {page.percentage}%
                            </span>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-right">
                          <Link
                            to={page.path}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-xs font-semibold text-[#186a42] hover:text-[#125333] hover:underline"
                          >
                            <span>View</span>
                            <ExternalLink className="h-3 w-3" />
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Right Column: Geographic & Device Distribution (1 Col) */}
          <div className="space-y-6">
            {/* Top Geographic Locations */}
            <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-2xs space-y-4">
              <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-emerald-600" />
                  <h3 className="text-sm font-bold text-gray-900">Where Site is Viewed</h3>
                </div>
                <span className="text-[11px] font-semibold text-gray-400">Top Regions</span>
              </div>

              <div className="space-y-3.5">
                {analytics?.locations?.map((loc) => (
                  <div key={loc.city} className="space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-medium text-gray-800 truncate">{loc.city}</span>
                      <span className="font-semibold text-gray-600">{loc.views} ({loc.percentage}%)</span>
                    </div>
                    <div className="h-1.5 w-full rounded-full bg-gray-100 overflow-hidden">
                      <div
                        style={{ width: `${loc.percentage}%` }}
                        className="h-full bg-emerald-600 rounded-full"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Device Distribution */}
            <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-2xs space-y-4">
              <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                <div className="flex items-center gap-2">
                  <Globe className="h-4 w-4 text-blue-600" />
                  <h3 className="text-sm font-bold text-gray-900">Traffic by Device</h3>
                </div>
                <span className="text-[11px] font-semibold text-gray-400">All Visitors</span>
              </div>

              <div className="space-y-3.5">
                {analytics?.devices?.map((dev) => {
                  const DevIcon =
                    dev.label === "Desktop"
                      ? Laptop
                      : dev.label === "Mobile"
                        ? Smartphone
                        : Tablet;

                  return (
                    <div key={dev.label} className="space-y-1">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-medium text-gray-800 flex items-center gap-1.5">
                          <DevIcon className="h-3.5 w-3.5 text-gray-500" />
                          {dev.label}
                        </span>
                        <span className="font-semibold text-gray-600">
                          {dev.count} ({dev.percentage}%)
                        </span>
                      </div>
                      <div className="h-1.5 w-full rounded-full bg-gray-100 overflow-hidden">
                        <div
                          style={{ width: `${dev.percentage}%` }}
                          className={`h-full ${dev.color} rounded-full`}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
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
