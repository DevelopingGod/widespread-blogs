export interface Category {
  id: string;
  slug: string;
  label: string;
  description: string;
  icon: string;
  hero_image: string;
  gradient: string;
  sort_order: number;
  created_at: string;
}

export interface Blog {
  id: string;
  title: string;
  author_name: string;
  image_url: string;
  content: string;
  category: string;          // slug reference
  user_id: string;
  is_flagged: boolean;
  flag_reason: string | null;
  created_at: string;
}

export interface Profile {
  id: string;
  name: string;
  email: string;
  is_admin: boolean;
  is_flagged: boolean;
  flag_reason: string | null;
  is_banned: boolean;
  ban_reason: string | null;
  admin_photo_url: string | null;
  created_at: string;
}

export interface SiteSettingRow {
  id: string;
  key: string;
  value: string;
  updated_at: string;
}

// ─── Supabase v2 Database type ──────────────────────────────────────────────
// Must match GenericTable shape exactly: Row, Insert, Update, Relationships
export type Database = {
  public: {
    Tables: {
      categories: {
        Row: Category;
        Insert: Omit<Category, 'id' | 'created_at'>;
        Update: Partial<Omit<Category, 'id' | 'created_at'>>;
        Relationships: [];
      };
      blogs: {
        Row: Blog;
        Insert: Omit<Blog, 'id' | 'created_at' | 'is_flagged' | 'flag_reason'>;
        Update: Partial<Omit<Blog, 'id' | 'created_at'>>;
        Relationships: [];
      };
      profiles: {
        Row: Profile;
        Insert: Omit<Profile, 'created_at' | 'is_admin' | 'is_flagged' | 'flag_reason' | 'is_banned' | 'ban_reason' | 'admin_photo_url'>;
        Update: Partial<Omit<Profile, 'id' | 'created_at'>>;
        Relationships: [];
      };
      site_settings: {
        Row: SiteSettingRow;
        Insert: { key: string; value: string; updated_at?: string };
        Update: { value?: string; updated_at?: string };
        Relationships: [];
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
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};
