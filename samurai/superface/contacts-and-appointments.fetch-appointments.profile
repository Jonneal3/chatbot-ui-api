name = "contacts-and-appointments/fetch-appointments"
version = "0.0.0"

"Retrieve a list of appointments for a specific contact"
usecase GetContactAppointments safe  {
  input {
    "Contact Id"
    contactId! string!
  }
  result {
    events! [{
      id! string!
    
      calendarId! string!
    
      status! string!
    
      title! string!
    
      appoinmentStatus! string!
    
      assignedUserId! string!
    
      notes! string!
    
      startTime! string!
    
      endTime! string!
    }!]!
  }!
  error {
    "The status code of the error."
    statusCode! number!
  
    "The error message."
    message! string!
  
    "The specific error details, if available."
    error string
  }!
  example InputExample {
    input {
      Version = '2021-07-28',
      contactId = '1234567890',
    }
    result {
      events = [
        {
        id = 'placeholder',
        calendarId = 'placeholder',
        status = 'placeholder',
        title = 'placeholder',
        appoinmentStatus = 'placeholder',
        assignedUserId = 'placeholder',
        notes = 'placeholder',
        startTime = 'placeholder',
        endTime = 'placeholder',
      }
      ],
    }
  }
}

