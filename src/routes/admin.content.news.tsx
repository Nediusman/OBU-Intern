import { createFileRoute } from "@tanstack/react-router";
import { AdminPageHeader } from "@/frontend/admin/components/AdminPageHeader";
import { AdminBadge } from "@/frontend/admin/components/AdminBadge";
import { AdminImageUpload } from "@/frontend/admin/components/AdminImageUpload";
import {
  Plus,
  Edit,
  Trash2,
  Search,
  Filter,
  ChevronLeft,
  ChevronRight,
  Save,
  X,
  Image as ImageIcon,
  Loader2,
} from "lucide-react";
import { useState } from "react";
import { useNews, type NewsWithMedia } from "@/frontend/admin/hooks/useNews";
import type { Database } from "@/frontend/lib/database.types";
import { toast } from "sonner";

type NewsInsert = Database["public"]["Tables"]["news"]["Insert"];

export const Route = createFileRoute("/admin/content/news")({
  component: NewsManagement,
});

function NewsManagement() {
  const [view, setView] = useState<"list" | "editor">("list");
  const [editingItem, setEditingItem] = useState<Partial<NewsWithMedia>>({});
  const { query, createMutation, updateMutation, deleteMutation } = useNews();
  const pending = createMutation.isPending || updateMutation.isPending;

  const handleEdit = (item: NewsWithMedia) => {
    setEditingItem(item);
    setView("editor");
  };

  const handleCreate = () => {
    setEditingItem({ featured_image_id: null, status: "draft" });
    setView("editor");
  };

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this news article?")) {
      deleteMutation.mutate(id);
    }
  };

  const handleSave = (status: string) => {
    if (pending) return;
    if (!editingItem.title || !editingItem.slug) {
      toast.error("Title and slug are required");
      return;
    }

    const payload: NewsInsert = {
      title: editingItem.title,
      slug: editingItem.slug,
      short_description: editingItem.short_description,
      content: editingItem.content,
      category: editingItem.category || "Uncategorized",
      status: status,
      featured_image_id: editingItem.featured_image_id || null,
      seo_title: editingItem.seo_title,
      seo_description: editingItem.seo_description,
      featured: editingItem.featured || false,
    };

    if (status === "published" && !editingItem.published_at) {
      payload.published_at = new Date().toISOString();
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
      <div className="space-y-6 max-w-4xl">
        <AdminPageHeader
          title={editingItem.id ? "Edit News Article" : "Create News Article"}
          action={
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => setView("list")}
                disabled={pending}
                className="flex items-center gap-1.5 rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 disabled:opacity-50"
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
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="space-y-6 lg:col-span-2">
            <div className="rounded-lg bg-white p-6 shadow-sm ring-1 ring-gray-200">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Article Title</label>
                  <input
                    type="text"
                    value={editingItem.title || ""}
                    onChange={(e) =>
                      setEditingItem({
                        ...editingItem,
                        title: e.target.value,
                        slug: e.target.value
                          .toLowerCase()
                          .replace(/[\s_]+/g, "-")
                          .replace(/[^\w-]/g, ""),
                      })
                    }
                    placeholder="Enter title here..."
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#186a42] focus:ring-[#186a42] sm:text-sm p-2 border"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">URL Slug</label>
                  <input
                    type="text"
                    value={editingItem.slug || ""}
                    onChange={(e) => setEditingItem({ ...editingItem, slug: e.target.value })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#186a42] focus:ring-[#186a42] sm:text-sm p-2 border"
                  />
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
                    placeholder="Brief summary..."
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#186a42] focus:ring-[#186a42] sm:text-sm p-2 border"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Content</label>
                  <div className="mt-1 rounded-md border border-gray-300 shadow-sm overflow-hidden">
                    <textarea
                      rows={10}
                      value={editingItem.content || ""}
                      onChange={(e) => setEditingItem({ ...editingItem, content: e.target.value })}
                      placeholder="Write the full article content here..."
                      className="block w-full border-0 focus:ring-0 sm:text-sm p-3"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="rounded-lg bg-white p-6 shadow-sm ring-1 ring-gray-200">
              <h2 className="text-sm font-medium text-gray-900 mb-4">SEO Details</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">SEO Title</label>
                  <input
                    type="text"
                    value={editingItem.seo_title || ""}
                    onChange={(e) => setEditingItem({ ...editingItem, seo_title: e.target.value })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#186a42] focus:ring-[#186a42] sm:text-sm p-2 border"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">SEO Description</label>
                  <textarea
                    rows={2}
                    value={editingItem.seo_description || ""}
                    onChange={(e) =>
                      setEditingItem({ ...editingItem, seo_description: e.target.value })
                    }
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#186a42] focus:ring-[#186a42] sm:text-sm p-2 border"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="rounded-lg bg-white p-6 shadow-sm ring-1 ring-gray-200">
              <h2 className="text-sm font-medium text-gray-900 mb-4">Featured Image</h2>
              <AdminImageUpload
                label="Article Cover Photo"
                description="Upload a high-quality featured photo for this article (Max 10MB)"
                value={editingItem.featured_image_id}
                imageUrl={editingItem.media?.file_url}
                onChange={(media) =>
                  setEditingItem((prev) => ({
                    ...prev,
                    featured_image_id: media?.id ?? null,
                    media: media?.id ? { id: media.id, file_url: media.file_url! } : null,
                  }))
                }
                disabled={pending}
              />
            </div>

            <div className="rounded-lg bg-white p-6 shadow-sm ring-1 ring-gray-200">
              <h2 className="text-sm font-medium text-gray-900 mb-4">Publishing</h2>
              <div className="space-y-4">
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

            <div className="rounded-lg bg-white p-6 shadow-sm ring-1 ring-gray-200">
              <h2 className="text-sm font-medium text-gray-900 mb-4">Categorization</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Category</label>
                  <select
                    value={editingItem.category || ""}
                    onChange={(e) => setEditingItem({ ...editingItem, category: e.target.value })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#186a42] focus:ring-[#186a42] sm:text-sm p-2 border"
                  >
                    <option value="">Select Category...</option>
                    <option value="Academics">Academics</option>
                    <option value="Campus Life">Campus Life</option>
                    <option value="Research">Research</option>
                    <option value="Events">Events</option>
                  </select>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={editingItem.featured || false}
                    onChange={(e) => setEditingItem({ ...editingItem, featured: e.target.checked })}
                    className="rounded border-gray-300 text-[#186a42] focus:ring-[#186a42]"
                    id="featured"
                  />
                  <label htmlFor="featured" className="text-sm font-medium text-gray-700">
                    Featured Article
                  </label>
                </div>
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
        title="News Articles"
        description="Manage university news, press releases, and articles."
        action={
          <button
            type="button"
            onClick={handleCreate}
            className="flex items-center gap-2 rounded-md bg-[#186a42] px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-[#125333]"
          >
            <Plus className="h-4 w-4" />
            Add News
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
                Image
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase"
              >
                Title & Excerpt
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
            {query.isLoading && (
              <tr>
                <td colSpan={6} className="p-8 text-center text-gray-500">
                  Loading news...
                </td>
              </tr>
            )}
            {!query.isLoading && (!query.data || query.data.length === 0) && (
              <tr>
                <td colSpan={6} className="p-8 text-center text-gray-500">
                  No news articles found.
                </td>
              </tr>
            )}
            {query.data?.map((item) => (
              <tr key={item.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {item.media?.file_url ? (
                    <img
                      src={item.media.file_url}
                      alt={item.title}
                      className="h-10 w-10 rounded-lg object-cover border border-gray-200"
                    />
                  ) : (
                    <div className="h-10 w-10 rounded-lg bg-gray-100 flex items-center justify-center text-gray-400 border border-gray-200">
                      <ImageIcon className="h-5 w-5" />
                    </div>
                  )}
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm font-medium text-gray-900">
                    {item.title}{" "}
                    {item.featured && (
                      <span className="ml-2 text-xs bg-yellow-100 text-yellow-800 px-1 py-0.5 rounded">
                        Featured
                      </span>
                    )}
                  </div>
                  <div className="text-xs text-gray-500 max-w-sm truncate">
                    {item.short_description}
                  </div>
                </td>
                <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                  {item.category}
                </td>
                <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                  {item.published_at ? new Date(item.published_at).toLocaleDateString() : "-"}
                </td>
                <td className="whitespace-nowrap px-6 py-4">
                  <AdminBadge status={item.status || "draft"} />
                </td>
                <td className="whitespace-nowrap px-6 py-4 text-right text-sm font-medium">
                  <div className="flex justify-end gap-3">
                    <button
                      type="button"
                      onClick={() => handleEdit(item)}
                      className="text-gray-400 hover:text-[#186a42] transition-colors"
                    >
                      <Edit className="h-4 w-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(item.id)}
                      disabled={deleteMutation.isPending}
                      className="text-gray-400 hover:text-red-600 transition-colors disabled:opacity-50"
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
