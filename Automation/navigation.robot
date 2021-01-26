*** SETTINGS ***
Documentation   This is a test suite for the navigation bar.
...
resource        resource.robot

*** TEST CASES ***
Menu Page
  Valid User Login
  Click Link    Menu
  Location Should Be  ${MENU PAGE}


Order Page
  Valid User Login
  Click Link    Order
  Location Should Be  ${ORDER PAGE}

My Order Page
  Valid User Login
  Click Link    My Order
  Location Should Be    ${MY ORDER PAGE}
