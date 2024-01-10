import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

// Load environment variables from .env
dotenv.config();

// Read environment variables
const supabaseUrl = process.env.SUPABASE_URL ?? '';
const supabaseKey = process.env.SUPABASE_API_KEY ?? '';

// Initialize Supabase client with environment variables
const supabase = createClient(supabaseUrl, supabaseKey);

// Function to fetch variables based on body parameters
export const fetchAllVariables = async (body: any): Promise<any> => {
  try {
    // Use the body parameters within the query
    const { data, error } = await supabase
      .from('bot_info')
      .select('*')
      .eq('uuid', body.bot_id);

    if (error) {
      throw error;
    }
    const botId = data[0]?.bot_id; // Assuming data is an array, accessing the first object's bot_id
    
    const { data: sessionData, error: sessionsError } = await supabase
      .from('Sessions')
      .upsert(
        [
          {
            contact_id: body.contact_id,
            bots: botId,
          },
        ],
        {
          onConflict: 'contact_id', // Specify the column for conflict resolution
          ignoreDuplicates: false,
          defaultToNull: true,
        }
      )
      .select();

    if (sessionsError) {
      throw sessionsError;
    }

    const { error: memoryError } = await supabase
      .from('Memory')
      .insert([
        {
          sessions: body.contact_id,
          response: body.message,
          source: 'user',
          type: 'message',
          status: 'complete',
        },
      ]);
      
    if (memoryError) {
      throw memoryError;
    }

console.log(data)

    return { botInfo: data, sessions: sessionData }; // Return the queried data
  } catch (error) {
    console.error('Error fetching variables:', error);
    throw error;
  }
};
