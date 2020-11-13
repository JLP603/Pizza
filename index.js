const express = require('express')
const path = require('path')
const exphandle = require('express-handlebars')
const handlebars = require('handlebars')
const bodyParser = require('body-parser')

const app = express()
const port = 9000

app.engine('hbs', exphandle({
    extname: 'hbs',
    defaultView: 'main',
    layoutsDir: path.join(__dirname, '/views/layouts'), // Layouts folder
    partialsDir: path.join(__dirname, '/views/partials'), // Partials folder
}))

app.set('view engine', 'hbs')

app.use(express.static('public'))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

app.listen(port, function() {
    console.log('App listening at port '  + port)
});

const db = require('./models/db.js')
const User = require('./models/UserModel.js');
const Product = require('./models/UserModel.js');
const Order = require('./models/UserModel.js');
const bcrypt = require('bcrypt');
const database = require('./models/db.js')
db.connect();

/* ---------------------------------------- ALL 6 ROUTES ---------------------------------------- */

// [PAGE-01] ABOUT
app.get('/', function(req, res){
    res.render('about', {
        title: "About Us",
        
        styles: "css/styles_about.css",
        /*
        scripts: "",
        */
    })
})
// [PAGE-02] CHECKOUT
app.get('/checkout', function(req, res){
    res.render('checkout', {
        title: "Checkout",
        styles: "css/styles_checkout.css",
        scripts: "scripts/CheckoutScript.js",
    })
})
// [PAGE-03] LOGIN & REGISTER
app.get('/login', function(req, res){
    res.render('login', {
        title: "Log-In",

        styles: "css/styles_login.css",
        scripts: "scripts/LoginScript.js",
        
    })
})
// [PAGE-04] MENU
app.get('/menu', function(req, res){
    res.render('menu', {
        title: "Menu",
        styles: "/css/styles_menu.css",
        scripts: "scripts/MenuScript.js",
    })
})
// [PAGE-05] ORDER
app.get('/order', function(req, res){
    res.render('order', {
        title: "Order",
        styles: "/css/styles_order.css",
        scripts: "scripts/OrderScript.js",
    })
})
// [PAGE-06] USER_ORDERS
app.get('/user_orders', function(req, res){
    res.render('user_orders', {
        title: "My Orders",
        
        styles: "/css/styles_user_orders.css",
        /*
        scripts: "script/",
        */
    })
})
/* ---------------------------------------- END OF ROUTES --------------------------------------- */

/* ---------------------------------- FEATURES & POST REQUESTS ---------------------------------- */
 
// [PAGE-03] LOGIN & REGISTER REQUESTS
app.post('/newUser', function (req, res) {
    if (req.body.type == 'username_check') {
        var username = req.body.username;
        db.findOne(User, {username: username}, {}, function(user) {
            if (user) {
                res.status(200).send({ok: false});
            } else {
                res.status(200).send({ok: true});
            }
        });
    } else if (req.body.type == 'register') {
        db.findOne(User, {username: req.body.username}, {}, function(user) {
            if (user) {
                res.status(200).send({ok: false, message: 'Username already taken!'});
            } else {
                bcrypt.hash(req.body.password, 10, function(err, hash) {
                    let newUser = {
                        username: req.body.username,
                        password: hash,
                        user_type: 'customer',
                        current_order: ''
                    };

                    database.insertOne(User, newUser, (result) => {})
                });

                res.status(200).send({ok: true, message: 'Succesfully registered!'});
            }
        })
    }
});

app.post('/login', function(req, res) {
    if (req.body.type == 'username_check') {
        db.findOne(User, {username: req.body.username}, {}, function(user) {
            if (user) {
                res.status(200).send({ok: true});
            } else {
                res.status(200).send({ok: false});
            }
        });
    } else if (req.body.type == 'login') {
        db.findOne(User, { username: req.body.username }, {}, function (user) {
            if (user) {
                bcrypt.compare(req.body.password, user.password, function (err, equal) {
                    if (equal) {
                        /*
                        req.session.name = user.name;
                        req.session._id = user._id;
                        req.session.user_type = user.user_type;
                        */

                        res.status(200).send({ok: true, redirect_url: '/'});
                    } else {
                        res.status(200).send({ok: false, message: 'Invalid Password!'});
                    }
                });
            } else {
                res.status(200).send({ok: false, message: 'Username not found!'});
            }
        })
    }
});

/*test stuff for log in end*/