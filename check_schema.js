
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.VITE_SUPABASE_URL
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY

const supabase = createClient(supabaseUrl, supabaseAnonKey)

async function checkSchema() {
  const { data, error } = await supabase
    .from('students')
    .select('*')
    .limit(1)

  if (error) {
    console.error('Error:', error)
  } else {
    console.log('Student columns:', data && data.length > 0 ? Object.keys(data[0]) : 'No data found')
    
    // Also check parents table just in case
    const { data: parentData } = await supabase
      .from('parents')
      .select('*')
      .limit(1)
    console.log('Parent columns:', parentData && parentData.length > 0 ? Object.keys(parentData[0]) : 'No data found')
  }
}

checkSchema()
