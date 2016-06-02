'use strict';

var helper  = require('../fixtures/helper'),
    globar = require('../../lib').default;

describe('one-to-one (pass-through)', function() {
  it('should call browserify without any args', function() {
    globar();
    helper.assert('browserify', []);
  });

  it('should call browserify without any args (empty array)', function() {
    globar([]);
    helper.assert('browserify', []);
  });

  it('should call watchify without any args', function() {
    globar(['--watch']);
    helper.assert('watchify', []);
  });

  it('should call browserify --outfile=FILE', function() {
    globar(['--outfile=dist/my-file.js']);
    helper.assert('browserify', ['--outfile=dist/my-file.js']);
  });

  it('should call browserify --outfile FILE', function() {
    globar(['--outfile', 'dist/my-file.js']);
    helper.assert('browserify', ['--outfile', 'dist/my-file.js']);
  });

  it('should call browserify -o FILE', function() {
    globar(['-o', 'dist/my-file.js']);
    helper.assert('browserify', ['-o', 'dist/my-file.js']);
  });

  it('should call watchify -o FILE', function() {
    globar(['-o', 'dist/my-file.js', '-w']);
    helper.assert('watchify', ['-o', 'dist/my-file.js']);
  });

  it('should call browserify --outfile=FILESPEC', function() {
    globar(['--outfile=dist/**/*.js']);
    helper.assert('browserify', ['--outfile=dist/**/*.js']);
  });

  it('should call browserify --outfile FILESPEC', function() {
    globar(['--outfile', 'dist/**/*.js']);
    helper.assert('browserify', ['--outfile', 'dist/**/*.js']);
  });

  it('should call browserify -o FILESPEC', function() {
    globar(['-o', 'dist/**/*.js']);
    helper.assert('browserify', ['-o', 'dist/**/*.js']);
  });

  it('should call watchify -o FILESPEC', function() {
    globar(['-w', '-o', 'dist/**/*.js']);
    helper.assert('watchify', ['-o', 'dist/**/*.js']);
  });

  it('should call browserify --outfile=DIR', function() {
    globar(['--outfile=dist']);
    helper.assert('browserify', ['--outfile=dist']);
  });

  it('should call browserify --outfile DIR', function() {
    globar(['--outfile', 'dist']);
    helper.assert('browserify', ['--outfile', 'dist']);
  });

  it('should call browserify -o DIR', function() {
    globar(['-o', 'dist']);
    helper.assert('browserify', ['-o', 'dist']);
  });

  it('should call watchify -o DIR', function() {
    globar(['-o', 'dist', '--watch']);
    helper.assert('watchify', ['-o', 'dist']);
  });

  it('should call browserify INFILE --outfile=FILE', function() {
    globar(['src/index.js', '--outfile=dist/my-file.js']);
    helper.assert('browserify', ['src/index.js', '--outfile=dist/my-file.js']);
  });

  it('should call browserify INFILE --outfile=FILESPEC', function() {
    globar(['src/index.js', '--outfile=dist/*.js']);
    helper.assert('browserify', ['src/index.js', '--outfile=dist/*.js']);
  });

  it('should call browserify INFILE --outfile=DIR', function() {
    globar(['src/index.js', '--outfile=dist']);
    helper.assert('browserify', ['src/index.js', '--outfile=dist']);
  });

  it('should call watchify INFILE --outfile=DIR', function() {
    globar(['src/index.js', '-w', '--outfile=dist']);
    helper.assert('watchify', ['src/index.js', '--outfile=dist']);
  });

  it('should call browserify with lots of options', function() {
    globar([
      '-g', 'uglifyify',
      '-t', '[', 'foo-bar', '--biz', '-baz', '--watch', 'hello, world', '*.html', ']',
      'src/index.js', '-g', 'browserify-istanbul', '-u', '**/hello-*.js',
      '--outfile', 'dist/'
    ]);

    helper.assert('browserify', [
      '-g', 'uglifyify',
      '-t', '[', 'foo-bar', '--biz', '-baz', '--watch', 'hello, world', '*.html', ']',
      'src/index.js', '-g', 'browserify-istanbul', '-u', '**/hello-*.js',
      '--outfile', 'dist/'
    ]);
  });

  it('should call watchify with lots of options', function() {
    globar([
      '-g', 'uglifyify', '-w',
      '-t', '[', 'foo-bar', '--biz', '-baz', 'hello, world', '*.html', ']',
      'src/index.js', '-g', 'browserify-istanbul', '--exclude=**/hello-*.js',
      '--outfile', 'dist/'
    ]);

    helper.assert('watchify', [
      '-g', 'uglifyify',
      '-t', '[', 'foo-bar', '--biz', '-baz', 'hello, world', '*.html', ']',
      'src/index.js', '-g', 'browserify-istanbul', '--exclude=**/hello-*.js',
      '--outfile', 'dist/'
    ]);
  });
});
