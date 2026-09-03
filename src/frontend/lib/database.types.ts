/* eslint-disable @typescript-eslint/no-explicit-any */
import { definitions } from "./database.openapi.types";

export interface Database {
  public: {
    Tables: {
      users: {
        Row: definitions["users"] & {
          phone?: string | null;
          profile_image_id?: string | null;
        };
        Insert: Partial<definitions["users"]> & {
          phone?: string | null;
          profile_image_id?: string | null;
        };
        Update: Partial<definitions["users"]> & {
          phone?: string | null;
          profile_image_id?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "users_profile_image_id_fkey";
            columns: ["profile_image_id"];
            isOneToOne: false;
            referencedRelation: "media";
            referencedColumns: ["id"];
          },
        ];
      };

      website_settings: {
        Row: definitions["website_settings"];
        Insert: Partial<definitions["website_settings"]>;
        Update: Partial<definitions["website_settings"]>;
        Relationships: any[];
      };

      role_permissions: {
        Row: definitions["role_permissions"];
        Insert: Partial<definitions["role_permissions"]>;
        Update: Partial<definitions["role_permissions"]>;
        Relationships: any[];
      };

      announcements: {
        Row: Omit<definitions["announcements"], "main_image_id"> & {
          main_image_id?: string | null;
          slug?: string | null;
        };
        Insert: Omit<Partial<definitions["announcements"]>, "main_image_id"> & {
          main_image_id?: string | null;
          slug?: string | null;
        };
        Update: Omit<Partial<definitions["announcements"]>, "main_image_id"> & {
          main_image_id?: string | null;
          slug?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "announcements_main_image_id_fkey";
            columns: ["main_image_id"];
            isOneToOne: false;
            referencedRelation: "media";
            referencedColumns: ["id"];
          },
        ];
      };

      vacancies: {
        Row: definitions["vacancies"];
        Insert: Partial<definitions["vacancies"]>;
        Update: Partial<definitions["vacancies"]>;
        Relationships: any[];
      };

      registrar_information: {
        Row: definitions["registrar_information"];
        Insert: Partial<definitions["registrar_information"]>;
        Update: Partial<definitions["registrar_information"]>;
        Relationships: any[];
      };

      news: {
        Row: Omit<definitions["news"], "featured_image_id"> & {
          featured_image_id?: string | null;
        };
        Insert: Omit<Partial<definitions["news"]>, "featured_image_id"> & {
          featured_image_id?: string | null;
        };
        Update: Omit<Partial<definitions["news"]>, "featured_image_id"> & {
          featured_image_id?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "news_featured_image_id_fkey";
            columns: ["featured_image_id"];
            isOneToOne: false;
            referencedRelation: "media";
            referencedColumns: ["id"];
          },
        ];
      };

      services: {
        Row: Omit<definitions["services"], "main_image_id"> & {
          main_image_id?: string | null;
          slug?: string | null;
        };
        Insert: Omit<Partial<definitions["services"]>, "main_image_id"> & {
          main_image_id?: string | null;
          slug?: string | null;
        };
        Update: Omit<Partial<definitions["services"]>, "main_image_id"> & {
          main_image_id?: string | null;
          slug?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "services_main_image_id_fkey";
            columns: ["main_image_id"];
            isOneToOne: false;
            referencedRelation: "media";
            referencedColumns: ["id"];
          },
        ];
      };

      activity_logs: {
        Row: definitions["activity_logs"];
        Insert: Partial<definitions["activity_logs"]>;
        Update: Partial<definitions["activity_logs"]>;
        Relationships: any[];
      };

      media: {
        Row: definitions["media"];
        Insert: Partial<definitions["media"]>;
        Update: Partial<definitions["media"]>;
        Relationships: any[];
      };

      programs: {
        Row: Omit<definitions["programs"], "main_image_id"> & { main_image_id?: string | null };
        Insert: Partial<
          Omit<definitions["programs"], "main_image_id"> & { main_image_id?: string | null }
        >;
        Update: Partial<
          Omit<definitions["programs"], "main_image_id"> & { main_image_id?: string | null }
        >;
        Relationships: [
          {
            foreignKeyName: "programs_main_image_id_fkey";
            columns: ["main_image_id"];
            isOneToOne: false;
            referencedRelation: "media";
            referencedColumns: ["id"];
          },
        ];
      };

      events: {
        Row: Omit<definitions["events"], "event_image_id"> & {
          event_image_id?: string | null;
          slug?: string | null;
        };
        Insert: Omit<Partial<definitions["events"]>, "event_image_id"> & {
          event_image_id?: string | null;
          slug?: string | null;
        };
        Update: Omit<Partial<definitions["events"]>, "event_image_id"> & {
          event_image_id?: string | null;
          slug?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "events_event_image_id_fkey";
            columns: ["event_image_id"];
            isOneToOne: false;
            referencedRelation: "media";
            referencedColumns: ["id"];
          },
        ];
      };

      administrative_offices: {
        Row: Omit<definitions["administrative_offices"], "main_image_id"> & {
          main_image_id?: string | null;
          slug?: string | null;
        };
        Insert: Omit<Partial<definitions["administrative_offices"]>, "main_image_id"> & {
          main_image_id?: string | null;
          slug?: string | null;
        };
        Update: Omit<Partial<definitions["administrative_offices"]>, "main_image_id"> & {
          main_image_id?: string | null;
          slug?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "administrative_offices_main_image_id_fkey";
            columns: ["main_image_id"];
            isOneToOne: false;
            referencedRelation: "media";
            referencedColumns: ["id"];
          },
        ];
      };

      roles: {
        Row: definitions["roles"];
        Insert: Partial<definitions["roles"]>;
        Update: Partial<definitions["roles"]>;
        Relationships: any[];
      };

      gallery_images: {
        Row: definitions["gallery_images"];
        Insert: Partial<definitions["gallery_images"]>;
        Update: Partial<definitions["gallery_images"]>;
        Relationships: any[];
      };

      research_facilities: {
        Row: definitions["research_facilities"];
        Insert: Partial<definitions["research_facilities"]>;
        Update: Partial<definitions["research_facilities"]>;
        Relationships: any[];
      };

      academic_units: {
        Row: Omit<definitions["academic_units"], "main_image_id"> & {
          main_image_id?: string | null;
        };
        Insert: Partial<
          Omit<definitions["academic_units"], "main_image_id"> & { main_image_id?: string | null }
        >;
        Update: Partial<
          Omit<definitions["academic_units"], "main_image_id"> & { main_image_id?: string | null }
        >;
        Relationships: any[];
      };

      leadership: {
        Row: definitions["leadership"];
        Insert: Partial<definitions["leadership"]>;
        Update: Partial<definitions["leadership"]>;
        Relationships: any[];
      };

      community_engagements: {
        Row: definitions["community_engagements"];
        Insert: Partial<definitions["community_engagements"]>;
        Update: Partial<definitions["community_engagements"]>;
        Relationships: any[];
      };

      pages: {
        Row: Omit<
          definitions["pages"],
          "main_image_id" | "featured_image_id" | "parent_id" | "short_description" | "content"
        > & {
          short_description?: string | null;
          content?: string | null;
          parent_id?: string | null;
          main_image_id?: string | null;
          featured_image_id?: string | null;
          main_image?: { id: string; file_url: string } | null;
          featured_image?: { id: string; file_url: string } | null;
        };
        Insert: Omit<
          Partial<definitions["pages"]>,
          "main_image_id" | "featured_image_id" | "parent_id" | "short_description" | "content"
        > & {
          short_description?: string | null;
          content?: string | null;
          parent_id?: string | null;
          main_image_id?: string | null;
          featured_image_id?: string | null;
        };
        Update: Omit<
          Partial<definitions["pages"]>,
          "main_image_id" | "featured_image_id" | "parent_id" | "short_description" | "content"
        > & {
          short_description?: string | null;
          content?: string | null;
          parent_id?: string | null;
          main_image_id?: string | null;
          featured_image_id?: string | null;
        };
        Relationships: any[];
      };

      registrar_announcements: {
        Row: definitions["registrar_announcements"];
        Insert: Partial<definitions["registrar_announcements"]>;
        Update: Partial<definitions["registrar_announcements"]>;
        Relationships: any[];
      };

      homepage_sections: {
        Row: definitions["homepage_sections"];
        Insert: Partial<definitions["homepage_sections"]>;
        Update: Partial<definitions["homepage_sections"]>;
        Relationships: any[];
      };

      research_projects: {
        Row: definitions["research_projects"];
        Insert: Partial<definitions["research_projects"]>;
        Update: Partial<definitions["research_projects"]>;
        Relationships: any[];
      };

      navigation_items: {
        Row: definitions["navigation_items"];
        Insert: Partial<definitions["navigation_items"]>;
        Update: Partial<definitions["navigation_items"]>;
        Relationships: any[];
      };

      contact_messages: {
        Row: definitions["contact_messages"];
        Insert: Partial<definitions["contact_messages"]>;
        Update: Partial<definitions["contact_messages"]>;
        Relationships: any[];
      };

      permissions: {
        Row: definitions["permissions"];
        Insert: Partial<definitions["permissions"]>;
        Update: Partial<definitions["permissions"]>;
        Relationships: any[];
      };

      galleries: {
        Row: definitions["galleries"];
        Insert: Partial<definitions["galleries"]>;
        Update: Partial<definitions["galleries"]>;
        Relationships: any[];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
  };
}
