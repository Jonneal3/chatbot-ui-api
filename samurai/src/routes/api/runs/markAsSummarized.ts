import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL ?? '';
const supabaseKey = process.env.SUPABASE_API_KEY ?? '';

const supabase = createClient(supabaseUrl, supabaseKey);

const markSummarized = async (mem3: any) => {
  try {
    const { data: updatedData, error: updateError } = await supabase
      .from('Memory')
      .update({ status: 'complete' })
      .eq('id', mem3.id)
      .select();

    if (updateError) {
      throw updateError;
    }

    console.log(mem3);

    return updatedData; // Return the updated data directly
  } catch (error) {
    throw new Error('Error updating memory data');
  }
}

export default markSummarized;
