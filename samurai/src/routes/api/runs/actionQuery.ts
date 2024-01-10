import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_API_KEY || '';

const supabase = createClient(supabaseUrl, supabaseKey);

export const actionQuery = async (finalTaskId: any): Promise<any> => {
  try {
    const { data, error } = await supabase
      .from('Actions')
      .select('*')
      .eq('tasks', finalTaskId);

    if (error) {
      throw error;
    }

    console.log(data);

    return { possibleActions: data };
  } catch (error) {
    console.error('Error fetching variables:', error);
    throw error;
  }
};
