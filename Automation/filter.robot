*** SETTINGS ***
Documentation   This is a test suite for the filtering function in the
...             menu page.
...
resource        resource.robot

*** TEST CASES ***
Pizza Filter
  Open Browser plus Settings
  Click Link    Menu
  Location Should Be  ${MENU PAGE}
  Click Element  xpath://button
  Click Link  Pizzas
  Element Should Contain  xpath://div[2]/div[2]   Pizzas

Side Dishes Filter
  Open Browser plus Settings
  Click Link    Menu
  Location Should Be  ${MENU PAGE}
  Click Element  xpath://button
  Click Link  Side Dishes
  Element Should Contain  xpath://div[2]/div[2]   Side Dishes

Drinks Filter
  Open Browser plus Settings
  Click Link    Menu
  Location Should Be  ${MENU PAGE}
  Click Element  xpath://button
  Click Link  Drinks
  Element Should Contain  xpath://div[2]/div[2]   Drinks
