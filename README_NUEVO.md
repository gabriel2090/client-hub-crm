# Client Hub CRM

Un sistema de gestión de relaciones con clientes (CRM) completamente moderno, desarrollado con React, TypeScript, Tailwind CSS y Supabase.

## 🎯 Características

- ✅ **Autenticación segura** con Supabase Auth (JWT)
- ✅ **Gestión de clientes** - Crear, editar, eliminar y buscar clientes
- ✅ **Catálogo de productos** - Gestión completa de inventario
- ✅ **Control de ventas** - Registro y análisis de transacciones
- ✅ **Dashboard interactivo** - Métricas y gráficos en tiempo real
- ✅ **Validación de datos** - Zod + React Hook Form
- ✅ **Seguridad de datos** - Row Level Security (RLS) en Supabase
- ✅ **Componentes reutilizables** - Shadcn/ui + Tailwind CSS
- ✅ **Testing ready** - Jest + React Testing Library

## 🚀 Quick Start

### Prerrequisitos
- Node.js 16+ y npm/yarn
- Una cuenta en [Supabase](https://supabase.com) (gratuita)

### 1. Clonar el repositorio

```bash
git clone <repository-url>
cd client-hub-crm
npm install
```

### 2. Configurar Supabase (5 minutos)

Ver [SUPABASE_QUICK_START.md](./SUPABASE_QUICK_START.md) para instrucciones paso a paso.

**En resumen:**
1. Crear proyecto en Supabase
2. Copiar URL y anon key
3. Actualizar `.env.local`
4. Ejecutar migraciones SQL
5. ¡Listo!

### 3. Ejecutar en desarrollo

```bash
npm run dev
```

Abre http://localhost:5173 en tu navegador.

## 📁 Estructura del Proyecto

```
src/
├── components/           # Componentes React reutilizables
│   ├── layout/          # Componentes de layout
│   ├── clients/         # Componentes de clientes
│   ├── products/        # Componentes de productos
│   ├── dashboard/       # Componentes del dashboard
│   └── ui/              # Componentes UI (Shadcn/ui)
├── contexts/            # Contextos de React (Auth)
├── hooks/               # Hooks personalizados
├── lib/                 # Funciones de utilidad
├── pages/               # Páginas de la aplicación
├── services/            # Servicios Supabase (NUEVO)
│   ├── supabase.ts     # Cliente Supabase
│   ├── auth.ts         # Servicio de autenticación
│   ├── clients.ts      # CRUD de clientes
│   ├── products.ts     # CRUD de productos
│   └── sales.ts        # CRUD de ventas
├── types/               # Tipos TypeScript
└── App.tsx             # Componente raíz

supabase/
└── migrations/
    └── 001_create_tables.sql  # Migraciones SQL
```

## 🔧 Configuración

### Variables de Entorno

Copia `.env.example` a `.env.local` y actualiza con tus credenciales de Supabase:

```env
VITE_SUPABASE_URL=https://tu-proyecto.supabase.co
VITE_SUPABASE_ANON_KEY=tu-anon-key-aqui
```

## 📚 Documentación

- [SUPABASE_SETUP.md](./SUPABASE_SETUP.md) - Guía completa de Supabase
- [SUPABASE_INTEGRATION.md](./SUPABASE_INTEGRATION.md) - Detalles técnicos de la integración
- [SUPABASE_QUICK_START.md](./SUPABASE_QUICK_START.md) - Quick start (5 minutos)
- [IMPROVEMENTS.md](./IMPROVEMENTS.md) - Mejoras implementadas
- [ARCHITECTURE.md](./ARCHITECTURE.md) - Arquitectura de la aplicación
- [TESTING.md](./TESTING.md) - Guía de testing

## 🛠️ Comandos Disponibles

```bash
# Desarrollo
npm run dev          # Inicia servidor de desarrollo

# Build
npm run build        # Compila para producción
npm run preview      # Vista previa del build

# Testing
npm test             # Ejecuta tests
npm test -- --coverage  # Genera reporte de cobertura

# Linting
npm run lint         # Ejecuta ESLint
npm run format       # Formatea código con Prettier
```

## 🔐 Seguridad

### Autenticación
- JWT tokens de Supabase
- Sesiones autogestionadas
- Tokens almacenados en sesión (seguro)

### Datos
- Row Level Security (RLS) habilitado
- Cada usuario solo ve sus datos
- Validación server-side en Supabase

### Validación
- Zod para validación de esquemas
- React Hook Form para formularios
- Validación en cliente y servidor

## 🧪 Testing

```bash
npm test                    # Ejecutar todos los tests
npm test -- src/lib/validators.test.ts  # Test específico
```

## 📊 Stack Tecnológico

### Frontend
- **React 19** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool (7.7s build time)
- **Tailwind CSS** - Styling
- **Shadcn/ui** - Component library

### Backend
- **Supabase** - PostgreSQL database + Auth
- **Row Level Security** - Data protection
- **JWT** - Authentication tokens

### Validación & Formas
- **Zod** - Schema validation
- **React Hook Form** - Form management

### Testing
- **Jest** - Test runner
- **React Testing Library** - Component testing

## 🚀 Deployment

### Vercel (Recomendado)

```bash
npm install -g vercel
vercel
```

Añade las variables de entorno en Vercel Dashboard.

### Otras plataformas
- Netlify
- GitHub Pages
- Firebase Hosting
- AWS Amplify

## 📝 API Reference

### Servicios Disponibles

#### Auth Service
```typescript
import { signIn, signUp, signOut, getCurrentUser } from '@/services/auth';

// Login
const { success, data, error } = await signIn(email, password);

// Register
const { success, error } = await signUp(name, email, password);

// Logout
await signOut();

// Get current user
const user = await getCurrentUser();
```

#### Clients Service
```typescript
import { fetchClients, createClient, updateClient, deleteClient } from '@/services/clients';

const { success, data } = await fetchClients();
```

#### Products Service
```typescript
import { fetchProducts, createProduct, updateStock } from '@/services/products';

const { success, data } = await fetchProducts();
await updateStock(productId, quantity);
```

#### Sales Service
```typescript
import { fetchSales, createSale, fetchMonthlySales } from '@/services/sales';

const { success, data } = await fetchSales();
const monthlyData = await fetchMonthlySales(2024, 12);
```

## 🐛 Troubleshooting

### Error: "VITE_SUPABASE_URL is not defined"
- Verifica que `.env.local` existe y tiene las variables
- Reinicia el servidor de desarrollo: `npm run dev`

### Error: CORS
- Normal en localhost, Supabase lo permite automáticamente
- En producción, verifica Settings > API en Supabase dashboard

### No puedo crear usuarios
- Verifica que la autenticación de email está habilitada en Supabase
- Ve a Authentication > Providers y asegúrate de que Email está ON

### Los datos no se guardan
- Verifica que las tablas están creadas: Database > Tables en Supabase
- Verifica que RLS está habilitado
- Revisa la consola del navegador (F12) para errores

## 📞 Soporte

Para más información:
- [Documentación de Supabase](https://supabase.com/docs)
- [React Documentation](https://react.dev)
- [TypeScript Handbook](https://www.typescriptlang.org/docs)

## 📄 Licencia

Este proyecto está bajo la licencia MIT. Ver [LICENSE](LICENSE) para más detalles.

## 🙏 Agradecimientos

- [Supabase](https://supabase.com) - Backend como servicio
- [shadcn/ui](https://ui.shadcn.com) - Componentes de calidad
- [React](https://react.dev) - La mejor librería de UI
- [TypeScript](https://www.typescriptlang.org) - Type safety

---

**Última actualización**: Diciembre 2024
**Versión**: 2.0.0 (con Supabase)
