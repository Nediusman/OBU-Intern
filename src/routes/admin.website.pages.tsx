import { createFileRoute } from "@tanstack/react-router";
import { AdminPageHeader } from "@/frontend/admin/components/AdminPageHeader";
import { AdminBadge } from "@/frontend/admin/components/AdminBadge";
import { Plus, Edit, Trash2, Search, X, Save, ImageIcon } from "lucide-react";
import { useState } from "react";
import { usePages } from "@/frontend/admin/hooks/usePages";
import { AdminImageUpload } from "@/frontend/admin/components/AdminImageUpload";
import type { Database } from "@/frontend/lib/database.types";
import { toast } from "sonner";
import { useAuth } from "@/frontend/contexts/AuthContext";

type BasePageRow = Omit<
  Database["public"]["Tables"]["pages"]["Row"],
  "main_image_id" | "featured_image_id" | "parent_id" | "short_description" | "content"
>;

type PageRow = BasePageRow & {
  short_description?: string | null;
  content?: string | null;
  parent_id?: string | null;
  main_image_id?: string | null;
  featured_image_id?: string | null;
  main_image?: { id: string; file_url: string } | null;
  featured_image?: { id: string; file_url: string } | null;
};

type PageInsert = Omit<
  Database["public"]["Tables"]["pages"]["Insert"],
  "main_image_id" | "featured_image_id" | "parent_id" | "short_description" | "content"
> & {
  short_description?: string | null;
  content?: string | null;
  parent_id?: string | null;
  main_image_id?: string | null;
  featured_image_id?: string | null;
};

export const Route = createFileRoute("/admin/website/pages")({
  component: PagesManagement,
});

function PagesManagement() {
  const [view, setView] = useState<"list" | "editor">("list");
  const [activeTab, setActiveTab] = useState<"basic" | "attributes">("basic");
  const [editingItem, setEditingItem] = useState<Partial<PageRow>>({});
  const [searchTerm, setSearchTerm] = useState("");

  const { query, createMutation, updateMutation, deleteMutation } = usePages();
  const { currentUser } = useAuth();

  const handleEdit = (item: PageRow) => {
    setEditingItem(item);
    setView("editor");
  };

  const handleCreate = () => {
    setEditingItem({
      display_order: 0,
      page_type: "Standard",
      main_image_id: null,
      featured_image_id: null,
    });
    setView("editor");
  };

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this page?")) {
      deleteMutation.mutate(id);
    }
  };

  const handleSave = (status: string) => {
    if (!editingItem.title?.trim()) {
      toast.error("Page Title is required");
      return;
    }

    const cleanSlug = (editingItem.slug || "")
      .replace(/^\/+|\/+$/g, "")
      .trim()
      .toLowerCase();

    if (!cleanSlug) {
      toast.error("URL Slug is required");
      return;
    }

    const payload: PageInsert = {
      title: editingItem.title.trim(),
      slug: cleanSlug,
      short_description: editingItem.short_description || null,
      content: editingItem.content || null,
      page_type: editingItem.page_type || "Standard",
      parent_id: editingItem.parent_id || null,
      display_order: editingItem.display_order || 0,
      main_image_id: editingItem.main_image_id || null,
      featured_image_id: editingItem.featured_image_id || null,
      status: status,
      featured: editingItem.featured || false,
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

  const filteredPages = (query.data as PageRow[] | undefined)?.filter((item) => {
    if (!searchTerm.trim()) return true;
    const term = searchTerm.toLowerCase();
    return (
      item.title?.toLowerCase().includes(term) ||
      item.slug?.toLowerCase().includes(term) ||
      item.page_type?.toLowerCase().includes(term)
    );
  });

  if (view === "editor") {
    return (
      <div className="space-y-6 max-w-5xl mx-auto">
        <AdminPageHeader
          title={editingItem.id ? "Edit Page" : "Create Page"}
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

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-3 space-y-6">
            <div className="border-b border-gray-200">
              <nav className="-mb-px flex space-x-8" aria-label="Tabs">
                <button
                  onClick={() => setActiveTab("basic")}
                  className={`${activeTab === "basic" ? "border-[#186a42] text-[#186a42]" : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700"} whitespace-nowrap border-b-2 py-4 px-1 text-sm font-medium`}
                >
                  Basic Info
                </button>
                <button
                  onClick={() => setActiveTab("attributes")}
                  className={`${activeTab === "attributes" ? "border-[#186a42] text-[#186a42]" : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700"} whitespace-nowrap border-b-2 py-4 px-1 text-sm font-medium`}
                >
                  Attributes
                </button>
              </nav>
            </div>

            {activeTab === "basic" && (
              <div className="rounded-lg bg-white p-6 shadow-sm ring-1 ring-gray-200 space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Page Title *</label>
                  <input
                    type="text"
                    value={editingItem.title || ""}
                    onChange={(e) => setEditingItem({ ...editingItem, title: e.target.value })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#186a42] sm:text-sm"
                    placeholder="e.g. Student Services"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">URL Slug *</label>
                  <div className="flex mt-1 rounded-md shadow-sm">
                    <span className="inline-flex items-center rounded-l-md border border-r-0 border-gray-300 px-3 text-gray-500 sm:text-sm bg-gray-50">
                      obu.edu.et/pages/
                    </span>
                    <input
                      type="text"
                      value={editingItem.slug || ""}
                      onChange={(e) => setEditingItem({ ...editingItem, slug: e.target.value })}
                      className="block w-full min-w-0 flex-1 rounded-none rounded-r-md border-gray-300 focus:border-[#186a42] sm:text-sm"
                      placeholder="student-services"
                    />
                  </div>
                  <p className="mt-1 text-xs text-gray-500">
                    The public page URL will be:{" "}
                    <code className="text-gray-700 font-mono">
                      /pages/{(editingItem.slug || "").replace(/^\/+|\/+$/g, "") || "your-slug"}
                    </code>
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Short Description
                  </label>
                  <textarea
                    rows={2}
                    value={editingItem.short_description || ""}
                    onChange={(e) =>
                      setEditingItem({ ...editingItem, short_description: e.target.value })
                    }
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#186a42] sm:text-sm"
                    placeholder="Brief summary or introductory lead text for the page..."
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                  <div className="rounded-lg border border-gray-200 p-4 bg-gray-50/50">
                    <AdminImageUpload
                      label="Main Hero Image"
                      description="Banner image displayed at the top of the page (Max 10MB)"
                      aspectRatio="banner"
                      value={editingItem.main_image_id}
                      imageUrl={editingItem.main_image?.file_url}
                      onChange={(media) =>
                        setEditingItem((prev) => ({
                          ...prev,
                          main_image_id: media?.id ?? null,
                          main_image: media?.id
                            ? { id: media.id, file_url: media.file_url! }
                            : null,
                        }))
                      }
                    />
                  </div>
                  <div className="rounded-lg border border-gray-200 p-4 bg-gray-50/50">
                    <AdminImageUpload
                      label="Featured / Thumbnail Image"
                      description="Thumbnail image for page listings and preview cards (Max 10MB)"
                      aspectRatio="video"
                      value={editingItem.featured_image_id}
                      imageUrl={editingItem.featured_image?.file_url}
                      onChange={(media) =>
                        setEditingItem((prev) => ({
                          ...prev,
                          featured_image_id: media?.id ?? null,
                          featured_image: media?.id
                            ? { id: media.id, file_url: media.file_url! }
                            : null,
                        }))
                      }
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Main Content</label>
                  <div className="mt-1 rounded-md border border-gray-300 shadow-sm overflow-hidden">
                    <textarea
                      rows={12}
                      value={editingItem.content || ""}
                      onChange={(e) => setEditingItem({ ...editingItem, content: e.target.value })}
                      className="block w-full border-0 focus:ring-0 sm:text-sm p-3"
                      placeholder="Write the full page content here..."
                    />
                  </div>
                </div>
              </div>
            )}

            {activeTab === "attributes" && (
              <div className="rounded-lg bg-white p-6 shadow-sm ring-1 ring-gray-200 space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Page Type</label>
                  <select
                    value={editingItem.page_type || "Standard"}
                    onChange={(e) => setEditingItem({ ...editingItem, page_type: e.target.value })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#186a42] sm:text-sm"
                  >
                    <option value="Standard">Standard</option>
                    <option value="Policy">Policy</option>
                    <option value="Landing Page">Landing Page</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Parent Page</label>
                  <select
                    value={editingItem.parent_id || ""}
                    onChange={(e) => setEditingItem({ ...editingItem, parent_id: e.target.value })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#186a42] sm:text-sm"
                  >
                    <option value="">-- No Parent (Root) --</option>
                    {query.data
                      ?.filter((p) => p.id !== editingItem.id)
                      .map((page) => (
                        <option key={page.id} value={page.id}>
                          {page.title}
                        </option>
                      ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Display Order</label>
                  <input
                    type="number"
                    value={editingItem.display_order || 0}
                    onChange={(e) =>
                      setEditingItem({
                        ...editingItem,
                        display_order: parseInt(e.target.value) || 0,
                      })
                    }
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#186a42] sm:text-sm"
                  />
                </div>
              </div>
            )}
          </div>

          <div className="space-y-6">
            <div className="rounded-lg bg-white p-6 shadow-sm ring-1 ring-gray-200 space-y-4">
              <h3 className="text-sm font-bold text-gray-900 border-b pb-2">Publishing</h3>
              <div className="text-xs text-gray-500 space-y-1 pt-2">
                <p>
                  <strong>Created:</strong>{" "}
                  {editingItem.created_at
                    ? new Date(editingItem.created_at).toLocaleString()
                    : "New"}
                </p>
                <p>
                  <strong>Updated:</strong>{" "}
                  {editingItem.updated_at
                    ? new Date(editingItem.updated_at).toLocaleString()
                    : "Never"}
                </p>
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
        title="Pages"
        description="Manage the static pages, content hierarchy, and structure of the website."
        action={
          <button
            onClick={handleCreate}
            className="flex items-center gap-2 rounded-md bg-[#186a42] px-4 py-2 text-sm font-semibold text-white hover:bg-[#125333]"
          >
            <Plus className="h-4 w-4" />
            Add Page
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
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search pages by title or slug..."
            className="block w-full rounded-md border-0 py-1.5 pl-10 pr-8 text-gray-900 ring-1 ring-inset ring-gray-300 sm:text-sm sm:leading-6"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm("")}
              className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>

      {query.isLoading ? (
        <div className="flex h-32 items-center justify-center rounded-lg border border-dashed border-gray-300 bg-white">
          <div className="text-sm text-gray-500">Loading pages...</div>
        </div>
      ) : query.isError ? (
        <div className="flex h-32 items-center justify-center rounded-lg border border-red-300 bg-red-50">
          <div className="text-sm text-red-600">Failed to load pages.</div>
        </div>
      ) : filteredPages?.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-gray-300 bg-white py-12">
          <p className="text-sm text-gray-500">
            {searchTerm ? "No pages match your search." : "No pages found."}
          </p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-lg bg-white shadow ring-1 ring-gray-200">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                >
                  Page Title & Slug
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                >
                  Type
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                >
                  Last Updated
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                >
                  Status
                </th>
                <th scope="col" className="relative px-6 py-3">
                  <span className="sr-only">Actions</span>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              {filteredPages?.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      {item.main_image?.file_url ? (
                        <img
                          src={item.main_image.file_url}
                          alt={item.title}
                          className="h-10 w-10 rounded-md object-cover border border-gray-200 shrink-0"
                        />
                      ) : (
                        <div className="h-10 w-10 rounded-md bg-gray-100 border border-gray-200 flex items-center justify-center text-gray-400 shrink-0">
                          <ImageIcon className="h-5 w-5" />
                        </div>
                      )}
                      <div>
                        <div className="text-sm font-bold text-gray-900">{item.title}</div>
                        <div className="text-xs text-gray-500 font-mono">/pages/{item.slug}</div>
                      </div>
                    </div>
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                    {item.page_type}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                    {item.updated_at ? new Date(item.updated_at).toLocaleDateString() : "-"}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4">
                    <AdminBadge status={item.status} />
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-right text-sm font-medium">
                    <div className="flex justify-end gap-3">
                      <button
                        onClick={() => handleEdit(item)}
                        className="text-gray-400 hover:text-[#186a42]"
                        title="Edit Page"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(item.id)}
                        className="text-gray-400 hover:text-red-600"
                        title="Delete Page"
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
