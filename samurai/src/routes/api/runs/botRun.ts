import { fetchAllVariables } from './allVariables';
import { fetchMemory, type MemoryObject } from './memory1';
import { fetchTasks } from './taskChoice';
import chatgptRequest from './chatgptRequest';
import chatgptEmbeddingsFunction from './chatgptEmbeddings';
import taskMatch from './taskMatch';
import { actionQuery } from './actionQuery';
import { fetchActionPrompt } from './actionPrompt';
import { finalCompletionChoices } from './actionGptRequest';
import embeddings2 from './embeddings2';
import knowledgeQuery from './knowledgeQuery';
import knowledgeVectorQuery from './knowledgeVectorQuery';
import mainPrompt from './mainPrompt';
import mainGptRequest from './mainGptRequest';
import fallbackPrompt from './fallbackPrompt';
import actionMatch from './actionMatch';
import chatgptEmbeddings3 from './embeddings3';
import { addToActionQueue, type CombinedData } from './addToActionQueue';
import getActionQueue from './getActionQueue';
import fetchAllVariables1 from './actionRun';
import gptFunctionCall from './gptFunctionCall';
import getOauthObject from './oauth';
import addToMemory1 from './addToMemoryFunction';
import addToMemory2 from "./addToMemoryMessage";
import updateActionQueue1 from './updateActionQueue'
import superfaceReq from './superface';
import mem2 from './memory2';
import summaryPrompt from './summaryPrompt';
import finalSummaryRequest from './finalSummaryRequest';
import mem3 from "./memory3";
import addToMemFinal from "./addToMemoryFinal";
import markSummarized from './markAsSummarized';
import addToMemoryMain from './addToMemoryMain';
import pp1 from './pp1';
import formatReponseMessage from './finalResponseFormat';

interface Body { bot_id: string; message: string; contact_id: string; }
let finalTask: Record<string, unknown> = {};
let mainFinalMessage: string = '';
let token_final: number = 0;
let finalFormattedResponse: object;

const processAllSteps = async (body: Body): Promise<any> => {

  try {
    const variables = await fetchAllVariables(body);
    const active_status = variables.botInfo[0].active_status;
    if (!active_status) return { success: true, message: 'Processing completed successfully' };

    const memory: MemoryObject[] = await fetchMemory(body);
    // Fetch Memory fetches last 15 messages with type being "message"
    const combinedData = { variables, memory };

    const taskPrompt = await fetchTasks(combinedData);
    const combinedData2 = { variables, task_prompt: taskPrompt };

    const gpt = await chatgptRequest(combinedData2);
    const gptResponse = gpt.choices[0].message.content;

    if (/^none$/i.test(gptResponse)) {
      console.log("The response matches 'none' in any case");
    } else {
      console.log("The response does not match 'none' in any case");
      const combinedData3 = { variables, gptResponse };
      const { data: [{ embedding: gptEmbeddings }] } = await chatgptEmbeddingsFunction(combinedData3);

      const combinedData4 = { variables, gptEmbeddings };
      const resultOfTaskMatch = await taskMatch(combinedData4);
      console.log(resultOfTaskMatch);
      finalTask = resultOfTaskMatch;

      const highestSimilarityTask = resultOfTaskMatch.reduce((prev: { similarity: number }, current: { similarity: number }) => prev.similarity > current.similarity ? prev : current);

      const finalTaskId = highestSimilarityTask.id;
      const actionSupabaseQuery = await actionQuery(finalTaskId);
      const combinedData5 = { actions: actionSupabaseQuery, memory };
      const createActionPrompt = await fetchActionPrompt(combinedData5);
      const combinedData6 = { variables, prompt: createActionPrompt };
      const actionGptRequestComplete = await finalCompletionChoices(combinedData6);
      const gptResponseRegex2 = /^none$/i;
      if (Array.isArray(actionGptRequestComplete) && actionGptRequestComplete.some((element) => gptResponseRegex2.test(element))) {
        console.log('There are NO actions in the list');
        const combinedData7 = { variables, body: body.message };
        const { data: [{ embedding: gptEmbeddings2 }] } = await embeddings2(combinedData7);
        const knowledge = await knowledgeQuery(finalTaskId);
        const dataSourcesArray: any[] = knowledge.map((item: any) => item?.data_sources);
        const uniqueArray: number[] = Array.from(new Set(dataSourcesArray));
        const combinedData8 = { data_sources: uniqueArray, gptEmbeddings: gptEmbeddings2 };
        const knowledgeVector = await knowledgeVectorQuery(combinedData8);
        const knowledgeVectorCount = knowledgeVector.length;
        const combinedData9 = { knowledge: knowledgeVector, memory, task: resultOfTaskMatch };
        const mainPrompt1 = knowledgeVectorCount > 0 ? await mainPrompt(combinedData9) : await fallbackPrompt(combinedData9);
        const mainResponse = (await mainGptRequest({ variables, main_prompt: mainPrompt1 }));
        const addToMemMain = await addToMemoryMain (mainResponse, body);
        console.log(mainResponse);
      } else {
        console.log('There are actions in the list');
        for (const action of actionGptRequestComplete) {
          const { data: [{ embedding: embeddings4 }] } = await chatgptEmbeddings3({ variables, action });
          const actionMatchData = await actionMatch({ embeddings4, task_id: finalTaskId });
          const { id: actionId, hidden_bool: hidden_bool, description: description } = actionMatchData[0] || {};
          const combinedData13: CombinedData = { actionId, sessions: body.contact_id, hidden_bool, description };
          await addToActionQueue(combinedData13);
          const fetchedActionQueue = await getActionQueue(body.contact_id);
          console.log({'action queue': fetchedActionQueue})
          for (const fetchedAction of fetchedActionQueue) {
            const actionRunResult = await fetchAllVariables1(fetchedAction.action_id);
            console.log({'action': actionRunResult })
            let finalCompletion1: any;
            let finalCompletionMessage: any;
            let finalCompletionStatus: any;
            for (const use_case of actionRunResult) {
              console.log({'use case':use_case })
              const convertedMemory: any[] = memory.map(item => ({ source: item.role, response: item.content }));
              const combinedData14: {
                use_case: any;
                memory: any[];
                action: any;
                variables: any;
              } = {
                use_case, // Assuming use_case is part of actionRunResult objects
                memory: convertedMemory,
                action, // You need to define 'action' appropriately
                variables // You need to define 'variables' appropriately
              };
              const functionCall = await gptFunctionCall(combinedData14);
              
              if (functionCall.choices[0].finish_reason === 'tool_calls') {
                let finalFuncCall: object;
                console.log(use_case.integrations[0].post_processing)
                  if (use_case.integrations[0].post_processing == 'pp1') {
                    console.log('pp1 match!')
                    finalFuncCall = await pp1 (functionCall);
                  } else {
                    console.log('pp1 no match!')
                    finalFuncCall = functionCall;
                  }
                  console.log({'final_func_call': finalFuncCall})
                  const memoryAdd1 = await addToMemory1(finalFuncCall, body);
                  const combinedData15 = { use_case };
                  console.log({'combinedData15': combinedData15});
                  const result = await getOauthObject(combinedData15);
                  console.log({'result': result});
                  const superfaceReq1 = await superfaceReq (use_case, result, functionCall);
                  console.log(superfaceReq1);
              
                  if (superfaceReq1) {
                      finalCompletion1 = superfaceReq1;
                      const message = 'Action Complete';
                      finalCompletionMessage = message;
                      finalCompletionStatus = 'completed';
                  } else {
                      finalCompletion1 = superfaceReq1;
                      const message = 'Action Error';
                      finalCompletionMessage = message;
                      finalCompletionStatus = 'error';
                      break;
                  }
              
              } else {
                  const memoryAdd = await addToMemory2(functionCall, body);
                  console.log({"mem":memoryAdd});
                  finalCompletion1 = functionCall; // Assuming you meant superfaceReq1 instead of superfaceReq\
                  const message = 'Missing Parameters'
                  finalCompletionMessage = message;
                  finalCompletionStatus = 'error';
                  break;   
              }
            }
            const updateActionQueue = await updateActionQueue1(finalCompletion1, finalCompletionStatus, finalCompletionMessage, fetchedAction);
          }
        }
      }
    }
  
    try {
      const mem3Result = await mem3(body);
      console.log({'mem3': mem3Result});
    
      const access = variables.botInfo[0].bot_access;
      console.log(access)
      let finalMessage;
    
      if ((mem3Result.length > 1) || (mem3Result.length === 1 && mem3Result[0].type === 'api')) {
        console.log('Length > 1')
        console.log(finalTask);
        const mem2Result = await mem2(body);
        console.log({'mem2': mem2Result});
        const summaryPrompt1Result = await summaryPrompt({ mem2: mem2Result, access, task: finalTask });
        console.log({'sum_prompt': summaryPrompt1Result});
        const combinedData16 = { variables, summaryPrompt1Result };
        console.log({'16': combinedData16})
        const finalSummaryRequest1 = await finalSummaryRequest(combinedData16);
        console.log({'finalSumReq': finalSummaryRequest1});
        await addToMemFinal(finalSummaryRequest1, body);
        finalMessage = finalSummaryRequest1.choices[0].message.content;
        for (const mem3 of mem3Result) {
          const markSummarized1 = await markSummarized(mem3);
          console.log('summarized lemgth > 1');
        }
      } 
      else {
        if (mem3Result.length === 1)
        console.log('Length = 1')
            finalMessage = mem3Result[0].response;
            for (const mem3 of mem3Result) {
              const markSummarized1 = await markSummarized(mem3);
              console.log('summarized length = 1');
        }
      }
      console.log(finalMessage);
      mainFinalMessage = finalMessage;
    } catch (error) {
      console.error('An error occurred:', error);
      // Handle the error or add specific error-handling logic here
    }
  
    const finalResp = formatReponseMessage(mainFinalMessage, token_final);
    const finalFormattedResponse = finalResp; // Assuming finalResp is the desired result

    console.log(finalResp);
    console.log(finalFormattedResponse);

    return finalFormattedResponse; // Return the final result from this function
  } catch (error) {
    console.error('An error occurred:', error);
    // Handle the error or add specific error-handling logic here
    throw error; // Ensure you throw the error to propagate it further
  }
};

export default processAllSteps;