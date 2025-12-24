export default {};

declare global {
  interface ShopModule {
    module_key: string;
    name: string;
    description: string | null;
    plan: string | null;
    enabled: boolean;
    ends_at?: string;
  }

  type Column = {
    field: string;
    header: any;
    sortable?: boolean;
    type?: 'price' | 'date';
    style?: string;
    class?: string;
    value?: (...args: any) => any;
  };

  type Field = {
    key: string;
    label: any;
    type: string;
    options?: any[];
    value: any;
    helperText?: boolean;
    hide?: boolean;
    attrs?: Record<string, any>;
  };

  interface MenuItem {
    label: string;
    icon: string;
    to: string;
  }

  interface MenuSection {
    section: string;
    items: MenuItem[];
  }
}
