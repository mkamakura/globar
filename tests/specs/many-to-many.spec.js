'use strict';

var helper  = require('../fixtures/helper'),
    globar = require('../../lib').default,
    path    = require('path');

describe('many-to-many', function() {
  it('should call browserify GLOB --outfile=FILESPEC', function() {
    globar(['src/**/*.js', '--outfile=dist/**/*.bundle.min.js']);
    helper.assert(
      'browserify',
      ['src/hello-world.js', '--outfile=' + path.normalize('dist/hello-world.bundle.min.js')],
      ['src/index.js', '--outfile=' + path.normalize('dist/index.bundle.min.js')],
      ['src/say/index.js', '--outfile=' + path.normalize('dist/say/index.bundle.min.js')]
    );
  });

  it('should call watchify GLOB -o FILESPEC', function() {
    globar(['src/**/*.js', '-w', '-o', 'dist/*.js']);
    helper.assert(
      'watchify',
      ['src/hello-world.js', '-o', path.normalize('dist/hello-world.js')],
      ['src/index.js', '-o', path.normalize('dist/index.js')],
      ['src/say/index.js', '-o', path.normalize('dist/say/index.js')]
    );
  });

  it('should call watchify GLOB GLOB -o FILESPEC', function() {
    globar(['src/**/index.js', 'src/**/hello-*.js', '-w', '-o', 'dist/*.js']);
    helper.assert(
      'watchify',
      ['src/index.js', '-o', path.normalize('dist/index.js')],
      ['src/say/index.js', '-o', path.normalize('dist/say/index.js')],
      ['src/hello-world.js', '-o', path.normalize('dist/hello-world.js')]
    );
  });

  it('should call browserify GLOB --outfile=DIR', function() {
    globar(['src/**/*.js', '--outfile=dist']);
    helper.assert(
      'browserify',
      ['src/hello-world.js', '--outfile=' + path.normalize('dist/hello-world.js')],
      ['src/index.js', '--outfile=' + path.normalize('dist/index.js')],
      ['src/say/index.js', '--outfile=' + path.normalize('dist/say/index.js')]
    );
  });

  it('should call browserify GLOB GLOB --outfile=DIR', function() {
    globar(['src/**/index.js', 'src/**/hello-*.js', '--outfile=dist']);
    helper.assert(
      'browserify',
      ['src/index.js', '--outfile=' + path.normalize('dist/index.js')],
      ['src/say/index.js', '--outfile=' + path.normalize('dist/say/index.js')],
      ['src/hello-world.js', '--outfile=' + path.normalize('dist/hello-world.js')]
    );
  });

  it('should call watchify GLOB -o DIR', function() {
    globar(['src/**/*.js', '-o', 'dist', '--watch']);
    helper.assert(
      'watchify',
      ['src/hello-world.js', '-o', path.normalize('dist/hello-world.js')],
      ['src/index.js', '-o', path.normalize('dist/index.js')],
      ['src/say/index.js', '-o', path.normalize('dist/say/index.js')]
    );
  });

  it('should call browserify GLOB -u GLOB -o DIR', function() {
    globar(['src/**/*.js', '-u', '**/hello-*.js', '-o', 'dist']);
    helper.assert(
      'browserify',
      ['src/index.js', '-u', '**/hello-*.js', '-o', path.normalize('dist/index.js')],
      ['src/say/index.js', '-u', '**/hello-*.js', '-o', path.normalize('dist/say/index.js')]
    );
  });

  it('should call browserify GLOB GLOB -u GLOB -o DIR', function() {
    globar(['src/*.js', 'src/**/hello-*.js', 'src/**/index.js', '-u', '**/hello-*.js', '-o', 'dist']);
    helper.assert(
      'browserify',
      ['src/index.js', '-u', '**/hello-*.js', '-o', path.normalize('dist/index.js')],
      ['src/say/index.js', '-u', '**/hello-*.js', '-o', path.normalize('dist/say/index.js')]
    );
  });

  it('should call watchify GLOB --exclude=GLOB --outfile=DIR', function() {
    globar(['src/**/*.js', '--exclude=**/hello-*.js', '-w', '--outfile=dist']);
    helper.assert(
      'watchify',
      ['src/index.js', '--exclude=**/hello-*.js', '--outfile=' + path.normalize('dist/index.js')],
      ['src/say/index.js', '--exclude=**/hello-*.js', '--outfile=' + path.normalize('dist/say/index.js')]
    );
  });

  it('should call watchify GLOB --exclude=GLOB -u GLOB -u GLOB --exclude=GLOB --outfile=DIR', function() {
    globar([
      'src/**/*.js', '-w', '--outfile=dist',
      '--exclude=**/hello-*.js', '-u', 'src/*/index.js', '-u', 'src/say/index.js', '--exclude=src/hello-world.*'
    ]);
    helper.assert(
      'watchify',
      [
        'src/index.js', '--outfile=' + path.normalize('dist/index.js'),
       '--exclude=**/hello-*.js', '-u', 'src/*/index.js', '-u', 'src/say/index.js', '--exclude=src/hello-world.*'
      ]
    );
  });

  it('should call browserify with lots of options', function() {
    globar([
      '-g', 'uglifyify',
      '-t', '[', 'foo-bar', '--biz', '-baz', '--watch', 'hello, world', '*.html', ']',
      'src/**/index.js', 'src/index.js', 'src/*.js', 'src/hello-*',
      '-g', 'browserify-istanbul', '--outfile', '*.coffee', '-u=**/hello-*.js'
    ]);

    helper.assert(
      'browserify',
      [
        '-g', 'uglifyify',
        '-t', '[', 'foo-bar', '--biz', '-baz', '--watch', 'hello, world', '*.html', ']',
        'src/index.js', '-g', 'browserify-istanbul', '--outfile', 'index.coffee', '-u=**/hello-*.js'
      ],
      [
        '-g', 'uglifyify',
        '-t', '[', 'foo-bar', '--biz', '-baz', '--watch', 'hello, world', '*.html', ']',
        'src/say/index.js', '-g', 'browserify-istanbul',
        '--outfile', path.normalize('say/index.coffee'), '-u=**/hello-*.js'
      ]
    );
  });

  it('should call watchify with lots of options', function() {
    globar([
      '-g', 'uglifyify', '-w',
      '-t', '[', 'foo-bar', '--biz', '-baz', 'hello, world', '*.html', ']',
      'src/**/*.js', '-g', 'browserify-istanbul', '--outfile', 'dist/release/*.coffee',
      '--exclude', '**/hello-*.js'
    ]);

    helper.assert(
      'watchify',
      [
        '-g', 'uglifyify',
        '-t', '[', 'foo-bar', '--biz', '-baz', 'hello, world', '*.html', ']',
        'src/index.js', '-g', 'browserify-istanbul',
        '--outfile', path.normalize('dist/release/index.coffee'),
        '--exclude', '**/hello-*.js'
      ],
      [
        '-g', 'uglifyify',
        '-t', '[', 'foo-bar', '--biz', '-baz', 'hello, world', '*.html', ']',
        'src/say/index.js', '-g', 'browserify-istanbul',
        '--outfile', path.normalize('dist/release/say/index.coffee'),
        '--exclude', '**/hello-*.js'
      ]
    );
  });
});
