name = "calendar-management/get-events"
version = "0.0.0"

"Fetches calendar events based on location, user, group, or calendar within a specified time range."
usecase RetrieveCalendarEvents safe  {
  input {
    "API Version"
    Version! string
  
    "Location Id"
    locationId string!
  
    "User Id - Owner of an appointment. Either of userId, groupId or calendarId is required"
    userId string
  
    "Either of calendarId, userId or groupId is required"
    calendarId string!
  
    "Either of groupId, calendarId or userId is required"
    groupId string
  
    "Start Time (in millis)"
    startTime! string!
  
    "End Time (in millis)"
    endTime! string!
  }
  result {
    events! [{
      id! string!
    
      title! string!
    
      calendarId! string!
    
      locationId! string!
    
      contactId! string!
    
      groupId! string!
    
      appointmentStatus! {
      }!
    
      assignedUserId! string!
    
      users! [string!]!
    
      startTime! {
      }!
    
      endTime! {
      }!
    }!]!
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
      locationId = '1234567890',
      userId = '9876543210',
      calendarId = 'abcdefghij',
      groupId = 'ijklmnopqr',
      startTime = '1622527200000',
      endTime = '1622613600000',
    }
    result {
      events = [
        {
        id = 'placeholder',
        title = 'placeholder',
        calendarId = 'placeholder',
        locationId = 'placeholder',
        contactId = 'placeholder',
        groupId = 'placeholder',
        appointmentStatus = {
        },
        assignedUserId = 'placeholder',
        users = [
          'placeholder'
        ],
        startTime = {
        },
        endTime = {
        },
      }
      ],
    }
  }
}

