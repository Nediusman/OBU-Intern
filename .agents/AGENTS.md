# Oda Bultum University Website - Architecture & Guidelines

This document provides a technical overview of the Oda Bultum University (OBU) website to help future AI agents seamlessly understand, debug, and expand the project.

## 1. Technology Stack

- **Frontend Framework**: React using [TanStack Start](https://tanstack.com/start) / [TanStack Router](https://tanstack.com/router) (Full-stack React framework).
- **Styling**: Tailwind CSS (with `lucide-react` for icons).
- **Backend & API**: Server functions (`createServerFn`) provided by TanStack Start.
- **Database**: PostgreSQL (interacted with via a custom `db.ts` wrapper utilizing `pg` module).

## 2. Architecture: Model-View-Controller (MVC)

The site strictly follows an MVC pattern, separating the presentation layer from the data management and API layers.

### **View (Frontend & Admin UI)**

- **Public Landing Pages (`src/routes/`):** React components that construct the public-facing pages (e.g., `index.tsx`). These pages fetch data dynamically.
- **Admin Dashboards (`src/routes/_admin.*`):** Protected routes where university staff manage content. Examples include `_admin.website.homepage.tsx`, `_admin.content.news.tsx`, and `_admin.system.settings.tsx`.
- **Components (`src/frontend/components/`):** Reusable UI elements (e.g., `ImageCarousel`, `Button`). Admin-specific components are kept under `src/frontend/components/admin/bits.ts`.

### **Controller (API Layer)**

- **Server Functions (`src/backend/api.ts`):** This is the bridge between the View and the Model. Functions like `getHeroSlides`, `getPresidentInfo`, and `getSiteStats` are exported here using `createServerFn({ method: "GET" })`.
- **Data Fetching:** Frontend components use `@tanstack/react-query` (`useQuery`) to call these server functions.

### **Model (Database Layer)**

- **Schema & DB Module (`src/database/db.ts`):** Handles the PostgreSQL connection pooling and queries.
- **Generic Resources (`src/lib/resources.ts`):** Defines configuration objects for standard CRUD tables (e.g., `news`, `events`, `navigation`). This powers the generic `<ResourcePage>` component used in many Admin dashboards to instantly scaffold data-entry tables.

## 3. Data Flow Example (How to add a dynamic section)

If you are asked to make a hardcoded section dynamic, follow this MVC workflow:

1.  **Model (Database)**: Ensure the target data exists in a PostgreSQL table (or the generic `settings` key-value table).
2.  **Controller (`api.ts`)**: Write a new `createServerFn` to query that specific data.
3.  **View (Admin)**: Add a UI to edit that data. If it's a simple key-value, add it to `_admin.system.settings.tsx`. If it's a full collection, create a new route using `<ResourcePage config={...} />`.
4.  **View (Public)**: Update the relevant public component (e.g., `index.tsx`) to use `useQuery({ queryFn: () => yourNewApiFunction() })` and map the results to the UI.

## 4. Key Conventions & Rules

- **Admin Settings Fallbacks**: When fetching aggregated statistics (like `staffCount`), the `getSiteStats` API first checks the `settings` table for manual overrides, and if empty, runs a fallback `COUNT(*)` query on the actual tables (e.g., `researchers`). This gives admins flexibility while keeping the site dynamic.
- **Role-Based Access**: The site supports multiple roles (e.g., Super Admin, Webmaster, PR Officer) defined in the Website Governance Policy. Status workflows (Draft -> Pending Review -> Published) are built into the data schema.
- **Routing**: TanStack Router uses file-based routing. Files prefixed with `_` (like `_admin.tsx`) are layout routes or pathless routes used for grouping/authentication.
