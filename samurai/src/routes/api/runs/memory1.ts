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

export const fetchMemory = async (body: any): Promise<MemoryObject[]> => {
  try {
    const { data, error } = await supabase
      .from('Memory')
      .select('*')
      .eq('sessions', body.contact_id) // Filter data based on 'Sessions'
      .eq('type', 'message'); // Use separate .eq calls for each condition


    if (error) {
      throw new Error(`Error fetching data from Supabase: ${error.message}`);
    }

    if (data) {
      const sortedDataDescending = data.sort((a: any, b: any) => b.id - a.id).slice(0, 15); // Sort in descending order and get the first 15 items
      const sortedDataAscending = sortedDataDescending.reverse();

      function convertMemoryToObjects(memory: any[]): MemoryObject[] {
        if (!Array.isArray(memory)) return [];

        return memory.map(item => ({
          role: (item.source && typeof item.response === 'string') ? item.source : 'unknown',
          content: typeof item.response === 'string' ? item.response : 'No response available'
        }));
      }

      const memoryObjects = convertMemoryToObjects(sortedDataAscending); // Convert data to MemoryObject array
      return memoryObjects; // Return memory as an array of objects
    }

    throw new Error('No data fetched'); // Throw an error if no data is fetched
  } catch (error) {
    throw new Error('Error fetching memory');
  }
};
