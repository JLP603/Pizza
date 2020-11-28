const express = require("express")
const path = require("path")
const exphandle = require("express-handlebars")
const handlebars = require("handlebars")
const bodyParser = require("body-parser")
const session = require("express-session");
const bcrypt = require("bcrypt");

const db = require("./models/db.js")
const User = require("./models/UserModel.js");
const Product = require("./models/ProductModel.js");
const Order = require("./models/OrderModel.js");
const database = require("./models/db.js")

const app = express()
const port = 9000

app.engine("hbs", exphandle({
  extname: "hbs",
  defaultView: "main",
  layoutsDir: path.join(__dirname, "/views/layouts"), // Layouts folder
  partialsDir: path.join(__dirname, "/views/partials"), // Partials folder
  runtimeOptions: {
    allowProtoPropertiesByDefault: true,
    allowProtoMethodsByDefault: true,
  },
}))

app.set("view engine", "hbs")

app.use(express.static("public"))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(session({
  secret: "palacepizza",
  resave: false,
  saveUninitialized: false	
}));

const myHelpers = {
  equalsHelper: function (arg1, arg2, options) {
    return (arg1 == arg2) ? options.fn(this) : options.inverse(this);
  },

  notEqualsHelper: function (arg1, arg2, options) {
    return (arg1 != arg2) ? options.fn(this) : options.inverse(this);
  },

  concatHelper: function(arg1, arg2) {
    return arg1.concat(arg2);
  },

  addHelper: function (a, b) {
    return parseInt(a) + b;
  },
  
  minusHelper: function (a, b) {
    return parseInt(a) - b;
  },
}

handlebars.registerHelper("equals", myHelpers.equalsHelper);
handlebars.registerHelper("notequals", myHelpers.notEqualsHelper)
handlebars.registerHelper("concat", myHelpers.concatHelper)
handlebars.registerHelper("add", myHelpers.addHelper)
handlebars.registerHelper("minus", myHelpers.minusHelper)

handlebars.registerHelper("dateFormat", require("handlebars-dateformat")),
handlebars.registerHelper("repeat", require("handlebars-helper-repeat"))

app.listen(port, function() {
  console.log("App listening at port "  + port)
});
db.connect();

/* ---------------------------------------- ALL 8 ROUTES ---------------------------------------- */

// [PAGE-01] ABOUT
app.get("/", function(req, res) {
  res.render("about", {
    title: "About Us",
    
    username: req.session.username,
    user_type: req.session.user_type,
  });
})
// [PAGE-02] CHECKOUT
app.get("/checkout", function(req, res) {
  if (req.session._id) {
    database.findOne(Order, {user_id: req.session._id, is_completed: false}, {}, function(db_order) {
      if (!db_order) {
        database.findOne(User, {_id: req.session._id}, {}, function(user) {
          var order = JSON.parse(user.current_order);
    
          var details = [];
          order.forEach(function (doc, i, array) {
            var newDetail = {
            name: doc.name,
            price: null,
            quantity: doc.quantity,
            total: null,
            };
    
            database.findOne(Product, {name: doc.name}, {}, function(product) {
              newDetail.price = product.price.toFixed(2);
              newDetail.total = (product.price * newDetail.quantity).toFixed(2);
              details.push(newDetail);
    
              if (i == array.length - 1) {
                res.render("checkout", {
                title: "Checkout",
        
                username: req.session.username,
                user_type: req.session.user_type,
                
                details: details,
                });
              }
            });
          });
        });
      } else {
        res.redirect("/order");
      }
    });
  } else {
    res.redirect("/login");
  }
})
// [PAGE-03] LOGIN & REGISTER
app.get("/login", function(req, res) {
  if (req.session._id) {
    res.redirect("/");
  } else {
    res.render("login", {
      title: "Log-In",    
    });
  }
})
// [PAGE-04] MENU
app.get("/menu", function(req, res) {
  db.findMany(Product, {}, {}, function(productArray) {        
    res.render("menu", {
      title: "Menu",

      username: req.session.username,
      user_type: req.session.user_type,

      products: productArray,
    });
  });
})
// [PAGE-05] ORDER
app.get("/order", function(req, res) {
  db.findMany(Product, {}, {}, function(productArray) {
    var productsNoDescriptionNoCategories = []
    productArray.forEach(function(doc) {
      var cur = {
        name: doc.name,
        price: doc.price
      }

      productsNoDescriptionNoCategories.push(cur);
    });
    
    if (req.session._id) {
      database.findOne(Order, {user_id: req.session._id, is_completed: false}, {}, function(db_order) {
        var hascurrent = db_order ? true: false;
        res.render("order", {
            title: "Order",
    
            username: req.session.username,
            user_type: req.session.user_type,
            
            hascurrent: hascurrent,
            products: productsNoDescriptionNoCategories,
          });        
      });
    } else {
      res.render("order", {
        title: "Order",

        username: req.session.username,
        user_type: req.session.user_type,

        products: productsNoDescriptionNoCategories,
      });
    }

    
  });
})
// [PAGE-06] USER_ORDERS
app.get("/user_orders", function(req, res) {
  if (req.session._id) {
    database.findOne(Order, {user_id: req.session._id, is_completed: false}, {}, function(db_order) {
      if (db_order) {                
        var details = db_order;
        var order = JSON.parse(details.order);
        var orderNew = [];
        order.forEach(function(doc) {
          var newEntry = {
            name: doc.name,
            price: null,
            quantity: doc.quantity,
            total: null,
          };

          database.findOne(Product, {name: doc.name}, {}, function(product) {
            newEntry.price = product.price.toFixed(2);
            newEntry.total = (product.price * newEntry.quantity).toFixed(2);
            orderNew.push(newEntry);
          });
        });
        
        res.render("user_orders", {
          title: "My Orders",

          username: req.session.username,
          user_type: req.session.user_type,

          has_order: true,
          details: details,
          order: orderNew,
        })
      } else {
        database.findOne(Order, {user_id: req.session._id, is_completed: true}, {}, function(db_order) {
          if (db_order) {
            var details = db_order;
            var order = JSON.parse(details.order);
            var orderNew = [];
            order.forEach(function(doc) {
              var newEntry = {
                name: doc.name,
                price: null,
                quantity: doc.quantity,
                total: null,
              };

              database.findOne(Product, {name: doc.name}, {}, function(product) {
                newEntry.price = product.price.toFixed(2);
                newEntry.total = (product.price * newEntry.quantity).toFixed(2);
                orderNew.push(newEntry);
              });
            });

            res.render("user_orders", {
              title: "My Orders",
    
              username: req.session.username,
              user_type: req.session.user_type,
    
              has_order: true,
              details: details,
              order: orderNew,
            })
          } else {
            res.render("user_orders", {
              title: "My Orders",
    
              username: req.session.username,
              user_type: req.session.user_type,
    
              has_order: false,
            })
          }
        });
      }
    })
  } else {
    res.redirect("/login");
  }
})
// [PAGE-07] MANAGER_ORDERS
app.get("/manager_orders", function(req, res) {
  if (req.session.user_type == "admin") {      
    Order.countDocuments({is_completed: !(req.query.pending == "true")}, function(err, count) {
      var perPage = 10;
      var page = parseInt(req.query.page) || 1;
      
      Order
      .find({is_completed: !(req.query.pending == "true")})
      .skip(perPage * page - perPage)
      .limit(perPage)
      .exec(function(err, orders) {
        var order_details = [];
        orders.forEach(function(doc) {
          database.findOne(User, {_id: doc.user_id}, {}, function(user) {
            var new_detail = {
              _id: doc._id,
              username: user.username,
              date_time: doc.date_time,
              is_completed: doc.is_completed,
            };
  
            order_details.push(new_detail);
          });
        });

        res.render("manager_orders", {
          title: "Orders",
          
          username: req.session.username,
          user_type: req.session.user_type,
          
          order_details: order_details,

          url: "manager_orders?pending=" + req.query.pending + "&",
          current: page,
          pages: Math.ceil(count / perPage),
        });
      });
    })
  } else {
    res.redirect("/404");
  }
});
// [PAGE-08] 404
app.get("/404", function(req, res) {
  res.render("404", {
    title: "404 Not Found",
    
    username: req.session.username,
    user_type: req.session.user_type,
  });
});

/* ---------------------------------------- END OF ROUTES --------------------------------------- */

/* ---------------------------------- FEATURES & POST REQUESTS ---------------------------------- */
 // [PAGE-03] LOGIN & REGISTER REQUESTS
app.post("/newUser", function (req, res) {
  if (req.body.type == "username_check") {
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
  } else if (req.body.type == "register") {
    db.findOne(User, {username: req.body.username.toLowerCase()}, {}, function(user) {
      if (user) {
        res.status(200).send({
          ok: false, 
          message: "Username already taken!"
        });
      } else {
        bcrypt.hash(req.body.password, 10, function(err, hash) {
          let newUser = {
            username: req.body.username.toLowerCase(),
            password: hash,
            user_type: "customer",
            current_order: "[]"
          };

          db.insertOne(User, newUser, (result) => {})
        });

        res.status(200).send({
          ok: true, 
          message: "Succesfully registered!"
        });
      }
    })
  }
});
app.post("/login", function(req, res) {
  if (req.body.type == "username_check") {
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
  } else if (req.body.type == "login") {
    db.findOne(User, { username: req.body.username.toLowerCase() }, {}, function (user) {
      if (user) {
        bcrypt.compare(req.body.password, user.password, function (err, equal) {
          if (equal) {
            req.session.username = user.username;
            req.session._id = user._id;
            req.session.user_type = user.user_type;
            
            var redirect_url;
            if (user.user_type == "customer") {
              redirect_url = "/";
            } else {
              redirect_url = "/manager_orders?pending=true";
            }
            res.status(200).send({
              ok: true, 
              redirect_url: redirect_url,
            });
          } else {
            res.status(200).send({
              ok: false, 
              message: "Invalid Password!"
            });
          }
        });
      } else {
        res.status(200).send(
          {ok: false, 
          message: "Username not found!"
        });
      }
    })
  }
});
app.post("/logout", function(req, res) {
  req.session.destroy();
  res.status(200).send();
});

// [PAGE-05] GET AND POST CURRENT_ORDER REQUESTS
app.get("/getcurrentorder", function(req, res) {
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
app.post("/order", function(req, res) {
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

// [PAGE-02] CHECKOUT ORDER POST
app.post("/postorder", function(req, res) {
  if (req.session._id) {
    database.findOne(Order, {user_id: req.session._id, is_completed: false}, {}, function(order) {
      if (!order) {
        database.findOne(User, {_id: req.session._id}, {}, function(user) {
          var today = new Date();
          var newOrder = {
            user_id: user._id,
            address: req.body.address,
            mobile: req.body.contact,
            order: user.current_order,
            special_instructions: req.body.special_instructions,
            date_time: today,
            is_completed: false,
          };
    
          database.insertOne(Order, newOrder, function() {
            var updatedUser = {
              username: user.username,
              password: user.password,
              user_type: user.user_type,
              current_order: "[]",
            }
            database.updateOne(User, {_id: user._id}, updatedUser);
            
            res.status(200).send({
              has_current: false,
              loggedin: true
            });
          });
        });
      } else {
        res.status(200).send({
          loggedin: true,
          has_current: true,
        });
      }
    });        
  } else {
    res.status(200).send({
      loggedin: false
    });
  }
});

// [PAGE-07] ORDER DETAILS REQUEST
app.post("/getdetails", function (req, res) {
  database.findOne(Order, {_id: req.body._id}, {}, function(db_order) {
    database.findOne(User, {_id: db_order.user_id}, {}, function(user) {
      var order = JSON.parse(db_order.order);
      var orderDetails = [];
      order.forEach(function (doc, i, array) {
        database.findOne(Product, {name: doc.name}, {}, function(product) {
          var newDetail = {
            name: product.name,
            price: product.price,
            quantity: doc.quantity,
            total: product.price * parseInt(doc.quantity),
          };

          orderDetails.push(newDetail);

          if (i == array.length - 1) {
            res.status(200).send({
              username: user.username,
              address: db_order.address,
              contact: db_order.mobile,
              special_instructions: db_order.special_instructions,
              details: orderDetails,
            });
          }
        });
      });
    });
  });
});
/* ---------------------------------- FOR 404 PAGE ---------------------------------- */
app.use((req, res, next) => {
  res.status(404).redirect("/404");
});

module.exports = myHelpers