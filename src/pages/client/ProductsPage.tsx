import { useState, useEffect } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { ProductsGrid } from '@/components/products/ProductsGrid';
import { ProductForm } from '@/components/products/ProductForm';
import { mockProducts } from '@/lib/mock-data';
import { Product } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
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
import { useAuth } from '@/contexts/AuthContext';
import { loadStoredProducts, saveStoredProducts } from '@/lib/product-storage';

export default function ProductsPage() {
  const { user } = useAuth();

  // 🔹 Estado de productos del usuario actual
  const [products, setProducts] = useState<Product[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [deletingProduct, setDeletingProduct] = useState<Product | null>(null);

  // 🔹 Cargar productos desde localStorage (o desde mocks, filtrados por user_id)
  useEffect(() => {
    if (!user) return;

    const stored = loadStoredProducts(user.id);
    const base =
      stored.length > 0
        ? stored
        : mockProducts.filter((p) => p.user_id === user.id);

    setProducts(base);
  }, [user?.id]);

  // 🔹 Helper para mantener sincronizados estado + localStorage
  const persistProducts = (nextProducts: Product[]) => {
    if (!user) return;
    setProducts(nextProducts);
    saveStoredProducts(user.id, nextProducts);
  };

  const filteredProducts = products.filter(
    (product) =>
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // 🔹 Generamos IDs únicos para productos nuevos
  const generateId = () => {
    if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
      return crypto.randomUUID();
    }
    return Date.now().toString();
  };

  // 🔹 Crear producto: se guarda asociado al user.id
  const handleCreateProduct = (data: Partial<Product>) => {
    if (!user) {
      toast.error('No se pudo identificar el usuario');
      return;
    }

    const newProduct: Product = {
      id: generateId(),
      user_id: user.id,
      name: data.name || '',
      description: data.description || '',
      price: data.price || 0,
      stock: data.stock || 0,
      image_url: data.image_url,
      created_at: new Date().toISOString(),
    };

    const next = [newProduct, ...products];
    persistProducts(next);
    setIsFormOpen(false);
    toast.success('Producto creado exitosamente');
  };

  // 🔹 Editar producto
  const handleEditProduct = (data: Partial<Product>) => {
    if (!editingProduct || !user) return;

    const next = products.map((p) =>
      p.id === editingProduct.id ? { ...p, ...data } : p
    );

    persistProducts(next);
    setEditingProduct(null);
    toast.success('Producto actualizado exitosamente');
  };

  // 🔹 Eliminar producto
  const handleDeleteProduct = () => {
    if (!deletingProduct || !user) return;

    const next = products.filter((p) => p.id !== deletingProduct.id);
    persistProducts(next);
    setDeletingProduct(null);
    toast.success('Producto eliminado exitosamente');
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Mis Productos</h1>
            <p className="text-muted-foreground mt-1">
              Gestiona los productos que ofreces a tus clientes
            </p>
          </div>
          <Button onClick={() => setIsFormOpen(true)}>
            <Plus className="mr-2 h-5 w-5" />
            Nuevo Producto
          </Button>
        </div>

        {/* Search */}
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input
            placeholder="Buscar productos..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Products Grid */}
        {filteredProducts.length > 0 ? (
          <ProductsGrid
            products={filteredProducts}
            onEdit={(product) => setEditingProduct(product)}
            onDelete={(product) => setDeletingProduct(product)}
          />
        ) : (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No se encontraron productos</p>
          </div>
        )}

        {/* Create Dialog */}
        <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
          <DialogContent className="sm:max-w-lg">
            <DialogHeader>
              <DialogTitle>Nuevo Producto</DialogTitle>
            </DialogHeader>
            <ProductForm
              onSubmit={handleCreateProduct}
              onCancel={() => setIsFormOpen(false)}
            />
          </DialogContent>
        </Dialog>

        {/* Edit Dialog */}
        <Dialog
          open={!!editingProduct}
          onOpenChange={() => setEditingProduct(null)}
        >
          <DialogContent className="sm:max-w-lg">
            <DialogHeader>
              <DialogTitle>Editar Producto</DialogTitle>
            </DialogHeader>
            <ProductForm
              product={editingProduct}
              onSubmit={handleEditProduct}
              onCancel={() => setEditingProduct(null)}
            />
          </DialogContent>
        </Dialog>

        {/* Delete Dialog */}
        <AlertDialog
          open={!!deletingProduct}
          onOpenChange={() => setDeletingProduct(null)}
        >
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>¿Eliminar producto?</AlertDialogTitle>
              <AlertDialogDescription>
                Esta acción eliminará permanentemente el producto{' '}
                <span className="font-semibold">{deletingProduct?.name}</span> y
                todos sus datos asociados. Esta acción no se puede deshacer.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancelar</AlertDialogCancel>
              <AlertDialogAction
                onClick={handleDeleteProduct}
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
