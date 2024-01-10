function GetFreeSlots({ input, parameters, services }) {
  const url = `${services.default}/calendars/${input.calendarId}/free-slots`;
  const options = {
    method: "GET",
    query: {
      startDate: input.startDate,
      endDate: input.endDate,
      timezone: input.timezone,
      userId: input.userId,
    },
    headers: {
      "Content-Type": "application/json",
      "Version": "2021-04-15", // Set the version as a static variable
    },
    security: "bearer",
  };

  const response = std.unstable.fetch(url, options).response();
  const body = response.bodyAuto() || {};

  if (response.status !== 200) {
    const error = {
      statusCode: response.status,
      message: response.headers["message"] ? response.headers["message"][0] : "",
      error: body.error || null,
    };
    throw new std.unstable.MapError(error);
  }

  // Extract the slots for each date
  const result = {};
  for (const date in body) {
    if (date !== "traceId") {
      result[date] = {
        slots: body[date].slots,
      };
    }
  }

  return result;
}
