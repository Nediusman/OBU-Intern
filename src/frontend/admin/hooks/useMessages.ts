import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/frontend/lib/supabase";
import type { Database } from "@/frontend/lib/database.types";
import { toast } from "sonner";
import { useAuth } from "@/frontend/contexts/AuthContext";

type MessageRow = Database["public"]["Tables"]["contact_messages"]["Row"];
type MessageUpdate = Database["public"]["Tables"]["contact_messages"]["Update"];

export function useMessages() {
  const queryClient = useQueryClient();
  const { currentUser } = useAuth();

  const query = useQuery({
    queryKey: ["admin_messages"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("contact_messages")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        toast.error("Failed to load messages");
        throw error;
      }
      return data;
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: MessageUpdate }) => {
      const { data, error } = await supabase
        .from("contact_messages")
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
            entity_type: "contact_messages",
            entity_id: data.id,
            description: `Updated message status from ${data.email}`,
          },
        ]);
      }

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin_messages"] });
      toast.success("Message status updated");
    },
    onError: (error) => {
      toast.error(`Error updating message: ${error.message}`);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { data: oldData } = await supabase
        .from("contact_messages")
        .select("email")
        .eq("id", id)
        .single();

      const { error } = await supabase.from("contact_messages").delete().eq("id", id);
      if (error) throw error;

      // Activity Logging
      if (currentUser?.id && oldData) {
        await supabase.from("activity_logs").insert([
          {
            user_id: currentUser.id,
            action: "DELETE",
            entity_type: "contact_messages",
            entity_id: id,
            description: `Deleted message from: ${oldData.email}`,
          },
        ]);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin_messages"] });
      toast.success("Message deleted");
    },
    onError: (error) => {
      toast.error(`Error deleting message: ${error.message}`);
    },
  });

  return {
    query,
    updateMutation,
    deleteMutation,
  };
}
