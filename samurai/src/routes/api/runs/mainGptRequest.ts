const chatgptRequest = async (combinedData2: { variables: any; main_prompt: any[] }): Promise<any> => {
    const apiUrl = 'https://api.openai.com/v1/chat/completions';
    const api_key = combinedData2.variables.botInfo[0].chat_gpt_api_key_fulfillment; // Replace with your actual API key
  
    const headers = {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${api_key}`,
    };
  
    const requestBody = {
      messages: combinedData2.main_prompt, // Use combinedData2.task_prompt
      model: 'gpt-4', // Replace with the model name
      temperature: 0.5, // Set your desired temperature
    };
  
    try {
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers,
        body: JSON.stringify(requestBody),
      });
  
      if (!response.ok) {
        const data = await response.json();
        return { error: 'Failed to fetch chat completion', response: data };
      }
  
      const completion = await response.json();
      return completion;
    } catch (error) {
      throw error;
    }
  };
  
  export default chatgptRequest; // Export the function as the default export
  