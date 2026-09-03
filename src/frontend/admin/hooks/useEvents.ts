import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/frontend/lib/supabase";
import type { Database } from "@/frontend/lib/database.types";
import { toast } from "sonner";
import { useAuth } from "@/frontend/contexts/AuthContext";

type EventRow = Database["public"]["Tables"]["events"]["Row"];
type EventInsert = Database["public"]["Tables"]["events"]["Insert"];
type EventUpdate = Database["public"]["Tables"]["events"]["Update"];

export type EventWithMedia = Database["public"]["Tables"]["events"]["Row"] & {
  media?: {
    id: string;
    file_url: string;
  } | null;
};

export function useEvents() {
  const queryClient = useQueryClient();
  const { currentUser } = useAuth();

  const query = useQuery({
    queryKey: ["admin_events"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("events")
        .select("*, media:event_image_id(id, file_url)")
        .order("start_date", { ascending: false });

      if (error) {
        toast.error("Failed to load events");
        throw error;
      }
      return (data ?? []) as unknown as EventWithMedia[];
    },
  });

  const createMutation = useMutation({
    mutationFn: async (newItem: EventInsert) => {
      let finalSlug =
        newItem.slug ||
        (newItem.title || "")
          .toLowerCase()
          .replace(/[\s_]+/g, "-")
          .replace(/[^\w-]/g, "");
      if (!finalSlug) finalSlug = "event";
      let isUnique = false;
      let counter = 1;
      const originalSlug = finalSlug;

      while (!isUnique) {
        const { data: existingData, error: checkError } = await supabase
          .from("events")
          .select("id")
          .eq("slug", finalSlug);

        if (checkError) throw checkError;

        if (!existingData || existingData.length === 0) {
          isUnique = true;
        } else {
          counter++;
          finalSlug = `${originalSlug}-${counter}`;
        }
      }

      const { data, error } = await supabase
        .from("events")
        .insert([
          {
            ...newItem,
            slug: finalSlug,
            created_by: currentUser?.id,
          },
        ])
        .select()
        .single();

      if (error) throw error;

      // Activity Logging
      if (currentUser?.id) {
        await supabase.from("activity_logs").insert([
          {
            user_id: currentUser.id,
            action: "CREATE",
            entity_type: "events",
            entity_id: data.id,
            description: `Created event: ${data.title}`,
          },
        ]);
      }

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin_events"] });
      toast.success("Event created successfully");
    },
    onError: (error) => {
      if (error.message.includes("events_slug_key") || error.message.includes("duplicate key")) {
        toast.error("An event with this URL slug already exists. Please choose a unique slug.");
      } else {
        toast.error(`Unable to create event. Database error: ${error.message}`);
      }
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: EventUpdate }) => {
      let finalSlug = updates.slug;

      if (finalSlug) {
        let isUnique = false;
        let counter = 1;
        const originalSlug = finalSlug;

        while (!isUnique) {
          const { data: existingData, error: checkError } = await supabase
            .from("events")
            .select("id")
            .eq("slug", finalSlug);

          if (checkError) throw checkError;

          if (
            !existingData ||
            existingData.length === 0 ||
            (existingData.length === 1 && existingData[0]?.id === id)
          ) {
            isUnique = true;
          } else {
            counter++;
            finalSlug = `${originalSlug}-${counter}`;
          }
        }
        updates.slug = finalSlug;
      }

      const { data, error } = await supabase
        .from("events")
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
            entity_type: "events",
            entity_id: data.id,
            description: `Updated event: ${data.title}`,
          },
        ]);
      }

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin_events"] });
      toast.success("Event updated successfully");
    },
    onError: (error) => {
      if (error.message.includes("events_slug_key") || error.message.includes("duplicate key")) {
        toast.error("An event with this URL slug already exists. Please choose a unique slug.");
      } else {
        toast.error(`Unable to update event. Database error: ${error.message}`);
      }
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { data: oldData } = await supabase.from("events").select("title").eq("id", id).single();

      const { error } = await supabase.from("events").delete().eq("id", id);
      if (error) throw error;

      // Activity Logging
      if (currentUser?.id && oldData) {
        await supabase.from("activity_logs").insert([
          {
            user_id: currentUser.id,
            action: "DELETE",
            entity_type: "events",
            entity_id: id,
            description: `Deleted event: ${oldData.title}`,
          },
        ]);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin_events"] });
      toast.success("Event deleted successfully");
    },
    onError: (error) => {
      toast.error(`Unable to delete event. Database error: ${error.message}`);
    },
  });

  return {
    query,
    createMutation,
    updateMutation,
    deleteMutation,
  };
}
