import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
} from 'react';
import { User, UserRole } from '@/types';
import { supabase } from '@/services/supabase';
import {
  loadStoredClients,
  loadClientPasswords,
} from '@/lib/client-storage';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

const AUTH_USER_KEY = 'crm_auth_user_v1';

// Para mañana: 1 admin único por Supabase.
const ADMIN_EMAIL =
  import.meta.env.VITE_ADMIN_EMAIL?.toLowerCase() || 'admin@crm.com';

function persistUser(user: User | null) {
  if (user) {
    localStorage.setItem(AUTH_USER_KEY, JSON.stringify(user));
  } else {
    localStorage.removeItem(AUTH_USER_KEY);
  }
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Cargar sesión desde localStorage al montar (F5)
  useEffect(() => {
    try {
      const stored = localStorage.getItem(AUTH_USER_KEY);
      if (stored) {
        const parsed = JSON.parse(stored) as User;
        setUser(parsed);
      }
    } catch (err) {
      console.error('Error leyendo usuario guardado:', err);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const login = useCallback(
    async (email: string, password: string): Promise<boolean> => {
      const normalizedEmail = email.trim().toLowerCase();

      // 1) Intentar como ADMIN vía Supabase
      if (normalizedEmail === ADMIN_EMAIL) {
        try {
          const { data, error } = await supabase.auth.signInWithPassword({
            email: normalizedEmail,
            password,
          });

          if (error || !data.user) {
            console.error('Login admin failed:', error?.message);
            return false;
          }

          const meta = (data.user.user_metadata || {}) as Record<
            string,
            any
          >;

          const adminUser: User = {
            id: data.user.id,
            name:
              (meta.name as string) ||
              data.user.email?.split('@')[0] ||
              'Administrador',
            email: data.user.email || normalizedEmail,
            role: 'admin',
            status: 'active',
            created_at: data.user.created_at,
          };

          setUser(adminUser);
          persistUser(adminUser);
          return true;
        } catch (err) {
          console.error('Login admin error:', err);
          return false;
        }
      }

      // 2) Intentar como CLIENTE local (creado desde el admin)
      const clients = loadStoredClients();
      const passwords = loadClientPasswords();

      const client = clients.find(
        (c) => c.email.toLowerCase() === normalizedEmail,
      );
      if (!client) {
        return false;
      }

      const storedPassword = passwords[normalizedEmail];
      if (!storedPassword || storedPassword !== password) {
        return false;
      }

      const clientUser: User = {
        ...client,
        role: 'client' as UserRole,
      };

      setUser(clientUser);
      persistUser(clientUser);
      return true;
    },
    [],
  );

  const logout = useCallback(async () => {
    try {
      // Si el que está logueado es admin, cerramos sesión en Supabase también
      if (user?.role === 'admin') {
        await supabase.auth.signOut();
      }
    } catch (err) {
      console.error('Logout error:', err);
    } finally {
      setUser(null);
      persistUser(null);
    }
  }, [user]);

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
