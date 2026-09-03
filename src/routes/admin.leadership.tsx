import { createFileRoute } from "@tanstack/react-router";
import { AdminPageHeader } from "@/frontend/admin/components/AdminPageHeader";
import { Plus, Edit, Trash2, Search, X, Save, Image as ImageIcon } from "lucide-react";
import { AdminBadge } from "@/frontend/admin/components/AdminBadge";
import { useState, useRef } from "react";
import { useLeadership } from "@/frontend/admin/hooks/useLeadership";
import { useMedia } from "@/frontend/admin/hooks/useMedia";
import type { Database } from "@/frontend/lib/database.types";
import { toast } from "sonner";
import { generateSlug } from "@/frontend/lib/utils";

type LeadershipRow = Database["public"]["Tables"]["leadership"]["Row"];
type LeadershipInsert = Database["public"]["Tables"]["leadership"]["Insert"];

export const Route = createFileRoute("/admin/leadership")({
  component: LeadershipManagement,
});

function LeadershipManagement() {
  const [view, setView] = useState<"list" | "editor">("list");
  const [editingItem, setEditingItem] = useState<Partial<LeadershipRow>>({});
  const [search, setSearch] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { query, createMutation, updateMutation, deleteMutation } = useLeadership();
  const { uploadMutation } = useMedia();

  const leaders = (query.data || []).filter((item) => {
    const term = search.trim().toLowerCase();
    return (
      !term ||
      [item.full_name, item.position, item.department_office, item.email, item.phone]
        .filter(Boolean)
        .some((value) => value!.toLowerCase().includes(term))
    );
  });

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        toast.error("File is too large (max 10MB)");
        return;
      }
      uploadMutation.mutate(file, {
        onSuccess: (media) => {
          setEditingItem((prev) => ({
            ...prev,
            profile_image_id: media.id,
            media: { file_url: media.file_url },
          }));
        },
      });
    }
  };

  const handleEdit = (item: LeadershipRow) => {
    setEditingItem(item);
    setView("editor");
  };

  const handleCreate = () => {
    setEditingItem({ display_order: 1 });
    setView("editor");
  };

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this leadership profile?")) {
      deleteMutation.mutate(id);
    }
  };

  const handleSave = () => {
    if (!editingItem.full_name || !editingItem.position) {
      toast.error("Full Name and Position are required");
      return;
    }

    const payload: LeadershipInsert = {
      full_name: editingItem.full_name,
      slug: editingItem.slug,
      position: editingItem.position,
      department_office: editingItem.department_office,
      biography: editingItem.biography,
      email: editingItem.email,
      phone: editingItem.phone,
      display_order: editingItem.display_order || 1,
      status: editingItem.status || "active",
      profile_image_id: editingItem.profile_image_id,
    };

    if (editingItem.id) {
      updateMutation.mutate(
        { id: editingItem.id, updates: payload },
        { onSuccess: () => setView("list") },
      );
    } else {
      createMutation.mutate(payload, { onSuccess: () => setView("list") });
    }
  };

  if (view === "editor") {
    return (
      <div className="space-y-6 max-w-4xl mx-auto">
        <AdminPageHeader
          title={editingItem.id ? "Edit Leadership Profile" : "Create Leadership Profile"}
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
                disabled={createMutation.isPending || updateMutation.isPending}
                className="flex items-center gap-2 rounded-md bg-[#186a42] px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-[#125333] disabled:opacity-50"
              >
                <Save className="h-4 w-4" />
                Save Profile
              </button>
            </div>
          }
        />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="rounded-lg bg-white p-6 shadow-sm ring-1 ring-gray-200 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700">Full Name *</label>
                  <input
                    type="text"
                    value={editingItem.full_name || ""}
                    onChange={(e) => {
                      const newTitle = e.target.value;
                      setEditingItem((prev) => {
                        if (!prev) return prev;
                        if (!prev.slug || prev.slug === generateSlug(prev.full_name || "")) {
                          return { ...prev, full_name: newTitle, slug: generateSlug(newTitle) };
                        }
                        return { ...prev, full_name: newTitle };
                      });
                    }}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#186a42] focus:ring-[#186a42] sm:text-sm p-2 border"
                  />
                </div>
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700">Slug *</label>
                  <input
                    type="text"
                    value={editingItem.slug || ""}
                    onChange={(e) => setEditingItem({ ...editingItem, slug: e.target.value })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#186a42] focus:ring-[#186a42] sm:text-sm p-2 border"
                  />
                </div>
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Position / Title *
                  </label>
                  <input
                    type="text"
                    value={editingItem.position || ""}
                    onChange={(e) => setEditingItem({ ...editingItem, position: e.target.value })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#186a42] focus:ring-[#186a42] sm:text-sm p-2 border"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Email Address</label>
                  <input
                    type="email"
                    value={editingItem.email || ""}
                    onChange={(e) => setEditingItem({ ...editingItem, email: e.target.value })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#186a42] focus:ring-[#186a42] sm:text-sm p-2 border"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Phone Number</label>
                  <input
                    type="tel"
                    value={editingItem.phone || ""}
                    onChange={(e) => setEditingItem({ ...editingItem, phone: e.target.value })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#186a42] focus:ring-[#186a42] sm:text-sm p-2 border"
                  />
                </div>
              </div>
            </div>

            <div className="rounded-lg bg-white p-6 shadow-sm ring-1 ring-gray-200">
              <label className="block text-sm font-medium text-gray-700 mb-2">Biography</label>
              <div className="mt-1 rounded-md border border-gray-300 shadow-sm overflow-hidden">
                <textarea
                  rows={6}
                  value={editingItem.biography || ""}
                  onChange={(e) => setEditingItem({ ...editingItem, biography: e.target.value })}
                  className="block w-full border-0 focus:ring-0 sm:text-sm p-3"
                />
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="rounded-lg bg-white p-6 shadow-sm ring-1 ring-gray-200 space-y-4">
              <h2 className="text-sm font-medium text-gray-900">Profile Photo</h2>
              <div
                className="aspect-[3/4] w-full rounded-md border-2 border-dashed border-gray-300 bg-gray-50 flex flex-col items-center justify-center cursor-pointer hover:bg-gray-100 overflow-hidden relative"
                onClick={() => !uploadMutation.isPending && fileInputRef.current?.click()}
              >
                {(editingItem as typeof editingItem & { media?: { file_url?: string } }).media
                  ?.file_url ? (
                  <img
                    src={
                      (editingItem as typeof editingItem & { media?: { file_url?: string } }).media
                        ?.file_url
                    }
                    alt="Profile"
                    className="object-cover w-full h-full"
                  />
                ) : (
                  <>
                    <ImageIcon className="h-8 w-8 text-gray-400 mb-2" />
                    <span className="text-sm text-gray-500">
                      {uploadMutation.isPending ? "Uploading..." : "Upload Photo"}
                    </span>
                  </>
                )}
                <input
                  type="file"
                  ref={fileInputRef}
                  className="hidden"
                  accept="image/*"
                  onChange={handleFileSelect}
                />
              </div>
            </div>

            <div className="rounded-lg bg-white p-6 shadow-sm ring-1 ring-gray-200 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Display Order</label>
                <input
                  type="number"
                  value={editingItem.display_order || 1}
                  onChange={(e) =>
                    setEditingItem({ ...editingItem, display_order: parseInt(e.target.value) || 1 })
                  }
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#186a42] focus:ring-[#186a42] sm:text-sm p-2 border"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Status</label>
                <select
                  value={editingItem.status || "active"}
                  onChange={(e) => setEditingItem({ ...editingItem, status: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#186a42] focus:ring-[#186a42] sm:text-sm p-2 border"
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="University Leadership"
        description="Manage the profiles of the university's top executive leadership."
        action={
          <button
            onClick={handleCreate}
            className="flex items-center gap-2 rounded-md bg-[#186a42] px-4 py-2 text-sm font-semibold text-white hover:bg-[#125333]"
          >
            <Plus className="h-4 w-4" />
            Add Leader
          </button>
        }
      />

      <div className="flex items-center justify-between">
        <div className="relative max-w-sm flex-1">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
            <Search className="h-4 w-4 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search leadership..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="block w-full rounded-md border-0 py-1.5 pl-10 pr-3 text-gray-900 ring-1 ring-inset ring-gray-300 sm:text-sm sm:leading-6"
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
                Profile
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Contact
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Display Order
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
                  Loading leadership profiles...
                </td>
              </tr>
            )}
            {!query.isLoading && (!query.data || query.data.length === 0) && (
              <tr>
                <td colSpan={5} className="p-8 text-center text-gray-500">
                  No leadership profiles found.
                </td>
              </tr>
            )}
            {!query.isLoading &&
              !query.isError &&
              query.data &&
              query.data.length > 0 &&
              leaders.length === 0 && (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-gray-500">
                    No leadership profiles match your search.
                  </td>
                </tr>
              )}
            {leaders.map((item) => (
              <tr key={item.id} className="hover:bg-gray-50">
                <td className="px-6 py-4">
                  <div className="flex items-center">
                    <div className="h-10 w-10 flex-shrink-0 rounded bg-gray-200 flex items-center justify-center">
                      <ImageIcon className="h-5 w-5 text-gray-400" />
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-bold text-gray-900">{item.full_name}</div>
                      <div className="text-sm text-gray-500">{item.position}</div>
                    </div>
                  </div>
                </td>
                <td className="whitespace-nowrap px-6 py-4">
                  <div className="text-sm text-gray-900">{item.email || "N/A"}</div>
                  <div className="text-xs text-gray-500">{item.phone || "N/A"}</div>
                </td>
                <td className="whitespace-nowrap px-6 py-4 text-center text-sm font-medium text-gray-900">
                  {item.display_order}
                </td>
                <td className="whitespace-nowrap px-6 py-4">
                  <AdminBadge status={item.status || "active"} />
                </td>
                <td className="whitespace-nowrap px-6 py-4 text-right text-sm font-medium">
                  <div className="flex justify-end gap-3">
                    <button
                      onClick={() => handleEdit(item)}
                      className="text-gray-400 hover:text-[#186a42]"
                    >
                      <Edit className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(item.id)}
                      disabled={deleteMutation.isPending}
                      className="text-gray-400 hover:text-red-600 disabled:opacity-50"
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
