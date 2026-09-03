import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/frontend/lib/supabase";
import type { Database } from "@/frontend/lib/database.types";
import { toast } from "sonner";
import { useAuth } from "@/frontend/contexts/AuthContext";

type RegistrarAnnouncementRow = Database["public"]["Tables"]["registrar_announcements"]["Row"];
type RegistrarAnnouncementInsert =
  Database["public"]["Tables"]["registrar_announcements"]["Insert"];
type RegistrarAnnouncementUpdate =
  Database["public"]["Tables"]["registrar_announcements"]["Update"];

export function useRegistrarAnnouncements() {
  const queryClient = useQueryClient();
  const { currentUser } = useAuth();

  const query = useQuery({
    queryKey: ["admin_registrar_announcements"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("registrar_announcements")
        .select("*")
        .order("published_at", { ascending: false });

      if (error) {
        toast.error("Failed to load registrar announcements");
        throw error;
      }
      return data;
    },
  });

  const createMutation = useMutation({
    mutationFn: async (newItem: RegistrarAnnouncementInsert) => {
      const { data, error } = await supabase
        .from("registrar_announcements")
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
            entity_type: "registrar_announcements",
            entity_id: data.id,
            description: `Created registrar announcement: ${data.title}`,
          },
        ]);
      }

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin_registrar_announcements"] });
      toast.success("Registrar announcement created successfully");
    },
    onError: (error) => {
      toast.error(`Error creating announcement: ${error.message}`);
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: RegistrarAnnouncementUpdate }) => {
      const { data, error } = await supabase
        .from("registrar_announcements")
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
            entity_type: "registrar_announcements",
            entity_id: data.id,
            description: `Updated registrar announcement: ${data.title}`,
          },
        ]);
      }

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin_registrar_announcements"] });
      toast.success("Registrar announcement updated successfully");
    },
    onError: (error) => {
      toast.error(`Error updating announcement: ${error.message}`);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { data: oldData } = await supabase
        .from("registrar_announcements")
        .select("title")
        .eq("id", id)
        .single();

      const { error } = await supabase.from("registrar_announcements").delete().eq("id", id);
      if (error) throw error;

      if (currentUser?.id && oldData) {
        await supabase.from("activity_logs").insert([
          {
            user_id: currentUser.id,
            action: "DELETE",
            entity_type: "registrar_announcements",
            entity_id: id,
            description: `Deleted registrar announcement: ${oldData.title}`,
          },
        ]);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin_registrar_announcements"] });
      toast.success("Registrar announcement deleted successfully");
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
