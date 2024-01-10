import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

interface TaskMatchParams {
  accounts: string; // Define the appropriate type for accounts (e.g., string)
  match_count: number;
  match_threshold: number;
  query_embedding: any[]; // Adjust the type according to your data type
}

interface CombinedData {
  variables: {
    botInfo: any;
    account_id: string; // Define the appropriate type for account_id (e.g., string)
    // Add other properties from variables as needed
  };
  gptEmbeddings: any[]; // Adjust the type according to your data type
}

const taskMatch = async (combinedData4: CombinedData): Promise<any> => {
  const supabaseUrl = process.env.SUPABASE_URL ?? '';
  const supabaseKey = process.env.SUPABASE_API_KEY ?? '';

  const supabase = createClient(supabaseUrl, supabaseKey);

  try {
    const { variables, gptEmbeddings } = combinedData4;
    const { account_id } = variables.botInfo[0];

    console.log(account_id)
    console.log(gptEmbeddings)

    const taskParams: TaskMatchParams = {
      accounts: account_id,
      match_count: 9999, // Adjust as needed
      match_threshold: 0.1, // Adjust as needed
      query_embedding: gptEmbeddings,
    };

    const { data, error } = await supabase.rpc('task_description', taskParams);

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
