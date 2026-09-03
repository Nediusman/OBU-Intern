import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/frontend/lib/supabase";
import type { Database } from "@/frontend/lib/database.types";
import { toast } from "sonner";
import { useAuth } from "@/frontend/contexts/AuthContext";

type NewsRow = Database["public"]["Tables"]["news"]["Row"];
type NewsInsert = Database["public"]["Tables"]["news"]["Insert"];
type NewsUpdate = Database["public"]["Tables"]["news"]["Update"];

export type NewsWithMedia = Database["public"]["Tables"]["news"]["Row"] & {
  media?: {
    id: string;
    file_url: string;
  } | null;
};

export function useNews() {
  const queryClient = useQueryClient();
  const { currentUser } = useAuth();

  const query = useQuery({
    queryKey: ["admin_news"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("news")
        .select("*, media:featured_image_id(id, file_url)")
        .order("published_at", { ascending: false });

      if (error) {
        toast.error("Failed to load news");
        throw error;
      }
      return (data ?? []) as unknown as NewsWithMedia[];
    },
  });

  const createMutation = useMutation({
    mutationFn: async (newItem: NewsInsert) => {
      let finalSlug = newItem.slug || "";
      let isUnique = false;
      let counter = 1;
      const originalSlug = finalSlug;

      while (!isUnique) {
        const { data: existingData, error: checkError } = await supabase
          .from("news")
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
        .from("news")
        .insert([
          {
            ...newItem,
            slug: finalSlug,
            author: currentUser?.full_name || currentUser?.email || "Unknown Author",
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
            entity_type: "news",
            entity_id: data.id,
            description: `Created news article: ${data.title}`,
          },
        ]);
      }

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin_news"] });
      toast.success("News article created successfully");
    },
    onError: (error) => {
      toast.error(`Unable to create news. Database error: ${error.message}`);
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: NewsUpdate }) => {
      let finalSlug = updates.slug;

      if (finalSlug) {
        let isUnique = false;
        let counter = 1;
        const originalSlug = finalSlug;

        while (!isUnique) {
          const { data: existingData, error: checkError } = await supabase
            .from("news")
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
        .from("news")
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
            entity_type: "news",
            entity_id: data.id,
            description: `Updated news article: ${data.title}`,
          },
        ]);
      }

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin_news"] });
      toast.success("News article updated successfully");
    },
    onError: (error) => {
      toast.error(`Unable to update news. Database error: ${error.message}`);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      // Fetch title for logging before deleting
      const { data: oldData } = await supabase.from("news").select("title").eq("id", id).single();

      const { error } = await supabase.from("news").delete().eq("id", id);
      if (error) throw error;

      // Activity Logging
      if (currentUser?.id && oldData) {
        await supabase.from("activity_logs").insert([
          {
            user_id: currentUser.id,
            action: "DELETE",
            entity_type: "news",
            entity_id: id,
            description: `Deleted news article: ${oldData.title}`,
          },
        ]);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin_news"] });
      toast.success("News article deleted successfully");
    },
    onError: (error) => {
      toast.error(`Unable to delete news. Database error: ${error.message}`);
    },
  });

  return {
    query,
    createMutation,
    updateMutation,
    deleteMutation,
  };
}
