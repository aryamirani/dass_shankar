
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function checkExercises() {
    const { data, error, count } = await supabase
        .from('exercises')
        .select('*', { count: 'exact' });

    if (error) {
        console.error('Error:', error);
    } else {
        console.log('Exercises count:', count);
        console.log('First 5 exercises:', data.slice(0, 5));
    }
}

checkExercises();

