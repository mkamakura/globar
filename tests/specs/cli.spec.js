'use strict';

var childProcess = require('child_process');
var assert = require('chai').assert;

describe('cli', function() {
  it('should return error code(non-zero) for globar then return non-zero', function(done) {
    var ps = childProcess.exec('../../bin/globar \"error_code/**/*.js\" -o \"dist/error_code/**/*.bundle.min.js\"');
    ps.on('exit', function(code) {
      assert.isOk(code !== 0);
      done();
    });
  });

  it('should return successful code for globar then return zero', function(done) {
    var ps = childProcess.exec('../../bin/globar \"lib/**/*.js\" -o \"dist/**/*.bundle.min.js\"');
    ps.on('exit', function(code) {
      assert.isOk(code === 0);
      done();
    });
  });
});
