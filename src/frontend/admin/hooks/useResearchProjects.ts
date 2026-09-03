import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/frontend/lib/supabase";
import type { Database } from "@/frontend/lib/database.types";
import { toast } from "sonner";
import { useAuth } from "@/frontend/contexts/AuthContext";

type ResearchProjectRow = Database["public"]["Tables"]["research_projects"]["Row"];
type ResearchProjectInsert = Database["public"]["Tables"]["research_projects"]["Insert"];
type ResearchProjectUpdate = Database["public"]["Tables"]["research_projects"]["Update"];

export function useResearchProjects() {
  const queryClient = useQueryClient();
  const { currentUser } = useAuth();

  const query = useQuery({
    queryKey: ["admin_research_projects"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("research_projects")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        toast.error("Failed to load research projects");
        throw error;
      }
      return data;
    },
  });

  const createMutation = useMutation({
    mutationFn: async (newItem: ResearchProjectInsert) => {
      const { data, error } = await supabase
        .from("research_projects")
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
            entity_type: "research_projects",
            entity_id: data.id,
            description: `Created research project: ${data.project_title}`,
          },
        ]);
      }

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin_research_projects"] });
      toast.success("Project created successfully");
    },
    onError: (error) => {
      toast.error(`Error creating project: ${error.message}`);
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: ResearchProjectUpdate }) => {
      const { data, error } = await supabase
        .from("research_projects")
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
            entity_type: "research_projects",
            entity_id: data.id,
            description: `Updated research project: ${data.project_title}`,
          },
        ]);
      }

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin_research_projects"] });
      toast.success("Project updated successfully");
    },
    onError: (error) => {
      toast.error(`Error updating project: ${error.message}`);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { data: oldData } = await supabase
        .from("research_projects")
        .select("project_title")
        .eq("id", id)
        .single();

      const { error } = await supabase.from("research_projects").delete().eq("id", id);
      if (error) throw error;

      // Activity Logging
      if (currentUser?.id && oldData) {
        await supabase.from("activity_logs").insert([
          {
            user_id: currentUser.id,
            action: "DELETE",
            entity_type: "research_projects",
            entity_id: id,
            description: `Deleted research project: ${oldData.project_title}`,
          },
        ]);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin_research_projects"] });
      toast.success("Project deleted successfully");
    },
    onError: (error) => {
      toast.error(`Error deleting project: ${error.message}`);
    },
  });

  return {
    query,
    createMutation,
    updateMutation,
    deleteMutation,
  };
}
