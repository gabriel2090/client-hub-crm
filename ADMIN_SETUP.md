# 🔐 Configuración de Admin y Desactivar Registro Público

Este documento explica cómo:
1. Crear un usuario admin
2. Desactivar el registro público (solo admin puede crear clientes)
3. Configurar roles y permisos

## Paso 1: Crear Usuario Admin en Supabase

### Opción A: Desde el Panel de Supabase (Recomendado)

1. Ve a **Supabase Dashboard > Authentication > Users**
2. Haz clic en "Invite user"
3. Completa:
   - **Email**: `admin@crm.com`
   - **Password**: `Admin123456!` (cambia esto)
   - Haz clic en "Send invite"

4. **Copia el UUID del usuario**:
   - En la tabla de usuarios, busca `admin@crm.com`
   - Copia el valor de la columna "ID" (es un UUID como `550e8400-e29b-41d4-a716-446655440000`)

### Opción B: Usando SQL

```sql
-- En Supabase > SQL Editor, ejecuta:
SELECT id, email FROM auth.users WHERE email = 'admin@crm.com';
```

Esto mostrará el UUID del usuario admin.

---

## Paso 2: Crear Registro de Admin en la Tabla `clients`

Una vez tengas el UUID, ejecuta este SQL en Supabase:

```sql
-- Reemplaza 'TU_ADMIN_UUID_AQUI' con el UUID que copiaste
INSERT INTO clients (
  id,
  user_id,
  name,
  email,
  phone,
  company,
  role,
  status,
  created_at,
  updated_at
) VALUES (
  gen_random_uuid(),
  'TU_ADMIN_UUID_AQUI', -- ← REEMPLAZA CON EL UUID
  'Administrador',
  'admin@crm.com',
  '+52 555 000 0000',
  'CRM Admin',
  'admin',
  'active',
  NOW(),
  NOW()
);
```

Ahora el admin está listo. ✅

---

## Paso 3: Desactivar Registro Público

El registro público está activo por defecto. Para desactivarlo:

### 3.1 Opción A: Deshabilitar desde el Panel Supabase

1. Ve a **Authentication > Providers**
2. Busca "Email"
3. Ve a las configuraciones (engranaje/settings)
4. Desactiva "Enable sign ups" (apaga el toggle)
5. Guarda los cambios

**Resultado**: Nadie puede registrarse. Solo el admin puede invitar.

### 3.2 Opción B: Mantener Registro pero Limitar a Admin

Si quieres que solo admins creen clientes:

#### Actualizar RLS para que solo admin puede crear clientes

```sql
-- Reemplaza la política anterior
DROP POLICY IF EXISTS clients_insert_policy ON clients;

CREATE POLICY clients_insert_policy ON clients
  FOR INSERT
  WITH CHECK (
    auth.uid() IN (
      SELECT user_id FROM clients WHERE role = 'admin'
    )
  );
```

Esto solo permitirá insertar clientes si el usuario logueado es admin.

---

## Paso 4: Actualizar la App para Solo Mostrar Registro a Admins

Edita `src/pages/auth/LoginPage.tsx`:

```typescript
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

          <div className="mt-8 p-4 bg-blue-50 dark:bg-blue-950 rounded-xl border border-blue-200 dark:border-blue-800">
            <p className="text-sm font-medium text-blue-900 dark:text-blue-100">
              ℹ️ Admin Credentials
            </p>
            <p className="text-xs text-blue-700 dark:text-blue-200 mt-2">
              Email: admin@crm.com<br/>
              Password: Admin123456!
            </p>
            <p className="text-xs text-blue-600 dark:text-blue-300 mt-3 italic">
              Para crear clientes, inicia sesión como admin.
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
```

---

## Flujo Correcto: Admin Solo

### Para el Admin:
1. Inicia sesión con `admin@crm.com` / `Admin123456!`
2. Ve al dashboard
3. Puede **crear, editar, eliminar clientes**

### Para Clientes (Futuros):
1. Admin invita cliente con email
2. Cliente recibe invitación en email
3. Cliente establece contraseña
4. Cliente inicia sesión
5. Cliente solo ve sus datos (gracias a RLS)

---

## Configuración de RLS para Permitir Solo Admin Crear Clientes

Ejecuta en SQL Editor de Supabase:

```sql
-- Permitir que solo admins creen clientes
DROP POLICY IF EXISTS clients_insert_policy ON clients;

CREATE POLICY clients_insert_policy ON clients
  FOR INSERT
  WITH CHECK (
    auth.uid() IN (
      SELECT user_id FROM clients WHERE role = 'admin'
    )
  );

-- Los admins pueden crear clientes
-- Los clientes solo ven sus propios datos
```

---

## Resumen de Cambios

| Aspecto | Antes | Ahora |
|--------|-------|-------|
| **Registro** | Público | Solo admin |
| **Crear clientes** | Cualquiera | Solo admin |
| **Ver datos** | Propios (RLS) | Propios (RLS) |
| **Admin** | No existe | admin@crm.com |

---

## Verificación Final

1. **Intenta registrarte como usuario normal**
   - ❌ No deberías poder (si desactivaste registro)
   - ✅ Si lo logras, solo admin puede crear clientes

2. **Inicia sesión como admin**
   - Email: `admin@crm.com`
   - Contraseña: `Admin123456!`
   - ✅ Deberías ver opción para crear clientes

3. **Crea un cliente desde admin**
   - Llenar formulario
   - ✅ Deberá guardarse en BD

4. **Invita cliente desde Supabase**
   - Authentication > Users > Invite
   - Email: `cliente1@example.com`
   - ✅ Cliente recibe invitación

---

## Notas de Seguridad

⚠️ **Importante:**
- Cambia `Admin123456!` por una contraseña más segura
- No compartas credenciales de admin
- El RLS garantiza que clientes solo ven sus datos
- Admin puede ver todo (según configuración)

---

**¿Necesitas ayuda para implementar esto?** Cuéntame qué parte no entiende.
