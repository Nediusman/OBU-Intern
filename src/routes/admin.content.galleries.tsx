import { createFileRoute } from "@tanstack/react-router";
import { AdminPageHeader } from "@/frontend/admin/components/AdminPageHeader";
import { AdminBadge } from "@/frontend/admin/components/AdminBadge";
import {
  Plus,
  Edit,
  Trash2,
  Search,
  X,
  Save,
  Image as ImageIcon,
  GripVertical,
  Loader2,
} from "lucide-react";
import { useState, useRef } from "react";
import { useMedia } from "@/frontend/admin/hooks/useMedia";
import type { Database } from "@/frontend/lib/database.types";
import { toast } from "sonner";
import { generateSlug } from "@/frontend/lib/utils";
import { useGalleries, type GalleryWithMedia } from "@/frontend/admin/hooks/useGalleries";

type GalleryRow = GalleryWithMedia;
type GalleryInsert = Database["public"]["Tables"]["galleries"]["Insert"];

export const Route = createFileRoute("/admin/content/galleries")({
  component: GalleriesManagement,
});

function GalleriesManagement() {
  const [view, setView] = useState<"list" | "editor">("list");
  const [editingItem, setEditingItem] = useState<
    Partial<GalleryRow> & { preview_cover_url?: string }
  >({});
  const {
    query,
    createMutation,
    updateMutation,
    deleteMutation,
    useGalleryImagesQuery,
    addImageMutation,
    updateImageOrderMutation,
    deleteImageMutation,
  } = useGalleries();
  const { uploadMutation } = useMedia();

  const fileInputRef = useRef<HTMLInputElement>(null);
  const coverInputRef = useRef<HTMLInputElement>(null);

  const imagesQuery = useGalleryImagesQuery(editingItem.id || "");
  const images = imagesQuery.data || [];

  const [draggedItemId, setDraggedItemId] = useState<string | null>(null);

  const handleEdit = (item: GalleryRow) => {
    setEditingItem(item);
    setView("editor");
  };

  const handleCreate = () => {
    setEditingItem({});
    setView("editor");
  };

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this gallery?")) {
      deleteMutation.mutate(id);
    }
  };

  const handleSave = (status: string) => {
    if (!editingItem.title) {
      toast.error("Title is required");
      return;
    }

    const rawSlug =
      editingItem.slug?.trim() || generateSlug(editingItem.title || "gallery") || "gallery";
    const payload: GalleryInsert = {
      title: editingItem.title.trim(),
      slug: rawSlug,
      description: editingItem.description || "",
      status: status,
      cover_image_id: editingItem.cover_image_id,
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

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!editingItem.id) {
      toast.error("Please save the gallery first before uploading images");
      return;
    }
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const media = await uploadMutation.mutateAsync(file);
      await addImageMutation.mutateAsync({
        gallery_id: editingItem.id,
        media_id: media.id,
        display_order: images.length,
      });
      toast.success("Image added to gallery");
    } catch (error: unknown) {
      const err = error as Error;
      toast.error(`Upload failed: ${err.message}`);
    }
  };

  const handleCoverUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const media = await uploadMutation.mutateAsync(file);
      setEditingItem((prev) => ({
        ...prev,
        cover_image_id: media.id,
        preview_cover_url: media.file_url,
      }));
      toast.success("Cover image uploaded");
    } catch (error: unknown) {
      const err = error as Error;
      toast.error(`Upload failed: ${err.message}`);
    }
  };

  const handleDragStart = (e: React.DragEvent, id: string) => {
    setDraggedItemId(id);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragOver = (e: React.DragEvent, targetId: string) => {
    e.preventDefault();
    if (!draggedItemId || draggedItemId === targetId) return;

    const oldIndex = images.findIndex((img) => img.id === draggedItemId);
    const newIndex = images.findIndex((img) => img.id === targetId);

    const newImages = [...images];
    const removed = newImages.splice(oldIndex, 1)[0];
    if (removed) {
      newImages.splice(newIndex, 0, removed);
    }

    const updates = newImages.map((img, index) => ({ id: img.id, display_order: index }));
    updateImageOrderMutation.mutate({ updates });
  };

  const handleDeleteImage = (id: string) => {
    if (confirm("Remove this image?")) {
      deleteImageMutation.mutate({ id });
    }
  };

  if (view === "editor") {
    return (
      <div className="space-y-6 max-w-4xl mx-auto">
        <AdminPageHeader
          title={editingItem.id ? "Edit Gallery" : "Create Gallery"}
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

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="rounded-lg bg-white p-6 shadow-sm ring-1 ring-gray-200 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Gallery Title *</label>
                <input
                  type="text"
                  value={editingItem.title || ""}
                  onChange={(e) => {
                    const newTitle = e.target.value;
                    setEditingItem((prev) => {
                      if (!prev) return prev;
                      if (!prev.slug || prev.slug === generateSlug(prev.title || "")) {
                        return { ...prev, title: newTitle, slug: generateSlug(newTitle) };
                      }
                      return { ...prev, title: newTitle };
                    });
                  }}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#186a42] focus:ring-[#186a42] sm:text-sm p-2 border"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Slug *</label>
                <input
                  type="text"
                  value={editingItem.slug || ""}
                  onChange={(e) => setEditingItem({ ...editingItem, slug: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#186a42] focus:ring-[#186a42] sm:text-sm p-2 border"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Description</label>
                <textarea
                  rows={3}
                  value={editingItem.description || ""}
                  onChange={(e) => setEditingItem({ ...editingItem, description: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#186a42] focus:ring-[#186a42] sm:text-sm p-2 border"
                />
              </div>
            </div>

            <div className="rounded-lg bg-white p-6 shadow-sm ring-1 ring-gray-200">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-sm font-medium text-gray-900">Images (Drag to reorder)</h2>
                <button
                  onClick={() => {
                    if (!editingItem.id) {
                      toast.error("Please save the gallery first before uploading images");
                      return;
                    }
                    fileInputRef.current?.click();
                  }}
                  className="flex items-center gap-2 rounded-md bg-white px-3 py-1.5 text-xs font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 disabled:opacity-50"
                  disabled={uploadMutation.isPending || addImageMutation.isPending}
                >
                  {uploadMutation.isPending || addImageMutation.isPending ? (
                    <Loader2 className="h-3 w-3 animate-spin" />
                  ) : (
                    <Plus className="h-3 w-3" />
                  )}
                  Add Image
                </button>
                <input
                  type="file"
                  ref={fileInputRef}
                  className="hidden"
                  accept="image/*"
                  onChange={handleFileUpload}
                />
              </div>

              {!editingItem.id && (
                <div className="p-4 text-center text-sm text-gray-500 bg-gray-50 rounded-md border border-gray-200">
                  Please save the gallery first to start uploading images.
                </div>
              )}

              {editingItem.id && (
                <ul className="space-y-3">
                  {imagesQuery.isLoading && (
                    <li className="p-4 text-center text-sm text-gray-500">Loading images...</li>
                  )}
                  {!imagesQuery.isLoading && images.length === 0 && (
                    <li className="p-4 text-center text-sm text-gray-500 border border-dashed border-gray-300 rounded-md">
                      No images uploaded yet.
                    </li>
                  )}
                  {images.map((img) => (
                    <li
                      key={img.id}
                      draggable
                      onDragStart={(e) => handleDragStart(e, img.id)}
                      onDragOver={(e) => handleDragOver(e, img.id)}
                      className={`flex items-center gap-4 p-3 border border-gray-200 rounded-md bg-gray-50 ${draggedItemId === img.id ? "opacity-50" : ""}`}
                    >
                      <GripVertical className="h-5 w-5 text-gray-400 cursor-move flex-shrink-0" />
                      <div className="h-16 w-24 bg-gray-200 rounded overflow-hidden flex-shrink-0">
                        <img
                          src={img.media?.file_url}
                          alt={img.media?.file_name}
                          className="h-full w-full object-cover"
                        />
                      </div>
                      <div className="flex-1">
                        {/* Optionally add caption editing here */}
                        <div className="text-sm text-gray-700 truncate">{img.media?.file_name}</div>
                      </div>
                      <button
                        onClick={() => handleDeleteImage(img.id)}
                        className="text-red-500 hover:text-red-700 p-2"
                        disabled={deleteImageMutation.isPending}
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>

          <div className="space-y-6">
            <div className="rounded-lg bg-white p-6 shadow-sm ring-1 ring-gray-200 space-y-4">
              <h2 className="text-sm font-medium text-gray-900">Cover Image</h2>
              <div
                onClick={() => coverInputRef.current?.click()}
                className="aspect-video w-full rounded-md border-2 border-dashed border-gray-300 bg-gray-50 flex flex-col items-center justify-center cursor-pointer hover:bg-gray-100 overflow-hidden relative"
              >
                {editingItem.preview_cover_url || editingItem.media?.file_url ? (
                  <img
                    src={editingItem.preview_cover_url || editingItem.media?.file_url}
                    alt="Cover"
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <>
                    <ImageIcon className="h-8 w-8 text-gray-400 mb-2" />
                    <span className="text-sm text-gray-500">Select Cover</span>
                  </>
                )}
                {uploadMutation.isPending && (
                  <div className="absolute inset-0 bg-white/70 flex items-center justify-center">
                    <Loader2 className="h-6 w-6 animate-spin text-[#186a42]" />
                  </div>
                )}
              </div>
              <input
                type="file"
                ref={coverInputRef}
                className="hidden"
                accept="image/*"
                onChange={handleCoverUpload}
              />
              <button
                onClick={() => coverInputRef.current?.click()}
                className="w-full rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
              >
                Change Cover Image
              </button>
            </div>

            <div className="rounded-lg bg-white p-6 shadow-sm ring-1 ring-gray-200 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Status</label>
                <select
                  value={editingItem.status || "active"}
                  onChange={(e) => setEditingItem({ ...editingItem, status: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#186a42] focus:ring-[#186a42] sm:text-sm p-2 border"
                >
                  <option value="active">Published</option>
                  <option value="inactive">Draft</option>
                  <option value="archived">Archived</option>
                </select>
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
        title="Photo Galleries"
        description="Manage image galleries displayed on the website."
        action={
          <button
            onClick={handleCreate}
            className="flex items-center gap-2 rounded-md bg-[#186a42] px-4 py-2 text-sm font-semibold text-white hover:bg-[#125333]"
          >
            <Plus className="h-4 w-4" />
            Create Gallery
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
            placeholder="Search galleries..."
            className="block w-full rounded-md border-0 py-1.5 pl-10 pr-3 text-gray-900 ring-1 ring-inset ring-gray-300 sm:text-sm sm:leading-6"
          />
        </div>
      </div>

      {query.isLoading && <div className="p-8 text-center text-gray-500">Loading galleries...</div>}

      {!query.isLoading && (!query.data || query.data.length === 0) && (
        <div className="p-8 text-center text-gray-500">No galleries found.</div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {query.data?.map((gallery) => (
          <div
            key={gallery.id}
            className="rounded-lg bg-white shadow-sm ring-1 ring-gray-200 overflow-hidden flex flex-col"
          >
            <div className="aspect-video bg-gray-200 relative">
              {gallery.media?.file_url ? (
                <img
                  src={gallery.media.file_url}
                  alt="Cover"
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="h-full w-full flex items-center justify-center text-gray-400">
                  No Cover
                </div>
              )}
              <div className="absolute top-2 right-2">
                <AdminBadge status={gallery.status} />
              </div>
            </div>
            <div className="p-4 flex-1 flex flex-col">
              <h3 className="text-lg font-bold text-gray-900">{gallery.title}</h3>
              <p className="text-sm text-gray-500 mt-1 line-clamp-2 flex-1">
                {gallery.description}
              </p>
              <div className="mt-4 flex items-center justify-between pt-4 border-t border-gray-100">
                <span className="text-sm font-medium text-gray-500 flex items-center gap-1">
                  <ImageIcon className="h-4 w-4" />{" "}
                  {(gallery.gallery_images as unknown as { count: number }[])[0]?.count || 0} Photos
                </span>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEdit(gallery)}
                    className="p-1.5 text-gray-400 hover:text-[#186a42] rounded-md hover:bg-gray-50"
                  >
                    <Edit className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(gallery.id)}
                    disabled={deleteMutation.isPending}
                    className="p-1.5 text-gray-400 hover:text-red-600 rounded-md hover:bg-gray-50 disabled:opacity-50"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
