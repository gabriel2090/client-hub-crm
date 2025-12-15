import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Product } from '@/types';
import { productSchema, ProductFormData } from '@/lib/validators';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { AlertCircle } from 'lucide-react';

interface ProductFormProps {
  product?: Product | null;
  onSubmit: (data: Partial<Product>) => void;
  onCancel: () => void;
}

/**
 * ProductForm: Componente para crear/editar productos con validación Zod
 */
export function ProductForm({ product, onSubmit, onCancel }: ProductFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit: handleFormSubmit,
    formState: { errors },
  } = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: product?.name || '',
      description: product?.description || '',
      price: product?.price || 0,
      stock: product?.stock || 0,
      image_url: product?.image_url || '',
    },
  });

  const handleValidSubmit = async (data: ProductFormData) => {
    setIsSubmitting(true);
    try {
      onSubmit(data);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleFormSubmit(handleValidSubmit)} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="name">Nombre del producto</Label>
        <Input
          id="name"
          placeholder="Laptop Pro X500"
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
        <Label htmlFor="description">Descripción</Label>
        <Textarea
          id="description"
          placeholder="Descripción detallada del producto..."
          rows={3}
          {...register('description')}
          aria-invalid={!!errors.description}
        />
        {errors.description && (
          <div className="flex items-center gap-2 text-sm text-destructive">
            <AlertCircle className="h-4 w-4" />
            {errors.description.message}
          </div>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="price">Precio (MXN)</Label>
          <Input
            id="price"
            type="number"
            step="0.01"
            min="0"
            placeholder="9999.99"
            {...register('price', { valueAsNumber: true })}
            aria-invalid={!!errors.price}
          />
          {errors.price && (
            <div className="flex items-center gap-2 text-sm text-destructive">
              <AlertCircle className="h-4 w-4" />
              {errors.price.message}
            </div>
          )}
        </div>
        <div className="space-y-2">
          <Label htmlFor="stock">Stock</Label>
          <Input
            id="stock"
            type="number"
            min="0"
            placeholder="100"
            {...register('stock', { valueAsNumber: true })}
            aria-invalid={!!errors.stock}
          />
          {errors.stock && (
            <div className="flex items-center gap-2 text-sm text-destructive">
              <AlertCircle className="h-4 w-4" />
              {errors.stock.message}
            </div>
          )}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="image_url">URL de imagen (opcional)</Label>
        <Input
          id="image_url"
          type="url"
          placeholder="https://ejemplo.com/imagen.jpg"
          {...register('image_url')}
          aria-invalid={!!errors.image_url}
        />
        {errors.image_url && (
          <div className="flex items-center gap-2 text-sm text-destructive">
            <AlertCircle className="h-4 w-4" />
            {errors.image_url.message}
          </div>
        )}
      </div>

      <div className="flex justify-end gap-3 pt-4">
        <Button type="button" variant="outline" onClick={onCancel} disabled={isSubmitting}>
          Cancelar
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Guardando...' : product ? 'Guardar cambios' : 'Crear producto'}
        </Button>
      </div>
    </form>
  );
}
