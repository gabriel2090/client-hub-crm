export type UserRole = 'admin' | 'client';

export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  company?: string;
  role: UserRole;
  status: 'active' | 'inactive';
  created_at: string;
}

export interface Product {
  id: string;
  user_id: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  image_url?: string;
  created_at: string;
}

export interface Sale {
  id: string;
  product_id: string;
  quantity: number;
  total_amount: number;
  created_at: string;
}

export interface DashboardMetric {
  label: string;
  value: string | number;
  change?: number;
  icon: React.ReactNode;
}

export interface Activity {
  id: string;
  type: 'client_created' | 'client_updated' | 'product_created' | 'sale_made';
  description: string;
  timestamp: string;
}
