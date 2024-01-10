import { OneClient } from '@superfaceai/one-sdk/node/index.js';
import { config } from 'dotenv';
import fetch from 'node-fetch';

config();

const client = new OneClient({
    token: process.env.SUPERFACE_ONESDK_TOKEN,
    assetsPath: './superface'
});

const superfaceReq = async (use_case: any, result: any, functionCall: any, res?: any) => {
    try {
        if (use_case && result && functionCall) {
            const comlink = use_case.integrations[0].integration_endpoint;
            const use_case1 = use_case.integrations[0].integration_api_use_case;
            const inputs = JSON.parse(functionCall.choices[0].message.tool_calls[0].function.arguments);
            const providerToken = result.data.credentials.access_token;
            const provider = use_case.integrations[0].integration_provider;

            const comlinkProfile = await client.getProfile(comlink);
            const useCase = comlinkProfile.getUseCase(use_case1);

            console.log("Comlink:", comlink);
            console.log("Use Case:", use_case1);
            console.log("Inputs:", inputs);
            console.log("Provider Token:", providerToken);
            console.log("Provider:", provider);

            // Execute use case
            const finalResult = await useCase.perform(inputs, {
                provider: provider,
                parameters: {},
                security: { bearer: { token: providerToken } }
            });

            if (res) {
                res.send(finalResult);
                console.log("RESULT:", JSON.stringify(finalResult, null, 2));
            }

            return finalResult;
        } else {
            throw new Error('Invalid or incomplete request data');
        }
    } catch (error) {
        console.error('Execution Error:', error);

        if (res) {
            res.status(500).send({ error: 'Internal Server Error' });
        }
        throw error;
    }
};

export default superfaceReq;
