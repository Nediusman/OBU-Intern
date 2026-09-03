import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/frontend/lib/supabase";
import type { Database } from "@/frontend/lib/database.types";
import { toast } from "sonner";
import { useAuth } from "@/frontend/contexts/AuthContext";

type MediaRow = Database["public"]["Tables"]["media"]["Row"];
type MediaUpdate = Database["public"]["Tables"]["media"]["Update"];

export function useMedia(options?: { folder?: string }) {
  const queryClient = useQueryClient();
  const { currentUser } = useAuth();

  const query = useQuery({
    queryKey: ["admin_media", options?.folder],
    queryFn: async () => {
      let q = supabase.from("media").select("*");

      if (options?.folder) {
        q = q.eq("folder", options.folder);
      }

      const { data, error } = await q.order("created_at", { ascending: false });

      if (error) {
        toast.error("Failed to load media");
        throw error;
      }
      return data;
    },
  });

  const uploadMutation = useMutation({
    mutationFn: async (file: File) => {
      const fileExt = file.name.split(".").pop();
      const fileName = `${Math.random().toString(36).substring(2, 15)}_${Date.now()}.${fileExt}`;
      const filePath = `${fileName}`;

      const { error: uploadError } = await supabase.storage.from("media").upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: urlData } = supabase.storage.from("media").getPublicUrl(filePath);

      const { data, error } = await supabase
        .from("media")
        .insert([
          {
            original_name: file.name,
            file_name: fileName,
            file_url: urlData.publicUrl,
            file_type: file.type,
            file_size: file.size,
            uploaded_by: currentUser?.id,
            folder: options?.folder || null,
          },
        ])
        .select()
        .single();

      if (error) throw error;

      if (currentUser?.id) {
        await supabase.from("activity_logs").insert([
          {
            user_id: currentUser.id,
            action: "CREATE",
            entity_type: "media",
            entity_id: data.id,
            description: `Uploaded media: ${file.name}`,
          },
        ]);
      }

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin_media"] });
      toast.success("File uploaded successfully");
    },
    onError: (error) => {
      toast.error(`Upload failed: ${error.message}`);
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: MediaUpdate }) => {
      const { data, error } = await supabase
        .from("media")
        .update(updates)
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;

      if (currentUser?.id) {
        await supabase.from("activity_logs").insert([
          {
            user_id: currentUser.id,
            action: "UPDATE",
            entity_type: "media",
            entity_id: data.id,
            description: `Updated media: ${data.original_name}`,
          },
        ]);
      }

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin_media"] });
      toast.success("Media updated successfully");
    },
    onError: (error) => {
      toast.error(`Update failed: ${error.message}`);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (media: MediaRow) => {
      // 1. Delete from storage
      const { error: storageError } = await supabase.storage
        .from("media")
        .remove([media.file_name]);

      if (storageError) throw storageError;

      // 2. Delete from DB
      const { error: dbError } = await supabase.from("media").delete().eq("id", media.id);
      if (dbError) throw dbError;

      if (currentUser?.id) {
        await supabase.from("activity_logs").insert([
          {
            user_id: currentUser.id,
            action: "DELETE",
            entity_type: "media",
            entity_id: media.id,
            description: `Deleted media: ${media.original_name}`,
          },
        ]);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin_media"] });
      toast.success("Media deleted successfully");
    },
    onError: (error) => {
      toast.error(`Delete failed: ${error.message}`);
    },
  });

  return {
    query,
    uploadMutation,
    updateMutation,
    deleteMutation,
  };
}
