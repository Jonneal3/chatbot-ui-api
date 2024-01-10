name = "calendars-and-appointments/create-appointment"
version = "0.0.0"

"This operation creates a new appointment in the specified calendar with the provided details."
usecase CreateAppointment unsafe  {
  input {
    "The ID of the calendar."
    calendarId! string!
  
    "The ID of the location."
    locationId! string!
  
    "The ID of the contact."
    contactId! string!
  
    "The start time of the appointment."
    startTime! string!
  
    "The end time of the appointment (optional)."
    endTime string
  
    "The title of the appointment (optional)."
    title string
  
    "The status of the appointment (optional)."
    appointmentStatus string
  
    "The ID of the assigned user (optional)."
    assignedUserId string
  
    "The address of the appointment (optional)."
    address string
  
    "If set to true, the minimum scheduling notice and date range would be ignored (optional)."
    ignoreDateRange boolean
  
    "If set to false, the automations will not run (optional)."
    toNotify boolean
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
    "The HTTP status code representing the error."
    statusCode! number!
  
    "A human-readable description of the error."
    message! string!
  
    "A more specific error message, if available."
    error string
  }!
  example InputExample {
    input {
      calendarId = '123456',
      locationId = '789012',
      contactId = '345678',
      startTime = '2022-01-01T10:00:00Z',
      endTime = '2022-01-01T11:00:00Z',
      title = 'Dentist Appointment',
      appointmentStatus = 'new',
      assignedUserId = '901234',
      address = '123 Main St, New York, NY 10001',
      ignoreDateRange = true,
      toNotify = true,
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
