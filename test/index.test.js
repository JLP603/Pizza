const assert = require("chai").assert;
const request = require("supertest");
const { server } = require("../index.js");

const index = require("../index.js");

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

describe("routes", function() {
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

describe("login and register requests", function() {
  it("register name check - username taken", function(done) {
    request(index.server).post("/newUser")
    .send({type: "username_check", username: "test-customer"})
    .expect(200)
    .expect({ok: false}, done);
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
  })
  process.exit(1);
});

describe("current_order requests", function() {
  it("get current order - logged out", function(done) {
    request(index.server).get("/getcurrentorder")
    .expect(200)
    .expect({loggedin: false}, done);
  });
})