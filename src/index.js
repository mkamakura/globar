import execa from 'execa';
import ParsedArgs from './parsed-args';

function exitError({code, stderr}) {
  process.stderr.write(stderr);
  process.exit(code);
}

function browserify(cmd, args) {
  console.log(cmd, args.join(' '));
  execa(require.resolve(`${cmd}/bin/cmd`), args.slice())
    .then(({stdout}) => process.stdout.write(stdout))
    .catch(exitError);
}

export default (args) => {
  const parsed = new ParsedArgs(args);
  const expandGlob = parsed.args[parsed.globIndex];
  const renameOutfile = parsed.args[parsed.outfileIndex];
  const files = expandGlob && expandGlob(parsed.globOptions);

  if (!expandGlob) {
    if (renameOutfile) parsed.args[parsed.outfileIndex] = renameOutfile();
    return browserify(parsed.cmd, parsed.args);
  }

  if (!renameOutfile) {
    Array.prototype.splice.apply(parsed.args, [parsed.globIndex, 1].concat(files));
    return browserify(parsed.cmd, parsed.args);
  }

  files.forEach((file) => {
   const fileArgs = parsed.args.slice();
    fileArgs[parsed.globIndex] = file;
    fileArgs[parsed.outfileIndex] = renameOutfile(file, parsed.baseDir);
    browserify(parsed.cmd, fileArgs);
  });
};
