import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/frontend/lib/supabase";
import type { Database } from "@/frontend/lib/database.types";
import { toast } from "sonner";
import { useAuth } from "@/frontend/contexts/AuthContext";

type RoleRow = Database["public"]["Tables"]["roles"]["Row"];
type RoleInsert = Database["public"]["Tables"]["roles"]["Insert"];

export function useRoles() {
  const queryClient = useQueryClient();
  const { currentUser } = useAuth();

  const query = useQuery({
    queryKey: ["admin_roles"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("roles")
        .select("*")
        .order("name", { ascending: true });

      if (error) {
        toast.error("Failed to load roles");
        throw error;
      }
      return data as RoleRow[];
    },
  });

  const createMutation = useMutation({
    mutationFn: async (newItem: RoleInsert) => {
      const { data, error } = await supabase.from("roles").insert([newItem]).select().single();

      if (error) throw error;

      // Activity Logging
      if (currentUser?.id) {
        await supabase.from("activity_logs").insert([
          {
            user_id: currentUser.id,
            action: "CREATE",
            entity_type: "roles",
            entity_id: data.id,
            description: `Created role: ${data.name}`,
          },
        ]);
      }

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin_roles"] });
      toast.success("Role created successfully");
    },
    onError: (error) => {
      toast.error(`Error creating role: ${error.message}`);
    },
  });

  return {
    query,
    createMutation,
  };
}
