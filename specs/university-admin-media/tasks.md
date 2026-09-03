# Implementation Plan: University Admin & Media

## Overview

Implement the university logo, image carousels, and full admin panel in incremental steps. Each step integrates immediately — no orphaned code. The admin section uses TanStack Router file-based routing with a layout route, localStorage persistence, React context for auth, and the already-installed `embla-carousel-react` and `recharts` packages.

---

## Tasks

- [x] 1. Add localStorage storage helpers and data seed
  - [x] 1.1 Create `src/lib/storage.ts` with typed `getItem`/`setItem`/`removeItem` wrappers and all domain-specific helpers (`getUsers`, `setUsers`, `getSession`, `setSession`, `getNewsPosts`, `setNewsPosts`, `getMediaItems`, `setMediaItems`, `getAnalytics`, `setAnalytics`)
    - Define all data model interfaces: `AdminUser`, `NewsPost`, `MediaItem`, `AnalyticsData`
    - Wrap all localStorage calls in try/catch; return fallback on parse error
    - _Requirements: 4.1, 5.3, 6.2, 7.3, 8.3_

  - [x] 1.2 Create `src/lib/seed.ts` that seeds a default admin account (`admin` / `obu2025admin`) and sample analytics data into localStorage on first load if absent
    - Use Web Crypto API (`crypto.subtle.digest`) to hash passwords as SHA-256 hex strings
    - Seed 7 days of sample daily view data for the analytics chart
    - _Requirements: 4.6, 5.3_

  - [ ]* 1.3 Write unit tests for `storage.ts` helpers
    - Test that `getItem` returns fallback when key is absent
    - Test that `getItem` returns fallback when stored value is invalid JSON
    - Test round-trip: `setItem` then `getItem` returns the same value
    - _Requirements: 4.6, 5.3_

- [x] 2. Implement AuthContext and admin login route
  - [x] 2.1 Create `src/contexts/AuthContext.tsx` exporting `AuthProvider` and `useAuth` hook
    - Expose `currentUser`, `login(username, password): Promise<boolean>`, and `logout()`
    - On mount, hydrate `currentUser` from `obu_session` in localStorage
    - `login` hashes the provided password and compares against stored `passwordHash`
    - `logout` clears `obu_session` and sets `currentUser` to null
    - Call `seed()` from `seed.ts` during provider initialization
    - _Requirements: 4.1, 4.3, 4.5, 4.6_

  - [x] 2.2 Create `src/routes/admin/login.tsx` — the public login page
    - Form with accessible `<label>` elements, username input, password input, submit button
    - On submit, call `login()`; on failure display "Invalid username or password" without clearing username
    - On success, navigate to `/admin`
    - If already authenticated, redirect to `/admin`
    - _Requirements: 4.3, 4.4, 4.7_

  - [ ]* 2.3 Write property test: invalid credentials always show error
    - **Property 8: Invalid credentials always show error**
    - **Validates: Requirements 4.4**
    - Use `fast-check` to generate arbitrary (username, password) pairs that don't match seeded credentials and assert `login()` returns `false`

  - [ ]* 2.4 Write unit tests for AuthContext
    - Test valid credentials store session and return `true`
    - Test logout clears session from localStorage
    - Test unauthenticated state is null on fresh storage
    - _Requirements: 4.3, 4.5_

- [x] 3. Build AdminLayout and sidebar with route guards
  - [x] 3.1 Create `src/routes/admin/_layout.tsx` as the TanStack Router layout route
    - Use `beforeLoad` to redirect to `/admin/login` if `obu_session` is absent
    - Render `AdminLayout` component with `<Outlet />`
    - Does NOT include public `Navbar` or `Footer`
    - _Requirements: 4.2, 9.4_

  - [x] 3.2 Create `src/components/admin/AdminSidebar.tsx`
    - Links: Dashboard (`/admin`), Media (`/admin/media`), News (`/admin/news`), Users (`/admin/users`)
    - Hide Users link when `currentUser.role` is `content-creator` or `sub-admin`
    - Display `currentUser.username` and Logout button in sidebar header
    - Active link gets accent color class using TanStack Router `activeProps`
    - _Requirements: 9.1, 9.2, 9.3, 9.6_

  - [x] 3.3 Create `src/components/admin/AdminLayout.tsx`
    - Fixed sidebar on `lg+`; shadcn Sheet drawer on mobile with hamburger trigger
    - Wraps `children` in a scrollable main area
    - _Requirements: 9.5_

  - [ ]* 3.4 Write property test: sidebar hides Users link for restricted roles
    - **Property 20: Users link hidden for restricted roles**
    - **Validates: Requirements 9.2**

  - [ ]* 3.5 Write property test: sidebar shows username and logout button for any session
    - **Property 21: Sidebar shows username and logout button**
    - **Validates: Requirements 9.3**

  - [ ]* 3.6 Write property test: unauthenticated redirect
    - **Property 7: Unauthenticated redirect**
    - **Validates: Requirements 4.2**

- [ ] 4. Checkpoint — Ensure auth and layout tests pass
  - Ensure all tests pass, ask the user if questions arise.

- [x] 5. Build the ImageCarousel component
  - [x] 5.1 Create `src/components/ImageCarousel.tsx` using `embla-carousel-react`
    - Accept props: `images: { src: string; alt: string; title?: string; subtitle?: string }[]`, `interval?: number` (default 5000ms), `showOverlay?: boolean`, `className?: string`
    - Auto-play via `useEffect` + `setInterval`; manual navigation resets the timer (pauses for 8s)
    - Loop enabled via Embla's `loop: true` option
    - Render dot indicators based on `embla.scrollSnapList()`
    - Previous/Next arrow buttons
    - Root element: `aria-label="Campus image slideshow"`; each `img` uses its `alt` prop
    - _Requirements: 2.1–2.10, 3.5_

  - [ ]* 5.2 Write property test: dot count equals slide count
    - **Property 3: Dot count equals slide count**
    - **Validates: Requirements 2.5**

  - [ ]* 5.3 Write property test: loop wrap-around
    - **Property 2: Loop wrap-around**
    - **Validates: Requirements 2.4**

  - [ ]* 5.4 Write property test: manual navigation increments/decrements
    - **Property 4: Manual navigation increments / decrements**
    - **Validates: Requirements 2.6**

  - [ ]* 5.5 Write property test: accessibility attributes
    - **Property 6: Accessibility attributes**
    - **Validates: Requirements 2.10**

  - [ ]* 5.6 Write property test: text overlay renders title per slide
    - **Property 5: Text overlay per slide**
    - **Validates: Requirements 2.9**

- [x] 6. Integrate carousel and logo into public site
  - [x] 6.1 Update `src/components/Navbar.tsx` to display the university logo image
    - Import logo from `obu_transparen_logos.png` (at repo root) or `images/logo.png`; copy the chosen file into `src/assets/` as `logo.png` for Vite import
    - Replace the text-only logo markup with an `<img>` element
    - `alt="Oda Bultum University logo"`, `h-10 lg:h-12`, `w-auto` (preserves aspect ratio)
    - `onError` handler sets a fallback state to render the text name instead
    - _Requirements: 1.1, 1.2, 1.3, 1.5, 1.6, 1.7_

  - [x] 6.2 Update `src/components/Footer.tsx` to display the logo image at a smaller size alongside the name text
    - _Requirements: 1.4_

  - [x] 6.3 Update `src/routes/index.tsx` hero section to use `ImageCarousel`
    - Replace the static `<img>` with `<ImageCarousel>` using slides from `src/assets/` and selected images from `images/` (copy relevant ones to `src/assets/` for Vite imports)
    - Pass `showOverlay={true}` with the existing hero title/subtitle/CTA text
    - Pass `interval={5000}`
    - _Requirements: 2.1, 2.2, 2.3, 2.9_

  - [x] 6.4 Update `src/routes/about.tsx` to add an `ImageCarousel` section with campus/event images from `images/` folder
    - Pass `interval={6000}`
    - _Requirements: 3.1, 3.3_

  - [x] 6.5 Update `src/routes/research.tsx` to add an `ImageCarousel` section with research/lab images
    - Pass `interval={6000}`
    - _Requirements: 3.2, 3.3_

  - [ ]* 6.6 Write unit tests: logo renders img with correct alt, and onError shows fallback text
    - _Requirements: 1.1, 1.2, 1.7_

- [ ] 7. Checkpoint — Verify carousel and logo render correctly
  - Ensure all tests pass, ask the user if questions arise.

- [x] 8. Build analytics dashboard at `/admin`
  - [x] 8.1 Create `src/routes/admin/index.tsx` — the dashboard page
    - Read `obu_analytics`, `obu_posts`, `obu_media`, `obu_users` from storage helpers
    - Display four stat cards: total views, unique visitors, news posts count, media items count
    - Render a `recharts` `BarChart` or `LineChart` with the 7-day `dailyViews` data
    - Display a "Recent Posts" list of the 3 most recently created `NewsPost` entries
    - Display total registered user count
    - _Requirements: 5.1, 5.2, 5.3, 5.4, 5.5_

  - [ ]* 8.2 Write property test: dashboard chart always has 7 data points
    - **Property 23: Dashboard chart has 7 data points**
    - **Validates: Requirements 5.2**

  - [ ]* 8.3 Write property test: dashboard shows 3 most recent posts
    - **Property 24: Dashboard shows 3 most recent posts**
    - **Validates: Requirements 5.4**

- [x] 9. Build Media Library at `/admin/media`
  - [x] 9.1 Create `src/routes/admin/media.tsx`
    - Read `obu_media` on mount; display items in a responsive CSS grid
    - File input (`accept="image/*"`, `multiple`) triggers upload handler
    - Upload handler: reads each file as base64 data URL, constructs `MediaItem`, adds to storage
    - Compute total `sizeBytes` of all items; if > 4,194,304 display warning banner
    - Each thumbnail card shows the image, `filename`, and formatted `uploadedAt`
    - Delete button opens a confirmation `AlertDialog` (shadcn); on confirm removes item from storage
    - _Requirements: 6.1, 6.2, 6.3, 6.4, 6.5, 6.6, 6.7, 6.8_

  - [ ]* 9.2 Write property test: grid reflects stored items count
    - **Property 9: Grid reflects stored items**
    - **Validates: Requirements 6.1, 6.3**

  - [ ]* 9.3 Write property test: storage warning threshold
    - **Property 10: Storage warning threshold**
    - **Validates: Requirements 6.5**

  - [ ]* 9.4 Write property test: uploaded item metadata completeness
    - **Property 11: Uploaded item metadata completeness**
    - **Validates: Requirements 6.7**

  - [ ]* 9.5 Write property test: thumbnail card shows filename and date
    - **Property 12: Thumbnail label rendering**
    - **Validates: Requirements 6.8**

- [x] 10. Build News/Events management at `/admin/news`
  - [x] 10.1 Create `src/routes/admin/news.tsx`
    - List all `NewsPost` entries from `obu_posts` with title, date, category columns
    - "Add Post" button opens a form (can be a Dialog or inline section) with fields: title (required), excerpt, body/textarea (required), date, category dropdown (News / Event / Announcement), optional image selector (shows `obu_media` thumbnails)
    - Validate: title and body must be non-empty/non-whitespace; show inline errors on failure
    - On valid submit: create `NewsPost` with `crypto.randomUUID()` id, persist to storage, refresh list
    - "Edit" button populates the form with existing post data; on submit updates the item in storage
    - "Delete" button (hidden for `content-creator` role) opens `AlertDialog`; on confirm removes from storage
    - _Requirements: 7.1, 7.2, 7.3, 7.4, 7.5, 7.6, 7.7_

  - [ ]* 10.2 Write property test: all posts listed
    - **Property 13: All posts listed**
    - **Validates: Requirements 7.1**

  - [ ]* 10.3 Write property test: empty-field validation
    - **Property 14: Empty-field validation**
    - **Validates: Requirements 7.4**

  - [ ]* 10.4 Write property test: edit pre-populates form
    - **Property 15: Edit pre-populates form**
    - **Validates: Requirements 7.5**

  - [ ]* 10.5 Write property test: content creator cannot see delete buttons
    - **Property 16: Content creator cannot see delete**
    - **Validates: Requirements 7.7**

  - [x] 10.6 Update `src/routes/news.tsx` (public page) to read `obu_posts` from localStorage and render them; fall back to the existing static `newsItems` array if storage is empty
    - _Requirements: 7.8_

- [ ] 11. Checkpoint — Ensure news management and public page tests pass
  - Ensure all tests pass, ask the user if questions arise.

- [x] 12. Build User Management at `/admin/users`
  - [x] 12.1 Create `src/routes/admin/users.tsx`
    - In `beforeLoad` (or on render), redirect to `/admin` if `currentUser.role` is not `admin`
    - List all users from `obu_users` with username, role, and formatted `createdAt`
    - "Invite User" button opens a form (Dialog) with: username, temporary password (min 8 chars), role selector (sub-admin / content-creator)
    - Validate: username must be unique; password must be ≥ 8 chars; show inline errors on failure
    - On valid submit: hash password, create `AdminUser`, persist to storage, refresh list
    - "Remove" button opens `AlertDialog`; on confirm deletes user from storage
    - Disable "Remove" on the last `admin`-role account (tooltip explaining why)
    - _Requirements: 8.1, 8.2, 8.3, 8.4, 8.5, 8.6, 8.7_

  - [ ]* 12.2 Write property test: all users listed
    - **Property 17: All users listed**
    - **Validates: Requirements 8.1**

  - [ ]* 12.3 Write property test: duplicate username rejected
    - **Property 18: Duplicate username rejected**
    - **Validates: Requirements 8.4**

  - [ ]* 12.4 Write property test: sub-admin/content-creator redirected from users page
    - **Property 19: Sub-admin / content-creator redirect from users page**
    - **Validates: Requirements 8.6**

  - [ ]* 12.5 Write property test: active sidebar link has active class
    - **Property 22: Active sidebar link gets active class**
    - **Validates: Requirements 9.6**

- [x] 13. Wire everything together and final polish
  - [x] 13.1 Wrap the app (or at minimum all admin routes) in `AuthProvider` — update `src/routes/__root.tsx` to include `<AuthProvider>` around `<Outlet />`
    - _Requirements: 4.1_

  - [x] 13.2 Add "Admin" link to the public `Navbar` that is only visible when `currentUser` is non-null (reads from `useAuth`)
    - _Requirements: 4.8_

  - [x] 13.3 Ensure `routeTree.gen.ts` will auto-regenerate when new route files are added (it does so automatically via `@tanstack/router-plugin`); confirm all admin routes are correctly picked up and there are no TypeScript errors
    - Fix any type errors reported by the router plugin

- [ ] 14. Final checkpoint — All tests pass
  - Ensure all tests pass, ask the user if questions arise.

---

## Notes

- Tasks marked with `*` are optional and can be skipped for a faster MVP
- Each task references specific requirements for traceability
- Property tests use `fast-check` with `numRuns: 100` minimum
- Unit tests use Vitest + React Testing Library
- All persistence is localStorage — no backend needed
- Images in `images/` folder and `obu_transparen_logos.png` need to be imported via Vite, so relevant files should be copied into or referenced from `src/assets/` (or use a `/images/` public path if moved to `public/`)
