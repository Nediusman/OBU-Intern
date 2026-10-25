import { createFileRoute } from "@tanstack/react-router";
import { AdminPageHeader } from "@/frontend/admin/components/AdminPageHeader";
import { Plus, Edit, Trash2, Check, X, Save } from "lucide-react";
import { useState } from "react";
import { useRoles } from "@/frontend/admin/hooks/useRoles";

export const Route = createFileRoute("/admin/system/roles")({
  component: RolesPermissionsManagement,
});

const STATUTORY_POLICY_ROLES = [
  {
    id: "role-super-admin",
    name: "Super Administrator",
    description: "Unrestricted institutional access across all modules, servers, and database records.",
    permissions: { view: true, create: true, edit: true, delete: true, publish: true },
    isStatutory: true,
  },
  {
    id: "role-ict-webmaster",
    name: "ICT Directorate / Web Administrator",
    description: "Technical custodian: server maintenance, CMS infrastructure, user accounts, and emergency alerts.",
    permissions: { view: true, create: true, edit: true, delete: true, publish: true },
    isStatutory: true,
  },
  {
    id: "role-pir-editorial",
    name: "Directorate of Public & International Relations",
    description: "Editorial authority: approves news, press releases, public announcements, and brand standards.",
    permissions: { view: true, create: true, edit: true, delete: false, publish: true },
    isStatutory: true,
  },
  {
    id: "role-dept-editor",
    name: "College / Department Content Editor",
    description: "Content contributor: drafts and updates specific faculty, department, curriculum, and program pages.",
    permissions: { view: true, create: true, edit: true, delete: false, publish: false },
    isStatutory: true,
  },
  {
    id: "role-governance-comm",
    name: "Web Governance Committee",
    description: "Oversight body: reviews structural changes, monitors compliance, and resolves content disputes.",
    permissions: { view: true, create: false, edit: false, delete: false, publish: false },
    isStatutory: true,
  },
  {
    id: "role-data-protection",
    name: "Data Protection Focal Person",
    description: "Privacy oversight: monitors handling of personal data submitted via contact forms and student portals.",
    permissions: { view: true, create: false, edit: false, delete: false, publish: false },
    isStatutory: true,
  },
  {
    id: "role-president-exec",
    name: "Office of the President / Executive",
    description: "Final institutional authority: reviews and approves policy declarations and sensitive announcements.",
    permissions: { view: true, create: true, edit: true, delete: false, publish: true },
    isStatutory: true,
  },
];

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

  // Combine statutory roles with custom created roles
  const customRoles = (query.data || []).filter(
    (r) => !STATUTORY_POLICY_ROLES.some((s) => s.name.toLowerCase() === r.name.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Governance Roles & Permissions Matrix"
        description="Statutory roles established under Section 6 of the Official Website Governance Policy, plus custom roles."
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
                Role & Function
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
            {/* Render Statutory Policy Roles */}
            {STATUTORY_POLICY_ROLES.map((role) => (
              <tr key={role.id} className="hover:bg-gray-50">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-gray-900">{role.name}</span>
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
                      Policy Sec 6
                    </span>
                  </div>
                  <div className="text-xs text-gray-500 mt-1 max-w-sm">{role.description}</div>
                </td>
                <td className="whitespace-nowrap px-6 py-4 text-center">
                  {role.permissions.view ? <Check className="mx-auto h-5 w-5 text-green-500" /> : <X className="mx-auto h-5 w-5 text-gray-300" />}
                </td>
                <td className="whitespace-nowrap px-6 py-4 text-center">
                  {role.permissions.create ? <Check className="mx-auto h-5 w-5 text-green-500" /> : <X className="mx-auto h-5 w-5 text-gray-300" />}
                </td>
                <td className="whitespace-nowrap px-6 py-4 text-center">
                  {role.permissions.edit ? <Check className="mx-auto h-5 w-5 text-green-500" /> : <X className="mx-auto h-5 w-5 text-gray-300" />}
                </td>
                <td className="whitespace-nowrap px-6 py-4 text-center">
                  {role.permissions.delete ? <Check className="mx-auto h-5 w-5 text-green-500" /> : <X className="mx-auto h-5 w-5 text-gray-300" />}
                </td>
                <td className="whitespace-nowrap px-6 py-4 text-center">
                  {role.permissions.publish ? <Check className="mx-auto h-5 w-5 text-green-500" /> : <X className="mx-auto h-5 w-5 text-gray-300" />}
                </td>
                <td className="whitespace-nowrap px-6 py-4 text-right text-xs font-semibold text-gray-400">
                  Statutory
                </td>
              </tr>
            ))}

            {/* Custom Roles */}
            {customRoles.map((role) => (
              <tr key={role.id} className="hover:bg-gray-50">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-gray-900">{role.name}</span>
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-gray-100 text-gray-700">
                      Custom
                    </span>
                  </div>
                  <div className="text-xs text-gray-500 mt-1 max-w-sm">{role.description || "User-defined custom role."}</div>
                </td>
                <td className="whitespace-nowrap px-6 py-4 text-center">
                  <Check className="mx-auto h-5 w-5 text-green-500" />
                </td>
                <td className="whitespace-nowrap px-6 py-4 text-center">
                  <Check className="mx-auto h-5 w-5 text-green-500" />
                </td>
                <td className="whitespace-nowrap px-6 py-4 text-center">
                  <Check className="mx-auto h-5 w-5 text-green-500" />
                </td>
                <td className="whitespace-nowrap px-6 py-4 text-center">
                  <X className="mx-auto h-5 w-5 text-gray-300" />
                </td>
                <td className="whitespace-nowrap px-6 py-4 text-center">
                  <X className="mx-auto h-5 w-5 text-gray-300" />
                </td>
                <td className="whitespace-nowrap px-6 py-4 text-right text-sm font-medium">
                  <button className="text-gray-400 hover:text-red-600 transition-colors" title="Delete Role">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
