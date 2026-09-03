import { createFileRoute } from "@tanstack/react-router";
import { AdminPageHeader } from "@/frontend/admin/components/AdminPageHeader";
import { AdminBadge } from "@/frontend/admin/components/AdminBadge";
import { AdminImageUpload } from "@/frontend/admin/components/AdminImageUpload";
import { Plus, Edit, Trash2, Search, X, Save, CalendarDays, Loader2 } from "lucide-react";
import { useState } from "react";
import { useEvents, type EventWithMedia } from "@/frontend/admin/hooks/useEvents";
import type { Database } from "@/frontend/lib/database.types";
import { toast } from "sonner";

type EventInsert = Database["public"]["Tables"]["events"]["Insert"];

export const Route = createFileRoute("/admin/content/events")({
  component: EventsManagement,
});

function EventsManagement() {
  const [view, setView] = useState<"list" | "editor">("list");
  const [editingItem, setEditingItem] = useState<Partial<EventWithMedia>>({});
  const { query, createMutation, updateMutation, deleteMutation } = useEvents();
  const pending = createMutation.isPending || updateMutation.isPending;

  const handleEdit = (item: EventWithMedia) => {
    setEditingItem(item);
    setView("editor");
  };

  const handleCreate = () => {
    setEditingItem({ event_image_id: null, status: "draft" });
    setView("editor");
  };

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this event?")) {
      deleteMutation.mutate(id);
    }
  };

  const handleSave = (status: string) => {
    if (pending) return;
    if (!editingItem.title || !editingItem.start_date) {
      toast.error("Title and Start Date are required");
      return;
    }

    const payload: EventInsert = {
      title: editingItem.title,
      slug: editingItem.slug,
      description: editingItem.description,
      start_date: editingItem.start_date,
      end_date: editingItem.end_date,
      start_time: editingItem.start_time,
      end_time: editingItem.end_time,
      location: editingItem.location,
      organizer: editingItem.organizer,
      contact_information: editingItem.contact_information,
      registration_link: editingItem.registration_link,
      event_image_id: editingItem.event_image_id || null,
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
      <div className="space-y-6 max-w-2xl mx-auto">
        <AdminPageHeader
          title={editingItem.id ? "Edit Event" : "Create Event"}
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
                className="flex items-center gap-2 rounded-md bg-gray-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-gray-700 disabled:opacity-50"
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
                onClick={() => handleSave("published")}
                disabled={pending}
                className="flex items-center gap-2 rounded-md bg-[#186a42] px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-[#125333] disabled:opacity-50"
              >
                {pending ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Save className="h-4 w-4" />
                )}
                Publish
              </button>
            </div>
          }
        />

        <div className="rounded-lg bg-white p-6 shadow-sm ring-1 ring-gray-200 space-y-6">
          <AdminImageUpload
            label="Event Banner Image"
            description="Upload an event flyer, poster, or cover photo (Max 10MB)"
            value={editingItem.event_image_id}
            imageUrl={editingItem.media?.file_url}
            onChange={(media) =>
              setEditingItem((prev) => ({
                ...prev,
                event_image_id: media?.id ?? null,
                media: media?.id ? { id: media.id, file_url: media.file_url! } : null,
              }))
            }
            disabled={pending}
          />

          <div>
            <label className="block text-sm font-medium text-gray-700">Event Title *</label>
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
              placeholder="e.g. annual-research-symposium-2026"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#186a42] focus:ring-[#186a42] sm:text-sm p-2 border"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Description</label>
            <textarea
              rows={4}
              value={editingItem.description || ""}
              onChange={(e) => setEditingItem({ ...editingItem, description: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#186a42] focus:ring-[#186a42] sm:text-sm p-2 border"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Start Date *</label>
              <input
                type="date"
                value={editingItem.start_date || ""}
                onChange={(e) => setEditingItem({ ...editingItem, start_date: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#186a42] focus:ring-[#186a42] sm:text-sm p-2 border"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">End Date</label>
              <input
                type="date"
                value={editingItem.end_date || ""}
                onChange={(e) => setEditingItem({ ...editingItem, end_date: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#186a42] focus:ring-[#186a42] sm:text-sm p-2 border"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Start Time</label>
              <input
                type="time"
                value={editingItem.start_time || ""}
                onChange={(e) => setEditingItem({ ...editingItem, start_time: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#186a42] focus:ring-[#186a42] sm:text-sm p-2 border"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">End Time</label>
              <input
                type="time"
                value={editingItem.end_time || ""}
                onChange={(e) => setEditingItem({ ...editingItem, end_time: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#186a42] focus:ring-[#186a42] sm:text-sm p-2 border"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Location</label>
            <input
              type="text"
              value={editingItem.location || ""}
              onChange={(e) => setEditingItem({ ...editingItem, location: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#186a42] focus:ring-[#186a42] sm:text-sm p-2 border"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Organizer</label>
            <input
              type="text"
              value={editingItem.organizer || ""}
              onChange={(e) => setEditingItem({ ...editingItem, organizer: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#186a42] focus:ring-[#186a42] sm:text-sm p-2 border"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Status</label>
            <select
              value={editingItem.status || "draft"}
              onChange={(e) => setEditingItem({ ...editingItem, status: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#186a42] focus:ring-[#186a42] sm:text-sm p-2 border"
            >
              <option value="draft">Draft</option>
              <option value="published">Published</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Events"
        description="Manage university events and academic calendar."
        action={
          <button
            type="button"
            onClick={handleCreate}
            className="flex items-center gap-2 rounded-md bg-[#186a42] px-4 py-2 text-sm font-semibold text-white hover:bg-[#125333]"
          >
            <Plus className="h-4 w-4" />
            Create Event
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
            placeholder="Search events..."
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
                Event Title
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Date & Time
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Location
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Organizer
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
                  Loading events...
                </td>
              </tr>
            )}
            {!query.isLoading && (!query.data || query.data.length === 0) && (
              <tr>
                <td colSpan={7} className="p-8 text-center text-gray-500">
                  No events found.
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
                      <CalendarDays className="h-5 w-5" />
                    </div>
                  )}
                </td>
                <td className="whitespace-nowrap px-6 py-4">
                  <div className="text-sm font-medium text-gray-900">{item.title}</div>
                </td>
                <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                  {new Date(item.start_date).toLocaleDateString()}
                  {item.start_time && ` at ${item.start_time.slice(0, 5)}`}
                </td>
                <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                  {item.location}
                </td>
                <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                  {item.organizer}
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
