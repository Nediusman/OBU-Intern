import { createFileRoute } from "@tanstack/react-router";
import { AdminPageHeader } from "@/frontend/admin/components/AdminPageHeader";
import { Plus, Edit, Trash2 } from "lucide-react";

export const Route = createFileRoute("/admin/research/centers")({
  component: ResearchCentersManagement,
});

const MOCK_CENTERS = [
  {
    id: 1,
    name: "Agricultural Research Center",
    director: "Dr. Aster Tsegaye",
    projects: 12,
    status: "Active",
  },
  {
    id: 2,
    name: "Technology Innovation Hub",
    director: "Prof. Bekele",
    projects: 8,
    status: "Active",
  },
];

function ResearchCentersManagement() {
  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Research Centers"
        description="Manage university research centers and institutes."
        action={
          <button className="flex items-center gap-2 rounded-md bg-[#186a42] px-4 py-2 text-sm font-semibold text-white hover:bg-[#125333]">
            <Plus className="h-4 w-4" />
            Add Center
          </button>
        }
      />

      <div className="overflow-hidden rounded-lg bg-white shadow ring-1 ring-gray-200">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Name
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Director
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Active Projects
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Status
              </th>
              <th scope="col" className="relative px-6 py-3">
                <span className="sr-only">Actions</span>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 bg-white">
            {MOCK_CENTERS.map((item) => (
              <tr key={item.id} className="hover:bg-gray-50">
                <td className="whitespace-nowrap px-6 py-4">
                  <div className="text-sm font-medium text-gray-900">{item.name}</div>
                </td>
                <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                  {item.director}
                </td>
                <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                  {item.projects}
                </td>
                <td className="whitespace-nowrap px-6 py-4">
                  <span
                    className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${
                      item.status === "Active"
                        ? "bg-green-100 text-green-800"
                        : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    {item.status}
                  </span>
                </td>
                <td className="whitespace-nowrap px-6 py-4 text-right text-sm font-medium">
                  <div className="flex justify-end gap-2">
                    <button className="text-gray-400 hover:text-[#186a42]">
                      <Edit className="h-4 w-4" />
                    </button>
                    <button className="text-gray-400 hover:text-red-600">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
