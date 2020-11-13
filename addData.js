const database = require('./models/db.js')
const User = require('./models/UserModel.js');
const Product = require('./models/UserModel.js');
const Order = require('./models/UserModel.js');
const bcrypt = require('bcrypt');
database.connect();

/* ---------------------------------------- DELETION OF OLD DATA ---------------------------------------- */
database.deleteMany(User, {}, function() {
    console.log('deleted all user data');
});

/* ---------------------------------------- ADDITION OF NEW DATA ---------------------------------------- */
/*   Username:    test-customer */
/*   Pasword:     root          */
let password = 'root';
bcrypt.hash(password, 10, function(err, hash){
    let user = {
        username: "test-customer",
        password: hash,
        user_type: "customer",
        current_order: "",
    }

    database.insertOne(User, user, (result) => {});
});

/*   Username:    test-admin    */
/*   Pasword:     root          */
let password2 = 'root';
bcrypt.hash(password2, 10, function(err, hash){
    let user2 = {
        username: "test-admin",
        password: hash,
        user_type: "admin",
        current_order: "",
    }

    database.insertOne(User, user2, (result) => {});
});