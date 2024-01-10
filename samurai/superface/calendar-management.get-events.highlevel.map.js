function RetrieveCalendarEvents({ input, parameters, services }) {
  const url = `${services.default}/calendars/events`;
  const options = {
    method: "GET",
    query: {
      locationId: input.locationId,
      userId: input.userId,
      calendarId: input.calendarId,
      groupId: input.groupId,
      startTime: input.startTime,
      endTime: input.endTime,
    },
    headers: {
      "Content-Type": "application/json",
      "Version": "2021-04-15",
    },
    security: "bearer",
  };

  const response = std.unstable.fetch(url, options).response();
  const body = response.bodyAuto() ?? {};

  if (response.status !== 200) {
    const error = {
      statusCode: response.status,
      message: response.headers["message"]?.[0] ?? "Error",
      error: response.headers["error"]?.[0] ?? null,
    };
    throw new std.unstable.MapError(error);
  }

  const result = {
    events: body.events ?? [],
  };

  return result;
}
