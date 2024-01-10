import { config } from "dotenv";
import {
  OneClient,
  PerformError,
  UnexpectedError,
  ValidationError,
} from "@superfaceai/one-sdk";

config();

const client = new OneClient({
  token: process.env.SUPERFACE_ONESDK_TOKEN,
  assetsPath: "/Users/jonneal/superface3/superface",
});

const profile = await client.getProfile("calendars-and-appointments/create-appointment");
const useCase = profile.getUseCase("CreateAppointment");

try {
  const result = await useCase.perform(
    {
      calendarId: '1PlWseMXZ6PvCeRrsCRp',
      locationId: '3Pc1Xhq9jgVEpMEmotX7',
      contactId: '2CupvpNpeZAoUFzShu0W',
      startTime: "2023-10-27T10:00:00-05:00",
    },
    {
      provider: "highlevel",
      parameters: {},
      security: { bearer: { token: process.env.HIGHLEVEL_TOKEN } },
      headers: {
        "version": "2021-04-15" // Add the version header here
      }
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
