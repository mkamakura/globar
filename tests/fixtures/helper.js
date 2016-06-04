'use strict';

var assert       = require('power-assert'),
    sinon        = require('sinon'),
    path         = require('path'),
    childProcess = require('child_process');

module.exports = {
  assert: assert
};

// Run all the tests from the "sample-project" directory
process.chdir(path.join(__dirname, '../', 'sample-project'));

beforeEach(function() {
  sinon.spy(console, 'log');
});

afterEach(function() {
  console.log.restore();
});

/**
 * Asserts that the given command was called with the given arguments.
 */
function assert(cmd, args) {
  args = Array.prototype.slice.call(arguments, 1);

  // Make sure each stub was called the correct number of times
  sinon.assert.callCount(console.log, args.length);

  args.forEach(function(args, index) {
    var log = console.log.getCall(index);
    assert.ok(log.args.length === 2);
    assert.ok(log.args[0] === cmd);
    assert.ok(log.args[1] === args.join(' '));
  });
}
