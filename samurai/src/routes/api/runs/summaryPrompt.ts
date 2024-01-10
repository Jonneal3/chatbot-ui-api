const fetchAndSummaryPrompt = async ({ task, mem2, access }: { task: {} , mem2: any[], access: string }): Promise<any[]> => {
    let summarySystemPrompts: any[];

console.log(task)

    // Check if 'access' matches the regex for "public" (case-insensitive)
    if (/public/i.test(access)) {
        summarySystemPrompts = [
            {
                role: 'system',
                content: 'As an AI assistant, your task is to generate a clear and refined response by summarizing and consolidating the previous assistant messages and create a final message directly for the end user. Your audience is an external user, not affiliated with our organization. Its crucial that in your response, sensitive information or technical details mentioned in previous interactions are omitted. Craft a user-friendly and straightforward summary that maintains clarity without delving into any sensitive or intricate technical aspects',
            },
        ];
    } else if (/private/i.test(access)) {
        summarySystemPrompts = [
            {
                role: 'system',
                content: 'Construct a clear and polished final response by summarizing and consolidating previous assistant messages.',
            },
        ];
    } else {
        // Default system prompt if neither "public" nor "private" is matched
        summarySystemPrompts = [
            {
                role: 'system',
                content: 'As an AI assistant, your task is to generate a clear and refined response by summarizing and consolidating the previous assistant messages. Your audience is an external user, not affiliated with our organization. Its crucial that in your response, sensitive information or technical details mentioned in previous interactions are omitted. Craft a user-friendly and straightforward summary that maintains clarity without delving into any sensitive or intricate technical aspects',
            },
        ];
    }

    // System prompt based on the 'task' input
    const systemPrompts = [];

    // Check if task is an array and has elements, then access the first element's main_prompt
    if (Array.isArray(task) && task.length > 0 && task[0].main_prompt !== undefined) {
        systemPrompts.push({
            role: 'system',
            content: 'Here is some additional context on how to form your response:' + task[0].main_prompt
        });
    } else {
        console.warn('Task main_prompt is undefined or missing.'); // Log a warning if main_prompt is undefined
    }

    // Merge system prompts with memory
    const mergedActionContent = [...summarySystemPrompts, ...systemPrompts, ...mem2]; // Merge actionContent with memory

    console.log(mergedActionContent);
    console.log(`Length of mergedActionContent: ${mergedActionContent.length}`);

    return mergedActionContent; // Return the merged action content with memory
};

export default fetchAndSummaryPrompt;
