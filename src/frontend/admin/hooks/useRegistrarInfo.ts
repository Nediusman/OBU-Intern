import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/frontend/lib/supabase";
import type { Database } from "@/frontend/lib/database.types";
import { toast } from "sonner";
import { useAuth } from "@/frontend/contexts/AuthContext";

type RegistrarInfoRow = Database["public"]["Tables"]["registrar_information"]["Row"];
type RegistrarInfoInsert = Database["public"]["Tables"]["registrar_information"]["Insert"];
type RegistrarInfoUpdate = Database["public"]["Tables"]["registrar_information"]["Update"];

export function useRegistrarInfo() {
  const queryClient = useQueryClient();
  const { currentUser } = useAuth();

  const query = useQuery({
    queryKey: ["admin_registrar_info"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("registrar_information")
        .select("*")
        .order("title", { ascending: true });

      if (error) {
        toast.error("Failed to load registrar information");
        throw error;
      }
      return data;
    },
  });

  const createMutation = useMutation({
    mutationFn: async (newItem: RegistrarInfoInsert) => {
      const { data, error } = await supabase
        .from("registrar_information")
        .insert([
          {
            ...newItem,
            updated_by: currentUser?.id,
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
            entity_type: "registrar_information",
            entity_id: data.id,
            description: `Created registrar info: ${data.title}`,
          },
        ]);
      }

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin_registrar_info"] });
      toast.success("Registrar information created successfully");
    },
    onError: (error) => {
      toast.error(`Error creating registrar info: ${error.message}`);
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: RegistrarInfoUpdate }) => {
      const { data, error } = await supabase
        .from("registrar_information")
        .update({
          ...updates,
          updated_by: currentUser?.id,
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
            entity_type: "registrar_information",
            entity_id: data.id,
            description: `Updated registrar info: ${data.title}`,
          },
        ]);
      }

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin_registrar_info"] });
      toast.success("Registrar information updated successfully");
    },
    onError: (error) => {
      toast.error(`Error updating registrar info: ${error.message}`);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { data: oldData } = await supabase
        .from("registrar_information")
        .select("title")
        .eq("id", id)
        .single();

      const { error } = await supabase.from("registrar_information").delete().eq("id", id);
      if (error) throw error;

      if (currentUser?.id && oldData) {
        await supabase.from("activity_logs").insert([
          {
            user_id: currentUser.id,
            action: "DELETE",
            entity_type: "registrar_information",
            entity_id: id,
            description: `Deleted registrar info: ${oldData.title}`,
          },
        ]);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin_registrar_info"] });
      toast.success("Registrar information deleted successfully");
    },
    onError: (error) => {
      toast.error(`Error deleting registrar info: ${error.message}`);
    },
  });

  return {
    query,
    createMutation,
    updateMutation,
    deleteMutation,
  };
}
