import {
  getUsers,
  setUsers,
  getAnalytics,
  setAnalytics,
  getNewsPosts,
  setNewsPosts,
  type AdminUser,
  type AnalyticsData,
  type NewsPost,
} from "../lib/storage";

export async function hashPassword(password: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(password);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
}

function getLast7Days(): { date: string; views: number }[] {
  const days: { date: string; views: number }[] = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    days.push({
      date: d.toISOString().split("T")[0]!,
      views: Math.floor(Math.random() * 200) + 50,
    });
  }
  return days;
}

export async function seed(): Promise<void> {
  // Seed default admin if no users exist
  const existing = getUsers();
  if (existing.length === 0) {
    const passwordHash = await hashPassword("obu2025admin");
    const admin: AdminUser = {
      id: crypto.randomUUID(),
      username: "admin",
      role: "admin",
      createdAt: new Date().toISOString(),
      passwordHash,
    };
    setUsers([admin]);
  }

  // Seed analytics if absent
  const analytics = getAnalytics();
  if (analytics.dailyViews.length === 0) {
    const seeded: AnalyticsData = {
      totalViews: 12450,
      uniqueVisitors: 3821,
      dailyViews: getLast7Days(),
    };
    setAnalytics(seeded);
  }

  // Seed sample news posts if absent
  const posts = getNewsPosts();
  if (posts.length === 0) {
    const samplePosts: NewsPost[] = [
      {
        id: crypto.randomUUID(),
        title: "OBU Signs MoU With Chercher Oda Bultum Farmers' Cooperative Union",
        excerpt:
          "Oda Bultum University signed a bilateral agreement with Chercher Oda Bultum Farmers' Cooperative Union…",
        body: "Oda Bultum University signed a bilateral agreement with Chercher Oda Bultum Farmers' Cooperative Union and Chercher Polytechnic College to strengthen academic–industry collaboration.",
        date: "2026-01-14",
        category: "News",
        authorId: "admin",
        createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
        updatedAt: new Date(Date.now() - 86400000 * 2).toISOString(),
      },
      {
        id: crypto.randomUUID(),
        title: "OBU Conducts Ethics and Anti-Corruption Awareness Training",
        excerpt:
          "OBU Ethics and Anti-corruption Executive Office has conducted a training session…",
        body: "OBU Ethics and Anti-corruption Executive Office has conducted a training session aimed at raising awareness among staff and students about ethical practices.",
        date: "2025-11-10",
        category: "Announcement",
        authorId: "admin",
        createdAt: new Date(Date.now() - 86400000 * 5).toISOString(),
        updatedAt: new Date(Date.now() - 86400000 * 5).toISOString(),
      },
      {
        id: crypto.randomUUID(),
        title: "Induction Training for Newly Recruited Academic Staff",
        excerpt:
          "OBU Academic Program and Staff Development Directorate delivered induction training…",
        body: "OBU Academic Program and Staff Development Directorate, alongside partners, delivered induction training for newly recruited academic staff members.",
        date: "2025-11-10",
        category: "Event",
        authorId: "admin",
        createdAt: new Date(Date.now() - 86400000 * 7).toISOString(),
        updatedAt: new Date(Date.now() - 86400000 * 7).toISOString(),
      },
    ];
    setNewsPosts(samplePosts);
  }
}
