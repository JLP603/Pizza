const assert = require("chai").assert;
const request = require("supertest");
const session = require("supertest-session");

const index = require("../index.js");

var testSession = null;
beforeEach(function () {
  testSession = session(index.server);
});

describe("handlebars helpers", function() {
  it("equals helper type int true", function() {
    let result = index.myHelpers.equalsHelper(1, 1, {fn: function(a) {return true}, inverse: function(a) {return false}});
    assert.equal(result, true);
  });
  it("equals helper type int false", function() {
    let result = index.myHelpers.equalsHelper(1, 2, {fn: function(a) {return true}, inverse: function(a) {return false}});
    assert.equal(result, false);
  });
  it("equals helper type string true", function() {
    let result = index.myHelpers.equalsHelper("test", "test", {fn: function(a) {return true}, inverse: function(a) {return false}});
    assert.equal(result, true);
  });
  it("equals helper type string false", function() {
    let result = index.myHelpers.equalsHelper("test", "Test", {fn: function(a) {return true}, inverse: function(a) {return false}});
    assert.equal(result, false);
  });
  it("not equals helper type int true", function() {
    let result = index.myHelpers.notEqualsHelper(1, 1, {fn: function(a) {return true}, inverse: function(a) {return false}});
    assert.equal(result, false);
  });
  it("not equals helper type int false", function() {
    let result = index.myHelpers.notEqualsHelper(1, 2, {fn: function(a) {return true}, inverse: function(a) {return false}});
    assert.equal(result, true);
  });
  it("not equals helper type string true", function() {
    let result = index.myHelpers.notEqualsHelper("test", "test", {fn: function(a) {return true}, inverse: function(a) {return false}});
    assert.equal(result, false);
  });
  it("not equals helper type string false", function() {
    let result = index.myHelpers.notEqualsHelper("test", "Test", {fn: function(a) {return true}, inverse: function(a) {return false}});
    assert.equal(result, true);
  });
  it("concat helper", function() {
    let result = index.myHelpers.concatHelper("abc", "de");
    assert.equal(result, "abcde");
  });
  it("add helper", function() {
    let result = index.myHelpers.addHelper(1, 2);
    assert.equal(result, 3);
  });
  it("minus helper", function() {
    let result = index.myHelpers.minusHelper(3, 2);
    assert.equal(result, 1);
  });
});

describe("routes - not logged in", function() {
  it("about", function(done) {
    request(index.server).get("/")
    .expect(200)
    .expect(/ABOUT US/, done);
  });

  it("checkout (user loggedout)", function(done) {
    request(index.server).get("/checkout")
    .expect(302)
    .expect("Location", /\/login/, done);
  });

  it("login (user loggedout)", function(done) {
    request(index.server).get("/login")
    .expect(200)
    .expect(/Log In/, done);
  });

  it("menu", function(done) {
    request(index.server).get("/menu")
    .expect(200)
    .expect(/Menu/, done);
  });

  it("order (user loggedout)", function(done) {
    request(index.server).get("/order")
    .expect(200)
    .expect(/You need to be signed in to save and place orders!/, done);
  });

  it("user_orders (user loggedout)", function(done) {
    request(index.server).get("/user_orders")
    .expect(302)
    .expect("Location", /\/login/, done);
  });

  it("manager_orders (user loggedout / user type customer)", function(done) {
    request(index.server).get("/manager_orders")
    .expect(302)
    .expect("Location", /\/404/, done);
  });

  it("404 page", function(done) {
    request(index.server).get("/404")
    .expect(200)
    .expect(/404 not found/, done);
  });

  it("404 page redirect", function(done) {
    request(index.server).get("/page-that-does-not-exit")
    .expect(302)
    .expect("Location", /\/404/, done);
  })
});

describe("requests - not logged in", function() {
  it("/getcurrentorder - logged out", function(done) {
    request(index.server).get("/getcurrentorder")
    .expect(200)
    .expect({loggedin: false}, done);
  });

  it("/order - logged out", function(done) {
    request(index.server).post("/order")
    .expect(200)
    .expect({message: "not logged in"}, done);
  });

  it ("/postorder - logged out", function(done) {
    request(index.server).post("/postorder")
    .expect(200)
    .expect({loggedin: false}, done);
  });

  it("/getdetails", function(done) {
    request(index.server).post("/getdetails")
    .expect(403)
    .expect({message: "forbidden"}, done);
  });

  it("/getConfirmDetails", function(done) {
    request(index.server).post("/getConfirmDetails")
    .expect(403)
    .expect({message: "forbidden"}, done);
  });

  it("/updateOrderStatus", function(done) {
    request(index.server).post("/updateOrderStatus")
    .expect(403)
    .expect({message: "forbidden"}, done);
  });
});

describe("login and register requests", function() {
  it("register name check - username taken", function(done) {
    request(index.server).post("/newUser")
    .send({type: "username_check", username: "test-customer"})
    .expect(200)
    .expect({ok: false, message: "Username already taken!"}, done);
  });

  it("register name check - username available", function(done) {
    request(index.server).post("/newUser")
    .send({type: "username_check", username: "test-customer2"})
    .expect(200)
    .expect({ok: true}, done);
  });

  it("register - username unavailable", function(done) {
    request(index.server).post("/newUser")
    .send({type: "register", username: "test-customer", password: "password"})
    .expect(200)
    .expect({ok: false, message: "Username already taken!"}, done);
  });

  it("register - username available", function(done) {
    request(index.server).post("/newUser")
    .send({type: "register", username: "test-customer2", password: "password"})
    .expect(200)
    .expect({ok: true, message: "Succesfully registered!"}, done);
  });

  it("login username check - username not found", function(done) {
    request(index.server).post("/login")
    .send({type: "username_check", username: "customer-does-not-exist"})
    .expect(200)
    .expect({ok: false}, done)
  });

  it("login username check - username found", function(done) {
    request(index.server).post("/login")
    .send({type: "username_check", username: "test-customer"})
    .expect(200)
    .expect({ok: true}, done)
  });

  it("login - ussername not found", function(done) {
    request(index.server).post("/login")
    .send({type: "login", username: "customer-does-not-exist", password: "any"})
    .expect(200)
    .expect({ok: false, message: "Username not found!"}, done)
  })

  it("login - username found, correct password", function(done) {
    request(index.server).post("/login")
    .send({type: "login", username: "test-customer", password: "root"})
    .expect(200)
    .expect({ok: true, redirect_url: "/"}, done)
  });

  it("login - username found, incorrect password", function(done) {
    request(index.server).post("/login")
    .send({type: "login", username: "test-customer", password: "incorrect-password"})
    .expect(200)
    .expect({ok: false, message: "Invalid Password!"}, done)
  });

  it("logout", function(done) {
    request(index.server).post("/logout")
    .send()
    .expect(200, done);
  });

  it("login - username found, correct password (admin account)", function(done) {
    request(index.server).post("/login")
    .send({type: "login", username: "test-admin", password: "root"})
    .expect(200)
    .expect({ok: true, redirect_url: "/manager_orders"}, done)
  });
});

describe("routes - user_type: cutomer", function() {
  var authenticatedSession;
  beforeEach(function(done) {
    testSession.post("/login")
    .send({type: "login", username: "test-customer", password: "root"})
    .expect(200)
    .expect({ok: true, redirect_url: "/"})
    .end(function(err) {
      if (err) return done(err);
      authenticatedSession = testSession;
      return done();
    });
  });

  it ("about page (customer)", function(done) {
    authenticatedSession.get("/")
    .expect(200)
    .expect(/Welcome test-customer!/, done);
  });
  /*
  it ("checkout (customer)", function(done) {
    authenticatedSession.get("/checkout")
    .expect(200)
    .expect("Location", /\/order/, done);
  });
  */
  it ("login (customer)", function(done) {
    authenticatedSession.get("/login")
    .expect(302)
    .expect("Location", /\//, done);
  });

  it ("menu (customer)", function(done) {
    authenticatedSession.get("/menu")
    .expect(200)
    .expect(/Welcome test-customer!/, done);
  });

  it ("order (customer)", function(done) {
    authenticatedSession.get("/order")
    .expect(200)
    .expect(/Welcome test-customer!/, done);
  });

  it ("user_orders (customer)", function(done) {
    authenticatedSession.get("/user_orders")
    .expect(200)
    .expect(/You currently have no ongoing order/, done);
  });

  it ("manager_orders (customer)", function(done) {
    authenticatedSession.get("/manager_orders")
    .expect(302)
    .expect("Location", /\/404/, done);
  });
});

describe("requests - user_type: customer", function() {
  var authenticatedSession;
  beforeEach(function(done) {
    testSession.post("/login")
    .send({type: "login", username: "test-customer", password: "root"})
    .expect(200)
    .expect({ok: true, redirect_url: "/"})
    .end(function(err) {
      if (err) return done(err);
      authenticatedSession = testSession;
      return done();
    });
  });

  it("/order - order 1 cheeze pizza", function(done) {    
    authenticatedSession.post("/order")
    .send({order: '[{"name":"Cheese Pizza","quantity":"1"}]'})
    .expect(200)
    .expect({}, done);
  });

  it("/getcurrentorder - order 1 cheeze pizza", function(done) {    
    authenticatedSession.get("/getcurrentorder")
    .expect(200)
    .expect({loggedin: true, order: '[{"name":"Cheese Pizza","quantity":"1"}]'}, done);
  });

  it ("/checkout (customer) - (route - couldnt do before saving an order)", function(done) {
    authenticatedSession.get("/checkout")
    .expect(200)
    .expect(/Review your order/, done);
  });

  it("/postorder - when checking out", function(done) {
    authenticatedSession.post("/postorder")
    .send({address: "sample address", contact: "012345", special_instructions: "sample SI"})
    .expect(200)
    .expect({loggedin: true}, done);
  });

  it("/getdetails - restricted", function(done) {
    authenticatedSession.post("/getdetails")
    .send({})
    .expect(403)
    .expect({message: "forbidden"}, done)
  });

  it("/getConfirmDetails - restricted", function(done) {
    authenticatedSession.post("/getConfirmDetails")
    .send({})
    .expect(403)
    .expect({message: "forbidden"}, done)
  });

  it("/updateOrderStatus - restricted", function(done) {
    authenticatedSession.post("/updateOrderStatus")
    .send({})
    .expect(403)
    .expect({message: "forbidden"}, done)
  });
});