'use strict';

var childProcess = require('child_process');
var assert = require('chai').assert;

describe('cli', function() {
  it('should handle error event for child-process then throw error own', function(done) {
    childProcess.exec('../../bin/globify.js \"error_code/**/*.js\" -o \"dist/error_code/**/*.bundle.min.js\"', function (err) {
      assert.isNotNull(err);
      done();
    });
  });
});
