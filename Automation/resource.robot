*** SETTINGS ***
Documentation   This is the main resource file for the variables
...             and all other custom keywords.
Library         SeleniumLibrary

*** Variables ***
${SERVER}           http://localhost:9000
${BROWSER}          Chrome
${DELAY}            0.2
${VALID USERNAME}   test-account
${VALID PASSWORD}   password
${VALID ADMINNAME}  test-admin
${VALID ADMINPASS}  root
${HOME}             ${SERVER}
${LOGIN URL}        ${SERVER}/login
${MENU PAGE}        ${SERVER}/menu
${ORDER PAGE}       ${SERVER}/order
${MY ORDER PAGE}    ${SERVER}/user_orders
${CHECKOUT PAGE}    ${SERVER}/checkout
${ADMIN HOME PAGE}  ${SERVER}/manager_orders

*** Keywords ***
Open Browser plus Settings
  Open Browser  ${SERVER}   ${BROWSER}
  Maximize Browser Window
  Set Selenium Speed   ${DELAY}

Open Browser to Login Page
  Open Browser  ${SERVER}   ${BROWSER}
  Maximize Browser Window
  Set Selenium Speed   ${DELAY}
  Click Link  Sign in
  Page Should Contain Element   log
  Location Should Be    ${LOGIN URL}

Open Browser to Register Page
  Open Browser  ${SERVER}   ${BROWSER}
  Maximize Browser Window
  Set Selenium Speed  ${DELAY}
  Click Link  Sign in
  Click Button  register-toggle
  Page Should Contain Element   reg
  Location Should Be    ${LOGIN URL}
  Wait Until Element Is Visible   username2

Valid User Login
  Open Browser  ${SERVER}   ${BROWSER}
  Maximize Browser Window
  Set Selenium Speed   ${DELAY}
  Click Link  Sign in
  Page Should Contain Element   log
  Location Should Be    ${LOGIN URL}
  Input Text  username1   ${VALID USERNAME}
  Input Text  password    ${VALID PASSWORD}
  Click Button  log

Valid Admin Login
  Open Browser  ${SERVER}   ${BROWSER}
  Maximize Browser Window
  Set Selenium Speed   ${DELAY}
  Click Link  Sign in
  Page Should Contain Element   log
  Location Should Be    ${LOGIN URL}
  Input Text  username1   ${VALID ADMINNAME}
  Input Text  password    ${VALID ADMINPASS}
  Click Button  log
