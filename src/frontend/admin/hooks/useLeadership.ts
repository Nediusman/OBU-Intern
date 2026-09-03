import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/frontend/lib/supabase";
import type { Database } from "@/frontend/lib/database.types";
import { toast } from "sonner";
import { useAuth } from "@/frontend/contexts/AuthContext";

type LeadershipRow = Database["public"]["Tables"]["leadership"]["Row"];
type LeadershipInsert = Database["public"]["Tables"]["leadership"]["Insert"];
type LeadershipUpdate = Database["public"]["Tables"]["leadership"]["Update"];

export function useLeadership() {
  const queryClient = useQueryClient();
  const { currentUser } = useAuth();

  const query = useQuery({
    queryKey: ["admin_leadership"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("leadership")
        .select("*, media:profile_image_id(file_url)")
        .order("display_order", { ascending: true })
        .order("created_at", { ascending: false });

      if (error) {
        toast.error("Failed to load leadership profiles");
        throw error;
      }
      return data;
    },
  });

  const createMutation = useMutation({
    mutationFn: async (newItem: LeadershipInsert) => {
      const { data, error } = await supabase
        .from("leadership")
        .insert([{ ...newItem }])
        .select()
        .single();

      if (error) throw error;

      // Activity Logging
      if (currentUser?.id) {
        await supabase.from("activity_logs").insert([
          {
            user_id: currentUser.id,
            action: "CREATE",
            entity_type: "leadership",
            entity_id: data.id,
            description: `Created leadership profile: ${data.full_name}`,
          },
        ]);
      }

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin_leadership"] });
      toast.success("Leadership profile created");
    },
    onError: (error) => {
      toast.error(`Error creating profile: ${error.message}`);
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: LeadershipUpdate }) => {
      const { data, error } = await supabase
        .from("leadership")
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
            entity_type: "leadership",
            entity_id: data.id,
            description: `Updated leadership profile: ${data.full_name}`,
          },
        ]);
      }

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin_leadership"] });
      toast.success("Leadership profile updated");
    },
    onError: (error) => {
      toast.error(`Error updating profile: ${error.message}`);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { data: oldData } = await supabase
        .from("leadership")
        .select("full_name")
        .eq("id", id)
        .single();

      const { error } = await supabase.from("leadership").delete().eq("id", id);
      if (error) throw error;

      // Activity Logging
      if (currentUser?.id && oldData) {
        await supabase.from("activity_logs").insert([
          {
            user_id: currentUser.id,
            action: "DELETE",
            entity_type: "leadership",
            entity_id: id,
            description: `Deleted leadership profile: ${oldData.full_name}`,
          },
        ]);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin_leadership"] });
      toast.success("Leadership profile deleted");
    },
    onError: (error) => {
      toast.error(`Error deleting profile: ${error.message}`);
    },
  });

  return {
    query,
    createMutation,
    updateMutation,
    deleteMutation,
  };
}
