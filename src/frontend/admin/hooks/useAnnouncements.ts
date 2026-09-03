import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/frontend/lib/supabase";
import type { Database } from "@/frontend/lib/database.types";
import { toast } from "sonner";
import { useAuth } from "@/frontend/contexts/AuthContext";

type AnnouncementRow = Database["public"]["Tables"]["announcements"]["Row"];
type AnnouncementInsert = Database["public"]["Tables"]["announcements"]["Insert"];
type AnnouncementUpdate = Database["public"]["Tables"]["announcements"]["Update"];

export type AnnouncementWithMedia = Database["public"]["Tables"]["announcements"]["Row"] & {
  media?: {
    id: string;
    file_url: string;
  } | null;
};

export function useAnnouncements() {
  const queryClient = useQueryClient();
  const { currentUser } = useAuth();

  const query = useQuery({
    queryKey: ["admin_announcements"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("announcements")
        .select("*, media:main_image_id(id, file_url)")
        .order("published_at", { ascending: false });

      if (error) {
        toast.error("Failed to load announcements");
        throw error;
      }
      return (data ?? []) as unknown as AnnouncementWithMedia[];
    },
  });

  const createMutation = useMutation({
    mutationFn: async (newItem: AnnouncementInsert) => {
      let finalSlug =
        newItem.slug ||
        (newItem.title || "")
          .toLowerCase()
          .replace(/[\s_]+/g, "-")
          .replace(/[^\w-]/g, "");
      if (!finalSlug) finalSlug = "announcement";
      let isUnique = false;
      let counter = 1;
      const originalSlug = finalSlug;

      while (!isUnique) {
        const { data: existingData, error: checkError } = await supabase
          .from("announcements")
          .select("id")
          .eq("slug", finalSlug);

        if (checkError) throw checkError;

        if (!existingData || existingData.length === 0) {
          isUnique = true;
        } else {
          counter++;
          finalSlug = `${originalSlug}-${counter}`;
        }
      }

      const { data, error } = await supabase
        .from("announcements")
        .insert([
          {
            ...newItem,
            slug: finalSlug,
            author_id: currentUser?.id,
          },
        ])
        .select()
        .single();

      if (error) throw error;

      // Activity Logging
      if (currentUser?.id) {
        await supabase.from("activity_logs").insert([
          {
            user_id: currentUser.id,
            action: "CREATE",
            entity_type: "announcements",
            entity_id: data.id,
            description: `Created announcement: ${data.title}`,
          },
        ]);
      }

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin_announcements"] });
      toast.success("Announcement created successfully");
    },
    onError: (error) => {
      if (
        error.message.includes("announcements_slug_key") ||
        error.message.includes("duplicate key")
      ) {
        toast.error(
          "An announcement with this URL slug already exists. Please choose a unique slug.",
        );
      } else {
        toast.error(`Error creating announcement: ${error.message}`);
      }
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: AnnouncementUpdate }) => {
      let finalSlug = updates.slug;

      if (finalSlug) {
        let isUnique = false;
        let counter = 1;
        const originalSlug = finalSlug;

        while (!isUnique) {
          const { data: existingData, error: checkError } = await supabase
            .from("announcements")
            .select("id")
            .eq("slug", finalSlug);

          if (checkError) throw checkError;

          if (
            !existingData ||
            existingData.length === 0 ||
            (existingData.length === 1 && existingData[0]?.id === id)
          ) {
            isUnique = true;
          } else {
            counter++;
            finalSlug = `${originalSlug}-${counter}`;
          }
        }
        updates.slug = finalSlug;
      }

      const { data, error } = await supabase
        .from("announcements")
        .update(updates)
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;

      // Activity Logging
      if (currentUser?.id) {
        await supabase.from("activity_logs").insert([
          {
            user_id: currentUser.id,
            action: "UPDATE",
            entity_type: "announcements",
            entity_id: data.id,
            description: `Updated announcement: ${data.title}`,
          },
        ]);
      }

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin_announcements"] });
      toast.success("Announcement updated successfully");
    },
    onError: (error) => {
      if (
        error.message.includes("announcements_slug_key") ||
        error.message.includes("duplicate key")
      ) {
        toast.error(
          "An announcement with this URL slug already exists. Please choose a unique slug.",
        );
      } else {
        toast.error(`Error updating announcement: ${error.message}`);
      }
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      // Fetch title for logging before deleting
      const { data: oldData } = await supabase
        .from("announcements")
        .select("title")
        .eq("id", id)
        .single();

      const { error } = await supabase.from("announcements").delete().eq("id", id);
      if (error) throw error;

      // Activity Logging
      if (currentUser?.id && oldData) {
        await supabase.from("activity_logs").insert([
          {
            user_id: currentUser.id,
            action: "DELETE",
            entity_type: "announcements",
            entity_id: id,
            description: `Deleted announcement: ${oldData.title}`,
          },
        ]);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin_announcements"] });
      toast.success("Announcement deleted successfully");
    },
    onError: (error) => {
      toast.error(`Error deleting announcement: ${error.message}`);
    },
  });

  return {
    query,
    createMutation,
    updateMutation,
    deleteMutation,
  };
}
