import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

interface ActionMatchParams {
  tasks: string; // Define the appropriate type for tasks (e.g., string)
  match_count: number;
  match_threshold: number;
  query_embedding: any[]; // Adjust the type according to your data type
}

interface CombinedData {
  embeddings4: any[]; // Adjust the type according to your data type
  task_id: string; // Define the appropriate type for tasks (e.g., string)
}

const actionMatch = async (combinedData12: CombinedData): Promise<any[]> => {
  const supabaseUrl = process.env.SUPABASE_URL || '';
  const supabaseKey = process.env.SUPABASE_API_KEY || '';

  const supabase = createClient(supabaseUrl, supabaseKey);

  const { embeddings4, task_id } = combinedData12;

  console.log(task_id)

  try {
    const actionParams: ActionMatchParams = {
      tasks: task_id,
      match_count: 9999, // Adjust as needed
      match_threshold: 0.6, // Adjust as needed
      query_embedding: embeddings4, // Use the global embedding here
    };

    console.log('Calling supabase RPC with actionParams:', actionParams);
    const { data, error } = await supabase.rpc('action_description', actionParams);

    if (error) {
      throw new Error(`Error fetching data: ${(error as unknown as Error).message}`);
    }

    const filteredData = data.filter((item: { tasks: string; }) => item.tasks === task_id);

    if (filteredData.length > 0) {
      const topMostItem = filteredData[0];
      console.log("Topmost item:", topMostItem);
      // Use 'topMostItem' as needed
    } else {
      console.log("No item found for the specified task_id.");
    }
    

  return filteredData;
  } catch (error) {
    throw new Error(`Error in actionMatch: ${(error as Error).message}`);
  }
};

export default actionMatch ;
