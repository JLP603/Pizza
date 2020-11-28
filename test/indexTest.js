const assert = require('chai').assert;
const index = require('../index.js');

describe('index', function() {
  it('equals helper type int true', function() {
    let result = index.equalsHelper(1, 1, {fn: function(a) {return true}, inverse: function(a) {return false}});
    assert.equal(result, true);
  });
  it('equals helper type int false', function() {
    let result = index.equalsHelper(1, 2, {fn: function(a) {return true}, inverse: function(a) {return false}});
    assert.equal(result, false);
  });
  it('equals helper type string true', function() {
    let result = index.equalsHelper('test', 'test', {fn: function(a) {return true}, inverse: function(a) {return false}});
    assert.equal(result, true);
  });
  it('equals helper type string false', function() {
    let result = index.equalsHelper('test', 'Test', {fn: function(a) {return true}, inverse: function(a) {return false}});
    assert.equal(result, false);
  });
  it('not equals helper type int true', function() {
    let result = index.notEqualsHelper(1, 1, {fn: function(a) {return true}, inverse: function(a) {return false}});
    assert.equal(result, false);
  });
  it('not equals helper type int false', function() {
    let result = index.notEqualsHelper(1, 2, {fn: function(a) {return true}, inverse: function(a) {return false}});
    assert.equal(result, true);
  });
  it('not equals helper type string true', function() {
    let result = index.notEqualsHelper('test', 'test', {fn: function(a) {return true}, inverse: function(a) {return false}});
    assert.equal(result, false);
  });
  it('not equals helper type string false', function() {
    let result = index.notEqualsHelper('test', 'Test', {fn: function(a) {return true}, inverse: function(a) {return false}});
    assert.equal(result, true);
  });
  it('concat helper', function() {
    let result = index.concatHelper('abc', 'de');
    assert.equal(result, 'abcde');
  });
  it('add helper', function() {
    let result = index.addHelper(1, 2);
    assert.equal(result, 3);
  });
  it('minus helper', function() {
    let result = index.minusHelper(3, 2);
    assert.equal(result, 1);
  });
});