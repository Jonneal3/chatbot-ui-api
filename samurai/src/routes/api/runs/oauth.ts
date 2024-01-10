import dotenv from 'dotenv';
import path from 'path';
import fetch from 'node-fetch';

const envPath = path.resolve('/Users/jonneal/samurai/nango-integrations/.env');
dotenv.config({ path: envPath });

const getOauthObject = async (use_case: { use_case: any }) => {
  try {
    const apiKey = process.env.NANGO_SECRET_KEY_PROD;
    if (!apiKey) {
      throw new Error('NANGO_API_KEY not found in environment variables');
    }

    const providerConfigKey =
      use_case.use_case.oauth_credentials_metadata[0].oauth_config.providerConfigKey;
    const connectionId = use_case.use_case.oauth_credentials_metadata[0].oauth_config.connectionId;

    const url = `https://api.nango.dev/connection/${connectionId}?provider_config_key=${providerConfigKey}&force_refresh=true&refresh_token=true`;

    const options = {
      method: 'GET',
      headers: { Authorization: `Bearer ${apiKey}` },
    };

    const response = await fetch(url, options);
    const data = await response.json();

    return { data };
  } catch (error) {
    console.error('Error fetching data from Nango API:', error);
    throw new Error('Error fetching data from Nango API');
  }
};

console.log ({'oauth': getOauthObject})

export default getOauthObject;
