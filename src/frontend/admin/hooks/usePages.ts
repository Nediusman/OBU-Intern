import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/frontend/lib/supabase";
import type { Database } from "@/frontend/lib/database.types";
import { toast } from "sonner";
import { useAuth } from "@/frontend/contexts/AuthContext";

type PageRow = Database["public"]["Tables"]["pages"]["Row"];
type PageInsert = Database["public"]["Tables"]["pages"]["Insert"];
type PageUpdate = Database["public"]["Tables"]["pages"]["Update"];

export function usePages() {
  const queryClient = useQueryClient();
  const { currentUser } = useAuth();

  const query = useQuery({
    queryKey: ["admin_pages"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("pages")
        .select(
          `
          *,
          author:created_by(id, email),
          parent:parent_id(id, title),
          main_image:main_image_id(id, file_url),
          featured_image:featured_image_id(id, file_url)
        `,
        )
        .order("created_at", { ascending: false });

      if (error) {
        toast.error("Failed to load pages");
        throw error;
      }
      return data;
    },
  });

  const createMutation = useMutation({
    mutationFn: async (newItem: PageInsert) => {
      const { data, error } = await supabase
        .from("pages")
        .insert([
          {
            ...newItem,
            created_by: currentUser?.id,
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
            entity_type: "pages",
            entity_id: data.id,
            description: `Created page: ${data.title}`,
          },
        ]);
      }

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin_pages"] });
      toast.success("Page created successfully");
    },
    onError: (error) => {
      toast.error(`Error creating page: ${error.message}`);
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: PageUpdate }) => {
      const { data, error } = await supabase
        .from("pages")
        .update({
          ...updates,
          updated_at: new Date().toISOString(),
        })
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;

      if (currentUser?.id) {
        await supabase.from("activity_logs").insert([
          {
            user_id: currentUser.id,
            action: "UPDATE",
            entity_type: "pages",
            entity_id: data.id,
            description: `Updated page: ${data.title}`,
          },
        ]);
      }

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin_pages"] });
      toast.success("Page updated successfully");
    },
    onError: (error) => {
      toast.error(`Error updating page: ${error.message}`);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { data: oldData } = await supabase.from("pages").select("title").eq("id", id).single();

      const { error } = await supabase.from("pages").delete().eq("id", id);
      if (error) throw error;

      if (currentUser?.id && oldData) {
        await supabase.from("activity_logs").insert([
          {
            user_id: currentUser.id,
            action: "DELETE",
            entity_type: "pages",
            entity_id: id,
            description: `Deleted page: ${oldData.title}`,
          },
        ]);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin_pages"] });
      toast.success("Page deleted successfully");
    },
    onError: (error) => {
      toast.error(`Error deleting page: ${error.message}`);
    },
  });

  return {
    query,
    createMutation,
    updateMutation,
    deleteMutation,
  };
}
