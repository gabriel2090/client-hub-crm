-- Script para inyectar usuario ADMIN en la tabla clients
-- UUID del usuario admin creado en Supabase: 39daeba5-0cf8-4e2b-b470-4a9fb161dcc0

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
  '39daeba5-0cf8-4e2b-b470-4a9fb161dcc0',
  'Administrador',
  'admin@crm.com',
  '+52 555 000 0000',
  'CRM Admin',
  'admin',
  'active',
  NOW(),
  NOW()
);

-- Verificar que el admin fue creado
SELECT * FROM clients WHERE role = 'admin';
