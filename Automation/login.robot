*** SETTINGS ***
Documentation   This is a test suite for logging in.
...
resource        resource.robot

*** TEST CASES ***
Successful Login
  Valid User Login

Unsuccessful login
  Open Browser to Login Page
  Input Text  username1   ${VALID USERNAME}
  Input Text  password    passwor
  Click Button  log
  Page Should Contain Element   error1    Invalid Password!
