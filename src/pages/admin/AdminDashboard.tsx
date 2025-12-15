import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { MetricCard } from '@/components/dashboard/MetricCard';
import { ActivityFeed } from '@/components/dashboard/ActivityFeed';
import { SalesChart } from '@/components/dashboard/SalesChart';
import { mockClients, mockActivities, monthlySalesData } from '@/lib/mock-data';
import { Users, TrendingUp, UserPlus, Activity } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

export default function AdminDashboard() {
  const activeClients = mockClients.filter((c) => c.status === 'active').length;
  const totalClients = mockClients.length;

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Dashboard Admin</h1>
            <p className="text-muted-foreground mt-1">
              Resumen de actividad y métricas del sistema
            </p>
          </div>
          <Button asChild>
            <Link to="/admin/clients">
              <UserPlus className="mr-2 h-5 w-5" />
              Nuevo Cliente
            </Link>
          </Button>
        </div>

        {/* Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <MetricCard
            title="Total Clientes"
            value={totalClients}
            change={12}
            icon={<Users className="h-6 w-6 text-primary" />}
          />
          <MetricCard
            title="Clientes Activos"
            value={activeClients}
            change={8}
            icon={<Activity className="h-6 w-6 text-primary" />}
          />
          <MetricCard
            title="Ventas del Mes"
            value="$232,597"
            change={15}
            icon={<TrendingUp className="h-6 w-6 text-primary" />}
          />
          <MetricCard
            title="Nuevos este mes"
            value={2}
            change={-5}
            icon={<UserPlus className="h-6 w-6 text-primary" />}
          />
        </div>

        {/* Charts and Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <SalesChart data={monthlySalesData} title="Ventas Anuales" />
          </div>
          <ActivityFeed activities={mockActivities} />
        </div>

        {/* Quick Actions */}
        <div className="bg-card rounded-xl border border-border/50 p-6">
          <h3 className="text-lg font-semibold text-foreground mb-4">Acciones Rápidas</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button variant="outline" className="h-auto py-4 flex-col" asChild>
              <Link to="/admin/clients">
                <Users className="h-8 w-8 mb-2" />
                <span>Ver Clientes</span>
              </Link>
            </Button>
            <Button variant="outline" className="h-auto py-4 flex-col" asChild>
              <Link to="/admin/reports">
                <TrendingUp className="h-8 w-8 mb-2" />
                <span>Ver Reportes</span>
              </Link>
            </Button>
            <Button variant="outline" className="h-auto py-4 flex-col" asChild>
              <Link to="/admin/settings">
                <Activity className="h-8 w-8 mb-2" />
                <span>Configuración</span>
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
