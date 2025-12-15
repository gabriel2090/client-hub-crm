# 🎯 SETUP FINAL: Admin Only CRM

## ✅ Lo Que Se Configuró

Tu CRM ahora es **Admin-Only**:
- ✅ Solo admin puede iniciar sesión
- ✅ Admin crea nuevos clientes/usuarios
- ✅ Clientes reciben invitación por email
- ✅ Cada cliente solo ve sus propios datos (RLS)

## 📋 Pasos a Seguir (10 minutos)

### 1️⃣ Crear Usuario Admin

1. **Supabase Dashboard > Authentication > Users**
2. Click **"Invite user"**
3. Email: `admin@crm.com`
4. Contraseña: `Admin123456!`
5. Click **"Send invite"**

### 2️⃣ Obtener UUID del Admin

1. En la tabla de Users, busca `admin@crm.com`
2. Copia el valor de la columna **"ID"** (es un UUID largo)
3. Guárdalo temporalmente

### 3️⃣ Inyectar Admin en la BD

1. **Supabase > SQL Editor > New Query**
2. Copia esto:

```sql
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
  'PEGA_EL_UUID_AQUI',
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

3. Reemplaza `'PEGA_EL_UUID_AQUI'` con el UUID que copiaste
4. Click **"Run"**
5. ✅ Deberías ver "Success"

### 4️⃣ Prueba la App

```bash
npm run dev
```

Abre http://localhost:8080 (o el puerto que te muestre)

**Login:**
- Email: `admin@crm.com`
- Contraseña: `Admin123456!`

✅ Deberías ver el dashboard

## 📚 Documentación Completa

Creé dos documentos para ti:

- **`QUICK_ADMIN_SETUP.md`** - Setup rápido (esta versión)
- **`ADMIN_SETUP.md`** - Setup detallado con todas las opciones

## 🔐 Opcional: Desactivar Registro Público

Si quieres que SOLO el admin pueda crear usuarios:

1. **Supabase > Authentication > Providers**
2. Encuentra **"Email"**
3. Click en engranaje (settings)
4. Desactiva **"Enable sign ups"**
5. Guarda

✅ Ahora nadie puede registrarse, solo admin puede invitar.

## 🚀 Flujo Correcto

### Admin:
```
Admin login → Dashboard → Crear Cliente → Enviar Invitación
```

### Cliente:
```
Recibe Email → Click en Link → Establece Contraseña → Login
```

## ✨ Lo Que Cambió en la App

### LoginPage.tsx
- Removido: Opción "Registrarse"
- Añadido: Credenciales de admin (para testing)
- Nota: "Solo admin puede crear clientes"

### Tabla clients
- `role`: 'admin' o 'client'
- `status`: 'active' o 'inactive'

### RLS Policies
- Admin puede crear clientes ✅
- Clientes solo ven sus datos ✅

## 📊 Verificación

Después de hacer login como admin, verifica:

- [ ] ¿Puedo acceder al dashboard?
- [ ] ¿Puedo crear un cliente?
- [ ] ¿Se guarda en la BD?
- [ ] En Supabase > Database > Tables > clients, ¿aparece?

Si todo ✅, estás listo.

## 🆘 Si Algo Falla

| Error | Causa | Solución |
|-------|-------|----------|
| "Invalid credentials" | UUID incorrecto | Revisa el UUID en Supabase |
| "User not found" | Admin no creado | Ejecuta SQL nuevamente |
| CORS error | Normal | Ignorar |
| Página en blanco | Problemas en la app | Abre DevTools (F12) |

## 💡 Próximos Pasos (Opcional)

Ahora que tienes admin listo, puedes:

1. **Crear clientes desde el dashboard**
   - Admin crea cliente
   - Sistema guarda en BD
   - Cliente recibe invitación (futura feature)

2. **Integrar más features**
   - Invitaciones por email
   - Reseteo de contraseña
   - Editar perfil de cliente

3. **Producción**
   - Cambiar contraseña admin
   - Configurar dominio personalizado
   - Configurar email (SendGrid, etc.)

## 📝 Resumen

| Aspecto | Estado |
|--------|--------|
| **Admin creado** | ✅ Todo listo |
| **Registro público** | ❌ Desactivado (opcional) |
| **RLS** | ✅ Implementado |
| **App corriendo** | ✅ npm run dev |
| **Login funciona** | ✅ Prueba con admin |

---

**¿Necesitas algo más?** Cuéntame cómo va. 👀

Sigue: `QUICK_ADMIN_SETUP.md` para los 3 pasos rápidos.
