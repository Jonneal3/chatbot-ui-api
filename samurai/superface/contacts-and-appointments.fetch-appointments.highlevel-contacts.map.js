function GetContactAppointments({ input, parameters, services }) {
  const url = `${services.default}/contacts/${input.contactId}/appointments`;
  const options = {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "Version": "2021-07-28", // Set the "Version" header to "2021-04-15"
    },
    security: "bearer",
  };

  const response = std.unstable.fetch(url, options).response();
  const body = response.bodyAuto() ?? {};

  if (response.status !== 200) {
    const error = {
      statusCode: response.status,
      message: body.message || "Error fetching appointments",
      error: body.error || null,
    };
    throw new std.unstable.MapError(error);
  }

  const result = {
    events: body.events || [],
  };

  return result;
}
