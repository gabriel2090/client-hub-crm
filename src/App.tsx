import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Suspense } from "react";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { lazy } from "react";

// Lazy loading de páginas para mejor performance
const Index = lazy(() => import("./pages/Index"));
const NotFound = lazy(() => import("./pages/NotFound"));
const LoginPage = lazy(() => import("./pages/auth/LoginPage"));
const AdminDashboard = lazy(() => import("./pages/admin/AdminDashboard"));
const ClientsPage = lazy(() => import("./pages/admin/ClientsPage"));
const ClientDashboard = lazy(() => import("./pages/client/ClientDashboard"));
const ProductsPage = lazy(() => import("./pages/client/ProductsPage"));

const queryClient = new QueryClient();

function ProtectedRoute({
  children,
  allowedRole,
}: {
  children: React.ReactNode;
  allowedRole?: 'admin' | 'client';
}) {
  const { isAuthenticated, user, isLoading } = useAuth();

  // Mientras cargamos desde localStorage, no redirigimos
  if (isLoading) {
    return (
      <div className="w-full h-screen flex items-center justify-center text-muted-foreground">
        Cargando sesión...
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRole && user.role !== allowedRole) {
    return (
      <Navigate
        to={user.role === 'admin' ? '/admin' : '/client'}
        replace
      />
    );
  }

  return <>{children}</>;
}


/**
 * Componente de carga mientras se descarga una ruta
 */
function LoadingFallback() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="text-center">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary/20 mb-4">
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
        <p className="text-muted-foreground">Cargando...</p>
      </div>
    </div>
  );
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Suspense fallback={<LoadingFallback />}><Index /></Suspense>} />
      <Route path="/login" element={<Suspense fallback={<LoadingFallback />}><LoginPage /></Suspense>} />
      
      {/* Admin Routes */}
      <Route path="/admin" element={
        <ProtectedRoute allowedRole="admin">
          <Suspense fallback={<LoadingFallback />}>
            <AdminDashboard />
          </Suspense>
        </ProtectedRoute>
      } />
      <Route path="/admin/clients" element={
        <ProtectedRoute allowedRole="admin">
          <Suspense fallback={<LoadingFallback />}>
            <ClientsPage />
          </Suspense>
        </ProtectedRoute>
      } />
      <Route path="/admin/reports" element={
        <ProtectedRoute allowedRole="admin">
          <Suspense fallback={<LoadingFallback />}>
            <AdminDashboard />
          </Suspense>
        </ProtectedRoute>
      } />
      <Route path="/admin/settings" element={
        <ProtectedRoute allowedRole="admin">
          <Suspense fallback={<LoadingFallback />}>
            <AdminDashboard />
          </Suspense>
        </ProtectedRoute>
      } />
      
      {/* Client Routes */}
      <Route path="/client" element={
        <ProtectedRoute allowedRole="client">
          <Suspense fallback={<LoadingFallback />}>
            <ClientDashboard />
          </Suspense>
        </ProtectedRoute>
      } />
      <Route path="/client/products" element={
        <ProtectedRoute allowedRole="client">
          <Suspense fallback={<LoadingFallback />}>
            <ProductsPage />
          </Suspense>
        </ProtectedRoute>
      } />
      <Route path="/client/sales" element={
        <ProtectedRoute allowedRole="client">
          <Suspense fallback={<LoadingFallback />}>
            <ClientDashboard />
          </Suspense>
        </ProtectedRoute>
      } />
      <Route path="/client/settings" element={
        <ProtectedRoute allowedRole="client">
          <Suspense fallback={<LoadingFallback />}>
            <ClientDashboard />
          </Suspense>
        </ProtectedRoute>
      } />

      <Route path="*" element={<Suspense fallback={<LoadingFallback />}><NotFound /></Suspense>} />
    </Routes>
  );
}

const App = () => (
  <ErrorBoundary>
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <AppRoutes />
          </BrowserRouter>
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  </ErrorBoundary>
);

export default App;
