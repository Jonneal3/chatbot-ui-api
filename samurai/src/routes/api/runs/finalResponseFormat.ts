function formatResponseMessage(
  mainFinalMessage: string,
  token_final: number
) {
  return {
    id: 'chatcmpl-123',
    object: 'chat.completion',
    created: Math.floor(Date.now() / 1000),
    model: 'samurai-1',
    system_fingerprint: 'fp_44709d6fcb',
    choices: [
      {
        index: 0,
        message: {
          role: 'assistant',
          content: mainFinalMessage,
        },
        logprobs: null as null | any, // Replace with appropriate type for logprobs
        finish_reason: 'stop',
      },
    ],
    usage: {
      prompt_tokens: 0,
      completion_tokens: token_final,
      total_tokens: 0,
    },
  };
}

export default formatResponseMessage
