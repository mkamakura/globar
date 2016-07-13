Globar
===

Run [browserify](https://github.com/substack/node-browserify) and [watchify](https://github.com/substack/watchify) and [browserify-incremental](https://github.com/jsdf/browserify-incremental) with globs.

A process exit code is browserify(or watchify, browserify-incremental) exit code.

[![npm version](https://badge.fury.io/js/globar.svg)](https://badge.fury.io/js/globar)

## Install
With npm do:
```
npm install -g globar browserify watchify browserify-incremental
```

## Usage
```
globar <entry files glob>  [options]

Options:

  <entry files glob>

    Glob pattern of entry files.

  --outfile=FILE, -o FILE

    Output file or directroy.

  --watch, -w

    Call watchify instead of browserify.
  
  --incremental, -inc
  
    call browserify-incremental instead of browserify.
  --max-proc, -m
  
    set maximum number processes.
```

## Contribution
1. Fork it!
1. Create your feature branch: `git checkout -b my-new-feature`
1. Commit your changes: `git commit -am 'Add some feature'`
1. Push to the branch: `git push origin my-new-feature`
1. Submit a pull request

## License
[MIT](https://github.com/mkamakura/globar/blob/master/LICENSE)
