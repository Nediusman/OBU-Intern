import { createFileRoute } from "@tanstack/react-router";
import { AdminPageHeader } from "@/frontend/admin/components/AdminPageHeader";
import { Plus, Edit, Trash2, X, Save } from "lucide-react";
import { AdminBadge } from "@/frontend/admin/components/AdminBadge";
import { useState } from "react";
import { useRegistrarAnnouncements } from "@/frontend/admin/hooks/useRegistrarAnnouncements";
import type { Database } from "@/frontend/lib/database.types";
import { toast } from "sonner";

type RegistrarAnnouncementRow = Database["public"]["Tables"]["registrar_announcements"]["Row"];
type RegistrarAnnouncementInsert =
  Database["public"]["Tables"]["registrar_announcements"]["Insert"];

export const Route = createFileRoute("/admin/registrar/announcements")({
  component: RegistrarAnnouncements,
});

function RegistrarAnnouncements() {
  const [view, setView] = useState<"list" | "editor">("list");
  const [editingItem, setEditingItem] = useState<Partial<RegistrarAnnouncementRow>>({});

  const { query, createMutation, updateMutation, deleteMutation } = useRegistrarAnnouncements();

  const handleEdit = (item: RegistrarAnnouncementRow) => {
    setEditingItem(item);
    setView("editor");
  };

  const handleCreate = () => {
    setEditingItem({});
    setView("editor");
  };

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this announcement?")) {
      deleteMutation.mutate(id);
    }
  };

  const handleSave = (status: string) => {
    if (!editingItem.title) {
      toast.error("Title is required");
      return;
    }

    const payload: RegistrarAnnouncementInsert = {
      title: editingItem.title,
      short_description: editingItem.short_description,
      content: editingItem.content,
      published_at: editingItem.published_at || new Date().toISOString(),
      expires_at: editingItem.expires_at,
      status: status,
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
      <div className="space-y-6 max-w-3xl mx-auto">
        <AdminPageHeader
          title={editingItem.id ? "Edit Announcement" : "Create Announcement"}
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
                onClick={() => handleSave("draft")}
                disabled={createMutation.isPending || updateMutation.isPending}
                className="flex items-center gap-2 rounded-md bg-gray-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-gray-700 disabled:opacity-50"
              >
                <Save className="h-4 w-4" />
                Save Draft
              </button>
              <button
                onClick={() => handleSave("published")}
                disabled={createMutation.isPending || updateMutation.isPending}
                className="flex items-center gap-2 rounded-md bg-[#186a42] px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-[#125333] disabled:opacity-50"
              >
                <Save className="h-4 w-4" />
                Publish
              </button>
            </div>
          }
        />

        <div className="bg-white p-6 shadow-sm ring-1 ring-gray-200 rounded-lg space-y-6">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Title *</label>
              <input
                type="text"
                value={editingItem.title || ""}
                onChange={(e) => setEditingItem({ ...editingItem, title: e.target.value })}
                className="w-full rounded-md border border-gray-300 px-3 py-2 outline-none focus:border-[#186a42] focus:ring-1 focus:ring-[#186a42]"
                placeholder="e.g. 2026 Registration Deadline"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Short Description
              </label>
              <input
                type="text"
                value={editingItem.short_description || ""}
                onChange={(e) =>
                  setEditingItem({ ...editingItem, short_description: e.target.value })
                }
                className="w-full rounded-md border border-gray-300 px-3 py-2 outline-none focus:border-[#186a42] focus:ring-1 focus:ring-[#186a42]"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Publish Date</label>
              <input
                type="datetime-local"
                value={
                  editingItem.published_at
                    ? new Date(editingItem.published_at).toISOString().slice(0, 16)
                    : ""
                }
                onChange={(e) =>
                  setEditingItem({
                    ...editingItem,
                    published_at: new Date(e.target.value).toISOString(),
                  })
                }
                className="w-full rounded-md border border-gray-300 px-3 py-2 outline-none focus:border-[#186a42] focus:ring-1 focus:ring-[#186a42]"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Expiry Date</label>
              <input
                type="datetime-local"
                value={
                  editingItem.expires_at
                    ? new Date(editingItem.expires_at).toISOString().slice(0, 16)
                    : ""
                }
                onChange={(e) =>
                  setEditingItem({
                    ...editingItem,
                    expires_at: new Date(e.target.value).toISOString(),
                  })
                }
                className="w-full rounded-md border border-gray-300 px-3 py-2 outline-none focus:border-[#186a42] focus:ring-1 focus:ring-[#186a42]"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Full Content</label>
            <textarea
              rows={6}
              value={editingItem.content || ""}
              onChange={(e) => setEditingItem({ ...editingItem, content: e.target.value })}
              className="w-full rounded-md border border-gray-300 px-3 py-2 outline-none focus:border-[#186a42] focus:ring-1 focus:ring-[#186a42]"
            />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Registrar Announcements"
        description="Manage announcements specifically from the Registrar's office."
        action={
          <button
            onClick={handleCreate}
            className="flex items-center gap-2 rounded-md bg-[#186a42] px-4 py-2 text-sm font-semibold text-white hover:bg-[#125333]"
          >
            <Plus className="h-4 w-4" />
            Add Announcement
          </button>
        }
      />

      {query.isLoading ? (
        <div className="flex h-32 items-center justify-center rounded-lg border border-dashed border-gray-300 bg-white">
          <div className="text-sm text-gray-500">Loading registrar announcements...</div>
        </div>
      ) : query.isError ? (
        <div className="flex h-32 items-center justify-center rounded-lg border border-red-300 bg-red-50">
          <div className="text-sm text-red-600">Failed to load announcements.</div>
        </div>
      ) : query.data?.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-gray-300 bg-white py-12">
          <p className="text-sm text-gray-500">No announcements found.</p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-lg bg-white shadow ring-1 ring-gray-200">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase"
                >
                  Title
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase"
                >
                  Publish Date
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase"
                >
                  Status
                </th>
                <th scope="col" className="relative px-6 py-3">
                  <span className="sr-only">Actions</span>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              {query.data?.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900">
                    {item.title}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {item.published_at ? new Date(item.published_at).toLocaleDateString() : "-"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <AdminBadge status={item.status} />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex justify-end gap-3">
                      <button
                        onClick={() => handleEdit(item)}
                        className="text-gray-400 hover:text-[#186a42]"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(item.id)}
                        className="text-gray-400 hover:text-red-600"
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
      )}
    </div>
  );
}
