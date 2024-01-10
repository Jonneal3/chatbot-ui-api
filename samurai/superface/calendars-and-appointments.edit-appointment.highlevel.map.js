function EditAppointment({ input, parameters, services }) {
  const url = `${services.default}/calendars/events/appointments/${input.eventId}`;
  const options = {
    method: "PUT",
    body: {
      calendarId: input.calendarId,
      startTime: input.startTime,
      endTime: input.endTime,
      title: input.title,
      appointmentStatus: input.appointmentStatus,
      address: input.address,
      ignoreDateRange: input.ignoreDateRange,
      toNotify: input.toNotify,
    },
    headers: {
      "Content-Type": "application/json",
      // Set "Version" to a static value
      "Version": "2021-04-15",
    },
    security: "bearer",
  };

  const response = std.unstable.fetch(url, options).response();
  const body = response.bodyAuto() ?? {};

  if (response.status !== 200) {
    const error = {
      statusCode: response.status,
      message: response.headers["message"]?.[0] ?? "",
      error: body.error ?? null,
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
