interface Task {
    description: string; // Assuming description is a string
    // Add other fields and their types if present in your tasks
}

const fetchTasks = async ({ variables, memory }: { variables: {
    botInfo: any; tasks: Task[] 
}; memory: any }): Promise<any[]> => {
    const systemContent = [
        {
            role: 'system',
            content: "You are an advanced AI chatbot and your main goal is to categorize the users' intentions within the conversation flow by specifically choosing 1 group from the given list of category groups that most accurately defines the expressed needs, objectives, and intentions of the user"
        },
        {
            role: 'system',
            content: "Here are the strict guidelines for achieving your goal: a. You can only select at most 1 group, if applicable. b. You can only choose from the provided list of groups; no additional text or variations are allowed. c. If you opt for a category group, format your response precisely as the given description. d. If you're unsure about categorizing the conversation, respond with only the word 'none'. e. In essence, there are only 2 acceptable responses: Your chosen category from our list or 'none'"
        }
    ];

    const botFulfillmentsArray = variables.botInfo[0].bot_fulfillments;

    if (Array.isArray(botFulfillmentsArray) && botFulfillmentsArray.length > 0) {
        const descriptionContent = botFulfillmentsArray.map((fulfillment) => {
            const tasks = fulfillment.tasks || [];
            const taskDescriptions = tasks.map((task: { task_description: any; }) => task.task_description || '');
            return taskDescriptions.join(', ');
        }).join(', ');
    
        if (descriptionContent) {
            systemContent.push({
                role: 'system',
                content: "Here is the list of possible category group descriptions that you may choose from: " + descriptionContent + " - Choose one of these only"
            });
        } else {
            systemContent.push({
                role: 'system',
                content: "No category group descriptions found."
            });
        }
    } else {
        systemContent.push({
            role: 'system',
            content: "Unable to retrieve category group descriptions."
        });
    }
    

    const mergedContent = [...systemContent, ...memory]; // Merge 'systemContent' with 'memory'
    
    console.log(mergedContent)
    console.log(`Length of systemContent: ${systemContent.length}`);
    console.log(`Length of memory: ${memory.length}`);
    console.log(`Length of mergedContent: ${mergedContent.length}`);
    
    return mergedContent; // Return the merged array
};

export { fetchTasks };
