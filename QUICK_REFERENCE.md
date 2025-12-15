# ⚡ QUICK REFERENCE - Guía Rápida

Referencia rápida para todas las acciones comunes.

## 🚀 Primeros Pasos (30 segundos)

```bash
# 1. Leer punto de entrada
START_HERE.md

# 2. Configurar Supabase (ver SETUP_CHECKLIST.md)
# 3. Copiar URL y Key a .env.local
# 4. Ejecutar migraciones SQL
# 5. npm run dev
```

---

## 📋 Checklist Rápida

- [ ] Creé proyecto en Supabase
- [ ] Obtuve URL y Anon Key
- [ ] Actualicé `.env.local`
- [ ] Ejecuté migraciones SQL
- [ ] Ejecuté `npm run dev`
- [ ] Probé registrarse
- [ ] Verifiqué datos en Supabase

---

## 📁 Dónde Encontrar Todo

| Necesito... | Archivo |
|------------|---------|
| **Comenzar** | `START_HERE.md` |
| **Configurar Supabase** | `SETUP_CHECKLIST.md` |
| **Quick start** | `SUPABASE_QUICK_START.md` |
| **Guía detallada** | `SUPABASE_SETUP.md` |
| **Usar servicios** | `SERVICES_INTEGRATION_GUIDE.md` |
| **Detalles técnicos** | `SUPABASE_INTEGRATION.md` |
| **Entender cambios** | `BEFORE_AFTER_COMPARISON.md` |
| **Arquitectura** | `ARCHITECTURE.md` |
| **Índice completo** | `INDEX.md` |
| **Resumen ejecutivo** | `EXECUTIVE_SUMMARY.md` |

---

## ⚙️ Configuración (Copiar y Pegar)

### Abrir `.env.local`:
```env
VITE_SUPABASE_URL=https://[tu-proyecto].supabase.co
VITE_SUPABASE_ANON_KEY=[tu-anon-key-aqui]
```

### Obtener credenciales:
1. Ve a https://supabase.com
2. Settings > API
3. Copia "Project URL" y "Anon Public Key"
4. Pega en `.env.local`

---

## 🛠️ Comandos Útiles

```bash
# Desarrollo
npm run dev              # Inicia servidor local

# Build
npm run build            # Compila para producción
npm run preview          # Prevé el build

# Testing
npm test                 # Ejecuta tests
npm test -- --coverage   # Reporte de cobertura

# Linting
npm run lint             # ESLint check
```

---

## 🔐 Variables de Entorno

```
Archivo: .env.local (NO COMMITAR)

VITE_SUPABASE_URL
  → Obtén de: Supabase > Settings > API > Project URL
  → Ejemplo: https://xyzabc.supabase.co

VITE_SUPABASE_ANON_KEY
  → Obtén de: Supabase > Settings > API > Anon Public Key
  → Ejemplo: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

---

## 📞 Troubleshooting Rápido

| Problema | Solución |
|----------|----------|
| "VITE_SUPABASE_URL is not defined" | Reinicia: `npm run dev` |
| "Invalid credentials" | Verifica `.env.local` |
| "User not found" | Crea usuario en Supabase |
| "RLS policy violation" | Ejecuta migraciones SQL |
| CORS error | Normal en localhost ✓ |

**Problemas más complejos?** Ver `SUPABASE_SETUP.md` (sección Troubleshooting)

---

## 🎯 Tareas Comunes

### Registrar Usuario
```typescript
const { success, error } = await signUp(name, email, password);
```

### Login
```typescript
const { success, error } = await signIn(email, password);
```

### Obtener Clientes
```typescript
const { success, data } = await fetchClients();
```

### Crear Cliente
```typescript
const { success, data } = await createClient({ name, email, phone, company });
```

### Logout
```typescript
await supabase.auth.signOut();
```

---

## 📊 Verificar Configuración

En Supabase:

```sql
-- Ver usuarios
SELECT * FROM auth.users;

-- Ver clientes
SELECT * FROM clients;

-- Ver productos
SELECT * FROM products;

-- Ver ventas
SELECT * FROM sales;
```

---

## 🚀 Deployment (Pasos Rápidos)

### Vercel
```bash
npm install -g vercel
vercel
# Añade variables de entorno en Vercel Dashboard
```

### Netlify
```bash
npm install -g netlify-cli
netlify deploy
# Configura variables de entorno en Netlify UI
```

### Otros
- Firebase Hosting
- AWS Amplify
- GitHub Pages
- Railway
- Render

---

## 🔑 Archivos Importantes

```
.env.local              ← EDITA ESTO (credenciales)
.env.example            ← NO edites (plantilla)

src/services/           ← Servicios CRUD
  ├── supabase.ts
  ├── auth.ts
  ├── clients.ts
  ├── products.ts
  └── sales.ts

src/contexts/
  └── AuthContext.tsx   ← Manejo de autenticación

supabase/migrations/
  └── 001_*.sql        ← Schema de BD
```

---

## 📚 Documentación Mínima (15 minutos)

1. **START_HERE.md** (5 min) - Intro
2. **SUPABASE_QUICK_START.md** (5 min) - Setup
3. **README_NUEVO.md** (5 min) - Overview

---

## 🎓 Documentación Completa (2 horas)

1. **START_HERE.md**
2. **SETUP_CHECKLIST.md**
3. **SUPABASE_SETUP.md**
4. **SERVICES_INTEGRATION_GUIDE.md**
5. **ARCHITECTURE.md**
6. **BEFORE_AFTER_COMPARISON.md**

---

## ✨ Recordatorios

✅ Nunca commites `.env.local`
✅ Usa HTTPS en producción
✅ Mantén ANON_KEY segura
✅ Configura backups regulares
✅ Monitorea uso en Supabase

---

## 🎯 Próximo Paso

```
1. Abre: START_HERE.md
2. Sigue: SETUP_CHECKLIST.md
3. ¡Disfruta! 🎉
```

---

**Última actualización**: Diciembre 2024
**Proyecto**: Client Hub CRM v2.0
**Estado**: ✅ Listo para usar
