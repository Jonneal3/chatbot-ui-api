import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

interface TaskMatchParams {
  data_sources: number[];
  match_count: number;
  match_threshold: number;
  query_embedding: any[]; // Adjust the type according to your data type
}

interface CombinedData {
  data_sources: any[]; // Adjust to the appropriate type (number[])
  gptEmbeddings: any[]; // Adjust the type according to your data type
}

const taskMatch = async (combinedData8: CombinedData): Promise<any> => {
  const supabaseUrl = process.env.SUPABASE_URL || '';
  const supabaseKey = process.env.SUPABASE_API_KEY || '';

  const supabase = createClient(supabaseUrl, supabaseKey);

  try {
    const { data_sources, gptEmbeddings } = combinedData8;

    const taskParams: TaskMatchParams = {
      data_sources: data_sources,
      match_count: 9999, // Adjust as needed
      match_threshold: 0.1, // Adjust as needed
      query_embedding: gptEmbeddings,
    };

    const { data, error } = await supabase.rpc('match_documents', taskParams);

    if (error) {
      // Handle specific error from supabase.rpc
      throw new Error(`Error fetching data: ${(error as unknown as Error).message}`);
    }

    return data; // Return your array of Response objects here
  } catch (error) {
    // Catch any unhandled errors during the process
    throw new Error(`Error in taskMatch: ${(error as Error).message}`);
  }
}

export default taskMatch;
