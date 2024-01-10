function CreateAppointment({ input, parameters, services }) {
  const url = `${services.default}/calendars/events/appointments`;
  const options = {
    method: "POST",
    body: {
      calendarId: input.calendarId,
      locationId: input.locationId,
      contactId: input.contactId,
      startTime: input.startTime
    },
    headers: {
      "Content-Type": "application/json",
      "version": "2021-04-15" // Add the version header here
    },
    security: "bearer",
  };

  const response = std.unstable.fetch(url, options).response();
  const body = response.bodyAuto() ?? {};

  if (response.status !== 201) {
    const error = {
      statusCode: response.status,
      message: response.headers["message"]?.[0] ?? "Error",
      error: response.headers["error"]?.[0] ?? null,
    };
    throw new std.unstable.MapError(error);
  }

  const result = {
    calendarId: body.calendarId,
    locationId: body.locationId,
    contactId: body.contactId,
    startTime: body.startTime,
    endTime: body.endTime,
    title: body.title,
    appointmentStatus: body.appointmentStatus,
    assignedUserId: body.assignedUserId,
    address: body.address,
    id: body.id,
  };

  return result;
}