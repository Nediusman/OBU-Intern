import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/frontend/lib/supabase";
import type { Database } from "@/frontend/lib/database.types";
import { toast } from "sonner";
import { useAuth } from "@/frontend/contexts/AuthContext";
import { generateSlug } from "@/frontend/lib/utils";

type GalleryRow = Database["public"]["Tables"]["galleries"]["Row"];
type GalleryInsert = Database["public"]["Tables"]["galleries"]["Insert"];
type GalleryUpdate = Database["public"]["Tables"]["galleries"]["Update"];
type GalleryImageInsert = Database["public"]["Tables"]["gallery_images"]["Insert"];

export type GalleryImageWithMedia = Database["public"]["Tables"]["gallery_images"]["Row"] & {
  media: { file_url: string; file_name: string } | null;
};

export type GalleryWithMedia = Database["public"]["Tables"]["galleries"]["Row"] & {
  gallery_images: { count: number }[];
  media: { file_url: string } | null;
};

export function useGalleries() {
  const queryClient = useQueryClient();
  const { currentUser } = useAuth();

  const getUniqueSlug = async (baseSlug: string, excludeId?: string): Promise<string> => {
    let cleanBase = generateSlug(baseSlug) || "gallery";
    let candidate = cleanBase;
    let counter = 1;

    while (true) {
      let query = supabase.from("galleries").select("id").eq("slug", candidate);
      if (excludeId) {
        query = query.neq("id", excludeId);
      }
      const { data, error } = await query;
      if (error || !data || data.length === 0) {
        return candidate;
      }
      counter++;
      candidate = `${cleanBase}-${counter}`;
    }
  };

  const query = useQuery({
    queryKey: ["admin_galleries"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("galleries")
        .select("*, gallery_images(count), media(*)")
        .order("created_at", { ascending: false });

      if (error) {
        toast.error("Failed to load galleries");
        throw error;
      }
      return data as unknown as GalleryWithMedia[];
    },
  });

  const createMutation = useMutation({
    mutationFn: async (newItem: GalleryInsert) => {
      const baseSlug = newItem.slug || generateSlug(newItem.title || "gallery") || "gallery";
      const uniqueSlug = await getUniqueSlug(baseSlug);
      const { data, error } = await supabase
        .from("galleries")
        .insert([{ ...newItem, slug: uniqueSlug, created_by: currentUser?.id }])
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin_galleries"] });
      toast.success("Gallery created successfully");
    },
    onError: (error) => toast.error(`Error creating gallery: ${error.message}`),
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: GalleryUpdate }) => {
      const payload = { ...updates };
      if (updates.slug) {
        payload.slug = await getUniqueSlug(updates.slug, id);
      }
      const { data, error } = await supabase
        .from("galleries")
        .update(payload)
        .eq("id", id)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin_galleries"] });
      toast.success("Gallery updated successfully");
    },
    onError: (error) => toast.error(`Error updating gallery: ${error.message}`),
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("galleries").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin_galleries"] });
      toast.success("Gallery deleted successfully");
    },
    onError: (error) => toast.error(`Error deleting gallery: ${error.message}`),
  });

  const useGalleryImagesQuery = (galleryId: string) =>
    useQuery({
      queryKey: ["admin_gallery_images", galleryId],
      queryFn: async () => {
        if (!galleryId) return [];
        const { data, error } = await supabase
          .from("gallery_images")
          .select("*, media(file_url, file_name)")
          .eq("gallery_id", galleryId)
          .order("display_order", { ascending: true });
        if (error) throw error;
        return data as unknown as GalleryImageWithMedia[];
      },
      enabled: !!galleryId,
    });

  const addImageMutation = useMutation({
    mutationFn: async (payload: GalleryImageInsert) => {
      const { data, error } = await supabase
        .from("gallery_images")
        .insert([payload])
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["admin_gallery_images", variables.gallery_id] });
    },
    onError: (error) => toast.error(`Error adding image: ${error.message}`),
  });

  const updateImageOrderMutation = useMutation({
    mutationFn: async ({ updates }: { updates: { id: string; display_order: number }[] }) => {
      for (const update of updates) {
        await supabase
          .from("gallery_images")
          .update({ display_order: update.display_order })
          .eq("id", update.id);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin_gallery_images"] });
    },
  });

  const deleteImageMutation = useMutation({
    mutationFn: async ({ id }: { id: string }) => {
      const { error } = await supabase.from("gallery_images").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin_gallery_images"] });
    },
    onError: (error) => toast.error(`Error deleting image: ${error.message}`),
  });

  return {
    query,
    createMutation,
    updateMutation,
    deleteMutation,
    useGalleryImagesQuery,
    addImageMutation,
    updateImageOrderMutation,
    deleteImageMutation,
  };
}
