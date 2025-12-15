/**
 * Tests unitarios para AuthContext
 * 
 * ⚠️ NOTA: Estos tests requieren que instales las dependencias de testing primero:
 * npm install --save-dev @testing-library/react @testing-library/jest-dom jest @types/jest ts-jest
 * 
 * Luego puedes ejecutar:
 * npm test
 */

import { renderHook, act, waitFor } from '@testing-library/react';
import { AuthProvider, useAuth } from '@/contexts/AuthContext';

describe('AuthContext', () => {
  // ============ TESTS DE LOGIN ============

  test('debería hacer login con credenciales demo de admin', async () => {
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <AuthProvider>{children}</AuthProvider>
    );

    const { result } = renderHook(() => useAuth(), { wrapper });

    expect(result.current.isAuthenticated).toBe(false);
    expect(result.current.user).toBeNull();

    await act(async () => {
      const success = await result.current.login('admin@crm.com', 'admin123');
      expect(success).toBe(true);
    });

    await waitFor(() => {
      expect(result.current.isAuthenticated).toBe(true);
      expect(result.current.user?.email).toBe('admin@crm.com');
      expect(result.current.user?.role).toBe('admin');
    });
  });

  test('debería hacer login con credenciales demo de cliente', async () => {
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <AuthProvider>{children}</AuthProvider>
    );

    const { result } = renderHook(() => useAuth(), { wrapper });

    await act(async () => {
      const success = await result.current.login('cliente@demo.com', 'cliente123');
      expect(success).toBe(true);
    });

    await waitFor(() => {
      expect(result.current.user?.email).toBe('cliente@demo.com');
      expect(result.current.user?.role).toBe('client');
    });
  });

  test('debería rechazar credenciales incorrectas', async () => {
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <AuthProvider>{children}</AuthProvider>
    );

    const { result } = renderHook(() => useAuth(), { wrapper });

    await act(async () => {
      const success = await result.current.login('admin@crm.com', 'wrongpassword');
      expect(success).toBe(false);
    });

    expect(result.current.isAuthenticated).toBe(false);
  });

  // ============ TESTS DE LOGOUT ============

  test('debería hacer logout correctamente', async () => {
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <AuthProvider>{children}</AuthProvider>
    );

    const { result } = renderHook(() => useAuth(), { wrapper });

    // Login primero
    await act(async () => {
      await result.current.login('admin@crm.com', 'admin123');
    });

    expect(result.current.isAuthenticated).toBe(true);

    // Logout
    act(() => {
      result.current.logout();
    });

    expect(result.current.isAuthenticated).toBe(false);
    expect(result.current.user).toBeNull();
  });

  // ============ TESTS DE PERSISTENCIA ============

  test('debería persistir el usuario en localStorage', async () => {
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <AuthProvider>{children}</AuthProvider>
    );

    const { result } = renderHook(() => useAuth(), { wrapper });

    await act(async () => {
      await result.current.login('admin@crm.com', 'admin123');
    });

    const stored = localStorage.getItem('crm_user');
    expect(stored).toBeTruthy();

    const user = JSON.parse(stored!);
    expect(user.email).toBe('admin@crm.com');
  });
});
