const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');

// Load env vars
const envPath = path.join(process.cwd(), '.env.local');
const envConfig = dotenv.parse(fs.readFileSync(envPath));

const supabaseUrl = envConfig.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = envConfig.NEXT_PUBLIC_SUPABASE_ANON_KEY;

console.log('Connecting to:', supabaseUrl);
console.log('Anon Key ends with:', supabaseAnonKey.slice(-5));

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function diagnose() {
    try {
        console.log('Testing connection to admin_users table...');
        const { data, error, status } = await supabase
            .from('admin_users')
            .select('*');

        if (error) {
            console.error('Error fetching admin_users:', error.message);
            console.error('Status code:', status);
            return;
        }

        console.log(`Successfully connected! Found ${data.length} users.`);
        data.forEach(u => {
            console.log(`- User: ${u.username}, Role: ${u.role}, CreatedAt: ${u.created_at}`);
        });

        const ryan = data.find(u => u.username === 'ryan');
        if (ryan) {
            console.log('User "ryan" exists.');
        } else {
            console.log('User "ryan" NOT found in the table!');
        }

    } catch (e) {
        console.error('Unexpected error during diagnosis:', e);
    }
}

diagnose();
