import { createFileRoute } from "@tanstack/react-router";
import { AdminPageHeader } from "@/frontend/admin/components/AdminPageHeader";
import { Search, Upload, List, Grid, Trash2, X, File as FileIcon } from "lucide-react";
import { useState, useRef } from "react";
import { useMedia } from "@/frontend/admin/hooks/useMedia";
import type { Database } from "@/frontend/lib/database.types";
import { toast } from "sonner";

type MediaRow = Database["public"]["Tables"]["media"]["Row"];

export const Route = createFileRoute("/admin/website/media")({
  component: MediaLibraryManagement,
});

function formatFileSize(bytes: number) {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
}

function MediaLibraryManagement() {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [activeMedia, setActiveMedia] = useState<MediaRow | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { query, uploadMutation, updateMutation, deleteMutation } = useMedia();

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // 10MB limit for example
      if (file.size > 10 * 1024 * 1024) {
        toast.error("File is too large (max 10MB)");
        return;
      }
      uploadMutation.mutate(file);
    }
  };

  const handleUpdate = () => {
    if (!activeMedia) return;
    updateMutation.mutate(
      {
        id: activeMedia.id,
        updates: {
          alt_text: activeMedia.alt_text,
          caption: activeMedia.caption,
        },
      },
      { onSuccess: () => setActiveMedia(null) },
    );
  };

  const handleDelete = (media: MediaRow) => {
    if (confirm("Are you sure you want to delete this file? This cannot be undone.")) {
      deleteMutation.mutate(media, {
        onSuccess: () => setActiveMedia(null),
      });
    }
  };

  const filteredMedia =
    query.data?.filter(
      (file) =>
        file.original_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (file.alt_text && file.alt_text.toLowerCase().includes(searchQuery.toLowerCase())),
    ) || [];

  if (activeMedia) {
    return (
      <div className="space-y-6 max-w-4xl mx-auto">
        <AdminPageHeader
          title="Media Details"
          action={
            <div className="flex gap-2">
              <button
                onClick={() => setActiveMedia(null)}
                className="flex items-center gap-2 rounded-md bg-white px-4 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
              >
                <X className="h-4 w-4" />
                Close
              </button>
            </div>
          }
        />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 bg-white p-6 rounded-lg shadow-sm ring-1 ring-gray-200">
          <div className="flex flex-col items-center justify-center bg-gray-100 rounded-lg p-4 h-80">
            {activeMedia.file_type?.startsWith("image/") ? (
              <img
                src={activeMedia.file_url}
                alt={activeMedia.alt_text || "Preview"}
                className="max-h-full max-w-full object-contain"
              />
            ) : (
              <div className="text-center text-gray-500 font-medium flex flex-col items-center">
                <FileIcon className="h-16 w-16 mb-4 text-gray-400" />
                <span>{activeMedia.file_type || "Document"}</span>
              </div>
            )}
          </div>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">File Name</label>
              <input
                type="text"
                disabled
                value={activeMedia.original_name}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm bg-gray-50 text-gray-500 sm:text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Alt Text (For accessibility)
              </label>
              <input
                type="text"
                value={activeMedia.alt_text || ""}
                onChange={(e) => setActiveMedia({ ...activeMedia, alt_text: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#186a42] sm:text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Caption</label>
              <input
                type="text"
                value={activeMedia.caption || ""}
                onChange={(e) => setActiveMedia({ ...activeMedia, caption: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#186a42] sm:text-sm"
              />
            </div>
            <div className="pt-4 border-t border-gray-200 text-sm text-gray-500 space-y-2">
              <p>
                <strong>File Type:</strong> {activeMedia.file_type}
              </p>
              <p>
                <strong>File Size:</strong> {formatFileSize(activeMedia.file_size || 0)}
              </p>
              <p>
                <strong>Uploaded On:</strong> {new Date(activeMedia.created_at).toLocaleString()}
              </p>
              <p>
                <strong>URL:</strong>{" "}
                <a
                  href={activeMedia.file_url}
                  target="_blank"
                  rel="noreferrer"
                  className="text-blue-600 hover:underline"
                >
                  View Original
                </a>
              </p>
            </div>
            <div className="pt-4 flex gap-2">
              <button
                onClick={handleUpdate}
                disabled={updateMutation.isPending}
                className="flex-1 rounded-md bg-[#186a42] px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-[#125333] disabled:opacity-50"
              >
                {updateMutation.isPending ? "Updating..." : "Update Details"}
              </button>
              <button
                onClick={() => handleDelete(activeMedia)}
                disabled={deleteMutation.isPending}
                className="flex-none rounded-md bg-white border-2 border-red-100 px-4 py-2 text-sm font-semibold text-red-600 shadow-sm hover:bg-red-50 disabled:opacity-50"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Media Library"
        description="Upload and manage images, PDFs, and documents."
        action={
          <>
            <input
              type="file"
              ref={fileInputRef}
              className="hidden"
              onChange={handleFileSelect}
              accept="image/*,application/pdf,.doc,.docx"
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={uploadMutation.isPending}
              className="flex items-center gap-2 rounded-md bg-[#186a42] px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-[#125333] disabled:opacity-50"
            >
              <Upload className="h-4 w-4" />
              {uploadMutation.isPending ? "Uploading..." : "Upload File"}
            </button>
          </>
        }
      />

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative max-w-sm flex-1">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
            <Search className="h-4 w-4 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search media..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="block w-full rounded-md border-0 py-1.5 pl-10 pr-3 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-[#186a42] sm:text-sm sm:leading-6"
          />
        </div>
        <div className="flex items-center gap-2">
          <div className="flex bg-white rounded-md ring-1 ring-inset ring-gray-300">
            <button
              onClick={() => setViewMode("grid")}
              className={`p-2 ${viewMode === "grid" ? "bg-gray-100 text-gray-900" : "text-gray-400 hover:text-gray-700"}`}
            >
              <Grid className="h-4 w-4" />
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={`p-2 ${viewMode === "list" ? "bg-gray-100 text-gray-900" : "text-gray-400 hover:text-gray-700"}`}
            >
              <List className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {query.isLoading ? (
        <div className="flex h-32 items-center justify-center rounded-lg border border-dashed border-gray-300 bg-white">
          <div className="text-sm text-gray-500">Loading media...</div>
        </div>
      ) : filteredMedia.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-gray-300 bg-white py-12">
          <p className="text-sm text-gray-500">No files found.</p>
        </div>
      ) : viewMode === "grid" ? (
        <div className="grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 sm:gap-x-6 lg:grid-cols-4 xl:gap-x-8">
          {filteredMedia.map((file) => (
            <div
              key={file.id}
              className="relative cursor-pointer group"
              onClick={() => setActiveMedia(file)}
            >
              <div className="group block w-full aspect-square rounded-lg bg-gray-100 focus-within:ring-2 focus-within:ring-[#186a42] focus-within:ring-offset-2 focus-within:ring-offset-gray-100 overflow-hidden">
                {file.file_type?.startsWith("image/") ? (
                  <img
                    src={file.file_url}
                    alt={file.alt_text || "Image preview"}
                    className="pointer-events-none object-cover group-hover:opacity-75 w-full h-full"
                  />
                ) : (
                  <div className="flex items-center justify-center w-full h-full text-gray-400 font-bold group-hover:opacity-75">
                    <FileIcon className="h-12 w-12" />
                  </div>
                )}
              </div>
              <p className="pointer-events-none mt-2 block truncate text-sm font-medium text-gray-900">
                {file.original_name}
              </p>
              <p className="pointer-events-none block text-sm font-medium text-gray-500">
                {formatFileSize(file.file_size || 0)}
              </p>
            </div>
          ))}
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
                  Preview
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  File Details
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Date
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              {filteredMedia.map((file) => (
                <tr
                  key={file.id}
                  className="hover:bg-gray-50 cursor-pointer"
                  onClick={() => setActiveMedia(file)}
                >
                  <td className="whitespace-nowrap px-6 py-4">
                    <div className="h-10 w-10 rounded bg-gray-100 overflow-hidden flex items-center justify-center">
                      {file.file_type?.startsWith("image/") ? (
                        <img src={file.file_url} className="h-full w-full object-cover" />
                      ) : (
                        <FileIcon className="h-5 w-5 text-gray-400" />
                      )}
                    </div>
                  </td>
                  <td className="whitespace-nowrap px-6 py-4">
                    <div className="text-sm font-medium text-gray-900 truncate max-w-[200px]">
                      {file.original_name}
                    </div>
                    <div className="text-xs text-gray-500">
                      {formatFileSize(file.file_size || 0)} • {file.file_type}
                    </div>
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                    {new Date(file.created_at).toLocaleDateString()}
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
