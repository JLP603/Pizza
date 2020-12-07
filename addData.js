const database = require('./models/db.js')
const User = require('./models/UserModel.js');
const Product = require('./models/ProductModel.js');
const Order = require('./models/OrderModel.js');
const Category = require('./models/CategoryModel.js')
const bcrypt = require('bcrypt');
database.connect();

/* ---------------------------------------- DATA ---------------------------------------- */
let customerpassword = 'root';
let adminpassword = 'root';
/* pizza descriptions from https://artisanpizzakitchen.com/what-are-the-different-kind-of-pizza-flavors/ */
let products = [
  {
    name: "Cheese Pizza",
    description: "Consisting of dough, tomato sauce and a bit of mozzarella, provolone or even Parmesan, it’s the tried-and-true rendition of the Italian pizza we’ve all come to know and love – a hot, chewy, slightly gooey classic you can get at the local pizza joint, at a fancy gourmet shop, or frozen. Extra cheese makes it that much gooier and tastier.",
    category: "Pizzas",
    price: 100.01,
  },

  {
    name: "Pepperoni Pizza",
    description: "A classic. Just throw a few (or a ton of) slices of pepperoni on top of the cheese, and you’ll soon have a greasy, slightly spicy and delicious pizza that you simply can’t go wrong with. astes good both from the local pizza joint and as a gourmet meal – and super easy to make at home. Pepperoni pizza is specifically famous in the West (America, Canada, and Mexico). Pepperoni is an American version of salami – made from cured beef and pork – and you’d probably never find it in Italy –  but that doesn’t mean it’s any less good. This meat is cut into circular pieces and placed on pizza as a form of topping.",
    category: "Pizzas",
    price: 200.02,
  },

  {
    name: "Margherita Pizza",
    description: "The Margherita is a popular variation found throughout Italy, which uses San Marzano tomatoes, mozzarella fior di latte, and topped with fresh basil leaves, salt and a drizzle of olive oil. If you’re looking for the most authentic Italian pizza style, this is it.",
    category: "Pizzas",
    price: 300.03,
  },

  {
    name: "California Style Pizza",
    description: "California style pizza (sometimes called Gourmet) is another popular one in the US but is unique in that’s not one combination of ingredients; instead, it follows a California tradition –topping the pizza with fresh, in-season ingredients sourced locally, often the day-of. Some popular toppings might be fresh hand-picked tomatoes, red peppers, lettuce and other greens, capers, and gourmet cheeses such as goat cheese. More adventurous types might like the heat of jalapenos and other hot peppers. This style of pizza was invented at Chez Pannise, a famous California eatery, and led to the rise of the famed California Pizza Kitchen.",
    category: "Pizzas",
    price: 400.04,
  },

  {
    name: "French Fries",
    description: "fries that are french",
    category: "Side Dishes",
    price: 500.05
  },

  {
    name: "Iced Tea",
    description: "tea that has been iced",
    category: "Drinks",
    price: 600.06
  }
]
let categories = [
  {name: "Pizzas"},
  {name: "Side Dishes"},
  {name: "Drinks"}
]

/* ---------------------------------------- DELETION OF DATA FUNCTIONS ---------------------------------------- */
const deleteUsers = () => {
  return new Promise((resolve, reject) => {   
    database.deleteMany(User, {}, function() {
      console.log("deleted all user data");
      resolve();
    });
 });
}
const deleteProducts = () => {
  return new Promise((resolve, reject) => {   
    database.deleteMany(Product, {}, function() {
      console.log("deleted all product data");
      resolve();
    });
 });
}
const deleteOrders = () => {
  return new Promise((resolve, reject) => {   
    database.deleteMany(Order, {}, function() {
      console.log("deleted all order data");
      resolve();
    });
 });
}
const deleteCategories = () => {
  return new Promise((resolve, reject) => {   
    database.deleteMany(Category, {}, function() {
      console.log("deleted all category data");
      resolve();
    });
 });
}

/* ---------------------------------------- ADDITION OF DATA FUNCTIONS ---------------------------------------- */
const addUserCustomer = () => {
  return new Promise((resolve, reject) => {
    bcrypt.hash(customerpassword, 10, function(err, hash) {
      let customeruser = {
        username: "test-customer",
        password: hash,
        user_type: "customer",
        current_order: "[]",
      }
      database.insertOne(User, customeruser, (result) => {
        console.log("added customer account");
        resolve();
      });
    });
  });
}
const addUserAdmin = () => {
  return new Promise((resolve, reject) => {
    bcrypt.hash(adminpassword, 10, function(err, hash) {
      let adminuser = {
        username: "test-admin",
        password: hash,
        user_type: "admin",
        current_order: "[]",
      }
      database.insertOne(User, adminuser, (result) => {
        console.log("added admin account");
        resolve();
      });
    });
  });
}
const addProducts = () => {
  return new Promise((resolve, reject) => {
    Product.insertMany(products, function(err, result) {
      console.log("added product data");
      resolve();
    });
  });
}
const addCategories = () => {
  return new Promise((resolve, reject) => {
    Category.insertMany(categories, function(err, result) {
      console.log("added category data");
      resolve();
    });
  });
}

/* ---------------------------------------- CALLING FUNCTIONS IN ORDER ---------------------------------------- */
const addData = async () => {
  console.log("\x1b[32m[RESETTING DATABASE...]\x1b[0m");
  await deleteUsers();
  await deleteProducts();
  await deleteOrders();
  await deleteCategories();
  await addUserCustomer();
  await addUserAdmin();
  await addProducts();
  await addCategories();
  console.log("\x1b[32m[RESET COMPLETE]\x1b[0m");
}

addData().then(function(result) {
  process.exit();
})
