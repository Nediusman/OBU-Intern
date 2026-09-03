import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/frontend/lib/supabase";
import type { Database } from "@/frontend/lib/database.types";
import { toast } from "sonner";
import { useAuth } from "@/frontend/contexts/AuthContext";

type VacancyRow = Database["public"]["Tables"]["vacancies"]["Row"];
type VacancyInsert = Database["public"]["Tables"]["vacancies"]["Insert"];
type VacancyUpdate = Database["public"]["Tables"]["vacancies"]["Update"];

export function useVacancies() {
  const queryClient = useQueryClient();
  const { currentUser } = useAuth();

  const query = useQuery({
    queryKey: ["admin_vacancies"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("vacancies")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        toast.error("Failed to load vacancies");
        throw error;
      }
      return data;
    },
  });

  const createMutation = useMutation({
    mutationFn: async (newItem: VacancyInsert) => {
      const { data, error } = await supabase
        .from("vacancies")
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
            entity_type: "vacancies",
            entity_id: data.id,
            description: `Created vacancy: ${data.job_title}`,
          },
        ]);
      }

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin_vacancies"] });
      toast.success("Vacancy created successfully");
    },
    onError: (error) => {
      toast.error(`Error creating vacancy: ${error.message}`);
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: VacancyUpdate }) => {
      const { data, error } = await supabase
        .from("vacancies")
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
            entity_type: "vacancies",
            entity_id: data.id,
            description: `Updated vacancy: ${data.job_title}`,
          },
        ]);
      }

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin_vacancies"] });
      toast.success("Vacancy updated successfully");
    },
    onError: (error) => {
      toast.error(`Error updating vacancy: ${error.message}`);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { data: oldData } = await supabase
        .from("vacancies")
        .select("job_title")
        .eq("id", id)
        .single();

      const { error } = await supabase.from("vacancies").delete().eq("id", id);
      if (error) throw error;

      if (currentUser?.id && oldData) {
        await supabase.from("activity_logs").insert([
          {
            user_id: currentUser.id,
            action: "DELETE",
            entity_type: "vacancies",
            entity_id: id,
            description: `Deleted vacancy: ${oldData.job_title}`,
          },
        ]);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin_vacancies"] });
      toast.success("Vacancy deleted successfully");
    },
    onError: (error) => {
      toast.error(`Error deleting vacancy: ${error.message}`);
    },
  });

  return {
    query,
    createMutation,
    updateMutation,
    deleteMutation,
  };
}
