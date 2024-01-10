import { config } from "dotenv";
// Load OneClient from SDK
import {
  OneClient,
  PerformError,
  UnexpectedError,
  ValidationError,
} from "@superfaceai/one-sdk";

// Load environment variables from .env file
config();

const client = new OneClient({
  // The token for monitoring your Comlinks at https://superface.ai
  token: process.env.SUPERFACE_ONESDK_TOKEN,
  // Path to Comlinks within your project
  assetsPath: "/Users/jonneal/superface3/superface",
});

// Load Comlink profile and use case
const profile = await client.getProfile("contacts-and-appointments/fetch-appointments");
const useCase = profile.getUseCase("GetContactAppointments");

try {
  // Execute use case
  const result = await useCase.perform(
    // Use case input
    {
        contactId: '2CupvpNpeZAoUFzShu0W',
      },
    {
      provider: "highlevel-contacts",
      parameters: {},
      // Security values for provider
      security: { bearer: { token: process.env.HIGHLEVEL_CONTACTS_TOKEN }},
    }
  );

  console.log("RESULT:", JSON.stringify(result, null, 2));
} catch (e) {
  if (e instanceof PerformError) {
    console.log("ERROR RESULT:", e.errorResult);
  } else if (e instanceof ValidationError) {
    console.error("VALIDATION ERROR:", e.message);
  } else if (e instanceof UnexpectedError) {
    console.error("ERROR:", e);
  } else {
    throw e;
  }
}