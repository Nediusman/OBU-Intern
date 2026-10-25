import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  useRouterState,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";
import { supabase } from "@/frontend/lib/supabase";
import { getSiteSettings, type SiteSettingsRecord } from "@/backend/api";

import appCss from "../styles.css?url";

import { Navbar } from "@/frontend/components/Navbar";
import { Footer } from "@/frontend/components/Footer";
import { AuthProvider as LegacyAuthProvider } from "@/frontend/contexts/AuthContext";
import { Toaster } from "@/frontend/components/ui/sonner";
import { TooltipProvider } from "@/frontend/components/ui/tooltip";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold text-foreground">404</h1>
        <h2 className="mt-4 text-xl font-semibold text-foreground">Page not found</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Go home
          </Link>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  const router = useRouter();
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-2xl font-bold text-foreground">Something went wrong</h1>
        <p className="mt-2 text-sm text-muted-foreground">{error.message}</p>
        <div className="mt-6 flex justify-center gap-4">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Try again
          </button>
          <a
            href="/"
            className="inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent"
          >
            Go home
          </a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  loader: async (): Promise<SiteSettingsRecord | null> => {
    try {
      const settings = await getSiteSettings();
      if (settings) return settings;
    } catch (e) {
      console.error("Failed to load site settings via getSiteSettings", e);
    }
    const { data, error } = await supabase
      .from("website_settings")
      .select("*")
      .order("updated_at", { ascending: false })
      .limit(1)
      .maybeSingle();
    if (error) {
      console.error("Failed to load site settings from Supabase", error);
      return null;
    }
    if (!data) return null;
    const mediaIds = [data.logo_id, data.favicon_id].filter((id): id is string => Boolean(id));
    const { data: media } = mediaIds.length
      ? await supabase.from("media").select("id, file_url").in("id", mediaIds)
      : { data: [] };
    const mediaById = new Map((media ?? []).map((item) => [item.id, item.file_url]));
    return {
      ...data,
      logo_id: data.logo_id || undefined,
      favicon_id: data.favicon_id || undefined,
      logo_url: data.logo_id ? mediaById.get(data.logo_id) : undefined,
      favicon_url: data.favicon_id ? mediaById.get(data.favicon_id) : undefined,
    } as SiteSettingsRecord;
  },
  head: (ctx) => {
    const settings = ctx.loaderData;
    const title = settings?.website_title || "Oda Bultum University";
    const desc =
      settings?.footer_text ||
      "A center of excellence for education, research, and community development in Ethiopia.";
    const faviconUrl = settings?.favicon_url || "/logo.png";
    return {
      meta: [
        { charSet: "utf-8" },
        { name: "viewport", content: "width=device-width, initial-scale=1" },
        { title: title },
        {
          name: "description",
          content: desc,
        },
        { name: "author", content: "Oda Bultum University" },
        { property: "og:title", content: title },
        {
          property: "og:description",
          content: desc,
        },
        { property: "og:type", content: "website" },
        { name: "twitter:card", content: "summary_large_image" },
        { name: "twitter:site", content: "@OdaBultumUniversity" },
      ],
      links: [
        {
          rel: "stylesheet",
          href: appCss,
        },
        { rel: "preconnect", href: "https://fonts.googleapis.com" },
        {
          rel: "preconnect",
          href: "https://fonts.gstatic.com",
          crossOrigin: "anonymous",
        },
        {
          rel: "stylesheet",
          href: "https://fonts.googleapis.com/css2?family=IBM+Plex+Sans:ital,wght@0,400;0,500;0,600;0,700;1,400&family=Libre+Baskerville:ital,wght@0,400;0,700;1,400&family=Fraunces:opsz,wght@9..144,500;9..144,600;9..144,700&family=Public+Sans:wght@400;500;600;700&display=swap",
        },
        {
          rel: "icon",
          href: faviconUrl,
          type: faviconUrl.endsWith(".svg")
            ? "image/svg+xml"
            : faviconUrl.endsWith(".ico")
              ? "image/x-icon"
              : "image/png",
        },
        { rel: "shortcut icon", href: faviconUrl },
        { rel: "apple-touch-icon", href: faviconUrl },
      ],
    };
  },
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

import { LanguageProvider } from "@/frontend/contexts/LanguageContext";

function RootComponent() {
  const { queryClient } = Route.useRouteContext();

  return (
    <QueryClientProvider client={queryClient}>
      <LegacyAuthProvider>
        <LanguageProvider>
          <TooltipProvider delayDuration={200}>
            <AppShell />
            <Toaster richColors position="top-right" />
          </TooltipProvider>
        </LanguageProvider>
      </LegacyAuthProvider>
    </QueryClientProvider>
  );
}

import { useRealtimeUpdates } from "@/frontend/hooks/useRealtimeUpdates";

function AppShell() {
  const settings = Route.useLoaderData();
  useRealtimeUpdates();
  // Hide the public Navbar/Footer on all _admin layout routes
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const isAdminRoute = pathname === "/admin" || pathname.startsWith("/admin/");

  if (isAdminRoute) {
    return <Outlet />;
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar settings={settings || undefined} />
      <main className="flex-1 focus:outline-none" id="main-content" tabIndex={-1}>
        <Outlet />
      </main>
      <Footer settings={settings || undefined} />
    </div>
  );
}
