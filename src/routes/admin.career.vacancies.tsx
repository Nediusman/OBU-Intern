import { createFileRoute } from "@tanstack/react-router";
import { AdminPageHeader } from "@/frontend/admin/components/AdminPageHeader";
import { Plus, Edit, Trash2, X, Save } from "lucide-react";
import { AdminBadge } from "@/frontend/admin/components/AdminBadge";
import { useState } from "react";
import { useVacancies } from "@/frontend/admin/hooks/useVacancies";
import type { Database } from "@/frontend/lib/database.types";
import { toast } from "sonner";

type VacancyRow = Database["public"]["Tables"]["vacancies"]["Row"];
type VacancyInsert = Database["public"]["Tables"]["vacancies"]["Insert"];

export const Route = createFileRoute("/admin/career/vacancies")({
  component: VacanciesManagement,
});

function VacanciesManagement() {
  const [view, setView] = useState<"list" | "editor">("list");
  const [editingItem, setEditingItem] = useState<Partial<VacancyRow>>({});
  const { query, createMutation, updateMutation, deleteMutation } = useVacancies();

  const handleEdit = (item: VacancyRow) => {
    setEditingItem(item);
    setView("editor");
  };

  const handleCreate = () => {
    setEditingItem({});
    setView("editor");
  };

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this vacancy?")) {
      deleteMutation.mutate(id);
    }
  };

  const handleSave = (status: string) => {
    if (!editingItem.job_title) {
      toast.error("Job Title is required");
      return;
    }

    const payload: VacancyInsert = {
      job_title: editingItem.job_title,
      vacancy_code: editingItem.vacancy_code,
      department: editingItem.department,
      position_type: editingItem.position_type,
      description: editingItem.description,
      requirements: editingItem.requirements,
      responsibilities: editingItem.responsibilities,
      application_instructions: editingItem.application_instructions,
      salary_information: editingItem.salary_information,
      application_deadline: editingItem.application_deadline,
      status: status,
      published_at: status === "open" ? new Date().toISOString() : editingItem.published_at,
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
          title={editingItem.id ? "Edit Vacancy" : "Create Vacancy"}
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
                onClick={() => handleSave("open")}
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
              <label className="block text-sm font-medium text-gray-700 mb-1">Job Title *</label>
              <input
                type="text"
                value={editingItem.job_title || ""}
                onChange={(e) => setEditingItem({ ...editingItem, job_title: e.target.value })}
                className="w-full rounded-md border border-gray-300 px-3 py-2 outline-none focus:border-[#186a42] focus:ring-1 focus:ring-[#186a42]"
                placeholder="e.g. Assistant Professor in Software Engineering"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Vacancy Code</label>
              <input
                type="text"
                value={editingItem.vacancy_code || ""}
                onChange={(e) => setEditingItem({ ...editingItem, vacancy_code: e.target.value })}
                className="w-full rounded-md border border-gray-300 px-3 py-2 outline-none focus:border-[#186a42] focus:ring-1 focus:ring-[#186a42]"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Department</label>
              <input
                type="text"
                value={editingItem.department || ""}
                onChange={(e) => setEditingItem({ ...editingItem, department: e.target.value })}
                className="w-full rounded-md border border-gray-300 px-3 py-2 outline-none focus:border-[#186a42] focus:ring-1 focus:ring-[#186a42]"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Position Type</label>
              <input
                type="text"
                value={editingItem.position_type || ""}
                onChange={(e) => setEditingItem({ ...editingItem, position_type: e.target.value })}
                className="w-full rounded-md border border-gray-300 px-3 py-2 outline-none focus:border-[#186a42] focus:ring-1 focus:ring-[#186a42]"
                placeholder="e.g. Full-time, Contract"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Application Deadline
              </label>
              <input
                type="date"
                value={editingItem.application_deadline || ""}
                onChange={(e) =>
                  setEditingItem({ ...editingItem, application_deadline: e.target.value })
                }
                className="w-full rounded-md border border-gray-300 px-3 py-2 outline-none focus:border-[#186a42] focus:ring-1 focus:ring-[#186a42]"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Salary Information
              </label>
              <input
                type="text"
                value={editingItem.salary_information || ""}
                onChange={(e) =>
                  setEditingItem({ ...editingItem, salary_information: e.target.value })
                }
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

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Requirements</label>
            <textarea
              rows={4}
              value={editingItem.requirements || ""}
              onChange={(e) => setEditingItem({ ...editingItem, requirements: e.target.value })}
              className="w-full rounded-md border border-gray-300 px-3 py-2 outline-none focus:border-[#186a42] focus:ring-1 focus:ring-[#186a42]"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Responsibilities</label>
            <textarea
              rows={4}
              value={editingItem.responsibilities || ""}
              onChange={(e) => setEditingItem({ ...editingItem, responsibilities: e.target.value })}
              className="w-full rounded-md border border-gray-300 px-3 py-2 outline-none focus:border-[#186a42] focus:ring-1 focus:ring-[#186a42]"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Application Instructions
            </label>
            <textarea
              rows={3}
              value={editingItem.application_instructions || ""}
              onChange={(e) =>
                setEditingItem({ ...editingItem, application_instructions: e.target.value })
              }
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
        title="Career & Vacancies"
        description="Manage job postings and career opportunities at the university."
        action={
          <button
            onClick={handleCreate}
            className="flex items-center gap-2 rounded-md bg-[#186a42] px-4 py-2 text-sm font-semibold text-white hover:bg-[#125333]"
          >
            <Plus className="h-4 w-4" />
            Add Vacancy
          </button>
        }
      />

      {query.isLoading ? (
        <div className="flex h-32 items-center justify-center rounded-lg border border-dashed border-gray-300 bg-white">
          <div className="text-sm text-gray-500">Loading vacancies...</div>
        </div>
      ) : query.isError ? (
        <div className="flex h-32 items-center justify-center rounded-lg border border-red-300 bg-red-50">
          <div className="text-sm text-red-600">Failed to load vacancies.</div>
        </div>
      ) : query.data?.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-gray-300 bg-white py-12">
          <p className="text-sm text-gray-500">No vacancies found.</p>
          <button
            onClick={handleCreate}
            className="mt-4 text-sm font-medium text-[#186a42] hover:underline"
          >
            Create your first vacancy
          </button>
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
                  Job Title
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase"
                >
                  Department
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase"
                >
                  Type
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase"
                >
                  Deadline
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
                    {item.job_title}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {item.department || "-"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {item.position_type || "-"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {item.application_deadline || "-"}
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
