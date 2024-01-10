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
export const addToMem = async ( finalSummaryRequest1: any, body: { contact_id: any } ) => {
  try {
    const { data, error: memoryError } = await supabase
      .from('Memory')
      .insert([
        {
          sessions: body.contact_id,
          response: finalSummaryRequest1.choices[0].message.content,
          source: 'assistant',
          type: 'message',
          status: 'complete',
          llm_model: finalSummaryRequest1.model,
          prompt_tokens: finalSummaryRequest1.usage.prompt_tokens,
          completion_tokens: finalSummaryRequest1.usage.completion_tokens,
          total_tokens: finalSummaryRequest1.usage.total_tokens,
          finish_reason: finalSummaryRequest1.choices[0].finish_reason,
        },
      ])
      .select();
      
      
    if (memoryError) {
      throw memoryError;
    }

    return data; // Return the queried data, removed the curly braces
  } catch (error) {
    console.error('Error fetching variables:', error);
    throw error;
  }
};

export default addToMem