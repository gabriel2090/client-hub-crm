# ✅ Checklist de Configuración de Supabase

Este documento es tu guía para configurar Supabase paso a paso.

## 📋 Checklist de Configuración

### Fase 1: Crear Proyecto Supabase (⏱️ 10 minutos)

- [ ] **Crear cuenta en Supabase**
  - Ve a https://supabase.com
  - Haz clic en "Start your project"
  - Regístrate con email o GitHub
  - Confirma tu email

- [ ] **Crear nuevo proyecto**
  - Nombre del proyecto: `client-hub-crm`
  - Database Password: `[Tu contraseña fuerte aquí]` ⚠️
  - Region: Selecciona la más cercana a ti
  - Pricing: "Free" (Gratuito)

- [ ] **Espera a que se cree**
  - Esto toma 3-5 minutos
  - Recibirás una confirmación cuando esté listo

### Fase 2: Obtener Credenciales (⏱️ 5 minutos)

- [ ] **Ve a Settings > API**
  - En el menú lateral, ve a "Settings"
  - Haz clic en "API"

- [ ] **Copia Project URL**
  - Campo: "Project URL"
  - Valor típico: `https://xyzabc.supabase.co`
  - ✅ Copiar a: `VITE_SUPABASE_URL` en `.env.local`

- [ ] **Copia Anon Public Key**
  - Campo: "Anon public key"
  - Valor: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`
  - ✅ Copiar a: `VITE_SUPABASE_ANON_KEY` en `.env.local`

- [ ] **Guarda Service Role Key** (opcional)
  - Solo para backend, NO para frontend
  - Puedes ignorar esto por ahora

### Fase 3: Actualizar Variables de Entorno (⏱️ 2 minutos)

- [ ] **Abre el archivo `.env.local`**
  - Ubicación: Raíz del proyecto
  - Contenido inicial:
    ```env
    VITE_SUPABASE_URL=https://your-project.supabase.co
    VITE_SUPABASE_ANON_KEY=your-anon-key-here
    ```

- [ ] **Reemplaza con tus valores**
  - Pega `VITE_SUPABASE_URL` (del Paso 2)
  - Pega `VITE_SUPABASE_ANON_KEY` (del Paso 2)
  - **NO** hagas commit de este archivo (está en `.gitignore`)

- [ ] **Verifica que los valores no tienen espacios**
  - Sin comillas extra
  - Sin espacios al inicio/final

- [ ] **Reinicia el servidor**
  ```bash
  # Ctrl+C para detener
  npm run dev
  ```

### Fase 4: Ejecutar Migraciones SQL (⏱️ 10 minutos)

- [ ] **Ve a SQL Editor en Supabase**
  - En el menú lateral, haz clic en "SQL Editor"
  - Haz clic en "New Query"

- [ ] **Copia el script de migraciones**
  - Abre: `supabase/migrations/001_create_tables.sql`
  - Copia TODO el contenido

- [ ] **Pega en el editor SQL**
  - Paste en Supabase SQL Editor
  - Verifica que el texto se copió correctamente

- [ ] **Ejecuta el script**
  - Haz clic en el botón azul "Run" (esquina inferior derecha)
  - Espera a que se complete
  - Deberías ver ✅ en cada comando ejecutado

- [ ] **Verifica que las tablas se crearon**
  - Ve a "Database > Tables" en el menú lateral
  - Deberías ver:
    - `auth.users` (ya existe)
    - `clients` ✅
    - `products` ✅
    - `sales` ✅
    - `activity_logs` ✅

### Fase 5: Habilitar Autenticación (⏱️ 2 minutos)

- [ ] **Ve a Authentication > Providers**
  - En el menú lateral, ve a "Authentication"
  - Haz clic en "Providers"

- [ ] **Verifica que Email está habilitado**
  - Busca "Email"
  - El toggle debe estar en verde (ON)
  - Si está OFF, haz clic para activar

- [ ] **Configura Email (opcional)**
  - Ve a "Authentication > Email Templates"
  - Personaliza los templates si lo deseas
  - Por defecto, Supabase ya enía buenos templates

### Fase 6: Probar la Aplicación (⏱️ 5 minutos)

- [ ] **Inicia el servidor de desarrollo**
  ```bash
  npm run dev
  ```

- [ ] **Abre http://localhost:5173 en el navegador**

- [ ] **Intenta registrar un nuevo usuario**
  - Usa un email real (no necesita ser válido para esto)
  - Ej: `test@example.com`
  - Contraseña: `TestPassword123!`
  - Haz clic en "Registrarse" o el botón de login

- [ ] **Verifica que el registro funcionó**
  - Deberías ser redirigido al dashboard
  - En Supabase, ve a "Authentication > Users"
  - Deberías ver tu nuevo usuario

- [ ] **Intenta iniciar sesión**
  - Cierra sesión (logout)
  - Intenta iniciar sesión con el email que registraste
  - Deberías entrar al dashboard

- [ ] **Verifica que los datos se guardan**
  - En el dashboard, crea un cliente
  - En Supabase, ve a "Database > Tables > clients"
  - Deberías ver el cliente que creaste

### Fase 7: Verificación Final (⏱️ 5 minutos)

- [ ] **Ejecuta queries en SQL para verificar**
  - Ve a SQL Editor en Supabase
  - Ejecuta: `SELECT * FROM auth.users;`
  - Deberías ver al menos un usuario

- [ ] **Verifica clientes**
  - Ejecuta: `SELECT * FROM clients;`
  - Deberías ver los clientes que creaste

- [ ] **Verifica RLS**
  - Ve a "Authentication > Policies"
  - Deberías ver políticas para:
    - clients_select_policy ✅
    - clients_insert_policy ✅
    - clients_update_policy ✅
    - clients_delete_policy ✅

- [ ] **Verifica datos en el dashboard**
  - Crea algunos clientes desde la app
  - Crea algunos productos desde la app
  - Crea algunas ventas desde la app
  - Verifica que aparecen en las tablas de Supabase

### Fase 8: Seguridad y Producción (⏱️ 10 minutos) - OPCIONAL

- [ ] **Cambiar contraseña de base de datos** (IMPORTANTE)
  - Ve a "Settings > Database"
  - Haz clic en "Reset database password"
  - Guarda la nueva contraseña en lugar seguro

- [ ] **Habilitar autenticación de email**
  - Ve a "Authentication > Email Templates"
  - Configura emails personalizados si es necesario

- [ ] **Crear backups** (Pro plan)
  - En Supabase, ve a "Backups"
  - Configura backups automáticos

- [ ] **Configurar variables de producción**
  - En tu plataforma de hosting (Vercel, Netlify, etc.)
  - Añade:
    - `VITE_SUPABASE_URL`
    - `VITE_SUPABASE_ANON_KEY`

## 🔍 Troubleshooting

### "VITE_SUPABASE_URL is not defined"
**Solución:**
1. Verifica que `.env.local` existe
2. Verifica que tiene `VITE_SUPABASE_URL=...`
3. Reinicia: `npm run dev`

### "Invalid credentials"
**Solución:**
1. Verifica que copió correctamente la URL y Key
2. Verifica que la autenticación está habilitada en Supabase
3. Intenta crear un nuevo usuario desde Supabase (Authentication > Users)

### "User not found"
**Solución:**
1. Verifica que el usuario está en `auth.users`
2. Intenta con otro usuario
3. Verifica la contraseña

### "No data returned"
**Solución:**
1. Verifica que las migraciones SQL se ejecutaron (todas las tablas existen)
2. Verifica que las políticas RLS están habilitadas
3. Verifica que estás logueado
4. Verifica que creaste datos desde la app

### CORS Error
**Solución:**
1. Normal en localhost, Supabase lo permite automáticamente
2. En producción, verifica "Settings > API" en Supabase
3. Añade tu dominio en "Authorized redirect URLs"

## ✨ Próximos Pasos

Una vez completado todo:

1. **Integración en componentes** (30 minutos)
   - Ver: `SERVICES_INTEGRATION_GUIDE.md`
   - Actualiza ClientsPage, ProductsPage, etc.

2. **React Query** (optional, 1 hora)
   - Implementa caché y sincronización automática
   - `npm install @tanstack/react-query`

3. **Deployment** (1-2 horas)
   - Sube a Vercel, Netlify, o tu hosting preferido
   - Configura variables de entorno en producción

4. **Mejoras avanzadas** (future)
   - 2FA (Two Factor Authentication)
   - OAuth social login (Google, GitHub, etc.)
   - Email confirmación
   - API REST custom

## 📞 Soporte

Si necesitas ayuda:

1. **Documentación de Supabase**: https://supabase.com/docs
2. **Discord de Supabase**: https://discord.supabase.com
3. **GitHub Issues**: Crea un issue en tu repositorio

## ✅ Confirmación Final

**Marca esto cuando todo esté funcionando:**

- [ ] Creé proyecto en Supabase
- [ ] Obtuve y configuré variables de entorno
- [ ] Ejecuté migraciones SQL
- [ ] Habilité autenticación
- [ ] Pude registrar un usuario
- [ ] Pude iniciar sesión
- [ ] Los datos se guardan en la BD
- [ ] Mi aplicación funciona correctamente

🎉 **¡FELICIDADES! Tu aplicación CRM está lista con Supabase.**

---

**Documento actualizado**: Diciembre 2024
**Versión**: 1.0
**Tiempo total de configuración**: ~45 minutos
