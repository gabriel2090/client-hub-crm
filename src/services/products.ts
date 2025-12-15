/**
 * Servicio de Productos
 * Operaciones CRUD para la tabla 'products' en Supabase
 */

import { supabase } from './supabase';
import { Product } from '@/types';

/**
 * Obtiene todos los productos del usuario actual
 */
export async function fetchProducts(userId: string) {
  try {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;

    return {
      success: true,
      data: (data || []) as Product[],
    };
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to fetch products';
    return {
      success: false,
      error: message,
    };
  }
}

/**
 * Obtiene un producto por ID
 */
export async function fetchProductById(id: string) {
  try {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;

    return {
      success: true,
      data: data as Product,
    };
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to fetch product';
    return {
      success: false,
      error: message,
    };
  }
}

/**
 * Crea un nuevo producto
 */
export async function createProduct(userId: string, productData: Partial<Product>) {
  try {
    const { data, error } = await supabase
      .from('products')
      .insert([
        {
          user_id: userId,
          name: productData.name,
          description: productData.description,
          price: productData.price,
          stock: productData.stock,
          image_url: productData.image_url,
          created_at: new Date().toISOString(),
        },
      ])
      .select()
      .single();

    if (error) throw error;

    return {
      success: true,
      data: data as Product,
    };
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to create product';
    return {
      success: false,
      error: message,
    };
  }
}

/**
 * Actualiza un producto existente
 */
export async function updateProduct(id: string, updates: Partial<Product>) {
  try {
    const { data, error } = await supabase
      .from('products')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;

    return {
      success: true,
      data: data as Product,
    };
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to update product';
    return {
      success: false,
      error: message,
    };
  }
}

/**
 * Elimina un producto
 */
export async function deleteProduct(id: string) {
  try {
    const { error } = await supabase
      .from('products')
      .delete()
      .eq('id', id);

    if (error) throw error;

    return { success: true };
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to delete product';
    return {
      success: false,
      error: message,
    };
  }
}

/**
 * Busca productos por nombre o descripción
 */
export async function searchProducts(userId: string, query: string) {
  try {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('user_id', userId)
      .or(`name.ilike.%${query}%,description.ilike.%${query}%`)
      .order('created_at', { ascending: false });

    if (error) throw error;

    return {
      success: true,
      data: (data || []) as Product[],
    };
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to search products';
    return {
      success: false,
      error: message,
    };
  }
}

/**
 * Actualiza el stock de un producto
 */
export async function updateStock(id: string, quantity: number) {
  try {
    // Obtener stock actual
    const { data: product, error: fetchError } = await supabase
      .from('products')
      .select('stock')
      .eq('id', id)
      .single();

    if (fetchError) throw fetchError;

    const newStock = (product.stock || 0) - quantity;

    // Actualizar stock
    const { data, error } = await supabase
      .from('products')
      .update({ stock: newStock })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;

    return {
      success: true,
      data: data as Product,
    };
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to update stock';
    return {
      success: false,
      error: message,
    };
  }
}
