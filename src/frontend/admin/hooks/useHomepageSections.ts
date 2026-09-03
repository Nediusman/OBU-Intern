import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/frontend/lib/supabase";
import type { Database } from "@/frontend/lib/database.types";
import { toast } from "sonner";

type HomepageSectionRow = Database["public"]["Tables"]["homepage_sections"]["Row"];
type HomepageSectionInsert = Database["public"]["Tables"]["homepage_sections"]["Insert"];
type HomepageSectionUpdate = Database["public"]["Tables"]["homepage_sections"]["Update"];

export function useHomepageSections(sectionType?: string) {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ["admin_homepage_sections", sectionType],
    queryFn: async () => {
      let query = supabase
        .from("homepage_sections")
        .select("*")
        .order("display_order", { ascending: true });
      if (sectionType) {
        query = query.eq("section_type", sectionType);
      }
      const { data, error } = await query;
      if (error) {
        toast.error("Failed to load homepage sections");
        throw error;
      }
      return data;
    },
  });

  const createMutation = useMutation({
    mutationFn: async (newItem: HomepageSectionInsert) => {
      const { data, error } = await supabase
        .from("homepage_sections")
        .insert([newItem])
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin_homepage_sections"] });
      toast.success("Section created successfully");
    },
    onError: (error) => {
      toast.error(`Error creating section: ${error.message}`);
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: HomepageSectionUpdate }) => {
      const { data, error } = await supabase
        .from("homepage_sections")
        .update({
          ...updates,
          updated_at: new Date().toISOString(),
        })
        .eq("id", id)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin_homepage_sections"] });
      toast.success("Section updated successfully");
    },
    onError: (error) => {
      toast.error(`Error updating section: ${error.message}`);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("homepage_sections").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin_homepage_sections"] });
      toast.success("Section deleted successfully");
    },
    onError: (error) => {
      toast.error(`Error deleting section: ${error.message}`);
    },
  });

  return {
    query,
    createMutation,
    updateMutation,
    deleteMutation,
  };
}
