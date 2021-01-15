# STSWENG Pizza Delivery Project
### Type the following into the command line before anything
**`npm i`**
### Type the following into the command line to run the application
1. **`node addData`**
2. Then choose a script to run:

| scripts                   |
| ------------------------- |
| **`npm run start`**       |
| **`npm run start-delay`** |
| **`npm run dev`**         |

3. Open a browser and got to [localhost:9000](http://localhost:9000)

### Type the following into the command line to test the application
1. **`npm run test`**

### To view database using MongoDB Compass
-   Paste this into the 'connect' field
-   **`mongodb://localhost:27017/?readPreference=primary&appname=MongoDB%20Compass%20Community&ssl=false`**
-   navigate to 'pizza' to see all the collections

---

### User Credentials
| Username      | Password | Type    |
| ------------- | -------- | ------- |
| test-customer | root     | admin   |
| test-admin    | root     | regular |

---

### Script Info
| Script                    | Description                                  | command executed                                  |
| ------------------------- | -------------------------------------------- | ------------------------------------------------- |
| **`npm run start`**       | run normally                                 | **`node index.js`**                               |
| **`npm run start-delay`** | run with 1000 ms delay response              | **`node index.js delay`**                         |
|                           | run with custom delay response               | **`node index.js delay <delay_in_milliseconds>`** |
| **`npm run dev`**         | automatically restart app when changes occur | **`nodemon index.js`**                            |
| **`npm run test`**        | reset database and run tests                 | **`node addData.js && mocha --exit \|\| true`**   |
