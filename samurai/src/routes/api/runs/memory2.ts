import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL ?? '';
const supabaseKey = process.env.SUPABASE_API_KEY ?? '';

const supabase = createClient(supabaseUrl, supabaseKey);

export interface MemoryObject {
  role: string;
  content: string;
}

const fetchMemory = async (body: any): Promise<MemoryObject[]> => {
  try {
    const { data, error } = await supabase
      .from('Memory')
      .select('*')
      .eq('sessions', body.contact_id) // Filter data based on 'Sessions'
      .eq('status', 'pending')
      .eq('source', 'assistant');

    if (error) {
      throw new Error(`Error fetching data from Supabase: ${error.message}`);
    }

    console.log(data)

    const memoryObjects: MemoryObject[] = [];

    if (data && data.length > 0) {
      const sortedDataDescending = data.sort((a: any, b: any) => b.id - a.id).slice(0, 15); // Sort in descending order and get the first 15 items
      const sortedDataAscending = sortedDataDescending.reverse();

      sortedDataAscending.forEach(item => {
        const memoryObject: MemoryObject = {
          role: item.source,
          content: item.response !== null ? item.response : JSON.stringify(item.tool_call),
        };{
        memoryObjects.push(memoryObject); // Push only if 'response' is not null
        }
      });
    } else {
      throw new Error('No data fetched'); // Throw an error if no data is fetched
    }

    return memoryObjects; // Return the array of MemoryObject instances
  } catch (error) {
    throw new Error('Error fetching memory');
  }
};

export default fetchMemory;
