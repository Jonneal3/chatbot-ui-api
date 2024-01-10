interface CombinedData9 {
    knowledge: KnowledgeItem[];
    task: { main_prompt?: string }[]; // Adjust the type according to your data structure
    memory: any[]; // Adjust the type according to your data structure
}

interface KnowledgeItem {
    plain_text: string;
    alternative_response: string;
}

const fetchActionPrompt = async ({ knowledge, task, memory }: CombinedData9): Promise<any[]> => {
    // System prompt based on the 'task' input
    const systemPrompts = [];

    // Check if task is an array and has elements, then access the first element's main_prompt
    if (Array.isArray(task) && task.length > 0 && task[0].main_prompt !== undefined) {
        systemPrompts.push({
            role: 'system',
            content: task[0].main_prompt,
        });
    } else {
        console.warn('Task main_prompt is undefined or missing.'); // Log a warning if main_prompt is undefined
    }

    // Generating prompts based on 'knowledge'
    const knowledgePrompts = createKnowledgePrompts(knowledge);

    // Merge memory with other prompts
    const mergedPrompts = [...systemPrompts, ...knowledgePrompts, ...memory];

    console.log(mergedPrompts);
    console.log(`Length of mergedPrompts: ${mergedPrompts.length}`);

    return mergedPrompts;
};

const createKnowledgePrompts = (knowledge: KnowledgeItem[]): any[] => {
    const knowledgePrompts = knowledge.flatMap((item: KnowledgeItem) => [
        { role: 'user', content: item.plain_text }, // User question
        { role: 'system', content: item.alternative_response }, // System response
    ]);

    console.log(knowledgePrompts);
    console.log(`Length of knowledgePrompts: ${knowledgePrompts.length}`);

    return knowledgePrompts;
};

export default fetchActionPrompt;
