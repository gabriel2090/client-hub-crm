/**
 * Servicio de Clientes
 * Operaciones CRUD para la tabla 'clients' en Supabase
 */

import { supabase } from './supabase';
import { User } from '@/types';

/**
 * Obtiene todos los clientes
 * (Solo para admin)
 */
export async function fetchClients() {
  try {
    const { data, error } = await supabase
      .from('clients')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;

    return {
      success: true,
      data: (data || []) as User[],
    };
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to fetch clients';
    return {
      success: false,
      error: message,
    };
  }
}

/**
 * Obtiene un cliente por ID
 */
export async function fetchClientById(id: string) {
  try {
    const { data, error } = await supabase
      .from('clients')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;

    return {
      success: true,
      data: data as User,
    };
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to fetch client';
    return {
      success: false,
      error: message,
    };
  }
}

/**
 * Crea un nuevo cliente
 * (Admin only)
 */
export async function createClient(clientData: Partial<User> & { password: string }) {
  try {
    // Primero crear el usuario en auth
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: clientData.email!.toLowerCase(),
      password: clientData.password,
      options: {
        data: {
          name: clientData.name,
          company: clientData.company,
          phone: clientData.phone,
        },
      },
    });

    if (authError) throw authError;

    // Luego crear el registro en la tabla clients
    const { data, error } = await supabase
      .from('clients')
      .insert([
        {
          id: authData.user?.id,
          name: clientData.name,
          email: clientData.email,
          phone: clientData.phone,
          company: clientData.company,
          status: clientData.status || 'active',
          created_at: new Date().toISOString(),
        },
      ])
      .select()
      .single();

    if (error) throw error;

    return {
      success: true,
      data: data as User,
    };
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to create client';
    return {
      success: false,
      error: message,
    };
  }
}

/**
 * Actualiza un cliente existente
 */
export async function updateClient(id: string, updates: Partial<User>) {
  try {
    const { data, error } = await supabase
      .from('clients')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;

    return {
      success: true,
      data: data as User,
    };
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to update client';
    return {
      success: false,
      error: message,
    };
  }
}

/**
 * Elimina un cliente
 */
export async function deleteClient(id: string) {
  try {
    const { error } = await supabase
      .from('clients')
      .delete()
      .eq('id', id);

    if (error) throw error;

    // También eliminar del auth
    // Nota: Esto requiere permisos especiales en Supabase
    // Por ahora solo eliminamos de la tabla clients

    return { success: true };
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to delete client';
    return {
      success: false,
      error: message,
    };
  }
}

/**
 * Busca clientes por nombre, email o empresa
 */
export async function searchClients(query: string) {
  try {
    const { data, error } = await supabase
      .from('clients')
      .select('*')
      .or(
        `name.ilike.%${query}%,email.ilike.%${query}%,company.ilike.%${query}%`
      )
      .order('created_at', { ascending: false });

    if (error) throw error;

    return {
      success: true,
      data: (data || []) as User[],
    };
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to search clients';
    return {
      success: false,
      error: message,
    };
  }
}
