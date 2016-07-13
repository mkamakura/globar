'use strict';
const path = require('path');
const childProcess = require('child_process');
const assert = require('power-assert');

process.chdir(path.join(__dirname, '../sample-project'));

describe('cli', function() {
  it('should return error code(non-zero) for globar then return non-zero', function(done) {
    var ps = childProcess.exec('../../bin/globar "error_code/**/*.js" -o "dist/error_code/**/*.bundle.min.js"');
    ps.on('exit', function(code) {
      assert(code !== 0);
      done();
    });
  });

  it('should return successful code for globar then return zero', function(done) {
    var ps = childProcess.exec('../../bin/globar "src/**/*.js" -o "dist/**/*.bundle.min.js"');
    ps.on('exit', function(code) {
      assert(code === 0);
      done();
    });
  });
});
