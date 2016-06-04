import childProcess from 'child_process';
import ParsedArgs from './parsed-args';

function exitError(code) {
  process.exit(code);
}

function browserify(cmd, args) {
  console.log(cmd, args.join(' '));
  const process = childProcess.swpan(require.resolve(`${cmd}/bin/cmd`), args.slice());
  process.on('exit', (code) => code !== 0 ? exitError(code) : undefined);
}

export default (args) => {
  const parsed = new ParsedArgs(args);
  const expandGlob = parsed.args[parsed.globIndex];
  const renameOutfile = parsed.args[parsed.outfileIndex];
  const files = expandGlob && expandGlob(parsed.globOptions);

  if (!expandGlob) {
    if (renameOutfile) parsed.args[parsed.outfileIndex] = renameOutfile();
    browserify(parsed.cmd, parsed.args);
    return;
  }

  if (!renameOutfile) {
    Array.prototype.splice.apply(parsed.args, [parsed.globIndex, 1].concat(files));
    browserify(parsed.cmd, parsed.args);
    return;
  }

  files.forEach((file) => {
   const fileArgs = parsed.args.slice();
    fileArgs[parsed.globIndex] = file;
    fileArgs[parsed.outfileIndex] = renameOutfile(file, parsed.baseDir);
    browserify(parsed.cmd, fileArgs);
  });
};
