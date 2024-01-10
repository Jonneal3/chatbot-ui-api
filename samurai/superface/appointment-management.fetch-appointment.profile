name = "appointment-management/fetch-appointment"
version = "0.0.0"

"Retrieve details of a specific appointment by its ID"
usecase GetAppointmentDetails safe  {
  input {
    "API Version"
    Version! string!
  
    "Event Id"
    eventId! string!
  }
  result {
    calendarId! string!
  
    locationId! string!
  
    contactId! string!
  
    startTime! string!
  
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
      eventId = '5f8d9a6d3d1e2c001f4bf9e9',
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

