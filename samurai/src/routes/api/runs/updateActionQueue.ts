import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

// Load environment variables from .env
dotenv.config();

// Read environment variables
const supabaseUrl = process.env.SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_API_KEY || '';

// Initialize Supabase client with environment variables
const supabase = createClient(supabaseUrl, supabaseKey);

// Function to fetch variables based on body parameters
export const addToMem = async ( finalCompletion1: any, finalCompletionMessage: any, finalCompletionStatus: any, fetchedAction: any ) => {
  try {
    const { data, error: memoryError } = await supabase
      .from('Action_Queue')
      .update({ 
        status: finalCompletionStatus,
        status_message: finalCompletionMessage,
        status_raw_response: finalCompletion1   
        })
      .eq('id', fetchedAction.action_queue_id)
      .select();
      
    if (memoryError) {
      throw memoryError;
    }

    console.log(data);

    return data; // Return the queried data, removed the curly braces
  } catch (error) {
    console.error('Error fetching variables:', error);
    throw error;
  }
};

export default addToMem