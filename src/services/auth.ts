// src/services/auth.ts
/**
 * Servicio de autenticación con Supabase
 * Maneja login, obtener usuario actual y errores
 */
import { supabase } from './supabase';
import type { User as SupabaseUser, Session } from '@supabase/supabase-js';

export interface AuthCredentials {
    email: string;
    password: string;
}

export interface SignUpData extends AuthCredentials {
    name: string;
    company?: string;
    phone?: string;
}

export async function signIn(credentials: AuthCredentials) {
    try {
        const { data, error } = await supabase.auth.signInWithPassword({
            email: credentials.email.toLowerCase(),
            password: credentials.password,
        });

        if (error) {
            throw error;
        }

        return {
            success: true,
            user: data.user as SupabaseUser | null,
            session: data.session as Session | null,
            error: null as string | null,
        };
    } catch (err) {
        const message =
            err instanceof Error ? err.message : 'Sign in failed';
        return {
            success: false,
            user: null,
            session: null,
            error: message,
        };
    }
}

/**
 * (Opcional) signup clásico. OJO: si lo llamas desde el front,
 * la sesión se cambia al usuario recién creado.
 */
export async function signUp(data: SignUpData) {
    try {
        const { data: signUpData, error } = await supabase.auth.signUp({
            email: data.email.toLowerCase(),
            password: data.password,
            options: {
                data: {
                    name: data.name,
                    company: data.company,
                    phone: data.phone,
                },
            },
        });

        if (error) {
            throw error;
        }

        return {
            success: true,
            user: signUpData.user as SupabaseUser | null,
            session: signUpData.session as Session | null,
            error: null as string | null,
        };
    } catch (err) {
        const message =
            err instanceof Error ? err.message : 'Sign up failed';
        return {
            success: false,
            user: null,
            session: null,
            error: message,
        };
    }
}

/**
 * Devuelve el usuario actual de la sesión (si existe)
 * Se usa al recargar la app (F5)
 */
export async function getCurrentUser(): Promise<SupabaseUser | null> {
    try {
        const { data, error } = await supabase.auth.getUser();
        if (error) {
            // Si no hay sesión, error.message suele ser "JWT expired" o similar
            console.warn('getCurrentUser error:', error.message);
            return null;
        }
        return data.user ?? null;
    } catch (err) {
        console.error('getCurrentUser unexpected error:', err);
        return null;
    }
}
