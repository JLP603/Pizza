*** SETTINGS ***
Documentation   This is a test suite for the order functions.
...
resource        resource.robot

*** TEST CASES ***
Add Order
  Open Browser plus Settings
  Click Link    Order
  Location Should Be  ${ORDER PAGE}
  Click Element  xpath://input
  Click Element  xpath://div[2]/input
  Click Element  xpath://div[3]/input
  Checkbox Should Be Selected  xpath://input
  Checkbox Should Be Selected  xpath://div[2]/input
  Checkbox Should Be Selected  xpath://div[3]/input
  Element Should Contain  subtotal    600.06

Add Order and Checkout (Should not have ongoing order)
  Valid User Login
  Click Link    Order
  Location Should Be  ${ORDER PAGE}
  Click Element  xpath://input
  Click Element  xpath://div[2]/input
  Click Element  xpath://div[3]/input
  Element Should Be Enabled  xpath://input
  Element Should Be Enabled  xpath://div[2]/input
  Element Should Be Enabled  xpath://div[3]/input
  Element Should Contain  subtotal    600.06
  Click Button  checkout
  Location Should Be  ${CHECKOUT PAGE}
  Input Text  address   Quezon City
  Input Text  contact   09123456789
  Input Text  special_instructions    Add hot sauce.
  Click Button  checkout

Check Order Status
  Valid User Login
  Click Link     My Order
  Location Should Be    ${MY ORDER PAGE}
  Click Element   css:.btn-warning
  Page Should Contain Element  xpath=//div[2]/div/div/div/h4    Status
