function GetAppointmentDetails({ input, parameters, services }) {
  const url = `${services.default}/calendars/events/appointments/${input.eventId}`;
  const options = {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Version: input.Version,
    },
    security: "bearer",
  };

  const response = std.unstable.fetch(url, options).response();
  const body = response.bodyAuto() ?? {};

  if (response.status !== 200) {
    const error = {
      statusCode: response.status,
      message: response.headers["message"]?.[0] ?? "",
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
