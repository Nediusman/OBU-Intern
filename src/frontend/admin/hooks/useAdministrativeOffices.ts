import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useAuth } from "@/frontend/contexts/AuthContext";
import { supabase } from "@/frontend/lib/supabase";
import type { Database } from "@/frontend/lib/database.types";

type AdministrativeOfficeInsert = Database["public"]["Tables"]["administrative_offices"]["Insert"];
type AdministrativeOfficeUpdate = Database["public"]["Tables"]["administrative_offices"]["Update"];

export type AdministrativeOfficeWithMedia =
  Database["public"]["Tables"]["administrative_offices"]["Row"] & {
    slug?: string;
    main_image_id?: string | null;
    media?: {
      id: string;
      file_url: string;
    } | null;
  };

export function useAdministrativeOffices() {
  const queryClient = useQueryClient();
  const { currentUser } = useAuth();

  const query = useQuery({
    queryKey: ["admin_administrative_offices"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("administrative_offices")
        .select("*, media:main_image_id(id, file_url)")
        .order("display_order", { ascending: true })
        .order("created_at", { ascending: false });
      if (error) throw error;
      return (data ?? []) as unknown as AdministrativeOfficeWithMedia[];
    },
  });

  const logActivity = async (action: "CREATE" | "UPDATE" | "DELETE", id: string, name: string) => {
    if (!currentUser?.id) return;
    await supabase.from("activity_logs").insert({
      user_id: currentUser.id,
      action,
      entity_type: "administrative_offices",
      entity_id: id,
      description: `${action === "CREATE" ? "Created" : action === "UPDATE" ? "Updated" : "Deleted"} administrative office: ${name}`,
    });
  };

  const createMutation = useMutation({
    mutationFn: async (office: AdministrativeOfficeInsert) => {
      const { data, error } = await supabase
        .from("administrative_offices")
        .insert(office)
        .select()
        .single();
      if (error) throw error;
      await logActivity("CREATE", data.id, data.office_name);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin_administrative_offices"] });
      toast.success("Administrative office created");
    },
    onError: (error: Error) => {
      if (
        error.message.includes("administrative_offices_slug_key") ||
        (error.message.includes("duplicate key") && error.message.includes("slug"))
      ) {
        toast.error("An administrative office with this URL slug already exists.");
      } else {
        toast.error(`Unable to create office: ${error.message}`);
      }
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: AdministrativeOfficeUpdate }) => {
      const { data, error } = await supabase
        .from("administrative_offices")
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq("id", id)
        .select()
        .single();
      if (error) throw error;
      await logActivity("UPDATE", data.id, data.office_name);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin_administrative_offices"] });
      toast.success("Administrative office updated");
    },
    onError: (error: Error) => {
      if (
        error.message.includes("administrative_offices_slug_key") ||
        (error.message.includes("duplicate key") && error.message.includes("slug"))
      ) {
        toast.error("An administrative office with this URL slug already exists.");
      } else {
        toast.error(`Unable to update office: ${error.message}`);
      }
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { data: office, error: readError } = await supabase
        .from("administrative_offices")
        .select("office_name")
        .eq("id", id)
        .single();
      if (readError) throw readError;
      const { error } = await supabase.from("administrative_offices").delete().eq("id", id);
      if (error) throw error;
      await logActivity("DELETE", id, office.office_name);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin_administrative_offices"] });
      toast.success("Administrative office deleted");
    },
    onError: (error: Error) => toast.error(`Unable to delete office: ${error.message}`),
  });

  return { query, createMutation, updateMutation, deleteMutation };
}
