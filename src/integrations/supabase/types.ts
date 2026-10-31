export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.18"
  }
  public: {
    Tables: {
      projects: {
        Row: {
          approach: string
          category: string
          created_at: string
          creative_direction: string
          description: string
          duration: string
          featured: boolean
          id: string
          motion_details: string
          objective: string
          orientation: string
          published: boolean
          result: string
          slug: string
          software: string[]
          sort_order: number
          thumbnail_url: string
          title: string
          updated_at: string
          video_url: string
        }
        Insert: {
          approach?: string
          category: string
          created_at?: string
          creative_direction?: string
          description?: string
          duration?: string
          featured?: boolean
          id?: string
          motion_details?: string
          objective?: string
          orientation?: string
          published?: boolean
          result?: string
          slug: string
          software?: string[]
          sort_order?: number
          thumbnail_url?: string
          title: string
          updated_at?: string
          video_url?: string
        }
        Update: {
          approach?: string
          category?: string
          created_at?: string
          creative_direction?: string
          description?: string
          duration?: string
          featured?: boolean
          id?: string
          motion_details?: string
          objective?: string
          orientation?: string
          published?: boolean
          result?: string
          slug?: string
          software?: string[]
          sort_order?: number
          thumbnail_url?: string
          title?: string
          updated_at?: string
          video_url?: string
        }
        Relationships: []
      }
      services: {
        Row: {
          created_at: string
          cta_label: string
          deliverables: string[]
          description: string
          icon: string
          id: string
          name: string
          sort_order: number
          visible: boolean
        }
        Insert: {
          created_at?: string
          cta_label?: string
          deliverables?: string[]
          description?: string
          icon?: string
          id?: string
          name: string
          sort_order?: number
          visible?: boolean
        }
        Update: {
          created_at?: string
          cta_label?: string
          deliverables?: string[]
          description?: string
          icon?: string
          id?: string
          name?: string
          sort_order?: number
          visible?: boolean
        }
        Relationships: []
      }
      site_settings: {
        Row: {
          about_photo: string | null
          about_text: string
          after_video_url: string | null
          availability: string
          before_video_url: string | null
          brand_name: string
          email: string
          footer_text: string
          ga_id: string | null
          hero_headline: string
          hero_subtext: string
          id: number
          intro: string
          philosophy: string
          profile_photo: string | null
          seo_description: string
          seo_title: string
          showreel_thumbnail: string | null
          showreel_url: string | null
          socials: Json
          title: string
          updated_at: string
          whatsapp: string
        }
        Insert: {
          about_photo?: string | null
          about_text?: string
          after_video_url?: string | null
          availability?: string
          before_video_url?: string | null
          brand_name?: string
          email?: string
          footer_text?: string
          ga_id?: string | null
          hero_headline?: string
          hero_subtext?: string
          id?: number
          intro?: string
          philosophy?: string
          profile_photo?: string | null
          seo_description?: string
          seo_title?: string
          showreel_thumbnail?: string | null
          showreel_url?: string | null
          socials?: Json
          title?: string
          updated_at?: string
          whatsapp?: string
        }
        Update: {
          about_photo?: string | null
          about_text?: string
          after_video_url?: string | null
          availability?: string
          before_video_url?: string | null
          brand_name?: string
          email?: string
          footer_text?: string
          ga_id?: string | null
          hero_headline?: string
          hero_subtext?: string
          id?: number
          intro?: string
          philosophy?: string
          profile_photo?: string | null
          seo_description?: string
          seo_title?: string
          showreel_thumbnail?: string | null
          showreel_url?: string | null
          socials?: Json
          title?: string
          updated_at?: string
          whatsapp?: string
        }
        Relationships: []
      }
      testimonials: {
        Row: {
          approved: boolean
          client_name: string
          company: string
          created_at: string
          designation: string
          feedback: string
          id: string
          photo_url: string
          project_ref: string
        }
        Insert: {
          approved?: boolean
          client_name: string
          company?: string
          created_at?: string
          designation?: string
          feedback: string
          id?: string
          photo_url?: string
          project_ref?: string
        }
        Update: {
          approved?: boolean
          client_name?: string
          company?: string
          created_at?: string
          designation?: string
          feedback?: string
          id?: string
          photo_url?: string
          project_ref?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "user"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends (DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never) = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends (PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never) = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["admin", "user"],
    },
  },
} as const
