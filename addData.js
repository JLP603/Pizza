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
/*   Username:    test    */
/*   Pasword:     root    */
let password = 'root';
bcrypt.hash(password, 10, function(err, hash){
    let user = {
        name: "test",
        password: hash,
        user_type: "customer",
        current_order: "",
    }

    database.insertOne(User, user, (result) => {});
});