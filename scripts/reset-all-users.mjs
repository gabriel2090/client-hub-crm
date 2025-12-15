import dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';

// Cargar .env.admin
dotenv.config({ path: '.env.admin' });

const supabaseUrl = process.env.SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !serviceRoleKey) {
    console.error(
        'Faltan SUPABASE_URL o SUPABASE_SERVICE_ROLE_KEY en .env.admin'
    );
    process.exit(1);
}

const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey, {
    auth: {
        autoRefreshToken: false,
        persistSession: false,
    },
});

async function wipeAllUsers() {
    console.log('Listando usuarios...');
    const { data, error } = await supabaseAdmin.auth.admin.listUsers({
        page: 1,
        perPage: 1000,
    });

    if (error) {
        console.error('Error listando usuarios:', error.message);
        console.error('Detalle:', JSON.stringify(error, null, 2));
        process.exit(1);
    }

    if (!data.users.length) {
        console.log('No hay usuarios para borrar.');
        return;
    }

    for (const user of data.users) {
        console.log(`Borrando usuario ${user.email} (${user.id})...`);
        const { error: delError } =
            await supabaseAdmin.auth.admin.deleteUser(user.id);
        if (delError) {
            console.error(
                `Error borrando usuario ${user.email}:`,
                delError.message
            );
            console.error('Detalle:', JSON.stringify(delError, null, 2));
            process.exit(1);
        }
    }

    console.log('Todos los usuarios borrados correctamente.');
}

async function createUser(email, password) {
    console.log(`Creando usuario nuevo ${email}...`);
    const { data, error } =
        await supabaseAdmin.auth.admin.createUser({
            email,
            password,
            email_confirm: true,
            user_metadata: {
                name: email.split('@')[0],
                role: email === 'admin@crm.com' ? 'admin' : 'client',
            },
        });

    if (error) {
        console.error('Error creando usuario:', error.message);
        console.error('Detalle:', JSON.stringify(error, null, 2));
        process.exit(1);
    }

    console.log('Usuario creado:', data.user.id);
}

const [, , email, password] = process.argv;

if (!email || !password) {
    console.error('Uso: npm run reset:all-users -- email password');
    process.exit(1);
}

wipeAllUsers()
    .then(() => createUser(email, password))
    .then(() => process.exit(0));
