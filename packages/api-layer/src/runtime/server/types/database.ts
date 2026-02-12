export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      portals: {
        Row: {
          id: string;
          key: string;
          name: string;
          is_original: boolean;
          is_active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          key: string;
          name: string;
          is_original?: boolean;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          key?: string;
          name?: string;
          is_original?: boolean;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
      profiles: {
        Row: {
          id: string;
          user_id: string;
          portal_id: string;
          display_name: string | null;
          email_snapshot: string | null;
          status: "active" | "suspended" | "archived";
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          portal_id: string;
          display_name?: string | null;
          email_snapshot?: string | null;
          status?: "active" | "suspended" | "archived";
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          portal_id?: string;
          display_name?: string | null;
          email_snapshot?: string | null;
          status?: "active" | "suspended" | "archived";
          created_at?: string;
          updated_at?: string;
        };
      };
      shops: {
        Row: {
          id: string;
          portal_id: string;
          name: string;
          status: "active" | "suspended" | "archived";
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          portal_id: string;
          name: string;
          status?: "active" | "suspended" | "archived";
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          portal_id?: string;
          name?: string;
          status?: "active" | "suspended" | "archived";
          created_at?: string;
          updated_at?: string;
        };
      };
      plans: {
        Row: {
          id: string;
          portal_id: string;
          name: string;
          slug: string;
          price_amount: number;
          currency: string;
          billing_interval: string;
          trial_days: number;
          stripe_product_id: string | null;
          stripe_price_id: string | null;
          stripe_mode: string;
          features: Json;
          sort_order: number;
          is_active: boolean;
          is_public: boolean;
          is_coming_soon: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          portal_id: string;
          name: string;
          slug: string;
          price_amount: number;
          currency?: string;
          billing_interval?: string;
          trial_days?: number;
          stripe_product_id?: string | null;
          stripe_price_id?: string | null;
          stripe_mode?: string;
          features?: Json;
          sort_order?: number;
          is_active?: boolean;
          is_public?: boolean;
          is_coming_soon?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          portal_id?: string;
          name?: string;
          slug?: string;
          price_amount?: number;
          currency?: string;
          billing_interval?: string;
          trial_days?: number;
          stripe_product_id?: string | null;
          stripe_price_id?: string | null;
          stripe_mode?: string;
          features?: Json;
          sort_order?: number;
          is_active?: boolean;
          is_public?: boolean;
          is_coming_soon?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
    };
  };
}

// Helper types for easier usage
export type Tables<T extends keyof Database["public"]["Tables"]> =
  Database["public"]["Tables"][T]["Row"];
export type TablesInsert<T extends keyof Database["public"]["Tables"]> =
  Database["public"]["Tables"][T]["Insert"];
export type TablesUpdate<T extends keyof Database["public"]["Tables"]> =
  Database["public"]["Tables"][T]["Update"];
