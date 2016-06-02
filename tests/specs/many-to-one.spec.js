'use strict';

var helper  = require('../fixtures/helper'),
    globar = require('../../lib').default;

describe('many-to-one', function() {
  it('should call browserify with files matching glob pattern', function() {
    globar(['src/**/*.js']);
    helper.assert('browserify', ['src/hello-world.js', 'src/index.js', 'src/say/index.js']);
  });

  it('should call watchify with files matching glob pattern', function() {
    globar(['src/**/*.js', '-w']);
    helper.assert('watchify', ['src/hello-world.js', 'src/index.js', 'src/say/index.js']);
  });

  it('should call browserify GLOB --outfile=FILE', function() {
    globar(['src/**/*.js', '--outfile=dist/my-file.js']);
    helper.assert(
      'browserify',
      ['src/hello-world.js', 'src/index.js', 'src/say/index.js', '--outfile=dist/my-file.js']
    );
  });

  it('should call watchify GLOB -o FILE', function() {
    globar(['src/**/*.js', '-o', 'dist/my-file.js', '-w']);
    helper.assert('watchify', ['src/hello-world.js', 'src/index.js', 'src/say/index.js', '-o', 'dist/my-file.js']);
  });

  it('should call browserify GLOB -u GLOB', function() {
    globar(['src/**/*.js', '-u', '**/hello-*.js']);
    helper.assert('browserify', ['src/index.js', 'src/say/index.js', '-u', '**/hello-*.js']);
  });

  it('should call browserify GLOB --exclude=GLOB', function() {
    globar(['src/**/*.js', '--exclude=**/hello-*.js', '-w']);
    helper.assert('watchify', ['src/index.js', 'src/say/index.js', '--exclude=**/hello-*.js']);
  });

  it('should call browserify with lots of options', function() {
    globar([
      '-g', 'uglifyify',
      '-t', '[', 'foo-bar', '--biz', '-baz', '--watch', 'hello, world', '*.html', ']',
      'src/**/*.js', '-g', 'browserify-istanbul',  '-u=**/hello-*.js',
      '--outfile', 'dist/my-file.js'
    ]);

    helper.assert('browserify', [
      '-g', 'uglifyify',
      '-t', '[', 'foo-bar', '--biz', '-baz', '--watch', 'hello, world', '*.html', ']',
      'src/index.js', 'src/say/index.js', '-g', 'browserify-istanbul',
       '-u=**/hello-*.js', '--outfile', 'dist/my-file.js'
    ]);
  });

  it('should call watchify with lots of options', function() {
    globar([
      '-g', 'uglifyify', '-w',
      '-t', '[', 'foo-bar', '--biz', '-baz', 'hello, world', '*.html', ']',
      'src/**/*.js', '-g', 'browserify-istanbul', '--exclude', '**/hello-*.js',
      '--outfile', 'dist/my-file.js'
    ]);

    helper.assert('watchify', [
      '-g', 'uglifyify',
      '-t', '[', 'foo-bar', '--biz', '-baz', 'hello, world', '*.html', ']',
      'src/index.js', 'src/say/index.js', '-g', 'browserify-istanbul',
      '--exclude', '**/hello-*.js', '--outfile', 'dist/my-file.js'
    ]);
  });
});
