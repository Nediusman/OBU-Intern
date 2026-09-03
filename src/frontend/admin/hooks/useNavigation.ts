import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/frontend/lib/supabase";
import type { Database } from "@/frontend/lib/database.types";
import { toast } from "sonner";
import { useAuth } from "@/frontend/contexts/AuthContext";

type NavigationItemRow = Database["public"]["Tables"]["navigation_items"]["Row"];
type NavigationItemInsert = Database["public"]["Tables"]["navigation_items"]["Insert"];
type NavigationItemUpdate = Database["public"]["Tables"]["navigation_items"]["Update"];

export function useNavigation(menu: string = "main") {
  const queryClient = useQueryClient();
  const { currentUser } = useAuth();

  const query = useQuery({
    queryKey: ["admin_navigation", menu],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("navigation_items")
        .select(
          `
          *,
          pages(id, title, slug)
        `,
        )
        .eq("menu", menu)
        .order("display_order", { ascending: true });

      if (error) {
        toast.error("Failed to load navigation");
        throw error;
      }
      return data;
    },
  });

  const createMutation = useMutation({
    mutationFn: async (newItem: NavigationItemInsert) => {
      const { data, error } = await supabase
        .from("navigation_items")
        .insert([newItem])
        .select()
        .single();

      if (error) throw error;

      if (currentUser?.id) {
        await supabase.from("activity_logs").insert([
          {
            user_id: currentUser.id,
            action: "CREATE",
            entity_type: "navigation_items",
            entity_id: data.id,
            description: `Created navigation item: ${data.label}`,
          },
        ]);
      }

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin_navigation"] });
      toast.success("Navigation item created successfully");
    },
    onError: (error) => {
      toast.error(`Error creating navigation item: ${error.message}`);
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: NavigationItemUpdate }) => {
      const { data, error } = await supabase
        .from("navigation_items")
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
            entity_type: "navigation_items",
            entity_id: data.id,
            description: `Updated navigation item: ${data.label}`,
          },
        ]);
      }

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin_navigation"] });
      toast.success("Navigation item updated successfully");
    },
    onError: (error) => {
      toast.error(`Error updating navigation item: ${error.message}`);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { data: oldData } = await supabase
        .from("navigation_items")
        .select("label")
        .eq("id", id)
        .single();

      const { error } = await supabase.from("navigation_items").delete().eq("id", id);
      if (error) throw error;

      if (currentUser?.id && oldData) {
        await supabase.from("activity_logs").insert([
          {
            user_id: currentUser.id,
            action: "DELETE",
            entity_type: "navigation_items",
            entity_id: id,
            description: `Deleted navigation item: ${oldData.label}`,
          },
        ]);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin_navigation"] });
      toast.success("Navigation item deleted successfully");
    },
    onError: (error) => {
      toast.error(`Error deleting navigation item: ${error.message}`);
    },
  });

  return {
    query,
    createMutation,
    updateMutation,
    deleteMutation,
  };
}
