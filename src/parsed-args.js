import glob from 'glob';
import globby from 'globby';
import * as helpers from './helpers';

export default class ParsedArgs {
  constructor(args) {
    this.cmd = 'browserify';
    this.baseDir = '';
    this.globOptions = {ignore: []};
    this.globIndex = -1;
    this.outfileIndex = -1;
    this.args = [];

    args = args || [];
    while (args.length > 0) {
      this.parseOutfile(args) ||
      this.parseExclude(args) ||
      this.parseWatch(args) ||
      this.parseSubArgs(args) ||
      this.parseDashArgs(args) ||
      this.parseGlobs(args) ||
      this.passThrough(args);
    }
  }

  parseOutfile(args) {
    const arg = this.parseNameValueArg(args, '-o', '--outfile');
    if (!arg) return false;

    if (helpers.isDirectory(arg.value)) {
      this.outfileIndex = this.args.length;
      this.args.push(helpers.rename.bind(null, arg.prefix, arg.value));
    } else {
      this.args.push(`${arg.prefix}${arg.value}`);
    }
    return true;
  }

  parseExclude(args) {
    const arg = this.parseNameValueArg(args, '-u', '--exclude');
    if (!arg) return false;

    this.globOptions.ignore.push(arg.value);
    this.args.push(arg.prefix + arg.value);
    return true;
  }

  parseWatch(args) {
    const arg = args[0];

    if (arg === '-w' || arg === '--watch') {
      args.shift();
      this.cmd = 'watchify';
      return true;
    }
  }

  parseSubArgs(args) {
    let arg = args[0];

    if (arg === '[') {
      while (arg !== ']') {
        arg = args.shift();
        this.args.push(arg);
      }
      return true;
    }
  }

  parseDashArgs(args) {
    const arg = args[0];

    if (arg[0] === '-') {
      this.args.push(args.shift());
      return true;
    }
  }

  parseGlobs(args) {
    let patterns = [];

    if (this.globIndex === -1 && glob.hasMagic(args[0])) {
      while (args[0] && args[0][0] !== '-') {
        const pattern = args.shift();
        patterns.push(pattern);

        this.baseDir = this.baseDir || helpers.getBaseDir(pattern);
      }

      if (patterns.length) {
        this.globIndex = this.args.length;
        this.args.push((options) => globby.sync(patterns, options));
      }
    }

    return !!patterns.length;
  }

  passThrough(args) {
    this.args.push(args.shift());
    return true;
  }

  parseNameValueArg(args, shortName, longName) {
    const arg = args[0];
    const parsedArg = {
      prefix: '',
      value: ''
    };

    if (arg === shortName || arg === longName) {
      this.args.push(args.shift());
      parsedArg.value = args.shift();
      return parsedArg;
    }

    if (arg.indexOf(`${shortName}=`) === 0) {
      parsedArg.prefix = `${shortName}=`;
    }
    if (arg.indexOf(`${longName}=`) === 0) {
      parsedArg.prefix = `${longName}=`;
    }

    if (parsedArg.prefix) {
      const value = args.shift();
      parsedArg.value = value.substr(parsedArg.prefix.length);
      return parsedArg;
    }
  }
}
