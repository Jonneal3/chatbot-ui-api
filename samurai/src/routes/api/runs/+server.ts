import { error, json } from "@sveltejs/kit";
import type { RequestEvent, RequestHandler } from "./$types";
import processAllSteps  from './botRun'; // Import the function from botRun.ts

export const POST: RequestHandler = async (e: RequestEvent) => {
  try {
    const body = await e.request.json();

    const { bot_id, contact_id, message } = body;
    if (!bot_id || !contact_id || !message) {
      return error(400, 'Missing required parameters');
    }

    const processedData = await processAllSteps(body); // Invoke the function with the body

    console.log({'final_response': processedData});

    const user = { admin: true }; // Replace with your user authentication logic
    if (!user.admin) {
      throw new Error('Unauthorized');
    }

    return json(processedData);
  } catch (err: any) {
    console.error(err);
    return error(500, 'Internal Server Error');
  }
};
