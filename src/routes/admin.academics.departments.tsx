import { createFileRoute } from "@tanstack/react-router";
import { AdminPageHeader } from "@/frontend/admin/components/AdminPageHeader";
import { Plus, Edit, Trash2, Search, Filter, X, Save, Building2 } from "lucide-react";
import { AdminBadge } from "@/frontend/admin/components/AdminBadge";
import { useState } from "react";
import {
  useAcademicUnits,
  type AcademicUnitWithMedia,
} from "@/frontend/admin/hooks/useAcademicUnits";
import { AdminImageUpload } from "@/frontend/admin/components/AdminImageUpload";
import type { Database } from "@/frontend/lib/database.types";
import { toast } from "sonner";
import { generateSlug } from "@/frontend/lib/utils";

type AcademicUnitRow = Database["public"]["Tables"]["academic_units"]["Row"];
type AcademicUnitInsert = Database["public"]["Tables"]["academic_units"]["Insert"];

export const Route = createFileRoute("/admin/academics/departments")({
  component: DepartmentsManagement,
});

function DepartmentsManagement() {
  const [view, setView] = useState<"list" | "editor">("list");
  const [editingItem, setEditingItem] = useState<Partial<AcademicUnitWithMedia>>({});

  const { query, createMutation, updateMutation, deleteMutation } = useAcademicUnits("department");
  // We need faculties/colleges/schools for the parent dropdown
  const { query: collegesQuery } = useAcademicUnits(["college", "institute", "school"]);

  const handleEdit = (item: AcademicUnitWithMedia) => {
    setEditingItem(item);
    setView("editor");
  };

  const handleCreate = () => {
    setEditingItem({ main_image_id: null });
    setView("editor");
  };

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this department?")) {
      deleteMutation.mutate(id);
    }
  };

  const handleSave = (status: string) => {
    if (!editingItem.name) {
      toast.error("Department Name is required");
      return;
    }

    const payload: AcademicUnitInsert = {
      name: editingItem.name,
      short_name: editingItem.short_name,
      unit_type: "department",
      parent_id: editingItem.parent_id,
      dean: editingItem.dean,
      email: editingItem.email,
      phone: editingItem.phone,
      description: editingItem.description,
      status: status,
      slug: editingItem.slug,
      main_image_id: editingItem.main_image_id || null,
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
          title={editingItem.id ? "Edit Department" : "Create Department"}
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
                onClick={() => handleSave("inactive")}
                disabled={createMutation.isPending || updateMutation.isPending}
                className="flex items-center gap-2 rounded-md bg-gray-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-gray-700 disabled:opacity-50"
              >
                <Save className="h-4 w-4" />
                Save Draft
              </button>
              <button
                onClick={() => handleSave("active")}
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
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Department Name *
              </label>
              <input
                type="text"
                value={editingItem.name || ""}
                onChange={(e) => {
                  const newTitle = e.target.value;
                  setEditingItem((prev) => {
                    if (!prev) return prev;
                    if (!prev.slug || prev.slug === generateSlug(prev.name || "")) {
                      return { ...prev, name: newTitle, slug: generateSlug(newTitle) };
                    }
                    return { ...prev, name: newTitle };
                  });
                }}
                className="w-full rounded-md border border-gray-300 px-3 py-2 outline-none focus:border-[#186a42] focus:ring-1 focus:ring-[#186a42]"
                placeholder="e.g. Department of Software Engineering"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Slug *</label>
              <input
                type="text"
                value={editingItem.slug || ""}
                onChange={(e) => setEditingItem({ ...editingItem, slug: e.target.value })}
                className="w-full rounded-md border border-gray-300 px-3 py-2 outline-none focus:border-[#186a42] focus:ring-1 focus:ring-[#186a42]"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Short Name</label>
              <input
                type="text"
                value={editingItem.short_name || ""}
                onChange={(e) => setEditingItem({ ...editingItem, short_name: e.target.value })}
                className="w-full rounded-md border border-gray-300 px-3 py-2 outline-none focus:border-[#186a42] focus:ring-1 focus:ring-[#186a42]"
                placeholder="e.g. SE"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Parent College/Faculty
              </label>
              <select
                value={editingItem.parent_id || ""}
                onChange={(e) => setEditingItem({ ...editingItem, parent_id: e.target.value })}
                className="w-full rounded-md border border-gray-300 px-3 py-2 outline-none focus:border-[#186a42] focus:ring-1 focus:ring-[#186a42]"
              >
                <option value="">Select College...</option>
                {collegesQuery.data?.map((college) => (
                  <option key={college.id} value={college.id}>
                    {college.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Department Head
              </label>
              <input
                type="text"
                value={editingItem.dean || ""}
                onChange={(e) => setEditingItem({ ...editingItem, dean: e.target.value })}
                className="w-full rounded-md border border-gray-300 px-3 py-2 outline-none focus:border-[#186a42] focus:ring-1 focus:ring-[#186a42]"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input
                type="email"
                value={editingItem.email || ""}
                onChange={(e) => setEditingItem({ ...editingItem, email: e.target.value })}
                className="w-full rounded-md border border-gray-300 px-3 py-2 outline-none focus:border-[#186a42] focus:ring-1 focus:ring-[#186a42]"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
              <input
                type="text"
                value={editingItem.phone || ""}
                onChange={(e) => setEditingItem({ ...editingItem, phone: e.target.value })}
                className="w-full rounded-md border border-gray-300 px-3 py-2 outline-none focus:border-[#186a42] focus:ring-1 focus:ring-[#186a42]"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea
              rows={4}
              value={editingItem.description || ""}
              onChange={(e) => setEditingItem({ ...editingItem, description: e.target.value })}
              className="w-full rounded-md border border-gray-300 px-3 py-2 outline-none focus:border-[#186a42] focus:ring-1 focus:ring-[#186a42]"
            />
          </div>

          <div className="border-t border-gray-100 pt-6">
            <AdminImageUpload
              label="Department Image"
              value={editingItem.main_image_id}
              imageUrl={editingItem.media?.file_url}
              onChange={(media) => {
                setEditingItem((prev) => ({
                  ...prev,
                  main_image_id: media?.id || null,
                  media: media ? { id: media.id || "", file_url: media.file_url || "" } : null,
                }));
              }}
            />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Departments"
        description="Manage the academic departments within the university colleges."
        action={
          <button
            onClick={handleCreate}
            className="flex items-center gap-2 rounded-md bg-[#186a42] px-4 py-2 text-sm font-semibold text-white hover:bg-[#125333]"
          >
            <Plus className="h-4 w-4" />
            Add Department
          </button>
        }
      />

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative max-w-sm flex-1">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
            <Search className="h-4 w-4 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search departments..."
            className="block w-full rounded-md border-0 py-1.5 pl-10 pr-3 text-gray-900 ring-1 ring-inset ring-gray-300 sm:text-sm sm:leading-6"
          />
        </div>
      </div>

      {query.isLoading ? (
        <div className="flex h-32 items-center justify-center rounded-lg border border-dashed border-gray-300 bg-white">
          <div className="text-sm text-gray-500">Loading departments...</div>
        </div>
      ) : query.isError ? (
        <div className="flex h-32 items-center justify-center rounded-lg border border-red-300 bg-red-50">
          <div className="text-sm text-red-600">Failed to load departments.</div>
        </div>
      ) : query.data?.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-gray-300 bg-white py-12">
          <p className="text-sm text-gray-500">No departments found.</p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-lg bg-white shadow ring-1 ring-gray-200">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Department Name
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Parent College
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Department Head
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
              {query.data?.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      {item.media?.file_url ? (
                        <img
                          src={item.media.file_url}
                          alt={item.name}
                          className="h-10 w-10 rounded-lg object-cover border border-gray-200 shrink-0"
                        />
                      ) : (
                        <div className="h-10 w-10 rounded-lg bg-gray-100 border border-gray-200 flex items-center justify-center text-gray-400 shrink-0">
                          <Building2 className="h-5 w-5 text-gray-400" />
                        </div>
                      )}
                      <div>
                        <div className="text-sm font-bold text-gray-900">{item.name}</div>
                        {item.short_name && (
                          <div className="text-xs text-gray-500">{item.short_name}</div>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                    {(item.academic_units as { name?: string } | null)?.name || "—"}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-900">
                    {item.dean || "-"}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4">
                    <AdminBadge status={item.status} />
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
