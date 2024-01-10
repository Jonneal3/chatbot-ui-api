type Var = { sessions?: { contact_id?: string }[]; botInfo?: { chat_gpt_api_key_fulfillment?: string }[] };
type Use = {
  inputs: any; integrations?: { integration_additional_static_inputs_prompt?: string; integration_additional_dynamic_inputs_prompt?: string; integration_provider?: string; integration_use_case_description?: string; integrations_use_case_input_json?: string }[]; add_dynamic_inputs?: any 
};
type Act = { additional_instructions?: string };
type Mem = { source?: string; response?: string | null };

type Sys = { role: string; content: string };
const m = async ({ variables, use_case, memory, action }: { variables: Var; use_case: Use; memory: Mem[]; action: Act }): Promise<any> => {
  try {
    const gen = () => {
      const sys: Sys[] = [];
      sys.push({ role: 'system', content: 'You are an intelligent AI assistant that is responsible for creating a tool call request. You should formulate a tool call response with relevant variables using the previous conversational context and other details provided. You must always call one of the provided tools.' });
      sys.push({ role: 'system', content: `Use this contact ID to assist you in updating the function request (if applicable): ` + (variables.sessions?.[0]?.contact_id || 'Contact ID Not Available') });
      if (Array.isArray(use_case.inputs)) {
        const validInputs = use_case.inputs.filter(item => item.input_required_inputs && item.fulfillment);
        if (validInputs.length > 0) {
            const inputList = validInputs.map(input => `${input.input_required_inputs.title}:${input.fulfillment}`).join(', ');
            sys.push({
                role: 'system',
                content: `To help you update the function call request with the desired inputs, we've included a list of inputs. The inputs are updated by the user directly. Use this to assist you in updating the function call request: ${inputList}`
            });
        } else {
            sys.push({
                role: 'system',
                content: 'There are no inputs provided by the creator'
            });
          }
        } else {
            sys.push({
                role: 'system',
                content: 'There are no inputs provided by the creator'
            });
        }
      if (use_case.integrations?.[0]?.integration_additional_static_inputs_prompt !== undefined) sys.push({ role: 'system', content: `Additional Static Instructions: ${use_case.integrations[0].integration_additional_static_inputs_prompt}` });
      if (use_case.integrations?.[0]?.integration_additional_dynamic_inputs_prompt !== undefined) sys.push({ role: 'system', content: `Additional Dynamic Instructions: ${use_case.integrations[0].integration_additional_dynamic_inputs_prompt}` });
      if (use_case.add_dynamic_inputs !== undefined) sys.push({ role: 'system', content: `Additional Instructions: ${action.additional_instructions || 'No Additional Instructions'}` });
      return sys;
    };

    const conv = (mem: Mem[] | undefined) => (Array.isArray(mem) ? mem.map((item) => ({ role: item.source && typeof item.response === 'string' ? item.source : 'unknown', content: typeof item.response === 'string' ? item.response : 'No response available' })) : []);

    const sysCont = gen();
    const memCont = conv(memory);
    const merged = [...sysCont, ...memCont];

    const apiUrl = 'https://api.openai.com/v1/chat/completions';
    const api_key = variables.botInfo?.[0]?.chat_gpt_api_key_fulfillment || '';
    const headers = { 'Content-Type': 'application/json', Authorization: `Bearer ${api_key}` };
    const body = {
      model: 'gpt-4',
      messages: merged,
      temperature: 0.2,
      tools: [
        {
          type: 'function',
          function: {
            name: use_case.integrations?.[0]?.integration_provider || '',
            description: use_case.integrations?.[0]?.integration_use_case_description || '',
            parameters: use_case.integrations?.[0]?.integrations_use_case_input_json || '',
          },
        },
      ],
      tool_choice: 'auto',
    };

    console.log(JSON.stringify(body))

    const response = await fetch(apiUrl, { method: 'POST', headers, body: JSON.stringify(body) });
    if (!response.ok) {
      const errorResponse = await response.json();
      console.error('Error Response:', errorResponse);
      return { error: 'Failed to fetch chat completion', response: errorResponse };
    }

    const completion = await response.json();
    console.log('ChatGPT Response:', completion.choices?.[0]?.message);
    return completion;
  } catch (error) {
    console.error('Error occurred:', error);
    throw error;
  }
};

export default m;
