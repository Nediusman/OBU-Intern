import { createFileRoute } from "@tanstack/react-router";
import { AdminPageHeader } from "@/frontend/admin/components/AdminPageHeader";
import { AdminBadge } from "@/frontend/admin/components/AdminBadge";
import { Plus, Edit, Trash2, ArrowLeft, Save, ImageIcon, FileText, X } from "lucide-react";
import { useState, useRef } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/frontend/lib/supabase";
import type { Database } from "@/frontend/lib/database.types";
import { useMedia } from "@/frontend/admin/hooks/useMedia";
import { generateSlug } from "@/frontend/lib/utils";

type CommunityEngagement = Database["public"]["Tables"]["community_engagements"]["Row"] & {
  media?: { file_url?: string };
};

export const Route = createFileRoute("/admin/research/engagement")({
  component: AdminCommunityEngagement,
});

function AdminCommunityEngagement() {
  const [view, setView] = useState<"list" | "editor">("list");
  const [editingItem, setEditingItem] = useState<Partial<CommunityEngagement> | null>(null);

  const queryClient = useQueryClient();
  const { uploadMutation } = useMedia();
  const imageInputRef = useRef<HTMLInputElement>(null);
  const docInputRef = useRef<HTMLInputElement>(null);

  const query = useQuery({
    queryKey: ["admin_community_engagements"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("community_engagements")
        .select("*, media(file_url)")
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data as CommunityEngagement[];
    },
  });

  const upsertMutation = useMutation({
    mutationFn: async (item: Partial<CommunityEngagement>) => {
      const { media, ...rest } = item;
      const { data, error } = await supabase
        .from("community_engagements")
        .upsert(rest as Record<string, unknown>)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin_community_engagements"] });
      setView("list");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("community_engagements").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin_community_engagements"] });
    },
  });

  const handleCreate = () => {
    setEditingItem({
      title: "",
      slug: "",
      category: "",
      description: "",
      responsible_office: "",
      contact_person: "",
      email: "",
      phone: "",
      location: "",
      status: "active",
      documents: [],
    });
    setView("editor");
  };

  const handleEdit = (item: CommunityEngagement) => {
    setEditingItem({ ...item });
    setView("editor");
  };

  const handleDelete = (id: string) => {
    if (window.confirm("Are you sure you want to delete this community engagement record?")) {
      deleteMutation.mutate(id);
    }
  };

  const handleSave = () => {
    if (editingItem && editingItem.title) {
      const slug = editingItem.slug || generateSlug(editingItem.title);
      upsertMutation.mutate({ ...editingItem, slug });
    } else {
      alert("Title is required.");
    }
  };

  const handleImageSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && editingItem) {
      try {
        const result = await uploadMutation.mutateAsync(file);
        setEditingItem({
          ...editingItem,
          main_image_id: result.id,
          media: { file_url: result.file_url },
        });
      } catch (err) {
        console.error("Image upload failed:", err);
      }
    }
  };

  const handleDocSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && editingItem) {
      try {
        const result = await uploadMutation.mutateAsync(file);
        const newDoc = {
          original_name: file.name,
          file_url: result.file_url,
          file_type: file.type,
          file_size: file.size,
        };
        const currentDocs = Array.isArray(editingItem.documents) ? editingItem.documents : [];
        setEditingItem({
          ...editingItem,
          documents: [...currentDocs, newDoc],
        });
      } catch (err) {
        console.error("Document upload failed:", err);
      }
    }
  };

  const removeDocument = (index: number) => {
    if (editingItem && Array.isArray(editingItem.documents)) {
      const newDocs = [...editingItem.documents];
      newDocs.splice(index, 1);
      setEditingItem({ ...editingItem, documents: newDocs });
    }
  };

  if (view === "editor" && editingItem) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <button
            onClick={() => setView("list")}
            className="flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Engagements
          </button>
          <button
            onClick={handleSave}
            disabled={upsertMutation.isPending}
            className="flex items-center gap-2 rounded-md bg-[#186a42] px-4 py-2 text-sm font-semibold text-white hover:bg-[#125333] disabled:opacity-50"
          >
            <Save className="h-4 w-4" />
            {upsertMutation.isPending ? "Saving..." : "Save Engagement"}
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="rounded-lg bg-white p-6 shadow-sm ring-1 ring-gray-200">
              <div className="grid grid-cols-1 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-900">Title</label>
                  <input
                    type="text"
                    value={editingItem.title || ""}
                    onChange={(e) => {
                      const title = e.target.value;
                      setEditingItem({
                        ...editingItem,
                        title,
                        slug: generateSlug(title),
                      });
                    }}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#186a42] focus:ring-[#186a42] sm:text-sm p-2 border"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-900">Slug</label>
                  <input
                    type="text"
                    value={editingItem.slug || ""}
                    onChange={(e) => setEditingItem({ ...editingItem, slug: e.target.value })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#186a42] focus:ring-[#186a42] sm:text-sm p-2 border"
                  />
                  <p className="mt-1 text-xs text-gray-500">
                    Auto-generated from title. Must be unique.
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-900">Category</label>
                  <input
                    type="text"
                    value={editingItem.category || ""}
                    onChange={(e) => setEditingItem({ ...editingItem, category: e.target.value })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#186a42] focus:ring-[#186a42] sm:text-sm p-2 border"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-900">Description</label>
                  <textarea
                    rows={6}
                    value={editingItem.description || ""}
                    onChange={(e) =>
                      setEditingItem({ ...editingItem, description: e.target.value })
                    }
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#186a42] focus:ring-[#186a42] sm:text-sm p-2 border"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-900">
                      Responsible Office
                    </label>
                    <input
                      type="text"
                      value={editingItem.responsible_office || ""}
                      onChange={(e) =>
                        setEditingItem({ ...editingItem, responsible_office: e.target.value })
                      }
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#186a42] focus:ring-[#186a42] sm:text-sm p-2 border"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-900">
                      Contact Person
                    </label>
                    <input
                      type="text"
                      value={editingItem.contact_person || ""}
                      onChange={(e) =>
                        setEditingItem({ ...editingItem, contact_person: e.target.value })
                      }
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#186a42] focus:ring-[#186a42] sm:text-sm p-2 border"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-900">Email</label>
                    <input
                      type="email"
                      value={editingItem.email || ""}
                      onChange={(e) => setEditingItem({ ...editingItem, email: e.target.value })}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#186a42] focus:ring-[#186a42] sm:text-sm p-2 border"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-900">Phone</label>
                    <input
                      type="text"
                      value={editingItem.phone || ""}
                      onChange={(e) => setEditingItem({ ...editingItem, phone: e.target.value })}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#186a42] focus:ring-[#186a42] sm:text-sm p-2 border"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-900">Location</label>
                  <input
                    type="text"
                    value={editingItem.location || ""}
                    onChange={(e) => setEditingItem({ ...editingItem, location: e.target.value })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#186a42] focus:ring-[#186a42] sm:text-sm p-2 border"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-900">Status</label>
                  <select
                    value={editingItem.status || "active"}
                    onChange={(e) => setEditingItem({ ...editingItem, status: e.target.value })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#186a42] focus:ring-[#186a42] sm:text-sm p-2 border"
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                    <option value="archived">Archived</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="rounded-lg bg-white p-6 shadow-sm ring-1 ring-gray-200 space-y-4">
              <h2 className="text-sm font-medium text-gray-900">Main Image</h2>
              <div
                className="aspect-video w-full rounded-md border-2 border-dashed border-gray-300 bg-gray-50 flex flex-col items-center justify-center cursor-pointer hover:bg-gray-100 overflow-hidden relative"
                onClick={() => !uploadMutation.isPending && imageInputRef.current?.click()}
              >
                {editingItem.media?.file_url ? (
                  <img
                    src={editingItem.media?.file_url}
                    alt="Main"
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
        title="Community Engagement"
        description="Manage university community engagement initiatives and programs."
        action={
          <button
            onClick={handleCreate}
            className="flex items-center gap-2 rounded-md bg-[#186a42] px-4 py-2 text-sm font-semibold text-white hover:bg-[#125333]"
          >
            <Plus className="h-4 w-4" />
            Add Engagement
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
                Title
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase"
              >
                Category
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase"
              >
                Responsible Office
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
                  Loading engagements...
                </td>
              </tr>
            )}
            {!query.isLoading && (!query.data || query.data.length === 0) && (
              <tr>
                <td colSpan={5} className="p-8 text-center text-gray-500">
                  No community engagements found.
                </td>
              </tr>
            )}
            {query.data?.map((item) => (
              <tr key={item.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900">
                  {item.title}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {item.category || "N/A"}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {item.responsible_office || "N/A"}
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
