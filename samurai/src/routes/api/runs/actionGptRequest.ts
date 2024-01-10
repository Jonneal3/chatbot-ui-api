const actionGptRequest = async (combinedData6: { variables: any; prompt: any[] }): Promise<any[]> => {
  const apiUrl = 'https://api.openai.com/v1/chat/completions';
  const api_key = combinedData6.variables.botInfo[0].chat_gpt_api_key_fulfillment;

  const headers = {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${api_key}`,
  };

  const requestBody = {
      messages: combinedData6.prompt,
      model: 'gpt-4',
      temperature: 0.5,
  };

  try {
      const response = await fetch(apiUrl, {
          method: 'POST',
          headers,
          body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
          const data = await response.json();
          return [{ error: 'Failed to fetch chat completion', response: data }];
      }

      const completion = await response.json();

      // Process completion here

      let processedContent: any[] = [];

      // Check if the content exists and is not an array, then wrap it in an array
      if (completion && completion.choices && completion.choices.length > 0) {
          const content = completion.choices[0].message.content;
          processedContent = Array.isArray(content) ? content : [content];
      }

      return processedContent;
  } catch (error) {
      throw error;
  }
};

// Export the function as actionGptRequest
export { actionGptRequest as finalCompletionChoices };
