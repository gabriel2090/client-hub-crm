# CRM Sistema – Gestión de Clientes, Productos y Ventas

Aplicación **CRM** construida con **React + TypeScript + Vite** para gestionar:

- 👤 **Clientes** (panel de administrador)
- 📦 **Productos y stock** (panel del cliente)
- 💰 **Ventas rápidas** con actualización de métricas en tiempo real

Incluye autenticación con **Supabase** para el administrador y un portal de cliente con sesión persistente y almacenamiento local optimizado.

---

## 🚀 Características principales

### 👨‍💼 Panel de Administrador

- Login seguro vía **Supabase Auth** (usuario `admin`).
- Gestión de clientes:
  - Crear, editar y eliminar clientes.
  - Asignar **contraseña** al crear un cliente.
  - Estado de cliente: `activo` / `inactivo`.
- Persistencia de clientes en `localStorage` (con capa de abstracción en `lib/client-storage.ts`).
- Sincronización entre:
  - Datos del cliente.
  - Mapa de contraseñas por email.

### 👤 Panel de Cliente

- Login con credenciales definidas por el administrador.
- Gestión de productos:
  - Crear / editar / eliminar productos.
  - Campos: nombre, descripción, precio, stock, imagen opcional.
  - Persistencia por usuario (`user_id`) en `localStorage`.
- Dashboard del cliente:
  - Métricas de:
    - Total de productos.
    - Productos activos (stock > 0).
    - Ventas totales.
    - Ventas de la semana.
  - **Productos más vendidos** / destacados.
- Módulo de **Ventas**:
  - Búsqueda de producto.
  - Selección de cantidad.
  - Validación de stock.
  - Descuento de stock en tiempo real.
  - Registro de la venta en el historial del usuario.
  - Gráfico de “Ventas de la semana” basado en datos reales (ventas registradas).

### 🔐 Autenticación y sesiones

- **Admin**:
  - Auth con Supabase (`signInWithPassword`).
  - Reseteo/control de usuario admin mediante scripts Node (service role).
- **Cliente**:
  - Auth local basada en:
    - `crm_clients_v1` (datos de cliente).
    - `crm_client_passwords_v1` (contraseñas por email).
- Sesión persistente en `localStorage` (`crm_auth_user_v1`).
- `ProtectedRoute` que:
  - Muestra un loader mientras se restaura sesión.
  - Redirige a `/login` si no hay usuario autenticado.
  - Restringe rutas por rol (`admin` / `client`).

---

## 🧱 Stack tecnológico

- **Frontend**: React 18, TypeScript
- **Build**: Vite
- **UI / Estilos**:
  - TailwindCSS
  - shadcn/ui
  - Iconos: Lucide
- **Estado / lógica**:
  - React Context (`AuthContext`)
  - React Hook Form + Zod (validaciones de formularios)
- **Backend-as-a-Service**:
  - Supabase (Auth + PostgreSQL)
- **Tooling**:
  - ESLint + TypeScript ESLint
  - Scripts Node para administración de usuarios en Supabase

---

## 🗂️ Estructura de carpetas (resumen)

```txt
src/
  App.tsx                 # Definición de rutas y ProtectedRoute
  main.tsx                # Bootstrap de React

  contexts/
    AuthContext.tsx       # Login, logout, sesión persistente y roles

  pages/
    auth/
      LoginPage.tsx       # Pantalla de inicio de sesión

    admin/
      AdminDashboard.tsx  # Dashboard admin (resumen)
      ClientsPage.tsx     # CRUD de clientes

    client/
      ClientDashboard.tsx # Dashboard cliente + ventas / gráfico
      ProductsPage.tsx    # CRUD de productos

  components/
    layout/
      DashboardLayout.tsx # Layout común con sidebar/topbar

    clients/
      ClientsTable.tsx    # Tabla de clientes
      ClientForm.tsx      # Formulario de alta/edición de clientes

    products/
      ProductForm.tsx     # Form de productos
      ProductsTable.tsx   # Tabla de productos

    dashboard/
      MetricCard.tsx      # Tarjetas de métricas
      SalesChart.tsx      # Gráfico de ventas (Recharts)

  lib/
    client-storage.ts     # Persistencia de clientes y contraseñas en localStorage
    product-storage.ts    # Persistencia de productos por usuario
    sales-storage.ts      # Persistencia de ventas por usuario
    mock-data.ts          # Datos demo (clientes, productos, ventas)
    validators.ts         # Esquemas Zod de formularios

  services/
    supabase.ts           # Cliente de Supabase (anon key)
    auth.ts               # Helper de login con Supabase
    clients.ts            # Servicios de clientes (pensado para Supabase)
    products.ts           # Servicios de productos
    sales.ts              # Servicios de ventas

  types/
    index.ts              # Tipos: User, Product, Sale, etc.

# Entorno de desarrollo
npm run dev

# Build de producción
npm run build

# Preview del build de producción
npm run preview

# Linting
npm run lint


# Resetear/crear un usuario concreto (borra si existe y lo crea de nuevo)
npm run reset:user -- email password

# Borrar TODOS los usuarios de Supabase Auth
# y crear solo uno nuevo (normalmente el admin)
npm run reset:all-users -- email password
