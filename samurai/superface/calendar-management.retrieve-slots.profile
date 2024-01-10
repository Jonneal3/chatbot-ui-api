name = "calendar-management/retrieve-slots"
version = "0.0.0"

"Fetches available slots for a calendar within a specified date range, with optional timezone and user filters."
usecase GetFreeSlots safe  {
  input {
    "Start Date."
    startDate! string!
  
    "End Date."
    endDate! string!
  
    "The timezone in which the free slots are returned."
    timezone string
  
    "The user for whom the free slots are returned."
    userId string
  
    "Calendar Id."
    calendarId! string!
  }
  result {
    _dates_! {
    }!
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
      startDate = '2022-01-01',
      endDate = '2022-01-31',
      timezone = 'America/New_York',
      userId = 'user123',
      calendarId = 'calendar123',
    }
    result {
      _dates_ = {
      },
    }
  }
}


