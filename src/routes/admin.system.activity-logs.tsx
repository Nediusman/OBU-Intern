import { createFileRoute } from "@tanstack/react-router";
import { AdminPageHeader } from "@/frontend/admin/components/AdminPageHeader";
import { Search, Filter, ChevronLeft, ChevronRight } from "lucide-react";

export const Route = createFileRoute("/admin/system/activity-logs")({
  component: ActivityLogs,
});

const MOCK_LOGS = [
  {
    id: 1,
    user: "Admin User",
    action: "Updated Page",
    module: "Pages",
    description: "Updated content for 'About Us' page",
    date: "2026-08-24 10:30 AM",
  },
  {
    id: 2,
    user: "Content Editor",
    action: "Published News",
    module: "News",
    description: "Published article 'University Ranking 2026'",
    date: "2026-08-24 09:15 AM",
  },
  {
    id: 3,
    user: "Admin User",
    action: "Created User",
    module: "System",
    description: "Created user 'Jane Doe' as Editor",
    date: "2026-08-23 04:45 PM",
  },
  {
    id: 4,
    user: "System",
    action: "Database Backup",
    module: "System",
    description: "Automated daily backup completed",
    date: "2026-08-23 02:00 AM",
  },
];

function ActivityLogs() {
  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Activity Logs"
        description="Monitor system-wide administrator actions and audit trails."
      />

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative max-w-sm flex-1">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
            <Search className="h-4 w-4 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search logs..."
            className="block w-full rounded-md border-0 py-1.5 pl-10 pr-3 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-[#186a42] sm:text-sm sm:leading-6"
          />
        </div>
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-2 rounded-md bg-white px-3 py-1.5 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50">
            <Filter className="h-4 w-4 text-gray-400" />
            Filter by Module
          </button>
        </div>
      </div>

      <div className="overflow-hidden rounded-lg bg-white shadow ring-1 ring-gray-200">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                User
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Action
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Module
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Description
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Date & Time
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 bg-white">
            {MOCK_LOGS.map((log) => (
              <tr key={log.id} className="hover:bg-gray-50">
                <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-900">
                  {log.user}
                </td>
                <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                  <span className="inline-flex rounded bg-gray-100 px-2 py-1 text-xs font-medium text-gray-800">
                    {log.action}
                  </span>
                </td>
                <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">{log.module}</td>
                <td
                  className="px-6 py-4 text-sm text-gray-500 max-w-md truncate"
                  title={log.description}
                >
                  {log.description}
                </td>
                <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">{log.date}</td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Pagination */}
        <div className="flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3 sm:px-6">
          <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-gray-700">
                Showing <span className="font-medium">1</span> to{" "}
                <span className="font-medium">4</span> of <span className="font-medium">4</span>{" "}
                results
              </p>
            </div>
            <div>
              <nav
                className="isolate inline-flex -space-x-px rounded-md shadow-sm"
                aria-label="Pagination"
              >
                <button className="relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0">
                  <span className="sr-only">Previous</span>
                  <ChevronLeft className="h-5 w-5" aria-hidden="true" />
                </button>
                <button className="relative z-10 inline-flex items-center bg-[#186a42] px-4 py-2 text-sm font-semibold text-white focus:z-20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#186a42]">
                  1
                </button>
                <button className="relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0">
                  <span className="sr-only">Next</span>
                  <ChevronRight className="h-5 w-5" aria-hidden="true" />
                </button>
              </nav>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
