import { createFileRoute } from "@tanstack/react-router";
import { AdminPageHeader } from "@/frontend/admin/components/AdminPageHeader";
import { Save, ImageIcon, Loader2 } from "lucide-react";
import {
  useWebsiteSettings,
  type WebsiteSettings,
} from "@/frontend/admin/hooks/useWebsiteSettings";
import { useState, useEffect, useRef } from "react";
import { useMedia } from "@/frontend/admin/hooks/useMedia";
import { toast } from "sonner";

export const Route = createFileRoute("/admin/system/settings")({
  component: SystemSettings,
});

function SystemSettings() {
  const { query, saveMutation } = useWebsiteSettings();
  const { uploadMutation } = useMedia();
  const [settings, setSettings] = useState<WebsiteSettings>({
    university_name: "Oda Bultum University",
  });

  const logoInputRef = useRef<HTMLInputElement>(null);
  const faviconInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (query.data) {
      setSettings(query.data);
    }
  }, [query.data]);

  const handleSave = () => {
    saveMutation.mutate(settings);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, key: string) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const result = await uploadMutation.mutateAsync(file);
      const idKey = key === "logo_url" ? "logo_id" : "favicon_id";
      setSettings((prev) => ({ ...prev, [key]: result.file_url, [idKey]: result.id }));
      toast.success(`${key === "logo_url" ? "Logo" : "Favicon"} uploaded successfully`);
    } catch (error: unknown) {
      const err = error as Error;
      toast.error(`Upload failed: ${err.message}`);
    }
  };

  if (query.isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="text-sm text-gray-500">Loading settings...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Website Settings"
        description="Manage global university information, contact details, and social links."
        action={
          <button
            onClick={handleSave}
            disabled={saveMutation.isPending}
            className="flex items-center gap-2 rounded-md bg-[#186a42] px-4 py-2 text-sm font-semibold text-white hover:bg-[#125333] disabled:opacity-50"
          >
            {saveMutation.isPending ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Save className="h-4 w-4" />
            )}
            {saveMutation.isPending ? "Saving..." : "Save Configuration"}
          </button>
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Global Identity */}
        <div className="rounded-lg bg-white p-6 shadow-sm ring-1 ring-gray-200">
          <h2 className="mb-4 text-base font-semibold text-gray-900 border-b pb-2">
            Global Identity
          </h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">University Name</label>
              <input
                type="text"
                value={settings.university_name || ""}
                onChange={(e) => setSettings({ ...settings, university_name: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#186a42] focus:ring-[#186a42] sm:text-sm p-2 border"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Footer Text</label>
              <textarea
                rows={2}
                value={settings.footer_text || ""}
                onChange={(e) => setSettings({ ...settings, footer_text: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#186a42] focus:ring-[#186a42] sm:text-sm p-2 border"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Logo</label>
                <div
                  className="flex flex-col items-center justify-center h-32 w-full rounded-md border-2 border-dashed border-gray-300 bg-gray-50 hover:bg-gray-100 cursor-pointer overflow-hidden relative"
                  onClick={() => logoInputRef.current?.click()}
                >
                  {settings.logo_url ? (
                    <img
                      src={settings.logo_url}
                      alt="Logo"
                      className="object-contain h-full w-full p-2"
                    />
                  ) : (
                    <>
                      <ImageIcon className="h-6 w-6 text-gray-400" />
                      <span className="mt-1 text-xs text-gray-500">Change Logo</span>
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
                  className="hidden"
                  ref={logoInputRef}
                  accept="image/*"
                  onChange={(e) => handleFileUpload(e, "logo_url")}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Favicon</label>
                <div
                  className="flex flex-col items-center justify-center h-32 w-full rounded-md border-2 border-dashed border-gray-300 bg-gray-50 hover:bg-gray-100 cursor-pointer overflow-hidden relative"
                  onClick={() => faviconInputRef.current?.click()}
                >
                  {settings.favicon_url ? (
                    <img
                      src={settings.favicon_url}
                      alt="Favicon"
                      className="object-contain h-full w-full p-2"
                    />
                  ) : (
                    <>
                      <ImageIcon className="h-6 w-6 text-gray-400" />
                      <span className="mt-1 text-xs text-gray-500">Change Favicon</span>
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
                  className="hidden"
                  ref={faviconInputRef}
                  accept="image/*"
                  onChange={(e) => handleFileUpload(e, "favicon_url")}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Contact Information */}
        <div className="rounded-lg bg-white p-6 shadow-sm ring-1 ring-gray-200">
          <h2 className="mb-4 text-base font-semibold text-gray-900 border-b pb-2">
            Primary Contact Information
          </h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Main Phone</label>
              <input
                type="text"
                value={settings.phone || ""}
                onChange={(e) => setSettings({ ...settings, phone: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#186a42] focus:ring-[#186a42] sm:text-sm p-2 border"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Main Email</label>
              <input
                type="email"
                value={settings.email || ""}
                onChange={(e) => setSettings({ ...settings, email: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#186a42] focus:ring-[#186a42] sm:text-sm p-2 border"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Main Address</label>
              <textarea
                rows={3}
                value={settings.address || ""}
                onChange={(e) => setSettings({ ...settings, address: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#186a42] focus:ring-[#186a42] sm:text-sm p-2 border"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Google Maps Embed URL
              </label>
              <input
                type="text"
                value={settings.map_url || ""}
                onChange={(e) => setSettings({ ...settings, map_url: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#186a42] focus:ring-[#186a42] sm:text-sm p-2 border"
              />
            </div>
          </div>
        </div>

        {/* Social Media Links */}
        <div className="lg:col-span-2 rounded-lg bg-white p-6 shadow-sm ring-1 ring-gray-200">
          <h2 className="mb-4 text-base font-semibold text-gray-900 border-b pb-2">
            Social Media Links
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Facebook URL</label>
              <input
                type="text"
                value={settings.facebook_url || ""}
                onChange={(e) => setSettings({ ...settings, facebook_url: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#186a42] focus:ring-[#186a42] sm:text-sm p-2 border"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Twitter (X) URL</label>
              <input
                type="text"
                value={settings.twitter_url || ""}
                onChange={(e) => setSettings({ ...settings, twitter_url: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#186a42] focus:ring-[#186a42] sm:text-sm p-2 border"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">LinkedIn URL</label>
              <input
                type="text"
                value={settings.linkedin_url || ""}
                onChange={(e) => setSettings({ ...settings, linkedin_url: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#186a42] focus:ring-[#186a42] sm:text-sm p-2 border"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">YouTube URL</label>
              <input
                type="text"
                value={settings.youtube_url || ""}
                onChange={(e) => setSettings({ ...settings, youtube_url: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#186a42] focus:ring-[#186a42] sm:text-sm p-2 border"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Telegram URL</label>
              <input
                type="text"
                value={settings.telegram_url || ""}
                onChange={(e) => setSettings({ ...settings, telegram_url: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#186a42] focus:ring-[#186a42] sm:text-sm p-2 border"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
