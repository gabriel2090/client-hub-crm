-- Script para crear usuario ADMIN en Supabase
-- Este script crea un usuario de administrador que puede crear clientes

-- IMPORTANTE: Ejecutar este script DESPUÉS de 001_create_tables.sql
-- El usuario será creado con email: admin@crm.com y contraseña: Admin123456!

-- Crear el usuario admin en auth.users
-- NOTA: En Supabase, debes crear usuarios desde el panel de autenticación
-- O usar la API de administración. Este script asume que ya existe.

-- Si ya creaste el usuario admin@crm.com en Supabase, 
-- obtén su UUID (user_id) del panel Authentication > Users
-- y reemplaza 'YOUR_ADMIN_UUID' abajo

-- Crear registro de cliente para el admin
-- Reemplaza 'YOUR_ADMIN_UUID' con el UUID real del usuario admin
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
  'YOUR_ADMIN_UUID', -- Reemplaza con el UUID del usuario admin de Supabase
  'Administrador',
  'admin@crm.com',
  '+52 555 000 0000',
  'CRM Admin',
  'admin',
  'active',
  NOW(),
  NOW()
) ON CONFLICT (user_id, email) DO NOTHING;

-- Verificar que el admin fue creado
SELECT * FROM clients WHERE role = 'admin';
