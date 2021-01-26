*** SETTINGS ***
Documentation   This is a test suite for the admin's functions.
...
resource        resource.robot

*** TEST CASES ***
Admin Check Pending Orders
  Valid Admin Login
  Location Should Be  ${ADMIN HOME PAGE}

Admin Check Completed Orders
  Valid Admin Login
  Location Should Be  ${ADMIN HOME PAGE}
  Click Link  Completed Customer Orders
  Location Should Be  ${ADMIN HOME PAGE}?pending=false

Admin Change Order Status
  Valid Admin Login
  Location Should Be  ${ADMIN HOME PAGE}
  Element Should Contain  css:.getConfirmDetails  Pending
  Click Element  css:.getConfirmDetails
  Click Element  id:confirm-change
  Element Should Contain  css:.getConfirmDetails  Completed
  Click Link  Completed Customer Orders
  Location Should Be  ${ADMIN HOME PAGE}?pending=false
  Click Link  Pending Customer Orders
  Location Should Be  ${ADMIN HOME PAGE}?pending=true
