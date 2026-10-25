import { createFileRoute } from "@tanstack/react-router";
import { AdminPageHeader } from "@/frontend/admin/components/AdminPageHeader";
import { AdminBadge } from "@/frontend/admin/components/AdminBadge";
import { AdminImageUpload } from "@/frontend/admin/components/AdminImageUpload";
import { Plus, Edit, Trash2, Search, X, Save, Bell, Loader2 } from "lucide-react";
import { useState } from "react";
import {
  useAnnouncements,
  type AnnouncementWithMedia,
} from "@/frontend/admin/hooks/useAnnouncements";
import type { Database } from "@/frontend/lib/database.types";
import { toast } from "sonner";

type AnnouncementInsert = Database["public"]["Tables"]["announcements"]["Insert"];

export const Route = createFileRoute("/admin/content/announcements")({
  component: AnnouncementsManagement,
});

function AnnouncementsManagement() {
  const [view, setView] = useState<"list" | "editor">("list");
  const [editingItem, setEditingItem] = useState<Partial<AnnouncementWithMedia>>({});
  const { query, createMutation, updateMutation, deleteMutation } = useAnnouncements();
  const pending = createMutation.isPending || updateMutation.isPending;

  const handleEdit = (item: AnnouncementWithMedia) => {
    setEditingItem(item);
    setView("editor");
  };

  const handleCreate = () => {
    setEditingItem({ main_image_id: null, status: "draft" });
    setView("editor");
  };

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this announcement?")) {
      deleteMutation.mutate(id);
    }
  };

  const handleSave = (status: string) => {
    if (pending) return;
    if (!editingItem.title) {
      toast.error("Title is required");
      return;
    }

    const payload: AnnouncementInsert = {
      title: editingItem.title,
      slug: editingItem.slug,
      description: editingItem.description,
      content: editingItem.content,
      category: editingItem.category || "General",
      status: status,
      main_image_id: editingItem.main_image_id || null,
      featured: editingItem.featured || false,
      published_at: editingItem.published_at,
      expires_at: editingItem.expires_at,
    };

    if (status === "published" && !editingItem.published_at) {
      payload.published_at = new Date().toISOString();
    } else if (status === "draft") {
      payload.published_at = undefined;
    }

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
      <div className="space-y-6 max-w-2xl mx-auto">
        <AdminPageHeader
          title={editingItem.id ? "Edit Announcement" : "Create Announcement"}
          action={
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setView("list")}
                disabled={pending}
                className="flex items-center gap-2 rounded-md bg-white px-4 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 disabled:opacity-50"
              >
                <X className="h-4 w-4" />
                Cancel
              </button>
              <button
                type="button"
                onClick={() => handleSave("draft")}
                disabled={pending}
                className="flex items-center gap-1.5 rounded-md bg-gray-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-gray-700 disabled:opacity-50"
              >
                {pending ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Save className="h-4 w-4" />
                )}
                Save Draft
              </button>
              <button
                type="button"
                onClick={() => handleSave("pending_review")}
                disabled={pending}
                className="flex items-center gap-1.5 rounded-md bg-amber-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-amber-700 disabled:opacity-50"
              >
                Submit for Review
              </button>
              <button
                type="button"
                onClick={() => handleSave("published")}
                disabled={pending}
                className="flex items-center gap-1.5 rounded-md bg-[#186a42] px-3.5 py-2 text-sm font-semibold text-white shadow-sm hover:bg-[#125333] disabled:opacity-50"
              >
                {pending ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Save className="h-4 w-4" />
                )}
                Publish Live
              </button>
            </div>
          }
        />

        <div className="rounded-lg bg-white p-6 shadow-sm ring-1 ring-gray-200 space-y-6">
          <AdminImageUpload
            label="Announcement Image"
            description="Upload a flyer, banner, or representative image for this announcement (Max 10MB)"
            value={editingItem.main_image_id}
            imageUrl={editingItem.media?.file_url}
            onChange={(media) =>
              setEditingItem((prev) => ({
                ...prev,
                main_image_id: media?.id ?? null,
                media: media?.id ? { id: media.id, file_url: media.file_url! } : null,
              }))
            }
            disabled={pending}
          />

          <div>
            <label className="block text-sm font-medium text-gray-700">Announcement Title *</label>
            <input
              type="text"
              value={editingItem.title || ""}
              onChange={(e) =>
                setEditingItem({
                  ...editingItem,
                  title: e.target.value,
                  slug: editingItem.slug
                    ? editingItem.slug
                    : e.target.value
                        .toLowerCase()
                        .replace(/[\s_]+/g, "-")
                        .replace(/[^\w-]/g, ""),
                })
              }
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#186a42] focus:ring-[#186a42] sm:text-sm p-2 border"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">URL Slug</label>
            <input
              type="text"
              value={editingItem.slug || ""}
              onChange={(e) => setEditingItem({ ...editingItem, slug: e.target.value })}
              placeholder="e.g. graduation-ceremony-2026"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#186a42] focus:ring-[#186a42] sm:text-sm p-2 border"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Category</label>
            <select
              value={editingItem.category || ""}
              onChange={(e) => setEditingItem({ ...editingItem, category: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#186a42] focus:ring-[#186a42] sm:text-sm p-2 border"
            >
              <option value="">Select Category...</option>
              <option value="General">General</option>
              <option value="Registrar">Registrar</option>
              <option value="Facilities">Facilities</option>
              <option value="Emergency">Emergency</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Short Description</label>
            <textarea
              rows={2}
              value={editingItem.description || ""}
              onChange={(e) => setEditingItem({ ...editingItem, description: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#186a42] focus:ring-[#186a42] sm:text-sm p-2 border"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Content</label>
            <textarea
              rows={5}
              value={editingItem.content || ""}
              onChange={(e) => setEditingItem({ ...editingItem, content: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#186a42] focus:ring-[#186a42] sm:text-sm p-2 border"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Publish Date</label>
              <input
                type="datetime-local"
                value={editingItem.published_at ? editingItem.published_at.slice(0, 16) : ""}
                onChange={(e) =>
                  setEditingItem({
                    ...editingItem,
                    published_at: e.target.value
                      ? new Date(e.target.value).toISOString()
                      : undefined,
                  })
                }
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#186a42] focus:ring-[#186a42] sm:text-sm p-2 border"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Expiry Date</label>
              <input
                type="datetime-local"
                value={editingItem.expires_at ? editingItem.expires_at.slice(0, 16) : ""}
                onChange={(e) =>
                  setEditingItem({
                    ...editingItem,
                    expires_at: e.target.value ? new Date(e.target.value).toISOString() : undefined,
                  })
                }
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#186a42] focus:ring-[#186a42] sm:text-sm p-2 border"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Status</label>
            <select
              value={editingItem.status || "draft"}
              onChange={(e) => setEditingItem({ ...editingItem, status: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#186a42] focus:ring-[#186a42] sm:text-sm p-2 border"
            >
              <option value="draft">1. Draft (Editor)</option>
              <option value="pending_review">2. Pending Review (Editorial Queue)</option>
              <option value="approved">3. Approved (PR Directorate)</option>
              <option value="published">4. Published (Live)</option>
              <option value="archived">5. Archived</option>
            </select>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Announcements"
        description="Manage university-wide announcements and alerts."
        action={
          <button
            type="button"
            onClick={handleCreate}
            className="flex items-center gap-2 rounded-md bg-[#186a42] px-4 py-2 text-sm font-semibold text-white hover:bg-[#125333]"
          >
            <Plus className="h-4 w-4" />
            Add Announcement
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
            placeholder="Search announcements..."
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
                Image
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Title & Description
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Category
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Publish Date
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Expiry Date
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
                <td colSpan={7} className="p-8 text-center text-gray-500">
                  Loading announcements...
                </td>
              </tr>
            )}
            {!query.isLoading && (!query.data || query.data.length === 0) && (
              <tr>
                <td colSpan={7} className="p-8 text-center text-gray-500">
                  No announcements found.
                </td>
              </tr>
            )}
            {query.data?.map((item) => (
              <tr key={item.id} className="hover:bg-gray-50">
                <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                  {item.media?.file_url ? (
                    <img
                      src={item.media.file_url}
                      alt={item.title}
                      className="h-10 w-10 rounded-lg object-cover border border-gray-200"
                    />
                  ) : (
                    <div className="h-10 w-10 rounded-lg bg-gray-100 flex items-center justify-center text-gray-400 border border-gray-200">
                      <Bell className="h-5 w-5" />
                    </div>
                  )}
                </td>
                <td className="whitespace-nowrap px-6 py-4">
                  <div className="text-sm font-medium text-gray-900">{item.title}</div>
                  <div className="text-xs text-gray-500 max-w-sm truncate">{item.description}</div>
                </td>
                <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                  {item.category}
                </td>
                <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                  {item.published_at ? new Date(item.published_at).toLocaleDateString() : "-"}
                </td>
                <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                  {item.expires_at ? new Date(item.expires_at).toLocaleDateString() : "-"}
                </td>
                <td className="whitespace-nowrap px-6 py-4">
                  <AdminBadge status={item.status || "draft"} />
                </td>
                <td className="whitespace-nowrap px-6 py-4 text-right text-sm font-medium">
                  <div className="flex justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => handleEdit(item)}
                      className="text-gray-400 hover:text-[#186a42]"
                    >
                      <Edit className="h-4 w-4" />
                    </button>
                    <button
                      type="button"
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
