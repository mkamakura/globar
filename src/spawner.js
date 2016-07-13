import execa from 'execa';
import spawn from 'cross-spawn';

function* genArgsItr(list) {
  for (let args of list) {
    yield args;
  }
}

export function exitError({code, stderr}) {
  process.stderr.write(stderr);
  process.exit(code);
}

export function exitSafe({stdout}) {
  process.stdout.write(stdout);
}

export function spawnProccess(cmd, args) {
  if(cmd !== 'watchify') return simpleExec(cmd, args).then(exitSafe).catch(exitError);
  return simpleSpawn(cmd, args);
}

export function simpleExec(cmd, args) {
  console.log(cmd, args.join(' '));
  return execa(require.resolve(`${cmd}/bin/cmd`), args.slice());
}

export function simpleSpawn(cmd, args) {
  console.log(cmd, args.join(' '));
  const proc = spawn(require.resolve(`${cmd}/bin/cmd`), args.slice(), {stdio: 'inherit'});
  proc.on('exit', (code) => {
    if(code !== 0) exitError(code);
  });
}

export function queueingExec(cmd, list, max) {
  const argsItr = genArgsItr(list);
  const queue = [];

  function nextItr(result) {
    exitSafe(result);
    const args = argsItr.next().value;
    if (args) simpleExec(cmd, args).then(nextItr).catch(exitError);
  }

  for (let i = 0; i < max; i++) {
    const args = argsItr.next().value;
    if (!args) break;
    queue.push(simpleExec(cmd, args));
  }
  queue.forEach(exec => exec.then(nextItr).catch(exitError));
}
