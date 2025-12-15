# Configuración de Supabase para CRM

Este documento guía los pasos necesarios para configurar Supabase como base de datos para la aplicación CRM.

## 1. Crear una cuenta en Supabase

1. Ve a [https://supabase.com](https://supabase.com)
2. Haz clic en "Start your project" (Inicia tu proyecto)
3. Regístrate con tu email o cuenta de GitHub
4. Crea una nueva organización (si es necesario)

## 2. Crear un nuevo proyecto

1. En el dashboard de Supabase, haz clic en "New Project"
2. Completa los detalles:
   - **Name**: `client-hub-crm` (o el nombre que prefieras)
   - **Database Password**: Elige una contraseña fuerte (guárdala segura)
   - **Region**: Elige la región más cercana a ti
   - **Pricing Plan**: Selecciona "Free" para empezar

3. Espera a que se cree el proyecto (esto puede tomar algunos minutos)

## 3. Obtener las credenciales

Una vez creado el proyecto:

1. Ve a **Settings > API** en el menú lateral
2. Copia los siguientes valores:
   - **Project URL**: Este es tu `VITE_SUPABASE_URL`
   - **Anon Public Key**: Este es tu `VITE_SUPABASE_ANON_KEY`
   - (Opcional) **Service Role Key**: Para operaciones de backend (NO lo uses en el frontend)

3. Abre el archivo `.env.local` en la raíz del proyecto y actualiza:
   ```
   VITE_SUPABASE_URL=https://your-project.supabase.co
   VITE_SUPABASE_ANON_KEY=your-anon-key-here
   ```

## 4. Ejecutar las migraciones SQL

Las tablas y políticas de Row Level Security (RLS) se deben crear manualmente:

1. En el dashboard de Supabase, ve a **SQL Editor**
2. Haz clic en "New Query"
3. Copia todo el contenido de `supabase/migrations/001_create_tables.sql`
4. Pégalo en el editor SQL
5. Haz clic en "Run" (botón azul en la esquina inferior derecha)
6. Espera a que se complete (deberías ver ✅ en los comandos ejecutados)

### Tablas creadas:
- **clients**: Información de clientes
- **products**: Catálogo de productos
- **sales**: Registro de ventas
- **activity_logs**: Registro de auditoría (opcional)

### Políticas de seguridad:
- Cada usuario solo puede ver y modificar sus propios datos
- Las políticas de Row Level Security (RLS) están habilitadas automáticamente

## 5. Habilitar autenticación de email/contraseña

1. Ve a **Authentication > Providers** en el menú lateral
2. Asegúrate de que "Email" esté habilitado (debe estar por defecto)
3. Ve a **Authentication > Email Templates** para personalizar los emails (opcional)

## 6. Crear usuario de prueba

Opcionalmente, puedes crear un usuario de prueba:

1. Ve a **Authentication > Users** en el menú lateral
2. Haz clic en "Invite user"
3. Ingresa un email y contraseña
4. El usuario estará listo para usar en la aplicación

## 7. Verificar la configuración

Ejecuta el proyecto:

```bash
npm run dev
```

1. Abre [http://localhost:5173](http://localhost:5173)
2. Intenta registrarte con un nuevo usuario
3. Intenta iniciar sesión
4. Verifica que los datos se guardan en Supabase

Para verificar:
1. Ve a **SQL Editor** en Supabase
2. Ejecuta: `SELECT * FROM auth.users;` para ver usuarios
3. Ejecuta: `SELECT * FROM clients;` para ver datos de clientes

## Troubleshooting

### Error: "Missing environment variables"
- Verifica que `.env.local` tiene `VITE_SUPABASE_URL` y `VITE_SUPABASE_ANON_KEY`
- Reinicia el servidor de desarrollo (`npm run dev`)

### Error: "CORS error" o "Request blocked"
- Verifica en **Settings > API** que tu dominio esté permitido
- Para desarrollo local, Supabase automáticamente permite `localhost:*`

### No puedo crear usuarios
- Verifica que la autenticación de email está habilitada en **Authentication > Providers**
- Verifica que las políticas RLS en la tabla `clients` están configuradas correctamente

### Los datos no se guardan
- Verifica que las tablas se crearon correctamente: Ve a **Database > Tables** en Supabase
- Verifica que las políticas RLS están habilitadas: Ve a **Authentication > Policies**
- Revisa la consola del navegador para errores (F12 > Console)

## Configuración de producción

Para producción:

1. Crea un nuevo proyecto de Supabase (no uses el de desarrollo)
2. Actualiza las variables de entorno en tu plataforma de hosting:
   ```
   VITE_SUPABASE_URL=https://your-production-project.supabase.co
   VITE_SUPABASE_ANON_KEY=your-production-anon-key
   ```
3. Ejecuta las migraciones en el proyecto de producción
4. Habilita autenticación y verifica todas las políticas RLS

## Documentación adicional

- [Supabase Docs](https://supabase.com/docs)
- [Supabase Auth](https://supabase.com/docs/guides/auth)
- [Row Level Security (RLS)](https://supabase.com/docs/guides/auth/row-level-security)
- [Supabase JavaScript Client](https://supabase.com/docs/reference/javascript)
