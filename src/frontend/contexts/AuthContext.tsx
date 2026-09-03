import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { supabase } from "@/frontend/lib/supabase";
import type { Session, User } from "@supabase/supabase-js";

export interface AdminUser {
  id: string;
  email: string;
  full_name?: string;
  phone?: string | null;
  profile_image_id?: string | null;
  profile_image_url?: string | null;
  role_id?: string;
  role_name?: string;
  is_active?: boolean;
  created_at?: string;
}

interface AuthContextValue {
  currentUser: AdminUser | null;
  session: Session | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  refreshUserProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [currentUser, setCurrentUser] = useState<AdminUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchUserProfile = async (user: User) => {
    try {
      const { data: profile, error } = await supabase
        .from("users")
        .select(
          `id, email, full_name, phone, profile_image_id, is_active, created_at, role_id, roles(name), media:profile_image_id(id, file_url)`,
        )
        .eq("id", user.id)
        .single();

      if (profile && !error) {
        if (user.email && profile.email !== user.email) {
          try {
            await supabase.from("users").update({ email: user.email }).eq("id", user.id);
            profile.email = user.email;
          } catch (syncErr) {
            console.error("Failed to sync email to public.users:", syncErr);
          }
        }
        const roleData = profile.roles as { name?: string } | null;
        const mediaData = (profile as unknown as { media?: { file_url?: string } | null }).media;
        setCurrentUser({
          id: profile.id,
          email: profile.email || user.email || "",
          full_name: profile.full_name,
          phone: profile.phone,
          profile_image_id: profile.profile_image_id,
          profile_image_url: mediaData?.file_url || null,
          role_id: profile.role_id,
          role_name: roleData?.name,
          is_active: profile.is_active,
          created_at: profile.created_at,
        });
      } else {
        // Fallback if public.users record doesn't exist
        setCurrentUser({
          id: user.id,
          email: user.email || "",
        });
      }
    } catch (err) {
      console.error("Error fetching user profile:", err);
      setCurrentUser({
        id: user.id,
        email: user.email || "",
      });
    }
  };

  const refreshUserProfile = async () => {
    const { data } = await supabase.auth.getSession();
    if (data.session?.user) {
      await fetchUserProfile(data.session.user);
    }
  };

  useEffect(() => {
    const initializeAuth = async () => {
      setIsLoading(true);
      const { data } = await supabase.auth.getSession();
      setSession(data.session);
      if (data.session?.user) {
        await fetchUserProfile(data.session.user);
      }
      setIsLoading(false);
    };

    initializeAuth();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      setSession(session);
      if (session?.user) {
        await fetchUserProfile(session.user);
      } else {
        setCurrentUser(null);
      }
      setIsLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const login = async (
    email: string,
    password: string,
  ): Promise<{ success: boolean; error?: string }> => {
    setIsLoading(true);
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    setIsLoading(false);

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true };
  };

  const logout = async () => {
    setIsLoading(true);
    await supabase.auth.signOut();
    setSession(null);
    setCurrentUser(null);
    setIsLoading(false);
  };

  return (
    <AuthContext.Provider
      value={{ currentUser, session, isLoading, login, logout, refreshUserProfile }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
