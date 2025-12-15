/**
 * Servicio de Ventas
 * Operaciones para la tabla 'sales' en Supabase
 */

import { supabase } from './supabase';
import { Sale } from '@/types';

/**
 * Obtiene todas las ventas del usuario actual
 */
export async function fetchSales(userId: string) {
  try {
    const { data, error } = await supabase
      .from('sales')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;

    return {
      success: true,
      data: (data || []) as Sale[],
    };
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to fetch sales';
    return {
      success: false,
      error: message,
    };
  }
}

/**
 * Crea una nueva venta
 */
export async function createSale(userId: string, saleData: {
  product_id: string;
  quantity: number;
}) {
  try {
    // Primero obtener el precio del producto
    const { data: product, error: productError } = await supabase
      .from('products')
      .select('price, stock')
      .eq('id', saleData.product_id)
      .single();

    if (productError) throw productError;

    // Validar stock
    if (!product || product.stock < saleData.quantity) {
      throw new Error('Insufficient stock');
    }

    const totalAmount = (product.price || 0) * saleData.quantity;

    // Crear la venta
    const { data, error } = await supabase
      .from('sales')
      .insert([
        {
          user_id: userId,
          product_id: saleData.product_id,
          quantity: saleData.quantity,
          total_amount: totalAmount,
          created_at: new Date().toISOString(),
        },
      ])
      .select()
      .single();

    if (error) throw error;

    // Actualizar el stock del producto
    const { error: updateError } = await supabase
      .from('products')
      .update({ stock: product.stock - saleData.quantity })
      .eq('id', saleData.product_id);

    if (updateError) throw updateError;

    return {
      success: true,
      data: data as Sale,
    };
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to create sale';
    return {
      success: false,
      error: message,
    };
  }
}

/**
 * Obtiene las ventas del mes actual
 */
export async function fetchMonthlySales(userId: string) {
  try {
    const today = new Date();
    const firstDay = new Date(today.getFullYear(), today.getMonth(), 1);

    const { data, error } = await supabase
      .from('sales')
      .select('*')
      .eq('user_id', userId)
      .gte('created_at', firstDay.toISOString())
      .order('created_at', { ascending: false });

    if (error) throw error;

    const total = (data || []).reduce((sum, sale) => sum + (sale.total_amount || 0), 0);

    return {
      success: true,
      data: (data || []) as Sale[],
      total,
    };
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to fetch monthly sales';
    return {
      success: false,
      error: message,
    };
  }
}

/**
 * Obtiene las ventas de la semana actual
 */
export async function fetchWeeklySales(userId: string) {
  try {
    const today = new Date();
    const startOfWeek = new Date(today.setDate(today.getDate() - today.getDay()));

    const { data, error } = await supabase
      .from('sales')
      .select('*')
      .eq('user_id', userId)
      .gte('created_at', startOfWeek.toISOString())
      .order('created_at', { ascending: false });

    if (error) throw error;

    const total = (data || []).reduce((sum, sale) => sum + (sale.total_amount || 0), 0);

    return {
      success: true,
      data: (data || []) as Sale[],
      total,
    };
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to fetch weekly sales';
    return {
      success: false,
      error: message,
    };
  }
}

/**
 * Obtiene estadísticas de ventas
 */
export async function fetchSalesStats(userId: string) {
  try {
    const { data, error } = await supabase
      .from('sales')
      .select('total_amount')
      .eq('user_id', userId);

    if (error) throw error;

    const total = (data || []).reduce((sum, sale) => sum + (sale.total_amount || 0), 0);
    const average = data && data.length > 0 ? total / data.length : 0;

    return {
      success: true,
      stats: {
        totalSales: data?.length || 0,
        totalAmount: total,
        averageAmount: average,
      },
    };
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to fetch sales stats';
    return {
      success: false,
      error: message,
    };
  }
}
