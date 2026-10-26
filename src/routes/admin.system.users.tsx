import { createFileRoute } from "@tanstack/react-router";
import { AdminPageHeader } from "@/frontend/admin/components/AdminPageHeader";
import { AdminBadge } from "@/frontend/admin/components/AdminBadge";
import {
  Plus,
  Edit,
  Trash2,
  Shield,
  Key,
  Search,
  Ban,
  X,
  Save,
  CheckCircle,
  Eye,
  EyeOff,
  Dices,
  Lock,
} from "lucide-react";
import { useState } from "react";
import { useUsers } from "@/frontend/admin/hooks/useUsers";
import { toast } from "sonner";
import type { Database } from "@/frontend/lib/database.types";

type UserRow = Database["public"]["Tables"]["users"]["Row"] & {
  roles?: { name: string } | null;
};

export const Route = createFileRoute("/admin/system/users")({
  component: UsersManagement,
});

function UsersManagement() {
  const [view, setView] = useState<"list" | "editor">("list");
  const [editingUserId, setEditingUserId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  // Password reset modal state
  const [resetModalUser, setResetModalUser] = useState<UserRow | null>(null);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const {
    query,
    rolesQuery,
    createMutation,
    updateMutation,
    resetPasswordMutation,
    toggleStatusMutation,
    deleteMutation,
  } = useUsers();

  const [formData, setFormData] = useState({
    email: "",
    full_name: "",
    password: "",
    role_id: "",
    is_active: true,
  });

  const handleCreate = () => {
    setEditingUserId(null);
    setFormData({ email: "", full_name: "", password: "", role_id: "", is_active: true });
    setView("editor");
  };

  const handleEdit = (user: UserRow) => {
    setEditingUserId(user.id);
    setFormData({
      email: user.email || "",
      full_name: user.full_name || "",
      password: "",
      role_id: user.role_id || "",
      is_active: user.is_active ?? true,
    });
    setView("editor");
  };

  const handleSave = () => {
    if (!formData.full_name.trim()) {
      toast.error("Full name is required");
      return;
    }
    if (!formData.email.trim()) {
      toast.error("Email is required");
      return;
    }
    if (!formData.role_id) {
      toast.error("Please select a role");
      return;
    }

    if (editingUserId) {
      updateMutation.mutate(
        {
          id: editingUserId,
          email: formData.email.trim(),
          full_name: formData.full_name.trim(),
          role_id: formData.role_id,
          is_active: formData.is_active,
        },
        {
          onSuccess: () => {
            setView("list");
            setEditingUserId(null);
          },
        },
      );
    } else {
      if (!formData.password || formData.password.length < 6) {
        toast.error("Password must be at least 6 characters long");
        return;
      }
      createMutation.mutate(formData, {
        onSuccess: () => setView("list"),
      });
    }
  };

  const handleOpenResetModal = (user: UserRow) => {
    setResetModalUser(user);
    setNewPassword("");
    setConfirmPassword("");
    setShowPassword(false);
  };

  const handleGeneratePassword = () => {
    const chars = "abcdefghjkmnpqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ23456789!@#$%&*";
    let gen = "";
    for (let i = 0; i < 12; i++) {
      gen += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setNewPassword(gen);
    setConfirmPassword(gen);
    setShowPassword(true);
    toast.info("Generated a secure password");
  };

  const handleConfirmResetPassword = () => {
    if (!resetModalUser) return;
    if (!newPassword || newPassword.length < 6) {
      toast.error("Password must be at least 6 characters long");
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    resetPasswordMutation.mutate(
      {
        userId: resetModalUser.id,
        newPassword,
      },
      {
        onSuccess: () => {
          setResetModalUser(null);
          setNewPassword("");
          setConfirmPassword("");
        },
      },
    );
  };

  const handleToggleStatus = (user: UserRow) => {
    const action = user.is_active ? "disable" : "enable";
    if (
      window.confirm(
        `Are you sure you want to ${action} ${user.full_name || user.email}?`,
      )
    ) {
      toggleStatusMutation.mutate({
        id: user.id,
        is_active: !user.is_active,
      });
    }
  };

  const handleDelete = (user: UserRow) => {
    if (
      window.confirm(
        `Are you sure you want to delete user ${user.full_name || user.email}? This action cannot be undone.`,
      )
    ) {
      deleteMutation.mutate(user.id);
    }
  };

  // Filtered users for real-time search
  const filteredUsers = query.data?.filter((user) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      user.full_name?.toLowerCase().includes(q) ||
      user.email?.toLowerCase().includes(q) ||
      user.roles?.name?.toLowerCase().includes(q)
    );
  });

  const isSaving = createMutation.isPending || updateMutation.isPending;

  if (view === "editor") {
    return (
      <div className="space-y-6 max-w-2xl mx-auto">
        <AdminPageHeader
          title={editingUserId ? "Edit User" : "Create User"}
          description={
            editingUserId
              ? "Update administrator account details and assigned role."
              : "Create a new administrator account and assign system privileges."
          }
          action={
            <div className="flex gap-2">
              <button
                onClick={() => {
                  setView("list");
                  setEditingUserId(null);
                }}
                className="flex items-center gap-2 rounded-md bg-white px-4 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 transition-colors"
              >
                <X className="h-4 w-4" />
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={isSaving}
                className="flex items-center gap-2 rounded-md bg-[#186a42] px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-[#125333] disabled:opacity-50 transition-colors"
              >
                <Save className="h-4 w-4" />
                {isSaving
                  ? "Saving..."
                  : editingUserId
                    ? "Update User"
                    : "Save User"}
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
              placeholder="e.g. Abebe Kebede"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#186a42] focus:ring-[#186a42] sm:text-sm p-2 border"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Email Address</label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder="e.g. user@obu.edu.et"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#186a42] focus:ring-[#186a42] sm:text-sm p-2 border"
            />
          </div>
          {!editingUserId && (
            <div>
              <label className="block text-sm font-medium text-gray-700">Initial Password</label>
              <input
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                placeholder="At least 6 characters"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#186a42] focus:ring-[#186a42] sm:text-sm p-2 border"
              />
              <p className="mt-1 text-xs text-gray-500">
                You can also reset passwords at any time from the users list.
              </p>
            </div>
          )}
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
          <div className="flex items-center gap-2 pt-2">
            <input
              type="checkbox"
              id="isActive"
              checked={formData.is_active}
              onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
              className="h-4 w-4 rounded border-gray-300 text-[#186a42] focus:ring-[#186a42]"
            />
            <label htmlFor="isActive" className="text-sm font-medium text-gray-700">
              Active User (can log in to admin portal)
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
            className="flex items-center gap-2 rounded-md bg-[#186a42] px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-[#125333] transition-colors"
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
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search users by name, email, or role..."
            className="block w-full rounded-md border-0 py-1.5 pl-10 pr-3 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-[#186a42] sm:text-sm sm:leading-6"
          />
        </div>
        {searchQuery && (
          <button
            onClick={() => setSearchQuery("")}
            className="text-xs text-gray-500 hover:text-gray-700 underline"
          >
            Clear filter
          </button>
        )}
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
            {!query.isLoading && (!filteredUsers || filteredUsers.length === 0) && (
              <tr>
                <td colSpan={5} className="p-8 text-center text-gray-500">
                  {searchQuery ? "No users matching your search." : "No users found."}
                </td>
              </tr>
            )}
            {filteredUsers?.map((user) => (
              <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                <td className="whitespace-nowrap px-6 py-4">
                  <div className="flex items-center">
                    <div className="h-10 w-10 flex-shrink-0 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 font-bold uppercase ring-1 ring-gray-300">
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
                  <div className="flex justify-end gap-3 items-center">
                    <button
                      onClick={() => handleEdit(user)}
                      className="text-gray-400 hover:text-blue-600 transition-colors p-1 rounded hover:bg-blue-50"
                      title="Edit User"
                    >
                      <Edit className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleOpenResetModal(user)}
                      className="text-gray-400 hover:text-amber-600 transition-colors p-1 rounded hover:bg-amber-50"
                      title="Reset Password"
                    >
                      <Key className="h-4 w-4" />
                    </button>
                    {user.is_active ? (
                      <button
                        onClick={() => handleToggleStatus(user)}
                        className="text-gray-400 hover:text-orange-600 transition-colors p-1 rounded hover:bg-orange-50"
                        title="Disable User"
                      >
                        <Ban className="h-4 w-4" />
                      </button>
                    ) : (
                      <button
                        onClick={() => handleToggleStatus(user)}
                        className="text-gray-400 hover:text-green-600 transition-colors p-1 rounded hover:bg-green-50"
                        title="Enable User"
                      >
                        <CheckCircle className="h-4 w-4 text-green-600" />
                      </button>
                    )}
                    <button
                      onClick={() => handleDelete(user)}
                      className="text-gray-400 hover:text-red-600 transition-colors p-1 rounded hover:bg-red-50"
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

      {/* Reset Password Modal */}
      {resetModalUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4">
          <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-2xl ring-1 ring-gray-900/10 space-y-5 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-start justify-between border-b pb-4">
              <div className="flex items-center gap-3">
                <div className="rounded-full bg-amber-100 p-2 text-amber-700">
                  <Lock className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-base font-semibold text-gray-900">Reset User Password</h3>
                  <p className="text-xs text-gray-500">
                    {resetModalUser.full_name} ({resetModalUser.email})
                  </p>
                </div>
              </div>
              <button
                onClick={() => setResetModalUser(null)}
                className="text-gray-400 hover:text-gray-600 rounded-md p-1"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-medium text-gray-700">New Password</label>
                  <button
                    type="button"
                    onClick={handleGeneratePassword}
                    className="inline-flex items-center gap-1 text-xs text-[#186a42] hover:underline font-medium"
                  >
                    <Dices className="h-3.5 w-3.5" />
                    Generate random
                  </button>
                </div>
                <div className="relative mt-1">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Enter new password (min. 6 chars)"
                    className="block w-full rounded-md border-gray-300 pr-10 shadow-sm focus:border-[#186a42] focus:ring-[#186a42] sm:text-sm p-2 border"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700">
                  Confirm New Password
                </label>
                <input
                  type={showPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Re-enter new password"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#186a42] focus:ring-[#186a42] sm:text-sm p-2 border"
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-3 border-t">
              <button
                type="button"
                onClick={() => setResetModalUser(null)}
                className="rounded-md bg-white px-3.5 py-2 text-sm font-semibold text-gray-700 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmResetPassword}
                disabled={resetPasswordMutation.isPending}
                className="inline-flex items-center gap-1.5 rounded-md bg-[#186a42] px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-[#125333] disabled:opacity-50 transition-colors"
              >
                <Key className="h-4 w-4" />
                {resetPasswordMutation.isPending ? "Resetting..." : "Reset Password"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
