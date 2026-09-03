import { createFileRoute } from "@tanstack/react-router";
import { AdminPageHeader } from "@/frontend/admin/components/AdminPageHeader";
import { Plus, Edit, Trash2, Search, Filter, X, Save, GraduationCap } from "lucide-react";
import { AdminBadge } from "@/frontend/admin/components/AdminBadge";
import { useState } from "react";
import { usePrograms, type ProgramWithMedia } from "@/frontend/admin/hooks/usePrograms";
import { useAcademicUnits } from "@/frontend/admin/hooks/useAcademicUnits";
import { AdminImageUpload } from "@/frontend/admin/components/AdminImageUpload";
import type { Database } from "@/frontend/lib/database.types";
import { toast } from "sonner";
import { generateSlug } from "@/frontend/lib/utils";

type ProgramRow = Database["public"]["Tables"]["programs"]["Row"];
type ProgramInsert = Database["public"]["Tables"]["programs"]["Insert"];

export const Route = createFileRoute("/admin/academics/programs")({
  component: ProgramsManagement,
});

function ProgramsManagement() {
  const [view, setView] = useState<"list" | "editor">("list");
  const [editingItem, setEditingItem] = useState<Partial<ProgramWithMedia>>({});
  const { query, createMutation, updateMutation, deleteMutation } = usePrograms();
  const { query: unitsQuery } = useAcademicUnits();

  const handleEdit = (item: ProgramWithMedia) => {
    setEditingItem(item);
    setView("editor");
  };

  const handleCreate = () => {
    setEditingItem({ main_image_id: null });
    setView("editor");
  };

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this program?")) {
      deleteMutation.mutate(id);
    }
  };

  const handleSave = (status: string) => {
    if (!editingItem.name) {
      toast.error("Program Name is required");
      return;
    }

    const payload: ProgramInsert = {
      name: editingItem.name,
      short_name: editingItem.short_name,
      program_code: editingItem.program_code,
      academic_unit_id: editingItem.academic_unit_id,
      degree: editingItem.degree,
      duration: editingItem.duration,
      description: editingItem.description,
      admission_requirements: editingItem.admission_requirements,
      status: status,
      display_order: editingItem.display_order || 0,
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
          title={editingItem.id ? "Edit Program" : "Create Program"}
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
              <label className="block text-sm font-medium text-gray-700 mb-1">Program Name *</label>
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
                placeholder="e.g. BSc in Software Engineering"
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
              <label className="block text-sm font-medium text-gray-700 mb-1">Program Code</label>
              <input
                type="text"
                value={editingItem.program_code || ""}
                onChange={(e) => setEditingItem({ ...editingItem, program_code: e.target.value })}
                className="w-full rounded-md border border-gray-300 px-3 py-2 outline-none focus:border-[#186a42] focus:ring-1 focus:ring-[#186a42]"
                placeholder="e.g. SE101"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Degree Level</label>
              <input
                type="text"
                value={editingItem.degree || ""}
                onChange={(e) => setEditingItem({ ...editingItem, degree: e.target.value })}
                className="w-full rounded-md border border-gray-300 px-3 py-2 outline-none focus:border-[#186a42] focus:ring-1 focus:ring-[#186a42]"
                placeholder="e.g. Undergraduate, Postgraduate"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Duration</label>
              <input
                type="text"
                value={editingItem.duration || ""}
                onChange={(e) => setEditingItem({ ...editingItem, duration: e.target.value })}
                className="w-full rounded-md border border-gray-300 px-3 py-2 outline-none focus:border-[#186a42] focus:ring-1 focus:ring-[#186a42]"
                placeholder="e.g. 4 Years"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Academic Unit / Department
              </label>
              <select
                value={editingItem.academic_unit_id || ""}
                onChange={(e) =>
                  setEditingItem({ ...editingItem, academic_unit_id: e.target.value })
                }
                className="w-full rounded-md border border-gray-300 px-3 py-2 outline-none focus:border-[#186a42] focus:ring-1 focus:ring-[#186a42]"
              >
                <option value="">Select Department...</option>
                {unitsQuery.data?.map((unit) => (
                  <option key={unit.id} value={unit.id}>
                    {unit.name}
                  </option>
                ))}
              </select>
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

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Admission Requirements
            </label>
            <textarea
              rows={4}
              value={editingItem.admission_requirements || ""}
              onChange={(e) =>
                setEditingItem({ ...editingItem, admission_requirements: e.target.value })
              }
              className="w-full rounded-md border border-gray-300 px-3 py-2 outline-none focus:border-[#186a42] focus:ring-1 focus:ring-[#186a42]"
            />
          </div>

          <div className="border-t border-gray-100 pt-6">
            <AdminImageUpload
              label="Program Image"
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
        title="Academic Programs"
        description="Manage undergraduate and postgraduate degree programs."
        action={
          <button
            onClick={handleCreate}
            className="flex items-center gap-2 rounded-md bg-[#186a42] px-4 py-2 text-sm font-semibold text-white hover:bg-[#125333]"
          >
            <Plus className="h-4 w-4" />
            Add Program
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
            placeholder="Search programs..."
            className="block w-full rounded-md border-0 py-1.5 pl-10 pr-3 text-gray-900 ring-1 ring-inset ring-gray-300 sm:text-sm sm:leading-6"
          />
        </div>
        <div className="flex items-center gap-2">
          <select className="rounded-md border-0 py-1.5 pl-3 pr-8 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-[#186a42] sm:text-sm sm:leading-6">
            <option>All Degrees</option>
            <option>Undergraduate</option>
            <option>Postgraduate</option>
            <option>Doctoral</option>
          </select>
          <button className="flex items-center gap-2 rounded-md bg-white px-3 py-1.5 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50">
            <Filter className="h-4 w-4 text-gray-400" />
            Filters
          </button>
        </div>
      </div>

      {query.isLoading ? (
        <div className="flex h-32 items-center justify-center rounded-lg border border-dashed border-gray-300 bg-white">
          <div className="text-sm text-gray-500">Loading programs...</div>
        </div>
      ) : query.isError ? (
        <div className="flex h-32 items-center justify-center rounded-lg border border-red-300 bg-red-50">
          <div className="text-sm text-red-600">Failed to load programs.</div>
        </div>
      ) : query.data?.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-gray-300 bg-white py-12">
          <p className="text-sm text-gray-500">No programs found.</p>
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
                  Program Name & Code
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Degree Level
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Department
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Duration
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
                          <GraduationCap className="h-5 w-5 text-gray-400" />
                        </div>
                      )}
                      <div>
                        <div className="text-sm font-bold text-gray-900">{item.name}</div>
                        <div className="text-xs text-gray-500">{item.program_code}</div>
                      </div>
                    </div>
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-900">
                    {item.degree}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                    {(item.academic_units as { name?: string } | null)?.name || "—"}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                    {item.duration}
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
