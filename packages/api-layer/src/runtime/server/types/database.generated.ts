export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  graphql_public: {
    Tables: {
      [_ in never]: never
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      graphql: {
        Args: {
          extensions?: Json
          operationName?: string
          query?: string
          variables?: Json
        }
        Returns: Json
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
  public: {
    Tables: {
      inventory: {
        Row: {
          created_at: string | null
          created_by: string | null
          id: string
          invoice_id: string | null
          product_id: string
          quantity_change: number
          reason: string
          shop_id: string
          vendor_price: number | null
        }
        Insert: {
          created_at?: string | null
          created_by?: string | null
          id?: string
          invoice_id?: string | null
          product_id: string
          quantity_change: number
          reason: string
          shop_id: string
          vendor_price?: number | null
        }
        Update: {
          created_at?: string | null
          created_by?: string | null
          id?: string
          invoice_id?: string | null
          product_id?: string
          quantity_change?: number
          reason?: string
          shop_id?: string
          vendor_price?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "inventory_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "shop_members"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "inventory_invoice_id_fkey"
            columns: ["invoice_id"]
            isOneToOne: false
            referencedRelation: "invoices"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "inventory_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "inventory_shop_id_fkey"
            columns: ["shop_id"]
            isOneToOne: false
            referencedRelation: "shops"
            referencedColumns: ["id"]
          },
        ]
      }
      invoice_item_cogs: {
        Row: {
          batch_id: string
          created_at: string | null
          id: string
          invoice_item_id: number
          product_id: string
          qty: number
          total_cost: number
          unit_cost: number
        }
        Insert: {
          batch_id: string
          created_at?: string | null
          id?: string
          invoice_item_id: number
          product_id: string
          qty: number
          total_cost: number
          unit_cost: number
        }
        Update: {
          batch_id?: string
          created_at?: string | null
          id?: string
          invoice_item_id?: number
          product_id?: string
          qty?: number
          total_cost?: number
          unit_cost?: number
        }
        Relationships: [
          {
            foreignKeyName: "invoice_item_cogs_invoice_item_id_fkey"
            columns: ["invoice_item_id"]
            isOneToOne: false
            referencedRelation: "invoice_items"
            referencedColumns: ["id"]
          },
        ]
      }
      invoice_items: {
        Row: {
          description: string | null
          discount: number
          id: number
          invoice_id: string
          item_type: string
          line_total: number
          product_id: string | null
          quantity: number
          service_id: string | null
          unit_price: number
        }
        Insert: {
          description?: string | null
          discount?: number
          id?: number
          invoice_id: string
          item_type: string
          line_total?: number
          product_id?: string | null
          quantity?: number
          service_id?: string | null
          unit_price?: number
        }
        Update: {
          description?: string | null
          discount?: number
          id?: number
          invoice_id?: string
          item_type?: string
          line_total?: number
          product_id?: string | null
          quantity?: number
          service_id?: string | null
          unit_price?: number
        }
        Relationships: [
          {
            foreignKeyName: "invoice_items_invoice_id_fkey"
            columns: ["invoice_id"]
            isOneToOne: false
            referencedRelation: "invoices"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "invoice_items_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "invoice_items_service_id_fkey"
            columns: ["service_id"]
            isOneToOne: false
            referencedRelation: "services"
            referencedColumns: ["id"]
          },
        ]
      }
      invoices: {
        Row: {
          created_at: string | null
          created_by: string
          customer_name: string | null
          deleted_at: string | null
          discount: number
          extra_discount: number
          id: string
          invoice_source: string
          kind: string | null
          shop_id: string
          total: number
        }
        Insert: {
          created_at?: string | null
          created_by: string
          customer_name?: string | null
          deleted_at?: string | null
          discount?: number
          extra_discount?: number
          id?: string
          invoice_source?: string
          kind?: string | null
          shop_id: string
          total?: number
        }
        Update: {
          created_at?: string | null
          created_by?: string
          customer_name?: string | null
          deleted_at?: string | null
          discount?: number
          extra_discount?: number
          id?: string
          invoice_source?: string
          kind?: string | null
          shop_id?: string
          total?: number
        }
        Relationships: [
          {
            foreignKeyName: "invoices_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "shop_members"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "invoices_shop_id_fkey"
            columns: ["shop_id"]
            isOneToOne: false
            referencedRelation: "shops"
            referencedColumns: ["id"]
          },
        ]
      }
      modules: {
        Row: {
          description: string | null
          key: string
          name: string
        }
        Insert: {
          description?: string | null
          key: string
          name: string
        }
        Update: {
          description?: string | null
          key?: string
          name?: string
        }
        Relationships: []
      }
      plan_modules: {
        Row: {
          id: number
          module_key: string
          plan_id: string
        }
        Insert: {
          id?: number
          module_key: string
          plan_id: string
        }
        Update: {
          id?: number
          module_key?: string
          plan_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "plan_modules_module_key_fkey"
            columns: ["module_key"]
            isOneToOne: false
            referencedRelation: "modules"
            referencedColumns: ["key"]
          },
          {
            foreignKeyName: "plan_modules_plan_id_fkey"
            columns: ["plan_id"]
            isOneToOne: false
            referencedRelation: "plans"
            referencedColumns: ["id"]
          },
        ]
      }
      plans: {
        Row: {
          billing_interval: string
          created_at: string | null
          currency: string
          description: string | null
          features: Json
          id: string
          is_active: boolean
          is_coming_soon: boolean
          is_public: boolean
          key: string
          name: string
          price_amount: number
          price_monthly: number
          soon: boolean
          sort_order: number
          stripe_mode: string | null
          stripe_price_id: string | null
          stripe_product_id: string | null
          trial_days: number
        }
        Insert: {
          billing_interval?: string
          created_at?: string | null
          currency?: string
          description?: string | null
          features?: Json
          id?: string
          is_active?: boolean
          is_coming_soon?: boolean
          is_public?: boolean
          key: string
          name: string
          price_amount?: number
          price_monthly: number
          soon?: boolean
          sort_order?: number
          stripe_mode?: string | null
          stripe_price_id?: string | null
          stripe_product_id?: string | null
          trial_days?: number
        }
        Update: {
          billing_interval?: string
          created_at?: string | null
          currency?: string
          description?: string | null
          features?: Json
          id?: string
          is_active?: boolean
          is_coming_soon?: boolean
          is_public?: boolean
          key?: string
          name?: string
          price_amount?: number
          price_monthly?: number
          soon?: boolean
          sort_order?: number
          stripe_mode?: string | null
          stripe_price_id?: string | null
          stripe_product_id?: string | null
          trial_days?: number
        }
        Relationships: []
      }
      portals: {
        Row: {
          created_at: string
          id: string
          is_active: boolean
          is_original: boolean
          key: string
          name: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          is_active?: boolean
          is_original?: boolean
          key: string
          name: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          is_active?: boolean
          is_original?: boolean
          key?: string
          name?: string
          updated_at?: string
        }
        Relationships: []
      }
      products: {
        Row: {
          created_at: string | null
          deleted_at: string | null
          discount: number
          id: string
          low_stock_threshold: number | null
          name: string
          price: number
          shop_id: string
          sku: string | null
          stock: number
          vendor_price: number
        }
        Insert: {
          created_at?: string | null
          deleted_at?: string | null
          discount?: number
          id?: string
          low_stock_threshold?: number | null
          name: string
          price?: number
          shop_id: string
          sku?: string | null
          stock?: number
          vendor_price?: number
        }
        Update: {
          created_at?: string | null
          deleted_at?: string | null
          discount?: number
          id?: string
          low_stock_threshold?: number | null
          name?: string
          price?: number
          shop_id?: string
          sku?: string | null
          stock?: number
          vendor_price?: number
        }
        Relationships: [
          {
            foreignKeyName: "products_shop_id_fkey"
            columns: ["shop_id"]
            isOneToOne: false
            referencedRelation: "shops"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          created_at: string
          display_name: string | null
          email_snapshot: string | null
          id: string
          portal_id: string
          status: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          display_name?: string | null
          email_snapshot?: string | null
          id?: string
          portal_id: string
          status?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          display_name?: string | null
          email_snapshot?: string | null
          id?: string
          portal_id?: string
          status?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "profiles_portal_id_fkey"
            columns: ["portal_id"]
            isOneToOne: false
            referencedRelation: "portals"
            referencedColumns: ["id"]
          },
        ]
      }
      services: {
        Row: {
          created_at: string | null
          deleted_at: string | null
          discount: number | null
          id: string
          name: string
          price: number
          shop_id: string
        }
        Insert: {
          created_at?: string | null
          deleted_at?: string | null
          discount?: number | null
          id?: string
          name: string
          price?: number
          shop_id: string
        }
        Update: {
          created_at?: string | null
          deleted_at?: string | null
          discount?: number | null
          id?: string
          name?: string
          price?: number
          shop_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "services_shop_id_fkey"
            columns: ["shop_id"]
            isOneToOne: false
            referencedRelation: "shops"
            referencedColumns: ["id"]
          },
        ]
      }
      shop_members: {
        Row: {
          created_at: string | null
          deleted_at: string | null
          email: string | null
          full_name: string | null
          id: string
          role: string
          shop_id: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          deleted_at?: string | null
          email?: string | null
          full_name?: string | null
          id?: string
          role?: string
          shop_id: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          deleted_at?: string | null
          email?: string | null
          full_name?: string | null
          id?: string
          role?: string
          shop_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "shop_members_shop_id_fkey"
            columns: ["shop_id"]
            isOneToOne: false
            referencedRelation: "shops"
            referencedColumns: ["id"]
          },
        ]
      }
      shop_modules: {
        Row: {
          created_at: string | null
          enabled: boolean
          ends_at: string | null
          id: string
          module_key: string
          plan: string | null
          shop_id: string
          starts_at: string | null
        }
        Insert: {
          created_at?: string | null
          enabled?: boolean
          ends_at?: string | null
          id?: string
          module_key: string
          plan?: string | null
          shop_id: string
          starts_at?: string | null
        }
        Update: {
          created_at?: string | null
          enabled?: boolean
          ends_at?: string | null
          id?: string
          module_key?: string
          plan?: string | null
          shop_id?: string
          starts_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "shop_modules_module_key_fkey"
            columns: ["module_key"]
            isOneToOne: false
            referencedRelation: "modules"
            referencedColumns: ["key"]
          },
          {
            foreignKeyName: "shop_modules_shop_id_fkey"
            columns: ["shop_id"]
            isOneToOne: false
            referencedRelation: "shops"
            referencedColumns: ["id"]
          },
        ]
      }
      shop_subscriptions: {
        Row: {
          created_at: string | null
          current_period_end: string | null
          current_period_start: string | null
          id: string
          is_current: boolean
          plan_id: string
          shop_id: string
          status: string
          stripe_customer_id: string | null
          stripe_price_id: string | null
          stripe_subscription_id: string | null
          trial_ends_at: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          current_period_end?: string | null
          current_period_start?: string | null
          id?: string
          is_current?: boolean
          plan_id: string
          shop_id: string
          status?: string
          stripe_customer_id?: string | null
          stripe_price_id?: string | null
          stripe_subscription_id?: string | null
          trial_ends_at?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          current_period_end?: string | null
          current_period_start?: string | null
          id?: string
          is_current?: boolean
          plan_id?: string
          shop_id?: string
          status?: string
          stripe_customer_id?: string | null
          stripe_price_id?: string | null
          stripe_subscription_id?: string | null
          trial_ends_at?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "shop_subscriptions_plan_id_fkey"
            columns: ["plan_id"]
            isOneToOne: false
            referencedRelation: "plans"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "shop_subscriptions_shop_id_fkey"
            columns: ["shop_id"]
            isOneToOne: false
            referencedRelation: "shops"
            referencedColumns: ["id"]
          },
        ]
      }
      shops: {
        Row: {
          created_at: string | null
          id: string
          name: string
          owner_id: string
          type: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          name: string
          owner_id: string
          type?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          name?: string
          owner_id?: string
          type?: string | null
        }
        Relationships: []
      }
      store_entries: {
        Row: {
          amount: number
          category: string | null
          created_at: string | null
          created_by: string | null
          deleted_at: string | null
          employee_id: string | null
          id: string
          kind: string
          note: string | null
          shop_id: string
        }
        Insert: {
          amount: number
          category?: string | null
          created_at?: string | null
          created_by?: string | null
          deleted_at?: string | null
          employee_id?: string | null
          id?: string
          kind: string
          note?: string | null
          shop_id: string
        }
        Update: {
          amount?: number
          category?: string | null
          created_at?: string | null
          created_by?: string | null
          deleted_at?: string | null
          employee_id?: string | null
          id?: string
          kind?: string
          note?: string | null
          shop_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "store_entries_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "shop_members"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "store_entries_employee_id_fkey"
            columns: ["employee_id"]
            isOneToOne: false
            referencedRelation: "shop_members"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "store_entries_shop_id_fkey"
            columns: ["shop_id"]
            isOneToOne: false
            referencedRelation: "shops"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      add_expense: {
        Args: {
          p_amount: number
          p_category: string
          p_employee_id?: string
          p_note?: string
          p_shop_id: string
        }
        Returns: string
      }
      add_store_entry: {
        Args: {
          p_amount: number
          p_category?: string
          p_employee_id?: string
          p_kind: string
          p_note?: string
          p_shop_id: string
        }
        Returns: string
      }
      allocate_fifo_for_item: {
        Args: { p_invoice_item_id: number }
        Returns: undefined
      }
      apply_plan_modules_to_shop: {
        Args: { p_plan_id: string; p_shop_id: string }
        Returns: undefined
      }
      dashboard_metrics: { Args: { p_shop: string }; Returns: Json }
      DELETE_get_shop_role: { Args: { shop: string }; Returns: string }
      DELETE_shop_has_module: {
        Args: { p_module_key: string; p_shop_id: string }
        Returns: boolean
      }
      fifo_cogs: { Args: { product: string }; Returns: number }
      fifo_cogs_for_invoice: { Args: { inv: string }; Returns: number }
      fifo_profit: { Args: { invoice: string }; Returns: number }
      invoice_cogs: { Args: { p_invoice: string }; Returns: number }
      invoice_revenue: { Args: { invoice: string }; Returns: number }
      is_shop_member:
        | { Args: { p_shop: string; p_user: string }; Returns: boolean }
        | { Args: { shop_id: string }; Returns: boolean }
      is_shop_owner: { Args: { target_user: string }; Returns: boolean }
      setup_shop_for_new_user: {
        Args: { p_plan_key: string; p_shop_name: string; p_user_id: string }
        Returns: Json
      }
      shop_access_state: { Args: { p_shop_id: string }; Returns: Json }
    }
    Enums: {
      [_ in never]: never
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
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
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
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
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
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
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
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
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
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  graphql_public: {
    Enums: {},
  },
  public: {
    Enums: {},
  },
} as const

