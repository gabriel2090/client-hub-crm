import { useState, useEffect } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { MetricCard } from '@/components/dashboard/MetricCard';
import { SalesChart } from '@/components/dashboard/SalesChart';
import { mockProducts, mockSales, salesChartData } from '@/lib/mock-data';
import { Package, DollarSign, TrendingUp, ShoppingCart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Product, Sale } from '@/types';
import { loadStoredProducts, saveStoredProducts } from '@/lib/product-storage';
import { loadStoredSales, saveStoredSales } from '@/lib/sales-storage';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { toast } from 'sonner';

export default function ClientDashboard() {
  const { user } = useAuth();
  const location = useLocation();
  const isSalesPage = location.pathname === '/client/sales';

  const [products, setProducts] = useState<Product[]>([]);
  const [sales, setSales] = useState<Sale[]>([]);
  const [productSearch, setProductSearch] = useState('');
  const [saleProductId, setSaleProductId] = useState('');
  const [saleQuantity, setSaleQuantity] = useState<number>(1);

  // 🔹 Cargar productos reales del usuario (localStorage, con fallback a mocks)
  useEffect(() => {
    if (!user) return;

    const stored = loadStoredProducts(user.id);
    const base =
      stored.length > 0
        ? stored
        : mockProducts.filter((p) => p.user_id === user.id);

    setProducts(base);
  }, [user?.id]);

  // 🔹 Cargar ventas del usuario (localStorage, con fallback a demo)
  useEffect(() => {
    if (!user) return;

    const storedSales = loadStoredSales(user.id);
    const baseSales = storedSales.length > 0 ? storedSales : mockSales;
    setSales(baseSales);
  }, [user?.id]);

  // 🔹 Persistir productos del usuario
  const persistProducts = (next: Product[]) => {
    if (!user) return;
    setProducts(next);
    saveStoredProducts(user.id, next);
  };

  // 🔹 Persistir ventas del usuario
  const persistSales = (next: Sale[]) => {
    if (!user) return;
    setSales(next);
    saveStoredSales(user.id, next);
  };

  // 🔹 Métricas basadas en productos
  const totalProducts = products.length;
  const activeProducts = products.filter((p) => p.stock > 0).length;

  // 🔹 Ventas (totales + semana) basadas en ventas reales
  const totalSales = sales.reduce(
    (sum, sale) => sum + sale.total_amount,
    0,
  );

  const weekAgo = new Date();
  weekAgo.setDate(weekAgo.getDate() - 7);

  const weeklySales = sales.filter((sale) => {
    const saleDate = new Date(sale.created_at);
    return saleDate >= weekAgo;
  });

  const weekSales = weeklySales.reduce(
    (sum, sale) => sum + sale.total_amount,
    0,
  );

  // 🔹 Datos del gráfico: agregamos por día de la semana
  const dayTotals: Record<number, number> = {
    0: 0, // Dom
    1: 0, // Lun
    2: 0, // Mar
    3: 0, // Mié
    4: 0, // Jue
    5: 0, // Vie
    6: 0, // Sáb
  };

  weeklySales.forEach((sale) => {
    const d = new Date(sale.created_at).getDay(); // 0 (Dom) - 6 (Sáb)
    dayTotals[d] += sale.total_amount;
  });

  const dynamicChartData = [
    { name: 'Lun', ventas: dayTotals[1] },
    { name: 'Mar', ventas: dayTotals[2] },
    { name: 'Mié', ventas: dayTotals[3] },
    { name: 'Jue', ventas: dayTotals[4] },
    { name: 'Vie', ventas: dayTotals[5] },
    { name: 'Sáb', ventas: dayTotals[6] },
    { name: 'Dom', ventas: dayTotals[0] },
  ];

  const hasRealChartData = dynamicChartData.some((d) => d.ventas > 0);
  const chartData = hasRealChartData ? dynamicChartData : salesChartData;

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN',
      minimumFractionDigits: 0,
    }).format(value);
  };

  const filteredProductsForSelect = products.filter((product) =>
    product.name.toLowerCase().includes(productSearch.toLowerCase()),
  );

  // 🔹 Registrar venta rápida (descuenta stock y guarda venta)
  const handleRegisterSale = () => {
    if (!user) {
      toast.error('No se pudo identificar el usuario');
      return;
    }

    if (!saleProductId) {
      toast.error('Selecciona un producto');
      return;
    }

    if (!saleQuantity || saleQuantity <= 0 || Number.isNaN(saleQuantity)) {
      toast.error('La cantidad debe ser mayor a 0');
      return;
    }

    const product = products.find((p) => p.id === saleProductId);
    if (!product) {
      toast.error('Producto no encontrado');
      return;
    }

    if (saleQuantity > product.stock) {
      toast.error('No hay suficiente stock para esta venta');
      return;
    }

    // Actualizar stock
    const updated: Product = {
      ...product,
      stock: product.stock - saleQuantity,
    };

    const nextProducts = products.map((p) =>
      p.id === product.id ? updated : p,
    );
    persistProducts(nextProducts);

    // Registrar la venta
    const totalAmount = product.price * saleQuantity;

    const newSale: Sale = {
      id:
        typeof crypto !== 'undefined' && 'randomUUID' in crypto
          ? crypto.randomUUID()
          : Date.now().toString(),
      product_id: product.id,
      quantity: saleQuantity,
      total_amount: totalAmount,
      created_at: new Date().toISOString(),
    };

    const nextSales = [newSale, ...sales];
    persistSales(nextSales);

    setSaleQuantity(1);

    toast.success('Venta registrada y stock actualizado');
  };

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Mi Dashboard</h1>
            <p className="text-muted-foreground mt-1">
              Resumen de tus productos y ventas
            </p>
          </div>
          <Button asChild>
            <Link to="/client/products">
              <Package className="mr-2 h-5 w-5" />
              Gestionar Productos
            </Link>
          </Button>
        </div>

        {/* Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <MetricCard
            title="Ventas del Mes"
            value={formatCurrency(totalSales)}
            change={15}
            icon={<DollarSign className="h-6 w-6 text-primary" />}
          />
          <MetricCard
            title="Ventas de la Semana"
            value={formatCurrency(weekSales)}
            change={8}
            icon={<TrendingUp className="h-6 w-6 text-primary" />}
          />
          <MetricCard
            title="Productos Activos"
            value={activeProducts}
            icon={<Package className="h-6 w-6 text-primary" />}
          />
          <MetricCard
            title="Total Productos"
            value={totalProducts}
            icon={<ShoppingCart className="h-6 w-6 text-primary" />}
          />
        </div>

        {/* 🔹 Sales Chart: solo en /client/sales */}
        {isSalesPage && (
          <SalesChart data={chartData} title="Ventas de la Semana" />
        )}

        {/* 🔹 Registrar venta rápida: solo en /client/sales */}
        {isSalesPage && (
          <div className="bg-card rounded-xl border border-border/50 p-6">
            <h3 className="text-lg font-semibold text-foreground mb-4">
              Registrar venta rápida
            </h3>
            <div className="grid gap-4 md:grid-cols-[2fr,1fr,auto]">
              <div className="space-y-2">
                <Label htmlFor="product-search">Buscar producto</Label>
                <Input
                  id="product-search"
                  placeholder="Escribe para filtrar..."
                  value={productSearch}
                  onChange={(e) => setProductSearch(e.target.value)}
                />
                <div className="mt-2">
                  <Select
                    value={saleProductId}
                    onValueChange={setSaleProductId}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecciona un producto" />
                    </SelectTrigger>
                    <SelectContent>
                      {filteredProductsForSelect.length === 0 ? (
                        <div className="px-3 py-2 text-sm text-muted-foreground">
                          No hay productos que coincidan
                        </div>
                      ) : (
                        filteredProductsForSelect.map((product) => (
                          <SelectItem key={product.id} value={product.id}>
                            {product.name} · stock: {product.stock}
                          </SelectItem>
                        ))
                      )}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="quantity">Cantidad</Label>
                <Input
                  id="quantity"
                  type="number"
                  min={1}
                  value={saleQuantity}
                  onChange={(e) => setSaleQuantity(Number(e.target.value))}
                />
                <p className="text-xs text-muted-foreground">
                  Se descontará del stock actual del producto.
                </p>
              </div>
              <div className="flex items-end">
                <Button
                  type="button"
                  onClick={handleRegisterSale}
                  className="w-full md:w-auto"
                >
                  Registrar venta
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* 🔹 Top Products */}
        <div className="bg-card rounded-xl border border-border/50 p-6">
          <h3 className="text-lg font-semibold text-foreground mb-4">
            Productos Más Vendidos
          </h3>
          <div className="space-y-4">
            {products.slice(0, 4).map((product, index) => (
              <div
                key={product.id}
                className="flex items-center gap-4 p-3 rounded-lg hover:bg-muted/50 transition-colors animate-fade-in"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="w-12 h-12 rounded-lg bg-muted overflow-hidden">
                  {product.image_url ? (
                    <img
                      src={product.image_url}
                      alt={product.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Package className="h-6 w-6 text-muted-foreground" />
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-foreground truncate">
                    {product.name}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {product.stock} en stock
                  </p>
                </div>
                <p className="font-semibold text-primary">
                  {formatCurrency(product.price)}
                </p>
              </div>
            ))}
            {products.length === 0 && (
              <p className="text-sm text-muted-foreground">
                Aún no tienes productos. Crea productos desde &quot;Gestionar
                Productos&quot;.
              </p>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
