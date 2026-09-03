import { createFileRoute } from "@tanstack/react-router";
import { AdminPageHeader } from "@/frontend/admin/components/AdminPageHeader";
import { AdminBadge } from "@/frontend/admin/components/AdminBadge";
import { Plus, Edit, Trash2, Shield, Key, Search, Ban, X, Save } from "lucide-react";
import { useState } from "react";
import { useUsers } from "@/frontend/admin/hooks/useUsers";

export const Route = createFileRoute("/admin/system/users")({
  component: UsersManagement,
});

function UsersManagement() {
  const [view, setView] = useState<"list" | "editor">("list");
  const { query, rolesQuery, createMutation } = useUsers();

  const [formData, setFormData] = useState({
    email: "",
    full_name: "",
    password: "",
    role_id: "",
    is_active: true,
  });

  const handleCreate = () => {
    setFormData({ email: "", full_name: "", password: "", role_id: "", is_active: true });
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
          title="Create User"
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
                Save User
              </button>
            </div>
          }
        />

        <div className="rounded-lg bg-white p-6 shadow-sm ring-1 ring-gray-200 space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">Full Name</label>
            <input
              type="text"
              value={formData.full_name}
              onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#186a42] focus:ring-[#186a42] sm:text-sm p-2 border"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#186a42] focus:ring-[#186a42] sm:text-sm p-2 border"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Password</label>
            <input
              type="password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#186a42] focus:ring-[#186a42] sm:text-sm p-2 border"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Role</label>
            <select
              value={formData.role_id}
              onChange={(e) => setFormData({ ...formData, role_id: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#186a42] focus:ring-[#186a42] sm:text-sm p-2 border"
            >
              <option value="">Select Role...</option>
              {rolesQuery.data?.map((role) => (
                <option key={role.id} value={role.id}>
                  {role.name}
                </option>
              ))}
            </select>
          </div>
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="isActive"
              checked={formData.is_active}
              onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
              className="h-4 w-4 rounded border-gray-300 text-[#186a42] focus:ring-[#186a42]"
            />
            <label htmlFor="isActive" className="text-sm font-medium text-gray-700">
              Active User
            </label>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Users Management"
        description="Manage administrator accounts, assign roles, and handle password resets."
        action={
          <button
            onClick={handleCreate}
            className="flex items-center gap-2 rounded-md bg-[#186a42] px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-[#125333]"
          >
            <Plus className="h-4 w-4" />
            Create User
          </button>
        }
      />

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="relative max-w-sm flex-1">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
            <Search className="h-4 w-4 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search users by name or email..."
            className="block w-full rounded-md border-0 py-1.5 pl-10 pr-3 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-[#186a42] sm:text-sm sm:leading-6"
          />
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
                User Details
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Assigned Role
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Last Login
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
            {query.isLoading && (
              <tr>
                <td colSpan={5} className="p-8 text-center text-gray-500">
                  Loading users...
                </td>
              </tr>
            )}
            {!query.isLoading && (!query.data || query.data.length === 0) && (
              <tr>
                <td colSpan={5} className="p-8 text-center text-gray-500">
                  No users found.
                </td>
              </tr>
            )}
            {query.data?.map((user) => (
              <tr key={user.id} className="hover:bg-gray-50">
                <td className="whitespace-nowrap px-6 py-4">
                  <div className="flex items-center">
                    <div className="h-10 w-10 flex-shrink-0 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 font-bold uppercase">
                      {user.full_name?.charAt(0) || user.email?.charAt(0)}
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900">{user.full_name}</div>
                      <div className="text-sm text-gray-500">{user.email}</div>
                    </div>
                  </div>
                </td>
                <td className="whitespace-nowrap px-6 py-4">
                  <span className="inline-flex items-center gap-1.5 rounded-md bg-purple-50 px-2 py-1 text-xs font-medium text-purple-700 ring-1 ring-inset ring-purple-700/10">
                    <Shield className="h-3 w-3" />
                    {user.roles?.name || "No Role"}
                  </span>
                </td>
                <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                  {user.last_login_at ? new Date(user.last_login_at).toLocaleString() : "Never"}
                </td>
                <td className="whitespace-nowrap px-6 py-4">
                  <AdminBadge status={user.is_active ? "active" : "inactive"} />
                </td>
                <td className="whitespace-nowrap px-6 py-4 text-right text-sm font-medium">
                  <div className="flex justify-end gap-3">
                    <button
                      className="text-gray-400 hover:text-blue-600 transition-colors"
                      title="Edit User"
                    >
                      <Edit className="h-4 w-4" />
                    </button>
                    <button
                      className="text-gray-400 hover:text-yellow-600 transition-colors"
                      title="Reset Password"
                    >
                      <Key className="h-4 w-4" />
                    </button>
                    {user.is_active ? (
                      <button
                        className="text-gray-400 hover:text-orange-600 transition-colors"
                        title="Disable User"
                      >
                        <Ban className="h-4 w-4" />
                      </button>
                    ) : (
                      <button
                        className="text-gray-400 hover:text-green-600 transition-colors"
                        title="Enable User"
                      >
                        <Ban className="h-4 w-4 transform rotate-90" />
                      </button>
                    )}
                    <button
                      className="text-gray-400 hover:text-red-600 transition-colors"
                      title="Delete User"
                    >
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
