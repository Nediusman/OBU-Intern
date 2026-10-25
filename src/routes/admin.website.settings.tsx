import { createFileRoute } from "@tanstack/react-router";
import { AdminPageHeader } from "@/frontend/admin/components/AdminPageHeader";
import { Save, Image as ImageIcon, Loader2, AlertTriangle } from "lucide-react";
import {
  useWebsiteSettings,
  type WebsiteSettings,
} from "@/frontend/admin/hooks/useWebsiteSettings";
import { useMedia } from "@/frontend/admin/hooks/useMedia";
import { useForm } from "react-hook-form";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";

export const Route = createFileRoute("/admin/website/settings")({
  component: SiteSettings,
});

type FormValues = {
  university_name: string;
  website_title: string;
  footer_text: string;
  logo_id: string | null;
  favicon_id: string | null;
  facebook_url: string;
  twitter_url: string;
  linkedin_url: string;
  youtube_url: string;
  telegram_url: string;
  address: string;
  phone: string;
  email: string;
  map_url: string;
  emergency_banner_enabled: string;
  emergency_banner_text: string;
  emergency_banner_link: string;
  president_name: string;
  president_message_image: string;
  president_message_text: string;
};

function SiteSettings() {
  const { query, saveMutation } = useWebsiteSettings();
  const { uploadMutation } = useMedia();

  const [uploadedLogoUrl, setUploadedLogoUrl] = useState<string | null>(null);
  const [uploadedFaviconUrl, setUploadedFaviconUrl] = useState<string | null>(null);
  const [uploadedPresidentUrl, setUploadedPresidentUrl] = useState<string | null>(null);

  const logoInputRef = useRef<HTMLInputElement>(null);
  const faviconInputRef = useRef<HTMLInputElement>(null);
  const presidentInputRef = useRef<HTMLInputElement>(null);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { isSubmitting },
  } = useForm<FormValues>({
    defaultValues: {
      university_name: "",
      website_title: "",
      footer_text: "",
      logo_id: null,
      favicon_id: null,
      facebook_url: "",
      twitter_url: "",
      linkedin_url: "",
      youtube_url: "",
      telegram_url: "",
      address: "",
      phone: "",
      email: "",
      map_url: "",
      emergency_banner_enabled: "false",
      emergency_banner_text: "",
      emergency_banner_link: "",
      president_name: "Dr. Muktar Mohammed",
      president_message_image: "/President.jpeg",
      president_message_text: "",
    },
  });

  useEffect(() => {
    if (query.data) {
      reset({
        university_name: query.data.university_name || "",
        website_title: query.data.website_title || "",
        footer_text: query.data.footer_text || "",
        logo_id: query.data.logo_id || null,
        favicon_id: query.data.favicon_id || null,
        facebook_url: query.data.facebook_url || "",
        twitter_url: query.data.twitter_url || "",
        linkedin_url: query.data.linkedin_url || "",
        youtube_url: query.data.youtube_url || "",
        telegram_url: query.data.telegram_url || "",
        address: query.data.address || "",
        phone: query.data.phone || "",
        email: query.data.email || "",
        map_url: query.data.map_url || "",
        emergency_banner_enabled: query.data.emergency_banner_enabled || "false",
        emergency_banner_text: query.data.emergency_banner_text || "",
        emergency_banner_link: query.data.emergency_banner_link || "",
        president_name: query.data.president_name || "Dr. Muktar Mohammed",
        president_message_image: query.data.president_message_image || "/President.jpeg",
        president_message_text: query.data.president_message_text || "",
      });
      if (query.data["logo_url"]) setUploadedLogoUrl(query.data["logo_url"]);
      if (query.data["favicon_url"]) setUploadedFaviconUrl(query.data["favicon_url"]);
      if (query.data["president_message_image"]) setUploadedPresidentUrl(query.data["president_message_image"]);
    }
  }, [query.data, reset]);

  const onSubmit = async (data: FormValues) => {
    try {
      const submitData: Record<string, string> = {
        ...data,
        logo_id: data.logo_id || "",
        favicon_id: data.favicon_id || "",
        president_message_image: uploadedPresidentUrl || data.president_message_image || "/President.jpeg",
      };
      if (uploadedLogoUrl) submitData["logo_url"] = uploadedLogoUrl;
      if (uploadedFaviconUrl) submitData["favicon_url"] = uploadedFaviconUrl;
      await saveMutation.mutateAsync(submitData);
    } catch (e) {
      // toast is handled in hook
    }
  };

  const handleFileUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
    field: "logo_id" | "favicon_id" | "president_message_image",
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error("File is too large (max 5MB)");
        return;
      }
      try {
        const uploadedMedia = await uploadMutation.mutateAsync(file);
        if (field === "logo_id") {
          setValue(field, uploadedMedia.id, { shouldDirty: true });
          setUploadedLogoUrl(uploadedMedia.file_url);
        } else if (field === "favicon_id") {
          setValue(field, uploadedMedia.id, { shouldDirty: true });
          setUploadedFaviconUrl(uploadedMedia.file_url);
        } else if (field === "president_message_image") {
          setValue(field, uploadedMedia.file_url, { shouldDirty: true });
          setUploadedPresidentUrl(uploadedMedia.file_url);
        }
      } catch (err) {
        // error handled in hook
      }
    }
  };

  const logoUrl =
    uploadedLogoUrl ||
    (query.data as unknown as { logo?: { file_url?: string } })?.logo?.file_url ||
    (query.data as unknown as { logo_url?: string })?.logo_url;
  const faviconUrl =
    uploadedFaviconUrl ||
    (query.data as unknown as { favicon?: { file_url?: string } })?.favicon?.file_url ||
    (query.data as unknown as { favicon_url?: string })?.favicon_url;
  const presidentImageUrl =
    uploadedPresidentUrl ||
    watch("president_message_image") ||
    query.data?.president_message_image ||
    "/President.jpeg";

  if (query.isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-[#186a42]" />
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <AdminPageHeader
        title="Site Settings"
        description="Manage global information and branding for the university website."
        action={
          <button
            type="submit"
            disabled={saveMutation.isPending || isSubmitting}
            className="flex items-center gap-2 rounded-md bg-[#186a42] px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-[#125333] disabled:opacity-50"
          >
            {saveMutation.isPending || isSubmitting ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Save className="h-4 w-4" />
            )}
            Save Settings
          </button>
        }
      />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Branding */}
        <div className="space-y-6">
          <div className="rounded-lg bg-white p-6 shadow-sm ring-1 ring-gray-200">
            <h2 className="mb-4 text-base font-semibold text-gray-900">Branding & General</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  University Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  {...register("university_name")}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#186a42] focus:ring-[#186a42] sm:text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Website Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  {...register("website_title")}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#186a42] focus:ring-[#186a42] sm:text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Footer Text</label>
                <input
                  type="text"
                  {...register("footer_text")}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#186a42] focus:ring-[#186a42] sm:text-sm"
                />
              </div>

              <div className="grid grid-cols-2 gap-4 pt-2">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Logo</label>
                  <input type="hidden" {...register("logo_id")} />
                  <input
                    type="file"
                    ref={logoInputRef}
                    className="hidden"
                    accept="image/*"
                    onChange={(e) => handleFileUpload(e, "logo_id")}
                  />
                  <div
                    onClick={() => logoInputRef.current?.click()}
                    className="flex items-center justify-center h-24 w-full rounded-md border-2 border-dashed border-gray-300 bg-gray-50 hover:bg-gray-100 cursor-pointer overflow-hidden relative group"
                  >
                    {uploadMutation.isPending ? (
                      <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
                    ) : logoUrl ? (
                      <>
                        <img
                          src={logoUrl}
                          alt="Logo preview"
                          className="h-full object-contain p-2"
                        />
                        <div className="absolute inset-0 bg-black/50 hidden group-hover:flex items-center justify-center text-white text-xs font-semibold">
                          Change
                        </div>
                      </>
                    ) : (
                      <div className="text-center">
                        <ImageIcon className="mx-auto h-6 w-6 text-gray-400" />
                        <span className="mt-1 block text-xs text-gray-500">Upload Logo</span>
                      </div>
                    )}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Favicon</label>
                  <input type="hidden" {...register("favicon_id")} />
                  <input
                    type="file"
                    ref={faviconInputRef}
                    className="hidden"
                    accept="image/*"
                    onChange={(e) => handleFileUpload(e, "favicon_id")}
                  />
                  <div
                    onClick={() => faviconInputRef.current?.click()}
                    className="flex items-center justify-center h-24 w-full rounded-md border-2 border-dashed border-gray-300 bg-gray-50 hover:bg-gray-100 cursor-pointer overflow-hidden relative group"
                  >
                    {uploadMutation.isPending ? (
                      <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
                    ) : faviconUrl ? (
                      <>
                        <img
                          src={faviconUrl}
                          alt="Favicon preview"
                          className="h-full object-contain p-2"
                        />
                        <div className="absolute inset-0 bg-black/50 hidden group-hover:flex items-center justify-center text-white text-xs font-semibold">
                          Change
                        </div>
                      </>
                    ) : (
                      <div className="text-center">
                        <ImageIcon className="mx-auto h-6 w-6 text-gray-400" />
                        <span className="mt-1 block text-xs text-gray-500">Upload Favicon</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-lg bg-white p-6 shadow-sm ring-1 ring-gray-200">
            <h2 className="mb-4 text-base font-semibold text-gray-900">Social Media Links</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Facebook URL</label>
                <input
                  type="url"
                  {...register("facebook_url")}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#186a42] focus:ring-[#186a42] sm:text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Twitter/X URL</label>
                <input
                  type="url"
                  {...register("twitter_url")}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#186a42] focus:ring-[#186a42] sm:text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">LinkedIn URL</label>
                <input
                  type="url"
                  {...register("linkedin_url")}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#186a42] focus:ring-[#186a42] sm:text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">YouTube URL</label>
                <input
                  type="url"
                  placeholder="https://youtube.com/..."
                  {...register("youtube_url")}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#186a42] focus:ring-[#186a42] sm:text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Telegram URL</label>
                <input
                  type="url"
                  {...register("telegram_url")}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#186a42] focus:ring-[#186a42] sm:text-sm"
                />
              </div>
            </div>
          </div>

          {/* President's Message & Official Photograph */}
          <div className="rounded-lg bg-white p-6 shadow-sm ring-1 ring-gray-200">
            <h2 className="mb-2 text-base font-semibold text-gray-900">
              President's Message & Photograph
            </h2>
            <p className="text-xs text-gray-500 mb-4 leading-relaxed">
              Manage the university president's name, official portrait photograph, and homepage welcome statement.
            </p>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">President Name</label>
                <input
                  type="text"
                  placeholder="Dr. Muktar Mohammed"
                  {...register("president_name")}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#186a42] focus:ring-[#186a42] sm:text-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">President's Official Photograph</label>
                <p className="text-xs text-gray-400 mb-2">Click below to upload a portrait image or enter a path/URL:</p>
                <input
                  type="text"
                  placeholder="/President.jpeg or image URL"
                  {...register("president_message_image")}
                  className="mb-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#186a42] focus:ring-[#186a42] sm:text-sm font-mono text-xs"
                />
                <input
                  type="file"
                  ref={presidentInputRef}
                  className="hidden"
                  accept="image/*"
                  onChange={(e) => handleFileUpload(e, "president_message_image")}
                />
                <div
                  onClick={() => presidentInputRef.current?.click()}
                  className="flex items-center justify-center h-48 w-full rounded-md border-2 border-dashed border-gray-300 bg-gray-50 hover:bg-gray-100 cursor-pointer overflow-hidden relative group transition-colors"
                >
                  {uploadMutation.isPending ? (
                    <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
                  ) : presidentImageUrl ? (
                    <>
                      <img
                        src={presidentImageUrl}
                        alt="President photo preview"
                        className="h-full w-auto object-cover rounded"
                        onError={(e) => {
                          e.currentTarget.src = "/President.jpeg";
                        }}
                      />
                      <div className="absolute inset-0 bg-black/50 hidden group-hover:flex items-center justify-center text-white text-xs font-semibold">
                        Click to Upload / Change Image
                      </div>
                    </>
                  ) : (
                    <div className="text-center p-4">
                      <ImageIcon className="mx-auto h-8 w-8 text-gray-400" />
                      <span className="mt-1 block text-xs text-gray-500 font-medium">Upload President's Portrait</span>
                    </div>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">President's Message / Biography</label>
                <textarea
                  rows={6}
                  placeholder="Welcome message from the President..."
                  {...register("president_message_text")}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#186a42] focus:ring-[#186a42] sm:text-sm"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Contact */}
        <div className="space-y-6">
          <div className="rounded-lg bg-white p-6 shadow-sm ring-1 ring-gray-200">
            <h2 className="mb-4 text-base font-semibold text-gray-900">Contact Information</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Primary Email</label>
                <input
                  type="email"
                  {...register("email")}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#186a42] focus:ring-[#186a42] sm:text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Phone Number</label>
                <input
                  type="tel"
                  {...register("phone")}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#186a42] focus:ring-[#186a42] sm:text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Physical Address</label>
                <textarea
                  rows={3}
                  {...register("address")}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#186a42] focus:ring-[#186a42] sm:text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Google Maps Embed Link
                </label>
                <input
                  type="text"
                  placeholder="<iframe src='...' />"
                  {...register("map_url")}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#186a42] focus:ring-[#186a42] sm:text-sm"
                />
              </div>
            </div>
          </div>

          {/* Expedited Emergency Notice Broadcast (Policy Section 7.1) */}
          <div className="rounded-lg bg-amber-50/70 p-6 shadow-sm ring-1 ring-amber-300 border border-amber-200">
            <div className="flex items-center gap-2 mb-4 text-amber-900 font-bold">
              <AlertTriangle className="h-5 w-5 text-amber-600" />
              <h2 className="text-base font-semibold">Campus Emergency Notice Banner (Section 7.1)</h2>
            </div>
            <p className="text-xs text-amber-800 mb-4 leading-relaxed">
              Expedited alert broadcast shown prominently across all public pages for closures, security warnings, or urgent university announcements.
            </p>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Banner Activation</label>
                <select
                  {...register("emergency_banner_enabled")}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-amber-600 focus:ring-amber-600 sm:text-sm bg-white p-2 border"
                >
                  <option value="false">Disabled (Normal Operations)</option>
                  <option value="true">Active (Display Alert at Top of Website)</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Alert Notice Text</label>
                <input
                  type="text"
                  placeholder="e.g., Campus closed today due to heavy regional rainfall. Online classes remain active."
                  {...register("emergency_banner_text")}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-amber-600 focus:ring-amber-600 sm:text-sm p-2 border bg-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Link URL (Optional)</label>
                <input
                  type="text"
                  placeholder="/announcements or external announcement link"
                  {...register("emergency_banner_link")}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-amber-600 focus:ring-amber-600 sm:text-sm p-2 border bg-white"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </form>
  );
}
