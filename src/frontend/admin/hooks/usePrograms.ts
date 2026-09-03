import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/frontend/lib/supabase";
import type { Database } from "@/frontend/lib/database.types";
import { toast } from "sonner";
import { useAuth } from "@/frontend/contexts/AuthContext";

type ProgramRow = Database["public"]["Tables"]["programs"]["Row"];
type ProgramInsert = Database["public"]["Tables"]["programs"]["Insert"];
type ProgramUpdate = Database["public"]["Tables"]["programs"]["Update"];

export type ProgramWithMedia = ProgramRow & {
  media?: { id: string; file_url: string } | null;
  academic_units?: { id: string; name: string } | null;
};

export function usePrograms() {
  const queryClient = useQueryClient();
  const { currentUser } = useAuth();

  const query = useQuery({
    queryKey: ["admin_programs"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("programs")
        .select(
          `
          *,
          academic_units(id, name),
          media:main_image_id(id, file_url)
        `,
        )
        .order("name", { ascending: true });

      if (error) {
        toast.error("Failed to load programs");
        throw error;
      }
      return data as unknown as ProgramWithMedia[];
    },
  });

  const createMutation = useMutation({
    mutationFn: async (newItem: ProgramInsert) => {
      const { data, error } = await supabase
        .from("programs")
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
            entity_type: "programs",
            entity_id: data.id,
            description: `Created program: ${data.name}`,
          },
        ]);
      }

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin_programs"] });
      toast.success("Program created successfully");
    },
    onError: (error) => {
      toast.error(`Error creating program: ${error.message}`);
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: ProgramUpdate }) => {
      const { data, error } = await supabase
        .from("programs")
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
            entity_type: "programs",
            entity_id: data.id,
            description: `Updated program: ${data.name}`,
          },
        ]);
      }

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin_programs"] });
      toast.success("Program updated successfully");
    },
    onError: (error) => {
      toast.error(`Error updating program: ${error.message}`);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { data: oldData } = await supabase
        .from("programs")
        .select("name")
        .eq("id", id)
        .single();

      const { error } = await supabase.from("programs").delete().eq("id", id);
      if (error) throw error;

      if (currentUser?.id && oldData) {
        await supabase.from("activity_logs").insert([
          {
            user_id: currentUser.id,
            action: "DELETE",
            entity_type: "programs",
            entity_id: id,
            description: `Deleted program: ${oldData.name}`,
          },
        ]);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin_programs"] });
      toast.success("Program deleted successfully");
    },
    onError: (error) => {
      toast.error(`Error deleting program: ${error.message}`);
    },
  });

  return {
    query,
    createMutation,
    updateMutation,
    deleteMutation,
  };
}
