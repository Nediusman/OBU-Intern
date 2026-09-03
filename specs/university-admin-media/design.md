# Design Document: University Admin & Media

## Overview

This design covers three interconnected feature areas for the Oda Bultum University website:

1. **Logo integration** — swap the Navbar and Footer text logo for the actual university PNG (transparent background).
2. **Image carousels** — add an auto-playing `ImageCarousel` component to the homepage hero and secondary pages, driven by existing image assets.
3. **Admin panel** — a fully client-side `/admin` area with localStorage-backed authentication, analytics dashboard, media library, news/events management, and user/role management.

The project uses TanStack Router (file-based), React 19, Tailwind CSS v4, shadcn/ui (Radix), `embla-carousel-react` (already installed), and `recharts` (already installed). No backend or API is added — all persistence is via `localStorage`.

---

## Architecture

```
src/
  assets/                     (existing campus images)
  components/
    Navbar.tsx                 (updated: logo img + auth link)
    Footer.tsx                 (updated: logo img)
    ImageCarousel.tsx          (new: reusable auto-play carousel)
    admin/
      AdminLayout.tsx          (new: sidebar + outlet wrapper)
      AdminSidebar.tsx         (new: nav links, logout, username)
  contexts/
    AuthContext.tsx            (new: login/logout/currentUser)
  lib/
    storage.ts                 (new: typed localStorage helpers)
    seed.ts                    (new: seeds default admin + analytics)
  routes/
    index.tsx                  (updated: hero uses ImageCarousel)
    about.tsx                  (updated: adds ImageCarousel section)
    research.tsx               (updated: adds ImageCarousel section)
    news.tsx                   (updated: reads posts from localStorage)
    admin/
      __root.tsx → _layout.tsx (new: admin layout route)
      index.tsx                (new: dashboard)
      login.tsx                (new: login page)
      media.tsx                (new: media library)
      news.tsx                 (new: news/events management)
      users.tsx                (new: user management)
images/                        (existing: logo.png + campus photos)
obu_transparen_logos.png       (existing: transparent logo at root)
```

### Routing structure

TanStack Router uses file-based routing. The admin section uses a layout route (`_layout.tsx`) under `src/routes/admin/` so all child routes share `AdminLayout` without affecting the public site's `Navbar`/`Footer`.

```
/admin                → admin/_layout.tsx + admin/index.tsx (dashboard)
/admin/login          → admin/login.tsx  (no layout guard)
/admin/media          → admin/_layout.tsx + admin/media.tsx
/admin/news           → admin/_layout.tsx + admin/news.tsx
/admin/users          → admin/_layout.tsx + admin/users.tsx
```

The `_layout.tsx` route checks auth on every render; if `currentUser` is null it redirects to `/admin/login`.

---

## Components and Interfaces

### `ImageCarousel`

```tsx
interface CarouselSlide {
  src: string;
  alt: string;
  title?: string;
  subtitle?: string;
}

interface ImageCarouselProps {
  images: CarouselSlide[];
  interval?: number; // ms between slides, default 5000
  showOverlay?: boolean; // show text overlay, default false
  className?: string;
}
```

Implemented with `embla-carousel-react` using `useEmblaCarousel`. Auto-play via `useEffect` + `setInterval`. Manual navigation resets the interval timer. Navigation dots derived from `embla.scrollSnapList()`.

### `AuthContext`

```tsx
interface AdminUser {
  id: string;
  username: string;
  role: "admin" | "sub-admin" | "content-creator";
  createdAt: string;
  passwordHash: string; // SHA-256 hex of password (Web Crypto API)
}

interface AuthContextValue {
  currentUser: AdminUser | null;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
}
```

Session stored in `localStorage` as `obu_session` (serialized `AdminUser` without `passwordHash`). Users stored as `obu_users` (array of `AdminUser`).

### `storage.ts` helpers

```ts
// Typed getters/setters with JSON parse/stringify
getItem<T>(key: string, fallback: T): T
setItem<T>(key: string, value: T): void
removeItem(key: string): void

// Domain-specific
getUsers(): AdminUser[]
setUsers(users: AdminUser[]): void
getSession(): AdminUser | null
setSession(user: AdminUser | null): void
getNewsPosts(): NewsPost[]
setNewsPosts(posts: NewsPost[]): void
getMediaItems(): MediaItem[]
setMediaItems(items: MediaItem[]): void
getAnalytics(): AnalyticsData
setAnalytics(data: AnalyticsData): void
```

### `AdminLayout`

Wraps all `/admin/*` routes except `/admin/login`. Renders:

- Fixed left sidebar (`AdminSidebar`) on `lg+`; slide-in Sheet drawer on mobile
- `<Outlet />` for child route content
- Does NOT render public `Navbar` or `Footer`
- Reads auth from `AuthContext`; redirects if unauthenticated

---

## Data Models

```ts
interface AdminUser {
  id: string; // crypto.randomUUID()
  username: string;
  role: "admin" | "sub-admin" | "content-creator";
  createdAt: string; // ISO date string
  passwordHash: string; // SHA-256 of password via Web Crypto
}

interface NewsPost {
  id: string;
  title: string;
  excerpt: string;
  body: string;
  date: string; // ISO date string
  category: "News" | "Event" | "Announcement";
  imageUrl?: string; // data URL from Media_Library
  authorId: string;
  createdAt: string;
  updatedAt: string;
}

interface MediaItem {
  id: string;
  filename: string;
  dataUrl: string; // base64 data URL
  mimeType: string;
  sizeBytes: number;
  uploadedAt: string;
  uploadedBy: string; // AdminUser.id
}

interface AnalyticsData {
  totalViews: number;
  uniqueVisitors: number;
  dailyViews: { date: string; views: number }[]; // last 7 days
}
```

**localStorage keys:**

| Key             | Type                  | Description         |
| --------------- | --------------------- | ------------------- |
| `obu_users`     | `AdminUser[]`         | All admin accounts  |
| `obu_session`   | `AdminUser` (no hash) | Current session     |
| `obu_posts`     | `NewsPost[]`          | News/events content |
| `obu_media`     | `MediaItem[]`         | Uploaded images     |
| `obu_analytics` | `AnalyticsData`       | Dashboard metrics   |

---

## Correctness Properties

_A property is a characteristic or behavior that should hold true across all valid executions of a system — essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees._

---

### Carousel Properties

**Property 1: Auto-advance**
_For any_ `ImageCarousel` with N ≥ 2 slides and a given `interval` ms, after exactly `interval` ms elapse, the active slide index should increase by 1 (mod N).
**Validates: Requirements 2.3**

**Property 2: Loop wrap-around**
_For any_ `ImageCarousel` with N slides, calling "next" while on slide index N−1 should result in slide index 0.
**Validates: Requirements 2.4**

**Property 3: Dot count equals slide count**
_For any_ `ImageCarousel` with N slides, the number of rendered dot indicators should equal N.
**Validates: Requirements 2.5**

**Property 4: Manual navigation increments / decrements**
_For any_ `ImageCarousel` at slide index i (0 < i < N−1), clicking next should yield i+1 and clicking previous should yield i−1.
**Validates: Requirements 2.6**

**Property 5: Text overlay per slide**
_For any_ `ImageCarousel` rendered with `showOverlay={true}` and a list of slides each having a `title`, the rendered output should contain each slide's title text.
**Validates: Requirements 2.9**

**Property 6: Accessibility attributes**
_For any_ `ImageCarousel` rendered with any non-empty `images` array, the root element should have `aria-label="Campus image slideshow"` and every `img` element should have a non-empty `alt` attribute.
**Validates: Requirements 2.10**

---

### Authentication Properties

**Property 7: Unauthenticated redirect**
_For any_ `/admin/*` route path (excluding `/admin/login`), visiting that route while `obu_session` is absent from localStorage should redirect the user to `/admin/login`.
**Validates: Requirements 4.2**

**Property 8: Invalid credentials always show error**
_For any_ (username, password) pair that does not match a stored user, calling `login()` should return `false` and the error message "Invalid username or password" should be displayed.
**Validates: Requirements 4.4**

---

### Media Library Properties

**Property 9: Grid reflects stored items**
_For any_ array of N `MediaItem` objects stored in `obu_media`, the Media Library grid should render exactly N image elements.
**Validates: Requirements 6.1, 6.3**

**Property 10: Storage warning threshold**
_For any_ set of `MediaItem` objects whose combined `sizeBytes` exceeds 4,194,304 (4 MB), the Media Library page should display the warning message "Storage is nearly full. Consider removing unused images."
**Validates: Requirements 6.5**

**Property 11: Uploaded item metadata completeness**
_For any_ file uploaded through the Media Library, the resulting `MediaItem` stored in localStorage should have non-null/non-empty values for `id`, `filename`, `uploadedAt`, and `uploadedBy`.
**Validates: Requirements 6.7**

**Property 12: Thumbnail label rendering**
_For any_ `MediaItem` in the library, the rendered thumbnail card should contain both the `filename` and a human-readable representation of `uploadedAt`.
**Validates: Requirements 6.8**

---

### News Management Properties

**Property 13: All posts listed**
_For any_ array of `NewsPost` objects in `obu_posts`, all posts should appear in the `/admin/news` list with their title, date, and category visible.
**Validates: Requirements 7.1**

**Property 14: Empty-field validation**
_For any_ form submission where `title` or `body` is an empty string or whitespace-only string, the News Post form should reject the submission and display a validation error.
**Validates: Requirements 7.4**

**Property 15: Edit pre-populates form**
_For any_ existing `NewsPost`, clicking its Edit button should populate the form fields with values that equal the post's stored field values.
**Validates: Requirements 7.5**

**Property 16: Content creator cannot see delete**
_For any_ authenticated session with role `content-creator`, no "Delete" button should be rendered on any post row in the News management page.
**Validates: Requirements 7.7**

---

### User Management Properties

**Property 17: All users listed**
_For any_ array of `AdminUser` objects in `obu_users`, all should appear in the `/admin/users` list with username, role, and created date visible.
**Validates: Requirements 8.1**

**Property 18: Duplicate username rejected**
_For any_ invite form submission where the entered username already exists in `obu_users`, the system should display "Username already exists" and not add a duplicate to storage.
**Validates: Requirements 8.4**

**Property 19: Sub-admin / content-creator redirect from users page**
_For any_ authenticated session where role is `sub-admin` or `content-creator`, navigating to `/admin/users` should redirect to `/admin`.
**Validates: Requirements 8.6**

---

### Admin Layout Properties

**Property 20: Users link hidden for restricted roles**
_For any_ authenticated session where role is `content-creator` or `sub-admin`, the admin sidebar should not render the "Users" navigation link.
**Validates: Requirements 9.2**

**Property 21: Sidebar shows username and logout button**
_For any_ authenticated session, the admin sidebar should render the `currentUser.username` string and a "Logout" button.
**Validates: Requirements 9.3**

**Property 22: Active sidebar link gets active class**
_For any_ admin route, the sidebar link corresponding to the current path should have an active state class applied.
**Validates: Requirements 9.6**

---

### Analytics Properties

**Property 23: Dashboard chart has 7 data points**
_For any_ `AnalyticsData` value read from storage, the data passed to the recharts chart component should contain exactly 7 entries (one per day).
**Validates: Requirements 5.2**

**Property 24: Dashboard shows 3 most recent posts**
_For any_ array of N ≥ 3 `NewsPost` objects sorted by `createdAt`, the dashboard recent posts list should contain exactly 3 entries and they should be the 3 with the latest `createdAt` values.
**Validates: Requirements 5.4**

---

## Error Handling

| Scenario                                                     | Behavior                                                                  |
| ------------------------------------------------------------ | ------------------------------------------------------------------------- |
| Logo image fails to load                                     | `onError` handler sets state to show fallback text                        |
| localStorage unavailable (private browsing / quota exceeded) | `storage.ts` wraps all calls in try/catch; logs warning; returns fallback |
| Image upload exceeds 4 MB total                              | Warning banner shown in Media Library; upload still allowed               |
| Invalid JSON in localStorage key                             | `getItem` catches parse error and returns the provided fallback           |
| Admin submits form with validation errors                    | Inline field-level errors displayed; form not submitted                   |
| Unauthenticated access to admin route                        | Redirect to `/admin/login` via TanStack Router `beforeLoad`               |
| Last admin account removal attempt                           | Remove button is disabled; tooltip explains why                           |

---

## Testing Strategy

### Dual Testing Approach

Both unit tests and property-based tests are used. They are complementary:

- Unit tests cover specific examples, integration points, edge cases, and UI rendering checks.
- Property-based tests verify universal behavioral invariants across many generated inputs.

### Testing Libraries

- **Unit/component tests**: [Vitest](https://vitest.dev/) + [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/)
- **Property-based tests**: [fast-check](https://fast-check.dev/) — the leading PBT library for JavaScript/TypeScript

### Property Test Configuration

Each property-based test should run a minimum of **100 iterations**. Each test is annotated with a tag comment referencing its design property:

```ts
// Feature: university-admin-media, Property 2: Loop wrap-around
it("wraps from last slide to first", () => {
  fc.assert(
    fc.property(fc.integer({ min: 2, max: 20 }), (n) => {
      // ...test logic
    }),
    { numRuns: 100 },
  );
});
```

### Unit Test Focus Areas

- Logo renders img element with correct src and alt (Requirements 1.1, 1.7)
- Logo onError fallback shows text (Requirement 1.2)
- `/admin/login` form has all required elements (Requirement 4.7)
- Default admin seed on fresh localStorage (Requirement 4.6)
- Login with valid credentials stores session and redirects (Requirement 4.3)
- Logout clears session (Requirement 4.5)
- Dashboard reads from localStorage (Requirement 5.3)
- File input has `multiple` attribute (Requirement 6.6)
- Delete triggers confirmation dialog (Requirements 6.4, 7.6, 8.5)
- Public `/news` falls back to static posts when localStorage empty (Requirement 7.8)
- Admin layout has no public Navbar/Footer (Requirement 9.4)

### Property Test Focus Areas

Implemented via `fast-check`, one test per property listed in the Correctness Properties section (Properties 1–24). Generators to create:

- `fc.array(slideArb)` for carousel properties
- `fc.record({ username: fc.string(), password: fc.string() })` for auth properties
- `fc.array(mediaItemArb)` for media library properties
- `fc.array(newsPostArb)` for news management properties
- `fc.array(adminUserArb)` for user management properties
