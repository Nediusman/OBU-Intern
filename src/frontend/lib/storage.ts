// Data model interfaces

export interface AdminUser {
  id: string;
  username: string;
  role: "admin" | "sub-admin" | "content-creator";
  createdAt: string;
  passwordHash: string;
}

export interface NewsPost {
  id: string;
  title: string;
  excerpt: string;
  body: string;
  date: string;
  category: "News" | "Event" | "Announcement";
  imageUrl?: string;
  authorId: string;
  createdAt: string;
  updatedAt: string;
}

export interface MediaItem {
  id: string;
  filename: string;
  dataUrl: string;
  mimeType: string;
  sizeBytes: number;
  uploadedAt: string;
  uploadedBy: string;
}

export interface AnalyticsData {
  totalViews: number;
  uniqueVisitors: number;
  dailyViews: { date: string; views: number }[];
}

// Storage keys
export const KEYS = {
  USERS: "obu_users",
  SESSION: "obu_session",
  POSTS: "obu_posts",
  MEDIA: "obu_media",
  ANALYTICS: "obu_analytics",
} as const;

// Generic typed helpers
export function getItem<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (raw === null) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    console.warn(`[storage] Failed to parse key "${key}", returning fallback`);
    return fallback;
  }
}

export function setItem<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    console.warn(`[storage] Failed to write key "${key}"`);
  }
}

export function removeItem(key: string): void {
  try {
    localStorage.removeItem(key);
  } catch {
    console.warn(`[storage] Failed to remove key "${key}"`);
  }
}

// Domain-specific helpers
export const getUsers = (): AdminUser[] => getItem<AdminUser[]>(KEYS.USERS, []);
export const setUsers = (users: AdminUser[]): void => setItem(KEYS.USERS, users);

export const getSession = (): Omit<AdminUser, "passwordHash"> | null =>
  getItem<Omit<AdminUser, "passwordHash"> | null>(KEYS.SESSION, null);
export const setSession = (user: Omit<AdminUser, "passwordHash"> | null): void =>
  setItem(KEYS.SESSION, user);

export const getNewsPosts = (): NewsPost[] => getItem<NewsPost[]>(KEYS.POSTS, []);
export const setNewsPosts = (posts: NewsPost[]): void => setItem(KEYS.POSTS, posts);

export const getMediaItems = (): MediaItem[] => getItem<MediaItem[]>(KEYS.MEDIA, []);
export const setMediaItems = (items: MediaItem[]): void => setItem(KEYS.MEDIA, items);

export const getAnalytics = (): AnalyticsData =>
  getItem<AnalyticsData>(KEYS.ANALYTICS, {
    totalViews: 0,
    uniqueVisitors: 0,
    dailyViews: [],
  });
export const setAnalytics = (data: AnalyticsData): void => setItem(KEYS.ANALYTICS, data);
