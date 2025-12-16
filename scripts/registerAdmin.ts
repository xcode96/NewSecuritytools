
import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;
// IMPORTANT: For admin creation, you typically need the SERVICE_ROLE_KEY if you want to bypass email confirmation or manage users directly.
// However, since we are just signing up a user, the ANON key works if email confirmation is disabled or if we check email.
// But to insert into `admin_users` table, we might need RLS policies that allow it, OR use the service role key.
// BETTER APPROACH: Use the Service Role Key for this script to ensure we can insert into admin_users regardless of RLS.
// Assuming the user has VITE_SUPABASE_SERVICE_ROLE_KEY in .env, checking... if not, will fallback to Anon and hope for RLS.
// Actually, for this task, I will ask the user to use the Anon key and we will ensure RLS allows insertion OR (better) I will use the service role key if available, else warn.
// Wait, the user probably doesn't have SERVICE_ROLE_KEY in .env. I will assume standard usage.
// Let's use the Anon key, but we need to sign up the user.

if (!supabaseUrl || !supabaseKey) {
    console.error('Missing VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

const ADMIN_EMAIL = 'dqadm@admin.com';
const ADMIN_PASSWORD = 'admin'; // User requested 'admin'

async function registerAdmin() {
    console.log(`Registering admin user: ${ADMIN_EMAIL}...`);

    // 1. Sign Up User
    const { data: authData, error: authError } = await supabase.auth.signUp({
        email: ADMIN_EMAIL,
        password: ADMIN_PASSWORD,
    });

    if (authError) {
        console.error('Error creating auth user:', authError.message);
        return;
    }

    if (!authData.user) {
        console.error('No user returned from sign up.');
        return;
    }

    console.log('Auth user created successfully:', authData.user.id);

    // 2. Insert into admin_users table
    // Note: RLS might block this if using anon key. 
    // If this fails, the user might need to insert manually in Supabase Dashboard SQL Editor:
    // insert into public.admin_users (user_id) values ('<user_id>');

    const { error: dbError } = await supabase
        .from('admin_users')
        .insert([{ user_id: authData.user.id }]);

    if (dbError) {
        console.error('Error adding user to admin_users table:', dbError.message);
        console.log('IMPORTANT: Please manually run this SQL in your Supabase Dashboard:');
        console.log(`INSERT INTO public.admin_users (user_id) VALUES ('${authData.user.id}');`);
    } else {
        console.log('User successfully added to admin_users table.');
    }
}

registerAdmin();
