import { createFileRoute } from "@tanstack/react-router";
import { AdminPageHeader } from "@/frontend/admin/components/AdminPageHeader";
import { Plus, Edit, Trash2, Check, X, Save } from "lucide-react";
import { useState } from "react";
import { useRoles } from "@/frontend/admin/hooks/useRoles";

export const Route = createFileRoute("/admin/system/roles")({
  component: RolesPermissionsManagement,
});

function RolesPermissionsManagement() {
  const [view, setView] = useState<"list" | "editor">("list");
  const { query, createMutation } = useRoles();

  const [formData, setFormData] = useState({
    name: "",
    description: "",
  });

  const handleCreate = () => {
    setFormData({ name: "", description: "" });
    setView("editor");
  };

  const handleSave = () => {
    createMutation.mutate(formData, {
      onSuccess: () => setView("list"),
    });
  };

  if (view === "editor") {
    return (
      <div className="space-y-6 max-w-2xl mx-auto">
        <AdminPageHeader
          title="Create Custom Role"
          action={
            <div className="flex gap-2">
              <button
                onClick={() => setView("list")}
                className="flex items-center gap-2 rounded-md bg-white px-4 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
              >
                <X className="h-4 w-4" />
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={createMutation.isPending}
                className="flex items-center gap-2 rounded-md bg-[#186a42] px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-[#125333] disabled:opacity-50"
              >
                <Save className="h-4 w-4" />
                Save Role
              </button>
            </div>
          }
        />

        <div className="rounded-lg bg-white p-6 shadow-sm ring-1 ring-gray-200 space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">Role Name</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#186a42] focus:ring-[#186a42] sm:text-sm p-2 border"
              placeholder="e.g., Guest Editor"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={3}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#186a42] focus:ring-[#186a42] sm:text-sm p-2 border"
              placeholder="Brief description of what this role entails..."
            />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Roles & Permissions Matrix"
        description="Define roles and their granular access permissions across the system."
        action={
          <button
            onClick={handleCreate}
            className="flex items-center gap-2 rounded-md bg-[#186a42] px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-[#125333]"
          >
            <Plus className="h-4 w-4" />
            Create Custom Role
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
                Role
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                View
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Create
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Edit
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Delete
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Publish
              </th>
              <th scope="col" className="relative px-6 py-3">
                <span className="sr-only">Actions</span>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 bg-white">
            {query.isLoading && (
              <tr>
                <td colSpan={7} className="p-8 text-center text-gray-500">
                  Loading roles...
                </td>
              </tr>
            )}
            {!query.isLoading && (!query.data || query.data.length === 0) && (
              <tr>
                <td colSpan={7} className="p-8 text-center text-gray-500">
                  No roles found.
                </td>
              </tr>
            )}
            {query.data?.map((role) => {
              const isSuperAdmin = role.name.toLowerCase() === "super admin";
              return (
                <tr key={role.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="text-sm font-semibold text-gray-900">{role.name}</div>
                    <div className="text-xs text-gray-500 mt-1 max-w-xs">{role.description}</div>
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-center">
                    {isSuperAdmin ? (
                      <Check className="mx-auto h-5 w-5 text-green-500" />
                    ) : (
                      <X className="mx-auto h-5 w-5 text-gray-300" />
                    )}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-center">
                    {isSuperAdmin ? (
                      <Check className="mx-auto h-5 w-5 text-green-500" />
                    ) : (
                      <X className="mx-auto h-5 w-5 text-gray-300" />
                    )}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-center">
                    {isSuperAdmin ? (
                      <Check className="mx-auto h-5 w-5 text-green-500" />
                    ) : (
                      <X className="mx-auto h-5 w-5 text-gray-300" />
                    )}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-center">
                    {isSuperAdmin ? (
                      <Check className="mx-auto h-5 w-5 text-green-500" />
                    ) : (
                      <X className="mx-auto h-5 w-5 text-gray-300" />
                    )}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-center">
                    {isSuperAdmin ? (
                      <Check className="mx-auto h-5 w-5 text-green-500" />
                    ) : (
                      <X className="mx-auto h-5 w-5 text-gray-300" />
                    )}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-right text-sm font-medium">
                    <div className="flex justify-end gap-3">
                      <button
                        className="text-gray-400 hover:text-blue-600 transition-colors"
                        title="Edit Role Permissions"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      {!isSuperAdmin && (
                        <button
                          className="text-gray-400 hover:text-red-600 transition-colors"
                          title="Delete Role"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
