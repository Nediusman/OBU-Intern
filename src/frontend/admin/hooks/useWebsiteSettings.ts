import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useRouter } from "@tanstack/react-router";
import { getAdminSettings, adminUpsertSettings } from "@/backend/api";

export interface WebsiteSettings {
  university_name?: string;
  footer_text?: string;
  logo_url?: string;
  favicon_url?: string;
  phone?: string;
  email?: string;
  address?: string;
  map_url?: string;
  facebook_url?: string;
  twitter_url?: string;
  linkedin_url?: string;
  youtube_url?: string;
  telegram_url?: string;
  website_title?: string;
  logo_id?: string;
  favicon_id?: string;
  [key: string]: string | undefined;
}

export function useWebsiteSettings() {
  const queryClient = useQueryClient();
  const router = useRouter();

  const query = useQuery({
    queryKey: ["admin_website_settings"],
    queryFn: async () => {
      try {
        const settings = await getAdminSettings();
        return (settings || {}) as WebsiteSettings;
      } catch (error: unknown) {
        const err = error as Error;
        toast.error("Failed to load website settings");
        throw err;
      }
    },
  });

  const saveMutation = useMutation({
    mutationFn: async (payload: WebsiteSettings) => {
      // Filter out undefined values to match Record<string, string>
      const cleanPayload = Object.fromEntries(
        Object.entries(payload).filter(([_, v]) => v !== undefined),
      ) as Record<string, string>;
      const res = await adminUpsertSettings({ data: cleanPayload });
      return res;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin_website_settings"] });
      toast.success("Website settings saved successfully");
      router.invalidate();
    },
    onError: (error) => {
      toast.error(`Error saving settings: ${error.message}`);
    },
  });

  return {
    query,
    saveMutation,
  };
}
