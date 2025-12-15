# ⚡ QUICK SETUP: Crear Admin y Desactivar Registro

## 3 Pasos Rápidos (10 minutos)

### Paso 1️⃣ : Crear Usuario Admin en Supabase (3 minutos)

1. Ve a **Supabase Dashboard**
2. Click en **Authentication** (menú izquierdo)
3. Click en **Users**
4. Click en botón azul **"Invite user"**
5. Completa:
   - **Email**: `admin@crm.com`
   - **Password**: `Admin123456!`
6. Click **"Send invite"**

✅ El admin está creado. Ahora copia el UUID.

### Paso 2️⃣: Obtener UUID del Admin (2 minutos)

1. En la tabla de **Users** busca `admin@crm.com`
2. En la columna **"ID"**, copia el valor (algo como `550e8400-e29b-41d4-a716-446655440000`)
3. Guárdalo en un bloc de notas

### Paso 3️⃣: Inyectar Admin en la BD (5 minutos)

1. Ve a **SQL Editor**
2. Click **"New Query"**
3. Copia y pega esto (reemplaza `TU_UUID_AQUI`):

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
  'TU_UUID_AQUI',
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

4. Click **"Run"**
5. ✅ Deberías ver "Success"

---

## 🔐 Opcional: Desactivar Registro Público

Si NO quieres que cualquiera se registre:

1. Ve a **Authentication > Providers**
2. Encuentra **"Email"**
3. Click en el engranaje (settings)
4. Desactiva **"Enable sign ups"**
5. Guarda

✅ Ahora solo admin puede invitar usuarios.

---

## 🚀 Probar la App

```bash
npm run dev
```

Abre http://localhost:5173

Intenta iniciar sesión:
- **Email**: `admin@crm.com`
- **Contraseña**: `Admin123456!`

✅ Deberías entrar al dashboard como admin

---

## ❓ Verificación

- ✅ ¿Loguearse como admin funciona?
- ✅ ¿Puedes ver el dashboard?
- ✅ ¿Puedes crear clientes?
- ✅ ¿Los clientes se guardan en la BD?

Si todo funciona, ¡listo! 🎉

---

## 🐛 Troubleshooting

| Problema | Solución |
|----------|----------|
| "Invalid credentials" | Verifica que copiaste el UUID correcto |
| "User not found" | Recarga la página después de inyectar |
| "CORS error" | Normal, ignorar |
| No aparece admin en BD | Ejecuta el SQL nuevamente |

---

Cualquier duda, avísame. 👀
