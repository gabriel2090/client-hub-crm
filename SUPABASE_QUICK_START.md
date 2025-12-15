# Configuración Rápida de Supabase

## 1. Crear Proyecto Supabase (2 minutos)

1. Ve a https://supabase.com y crea una cuenta
2. Haz clic en "New Project"
3. Rellena:
   - **Name**: `client-hub-crm`
   - **Password**: Elige una contraseña fuerte
   - **Region**: La más cercana a tu ubicación
4. Espera a que se cree (3-5 minutos)

## 2. Obtener Credenciales (1 minuto)

1. Una vez creado el proyecto, ve a **Settings > API**
2. Copia:
   - **Project URL** → `VITE_SUPABASE_URL`
   - **Anon Public Key** → `VITE_SUPABASE_ANON_KEY`

## 3. Actualizar `.env.local` (1 minuto)

Abre el archivo `.env.local` en la raíz del proyecto y actualiza:

```env
VITE_SUPABASE_URL=https://tu-proyecto.supabase.co
VITE_SUPABASE_ANON_KEY=tu-anon-key-aqui
```

## 4. Ejecutar Migraciones (2 minutos)

1. En Supabase, ve a **SQL Editor**
2. Haz clic en "New Query"
3. Copia el contenido de `supabase/migrations/001_create_tables.sql`
4. Pégalo en el editor
5. Haz clic en "Run"
6. ¡Listo! Las tablas están creadas

## 5. Probar la App (2 minutos)

```bash
npm run dev
```

1. Abre http://localhost:5173
2. Haz clic en "Registrarse" o usa el formulario de login
3. Crea una nueva cuenta
4. ¡Deberías estar en la aplicación!

## Verificar que todo funciona

En Supabase:

```sql
-- Ver usuarios registrados
SELECT * FROM auth.users;

-- Ver clientes creados
SELECT * FROM clients;
```

## Troubleshooting

| Error | Solución |
|-------|----------|
| "VITE_SUPABASE_URL is not defined" | Verifica `.env.local` y reinicia `npm run dev` |
| CORS error | Los errores de CORS son normales en localhost. Verifica en Settings > API |
| "No data returned" | Verifica que las políticas RLS están habilitadas en cada tabla |
| "User not found" | El usuario se crea en `auth.users`. Los clientes se crean en la tabla `clients` |

## Próximos pasos opcionales

- [ ] Crear usuario de prueba en Supabase
- [ ] Implementar React Query para caché de datos
- [ ] Integrar con páginas de clientes y productos
- [ ] Configurar email de confirmación
- [ ] Implementar recuperación de contraseña

¡Listo! Tu aplicación CRM está conectada a Supabase. 🎉
