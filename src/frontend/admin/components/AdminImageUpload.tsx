import React, { useRef } from "react";
import { Upload, X, RefreshCw, Loader2, Image as ImageIcon } from "lucide-react";
import { toast } from "sonner";
import { useMedia } from "@/frontend/admin/hooks/useMedia";

interface AdminImageUploadProps {
  label?: string;
  description?: string;
  value?: string | null;
  imageUrl?: string | null;
  onChange: (media: { id: string | null; file_url: string | null } | null) => void;
  disabled?: boolean;
  aspectRatio?: "video" | "square" | "banner";
}

const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif", "image/svg+xml"];
const MAX_SIZE_BYTES = 10 * 1024 * 1024; // 10MB

export function AdminImageUpload({
  label = "Image",
  description = "Supported formats: PNG, JPG, WebP, GIF (Max 10MB)",
  value,
  imageUrl,
  onChange,
  disabled = false,
  aspectRatio = "video",
}: AdminImageUploadProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { uploadMutation } = useMedia();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    // Reset file input value so selecting the same file again triggers change
    e.target.value = "";

    if (!file) return;

    if (!ALLOWED_TYPES.includes(file.type)) {
      toast.error("Unsupported file format. Please upload a JPG, PNG, WebP, or GIF image.");
      return;
    }

    if (file.size > MAX_SIZE_BYTES) {
      toast.error("File is too large. Maximum allowed size is 10MB.");
      return;
    }

    uploadMutation.mutate(file, {
      onSuccess: (media) => {
        onChange({
          id: media.id,
          file_url: media.file_url,
        });
      },
      onError: (err) => {
        toast.error(`Upload failed: ${err.message}`);
      },
    });
  };

  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange({ id: null, file_url: null });
  };

  const handleTriggerUpload = () => {
    if (disabled || uploadMutation.isPending) return;
    fileInputRef.current?.click();
  };

  const aspectClass =
    aspectRatio === "square"
      ? "aspect-square"
      : aspectRatio === "banner"
        ? "aspect-[21/9]"
        : "aspect-video";

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="block text-sm font-medium text-gray-700">{label}</label>
        {description && <span className="text-xs text-gray-500">{description}</span>}
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        disabled={disabled || uploadMutation.isPending}
        onChange={handleFileChange}
      />

      {imageUrl ? (
        <div className="rounded-lg border border-gray-200 bg-gray-50 p-2 space-y-3">
          <div
            className={`relative w-full ${aspectClass} overflow-hidden rounded-md border border-gray-200 bg-gray-100`}
          >
            <img
              src={imageUrl}
              alt={label}
              className="h-full w-full object-cover"
              onError={(e) => {
                // If the image fails to load, gracefully fall back
                (e.target as HTMLImageElement).src =
                  "https://placehold.co/600x400/f3f4f6/9ca3af?text=Image+Unavailable";
              }}
            />
            {uploadMutation.isPending && (
              <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center text-white text-sm">
                <Loader2 className="h-6 w-6 animate-spin mb-2" />
                <span>Uploading replacement...</span>
              </div>
            )}
          </div>

          <div className="flex items-center justify-between gap-2 px-1">
            <button
              type="button"
              onClick={handleTriggerUpload}
              disabled={disabled || uploadMutation.isPending}
              className="inline-flex items-center gap-1.5 rounded-md bg-white px-3 py-1.5 text-xs font-semibold text-gray-700 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 disabled:opacity-50"
            >
              <RefreshCw className="h-3.5 w-3.5 text-gray-500" />
              Replace Image
            </button>

            <button
              type="button"
              onClick={handleRemove}
              disabled={disabled || uploadMutation.isPending}
              className="inline-flex items-center gap-1.5 rounded-md bg-white px-3 py-1.5 text-xs font-semibold text-red-600 shadow-sm ring-1 ring-inset ring-red-200 hover:bg-red-50 disabled:opacity-50"
            >
              <X className="h-3.5 w-3.5 text-red-500" />
              Remove Image
            </button>
          </div>
        </div>
      ) : (
        <div
          onClick={handleTriggerUpload}
          className={`relative flex w-full ${aspectClass} cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 p-6 text-center transition-colors hover:border-[#186a42] hover:bg-gray-100 ${
            disabled ? "cursor-not-allowed opacity-60" : ""
          }`}
        >
          {uploadMutation.isPending ? (
            <div className="flex flex-col items-center justify-center text-gray-500 text-sm">
              <Loader2 className="h-8 w-8 animate-spin text-[#186a42] mb-2" />
              <span>Uploading image...</span>
            </div>
          ) : (
            <>
              <div className="mb-3 rounded-full bg-white p-3 shadow-sm ring-1 ring-gray-200">
                <ImageIcon className="h-6 w-6 text-gray-400" />
              </div>
              <div className="flex items-center gap-1 text-sm font-semibold text-[#186a42]">
                <Upload className="h-4 w-4" />
                <span>Upload / Select Image</span>
              </div>
              <p className="mt-1 text-xs text-gray-500">Click to browse your device</p>
            </>
          )}
        </div>
      )}
    </div>
  );
}
