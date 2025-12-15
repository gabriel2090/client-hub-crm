import { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { ClientsTable } from '@/components/clients/ClientsTable';
import { ClientForm } from '@/components/clients/ClientForm';
import { mockClients } from '@/lib/mock-data';
import { User } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  loadStoredClients,
  saveStoredClients,
  loadClientPasswords,
  saveClientPasswords,
} from '@/lib/client-storage';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { toast } from 'sonner';
import { Plus, Search } from 'lucide-react';

// 🔹 Datos que vienen del formulario (incluye password opcional)
type ClientFormValues = Partial<User> & { password?: string };

export default function ClientsPage() {
  // 🔹 Inicializamos los clientes leyendo primero de localStorage
  const [clients, setClients] = useState<User[]>(() => {
    const stored = loadStoredClients();
    return stored.length ? stored : mockClients;
  });

  const [searchQuery, setSearchQuery] = useState('');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingClient, setEditingClient] = useState<User | null>(null);
  const [deletingClient, setDeletingClient] = useState<User | null>(null);
  const [viewingClient, setViewingClient] = useState<User | null>(null);

  // 🔹 Helper para mantener siempre en sync estado + localStorage
  const persistClients = (nextClients: User[]) => {
    setClients(nextClients);
    saveStoredClients(nextClients);
  };

  const filteredClients = clients.filter(
    (client) =>
      client.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      client.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      client.company?.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  // Helper para generar IDs (usa crypto.randomUUID si existe)
  const generateId = () => {
    if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
      return crypto.randomUUID();
    }
    return Date.now().toString();
  };

  // 🔹 Crear cliente: guarda perfil + contraseña
  const handleCreateClient = (data: ClientFormValues) => {
    if (!data.password) {
      toast.error('Debes definir una contraseña para el cliente');
      return;
    }

    const newClient: User = {
      id: generateId(),
      name: data.name || '',
      email: data.email || '',
      phone: data.phone,
      company: data.company,
      role: 'client',
      status: data.status || 'active',
      created_at: new Date().toISOString(),
    };

    const nextClients = [newClient, ...clients];
    persistClients(nextClients);

    const passwords = loadClientPasswords();
    const emailKey = newClient.email.toLowerCase();

    saveClientPasswords({
      ...passwords,
      [emailKey]: data.password,
    });

    setIsFormOpen(false);
    toast.success('Cliente creado exitosamente');
  };

  // 🔹 Editar cliente: actualiza datos y mueve contraseña si cambia el email
  const handleEditClient = (data: ClientFormValues) => {
    if (!editingClient) return;

    const updatedClient: User = {
      ...editingClient,
      ...data,
    };

    const nextClients = clients.map((c) =>
      c.id === editingClient.id ? updatedClient : c,
    );
    persistClients(nextClients);

    // Si el email cambia, movemos la contraseña al nuevo email (si existía)
    const oldEmailKey = editingClient.email.toLowerCase();
    const newEmailKey = updatedClient.email.toLowerCase();

    if (oldEmailKey !== newEmailKey) {
      const passwords = loadClientPasswords();
      const currentPassword = passwords[oldEmailKey];

      if (currentPassword) {
        const { [oldEmailKey]: _old, ...rest } = passwords;
        saveClientPasswords({
          ...rest,
          [newEmailKey]: currentPassword,
        });
      }
    }

    setEditingClient(null);
    toast.success('Cliente actualizado exitosamente');
  };

  // 🔹 Eliminar cliente: borra perfil + contraseña
  const handleDeleteClient = () => {
    if (!deletingClient) return;

    const nextClients = clients.filter((c) => c.id !== deletingClient.id);
    persistClients(nextClients);

    const passwords = loadClientPasswords();
    const emailKey = deletingClient.email.toLowerCase();

    if (passwords[emailKey]) {
      const { [emailKey]: _old, ...rest } = passwords;
      saveClientPasswords(rest);
    }

    setDeletingClient(null);
    toast.success('Cliente eliminado exitosamente');
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Clientes</h1>
            <p className="text-muted-foreground mt-1">
              Gestiona la información de tus clientes
            </p>
          </div>
          <Button onClick={() => setIsFormOpen(true)}>
            <Plus className="mr-2 h-5 w-5" />
            Nuevo Cliente
          </Button>
        </div>

        {/* Search */}
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input
            placeholder="Buscar clientes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Table */}
        <ClientsTable
          clients={filteredClients}
          onView={(client) => setViewingClient(client)}
          onEdit={(client) => setEditingClient(client)}
          onDelete={(client) => setDeletingClient(client)}
        />

        {/* Create Dialog */}
        <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
          <DialogContent className="sm:max-w-lg">
            <DialogHeader>
              <DialogTitle>Nuevo Cliente</DialogTitle>
            </DialogHeader>
            <ClientForm
              onSubmit={handleCreateClient}
              onCancel={() => setIsFormOpen(false)}
            />
          </DialogContent>
        </Dialog>

        {/* Edit Dialog */}
        <Dialog
          open={!!editingClient}
          onOpenChange={() => setEditingClient(null)}
        >
          <DialogContent className="sm:max-w-lg">
            <DialogHeader>
              <DialogTitle>Editar Cliente</DialogTitle>
            </DialogHeader>
            <ClientForm
              client={editingClient}
              onSubmit={handleEditClient}
              onCancel={() => setEditingClient(null)}
            />
          </DialogContent>
        </Dialog>

        {/* View Dialog */}
        <Dialog
          open={!!viewingClient}
          onOpenChange={() => setViewingClient(null)}
        >
          <DialogContent className="sm:max-w-lg">
            <DialogHeader>
              <DialogTitle>Detalles del Cliente</DialogTitle>
            </DialogHeader>
            {viewingClient && (
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                    <span className="text-primary font-bold text-2xl">
                      {viewingClient.name.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">
                      {viewingClient.name}
                    </h3>
                    <p className="text-muted-foreground">
                      {viewingClient.email}
                    </p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4 pt-4 border-t">
                  <div>
                    <p className="text-sm text-muted-foreground">Empresa</p>
                    <p className="font-medium">
                      {viewingClient.company || '-'}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Teléfono</p>
                    <p className="font-medium">
                      {viewingClient.phone || '-'}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Estado</p>
                    <span
                      className={
                        viewingClient.status === 'active'
                          ? 'badge-success'
                          : 'badge-destructive'
                      }
                    >
                      {viewingClient.status === 'active'
                        ? 'Activo'
                        : 'Inactivo'}
                    </span>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Creado</p>
                    <p className="font-medium">
                      {new Date(
                        viewingClient.created_at,
                      ).toLocaleDateString('es-MX')}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>

        {/* Delete Dialog */}
        <AlertDialog
          open={!!deletingClient}
          onOpenChange={() => setDeletingClient(null)}
        >
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>¿Eliminar cliente?</AlertDialogTitle>
              <AlertDialogDescription>
                Esta acción eliminará permanentemente a{' '}
                <span className="font-semibold">
                  {deletingClient?.name}
                </span>{' '}
                y todos sus datos asociados. Esta acción no se puede
                deshacer.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancelar</AlertDialogCancel>
              <AlertDialogAction
                onClick={handleDeleteClient}
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              >
                Eliminar
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </DashboardLayout>
  );
}
