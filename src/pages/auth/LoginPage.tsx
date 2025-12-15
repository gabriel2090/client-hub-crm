import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { Lock, Mail, ArrowRight } from 'lucide-react';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const success = await login(email, password);
      if (success) {
        toast.success('¡Bienvenido!');
        // Redirige al dashboard del cliente
        navigate('/client');
      } else {
        toast.error('Credenciales incorrectas');
      }
    } catch (error) {
      toast.error('Error al iniciar sesión');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex">
      {/* Left side - Form */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md animate-fade-in">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary mb-4">
              <span className="text-primary-foreground font-bold text-2xl">CRM</span>
            </div>
            <h1 className="text-3xl font-bold text-foreground">Bienvenido</h1>
            <p className="text-muted-foreground mt-2">Ingresa tus credenciales para continuar</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="tu@email.com"
                  className="pl-10"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Contraseña</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="pl-10"
                  required
                />
              </div>
            </div>

            <Button type="submit" size="lg" className="w-full" disabled={isLoading}>
              {isLoading ? 'Iniciando sesión...' : 'Iniciar sesión'}
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </form>

          <div className="mt-8 p-4 bg-amber-50 dark:bg-amber-950 rounded-xl border border-amber-200 dark:border-amber-800">
            <p className="text-sm font-medium text-amber-900 dark:text-amber-100 mb-2">
              🔑 Credenciales de Admin
            </p>
            <div className="space-y-2 text-xs text-amber-700 dark:text-amber-200">
              <p><strong>Email:</strong> admin@crm.com</p>
              <p><strong>Contraseña:</strong> Admin123456!</p>
            </div>
            <p className="text-xs text-amber-600 dark:text-amber-300 mt-3 italic">
              Solo el admin puede crear clientes. Los clientes son invitados por email.
            </p>
          </div>
        </div>
      </div>

      {/* Right side - Decorative */}
      <div className="hidden lg:flex flex-1 bg-primary items-center justify-center p-12">
        <div className="max-w-lg text-center text-primary-foreground animate-slide-up">
          <h2 className="text-4xl font-bold mb-6">
            Gestiona tu negocio de forma simple
          </h2>
          <p className="text-lg text-primary-foreground/80">
            Un CRM completo para administrar clientes, productos y ventas en un solo lugar.
          </p>
          <div className="mt-12 grid grid-cols-3 gap-6">
            <div className="p-4 bg-primary-foreground/10 rounded-xl">
              <p className="text-3xl font-bold">150+</p>
              <p className="text-sm text-primary-foreground/70">Clientes activos</p>
            </div>
            <div className="p-4 bg-primary-foreground/10 rounded-xl">
              <p className="text-3xl font-bold">2.5M</p>
              <p className="text-sm text-primary-foreground/70">Ventas totales</p>
            </div>
            <div className="p-4 bg-primary-foreground/10 rounded-xl">
              <p className="text-3xl font-bold">98%</p>
              <p className="text-sm text-primary-foreground/70">Satisfacción</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
