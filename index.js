const express = require('express')
const path = require('path')
const exphandle = require('express-handlebars')
const handlebars = require('handlebars')

const app = express()
const port = 9000

app.engine('hbs', exphandle({
    extname: 'hbs',
    defaultView: 'main',
    layoutsDir: path.join(__dirname, '/views/layouts'), // Layouts folder
    partialsDir: path.join(__dirname, '/views/partials'), // Partials folder
}))


app.set('view engine', 'hbs')

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
        scripts: "script/LoginScript.js",
        
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

app.use(express.static('public'))

app.listen(port, function() {
    console.log('App listening at port '  + port)
  });
/* ---------------------------------- FEATURES & POST REQUESTS ---------------------------------- */
/*  
// [PAGE-03] LOGIN & REGISTER REQUESTS
app.post('/newUser', function (req, res) {
    var user = new userModel({
        username:     req.body.username,
        password:     req.body.password,

    });
    var result;
    //you can re register the same person with the same details over and over

    user.save(function(err, user) {
        if (err){
            console.log(err.errors);

            result = {success: false, message: "new user was not created"};
            res.send(result);
        }
        else{
            console.log("new user added");
            console.log(user);

            result = {success: true, message: "new user was created"};


            res.send(result);
            // tempRoute = "-" + order.ordernum


        }
    });
});

app.post('/login',function (req,res){
  userModel.findOne({username: req.body.user.username, password: req.body.user.password}, function(err, user){
    var result = {cont: user, ok: true};
    if (err)
        console.log('There is an error when searching for a user.');
    console.log("User: " + user);
    if (user == null)
        result.ok = false;
    else{
        result.ok = true;
        curr_username = user.username;
    }
      
    console.log("Result: " + result.ok);
    res.send(result);
  });
});
*/
/*test stuff for log in end*/