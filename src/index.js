import {queueingExec, spawnProccess} from './spawner'
import ParsedArgs from './parsed-args';

export default (args) => {
  const parsed = new ParsedArgs(args);
  const expandGlob = parsed.args[parsed.globIndex];
  const renameOutfile = parsed.args[parsed.outfileIndex];
  const files = expandGlob && expandGlob(parsed.globOptions);

  if (!expandGlob) {
    if (renameOutfile) parsed.args[parsed.outfileIndex] = renameOutfile();
    return spawnProccess(parsed.cmd, parsed.args);
  }

  if (!renameOutfile) {
    Array.prototype.splice.apply(parsed.args, [parsed.globIndex, 1].concat(files));
    return spawnProccess(parsed.cmd, parsed.args);
  }

  const fileArgs = files.map((file) => {
   const fileArgs = parsed.args.slice();
    fileArgs[parsed.globIndex] = file;
    fileArgs[parsed.outfileIndex] = renameOutfile(file, parsed.baseDir);
    return fileArgs;
  });

  if(fileArgs.length === 0) {
    console.error('glob-pattern unmatched!');
    process.exit(1);
  }

  if(parsed.cmd === 'watchify' || parsed.maxProcs === Infinity) return fileArgs.forEach((args) => spawnProccess(parsed.cmd, args));
  queueingExec(parsed.cmd, fileArgs, parsed.maxProcs);
};
