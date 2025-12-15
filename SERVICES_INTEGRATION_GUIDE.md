# Guía de Integración de Servicios Supabase

Esta guía muestra cómo integrar los servicios de Supabase en tus componentes.

## 1. Usar AuthContext para obtener el usuario actual

```typescript
import { useAuth } from '@/contexts/AuthContext';

export function MyComponent() {
  const { user, isAuthenticated, isLoading, login, logout } = useAuth();

  if (isLoading) {
    return <div>Cargando...</div>;
  }

  if (!isAuthenticated) {
    return <div>No estás autenticado</div>;
  }

  return (
    <div>
      <h1>Hola, {user?.name}</h1>
      <button onClick={logout}>Cerrar sesión</button>
    </div>
  );
}
```

## 2. Usar Servicios Directamente (Simple)

### Ejemplo: Obtener clientes

```typescript
import { useState, useEffect } from 'react';
import { fetchClients } from '@/services/clients';

export function ClientsList() {
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadClients = async () => {
      const { success, data, error } = await fetchClients();
      if (success) {
        setClients(data);
      } else {
        setError(error);
      }
      setLoading(false);
    };

    loadClients();
  }, []);

  if (loading) return <div>Cargando...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <ul>
      {clients.map(client => (
        <li key={client.id}>{client.name}</li>
      ))}
    </ul>
  );
}
```

## 3. Crear Hooks Personalizados (RECOMENDADO)

### Paso 1: Crear el hook en `src/hooks/useClients.ts`

```typescript
import { useState, useEffect } from 'react';
import { fetchClients, createClient, deleteClient } from '@/services/clients';
import { User } from '@/types';

export function useClients() {
  const [clients, setClients] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadClients = async () => {
    setLoading(true);
    const { success, data, error } = await fetchClients();
    if (success) {
      setClients(data);
      setError(null);
    } else {
      setError(error);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadClients();
  }, []);

  const addClient = async (clientData: Omit<User, 'id' | 'created_at'>) => {
    const { success, data, error } = await createClient(clientData);
    if (success && data) {
      setClients([...clients, data]);
      return { success: true, data };
    } else {
      setError(error);
      return { success: false, error };
    }
  };

  const removeClient = async (id: string) => {
    const { success, error } = await deleteClient(id);
    if (success) {
      setClients(clients.filter(c => c.id !== id));
    } else {
      setError(error);
    }
    return { success, error };
  };

  return { clients, loading, error, loadClients, addClient, removeClient };
}
```

### Paso 2: Usar el hook en componentes

```typescript
import { useClients } from '@/hooks/useClients';

export function ClientsList() {
  const { clients, loading, error, addClient } = useClients();

  if (loading) return <div>Cargando...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <h2>Clientes</h2>
      <ul>
        {clients.map(client => (
          <li key={client.id}>{client.name}</li>
        ))}
      </ul>
    </div>
  );
}
```

## 4. Usar React Query (AVANZADO)

### Paso 1: Instalar React Query

```bash
npm install @tanstack/react-query
```

### Paso 2: Configurar QueryClientProvider en `src/App.tsx`

```typescript
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient();

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      {/* Tu app */}
    </QueryClientProvider>
  );
}
```

### Paso 3: Crear hooks con React Query

```typescript
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchClients, createClient, deleteClient } from '@/services/clients';

export function useClientsQuery() {
  return useQuery({
    queryKey: ['clients'],
    queryFn: async () => {
      const { success, data, error } = await fetchClients();
      if (!success) throw new Error(error);
      return data;
    },
  });
}

export function useCreateClientMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createClient,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clients'] });
    },
  });
}

export function useDeleteClientMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteClient,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clients'] });
    },
  });
}
```

### Paso 4: Usar en componentes

```typescript
import { useClientsQuery, useCreateClientMutation } from '@/hooks/useClients';

export function ClientsList() {
  const { data: clients, isLoading, error } = useClientsQuery();
  const createMutation = useCreateClientMutation();

  if (isLoading) return <div>Cargando...</div>;
  if (error) return <div>Error: {String(error)}</div>;

  return (
    <div>
      <h2>Clientes</h2>
      <ul>
        {clients?.map(client => (
          <li key={client.id}>{client.name}</li>
        ))}
      </ul>
    </div>
  );
}
```

## 5. Patrones de Uso Recomendados

### Para Lecturas (Fetch)
```typescript
// Opción 1: Hook simple
const { data, loading, error } = useClients();

// Opción 2: React Query (con caché automático)
const { data, isLoading, error } = useClientsQuery();
```

### Para Escrituras (Create, Update, Delete)
```typescript
// Opción 1: Llamada directa
const { success, error } = await deleteClient(clientId);

// Opción 2: Hook personalizado
const { removeClient } = useClients();
await removeClient(clientId);

// Opción 3: React Query
const mutation = useDeleteClientMutation();
await mutation.mutateAsync(clientId);
```

## 6. Integrar en Componentes Existentes

### Ejemplo: ClientsPage.tsx

```typescript
import { useClientsQuery } from '@/hooks/useClients';
import { ClientsTable } from '@/components/clients/ClientsTable';
import { ClientForm } from '@/components/clients/ClientForm';

export default function ClientsPage() {
  const { data: clients, isLoading, error } = useClientsQuery();

  if (isLoading) return <div>Cargando clientes...</div>;
  if (error) return <div>Error: {String(error)}</div>;

  return (
    <div>
      <h1>Clientes</h1>
      <ClientForm />
      <ClientsTable clients={clients || []} />
    </div>
  );
}
```

## 7. Manejo de Errores

```typescript
import { toast } from 'sonner';

async function handleDeleteClient(clientId: string) {
  try {
    const { success, error } = await deleteClient(clientId);
    if (success) {
      toast.success('Cliente eliminado');
      // Actualizar estado
    } else {
      toast.error(`Error: ${error}`);
    }
  } catch (err) {
    toast.error('Error al eliminar cliente');
  }
}
```

## 8. Loading States

```typescript
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner'; // O usa otro spinner

export function DeleteButton({ clientId, onDelete }) {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      const { success } = await deleteClient(clientId);
      if (success) {
        onDelete();
      }
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <Button onClick={handleDelete} disabled={isDeleting}>
      {isDeleting ? <Spinner /> : 'Eliminar'}
    </Button>
  );
}
```

## 9. Buscar/Filtrar

```typescript
import { searchClients } from '@/services/clients';

export function SearchClients() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);

  const handleSearch = async (searchQuery: string) => {
    setQuery(searchQuery);
    const { success, data } = await searchClients(searchQuery);
    if (success) {
      setResults(data);
    }
  };

  return (
    <div>
      <input
        type="text"
        placeholder="Buscar clientes..."
        onChange={(e) => handleSearch(e.target.value)}
      />
      <ul>
        {results.map(client => (
          <li key={client.id}>{client.name}</li>
        ))}
      </ul>
    </div>
  );
}
```

## Recomendación General

**Para aplicaciones pequeñas**: Usa hooks personalizados simples
**Para aplicaciones medianas/grandes**: Usa React Query para mejor manejo de caché y sincronización

## Siguiente Paso

Ahora que sabes cómo usar los servicios, integra con tus componentes:
- [ ] Actualiza ClientsPage
- [ ] Actualiza ProductsPage
- [ ] Actualiza ClientDashboard
- [ ] Crea los hooks necesarios
- [ ] Prueba todo localmente
