const pp1 = async (functionCall: any): Promise<any> => {
    const toolCallStr = functionCall.choices?.[0]?.message?.tool_calls?.[0]?.function?.arguments;
    console.log(toolCallStr);
  
    if (toolCallStr) {
      const toolCall = JSON.parse(toolCallStr);
  
      if (toolCall.startDate) {
        console.log('Original Start Date:', toolCall.startDate);
        const parsedStartDate = Date.parse(toolCall.startDate);
        console.log('Modified Start Date:', parsedStartDate);
        toolCall.startDate = parsedStartDate;
      }
  
      if (toolCall.endDate) {
        console.log('Original End Date:', toolCall.endDate);
        const parsedEndDate = Date.parse(toolCall.endDate);
        console.log('Modified End Date:', parsedEndDate);
        toolCall.endDate = parsedEndDate;
      }
  
      functionCall.choices[0].message.tool_calls[0].function.arguments = JSON.stringify(toolCall);
    }
  
    return functionCall;
  };
  
  export default pp1;
  