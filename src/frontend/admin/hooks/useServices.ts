import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/frontend/lib/supabase";
import type { Database } from "@/frontend/lib/database.types";
import { toast } from "sonner";
import { useAuth } from "@/frontend/contexts/AuthContext";

type ServiceRow = Database["public"]["Tables"]["services"]["Row"];
type ServiceInsert = Database["public"]["Tables"]["services"]["Insert"];
type ServiceUpdate = Database["public"]["Tables"]["services"]["Update"];

export type ServiceWithMedia = Database["public"]["Tables"]["services"]["Row"] & {
  slug?: string;
  main_image_id?: string | null;
  media?: {
    id: string;
    file_url: string;
  } | null;
};

export function useServices() {
  const queryClient = useQueryClient();
  const { currentUser } = useAuth();

  const query = useQuery({
    queryKey: ["admin_services"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("services")
        .select("*, media:main_image_id(id, file_url)")
        .order("display_order", { ascending: true })
        .order("created_at", { ascending: false });

      if (error) {
        toast.error("Failed to load services");
        throw error;
      }
      return (data ?? []) as unknown as ServiceWithMedia[];
    },
  });

  const createMutation = useMutation({
    mutationFn: async (newItem: ServiceInsert) => {
      const { data, error } = await supabase
        .from("services")
        .insert([
          {
            ...newItem,
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
            entity_type: "services",
            entity_id: data.id,
            description: `Created service: ${data.service_name}`,
          },
        ]);
      }

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin_services"] });
      toast.success("Service created successfully");
    },
    onError: (error: Error) => {
      if (
        error.message.includes("services_slug_key") ||
        (error.message.includes("duplicate key") && error.message.includes("slug"))
      ) {
        toast.error("This service slug already exists. Please choose a unique slug.");
      } else {
        toast.error(`Error creating service: ${error.message}`);
      }
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: ServiceUpdate }) => {
      const { data, error } = await supabase
        .from("services")
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
            entity_type: "services",
            entity_id: data.id,
            description: `Updated service: ${data.service_name}`,
          },
        ]);
      }

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin_services"] });
      toast.success("Service updated successfully");
    },
    onError: (error: Error) => {
      if (
        error.message.includes("services_slug_key") ||
        (error.message.includes("duplicate key") && error.message.includes("slug"))
      ) {
        toast.error("This service slug already exists. Please choose a unique slug.");
      } else {
        toast.error(`Error updating service: ${error.message}`);
      }
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { data: oldData } = await supabase
        .from("services")
        .select("service_name")
        .eq("id", id)
        .single();

      const { error } = await supabase.from("services").delete().eq("id", id);
      if (error) throw error;

      if (currentUser?.id && oldData) {
        await supabase.from("activity_logs").insert([
          {
            user_id: currentUser.id,
            action: "DELETE",
            entity_type: "services",
            entity_id: id,
            description: `Deleted service: ${oldData.service_name}`,
          },
        ]);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin_services"] });
      toast.success("Service deleted successfully");
    },
    onError: (error) => {
      toast.error(`Error deleting service: ${error.message}`);
    },
  });

  return {
    query,
    createMutation,
    updateMutation,
    deleteMutation,
  };
}
