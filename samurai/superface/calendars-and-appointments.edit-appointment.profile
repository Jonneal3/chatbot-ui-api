name = "calendars-and-appointments/edit-appointment"
version = "0.0.0"

"Update an existing appointment by providing the event ID and the new details."
usecase EditAppointment idempotent  {
  input {
    "API Version"
    Version! string!
  
    "Event Id"
    eventId! string!
  
    "Calendar Id"
    calendarId string!
  
    "Start Time"
    startTime string!
  
    "End Time"
    endTime string!
  
    "Title"
    title string!
  
    "Appointment Status"
    appointmentStatus enum {
      "Appointment Status"
      new
    
      "Appointment Status"
      confirmed
    
      "Appointment Status"
      cancelled
    
      "Appointment Status"
      showed
    
      "Appointment Status"
      noshow
    
      "Appointment Status"
      invalid
    }!
  
    "Appointment Address"
    address string!
  
    "Ignore minimum scheduling notice and date range"
    ignoreDateRange boolean!
  
    "Run automations if set to true"
    toNotify boolean!
  }
  result {
    calendarId! string!
  
    locationId! string!
  
    contactId! string!
  
    startTime string!
  
    endTime string!
  
    title string!
  
    appointmentStatus enum {
      new
    
      confirmed
    
      cancelled
    
      showed
    
      noshow
    
      invalid
    }!
  
    assignedUserId string!
  
    address string!
  
    id! string!
  }!
  error {
    "The status code of the error."
    statusCode! number!
  
    "A brief description of the error."
    message! string!
  
    "A more detailed description of the error, if available."
    error string
  }!
  example InputExample {
    input {
      Version = '2021-04-15',
      eventId = '1234567890',
      calendarId = '0987654321',
      startTime = '2022-12-01T10:00:00Z',
      endTime = '2022-12-01T11:00:00Z',
      title = 'Appointment with John Doe',
      appointmentStatus = 'confirmed',
      address = '123 Main St, New York, NY 10001',
      ignoreDateRange = true,
      toNotify = false,
    }
    result {
      calendarId = 'placeholder',
      locationId = 'placeholder',
      contactId = 'placeholder',
      startTime = 'placeholder',
      endTime = 'placeholder',
      title = 'placeholder',
      appointmentStatus = 'placeholder',
      assignedUserId = 'placeholder',
      address = 'placeholder',
      id = 'placeholder',
    }
  }
}

