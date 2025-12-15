// scripts/reset-user.mjs
import dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';

// 👇 Cargar variables desde .env.admin (en la raíz del proyecto)
dotenv.config({ path: '.env.admin' });

const supabaseUrl = process.env.SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !serviceRoleKey) {
    console.error(
        'Faltan SUPABASE_URL o SUPABASE_SERVICE_ROLE_KEY en .env.admin'
    );
    process.exit(1);
}

// Cliente de administración usando la service role key
const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey, {
    auth: {
        autoRefreshToken: false,
        persistSession: false,
    },
});

async function resetUser(email, password) {
    if (!email || !password) {
        console.error('Uso: npm run reset:user -- email password');
        process.exit(1);
    }

    // 1) Buscar usuario existente
    const { data, error: listError } =
        await supabaseAdmin.auth.admin.listUsers();

    if (listError) {
        console.error('Error listando usuarios:', listError.message);
        process.exit(1);
    }

    const existing = data.users.find((u) => u.email === email);

    if (existing) {
        console.log(`Eliminando usuario existente ${email} (${existing.id})...`);
        const { error: delError } =
            await supabaseAdmin.auth.admin.deleteUser(existing.id);
        if (delError) {
            console.error('Error eliminando usuario:', delError.message);
            process.exit(1);
        }
    }

    // 2) Crear usuario nuevo
    console.log(`Creando usuario nuevo ${email}...`);
    const { data: createData, error: createError } =
        await supabaseAdmin.auth.admin.createUser({
            email,
            password,
            email_confirm: true,
            user_metadata: {
                name: email.split('@')[0],
                role: email === 'admin@crm.com' ? 'admin' : 'client',
            },
        });

    if (createError) {
        console.error('Error creando usuario:', createError.message);
        process.exit(1);
    }

    console.log('Usuario creado:', createData.user.id);
}

const [, , email, password] = process.argv;

resetUser(email, password).then(() => process.exit(0));
