// addToActionQueue.ts

import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

// Define CombinedData type
type CombinedData = {
  actionId: any;
  sessions: any;
  hidden_bool: any;
  description: any;
};

async function addToActionQueue(combinedData: CombinedData) {
  try {
    // Load environment variables from .env
    dotenv.config();

    // Read environment variables
    const supabaseUrl = process.env.SUPABASE_URL || '';
    const supabaseKey = process.env.SUPABASE_API_KEY || '';

    // Initialize Supabase client with environment variables
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Data to be inserted
    const dataToInsert = {
      actions: combinedData.actionId,
      sessions: combinedData.sessions,
      retries_remaining: '2',
      status: 'queued',
      hidden_bool: combinedData.hidden_bool,
      description: combinedData.description,
    };

    // Insert data into the 'Action_Queue' table
    const { data: data, error: error } = await supabase
      .from('Action_Queue')
      .insert([dataToInsert]);
    if (error) {
      throw error;
    }

    console.log(data);
    return { added: data }; // Return the inserted data
  } catch (error) {
    console.error('Error inserting data:', error);
    throw error;
  }
}

export { addToActionQueue, type CombinedData }; // Exporting CombinedData type
 // Exporting CombinedData type
 // Exporting CombinedData type    export type { CombinedData };

