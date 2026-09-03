# Oda Bultum University (OBU) Website & Admin CMS

Welcome to the official repository for the **Oda Bultum University Website**. This project includes both the public-facing website and a secure, dynamic Admin Content Management System (CMS) for managing university data, built with modern web technologies.

## Project Purpose

To provide a fast, responsive, and dynamic web platform for Oda Bultum University, enabling students, staff, and the public to access up-to-date information, while giving administrators powerful tools to manage content without touching the code.

## Technology Stack

- **Frontend Framework**: [TanStack Start](https://tanstack.com/start) / [TanStack Router](https://tanstack.com/router) (React)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **Backend & Database**: [Supabase](https://supabase.com/) (PostgreSQL, Authentication, Row Level Security)
- **Icons**: Lucide React
- **UI Components**: Radix UI (accessible, unstyled components)

## Project Structure

The repository is organized following an MVC-like architecture suited for TanStack Start:

- `src/routes/`: Contains all public-facing pages (e.g., `index.tsx`, `academics.$slug.tsx`) and Admin CMS routes (`admin.*.tsx`).
- `src/frontend/`: React components (`components/`), contexts, hooks, and UI utilities.
- `src/backend/`: Server-side API functions (`api.ts`), database configuration (`database/`), and server utilities.
- `supabase/migrations/`: Database schema migrations and setup SQL.

## Public Website Architecture

The public website dynamically fetches data from the Supabase database using TanStack Query. It uses dynamic routing (e.g., `/academics/programs/$slug`) to display dynamic content such as news, events, and academic units.

## Admin CMS Architecture

The Admin CMS is a protected section located under the `/admin` route. It utilizes Supabase Authentication and Row Level Security (RLS) to ensure only authorized administrators can modify content. Data is managed via a combination of custom hooks (`use*.ts`) and generic resource components to ensure consistency.

---

## Local Development Setup

### 1. Prerequisites

- Node.js (v18+)
- npm or yarn

### 2. Environment Setup

Create a `.env` file in the root directory based on `.env.example`:

```bash
cp .env.example .env
```

Fill in the required variables (contact the lead developer for development credentials):

- `SUPABASE_URL`: Your Supabase project URL
- `SUPABASE_PUBLISHABLE_KEY`: Anon/public key
- `SUPABASE_SECRET_KEY`: Service role/secret key (Server-only)
- `DATABASE_URL`: PostgreSQL connection string

### 3. Installation

Install the project dependencies:

```bash
npm install
```

### 4. Database Setup (If setting up a fresh Supabase instance)

Apply the initial schema using the SQL files in `supabase/migrations/` via the Supabase Dashboard SQL Editor or Supabase CLI.
_(Note: There are development-only seed scripts like `seed-admin.ts` to help create initial test users, but these must never be used in production.)_

### 5. Running the Development Server

Start the local development server:

```bash
npm run dev
```

The application will be available at `http://localhost:3000`.

### 6. Build Commands

To create a production build:

```bash
npm run build
```

To preview the production build locally:

```bash
npm run preview
```

---

## Git Collaboration Workflow

1. **Never commit secrets**: Ensure your local `.env` and `.env.*` files are never tracked or committed.
2. **Branching**: Create feature branches from `main` (e.g., `feature/add-gallery-component`).
3. **Linting**: Ensure code passes linting (`npm run lint`) before creating a pull request.
4. **Commits**: Write clear, descriptive commit messages.
