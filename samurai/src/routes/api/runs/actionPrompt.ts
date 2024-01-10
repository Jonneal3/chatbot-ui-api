interface CombinedData5 {
    actions: {
        possibleActions: Array<{ description: string }>;
    };
    memory: any[]; // Adjust the type according to your data type
}

const fetchActionPrompt = async ({ actions, memory }: CombinedData5): Promise<any[]> => {
    const systemPrompts = [
        {
            "role": "system",
            "content": "Your role as an AI 'Action Extractor' involves meticulously examining the conversation to decode both explicit and implicit cues, identifying intended actions hidden within the dialogue. You excel at interpreting user needs, recognizing actions requested directly or subtly through dialogue. Your ability to discern expressed and implied needs, even indirectly implied, empowers efficient assistance."
        },
        {
            "role": "system",
            "content": "Guidelines for action identification: Carefully identify implied or implicit actions, including informal language, abbreviations, emojis, subtlety, and nuance. If actions are identified, list them as extracted from the user's response. If no actionable requests are present, respond with 'none' only. Avoid any additional commentary or content for the listed actions. Provide only a comma-separated list of actions or 'none' if no actions were found."
        }
    ];

    const actionDescriptionPrompts = await createActionPrompt(actions, memory); // Generate action description prompts

    const mergedContent = [...systemPrompts, ...actionDescriptionPrompts, ...memory]; // Merge all three arrays

    console.log(mergedContent);
    console.log(`Length of mergedContent: ${mergedContent.length}`);

    return mergedContent; // Return the merged array
};

const createActionPrompt = async (actions: { possibleActions: { description: string }[] }, memory: any[]): Promise<any[]> => {
    const { possibleActions } = actions;

    const descriptions: string[] = possibleActions.map((action: { description: string }) => action.description);

    const actionContent = [
        {
            role: 'system',
            content: descriptions.length > 0
                ? "Descriptions from possible actions: " + descriptions.join(', ') + " - Choose one"
                : "No descriptions found for possible actions."
        },
        // Add your other action description prompts here...
    ];

    const mergedActionContent = [...actionContent, ...memory]; // Merge actionContent with memory

    console.log(mergedActionContent);
    console.log(`Length of mergedActionContent: ${mergedActionContent.length}`);

    return mergedActionContent; // Return the merged action content with memory
};

export { fetchActionPrompt };
