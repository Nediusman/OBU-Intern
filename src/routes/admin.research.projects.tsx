import { createFileRoute } from "@tanstack/react-router";
import { AdminPageHeader } from "@/frontend/admin/components/AdminPageHeader";
import { Plus, Edit, Trash2, X, Save, Image as ImageIcon, FileText, Download } from "lucide-react";
import { AdminBadge } from "@/frontend/admin/components/AdminBadge";
import { useState, useRef } from "react";
import { useMedia } from "@/frontend/admin/hooks/useMedia";
import { generateSlug } from "@/frontend/lib/utils";
import { useResearchProjects } from "@/frontend/admin/hooks/useResearchProjects";
import type { Database } from "@/frontend/lib/database.types";
import { toast } from "sonner";

type ResearchProjectRow = Database["public"]["Tables"]["research_projects"]["Row"];
type ResearchProjectInsert = Database["public"]["Tables"]["research_projects"]["Insert"];

export const Route = createFileRoute("/admin/research/projects")({
  component: ResearchProjects,
});

function ResearchProjects() {
  const [view, setView] = useState<"list" | "editor">("list");
  const [editingItem, setEditingItem] = useState<Partial<ResearchProjectRow>>({});
  const { query, createMutation, updateMutation, deleteMutation } = useResearchProjects();
  const { uploadMutation } = useMedia();
  const imageInputRef = useRef<HTMLInputElement>(null);
  const docInputRef = useRef<HTMLInputElement>(null);

  const handleImageSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        toast.error("Image is too large (max 10MB)");
        return;
      }
      uploadMutation.mutate(file, {
        onSuccess: (media) => {
          setEditingItem((prev) => ({
            ...prev,
            main_image_id: media.id,
            media: { file_url: media.file_url },
          }));
        },
      });
    }
  };

  const handleDocSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 20 * 1024 * 1024) {
        toast.error("Document is too large (max 20MB)");
        return;
      }
      uploadMutation.mutate(file, {
        onSuccess: (media) => {
          setEditingItem((prev) => {
            const existingDocs = Array.isArray(prev.documents) ? prev.documents : [];
            return {
              ...prev,
              documents: [...existingDocs, media],
            };
          });
        },
      });
    }
    if (docInputRef.current) {
      docInputRef.current.value = "";
    }
  };

  const removeDocument = (index: number) => {
    setEditingItem((prev) => {
      const existingDocs = Array.isArray(prev.documents) ? [...prev.documents] : [];
      existingDocs.splice(index, 1);
      return { ...prev, documents: existingDocs };
    });
  };

  const handleEdit = (item: ResearchProjectRow) => {
    setEditingItem(item);
    setView("editor");
  };

  const handleCreate = () => {
    setEditingItem({});
    setView("editor");
  };

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this project?")) {
      deleteMutation.mutate(id);
    }
  };

  const handleSave = () => {
    if (!editingItem.project_title) {
      toast.error("Project Title is required");
      return;
    }

    const payload: ResearchProjectInsert = {
      project_title: editingItem.project_title,
      slug: editingItem.slug,
      main_image_id: editingItem.main_image_id,
      documents: editingItem.documents,
      project_code: editingItem.project_code,
      principal_researcher: editingItem.principal_researcher,
      funding_source: editingItem.funding_source,
      status: editingItem.status || "active",
      description: editingItem.description,
      department: editingItem.department,
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
          title={editingItem.id ? "Edit Research Project" : "Create Research Project"}
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
                Save Project
              </button>
            </div>
          }
        />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="rounded-lg bg-white p-6 shadow-sm ring-1 ring-gray-200 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700">Project Title *</label>
                  <input
                    type="text"
                    value={editingItem.project_title || ""}
                    onChange={(e) => {
                      const newTitle = e.target.value;
                      setEditingItem((prev) => {
                        if (!prev) return prev;
                        if (!prev.slug || prev.slug === generateSlug(prev.project_title || "")) {
                          return { ...prev, project_title: newTitle, slug: generateSlug(newTitle) };
                        }
                        return { ...prev, project_title: newTitle };
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
                <div>
                  <label className="block text-sm font-medium text-gray-700">Project Code</label>
                  <input
                    type="text"
                    value={editingItem.project_code || ""}
                    onChange={(e) =>
                      setEditingItem({ ...editingItem, project_code: e.target.value })
                    }
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#186a42] focus:ring-[#186a42] sm:text-sm p-2 border"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Principal Researcher
                  </label>
                  <input
                    type="text"
                    value={editingItem.principal_researcher || ""}
                    onChange={(e) =>
                      setEditingItem({ ...editingItem, principal_researcher: e.target.value })
                    }
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#186a42] focus:ring-[#186a42] sm:text-sm p-2 border"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Funding Source</label>
                  <input
                    type="text"
                    value={editingItem.funding_source || ""}
                    onChange={(e) =>
                      setEditingItem({ ...editingItem, funding_source: e.target.value })
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
                    <option value="completed">Completed</option>
                    <option value="review">Review</option>
                  </select>
                </div>
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700">Description</label>
                  <textarea
                    rows={4}
                    value={editingItem.description || ""}
                    onChange={(e) =>
                      setEditingItem({ ...editingItem, description: e.target.value })
                    }
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#186a42] focus:ring-[#186a42] sm:text-sm p-2 border"
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="space-y-6">
            <div className="rounded-lg bg-white p-6 shadow-sm ring-1 ring-gray-200 space-y-4">
              <h2 className="text-sm font-medium text-gray-900">Project Image</h2>
              <div
                className="aspect-video w-full rounded-md border-2 border-dashed border-gray-300 bg-gray-50 flex flex-col items-center justify-center cursor-pointer hover:bg-gray-100 overflow-hidden relative"
                onClick={() => !uploadMutation.isPending && imageInputRef.current?.click()}
              >
                {(editingItem as typeof editingItem & { media?: { file_url?: string } }).media
                  ?.file_url ? (
                  <img
                    src={
                      (editingItem as typeof editingItem & { media?: { file_url?: string } }).media
                        ?.file_url
                    }
                    alt="Project"
                    className="object-cover w-full h-full"
                  />
                ) : (
                  <>
                    <ImageIcon className="h-8 w-8 text-gray-400 mb-2" />
                    <span className="text-sm text-gray-500">
                      {uploadMutation.isPending ? "Uploading..." : "Upload Image"}
                    </span>
                  </>
                )}
                <input
                  type="file"
                  ref={imageInputRef}
                  className="hidden"
                  accept="image/*"
                  onChange={handleImageSelect}
                />
              </div>
            </div>

            <div className="rounded-lg bg-white p-6 shadow-sm ring-1 ring-gray-200 space-y-4">
              <h2 className="text-sm font-medium text-gray-900">Documents</h2>
              <div className="space-y-3">
                {Array.isArray(editingItem.documents) &&
                  editingItem.documents.map(
                    (
                      doc: { original_name?: string; file_name?: string; [key: string]: unknown },
                      i: number,
                    ) => (
                      <div
                        key={i}
                        className="flex items-center justify-between p-2 rounded-md border border-gray-200 bg-gray-50 text-sm"
                      >
                        <div className="flex items-center gap-2 truncate">
                          <FileText className="h-4 w-4 text-[#186a42] flex-shrink-0" />
                          <span className="truncate">
                            {doc.original_name || doc.file_name || "Document"}
                          </span>
                        </div>
                        <button
                          onClick={() => removeDocument(i)}
                          className="text-gray-400 hover:text-red-600 flex-shrink-0 ml-2"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    ),
                  )}
                <button
                  onClick={() => !uploadMutation.isPending && docInputRef.current?.click()}
                  className="flex items-center gap-2 w-full justify-center rounded-md border-2 border-dashed border-gray-300 px-4 py-4 text-sm font-medium text-gray-600 hover:border-gray-400 hover:bg-gray-50"
                >
                  <Plus className="h-4 w-4" />
                  {uploadMutation.isPending ? "Uploading..." : "Add Document"}
                </button>
                <input
                  type="file"
                  ref={docInputRef}
                  className="hidden"
                  accept=".pdf,.doc,.docx,.xls,.xlsx,.zip"
                  onChange={handleDocSelect}
                />
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
        title="Research Projects"
        description="Manage ongoing and completed university research projects."
        action={
          <button
            onClick={handleCreate}
            className="flex items-center gap-2 rounded-md bg-[#186a42] px-4 py-2 text-sm font-semibold text-white hover:bg-[#125333]"
          >
            <Plus className="h-4 w-4" />
            Add Project
          </button>
        }
      />
      <div className="overflow-hidden rounded-lg bg-white shadow ring-1 ring-gray-200">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase"
              >
                Project Title
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase"
              >
                Lead Researcher
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase"
              >
                Funding
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
            {query.isLoading && (
              <tr>
                <td colSpan={5} className="p-8 text-center text-gray-500">
                  Loading research projects...
                </td>
              </tr>
            )}
            {!query.isLoading && (!query.data || query.data.length === 0) && (
              <tr>
                <td colSpan={5} className="p-8 text-center text-gray-500">
                  No research projects found.
                </td>
              </tr>
            )}
            {query.data?.map((item) => (
              <tr key={item.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900">
                  {item.project_title}
                  {item.project_code && (
                    <span className="ml-2 text-xs font-normal text-gray-500">
                      ({item.project_code})
                    </span>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {item.principal_researcher || "N/A"}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {item.funding_source || "N/A"}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <AdminBadge status={item.status || "active"} />
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
