import { createFileRoute } from "@tanstack/react-router";
import { AdminPageHeader } from "@/frontend/admin/components/AdminPageHeader";
import { Plus, Edit, Trash2, X, Save, Building2, Loader2 } from "lucide-react";
import { AdminBadge } from "@/frontend/admin/components/AdminBadge";
import { AdminImageUpload } from "@/frontend/admin/components/AdminImageUpload";
import { useState } from "react";
import { useServices, type ServiceWithMedia } from "@/frontend/admin/hooks/useServices";
import type { Database } from "@/frontend/lib/database.types";
import { toast } from "sonner";
import { generateSlug } from "@/frontend/lib/utils";

type ServiceInsert = Database["public"]["Tables"]["services"]["Insert"];

export const Route = createFileRoute("/admin/services")({
  component: ServicesManagement,
});

function ServicesManagement() {
  const [view, setView] = useState<"list" | "editor">("list");
  const [editingItem, setEditingItem] = useState<Partial<ServiceWithMedia>>({});

  const { query, createMutation, updateMutation, deleteMutation } = useServices();
  const pending = createMutation.isPending || updateMutation.isPending;

  const handleEdit = (item: ServiceWithMedia) => {
    setEditingItem(item);
    setView("editor");
  };

  const handleCreate = () => {
    setEditingItem({ display_order: 0, status: "active", main_image_id: null });
    setView("editor");
  };

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this service?")) {
      deleteMutation.mutate(id);
    }
  };

  const handleSave = (status: string) => {
    if (pending) return;
    const name = editingItem.service_name?.trim();
    if (!name) {
      toast.error("Service Name is required");
      return;
    }

    const finalSlug = (editingItem.slug?.trim() || generateSlug(name)).trim();
    if (!finalSlug) {
      toast.error("Valid URL slug is required");
      return;
    }

    // Pre-submission client-side duplicate check
    const isDuplicate = (query.data ?? []).some(
      (item) => item.slug?.toLowerCase() === finalSlug.toLowerCase() && item.id !== editingItem.id,
    );
    if (isDuplicate) {
      toast.error("This service slug already exists. Please choose a unique slug.");
      return;
    }

    const payload: ServiceInsert = {
      service_name: name,
      slug: finalSlug,
      short_description: editingItem.short_description?.trim() || undefined,
      full_description: editingItem.full_description?.trim() || undefined,
      main_image_id: editingItem.main_image_id || null,
      icon: editingItem.icon?.trim() || undefined,
      location: editingItem.location?.trim() || undefined,
      opening_hours: editingItem.opening_hours?.trim() || undefined,
      contact: editingItem.contact?.trim() || undefined,
      external_link: editingItem.external_link?.trim() || undefined,
      display_order: editingItem.display_order ?? 0,
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
          title={editingItem.id ? "Edit Service" : "Add Service"}
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
                onClick={() => handleSave("active")}
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

        <div className="bg-white p-6 shadow-sm ring-1 ring-gray-200 rounded-lg space-y-6">
          <div className="space-y-4">
            <AdminImageUpload
              label="Main Service Image"
              description="Upload a cover photo or representative image for this service (Max 10MB)"
              value={editingItem.main_image_id}
              imageUrl={editingItem.media?.file_url}
              onChange={(media) => {
                setEditingItem((prev) => ({
                  ...prev,
                  main_image_id: media?.id ?? null,
                  media: media?.id ? { id: media.id, file_url: media.file_url! } : null,
                }));
              }}
              disabled={pending}
            />
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Service Name *</label>
              <input
                type="text"
                value={editingItem.service_name || ""}
                onChange={(e) => {
                  const newTitle = e.target.value;
                  setEditingItem((prev) => {
                    if (!prev) return prev;
                    if (!prev.slug || prev.slug === generateSlug(prev.service_name || "")) {
                      return { ...prev, service_name: newTitle, slug: generateSlug(newTitle) };
                    }
                    return { ...prev, service_name: newTitle };
                  });
                }}
                className="w-full rounded-md border border-gray-300 px-3 py-2 outline-none focus:border-[#186a42] focus:ring-1 focus:ring-[#186a42]"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Slug *</label>
              <input
                type="text"
                value={editingItem.slug || ""}
                onChange={(e) =>
                  setEditingItem({ ...editingItem, slug: generateSlug(e.target.value) })
                }
                className="w-full rounded-md border border-gray-300 px-3 py-2 outline-none focus:border-[#186a42] focus:ring-1 focus:ring-[#186a42]"
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
              <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
              <input
                type="text"
                value={editingItem.location || ""}
                onChange={(e) => setEditingItem({ ...editingItem, location: e.target.value })}
                className="w-full rounded-md border border-gray-300 px-3 py-2 outline-none focus:border-[#186a42] focus:ring-1 focus:ring-[#186a42]"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Opening Hours</label>
              <input
                type="text"
                value={editingItem.opening_hours || ""}
                onChange={(e) => setEditingItem({ ...editingItem, opening_hours: e.target.value })}
                className="w-full rounded-md border border-gray-300 px-3 py-2 outline-none focus:border-[#186a42] focus:ring-1 focus:ring-[#186a42]"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Contact Details
              </label>
              <input
                type="text"
                value={editingItem.contact || ""}
                onChange={(e) => setEditingItem({ ...editingItem, contact: e.target.value })}
                className="w-full rounded-md border border-gray-300 px-3 py-2 outline-none focus:border-[#186a42] focus:ring-1 focus:ring-[#186a42]"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">External Link</label>
              <input
                type="text"
                value={editingItem.external_link || ""}
                onChange={(e) => setEditingItem({ ...editingItem, external_link: e.target.value })}
                className="w-full rounded-md border border-gray-300 px-3 py-2 outline-none focus:border-[#186a42] focus:ring-1 focus:ring-[#186a42]"
                placeholder="https://"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Icon (Lucide name)
              </label>
              <input
                type="text"
                value={editingItem.icon || ""}
                onChange={(e) => setEditingItem({ ...editingItem, icon: e.target.value })}
                className="w-full rounded-md border border-gray-300 px-3 py-2 outline-none focus:border-[#186a42] focus:ring-1 focus:ring-[#186a42]"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Display Order</label>
              <input
                type="number"
                value={editingItem.display_order ?? 0}
                onChange={(e) =>
                  setEditingItem({ ...editingItem, display_order: parseInt(e.target.value) || 0 })
                }
                className="w-full rounded-md border border-gray-300 px-3 py-2 outline-none focus:border-[#186a42] focus:ring-1 focus:ring-[#186a42]"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Full Description</label>
            <textarea
              rows={5}
              value={editingItem.full_description || ""}
              onChange={(e) => setEditingItem({ ...editingItem, full_description: e.target.value })}
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
        title="University Services"
        description="Manage services provided to students and staff."
        action={
          <button
            type="button"
            onClick={handleCreate}
            className="flex items-center gap-2 rounded-md bg-[#186a42] px-4 py-2 text-sm font-semibold text-white hover:bg-[#125333]"
          >
            <Plus className="h-4 w-4" />
            Add Service
          </button>
        }
      />

      {query.isLoading ? (
        <div className="flex h-32 items-center justify-center rounded-lg border border-dashed border-gray-300 bg-white">
          <div className="text-sm text-gray-500">Loading services...</div>
        </div>
      ) : query.isError ? (
        <div className="flex h-32 items-center justify-center rounded-lg border border-red-300 bg-red-50">
          <div className="text-sm text-red-600">Failed to load services.</div>
        </div>
      ) : query.data?.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-gray-300 bg-white py-12">
          <p className="text-sm text-gray-500">No services found.</p>
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
                  Image
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase"
                >
                  Service Title
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase"
                >
                  Location
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
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {item.media?.file_url ? (
                      <img
                        src={item.media.file_url}
                        alt={item.service_name}
                        className="h-10 w-10 rounded-lg object-cover border border-gray-200"
                      />
                    ) : (
                      <div className="h-10 w-10 rounded-lg bg-gray-100 flex items-center justify-center text-gray-400 border border-gray-200">
                        <Building2 className="h-5 w-5" />
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900">
                    {item.service_name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {item.location || "-"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <AdminBadge status={item.status} />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex justify-end gap-3">
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
