import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/frontend/lib/supabase";

export function useDashboardStats() {
  return useQuery({
    queryKey: ["admin_dashboard_stats"],
    queryFn: async () => {
      // Execute all count queries in parallel
      const [
        pagesRes,
        newsRes,
        vacanciesRes,
        announcementsRes,
        eventsRes,
        researchRes,
        mediaRes,
        draftPagesRes,
        unreadMessagesRes,
        activityLogsRes,
      ] = await Promise.all([
        supabase.from("pages").select("*", { count: "exact", head: true }),
        supabase.from("news").select("*", { count: "exact", head: true }),
        supabase.from("vacancies").select("*", { count: "exact", head: true }),
        supabase.from("announcements").select("*", { count: "exact", head: true }),
        supabase.from("events").select("*", { count: "exact", head: true }),
        supabase.from("research_projects").select("*", { count: "exact", head: true }),
        supabase.from("media").select("*", { count: "exact", head: true }),
        supabase.from("pages").select("*", { count: "exact", head: true }).eq("status", "draft"),
        supabase
          .from("contact_messages")
          .select("*", { count: "exact", head: true })
          .eq("status", "unread"),
        supabase
          .from("activity_logs")
          .select("*, user:users(full_name)")
          .order("created_at", { ascending: false })
          .limit(6),
      ]);

      return {
        counts: {
          pages: pagesRes.count || 0,
          news: newsRes.count || 0,
          vacancies: vacanciesRes.count || 0,
          announcements: announcementsRes.count || 0,
          events: eventsRes.count || 0,
          research_projects: researchRes.count || 0,
          media: mediaRes.count || 0,
        },
        pending: {
          draftPages: draftPagesRes.count || 0,
          unreadMessages: unreadMessagesRes.count || 0,
        },
        recentActivity: activityLogsRes.data || [],
      };
    },
  });
}
