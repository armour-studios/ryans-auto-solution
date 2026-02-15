const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');

// Load env vars
const envPath = path.join(process.cwd(), '.env.local');
const envConfig = dotenv.parse(fs.readFileSync(envPath));

const supabaseUrl = envConfig.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = envConfig.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function addAdmin() {
    const { data, error } = await supabase
        .from('admin_users')
        .insert([
            {
                username: 'ryan',
                password: 'ryan2026',
                role: 'admin',
                created_at: new Date().toISOString()
            }
        ]);

    if (error) {
        console.error('Error adding user:', error.message);
        process.exit(1);
    }

    console.log('User "ryan" added successfully!');
}

addAdmin();
