import { User } from '@/types';
import { cn } from '@/lib/utils';
import { Eye, Edit, Trash2, MoreHorizontal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';

interface ClientsTableProps {
  clients: User[];
  onView: (client: User) => void;
  onEdit: (client: User) => void;
  onDelete: (client: User) => void;
}

export function ClientsTable({ clients, onView, onEdit, onDelete }: ClientsTableProps) {
  return (
    <div className="bg-card rounded-xl border border-border/50 overflow-hidden">
      <table className="data-table">
        <thead>
          <tr>
            <th>Cliente</th>
            <th>Empresa</th>
            <th>Teléfono</th>
            <th>Estado</th>
            <th>Creado</th>
            <th className="text-right">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {clients.map((client, index) => (
            <tr
              key={client.id}
              className="animate-fade-in"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <td>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <span className="text-primary font-semibold">
                      {client.name.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div>
                    <p className="font-medium text-foreground">{client.name}</p>
                    <p className="text-muted-foreground text-sm">{client.email}</p>
                  </div>
                </div>
              </td>
              <td className="text-muted-foreground">{client.company || '-'}</td>
              <td className="text-muted-foreground">{client.phone || '-'}</td>
              <td>
                <span
                  className={cn(
                    client.status === 'active' ? 'badge-success' : 'badge-destructive'
                  )}
                >
                  {client.status === 'active' ? 'Activo' : 'Inactivo'}
                </span>
              </td>
              <td className="text-muted-foreground">
                {formatDistanceToNow(new Date(client.created_at), {
                  addSuffix: true,
                  locale: es,
                })}
              </td>
              <td className="text-right">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => onView(client)}>
                      <Eye className="mr-2 h-4 w-4" />
                      Ver detalles
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => onEdit(client)}>
                      <Edit className="mr-2 h-4 w-4" />
                      Editar
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => onDelete(client)}
                      className="text-destructive focus:text-destructive"
                    >
                      <Trash2 className="mr-2 h-4 w-4" />
                      Eliminar
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
