const express = require('express')
const path = require('path')
const exphandle = require('express-handlebars')
const handlebars = require('handlebars')
const bodyParser = require('body-parser')
const session = require('express-session');
const bcrypt = require('bcrypt');

const db = require('./models/db.js')
const User = require('./models/UserModel.js');
const Product = require('./models/ProductModel.js');
const Order = require('./models/OrderModel.js');
const database = require('./models/db.js')

const app = express()
const port = 9000

app.engine('hbs', exphandle({
    extname: 'hbs',
    defaultView: 'main',
    layoutsDir: path.join(__dirname, '/views/layouts'), // Layouts folder
    partialsDir: path.join(__dirname, '/views/partials'), // Partials folder
    runtimeOptions: {
        allowProtoPropertiesByDefault: true,
        allowProtoMethodsByDefault: true,
    },
}))

app.set('view engine', 'hbs')

app.use(express.static('public'))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(session({
	secret: 'palacepizza',
	resave: false,
	saveUninitialized: false	
}));

handlebars.registerHelper('equals', function (arg1, arg2, options) {
    return (arg1 == arg2) ? options.fn(this) : options.inverse(this);
});
handlebars.registerHelper('notequals', function (arg1, arg2, options) {
    return (arg1 != arg2) ? options.fn(this) : options.inverse(this);
});
handlebars.registerHelper('concat', function(arg1, arg2, options) {
    return arg1.concat(arg2);
});

app.listen(port, function() {
    console.log('App listening at port '  + port)
});
db.connect();

/* ---------------------------------------- ALL 6 ROUTES ---------------------------------------- */

// [PAGE-01] ABOUT
app.get('/', function(req, res) {
    res.render('about', {
        title: "About Us",
        styles: "css/styles_about.css",
        
        username: req.session.username,
        user_type: req.session.user_type,
    });
})
// [PAGE-02] CHECKOUT
app.get('/checkout', function(req, res) {
    if (req.session._id) {
        res.render('checkout', {
            title: "Checkout",
            styles: "css/styles_checkout.css",
            scripts: "scripts/CheckoutScript.js",
            
            username: req.session.username,
            user_type: req.session.user_type,
        });
    } else {
        res.redirect('/login');
    }
})
// [PAGE-03] LOGIN & REGISTER
app.get('/login', function(req, res) {
    if (req.session._id) {
        res.redirect('/home');
    } else {
        res.render('login', {
            title: "Log-In",
            styles: "css/styles_login.css",
            scripts: "scripts/LoginScript.js",        
        });
    }
})
// [PAGE-04] MENU
app.get('/menu', function(req, res) {
    db.findMany(Product, {}, {}, function(productArray) {        
        res.render('menu', {
            title: "Menu",
            styles: "/css/styles_menu.css",
            scripts: "scripts/MenuScript.js",

            username: req.session.username,
            user_type: req.session.user_type,

            products: productArray,
        });
    });
})
// [PAGE-05] ORDER
app.get('/order', function(req, res) {
    db.findMany(Product, {}, {}, function(productArray) {
        var productsNoDescriptionNoCategories = []
        productArray.forEach(function(doc) {
            var cur = {
                name: doc.name,
                price: doc.price
            }

            productsNoDescriptionNoCategories.push(cur);
        });
        
        res.render('order', {
            title: "Order",
            styles: "/css/styles_order.css",
            scripts: "scripts/OrderScript.js",

            username: req.session.username,
            user_type: req.session.user_type,

            products: productsNoDescriptionNoCategories,
        });
    });
})
// [PAGE-06] USER_ORDERS
app.get('/user_orders', function(req, res) {
    if (req.session._id) {
        res.render('user_orders', {
            title: "My Orders",
            styles: "/css/styles_user_orders.css",
            /*
            scripts: "script/",
            */

            username: req.session.username,
            user_type: req.session.user_type,
        });
    } else {
        res.redirect('/login');
    }
})
// [PAGE-07] MANAGER_ORDERS
app.get('/manager_orders', function(req, res) {
    if (req.session.user_type == 'admin') {
        res.render('manager_orders', {
            title: "Orders",
            styles: "/css/styles_user_orders.css",
            /*
            scripts: "scripts/",
            */
            username: req.session.username,
            user_type: req.session.user_type,
        });
    } else {
        res.redirect('/404');
    }
});
// [PAGE-08] 404
app.get('/404', function(req, res) {
    res.render('404', {
        title: '404 Not Found',
        styles: "", 
        /*
        scripts: "scripts/",
        */
        username: req.session.username,
        user_type: req.session.user_type,
    });
});

/* ---------------------------------------- END OF ROUTES --------------------------------------- */

/* ---------------------------------- FEATURES & POST REQUESTS ---------------------------------- */
 
// [PAGE-03] LOGIN & REGISTER REQUESTS
app.post('/newUser', function (req, res) {
    if (req.body.type == 'username_check') {
        db.findOne(User, {username: req.body.username.toLowerCase()}, {}, function(user) {
            if (user) {
                res.status(200).send({
                    ok: false
                });
            } else {
                res.status(200).send({
                    ok: true
                });
            }
        });
    } else if (req.body.type == 'register') {
        db.findOne(User, {username: req.body.username.toLowerCase()}, {}, function(user) {
            if (user) {
                res.status(200).send({
                    ok: false, 
                    message: 'Username already taken!'
                });
            } else {
                bcrypt.hash(req.body.password, 10, function(err, hash) {
                    let newUser = {
                        username: req.body.username.toLowerCase(),
                        password: hash,
                        user_type: 'customer',
                        current_order: '[]'
                    };

                    db.insertOne(User, newUser, (result) => {})
                });

                res.status(200).send({
                    ok: true, 
                    message: 'Succesfully registered!'
                });
            }
        })
    }
});
app.post('/login', function(req, res) {
    if (req.body.type == 'username_check') {
        db.findOne(User, {username: req.body.username.toLowerCase()}, {}, function(user) {
            if (user) {
                res.status(200).send({
                    ok: true
                });
            } else {
                res.status(200).send({
                    ok: false
                });
            }
        });
    } else if (req.body.type == 'login') {
        db.findOne(User, { username: req.body.username.toLowerCase() }, {}, function (user) {
            if (user) {
                bcrypt.compare(req.body.password, user.password, function (err, equal) {
                    if (equal) {
                        req.session.username = user.username;
                        req.session._id = user._id;
                        req.session.user_type = user.user_type;
                        
                        var redirect_url;
                        if (user.user_type == 'customer') {
                            redirect_url = '/';
                        } else {
                            redirect_url = '/manager_orders';
                        }
                        res.status(200).send({
                            ok: true, 
                            redirect_url: redirect_url,
                        });
                    } else {
                        res.status(200).send({
                            ok: false, 
                            message: 'Invalid Password!'
                        });
                    }
                });
            } else {
                res.status(200).send(
                    {ok: false, 
                    message: 'Username not found!'
                });
            }
        })
    }
});
app.post('/logout', function(req, res) {
    req.session.destroy();
    res.status(200).send();
});

// [PAGE-05] GET AND POST CURRENT_ORDER REQUESTS
app.get('/getcurrentorder', function(req, res) {
    if (req.session._id) {
        db.findOne(User, {_id: req.session._id}, {}, function(user) {
            res.status(200).send({
                loggedin: true, 
                order: user.current_order
            });
        })
    } else {
        res.status(200).send({
            loggedin: false
        });
    }    
});
app.post('/order', function(req, res) {
    if (req.session._id) {
        db.findOne(User, {_id: req.session._id}, {}, function(user) {
            var updated = {
                username: user.username,
                password: user.password,
                user_type: user.user_type,
                current_order: req.body.order
            }

            db.updateOne(User, {_id: req.session._id}, updated); 
        });
    }
});

/* ---------------------------------- FOR 404 PAGE ---------------------------------- */
app.use((req, res, next) => {
    res.status(404).redirect('/404');
});