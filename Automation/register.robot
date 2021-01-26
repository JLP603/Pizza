*** SETTINGS ***
Documentation   This is a test suite for creating accounts.
...
Resource        resource.robot

*** TEST CASES ***
Register
  Open Browser to Register Page
  Input Text  username2   test-account
  Input Text  pswrd_1   password
  Input Text  pswrd_2   password
  Click Button  checkbox
  Click Button  reg

Different Password and Confirm Password
  Open Browser to Register Page
  Input Text  username2   test-account
  Input Text  pswrd_1   password
  Input Text  pswrd_2   passwor
  Click Button  checkbox
  Click Button  reg
  Page Should Contain Element   error2    Passwords do not match!

Password Too Short
  Open Browser to Register Page
  Input Text  username2   test-account
  Input Text  pswrd_1   passw
  Input Text  pswrd_2   passw
  Click Button  checkbox
  Click Button  reg
  Page Should Contain Element   error2    Passwords must be at least 6 characters!

Username Too Short
  Open Browser to Register Page
  Input Text  username2   test
  Input Text  pswrd_1   password
  Input Text  pswrd_2   password
  Click Button  checkbox
  Click Button  reg
  Page Should Contain Element   error2    Username too short, must be 6-15 characters!
