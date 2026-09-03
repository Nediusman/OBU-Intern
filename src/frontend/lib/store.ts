/**
 * Observable in-memory store with SQLite persistence.
 *
 * On first use each collection is loaded from SQLite (via adminLoadCollection).
 * Every create/update/remove call writes back to SQLite via the matching
 * adminUpsert* server function so the public site immediately sees changes.
 *
 * Collections that don't have a DB table fall back to mock data only.
 */
import { useCallback, useEffect, useSyncExternalStore } from "react";
import * as mock from "@/frontend/services/legacyMock";
import type { Row } from "@/frontend/services/legacyMock";
import {
  adminLoadCollection,
  adminUpsertNews,
  adminUpsertAnnouncements,
  adminUpsertEvents,
  adminUpsertPrograms,
  adminDeleteRows,
  getAdminUpsertLeadership,
  adminUpsertResearchCenters,
  adminUpsertPublications,
  adminUpsertImportantDates,
  adminUpsertHeroSlides,
  adminUpsertHomepageSections,
} from "@/backend/api";

// ─── In-memory collections ────────────────────────────────────────────────────

const collections: Record<string, Row[]> = {
  // DB-backed (loaded lazily)
  news: mock.news,
  announcements: mock.announcements,
  events: mock.events,
  programs: mock.programs,
  leadership: mock.leadership,
  researchCenters: mock.researchCenters,
  publications: mock.publications,
  importantDates: mock.importantDates,
  contactMessages: mock.contactMessages,
  // In-memory only
  pages: mock.pages,
  navigation: mock.navigationItems,
  heroSlides: mock.heroSlides,
  homepageSections: mock.homepageSections as Row[],
  institutes: mock.institutes,
  departments: mock.departments,
  academicCalendar: mock.academicCalendar,
  senateBoard: mock.senateBoard,
  offices: mock.offices,
  admissions: mock.admissions,
  registrarInfo: mock.registrarInfo,
  researchProjects: mock.researchProjects,
  researchers: mock.researchers,
  services: mock.services,
  media: mock.media,
  documents: mock.documents,
  users: mock.users,
  activityLog: mock.activityLog,
};

// Track which collections have been loaded from DB
const loaded = new Set<string>();

// Collections that have a DB table
const DB_BACKED = new Set([
  "news",
  "announcements",
  "events",
  "programs",
  "leadership",
  "researchCenters",
  "publications",
  "importantDates",
  "contactMessages",
  "heroSlides",
  "homepageSections",
]);

// Map collection key → upsert function
const upsertFns: Record<string, (rows: Record<string, unknown>[]) => Promise<unknown>> = {
  news: (rows) => adminUpsertNews({ data: rows }),
  announcements: (rows) => adminUpsertAnnouncements({ data: rows }),
  events: (rows) => adminUpsertEvents({ data: rows }),
  programs: (rows) => adminUpsertPrograms({ data: rows }),
  leadership: (rows) => getAdminUpsertLeadership({ data: rows }),
  researchCenters: (rows) => adminUpsertResearchCenters({ data: rows }),
  publications: (rows) => adminUpsertPublications({ data: rows }),
  importantDates: (rows) => adminUpsertImportantDates({ data: rows }),
  heroSlides: (rows) => adminUpsertHeroSlides({ data: rows }),
  homepageSections: (rows) => adminUpsertHomepageSections({ data: rows }),
};

// ─── Pub/Sub ──────────────────────────────────────────────────────────────────

const listeners = new Set<() => void>();
const emit = () => listeners.forEach((l) => l());
const subscribe = (l: () => void) => {
  listeners.add(l);
  return () => listeners.delete(l);
};

// ─── DB loader ───────────────────────────────────────────────────────────────

async function loadFromDb(key: string) {
  if (loaded.has(key) || !DB_BACKED.has(key)) return;
  loaded.add(key);
  try {
    const json = await adminLoadCollection({ data: key });
    const rows = JSON.parse(json) as Row[];
    if (rows.length > 0) {
      collections[key] = rows;
      emit();
    }
  } catch {
    loaded.delete(key);
  }
}

// ─── Persist helper ──────────────────────────────────────────────────────────

async function persistToDb(key: string, rows: Row[]) {
  const fn = upsertFns[key];
  if (!fn) return;
  try {
    await fn(rows as Record<string, unknown>[]);
  } catch (e) {
    console.warn(`[store] Failed to persist ${key} to DB`, e);
  }
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function useCollection(key: string) {
  // Trigger DB load on first use
  useEffect(() => {
    if (!loaded.has(key)) loadFromDb(key);
  }, [key]);

  const rows = useSyncExternalStore(
    subscribe,
    () => collections[key] ?? [],
    () => collections[key] ?? [],
  );

  const set = useCallback(
    (next: Row[]) => {
      collections[key] = next;
      emit();
      persistToDb(key, next);
    },
    [key],
  );

  const create = useCallback(
    (values: Record<string, unknown>) => {
      const newRow = { id: `${key}-${Date.now()}`, ...values } as Row;
      const next = [newRow, ...(collections[key] ?? [])];
      collections[key] = next;
      emit();
      persistToDb(key, next);
    },
    [key],
  );

  const update = useCallback(
    (id: string, values: Record<string, unknown>) => {
      const next = (collections[key] ?? []).map((r) => (r.id === id ? { ...r, ...values } : r));
      collections[key] = next;
      emit();
      persistToDb(key, next);
    },
    [key],
  );

  const remove = useCallback(
    (ids: string[]) => {
      const next = (collections[key] ?? []).filter((r) => !ids.includes(r.id));
      collections[key] = next;
      emit();
      // Delete from DB then upsert survivors as safety net
      adminDeleteRows({ data: { collection: key, ids } }).catch((e) =>
        console.warn(`[store] Delete failed for ${key}`, e),
      );
    },
    [key],
  );

  return { rows, set, create, update, remove };
}

export function readCollection(key: string): Row[] {
  return collections[key] ?? [];
}
