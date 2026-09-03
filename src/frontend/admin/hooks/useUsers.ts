import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/frontend/lib/supabase";
import type { Database } from "@/frontend/lib/database.types";
import { toast } from "sonner";
import { adminCreateUser } from "@/backend/api";

type UserRow = Database["public"]["Tables"]["users"]["Row"];
type RoleRow = Database["public"]["Tables"]["roles"]["Row"];

export function useUsers() {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ["admin_users"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("users")
        .select("*, roles(name)")
        .order("created_at", { ascending: false });

      if (error) {
        toast.error("Failed to load users");
        throw error;
      }
      return data as unknown as (UserRow & { roles: { name: string } | null })[];
    },
  });

  const rolesQuery = useQuery({
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
    mutationFn: async (payload: {
      email: string;
      full_name: string;
      role_id: string;
      is_active: boolean;
      password?: string;
    }) => {
      if (!payload.password) throw new Error("Password is required");

      const res = await adminCreateUser({
        data: {
          email: payload.email,
          password: payload.password,
          full_name: payload.full_name,
          role_id: payload.role_id,
          is_active: payload.is_active,
        },
      });
      if (!res.ok) throw new Error(res.error || "Failed to create user");
      return res;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin_users"] });
      toast.success("User created successfully");
    },
    onError: (error) => {
      toast.error(`Error creating user: ${error.message}`);
    },
  });

  return {
    query,
    rolesQuery,
    createMutation,
  };
}
