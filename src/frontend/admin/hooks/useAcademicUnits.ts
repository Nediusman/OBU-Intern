import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/frontend/lib/supabase";
import type { Database } from "@/frontend/lib/database.types";
import { toast } from "sonner";
import { useAuth } from "@/frontend/contexts/AuthContext";

type AcademicUnitRow = Database["public"]["Tables"]["academic_units"]["Row"];
type AcademicUnitInsert = Database["public"]["Tables"]["academic_units"]["Insert"];
type AcademicUnitUpdate = Database["public"]["Tables"]["academic_units"]["Update"];

export type AcademicUnitWithMedia = AcademicUnitRow & {
  media?: { id: string; file_url: string } | null;
  academic_units?: { id: string; name: string } | null;
};

export function useAcademicUnits(unitType?: string | string[]) {
  const queryClient = useQueryClient();
  const { currentUser } = useAuth();

  const query = useQuery({
    queryKey: ["admin_academic_units", unitType],
    queryFn: async () => {
      let q = supabase
        .from("academic_units")
        .select(
          `
          *,
          academic_units!parent_id(id, name),
          media:main_image_id(id, file_url)
        `,
        )
        .order("name", { ascending: true });

      if (unitType) {
        if (Array.isArray(unitType)) {
          q = q.in("unit_type", unitType);
        } else {
          q = q.eq("unit_type", unitType);
        }
      }

      const { data, error } = await q;

      if (error) {
        toast.error("Failed to load academic units");
        throw error;
      }
      return data as unknown as AcademicUnitWithMedia[];
    },
  });

  const createMutation = useMutation({
    mutationFn: async (newItem: AcademicUnitInsert) => {
      const { data, error } = await supabase
        .from("academic_units")
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
            entity_type: "academic_units",
            entity_id: data.id,
            description: `Created academic unit: ${data.name}`,
          },
        ]);
      }

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin_academic_units"] });
      toast.success("Academic unit created successfully");
    },
    onError: (error) => {
      toast.error(`Error creating unit: ${error.message}`);
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: AcademicUnitUpdate }) => {
      const { data, error } = await supabase
        .from("academic_units")
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
            entity_type: "academic_units",
            entity_id: data.id,
            description: `Updated academic unit: ${data.name}`,
          },
        ]);
      }

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin_academic_units"] });
      toast.success("Academic unit updated successfully");
    },
    onError: (error) => {
      toast.error(`Error updating unit: ${error.message}`);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { data: oldData } = await supabase
        .from("academic_units")
        .select("name")
        .eq("id", id)
        .single();

      const { error } = await supabase.from("academic_units").delete().eq("id", id);
      if (error) throw error;

      if (currentUser?.id && oldData) {
        await supabase.from("activity_logs").insert([
          {
            user_id: currentUser.id,
            action: "DELETE",
            entity_type: "academic_units",
            entity_id: id,
            description: `Deleted academic unit: ${oldData.name}`,
          },
        ]);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin_academic_units"] });
      toast.success("Academic unit deleted successfully");
    },
    onError: (error) => {
      toast.error(`Error deleting unit: ${error.message}`);
    },
  });

  return {
    query,
    createMutation,
    updateMutation,
    deleteMutation,
  };
}
