import { createFileRoute } from "@tanstack/react-router";
import { AdminPageHeader } from "@/frontend/admin/components/AdminPageHeader";
import { Plus, Trash2, Download } from "lucide-react";
import { AdminBadge } from "@/frontend/admin/components/AdminBadge";
import { useMedia } from "@/frontend/admin/hooks/useMedia";
import { useRef } from "react";
import { toast } from "sonner";
import type { Database } from "@/frontend/lib/database.types";

export const Route = createFileRoute("/admin/registrar/documents")({
  component: RegistrarDocuments,
});

function formatFileSize(bytes: number | null | undefined) {
  if (!bytes || bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
}

function RegistrarDocuments() {
  const { query, uploadMutation, deleteMutation } = useMedia({ folder: "registrar-documents" });
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 20 * 1024 * 1024) {
        toast.error("File is too large (max 20MB)");
        return;
      }
      uploadMutation.mutate(file);
    }
    // reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleDelete = (media: Database["public"]["Tables"]["media"]["Row"]) => {
    if (confirm("Are you sure you want to delete this document?")) {
      deleteMutation.mutate(media);
    }
  };

  const documents = query.data || [];

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Registrar Documents"
        description="Upload and manage downloadable documents for students."
        action={
          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={uploadMutation.isPending}
            className="flex items-center gap-2 rounded-md bg-[#186a42] px-4 py-2 text-sm font-semibold text-white hover:bg-[#125333] disabled:opacity-50"
          >
            <Plus className="h-4 w-4" />
            {uploadMutation.isPending ? "Uploading..." : "Upload Document"}
          </button>
        }
      />
      <input
        type="file"
        ref={fileInputRef}
        className="hidden"
        onChange={handleFileSelect}
        accept=".pdf,.doc,.docx,.xls,.xlsx,.zip"
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
                Type
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase"
              >
                Size
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
            {query.isLoading ? (
              <tr>
                <td colSpan={5} className="px-6 py-4 text-center text-gray-500">
                  Loading documents...
                </td>
              </tr>
            ) : documents.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-4 text-center text-gray-500">
                  No documents found.
                </td>
              </tr>
            ) : (
              documents.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900">
                    {item.original_name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {item.file_type || "Unknown"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatFileSize(item.file_size)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <AdminBadge status="Published" />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex justify-end gap-3">
                      <a
                        href={item.file_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-gray-400 hover:text-blue-600"
                      >
                        <Download className="h-4 w-4" />
                      </a>
                      <button
                        onClick={() => handleDelete(item)}
                        className="text-gray-400 hover:text-red-600"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
