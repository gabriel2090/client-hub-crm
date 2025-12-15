/**
 * Hooks de React Query para integración futura con backend
 * Estos hooks están listos para usar cuando conectes tu API backend
 * 
 * Instalación requerida:
 * npm install @tanstack/react-query
 * 
 * Ejemplo de uso en componentes:
 * 
 * const { data: clients, isLoading } = useGetClients();
 * const createClientMutation = useCreateClient();
 * 
 * if (isLoading) return <div>Cargando...</div>;
 * 
 * const handleCreate = async (data) => {
 *   await createClientMutation.mutateAsync(data);
 * };
 */

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { User, Product, Sale } from '@/types';

// ============ CLIENTES ============

/**
 * Hook para obtener lista de clientes
 * GET /api/clients
 */
export const useGetClients = () => {
  return useQuery({
    queryKey: ['clients'],
    queryFn: async () => {
      // const response = await fetch('/api/clients');
      // return response.json();
      // Por ahora retorna vacío para no romper
      return [] as User[];
    },
  });
};

/**
 * Hook para obtener un cliente por ID
 * GET /api/clients/:id
 */
export const useGetClient = (id: string) => {
  return useQuery({
    queryKey: ['clients', id],
    queryFn: async () => {
      // const response = await fetch(`/api/clients/${id}`);
      // return response.json();
      return null as User | null;
    },
    enabled: !!id,
  });
};

/**
 * Hook para crear un cliente
 * POST /api/clients
 */
export const useCreateClient = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (data: Partial<User> & { password?: string }) => {
      // const response = await fetch('/api/clients', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(data),
      // });
      // return response.json();
      return { ...data, id: '1' } as User;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clients'] });
    },
  });
};

/**
 * Hook para actualizar un cliente
 * PUT /api/clients/:id
 */
export const useUpdateClient = (id: string) => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (data: Partial<User>) => {
      // const response = await fetch(`/api/clients/${id}`, {
      //   method: 'PUT',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(data),
      // });
      // return response.json();
      return data as User;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clients'] });
      queryClient.invalidateQueries({ queryKey: ['clients', id] });
    },
  });
};

/**
 * Hook para eliminar un cliente
 * DELETE /api/clients/:id
 */
export const useDeleteClient = (id: string) => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async () => {
      // await fetch(`/api/clients/${id}`, { method: 'DELETE' });
      return null;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clients'] });
    },
  });
};

// ============ PRODUCTOS ============

/**
 * Hook para obtener productos de un usuario
 * GET /api/products?user_id=:id
 */
export const useGetProducts = (userId: string) => {
  return useQuery({
    queryKey: ['products', userId],
    queryFn: async () => {
      // const response = await fetch(`/api/products?user_id=${userId}`);
      // return response.json();
      return [] as Product[];
    },
    enabled: !!userId,
  });
};

/**
 * Hook para crear un producto
 * POST /api/products
 */
export const useCreateProduct = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (data: Partial<Product>) => {
      // const response = await fetch('/api/products', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(data),
      // });
      // return response.json();
      return { ...data, id: '1' } as Product;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
  });
};

/**
 * Hook para actualizar un producto
 * PUT /api/products/:id
 */
export const useUpdateProduct = (id: string) => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (data: Partial<Product>) => {
      // const response = await fetch(`/api/products/${id}`, {
      //   method: 'PUT',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(data),
      // });
      // return response.json();
      return data as Product;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
  });
};

/**
 * Hook para eliminar un producto
 * DELETE /api/products/:id
 */
export const useDeleteProduct = (id: string) => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async () => {
      // await fetch(`/api/products/${id}`, { method: 'DELETE' });
      return null;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
  });
};

// ============ VENTAS ============

/**
 * Hook para obtener ventas
 * GET /api/sales
 */
export const useGetSales = () => {
  return useQuery({
    queryKey: ['sales'],
    queryFn: async () => {
      // const response = await fetch('/api/sales');
      // return response.json();
      return [] as Sale[];
    },
  });
};

/**
 * Hook para registrar una venta
 * POST /api/sales
 */
export const useCreateSale = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (data: Partial<Sale>) => {
      // const response = await fetch('/api/sales', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(data),
      // });
      // return response.json();
      return { ...data, id: '1' } as Sale;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sales'] });
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
  });
};
