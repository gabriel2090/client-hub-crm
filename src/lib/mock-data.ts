import { User, Product, Sale, Activity } from '@/types';

export const mockClients: User[] = [
  {
    id: '1',
    name: 'Carlos Rodríguez',
    email: 'carlos@empresa.com',
    phone: '+52 555 123 4567',
    company: 'Tech Solutions SA',
    role: 'client',
    status: 'active',
    created_at: '2024-01-15T10:30:00Z',
  },
  {
    id: '2',
    name: 'María García',
    email: 'maria@comercio.mx',
    phone: '+52 555 987 6543',
    company: 'Comercio Digital MX',
    role: 'client',
    status: 'active',
    created_at: '2024-02-20T14:45:00Z',
  },
  {
    id: '3',
    name: 'Juan Martínez',
    email: 'juan@servicios.com',
    phone: '+52 555 456 7890',
    company: 'Servicios Integrales',
    role: 'client',
    status: 'inactive',
    created_at: '2024-03-10T09:15:00Z',
  },
  {
    id: '4',
    name: 'Ana López',
    email: 'ana@innovacion.tech',
    phone: '+52 555 321 0987',
    company: 'Innovación Tech',
    role: 'client',
    status: 'active',
    created_at: '2024-03-25T16:00:00Z',
  },
];

export const mockProducts: Product[] = [
  {
    id: '1',
    user_id: '1',
    name: 'Laptop Pro X500',
    description: 'Laptop de alto rendimiento para profesionales',
    price: 25999.99,
    stock: 15,
    image_url: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400',
    created_at: '2024-01-20T10:00:00Z',
  },
  {
    id: '2',
    user_id: '1',
    name: 'Monitor UltraWide 34"',
    description: 'Monitor curvo para productividad',
    price: 8999.99,
    stock: 8,
    image_url: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=400',
    created_at: '2024-02-15T14:30:00Z',
  },
  {
    id: '3',
    user_id: '1',
    name: 'Teclado Mecánico RGB',
    description: 'Teclado gaming con switches Cherry MX',
    price: 2499.99,
    stock: 25,
    image_url: 'https://images.unsplash.com/photo-1511467687858-23d96c32e4ae?w=400',
    created_at: '2024-03-01T09:45:00Z',
  },
  {
    id: '4',
    user_id: '1',
    name: 'Mouse Ergonómico',
    description: 'Mouse inalámbrico con diseño ergonómico',
    price: 899.99,
    stock: 42,
    image_url: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=400',
    created_at: '2024-03-10T11:20:00Z',
  },
];

export const mockSales: Sale[] = [
  { id: '1', product_id: '1', quantity: 2, total_amount: 51999.98, created_at: '2024-12-01T10:30:00Z' },
  { id: '2', product_id: '2', quantity: 1, total_amount: 8999.99, created_at: '2024-12-02T14:15:00Z' },
  { id: '3', product_id: '3', quantity: 5, total_amount: 12499.95, created_at: '2024-12-03T09:00:00Z' },
  { id: '4', product_id: '4', quantity: 3, total_amount: 2699.97, created_at: '2024-12-04T16:45:00Z' },
  { id: '5', product_id: '1', quantity: 1, total_amount: 25999.99, created_at: '2024-12-05T11:30:00Z' },
  { id: '6', product_id: '2', quantity: 2, total_amount: 17999.98, created_at: '2024-12-06T13:20:00Z' },
  { id: '7', product_id: '3', quantity: 8, total_amount: 19999.92, created_at: '2024-12-07T10:00:00Z' },
  { id: '8', product_id: '4', quantity: 6, total_amount: 5399.94, created_at: '2024-12-08T15:30:00Z' },
  { id: '9', product_id: '1', quantity: 3, total_amount: 77999.97, created_at: '2024-12-09T09:45:00Z' },
  { id: '10', product_id: '2', quantity: 1, total_amount: 8999.99, created_at: '2024-12-10T14:00:00Z' },
];

export const mockActivities: Activity[] = [
  {
    id: '1',
    type: 'client_created',
    description: 'Nuevo cliente registrado: Ana López',
    timestamp: '2024-12-10T16:00:00Z',
  },
  {
    id: '2',
    type: 'sale_made',
    description: 'Venta realizada: Monitor UltraWide 34"',
    timestamp: '2024-12-10T14:00:00Z',
  },
  {
    id: '3',
    type: 'product_created',
    description: 'Nuevo producto: Mouse Ergonómico',
    timestamp: '2024-12-10T11:20:00Z',
  },
  {
    id: '4',
    type: 'client_updated',
    description: 'Información actualizada: Carlos Rodríguez',
    timestamp: '2024-12-09T15:30:00Z',
  },
];

export const salesChartData = [
  { name: 'Lun', ventas: 12500 },
  { name: 'Mar', ventas: 18900 },
  { name: 'Mié', ventas: 15600 },
  { name: 'Jue', ventas: 22400 },
  { name: 'Vie', ventas: 28100 },
  { name: 'Sáb', ventas: 19800 },
  { name: 'Dom', ventas: 14200 },
];

export const monthlySalesData = [
  { name: 'Ene', ventas: 125000 },
  { name: 'Feb', ventas: 148000 },
  { name: 'Mar', ventas: 162000 },
  { name: 'Abr', ventas: 139000 },
  { name: 'May', ventas: 178000 },
  { name: 'Jun', ventas: 195000 },
  { name: 'Jul', ventas: 210000 },
  { name: 'Ago', ventas: 189000 },
  { name: 'Sep', ventas: 225000 },
  { name: 'Oct', ventas: 248000 },
  { name: 'Nov', ventas: 267000 },
  { name: 'Dic', ventas: 232597 },
];
