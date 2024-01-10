import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL ?? '';
const supabaseKey = process.env.SUPABASE_API_KEY ?? '';

const supabase = createClient(supabaseUrl, supabaseKey);

const fetchMemory = async (body: any) => {
  try {
    const { data, error } = await supabase
      .from('Memory')
      .select('*')
      .eq('sessions', body.contact_id)
      .eq('status', 'pending')
      .eq('source', 'assistant')

    if (error) {
      throw new Error(error.message || 'Unknown error occurred');
    }

    console.log(data); // Display the fetched data
    return data; // Return the filtered data
  } catch (error) {
    console.error('Error fetching memory:', error);
    throw new Error(`Error fetching memory: ${(error instanceof Error) ? error.message : 'Unknown error'}`);
  }
};

export default fetchMemory;
