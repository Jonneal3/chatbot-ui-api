import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

// Load environment variables from .env
dotenv.config();

// Read environment variables
const supabaseUrl = process.env.SUPABASE_URL ?? '';
const supabaseKey = process.env.SUPABASE_API_KEY ?? '';

// Initialize Supabase client with environment variables
const supabase = createClient(supabaseUrl, supabaseKey);

const fetchAllVariables1 = async (action: string): Promise<any> => {
  try {
    // Use the provided contactId within the query
    const { data, error } = await supabase
      .from('use_cases_inputs_integrations')
      .select('*')
      .eq('actions', action)
    if (error) {
      throw error;
    }

    console.log(data);
    return data;
  } catch (error) {
    console.error('Error fetching data:', error);
    throw error;
  }
};

export default fetchAllVariables1;
