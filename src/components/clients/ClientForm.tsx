import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { User } from '@/types';
import { clientSchema, ClientFormData } from '@/lib/validators';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { AlertCircle } from 'lucide-react';

interface ClientFormProps {
  client?: User | null;
  onSubmit: (data: Partial<User> & { password?: string }) => void;
  onCancel: () => void;
}

/**
 * ClientForm: Componente para crear/editar clientes con validación Zod
 * - Cuando NO hay client => modo creación (pide contraseña)
 * - Cuando hay client   => modo edición   (no muestra contraseña)
 */
export function ClientForm({ client, onSubmit, onCancel }: ClientFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const isEditMode = !!client;

  const {
    register,
    handleSubmit: handleFormSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<ClientFormData>({
    resolver: zodResolver(clientSchema),
    defaultValues: {
      name: client?.name || '',
      email: client?.email || '',
      phone: client?.phone || '',
      company: client?.company || '',
      status: client?.status || 'active',
      password: '', // solo se usa visualmente en modo creación
    },
  });

  const status = watch('status');

  const handleValidSubmit = async (data: ClientFormData) => {
    setIsSubmitting(true);
    try {
      // Mapeamos los datos explícitamente al tipo esperado por onSubmit
      const payload: Partial<User> & { password?: string } = {
        name: data.name,
        email: data.email,
        phone: data.phone,
        company: data.company,
        status: data.status,
      };

      // Solo mandamos password cuando estamos creando un cliente
      if (!isEditMode && data.password) {
        payload.password = data.password;
      }

      onSubmit(payload);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form
      onSubmit={handleFormSubmit(handleValidSubmit)}
      className="space-y-6"
    >
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="name">Nombre completo</Label>
          <Input
            id="name"
            placeholder="Juan Pérez"
            {...register('name')}
            aria-invalid={!!errors.name}
          />
          {errors.name && (
            <div className="flex items-center gap-2 text-sm text-destructive">
              <AlertCircle className="h-4 w-4" />
              {errors.name.message}
            </div>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            placeholder="juan@empresa.com"
            {...register('email')}
            aria-invalid={!!errors.email}
          />
          {errors.email && (
            <div className="flex items-center gap-2 text-sm text-destructive">
              <AlertCircle className="h-4 w-4" />
              {errors.email.message}
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="phone">Teléfono</Label>
          <Input
            id="phone"
            placeholder="+52 555 123 4567"
            {...register('phone')}
            aria-invalid={!!errors.phone}
          />
          {errors.phone && (
            <div className="flex items-center gap-2 text-sm text-destructive">
              <AlertCircle className="h-4 w-4" />
              {errors.phone.message}
            </div>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="company">Empresa</Label>
          <Input
            id="company"
            placeholder="Empresa SA"
            {...register('company')}
          />
        </div>
      </div>

      {/* Campo de contraseña solo en modo creación */}
      {!isEditMode && (
        <div className="space-y-2">
          <Label htmlFor="password">Contraseña</Label>
          <Input
            id="password"
            type="password"
            placeholder="Contraseña segura"
            {...register('password')}
            aria-invalid={!!errors.password}
          />
          {errors.password && (
            <div className="flex items-center gap-2 text-sm text-destructive">
              <AlertCircle className="h-4 w-4" />
              {errors.password.message}
            </div>
          )}
        </div>
      )}

      <div className="space-y-2">
        <Label htmlFor="status">Estado</Label>
        <Select
          value={status}
          onValueChange={(value) =>
            setValue('status', value as 'active' | 'inactive')
          }
        >
          <SelectTrigger>
            <SelectValue placeholder="Seleccionar estado" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="active">Activo</SelectItem>
            <SelectItem value="inactive">Inactivo</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="flex justify-end gap-3 pt-4">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={isSubmitting}
        >
          Cancelar
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting
            ? 'Guardando...'
            : client
            ? 'Guardar cambios'
            : 'Crear cliente'}
        </Button>
      </div>
    </form>
  );
}
